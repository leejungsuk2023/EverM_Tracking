'use client';

import { useState, useEffect } from 'react';
import SurgeryCalendar from '@/components/calendar/SurgeryCalendar';
import { Patient, Followup } from '@/types/patient';
import { getPatients, getAllFollowups } from '@/lib/supabase-queries';
import { useLanguage } from '@/lib/i18n';

export default function CalendarPage() {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [followups, setFollowups] = useState<(Followup & { patient: Patient })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsData, followupsData] = await Promise.all([
          getPatients(),
          getAllFollowups(),
        ]);
        setPatients(patientsData);
        setFollowups(followupsData);
      } catch (err) {
        console.error('Supabase fetch failed:', err);
        setPatients([]);
        setFollowups([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t('calendar.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('calendar.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          {t('common.loading')}
        </div>
      ) : (
        <SurgeryCalendar patients={patients} followups={followups} />
      )}
    </div>
  );
}
