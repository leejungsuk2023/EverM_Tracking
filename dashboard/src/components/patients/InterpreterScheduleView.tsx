'use client';

import { useState, useEffect } from 'react';
import { InterpreterSchedule } from '@/types/patient';
import { getInterpreterSchedule } from '@/lib/supabase-queries';
import { useLanguage } from '@/lib/i18n';
import { CalendarDays } from 'lucide-react';

interface InterpreterScheduleViewProps {
  patientId: string;
}

const INTERPRETER_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

function getInterpreterColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INTERPRETER_COLORS[Math.abs(hash) % INTERPRETER_COLORS.length];
}

export default function InterpreterScheduleView({ patientId }: InterpreterScheduleViewProps) {
  const { t, lang } = useLanguage();
  const [schedules, setSchedules] = useState<InterpreterSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const data = await getInterpreterSchedule(patientId);
        setSchedules(data);
      } catch {
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, [patientId]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-4">{t('interpreter.schedule')}</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
          <CalendarDays size={28} className="text-slate-300" />
          <p className="text-sm">{t('interpreter.no_schedule')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="pb-2 text-left">{t('interpreter.date')}</th>
                <th className="pb-2 text-left">{t('interpreter.time')}</th>
                <th className="pb-2 text-left">{t('interpreter.name')}</th>
                <th className="pb-2 text-left">{t('interpreter.task')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {schedules.map((schedule) => {
                const interpreterName = schedule.interpreter?.name ?? '-';
                const colorClass = getInterpreterColor(interpreterName);
                const taskText =
                  lang === 'ko' && schedule.description_ko
                    ? schedule.description_ko
                    : schedule.description;

                return (
                  <tr key={schedule.schedule_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 pr-3 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {schedule.scheduled_date}
                    </td>
                    <td className="py-2 pr-3 text-xs text-slate-500 whitespace-nowrap">
                      {schedule.time_slot ?? '-'}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
                      >
                        {interpreterName}
                      </span>
                    </td>
                    <td className="py-2 text-xs text-slate-600">{taskText}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
