import { useState, type ReactNode } from 'react';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { STUDIO_I18N } from '../../lib/i18n';
import type { CreatorLanguage, CreatorNotification, Page } from '../../types/creator';
import { SidebarNav, type StudioNavId } from '../navigation/SidebarNav';
import { CreatorLogo } from '../shared-components/CreatorLogo';

interface CreatorLayoutProps {
  activeNav: StudioNavId;
  language: CreatorLanguage;
  pages: Page[];
  activePageId?: string | null;
  searchQuery: string;
  notifications: CreatorNotification[];
  counts: {
    all: number;
    drafts: number;
    published: number;
    archives: number;
    templates: number;
    blocks: number;
    media: number;
  };
  onSelectNav: (nav: StudioNavId) => void;
  onChangeLanguage: (lang: CreatorLanguage) => void;
  onChangeSearch: (query: string) => void;
  onSelectNotificationPage: (pageId: string) => void;
  onOpenPilotOrPage: (pageId: string, previewOnly?: boolean) => void;
  children: ReactNode;
}

export function CreatorLayout({
  activeNav,
  language,
  pages,
  activePageId,
  searchQuery,
  notifications,
  counts,
  onSelectNav,
  onChangeLanguage,
  onChangeSearch,
  onSelectNotificationPage,
  onOpenPilotOrPage,
  children,
}: CreatorLayoutProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = STUDIO_I18N[language];
  const isAr = language === 'ar';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#F5F7FA] text-[#102D45] flex flex-col ${
        isAr ? 'font-arabic' : ''
      }`}
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#102D45]/10 bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#102D45]/12 text-[#102D45] lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onSelectNav('dashboard')}
              className="text-start focus-visible:outline-none"
            >
              <CreatorLogo subtitle={t.studioTitle} />
            </button>
          </div>

          {/* Search Pages */}
          <div className="hidden md:flex flex-1 max-w-md items-center relative">
            <Search
              className={`pointer-events-none absolute ${
                isAr ? 'right-3' : 'left-3'
              } h-4 w-4 text-slate-400`}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                onChangeSearch(e.target.value);
                if (activeNav === 'dashboard' && e.target.value.trim().length > 0) {
                  onSelectNav('all_pages');
                }
              }}
              placeholder={t.searchPlaceholder}
              className={`w-full rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] py-2 ${
                isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
              } text-xs text-[#102D45] placeholder:text-slate-400 focus:border-[#1C4967] focus:bg-white focus:outline-none`}
            />
          </div>

          {/* Right Controls: Language FR/EN/AR, Notifications, Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="flex items-center rounded-lg border border-[#102D45]/12 bg-[#F5F7FA] p-0.5"
              role="group"
              aria-label="Langue du Studio"
            >
              {(['fr', 'en', 'ar'] as CreatorLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onChangeLanguage(lang)}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold uppercase transition-colors ${
                    language === lang
                      ? 'bg-[#102D45] text-white'
                      : 'text-[#1C4967] hover:text-[#102D45]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#102D45]/12 bg-white text-[#102D45] hover:bg-[#F5F7FA]"
                aria-label={t.notificationsTitle}
              >
                <Bell className="h-4 w-4 text-[#1C4967]" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E7B34C] text-[10px] font-bold text-[#102D45]">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div
                  className={`absolute top-11 z-50 w-80 rounded-2xl border border-[#102D45]/12 bg-white p-3 shadow-xl ${
                    isAr ? 'left-0' : 'right-0'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#102D45]/10 pb-2">
                    <span className="text-xs font-bold text-[#102D45]">
                      {t.notificationsTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-[#102D45]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-72 overflow-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          setNotifOpen(false);
                          if (n.pageId) onSelectNotificationPage(n.pageId);
                        }}
                        className="w-full rounded-xl border border-[#102D45]/8 bg-[#F5F7FA] p-2.5 text-start transition-colors hover:border-[#E7B34C]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#102D45]">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {n.timeLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                          {n.detail}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile (Demo) */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] px-2.5 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#102D45] text-[#E7B34C]">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-[#102D45] whitespace-nowrap">
                  Studio Easy2Book
                </p>
                <p className="text-[10px] text-slate-500 whitespace-nowrap">
                  {t.userRoleLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Shell */}
      <div className="flex flex-1 min-h-0">
        <div className="hidden lg:flex">
          <SidebarNav
            activeNav={activeNav}
            language={language}
            pages={pages}
            activePageId={activePageId}
            counts={counts}
            onSelectNav={onSelectNav}
            onOpenPilotOrPage={onOpenPilotOrPage}
          />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-[#102D45]/40">
            <div className="bg-white h-full overflow-y-auto">
              <SidebarNav
                activeNav={activeNav}
                language={language}
                pages={pages}
                activePageId={activePageId}
                counts={counts}
                onSelectNav={(nav) => {
                  onSelectNav(nav);
                  setMobileMenuOpen(false);
                }}
                onOpenPilotOrPage={(pageId, previewOnly) => {
                  onOpenPilotOrPage(pageId, previewOnly);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
            <button
              type="button"
              className="flex-1"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            />
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 lg:p-7 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
