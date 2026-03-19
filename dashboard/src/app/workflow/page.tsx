'use client';

import WorkflowGuide from '@/components/calendar/WorkflowGuide';
import { useLanguage } from '@/lib/i18n';

export default function WorkflowPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t('calendar.tab_workflow')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {t('workflow.select_surgery')}
        </p>
      </div>
      <WorkflowGuide />
    </div>
  );
}
