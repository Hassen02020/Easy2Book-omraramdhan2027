import { Archive, Copy, Rocket, Undo2 } from 'lucide-react';
import type { CreatorLanguage, Page, PageStatus } from '../../types/creator';
import { STUDIO_I18N } from '../../lib/i18n';
import { StatusBadge } from '../shared-components/StatusBadge';

interface PublicationPanelProps {
  page: Page;
  language: CreatorLanguage;
  onPublish: () => void;
  onUnpublish: () => void;
  onChangeStatus: (status: PageStatus) => void;
  onUpdateScheduleDates: (scheduledAt?: string, expiresAt?: string) => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

export function PublicationPanel({
  page,
  language,
  onPublish,
  onUnpublish,
  onChangeStatus,
  onUpdateScheduleDates,
  onDuplicate,
  onArchive,
}: PublicationPanelProps) {
  const t = STUDIO_I18N[language];
  const isPublished = page.publication.status === 'published';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#102D45]">Statut actuel</span>
          <StatusBadge status={page.publication.status} language={language} />
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          {page.publishedVersion
            ? `Snapshot publié : v${page.publishedVersion.versionNumber} (${page.publishedVersion.createdAt.slice(0, 10)}). Les modifications brouillon n’altèrent pas la page en ligne tant que vous ne republiez pas.`
            : 'Aucun snapshot encore publié. Cette page reste en mode brouillon interne.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPublish}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#102D45] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
        >
          <Rocket className="h-3.5 w-3.5 text-[#E7B34C]" />
          {isPublished ? 'Republier v+' : t.actions.publish}
        </button>

        {isPublished ? (
          <button
            type="button"
            onClick={onUnpublish}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
          >
            <Undo2 className="h-3.5 w-3.5" />
            {t.actions.unpublish}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onChangeStatus('in_review')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-white px-3 py-2.5 text-xs font-semibold text-[#102D45] hover:bg-[#F5F7FA]"
          >
            Passer en révision
          </button>
        )}
      </div>

      {/* Lifecycle status selector */}
      <div>
        <label className="block text-[11px] font-bold text-[#102D45] mb-1">
          Workflow éditorial
        </label>
        <select
          value={page.publication.status}
          onChange={(e) => onChangeStatus(e.target.value as PageStatus)}
          className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-semibold text-[#102D45]"
        >
          {(
            ['draft', 'in_review', 'scheduled', 'published', 'expired', 'archived'] as PageStatus[]
          ).map((st) => (
            <option key={st} value={st}>
              {t.statuses[st]}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule & Expiry */}
      <div className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Publication programmée (ISO)
          </label>
          <input
            type="datetime-local"
            value={
              page.publication.scheduledAt
                ? page.publication.scheduledAt.slice(0, 16)
                : ''
            }
            onChange={(e) =>
              onUpdateScheduleDates(
                e.target.value ? `${e.target.value}:00Z` : undefined,
                page.publication.expiresAt
              )
            }
            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Date d’expiration commerciale
          </label>
          <input
            type="datetime-local"
            value={
              page.publication.expiresAt
                ? page.publication.expiresAt.slice(0, 16)
                : ''
            }
            onChange={(e) =>
              onUpdateScheduleDates(
                page.publication.scheduledAt,
                e.target.value ? `${e.target.value}:00Z` : undefined
              )
            }
            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Duplicate & Archive */}
      <div className="flex items-center gap-2 border-t border-[#102D45]/10 pt-3">
        <button
          type="button"
          onClick={onDuplicate}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-white px-3 py-2 text-xs font-semibold text-[#102D45] hover:bg-[#F5F7FA]"
        >
          <Copy className="h-3.5 w-3.5" />
          {t.actions.duplicate}
        </button>
        <button
          type="button"
          onClick={onArchive}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100"
        >
          <Archive className="h-3.5 w-3.5" />
          {t.actions.archive}
        </button>
      </div>
    </div>
  );
}
