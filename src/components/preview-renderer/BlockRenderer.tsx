import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  EyeOff,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  buildCrmSubmissionPayload,
  buildWhatsAppDirectHref,
  SimulatedCrmAdapter,
  type CrmAdapterDispatchResult,
  type CrmIntegrationConfig,
} from '../../integration-contracts/crmAdapter';
import {
  DEFAULT_TUNISIAN_SCRIPT,
  TOTAL_REEL_DURATION_SEC,
} from '../../data/campaignData';
import { getHeroImageSrc } from '../../lib/mediaRegistry';
import type {
  AttributionSettings,
  BusinessUniverse,
  CreatorLanguage,
  FormDefinition,
  FormFieldKey,
  OfferReference,
  PageBlock,
} from '../../types/creator';
import { CountdownTimer } from '../CountdownTimer';
import { ReelPlayer } from '../ReelPlayer';
import { TestimonialsSection } from '../TestimonialsSection';
import { WhatsAppIcon } from '../WhatsAppIcon';

function decodeBase64ToUint8Array(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

interface BlockRendererProps {
  block: PageBlock;
  pageId: string;
  universe: BusinessUniverse;
  language: CreatorLanguage;
  form: FormDefinition;
  offerRef: OfferReference;
  attribution: AttributionSettings;
  crmConfig: CrmIntegrationConfig;
  selected?: boolean;
  interactiveEdit?: boolean;
  onSelectBlock?: (blockId: string) => void;
}

export function BlockRenderer({
  block,
  pageId,
  universe,
  language,
  form,
  offerRef,
  attribution,
  crmConfig,
  selected = false,
  interactiveEdit = false,
  onSelectBlock,
}: BlockRendererProps) {
  const isAr = language === 'ar';
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    block.content.items?.[0]?.id ?? null
  );

  // ReelPlayer state for hero_video blocks
  const [reelTime, setReelTime] = useState(0);
  const [reelPlaying, setReelPlaying] = useState(false);
  const [reelCaptions, setReelCaptions] = useState(true);
  const [reelMuted, setReelMuted] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (block.type !== 'hero_video' || !reelPlaying || audioActive) return;
    const id = window.setInterval(() => {
      setReelTime((prev) =>
        prev + 0.1 >= TOTAL_REEL_DURATION_SEC ? 0 : prev + 0.1
      );
    }, 100);
    return () => window.clearInterval(id);
  }, [audioActive, block.type, reelPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const handleToggleReelPlay = async () => {
    if (reelPlaying) {
      setReelPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    setReelPlaying(true);
    if (!audioUrlRef.current && !audioLoading) {
      setAudioLoading(true);
      try {
        const res = await fetch('/api/voiceover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: DEFAULT_TUNISIAN_SCRIPT,
            voiceName: 'Charon',
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            audioBase64?: string;
            mimeType?: string;
          };
          if (data.audioBase64) {
            const bytes = decodeBase64ToUint8Array(data.audioBase64);
            const blob = new Blob([bytes.buffer as ArrayBuffer], {
              type: data.mimeType || 'audio/wav',
            });
            const url = URL.createObjectURL(blob);
            audioUrlRef.current = url;
            const audio = new Audio(url);
            audio.muted = reelMuted;
            audio.ontimeupdate = () => {
              setReelTime(audio.currentTime);
            };
            audio.onended = () => {
              setAudioActive(false);
              setReelPlaying(false);
              setReelTime(0);
            };
            audioRef.current = audio;
            setAudioActive(true);
            await audio.play().catch(() => {
              setAudioActive(false);
            });
          }
        }
      } catch {
        // Fallback smoothly to visual reel progression without audio
      } finally {
        setAudioLoading(false);
      }
    } else if (audioRef.current) {
      audioRef.current.muted = reelMuted;
      await audioRef.current.play().catch(() => {});
    }
  };

  const handleToggleMute = () => {
    const next = !reelMuted;
    setReelMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  // Lead form local interactive state (contract simulation)
  const [formValues, setFormValues] = useState<
    Partial<Record<FormFieldKey, string | number | boolean>>
  >({
    travelersCount: 2,
    consent: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] =
    useState<CrmAdapterDispatchResult | null>(null);
  const [showPayloadJson, setShowPayloadJson] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    for (const field of form.fields) {
      if (!field.enabled || !field.required) continue;
      const val = formValues[field.key];
      if (field.key === 'consent') {
        if (!val) {
          setFormError(
            isAr
              ? 'يرجى الموافقة على شرط التواصل.'
              : 'Veuillez confirmer votre accord pour être recontacté.'
          );
          return;
        }
      } else if (val === undefined || String(val).trim() === '') {
        setFormError(
          isAr
            ? `الحقل "${field.label}" مطلوب.`
            : `Le champ "${field.label}" est obligatoire.`
        );
        return;
      }
    }

    const payload = buildCrmSubmissionPayload({
      pageId,
      offerId: offerRef.externalOfferId,
      businessUniverse: universe,
      pageLanguage: language,
      formId: form.formId,
      attribution,
      fields: formValues,
      includeUtm: crmConfig.includeUtmAttribution,
    });

    const res = await SimulatedCrmAdapter.submitLeadForm(payload, crmConfig);
    setDispatchResult(res);
  };

  const paddingClass =
    block.style.paddingY === 'compact'
      ? 'py-8'
      : block.style.paddingY === 'spacious'
        ? 'py-16'
        : 'py-12';

  const alignClass =
    block.style.alignment === 'center'
      ? 'text-center items-center'
      : block.style.alignment === 'right'
        ? 'text-right items-end'
        : 'text-left items-start';

  const titleScaleClass =
    block.style.fontSizeScale === 'sm'
      ? 'text-xl md:text-2xl'
      : block.style.fontSizeScale === 'lg'
        ? 'text-3xl md:text-4xl'
        : 'text-2xl md:text-3xl';

  const borderClass =
    block.style.borderStyle === 'accent'
      ? 'border-y-2 border-[#E7B34C]/60'
      : block.style.borderStyle === 'hairline'
        ? 'border-b border-[#102D45]/10'
        : '';

  const isDarkBg =
    block.style.backgroundColor.toLowerCase() === '#102d45' ||
    block.style.backgroundColor.toLowerCase() === '#1c4967' ||
    block.style.textColor.toLowerCase() === '#ffffff';

  const wrapperProps = {
    onClick: interactiveEdit
      ? (e: React.MouseEvent) => {
          e.stopPropagation();
          onSelectBlock?.(block.id);
        }
      : undefined,
    style: {
      backgroundColor: block.style.backgroundColor,
      color: block.style.textColor,
    },
    className: `relative transition-all ${paddingClass} ${borderClass} ${
      interactiveEdit
        ? `cursor-pointer group ${
            selected
              ? 'ring-2 ring-inset ring-[#E7B34C]'
              : 'hover:ring-1 hover:ring-inset hover:ring-[#1C4967]/40'
          }`
        : ''
    }`,
  };

  const sectionTag = interactiveEdit && (
    <div
      className={`pointer-events-none absolute top-2 z-30 ${
        isAr ? 'left-3' : 'right-3'
      } flex items-center gap-1.5 rounded bg-[#102D45]/85 px-2 py-0.5 text-[10px] font-medium text-white transition-opacity ${
        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}
    >
      <span>{block.name}</span>
      {!block.visible && <EyeOff className="h-3 w-3 text-[#E7B34C]" />}
    </div>
  );

  // Special full-feature blocks
  if (block.type === 'hero_video') {
    return (
      <section {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/logo_transparent_e9918557.png"
                alt="Easy2Book"
                className="h-9 w-auto object-contain"
              />
              <span
                className="text-xs font-bold tracking-wide"
                style={{ color: block.style.accentColor }}
              >
                {block.content.eyebrow}
              </span>
            </div>
            <h1 className={`${titleScaleClass} font-extrabold leading-tight`}>
              {block.content.title}
            </h1>
            <p className="text-sm md:text-base opacity-85 leading-relaxed">
              {block.content.description}
            </p>
            <div className="rounded-xl border border-[#102D45]/10 bg-white/80 p-3 text-xs text-[#102D45]">
              <span className="font-semibold text-[#1C4967]">
                {offerRef.cachedSummary.startingPriceLabel}
              </span>{' '}
              · {offerRef.cachedSummary.datesOrValidity}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {block.content.primaryCtaLabel && (
                <a
                  href={block.content.primaryCtaTarget || '#form-block'}
                  onClick={(e) => interactiveEdit && e.preventDefault()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#102D45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1C4967]"
                >
                  {block.content.primaryCtaLabel}
                </a>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleToggleReelPlay();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E7B34C] bg-[#E7B34C]/15 px-4 py-3 text-sm font-semibold text-[#102D45]"
              >
                <Volume2 className="h-4 w-4 text-[#C8922A]" />
                {audioLoading
                  ? isAr
                    ? 'جاري تجهيز الصوت...'
                    : 'Chargement audio...'
                  : reelPlaying
                    ? isAr
                      ? 'إيقاف الفيديو'
                      : 'Mettre en pause'
                    : isAr
                      ? 'تشغيل الفيديو 9:16 بالصوت'
                      : 'Lire la vidéo 9:16'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setReelCaptions((c) => !c);
                }}
                className="rounded-lg border border-[#102D45]/15 px-3 py-3 text-xs font-medium text-[#102D45]/80 hover:bg-white"
              >
                {reelCaptions
                  ? isAr
                    ? 'إخفاء الترجمة'
                    : 'Masquer sous-titres'
                  : isAr
                    ? 'إظهار الترجمة'
                    : 'Afficher sous-titres'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setReelTime(0);
                  if (audioRef.current) audioRef.current.currentTime = 0;
                }}
                className="rounded-lg border border-[#102D45]/15 p-3 text-[#102D45]/80 hover:bg-white"
                aria-label="Recommencer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <ReelPlayer
              currentTime={reelTime}
              totalDuration={
                audioRef.current?.duration && Number.isFinite(audioRef.current.duration)
                  ? audioRef.current.duration
                  : TOTAL_REEL_DURATION_SEC
              }
              isPlaying={reelPlaying}
              showCaptions={reelCaptions}
              isMuted={reelMuted}
              audioActive={audioActive}
              onTogglePlay={() => void handleToggleReelPlay()}
              onToggleMute={handleToggleMute}
              onSelectScene={(sec) => {
                setReelTime(sec);
                if (audioRef.current) audioRef.current.currentTime = sec;
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'hero_image') {
    const heroImg = getHeroImageSrc(block.content.imageKey);
    return (
      <section {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 md:grid-cols-12">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-1.5 shadow-xs">
                <img
                  src="/assets/aistudio/logo_transparent_e9918557.png"
                  alt="Easy2Book"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: block.style.accentColor }}
              >
                {block.content.eyebrow}
              </p>
            </div>
            <h1 className={`${titleScaleClass} font-extrabold leading-tight`}>
              {block.content.title}
            </h1>
            <p className="text-sm md:text-base opacity-85 leading-relaxed">
              {block.content.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {block.content.primaryCtaLabel && (
                <a
                  href={block.content.primaryCtaTarget || '#form-block'}
                  onClick={(e) => interactiveEdit && e.preventDefault()}
                  className="rounded-lg px-5 py-3 text-sm font-bold text-[#102D45] transition-transform hover:scale-[1.01]"
                  style={{ backgroundColor: block.style.accentColor }}
                >
                  {block.content.primaryCtaLabel}
                </a>
              )}
              {block.content.secondaryCtaLabel && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-current/25 px-4 py-3 font-mono-tabular text-sm font-semibold">
                  <Phone className="h-4 w-4" />
                  {block.content.secondaryCtaLabel}
                </span>
              )}
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-white/15 shadow-lg">
              <img
                src={heroImg}
                alt={block.content.title}
                className="h-64 w-full object-cover md:h-80"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'testimonials') {
    return (
      <div {...wrapperProps}>
        {sectionTag}
        <TestimonialsSection />
      </div>
    );
  }

  if (block.type === 'countdown') {
    return (
      <section {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto max-w-4xl px-6">
          <div className={`flex flex-col ${alignClass}`}>
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: block.style.accentColor }}
            >
              {block.content.eyebrow}
            </p>
            <h2 className={`${titleScaleClass} mt-1 font-bold`}>
              {block.content.title}
            </h2>
            <p className="mt-2 text-sm opacity-85">{block.content.description}</p>
          </div>
          <CountdownTimer
            deadlineIso={block.content.targetDateIso}
            language={language}
            showRamadanLine={universe === 'omra'}
          />
        </div>
      </section>
    );
  }

  if (block.type === 'lead_form') {
    return (
      <section id="form-block" {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-[#102D45]/12 bg-white p-6 md:p-8 text-[#102D45] shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#102D45]/10 pb-5">
              <div>
                <p className="text-xs font-bold text-[#C8922A]">
                  {block.content.eyebrow}
                </p>
                <h2 className="mt-1 text-xl md:text-2xl font-bold text-[#102D45]">
                  {form.title || block.content.title}
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  {form.subtitle || block.content.description}
                </p>
              </div>
              <div className="rounded-lg border border-[#102D45]/10 bg-[#F5F7FA] px-3 py-2 text-[11px] text-[#1C4967]">
                <p className="font-semibold">{offerRef.offerCode}</p>
                <p className="text-slate-500">
                  {offerRef.cachedSummary.startingPriceLabel}
                </p>
              </div>
            </div>

            {dispatchResult ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold">
                        {form.confirmationMessage}
                      </p>
                      <p className="mt-1 text-xs text-emerald-800">
                        {dispatchResult.note}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPayloadJson((s) => !s);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-semibold text-[#102D45]"
                  >
                    <Code2 className="h-4 w-4 text-[#1C4967]" />
                    {showPayloadJson
                      ? 'Masquer le contrat JSON CRM'
                      : 'Inspecter le contrat JSON (SimulatedCrmAdapter)'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDispatchResult(null);
                    }}
                    className="text-xs font-semibold text-[#1C4967] underline"
                  >
                    {isAr ? 'إعادة التجربة' : 'Tester une autre soumission'}
                  </button>
                </div>

                {showPayloadJson && (
                  <pre
                    dir="ltr"
                    className="max-h-72 overflow-auto rounded-xl bg-[#102D45] p-4 font-mono text-[11px] text-slate-100"
                  >
                    {JSON.stringify(dispatchResult.payload, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <form
                onSubmit={(e) => void handleFormSubmit(e)}
                onClick={(e) => e.stopPropagation()}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
                {form.fields
                  .filter((f) => f.enabled)
                  .map((field) => {
                    if (field.key === 'consent') {
                      return (
                        <label
                          key={field.key}
                          className="md:col-span-2 flex items-start gap-2.5 rounded-lg border border-[#102D45]/10 bg-[#F5F7FA] p-3 text-xs text-[#102D45]"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(formValues.consent)}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                consent: e.target.checked,
                              }))
                            }
                            className="mt-0.5 h-4 w-4 accent-[#102D45]"
                          />
                          <span>
                            {field.label}
                            {field.required && (
                              <span className="text-rose-600"> *</span>
                            )}
                          </span>
                        </label>
                      );
                    }

                    const isFull =
                      field.key === 'message' ||
                      field.key === 'requestedDeparture';
                    return (
                      <div
                        key={field.key}
                        className={isFull ? 'md:col-span-2' : ''}
                      >
                        <label className="block text-xs font-semibold text-[#102D45] mb-1.5">
                          {field.label}
                          {field.required && (
                            <span className="text-rose-600"> *</span>
                          )}
                        </label>
                        {field.key === 'message' ? (
                          <textarea
                            rows={2}
                            placeholder={field.placeholder}
                            value={String(formValues[field.key] ?? '')}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                [field.key]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                          />
                        ) : (
                          <input
                            type={
                              field.key === 'email'
                                ? 'email'
                                : field.key === 'travelersCount'
                                  ? 'number'
                                  : 'text'
                            }
                            min={field.key === 'travelersCount' ? 1 : undefined}
                            placeholder={field.placeholder}
                            value={String(formValues[field.key] ?? '')}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                [field.key]:
                                  field.key === 'travelersCount'
                                    ? Number(e.target.value)
                                    : e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                          />
                        )}
                      </div>
                    );
                  })}

                {formError && (
                  <p className="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                    {formError}
                  </p>
                )}

                <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#1C4967]" />
                    <span>
                      Adaptateur simulé · Endpoint :{' '}
                      <code className="font-mono text-[10px]">
                        {crmConfig.endpointUrl}
                      </code>
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#102D45] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1C4967]"
                  >
                    {form.submitLabel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'whatsapp_button') {
    const waConfig = block.content.whatsapp ?? {
      enabled: true,
      phoneNumber: '98 140 514',
      buttonLabel: isAr ? 'واتساب · 98 140 514' : 'WhatsApp · 98 140 514',
      prefilledMessage: 'Bonjour Easy2Book',
      trackAsCrmLead: false as const,
    };
    const href = buildWhatsAppDirectHref(waConfig);
    return (
      <section {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white p-6 text-[#102D45] shadow-xs">
            <div className="max-w-xl">
              <p className="text-xs font-bold text-emerald-700">
                {block.content.eyebrow}
              </p>
              <h3 className="mt-1 text-lg font-bold">{block.content.title}</h3>
              <p className="mt-1 text-xs text-slate-600">
                {block.content.description}
              </p>
            </div>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (interactiveEdit) e.preventDefault();
                e.stopPropagation();
              }}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#1FB857] whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>{waConfig.buttonLabel}</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'footer') {
    return (
      <footer {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-1.5">
              <img
                src="/assets/aistudio/logo_transparent_e9918557.png"
                alt="Easy2Book"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold">Easy2Book</p>
              <p className="text-xs opacity-75">{block.content.title}</p>
            </div>
          </div>
          <p className="text-xs opacity-80">{block.content.description}</p>
        </div>
      </footer>
    );
  }

  if (block.type === 'faq' || block.type === 'visa_faq') {
    const items = block.content.items ?? [];
    return (
      <section {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto max-w-4xl px-6">
          <div className={`flex flex-col ${alignClass}`}>
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: block.style.accentColor }}
            >
              {block.content.eyebrow}
            </p>
            <h2 className={`${titleScaleClass} mt-1 font-bold`}>
              {block.content.title}
            </h2>
            <p className="mt-2 text-sm opacity-80">{block.content.description}</p>
          </div>
          <div className="mt-6 space-y-2.5">
            {items.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#102D45]/10 bg-white text-[#102D45]"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenFaqId(isOpen ? null : item.id);
                    }}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-sm font-semibold"
                  >
                    <span>{item.title}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-[#1C4967]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-[#1C4967]" />
                    )}
                  </button>
                  {isOpen && item.subtitle && (
                    <div className="border-t border-[#102D45]/10 px-5 py-3 text-xs leading-relaxed text-slate-600">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'cta') {
    return (
      <section {...wrapperProps}>
        {sectionTag}
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-6 px-6">
          <div className="max-w-xl">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: block.style.accentColor }}
            >
              {block.content.eyebrow}
            </p>
            <h2 className={`${titleScaleClass} mt-1 font-bold`}>
              {block.content.title}
            </h2>
            <p className="mt-2 text-sm opacity-85">{block.content.description}</p>
          </div>
          <a
            href={block.content.primaryCtaTarget || '#form-block'}
            onClick={(e) => interactiveEdit && e.preventDefault()}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-[#102D45] whitespace-nowrap shrink-0"
            style={{ backgroundColor: block.style.accentColor }}
          >
            <Sparkles className="h-4 w-4" />
            {block.content.primaryCtaLabel ||
              (isAr ? 'احجز الآن' : 'Demander un devis')}
          </a>
        </div>
      </section>
    );
  }

  // Generic structured editorial / pricing / gallery / checklist / itinerary / hotel card renderer
  // covers all remaining Common, Omra, Voyages, Hotels & Visa blocks cleanly
  const items = block.content.items ?? [];
  const hasPrices = items.some((it) => Boolean(it.price));
  const hasImage = Boolean(block.content.imageKey);

  return (
    <section {...wrapperProps}>
      {sectionTag}
      <div className="mx-auto max-w-5xl px-6">
        <div className={`flex flex-col ${alignClass}`}>
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: block.style.accentColor }}
          >
            {block.content.eyebrow}
          </p>
          <h2 className={`${titleScaleClass} mt-1 font-bold`}>
            {block.content.title}
          </h2>
          {block.content.description && (
            <p className="mt-2 max-w-3xl text-sm opacity-85 leading-relaxed">
              {block.content.description}
            </p>
          )}
        </div>

        {hasImage && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#102D45]/10">
            <img
              src={getHeroImageSrc(block.content.imageKey)}
              alt={block.content.title}
              className="h-56 w-full object-cover"
            />
          </div>
        )}

        {items.length > 0 && (
          <div
            className={`mt-7 grid gap-4 ${
              items.length === 1
                ? 'grid-cols-1'
                : items.length === 2
                  ? 'md:grid-cols-2'
                  : 'md:grid-cols-3'
            }`}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-xl border p-5 ${
                  isDarkBg
                    ? 'border-white/15 bg-white/8 text-white'
                    : 'border-[#102D45]/10 bg-white text-[#102D45]'
                }`}
              >
                <div>
                  {item.badge && (
                    <span
                      className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{
                        backgroundColor: `${block.style.accentColor}24`,
                        color: isDarkBg ? '#F5D68A' : '#102D45',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-base font-bold leading-snug">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isDarkBg ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {hasPrices && item.price && (
                  <div className="mt-4 border-t border-current/10 pt-3">
                    <p
                      className="font-mono-tabular text-xl font-extrabold"
                      style={{ color: isDarkBg ? '#F5D68A' : '#102D45' }}
                    >
                      {item.price}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
