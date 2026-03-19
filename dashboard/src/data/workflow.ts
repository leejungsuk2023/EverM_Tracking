export interface WorkflowStep {
  timepoint: string;
  timepointKo: string;
  description: string;
  descriptionKo: string;
  interpreterRequired: boolean;
}

export interface SurgeryWorkflow {
  title: string;
  titleKo: string;
  steps: { step: number; description: string; descriptionKo: string }[];
  postopPrecautions: WorkflowStep[];
}

export const SURGERY_WORKFLOWS: Record<string, SurgeryWorkflow> = {
  '2JAW_SSRO': {
    title: 'Functional Orthognathic Surgery (SSRO)',
    titleKo: '기능적 양악수술 (SSRO)',
    steps: [
      { step: 1, description: 'Health check (2 days before) + Surgery + 1-week post-op check (PT start)', descriptionKo: '건강검진(2일전) + 수술 + 1주 후 체크(물리치료 시작)' },
      { step: 2, description: 'Return to Bangkok after 1-week check', descriptionKo: '1주 체크 후 방콕 귀국' },
      { step: 3, description: 'Return to Korea: Weeks 3-4 checks + wafer & screw removal', descriptionKo: '한국 재방문: 3-4주차 체크 + 웨이퍼/스크류 제거' },
      { step: 4, description: 'Omakase (Bangkok): Start Orthodontics', descriptionKo: 'Omakase(방콕): 교정 시작' },
    ],
    postopPrecautions: [
      { timepoint: 'Pre-op (2 days before)', timepointKo: '수술 2일 전', description: 'Wafer fabrication and informed consent must be completed.', descriptionKo: '웨이퍼 제작 및 수술 동의서 완료 필요', interpreterRequired: true },
      { timepoint: 'Post-op Day 1', timepointKo: '수술 후 1일', description: 'Keep the airway tube in place. Do not remove. High anxiety; possible syncope or hyperventilation.', descriptionKo: '기도 튜브 유지. 절대 제거 금지. 불안감 높음; 실신/과호흡 가능', interpreterRequired: true },
      { timepoint: 'Post-op Day 2', timepointKo: '수술 후 2일', description: 'Generally stabilizing, but swelling may still trigger urgent events.', descriptionKo: '안정화 단계이나 부종으로 긴급 상황 가능', interpreterRequired: false },
      { timepoint: 'Post-op Day 3 (Discharge)', timepointKo: '수술 후 3일 (퇴원)', description: 'IMF (Jaw Fixation) and mandatory instructions. If IMF not properly set, discharge may be delayed.', descriptionKo: 'IMF(악간고정) 설정 및 필수 안내. IMF 미설정 시 퇴원 지연', interpreterRequired: true },
      { timepoint: 'Post-op Week 1', timepointKo: '수술 후 1주', description: 'Start physical therapy (jaw exercises). Poor compliance may cause prolonged recovery or revision surgery.', descriptionKo: '물리치료(턱운동) 시작. 미이행 시 회복 지연/재수술 가능', interpreterRequired: true },
      { timepoint: 'Post-op Week 3', timepointKo: '수술 후 3주', description: 'Wafer removal. If orthodontic treatment initiated, screws removed simultaneously. CT comparison performed.', descriptionKo: '웨이퍼 제거. 교정 시작 시 스크류 동시 제거. CT 비교', interpreterRequired: true },
      { timepoint: 'Post-op Week 4', timepointKo: '수술 후 4주', description: 'Screw removal for non-orthodontic patients. CT comparison performed.', descriptionKo: '비교정 환자 스크류 제거. CT 비교', interpreterRequired: true },
    ],
  },
  '2JAW_IVRO': {
    title: 'Functional Orthognathic Surgery (IVRO)',
    titleKo: '기능적 양악수술 (IVRO)',
    steps: [
      { step: 1, description: 'Health check (2 days before) + Surgery + 2-week post-op check (PT start)', descriptionKo: '건강검진(2일전) + 수술 + 2주 후 체크(물리치료 시작)' },
      { step: 2, description: 'Return to Bangkok after 2-week check', descriptionKo: '2주 체크 후 방콕 귀국' },
      { step: 3, description: 'Return to Korea: Weeks 5-6 checks + wafer & screw removal', descriptionKo: '한국 재방문: 5-6주차 체크 + 웨이퍼/스크류 제거' },
      { step: 4, description: 'Omakase (Bangkok): Start Orthodontics', descriptionKo: 'Omakase(방콕): 교정 시작' },
    ],
    postopPrecautions: [
      { timepoint: 'Pre-op (2 days before)', timepointKo: '수술 2일 전', description: 'Wafer fabrication and informed consent must be completed.', descriptionKo: '웨이퍼 제작 및 수술 동의서 완료 필요', interpreterRequired: true },
      { timepoint: 'Post-op Day 1', timepointKo: '수술 후 1일', description: 'Keep the airway tube in place. Do not remove. High anxiety; possible syncope or hyperventilation.', descriptionKo: '기도 튜브 유지. 절대 제거 금지. 불안감 높음; 실신/과호흡 가능', interpreterRequired: true },
      { timepoint: 'Post-op Day 2', timepointKo: '수술 후 2일', description: 'Generally stabilizing, but swelling may still trigger urgent events.', descriptionKo: '안정화 단계이나 부종으로 긴급 상황 가능', interpreterRequired: false },
      { timepoint: 'Post-op Day 3 (Discharge)', timepointKo: '수술 후 3일 (퇴원)', description: 'IMF (Jaw Fixation) and mandatory instructions. If IMF not properly set, discharge may be delayed.', descriptionKo: 'IMF(악간고정) 설정 및 필수 안내. IMF 미설정 시 퇴원 지연', interpreterRequired: true },
      { timepoint: 'Post-op Week 2', timepointKo: '수술 후 2주', description: 'Start physical therapy (jaw exercises). Poor compliance may cause prolonged recovery or revision surgery.', descriptionKo: '물리치료(턱운동) 시작. 미이행 시 회복 지연/재수술 가능', interpreterRequired: true },
      { timepoint: 'Post-op Week 5', timepointKo: '수술 후 5주', description: 'Wafer removal. If orthodontic treatment initiated, screws removed simultaneously. CT comparison performed.', descriptionKo: '웨이퍼 제거. 교정 시작 시 스크류 동시 제거. CT 비교', interpreterRequired: true },
      { timepoint: 'Post-op Week 6', timepointKo: '수술 후 6주', description: 'Screw removal for non-orthodontic patients. CT comparison performed.', descriptionKo: '비교정 환자 스크류 제거. CT 비교', interpreterRequired: true },
    ],
  },
  'VLINE': {
    title: 'Contouring Surgery (V-Line)',
    titleKo: '윤곽수술 (V라인)',
    steps: [
      { step: 1, description: 'Health check (2 days before) + Surgery + 1-week post-op check', descriptionKo: '건강검진(2일전) + 수술 + 1주 후 체크' },
      { step: 2, description: 'Return to Bangkok after 1-week check', descriptionKo: '1주 체크 후 방콕 귀국' },
    ],
    postopPrecautions: [
      { timepoint: 'Pre-op (2 days before)', timepointKo: '수술 2일 전', description: 'Health check must be completed.', descriptionKo: '건강검진 완료 필요', interpreterRequired: true },
      { timepoint: 'Post-op Week 1', timepointKo: '수술 후 1주', description: 'Post-op check and clearance for return.', descriptionKo: '수술 후 체크 및 귀국 허가', interpreterRequired: true },
    ],
  },
  'CONTOURING': {
    title: 'Contouring Surgery',
    titleKo: '안면윤곽 수술',
    steps: [
      { step: 1, description: 'Health check (2 days before) + Surgery + 1-week post-op check', descriptionKo: '건강검진(2일전) + 수술 + 1주 후 체크' },
      { step: 2, description: 'Return to Bangkok after 1-week check', descriptionKo: '1주 체크 후 방콕 귀국' },
    ],
    postopPrecautions: [
      { timepoint: 'Pre-op (2 days before)', timepointKo: '수술 2일 전', description: 'Health check must be completed.', descriptionKo: '건강검진 완료 필요', interpreterRequired: true },
      { timepoint: 'Post-op Week 1', timepointKo: '수술 후 1주', description: 'Post-op check. For zygoma reduction patients, check at 6-month follow-up whether zygomatic plates are broken.', descriptionKo: '수술 후 체크. 광대축소 환자는 6개월 팔로업에서 플레이트 파손 여부 확인', interpreterRequired: true },
    ],
  },
  'ASO': {
    title: 'Protrusion Surgery (ASO)',
    titleKo: '돌출입 수술 (ASO)',
    steps: [
      { step: 1, description: 'Wafer fabrication (2 days before) + Surgery + 1-week post-op check', descriptionKo: '웨이퍼 제작(2일전) + 수술 + 1주 후 체크' },
      { step: 2, description: 'Return to Bangkok after 1-week check', descriptionKo: '1주 체크 후 방콕 귀국' },
      { step: 3, description: 'Omakase (Bangkok): Weeks 2-4 checks + wire removal at 1 month + start orthodontics', descriptionKo: 'Omakase(방콕): 2-4주 체크 + 1개월 와이어 제거 + 교정 시작' },
    ],
    postopPrecautions: [
      { timepoint: 'Pre-op (2 days before)', timepointKo: '수술 2일 전', description: 'Wafer fabrication and informed consent must be completed.', descriptionKo: '웨이퍼 제작 및 수술 동의서 완료 필요', interpreterRequired: true },
      { timepoint: 'Post-op Week 1', timepointKo: '수술 후 1주', description: 'Post-op check and clearance for return.', descriptionKo: '수술 후 체크 및 귀국 허가', interpreterRequired: true },
    ],
  },
};

// IVRO vs SSRO comparison data
export const IVRO_VS_SSRO = {
  headers: ['', 'IVRO', 'SSRO'],
  rows: [
    { label: { en: 'Jaw Fixation Period', ko: '턱 고정 기간' }, ivro: { en: '~2 weeks (rigid)', ko: '약 2주 (단단한 고정)' }, ssro: { en: '~1 week (flexible)', ko: '약 1주 (유연한 고정)' } },
    { label: { en: 'Nerve Damage Risk', ko: '신경 손상 위험' }, ivro: { en: 'Lower than SSRO', ko: 'SSRO보다 낮음' }, ssro: { en: 'Higher than IVRO', ko: 'IVRO보다 높음' } },
    { label: { en: 'Bone Fixation', ko: '골 고정' }, ivro: { en: 'None', ko: '없음' }, ssro: { en: 'Yes (screws)', ko: '있음 (스크류)' } },
    { label: { en: 'PT Recovery Period', ko: '물리치료 기간' }, ivro: { en: '4-5 weeks', ko: '4-5주' }, ssro: { en: '2-3 weeks', ko: '2-3주' } },
  ],
};
