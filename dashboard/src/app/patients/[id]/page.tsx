'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Patient, Followup } from '@/types/patient';
import { getPatientById, getFollowups } from '@/lib/supabase-queries';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PatientInfo from '@/components/patients/PatientInfo';
import PatientTimeline from '@/components/patients/PatientTimeline';
import DocumentChecklist from '@/components/patients/DocumentChecklist';
import PaymentHistory from '@/components/patients/PaymentHistory';
import FollowupSchedule from '@/components/patients/FollowupSchedule';
import InterpreterScheduleView from '@/components/patients/InterpreterScheduleView';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientData, followupsData] = await Promise.all([
          getPatientById(id),
          getFollowups(id),
        ]);
        setPatient(patientData);
        setFollowups(followupsData);
      } catch {
        setPatient(null);
        setFollowups([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-slate-500">{t('common.no_data')}</p>
          <button
            onClick={() => router.push('/patients')}
            className="text-sm text-blue-600 hover:underline"
          >
            {t('patient.back_to_list')}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  function handlePatientUpdate(updated: Patient) {
    setPatient(updated);
  }

  function handleFollowupsUpdate(updated: Followup[]) {
    setFollowups(updated);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.push('/patients')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('patient.back_to_list')}
        </button>

        {/* Patient info header */}
        <PatientInfo patient={patient} onUpdate={handlePatientUpdate} />

        {/* Timeline */}
        <PatientTimeline patient={patient} />

        {/* Bottom grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DocumentChecklist patient={patient} onUpdate={handlePatientUpdate} />
          <PaymentHistory patient={patient} />
          <FollowupSchedule
            followups={followups}
            surgeryDate={patient.surgery_date}
            surgeryType={patient.surgery_type}
            onUpdate={handleFollowupsUpdate}
          />
        </div>

        {/* Interpreter Schedule */}
        <InterpreterScheduleView patientId={patient.patient_id} />
      </div>
    </DashboardLayout>
  );
}
