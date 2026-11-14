import { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Laptop,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Tablet,
  Trash2,
  Rocket,
} from 'lucide-react';
import type { CrmIntegrationConfig } from '../../integration-contracts/crmAdapter';
import {
  addBlockToPage,
  duplicateBlockInPage,
  moveBlockInPage,
  removeBlockFromPage,
  resetBlockInPage,
  updateBlockInPage,
} from '../../lib/creatorStore';
import { BLOCK_CATALOG } from '../block-library/blockCatalog';
import { FormBuilderPanel } from '../form-builder/FormBuilderPanel';
import {
  PagePreviewCanvas,
  type PreviewViewport,
} from '../preview-renderer/PagePreviewCanvas';
import { PublicationPanel } from '../publication/PublicationPanel';
import { StatusBadge } from '../shared-components/StatusBadge';
import { VersionHistoryPanel } from '../version-history/VersionHistoryPanel';
import type {
  BlockCategory,
  BlockType,
  CreatorLanguage,
  MediaAsset,
  Page,
  PageBlock,
  PageStatus,
  PageVersionSnapshot,
} from '../../types/creator';

interface PageEditorWorkspaceProps {
  page: Page;
  studioLanguage: CreatorLanguage;
  media: MediaAsset[];
  crmConfig: CrmIntegrationConfig;
  autoSaveSavedAt: string | null;
  onUpdatePage: (nextPage: Page) => void;
  onSaveDraftVersion: () => void;
  onPublishPage: () => void;
  onUnpublishPage: () => void;
  onDuplicatePage: () => void;
  onArchivePage: () => void;
  onRestoreVersion: (versionId: string) => void;
  onOpenFullPreview: (pageId: string) => void;
  onBack: () => void;
}

type LeftTab = 'structure' | 'add_block';
type RightTab = 'block' | 'form' | 'seo' | 'publish';

export function PageEditorWorkspace({
  page,
  studioLanguage,
  media,
  crmConfig,
  autoSaveSavedAt,
  onUpdatePage,
  onSaveDraftVersion,
  onPublishPage,
  onUnpublishPage,
  onDuplicatePage,
  onArchivePage,
  onRestoreVersion,
  onOpenFullPreview,
  onBack,
}: PageEditorWorkspaceProps) {
  const [leftTab, setLeftTab] = useState<LeftTab>('structure');
  const [rightTab, setRightTab] = useState<RightTab>('block');
  const [blockCategoryFilter, setBlockCategoryFilter] = useState<
    BlockCategory | 'all'
  >('all');
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [previewMode, setPreviewMode] = useState<'draft' | 'published'>('draft');
  const [pilotRenderMode, setPilotRenderMode] = useState<'pilot' | 'blocks'>(
    page.pilotRenderer ? 'pilot' : 'blocks'
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    page.blocks[0]?.id ?? null
  );
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const selectedBlock: PageBlock | null =
    page.blocks.find((b) => b.id === selectedBlockId) ?? page.blocks[0] ?? null;

  const draftSnapshot: PageVersionSnapshot = {
    blocks: page.blocks,
    form: page.form,
    seo: page.seo,
    attribution: page.attribution,
    offerRef: page.offerRef,
    language: page.language,
    title: page.title,
  };

  const activeSnapshot =
    previewMode === 'published' && page.publishedVersion
      ? page.publishedVersion.snapshot
      : draftSnapshot;

  const updateSelectedBlock = (updater: (b: PageBlock) => PageBlock) => {
    if (!selectedBlock) return;
    onUpdatePage(updateBlockInPage(page, selectedBlock.id, updater));
  };

  const handleDropOnBlock = (targetBlockId: string) => {
    if (!draggedBlockId || draggedBlockId === targetBlockId) return;
    const fromIdx = page.blocks.findIndex((b) => b.id === draggedBlockId);
    const toIdx = page.blocks.findIndex((b) => b.id === targetBlockId);
    if (fromIdx === -1 || toIdx === -1) return;
    const nextBlocks = [...page.blocks];
    const [moved] = nextBlocks.splice(fromIdx, 1);
    nextBlocks.splice(toIdx, 0, moved);
    onUpdatePage({
      ...page,
      blocks: nextBlocks,
      updatedAt: new Date().toISOString(),
    });
    setDraggedBlockId(null);
  };

  const handleAddBlock = (type: BlockType) => {
    const updated = addBlockToPage(page, type);
    const added =
      updated.blocks.find(
        (b) => !page.blocks.some((old) => old.id === b.id)
      ) ?? null;
    onUpdatePage(updated);
    if (added) {
      setSelectedBlockId(added.id);
      setRightTab('block');
    }
    setLeftTab('structure');
  };

  const filteredCatalog = BLOCK_CATALOG.filter(
    (b) => blockCategoryFilter === 'all' || b.category === blockCategoryFilter
  );

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] min-h-[640px] rounded-2xl border border-[#102D45]/12 bg-white overflow-hidden shadow-xs">
      {/* Editor Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#102D45]/10 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 px-2.5 py-1.5 text-xs font-semibold text-[#102D45] hover:bg-[#F5F7FA]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour
          </button>

          <input
            type="text"
            value={page.title}
            onChange={(e) =>
              onUpdatePage({
                ...page,
                title: e.target.value,
                updatedAt: new Date().toISOString(),
              })
            }
            className="min-w-[180px] max-w-xs rounded-lg border border-transparent bg-[#F5F7FA] px-2.5 py-1 text-sm font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
          />

          <StatusBadge
            status={page.publication.status}
            language={studioLanguage}
          />

          <select
            value={page.language}
            onChange={(e) =>
              onUpdatePage({
                ...page,
                language: e.target.value as CreatorLanguage,
                updatedAt: new Date().toISOString(),
              })
            }
            className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1 text-xs font-bold text-[#102D45]"
            aria-label="Langue de la page"
          >
            <option value="fr">FR (LTR)</option>
            <option value="ar">AR (RTL)</option>
            <option value="en">EN (LTR)</option>
          </select>
        </div>

        {/* Center Viewport Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#102D45]/12 bg-[#F5F7FA] p-0.5">
            {(
              [
                { id: 'desktop', icon: Laptop, label: 'Desktop' },
                { id: 'tablet', icon: Tablet, label: 'Tablette' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
              ] as const
            ).map((vp) => {
              const Icon = vp.icon;
              return (
                <button
                  key={vp.id}
                  type="button"
                  onClick={() => setViewport(vp.id)}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                    viewport === vp.id
                      ? 'bg-[#102D45] text-white'
                      : 'text-[#1C4967] hover:text-[#102D45]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">{vp.label}</span>
                </button>
              );
            })}
          </div>

          {page.publishedVersion && (
            <div className="flex items-center rounded-lg border border-[#102D45]/12 bg-[#F5F7FA] p-0.5">
              <button
                type="button"
                onClick={() => setPreviewMode('draft')}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                  previewMode === 'draft'
                    ? 'bg-white text-[#102D45] shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Brouillon
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('published')}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                  previewMode === 'published'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-500'
                }`}
              >
                Publiée (v{page.publishedVersion.versionNumber})
              </button>
            </div>
          )}
        </div>

        {/* Save / Preview / Publish Actions */}
        <div className="flex items-center gap-2">
          {autoSaveSavedAt && (
            <span className="hidden xl:inline text-[10px] font-medium text-emerald-700">
              Auto-sauvegardé {autoSaveSavedAt}
            </span>
          )}
          <button
            type="button"
            onClick={onSaveDraftVersion}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#102D45] hover:bg-[#F5F7FA]"
          >
            <Save className="h-3.5 w-3.5 text-[#1C4967]" />
            Sauvegarder
          </button>
          <button
            type="button"
            onClick={() => onOpenFullPreview(page.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#1C4967] hover:bg-[#F5F7FA]"
          >
            <Eye className="h-3.5 w-3.5" />
            Prévisualiser
          </button>
          <button
            type="button"
            onClick={onPublishPage}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#102D45] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1C4967]"
          >
            <Rocket className="h-3.5 w-3.5 text-[#E7B34C]" />
            Publier
          </button>
        </div>
      </div>

      {/* 3-Zone Workspace */}
      <div className="grid flex-1 min-h-0 lg:grid-cols-[290px_1fr_340px]">
        {/* ZONE 1 (LEFT): Page Structure & Add Blocks */}
        <div className="flex flex-col border-e border-[#102D45]/10 bg-white min-h-0">
          <div className="grid grid-cols-2 border-b border-[#102D45]/10 p-1.5 bg-[#F5F7FA]">
            <button
              type="button"
              onClick={() => setLeftTab('structure')}
              className={`rounded-lg py-1.5 text-xs font-bold ${
                leftTab === 'structure'
                  ? 'bg-white text-[#102D45] shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Structure ({page.blocks.length})
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('add_block')}
              className={`rounded-lg py-1.5 text-xs font-bold ${
                leftTab === 'add_block'
                  ? 'bg-white text-[#102D45] shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              + Blocs (44)
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {leftTab === 'structure' ? (
              page.blocks.map((blk, index) => {
                const isSelected = selectedBlock?.id === blk.id;
                return (
                  <div
                    key={blk.id}
                    draggable
                    onDragStart={() => setDraggedBlockId(blk.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnBlock(blk.id)}
                    onClick={() => {
                      setSelectedBlockId(blk.id);
                      setRightTab('block');
                    }}
                    className={`cursor-pointer rounded-xl border p-2.5 transition-all ${
                      isSelected
                        ? 'border-[#E7B34C] bg-[#E7B34C]/10'
                        : 'border-[#102D45]/10 bg-[#F5F7FA] hover:border-[#1C4967]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#102D45] truncate">
                          {index + 1}. {blk.name}
                        </p>
                        <p className="font-mono text-[10px] text-slate-500 truncate">
                          {blk.type}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePage(
                            updateBlockInPage(page, blk.id, (b) => ({
                              ...b,
                              visible: !b.visible,
                            }))
                          );
                        }}
                        className="rounded p-1 text-slate-500 hover:bg-white hover:text-[#102D45]"
                        title={blk.visible ? 'Masquer' : 'Afficher'}
                      >
                        {blk.visible ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 text-rose-500" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-[#102D45]/8 pt-1.5">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdatePage(moveBlockInPage(page, blk.id, 'up'));
                          }}
                          className="rounded p-1 text-slate-600 hover:bg-white disabled:opacity-30"
                          title="Monter"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === page.blocks.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdatePage(moveBlockInPage(page, blk.id, 'down'));
                          }}
                          className="rounded p-1 text-slate-600 hover:bg-white disabled:opacity-30"
                          title="Descendre"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdatePage(duplicateBlockInPage(page, blk.id));
                          }}
                          className="rounded p-1 text-slate-600 hover:bg-white"
                          title="Dupliquer"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdatePage(resetBlockInPage(page, blk.id));
                          }}
                          className="rounded p-1 text-slate-600 hover:bg-white"
                          title="Réinitialiser ce bloc"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePage(removeBlockFromPage(page, blk.id));
                        }}
                        className="rounded p-1 text-rose-600 hover:bg-rose-50"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="space-y-3">
                <select
                  value={blockCategoryFilter}
                  onChange={(e) =>
                    setBlockCategoryFilter(
                      e.target.value as BlockCategory | 'all'
                    )
                  }
                  className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs font-semibold text-[#102D45]"
                >
                  <option value="all">Toutes catégories (44)</option>
                  <option value="common">Communs (15)</option>
                  <option value="omra">Omra (8)</option>
                  <option value="voyages">Voyages (7)</option>
                  <option value="hotels_tunisie">Hôtels Tunisie (7)</option>
                  <option value="visa">Services Visa (7)</option>
                </select>

                <div className="space-y-1.5">
                  {filteredCatalog.map((entry) => (
                    <button
                      key={entry.type}
                      type="button"
                      onClick={() => handleAddBlock(entry.type)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5 text-start hover:border-[#E7B34C] hover:bg-white"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#102D45] truncate">
                          {entry.labels[page.language]}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {entry.category}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 shrink-0 text-[#1C4967]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ZONE 2 (CENTER): Live Interactive Preview */}
        <div className="flex-1 overflow-y-auto bg-[#EDF1F7] p-4 md:p-6">
          {page.pilotRenderer === 'omra_ramadan_2027' && (
            <div className="mx-auto mb-3 flex max-w-5xl flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E7B34C]/60 bg-white px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#E7B34C]/20 px-2 py-0.5 text-[10px] font-bold text-[#102D45]">
                  Page Pilote · Omra / {page.folderGroup || 'Ramadan 2027'}
                </span>
                <span className="font-semibold text-[#102D45]">
                  Easy2Book — عمرة رمضان كامل
                </span>
              </div>
              <div className="flex items-center rounded-lg border border-[#102D45]/12 bg-[#F5F7FA] p-0.5">
                <button
                  type="button"
                  onClick={() => setPilotRenderMode('pilot')}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
                    pilotRenderMode === 'pilot'
                      ? 'bg-[#102D45] text-white'
                      : 'text-slate-600'
                  }`}
                >
                  Page Pilote Complète
                </button>
                <button
                  type="button"
                  onClick={() => setPilotRenderMode('blocks')}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
                    pilotRenderMode === 'blocks'
                      ? 'bg-[#102D45] text-white'
                      : 'text-slate-600'
                  }`}
                >
                  Édition par Blocs
                </button>
              </div>
            </div>
          )}
          {previewMode === 'published' && page.publishedVersion && (
            <div className="mx-auto mb-3 max-w-4xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-900">
              Aperçu de la version publiée (v{page.publishedVersion.versionNumber}) — isolée de vos modifications brouillon actuelles.
            </div>
          )}
          <PagePreviewCanvas
            page={page}
            snapshot={activeSnapshot}
            viewport={viewport}
            crmConfig={crmConfig}
            selectedBlockId={selectedBlock?.id}
            interactiveEdit={
              previewMode === 'draft' && pilotRenderMode === 'blocks'
            }
            forcePilotRender={
              page.pilotRenderer === 'omra_ramadan_2027' &&
              pilotRenderMode === 'pilot'
            }
            onSelectBlock={(id) => {
              setSelectedBlockId(id);
              setRightTab('block');
            }}
          />
        </div>

        {/* ZONE 3 (RIGHT): Properties Inspector / Form Builder / SEO / Publication */}
        <div className="flex flex-col border-s border-[#102D45]/10 bg-white min-h-0">
          <div className="grid grid-cols-4 border-b border-[#102D45]/10 bg-[#F5F7FA] p-1">
            {(
              [
                { id: 'block', label: 'Bloc' },
                { id: 'form', label: 'Form' },
                { id: 'seo', label: 'SEO' },
                { id: 'publish', label: 'Publier' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRightTab(tab.id)}
                className={`rounded-lg py-1.5 text-[11px] font-bold ${
                  rightTab === tab.id
                    ? 'bg-white text-[#102D45] shadow-2xs'
                    : 'text-slate-500 hover:text-[#102D45]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {rightTab === 'block' && selectedBlock && (
              <>
                <div className="flex items-center justify-between border-b border-[#102D45]/10 pb-2">
                  <div>
                    <p className="text-[10px] font-mono text-slate-400">
                      {selectedBlock.type}
                    </p>
                    <h3 className="text-xs font-bold text-[#102D45]">
                      {selectedBlock.name}
                    </h3>
                  </div>
                </div>

                {/* Content Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Sur-titre / Eyebrow
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.content.eyebrow}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          content: { ...b.content, eyebrow: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Titre principal
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.content.title}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          content: { ...b.content, title: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={selectedBlock.content.description}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          content: { ...b.content, description: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                    />
                  </div>

                  {/* Image Picker from Media Library */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Image (Médiathèque)
                    </label>
                    <select
                      value={selectedBlock.content.imageKey || ''}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          content: {
                            ...b.content,
                            imageKey: e.target.value || undefined,
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                    >
                      <option value="">Aucune image</option>
                      <option value="makkah_haram">La Mecque — Masjid Al-Haram</option>
                      <option value="tunis_flight">Vol Tunis – Djeddah</option>
                      <option value="maysan_suite">Hôtel Maysan Al Multazim</option>
                      <option value="madinah_twilight">Médine — Masjid Nabawi</option>
                      <option value="voyage_istanbul">Voyages — Istanbul</option>
                      <option value="tunisia_resort">Hôtels Tunisie — Resort 5*</option>
                      <option value="visa_desk">Service Visa</option>
                      {media
                        .filter((m) => !m.isDemoAsset)
                        .map((m) => (
                          <option key={m.id} value={m.src}>
                            {m.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* CTA / Link */}
                  {(selectedBlock.type === 'hero_image' ||
                    selectedBlock.type === 'hero_video' ||
                    selectedBlock.type === 'cta') && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Libellé bouton CTA
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.primaryCtaLabel || ''}
                          onChange={(e) =>
                            updateSelectedBlock((b) => ({
                              ...b,
                              content: {
                                ...b.content,
                                primaryCtaLabel: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Cible / Lien
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.primaryCtaTarget || '#form-block'}
                          onChange={(e) =>
                            updateSelectedBlock((b) => ({
                              ...b,
                              content: {
                                ...b.content,
                                primaryCtaTarget: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Countdown Target */}
                  {selectedBlock.type === 'countdown' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Date cible du compte à rebours
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          selectedBlock.content.targetDateIso
                            ? selectedBlock.content.targetDateIso.slice(0, 16)
                            : '2026-12-15T23:59'
                        }
                        onChange={(e) =>
                          updateSelectedBlock((b) => ({
                            ...b,
                            content: {
                              ...b.content,
                              targetDateIso: e.target.value
                                ? `${e.target.value}:00`
                                : '2026-12-15T23:59:59',
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  )}

                  {/* WhatsApp Config */}
                  {selectedBlock.type === 'whatsapp_button' &&
                    selectedBlock.content.whatsapp && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 space-y-2">
                        <p className="text-[11px] font-bold text-emerald-900">
                          Configuration WhatsApp (trackAsCrmLead: false)
                        </p>
                        <input
                          type="text"
                          value={selectedBlock.content.whatsapp.phoneNumber}
                          onChange={(e) =>
                            updateSelectedBlock((b) => ({
                              ...b,
                              content: {
                                ...b.content,
                                whatsapp: {
                                  ...b.content.whatsapp!,
                                  phoneNumber: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="Numéro WhatsApp"
                          className="w-full rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 font-mono text-xs"
                        />
                        <input
                          type="text"
                          value={selectedBlock.content.whatsapp.buttonLabel}
                          onChange={(e) =>
                            updateSelectedBlock((b) => ({
                              ...b,
                              content: {
                                ...b.content,
                                whatsapp: {
                                  ...b.content.whatsapp!,
                                  buttonLabel: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="Libellé du bouton"
                          className="w-full rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs"
                        />
                        <textarea
                          rows={2}
                          value={selectedBlock.content.whatsapp.prefilledMessage}
                          onChange={(e) =>
                            updateSelectedBlock((b) => ({
                              ...b,
                              content: {
                                ...b.content,
                                whatsapp: {
                                  ...b.content.whatsapp!,
                                  prefilledMessage: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="Message prérempli"
                          className="w-full rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    )}

                  {/* List Items Editor */}
                  {Array.isArray(selectedBlock.content.items) && (
                    <div className="space-y-2 border-t border-[#102D45]/10 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#102D45]">
                          Éléments du bloc ({selectedBlock.content.items.length})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedBlock((b) => ({
                              ...b,
                              content: {
                                ...b.content,
                                items: [
                                  ...(b.content.items ?? []),
                                  {
                                    id: `item-${Date.now().toString(36)}`,
                                    title: 'Nouvel élément',
                                    subtitle: 'Détail modifiable',
                                  },
                                ],
                              },
                            }))
                          }
                          className="text-[11px] font-bold text-[#1C4967] hover:underline"
                        >
                          + Ajouter
                        </button>
                      </div>

                      {selectedBlock.content.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-[#102D45]/10 bg-[#F5F7FA] p-2 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) =>
                                updateSelectedBlock((b) => ({
                                  ...b,
                                  content: {
                                    ...b.content,
                                    items: b.content.items?.map((it, i) =>
                                      i === idx
                                        ? { ...it, title: e.target.value }
                                        : it
                                    ),
                                  },
                                }))
                              }
                              className="flex-1 rounded border border-[#102D45]/10 bg-white px-2 py-1 text-xs font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateSelectedBlock((b) => ({
                                  ...b,
                                  content: {
                                    ...b.content,
                                    items: b.content.items?.filter(
                                      (_, i) => i !== idx
                                    ),
                                  },
                                }))
                              }
                              className="p-1 text-rose-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              placeholder="Sous-titre"
                              value={item.subtitle || ''}
                              onChange={(e) =>
                                updateSelectedBlock((b) => ({
                                  ...b,
                                  content: {
                                    ...b.content,
                                    items: b.content.items?.map((it, i) =>
                                      i === idx
                                        ? { ...it, subtitle: e.target.value }
                                        : it
                                    ),
                                  },
                                }))
                              }
                              className="rounded border border-[#102D45]/10 bg-white px-2 py-1 text-[11px]"
                            />
                            <input
                              type="text"
                              placeholder="Tarif / Badge"
                              value={item.price ?? item.badge ?? ''}
                              onChange={(e) =>
                                updateSelectedBlock((b) => ({
                                  ...b,
                                  content: {
                                    ...b.content,
                                    items: b.content.items?.map((it, i) =>
                                      i === idx
                                        ? { ...it, price: e.target.value }
                                        : it
                                    ),
                                  },
                                }))
                              }
                              className="rounded border border-[#102D45]/10 bg-white px-2 py-1 text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visual Style & Responsive Visibility */}
                <div className="space-y-3 border-t border-[#102D45]/10 pt-3">
                  <p className="text-[11px] font-bold text-[#102D45]">
                    Style, typographie & espacements
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        Fond
                      </label>
                      <input
                        type="color"
                        value={selectedBlock.style.backgroundColor}
                        onChange={(e) =>
                          updateSelectedBlock((b) => ({
                            ...b,
                            style: {
                              ...b.style,
                              backgroundColor: e.target.value,
                            },
                          }))
                        }
                        className="h-8 w-full rounded border border-[#102D45]/15 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        Texte
                      </label>
                      <input
                        type="color"
                        value={selectedBlock.style.textColor}
                        onChange={(e) =>
                          updateSelectedBlock((b) => ({
                            ...b,
                            style: { ...b.style, textColor: e.target.value },
                          }))
                        }
                        className="h-8 w-full rounded border border-[#102D45]/15 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        Accent
                      </label>
                      <input
                        type="color"
                        value={selectedBlock.style.accentColor}
                        onChange={(e) =>
                          updateSelectedBlock((b) => ({
                            ...b,
                            style: { ...b.style, accentColor: e.target.value },
                          }))
                        }
                        className="h-8 w-full rounded border border-[#102D45]/15 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedBlock.style.alignment}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          style: {
                            ...b.style,
                            alignment: e.target.value as 'left' | 'center' | 'right',
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                    >
                      <option value="left">Aligné gauche</option>
                      <option value="center">Centré</option>
                      <option value="right">Aligné droite</option>
                    </select>
                    <select
                      value={selectedBlock.style.paddingY}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          style: {
                            ...b.style,
                            paddingY: e.target.value as 'compact' | 'normal' | 'spacious',
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                    >
                      <option value="compact">Espacement compact</option>
                      <option value="normal">Espacement normal</option>
                      <option value="spacious">Espacement large</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedBlock.style.fontSizeScale}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          style: {
                            ...b.style,
                            fontSizeScale: e.target.value as 'sm' | 'md' | 'lg',
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                    >
                      <option value="sm">Titre S</option>
                      <option value="md">Titre M</option>
                      <option value="lg">Titre L</option>
                    </select>
                    <select
                      value={selectedBlock.style.borderStyle}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          style: {
                            ...b.style,
                            borderStyle: e.target.value as 'none' | 'hairline' | 'accent',
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                    >
                      <option value="none">Sans bordure</option>
                      <option value="hairline">Bordure fine</option>
                      <option value="accent">Bordure or</option>
                    </select>
                  </div>

                  {/* Responsive Visibility */}
                  <div className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5">
                    <p className="text-[10px] font-bold text-[#102D45] mb-1.5">
                      Visibilité responsive
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      {(['desktop', 'tablet', 'mobile'] as const).map((dev) => (
                        <label key={dev} className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={selectedBlock.visibility[dev]}
                            onChange={(e) =>
                              updateSelectedBlock((b) => ({
                                ...b,
                                visibility: {
                                  ...b.visibility,
                                  [dev]: e.target.checked,
                                },
                              }))
                            }
                            className="accent-[#102D45]"
                          />
                          <span className="capitalize">{dev}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {rightTab === 'form' && (
              <FormBuilderPanel
                form={page.form}
                offerRef={page.offerRef}
                onChangeForm={(nextForm) =>
                  onUpdatePage({
                    ...page,
                    form: nextForm,
                    updatedAt: new Date().toISOString(),
                  })
                }
                onChangeOfferRef={(nextRef) =>
                  onUpdatePage({
                    ...page,
                    offerRef: nextRef,
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
            )}

            {rightTab === 'seo' && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-[#102D45]">
                    SEO & Partage Social
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Slug URL
                    </label>
                    <input
                      type="text"
                      value={page.seo.slug}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          seo: {
                            ...page.seo,
                            slug: e.target.value,
                            canonicalPath: `/p/${e.target.value}`,
                          },
                          updatedAt: new Date().toISOString(),
                        })
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={page.seo.metaTitle}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          seo: { ...page.seo, metaTitle: e.target.value },
                          updatedAt: new Date().toISOString(),
                        })
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={page.seo.metaDescription}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          seo: { ...page.seo, metaDescription: e.target.value },
                          updatedAt: new Date().toISOString(),
                        })
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      OpenGraph Title
                    </label>
                    <input
                      type="text"
                      value={page.seo.ogTitle}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          seo: { ...page.seo, ogTitle: e.target.value },
                          updatedAt: new Date().toISOString(),
                        })
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-[#102D45]/10 pt-3">
                  <p className="text-xs font-bold text-[#102D45]">
                    Attribution & Paramètres UTM (Contrat CRM)
                  </p>
                  <input
                    type="text"
                    placeholder="Source d’acquisition"
                    value={page.attribution.acquisitionSource}
                    onChange={(e) =>
                      onUpdatePage({
                        ...page,
                        attribution: {
                          ...page.attribution,
                          acquisitionSource: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="utm_source"
                      value={page.attribution.utmSource}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          attribution: {
                            ...page.attribution,
                            utmSource: e.target.value,
                          },
                        })
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="utm_medium"
                      value={page.attribution.utmMedium}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          attribution: {
                            ...page.attribution,
                            utmMedium: e.target.value,
                          },
                        })
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="utm_campaign"
                      value={page.attribution.utmCampaign}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          attribution: {
                            ...page.attribution,
                            utmCampaign: e.target.value,
                          },
                        })
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="utm_content"
                      value={page.attribution.utmContent}
                      onChange={(e) =>
                        onUpdatePage({
                          ...page,
                          attribution: {
                            ...page.attribution,
                            utmContent: e.target.value,
                          },
                        })
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {rightTab === 'publish' && (
              <div className="space-y-6">
                <PublicationPanel
                  page={page}
                  language={studioLanguage}
                  onPublish={onPublishPage}
                  onUnpublish={onUnpublishPage}
                  onChangeStatus={(status: PageStatus) =>
                    onUpdatePage({
                      ...page,
                      publication: { ...page.publication, status },
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  onUpdateScheduleDates={(scheduledAt, expiresAt) =>
                    onUpdatePage({
                      ...page,
                      publication: {
                        ...page.publication,
                        scheduledAt,
                        expiresAt,
                      },
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  onDuplicate={onDuplicatePage}
                  onArchive={onArchivePage}
                />

                <div className="border-t border-[#102D45]/10 pt-4">
                  <VersionHistoryPanel
                    versions={page.versions}
                    onRestoreVersion={onRestoreVersion}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
