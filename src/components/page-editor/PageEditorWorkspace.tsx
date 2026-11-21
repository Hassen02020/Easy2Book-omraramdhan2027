import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Copy,
  Eye,
  EyeOff,
  Film,
  Laptop,
  Loader2,
  Plus,
  Redo2,
  Rocket,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Undo2,
  Upload,
} from 'lucide-react';
import {
  getReelConfig,
  REEL_PRESET_CATALOG,
  VOICE_OPTIONS,
  type ReelPresetId,
} from '../../data/campaignData';
import { generateVideoDownloadLink } from '../../lib/reelVideoExporter';
import type { CrmIntegrationConfig } from '../../integration-contracts/crmAdapter';
import {
  createDefaultBrandIdentity,
  createDefaultFooterConfig,
  createDefaultHeaderConfig,
  STYLE_PALETTE_PRESETS,
  UNIVERSAL_COMMERCE_MODULES,
} from '../../lib/commerceModulesCatalog';
import {
  addBlockToPage,
  duplicateBlockInPage,
  moveBlockInPage,
  removeBlockFromPage,
  resetBlockInPage,
  toggleCommerceModuleOnPage,
  updateBlockInPage,
} from '../../lib/creatorStore';
import { HERO_MEDIA_MAP, type HeroImageKey } from '../../lib/mediaRegistry';
import { BLOCK_CATALOG } from '../block-library/blockCatalog';
import { FormBuilderPanel } from '../form-builder/FormBuilderPanel';
import {
  PagePreviewCanvas,
  type PreviewViewport,
} from '../preview-renderer/PagePreviewCanvas';
import { PublicationPanel } from '../publication/PublicationPanel';
import { PdfBrochureControl } from '../shared-components/PdfBrochureControl';
import { SocialPosterControl } from '../shared-components/SocialPosterControl';
import { StatusBadge } from '../shared-components/StatusBadge';
import { VersionHistoryPanel } from '../version-history/VersionHistoryPanel';
import type {
  BlockCategory,
  BlockType,
  BrandIdentity,
  BrandVisualStyle,
  CreatorLanguage,
  HeaderVariant,
  MediaAsset,
  Page,
  PageBlock,
  PageFooterConfig,
  PageHeaderConfig,
  PageStatus,
  PageVersionSnapshot,
} from '../../types/creator';

interface PageEditorWorkspaceProps {
  page: Page;
  studioLanguage: CreatorLanguage;
  media: MediaAsset[];
  crmConfig: CrmIntegrationConfig;
  defaultVoiceId?: string;
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

type LeftTab = 'structure' | 'add_block' | 'modules';
type RightTab =
  | 'identity'
  | 'header'
  | 'block'
  | 'footer'
  | 'form'
  | 'seo'
  | 'publish';

const FONT_OPTIONS = [
  'Plus Jakarta Sans',
  'Outfit',
  'Playfair Display',
  'DM Sans',
  'Inter',
  'Cairo',
];

function inferDefaultReelPresetForPage(page: Page): ReelPresetId {
  if (page.universe === 'visa') {
    if (page.id.includes('visa-egypte')) return 'visa_egypt';
    if (page.id.includes('visa-dubai')) return 'visa_dubai';
    if (page.id.includes('visa-qatar')) return 'visa_qatar';
    if (page.id.includes('visa-oman')) return 'visa_oman';
    if (page.id.includes('visa-omra')) return 'visa_omra';
    if (page.id.includes('visa-international')) return 'visa_international';
    if (page.id.includes('visa-evisa')) return 'visa_evisa';
    if (page.id.includes('schengen') || page.id.includes('france') || page.id.includes('etudes') || page.id.includes('affaires')) {
      return 'visa_schengen';
    }
    return 'visa_services';
  }
  if (page.universe === 'voyages' || page.universe === 'hotels_tunisie') {
    if (
      page.id.includes('billetterie') ||
      page.id.includes('avion') ||
      page.id.includes('bateau') ||
      page.id.includes('ferries')
    ) {
      return 'flights_ferries';
    }
    if (page.id.includes('turquie') || page.id.includes('turkey')) return 'turkey_excursions';
    if (page.id.includes('egypt')) return 'egypt_excursions';
    return 'excursions_general';
  }
  return 'omra';
}

export function PageEditorWorkspace({
  page,
  studioLanguage,
  media,
  crmConfig,
  defaultVoiceId,
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
  const [galleryGenPreset, setGalleryGenPreset] = useState<ReelPresetId>(() =>
    inferDefaultReelPresetForPage(page)
  );
  const [galleryGenVoice, setGalleryGenVoice] = useState<string>(
    page.universe === 'visa' ||
      page.universe === 'voyages' ||
      page.universe === 'hotels_tunisie'
      ? 'Layla'
      : defaultVoiceId || 'Charon'
  );
  const [galleryGenerating, setGalleryGenerating] = useState(false);
  const [galleryGenPct, setGalleryGenPct] = useState(0);
  const [galleryGenStatus, setGalleryGenStatus] = useState('');
  const [galleryGenError, setGalleryGenError] = useState<string | null>(null);

  // Undo / Redo history stack scoped per active page
  const [undoStack, setUndoStack] = useState<Page[]>([]);
  const [redoStack, setRedoStack] = useState<Page[]>([]);

  useEffect(() => {
    setUndoStack([]);
    setRedoStack([]);
    setPilotRenderMode(page.pilotRenderer ? 'pilot' : 'blocks');
    setSelectedBlockId(page.blocks[0]?.id ?? null);
    setGalleryGenPreset(inferDefaultReelPresetForPage(page));
    setGalleryGenVoice(
      page.universe === 'visa' ||
        page.universe === 'voyages' ||
        page.universe === 'hotels_tunisie'
        ? 'Layla'
        : defaultVoiceId || 'Charon'
    );
  }, [page.id]);

  const commitPageChange = useCallback(
    (nextPage: Page) => {
      setUndoStack((prev) => [...prev.slice(-29), page]);
      setRedoStack([]);
      onUpdatePage(nextPage);
    },
    [onUpdatePage, page]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, page]);
    onUpdatePage(previous);
  }, [onUpdatePage, page, undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, page]);
    onUpdatePage(next);
  }, [onUpdatePage, page, redoStack]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleRedo, handleUndo]);

  const selectedBlock: PageBlock | null =
    page.blocks.find((b) => b.id === selectedBlockId) ?? page.blocks[0] ?? null;

  const brandIdentity: BrandIdentity =
    page.brandIdentity ?? createDefaultBrandIdentity({ brandName: 'Easy2Book' });
  const headerConfig: PageHeaderConfig =
    page.header ??
    createDefaultHeaderConfig({ language: page.language, variant: 'premium' });
  const footerConfig: PageFooterConfig =
    page.footer ??
    createDefaultFooterConfig({
      brandName: brandIdentity.brandName,
      language: page.language,
    });

  const updateBrandIdentity = (updater: (b: BrandIdentity) => BrandIdentity) => {
    commitPageChange({
      ...page,
      brandIdentity: updater(brandIdentity),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateHeaderConfig = (
    updater: (h: PageHeaderConfig) => PageHeaderConfig
  ) => {
    commitPageChange({
      ...page,
      header: updater(headerConfig),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateFooterConfig = (
    updater: (f: PageFooterConfig) => PageFooterConfig
  ) => {
    commitPageChange({
      ...page,
      footer: updater(footerConfig),
      updatedAt: new Date().toISOString(),
    });
  };

  const draftSnapshot: PageVersionSnapshot = {
    blocks: page.blocks,
    form: page.form,
    seo: page.seo,
    attribution: page.attribution,
    offerRef: page.offerRef,
    language: page.language,
    title: page.title,
    folderGroup: page.folderGroup,
    creationMode: page.creationMode,
    brandIdentity: page.brandIdentity,
    header: page.header,
    footer: page.footer,
    commerceModules: page.commerceModules,
  };

  const activeSnapshot =
    previewMode === 'published' && page.publishedVersion
      ? page.publishedVersion.snapshot
      : draftSnapshot;

  const updateSelectedBlock = (updater: (b: PageBlock) => PageBlock) => {
    if (!selectedBlock) return;
    commitPageChange(updateBlockInPage(page, selectedBlock.id, updater));
  };

  const handleDropOnBlock = (targetBlockId: string) => {
    if (!draggedBlockId || draggedBlockId === targetBlockId) return;
    const fromIdx = page.blocks.findIndex((b) => b.id === draggedBlockId);
    const toIdx = page.blocks.findIndex((b) => b.id === targetBlockId);
    if (fromIdx === -1 || toIdx === -1) return;
    const nextBlocks = [...page.blocks];
    const [moved] = nextBlocks.splice(fromIdx, 1);
    nextBlocks.splice(toIdx, 0, moved);
    commitPageChange({
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
    commitPageChange(updated);
    if (added) {
      setSelectedBlockId(added.id);
      setRightTab('block');
    }
    setLeftTab('structure');
  };

  const handleEditorLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const result = reader.result;
        updateBrandIdentity((b) => ({
          ...b,
          logoSrc: result,
          isProvisionalLogo: false,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredCatalog = BLOCK_CATALOG.filter(
    (b) => blockCategoryFilter === 'all' || b.category === blockCategoryFilter
  );

  const countByCategory = (cat: BlockCategory) =>
    BLOCK_CATALOG.filter((b) => b.category === cat).length;

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

        {/* Save / Undo / Redo / Preview / Publish Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] p-0.5">
            <button
              type="button"
              disabled={undoStack.length === 0}
              onClick={handleUndo}
              title="Annuler (Ctrl+Z)"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[#102D45] hover:bg-white disabled:opacity-35 whitespace-nowrap"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Annuler</span>
            </button>
            <button
              type="button"
              disabled={redoStack.length === 0}
              onClick={handleRedo}
              title="Rétablir (Ctrl+Shift+Z)"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[#102D45] hover:bg-white disabled:opacity-35 whitespace-nowrap"
            >
              <Redo2 className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Rétablir</span>
            </button>
          </div>
          {autoSaveSavedAt && (
            <span className="hidden 2xl:inline text-[10px] font-medium text-emerald-700">
              Auto-sauvegardé {autoSaveSavedAt}
            </span>
          )}
          <button
            type="button"
            onClick={onSaveDraftVersion}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#102D45] hover:bg-[#F5F7FA] whitespace-nowrap shrink-0"
          >
            <Save className="h-3.5 w-3.5 text-[#1C4967]" />
            Sauvegarder
          </button>
          <SocialPosterControl
            variant="toolbar"
            page={page}
            pageTitle={page.title}
            slug={page.seo.slug}
          />
          <PdfBrochureControl
            variant="toolbar"
            pageTitle={page.title}
            slug={page.seo.slug}
            revisionKey={page.updatedAt}
          />
          <button
            type="button"
            onClick={() => onOpenFullPreview(page.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#1C4967] hover:bg-[#F5F7FA] whitespace-nowrap shrink-0"
          >
            <Eye className="h-3.5 w-3.5" />
            Prévisualiser
          </button>
          <button
            type="button"
            onClick={onPublishPage}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#102D45] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1C4967] whitespace-nowrap shrink-0"
          >
            <Rocket className="h-3.5 w-3.5 text-[#E7B34C]" />
            Publier
          </button>
        </div>
      </div>

      {/* 3-Zone Workspace */}
      <div className="grid flex-1 min-h-0 lg:grid-cols-[290px_1fr_340px]">
        {/* ZONE 1 (LEFT): Page Structure, Add Blocks & Commerce Modules */}
        <div className="flex flex-col border-e border-[#102D45]/10 bg-white min-h-0">
          <div className="grid grid-cols-3 border-b border-[#102D45]/10 p-1.5 bg-[#F5F7FA] gap-1">
            <button
              type="button"
              onClick={() => setLeftTab('structure')}
              className={`rounded-lg py-1.5 text-[11px] font-bold ${
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
              className={`rounded-lg py-1.5 text-[11px] font-bold ${
                leftTab === 'add_block'
                  ? 'bg-white text-[#102D45] shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              + Blocs ({BLOCK_CATALOG.length})
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('modules')}
              className={`rounded-lg py-1.5 text-[11px] font-bold ${
                leftTab === 'modules'
                  ? 'bg-white text-[#102D45] shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Modules ({page.commerceModules?.length ?? 0})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {leftTab === 'structure' ? (
              <>
                {/* First-class Site Zones Quick Access */}
                <div className="grid grid-cols-3 gap-1.5 pb-2 border-b border-[#102D45]/10">
                  <button
                    type="button"
                    onClick={() => setRightTab('identity')}
                    className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold transition-colors ${
                      rightTab === 'identity'
                        ? 'border-[#E7B34C] bg-[#102D45] text-white'
                        : 'border-[#102D45]/12 bg-[#F5F7FA] text-[#102D45]'
                    }`}
                  >
                    Identité
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightTab('header')}
                    className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold transition-colors ${
                      rightTab === 'header'
                        ? 'border-[#E7B34C] bg-[#102D45] text-white'
                        : 'border-[#102D45]/12 bg-[#F5F7FA] text-[#102D45]'
                    }`}
                  >
                    Header {headerConfig.enabled ? '✓' : 'off'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightTab('footer')}
                    className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold transition-colors ${
                      rightTab === 'footer'
                        ? 'border-[#E7B34C] bg-[#102D45] text-white'
                        : 'border-[#102D45]/12 bg-[#F5F7FA] text-[#102D45]'
                    }`}
                  >
                    Footer {footerConfig.enabled ? '✓' : 'off'}
                  </button>
                </div>

                {page.blocks.map((blk, index) => {
                  const isSelected = selectedBlock?.id === blk.id && rightTab === 'block';
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
                            {blk.anchorId ? ` · #${blk.anchorId}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            commitPageChange(
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
                              commitPageChange(moveBlockInPage(page, blk.id, 'up'));
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
                              commitPageChange(moveBlockInPage(page, blk.id, 'down'));
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
                              commitPageChange(duplicateBlockInPage(page, blk.id));
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
                              commitPageChange(resetBlockInPage(page, blk.id));
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
                            commitPageChange(removeBlockFromPage(page, blk.id));
                          }}
                          className="rounded p-1 text-rose-600 hover:bg-rose-50"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : leftTab === 'add_block' ? (
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
                  <option value="all">Toutes catégories ({BLOCK_CATALOG.length})</option>
                  <option value="common">Communs & Structure ({countByCategory('common')})</option>
                  <option value="commerce">Modules Commerce ({countByCategory('commerce')})</option>
                  <option value="omra">Omra ({countByCategory('omra')})</option>
                  <option value="voyages">Voyages ({countByCategory('voyages')})</option>
                  <option value="hotels_tunisie">Hôtels Tunisie ({countByCategory('hotels_tunisie')})</option>
                  <option value="visa">Services Visa ({countByCategory('visa')})</option>
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
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Activez ou désactivez des modules voyage évolutifs sur cette page sans reconstruire l’architecture.
                </p>
                {UNIVERSAL_COMMERCE_MODULES.map((mod) => {
                  const active = (page.commerceModules ?? []).includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() =>
                        commitPageChange(toggleCommerceModuleOnPage(page, mod.id))
                      }
                      className={`flex w-full items-start justify-between gap-2 rounded-xl border p-2.5 text-start transition-colors ${
                        active
                          ? 'border-[#E7B34C] bg-[#102D45] text-white'
                          : 'border-[#102D45]/10 bg-[#F5F7FA] text-[#102D45] hover:bg-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          {mod.labels[page.language]}
                        </p>
                        <p
                          className={`mt-0.5 text-[10px] leading-snug ${
                            active ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {mod.capabilities[page.language]}
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          active
                            ? 'border-[#E7B34C] bg-[#E7B34C] text-[#102D45]'
                            : 'border-[#102D45]/20 bg-white text-transparent'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ZONE 2 (CENTER): Live Interactive Preview */}
        <div className="flex-1 overflow-y-auto bg-[#EDF1F7] p-4 md:p-6">
          {(page.pilotRenderer === 'omra_ramadan_2027' ||
            page.pilotRenderer === 'egypt_excursions_2026' ||
            page.pilotRenderer === 'turkey_excursions_2026' ||
            page.pilotRenderer === 'visa_services_2026' ||
            page.pilotRenderer === 'visa_category_2026' ||
            page.pilotRenderer === 'flights_ferries_2026') && (
            <div className="mx-auto mb-3 flex max-w-5xl flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E7B34C]/60 bg-white px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#E7B34C]/20 px-2 py-0.5 text-[10px] font-bold text-[#102D45]">
                  {page.pilotRenderer === 'flights_ferries_2026'
                    ? `Page Pilote · Billetterie / ${page.folderGroup || 'Billetterie Avion & Bateau'}`
                    : page.pilotRenderer === 'visa_category_2026'
                      ? `Landing Page Visa · ${page.folderGroup || 'Visas par Type'}`
                      : page.pilotRenderer === 'visa_services_2026'
                        ? `Page Pilote · Visa / ${page.folderGroup || 'Visas & E-Visa'}`
                        : page.pilotRenderer === 'turkey_excursions_2026'
                          ? `Page Pilote · Voyages / ${page.folderGroup || 'Excursions Turquie'}`
                          : page.pilotRenderer === 'egypt_excursions_2026'
                            ? `Page Pilote · Voyages / ${page.folderGroup || 'Excursions Égypte'}`
                            : `Page Pilote · Omra / ${page.folderGroup || 'Ramadan 2027'}`}
                </span>
                <span className="font-semibold text-[#102D45]">
                  {page.pilotRenderer === 'flights_ferries_2026'
                    ? 'Easy2Book — Billet d’Avion & Bateau (30s)'
                    : page.pilotRenderer === 'visa_category_2026'
                      ? page.title
                      : page.pilotRenderer === 'visa_services_2026'
                        ? 'Easy2Book — خدمات الفيزا و E-Visa'
                        : page.pilotRenderer === 'turkey_excursions_2026'
                          ? 'Easy2Book — رحلات تركيا اليومية'
                          : page.pilotRenderer === 'egypt_excursions_2026'
                            ? 'Easy2Book — رحلات يومية مصر'
                            : 'Easy2Book — عمرة رمضان كامل'}
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
            defaultVoiceId={defaultVoiceId}
            selectedBlockId={selectedBlock?.id}
            selectedZone={
              rightTab === 'identity' ||
              rightTab === 'header' ||
              rightTab === 'footer'
                ? rightTab
                : null
            }
            interactiveEdit={
              previewMode === 'draft' && pilotRenderMode === 'blocks'
            }
            forcePilotRender={
              Boolean(page.pilotRenderer) && pilotRenderMode === 'pilot'
            }
            onSelectBlock={(id) => {
              setSelectedBlockId(id);
              setRightTab('block');
            }}
            onSelectPageZone={(zone) => setRightTab(zone)}
          />
        </div>

        {/* ZONE 3 (RIGHT): Identity / Header / Block / Footer / Form / SEO / Publish */}
        <div className="flex flex-col border-s border-[#102D45]/10 bg-white min-h-0">
          <div className="flex flex-wrap gap-1 border-b border-[#102D45]/10 bg-[#F5F7FA] p-1.5">
            {(
              [
                { id: 'identity', label: 'Identité' },
                { id: 'header', label: 'Header' },
                { id: 'block', label: 'Bloc' },
                { id: 'footer', label: 'Footer' },
                { id: 'form', label: 'Form' },
                { id: 'seo', label: 'SEO' },
                { id: 'publish', label: 'Publier' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRightTab(tab.id)}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap shrink-0 ${
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
            {/* TAB: IDENTITÉ & LOGO */}
            {rightTab === 'identity' && (
              <div className="space-y-4">
                <div className="border-b border-[#102D45]/10 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C8922A]">
                    Charte & Identité Visuelle
                  </p>
                  <h3 className="text-xs font-bold text-[#102D45]">
                    Marque, Logo, Couleurs & Typographies
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nom de la marque
                    </label>
                    <input
                      type="text"
                      value={brandIdentity.brandName}
                      onChange={(e) =>
                        updateBrandIdentity((b) => ({
                          ...b,
                          brandName: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tagline / Signature courte
                    </label>
                    <input
                      type="text"
                      value={brandIdentity.tagline || ''}
                      onChange={(e) =>
                        updateBrandIdentity((b) => ({
                          ...b,
                          tagline: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>

                {/* Real Logo Import vs Provisional Wordmark */}
                <div className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#102D45]">
                      Logo de l’entreprise
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {brandIdentity.isProvisionalLogo
                        ? 'Provisoire (modifiable)'
                        : 'Logo réel actif'}
                    </span>
                  </div>
                  {brandIdentity.logoSrc && (
                    <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#102D45]/10">
                      <img
                        src={brandIdentity.logoSrc}
                        alt={brandIdentity.brandName}
                        className="h-8 w-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateBrandIdentity((b) => ({
                            ...b,
                            logoSrc: null,
                            isProvisionalLogo: true,
                          }))
                        }
                        className="text-[10px] font-semibold text-rose-600 hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#102D45] hover:border-[#E7B34C]">
                      <Upload className="h-3 w-3" />
                      <span>Importer fichier</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditorLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateBrandIdentity((b) => ({
                          ...b,
                          logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
                          isProvisionalLogo: false,
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#1C4967] hover:border-[#E7B34C]"
                    >
                      Logo Easy2Book
                    </button>
                  </div>
                </div>

                {/* Visual Style Presets */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Style général
                  </label>
                  <select
                    value={brandIdentity.visualStyle}
                    onChange={(e) => {
                      const nextStyle = e.target.value as BrandVisualStyle;
                      const preset = STYLE_PALETTE_PRESETS[nextStyle];
                      updateBrandIdentity((b) => ({
                        ...b,
                        ...preset,
                      }));
                    }}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs font-bold text-[#102D45]"
                  >
                    <option value="premium">Premium</option>
                    <option value="moderne">Moderne</option>
                    <option value="luxe">Luxe</option>
                    <option value="minimaliste">Minimaliste</option>
                    <option value="familial">Familial</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Color Tokens */}
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ['primaryColor', 'Principale'],
                      ['secondaryColor', 'Secondaire'],
                      ['accentColor', 'Accent'],
                      ['ctaColor', 'Bouton CTA'],
                      ['ctaTextColor', 'Texte CTA'],
                      ['surfaceColor', 'Fond page'],
                    ] as const
                  ).map(([key, lbl]) => (
                    <div key={key}>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        {lbl}
                      </label>
                      <input
                        type="color"
                        value={brandIdentity[key]}
                        onChange={(e) =>
                          updateBrandIdentity((b) => ({
                            ...b,
                            [key]: e.target.value,
                          }))
                        }
                        className="h-8 w-full rounded border border-[#102D45]/15 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Typography & Shapes */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Police Titres
                    </label>
                    <select
                      value={brandIdentity.headingFont}
                      onChange={(e) =>
                        updateBrandIdentity((b) => ({
                          ...b,
                          headingFont: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Police Texte
                    </label>
                    <select
                      value={brandIdentity.bodyFont}
                      onChange={(e) =>
                        updateBrandIdentity((b) => ({
                          ...b,
                          bodyFont: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={brandIdentity.cardShape}
                    onChange={(e) =>
                      updateBrandIdentity((b) => ({
                        ...b,
                        cardShape: e.target.value as BrandIdentity['cardShape'],
                      }))
                    }
                    className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                  >
                    <option value="sharp">Cartes droites</option>
                    <option value="soft">Cartes douces</option>
                    <option value="rounded">Cartes arrondies</option>
                  </select>
                  <select
                    value={brandIdentity.imageStyle}
                    onChange={(e) =>
                      updateBrandIdentity((b) => ({
                        ...b,
                        imageStyle: e.target.value as BrandIdentity['imageStyle'],
                      }))
                    }
                    className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                  >
                    <option value="rounded">Images douces</option>
                    <option value="editorial">Images éditoriales</option>
                    <option value="full_bleed">Plein cadre</option>
                  </select>
                  <select
                    value={brandIdentity.spacingScale}
                    onChange={(e) =>
                      updateBrandIdentity((b) => ({
                        ...b,
                        spacingScale: e.target.value as BrandIdentity['spacingScale'],
                      }))
                    }
                    className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                  >
                    <option value="compact">Compact</option>
                    <option value="balanced">Équilibré</option>
                    <option value="spacious">Aéré</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB: HEADER CONFIGURABLE */}
            {rightTab === 'header' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#102D45]/10 pb-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#C8922A]">
                      Navigation Principale
                    </p>
                    <h3 className="text-xs font-bold text-[#102D45]">
                      Header Professionnel (5 variantes)
                    </h3>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#102D45]">
                    <input
                      type="checkbox"
                      checked={headerConfig.enabled}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          enabled: e.target.checked,
                        }))
                      }
                      className="accent-[#102D45]"
                    />
                    Actif
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Style de navigation
                  </label>
                  <select
                    value={headerConfig.variant}
                    onChange={(e) =>
                      updateHeaderConfig((h) => ({
                        ...h,
                        variant: e.target.value as HeaderVariant,
                      }))
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs font-bold text-[#102D45]"
                  >
                    <option value="corporate">1. Header Corporate</option>
                    <option value="premium">2. Header Premium</option>
                    <option value="touristique">3. Header Touristique</option>
                    <option value="minimaliste">4. Header Minimaliste</option>
                    <option value="hotelier">5. Header Hôtelier</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5">
                  <label className="flex items-center gap-1.5 font-semibold">
                    <input
                      type="checkbox"
                      checked={headerConfig.sticky}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          sticky: e.target.checked,
                        }))
                      }
                      className="accent-[#102D45]"
                    />
                    Fixe (sticky)
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold">
                    <input
                      type="checkbox"
                      checked={headerConfig.showLogo}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          showLogo: e.target.checked,
                        }))
                      }
                      className="accent-[#102D45]"
                    />
                    Logo
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold">
                    <input
                      type="checkbox"
                      checked={headerConfig.showBrandName}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          showBrandName: e.target.checked,
                        }))
                      }
                      className="accent-[#102D45]"
                    />
                    Nom
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Bouton CTA principal
                    </label>
                    <input
                      type="text"
                      value={headerConfig.ctaLabel}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          ctaLabel: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Ancre cible CTA
                    </label>
                    <input
                      type="text"
                      value={headerConfig.ctaTarget}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          ctaTarget: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Header WhatsApp */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 space-y-2">
                  <label className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
                    <span>Bouton WhatsApp (si configuré)</span>
                    <input
                      type="checkbox"
                      checked={headerConfig.showWhatsapp}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          showWhatsapp: e.target.checked,
                        }))
                      }
                      className="accent-emerald-700"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Numéro WhatsApp"
                      value={headerConfig.whatsappNumber}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          whatsappNumber: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-emerald-200 bg-white px-2 py-1.5 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Libellé (ex: WhatsApp)"
                      value={headerConfig.whatsappLabel}
                      onChange={(e) =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          whatsappLabel: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-xs"
                    />
                  </div>
                </div>

                {/* Nav Links */}
                <div className="space-y-2 border-t border-[#102D45]/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#102D45]">
                      Liens vers les sections ({headerConfig.navLinks.length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateHeaderConfig((h) => ({
                          ...h,
                          navLinks: [
                            ...h.navLinks,
                            {
                              id: `nav-${Date.now().toString(36)}`,
                              label: 'Nouvelle section',
                              target: '#offres',
                            },
                          ],
                        }))
                      }
                      className="text-[11px] font-bold text-[#1C4967] hover:underline"
                    >
                      + Ajouter lien
                    </button>
                  </div>
                  {headerConfig.navLinks.map((lnk, idx) => (
                    <div
                      key={lnk.id}
                      className="grid grid-cols-[1fr_95px_24px] gap-1.5 items-center"
                    >
                      <input
                        type="text"
                        value={lnk.label}
                        onChange={(e) =>
                          updateHeaderConfig((h) => ({
                            ...h,
                            navLinks: h.navLinks.map((x, i) =>
                              i === idx ? { ...x, label: e.target.value } : x
                            ),
                          }))
                        }
                        className="rounded border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        value={lnk.target}
                        onChange={(e) =>
                          updateHeaderConfig((h) => ({
                            ...h,
                            navLinks: h.navLinks.map((x, i) =>
                              i === idx ? { ...x, target: e.target.value } : x
                            ),
                          }))
                        }
                        className="rounded border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1 font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateHeaderConfig((h) => ({
                            ...h,
                            navLinks: h.navLinks.filter((_, i) => i !== idx),
                          }))
                        }
                        className="p-1 text-rose-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FOOTER CONFIGURABLE */}
            {rightTab === 'footer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#102D45]/10 pb-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#C8922A]">
                      Pied de page complet
                    </p>
                    <h3 className="text-xs font-bold text-[#102D45]">
                      Footer & Coordonnées réelles
                    </h3>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#102D45]">
                    <input
                      type="checkbox"
                      checked={footerConfig.enabled}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          enabled: e.target.checked,
                        }))
                      }
                      className="accent-[#102D45]"
                    />
                    Actif
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Présentation courte entreprise
                  </label>
                  <textarea
                    rows={3}
                    value={footerConfig.companyDescription}
                    onChange={(e) =>
                      updateFooterConfig((f) => ({
                        ...f,
                        companyDescription: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3 space-y-2">
                  <p className="text-[11px] font-bold text-[#102D45]">
                    Coordonnées réelles (champs vides masqués en public)
                  </p>
                  <input
                    type="text"
                    placeholder="Téléphone officiel"
                    value={footerConfig.phone}
                    onChange={(e) =>
                      updateFooterConfig((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp Business"
                    value={footerConfig.whatsapp}
                    onChange={(e) =>
                      updateFooterConfig((f) => ({
                        ...f,
                        whatsapp: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="email"
                    placeholder="Email de contact"
                    value={footerConfig.email}
                    onChange={(e) =>
                      updateFooterConfig((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Adresse physique"
                    value={footerConfig.address}
                    onChange={(e) =>
                      updateFooterConfig((f) => ({
                        ...f,
                        address: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-[#102D45]">
                    Réseaux sociaux (URL complètes si actives)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Facebook URL"
                      value={footerConfig.socialLinks.facebook || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          socialLinks: {
                            ...f.socialLinks,
                            facebook: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Instagram URL"
                      value={footerConfig.socialLinks.instagram || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          socialLinks: {
                            ...f.socialLinks,
                            instagram: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={footerConfig.socialLinks.linkedin || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          socialLinks: {
                            ...f.socialLinks,
                            linkedin: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="YouTube URL"
                      value={footerConfig.socialLinks.youtube || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          socialLinks: {
                            ...f.socialLinks,
                            youtube: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#102D45]/10 pt-3">
                  <p className="text-[11px] font-bold text-[#102D45]">
                    Mentions légales & Copyright
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Libellé mentions légales"
                      value={footerConfig.legalLinks.termsLabel || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          legalLinks: {
                            ...f.legalLinks,
                            termsLabel: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Lien mentions (/mentions)"
                      value={footerConfig.legalLinks.termsUrl || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          legalLinks: {
                            ...f.legalLinks,
                            termsUrl: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Libellé confidentialité"
                      value={footerConfig.legalLinks.privacyLabel || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          legalLinks: {
                            ...f.legalLinks,
                            privacyLabel: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Lien confidentialité"
                      value={footerConfig.legalLinks.privacyUrl || ''}
                      onChange={(e) =>
                        updateFooterConfig((f) => ({
                          ...f,
                          legalLinks: {
                            ...f.legalLinks,
                            privacyUrl: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-1.5 text-[11px]"
                    />
                  </div>
                  <input
                    type="text"
                    value={footerConfig.copyrightText}
                    onChange={(e) =>
                      updateFooterConfig((f) => ({
                        ...f,
                        copyrightText: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>
            )}

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
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">#</span>
                    <input
                      type="text"
                      placeholder="ancre"
                      value={selectedBlock.anchorId || ''}
                      onChange={(e) =>
                        updateSelectedBlock((b) => ({
                          ...b,
                          anchorId: e.target.value.replace(/^#/, '') || undefined,
                        }))
                      }
                      className="w-24 rounded border border-[#102D45]/15 bg-[#F5F7FA] px-1.5 py-0.5 font-mono text-[10px]"
                    />
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
                      {(Object.keys(HERO_MEDIA_MAP) as HeroImageKey[]).map((k) => (
                        <option key={k} value={k}>
                          {HERO_MEDIA_MAP[k].label}
                        </option>
                      ))}
                      {media
                        .filter((m) => !m.isDemoAsset)
                        .map((m) => (
                          <option key={m.id} value={m.src}>
                            {m.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Multi-image Gallery Selector */}
                  {(selectedBlock.type === 'gallery' ||
                    selectedBlock.type === 'voyage_gallery' ||
                    selectedBlock.type === 'hotel_gallery') && (
                    <div className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-2.5 space-y-1.5">
                      <p className="text-[11px] font-bold text-[#102D45]">
                        Photos de la galerie (multi-sélection)
                      </p>
                      <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
                        {(Object.keys(HERO_MEDIA_MAP) as HeroImageKey[]).map(
                          (k) => {
                            const selectedKeys =
                              selectedBlock.content.galleryImageKeys ?? [];
                            const checked = selectedKeys.includes(k);
                            return (
                              <label
                                key={k}
                                className="flex items-center gap-1.5 rounded bg-white px-2 py-1 text-[10px] cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    const nextKeys = e.target.checked
                                      ? [...selectedKeys, k]
                                      : selectedKeys.filter((x) => x !== k);
                                    updateSelectedBlock((b) => ({
                                      ...b,
                                      content: {
                                        ...b.content,
                                        galleryImageKeys: nextKeys,
                                      },
                                    }));
                                  }}
                                  className="accent-[#102D45]"
                                />
                                <span className="truncate">
                                  {HERO_MEDIA_MAP[k].label.includes('—')
                                    ? HERO_MEDIA_MAP[k].label
                                        .split('—')
                                        .slice(1)
                                        .join('—')
                                        .trim()
                                    : HERO_MEDIA_MAP[k].label}
                                </span>
                              </label>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hero Video 9:16 Preset & Tunisian Script Configurator */}
                  {selectedBlock.type === 'hero_video' && (() => {
                    const currentPreset: ReelPresetId =
                      selectedBlock.content.reelPreset ||
                      (page.universe === 'visa'
                        ? 'visa_services'
                        : page.universe === 'voyages' ||
                            page.universe === 'hotels_tunisie'
                          ? 'excursions_general'
                          : 'omra');
                    const presetMeta =
                      REEL_PRESET_CATALOG.find((p) => p.id === currentPreset) ??
                      REEL_PRESET_CATALOG[0];
                    const defaultScript = getReelConfig(currentPreset).script;
                    return (
                      <div className="rounded-xl border border-[#E7B34C]/40 bg-[#FFFDF7] p-3 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#102D45]">
                            <Film className="h-3.5 w-3.5 text-[#C8922A]" />
                            Scénario Reel 9:16 & Voix Tunisienne
                          </span>
                          <span className="rounded bg-[#102D45] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#E7B34C]">
                            {presetMeta.defaultVoiceId}
                          </span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                            Thème / Preset Vidéo 9:16
                          </label>
                          <select
                            value={currentPreset}
                            onChange={(e) => {
                              const nextPreset = e.target.value as ReelPresetId;
                              updateSelectedBlock((b) => ({
                                ...b,
                                content: {
                                  ...b.content,
                                  reelPreset: nextPreset,
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs font-bold text-[#102D45]"
                          >
                            {REEL_PRESET_CATALOG.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.titleFr}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-semibold text-slate-600">
                              Script voix off tunisienne (optionnel)
                            </label>
                            {selectedBlock.content.customReelScript && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateSelectedBlock((b) => ({
                                    ...b,
                                    content: {
                                      ...b.content,
                                      customReelScript: undefined,
                                    },
                                  }))
                                }
                                className="text-[10px] font-bold text-[#1C4967] hover:underline"
                              >
                                Réinitialiser
                              </button>
                            )}
                          </div>
                          <textarea
                            rows={4}
                            dir="rtl"
                            value={
                              selectedBlock.content.customReelScript ??
                              defaultScript
                            }
                            onChange={(e) =>
                              updateSelectedBlock((b) => ({
                                ...b,
                                content: {
                                  ...b.content,
                                  customReelScript: e.target.value,
                                },
                              }))
                            }
                            className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs leading-relaxed"
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Video Gallery Configurator (YouTube / MP4, Autoplay, Loop) */}
                  {selectedBlock.type === 'video_gallery' && (() => {
                    const vs = selectedBlock.content.videoSettings ?? {
                      autoplay: false,
                      loop: true,
                      muted: true,
                      showControls: true,
                      columns: 2 as const,
                    };
                    const vids = selectedBlock.content.videos ?? [];
                    const updateVideoSettings = (
                      patch: Partial<NonNullable<typeof selectedBlock.content.videoSettings>>
                    ) => {
                      updateSelectedBlock((b) => ({
                        ...b,
                        content: {
                          ...b.content,
                          videoSettings: {
                            autoplay: vs.autoplay,
                            loop: vs.loop,
                            muted: vs.muted,
                            showControls: vs.showControls,
                            columns: vs.columns,
                            ...patch,
                          },
                        },
                      }));
                    };

                    return (
                      <div className="space-y-3 border-t border-[#102D45]/10 pt-3">
                        <div className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3 space-y-2.5">
                          <p className="text-[11px] font-bold text-[#102D45]">
                            Options de lecture (YouTube & MP4)
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={vs.autoplay}
                                onChange={(e) =>
                                  updateVideoSettings({
                                    autoplay: e.target.checked,
                                    muted: e.target.checked ? true : vs.muted,
                                  })
                                }
                                className="accent-[#102D45]"
                              />
                              Lecture auto
                            </label>
                            <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={vs.loop}
                                onChange={(e) =>
                                  updateVideoSettings({ loop: e.target.checked })
                                }
                                className="accent-[#102D45]"
                              />
                              Boucle (Loop)
                            </label>
                            <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={vs.autoplay ? true : vs.muted}
                                disabled={vs.autoplay}
                                onChange={(e) =>
                                  updateVideoSettings({ muted: e.target.checked })
                                }
                                className="accent-[#102D45]"
                              />
                              Muet
                            </label>
                            <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={vs.showControls}
                                onChange={(e) =>
                                  updateVideoSettings({
                                    showControls: e.target.checked,
                                  })
                                }
                                className="accent-[#102D45]"
                              />
                              Contrôles
                            </label>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Colonnes d’affichage
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                              {([1, 2, 3] as const).map((cols) => (
                                <button
                                  key={cols}
                                  type="button"
                                  onClick={() => updateVideoSettings({ columns: cols })}
                                  className={`rounded-md py-1 text-[11px] font-bold ${
                                    vs.columns === cols
                                      ? 'bg-[#102D45] text-white'
                                      : 'bg-white text-[#102D45] border border-[#102D45]/10'
                                  }`}
                                >
                                  {cols} col.
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 1-Click Server MP4 Reel Generator & Gallery Attach */}
                        <div className="rounded-xl border border-[#E7B34C]/50 bg-[#FFFDF7] p-3 space-y-2">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#102D45]">
                              <Sparkles className="h-3.5 w-3.5 text-[#C8922A]" />
                              Générer & intégrer un Reel MP4
                            </span>
                            <span className="text-[9px] font-bold text-[#9A6E1B]">
                              Visas / Excursions / Omra
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-1.5">
                            <select
                              value={galleryGenPreset}
                              onChange={(e) => {
                                const next = e.target.value as ReelPresetId;
                                setGalleryGenPreset(next);
                                const cfg = getReelConfig(next);
                                setGalleryGenVoice(cfg.defaultVoiceId);
                              }}
                              className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2 py-1.5 text-[11px] font-semibold text-[#102D45]"
                            >
                              {REEL_PRESET_CATALOG.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.titleFr}
                                </option>
                              ))}
                            </select>
                            <select
                              value={galleryGenVoice}
                              onChange={(e) => setGalleryGenVoice(e.target.value)}
                              className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2 py-1.5 text-[11px] text-[#102D45]"
                            >
                              {VOICE_OPTIONS.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.id} · {v.descriptionFr}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            disabled={galleryGenerating}
                            onClick={() => {
                              if (galleryGenerating) return;
                              setGalleryGenError(null);
                              setGalleryGenerating(true);
                              setGalleryGenPct(10);
                              setGalleryGenStatus('Génération MP4...');
                              const presetEntry =
                                REEL_PRESET_CATALOG.find(
                                  (p) => p.id === galleryGenPreset
                                ) ?? REEL_PRESET_CATALOG[0];
                              void generateVideoDownloadLink({
                                preset: galleryGenPreset,
                                voiceName: galleryGenVoice,
                                showCaptions: true,
                                autoDownload: false,
                                onProgress: (pct, label) => {
                                  setGalleryGenPct(pct);
                                  setGalleryGenStatus(label);
                                },
                              })
                                .then((res) => {
                                  const inlineUrl = res.downloadPath.startsWith('/')
                                    ? `${res.downloadPath}?inline=1`
                                    : res.downloadPath;
                                  const posterKey =
                                    galleryGenPreset === 'visa_services' ||
                                    galleryGenPreset === 'visa_schengen'
                                      ? 'visa_desk'
                                      : galleryGenPreset === 'turkey_excursions'
                                        ? 'turkey_istanbul_reel'
                                        : galleryGenPreset === 'egypt_excursions'
                                          ? 'egypt_pyramids_reel'
                                          : galleryGenPreset === 'excursions_general'
                                            ? 'dubai_skyline'
                                            : 'omra_vip_haram';
                                  updateSelectedBlock((b) => ({
                                    ...b,
                                    content: {
                                      ...b.content,
                                      videos: [
                                        ...(b.content.videos ?? []),
                                        {
                                          id: `vid-reel-${Date.now().toString(36)}`,
                                          badge: `Reel 9:16 · ${galleryGenVoice}`,
                                          title: presetEntry.titleAr,
                                          caption: `${presetEntry.summaryFr} · MP4 HD (${res.durationSec}s)`,
                                          url: inlineUrl,
                                          posterKey,
                                          aspectRatio: '9:16',
                                        },
                                      ],
                                    },
                                  }));
                                })
                                .catch((err) => {
                                  setGalleryGenError(
                                    err instanceof Error
                                      ? err.message
                                      : 'Échec de génération MP4.'
                                  );
                                })
                                .finally(() => {
                                  setGalleryGenerating(false);
                                });
                            }}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#102D45] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#1C4967] disabled:opacity-60"
                          >
                            {galleryGenerating ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E7B34C]" />
                                <span>
                                  {galleryGenStatus} ({galleryGenPct}%)
                                </span>
                              </>
                            ) : (
                              <>
                                <Film className="h-3.5 w-3.5 text-[#E7B34C]" />
                                <span>Générer MP4 & ajouter à la galerie</span>
                              </>
                            )}
                          </button>
                          {galleryGenError && (
                            <p className="text-[10px] font-semibold text-rose-700">
                              {galleryGenError}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#102D45]">
                              Vidéos promotionnelles ({vids.length})
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateSelectedBlock((b) => ({
                                  ...b,
                                  content: {
                                    ...b.content,
                                    videos: [
                                      ...(b.content.videos ?? []),
                                      {
                                        id: `vid-${Date.now().toString(36)}`,
                                        badge:
                                          page.universe === 'visa'
                                            ? 'Visa · Promo'
                                            : page.universe === 'voyages'
                                              ? 'Excursions · Promo'
                                              : 'Omra · Promo',
                                        title: 'Nouvelle vidéo promotionnelle',
                                        caption: 'Description de la vidéo',
                                        url: '',
                                        posterKey:
                                          page.universe === 'visa'
                                            ? 'visa_desk'
                                            : page.universe === 'voyages'
                                              ? 'egypt_pyramids_museum'
                                              : 'makkah_haram',
                                        aspectRatio: '16:9',
                                      },
                                    ],
                                  },
                                }))
                              }
                              className="text-[11px] font-bold text-[#1C4967] hover:underline"
                            >
                              + Ajouter vidéo
                            </button>
                          </div>

                          {vids.map((vid, idx) => (
                            <div
                              key={vid.id}
                              className="rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] p-2.5 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Titre de la vidéo"
                                  value={vid.title}
                                  onChange={(e) =>
                                    updateSelectedBlock((b) => ({
                                      ...b,
                                      content: {
                                        ...b.content,
                                        videos: vids.map((v, i) =>
                                          i === idx ? { ...v, title: e.target.value } : v
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
                                        videos: vids.filter((_, i) => i !== idx),
                                      },
                                    }))
                                  }
                                  className="p-1 text-rose-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                                  Lien YouTube ou MP4 direct
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://youtube.com/watch?v=... ou https://.../video.mp4"
                                  value={vid.url}
                                  onChange={(e) =>
                                    updateSelectedBlock((b) => ({
                                      ...b,
                                      content: {
                                        ...b.content,
                                        videos: vids.map((v, i) =>
                                          i === idx ? { ...v, url: e.target.value } : v
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full rounded border border-[#102D45]/10 bg-white px-2 py-1 font-mono text-[11px]"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Badge (ex: Omra 16:9)"
                                  value={vid.badge || ''}
                                  onChange={(e) =>
                                    updateSelectedBlock((b) => ({
                                      ...b,
                                      content: {
                                        ...b.content,
                                        videos: vids.map((v, i) =>
                                          i === idx ? { ...v, badge: e.target.value } : v
                                        ),
                                      },
                                    }))
                                  }
                                  className="rounded border border-[#102D45]/10 bg-white px-2 py-1 text-[11px]"
                                />
                                <select
                                  value={vid.aspectRatio || '16:9'}
                                  onChange={(e) =>
                                    updateSelectedBlock((b) => ({
                                      ...b,
                                      content: {
                                        ...b.content,
                                        videos: vids.map((v, i) =>
                                          i === idx
                                            ? {
                                                ...v,
                                                aspectRatio: e.target.value as '16:9' | '9:16',
                                              }
                                            : v
                                        ),
                                      },
                                    }))
                                  }
                                  className="rounded border border-[#102D45]/10 bg-white px-2 py-1 text-[11px] font-semibold"
                                >
                                  <option value="16:9">Format 16:9</option>
                                  <option value="9:16">Reel 9:16</option>
                                </select>
                              </div>

                              <select
                                value={vid.posterKey || 'omra_vip_haram'}
                                onChange={(e) =>
                                  updateSelectedBlock((b) => ({
                                    ...b,
                                    content: {
                                      ...b.content,
                                      videos: vids.map((v, i) =>
                                        i === idx ? { ...v, posterKey: e.target.value } : v
                                      ),
                                    },
                                  }))
                                }
                                className="w-full rounded border border-[#102D45]/10 bg-white px-2 py-1 text-[11px]"
                              >
                                {(Object.keys(HERO_MEDIA_MAP) as HeroImageKey[]).map((k) => (
                                  <option key={k} value={k}>
                                    Vignette : {HERO_MEDIA_MAP[k].label}
                                  </option>
                                ))}
                              </select>

                              <input
                                type="text"
                                placeholder="Légende / description courte"
                                value={vid.caption || ''}
                                onChange={(e) =>
                                  updateSelectedBlock((b) => ({
                                    ...b,
                                    content: {
                                      ...b.content,
                                      videos: vids.map((v, i) =>
                                        i === idx ? { ...v, caption: e.target.value } : v
                                      ),
                                    },
                                  }))
                                }
                                className="w-full rounded border border-[#102D45]/10 bg-white px-2 py-1 text-[11px]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

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
                  {selectedBlock.type !== 'video_gallery' &&
                    Array.isArray(selectedBlock.content.items) && (
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
