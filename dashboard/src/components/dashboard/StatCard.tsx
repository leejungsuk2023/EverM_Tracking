import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    change: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    change: 'text-green-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-100 text-orange-600',
    change: 'text-orange-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    change: 'text-purple-600',
  },
};

export default function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <div className={`rounded-xl p-5 shadow-sm border border-gray-100 bg-white`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`mt-1 text-sm font-medium ${colors.change}`}>{change}</p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${colors.icon}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
