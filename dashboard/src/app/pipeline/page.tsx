'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Patient } from '@/types/patient';
import { getPatients } from '@/lib/supabase-queries';
import { mockPatients } from '@/data/mock-patients';
import KanbanBoard from '@/components/pipeline/KanbanBoard';

type FilterMode = 'all' | 'doc_incomplete' | 'followup_pending';

export default function PipelinePage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((err) => {
        setError((err.message ?? '데이터 로드 실패') + ' (목업 데이터로 표시 중)');
        setPatients(mockPatients);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = patients;

    // Search by k_name or full_name
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.k_name.toLowerCase().includes(q) ||
          p.full_name.toLowerCase().includes(q)
      );
    }

    // Filter mode
    if (filterMode === 'doc_incomplete') {
      result = result.filter(
        (p) =>
          !p.doc_passport ||
          !p.doc_flight_in ||
          !p.doc_flight_out ||
          !p.doc_hotel ||
          !p.doc_keta
      );
    } else if (filterMode === 'followup_pending') {
      result = result.filter((p) =>
        ['FOLLOWUP_1', 'FOLLOWUP_2', 'FOLLOWUP_3'].includes(p.pipeline_stage)
      );
    }

    return result;
  }, [patients, search, filterMode]);

  const filterButtons: { key: FilterMode; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'doc_incomplete', label: '서류 미완료' },
    { key: 'followup_pending', label: '팔로업 대기' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="환자 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 w-48"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            <Filter size={12} className="ml-1.5 text-slate-400" />
            {filterButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterMode(key)}
                className={[
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                  filterMode === key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          {loading ? '로딩 중...' : (
            <>
              표시 <span className="font-semibold text-slate-800">{filtered.length}</span>명
              {filtered.length !== patients.length && (
                <span className="text-slate-400"> / 전체 {patients.length}명</span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 h-48 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard patients={filtered} />
        </div>
      )}
    </div>
  );
}
