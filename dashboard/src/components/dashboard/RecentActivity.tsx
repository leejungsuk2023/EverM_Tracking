'use client';

import { Activity, ActivityType } from '@/data/mock-activities';
import { useLanguage } from '@/lib/i18n';
import {
  ArrowRightLeft,
  FileCheck,
  CreditCard,
  StickyNote,
  Scissors,
  LogOut,
  CalendarCheck,
} from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
}

const activityConfig: Record<
  ActivityType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  STAGE_CHANGE: { icon: ArrowRightLeft, color: 'text-blue-600', bg: 'bg-blue-100' },
  DOCUMENT_SUBMITTED: { icon: FileCheck, color: 'text-green-600', bg: 'bg-green-100' },
  PAYMENT_RECEIVED: { icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  NOTE_ADDED: { icon: StickyNote, color: 'text-gray-600', bg: 'bg-gray-100' },
  SURGERY_COMPLETED: { icon: Scissors, color: 'text-red-600', bg: 'bg-red-100' },
  DISCHARGE: { icon: LogOut, color: 'text-purple-600', bg: 'bg-purple-100' },
  FOLLOWUP_SCHEDULED: { icon: CalendarCheck, color: 'text-teal-600', bg: 'bg-teal-100' },
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const { t } = useLanguage();
  const recent = activities.slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.recent_activity')}</h2>
      <ul className="space-y-3">
        {recent.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          return (
            <li key={activity.id} className="flex items-start gap-3">
              <div className={`mt-0.5 shrink-0 rounded-full p-2 ${config.bg}`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-snug">{activity.message}</p>
                <p className="mt-0.5 text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
