'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  Users,
  Calendar,
  ClipboardCheck,
  BookOpen,
  X,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const NAV_ITEMS = [
  { href: '/', key: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/pipeline', key: 'nav.pipeline', icon: Kanban },
  { href: '/patients', key: 'nav.patients', icon: Users },
  { href: '/followups', key: 'nav.followups', icon: ClipboardCheck },
  { href: '/calendar', key: 'nav.calendar', icon: Calendar },
  { href: '/workflow', key: 'nav.workflow', icon: BookOpen },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const sidebarContent = (
    <aside className="h-full w-64 flex flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">EM</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white leading-tight">EverM Clinic</p>
          <p className="text-xs text-slate-400 leading-tight">Medical Coordinator</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded text-slate-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              ].join(' ')}
            >
              <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
              {t(key)}
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

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 z-30 h-full w-64">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onClose}
          />
          {/* Sidebar panel */}
          <div
            className={[
              'relative flex w-64 flex-col transition-transform duration-300',
              isOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
