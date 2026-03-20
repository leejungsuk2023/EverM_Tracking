'use client';

import { useState } from 'react';
import { Patient, PIPELINE_STAGES } from '@/types/patient';
import { updatePatient } from '@/lib/supabase-queries';
import { User, Globe, Stethoscope, Calendar, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface PatientInfoProps {
  patient: Patient;
  onUpdate: (updated: Patient) => void;
}

export default function PatientInfo({ patient, onUpdate }: PatientInfoProps) {
  const { t } = useLanguage();
  const stageInfo = PIPELINE_STAGES.find(s => s.key === patient.pipeline_stage);
  const [notes, setNotes] = useState(patient.notes ?? '');
  const [saving, setSaving] = useState(false);

  const isDirty = notes !== (patient.notes ?? '');

  async function handleSaveNotes() {
    if (!isDirty) return;
    setSaving(true);
    try {
      await updatePatient(patient.patient_id, { notes });
      onUpdate({ ...patient, notes });
    } catch {
      // silently ignore on error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User size={32} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{patient.k_name}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{patient.full_name}</p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            {stageInfo ? t(`stage.${stageInfo.key}`) : patient.pipeline_stage}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2 text-sm">
          <Globe size={16} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">{t('patient.nationality')}</p>
            <p className="font-medium text-slate-700">{patient.nationality}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Stethoscope size={16} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">{t('patient.surgery_type')}</p>
            <p className="font-medium text-slate-700">{t(`surgery.${patient.surgery_type}`)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">{t('patient.surgery_date')}</p>
            <p className="font-medium text-slate-700">{patient.surgery_date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Activity size={16} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">{t('patient.current_stage')}</p>
            <p className="font-medium text-slate-700">
              {stageInfo ? t(`stage.${stageInfo.key}`) : patient.pipeline_stage}
            </p>
          </div>
        </div>
      </div>

      {/* Notes / Memo */}
      <div className="mt-4">
        <p className="text-xs text-slate-400 mb-1">{t('patient.notes')}</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder={t('patient.notes') + '...'}
          className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        {isDirty && (
          <div className="flex justify-end mt-1.5">
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? t('patient.saving') : t('patient.save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
