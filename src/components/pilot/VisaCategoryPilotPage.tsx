import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileText,
  Film,
  Globe2,
  Loader2,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import {
  getReelConfig,
  getSocialCaptionBlocks,
  TOTAL_REEL_DURATION_SEC,
  VOICE_OPTIONS,
} from '../../data/campaignData';
import {
  EVISA_53_COUNTRIES,
  getVisaCategoryByPageId,
  type VisaTariffItem,
} from '../../data/visaTypesCatalog';
import {
  buildCrmSubmissionPayload,
  SimulatedCrmAdapter,
  type CrmAdapterDispatchResult,
  type CrmIntegrationConfig,
} from '../../integration-contracts/crmAdapter';
import { HERO_MEDIA_MAP, type HeroImageKey } from '../../lib/mediaRegistry';
import {
  formatFileSize,
  generateVideoDownloadLink,
  triggerVideoBlobDownload,
  type VideoExportResult,
} from '../../lib/reelVideoExporter';
import type { Page, PageVersionSnapshot } from '../../types/creator';
import { ReelPlayer } from '../ReelPlayer';
import { PdfBrochureControl } from '../shared-components/PdfBrochureControl';
import { WhatsAppIcon } from '../WhatsAppIcon';

const WHATSAPP_NUMBER = '21698140514';

const ARABIC_GALLERY_LABELS: Partial<Record<HeroImageKey, string>> = {
  egypt_pyramids_museum: 'مصر — المتحف المصري الكبير وأهرامات الجيزة',
  egypt_nile_dinner: 'مصر — عشاء ونزهة على نهر النيل وقت الغروب',
  egypt_islamic_cairo: 'مصر — القاهرة الإسلامية وخان الخليلي',
  egypt_pyramids_reel: 'مصر — أهرامات الجيزة وقت الشروق الذهبي',
  visa_desk: 'Easy2Book — مكتب تجهيز ومراجعة ملفات الفيزا',
  visa_europe: 'أوروبا وفضاء شنغن — تجهيز الملفات والمواعيد',
  visa_canada: 'كندا وأمريكا الشمالية — ملفات ومواعيد رسمية',
  airline_business_cabin: 'تذاكر الطيران الدولية ومرافقة السفر',
  dubai_skyline: 'دبي والخليج العربي — تأشيرات سياحية وإقامة',
  makkah_haram: 'مكة المكرمة — المسجد الحرام وفيزا العمرة',
  omra_vip_haram: 'العمرة VIP — إطلالة مباشرة على الحرم المكي',
  madinah_twilight: 'المدينة المنورة — المسجد النبوي وقت الغسق',
  tunis_flight: 'رحلات جوية مباشرة تونس – جدة',
  turkey_antalya_coast: 'أنطاليا والساحل التركي — وجهات السياحة و E-Visa',
  maldives_honeymoon: 'جزر المالديف والوجهات السياحية العالمية',
};

function decodeBase64ToUint8Array(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function formatTimecode(sec: number): string {
  const whole = Math.max(0, Math.floor(sec));
  const m = String(Math.floor(whole / 60)).padStart(2, '0');
  const s = String(whole % 60).padStart(2, '0');
  return `${m}:${s}`;
}

interface VisaCategoryPilotPageProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  crmConfig: CrmIntegrationConfig;
  defaultVoiceId?: string;
}

/**
 * Landing page dédiée par type de Visa (Égypte, Schengen, Dubaï, Qatar, Oman, Omra, Chine & Internationaux, Albanie/Thaïlande/53 E-Visa)
 * Supporte intégralement la langue Arabe RTL (`snapshot.language === 'ar'`) et le Français LTR avec bascule instantanée.
 */
export function VisaCategoryPilotPage({
  page,
  snapshot,
  crmConfig,
  defaultVoiceId,
}: VisaCategoryPilotPageProps) {
  const spec = useMemo(
    () => getVisaCategoryByPageId(page.id, page.templateId),
    [page.id, page.templateId]
  );
  const reelConfig = useMemo(() => getReelConfig(spec.presetId), [spec.presetId]);
  const socialCaptionBlocks = useMemo(
    () => getSocialCaptionBlocks(spec.presetId),
    [spec.presetId]
  );

  const [pageLang, setPageLang] = useState<'ar' | 'fr'>(() =>
    snapshot.language === 'ar' ? 'ar' : 'fr'
  );
  useEffect(() => {
    setPageLang(snapshot.language === 'ar' ? 'ar' : 'fr');
  }, [snapshot.language, spec.pageId]);

  const isAr = pageLang === 'ar';

  const initialVoice =
    defaultVoiceId && defaultVoiceId !== 'Charon'
      ? defaultVoiceId
      : reelConfig.defaultVoiceId;

  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(TOTAL_REEL_DURATION_SEC);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);
  const [audioActive, setAudioActive] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const [videoExporting, setVideoExporting] = useState(false);
  const [videoExportPct, setVideoExportPct] = useState(0);
  const [videoExportStatus, setVideoExportStatus] = useState('');
  const [videoExportResult, setVideoExportResult] =
    useState<VideoExportResult | null>(null);
  const [videoExportError, setVideoExportError] = useState<string | null>(null);
  const [videoLinkCopied, setVideoLinkCopied] = useState(false);
  const [showSocialCaptions, setShowSocialCaptions] = useState(false);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlMapRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioActive(false);
    setAudioError(null);
    setCurrentTime(0);
    setTotalDuration(TOTAL_REEL_DURATION_SEC);
    setVideoExportResult(null);
    setVideoExportError(null);
  }, [spec.pageId]);

  useEffect(() => {
    if (defaultVoiceId && defaultVoiceId !== 'Charon') {
      setSelectedVoice(defaultVoiceId);
    } else {
      setSelectedVoice(reelConfig.defaultVoiceId);
    }
  }, [defaultVoiceId, reelConfig.defaultVoiceId]);

  const [selectedTariffIds, setSelectedTariffIds] = useState<string[]>(() =>
    spec.tariffs[0] ? [spec.tariffs[0].id] : []
  );
  useEffect(() => {
    setSelectedTariffIds(spec.tariffs[0] ? [spec.tariffs[0].id] : []);
    setDubaiExpressOption(false);
    setSelectedEvisaCountries([]);
    setDispatchResult(null);
    setOpenFaqId(spec.faq[0]?.id ?? null);
  }, [spec]);

  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [dubaiExpressOption, setDubaiExpressOption] = useState<boolean>(false);
  const [evisaSearch, setEvisaSearch] = useState('');
  const [selectedEvisaCountries, setSelectedEvisaCountries] = useState<string[]>(
    []
  );
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    spec.faq[0]?.id ?? null
  );
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] =
    useState<CrmAdapterDispatchResult | null>(null);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  useEffect(() => {
    if (!isPlaying || audioActive) return;
    const id = window.setInterval(() => {
      setCurrentTime((prev) =>
        prev + 0.1 >= totalDuration ? 0 : prev + 0.1
      );
    }, 100);
    return () => window.clearInterval(id);
  }, [audioActive, isPlaying, totalDuration]);

  useEffect(() => {
    const map = audioUrlMapRef.current;
    return () => {
      if (audioRef.current) audioRef.current.pause();
      map.forEach((u) => URL.revokeObjectURL(u));
      map.clear();
    };
  }, []);

  const activeScene = useMemo(() => {
    const scaled =
      totalDuration > 0
        ? (currentTime / totalDuration) * TOTAL_REEL_DURATION_SEC
        : 0;
    return (
      reelConfig.scenes.find((s) => scaled >= s.startSec && scaled < s.endSec) ??
      reelConfig.scenes[0]
    );
  }, [currentTime, reelConfig.scenes, totalDuration]);

  const startOrToggleVoiceover = async (forceVoice?: string) => {
    const voice = forceVoice || selectedVoice;
    setAudioError(null);

    if (isPlaying && !forceVoice) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    setIsPlaying(true);
    const cacheKey = `${spec.presetId}:${voice}`;
    let url = audioUrlMapRef.current.get(cacheKey);
    if (!url) {
      setAudioLoading(true);
      const voiceMeta = VOICE_OPTIONS.find((v) => v.id === voice);
      try {
        const res = await fetch('/api/voiceover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: reelConfig.script,
            voiceName: voice,
            style: voiceMeta?.stylePrompt,
          }),
        });
        if (!res.ok) {
          throw new Error(
            isAr
              ? 'الخدمة الصوتية غير متاحة مؤقتاً — العرض البصري متواصل.'
              : 'Synthèse vocale temporairement indisponible — aperçu visuel actif.'
          );
        }
        const data = (await res.json()) as {
          audioBase64?: string;
          mimeType?: string;
        };
        if (data.audioBase64) {
          const bytes = decodeBase64ToUint8Array(data.audioBase64);
          const blob = new Blob([bytes.buffer as ArrayBuffer], {
            type: data.mimeType || 'audio/wav',
          });
          url = URL.createObjectURL(blob);
          audioUrlMapRef.current.set(cacheKey, url);
        }
      } catch (err) {
        setAudioError(
          err instanceof Error
            ? err.message
            : isAr
              ? 'العرض البصري يعمل بدون مسار صوتي.'
              : 'Lecture visuelle active sans piste vocale.'
        );
      } finally {
        setAudioLoading(false);
      }
    }

    if (url) {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audio.muted = isMuted;
      audio.onloadedmetadata = () => {
        if (audio.duration && Number.isFinite(audio.duration)) {
          setTotalDuration(audio.duration);
        }
      };
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onended = () => {
        setAudioActive(false);
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audioRef.current = audio;
      setAudioActive(true);
      await audio.play().catch(() => setAudioActive(false));
    }
  };

  const handleSelectScene = (targetRealSec: number) => {
    setCurrentTime(targetRealSec);
    if (audioRef.current) audioRef.current.currentTime = targetRealSec;
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  const handleGenerateVideoLink = async () => {
    if (videoExporting) return;
    setVideoExportError(null);
    setVideoLinkCopied(false);
    setVideoExporting(true);
    setVideoExportPct(8);
    setVideoExportStatus(
      isAr
        ? 'جاري تحضير مونتاج الفيديو 9:16...'
        : 'Préparation du montage vidéo 9:16...'
    );

    if (videoExportResult?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoExportResult.blobUrl);
    }

    try {
      const result = await generateVideoDownloadLink({
        voiceName: selectedVoice,
        showCaptions,
        preset: spec.presetId,
        autoDownload: true,
        onProgress: (pct, label) => {
          setVideoExportPct(pct);
          setVideoExportStatus(label);
        },
      });
      setVideoExportResult(result);
    } catch (err) {
      setVideoExportError(
        err instanceof Error
          ? err.message
          : isAr
            ? 'تعذّر إنشاء ملف MP4 حالياً.'
            : 'Impossible de générer le fichier MP4 actuellement.'
      );
    } finally {
      setVideoExporting(false);
    }
  };

  const handleCopyVideoLink = async () => {
    if (!videoExportResult) return;
    try {
      await navigator.clipboard.writeText(videoExportResult.downloadUrl);
      setVideoLinkCopied(true);
      window.setTimeout(() => setVideoLinkCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const toggleTariffSelection = (id: string) => {
    setSelectedTariffIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleEvisaCountry = (frName: string) => {
    setSelectedEvisaCountries((prev) =>
      prev.includes(frName)
        ? prev.filter((c) => c !== frName)
        : [...prev, frName]
    );
  };

  const filteredEvisaCountries = useMemo(() => {
    const q = evisaSearch.trim().toLowerCase();
    if (!q) return EVISA_53_COUNTRIES;
    return EVISA_53_COUNTRIES.filter(
      (c) => c.fr.toLowerCase().includes(q) || c.ar.includes(q)
    );
  }, [evisaSearch]);

  const selectedTariffs = useMemo(
    () => spec.tariffs.filter((t) => selectedTariffIds.includes(t.id)),
    [selectedTariffIds, spec.tariffs]
  );

  const computeTariffLineTotal = (item: VisaTariffItem): number | null => {
    if (item.priceDt === null) return null;
    const expressExtra =
      dubaiExpressOption && item.supportsExpressDubai ? 60 : 0;
    return (item.priceDt + expressExtra) * travelersCount;
  };

  const estimatedTotalDt = useMemo(
    () =>
      selectedTariffs.reduce((sum, t) => {
        const line = computeTariffLineTotal(t);
        return sum + (line ?? 0);
      }, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTariffs, travelersCount, dubaiExpressOption]
  );

  const hasSurDemandeSelected = useMemo(
    () => selectedTariffs.some((t) => t.priceDt === null),
    [selectedTariffs]
  );

  const detailedWhatsAppHref = useMemo(() => {
    const lines = isAr
      ? [
          `مرحباً Easy2Book (${spec.titleAr}) · 98 140 514`,
          `• عدد المسافرين / الجوازات : ${travelersCount}`,
          ...selectedTariffs.map((t) => {
            const total = computeTariffLineTotal(t);
            return `• ${t.titleAr}${
              dubaiExpressOption && t.supportsExpressDubai
                ? ' + خدمة Express 48–72 ساعة'
                : ''
            } : ${
              total !== null ? `${total.toLocaleString('fr-FR')} د.ت` : 'حسب الطلب'
            }`;
          }),
          estimatedTotalDt > 0
            ? `• المجموع التقديري : ${estimatedTotalDt.toLocaleString('fr-FR')} د.ت`
            : '',
          selectedEvisaCountries.length > 0
            ? `• وجهات E-Visa : ${selectedEvisaCountries
                .map(
                  (fr) =>
                    EVISA_53_COUNTRIES.find((c) => c.fr === fr)?.ar ?? fr
                )
                .join('، ')}`
            : '',
          travelDate.trim() ? `• تاريخ السفر المتوقع : ${travelDate.trim()}` : '',
          fullName.trim() ? `• الاسم الكامل : ${fullName.trim()}` : '',
          phone.trim() ? `• الهاتف : ${phone.trim()}` : '',
          notes.trim() ? `• ملاحظات : ${notes.trim()}` : '',
        ].filter(Boolean)
      : [
          `Bonjour Easy2Book (${spec.titleFr}) · 98 140 514`,
          `• Voyageurs / Passeports : ${travelersCount}`,
          ...selectedTariffs.map((t) => {
            const total = computeTariffLineTotal(t);
            return `• ${t.titleFr}${
              dubaiExpressOption && t.supportsExpressDubai
                ? ' + Express 48–72h'
                : ''
            } : ${
              total !== null
                ? `${total.toLocaleString('fr-FR')} DT`
                : 'Sur demande'
            }`;
          }),
          estimatedTotalDt > 0
            ? `• Total estimé : ${estimatedTotalDt.toLocaleString('fr-FR')} DT`
            : '',
          selectedEvisaCountries.length > 0
            ? `• Destinations E-Visa : ${selectedEvisaCountries.join(', ')}`
            : '',
          travelDate.trim() ? `• Date souhaitée : ${travelDate.trim()}` : '',
          fullName.trim() ? `• Nom : ${fullName.trim()}` : '',
          phone.trim() ? `• Tél : ${phone.trim()}` : '',
          notes.trim() ? `• Notes : ${notes.trim()}` : '',
        ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dubaiExpressOption,
    estimatedTotalDt,
    fullName,
    isAr,
    notes,
    phone,
    selectedEvisaCountries,
    selectedTariffs,
    spec.titleAr,
    spec.titleFr,
    travelDate,
    travelersCount,
  ]);

  const handleSubmitVisaInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError(
        isAr
          ? 'يرجى إدخال الاسم الكامل ورقم الهاتف والبريد الإلكتروني.'
          : 'Veuillez renseigner votre nom complet, numéro de téléphone et e-mail.'
      );
      return;
    }

    const summaryLabels = [
      ...selectedTariffs.map((t) => (isAr ? t.titleAr : t.titleFr)),
      ...selectedEvisaCountries.map((c) => {
        const arCountry =
          EVISA_53_COUNTRIES.find((item) => item.fr === c)?.ar ?? c;
        return isAr ? `E-Visa ${arCountry}` : `E-Visa ${c}`;
      }),
    ];

    const payload = buildCrmSubmissionPayload({
      pageId: page.id,
      offerId: snapshot.offerRef.externalOfferId || spec.offerCode,
      businessUniverse: page.universe,
      pageLanguage: pageLang,
      formId: snapshot.form.formId,
      attribution: snapshot.attribution,
      includeUtm: crmConfig.includeUtmAttribution,
      fields: {
        fullName: fullName.trim(),
        phoneWhatsapp: phone.trim(),
        email: email.trim(),
        travelersCount,
        requestedDeparture:
          travelDate.trim() || (isAr ? 'غير محدد' : 'À définir'),
        message: [
          isAr
            ? `الباقات : ${summaryLabels.join(' + ') || spec.titleAr}`
            : `Formules : ${summaryLabels.join(' + ') || spec.titleFr}`,
          dubaiExpressOption
            ? isAr
              ? 'خيار Express دبي (+60 د.ت)'
              : 'Option Express Dubaï (+60 DT)'
            : '',
          isAr
            ? `المجموع التقديري : ${
                estimatedTotalDt > 0
                  ? `${estimatedTotalDt.toLocaleString('fr-FR')} د.ت`
                  : 'حسب الطلب'
              }`
            : `Total estimé : ${
                estimatedTotalDt > 0
                  ? `${estimatedTotalDt.toLocaleString('fr-FR')} DT`
                  : 'Sur demande'
              }`,
          notes.trim()
            ? isAr
              ? `ملاحظات : ${notes.trim()}`
              : `Notes : ${notes.trim()}`
            : '',
        ]
          .filter(Boolean)
          .join(' | '),
        consent: true,
      },
    });

    const res = await SimulatedCrmAdapter.submitLeadForm(payload, crmConfig);
    setDispatchResult(res);
  };

  const shortTitle = isAr
    ? spec.titleAr.split('—')[0].trim()
    : spec.titleFr.split('•')[0].split('—')[0].trim();

  const formatTariffPrice = (tariff: VisaTariffItem): string => {
    if (tariff.priceDt === null) {
      return isAr ? 'حسب الطلب' : 'Sur demande';
    }
    return isAr
      ? `${tariff.priceDt.toLocaleString('fr-FR')} د.ت`
      : tariff.priceLabel;
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      data-brochure-root="true"
      className={`min-h-screen bg-[#FAF9F6] text-[#102D45] selection:bg-[#E7B34C]/30 ${
        isAr ? 'font-arabic' : ''
      }`}
    >
      {/* STICKY BRAND NAVIGATION BAR */}
      <header className="sticky top-0 z-30 border-b border-[#102D45]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/assets/aistudio/logo_transparent_e9918557.png"
              alt="Easy2Book"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#102D45] truncate">
                {isAr
                  ? 'Easy2Book · خدمات الفيزا والتأشيرات'
                  : 'Easy2Book · Services Visa'}
              </p>
              <p className="text-[11px] font-medium text-[#1C4967] truncate">
                {isAr ? spec.sectionHeadingAr : spec.sectionHeadingFr}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-xs font-bold text-[#102D45]/80 md:flex">
            <a href="#visa-tarifs" className="hover:text-[#C8922A] whitespace-nowrap">
              {isAr ? 'الأسعار والباقات' : 'Tarifs & Formules'}
            </a>
            <a href="#visa-documents" className="hover:text-[#C8922A] whitespace-nowrap">
              {isAr ? 'الوثائق المطلوبة' : 'Documents à fournir'}
            </a>
            <a href="#visa-booking" className="hover:text-[#C8922A] whitespace-nowrap">
              {isAr ? 'طلب التأشيرة' : 'Demander ce visa'}
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Instant AR / FR Language Toggle */}
            <div
              data-pdf-exclude="true"
              className="flex items-center rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] p-0.5 text-[11px] font-bold"
              role="group"
              aria-label={isAr ? 'تبديل اللغة' : 'Changer de langue'}
            >
              <button
                type="button"
                onClick={() => setPageLang('ar')}
                className={`rounded-md px-2 py-1 transition-colors ${
                  isAr
                    ? 'bg-[#102D45] text-white'
                    : 'text-[#1C4967] hover:text-[#102D45]'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setPageLang('fr')}
                className={`rounded-md px-2 py-1 transition-colors ${
                  !isAr
                    ? 'bg-[#102D45] text-white'
                    : 'text-[#1C4967] hover:text-[#102D45]'
                }`}
              >
                FR
              </button>
            </div>

            <PdfBrochureControl
              variant="pilot_header"
              locale={isAr ? 'ar' : 'fr'}
              pageTitle={
                isAr ? spec.titleAr : snapshot.seo.metaTitle || spec.titleFr
              }
              slug={snapshot.seo.slug || `Easy2Book-${spec.presetId}-Brochure`}
              revisionKey={`${page.updatedAt}-${pageLang}`}
            />
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#1FB857] whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span dir="ltr" className="hidden sm:inline font-mono-tabular">
                98 140 514
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SPLIT: VISA EDITORIAL OFFER & 9:16 REEL VIDEO PLAYER */}
      <section className="border-b border-[#102D45]/10 bg-white">
        <div className="mx-auto grid max-w-[1200px] items-start gap-10 px-5 py-10 lg:grid-cols-12 lg:py-14">
          {/* Primary Column: Offer Info + Video Voiceover Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#C8922A]">
                {isAr ? spec.eyebrowAr : spec.eyebrowFr}
              </p>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#102D45] sm:text-4xl">
                {isAr ? spec.titleAr : spec.titleFr}
              </h1>

              <p className="text-sm leading-relaxed text-slate-600">
                {isAr ? spec.subtitleAr : spec.subtitleFr}
              </p>
            </div>

            {/* Key Value Highlights (zero-pill architectural list) */}
            <div className="grid gap-3 sm:grid-cols-3 border-y border-[#102D45]/10 py-4">
              {(isAr ? spec.highlightsAr : spec.highlightsFr).map((h) => (
                <div key={h} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C8922A]" />
                  <p className="text-xs font-bold leading-snug text-[#102D45]">
                    {h}
                  </p>
                </div>
              ))}
            </div>

            {/* 9:16 Video & Tunisian Voiceover Control Panel */}
            <div className="rounded-2xl border border-[#102D45]/12 bg-[#FAF9F6] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-[#C8922A]" />
                  <h2 className="text-sm font-extrabold text-[#102D45]">
                    {isAr
                      ? 'فيديو 9:16 والتعليق الصوتي التونسي (بنفس مبدأ صفحة العمرة)'
                      : 'Vidéo 9:16 & Voix off tunisienne (Même principe que Omra)'}
                  </h2>
                </div>
                <span
                  dir="ltr"
                  className="font-mono-tabular text-[11px] font-bold text-[#1C4967]"
                >
                  {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
                </span>
              </div>

              {/* Active Scene Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#102D45]/10 bg-white px-3.5 py-2.5 text-xs">
                <span className="font-bold text-[#102D45]">
                  {isAr
                    ? `المشهد ${activeScene.indexLabel} · ${activeScene.arabicTitle}`
                    : `Scène ${activeScene.indexLabel} · ${activeScene.overlayHeadline}`}
                </span>
                <span className="text-[11px] font-semibold text-[#1C4967]">
                  {isAr ? activeScene.subtitleSummary : activeScene.arabicTitle}
                </span>
              </div>

              {/* Play / Voice Picker / Captions / Restart */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void startOrToggleVoiceover()}
                  disabled={audioLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#1C4967] disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  {audioLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#E7B34C]" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4 text-[#E7B34C]" />
                  ) : (
                    <Play className="h-4 w-4 fill-current text-[#E7B34C]" />
                  )}
                  <span>
                    {audioLoading
                      ? isAr
                        ? 'جاري تجهيز الصوت التونسي...'
                        : 'Chargement voix...'
                      : isPlaying
                        ? isAr
                          ? 'إيقاف الفيديو والصوت'
                          : 'Pause Vidéo & Audio'
                        : isAr
                          ? 'تشغيل الفيديو بالصوت التونسي'
                          : 'Lire la Vidéo avec Voix Tunisienne'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCaptions((c) => !c)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-white px-3 py-2.5 text-xs font-bold text-[#102D45] hover:border-[#C8922A]"
                >
                  {showCaptions ? (
                    <Eye className="h-3.5 w-3.5 text-[#C8922A]" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span>{isAr ? 'الترجمة النصية' : 'Sous-titres'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-white px-3 py-2.5 text-xs font-bold text-[#102D45] hover:border-[#C8922A]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span dir="ltr">00:00</span>
                </button>

                <select
                  aria-label={isAr ? 'اختيار الصوت التونسي' : 'Voix Gemini TTS'}
                  value={selectedVoice}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedVoice(v);
                    if (isPlaying) void startOrToggleVoiceover(v);
                  }}
                  className="rounded-xl border border-[#102D45]/15 bg-white px-3 py-2.5 text-xs font-bold text-[#102D45] outline-none focus:border-[#C8922A]"
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {isAr
                        ? `الصوت : ${v.label}`
                        : `Voix : ${v.id} (${v.descriptionFr})`}
                    </option>
                  ))}
                </select>
              </div>

              {audioError && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
                  {audioError}
                </p>
              )}

              {/* HD MP4 Export Controls */}
              <div className="border-t border-[#102D45]/10 pt-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => void handleGenerateVideoLink()}
                    disabled={videoExporting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E7B34C] px-4 py-2.5 text-xs font-extrabold text-[#102D45] shadow-xs transition-colors hover:bg-[#f0c05f] disabled:opacity-60 whitespace-nowrap shrink-0"
                  >
                    {videoExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Film className="h-4 w-4" />
                    )}
                    <span>
                      {videoExporting
                        ? isAr
                          ? `جاري إنشاء الفيديو MP4 (${videoExportPct}%)...`
                          : `Génération MP4 (${videoExportPct}%)...`
                        : isAr
                          ? 'تحميل الفيديو 9:16 (MP4 HD)'
                          : 'Télécharger Vidéo 9:16 (MP4 HD)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSocialCaptions((s) => !s)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-white px-3.5 py-2.5 text-xs font-bold text-[#102D45] hover:border-[#C8922A]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#C8922A]" />
                    <span>
                      {showSocialCaptions
                        ? isAr
                          ? 'إخفاء نصوص Reels / TikTok'
                          : 'Masquer Captions Reels/TikTok'
                        : isAr
                          ? 'نصوص Reels / TikTok الجاهزة'
                          : 'Captions Reels / TikTok'}
                    </span>
                  </button>
                </div>

                {videoExporting && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full bg-[#C8922A] transition-all duration-300"
                        style={{ width: `${videoExportPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] font-medium text-[#1C4967]">
                      {videoExportStatus}
                    </p>
                  </div>
                )}

                {videoExportError && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                    {videoExportError}
                  </p>
                )}

                {videoExportResult && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-950">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {isAr ? 'الفيديو جاهز للتحميل' : 'Vidéo prête'}{' '}
                        <span dir="ltr" className="font-mono-tabular">
                          ({formatFileSize(videoExportResult.sizeBytes)} ·{' '}
                          {videoExportResult.durationSec}s)
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            triggerVideoBlobDownload(videoExportResult)
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-[#102D45] px-2.5 py-1.5 text-[11px] font-bold text-white"
                        >
                          <Download className="h-3 w-3" />
                          {isAr ? 'حفظ MP4' : 'Enregistrer MP4'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleCopyVideoLink()}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#102D45]"
                        >
                          <Copy className="h-3 w-3" />
                          {videoLinkCopied
                            ? isAr
                              ? 'تم النسخ'
                              : 'Copié'
                            : isAr
                              ? 'نسخ الرابط'
                              : 'Copier lien'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {showSocialCaptions && (
                  <div className="grid gap-2.5 sm:grid-cols-3 pt-1">
                    {socialCaptionBlocks.map((cap) => (
                      <div
                        key={cap.id}
                        dir="rtl"
                        className="rounded-xl border border-[#102D45]/10 bg-white p-3 text-[11px] space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2 font-bold text-[#102D45]">
                          <span>{cap.scene}</span>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(
                                  cap.lines.join('\n')
                                );
                                setCopiedCaptionId(cap.id);
                                window.setTimeout(
                                  () => setCopiedCaptionId(null),
                                  1800
                                );
                              } catch {
                                // Ignore
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[10px] text-[#C8922A] hover:underline"
                          >
                            {copiedCaptionId === cap.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>
                              {copiedCaptionId === cap.id
                                ? isAr
                                  ? 'تم النسخ'
                                  : 'Copié'
                                : isAr
                                  ? 'نسخ'
                                  : 'Copier'}
                            </span>
                          </button>
                        </div>
                        {cap.lines.map((line, idx) => (
                          <p
                            key={idx}
                            className="font-arabic text-[#102D45]/85 leading-snug"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Column: Authentic 9:16 Vertical Reel Player */}
          <div className="lg:col-span-5 flex justify-center">
            <ReelPlayer
              currentTime={currentTime}
              totalDuration={totalDuration}
              isPlaying={isPlaying}
              showCaptions={showCaptions}
              isMuted={isMuted}
              audioActive={audioActive}
              scenes={reelConfig.scenes}
              endBadgeText={reelConfig.endBadgeText}
              secondaryLabelA={reelConfig.secondarySceneLabelA}
              secondaryLabelB={reelConfig.secondarySceneLabelB}
              onTogglePlay={() => void startOrToggleVoiceover()}
              onToggleMute={handleToggleMute}
              onSelectScene={handleSelectScene}
            />
          </div>
        </div>
      </section>

      {/* OFFICIAL TARIFFS TABLE & REQUIRED DOCUMENTS */}
      <section
        id="visa-tarifs"
        className="border-b border-[#102D45]/10 bg-[#FAF9F6] py-14"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#C8922A]">
                {isAr
                  ? `${spec.sectionHeadingAr} · ${spec.delaySummaryAr}`
                  : `${spec.sectionHeadingFr} · ${spec.delaySummaryFr}`}
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#102D45]">
                {isAr ? spec.sectionHeadingAr : spec.sectionHeadingFr}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#102D45]">
              <Clock className="h-4 w-4 text-[#C8922A]" />
              <span>{isAr ? spec.delaySummaryAr : spec.delaySummaryFr}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            {/* Tariffs List / Structured Price Table */}
            <div className="lg:col-span-8 space-y-3">
              {spec.tariffs.map((tariff, idx) => {
                const selected = selectedTariffIds.includes(tariff.id);
                const docsList = isAr ? tariff.docsAr : tariff.docsFr;
                const noteText = isAr ? tariff.noteAr : tariff.noteFr;
                return (
                  <div
                    key={tariff.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all ${
                      selected
                        ? 'border-[#C8922A] bg-white shadow-md'
                        : 'border-[#102D45]/10 bg-white hover:border-[#102D45]/25'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#C8922A]">
                        <span className="font-mono-tabular" dir="ltr">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{isAr ? tariff.badgeAr : tariff.badgeFr}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#1C4967]">
                          {isAr ? tariff.delayAr : tariff.delayFr}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#102D45]">
                        {isAr ? tariff.titleAr : tariff.titleFr}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isAr ? tariff.subtitleAr : tariff.subtitleFr}
                      </p>

                      {noteText && (
                        <p className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-900">
                          {noteText}
                        </p>
                      )}

                      {docsList && docsList.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-[#102D45]/80">
                          {docsList.map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center gap-1"
                            >
                              <Check className="h-3 w-3 text-[#C8922A]" />
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#102D45]/10">
                      <div className={isAr ? 'sm:text-left' : 'sm:text-right'}>
                        <p className="font-mono-tabular text-2xl font-extrabold text-[#102D45]">
                          {formatTariffPrice(tariff)}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          {tariff.priceDt !== null
                            ? isAr
                              ? 'تعريفة Easy2Book'
                              : 'Tarif TTC Easy2Book'
                            : isAr
                              ? 'تسعيرة فورية'
                              : 'Devis immédiat'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTariffSelection(tariff.id)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                          selected
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                            : 'bg-[#102D45] text-white hover:bg-[#1C4967]'
                        }`}
                      >
                        {selected ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>{isAr ? 'تم الاختيار' : 'Sélectionné'}</span>
                          </>
                        ) : (
                          <span>{isAr ? 'اختيار' : 'Sélectionner'}</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Secondary Sticky Column: DOCUMENTS À FOURNIR / الوثائق المطلوبة */}
            <aside
              id="visa-documents"
              className="lg:col-span-4 rounded-2xl border border-[#102D45]/15 bg-[#102D45] p-6 text-white shadow-sm space-y-5"
            >
              <div className="space-y-1 border-b border-white/15 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E7B34C]">
                  <FileText className="h-4 w-4" />
                  <span>
                    {isAr ? 'الوثائق المطلوبة' : 'DOCUMENTS À FOURNIR'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold">
                  {isAr
                    ? `المستندات اللازمة · ${shortTitle}`
                    : `Pièces requises · ${shortTitle}`}
                </h3>
              </div>

              <ul className="space-y-3">
                {(isAr ? spec.documentsAr : spec.documentsFr).map((doc) => (
                  <li
                    key={doc}
                    className="rounded-xl border border-white/12 bg-white/8 p-3.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E7B34C]" />
                      <p className="text-sm font-bold text-white leading-snug">
                        {doc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-[#E7B34C]/40 bg-[#E7B34C]/12 p-4 space-y-2 text-xs">
                <p className="font-bold text-[#E7B34C]">
                  {isAr
                    ? `مدة المعالجة : ${spec.delaySummaryAr}`
                    : `Délai de traitement : ${spec.delaySummaryFr}`}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {isAr
                    ? 'أرسل نسخ الوثائق المصورة عبر واتساب الأعمال Easy2Book للمراجعة الفورية قبل الإيداع.'
                    : 'Envoyez vos pièces numérisées sur WhatsApp Business Easy2Book pour vérification immédiate avant dépôt.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <a
                  href={detailedWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white hover:bg-[#1FB857]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>
                    {isAr
                      ? 'أرسل وثائقك عبر واتساب · 98 140 514'
                      : 'Envoyer mes documents · 98 140 514'}
                  </span>
                </a>
                <a
                  href="#visa-booking"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E7B34C] px-4 py-3 text-xs font-extrabold text-[#102D45] hover:bg-[#f0c05f]"
                >
                  <span>
                    {isAr
                      ? 'احسب السعر وأودع طلبك الآن'
                      : 'Calculer & Déposer en ligne'}
                  </span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* OPTIONAL INTERACTIVE 53 E-VISA FINDER */}
      {spec.includesEvisaFinder && (
        <section className="border-b border-[#102D45]/10 bg-white py-14">
          <div className="mx-auto max-w-[1200px] px-5 space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C8922A]">
                  <Globe2 className="h-4 w-4" />
                  <span>
                    {isAr
                      ? 'E-Visa · 53 وجهة متوفرة عند الطلب'
                      : 'E-Visa · 53 Destinations Sur Demande'}
                  </span>
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#102D45]">
                  {isAr
                    ? 'اختر وجهة E-Visa من بين 53 دولة'
                    : 'Sélectionnez votre destination E-Visa parmi 53 pays'}
                </h2>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#1C4967]">
                {isAr
                  ? `${selectedEvisaCountries.length} وجهة مختارة`
                  : `${selectedEvisaCountries.length} sélectionnée(s)`}
              </span>
            </div>

            <div className="relative max-w-xl">
              <Search
                className={`absolute ${
                  isAr ? 'right-3.5' : 'left-3.5'
                } top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`}
              />
              <input
                type="text"
                value={evisaSearch}
                onChange={(e) => setEvisaSearch(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث عن دولة (مثال: سنغافورة، فيتنام، تنزانيا، تايلاند...)'
                    : 'Rechercher un pays (ex : Singapour, Vietnam, Tanzanie, Thaïlande...)'
                }
                className={`w-full rounded-xl border border-[#102D45]/15 bg-[#FAF9F6] ${
                  isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'
                } py-2.5 text-xs text-[#102D45] outline-none focus:border-[#C8922A]`}
              />
            </div>

            <div className="grid max-h-72 overflow-y-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pe-1">
              {filteredEvisaCountries.map((country) => {
                const selected = selectedEvisaCountries.includes(country.fr);
                return (
                  <button
                    key={country.fr}
                    type="button"
                    onClick={() => toggleEvisaCountry(country.fr)}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${
                      isAr ? 'text-right' : 'text-left'
                    } transition-colors ${
                      selected
                        ? 'border-[#C8922A] bg-[#FBF9F4] text-[#102D45]'
                        : 'border-[#102D45]/10 bg-[#FAF9F6] text-[#102D45]/85 hover:border-[#C8922A]'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">
                      {isAr ? country.ar : country.fr}
                    </p>
                    {selected && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#C8922A]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* VISUAL GALLERY + FAQ */}
      <section className="border-b border-[#102D45]/10 bg-white py-14">
        <div className="mx-auto max-w-[1200px] px-5 space-y-12">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C8922A]">
                  <Camera className="h-3.5 w-3.5" />
                  <span>
                    {isAr
                      ? 'Easy2Book · مرافقة قنصلية شاملة'
                      : 'Easy2Book · Accompagnement Consulaire'}
                  </span>
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#102D45]">
                  {isAr
                    ? 'معاينة الوجهة ومتابعة الملف'
                    : 'Aperçu Destination & Suivi Dossier'}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'اضغط على أي صورة للتكبير'
                  : 'Cliquez sur une photo pour l’agrandir'}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {spec.galleryKeys.map((imgKey) => {
                const media = HERO_MEDIA_MAP[imgKey];
                const caption = isAr
                  ? ARABIC_GALLERY_LABELS[imgKey] ?? media.label
                  : media.label;
                return (
                  <button
                    key={imgKey}
                    type="button"
                    onClick={() =>
                      setLightboxPhoto({ src: media.src, title: caption })
                    }
                    className={`group overflow-hidden rounded-2xl border border-[#102D45]/10 bg-[#FAF9F6] ${
                      isAr ? 'text-right' : 'text-left'
                    } shadow-2xs transition-all hover:border-[#C8922A]`}
                  >
                    <div className="h-44 w-full overflow-hidden bg-slate-200">
                      <img
                        src={media.src}
                        alt={caption}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="p-3 text-xs font-bold text-[#102D45] line-clamp-2">
                      {caption}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {spec.faq.length > 0 && (
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8922A]">
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {isAr
                    ? `الأسئلة الشائعة · ${shortTitle}`
                    : `Questions Fréquentes · ${shortTitle}`}
                </span>
              </div>
              <div className="space-y-2.5">
                {spec.faq.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#102D45]/12 bg-[#FAF9F6]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqId(isOpen ? null : item.id)
                        }
                        className={`flex w-full items-center justify-between gap-4 px-5 py-4 ${
                          isAr ? 'text-right' : 'text-left'
                        } text-sm font-bold text-[#102D45]`}
                      >
                        <span>{isAr ? item.qAr : item.qFr}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-[#1C4967]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-[#1C4967]" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#102D45]/10 px-5 py-3.5 text-xs leading-relaxed text-slate-600">
                          <p>{isAr ? item.aAr : item.aFr}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* INTERACTIVE ESTIMATOR + CRM BOOKING FORM */}
      <section
        id="visa-booking"
        className="bg-[#102D45] py-16 text-white"
      >
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12">
          {/* Estimator Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#E7B34C]">
                {isAr
                  ? 'محاكي الأسعار وإيداع الملف · Easy2Book'
                  : 'Simulateur & Dépôt de Dossier Easy2Book'}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                {isAr
                  ? 'قدّر كلفة التأشيرة وأرسل طلبك الآن'
                  : 'Estimez votre visa et envoyez votre demande'}
              </h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {isAr
                  ? 'حدد عدد المسافرين وأكّد الباقات المختارة للحصول على متابعة فورية عبر الواتساب أو النظام.'
                  : 'Sélectionnez le nombre de voyageurs et confirmez les formules choisies pour recevoir un suivi direct sur WhatsApp ou via CRM.'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-5 space-y-4">
              <p className="text-xs font-bold text-[#E7B34C]">
                {isAr
                  ? 'عدد الجوازات / المسافرين :'
                  : 'Nombre de passeports / voyageurs :'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setTravelersCount(cnt)}
                    className={`rounded-lg border px-3 py-1.5 font-mono-tabular text-xs font-bold transition-colors ${
                      travelersCount === cnt
                        ? 'border-[#E7B34C] bg-[#E7B34C] text-[#102D45]'
                        : 'border-white/20 bg-white/5 text-white hover:bg-white/15'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>

              {spec.supportsDubaiExpress && (
                <button
                  type="button"
                  onClick={() => setDubaiExpressOption((v) => !v)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 ${
                    isAr ? 'text-right' : 'text-left'
                  } transition-colors ${
                    dubaiExpressOption
                      ? 'border-[#E7B34C] bg-[#E7B34C]/18 text-white'
                      : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">
                      {isAr
                        ? 'خيار Express السريع 48–72 ساعة (خارج عطلة نهاية الأسبوع)'
                        : 'Option Express 48–72h (hors week-end)'}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {isAr
                        ? '+60 د.ت لكل مسافر على تأشيرات دبي السياحية'
                        : '+60 DT par voyageur sur visas touristiques Dubaï'}
                    </p>
                  </div>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      dubaiExpressOption
                        ? 'border-[#E7B34C] bg-[#E7B34C] text-[#102D45]'
                        : 'border-white/30'
                    }`}
                  >
                    {dubaiExpressOption && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              )}

              <div className="border-t border-white/15 pt-3 text-xs space-y-1.5">
                <p className="font-bold text-[#E7B34C]">
                  {isAr ? 'الوثائق المطلوبة :' : 'Documents requis :'}
                </p>
                {(isAr ? spec.documentsAr : spec.documentsFr).map((d) => (
                  <p key={d} className="flex items-start gap-2 text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E7B34C]" />
                    <span>{d}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Validated CRM Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white p-6 md:p-8 text-[#102D45] shadow-xl">
              <div className="border-b border-[#102D45]/10 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#C8922A]">
                  {isAr
                    ? 'Easy2Book · مركز التأشيرات (98 140 514)'
                    : 'Easy2Book · Centrale Visa (98 140 514)'}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  {isAr ? `طلب : ${shortTitle}` : `Demander : ${shortTitle}`}
                </h3>
              </div>

              {dispatchResult ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold">
                          {isAr
                            ? 'تم تسجيل طلبك بنجاح في نظام المتابعة CRM'
                            : 'Demande enregistrée avec succès dans le contrat CRM'}
                        </p>
                        <p className="mt-1 text-xs text-emerald-800">
                          {dispatchResult.note}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={detailedWhatsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#1FB857]"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      {isAr
                        ? 'أرسل الآن على واتساب (98 140 514)'
                        : 'Envoyer maintenant sur WhatsApp (98 140 514)'}
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowJsonPayload((s) => !s)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-3 text-xs font-bold text-[#102D45]"
                    >
                      <Code2 className="h-4 w-4" />
                      {showJsonPayload
                        ? isAr
                          ? 'إخفاء JSON'
                          : 'Masquer JSON'
                        : isAr
                          ? 'معاينة عقد JSON'
                          : 'Aperçu Contrat JSON'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDispatchResult(null)}
                      className="text-xs font-bold text-[#1C4967] underline"
                    >
                      {isAr ? 'تعديل الطلب' : 'Modifier ma demande'}
                    </button>
                  </div>

                  {showJsonPayload && (
                    <pre
                      dir="ltr"
                      className="max-h-60 overflow-auto rounded-xl bg-[#102D45] p-4 font-mono text-[11px] text-slate-100 text-left"
                    >
                      {JSON.stringify(dispatchResult.payload, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={(e) => void handleSubmitVisaInquiry(e)}
                  className="mt-5 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#102D45] mb-2">
                      {isAr
                        ? `الباقات المختارة (${selectedTariffs.length}) :`
                        : `Formules incluses (${selectedTariffs.length}) :`}
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto pe-1">
                      {spec.tariffs.map((t) => {
                        const checked = selectedTariffIds.includes(t.id);
                        const lineTotal = computeTariffLineTotal(t);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTariffSelection(t.id)}
                            className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 ${
                              isAr ? 'text-right' : 'text-left'
                            } transition-colors ${
                              checked
                                ? 'border-[#C8922A] bg-[#FBF9F4]'
                                : 'border-[#102D45]/12 bg-white hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#102D45] truncate">
                                {isAr ? t.titleAr : t.titleFr}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {formatTariffPrice(t)} ·{' '}
                                {isAr ? t.delayAr : t.delayFr}
                              </p>
                            </div>
                            <span className="font-mono-tabular text-xs font-extrabold text-[#102D45] shrink-0">
                              {lineTotal !== null
                                ? `${lineTotal.toLocaleString('fr-FR')} ${
                                    isAr ? 'د.ت' : 'DT'
                                  }`
                                : isAr
                                  ? 'حسب الطلب'
                                  : 'Devis'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {travelersCount > 5 && (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-950">
                      <Users className="h-4 w-4 shrink-0 text-amber-700" />
                      <span>
                        {isAr
                          ? 'ملف مجموعة (+5 مسافرين): مرافقة خاصة من Easy2Book على 98 140 514.'
                          : 'Dossier groupe (+5 passeports) : accompagnement dédié Easy2Book au 98 140 514.'}
                      </span>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'الاسم واللقب *' : 'Nom complet *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'الاسم الكامل' : 'Nom & Prénom'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-[#102D45]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'رقم الهاتف / الواتساب *' : 'Téléphone / WhatsApp *'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        required
                        placeholder="98 140 514"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#102D45]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'البريد الإلكتروني *' : 'Adresse E-mail *'}
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        required
                        placeholder="nom@exemple.tn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#102D45]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'تاريخ السفر المتوقع' : 'Date de voyage prévue'}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          isAr
                            ? 'مثال : نوفمبر / ديسمبر 2026'
                            : 'Ex : Novembre / Décembre 2026'
                        }
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full rounded-xl border border-[#102D45]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {isAr
                        ? 'ملاحظات إضافية (اختياري)'
                        : 'Précisions complémentaires (optionnel)'}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        isAr
                          ? 'مثال : مطار المغادرة، مدينة الوصول، الوضعية المهنية...'
                          : 'Ex : Aéroport de départ, ville d’atterrissage, profil salarié/gérant...'
                      }
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-[#102D45]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                    />
                  </div>

                  {formError && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                      {formError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#102D45]/10 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        {isAr
                          ? `المجموع التقديري (${travelersCount} مسافر)`
                          : `Total estimé (${travelersCount} voyageur${
                              travelersCount > 1 ? 's' : ''
                            })`}
                      </p>
                      <p className="font-mono-tabular text-2xl font-extrabold text-[#102D45]">
                        {estimatedTotalDt > 0
                          ? `${estimatedTotalDt.toLocaleString('fr-FR')} ${
                              isAr ? 'د.ت' : 'DT'
                            }${
                              hasSurDemandeSelected
                                ? isAr
                                  ? ' + حسب الطلب'
                                  : ' + Devis'
                                : ''
                            }`
                          : isAr
                            ? 'حسب الطلب'
                            : 'Sur demande'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="submit"
                        className="rounded-xl bg-[#102D45] px-5 py-3 text-sm font-bold text-white hover:bg-[#1C4967]"
                      >
                        {isAr ? 'تأكيد الطلب' : 'Confirmer ma demande'}
                      </button>
                      <a
                        href={detailedWhatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:bg-[#1FB857]"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>{isAr ? 'واتساب مباشر' : 'WhatsApp Direct'}</span>
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL EASY2BOOK BRAND FOOTER */}
      <footer className="bg-[#0B162C] border-t border-white/10 py-10 text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-1.5">
              <img
                src="/assets/aistudio/logo_transparent_e9918557.png"
                alt="Easy2Book"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold">
                {isAr
                  ? 'Easy2Book · مركز التأشيرات والرحلات'
                  : 'Easy2Book · Centrale Visa & Voyages'}
              </p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? `${spec.titleAr} · ${spec.delaySummaryAr}`
                  : `${spec.titleFr} · ${spec.delaySummaryFr}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span
              dir="ltr"
              className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-[#E7B34C]"
            >
              <Phone className="h-3.5 w-3.5" />
              98 140 514
            </span>
            <span>·</span>
            <span dir="ltr">contact@easy2book.tn</span>
            <span>·</span>
            <span dir="ltr">www.easy2book.tn</span>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label={isAr ? 'إغلاق' : 'Fermer'}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.title}
              className="max-h-[72vh] w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm font-bold text-[#102D45]">
                {lightboxPhoto.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
