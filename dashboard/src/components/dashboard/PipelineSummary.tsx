import { Patient, PIPELINE_STAGES, PipelineStage } from '@/types/patient';

interface PipelineSummaryProps {
  patients: Patient[];
}

function getBarColor(stage: PipelineStage): string {
  const earlyStages: PipelineStage[] = ['CONSULTATION', 'BOOKING', 'DOCUMENT_COLLECTION', 'PREOP_PREP'];
  const surgeryStages: PipelineStage[] = ['ARRIVAL_HEALTH_CHECK', 'SURGERY', 'HOSPITALIZATION', 'DISCHARGE'];
  const followupStages: PipelineStage[] = ['FOLLOWUP_1', 'FOLLOWUP_2', 'FOLLOWUP_3'];
  const completeStages: PipelineStage[] = ['COMPLETE'];

  if (earlyStages.includes(stage)) return 'bg-blue-400';
  if (surgeryStages.includes(stage)) return 'bg-red-400';
  if (followupStages.includes(stage)) return 'bg-green-400';
  if (completeStages.includes(stage)) return 'bg-gray-300';
  return 'bg-gray-300';
}

export default function PipelineSummary({ patients }: PipelineSummaryProps) {
  const stageCounts: Record<string, number> = {};
  for (const stage of PIPELINE_STAGES) {
    stageCounts[stage.key] = 0;
  }
  for (const patient of patients) {
    stageCounts[patient.pipeline_stage] = (stageCounts[patient.pipeline_stage] || 0) + 1;
  }

  const maxCount = Math.max(...Object.values(stageCounts), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">파이프라인 현황</h2>
      <div className="space-y-2">
        {PIPELINE_STAGES.map((stage) => {
          const count = stageCounts[stage.key] || 0;
          const widthPct = Math.round((count / maxCount) * 100);
          const barColor = getBarColor(stage.key);

          return (
            <div key={stage.key} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-right text-xs text-gray-500 leading-tight">
                {stage.labelKo}
              </span>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                {count > 0 && (
                  <div
                    className={`h-full rounded-full ${barColor} transition-all`}
                    style={{ width: `${widthPct}%` }}
                  />
                )}
              </div>
              <span className="w-4 shrink-0 text-xs font-semibold text-gray-700 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
