// Run: npx tsx scripts/seed.ts
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

async function seed() {
  console.log('Starting seed...');

  // 1. Insert interpreters
  const { data: interpreters, error: interpError } = await supabase
    .from('interpreters')
    .insert([
      { name: 'PoPoR', languages: ['Thai', 'Korean', 'English'] },
      { name: 'Sine', languages: ['Thai', 'Korean'] },
    ])
    .select();

  if (interpError) throw interpError;
  console.log('Inserted interpreters:', interpreters?.map(i => i.name));

  const popor = interpreters!.find(i => i.name === 'PoPoR')!;
  const sine = interpreters!.find(i => i.name === 'Sine')!;

  // 2. Insert patients
  const { data: patients, error: patientError } = await supabase
    .from('patients')
    .insert([
      {
        k_name: 'K.Wao',
        full_name: 'Waowalak Srisombat',
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
        deposit_amount: 3000000,
        total_surgery_cost: 8500000,
        payment_status: 'PARTIAL',
        exchange_method: 'TEAM_ARRANGED',
        arrival_date: '2026-03-21',
        discharge_date: '2026-03-26',
        interpreter_id: popor.interpreter_id,
        notes: '수술 전 최종 확인 완료. 가족 1명 동행 예정.',
      },
      {
        k_name: 'K.Ploy',
        full_name: 'Ploypailin Charoenwong',
        nationality: 'Thai',
        surgery_type: 'VLINE',
        surgery_date: '2026-04-05',
        pipeline_stage: 'DOCUMENT_COLLECTION',
        doc_passport: true,
        doc_flight_in: false,
        doc_flight_out: false,
        doc_hotel: false,
        doc_keta: false,
        deposit_paid: true,
        deposit_amount: 1500000,
        total_surgery_cost: 4200000,
        payment_status: 'PARTIAL',
        exchange_method: 'SELF',
        arrival_date: '2026-04-03',
        discharge_date: '2026-04-06',
        interpreter_id: sine.interpreter_id,
        notes: '항공권 및 숙소 서류 제출 독려 필요.',
      },
      {
        k_name: 'K.Buck',
        full_name: 'Buchakorn Thanasopon',
        nationality: 'Thai',
        surgery_type: '2JAW_SSRO',
        surgery_date: '2026-03-31',
        pipeline_stage: 'BOOKING',
        doc_passport: false,
        doc_flight_in: false,
        doc_flight_out: false,
        doc_hotel: false,
        doc_keta: false,
        deposit_paid: false,
        deposit_amount: 0,
        total_surgery_cost: 8500000,
        payment_status: 'NONE',
        exchange_method: 'CARD_PLUS_10PCT',
        arrival_date: '2026-03-29',
        discharge_date: '2026-04-03',
        interpreter_id: popor.interpreter_id,
        notes: '보증금 미납. 서류 수집 시작 전 입금 확인 필요.',
      },
      {
        k_name: 'K.Lita',
        full_name: 'Lalita Kongkiat',
        nationality: 'Thai',
        surgery_type: 'CONTOURING',
        surgery_date: '2026-05-15',
        pipeline_stage: 'CONSULTATION',
        doc_passport: false,
        doc_flight_in: false,
        doc_flight_out: false,
        doc_hotel: false,
        doc_keta: false,
        deposit_paid: false,
        deposit_amount: 0,
        total_surgery_cost: 5500000,
        payment_status: 'NONE',
        exchange_method: 'SELF',
        arrival_date: '2026-05-13',
        discharge_date: '2026-05-16',
        interpreter_id: sine.interpreter_id,
        notes: '초기 상담 단계. 수술 방법 최종 결정 대기 중.',
      },
      {
        k_name: 'K.Mint',
        full_name: 'Mintara Phuengphan',
        nationality: 'Thai',
        surgery_type: '2JAW_IVRO',
        surgery_date: '2026-03-20',
        pipeline_stage: 'HOSPITALIZATION',
        doc_passport: true,
        doc_flight_in: true,
        doc_flight_out: true,
        doc_hotel: true,
        doc_keta: true,
        deposit_paid: true,
        deposit_amount: 7800000,
        total_surgery_cost: 7800000,
        payment_status: 'FULL',
        exchange_method: 'TEAM_ARRANGED',
        arrival_date: '2026-03-18',
        discharge_date: '2026-03-23',
        interpreter_id: popor.interpreter_id,
        notes: '수술 성공적으로 완료. 현재 입원 중. 경과 양호.',
      },
      {
        k_name: 'K.Fern',
        full_name: 'Fern Apinya Rattanakorn',
        nationality: 'Thai',
        surgery_type: 'ASO',
        surgery_date: '2026-04-10',
        pipeline_stage: 'DOCUMENT_COLLECTION',
        doc_passport: true,
        doc_flight_in: true,
        doc_flight_out: false,
        doc_hotel: false,
        doc_keta: false,
        deposit_paid: true,
        deposit_amount: 2000000,
        total_surgery_cost: 6000000,
        payment_status: 'PARTIAL',
        exchange_method: 'SELF',
        arrival_date: '2026-04-08',
        discharge_date: '2026-04-11',
        interpreter_id: sine.interpreter_id,
        notes: '여권, 입국 항공권 제출 완료. 출국 항공권 및 숙소 서류 미제출.',
      },
    ])
    .select();

  if (patientError) throw patientError;
  console.log('Inserted patients:', patients?.map(p => p.k_name));

  // 3. Insert followups for each patient
  const followupRows: {
    patient_id: string;
    followup_number: number;
    scheduled_date: string;
    completed: boolean;
  }[] = [];

  for (const patient of patients!) {
    if (!patient.surgery_date) continue;
    const rules = FOLLOWUP_RULES[patient.surgery_type] ?? [];
    rules.forEach((daysOffset, index) => {
      followupRows.push({
        patient_id: patient.patient_id,
        followup_number: index + 1,
        scheduled_date: addDays(patient.surgery_date, daysOffset),
        completed: false,
      });
    });
  }

  const { error: followupError } = await supabase.from('followups').insert(followupRows);
  if (followupError) throw followupError;
  console.log('Inserted followups:', followupRows.length, 'rows');

  console.log('Seed complete!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
