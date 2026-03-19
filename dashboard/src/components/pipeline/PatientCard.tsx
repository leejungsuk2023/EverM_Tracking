'use client';

import Link from 'next/link';
import { Patient, SURGERY_TYPE_LABELS } from '@/types/patient';

// D-day 계산 (today 기준)
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

const EXCHANGE_LABEL: Record<string, string> = {
  SELF: '자체환전',
  TEAM_ARRANGED: '팀환전',
  CARD_PLUS_10PCT: '카드+10%',
};

interface DocItem {
  key: keyof Pick<Patient, 'doc_passport' | 'doc_flight_in' | 'doc_flight_out' | 'doc_hotel' | 'doc_keta'>;
  label: string;
}

const DOC_ITEMS: DocItem[] = [
  { key: 'doc_passport', label: '여권' },
  { key: 'doc_flight_in', label: '항공(입)' },
  { key: 'doc_flight_out', label: '항공(출)' },
  { key: 'doc_hotel', label: '숙소' },
  { key: 'doc_keta', label: 'K-ETA' },
];

function getAlerts(patient: Patient): { msg: string; color: string }[] {
  const alerts: { msg: string; color: string }[] = [];
  const dayDiff = getDayDiff(patient.surgery_date);

  // 서류 지연: 수술 7일 이내인데 서류 미완료
  const docsComplete = DOC_ITEMS.every((d) => patient[d.key]);
  if (!docsComplete && dayDiff <= 7 && dayDiff >= 0) {
    alerts.push({ msg: '서류 지연', color: 'bg-red-500' });
  }

  // 보증금 미납: 수술 14일 이내
  if (!patient.deposit_paid && dayDiff <= 14 && dayDiff >= 0) {
    alerts.push({ msg: '보증금 미납', color: 'bg-orange-400' });
  }

  // 통역사 미배정
  if (!patient.interpreter_id) {
    alerts.push({ msg: '통역사 미배정', color: 'bg-yellow-400' });
  }

  return alerts;
}

export default function PatientCard({ patient }: { patient: Patient }) {
  const alerts = getAlerts(patient);
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
          {SURGERY_TYPE_LABELS[patient.surgery_type]}
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
            {patient[doc.key] ? '✓' : '○'} {doc.label}
          </span>
        ))}
      </div>

      {/* Payment status */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {patient.payment_status === 'FULL' && (
            <span className="text-green-600 font-medium">전액납부</span>
          )}
          {patient.payment_status === 'PARTIAL' && (
            <span className="text-amber-600 font-medium">일부납부</span>
          )}
          {patient.payment_status === 'NONE' && (
            <span className="text-red-500 font-medium">미납</span>
          )}
        </span>
        <span className="text-slate-400">{EXCHANGE_LABEL[patient.exchange_method]}</span>
      </div>

      {/* Alert flags */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5 border-t border-slate-100">
          {alerts.map((a) => (
            <span
              key={a.msg}
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white ${a.color}`}
            >
              {a.msg}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
