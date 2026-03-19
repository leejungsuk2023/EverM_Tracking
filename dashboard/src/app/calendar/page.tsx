'use client';

import { useState, useEffect } from 'react';
import SurgeryCalendar from '@/components/calendar/SurgeryCalendar';
import { Patient, Followup } from '@/types/patient';
import { getPatients, getAllFollowups } from '@/lib/supabase-queries';
import { mockPatients } from '@/data/mock-patients';

export default function CalendarPage() {
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
        console.error('Supabase fetch failed, using mock data:', err);
        setPatients(mockPatients);
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
        <h1 className="text-xl font-bold text-gray-900">수술 캘린더</h1>
        <p className="text-sm text-gray-500 mt-0.5">월별 수술 및 팔로업 일정을 확인하세요.</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          일정을 불러오는 중...
        </div>
      ) : (
        <SurgeryCalendar patients={patients} followups={followups} />
      )}
    </div>
  );
}
