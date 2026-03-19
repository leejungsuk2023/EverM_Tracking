import { supabase } from './supabase';

// ─── Constants ────────────────────────────────────────────────────────────────

const PATIENTS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/14Br_S0rVVc51dUpBpoL-urBhPM-Wl-6N-FS4sDn2P8o/export?format=csv&gid=0';

const INTERPRETER_ASSIGN_CSV_URL =
  'https://docs.google.com/spreadsheets/d/14Br_S0rVVc51dUpBpoL-urBhPM-Wl-6N-FS4sDn2P8o/export?format=csv&gid=1918718012';

// ─── CSV Helpers ──────────────────────────────────────────────────────────────

/**
 * Fetch a CSV URL (follows redirects) and return its text content.
 */
async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  return res.text();
}

/**
 * Parse CSV text into rows of string arrays.
 * Handles quoted fields that may contain commas.
 */
function parseCsv(text: string): string[][] {
  const lines = text.split('\n').filter(l => l.trim() !== '');
  return lines.map(line => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  });
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

/**
 * Parse "2026. 3. 23" → "2026-03-23". Returns null if value is "TBC" or empty.
 */
function parseSurgeryDate(raw: string): string | null {
  const v = raw.trim();
  if (!v || v.toUpperCase() === 'TBC') return null;
  // "2026. 3. 23"  or  "2026.3.23"
  const match = v.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Parse "₩28,000,000" → 28000000. Returns 0 on failure.
 */
function parseKrwAmount(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * Map surgery description string → surgery_type enum value.
 * Rules:
 *   contains "2J" (case-insensitive) → '2JAW_SSRO'
 *   "V" present but no "2J"          → 'VLINE'
 */
function mapSurgeryType(raw: string): string {
  const v = raw.toUpperCase();
  if (v.includes('2J')) return '2JAW_SSRO';
  if (v.includes('V')) return 'VLINE';
  return '2JAW_SSRO'; // fallback
}

/**
 * Map Type column → exchange_method enum value.
 *   "Direct"  → 'SELF'
 *   "GKS"     → 'TEAM_ARRANGED'
 */
function mapExchangeMethod(raw: string): string {
  const v = raw.trim();
  if (v.toLowerCase().startsWith('direct')) return 'SELF';
  return 'TEAM_ARRANGED';
}

// ─── Sync: Patients ───────────────────────────────────────────────────────────

interface PatientSyncResult {
  inserted: number;
  updated: number;
  skipped: number;
}

async function syncPatients(): Promise<PatientSyncResult> {
  const csvText = await fetchCsv(PATIENTS_CSV_URL);
  const rows = parseCsv(csvText);

  if (rows.length < 2) throw new Error('Patients CSV has no data rows');

  // Header: No.,Name,Nickname,Gender,Type,Surgery Date,Surgery,nomal price,%discount,Final price,...
  const dataRows = rows.slice(1); // skip header

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of dataRows) {
    const [
      _no,
      fullName,
      nickname,
      _gender,
      typeRaw,
      surgeryDateRaw,
      surgeryRaw,
      _normalPrice,
      _discount,
      finalPriceRaw,
      paidDepositRaw,
    ] = row;

    if (!nickname || !fullName) {
      skipped++;
      continue;
    }

    const kName = `K.${nickname.trim()}`;
    const surgeryDate = parseSurgeryDate(surgeryDateRaw ?? '');
    const totalSurgeryCost = parseKrwAmount(finalPriceRaw ?? '');
    const surgeryType = mapSurgeryType(surgeryRaw ?? '');
    const exchangeMethod = mapExchangeMethod(typeRaw ?? '');
    const depositPaid = !!(paidDepositRaw && paidDepositRaw.trim() && paidDepositRaw.trim() !== '0');

    // Check if patient already exists (match by k_name)
    const { data: existing } = await supabase
      .from('patients')
      .select('patient_id')
      .eq('k_name', kName)
      .maybeSingle();

    if (existing) {
      // UPDATE: surgery_date, cost, and deposit — preserve other operational data
      const { error } = await supabase
        .from('patients')
        .update({
          surgery_date: surgeryDate,
          total_surgery_cost: totalSurgeryCost,
          deposit_paid: depositPaid,
          payment_status: depositPaid ? 'PARTIAL' : 'NONE',
          updated_at: new Date().toISOString(),
        })
        .eq('patient_id', existing.patient_id);

      if (error) {
        console.error(`Update failed for ${kName}:`, error.message);
        skipped++;
      } else {
        updated++;
      }
    } else {
      // INSERT: new patient with defaults
      const { error } = await supabase.from('patients').insert({
        k_name: kName,
        full_name: fullName.trim(),
        surgery_type: surgeryType,
        surgery_date: surgeryDate,
        total_surgery_cost: totalSurgeryCost,
        exchange_method: exchangeMethod,
        pipeline_stage: 'BOOKING',
        doc_passport: false,
        doc_flight_in: false,
        doc_flight_out: false,
        doc_hotel: false,
        doc_keta: false,
        deposit_paid: depositPaid,
        deposit_amount: 0,
        payment_status: depositPaid ? 'PARTIAL' : 'NONE',
        notes: '',
      });

      if (error) {
        console.error(`Insert failed for ${kName}:`, error.message);
        skipped++;
      } else {
        inserted++;
      }
    }
  }

  return { inserted, updated, skipped };
}

// ─── Sync: Interpreter Assignments ───────────────────────────────────────────

interface InterpreterSyncResult {
  assigned: number;
  skipped: number;
}

async function syncInterpreterAssignments(): Promise<InterpreterSyncResult> {
  const csvText = await fetchCsv(INTERPRETER_ASSIGN_CSV_URL);
  const rows = parseCsv(csvText);

  if (rows.length < 2) throw new Error('Interpreter assignment CSV has no data rows');

  // Header: 환자이름,날짜,시간,통역사,일정 내용,일정 내용 2
  const dataRows = rows.slice(1);

  // Pre-load all patients and interpreters to minimize DB round-trips
  const { data: allPatients } = await supabase
    .from('patients')
    .select('patient_id, k_name');
  const { data: allInterpreters } = await supabase
    .from('interpreters')
    .select('interpreter_id, name');

  if (!allPatients || !allInterpreters) {
    throw new Error('Failed to load patients or interpreters from DB');
  }

  // Build lookup maps (lowercase key for fuzzy match)
  const patientMap = new Map<string, string>(); // k_name lowercase → patient_id
  for (const p of allPatients) {
    patientMap.set(p.k_name.toLowerCase(), p.patient_id);
    // also map without "k." prefix for nickname matching
    const withoutPrefix = p.k_name.toLowerCase().replace(/^k\./, '');
    patientMap.set(withoutPrefix, p.patient_id);
  }

  const interpreterMap = new Map<string, string>(); // name → interpreter_id
  for (const i of allInterpreters) {
    interpreterMap.set(i.name.trim(), i.interpreter_id);
  }

  // Find "수술 진행" rows — these determine the surgery-day interpreter
  // Key: patient nickname (lowercase) → interpreter name
  const surgeryInterpreterMap = new Map<string, string>();

  for (const row of dataRows) {
    const [patientNickname, , , interpreterName, scheduleName] = row;

    if (!patientNickname || !interpreterName || !scheduleName) continue;

    const scheduleNorm = scheduleName.trim();
    // Match rows that indicate surgery day
    if (scheduleNorm.includes('수술 진행') || scheduleNorm.includes('수술진행')) {
      const nicknameKey = patientNickname.trim().toLowerCase();
      surgeryInterpreterMap.set(nicknameKey, interpreterName.trim());
    }
  }

  let assigned = 0;
  let skipped = 0;

  for (const [nicknameKey, interpreterName] of surgeryInterpreterMap.entries()) {
    const patientId = patientMap.get(nicknameKey) ?? patientMap.get(`k.${nicknameKey}`);
    const interpreterId = interpreterMap.get(interpreterName);

    if (!patientId) {
      console.warn(`Patient not found for nickname: "${nicknameKey}"`);
      skipped++;
      continue;
    }

    if (!interpreterId) {
      console.warn(`Interpreter not found: "${interpreterName}"`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('patients')
      .update({
        interpreter_id: interpreterId,
        updated_at: new Date().toISOString(),
      })
      .eq('patient_id', patientId);

    if (error) {
      console.error(`Assign interpreter failed for ${nicknameKey}:`, error.message);
      skipped++;
    } else {
      assigned++;
    }
  }

  return { assigned, skipped };
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export interface SyncResult {
  patients: PatientSyncResult;
  interpreterAssignments: InterpreterSyncResult;
  syncedAt: string;
}

export async function syncFromSheets(): Promise<SyncResult> {
  console.log('[sync-sheets] Starting sync from Google Sheets...');

  const patients = await syncPatients();
  console.log(
    `[sync-sheets] Patients: inserted=${patients.inserted}, updated=${patients.updated}, skipped=${patients.skipped}`
  );

  const interpreterAssignments = await syncInterpreterAssignments();
  console.log(
    `[sync-sheets] Interpreter assignments: assigned=${interpreterAssignments.assigned}, skipped=${interpreterAssignments.skipped}`
  );

  return {
    patients,
    interpreterAssignments,
    syncedAt: new Date().toISOString(),
  };
}
