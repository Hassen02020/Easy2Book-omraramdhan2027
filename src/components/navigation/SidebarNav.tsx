import { useState } from 'react';
import {
  Archive,
  Blocks,
  ChevronDown,
  ChevronRight,
  Compass,
  FileCheck2,
  FileEdit,
  FilePlus2,
  Files,
  Film,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  MoonStar,
  Plane,
  Settings,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { REEL_PRESET_CATALOG } from '../../data/campaignData';
import { STUDIO_I18N } from '../../lib/i18n';
import type { CreatorLanguage, Page } from '../../types/creator';

export type StudioNavId =
  | 'dashboard'
  | 'all_pages'
  | 'create_page'
  | 'templates'
  | 'videos'
  | 'blocks'
  | 'media'
  | 'drafts'
  | 'published'
  | 'archives'
  | 'settings';

interface SidebarNavProps {
  activeNav: StudioNavId;
  language: CreatorLanguage;
  pages: Page[];
  activePageId?: string | null;
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
  onOpenPilotOrPage: (pageId: string, previewOnly?: boolean) => void;
}

export function SidebarNav({
  activeNav,
  language,
  pages,
  activePageId,
  counts,
  onSelectNav,
  onOpenPilotOrPage,
}: SidebarNavProps) {
  const t = STUDIO_I18N[language].nav;
  const [omraTreeOpen, setOmraTreeOpen] = useState(true);
  const [ramadanGroupOpen, setRamadanGroupOpen] = useState(true);
  const [egyptTreeOpen, setEgyptTreeOpen] = useState(true);
  const [turkeyTreeOpen, setTurkeyTreeOpen] = useState(true);
  const [visaTreeOpen, setVisaTreeOpen] = useState(true);
  const [flightsTreeOpen, setFlightsTreeOpen] = useState(true);

  const omraPages = pages.filter((p) => p.universe === 'omra');
  const ramadan2027Pages = omraPages.filter(
    (p) => (p.folderGroup || 'Ramadan 2027') === 'Ramadan 2027'
  );
  const otherOmraPages = omraPages.filter(
    (p) => (p.folderGroup || 'Ramadan 2027') !== 'Ramadan 2027'
  );
  const egyptPages = pages.filter(
    (p) =>
      p.id === 'page-excursions-egypte-easy2book' ||
      p.pilotRenderer === 'egypt_excursions_2026' ||
      p.folderGroup === 'Excursions Égypte'
  );
  const turkeyPages = pages.filter(
    (p) =>
      p.id === 'page-excursions-turquie-easy2book' ||
      p.pilotRenderer === 'turkey_excursions_2026' ||
      p.folderGroup === 'Excursions Turquie'
  );
  const visaPages = pages.filter(
    (p) =>
      p.id === 'page-visas-services-easy2book' ||
      p.pilotRenderer === 'visa_services_2026' ||
      p.universe === 'visa'
  );
  const flightsPages = pages.filter(
    (p) =>
      p.id === 'page-billetterie-avion-bateau-easy2book' ||
      p.pilotRenderer === 'flights_ferries_2026' ||
      p.folderGroup === 'Billetterie Avion & Bateau'
  );

  const items: {
    id: StudioNavId;
    label: string;
    icon: typeof LayoutDashboard;
    count?: number;
  }[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'all_pages', label: t.allPages, icon: Files, count: counts.all },
    { id: 'create_page', label: t.createPage, icon: FilePlus2 },
    { id: 'templates', label: t.templates, icon: LayoutTemplate, count: counts.templates },
    { id: 'videos', label: t.videosStudio, icon: Film, count: REEL_PRESET_CATALOG.length },
    { id: 'blocks', label: t.blockLibrary, icon: Blocks, count: counts.blocks },
    { id: 'media', label: t.mediaLibrary, icon: ImageIcon, count: counts.media },
    { id: 'drafts', label: t.drafts, icon: FileEdit, count: counts.drafts },
    { id: 'published', label: t.published, icon: FileCheck2, count: counts.published },
    { id: 'archives', label: t.archives, icon: Archive, count: counts.archives },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-e border-[#102D45]/10 bg-white flex flex-col justify-between overflow-y-auto">
      <div>
        <nav aria-label="Navigation du Creator" className="p-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id && !activePageId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNav(item.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#102D45] text-white shadow-xs'
                    : 'text-[#102D45]/75 hover:bg-[#F5F7FA] hover:text-[#102D45]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#E7B34C]' : 'text-[#1C4967]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span
                    className={`font-mono-tabular rounded-md px-1.5 py-0.5 text-[10px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-white/15 text-[#E7B34C]'
                        : 'bg-[#F5F7FA] text-[#1C4967]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Arborescence Module Omra -> Groupe Ramadan 2027 */}
        <div className="mx-3 mt-1 rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5">
          <button
            type="button"
            onClick={() => setOmraTreeOpen((o) => !o)}
            className="flex w-full items-center justify-between text-[11px] font-extrabold text-[#102D45]"
          >
            <span className="flex items-center gap-1.5">
              <MoonStar className="h-3.5 w-3.5 text-[#E7B34C]" />
              Arborescence · Module Omra
            </span>
            {omraTreeOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#1C4967]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#1C4967]" />
            )}
          </button>

          {omraTreeOpen && (
            <div className="mt-2 space-y-1.5 ps-1">
              {/* Groupe Ramadan 2027 */}
              <div>
                <button
                  type="button"
                  onClick={() => setRamadanGroupOpen((o) => !o)}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold text-[#1C4967] hover:bg-white"
                >
                  <FolderOpen className="h-3.5 w-3.5 text-[#E7B34C] shrink-0" />
                  <span className="truncate">Groupe Ramadan 2027</span>
                  <span className="ms-auto font-mono-tabular text-[10px] text-slate-500">
                    {ramadan2027Pages.length}
                  </span>
                </button>

                {ramadanGroupOpen && (
                  <div className="mt-1 space-y-1 border-s border-[#102D45]/15 ms-3 ps-2">
                    {ramadan2027Pages.map((pg) => {
                      const isCurrent = activePageId === pg.id;
                      return (
                        <button
                          key={pg.id}
                          type="button"
                          onClick={() => onOpenPilotOrPage(pg.id, pg.isPilotPage)}
                          className={`flex w-full flex-col rounded-lg px-2 py-1.5 text-start transition-colors ${
                            isCurrent
                              ? 'bg-[#102D45] text-white'
                              : 'bg-white text-[#102D45] hover:border-[#E7B34C] border border-[#102D45]/8'
                          }`}
                        >
                          <span className="flex items-center gap-1 text-[11px] font-bold leading-snug">
                            {pg.isPilotPage && (
                              <Star className="h-3 w-3 shrink-0 fill-[#E7B34C] text-[#E7B34C]" />
                            )}
                            <span className="truncate">{pg.title}</span>
                          </span>
                          {pg.isPilotPage && (
                            <span
                              className={`text-[9px] font-semibold ${
                                isCurrent ? 'text-[#E7B34C]' : 'text-[#1C4967]'
                              }`}
                            >
                              Page Pilote Complète
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Autres groupes Omra */}
              {otherOmraPages.length > 0 && (
                <div className="pt-1 border-t border-[#102D45]/10 space-y-1">
                  {otherOmraPages.map((pg) => (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => onOpenPilotOrPage(pg.id, false)}
                      className={`flex w-full flex-col rounded-lg px-2 py-1 text-start text-[11px] transition-colors ${
                        activePageId === pg.id
                          ? 'bg-[#102D45] text-white'
                          : 'text-[#1C4967] hover:bg-white'
                      }`}
                    >
                      <span className="text-[9px] opacity-75">
                        {pg.folderGroup || 'Autres départs'}
                      </span>
                      <span className="font-semibold truncate">{pg.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Arborescence Module Excursions Égypte */}
        {egyptPages.length > 0 && (
          <div className="mx-3 mt-2 rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5">
            <button
              type="button"
              onClick={() => setEgyptTreeOpen((o) => !o)}
              className="flex w-full items-center justify-between text-[11px] font-extrabold text-[#102D45]"
            >
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#E7B34C]" />
                Arborescence · Excursions Égypte
              </span>
              {egyptTreeOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#1C4967]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#1C4967]" />
              )}
            </button>

            {egyptTreeOpen && (
              <div className="mt-2 space-y-1 ps-1">
                {egyptPages.map((pg) => {
                  const isCurrent = activePageId === pg.id;
                  return (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => onOpenPilotOrPage(pg.id, pg.isPilotPage)}
                      className={`flex w-full flex-col rounded-lg px-2 py-1.5 text-start transition-colors ${
                        isCurrent
                          ? 'bg-[#102D45] text-white'
                          : 'bg-white text-[#102D45] hover:border-[#E7B34C] border border-[#102D45]/8'
                      }`}
                    >
                      <span className="flex items-center gap-1 text-[11px] font-bold leading-snug">
                        {pg.isPilotPage && (
                          <Star className="h-3 w-3 shrink-0 fill-[#E7B34C] text-[#E7B34C]" />
                        )}
                        <span className="truncate">{pg.title}</span>
                      </span>
                      {pg.isPilotPage && (
                        <span
                          className={`text-[9px] font-semibold ${
                            isCurrent ? 'text-[#E7B34C]' : 'text-[#1C4967]'
                          }`}
                        >
                          Page Pilote Complète
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Arborescence Module Excursions Turquie */}
        {turkeyPages.length > 0 && (
          <div className="mx-3 mt-2 rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5">
            <button
              type="button"
              onClick={() => setTurkeyTreeOpen((o) => !o)}
              className="flex w-full items-center justify-between text-[11px] font-extrabold text-[#102D45]"
            >
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#E7B34C]" />
                Arborescence · Excursions Turquie
              </span>
              {turkeyTreeOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#1C4967]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#1C4967]" />
              )}
            </button>

            {turkeyTreeOpen && (
              <div className="mt-2 space-y-1 ps-1">
                {turkeyPages.map((pg) => {
                  const isCurrent = activePageId === pg.id;
                  return (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => onOpenPilotOrPage(pg.id, pg.isPilotPage)}
                      className={`flex w-full flex-col rounded-lg px-2 py-1.5 text-start transition-colors ${
                        isCurrent
                          ? 'bg-[#102D45] text-white'
                          : 'bg-white text-[#102D45] hover:border-[#E7B34C] border border-[#102D45]/8'
                      }`}
                    >
                      <span className="flex items-center gap-1 text-[11px] font-bold leading-snug">
                        {pg.isPilotPage && (
                          <Star className="h-3 w-3 shrink-0 fill-[#E7B34C] text-[#E7B34C]" />
                        )}
                        <span className="truncate">{pg.title}</span>
                      </span>
                      {pg.isPilotPage && (
                        <span
                          className={`text-[9px] font-semibold ${
                            isCurrent ? 'text-[#E7B34C]' : 'text-[#1C4967]'
                          }`}
                        >
                          Page Pilote Complète
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Arborescence Module Services Visa */}
        {visaPages.length > 0 && (
          <div className="mx-3 mt-2 rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5">
            <button
              type="button"
              onClick={() => setVisaTreeOpen((o) => !o)}
              className="flex w-full items-center justify-between text-[11px] font-extrabold text-[#102D45]"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#E7B34C]" />
                Arborescence · Services Visa
              </span>
              {visaTreeOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#1C4967]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#1C4967]" />
              )}
            </button>

            {visaTreeOpen && (
              <div className="mt-2 space-y-1 ps-1">
                {visaPages.map((pg) => {
                  const isCurrent = activePageId === pg.id;
                  return (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => onOpenPilotOrPage(pg.id, pg.isPilotPage)}
                      className={`flex w-full flex-col rounded-lg px-2 py-1.5 text-start transition-colors ${
                        isCurrent
                          ? 'bg-[#102D45] text-white'
                          : 'bg-white text-[#102D45] hover:border-[#E7B34C] border border-[#102D45]/8'
                      }`}
                    >
                      <span className="flex items-center gap-1 text-[11px] font-bold leading-snug">
                        {pg.isPilotPage && (
                          <Star className="h-3 w-3 shrink-0 fill-[#E7B34C] text-[#E7B34C]" />
                        )}
                        <span className="truncate">{pg.title}</span>
                      </span>
                      {pg.isPilotPage && (
                        <span
                          className={`text-[9px] font-semibold ${
                            isCurrent ? 'text-[#E7B34C]' : 'text-[#1C4967]'
                          }`}
                        >
                          Page Pilote Complète
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Arborescence Module Billetterie Avion & Bateau */}
        {flightsPages.length > 0 && (
          <div className="mx-3 mt-2 rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5">
            <button
              type="button"
              onClick={() => setFlightsTreeOpen((o) => !o)}
              className="flex w-full items-center justify-between text-[11px] font-extrabold text-[#102D45]"
            >
              <span className="flex items-center gap-1.5">
                <Plane className="h-3.5 w-3.5 text-[#E7B34C]" />
                Arborescence · Billetterie Avion & Bateau
              </span>
              {flightsTreeOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#1C4967]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#1C4967]" />
              )}
            </button>

            {flightsTreeOpen && (
              <div className="mt-2 space-y-1 ps-1">
                {flightsPages.map((pg) => {
                  const isCurrent = activePageId === pg.id;
                  return (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => onOpenPilotOrPage(pg.id, pg.isPilotPage)}
                      className={`flex w-full flex-col rounded-lg px-2 py-1.5 text-start transition-colors ${
                        isCurrent
                          ? 'bg-[#102D45] text-white'
                          : 'bg-white text-[#102D45] hover:border-[#E7B34C] border border-[#102D45]/8'
                      }`}
                    >
                      <span className="flex items-center gap-1 text-[11px] font-bold leading-snug">
                        {pg.isPilotPage && (
                          <Star className="h-3 w-3 shrink-0 fill-[#E7B34C] text-[#E7B34C]" />
                        )}
                        <span className="truncate">{pg.title}</span>
                      </span>
                      {pg.isPilotPage && (
                        <span
                          className={`text-[9px] font-semibold ${
                            isCurrent ? 'text-[#E7B34C]' : 'text-[#1C4967]'
                          }`}
                        >
                          Page Pilote Complète
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="m-3 rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3.5 text-[11px] text-[#1C4967]">
        <p className="font-bold text-[#102D45]">Easy2Book Studio</p>
        <p className="mt-0.5 text-slate-600">Create. Publish. Convert.</p>
      </div>
    </aside>
  );
}
