'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockPatients } from '@/data/mock-patients';
import { Patient, PIPELINE_STAGES, SURGERY_TYPE_LABELS } from '@/types/patient';
import { getPatients } from '@/lib/supabase-queries';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Search, CheckCircle2, XCircle } from 'lucide-react';

const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NONE: { label: '미납', color: 'text-red-500' },
  PARTIAL: { label: '부분 납부', color: 'text-yellow-600' },
  FULL: { label: '완납', color: 'text-green-600' },
};

export default function PatientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch {
        setPatients(mockPatients);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const filtered = patients.filter(p =>
    p.k_name.toLowerCase().includes(search.toLowerCase()) ||
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">환자 목록</h1>
          <span className="text-sm text-slate-500">{filtered.length}명</span>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="환자명 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">환자명</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">수술 유형</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">수술일</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">파이프라인 단계</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-600">서류</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">결제 상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map(patient => {
                    const stageInfo = PIPELINE_STAGES.find(s => s.key === patient.pipeline_stage);
                    const allDocs = [
                      patient.doc_passport,
                      patient.doc_flight_in,
                      patient.doc_flight_out,
                      patient.doc_hotel,
                      patient.doc_keta,
                    ];
                    const docsComplete = allDocs.every(Boolean);
                    const docsCount = allDocs.filter(Boolean).length;
                    const paymentInfo = PAYMENT_STATUS_LABELS[patient.payment_status];

                    return (
                      <tr
                        key={patient.patient_id}
                        onClick={() => router.push(`/patients/${patient.patient_id}`)}
                        className="border-b border-slate-50 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{patient.k_name}</p>
                          <p className="text-xs text-slate-400">{patient.full_name}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {SURGERY_TYPE_LABELS[patient.surgery_type]}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{patient.surgery_date}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {stageInfo?.labelKo ?? patient.pipeline_stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {docsComplete ? (
                              <CheckCircle2 size={16} className="text-green-500" />
                            ) : (
                              <XCircle size={16} className="text-red-400" />
                            )}
                            <span className="text-xs text-slate-500">{docsCount}/5</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${paymentInfo.color}`}>{paymentInfo.label}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
