// Run: npx tsx scripts/import-real-data.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vgfexahkotdzdhscqkxa.supabase.co',
  'sb_publishable_ZiGI0xMvnNUmXaDN7rW3Hg_sxaRkB6i'
);

const FOLLOWUP_RULES: Record<string, number[]> = {
  '2JAW_SSRO': [7, 21, 28],
  '2JAW_IVRO': [10, 21, 28],
  'VLINE': [7, 14],
  'CONTOURING': [7, 14],
  'ASO': [7, 21, 28],
};

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

async function importRealData() {
  console.log('=== Starting real data import ===\n');

  // -------------------------
  // 1. Delete existing data (FK order: followups → patients → interpreters)
  // -------------------------
  console.log('Step 1: Deleting existing data...');

  const { error: delFollowupErr } = await supabase
    .from('followups')
    .delete()
    .neq('followup_id', '00000000-0000-0000-0000-000000000000'); // delete all rows
  if (delFollowupErr) throw new Error(`Delete followups failed: ${delFollowupErr.message}`);
  console.log('  ✓ Deleted all followups');

  const { error: delPatientErr } = await supabase
    .from('patients')
    .delete()
    .neq('patient_id', '00000000-0000-0000-0000-000000000000');
  if (delPatientErr) throw new Error(`Delete patients failed: ${delPatientErr.message}`);
  console.log('  ✓ Deleted all patients');

  const { error: delInterpErr } = await supabase
    .from('interpreters')
    .delete()
    .neq('interpreter_id', '00000000-0000-0000-0000-000000000000');
  if (delInterpErr) throw new Error(`Delete interpreters failed: ${delInterpErr.message}`);
  console.log('  ✓ Deleted all interpreters\n');

  // -------------------------
  // 2. Insert interpreters
  // -------------------------
  console.log('Step 2: Inserting interpreters...');

  const { data: interpreters, error: interpErr } = await supabase
    .from('interpreters')
    .insert([
      { name: 'PoPoR', languages: ['Thai', 'Korean', 'English'] },
      { name: 'Sine', languages: ['Thai', 'Korean'] },
    ])
    .select();

  if (interpErr) throw new Error(`Insert interpreters failed: ${interpErr.message}`);
  console.log('  ✓ Inserted interpreters:', interpreters?.map(i => i.name).join(', '), '\n');

  const popor = interpreters!.find(i => i.name === 'PoPoR')!;
  const sine = interpreters!.find(i => i.name === 'Sine')!;

  // -------------------------
  // 3. Insert 11 real patients
  // -------------------------
  console.log('Step 3: Inserting 11 patients...');

  const patientsData = [
    // 1. Wao — D-4 → PREOP_PREP, surgery 2026-03-23
    // 2J+V+zy → 2JAW_SSRO, Direct → SELF
    // All docs complete (surgery imminent)
    {
      k_name: 'K.Wao',
      full_name: 'Walanchalee Inkham',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2026-03-23',
      pipeline_stage: 'PREOP_PREP',
      doc_passport: true,
      doc_flight_in: true,
      doc_flight_out: true,
      doc_hotel: true,
      doc_keta: true,
      deposit_paid: true,
      deposit_amount: 10800,
      total_surgery_cost: 40000000,
      payment_status: 'PARTIAL',
      exchange_method: 'SELF',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: popor.interpreter_id,
      notes: 'Direct | 수술: 2J+V+zy | 할인율: 30% | 정가: ₩40,000,000 → 할인가: ₩28,000,000',
    },
    // 2. Buck — D-12 → DOCUMENT_COLLECTION, surgery 2026-03-31
    // 2J+V → 2JAW_SSRO, Direct → SELF
    // Passport only complete
    {
      k_name: 'K.Buck',
      full_name: 'kristhapat pichainarong',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2026-03-31',
      pipeline_stage: 'DOCUMENT_COLLECTION',
      doc_passport: true,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 32000000,
      payment_status: 'PARTIAL',
      exchange_method: 'SELF',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: popor.interpreter_id,
      notes: 'Direct | 수술: 2J+V | 할인율: 30% | 정가: ₩32,000,000 → 할인가: ₩22,400,000',
    },
    // 3. Gift — D-21 → BOOKING, surgery 2026-04-09
    // 2J+V → 2JAW_SSRO, Direct → SELF
    {
      k_name: 'K.Gift',
      full_name: 'วรินทร ดีประเสริฐวงศ์',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2026-04-09',
      pipeline_stage: 'BOOKING',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 32000000,
      payment_status: 'PARTIAL',
      exchange_method: 'SELF',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: popor.interpreter_id,
      notes: 'Direct | 수술: 2J+V | 할인율: 30% | 정가: ₩32,000,000 → 할인가: ₩22,400,000',
    },
    // 4. Lita — D-55 → CONSULTATION, surgery 2026-05-13
    // 2J+V+ZY → 2JAW_SSRO, GKS-K.Biw → TEAM_ARRANGED
    {
      k_name: 'K.Lita',
      full_name: 'Phatchalita Phanjirawich',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2026-05-13',
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 40000000,
      payment_status: 'PARTIAL',
      exchange_method: 'TEAM_ARRANGED',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: sine.interpreter_id,
      notes: 'GKS - K.Biw (에이전시) | 수술: 2J+V+ZY | 할인율: 30% | 정가: ₩40,000,000 → 할인가: ₩28,000,000',
    },
    // 5. Rung — D-63 → CONSULTATION, surgery 2026-05-21
    // V+Zy (2J 없음) → VLINE, Direct → SELF
    {
      k_name: 'K.Rung',
      full_name: 'รุ่งตะวัน คุนย่า',
      nationality: 'Thai',
      surgery_type: 'VLINE',
      surgery_date: '2026-05-21',
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 24000000,
      payment_status: 'PARTIAL',
      exchange_method: 'SELF',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: sine.interpreter_id,
      notes: 'Direct | 수술: V+Zy | 할인율: 30% | 정가: ₩24,000,000 → 할인가: ₩16,800,000',
    },
    // 6. Tangmay — D-70 → CONSULTATION, surgery 2026-05-28
    // 2J(re)+V+ZY → 2JAW_SSRO, GKS-K.Biw → TEAM_ARRANGED
    {
      k_name: 'K.Tangmay',
      full_name: 'ชิตชนัญ ราชนาวี',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2026-05-28',
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 50000000,
      payment_status: 'PARTIAL',
      exchange_method: 'TEAM_ARRANGED',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: sine.interpreter_id,
      notes: 'GKS - K.Biw (에이전시) | 수술: 2J(re)+V+ZY | 할인율: 30% | 정가: ₩50,000,000 → 할인가: ₩38,000,000',
    },
    // 7. Best — D-74 → CONSULTATION, surgery 2026-06-01
    // 2J+V → 2JAW_SSRO, Direct → SELF
    {
      k_name: 'K.Best',
      full_name: 'วัณพรรณ เพียงล้ำพงค์',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2026-06-01',
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 32000000,
      payment_status: 'PARTIAL',
      exchange_method: 'SELF',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: null,
      notes: 'Direct | 수술: 2J+V | 할인율: 30% | 정가: ₩32,000,000 → 할인가: ₩22,400,000',
    },
    // 8. Boss — 2027-04-06 → CONSULTATION
    // 2J+V → 2JAW_SSRO, Direct → SELF
    {
      k_name: 'K.Boss',
      full_name: 'นันทภพ ปิติจรรยาวงศ์',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2027-04-06',
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 32000000,
      payment_status: 'PARTIAL',
      exchange_method: 'SELF',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: null,
      notes: 'Direct | 수술: 2J+V | 할인율: 30% | 정가: ₩32,000,000 → 할인가: ₩22,400,000',
    },
    // 9. Khaopun — 2027-04-07 → CONSULTATION
    // 2J+V+ZY → 2JAW_SSRO, Direct → SELF
    // 할인율 15% (다른 환자와 다름)
    {
      k_name: 'K.Khaopun',
      full_name: 'ชญานี ปัญจคุณาภรณ์',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2027-04-07',
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 40000000,
      payment_status: 'PARTIAL',
      exchange_method: 'SELF',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: null,
      notes: 'Direct | 수술: 2J+V+ZY | 할인율: 15% | 정가: ₩40,000,000 → 할인가: ₩34,000,000',
    },
    // 10. Tack — 2027-05-31 → CONSULTATION
    // 2J+V(re) → 2JAW_SSRO, GKS-K.Biw → TEAM_ARRANGED
    // 할인율 22.5%
    {
      k_name: 'K.Tack',
      full_name: 'Dalouny phommaxay',
      nationality: 'Lao',
      surgery_type: '2JAW_SSRO',
      surgery_date: '2027-05-31',
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 11000,
      total_surgery_cost: 40000000,
      payment_status: 'PARTIAL',
      exchange_method: 'TEAM_ARRANGED',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: null,
      notes: 'GKS - K.Biw (에이전시) | 수술: 2J+V(re) | 할인율: 22.5% | 정가: ₩40,000,000 → 할인가: ₩31,000,000',
    },
    // 11. nana — TBC → CONSULTATION (no surgery_date)
    // 2J+V → 2JAW_SSRO, GKS-K.Biw → TEAM_ARRANGED
    {
      k_name: 'K.nana',
      full_name: 'Nu-on sander',
      nationality: 'Thai',
      surgery_type: '2JAW_SSRO',
      surgery_date: null,
      pipeline_stage: 'CONSULTATION',
      doc_passport: false,
      doc_flight_in: false,
      doc_flight_out: false,
      doc_hotel: false,
      doc_keta: false,
      deposit_paid: true,
      deposit_amount: 10800,
      total_surgery_cost: 32000000,
      payment_status: 'PARTIAL',
      exchange_method: 'TEAM_ARRANGED',
      arrival_date: null,
      discharge_date: null,
      interpreter_id: null,
      notes: 'GKS - K.Biw (에이전시) | 수술: 2J+V | 할인율: 30% | 정가: ₩32,000,000 → 할인가: ₩22,400,000 | 수술일 미정(TBC)',
    },
  ];

  const { data: patients, error: patientErr } = await supabase
    .from('patients')
    .insert(patientsData)
    .select();

  if (patientErr) throw new Error(`Insert patients failed: ${patientErr.message}`);
  console.log('  ✓ Inserted patients:', patients?.map(p => p.k_name).join(', '), '\n');

  // -------------------------
  // 4. Generate followups for patients with surgery_date
  // -------------------------
  console.log('Step 4: Generating followups...');

  const followupRows: {
    patient_id: string;
    followup_number: number;
    scheduled_date: string;
    completed: boolean;
    notes: string;
  }[] = [];

  for (const patient of patients!) {
    if (!patient.surgery_date) {
      console.log(`  - ${patient.k_name}: skipped (no surgery date)`);
      continue;
    }
    const rules = FOLLOWUP_RULES[patient.surgery_type] ?? [];
    rules.forEach((daysOffset: number, index: number) => {
      followupRows.push({
        patient_id: patient.patient_id,
        followup_number: index + 1,
        scheduled_date: addDays(patient.surgery_date, daysOffset),
        completed: false,
        notes: '',
      });
    });
    console.log(
      `  - ${patient.k_name} (${patient.surgery_type}): ${rules.length} followups` +
      ` [${rules.map((d: number) => `D+${d}`).join(', ')}]`
    );
  }

  if (followupRows.length > 0) {
    const { error: followupErr } = await supabase.from('followups').insert(followupRows);
    if (followupErr) throw new Error(`Insert followups failed: ${followupErr.message}`);
  }

  console.log(`\n  ✓ Inserted ${followupRows.length} followup rows total`);

  // -------------------------
  // Summary
  // -------------------------
  console.log('\n=== Import Complete ===');
  console.log(`  Interpreters : 2`);
  console.log(`  Patients     : ${patients!.length}`);
  console.log(`  Followups    : ${followupRows.length}`);
  console.log('\nPatient details:');
  console.log('─'.repeat(80));

  for (const p of patients!) {
    const followupsForPatient = followupRows.filter(f => f.patient_id === p.patient_id);
    console.log(
      `  ${p.k_name.padEnd(12)} | ${p.pipeline_stage.padEnd(22)} | ${(p.surgery_date ?? 'TBC').padEnd(12)} | ${p.surgery_type.padEnd(12)} | followups: ${followupsForPatient.length}`
    );
  }
  console.log('─'.repeat(80));
}

importRealData().catch(err => {
  console.error('\nImport failed:', err.message ?? err);
  process.exit(1);
});
