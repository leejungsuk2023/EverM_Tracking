'use client';

import { Patient, PIPELINE_STAGES, PipelineStage } from '@/types/patient';
import { Check } from 'lucide-react';

interface PatientTimelineProps {
  patient: Patient;
}

export default function PatientTimeline({ patient }: PatientTimelineProps) {
  const currentIndex = PIPELINE_STAGES.findIndex(s => s.key === patient.pipeline_stage);

  const getStepState = (index: number): 'completed' | 'current' | 'future' => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'future';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-6">파이프라인 진행 상황</h2>
      <div className="overflow-x-auto">
        <div className="flex items-start min-w-max gap-0">
          {PIPELINE_STAGES.map((stage, index) => {
            const state = getStepState(index);
            const isLast = index === PIPELINE_STAGES.length - 1;

            return (
              <div key={stage.key} className="flex items-start">
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={[
                      'rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                      state === 'completed'
                        ? 'w-8 h-8 bg-blue-500 text-white'
                        : state === 'current'
                        ? 'w-10 h-10 bg-blue-500 text-white ring-4 ring-blue-100'
                        : 'w-8 h-8 bg-white border-2 border-slate-300 text-slate-300',
                    ].join(' ')}
                  >
                    {state === 'completed' ? (
                      <Check size={14} />
                    ) : state === 'current' ? (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    ) : null}
                  </div>
                  {/* Label */}
                  <p
                    className={[
                      'mt-2 text-xs text-center w-16 leading-tight',
                      state === 'future' ? 'text-slate-400' : 'text-slate-700 font-medium',
                    ].join(' ')}
                  >
                    {stage.labelKo}
                  </p>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div className="flex-shrink-0 mt-4">
                    <div
                      className={[
                        'h-0.5 w-8',
                        state === 'completed' ? 'bg-blue-500' : 'bg-slate-200',
                      ].join(' ')}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
