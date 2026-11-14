import { useState } from 'react';
import {
  ArrowLeft,
  Blocks,
  Check,
  FilePlus2,
  Layers,
  Link2,
  Loader2,
  Sparkles,
  Tag,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { UNIVERSAL_COMMERCE_MODULES } from '../../lib/commerceModulesCatalog';
import { generateFullPageFromBrief } from '../../lib/fullPageGenerator';
import type {
  BrandVisualStyle,
  BusinessUniverse,
  CommerceModuleId,
  CreatorLanguage,
  HeaderVariant,
  OfferReference,
  Page,
} from '../../types/creator';

type CreationPath =
  | 'selector'
  | 'full_page'
  | 'linked_offer'
  | 'blank_modular';

interface CreatePageWizardModalProps {
  open: boolean;
  defaultLanguage: CreatorLanguage;
  onClose: () => void;
  onCreatedPage: (page: Page, toastText: string) => void;
  onOpenTemplatesGallery: (universe?: BusinessUniverse | 'all') => void;
  onCreateBlankPage: (params: {
    title: string;
    slug: string;
    universe: BusinessUniverse;
    language: CreatorLanguage;
    brandName: string;
  }) => void;
}

const SAMPLE_LINKED_OFFERS: OfferReference[] = [
  {
    externalOfferId: 'EXT-OMRA-2027-DEC',
    externalSourceName: 'Catalogue Central Easy2Book',
    universe: 'omra',
    offerCode: 'E2B-OMR-2712',
    displayLabel: 'Omra Décembre / Hiver 2027 — Départ Tunis',
    cachedSummary: {
      startingPriceLabel: 'À partir de 5 900 د.ت (Quadruple)',
      datesOrValidity: 'Validité catalogue · Places limitées',
      availabilityLabel: 'Vérification temps réel CRM',
      conditionsSummary: 'Remise famille dès 2 pers. · Groupes +10 sur demande',
    },
    syncMode: 'external_reference',
  },
  {
    externalOfferId: 'EXT-VOY-IST-2027',
    externalSourceName: 'Catalogue Central Easy2Book',
    universe: 'voyages',
    offerCode: 'E2B-VOY-IST7',
    displayLabel: 'Circuit Istanbul & Bosphore 7 Nuits (Groupe Accompagné)',
    cachedSummary: {
      startingPriceLabel: 'Selon fiche catalogue externe',
      datesOrValidity: 'Départs hebdomadaires saison 2027',
      availabilityLabel: 'Confirmation conseiller',
      conditionsSummary: 'Vols A/R + Hôtel 4★/5★ + Transferts',
    },
    syncMode: 'external_reference',
  },
  {
    externalOfferId: 'EXT-HTL-DJR-2027',
    externalSourceName: 'Catalogue Central Easy2Book',
    universe: 'hotels_tunisie',
    offerCode: 'E2B-HTL-DJR5',
    displayLabel: 'Promo Hôtels Djerba & Hammamet 5★ — Séjours Famille',
    cachedSummary: {
      startingPriceLabel: 'Tarifs saisonniers catalogue',
      datesOrValidity: 'Été & Vacances scolaires',
      availabilityLabel: 'Allotment vérifié',
      conditionsSummary: 'Formules All-Inclusive & Demi-pension',
    },
    syncMode: 'external_reference',
  },
  {
    externalOfferId: 'EXT-VISA-SCH-2027',
    externalSourceName: 'Catalogue Central Easy2Book',
    universe: 'visa',
    offerCode: 'E2B-VIS-SCH1',
    displayLabel: 'Accompagnement Dossier Visa Schengen & Voyages',
    cachedSummary: {
      startingPriceLabel: 'Frais de dossier sur devis',
      datesOrValidity: 'Traitement continu',
      availabilityLabel: 'Prise de RDV selon calendrier consulaire',
      conditionsSummary: 'Checklist pièces + assurance voyage conforme',
    },
    syncMode: 'external_reference',
  },
];

const VISUAL_STYLE_OPTIONS: {
  id: BrandVisualStyle;
  label: string;
  desc: string;
}[] = [
  { id: 'premium', label: 'Premium', desc: 'Bleu profond & Or structuré' },
  { id: 'moderne', label: 'Moderne', desc: 'Contrastes nets & typo Outfit' },
  { id: 'luxe', label: 'Luxe', desc: 'Noir éditorial & Playfair Display' },
  { id: 'minimaliste', label: 'Minimaliste', desc: 'Épuré, espace généreux' },
  { id: 'familial', label: 'Familial', desc: 'Chaleureux & rassurant' },
  { id: 'commercial', label: 'Commercial', desc: 'Direct & orienté action' },
];

const HEADER_VARIANT_OPTIONS: { id: HeaderVariant; label: string }[] = [
  { id: 'corporate', label: '1. Header Corporate' },
  { id: 'premium', label: '2. Header Premium' },
  { id: 'touristique', label: '3. Header Touristique' },
  { id: 'minimaliste', label: '4. Header Minimaliste' },
  { id: 'hotelier', label: '5. Header Hôtelier' },
];

export function CreatePageWizardModal({
  open,
  defaultLanguage,
  onClose,
  onCreatedPage,
  onOpenTemplatesGallery,
  onCreateBlankPage,
}: CreatePageWizardModalProps) {
  const [step, setStep] = useState<CreationPath>('selector');

  // Mode A state
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<CreatorLanguage>(defaultLanguage);
  const [brandName, setBrandName] = useState('Easy2Book');
  const [tagline, setTagline] = useState('');
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [visualStyle, setVisualStyle] = useState<BrandVisualStyle>('premium');
  const [headerVariant, setHeaderVariant] = useState<HeaderVariant>('premium');
  const [commerceModules, setCommerceModules] = useState<CommerceModuleId[]>([
    'hotels',
    'voyages',
    'omra',
    'visa',
  ]);
  const [includeVerifiedTestimonials, setIncludeVerifiedTestimonials] =
    useState(false);
  const [selectedLinkedOffer, setSelectedLinkedOffer] = useState<OfferReference>(
    SAMPLE_LINKED_OFFERS[0]
  );

  // Optional real contacts (empty by default - never fabricated)
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Mode B blank state
  const [blankTitle, setBlankTitle] = useState('Nouvelle page modulaire');
  const [blankSlug, setBlankSlug] = useState(
    `page-modulaire-${Math.floor(10 + Math.random() * 89)}`
  );
  const [blankUniverse, setBlankUniverse] =
    useState<BusinessUniverse>('voyages');
  const [blankBrand, setBlankBrand] = useState('Easy2Book');

  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const toggleModule = (id: CommerceModuleId) => {
    setCommerceModules((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateModeA = async (withLinkedOffer: boolean) => {
    setErrorMsg(null);
    setGenerating(true);
    try {
      const effectivePrompt = withLinkedOffer
        ? `${prompt.trim() || selectedLinkedOffer.displayLabel} — Offre liée : ${selectedLinkedOffer.displayLabel} (${selectedLinkedOffer.cachedSummary.startingPriceLabel}, ${selectedLinkedOffer.cachedSummary.conditionsSummary}).`
        : prompt.trim() ||
          'Site complet Easy2Book pour agence de voyage : hôtels Tunisie, départs Omra, voyages organisés, billets d’avion, bateaux, transferts et services Visa.';

      const { page, usedAi } = await generateFullPageFromBrief({
        prompt: effectivePrompt,
        language,
        brandName,
        tagline: tagline.trim() || undefined,
        logoSrc,
        visualStyle,
        headerVariant,
        commerceModules,
        includeVerifiedTestimonials,
        linkedOfferRef: withLinkedOffer ? selectedLinkedOffer : undefined,
        contacts: {
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim(),
          address: address.trim(),
        },
      });
      onCreatedPage(
        page,
        usedAi
          ? 'Page complète générée par IA (Mode A) et ouverte dans l’éditeur.'
          : 'Page complète générée (Mode A structuré) et ouverte dans l’éditeur.'
      );
      setStep('selector');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Impossible de générer la page complète.'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102D45]/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#102D45]/15 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#102D45]/10 bg-[#102D45] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            {step !== 'selector' && (
              <button
                type="button"
                onClick={() => setStep('selector')}
                className="rounded-lg border border-white/20 p-1.5 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#E7B34C]">
                Easy2Book · Landing Page Studio
              </p>
              <h2 className="text-base md:text-lg font-extrabold">
                {step === 'selector'
                  ? 'Créer une nouvelle page'
                  : step === 'full_page'
                    ? 'Mode A — Générateur IA de page d’accueil complète'
                    : step === 'linked_offer'
                      ? 'Page complète liée à une offre catalogue'
                      : 'Mode B — Partir d’une page vierge modulaire'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'selector' && (
            <div className="space-y-5">
              <p className="text-xs text-slate-600">
                Choisissez votre mode de création : générez un site complet cohérent avec identité visuelle, header, modules et footer (Mode A), ou construisez bloc par bloc (Mode B).
              </p>

              <div className="grid gap-3.5 md:grid-cols-2">
                {/* Choice 1: Full Homepage Mode A */}
                <button
                  type="button"
                  onClick={() => setStep('full_page')}
                  className="md:col-span-2 flex items-start justify-between gap-4 rounded-2xl border-2 border-[#E7B34C] bg-[#102D45] p-5 text-start text-white transition-transform hover:scale-[1.005]"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#E7B34C] px-2 py-0.5 text-[10px] font-extrabold text-[#102D45]">
                        MODE A · RECOMMANDÉ
                      </span>
                      <span className="text-[11px] text-slate-300">
                        IA Full Page Generator
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold">
                      1. Page d’accueil complète (Site vitrine & commerce voyage)
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
                      Décrivez votre activité : l’IA génère l’identité visuelle (logo réel ou typographie provisoire), un Header parmi 5 variantes, un Hero, la présentation de l’entreprise, vos modules voyage activés (Hôtels, Vols, Ferries, Omra, Visa…), les arguments de confiance, galerie, FAQ, formulaire CRM et Footer complet.
                    </p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7B34C] text-[#102D45]">
                    <Wand2 className="h-5 w-5" />
                  </div>
                </button>

                {/* Choice 2: Landing page commerciale */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTemplatesGallery('all');
                  }}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#102D45]/12 bg-[#F5F7FA] p-4 text-start transition-colors hover:border-[#E7B34C] hover:bg-white"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#102D45] text-[#E7B34C]">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102D45]">
                      2. Landing page commerciale
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Créez une page dédiée à une campagne publicitaire ou un départ spécifique avec conversion directe.
                    </p>
                  </div>
                </button>

                {/* Choice 3: Linked Offer */}
                <button
                  type="button"
                  onClick={() => setStep('linked_offer')}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#102D45]/12 bg-[#F5F7FA] p-4 text-start transition-colors hover:border-[#E7B34C] hover:bg-white"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1C4967] text-white">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102D45]">
                      3. Page liée à une offre existante
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Rattachez une référence du catalogue externe (Omra, Voyage, Hôtel, Visa) pour pré-alimenter la génération.
                    </p>
                  </div>
                </button>

                {/* Choice 4: From a Template */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTemplatesGallery('all');
                  }}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#102D45]/12 bg-[#F5F7FA] p-4 text-start transition-colors hover:border-[#E7B34C] hover:bg-white"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-[#102D45]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102D45]">
                      4. Page à partir d’un modèle
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Choisissez parmi 16 modèles tourisme professionnels FR / EN / AR prêts à personnaliser.
                    </p>
                  </div>
                </button>

                {/* Choice 5: Blank Mode B */}
                <button
                  type="button"
                  onClick={() => setStep('blank_modular')}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#102D45]/12 bg-[#F5F7FA] p-4 text-start transition-colors hover:border-[#E7B34C] hover:bg-white"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#102D45]/15 text-[#102D45]">
                    <Blocks className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102D45]">
                      5. Partir d’une page vierge (Mode B)
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Base propre avec Header, Footer et formulaire CRM prêts à assembler bloc par bloc depuis la bibliothèque.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {(step === 'full_page' || step === 'linked_offer') && (
            <div className="space-y-6">
              {step === 'linked_offer' && (
                <div className="rounded-xl border border-[#1C4967]/25 bg-[#F5F7FA] p-4 space-y-2.5">
                  <label className="block text-xs font-bold text-[#102D45]">
                    Sélectionnez une référence du catalogue externe :
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {SAMPLE_LINKED_OFFERS.map((offer) => {
                      const active =
                        selectedLinkedOffer.externalOfferId ===
                        offer.externalOfferId;
                      return (
                        <button
                          key={offer.externalOfferId}
                          type="button"
                          onClick={() => setSelectedLinkedOffer(offer)}
                          className={`rounded-xl border p-3 text-start transition-colors ${
                            active
                              ? 'border-[#E7B34C] bg-white shadow-2xs'
                              : 'border-[#102D45]/10 bg-white/60 hover:bg-white'
                          }`}
                        >
                          <p className="font-mono text-[10px] font-bold text-[#1C4967]">
                            {offer.offerCode} · {offer.universe}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-[#102D45]">
                            {offer.displayLabel}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {offer.cachedSummary.startingPriceLabel}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activity Prompt */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-bold text-[#102D45]">
                    Décrivez votre activité ou le projet de page
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPrompt(
                        'Easy2Book, plateforme de voyage complète en Tunisie : séjours hôtels 4★ et 5★ à Hammamet et Djerba, départs Omra encadrés, voyages organisés internationaux, billetterie aérienne, traversées bateaux, transferts privés et assistance Visa.'
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C4967] hover:underline"
                  >
                    <Sparkles className="h-3 w-3 text-[#E7B34C]" />
                    Remplir un exemple Easy2Book
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex : Agence de voyage proposant hôtels en Tunisie, Omra Ramadan, circuits Turquie/Dubaï, billetterie vols, ferries et services Visa..."
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3.5 py-2.5 text-xs text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Brand Identity & Logo */}
              <div className="grid gap-4 md:grid-cols-12 rounded-2xl border border-[#102D45]/10 bg-[#F5F7FA] p-4">
                <div className="md:col-span-4 space-y-2.5">
                  <label className="block text-xs font-bold text-[#102D45]">
                    Nom de la marque
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-white px-3 py-2 text-xs font-bold text-[#102D45]"
                  />
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Langue de génération
                  </label>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as CreatorLanguage)
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-white px-3 py-2 text-xs font-bold text-[#102D45]"
                  >
                    <option value="fr">Français (LTR)</option>
                    <option value="ar">العربية (RTL)</option>
                    <option value="en">English (LTR)</option>
                  </select>
                </div>

                <div className="md:col-span-8 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-[#102D45]">
                      Logo de l’entreprise (jamais remplacé automatiquement)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {logoSrc
                        ? 'Logo réel fourni'
                        : 'Aucun logo fourni -> monogramme typographique provisoire'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-white px-3 py-2 text-xs font-semibold text-[#102D45] hover:border-[#E7B34C]">
                      <Upload className="h-3.5 w-3.5 text-[#1C4967]" />
                      <span>Importer un logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setLogoSrc('/assets/aistudio/logo_transparent_e9918557.png')
                      }
                      className="rounded-lg border border-[#102D45]/15 bg-white px-3 py-2 text-xs font-semibold text-[#1C4967] hover:border-[#E7B34C]"
                    >
                      Utiliser logo Easy2Book
                    </button>
                    {logoSrc && (
                      <button
                        type="button"
                        onClick={() => setLogoSrc(null)}
                        className="rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Revenir au provisoire
                      </button>
                    )}
                  </div>
                  {logoSrc && (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#102D45]/10 bg-white px-3 py-1.5">
                      <img
                        src={logoSrc}
                        alt="Logo sélectionné"
                        className="h-7 w-auto object-contain"
                      />
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Prêt
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Signature / sous-titre court (optionnel)"
                    className="w-full rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              {/* Visual Style & Header Variant */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-2">
                    Style visuel global
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {VISUAL_STYLE_OPTIONS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setVisualStyle(st.id)}
                        className={`rounded-xl border p-2.5 text-start transition-colors ${
                          visualStyle === st.id
                            ? 'border-[#E7B34C] bg-[#102D45] text-white'
                            : 'border-[#102D45]/12 bg-white text-[#102D45] hover:border-[#1C4967]'
                        }`}
                      >
                        <p className="text-xs font-bold">{st.label}</p>
                        <p
                          className={`text-[10px] ${
                            visualStyle === st.id
                              ? 'text-slate-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {st.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-2">
                    Variante de Header (5 styles)
                  </label>
                  <div className="space-y-1.5">
                    {HEADER_VARIANT_OPTIONS.map((hv) => (
                      <button
                        key={hv.id}
                        type="button"
                        onClick={() => setHeaderVariant(hv.id)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                          headerVariant === hv.id
                            ? 'border-[#E7B34C] bg-[#E7B34C]/20 text-[#102D45]'
                            : 'border-[#102D45]/12 bg-white text-slate-600 hover:text-[#102D45]'
                        }`}
                      >
                        <span>{hv.label}</span>
                        {headerVariant === hv.id && (
                          <Check className="h-3.5 w-3.5 text-[#102D45]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Universal Travel Commerce Modules */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-bold text-[#102D45]">
                    Modules Commerce Voyage à activer sur la page (extensibles sans refaire le site)
                  </label>
                  <span className="font-mono text-[11px] font-bold text-[#1C4967]">
                    {commerceModules.length} sélectionné(s)
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {UNIVERSAL_COMMERCE_MODULES.map((mod) => {
                    const active = commerceModules.includes(mod.id);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className={`rounded-xl border p-2.5 text-start transition-colors ${
                          active
                            ? 'border-[#E7B34C] bg-[#102D45] text-white'
                            : 'border-[#102D45]/12 bg-[#F5F7FA] text-[#102D45] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold truncate">
                            {mod.labels[language]}
                          </span>
                          {active && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#E7B34C]" />
                          )}
                        </div>
                        <p
                          className={`mt-1 text-[10px] line-clamp-2 ${
                            active ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {mod.capabilities[language]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Verified Contacts & Testimonials */}
              <div className="rounded-2xl border border-[#102D45]/10 bg-[#F5F7FA] p-4 space-y-3">
                <p className="text-xs font-bold text-[#102D45]">
                  Coordonnées réelles pour Header & Footer (laisser vide si non renseigné — rien ne sera inventé)
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp (active le bouton)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="email"
                    placeholder="Email professionnel"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Adresse agence"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs"
                  />
                </div>

                <label className="flex items-center gap-2 pt-1 text-xs font-medium text-[#102D45]">
                  <input
                    type="checkbox"
                    checked={includeVerifiedTestimonials}
                    onChange={(e) =>
                      setIncludeVerifiedTestimonials(e.target.checked)
                    }
                    className="accent-[#102D45]"
                  />
                  <span>
                    Inclure la section Témoignages clients vérifiés (données vérifiées Omra Easy2Book uniquement)
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700">
                  {errorMsg}
                </div>
              )}
            </div>
          )}

          {step === 'blank_modular' && (
            <form
              id="blank-modular-form"
              onSubmit={(e) => {
                e.preventDefault();
                onCreateBlankPage({
                  title: blankTitle.trim() || 'Nouvelle page modulaire',
                  slug: blankSlug.trim() || `page-${Date.now().toString(36)}`,
                  universe: blankUniverse,
                  language,
                  brandName: blankBrand.trim() || 'Easy2Book',
                });
                setStep('selector');
              }}
              className="space-y-4 max-w-xl mx-auto py-2"
            >
              <div>
                <label className="block text-xs font-bold text-[#102D45] mb-1">
                  Titre de la page
                </label>
                <input
                  type="text"
                  required
                  value={blankTitle}
                  onChange={(e) => setBlankTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45]"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    required
                    value={blankSlug}
                    onChange={(e) => setBlankSlug(e.target.value)}
                    className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono text-xs text-[#102D45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1">
                    Marque / Identité
                  </label>
                  <input
                    type="text"
                    value={blankBrand}
                    onChange={(e) => setBlankBrand(e.target.value)}
                    className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs text-[#102D45]"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1">
                    Univers principal
                  </label>
                  <select
                    value={blankUniverse}
                    onChange={(e) =>
                      setBlankUniverse(e.target.value as BusinessUniverse)
                    }
                    className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-bold text-[#102D45]"
                  >
                    <option value="omra">Omra</option>
                    <option value="voyages">Voyages organisés</option>
                    <option value="hotels_tunisie">Hôtels Tunisie</option>
                    <option value="visa">Services Visa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1">
                    Langue
                  </label>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as CreatorLanguage)
                    }
                    className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-bold text-[#102D45]"
                  >
                    <option value="fr">Français (LTR)</option>
                    <option value="ar">العربية (RTL)</option>
                    <option value="en">English (LTR)</option>
                  </select>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-[#102D45]/10 bg-[#F5F7FA] px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#102D45]/15 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#102D45]"
          >
            Fermer
          </button>

          {(step === 'full_page' || step === 'linked_offer') && (
            <button
              type="button"
              disabled={generating}
              onClick={() => void handleGenerateModeA(step === 'linked_offer')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967] disabled:opacity-60"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#E7B34C]" />
                  <span>Génération de la page complète...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-[#E7B34C]" />
                  <span>Générer la page complète (Mode A)</span>
                </>
              )}
            </button>
          )}

          {step === 'blank_modular' && (
            <button
              type="submit"
              form="blank-modular-form"
              className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
            >
              <FilePlus2 className="h-4 w-4 text-[#E7B34C]" />
              <span>Créer et ouvrir dans l’éditeur</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
