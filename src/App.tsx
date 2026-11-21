import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Laptop, Smartphone, Tablet } from 'lucide-react';
import { BLOCK_CATALOG } from './components/block-library/blockCatalog';
import { BlockLibraryView } from './components/block-library/BlockLibraryView';
import { CreatePageWizardModal } from './components/create-flow/CreatePageWizardModal';
import { StudioDashboard } from './components/dashboard/StudioDashboard';
import { CreatorLayout } from './components/layout/CreatorLayout';
import { MediaLibraryView } from './components/media-library/MediaLibraryView';
import type { StudioNavId } from './components/navigation/SidebarNav';
import { PageEditorWorkspace } from './components/page-editor/PageEditorWorkspace';
import { PagesListView } from './components/page-list/PagesListView';
import {
  PagePreviewCanvas,
  type PreviewViewport,
} from './components/preview-renderer/PagePreviewCanvas';
import { createDefaultBlock } from './components/block-library/blockCatalog';
import { CreatorSettingsView } from './components/settings/CreatorSettingsView';
import { PdfBrochureControl } from './components/shared-components/PdfBrochureControl';
import { SocialPosterControl } from './components/shared-components/SocialPosterControl';
import { StatusBadge } from './components/shared-components/StatusBadge';
import { TemplatesGallery } from './components/templates/TemplatesGallery';
import { VideosStudioView } from './components/videos-studio/VideosStudioView';
import {
  createInitialCreatorState,
  DEMO_MEDIA_ASSETS,
  DEMO_PAGES,
  DEMO_TEMPLATES,
} from './data/demoData';
import {
  addBlockToPage,
  clonePageData,
  createBlankModularPage,
  createPageFromTemplate,
  duplicatePageEntity,
  publishPageSnapshot,
  restorePageFromVersion,
  saveDraftVersion,
  setPageLifecycleStatus,
} from './lib/creatorStore';
import type {
  BlockType,
  BusinessUniverse,
  CreatorLanguage,
  CreatorSettings,
  CreatorState,
  MediaAsset,
  Page,
  PageTemplate,
} from './types/creator';

const LOCAL_CACHE_KEY = 'e2b_landing_studio_state_v1';

function upgradeStudioState(raw: CreatorState): CreatorState {
  const demoTemplateMap = new Map(DEMO_TEMPLATES.map((t) => [t.id, t]));
  const existingUserTemplates = (raw.templates || []).filter(
    (t) => !demoTemplateMap.has(t.id)
  );
  const mergedTemplates: PageTemplate[] = [
    ...DEMO_TEMPLATES.map((tpl) => JSON.parse(JSON.stringify(tpl)) as PageTemplate),
    ...existingUserTemplates,
  ];

  const existingMedia = Array.isArray(raw.media) ? raw.media : [];
  const demoMediaMap = new Map(DEMO_MEDIA_ASSETS.map((m) => [m.id, m]));
  const customMedia = existingMedia.filter((m) => !demoMediaMap.has(m.id));
  const mergedMedia: MediaAsset[] = [
    ...DEMO_MEDIA_ASSETS.map((m) => ({ ...m })),
    ...customMedia,
  ];

  const demoEgyptPage = DEMO_PAGES.find(
    (p) => p.id === 'page-excursions-egypte-easy2book'
  );
  const demoTurkeyPage = DEMO_PAGES.find(
    (p) => p.id === 'page-excursions-turquie-easy2book'
  );
  const demoVisaPage = DEMO_PAGES.find(
    (p) => p.id === 'page-visas-services-easy2book'
  );
  const demoSchengenPage = DEMO_PAGES.find(
    (p) => p.id === 'page-visa-schengen-france'
  );
  const demoVisaEgyptPage = DEMO_PAGES.find(
    (p) => p.id === 'page-visa-egypte-easy2book'
  );
  const demoVisaEvisaPage = DEMO_PAGES.find(
    (p) => p.id === 'page-visa-evisa-easy2book'
  );
  const demoFlightsFerriesPage = DEMO_PAGES.find(
    (p) => p.id === 'page-billetterie-avion-bateau-easy2book'
  );
  const upgradedPages = raw.pages.map((pg) => {
    if (pg.id === 'page-omra-ramadan-2027') {
      return {
        ...pg,
        title:
          pg.title === 'عمرة رمضان 2027 — العرض الكامل'
            ? 'Easy2Book — عمرة رمضان كامل'
            : pg.title,
        folderGroup: pg.folderGroup || 'Ramadan 2027',
        isPilotPage: true,
        pilotRenderer: 'omra_ramadan_2027' as const,
      };
    }
    if (pg.id === 'page-excursions-egypte-easy2book' && demoEgyptPage) {
      if (
        pg.updatedAt === '2026-11-14T14:05:00Z' ||
        pg.updatedAt === '2026-11-14T14:20:00Z'
      ) {
        return JSON.parse(JSON.stringify(demoEgyptPage)) as Page;
      }
      return {
        ...pg,
        folderGroup: pg.folderGroup || 'Excursions Égypte',
        isPilotPage: true,
        pilotRenderer: 'egypt_excursions_2026' as const,
      };
    }
    if (pg.id === 'page-excursions-turquie-easy2book' && demoTurkeyPage) {
      return {
        ...pg,
        folderGroup: pg.folderGroup || 'Excursions Turquie',
        isPilotPage: true,
        pilotRenderer: 'turkey_excursions_2026' as const,
      };
    }
    if (pg.id === 'page-visas-services-easy2book' && demoVisaPage) {
      if (pg.updatedAt === '2026-11-14T15:05:00Z') {
        return JSON.parse(JSON.stringify(demoVisaPage)) as Page;
      }
      return {
        ...pg,
        folderGroup: pg.folderGroup || 'Visas & E-Visa',
        isPilotPage: true,
        pilotRenderer: 'visa_services_2026' as const,
      };
    }
    if (pg.id === 'page-visa-schengen-france' && demoSchengenPage) {
      if (pg.updatedAt === '2026-11-11T17:20:00Z') {
        return JSON.parse(JSON.stringify(demoSchengenPage)) as Page;
      }
      return {
        ...pg,
        folderGroup: pg.folderGroup || 'Visas par Type',
        isPilotPage: true,
        pilotRenderer: 'visa_category_2026' as const,
      };
    }
    if (pg.id === 'page-visa-egypte-easy2book' && demoVisaEgyptPage) {
      if (pg.updatedAt === '2026-11-15T09:10:00Z') {
        return JSON.parse(JSON.stringify(demoVisaEgyptPage)) as Page;
      }
      return {
        ...pg,
        folderGroup: pg.folderGroup || 'Visas par Type',
        isPilotPage: true,
        pilotRenderer: 'visa_category_2026' as const,
      };
    }
    if (pg.id === 'page-visa-evisa-easy2book' && demoVisaEvisaPage) {
      if (pg.updatedAt === '2026-11-15T10:10:00Z') {
        return JSON.parse(JSON.stringify(demoVisaEvisaPage)) as Page;
      }
      return {
        ...pg,
        folderGroup: pg.folderGroup || 'Visas par Type',
        isPilotPage: true,
        pilotRenderer: 'visa_category_2026' as const,
      };
    }
    if (pg.id === 'page-billetterie-avion-bateau-easy2book' && demoFlightsFerriesPage) {
      return {
        ...pg,
        folderGroup: pg.folderGroup || 'Billetterie Avion & Bateau',
        isPilotPage: true,
        pilotRenderer: 'flights_ferries_2026' as const,
      };
    }
    return pg;
  });
  const existingPageIds = new Set(upgradedPages.map((p) => p.id));
  const missingDemoPages = DEMO_PAGES.filter((p) => !existingPageIds.has(p.id)).map(
    (p) => JSON.parse(JSON.stringify(p)) as Page
  );

  return {
    ...raw,
    settings: {
      ...raw.settings,
      defaultVoiceId: raw.settings?.defaultVoiceId || 'Charon',
    },
    templates: mergedTemplates,
    media: mergedMedia,
    pages: [...missingDemoPages, ...upgradedPages],
  };
}

export default function App() {
  const [state, setState] = useState<CreatorState>(() => {
    try {
      const cached = window.localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as CreatorState;
        if (parsed && Array.isArray(parsed.pages) && Array.isArray(parsed.templates)) {
          return upgradeStudioState(parsed);
        }
      }
    } catch {
      // Fall back cleanly to demo dataset
    }
    return createInitialCreatorState();
  });

  const [studioLanguage, setStudioLanguage] = useState<CreatorLanguage>('fr');
  const [activeNav, setActiveNav] = useState<StudioNavId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [templateUniverseFilter, setTemplateUniverseFilter] = useState<
    BusinessUniverse | 'all'
  >('all');

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [previewPageId, setPreviewPageId] = useState<string | null>(null);
  const [pendingPdfExport, setPendingPdfExport] = useState(false);
  const [previewViewport, setPreviewViewport] =
    useState<PreviewViewport>('desktop');
  const [previewSnapshotKind, setPreviewSnapshotKind] = useState<
    'draft' | 'published'
  >('draft');
  const [autoSaveSavedAt, setAutoSaveSavedAt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [createWizardOpen, setCreateWizardOpen] = useState(false);

  const hasHydratedRef = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  }, []);

  // Load persisted studio state from server if present
  useEffect(() => {
    let active = true;
    fetch('/api/creator/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { state?: CreatorState | null } | null) => {
        if (!active) return;
        if (
          data?.state &&
          Array.isArray(data.state.pages) &&
          Array.isArray(data.state.templates)
        ) {
          setState(upgradeStudioState(data.state));
        }
      })
      .catch(() => {
        // Offline/local fallback already loaded
      })
      .finally(() => {
        hasHydratedRef.current = true;
      });
    return () => {
      active = false;
    };
  }, []);

  // Persist to localStorage & auto-save to server when enabled
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }

    if (!hasHydratedRef.current || !state.settings.autoSaveEnabled) return;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      fetch('/api/creator/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
        .then((res) => {
          if (res.ok) {
            const now = new Date();
            setAutoSaveSavedAt(
              `${String(now.getHours()).padStart(2, '0')}:${String(
                now.getMinutes()
              ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
            );
          }
        })
        .catch(() => {});
    }, 600);

    return () => {
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    };
  }, [state]);

  const editingPage = useMemo(
    () => state.pages.find((p) => p.id === editingPageId) ?? null,
    [editingPageId, state.pages]
  );

  const previewPage = useMemo(
    () => state.pages.find((p) => p.id === previewPageId) ?? null,
    [previewPageId, state.pages]
  );

  const counts = useMemo(() => {
    return {
      all: state.pages.length,
      drafts: state.pages.filter(
        (p) =>
          p.publication.status === 'draft' ||
          p.publication.status === 'in_review'
      ).length,
      published: state.pages.filter(
        (p) =>
          p.publication.status === 'published' ||
          p.publication.status === 'scheduled'
      ).length,
      archives: state.pages.filter(
        (p) =>
          p.publication.status === 'archived' ||
          p.publication.status === 'expired'
      ).length,
      templates: state.templates.length,
      blocks: BLOCK_CATALOG.length,
      media: state.media.length,
    };
  }, [state.media.length, state.pages, state.templates.length]);

  const updatePageById = useCallback(
    (pageId: string, updater: (p: Page) => Page) => {
      setState((prev) => ({
        ...prev,
        pages: prev.pages.map((pg) => (pg.id === pageId ? updater(pg) : pg)),
      }));
    },
    []
  );

  const handleOpenEditor = (pageId: string) => {
    setPreviewPageId(null);
    setEditingPageId(pageId);
  };

  const handleOpenFullPreview = (pageId: string) => {
    const pg = state.pages.find((p) => p.id === pageId);
    setPreviewSnapshotKind(pg?.publishedVersion ? 'published' : 'draft');
    setPreviewViewport('desktop');
    setPendingPdfExport(false);
    setPreviewPageId(pageId);
  };

  const handleDownloadPagePdf = (pageId: string) => {
    const pg = state.pages.find((p) => p.id === pageId);
    setPreviewSnapshotKind(pg?.publishedVersion ? 'published' : 'draft');
    setPreviewViewport('desktop');
    setPendingPdfExport(true);
    setPreviewPageId(pageId);
  };

  const handlePublishPage = (pageId: string) => {
    updatePageById(pageId, (p) => publishPageSnapshot(p));
    showToast('Page publiée avec snapshot isolé.');
  };

  const handleUnpublishPage = (pageId: string) => {
    updatePageById(pageId, (p) => setPageLifecycleStatus(p, 'draft'));
    showToast('Page repassée en brouillon.');
  };

  const handleDuplicatePage = (pageId: string) => {
    const source = state.pages.find((p) => p.id === pageId);
    if (!source) return;
    const copy = duplicatePageEntity(source);
    setState((prev) => ({ ...prev, pages: [copy, ...prev.pages] }));
    setEditingPageId(copy.id);
    showToast(`Page dupliquée : ${copy.title}`);
  };

  const handleArchivePage = (pageId: string) => {
    updatePageById(pageId, (p) => setPageLifecycleStatus(p, 'archived'));
    if (editingPageId === pageId) setEditingPageId(null);
    showToast('Page archivée.');
  };

  const handleCreatePageFromTemplate = (params: {
    template: PageTemplate;
    title: string;
    slug: string;
    language: CreatorLanguage;
    folderGroup?: string;
    externalOfferId: string;
    offerLabel: string;
  }) => {
    const created = createPageFromTemplate(params);
    setState((prev) => ({ ...prev, pages: [created, ...prev.pages] }));
    setEditingPageId(created.id);
    showToast(`Page créée : ${created.title}`);
  };

  const handleCreatedFullPage = (page: Page, toastText: string) => {
    setState((prev) => ({ ...prev, pages: [page, ...prev.pages] }));
    setCreateWizardOpen(false);
    setEditingPageId(page.id);
    showToast(toastText);
  };

  const handleCreateBlankPage = (params: {
    title: string;
    slug: string;
    universe: BusinessUniverse;
    language: CreatorLanguage;
    brandName: string;
  }) => {
    const created = createBlankModularPage(params);
    setState((prev) => ({ ...prev, pages: [created, ...prev.pages] }));
    setCreateWizardOpen(false);
    setEditingPageId(created.id);
    showToast(`Page modulaire créée : ${created.title}`);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    const src = state.templates.find((t) => t.id === templateId);
    if (!src) return;
    const copy: PageTemplate = {
      ...clonePageData(src),
      id: `tpl-copy-${Date.now().toString(36)}`,
      name: `${src.name} (Copie)`,
    };
    setState((prev) => ({ ...prev, templates: [copy, ...prev.templates] }));
    showToast(`Modèle dupliqué : ${copy.name}`);
  };

  const handleAddBlockFromLibrary = (pageId: string, blockType: BlockType) => {
    updatePageById(pageId, (p) => addBlockToPage(p, blockType));
    setEditingPageId(pageId);
    showToast('Bloc ajouté à la page.');
  };

  const handleAddMediaAsset = (asset: MediaAsset) => {
    setState((prev) => ({ ...prev, media: [asset, ...prev.media] }));
    showToast('Média ajouté à la médiathèque.');
  };

  const handleAttachVideoToPageGallery = (
    pageId: string,
    video: {
      title: string;
      caption: string;
      url: string;
      badge: string;
      posterKey: string;
    }
  ) => {
    updatePageById(pageId, (pg) => {
      const existingIdx = pg.blocks.findIndex((b) => b.type === 'video_gallery');
      const newItem = {
        id: `vid-reel-${Date.now().toString(36)}`,
        badge: video.badge,
        title: video.title,
        caption: video.caption,
        url: video.url,
        posterKey: video.posterKey,
        aspectRatio: '9:16' as const,
      };
      if (existingIdx >= 0) {
        const nextBlocks = pg.blocks.map((b, i) =>
          i === existingIdx
            ? {
                ...b,
                content: {
                  ...b.content,
                  videos: [newItem, ...(b.content.videos ?? [])],
                },
              }
            : b
        );
        return { ...pg, blocks: nextBlocks, updatedAt: new Date().toISOString() };
      }
      const galleryBlock = createDefaultBlock('video_gallery', pg.language, pg.universe);
      galleryBlock.content.videos = [newItem];
      const withGallery = addBlockToPage(pg, 'video_gallery');
      const addedIdx = withGallery.blocks.findIndex(
        (b) => b.type === 'video_gallery'
      );
      if (addedIdx >= 0) {
        withGallery.blocks[addedIdx] = galleryBlock;
      }
      return withGallery;
    });
    showToast('Reel MP4 intégré à la médiathèque et à la page sélectionnée.');
  };

  const handleUpdateSettings = (nextSettings: CreatorSettings) => {
    setState((prev) => ({ ...prev, settings: nextSettings }));
    showToast('Paramètres enregistrés.');
  };

  const handleResetDemoData = async () => {
    const fresh = createInitialCreatorState();
    setState(fresh);
    setEditingPageId(null);
    setPreviewPageId(null);
    setActiveNav('dashboard');
    try {
      window.localStorage.removeItem(LOCAL_CACHE_KEY);
      await fetch('/api/creator/state', { method: 'DELETE' });
    } catch {
      // Ignore network failure
    }
    showToast('Données de démonstration réinitialisées.');
  };

  // Full-Screen Preview Route (inside Studio, no CRM)
  if (previewPage) {
    const draftSnap = {
      blocks: previewPage.blocks,
      form: previewPage.form,
      seo: previewPage.seo,
      attribution: previewPage.attribution,
      offerRef: previewPage.offerRef,
      language: previewPage.language,
      title: previewPage.title,
      folderGroup: previewPage.folderGroup,
      creationMode: previewPage.creationMode,
      brandIdentity: previewPage.brandIdentity,
      header: previewPage.header,
      footer: previewPage.footer,
      commerceModules: previewPage.commerceModules,
    };

    const snapshot =
      previewSnapshotKind === 'published' && previewPage.publishedVersion
        ? previewPage.publishedVersion.snapshot
        : draftSnap;

    return (
      <div className="min-h-screen bg-[#E9EEF5] flex flex-col">
        <header className="sticky top-0 z-40 border-b border-[#102D45]/12 bg-white px-4 py-3 shadow-xs">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPendingPdfExport(false);
                  setPreviewPageId(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 px-3 py-1.5 text-xs font-bold text-[#102D45] hover:bg-[#F5F7FA]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Retour au Studio
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-[#102D45]">
                    {previewPage.title}
                  </h1>
                  <StatusBadge
                    status={previewPage.publication.status}
                    language={studioLanguage}
                  />
                </div>
                <p className="font-mono text-[11px] text-slate-500">
                  {previewPage.seo.canonicalPath} · {previewPage.language.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {previewPage.publishedVersion && (
                <div className="flex items-center rounded-lg border border-[#102D45]/12 bg-[#F5F7FA] p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewSnapshotKind('draft')}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      previewSnapshotKind === 'draft'
                        ? 'bg-white text-[#102D45] shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Brouillon courant
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewSnapshotKind('published')}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      previewSnapshotKind === 'published'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-500'
                    }`}
                  >
                    Publiée (v{previewPage.publishedVersion.versionNumber})
                  </button>
                </div>
              )}

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
                      onClick={() => setPreviewViewport(vp.id)}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${
                        previewViewport === vp.id
                          ? 'bg-[#102D45] text-white'
                          : 'text-[#1C4967]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {vp.label}
                    </button>
                  );
                })}
              </div>

              <SocialPosterControl
                variant="toolbar"
                page={previewPage}
                pageTitle={previewPage.title}
                slug={snapshot.seo.slug}
              />

              <PdfBrochureControl
                variant="toolbar"
                pageTitle={previewPage.title}
                slug={snapshot.seo.slug}
                revisionKey={previewPage.updatedAt}
                autoTrigger={pendingPdfExport}
                onAutoTriggered={() => setPendingPdfExport(false)}
              />

              <button
                type="button"
                onClick={() => handleOpenEditor(previewPage.id)}
                className="rounded-xl bg-[#102D45] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1C4967]"
              >
                Ouvrir dans l’éditeur
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <PagePreviewCanvas
            page={previewPage}
            snapshot={snapshot}
            viewport={previewViewport}
            crmConfig={state.settings.crmIntegration}
            defaultVoiceId={state.settings.defaultVoiceId}
            forcePilotRender={Boolean(previewPage.pilotRenderer)}
          />
        </main>
      </div>
    );
  }

  return (
    <CreatorLayout
      activeNav={activeNav}
      language={studioLanguage}
      pages={state.pages}
      activePageId={editingPageId}
      searchQuery={searchQuery}
      notifications={state.notifications}
      counts={counts}
      onSelectNav={(nav) => {
        if (nav === 'create_page') {
          setCreateWizardOpen(true);
          return;
        }
        setEditingPageId(null);
        setTemplateUniverseFilter('all');
        setActiveNav(nav);
      }}
      onChangeLanguage={setStudioLanguage}
      onChangeSearch={setSearchQuery}
      onSelectNotificationPage={(pageId) => handleOpenEditor(pageId)}
      onOpenPilotOrPage={(pageId, previewOnly) => {
        if (previewOnly) {
          handleOpenFullPreview(pageId);
        } else {
          handleOpenEditor(pageId);
        }
      }}
    >
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white shadow-lg border border-[#E7B34C]/50">
          {toastMessage}
        </div>
      )}

      {editingPage ? (
        <PageEditorWorkspace
          page={editingPage}
          studioLanguage={studioLanguage}
          media={state.media}
          crmConfig={state.settings.crmIntegration}
          defaultVoiceId={state.settings.defaultVoiceId}
          autoSaveSavedAt={autoSaveSavedAt}
          onUpdatePage={(nextPage) =>
            updatePageById(editingPage.id, () => nextPage)
          }
          onSaveDraftVersion={() => {
            updatePageById(editingPage.id, (p) =>
              saveDraftVersion(p, 'Sauvegarde manuelle brouillon')
            );
            showToast('Version brouillon enregistrée dans l’historique.');
          }}
          onPublishPage={() => handlePublishPage(editingPage.id)}
          onUnpublishPage={() => handleUnpublishPage(editingPage.id)}
          onDuplicatePage={() => handleDuplicatePage(editingPage.id)}
          onArchivePage={() => handleArchivePage(editingPage.id)}
          onRestoreVersion={(versionId) => {
            updatePageById(editingPage.id, (p) =>
              restorePageFromVersion(p, versionId)
            );
            showToast('Version restaurée dans le brouillon.');
          }}
          onOpenFullPreview={() => handleOpenFullPreview(editingPage.id)}
          onBack={() => setEditingPageId(null)}
        />
      ) : activeNav === 'dashboard' ? (
        <StudioDashboard
          language={studioLanguage}
          pages={state.pages}
          templates={state.templates}
          onNavigate={(nav) => {
            if (nav === 'create_page') {
              setCreateWizardOpen(true);
              return;
            }
            setTemplateUniverseFilter('all');
            setActiveNav(nav);
          }}
          onOpenCreateWizard={() => setCreateWizardOpen(true)}
          onStartUniversePage={(universe) => {
            setTemplateUniverseFilter(universe);
            setActiveNav('create_page');
          }}
          onOpenEditor={handleOpenEditor}
          onPreviewPage={handleOpenFullPreview}
          onDownloadPdf={handleDownloadPagePdf}
          onSelectTemplate={(tpl) => {
            setTemplateUniverseFilter(tpl.universe);
            setActiveNav('create_page');
          }}
        />
      ) : activeNav === 'all_pages' ||
        activeNav === 'drafts' ||
        activeNav === 'published' ||
        activeNav === 'archives' ? (
        <PagesListView
          mode={
            activeNav === 'all_pages'
              ? 'all'
              : activeNav === 'drafts'
                ? 'drafts'
                : activeNav === 'published'
                  ? 'published'
                  : 'archives'
          }
          language={studioLanguage}
          pages={state.pages}
          searchQuery={searchQuery}
          onCreateNew={() => setCreateWizardOpen(true)}
          onOpenEditor={handleOpenEditor}
          onPreviewPage={handleOpenFullPreview}
          onDownloadPdf={handleDownloadPagePdf}
          onPublishPage={handlePublishPage}
          onUnpublishPage={handleUnpublishPage}
          onDuplicatePage={handleDuplicatePage}
          onArchivePage={handleArchivePage}
        />
      ) : activeNav === 'create_page' || activeNav === 'templates' ? (
        <TemplatesGallery
          key={`${activeNav}-${templateUniverseFilter}`}
          language={studioLanguage}
          templates={state.templates}
          initialUniverse={templateUniverseFilter}
          crmConfig={state.settings.crmIntegration}
          createFlowActive={activeNav === 'create_page'}
          onCreatePageFromTemplate={handleCreatePageFromTemplate}
          onDuplicateTemplate={handleDuplicateTemplate}
        />
      ) : activeNav === 'videos' ? (
        <VideosStudioView
          language={studioLanguage}
          pages={state.pages}
          onOpenPagePreview={handleOpenFullPreview}
          onAttachVideoToPageGallery={handleAttachVideoToPageGallery}
          onAddMediaAsset={handleAddMediaAsset}
        />
      ) : activeNav === 'blocks' ? (
        <BlockLibraryView
          language={studioLanguage}
          pages={state.pages}
          activeEditorPageId={editingPageId}
          onAddBlockToPage={handleAddBlockFromLibrary}
        />
      ) : activeNav === 'media' ? (
        <MediaLibraryView
          media={state.media}
          onAddMediaAsset={handleAddMediaAsset}
        />
      ) : (
        <CreatorSettingsView
          settings={state.settings}
          onUpdateSettings={handleUpdateSettings}
          onResetDemoData={() => void handleResetDemoData()}
        />
      )}

      <CreatePageWizardModal
        open={createWizardOpen}
        defaultLanguage={studioLanguage}
        onClose={() => setCreateWizardOpen(false)}
        onCreatedPage={handleCreatedFullPage}
        onOpenTemplatesGallery={(universe) => {
          setCreateWizardOpen(false);
          setEditingPageId(null);
          setTemplateUniverseFilter(universe ?? 'all');
          setActiveNav('templates');
        }}
        onCreateBlankPage={handleCreateBlankPage}
      />
    </CreatorLayout>
  );
}
