export const translations: Record<string, Record<string, string>> = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', ko: '대시보드' },
  'nav.pipeline': { en: 'Patient Pipeline', ko: '환자 파이프라인' },
  'nav.patients': { en: 'Patient List', ko: '환자 목록' },
  'nav.followups': { en: 'Follow-up Management', ko: '팔로업 관리' },
  'nav.calendar': { en: 'Surgery Calendar', ko: '수술 캘린더' },

  // Header
  'header.notifications': { en: 'Notifications', ko: '알림' },
  'header.coordinator': { en: 'Coordinator', ko: '코디네이터' },

  // Pipeline stages
  'stage.CONSULTATION': { en: 'Consultation', ko: '상담' },
  'stage.BOOKING': { en: 'Booking', ko: '예약 확정' },
  'stage.DOCUMENT_COLLECTION': { en: 'Document Collection', ko: '서류 수집' },
  'stage.PREOP_PREP': { en: 'Pre-op Prep', ko: '수술 전 준비' },
  'stage.ARRIVAL_HEALTH_CHECK': { en: 'Arrival & Health Check', ko: '입국 및 건강검진' },
  'stage.SURGERY': { en: 'Surgery', ko: '수술' },
  'stage.HOSPITALIZATION': { en: 'Hospitalization', ko: '입원' },
  'stage.DISCHARGE': { en: 'Discharge', ko: '퇴원' },
  'stage.FOLLOWUP_1': { en: 'Follow-up #1', ko: '1차 팔로업' },
  'stage.FOLLOWUP_2': { en: 'Follow-up #2', ko: '2차 팔로업' },
  'stage.FOLLOWUP_3': { en: 'Follow-up #3', ko: '3차 팔로업' },
  'stage.COMPLETE': { en: 'Complete', ko: '완료' },

  // Surgery types
  'surgery.2JAW_SSRO': { en: '2-Jaw (SSRO)', ko: '양악(SSRO)' },
  'surgery.2JAW_IVRO': { en: '2-Jaw (IVRO)', ko: '양악(IVRO)' },
  'surgery.VLINE': { en: 'V-Line', ko: 'V라인' },
  'surgery.CONTOURING': { en: 'Contouring', ko: '안면윤곽' },
  'surgery.ASO': { en: 'ASO', ko: 'ASO' },

  // Documents
  'doc.passport': { en: 'Passport', ko: '여권' },
  'doc.flight_in': { en: 'Flight (In)', ko: '항공권(입)' },
  'doc.flight_out': { en: 'Flight (Out)', ko: '항공권(출)' },
  'doc.hotel': { en: 'Hotel', ko: '숙소' },
  'doc.keta': { en: 'K-ETA', ko: 'K-ETA' },

  // Payment
  'payment.none': { en: 'Unpaid', ko: '미납' },
  'payment.partial': { en: 'Partial', ko: '일부납부' },
  'payment.full': { en: 'Paid in Full', ko: '전액납부' },
  'payment.deposit': { en: 'Deposit', ko: '보증금' },
  'payment.balance': { en: 'Balance', ko: '잔금' },
  'payment.total': { en: 'Total Cost', ko: '총 수술 비용' },
  'payment.status': { en: 'Payment Status', ko: '결제 상태' },
  'payment.exchange': { en: 'Exchange Method', ko: '환전 방식' },
  'exchange.SELF': { en: 'Self', ko: '자체환전' },
  'exchange.TEAM_ARRANGED': { en: 'Team Arranged', ko: '팀환전' },
  'exchange.CARD_PLUS_10PCT': { en: 'Card +10%', ko: '카드+10%' },

  // Patient card alerts
  'alert.doc_delay': { en: 'Doc Delay', ko: '서류 지연' },
  'alert.deposit_unpaid': { en: 'Deposit Unpaid', ko: '보증금 미납' },
  'alert.no_interpreter': { en: 'No Interpreter', ko: '통역사 미배정' },

  // Patient info
  'patient.name': { en: 'Patient Name', ko: '환자명' },
  'patient.full_name': { en: 'Full Name', ko: '성명' },
  'patient.nationality': { en: 'Nationality', ko: '국적' },
  'patient.surgery_type': { en: 'Surgery Type', ko: '수술 유형' },
  'patient.surgery_date': { en: 'Surgery Date', ko: '수술일' },
  'patient.current_stage': { en: 'Current Stage', ko: '현재 단계' },
  'patient.notes': { en: 'Notes', ko: '메모' },
  'patient.save': { en: 'Save', ko: '저장' },
  'patient.saving': { en: 'Saving...', ko: '저장 중...' },
  'patient.timeline': { en: 'Pipeline Timeline', ko: '파이프라인 타임라인' },
  'patient.documents': { en: 'Document Checklist', ko: '서류 체크리스트' },
  'patient.payment_history': { en: 'Payment History', ko: '결제 이력' },
  'patient.followup_schedule': { en: 'Follow-up Schedule', ko: '팔로업 일정' },
  'patient.back_to_list': { en: '← Back to List', ko: '← 목록으로' },

  // Pipeline page
  'pipeline.title': { en: 'Patient Pipeline', ko: '환자 파이프라인' },
  'pipeline.search': { en: 'Search patient name...', ko: '환자명 검색...' },
  'pipeline.filter_all': { en: 'All', ko: '전체' },
  'pipeline.filter_incomplete_docs': { en: 'Incomplete Docs', ko: '서류 미완료' },
  'pipeline.filter_followup': { en: 'Follow-up Pending', ko: '팔로업 대기' },
  'pipeline.empty': { en: 'No patients', ko: '환자 없음' },
  'pipeline.patients': { en: 'patients', ko: '명' },

  // Patient list page
  'patients.title': { en: 'Patient List', ko: '환자 목록' },
  'patients.search': { en: 'Search by name...', ko: '이름으로 검색...' },
  'patients.table.name': { en: 'Name', ko: '환자명' },
  'patients.table.surgery': { en: 'Surgery', ko: '수술' },
  'patients.table.date': { en: 'Date', ko: '수술일' },
  'patients.table.stage': { en: 'Stage', ko: '단계' },
  'patients.table.docs': { en: 'Docs', ko: '서류' },
  'patients.table.payment': { en: 'Payment', ko: '결제' },

  // Calendar
  'calendar.title': { en: 'Surgery Calendar', ko: '수술 캘린더' },
  'calendar.weekdays': { en: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat', ko: '일,월,화,수,목,금,토' },
  'calendar.surgery': { en: 'Surgery', ko: '수술' },
  'calendar.followup': { en: 'Follow-up', ko: '팔로업' },
  'calendar.interpreter': { en: 'Interpreter', ko: '통역사' },
  'calendar.conflict': { en: 'Schedule conflict!', ko: '일정 충돌!' },
  'calendar.no_events': { en: 'No events', ko: '일정 없음' },
  'calendar.tab_calendar': { en: 'Calendar', ko: '캘린더' },
  'calendar.tab_workflow': { en: 'Workflow Guide', ko: '워크플로우 가이드' },

  // Followup page
  'followup.title': { en: 'Follow-up Management', ko: '팔로업 관리' },
  'followup.today': { en: "Today's Follow-ups", ko: '오늘 팔로업' },
  'followup.this_week': { en: 'This Week', ko: '이번 주' },
  'followup.overdue': { en: 'Overdue', ko: '지연' },
  'followup.completed': { en: 'Completed', ko: '완료' },
  'followup.all': { en: 'All', ko: '전체' },
  'followup.patient': { en: 'Patient', ko: '환자' },
  'followup.surgery_type': { en: 'Surgery Type', ko: '수술 유형' },
  'followup.fu_number': { en: 'F/U #', ko: 'F/U #' },
  'followup.scheduled': { en: 'Scheduled', ko: '예정일' },
  'followup.status': { en: 'Status', ko: '상태' },
  'followup.memo': { en: 'Memo', ko: '메모' },
  'followup.overdue_badge': { en: 'Overdue', ko: '지연' },

  // Dashboard (main page)
  'dashboard.title': { en: 'Dashboard', ko: '대시보드' },
  'dashboard.active_patients': { en: 'Active Patients', ko: '활성 환자' },
  'dashboard.surgeries_this_month': { en: 'Surgeries This Month', ko: '이번 달 수술' },
  'dashboard.incomplete_docs': { en: 'Incomplete Docs', ko: '서류 미완료' },
  'dashboard.today_followups': { en: "Today's Follow-ups", ko: '오늘 팔로업' },
  'dashboard.upcoming_surgeries': { en: 'Upcoming Surgeries', ko: '다가오는 수술' },
  'dashboard.pipeline_summary': { en: 'Pipeline Summary', ko: '파이프라인 요약' },
  'dashboard.recent_activity': { en: 'Recent Activity', ko: '최근 활동' },

  // Common
  'common.loading': { en: 'Loading...', ko: '로딩 중...' },
  'common.error': { en: 'Failed to load data', ko: '데이터 로드 실패' },
  'common.no_data': { en: 'No data', ko: '데이터 없음' },

  // Calendar (additional)
  'calendar.subtitle': { en: 'View monthly surgery and follow-up schedule.', ko: '월별 수술 및 팔로업 일정을 확인하세요.' },
  'calendar.view_month': { en: 'Month', ko: '월간' },
  'calendar.view_week': { en: 'Week', ko: '주간' },
  'calendar.selected_date': { en: 'Selected Date', ko: '선택한 날짜' },

  // Followup (additional)
  'followup.subtitle': { en: 'All patient follow-up status', ko: '전체 환자 팔로업 현황' },
  'followup.empty': { en: 'No follow-ups found.', ko: '해당 팔로업이 없습니다.' },
  'followup.memo_placeholder': { en: 'Add memo...', ko: '메모 입력...' },

  // Currency
  'currency.man_won': { en: '만원', ko: '만원' },

  // Workflow guide
  'workflow.title': { en: 'Workflow Guide', ko: '워크플로우 가이드' },
  'workflow.current_practice': { en: 'Current Practice', ko: '현재 워크플로우' },
  'workflow.postop_precautions': { en: 'Post-op Precautions', ko: '수술 후 주의사항' },
  'workflow.interpreter_required': { en: 'Interpreter Required', ko: '통역사 필요' },
  'workflow.not_required': { en: 'Not Required', ko: '불필요' },
  'workflow.select_surgery': { en: 'Select Surgery Type', ko: '수술 유형 선택' },
  'workflow.ivro_vs_ssro': { en: 'IVRO vs SSRO Comparison', ko: 'IVRO vs SSRO 비교' },
  'workflow.timepoint': { en: 'Timepoint', ko: '시점' },
  'workflow.key_points': { en: 'Key Points', ko: '주요 사항' },

  // Dashboard (additional)
  'dashboard.pipeline_in_progress': { en: 'In pipeline', ko: '파이프라인 진행 중' },
  'dashboard.doc_check_needed': { en: 'Doc check needed', ko: '서류 확인 필요 환자' },
  'dashboard.incomplete_basis': { en: 'Incomplete only', ko: '미완료 기준' },
  'dashboard.no_upcoming_surgeries': { en: 'No upcoming surgeries.', ko: '예정된 수술이 없습니다.' },
  'dashboard.docs': { en: 'Docs', ko: '서류' },
};
