import { useState } from 'react';
import { Copy, Eye, FilePlus2, Sparkles, X } from 'lucide-react';
import type { CrmIntegrationConfig } from '../../integration-contracts/crmAdapter';
import { STUDIO_I18N } from '../../lib/i18n';
import { getHeroImageSrc } from '../../lib/mediaRegistry';
import type {
  BusinessUniverse,
  CreatorLanguage,
  Page,
  PageTemplate,
} from '../../types/creator';
import { PagePreviewCanvas } from '../preview-renderer/PagePreviewCanvas';
import { UniverseTag } from '../shared-components/StatusBadge';

interface TemplatesGalleryProps {
  language: CreatorLanguage;
  templates: PageTemplate[];
  initialUniverse?: BusinessUniverse | 'all';
  crmConfig: CrmIntegrationConfig;
  createFlowActive?: boolean;
  onCreatePageFromTemplate: (params: {
    template: PageTemplate;
    title: string;
    slug: string;
    language: CreatorLanguage;
    externalOfferId: string;
    offerLabel: string;
  }) => void;
  onDuplicateTemplate: (templateId: string) => void;
}

export function TemplatesGallery({
  language,
  templates,
  initialUniverse = 'all',
  crmConfig,
  createFlowActive = false,
  onCreatePageFromTemplate,
  onDuplicateTemplate,
}: TemplatesGalleryProps) {
  const t = STUDIO_I18N[language];
  const [universeFilter, setUniverseFilter] = useState<BusinessUniverse | 'all'>(
    initialUniverse
  );
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);
  const [selectedForCreation, setSelectedForCreation] =
    useState<PageTemplate | null>(
      createFlowActive
        ? templates.find(
            (tpl) => initialUniverse === 'all' || tpl.universe === initialUniverse
          ) ?? templates[0] ?? null
        : null
    );

  const [newTitle, setNewTitle] = useState('Nouvelle Landing Page Commerciale');
  const [newSlug, setNewSlug] = useState('nouvelle-offre-easy2book');
  const [newLang, setNewLang] = useState<CreatorLanguage>(language);
  const [newOfferId, setNewOfferId] = useState('CAT-EXT-2027-01');
  const [newOfferLabel, setNewOfferLabel] = useState(
    'Offre liée au catalogue externe'
  );

  const filteredTemplates = templates.filter(
    (tpl) => universeFilter === 'all' || tpl.universe === universeFilter
  );

  const openCreationModal = (tpl: PageTemplate) => {
    setSelectedForCreation(tpl);
    setNewLang(tpl.defaultLanguage);
    const baseSlug = tpl.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 28);
    setNewTitle(`Offre — ${tpl.name.split('·')[0].trim()}`);
    setNewSlug(`${baseSlug}-${Math.floor(10 + Math.random() * 89)}`);
    setNewOfferId(`EXT-${tpl.universe.toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`);
    setNewOfferLabel(tpl.name);
  };

  const makeTemplatePreviewPage = (tpl: PageTemplate): Page => ({
    id: `preview-${tpl.id}`,
    title: tpl.name,
    universe: tpl.universe,
    templateId: tpl.id,
    language: tpl.defaultLanguage,
    isDemoData: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publication: { status: 'draft' },
    offerRef: {
      externalOfferId: 'PREVIEW-OFFER',
      externalSourceName: 'Modèle Easy2Book',
      universe: tpl.universe,
      offerCode: 'TPL-PREVIEW',
      displayLabel: tpl.name,
      cachedSummary: {
        startingPriceLabel: 'Tarif selon offre liée',
        datesOrValidity: 'Selon fiche offre',
        availabilityLabel: 'Aperçu modèle',
        conditionsSummary: 'Personnalisable',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'preview',
      metaTitle: tpl.name,
      metaDescription: tpl.description,
      ogTitle: tpl.name,
      ogDescription: tpl.description,
      canonicalPath: '/p/preview',
      noIndex: true,
    },
    attribution: {
      acquisitionSource: 'Studio Preview',
      utmSource: 'studio',
      utmMedium: 'preview',
      utmCampaign: tpl.id,
      utmContent: 'template',
    },
    form: tpl.defaultForm,
    blocks: tpl.defaultBlocks,
    publishedVersion: null,
    versions: [],
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#102D45]">
            {createFlowActive ? t.nav.createPage : t.nav.templates}
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Choisissez un modèle personnalisable FR / EN / AR pour démarrer votre landing page.
          </p>
        </div>
      </div>

      {/* Universe Filter */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#102D45]/10 bg-white p-3.5">
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
            {u === 'all' ? 'Tous les univers' : t.universes[u].label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((tpl) => (
          <article
            key={tpl.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#102D45]/10 bg-white shadow-2xs transition-all hover:border-[#E7B34C]"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-[#102D45]">
                <img
                  src={getHeroImageSrc(tpl.previewImageKey)}
                  alt={tpl.name}
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102D45]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <UniverseTag universe={tpl.universe} language={language} />
                  <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#102D45]">
                    {tpl.supportedLanguages.join(' / ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-[11px] font-bold text-[#C8922A]">
                  {tpl.styleTag}
                </p>
                <h2 className="mt-1 text-base font-bold text-[#102D45]">
                  {tpl.name}
                </h2>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {tpl.description}
                </p>
                <p className="mt-3 text-[11px] font-medium text-[#1C4967]">
                  {tpl.defaultBlocks.length} sections préconfigurées
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[#102D45]/10 bg-[#F5F7FA] p-3.5">
              <button
                type="button"
                onClick={() => openCreationModal(tpl)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#102D45] px-3 py-2 text-xs font-bold text-white hover:bg-[#1C4967]"
              >
                <FilePlus2 className="h-3.5 w-3.5 text-[#E7B34C]" />
                Utiliser ce modèle
              </button>
              <button
                type="button"
                onClick={() => setPreviewTemplate(tpl)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#102D45]/15 bg-white px-3 py-2 text-xs font-semibold text-[#102D45] hover:bg-slate-50"
              >
                <Eye className="h-3.5 w-3.5" />
                Aperçu
              </button>
              <button
                type="button"
                onClick={() => onDuplicateTemplate(tpl.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#102D45]/15 bg-white p-2 text-xs font-semibold text-[#1C4967] hover:bg-slate-50"
                title="Dupliquer le modèle"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Create Page Modal */}
      {selectedForCreation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102D45]/55 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#102D45]/10 pb-3">
              <div>
                <p className="text-xs font-bold text-[#C8922A]">
                  Créer une landing page
                </p>
                <h2 className="text-lg font-bold text-[#102D45]">
                  {selectedForCreation.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedForCreation(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-[#102D45]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreatePageFromTemplate({
                  template: selectedForCreation,
                  title: newTitle.trim() || selectedForCreation.name,
                  slug: newSlug
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, '-')
                    .replace(/(^-|-$)/g, ''),
                  language: newLang,
                  externalOfferId: newOfferId.trim(),
                  offerLabel: newOfferLabel.trim(),
                });
                setSelectedForCreation(null);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#102D45] mb-1">
                  Titre de la page
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1">
                    Slug URL (/p/...)
                  </label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono text-xs text-[#102D45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1">
                    Langue de la page
                  </label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value as CreatorLanguage)}
                    className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-semibold text-[#102D45]"
                  >
                    <option value="fr">Français (LTR)</option>
                    <option value="ar">العربية (RTL)</option>
                    <option value="en">English (LTR)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C4967]">
                  <Sparkles className="h-3.5 w-3.5 text-[#E7B34C]" />
                  Référence Offre Externe (Catalogue non dupliqué)
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="ID Offre Externe"
                    value={newOfferId}
                    onChange={(e) => setNewOfferId(e.target.value)}
                    className="rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 font-mono text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Libellé offre externe"
                    value={newOfferLabel}
                    onChange={(e) => setNewOfferLabel(e.target.value)}
                    className="rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedForCreation(null)}
                  className="rounded-xl border border-[#102D45]/15 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#102D45] px-5 py-2 text-xs font-bold text-white hover:bg-[#1C4967]"
                >
                  Créer et ouvrir dans l’éditeur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#102D45]/80 p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-t-2xl bg-white px-5 py-3 border-b border-[#102D45]/10">
            <div>
              <p className="text-xs font-bold text-[#C8922A]">Aperçu du modèle</p>
              <h3 className="text-sm font-bold text-[#102D45]">
                {previewTemplate.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  openCreationModal(tpl);
                }}
                className="rounded-xl bg-[#102D45] px-4 py-2 text-xs font-bold text-white"
              >
                Utiliser ce modèle
              </button>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-[#F5F7FA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-6xl flex-1 overflow-y-auto rounded-b-2xl bg-[#F5F7FA] p-4 md:p-8">
            <PagePreviewCanvas
              page={makeTemplatePreviewPage(previewTemplate)}
              snapshot={{
                blocks: previewTemplate.defaultBlocks,
                form: previewTemplate.defaultForm,
                seo: {
                  slug: 'preview',
                  metaTitle: previewTemplate.name,
                  metaDescription: previewTemplate.description,
                  ogTitle: previewTemplate.name,
                  ogDescription: previewTemplate.description,
                  canonicalPath: '/p/preview',
                  noIndex: true,
                },
                attribution: {
                  acquisitionSource: 'Preview',
                  utmSource: 'studio',
                  utmMedium: 'preview',
                  utmCampaign: previewTemplate.id,
                  utmContent: 'preview',
                },
                offerRef: makeTemplatePreviewPage(previewTemplate).offerRef,
                language: previewTemplate.defaultLanguage,
                title: previewTemplate.name,
              }}
              viewport="desktop"
              crmConfig={crmConfig}
            />
          </div>
        </div>
      )}
    </div>
  );
}
