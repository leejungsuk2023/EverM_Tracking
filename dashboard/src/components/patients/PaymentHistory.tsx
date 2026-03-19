'use client';

import { Patient } from '@/types/patient';
import { CreditCard, DollarSign } from 'lucide-react';

interface PaymentHistoryProps {
  patient: Patient;
}

const EXCHANGE_METHOD_LABELS: Record<string, string> = {
  SELF: '자체 환전',
  TEAM_ARRANGED: '팀 환전 대행',
  CARD_PLUS_10PCT: '카드 결제 (+10%)',
};

const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NONE: { label: '미납', color: 'text-red-500' },
  PARTIAL: { label: '부분 납부', color: 'text-yellow-600' },
  FULL: { label: '완납', color: 'text-green-600' },
};

function formatKRW(amount: number): string {
  return '₩' + amount.toLocaleString('ko-KR');
}

export default function PaymentHistory({ patient }: PaymentHistoryProps) {
  const paid = patient.deposit_paid ? patient.deposit_amount : 0;
  const progress = patient.total_surgery_cost > 0
    ? Math.min(100, Math.round((paid / patient.total_surgery_cost) * 100))
    : 0;

  const statusInfo = PAYMENT_STATUS_LABELS[patient.payment_status];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">결제 이력</h2>
        <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2">
          <DollarSign size={15} className="text-slate-400" />
          <span className="text-sm text-slate-500 w-24">총 수술 비용</span>
          <span className="text-sm font-semibold text-slate-800">{formatKRW(patient.total_surgery_cost)}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={15} className="text-slate-400" />
          <span className="text-sm text-slate-500 w-24">보증금</span>
          <span className={`text-sm font-semibold ${patient.deposit_paid ? 'text-green-600' : 'text-red-500'}`}>
            {patient.deposit_paid ? formatKRW(patient.deposit_amount) : '미납'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={15} className="text-slate-400" />
          <span className="text-sm text-slate-500 w-24">환전 방식</span>
          <span className="text-sm text-slate-700">{EXCHANGE_METHOD_LABELS[patient.exchange_method]}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>결제 진행률</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{formatKRW(paid)}</span>
          <span>{formatKRW(patient.total_surgery_cost)}</span>
        </div>
      </div>
    </div>
  );
}
