'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Patient, Followup, SurgeryType } from '@/types/patient';
import DayDetail from './DayDetail';

const SURGERY_TYPE_COLORS: Record<SurgeryType, string> = {
  '2JAW_SSRO': 'bg-blue-100 text-blue-700',
  '2JAW_IVRO': 'bg-purple-100 text-purple-700',
  'VLINE': 'bg-pink-100 text-pink-700',
  'CONTOURING': 'bg-green-100 text-green-700',
  'ASO': 'bg-orange-100 text-orange-700',
};

const SURGERY_TYPE_LABELS: Record<SurgeryType, string> = {
  '2JAW_SSRO': 'SSRO',
  '2JAW_IVRO': 'IVRO',
  'VLINE': 'V라인',
  'CONTOURING': '윤곽',
  'ASO': 'ASO',
};

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

type ViewMode = 'month' | 'week';

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // go to Sunday
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function dateToKey(date: Date): string {
  return toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

interface DayCell {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
}

interface SurgeryCalendarProps {
  patients: Patient[];
  followups: (Followup & { patient: Patient })[];
}

export default function SurgeryCalendar({ patients, followups }: SurgeryCalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Build lookup maps: date string -> patients / followups
  const surgeryMap: Record<string, Patient[]> = {};
  for (const patient of patients) {
    const sd = patient.surgery_date;
    if (!surgeryMap[sd]) surgeryMap[sd] = [];
    surgeryMap[sd].push(patient);
  }

  const followupMap: Record<string, (Followup & { patient: Patient })[]> = {};
  for (const fu of followups) {
    const sd = fu.scheduled_date;
    if (!followupMap[sd]) followupMap[sd] = [];
    followupMap[sd].push(fu);
  }

  const todayKey = dateToKey(today);

  // --- Month view navigation ---
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  // --- Week view navigation ---
  const goToPrevWeek = () => {
    setWeekStart((d) => addDays(d, -7));
    setSelectedDate(null);
  };

  const goToNextWeek = () => {
    setWeekStart((d) => addDays(d, 7));
    setSelectedDate(null);
  };

  // --- Month grid cells ---
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthCells: (DayCell | null)[] = [];
  for (let i = 0; i < firstDay; i++) monthCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    monthCells.push({ date, dateKey: dateToKey(date), isCurrentMonth: true });
  }
  while (monthCells.length % 7 !== 0) monthCells.push(null);

  // --- Week grid cells ---
  const weekDays: DayCell[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return { date, dateKey: dateToKey(date), isCurrentMonth: true };
  });

  const weekLabel = (() => {
    const end = addDays(weekStart, 6);
    const startStr = weekStart.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    const endStr = end.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    return `${weekStart.getFullYear()}년 ${startStr} – ${endStr}`;
  })();

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedDateKey = selectedDate ? dateToKey(selectedDate) : null;
  const selectedSurgeryPatients = selectedDateKey ? (surgeryMap[selectedDateKey] ?? []) : [];
  const selectedFollowups = selectedDateKey ? (followupMap[selectedDateKey] ?? []) : [];

  const renderDayCell = (cell: DayCell | null, idx: number, minHeight: string = 'min-h-[100px]') => {
    if (cell === null) {
      return <div key={`empty-${idx}`} className={`${minHeight} bg-gray-50/50`} />;
    }

    const { date, dateKey } = cell;
    const surgeries = surgeryMap[dateKey] ?? [];
    const dayFollowups = followupMap[dateKey] ?? [];
    const isToday = dateKey === todayKey;
    const hasEvents = surgeries.length > 0 || dayFollowups.length > 0;
    const colIdx = idx % 7;

    return (
      <div
        key={dateKey}
        onClick={() => handleDayClick(date)}
        className={[
          `${minHeight} p-1.5 cursor-pointer transition-colors border-b border-gray-50`,
          hasEvents ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'hover:bg-gray-50',
        ].join(' ')}
      >
        <div className="flex justify-end mb-1">
          <span
            className={[
              'w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold',
              isToday
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : colIdx === 0
                ? 'text-red-400'
                : colIdx === 6
                ? 'text-blue-400'
                : 'text-gray-700',
            ].join(' ')}
          >
            {date.getDate()}
          </span>
        </div>
        <div className="space-y-0.5">
          {surgeries.map((p) => (
            <div
              key={p.patient_id}
              className={`text-[10px] font-medium px-1 py-0.5 rounded truncate ${SURGERY_TYPE_COLORS[p.surgery_type]}`}
            >
              {p.k_name} · {SURGERY_TYPE_LABELS[p.surgery_type]}
            </div>
          ))}
          {dayFollowups.map((fu) => (
            <div
              key={fu.followup_id}
              className={`text-[10px] font-medium px-1 py-0.5 rounded truncate ${
                fu.completed
                  ? 'bg-gray-50 text-gray-300 line-through'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              F/U #{fu.followup_number} {fu.patient.k_name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header: navigation + view toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={viewMode === 'month' ? goToPrevMonth : goToPrevWeek}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base font-semibold text-gray-900 min-w-[180px] text-center">
            {viewMode === 'month'
              ? `${currentYear}년 ${currentMonth + 1}월`
              : weekLabel}
          </h2>
          <button
            onClick={viewMode === 'month' ? goToNextMonth : goToNextWeek}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('month')}
            className={[
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              viewMode === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            월간
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={[
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              viewMode === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            주간
          </button>
        </div>
      </div>

      {/* Day labels row */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`py-2 text-center text-xs font-semibold tracking-wide ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {viewMode === 'month' ? (
        <div className="grid grid-cols-7 divide-x divide-gray-50">
          {monthCells.map((cell, idx) => renderDayCell(cell, idx, 'min-h-[100px]'))}
        </div>
      ) : (
        <div className="grid grid-cols-7 divide-x divide-gray-50">
          {weekDays.map((cell, idx) => renderDayCell(cell, idx, 'min-h-[160px]'))}
        </div>
      )}

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-3">
        {(Object.entries(SURGERY_TYPE_COLORS) as [SurgeryType, string][]).map(([type, colorClass]) => (
          <span key={type} className={`text-[11px] px-2 py-0.5 rounded font-medium ${colorClass}`}>
            {SURGERY_TYPE_LABELS[type]}
          </span>
        ))}
        <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-gray-100 text-gray-500">
          팔로업
        </span>
      </div>

      {/* Day detail panel */}
      {selectedDate && (
        <DayDetail
          date={selectedDate}
          surgeryPatients={selectedSurgeryPatients}
          followups={selectedFollowups}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
