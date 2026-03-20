'use client';

import { Patient } from '@/types/patient';
import { CreditCard, DollarSign } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface PaymentHistoryProps {
  patient: Patient;
}

function formatKRW(amount: number): string {
  return '₩' + amount.toLocaleString('ko-KR');
}

export default function PaymentHistory({ patient }: PaymentHistoryProps) {
  const { t } = useLanguage();

  const paid = patient.deposit_paid ? patient.deposit_amount : 0;
  const progress = patient.total_surgery_cost > 0
    ? Math.min(100, Math.round((paid / patient.total_surgery_cost) * 100))
    : 0;

  const paymentStatusKey = `payment.${patient.payment_status.toLowerCase()}`;
  const paymentColor =
    patient.payment_status === 'FULL' ? 'text-green-600' :
    patient.payment_status === 'PARTIAL' ? 'text-yellow-600' :
    'text-red-500';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">{t('patient.payment_history')}</h2>
        <span className={`text-sm font-medium ${paymentColor}`}>{t(paymentStatusKey)}</span>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2">
          <DollarSign size={15} className="text-slate-400" />
          <span className="text-xs sm:text-sm text-slate-500 w-20 sm:w-24">{t('payment.total')}</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-800">{formatKRW(patient.total_surgery_cost)}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={15} className="text-slate-400" />
          <span className="text-xs sm:text-sm text-slate-500 w-20 sm:w-24">{t('payment.deposit')}</span>
          <span className={`text-xs sm:text-sm font-semibold ${patient.deposit_paid ? 'text-green-600' : 'text-red-500'}`}>
            {patient.deposit_paid ? formatKRW(patient.deposit_amount) : t('payment.none')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={15} className="text-slate-400" />
          <span className="text-xs sm:text-sm text-slate-500 w-20 sm:w-24">{t('payment.exchange')}</span>
          <span className="text-xs sm:text-sm text-slate-700">{t(`exchange.${patient.exchange_method}`)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{t('payment.status')}</span>
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
