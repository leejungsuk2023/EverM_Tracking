'use client';

import { useState } from 'react';
import { Followup } from '@/types/patient';
import { toggleFollowupComplete } from '@/lib/supabase-queries';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface FollowupScheduleProps {
  followups: Followup[];
  surgeryDate: string;
  onUpdate: (updated: Followup[]) => void;
}

function getDaysDiff(surgeryDate: string, followupDate: string): number {
  const surgery = new Date(surgeryDate);
  const followup = new Date(followupDate);
  return Math.round((followup.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24));
}

export default function FollowupSchedule({ followups, surgeryDate, onUpdate }: FollowupScheduleProps) {
  const { t } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [toggling, setToggling] = useState<string | null>(null);
  const [memos, setMemos] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    followups.forEach(f => { init[f.followup_id] = f.notes ?? ''; });
    return init;
  });

  async function handleToggleComplete(followup: Followup) {
    setToggling(followup.followup_id);
    try {
      const newCompleted = !followup.completed;
      await toggleFollowupComplete(followup.followup_id, newCompleted);
      onUpdate(followups.map(f =>
        f.followup_id === followup.followup_id
          ? { ...f, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
          : f
      ));
    } catch {
      // silently ignore on error
    } finally {
      setToggling(null);
    }
  }

  async function handleMemoBlur(followup: Followup) {
    const memo = memos[followup.followup_id] ?? '';
    if (memo === (followup.notes ?? '')) return;
    try {
      await toggleFollowupComplete(followup.followup_id, followup.completed, memo);
      onUpdate(followups.map(f =>
        f.followup_id === followup.followup_id ? { ...f, notes: memo } : f
      ));
    } catch {
      // silently ignore on error
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-4">{t('patient.followup_schedule')}</h2>
      {followups.length === 0 ? (
        <p className="text-sm text-slate-400">{t('common.no_data')}</p>
      ) : (
        <div className="space-y-4">
          {followups.map((followup) => {
            const followupDate = new Date(followup.scheduled_date);
            followupDate.setHours(0, 0, 0, 0);
            const isPast = followupDate < today;
            const isOverdue = isPast && !followup.completed;
            const daysDiff = getDaysDiff(surgeryDate, followup.scheduled_date);
            const dLabel = daysDiff >= 0 ? `D+${daysDiff}` : `D${daysDiff}`;
            const isToggling = toggling === followup.followup_id;

            const statusLabel = followup.completed
              ? t('followup.completed')
              : isOverdue
              ? t('followup.overdue_badge')
              : t('followup.scheduled');

            return (
              <div
                key={followup.followup_id}
                className={`rounded-lg p-3 border transition-colors ${
                  isOverdue ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleComplete(followup)}
                    disabled={isToggling}
                    className="flex-shrink-0 disabled:opacity-50"
                  >
                    {isToggling ? (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    ) : followup.completed ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : isOverdue ? (
                      <AlertCircle size={20} className="text-red-400" />
                    ) : (
                      <Clock size={20} className="text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isOverdue ? 'text-red-700' : 'text-slate-700'}`}>
                      {followup.followup_number}{t('followup.fu_number')}
                      <span className="ml-2 text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {dLabel}
                      </span>
                    </p>
                    <p className={`text-xs ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                      {followup.scheduled_date}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      followup.completed
                        ? 'bg-green-100 text-green-700'
                        : isOverdue
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
                {/* Memo input */}
                <div className="mt-2 pl-8">
                  <input
                    type="text"
                    placeholder={t('followup.memo') + '...'}
                    value={memos[followup.followup_id] ?? ''}
                    onChange={e => setMemos(prev => ({ ...prev, [followup.followup_id]: e.target.value }))}
                    onBlur={() => handleMemoBlur(followup)}
                    className="w-full text-xs text-slate-600 bg-transparent border-b border-slate-200 focus:border-blue-400 focus:outline-none py-0.5 placeholder:text-slate-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
