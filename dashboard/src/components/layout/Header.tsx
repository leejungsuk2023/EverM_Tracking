'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': '대시보드',
  '/pipeline': '환자 파이프라인',
  '/patients': '환자 목록',
  '/calendar': '수술 캘린더',
};

export default function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'EverM';

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-6 bg-white border-b border-slate-200">
      <h1 className="text-base font-semibold text-slate-800">{title}</h1>

      {/* Right: notification bell + user avatar */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 text-xs font-semibold">코</span>
          </div>
          <span className="hidden sm:block text-sm text-slate-700 font-medium">코디네이터</span>
        </div>
      </div>
    </header>
  );
}
