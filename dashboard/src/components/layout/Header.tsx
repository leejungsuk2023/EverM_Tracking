'use client';

import { usePathname } from 'next/navigation';
import { Bell, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const PAGE_TITLE_KEYS: Record<string, string> = {
  '/': 'dashboard.title',
  '/pipeline': 'pipeline.title',
  '/patients': 'patients.title',
  '/calendar': 'calendar.title',
  '/followups': 'followup.title',
  '/workflow': 'nav.workflow',
};

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const titleKey = PAGE_TITLE_KEYS[pathname];
  const title = titleKey ? t(titleKey) : 'EverM';

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-6 bg-white border-b border-slate-200">
      <h1 className="text-base font-semibold text-slate-800">{title}</h1>

      {/* Right: language toggle + notification bell + user avatar */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 bg-slate-50">
          <Globe size={14} className="text-slate-400 mr-1" />
          <button
            onClick={() => setLang('en')}
            className={[
              'px-1.5 py-0.5 rounded text-xs font-medium transition-colors',
              lang === 'en'
                ? 'bg-blue-500 text-white'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            EN
          </button>
          <span className="text-slate-300 text-xs">|</span>
          <button
            onClick={() => setLang('ko')}
            className={[
              'px-1.5 py-0.5 rounded text-xs font-medium transition-colors',
              lang === 'ko'
                ? 'bg-blue-500 text-white'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            KO
          </button>
        </div>

        <button
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
          aria-label={t('header.notifications')}
        >
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 text-xs font-semibold">코</span>
          </div>
          <span className="hidden sm:block text-sm text-slate-700 font-medium">
            {t('header.coordinator')}
          </span>
        </div>
      </div>
    </header>
  );
}
