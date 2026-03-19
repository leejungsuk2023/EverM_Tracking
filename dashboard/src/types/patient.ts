export type SurgeryType = '2JAW_SSRO' | '2JAW_IVRO' | 'VLINE' | 'CONTOURING' | 'ASO';
export type PipelineStage = 'BOOKING' | 'DOCUMENT_COLLECTION' | 'PREOP_PREP' | 'ARRIVAL_HEALTH_CHECK' | 'SURGERY' | 'HOSPITALIZATION' | 'DISCHARGE' | 'FOLLOWUP_1' | 'FOLLOWUP_2' | 'FOLLOWUP_3' | 'COMPLETE';
export type PaymentStatus = 'NONE' | 'PARTIAL' | 'FULL';
export type ExchangeMethod = 'SELF' | 'TEAM_ARRANGED' | 'CARD_PLUS_10PCT';

export interface Patient {
  patient_id: string;
  k_name: string;
  full_name: string;
  nationality: string;
  surgery_type: SurgeryType;
  surgery_date: string;
  pipeline_stage: PipelineStage;
  doc_passport: boolean;
  doc_flight_in: boolean;
  doc_flight_out: boolean;
  doc_hotel: boolean;
  doc_keta: boolean;
  deposit_paid: boolean;
  deposit_amount: number;
  total_surgery_cost: number;
  payment_status: PaymentStatus;
  exchange_method: ExchangeMethod;
  arrival_date: string;
  discharge_date: string;
  interpreter_id: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface Interpreter {
  interpreter_id: string;
  name: string;
  languages: string[];
}

export interface Followup {
  followup_id: string;
  patient_id: string;
  followup_number: number;
  scheduled_date: string;
  completed: boolean;
  completed_at: string | null;
  notes: string;
  precaution?: string;  // from FOLLOWUP_RULES
  created_at?: string;
}

export interface InterpreterSchedule {
  schedule_id: string;
  patient_id: string;
  interpreter_id: string;
  scheduled_date: string;
  time_slot: string | null;
  description: string;
  description_ko: string | null;
  interpreter?: Interpreter;
  patient?: Patient;
}

export interface Alert {
  alert_id: string;
  patient_id: string;
  alert_type: string;
  triggered_at: string;
  resolved: boolean;
  resolved_at: string | null;
}

export interface PipelineLog {
  log_id: string;
  patient_id: string;
  from_stage: PipelineStage | null;
  to_stage: PipelineStage;
  changed_at: string;
  note: string | null;
}

// Followup rules per surgery type (days after surgery_date)
export const FOLLOWUP_RULES: Record<SurgeryType, { days: number; label: string; labelKo: string; precaution?: string; precautionKo?: string }[]> = {
  '2JAW_SSRO': [
    { days: 1, label: 'Post-op Day 1 (Hospitalized)', labelKo: '수술 후 1일 (입원)', precaution: 'Keep airway tube in place. Do NOT remove. Watch for syncope/hyperventilation.', precautionKo: '기도 튜브 유지. 절대 제거 금지. 실신/과호흡 주의. 보호자+통역사 필수' },
    { days: 2, label: 'Post-op Day 2 (Hospitalized)', labelKo: '수술 후 2일 (입원)', precaution: 'Stabilizing but swelling may trigger urgent events.', precautionKo: '안정화 단계이나 부종으로 긴급 상황 가능' },
    { days: 3, label: 'Post-op Day 3 (Discharge)', labelKo: '수술 후 3일 (퇴원)', precaution: 'IMF (Jaw Fixation) setup + mandatory instructions. Delay discharge if IMF not set.', precautionKo: 'IMF(악간고정) 설정 + 필수 안내. IMF 미설정 시 퇴원 지연. 통역사 필수' },
    { days: 7, label: 'PT Start (Jaw Exercise)', labelKo: '턱운동 시작 (물리치료)', precaution: 'Start physical therapy. Poor compliance → prolonged recovery or revision surgery.', precautionKo: '물리치료 시작. 미이행 시 회복 지연/재수술 가능. 통역사 필수' },
    { days: 21, label: 'Wafer Removal', labelKo: '웨이퍼 제거', precaution: 'Wafer removal + CT comparison. Screws removed if orthodontic tx started.', precautionKo: '웨이퍼 제거 + CT 비교. 교정 시작 시 스크류 동시 제거. 통역사 필수' },
    { days: 28, label: 'Screw Removal', labelKo: '스크류 제거', precaution: 'Screw removal for non-orthodontic patients. CT comparison.', precautionKo: '비교정 환자 스크류 제거. CT 비교. 통역사 필수' },
  ],
  '2JAW_IVRO': [
    { days: 1, label: 'Post-op Day 1 (Hospitalized)', labelKo: '수술 후 1일 (입원)', precaution: 'Keep airway tube in place. Do NOT remove. Watch for syncope/hyperventilation.', precautionKo: '기도 튜브 유지. 절대 제거 금지. 실신/과호흡 주의. 보호자+통역사 필수' },
    { days: 2, label: 'Post-op Day 2 (Hospitalized)', labelKo: '수술 후 2일 (입원)', precaution: 'Stabilizing but swelling may trigger urgent events.', precautionKo: '안정화 단계이나 부종으로 긴급 상황 가능' },
    { days: 3, label: 'Post-op Day 3 (Discharge)', labelKo: '수술 후 3일 (퇴원)', precaution: 'IMF (Jaw Fixation) setup + mandatory instructions. Delay discharge if IMF not set.', precautionKo: 'IMF(악간고정) 설정 + 필수 안내. IMF 미설정 시 퇴원 지연. 통역사 필수' },
    { days: 14, label: 'PT Start (Jaw Exercise)', labelKo: '턱운동 시작 (물리치료)', precaution: 'Start physical therapy. Poor compliance → prolonged recovery or revision surgery.', precautionKo: '물리치료 시작. 미이행 시 회복 지연/재수술 가능. 통역사 필수' },
    { days: 35, label: 'Wafer Removal', labelKo: '웨이퍼 제거', precaution: 'Wafer removal + CT comparison. Screws removed if orthodontic tx started.', precautionKo: '웨이퍼 제거 + CT 비교. 교정 시작 시 스크류 동시 제거. 통역사 필수' },
    { days: 42, label: 'Screw Removal', labelKo: '스크류 제거', precaution: 'Screw removal for non-orthodontic patients. CT comparison.', precautionKo: '비교정 환자 스크류 제거. CT 비교. 통역사 필수' },
  ],
  'VLINE': [
    { days: 1, label: 'Post-op Day 1', labelKo: '수술 후 1일', precaution: 'Monitor swelling and drainage.', precautionKo: '부종 및 배액 모니터링' },
    { days: 7, label: '1-Week Post-op Check', labelKo: '1주 후 체크', precaution: 'Post-op check and clearance for return.', precautionKo: '수술 후 체크 및 귀국 허가' },
  ],
  'CONTOURING': [
    { days: 1, label: 'Post-op Day 1', labelKo: '수술 후 1일', precaution: 'Monitor swelling and drainage.', precautionKo: '부종 및 배액 모니터링' },
    { days: 7, label: '1-Week Post-op Check', labelKo: '1주 후 체크', precaution: 'For zygoma patients: check plate integrity at 6-month follow-up.', precautionKo: '광대축소 환자: 6개월 후 플레이트 파손 여부 확인' },
  ],
  'ASO': [
    { days: 1, label: 'Post-op Day 1', labelKo: '수술 후 1일', precaution: 'Monitor recovery.', precautionKo: '회복 모니터링' },
    { days: 7, label: '1-Week Post-op Check', labelKo: '1주 후 체크', precaution: 'Post-op check and clearance for return.', precautionKo: '수술 후 체크 및 귀국 허가' },
  ],
};

// Pipeline stage metadata
export const PIPELINE_STAGES: { key: PipelineStage; label: string; labelKo: string; timeline: string }[] = [
  { key: 'BOOKING', label: 'Booking', labelKo: '예약 확정', timeline: 'D-30~14' },
  { key: 'DOCUMENT_COLLECTION', label: 'Document Collection', labelKo: '서류 수집', timeline: 'D-14~3' },
  { key: 'PREOP_PREP', label: 'Pre-op Prep', labelKo: '수술 전 준비', timeline: 'D-7~2' },
  { key: 'ARRIVAL_HEALTH_CHECK', label: 'Arrival & Health Check', labelKo: '입국 및 건강검진', timeline: 'D-2~1' },
  { key: 'SURGERY', label: 'Surgery', labelKo: '수술', timeline: 'D-Day' },
  { key: 'HOSPITALIZATION', label: 'Hospitalization', labelKo: '입원', timeline: 'D+1~3' },
  { key: 'DISCHARGE', label: 'Discharge', labelKo: '퇴원', timeline: 'D+3' },
  { key: 'FOLLOWUP_1', label: 'Follow-up #1', labelKo: '1차 팔로업', timeline: 'D+7~10' },
  { key: 'FOLLOWUP_2', label: 'Follow-up #2', labelKo: '2차 팔로업', timeline: 'D+21' },
  { key: 'FOLLOWUP_3', label: 'Follow-up #3', labelKo: '3차 팔로업', timeline: 'D+28' },
  { key: 'COMPLETE', label: 'Complete', labelKo: '완료', timeline: 'D+30+' },
];

// Surgery type labels
export const SURGERY_TYPE_LABELS: Record<SurgeryType, string> = {
  '2JAW_SSRO': '양악(SSRO)',
  '2JAW_IVRO': '양악(IVRO)',
  'VLINE': 'V라인',
  'CONTOURING': '안면윤곽',
  'ASO': 'ASO',
};
