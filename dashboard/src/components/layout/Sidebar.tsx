'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  Users,
  Calendar,
  ClipboardCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/pipeline', label: '환자 파이프라인', icon: Kanban },
  { href: '/patients', label: '환자 목록', icon: Users },
  { href: '/followups', label: '팔로업 관리', icon: ClipboardCheck },
  { href: '/calendar', label: '수술 캘린더', icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-30 h-full w-64 flex flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">EM</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">EverM Clinic</p>
          <p className="text-xs text-slate-400 leading-tight">Medical Coordinator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              ].join(' ')}
            >
              <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">EverM Dashboard v0.1</p>
      </div>
    </aside>
  );
}
