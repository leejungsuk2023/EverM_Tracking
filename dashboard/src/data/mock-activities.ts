export type ActivityType =
  | 'STAGE_CHANGE'
  | 'DOCUMENT_SUBMITTED'
  | 'PAYMENT_RECEIVED'
  | 'NOTE_ADDED'
  | 'SURGERY_COMPLETED'
  | 'DISCHARGE'
  | 'FOLLOWUP_SCHEDULED';

export interface Activity {
  id: string;
  patient_id: string;
  patient_name: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}

export const mockActivities: Activity[] = [
  {
    id: 'a001',
    patient_id: 'p005',
    patient_name: 'K.Mint',
    type: 'SURGERY_COMPLETED',
    message: 'K.Mint 수술(2JAW_IVRO) 성공적으로 완료. 입원실 이동.',
    timestamp: '2026-03-20T14:30:00',
  },
  {
    id: 'a002',
    patient_id: 'p001',
    patient_name: 'K.Wao',
    type: 'STAGE_CHANGE',
    message: 'K.Wao 파이프라인 단계 변경: DOCUMENT_COLLECTION → PREOP_PREP',
    timestamp: '2026-03-18T10:15:00',
  },
  {
    id: 'a003',
    patient_id: 'p006',
    patient_name: 'K.Fern',
    type: 'DOCUMENT_SUBMITTED',
    message: 'K.Fern 입국 항공권(doc_flight_in) 서류 제출 완료.',
    timestamp: '2026-03-17T16:45:00',
  },
  {
    id: 'a004',
    patient_id: 'p002',
    patient_name: 'K.Ploy',
    type: 'PAYMENT_RECEIVED',
    message: 'K.Ploy 보증금 1,500,000원 수령. 결제 상태: PARTIAL',
    timestamp: '2026-03-16T11:00:00',
  },
  {
    id: 'a005',
    patient_id: 'p001',
    patient_name: 'K.Wao',
    type: 'DOCUMENT_SUBMITTED',
    message: 'K.Wao 전체 서류 제출 완료 (여권, 항공권, 숙소, KETA).',
    timestamp: '2026-03-15T09:30:00',
  },
  {
    id: 'a006',
    patient_id: 'p003',
    patient_name: 'K.Buck',
    type: 'NOTE_ADDED',
    message: 'K.Buck 보증금 미납 상태. 수술일까지 13일 남음. 입금 독촉 메시지 발송.',
    timestamp: '2026-03-14T14:00:00',
  },
  {
    id: 'a007',
    patient_id: 'p006',
    patient_name: 'K.Fern',
    type: 'STAGE_CHANGE',
    message: 'K.Fern 파이프라인 단계 변경: BOOKING → DOCUMENT_COLLECTION',
    timestamp: '2026-03-13T13:20:00',
  },
  {
    id: 'a008',
    patient_id: 'p004',
    patient_name: 'K.Lita',
    type: 'STAGE_CHANGE',
    message: 'K.Lita 신규 환자 등록. 파이프라인 단계: CONSULTATION',
    timestamp: '2026-03-12T10:00:00',
  },
  {
    id: 'a009',
    patient_id: 'p005',
    patient_name: 'K.Mint',
    type: 'FOLLOWUP_SCHEDULED',
    message: 'K.Mint 팔로업 일정 확정: 3/27, 4/10, 4/17',
    timestamp: '2026-03-11T15:30:00',
  },
  {
    id: 'a010',
    patient_id: 'p002',
    patient_name: 'K.Ploy',
    type: 'DOCUMENT_SUBMITTED',
    message: 'K.Ploy 여권(doc_passport) 서류 제출 완료.',
    timestamp: '2026-03-10T11:45:00',
  },
];
