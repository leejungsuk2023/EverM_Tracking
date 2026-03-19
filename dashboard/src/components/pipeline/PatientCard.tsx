'use client';

import Link from 'next/link';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/lib/i18n';

function getDayDiff(surgeryDate: string): number {
  const today = new Date();
  const surgery = new Date(surgeryDate);
  const diff = Math.round((surgery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function DCountdown({ surgeryDate }: { surgeryDate: string }) {
  const diff = getDayDiff(surgeryDate);
  let label: string;
  let cls: string;

  if (diff === 0) {
    label = 'D-Day';
    cls = 'bg-red-100 text-red-700';
  } else if (diff > 0) {
    label = `D-${diff}`;
    cls = diff <= 7 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600';
  } else {
    label = `D+${Math.abs(diff)}`;
    cls = 'bg-blue-50 text-blue-600';
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

const NATIONALITY_FLAG: Record<string, string> = {
  Thai: '🇹🇭',
  Korean: '🇰🇷',
  Japanese: '🇯🇵',
  Chinese: '🇨🇳',
};

const SURGERY_BADGE_COLOR: Record<string, string> = {
  '2JAW_SSRO': 'bg-blue-100 text-blue-700',
  '2JAW_IVRO': 'bg-purple-100 text-purple-700',
  VLINE: 'bg-pink-100 text-pink-700',
  CONTOURING: 'bg-green-100 text-green-700',
  ASO: 'bg-orange-100 text-orange-700',
};

interface DocItem {
  key: keyof Pick<Patient, 'doc_passport' | 'doc_flight_in' | 'doc_flight_out' | 'doc_hotel' | 'doc_keta'>;
  labelKey: string;
}

const DOC_ITEMS: DocItem[] = [
  { key: 'doc_passport', labelKey: 'doc.passport' },
  { key: 'doc_flight_in', labelKey: 'doc.flight_in' },
  { key: 'doc_flight_out', labelKey: 'doc.flight_out' },
  { key: 'doc_hotel', labelKey: 'doc.hotel' },
  { key: 'doc_keta', labelKey: 'doc.keta' },
];

export default function PatientCard({ patient }: { patient: Patient }) {
  const { t } = useLanguage();

  const alerts: { msgKey: string; color: string }[] = [];
  const dayDiff = getDayDiff(patient.surgery_date);
  const docsComplete = DOC_ITEMS.every((d) => patient[d.key]);

  if (!docsComplete && dayDiff <= 7 && dayDiff >= 0) {
    alerts.push({ msgKey: 'alert.doc_delay', color: 'bg-red-500' });
  }
  if (!patient.deposit_paid && dayDiff <= 14 && dayDiff >= 0) {
    alerts.push({ msgKey: 'alert.deposit_unpaid', color: 'bg-orange-400' });
  }
  if (!patient.interpreter_id) {
    alerts.push({ msgKey: 'alert.no_interpreter', color: 'bg-yellow-400' });
  }

  const flag = NATIONALITY_FLAG[patient.nationality] ?? '🌐';

  return (
    <Link href={`/patients/${patient.patient_id}`} className="block bg-white rounded-lg border border-slate-200 shadow-sm p-3 space-y-2 hover:shadow-md transition-shadow cursor-pointer">
      {/* Top row: name + flag + D-day */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base leading-none">{flag}</span>
          <span className="text-sm font-semibold text-slate-900 truncate">{patient.k_name}</span>
        </div>
        <DCountdown surgeryDate={patient.surgery_date} />
      </div>

      {/* Surgery type badge */}
      <div>
        <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${SURGERY_BADGE_COLOR[patient.surgery_type]}`}>
          {t(`surgery.${patient.surgery_type}`)}
        </span>
      </div>

      {/* Document checklist */}
      <div className="flex flex-wrap gap-1">
        {DOC_ITEMS.map((doc) => (
          <span
            key={doc.key}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${
              patient[doc.key]
                ? 'bg-green-50 text-green-700'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {patient[doc.key] ? '✓' : '○'} {t(doc.labelKey)}
          </span>
        ))}
      </div>

      {/* Payment status */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {patient.payment_status === 'FULL' && (
            <span className="text-green-600 font-medium">{t('payment.full')}</span>
          )}
          {patient.payment_status === 'PARTIAL' && (
            <span className="text-amber-600 font-medium">{t('payment.partial')}</span>
          )}
          {patient.payment_status === 'NONE' && (
            <span className="text-red-500 font-medium">{t('payment.none')}</span>
          )}
        </span>
        <span className="text-slate-400">{t(`exchange.${patient.exchange_method}`)}</span>
      </div>

      {/* Alert flags */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5 border-t border-slate-100">
          {alerts.map((a) => (
            <span
              key={a.msgKey}
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white ${a.color}`}
            >
              {t(a.msgKey)}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
