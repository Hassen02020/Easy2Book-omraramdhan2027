import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Laptop, Smartphone, Tablet } from 'lucide-react';
import { BLOCK_CATALOG } from './components/block-library/blockCatalog';
import { BlockLibraryView } from './components/block-library/BlockLibraryView';
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
import { CreatorSettingsView } from './components/settings/CreatorSettingsView';
import { StatusBadge } from './components/shared-components/StatusBadge';
import { TemplatesGallery } from './components/templates/TemplatesGallery';
import { createInitialCreatorState } from './data/demoData';
import {
  addBlockToPage,
  clonePageData,
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

function ensurePilotPageMetadata(raw: CreatorState): CreatorState {
  return {
    ...raw,
    pages: raw.pages.map((pg) =>
      pg.id === 'page-omra-ramadan-2027'
        ? {
            ...pg,
            title:
              pg.title === 'عمرة رمضان 2027 — العرض الكامل'
                ? 'Easy2Book — عمرة رمضان كامل'
                : pg.title,
            folderGroup: pg.folderGroup || 'Ramadan 2027',
            isPilotPage: true,
            pilotRenderer: 'omra_ramadan_2027',
          }
        : pg
    ),
  };
}

export default function App() {
  const [state, setState] = useState<CreatorState>(() => {
    try {
      const cached = window.localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as CreatorState;
        if (parsed && Array.isArray(parsed.pages) && Array.isArray(parsed.templates)) {
          return ensurePilotPageMetadata(parsed);
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
  const [previewViewport, setPreviewViewport] =
    useState<PreviewViewport>('desktop');
  const [previewSnapshotKind, setPreviewSnapshotKind] = useState<
    'draft' | 'published'
  >('draft');
  const [autoSaveSavedAt, setAutoSaveSavedAt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
          setState(ensurePilotPageMetadata(data.state));
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
    externalOfferId: string;
    offerLabel: string;
  }) => {
    const created = createPageFromTemplate(params);
    setState((prev) => ({ ...prev, pages: [created, ...prev.pages] }));
    setEditingPageId(created.id);
    showToast(`Page créée : ${created.title}`);
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
                onClick={() => setPreviewPageId(null)}
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
            forcePilotRender={previewPage.pilotRenderer === 'omra_ramadan_2027'}
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
            setTemplateUniverseFilter('all');
            setActiveNav(nav);
          }}
          onStartUniversePage={(universe) => {
            setTemplateUniverseFilter(universe);
            setActiveNav('create_page');
          }}
          onOpenEditor={handleOpenEditor}
          onPreviewPage={handleOpenFullPreview}
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
          onCreateNew={() => {
            setTemplateUniverseFilter('all');
            setActiveNav('create_page');
          }}
          onOpenEditor={handleOpenEditor}
          onPreviewPage={handleOpenFullPreview}
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
    </CreatorLayout>
  );
}
