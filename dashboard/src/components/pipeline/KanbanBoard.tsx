'use client';

import { Patient, PIPELINE_STAGES, PipelineStage } from '@/types/patient';
import { useLanguage } from '@/lib/i18n';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  patients: Patient[];
}

export default function KanbanBoard({ patients }: KanbanBoardProps) {
  const { t } = useLanguage();

  const grouped = PIPELINE_STAGES.reduce<Record<PipelineStage, Patient[]>>(
    (acc, stage) => {
      acc[stage.key] = patients.filter((p) => p.pipeline_stage === stage.key);
      return acc;
    },
    {} as Record<PipelineStage, Patient[]>,
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-0">
      {PIPELINE_STAGES.map((stage) => (
        <KanbanColumn
          key={stage.key}
          stageKey={stage.key}
          label={t(`stage.${stage.key}`)}
          timeline={stage.timeline}
          patients={grouped[stage.key]}
        />
      ))}
    </div>
  );
}
