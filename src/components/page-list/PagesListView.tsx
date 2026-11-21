import { useState } from 'react';
import {
  Archive,
  Copy,
  Edit3,
  Eye,
  FileDown,
  FilePlus2,
  Globe2,
  Rocket,
  Undo2,
} from 'lucide-react';
import { STUDIO_I18N } from '../../lib/i18n';
import type {
  BusinessUniverse,
  CreatorLanguage,
  Page,
  PageStatus,
} from '../../types/creator';
import { SocialPosterControl } from '../shared-components/SocialPosterControl';
import { StatusBadge, UniverseTag } from '../shared-components/StatusBadge';

export type PageListFilterMode = 'all' | 'drafts' | 'published' | 'archives';

interface PagesListViewProps {
  mode: PageListFilterMode;
  language: CreatorLanguage;
  pages: Page[];
  searchQuery: string;
  onCreateNew: () => void;
  onOpenEditor: (pageId: string) => void;
  onPreviewPage: (pageId: string) => void;
  onDownloadPdf: (pageId: string) => void;
  onPublishPage: (pageId: string) => void;
  onUnpublishPage: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  onArchivePage: (pageId: string) => void;
}

export function PagesListView({
  mode,
  language,
  pages,
  searchQuery,
  onCreateNew,
  onOpenEditor,
  onPreviewPage,
  onDownloadPdf,
  onPublishPage,
  onUnpublishPage,
  onDuplicatePage,
  onArchivePage,
}: PagesListViewProps) {
  const t = STUDIO_I18N[language];
  const [universeFilter, setUniverseFilter] = useState<BusinessUniverse | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PageStatus | 'all'>('all');

  const q = searchQuery.trim().toLowerCase();

  const filtered = pages.filter((p) => {
    if (mode === 'drafts') {
      if (p.publication.status !== 'draft' && p.publication.status !== 'in_review') {
        return false;
      }
    } else if (mode === 'published') {
      if (p.publication.status !== 'published' && p.publication.status !== 'scheduled') {
        return false;
      }
    } else if (mode === 'archives') {
      if (p.publication.status !== 'archived' && p.publication.status !== 'expired') {
        return false;
      }
    }

    if (universeFilter !== 'all' && p.universe !== universeFilter) return false;
    if (mode === 'all' && statusFilter !== 'all' && p.publication.status !== statusFilter) {
      return false;
    }

    if (q) {
      const hay = `${p.title} ${p.seo.slug} ${p.offerRef.displayLabel} ${p.offerRef.offerCode}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const headingByMode: Record<PageListFilterMode, string> = {
    all: t.nav.allPages,
    drafts: t.nav.drafts,
    published: t.nav.published,
    archives: t.nav.archives,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#102D45]">
            {headingByMode[mode]}
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            {filtered.length} page(s) affichée(s) · {t.demoBadge}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
        >
          <FilePlus2 className="h-4 w-4 text-[#E7B34C]" />
          {t.actions.newPage}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#102D45]/10 bg-white p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'omra', 'voyages', 'hotels_tunisie', 'visa'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUniverseFilter(u)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                universeFilter === u
                  ? 'bg-[#102D45] text-white'
                  : 'bg-[#F5F7FA] text-[#1C4967] hover:text-[#102D45]'
              }`}
            >
              {u === 'all' ? 'Tous univers' : t.universes[u].label}
            </button>
          ))}
        </div>

        {mode === 'all' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PageStatus | 'all')}
            className="ms-auto rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs font-semibold text-[#102D45]"
          >
            <option value="all">Tous les statuts</option>
            {(
              ['draft', 'in_review', 'scheduled', 'published', 'expired', 'archived'] as PageStatus[]
            ).map((st) => (
              <option key={st} value={st}>
                {t.statuses[st]}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Pages Grid / List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#102D45]/20 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-[#102D45]">
            Aucune page ne correspond aux filtres actifs.
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#E7B34C] px-4 py-2 text-xs font-bold text-[#102D45]"
          >
            <FilePlus2 className="h-4 w-4" />
            {t.actions.newPage}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pg) => {
            const isPublished = pg.publication.status === 'published';
            const isArchived = pg.publication.status === 'archived';
            return (
              <article
                key={pg.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#102D45]/10 bg-white p-5 transition-colors hover:border-[#E7B34C]"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-[#102D45]">
                      {pg.title}
                    </h2>
                    {pg.isPilotPage && (
                      <span className="rounded-md bg-[#E7B34C]/25 px-2 py-0.5 text-[10px] font-extrabold text-[#102D45]">
                        Page Pilote
                      </span>
                    )}
                    <StatusBadge
                      status={pg.publication.status}
                      language={language}
                    />
                    <UniverseTag universe={pg.universe} language={language} />
                    {pg.folderGroup && (
                      <span className="rounded-md border border-[#102D45]/12 bg-[#F5F7FA] px-2 py-0.5 text-[10px] font-semibold text-[#1C4967]">
                        Groupe : {pg.folderGroup}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="font-mono text-[#1C4967]">
                      /p/{pg.seo.slug}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Globe2 className="h-3.5 w-3.5" />
                      {pg.language.toUpperCase()}
                    </span>
                    <span>
                      Offre : <strong className="text-[#102D45]">{pg.offerRef.offerCode}</strong> ·{' '}
                      {pg.offerRef.cachedSummary.startingPriceLabel}
                    </span>
                    <span className="font-mono-tabular text-slate-400">
                      {pg.blocks.length} blocs · {pg.versions.length} versions
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onPreviewPage(pg.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 px-3 py-2 text-xs font-semibold text-[#1C4967] hover:bg-[#F5F7FA]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {t.actions.preview}
                  </button>

                  <SocialPosterControl
                    variant="toolbar"
                    page={pg}
                    pageTitle={pg.title}
                    slug={pg.seo.slug}
                  />

                  <button
                    type="button"
                    onClick={() => onDownloadPdf(pg.id)}
                    title="Télécharger toute la page en PDF"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#C8922A]/50 bg-[#FBF9F4] px-3 py-2 text-xs font-semibold text-[#102D45] hover:bg-[#E7B34C]/25"
                  >
                    <FileDown className="h-3.5 w-3.5 text-[#C8922A]" />
                    PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenEditor(pg.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#102D45] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1C4967]"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-[#E7B34C]" />
                    {t.actions.edit}
                  </button>

                  {isPublished ? (
                    <button
                      type="button"
                      onClick={() => onUnpublishPage(pg.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                      {t.actions.unpublish}
                    </button>
                  ) : (
                    !isArchived && (
                      <button
                        type="button"
                        onClick={() => onPublishPage(pg.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                      >
                        <Rocket className="h-3.5 w-3.5" />
                        {t.actions.publish}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => onDuplicatePage(pg.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#102D45]/15 px-2.5 py-2 text-xs font-semibold text-[#102D45] hover:bg-[#F5F7FA]"
                    title={t.actions.duplicate}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  {!isArchived && (
                    <button
                      type="button"
                      onClick={() => onArchivePage(pg.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#102D45]/15 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                      title={t.actions.archive}
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
