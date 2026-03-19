'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllFollowups, toggleFollowupComplete } from '@/lib/supabase-queries';
import { Followup, Patient, SURGERY_TYPE_LABELS, FOLLOWUP_RULES, SurgeryType } from '@/types/patient';
import { ClipboardCheck, Calendar, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

type FollowupWithPatient = Followup & { patient: Patient };
type FilterTab = 'all' | 'today' | 'week' | 'overdue' | 'completed';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekEnd(): string {
  const d = new Date();
  d.setDate(d.getDate() + 6);
  return d.toISOString().split('T')[0];
}

function calcDaysAfterSurgery(surgeryDate: string, scheduledDate: string): string {
  const surgery = new Date(surgeryDate);
  const scheduled = new Date(scheduledDate);
  const diff = Math.round((scheduled.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24));
  return `D+${diff}`;
}

function isOverdue(followup: FollowupWithPatient, today: string): boolean {
  return !followup.completed && followup.scheduled_date < today;
}

function isToday(followup: FollowupWithPatient, today: string): boolean {
  return followup.scheduled_date === today;
}

function isThisWeek(followup: FollowupWithPatient, today: string, weekEnd: string): boolean {
  return followup.scheduled_date >= today && followup.scheduled_date <= weekEnd;
}

function getPrecaution(surgeryType: SurgeryType, surgeryDate: string, scheduledDate: string, lang: string): string | undefined {
  const rules = FOLLOWUP_RULES[surgeryType];
  const surgery = new Date(surgeryDate);
  const scheduled = new Date(scheduledDate);
  const diff = Math.round((scheduled.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24));
  const rule = rules.find((r) => r.days === diff);
  if (!rule) return undefined;
  return lang === 'ko' ? rule.precautionKo : rule.precaution;
}

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<FollowupWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [memoEdits, setMemoEdits] = useState<Record<string, string>>({});
  const [expandedPrecautions, setExpandedPrecautions] = useState<Record<string, boolean>>({});

  function togglePrecaution(id: string) {
    setExpandedPrecautions(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const { t, lang } = useLanguage();
  const today = getToday();
  const weekEnd = getWeekEnd();

  const fetchFollowups = useCallback(async () => {
    try {
      const data = await getAllFollowups();
      setFollowups(data);
    } catch {
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  const todayCount = followups.filter((f) => isToday(f, today)).length;
  const weekCount = followups.filter((f) => isThisWeek(f, today, weekEnd)).length;
  const overdueCount = followups.filter((f) => isOverdue(f, today)).length;

  const filteredFollowups = followups.filter((f) => {
    if (activeFilter === 'today') return isToday(f, today);
    if (activeFilter === 'week') return isThisWeek(f, today, weekEnd);
    if (activeFilter === 'overdue') return isOverdue(f, today);
    if (activeFilter === 'completed') return f.completed;
    return true;
  });

  async function handleToggleComplete(followup: FollowupWithPatient) {
    const newCompleted = !followup.completed;
    setFollowups((prev) =>
      prev.map((f) =>
        f.followup_id === followup.followup_id
          ? { ...f, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
          : f
      )
    );
    try {
      await toggleFollowupComplete(followup.followup_id, newCompleted);
    } catch {
      setFollowups((prev) =>
        prev.map((f) =>
          f.followup_id === followup.followup_id
            ? { ...f, completed: followup.completed, completed_at: followup.completed_at }
            : f
        )
      );
    }
  }

  async function handleMemoBlur(followup: FollowupWithPatient) {
    const memo = memoEdits[followup.followup_id];
    if (memo === undefined || memo === followup.notes) return;
    setFollowups((prev) =>
      prev.map((f) =>
        f.followup_id === followup.followup_id ? { ...f, notes: memo } : f
      )
    );
    try {
      await toggleFollowupComplete(followup.followup_id, followup.completed, memo);
    } catch {
      // revert on error
      setFollowups((prev) =>
        prev.map((f) =>
          f.followup_id === followup.followup_id ? { ...f, notes: followup.notes } : f
        )
      );
    }
  }

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('followup.all') },
    { key: 'today', label: t('followup.today') },
    { key: 'week', label: t('followup.this_week') },
    { key: 'overdue', label: t('followup.overdue') },
    { key: 'completed', label: t('followup.completed') },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('followup.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t('followup.subtitle')}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            onClick={() => setActiveFilter('today')}
            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-md ${
              activeFilter === 'today' ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Calendar size={22} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{todayCount}</p>
              <p className="text-sm text-gray-600">{t('followup.today')}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveFilter('week')}
            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-md ${
              activeFilter === 'week' ? 'border-green-400 bg-green-50 ring-2 ring-green-300' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <ClipboardCheck size={22} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{weekCount}</p>
              <p className="text-sm text-gray-600">{t('followup.this_week')}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveFilter('overdue')}
            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-md ${
              activeFilter === 'overdue' ? 'border-red-400 bg-red-50 ring-2 ring-red-300' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle size={22} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{overdueCount}</p>
              <p className="text-sm text-gray-600">{t('followup.overdue')}</p>
            </div>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeFilter === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400">
            {t('common.loading')}
          </div>
        ) : filteredFollowups.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <CheckCircle2 size={36} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500">{t('followup.empty')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 text-left">{t('followup.patient')}</th>
                  <th className="px-4 py-3 text-left">{t('followup.surgery_type')}</th>
                  <th className="px-4 py-3 text-center">{t('followup.fu_number')}</th>
                  <th className="px-4 py-3 text-left">{t('followup.scheduled')}</th>
                  <th className="px-4 py-3 text-center">D+X</th>
                  <th className="px-4 py-3 text-left">{t('followup.precaution')}</th>
                  <th className="px-4 py-3 text-center">{t('followup.status')}</th>
                  <th className="px-4 py-3 text-left">{t('followup.memo')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredFollowups.map((followup) => {
                  const overdue = isOverdue(followup, today);
                  const precaution = getPrecaution(
                    followup.patient.surgery_type,
                    followup.patient.surgery_date,
                    followup.scheduled_date,
                    lang
                  );
                  const surgery = new Date(followup.patient.surgery_date);
                  const scheduled = new Date(followup.scheduled_date);
                  const daysDiff = Math.round((scheduled.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24));
                  const isCritical = daysDiff >= 1 && daysDiff <= 3;
                  const rowClass = followup.completed
                    ? 'bg-green-50'
                    : overdue
                    ? 'bg-red-50'
                    : precaution
                    ? 'bg-amber-50'
                    : 'bg-white';

                  return (
                    <tr key={followup.followup_id} className={`${rowClass} transition-colors hover:brightness-95`}>
                      {/* 환자명 */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/patients/${followup.patient_id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {followup.patient.k_name}
                        </Link>
                      </td>

                      {/* 수술 유형 뱃지 */}
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {SURGERY_TYPE_LABELS[followup.patient.surgery_type]}
                        </span>
                      </td>

                      {/* F/U 번호 */}
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-gray-700">#{followup.followup_number}</span>
                      </td>

                      {/* 예정일 */}
                      <td className="px-4 py-3">
                        <span className={followup.completed ? 'line-through text-gray-400' : ''}>
                          {followup.scheduled_date}
                        </span>
                      </td>

                      {/* D+X */}
                      <td className="px-4 py-3 text-center text-gray-500">
                        {calcDaysAfterSurgery(followup.patient.surgery_date, followup.scheduled_date)}
                      </td>

                      {/* 주의사항 */}
                      <td className="px-4 py-3 max-w-[200px]">
                        {precaution ? (
                          <div>
                            <button
                              onClick={() => togglePrecaution(followup.followup_id)}
                              className={`flex items-center gap-1 text-xs font-medium ${
                                isCritical ? 'text-red-600' : 'text-amber-600'
                              }`}
                            >
                              <AlertTriangle size={12} className="flex-shrink-0" />
                              <span className="truncate max-w-[160px]">
                                {expandedPrecautions[followup.followup_id]
                                  ? t('followup.precaution')
                                  : precaution.slice(0, 40) + (precaution.length > 40 ? '…' : '')}
                              </span>
                            </button>
                            {expandedPrecautions[followup.followup_id] && (
                              <p className={`mt-1 text-xs leading-relaxed ${
                                isCritical ? 'text-red-600' : 'text-amber-700'
                              }`}>
                                {precaution}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </td>

                      {/* 상태 체크박스 + 뱃지 */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="checkbox"
                            checked={followup.completed}
                            onChange={() => handleToggleComplete(followup)}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-green-500"
                          />
                          {overdue && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                              {t('followup.overdue_badge')}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 메모 인라인 입력 */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={memoEdits[followup.followup_id] ?? followup.notes ?? ''}
                          onChange={(e) =>
                            setMemoEdits((prev) => ({ ...prev, [followup.followup_id]: e.target.value }))
                          }
                          onBlur={() => handleMemoBlur(followup)}
                          placeholder={t('followup.memo_placeholder')}
                          className="w-full min-w-[120px] rounded border border-transparent bg-transparent px-1 py-0.5 text-sm text-gray-600 placeholder-gray-300 outline-none transition hover:border-gray-200 focus:border-blue-300 focus:bg-white focus:ring-1 focus:ring-blue-200"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
