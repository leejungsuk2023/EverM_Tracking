'use client';

import { useState } from 'react';
import { Patient } from '@/types/patient';
import { updateDocumentStatus } from '@/lib/supabase-queries';
import { CheckCircle2, XCircle, Plane, Hotel, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface DocumentChecklistProps {
  patient: Patient;
  onUpdate: (updated: Patient) => void;
}

const DOCUMENTS = [
  { key: 'doc_passport', labelKey: 'doc.passport', icon: Shield },
  { key: 'doc_flight_in', labelKey: 'doc.flight_in', icon: Plane },
  { key: 'doc_flight_out', labelKey: 'doc.flight_out', icon: Plane },
  { key: 'doc_hotel', labelKey: 'doc.hotel', icon: Hotel },
  { key: 'doc_keta', labelKey: 'doc.keta', icon: Shield },
] as const;

export default function DocumentChecklist({ patient, onUpdate }: DocumentChecklistProps) {
  const { t } = useLanguage();
  const [saving, setSaving] = useState<string | null>(null);

  const submitted = DOCUMENTS.filter(d => patient[d.key]).length;

  async function handleToggle(docField: string, currentValue: boolean) {
    const newValue = !currentValue;
    setSaving(docField);
    try {
      await updateDocumentStatus(patient.patient_id, docField, newValue);
      onUpdate({ ...patient, [docField]: newValue });
    } catch {
      // silently ignore on error
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">{t('patient.documents')}</h2>
        <span className="text-sm text-slate-500">{submitted}/{DOCUMENTS.length}</span>
      </div>
      <div className="space-y-3">
        {DOCUMENTS.map(({ key, labelKey, icon: Icon }) => {
          const checked = patient[key];
          const isSaving = saving === key;
          return (
            <button
              key={key}
              onClick={() => handleToggle(key, checked)}
              disabled={isSaving}
              className="flex items-center gap-3 w-full text-left hover:bg-slate-50 rounded-md px-1 py-0.5 transition-colors disabled:opacity-50"
            >
              <Icon size={16} className="text-slate-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-slate-700">{t(labelKey)}</span>
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : checked ? (
                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
              ) : (
                <XCircle size={20} className="text-red-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
