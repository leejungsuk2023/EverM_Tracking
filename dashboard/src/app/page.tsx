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
          <h1 className="text-xl font-bold text-gray-900">운영 대시보드</h1>
          <p className="text-sm text-gray-500 mt-0.5">{TODAY_STR} 기준</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="활성 환자"
            value={loading ? '-' : activePatients}
            change="파이프라인 진행 중"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="이번 달 수술"
            value={loading ? '-' : thisMonthSurgeries}
            change={`${TODAY.getFullYear()}년 ${TODAY.getMonth() + 1}월`}
            icon={Stethoscope}
            color="green"
          />
          <StatCard
            title="서류 미완료"
            value={loading ? '-' : docIncomplete}
            change="서류 확인 필요 환자"
            icon={FileX2}
            color="orange"
          />
          <StatCard
            title="오늘 팔로업"
            value={loading ? '-' : todayFollowupCount}
            change="미완료 기준"
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
