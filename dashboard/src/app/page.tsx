'use client';

import { useState, useEffect } from 'react';
import { mockPatients } from '@/data/mock-patients';
import { mockActivities } from '@/data/mock-activities';
import { getPatients, getAllFollowups } from '@/lib/supabase-queries';
import { Patient } from '@/types/patient';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import UpcomingSurgeries from '@/components/dashboard/UpcomingSurgeries';
import PipelineSummary from '@/components/dashboard/PipelineSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Stethoscope, Users, FileX2, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const TODAY = new Date();
const TODAY_STR = TODAY.toISOString().split('T')[0];

function getThisMonthSurgeries(patients: Patient[]): number {
  const year = TODAY.getFullYear();
  const month = TODAY.getMonth();
  return patients.filter((p) => {
    const d = new Date(p.surgery_date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;
}

function getActivePatients(patients: Patient[]): number {
  return patients.filter((p) => p.pipeline_stage !== 'COMPLETE').length;
}

function getDocIncompleteCount(patients: Patient[]): number {
  return patients.filter((p) => {
    const docs = [p.doc_passport, p.doc_flight_in, p.doc_flight_out, p.doc_hotel, p.doc_keta];
    return docs.some((d) => !d);
  }).length;
}

export default function Home() {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [todayFollowupCount, setTodayFollowupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsData, followupsData] = await Promise.all([
          getPatients(),
          getAllFollowups(),
        ]);
        setPatients(patientsData);
        const todayCount = followupsData.filter(
          (f) => f.scheduled_date === TODAY_STR && !f.completed
        ).length;
        setTodayFollowupCount(todayCount);
      } catch {
        // fallback: keep mockPatients, count 0
        setTodayFollowupCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activePatients = getActivePatients(patients);
  const thisMonthSurgeries = getThisMonthSurgeries(patients);
  const docIncomplete = getDocIncompleteCount(patients);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{TODAY_STR} 기준</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title={t('dashboard.active_patients')}
            value={loading ? '-' : activePatients}
            change={t('dashboard.pipeline_in_progress')}
            icon={Users}
            color="blue"
          />
          <StatCard
            title={t('dashboard.surgeries_this_month')}
            value={loading ? '-' : thisMonthSurgeries}
            change={new Date(TODAY.getFullYear(), TODAY.getMonth(), 1).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            icon={Stethoscope}
            color="green"
          />
          <StatCard
            title={t('dashboard.incomplete_docs')}
            value={loading ? '-' : docIncomplete}
            change={t('dashboard.doc_check_needed')}
            icon={FileX2}
            color="orange"
          />
          <StatCard
            title={t('dashboard.today_followups')}
            value={loading ? '-' : todayFollowupCount}
            change={t('dashboard.incomplete_basis')}
            icon={ClipboardCheck}
            color="purple"
          />
        </div>

        {/* Middle: UpcomingSurgeries + PipelineSummary */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UpcomingSurgeries patients={patients} today={TODAY} />
          <PipelineSummary patients={patients} />
        </div>

        {/* Bottom: RecentActivity */}
        <RecentActivity activities={mockActivities} />
      </div>
    </DashboardLayout>
  );
}
