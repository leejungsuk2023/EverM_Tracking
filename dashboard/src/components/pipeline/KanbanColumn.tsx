'use client';

import { Patient, PipelineStage } from '@/types/patient';
import { useLanguage } from '@/lib/i18n';
import PatientCard from './PatientCard';

interface KanbanColumnProps {
  stageKey: PipelineStage;
  label: string;
  timeline: string;
  patients: Patient[];
}

function getColumnAccent(stage: PipelineStage): string {
  const map: Partial<Record<PipelineStage, string>> = {
    CONSULTATION: 'border-slate-400',
    BOOKING: 'border-blue-400',
    DOCUMENT_COLLECTION: 'border-indigo-400',
    PREOP_PREP: 'border-violet-400',
    ARRIVAL_HEALTH_CHECK: 'border-purple-400',
    SURGERY: 'border-red-500',
    HOSPITALIZATION: 'border-orange-400',
    DISCHARGE: 'border-amber-400',
    FOLLOWUP_1: 'border-yellow-400',
    FOLLOWUP_2: 'border-lime-400',
    FOLLOWUP_3: 'border-green-400',
    COMPLETE: 'border-emerald-500',
  };
  return map[stage] ?? 'border-slate-300';
}

export default function KanbanColumn({ stageKey, label, timeline, patients }: KanbanColumnProps) {
  const { t } = useLanguage();
  const accent = getColumnAccent(stageKey);

  return (
    <div className={`flex-shrink-0 w-72 flex flex-col bg-gray-100 rounded-lg border-t-2 ${accent}`}>
      {/* Column header */}
      <div className="px-3 py-2.5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">{label}</span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-xs font-bold text-slate-600">
            {patients.length}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{timeline}</p>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[120px] max-h-[calc(100vh-200px)]">
        {patients.length === 0 ? (
          <p className="text-xs text-slate-300 text-center pt-4">{t('pipeline.empty')}</p>
        ) : (
          patients.map((p) => <PatientCard key={p.patient_id} patient={p} />)
        )}
      </div>
    </div>
  );
}
