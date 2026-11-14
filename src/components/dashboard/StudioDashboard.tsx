import {
  ArrowRight,
  Blocks,
  Building2,
  CalendarClock,
  Edit3,
  Eye,
  FilePlus2,
  Globe2,
  Layers,
  MoonStar,
  Plane,
  ShieldCheck,
} from 'lucide-react';
import { STUDIO_I18N } from '../../lib/i18n';
import { getHeroImageSrc } from '../../lib/mediaRegistry';
import type {
  BusinessUniverse,
  CreatorLanguage,
  Page,
  PageTemplate,
} from '../../types/creator';
import { StatusBadge, UniverseTag } from '../shared-components/StatusBadge';
import type { StudioNavId } from '../navigation/SidebarNav';

interface StudioDashboardProps {
  language: CreatorLanguage;
  pages: Page[];
  templates: PageTemplate[];
  onNavigate: (nav: StudioNavId) => void;
  onStartUniversePage: (universe: BusinessUniverse) => void;
  onOpenEditor: (pageId: string) => void;
  onPreviewPage: (pageId: string) => void;
  onSelectTemplate: (template: PageTemplate) => void;
}

const UNIVERSE_META: {
  id: BusinessUniverse;
  icon: typeof MoonStar;
  accentBg: string;
}[] = [
  { id: 'omra', icon: MoonStar, accentBg: 'bg-[#E7B34C]/18 text-[#102D45]' },
  { id: 'voyages', icon: Plane, accentBg: 'bg-[#1C4967]/12 text-[#1C4967]' },
  { id: 'hotels_tunisie', icon: Building2, accentBg: 'bg-teal-50 text-teal-900' },
  { id: 'visa', icon: ShieldCheck, accentBg: 'bg-indigo-50 text-indigo-900' },
];

export function StudioDashboard({
  language,
  pages,
  templates,
  onNavigate,
  onStartUniversePage,
  onOpenEditor,
  onPreviewPage,
  onSelectTemplate,
}: StudioDashboardProps) {
  const t = STUDIO_I18N[language];

  const nowMs = Date.now();
  const sevenDaysMs = 7 * 86400 * 1000;
  const thirtyDaysMs = 30 * 86400 * 1000;

  const publishedCount = pages.filter((p) => p.publication.status === 'published').length;
  const draftsCount = pages.filter(
    (p) => p.publication.status === 'draft' || p.publication.status === 'in_review'
  ).length;
  const scheduledCount = pages.filter((p) => p.publication.status === 'scheduled').length;
  const expiringSoonCount = pages.filter((p) => {
    if (p.publication.status === 'expired') return true;
    if (!p.publication.expiresAt) return false;
    const exp = new Date(p.publication.expiresAt).getTime();
    return exp > nowMs && exp - nowMs <= thirtyDaysMs;
  }).length;
  const recentlyModifiedCount = pages.filter(
    (p) => nowMs - new Date(p.updatedAt).getTime() <= sevenDaysMs
  ).length;

  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const kpiCards = [
    { label: t.kpis.totalPages, value: pages.length, accent: 'text-[#102D45]' },
    { label: t.kpis.publishedPages, value: publishedCount, accent: 'text-emerald-700' },
    { label: t.kpis.drafts, value: draftsCount, accent: 'text-[#1C4967]' },
    { label: t.kpis.scheduledPages, value: scheduledCount, accent: 'text-sky-700' },
    { label: t.kpis.expiringSoon, value: expiringSoonCount, accent: 'text-amber-700' },
    { label: t.kpis.recentlyModified, value: recentlyModifiedCount, accent: 'text-[#102D45]' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Studio Welcome Header */}
      <section className="rounded-2xl bg-[#102D45] p-6 md:p-8 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold text-[#E7B34C]">
              <span>{t.signature}</span>
              <span>·</span>
              <span>{t.demoBadge}</span>
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              {t.studioTitle}
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-200 leading-relaxed">
              {t.studioSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('create_page')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E7B34C] px-4 py-2.5 text-xs font-bold text-[#102D45] transition-colors hover:bg-[#f1c468] whitespace-nowrap shrink-0"
            >
              <FilePlus2 className="h-4 w-4" />
              {t.actions.newPage}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/15 whitespace-nowrap shrink-0"
            >
              <Layers className="h-4 w-4 text-[#E7B34C]" />
              {t.nav.templates}
            </button>
          </div>
        </div>
      </section>

      {/* Creator-only KPIs (explicitly labeled demo data) */}
      <section aria-label="Indicateurs du Creator">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[#102D45]">
            Indicateurs du Studio
          </h2>
          <span className="text-[11px] font-medium text-slate-500">
            {t.demoBadge} · Indicateurs propres aux pages
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kpiCards.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#102D45]/10 bg-white p-4 shadow-2xs"
            >
              <p className="text-[11px] font-medium text-slate-500 leading-snug">
                {kpi.label}
              </p>
              <p className={`mt-2 font-mono-tabular text-2xl font-extrabold ${kpi.accent}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Creation Universes */}
      <section aria-label="Quatre univers de création">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#102D45]">
            Les quatre univers de création
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('blocks')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C4967] hover:text-[#102D45]"
          >
            <Blocks className="h-3.5 w-3.5" />
            {t.nav.blockLibrary} (44)
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {UNIVERSE_META.map((u) => {
            const Icon = u.icon;
            const info = t.universes[u.id];
            const universePages = pages.filter((p) => p.universe === u.id);
            const universePublished = universePages.filter(
              (p) => p.publication.status === 'published'
            ).length;

            return (
              <div
                key={u.id}
                className="flex flex-col justify-between rounded-2xl border border-[#102D45]/10 bg-white p-5 shadow-2xs transition-all hover:border-[#E7B34C]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${u.accentBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono-tabular text-[11px] font-semibold text-slate-500">
                      {universePages.length} pages · {universePublished} en ligne
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#102D45]">
                    {info.label}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {info.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartUniversePage(u.id)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2.5 text-xs font-bold text-[#102D45] transition-colors hover:bg-[#102D45] hover:text-white"
                >
                  <span>{info.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Arborescence Omra : Groupe Ramadan 2027 (Page Pilote) */}
      {(() => {
        const pilotPage = pages.find(
          (p) => p.isPilotPage || p.id === 'page-omra-ramadan-2027'
        );
        if (!pilotPage) return null;
        return (
          <section className="rounded-2xl border border-[#E7B34C]/60 bg-white p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#C8922A]">
                  Arborescence Module Omra › Groupe {pilotPage.folderGroup || 'Ramadan 2027'} · Page Pilote
                </p>
                <h2 className="text-lg font-extrabold text-[#102D45]">
                  {pilotPage.title}
                </h2>
                <p className="text-xs text-slate-600">
                  Page pilote conservée intégralement avec vidéo 9:16, voix tunisienne Gemini TTS, tarifs 5,900 / 6,400 / 6,900 د.ت, remise famille 200 د.ت, compte à rebours, témoignages et WhatsApp Business 98140514.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onPreviewPage(pilotPage.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B34C] px-4 py-2.5 text-xs font-bold text-[#102D45] hover:bg-[#f0c264]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Ouvrir la Page Pilote
                </button>
                <button
                  type="button"
                  onClick={() => onOpenEditor(pilotPage.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
                >
                  <Edit3 className="h-3.5 w-3.5 text-[#E7B34C]" />
                  Ouvrir dans l’éditeur
                </button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Recent Pages & Quick Actions / Templates */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Modified Pages */}
        <section className="lg:col-span-7 rounded-2xl border border-[#102D45]/10 bg-white p-5">
          <div className="flex items-center justify-between border-b border-[#102D45]/10 pb-3">
            <h2 className="text-sm font-bold text-[#102D45]">
              Dernières pages modifiées
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('all_pages')}
              className="text-xs font-semibold text-[#1C4967] hover:underline"
            >
              {t.nav.allPages}
            </button>
          </div>

          <div className="mt-3 divide-y divide-[#102D45]/8">
            {recentPages.map((pg) => (
              <div
                key={pg.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[#102D45] truncate">
                      {pg.title}
                    </p>
                    <StatusBadge
                      status={pg.publication.status}
                      language={language}
                    />
                    <UniverseTag universe={pg.universe} language={language} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="font-mono">/p/{pg.seo.slug}</span>
                    <span className="inline-flex items-center gap-1">
                      <Globe2 className="h-3 w-3" />
                      {pg.language.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {pg.updatedAt.slice(0, 10)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onPreviewPage(pg.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#102D45]/12 px-2.5 py-1.5 text-xs font-semibold text-[#1C4967] hover:bg-[#F5F7FA]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {t.actions.preview}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenEditor(pg.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#102D45] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1C4967]"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-[#E7B34C]" />
                    {t.actions.edit}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Templates + Quick Actions */}
        <section className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-[#102D45]/10 bg-white p-5">
            <h2 className="text-sm font-bold text-[#102D45]">Actions rapides</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('create_page')}
                className="rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] p-3 text-start hover:border-[#E7B34C]"
              >
                <p className="text-xs font-bold text-[#102D45]">Nouvelle page</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Depuis un modèle
                </p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('media')}
                className="rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] p-3 text-start hover:border-[#E7B34C]"
              >
                <p className="text-xs font-bold text-[#102D45]">Médiathèque</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Visuels Easy2Book
                </p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('drafts')}
                className="rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] p-3 text-start hover:border-[#E7B34C]"
              >
                <p className="text-xs font-bold text-[#102D45]">
                  Reprendre brouillons
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {draftsCount} en cours
                </p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] p-3 text-start hover:border-[#E7B34C]"
              >
                <p className="text-xs font-bold text-[#102D45]">Contrats CRM</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Endpoint & Schéma
                </p>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#102D45]/10 bg-white p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#102D45]/10">
              <h2 className="text-sm font-bold text-[#102D45]">
                Modèles disponibles
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('templates')}
                className="text-xs font-semibold text-[#1C4967] hover:underline"
              >
                Voir les {templates.length}
              </button>
            </div>
            <div className="mt-3 space-y-2.5">
              {templates.slice(0, 4).map((tpl) => (
                <div
                  key={tpl.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#102D45]/8 p-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getHeroImageSrc(tpl.previewImageKey)}
                      alt={tpl.name}
                      className="h-11 w-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#102D45] truncate">
                        {tpl.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {tpl.styleTag} · {tpl.supportedLanguages.join(' / ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tpl)}
                    className="rounded-lg bg-[#F5F7FA] px-2.5 py-1.5 text-[11px] font-bold text-[#102D45] hover:bg-[#E7B34C] shrink-0"
                  >
                    Utiliser
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
