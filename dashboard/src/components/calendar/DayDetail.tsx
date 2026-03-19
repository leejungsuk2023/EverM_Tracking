'use client';

import { X, AlertTriangle, User, CreditCard } from 'lucide-react';
import { Patient, Followup, Interpreter, SurgeryType } from '@/types/patient';

const SURGERY_TYPE_COLORS: Record<SurgeryType, string> = {
  '2JAW_SSRO': 'bg-blue-100 text-blue-800',
  '2JAW_IVRO': 'bg-purple-100 text-purple-800',
  'VLINE': 'bg-pink-100 text-pink-800',
  'CONTOURING': 'bg-green-100 text-green-800',
  'ASO': 'bg-orange-100 text-orange-800',
};

const SURGERY_TYPE_LABELS: Record<SurgeryType, string> = {
  '2JAW_SSRO': '양악(SSRO)',
  '2JAW_IVRO': '양악(IVRO)',
  'VLINE': 'V라인',
  'CONTOURING': '안면윤곽',
  'ASO': 'ASO',
};

const PAYMENT_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  NONE: { label: '미납', className: 'bg-red-100 text-red-700' },
  PARTIAL: { label: '부분납', className: 'bg-yellow-100 text-yellow-700' },
  FULL: { label: '완납', className: 'bg-green-100 text-green-700' },
};

interface DayDetailProps {
  date: Date;
  surgeryPatients: Patient[];
  followups: (Followup & { patient: Patient })[];
  interpreters?: Interpreter[];
  onClose: () => void;
}

export default function DayDetail({
  date,
  surgeryPatients,
  followups,
  interpreters = [],
  onClose,
}: DayDetailProps) {
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const getInterpreterName = (interpreterId: string) => {
    return interpreters.find((i) => i.interpreter_id === interpreterId)?.name ?? '미배정';
  };

  const hasConflict = surgeryPatients.length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-medium">선택한 날짜</p>
            <h2 className="text-base font-semibold text-gray-900 mt-0.5">{formatDate(date)}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Conflict warning */}
          {hasConflict && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                이 날 수술이 {surgeryPatients.length}건 예정되어 있습니다. 일정 충돌을 확인하세요.
              </p>
            </div>
          )}

          {/* Surgery patients */}
          {surgeryPatients.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                수술 예정 ({surgeryPatients.length}명)
              </h3>
              <div className="space-y-2.5">
                {surgeryPatients.map((patient) => {
                  const paymentInfo = PAYMENT_STATUS_LABELS[patient.payment_status];
                  return (
                    <div
                      key={patient.patient_id}
                      className="p-3.5 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{patient.k_name}</span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded font-medium ${SURGERY_TYPE_COLORS[patient.surgery_type]}`}
                          >
                            {SURGERY_TYPE_LABELS[patient.surgery_type]}
                          </span>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${paymentInfo.className}`}>
                          {paymentInfo.label}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          통역: {getInterpreterName(patient.interpreter_id)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard size={11} />
                          {patient.deposit_paid
                            ? `보증금 완납 (${(patient.deposit_amount / 10000).toFixed(0)}만원)`
                            : '보증금 미납'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Followups */}
          {followups.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                팔로업 예정 ({followups.length}건)
              </h3>
              <div className="space-y-2.5">
                {followups.map((fu) => (
                  <div
                    key={fu.followup_id}
                    className={`p-3.5 rounded-xl border ${
                      fu.completed
                        ? 'bg-gray-50/50 border-gray-100'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-sm ${
                          fu.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {fu.patient.k_name}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          fu.completed
                            ? 'bg-gray-100 text-gray-300 line-through'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        F/U #{fu.followup_number}
                      </span>
                      {fu.completed && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-green-50 text-green-500">
                          완료
                        </span>
                      )}
                    </div>
                    {fu.notes && (
                      <p className="mt-1.5 text-xs text-gray-400">{fu.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {surgeryPatients.length === 0 && followups.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm">이 날 예정된 일정이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
