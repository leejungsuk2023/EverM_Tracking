'use client';

import { X, AlertTriangle, User, CreditCard } from 'lucide-react';
import { Patient, Followup, Interpreter, SurgeryType } from '@/types/patient';
import { useLanguage } from '@/lib/i18n';

const SURGERY_TYPE_COLORS: Record<SurgeryType, string> = {
  '2JAW_SSRO': 'bg-blue-100 text-blue-800',
  '2JAW_IVRO': 'bg-purple-100 text-purple-800',
  'VLINE': 'bg-pink-100 text-pink-800',
  'CONTOURING': 'bg-green-100 text-green-800',
  'ASO': 'bg-orange-100 text-orange-800',
};

const SURGERY_TYPE_LABEL_KEYS: Record<SurgeryType, string> = {
  '2JAW_SSRO': 'surgery.2JAW_SSRO',
  '2JAW_IVRO': 'surgery.2JAW_IVRO',
  'VLINE': 'surgery.VLINE',
  'CONTOURING': 'surgery.CONTOURING',
  'ASO': 'surgery.ASO',
};

const PAYMENT_STATUS_LABEL_KEYS: Record<string, { labelKey: string; className: string }> = {
  NONE: { labelKey: 'payment.none', className: 'bg-red-100 text-red-700' },
  PARTIAL: { labelKey: 'payment.partial', className: 'bg-yellow-100 text-yellow-700' },
  FULL: { labelKey: 'payment.full', className: 'bg-green-100 text-green-700' },
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
  const { t } = useLanguage();

  const formatDate = (d: Date) => {
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const getInterpreterName = (interpreterId: string) => {
    return interpreters.find((i) => i.interpreter_id === interpreterId)?.name ?? t('alert.no_interpreter');
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
            <p className="text-xs text-gray-500 font-medium">{t('calendar.selected_date')}</p>
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
                {t('calendar.conflict')}
              </p>
            </div>
          )}

          {/* Surgery patients */}
          {surgeryPatients.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t('calendar.surgery')} ({surgeryPatients.length})
              </h3>
              <div className="space-y-2.5">
                {surgeryPatients.map((patient) => {
                  const paymentInfo = PAYMENT_STATUS_LABEL_KEYS[patient.payment_status];
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
                            {t(SURGERY_TYPE_LABEL_KEYS[patient.surgery_type])}
                          </span>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${paymentInfo.className}`}>
                          {t(paymentInfo.labelKey)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {t('calendar.interpreter')}: {getInterpreterName(patient.interpreter_id)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard size={11} />
                          {patient.deposit_paid
                            ? `${t('payment.deposit')} ${t('payment.full')} (${(patient.deposit_amount / 10000).toFixed(0)}${t('currency.man_won')})`
                            : `${t('payment.deposit')} ${t('payment.none')}`}
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
                {t('calendar.followup')} ({followups.length})
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
                          {t('followup.completed')}
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
            <div className="py-10 text-center text-gray-400 text-sm">{t('calendar.no_events')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
