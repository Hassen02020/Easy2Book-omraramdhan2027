import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Layers,
  Loader2,
  RotateCcw,
  Upload,
  X,
} from 'lucide-react';
import { formatFileSize } from '../../lib/reelVideoExporter';
import {
  buildDefaultPosterConfig,
  CURATED_POSTER_PHOTOS,
  exportSocialPosterPng,
  renderSocialPosterToCanvas,
  SOCIAL_POSTER_FORMATS,
  type PosterSeedInput,
  type SocialPosterConfig,
  type SocialPosterFormatId,
  type SocialPosterStyleId,
} from '../../lib/socialPosterGenerator';
import type { CreatorLanguage } from '../../types/creator';

interface SocialPosterControlProps extends PosterSeedInput {
  variant?: 'toolbar' | 'pilot_header' | 'pilot_inline';
  locale?: 'ar' | 'fr';
}

const STYLE_OPTIONS: {
  id: SocialPosterStyleId;
  labelFr: string;
  labelAr: string;
  descFr: string;
}[] = [
  {
    id: 'editorial_luxury',
    labelFr: 'Éditorial Luxe',
    labelAr: 'تصميم فاخر كامل',
    descFr: 'Photo plein cadre · voile marine & or',
  },
  {
    id: 'magazine_split',
    labelFr: 'Magazine Split',
    labelAr: 'تقسيم مجلة عصري',
    descFr: 'Photo nette en haut · bloc marine en bas',
  },
  {
    id: 'ivory_concierge',
    labelFr: 'Conciergerie Ivoire',
    labelAr: 'إطار فندقي عاجي',
    descFr: 'Idéal hôtels 5★ · cadre ivoire & or',
  },
];

export function SocialPosterControl({
  variant = 'toolbar',
  locale,
  page,
  pageTitle,
  slug,
  universe,
  language,
  eyebrow,
  headline,
  subtitle,
  highlights,
  priceLabel,
  showPrice,
  photoKey,
  flagCodes,
}: SocialPosterControlProps) {
  const isFrUi = locale === 'fr' || (!locale && variant === 'toolbar');

  const seed = useMemo<PosterSeedInput>(
    () => ({
      page,
      pageTitle,
      slug,
      universe,
      language,
      eyebrow,
      headline,
      subtitle,
      highlights,
      priceLabel,
      showPrice,
      photoKey,
      flagCodes,
    }),
    [
      eyebrow,
      flagCodes,
      headline,
      highlights,
      language,
      page,
      pageTitle,
      photoKey,
      priceLabel,
      showPrice,
      slug,
      subtitle,
      universe,
    ]
  );

  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<SocialPosterConfig>(() =>
    buildDefaultPosterConfig(seed)
  );
  const [photoTab, setPhotoTab] = useState<'visa' | 'hotels' | 'destinations'>(
    () =>
      (universe ?? page?.universe) === 'hotels_tunisie'
        ? 'hotels'
        : (universe ?? page?.universe) === 'visa'
          ? 'visa'
          : 'destinations'
  );
  const [rendering, setRendering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingPack, setDownloadingPack] = useState(false);
  const [lastExport, setLastExport] = useState<{
    fileName: string;
    sizeBytes: number;
    width: number;
    height: number;
    count?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync preset whenever the modal opens for a landing page
  const handleOpen = () => {
    const fresh = buildDefaultPosterConfig(seed);
    setConfig(fresh);
    setPhotoTab(
      (universe ?? page?.universe) === 'hotels_tunisie'
        ? 'hotels'
        : (universe ?? page?.universe) === 'visa'
          ? 'visa'
          : 'destinations'
    );
    setLastExport(null);
    setError(null);
    setOpen(true);
  };

  // Render live canvas preview on every config edit while open
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    let cancelled = false;
    setRendering(true);
    void renderSocialPosterToCanvas(canvasRef.current, config).finally(() => {
      if (!cancelled) setRendering(false);
    });
    return () => {
      cancelled = true;
    };
  }, [config, open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const activeFormatSpec =
    SOCIAL_POSTER_FORMATS.find((f) => f.id === config.format) ??
    SOCIAL_POSTER_FORMATS[0];

  const handleDownloadSingle = async () => {
    if (downloading) return;
    setDownloading(true);
    setError(null);
    try {
      const res = await exportSocialPosterPng(
        config,
        slug || page?.seo?.slug || pageTitle || page?.title || 'affiche'
      );
      setLastExport(res);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de télécharger l’affiche PNG.'
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllFormats = async () => {
    if (downloadingPack) return;
    setDownloadingPack(true);
    setError(null);
    try {
      const baseSlug =
        slug || page?.seo?.slug || pageTitle || page?.title || 'affiche';
      let lastRes: {
        fileName: string;
        sizeBytes: number;
        width: number;
        height: number;
      } | null = null;
      for (const fmt of SOCIAL_POSTER_FORMATS) {
        lastRes = await exportSocialPosterPng(
          { ...config, format: fmt.id },
          baseSlug
        );
        await new Promise((r) => window.setTimeout(r, 260));
      }
      if (lastRes) {
        setLastExport({ ...lastRes, count: SOCIAL_POSTER_FORMATS.length });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible d’exporter les 3 formats PNG.'
      );
    } finally {
      setDownloadingPack(false);
    }
  };

  const handleUploadCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const src = reader.result;
        setConfig((prev) => ({ ...prev, photoSrc: src }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSwitchPosterLanguage = (nextLang: CreatorLanguage) => {
    const rebuilt = buildDefaultPosterConfig({
      ...seed,
      language: nextLang,
    });
    setConfig((prev) => ({
      ...rebuilt,
      format: prev.format,
      style: prev.style,
      photoSrc: prev.photoSrc,
      showPrice: prev.showPrice,
    }));
  };

  const filteredPhotos = CURATED_POSTER_PHOTOS.filter(
    (p) => p.category === photoTab
  );

  const triggerButton =
    variant === 'pilot_header' ? (
      <button
        type="button"
        data-pdf-exclude="true"
        onClick={handleOpen}
        title={
          isFrUi
            ? 'Générer et télécharger une affiche PNG réseaux sociaux'
            : 'إنشاء وتحميل ملصق PNG احترافي لوسائل التواصل'
        }
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#C8922A]/50 bg-[#FFFDF7] px-3 py-2 text-xs font-bold text-[#102D45] hover:border-[#C8922A] hover:bg-[#FBF3DC] whitespace-nowrap shrink-0"
      >
        <ImageIcon className="h-3.5 w-3.5 text-[#C8922A]" />
        <span>{isFrUi ? 'Affiche PNG' : 'ملصق PNG'}</span>
      </button>
    ) : variant === 'pilot_inline' ? (
      <button
        type="button"
        data-pdf-exclude="true"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[#C8922A]/50 bg-[#FFFDF7] px-4 py-3 text-xs font-bold text-[#102D45] shadow-xs hover:bg-[#FBF3DC] hover:border-[#C8922A] whitespace-nowrap shrink-0"
      >
        <ImageIcon className="h-3.5 w-3.5 text-[#C8922A]" />
        <span>
          {isFrUi
            ? 'Télécharger Affiche PNG'
            : 'إنشاء وتحميل ملصق PNG للسوشيال ميديا'}
        </span>
      </button>
    ) : (
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#C8922A]/45 bg-[#FFFDF7] px-3 py-1.5 text-xs font-bold text-[#102D45] hover:bg-[#FBF3DC] whitespace-nowrap shrink-0"
      >
        <ImageIcon className="h-3.5 w-3.5 text-[#C8922A]" />
        <span>Affiche PNG</span>
      </button>
    );

  const modalNode =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            data-pdf-exclude="true"
            dir="ltr"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#07111F]/72 p-3 md:p-6 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex h-[92vh] max-h-[860px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#102D45]/15 bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between gap-4 border-b border-[#102D45]/10 bg-white px-5 py-3.5">
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-[#102D45] truncate">
                    Studio Affiche PNG — Réseaux Sociaux
                  </h2>
                  <p className="text-xs text-slate-500 truncate">
                    {activeFormatSpec.labelFr} ·{' '}
                    <span className="font-mono-tabular">
                      {activeFormatSpec.width} × {activeFormatSpec.height} px
                    </span>{' '}
                    · {activeFormatSpec.platformsFr}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfig(buildDefaultPosterConfig(seed))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs font-semibold text-[#102D45] hover:bg-slate-100 whitespace-nowrap"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#1C4967]" />
                    Réinitialiser
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Fermer le studio affiche"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#102D45]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 2-Column Studio Body */}
              <div className="grid flex-1 min-h-0 lg:grid-cols-[1.08fr_1fr]">
                {/* LEFT COLUMN: Live High-Res Poster Canvas Preview + Download Actions */}
                <div className="flex flex-col justify-between border-b lg:border-b-0 lg:border-e border-[#102D45]/10 bg-[#EDF1F7] p-5 min-h-0">
                  <div className="flex flex-1 items-center justify-center min-h-0 py-2">
                    <div className="relative flex max-h-full max-w-full items-center justify-center">
                      <canvas
                        ref={canvasRef}
                        className="max-h-[58vh] lg:max-h-[60vh] w-auto max-w-full rounded-xl border border-[#102D45]/15 bg-[#0B1E33] shadow-xl object-contain"
                      />
                      {rendering && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-[#0B1E33]/25">
                          <Loader2 className="h-7 w-7 animate-spin text-[#E7B34C]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Export Bar */}
                  <div className="mt-4 space-y-2.5 border-t border-[#102D45]/10 pt-4">
                    {error && (
                      <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {error}
                      </p>
                    )}

                    {lastExport && (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs text-emerald-900">
                        <span className="inline-flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          {lastExport.count
                            ? `${lastExport.count} affiches PNG téléchargées (4:5, 1:1, 9:16)`
                            : `Affiche PNG téléchargée (${lastExport.width}×${lastExport.height})`}
                        </span>
                        <span className="font-mono-tabular text-[11px] font-semibold">
                          {formatFileSize(lastExport.sizeBytes)}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        disabled={downloading || downloadingPack}
                        onClick={() => void handleDownloadSingle()}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#102D45] px-5 py-3 text-xs font-extrabold text-white shadow-sm hover:bg-[#1C4967] disabled:opacity-60 whitespace-nowrap"
                      >
                        {downloading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#E7B34C]" />
                        ) : (
                          <Download className="h-4 w-4 text-[#E7B34C]" />
                        )}
                        <span>
                          {downloading
                            ? 'Génération PNG...'
                            : `Télécharger l’affiche PNG (${activeFormatSpec.ratioLabel})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={downloading || downloadingPack}
                        onClick={() => void handleDownloadAllFormats()}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#102D45]/18 bg-white px-4 py-3 text-xs font-bold text-[#102D45] hover:bg-[#FAF9F6] disabled:opacity-60 whitespace-nowrap"
                      >
                        {downloadingPack ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8922A]" />
                        ) : (
                          <Layers className="h-3.5 w-3.5 text-[#C8922A]" />
                        )}
                        <span>Pack 3 formats</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Format, Style, Pro Photo Gallery & Editable Copy */}
                <div className="overflow-y-auto p-5 space-y-5 bg-white">
                  {/* 1. Social Media Format Selector */}
                  <div className="space-y-2">
                    <p className="text-xs font-extrabold text-[#102D45]">
                      1. Format réseaux sociaux (HD PNG)
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {SOCIAL_POSTER_FORMATS.map((fmt) => {
                        const active = config.format === fmt.id;
                        return (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                format: fmt.id as SocialPosterFormatId,
                              }))
                            }
                            className={`rounded-xl border p-2.5 text-start transition-colors ${
                              active
                                ? 'border-[#C8922A] bg-[#102D45] text-white'
                                : 'border-[#102D45]/12 bg-[#F5F7FA] text-[#102D45] hover:bg-white'
                            }`}
                          >
                            <p className="text-xs font-extrabold whitespace-nowrap">
                              {fmt.labelFr}
                            </p>
                            <p
                              className={`mt-0.5 font-mono-tabular text-[10px] ${
                                active ? 'text-[#E7B34C]' : 'text-slate-500'
                              }`}
                            >
                              {fmt.width} × {fmt.height}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Poster Visual Style */}
                  <div className="space-y-2 border-t border-[#102D45]/10 pt-4">
                    <p className="text-xs font-extrabold text-[#102D45]">
                      2. Style d’affiche professionnelle
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {STYLE_OPTIONS.map((st) => {
                        const active = config.style === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({ ...prev, style: st.id }))
                            }
                            className={`rounded-xl border p-2.5 text-start transition-colors ${
                              active
                                ? 'border-[#C8922A] bg-[#FFFDF7] text-[#102D45]'
                                : 'border-[#102D45]/12 bg-[#F5F7FA] text-[#102D45] hover:bg-white'
                            }`}
                          >
                            <p className="text-xs font-extrabold">{st.labelFr}</p>
                            <p className="mt-0.5 text-[10px] text-slate-500 leading-snug">
                              {st.descFr}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Pro Photo Library (Visas, Hôtels 5★, Destinations + Upload) */}
                  <div className="space-y-2.5 border-t border-[#102D45]/10 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold text-[#102D45]">
                        3. Photo professionnelle (Visas & Hôtels)
                      </p>
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1 text-[11px] font-bold text-[#102D45] hover:border-[#C8922A]">
                        <Upload className="h-3 w-3 text-[#C8922A]" />
                        <span>Importer photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadCustomPhoto}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Photo Category Tabs */}
                    <div className="flex items-center gap-1 rounded-lg bg-[#F5F7FA] p-1">
                      {(
                        [
                          { id: 'visa', label: 'Visas & Voyages' },
                          { id: 'hotels', label: 'Hôtels 5★ & Resorts' },
                          { id: 'destinations', label: 'Omra & Transports' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPhotoTab(tab.id)}
                          className={`flex-1 rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-colors whitespace-nowrap ${
                            photoTab === tab.id
                              ? 'bg-white text-[#102D45] shadow-2xs'
                              : 'text-slate-600 hover:text-[#102D45]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {filteredPhotos.map((photo) => {
                        const selected = config.photoSrc === photo.src;
                        return (
                          <button
                            key={photo.id}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                photoSrc: photo.src,
                              }))
                            }
                            title={photo.labelFr}
                            className={`group relative overflow-hidden rounded-lg border-2 text-start transition-all ${
                              selected
                                ? 'border-[#C8922A] ring-2 ring-[#C8922A]/30'
                                : 'border-transparent hover:border-[#1C4967]/40'
                            }`}
                          >
                            <img
                              src={photo.src}
                              alt={photo.labelFr}
                              referrerPolicy="no-referrer"
                              className="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <span className="block truncate bg-[#102D45] px-1.5 py-1 text-[9px] font-semibold text-white">
                              {photo.labelFr}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Editable Poster Copy & Language */}
                  <div className="space-y-3 border-t border-[#102D45]/10 pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-extrabold text-[#102D45]">
                        4. Textes de l’affiche
                      </p>
                      <div className="flex items-center gap-1 rounded-lg bg-[#F5F7FA] p-0.5">
                        {(['fr', 'ar'] as const).map((lng) => (
                          <button
                            key={lng}
                            type="button"
                            onClick={() => handleSwitchPosterLanguage(lng)}
                            className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase ${
                              config.language === lng
                                ? 'bg-[#102D45] text-white'
                                : 'text-slate-600'
                            }`}
                          >
                            {lng === 'ar' ? 'AR (RTL)' : 'FR (LTR)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Surtitre / Catégorie
                        </label>
                        <input
                          type="text"
                          dir={config.language === 'ar' ? 'rtl' : 'ltr'}
                          value={config.eyebrow}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              eyebrow: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs font-semibold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Titre principal accrocheur
                        </label>
                        <input
                          type="text"
                          dir={config.language === 'ar' ? 'rtl' : 'ltr'}
                          value={config.headline}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              headline: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Sous-titre
                        </label>
                        <input
                          type="text"
                          dir={config.language === 'ar' ? 'rtl' : 'ltr'}
                          value={config.subtitle}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              subtitle: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          3 points forts (laisser vide pour masquer)
                        </label>
                        {config.highlights.map((hl, idx) => (
                          <input
                            key={idx}
                            type="text"
                            dir={config.language === 'ar' ? 'rtl' : 'ltr'}
                            value={hl}
                            onChange={(e) => {
                              const next: [string, string, string] = [
                                ...config.highlights,
                              ] as [string, string, string];
                              next[idx] = e.target.value;
                              setConfig((prev) => ({
                                ...prev,
                                highlights: next,
                              }));
                            }}
                            placeholder={`Point fort ${idx + 1}`}
                            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                          />
                        ))}
                      </div>

                      {/* Optional Price Switch */}
                      <div className="rounded-xl border border-[#102D45]/12 bg-[#FAF9F6] p-3 space-y-2">
                        <label className="flex items-center justify-between gap-2 text-xs font-bold text-[#102D45] cursor-pointer">
                          <span>Afficher un tarif sur l’affiche</span>
                          <input
                            type="checkbox"
                            checked={config.showPrice}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                showPrice: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 accent-[#102D45]"
                          />
                        </label>
                        {config.showPrice && (
                          <input
                            type="text"
                            dir={config.language === 'ar' ? 'rtl' : 'ltr'}
                            value={config.priceLabel}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                priceLabel: e.target.value,
                              }))
                            }
                            placeholder={
                              config.language === 'ar'
                                ? 'ابتداءً من 190 د.ت / الليلة'
                                : 'À partir de 190 DT / nuit'
                            }
                            className="w-full rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#102D45] focus:border-[#1C4967] focus:outline-none"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Bouton d’action (CTA)
                          </label>
                          <input
                            type="text"
                            dir={config.language === 'ar' ? 'rtl' : 'ltr'}
                            value={config.ctaLabel}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                ctaLabel: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Téléphone / WhatsApp
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            value={config.phoneLabel}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                phoneLabel: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 font-mono text-xs font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {triggerButton}
      {modalNode}
    </>
  );
}
