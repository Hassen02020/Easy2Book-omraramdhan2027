import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Car,
  Check,
  CheckCircle2,
  Code2,
  Compass,
  Copy,
  Crown,
  Download,
  Eye,
  EyeOff,
  Film,
  Landmark,
  Loader2,
  Moon,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Ship,
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
import { HERO_MEDIA_MAP } from '../../lib/mediaRegistry';
import {
  formatFileSize,
  generateVideoDownloadLink,
  triggerVideoBlobDownload,
  type VideoExportResult,
} from '../../lib/reelVideoExporter';
import {
  buildCrmSubmissionPayload,
  SimulatedCrmAdapter,
  type CrmAdapterDispatchResult,
  type CrmIntegrationConfig,
} from '../../integration-contracts/crmAdapter';
import type { Page, PageVersionSnapshot } from '../../types/creator';
import { ReelPlayer } from '../ReelPlayer';
import { PdfBrochureControl } from '../shared-components/PdfBrochureControl';
import { SocialPosterControl } from '../shared-components/SocialPosterControl';
import { WhatsAppIcon } from '../WhatsAppIcon';

type GroupSizeOption = 1 | 2 | 3 | 4 | 5 | 7 | 10;

const GROUP_SIZE_OPTIONS: { value: GroupSizeOption; label: string }[] = [
  { value: 1, label: 'شخص 1' },
  { value: 2, label: 'شخصان (2)' },
  { value: 3, label: '3 أشخاص' },
  { value: 4, label: '4 أشخاص' },
  { value: 5, label: '5 أشخاص' },
  { value: 7, label: '7 أشخاص' },
  { value: 10, label: '10 أشخاص' },
];

interface EgyptExcursionOffer {
  id: 'transfer' | 'nile_cruise' | 'pyramids_gem' | 'city_tour' | 'islamic_cairo' | 'al_han';
  badge: string;
  title: string;
  subtitle: string;
  startingPriceLabel: string;
  imageSrc: string;
  highlights: string[];
  /** Exact total DT price by group size (matching Easy2Book +25 DT schedule) */
  priceByGroupSize: Record<GroupSizeOption, number>;
  groupNote?: (size: GroupSizeOption) => string | null;
}

const EGYPT_EXCURSIONS_CATALOG: EgyptExcursionOffer[] = [
  {
    id: 'transfer',
    badge: 'توصيل خاص VIP',
    title: 'توصيل من المطار إلى النزل',
    subtitle: 'سيارة خاصة مكيفة مع استقبال شخصي مباشر في مطار القاهرة الدولي حتى باب الفندق.',
    startingPriceLabel: '175 د.ت',
    imageSrc: HERO_MEDIA_MAP.vip_airport_transfer.src,
    highlights: ['استقبال في المطار', 'سيارة مكيفة حديثة', 'سائق خاص محترف'],
    priceByGroupSize: { 1: 175, 2: 175, 3: 175, 4: 175, 5: 175, 7: 175, 10: 175 },
    groupNote: () => 'سعر السيارة الخاصة (1 إلى 10 أشخاص)',
  },
  {
    id: 'nile_cruise',
    badge: 'عشاء وسهرة على النيل',
    title: 'سهرة نايل كروز (Nile Cruise)',
    subtitle: 'أمسية فاخرة على متن باخرة سياحية في نهر النيل شاملة السيارة والمرشد وبوفيه العشاء.',
    startingPriceLabel: '225 د.ت',
    imageSrc: HERO_MEDIA_MAP.egypt_nile_dinner.src,
    highlights: ['سيارة + مرشد مرافق', 'عشاء فاخر على النيل', 'عروض فنية وتنورة'],
    priceByGroupSize: { 1: 225, 2: 225, 3: 225, 4: 225, 5: 225, 7: 225, 10: 225 },
    groupNote: () => 'سعر الباقة المرجعي (سيارة + مرشد + العشاء)',
  },
  {
    id: 'pyramids_gem',
    badge: 'الأكثر طلباً',
    title: 'المتحف المصري الكبير + الأهرامات',
    subtitle: 'جولة شاملة لأهرامات الجيزة وأبو الهول والمتحف المصري الكبير بسيارة خاصة ومرشد والتذاكر.',
    startingPriceLabel: 'ابتداءً من 425 د.ت',
    imageSrc: HERO_MEDIA_MAP.egypt_pyramids_museum.src,
    highlights: ['سيارة خاصة مكيفة', 'مرشد سياحي متخصص', 'تذاكر الدخول شاملة'],
    priceByGroupSize: { 1: 425, 2: 725, 3: 1165, 4: 1165, 5: 1365, 7: 1745, 10: 2425 },
    groupNote: (size) => (size === 3 ? 'تُحتسب ضمن فئة 4 أشخاص (1,165 د.ت)' : null),
  },
  {
    id: 'city_tour',
    badge: 'جولة وتسوق',
    title: 'سيتي تور القاهرة (City Tour)',
    subtitle: 'جولة مريحة تشمل مول القاهرة وأهم معالم وسط البلد بسيارة خاصة مكيفة مع مرشد.',
    startingPriceLabel: 'ابتداءً من 225 د.ت',
    imageSrc: HERO_MEDIA_MAP.cairo_nile.src,
    highlights: ['مول القاهرة الحديث', 'وسط البلد التاريخي', 'سيارة مكيفة + مرشد'],
    priceByGroupSize: { 1: 225, 2: 265, 3: 265, 4: 345, 5: 365, 7: 385, 10: 385 },
  },
  {
    id: 'islamic_cairo',
    badge: 'تراث وتاريخ شامل',
    title: 'جولة القاهرة الإسلامية الشاملة',
    subtitle: 'قلعة صلاح الدين، محمد علي، المتحف الحربي، خان الخليلي، الأزهر، الحسين، المعز، أبو العربي والتسوق.',
    startingPriceLabel: 'ابتداءً من 385 د.ت',
    imageSrc: HERO_MEDIA_MAP.egypt_islamic_cairo.src,
    highlights: ['8 معالم أثرية وتاريخية', 'وقت حر للتسوق بالخان', 'شاملة السيارة والمرشد والتذاكر'],
    priceByGroupSize: { 1: 385, 2: 505, 3: 625, 4: 705, 5: 765, 7: 865, 10: 1045 },
  },
  {
    id: 'al_han',
    badge: 'سهرة 22:00 – 01:00',
    title: 'سهرة ألحان / صاحب السعادة',
    subtitle: 'خرجة ليلية راقية في القاهرة من الساعة 22:00 إلى 01:00 صباحاً بسيارة خاصة ومرشد مرافق.',
    startingPriceLabel: 'ابتداءً من 225 د.ت',
    imageSrc: HERO_MEDIA_MAP.egypt_nile_dinner.src,
    highlights: ['من 22:00 إلى 01:00 ليلاً', 'سيارة خاصة مكيفة', 'مرشد ومرافق Easy2Book'],
    priceByGroupSize: { 1: 225, 2: 265, 3: 305, 4: 305, 5: 425, 7: 425, 10: 425 },
  },
];

const GALLERY_PHOTOS = [
  {
    id: 'gal-pyr',
    src: HERO_MEDIA_MAP.egypt_pyramids_museum.src,
    badge: 'الرحلة رقم 3',
    title: 'المتحف المصري الكبير وأهرامات الجيزة',
    caption: 'تذكرة شاملة + سيارة خاصة + مرشد سياحي من Easy2Book',
  },
  {
    id: 'gal-nile',
    src: HERO_MEDIA_MAP.egypt_nile_dinner.src,
    badge: 'الرحلة رقم 2',
    title: 'سهرة عشاء نايل كروز على نهر النيل',
    caption: 'أجواء مسائية ساحرة مع العشاء والعرض الفني الفاخر',
  },
  {
    id: 'gal-isl',
    src: HERO_MEDIA_MAP.egypt_islamic_cairo.src,
    badge: 'الرحلة رقم 5',
    title: 'القاهرة الإسلامية وشارع المعز وخان الخليلي',
    caption: 'جولة شاملة لقلعة صلاح الدين والأزهر والحسين والتسوق الحر',
  },
  {
    id: 'gal-trf',
    src: HERO_MEDIA_MAP.vip_airport_transfer.src,
    badge: 'الخدمة رقم 1',
    title: 'توصيل خاص من مطار القاهرة إلى النزل',
    caption: 'سيارة مكيفة حديثة واستقبال شخصي على مدار الساعة (175 د.ت)',
  },
];

const WHATSAPP_NUMBER = '21698140514';

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

interface EgyptExcursionsPilotPageProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  crmConfig: CrmIntegrationConfig;
  defaultVoiceId?: string;
}

/**
 * Page Pilote Complète : "Easy2Book — رحلات يومية مصر (أفراد وجروبات)"
 * - Lecteur Vidéo 9:16 + Timeline Scrubber + 4 Scènes Égypte + Voix féminine tunisienne Gemini TTS (Layla par défaut)
 * - Génération & téléchargement direct de la vidéo MP4 9:16
 * - Catalogue complet des 6 excursions & tarifs (+25 DT Easy2Book) avec photos professionnelles & galerie interactive
 * - Simulateur multi-excursions par taille de groupe (1 à 10 personnes) + Envoi WhatsApp Business 98140514 + CRM
 */
export function EgyptExcursionsPilotPage({
  page,
  snapshot,
  crmConfig,
  defaultVoiceId,
}: EgyptExcursionsPilotPageProps) {
  const reelConfig = useMemo(() => getReelConfig('egypt_excursions'), []);
  const initialVoice =
    defaultVoiceId && defaultVoiceId !== 'Charon'
      ? defaultVoiceId
      : reelConfig.defaultVoiceId;

  // Video & Gemini Tunisian Feminine Voiceover state
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(TOTAL_REEL_DURATION_SEC);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);

  useEffect(() => {
    if (defaultVoiceId && defaultVoiceId !== 'Charon') {
      setSelectedVoice(defaultVoiceId);
    } else {
      setSelectedVoice(reelConfig.defaultVoiceId);
    }
  }, [defaultVoiceId, reelConfig.defaultVoiceId]);

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
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);
  const [showSocialCaptions, setShowSocialCaptions] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlMapRef = useRef<Map<string, string>>(new Map());

  // Photo Gallery Lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<(typeof GALLERY_PHOTOS)[number] | null>(
    null
  );

  // Interactive Multi-Excursion Group Estimator & WhatsApp / CRM Form state
  const [groupSize, setGroupSize] = useState<GroupSizeOption>(2);
  const [customGroupMoreThan10, setCustomGroupMoreThan10] = useState(false);
  const [selectedExcursionIds, setSelectedExcursionIds] = useState<
    EgyptExcursionOffer['id'][]
  >(['transfer', 'pyramids_gem']);
  const [activeTariffTab, setActiveTariffTab] = useState<
    'pyramids_gem' | 'city_tour' | 'islamic_cairo' | 'al_han'
  >('pyramids_gem');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] =
    useState<CrmAdapterDispatchResult | null>(null);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  // Visual fallback timer when audio element isn't driving playback
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
      if (audioRef.current) {
        audioRef.current.pause();
      }
      map.forEach((url) => URL.revokeObjectURL(url));
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

    let url = audioUrlMapRef.current.get(voice);
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
          const errData = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(
            errData.error ||
              'تعذّر توليد التعليق الصوتي، العرض المرئي يواصل التشغيل.'
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
          audioUrlMapRef.current.set(voice, url);
        }
      } catch (err) {
        setAudioError(
          err instanceof Error
            ? err.message
            : 'تعذّر توليد الصوت، يمكنك متابعة العرض بالترجمة.'
        );
      } finally {
        setAudioLoading(false);
      }
    }

    if (url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.muted = isMuted;
      audio.onloadedmetadata = () => {
        if (audio.duration && Number.isFinite(audio.duration)) {
          setTotalDuration(audio.duration);
        }
      };
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      audio.onended = () => {
        setAudioActive(false);
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audioRef.current = audio;
      setAudioActive(true);
      await audio.play().catch(() => {
        setAudioActive(false);
      });
    }
  };

  const handleSelectScene = (targetRealSec: number) => {
    setCurrentTime(targetRealSec);
    if (audioRef.current) {
      audioRef.current.currentTime = targetRealSec;
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
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
    setVideoExportStatus('جاري تحضير فيديو رحلات مصر 9:16...');

    if (videoExportResult?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoExportResult.blobUrl);
    }

    try {
      const result = await generateVideoDownloadLink({
        voiceName: selectedVoice,
        showCaptions,
        preset: 'egypt_excursions',
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
          : 'تعذّر إنشاء رابط تحميل الفيديو حالياً.'
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
      // Fallback handled by readonly input
    }
  };

  const toggleExcursionSelection = (id: EgyptExcursionOffer['id']) => {
    setSelectedExcursionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedExcursions = useMemo(
    () => EGYPT_EXCURSIONS_CATALOG.filter((ex) => selectedExcursionIds.includes(ex.id)),
    [selectedExcursionIds]
  );

  const estimatedTotalDt = useMemo(() => {
    if (customGroupMoreThan10 || selectedExcursions.length === 0) return null;
    return selectedExcursions.reduce(
      (sum, ex) => sum + ex.priceByGroupSize[groupSize],
      0
    );
  }, [customGroupMoreThan10, groupSize, selectedExcursions]);

  const detailedWhatsAppHref = useMemo(() => {
    const lines = [
      'السلام عليكم فريق Easy2Book،',
      'أرغب في الاستفسار والحجز في عرض: رحلات يومية مصر (القاهرة)',
      customGroupMoreThan10
        ? '• عدد الأشخاص: مجموعة تفوق 10 أشخاص (طلب عرض خاص)'
        : `• عدد الأشخاص: ${groupSize} ${groupSize === 1 ? 'شخص' : 'أشخاص'}`,
      selectedExcursions.length > 0
        ? `• الرحلات المختارة (${selectedExcursions.length}):`
        : '• لم يتم تحديد رحلة بعد',
      ...selectedExcursions.map(
        (ex) =>
          `  - ${ex.title}: ${
            customGroupMoreThan10
              ? 'حسب عرض المجموعة'
              : `${ex.priceByGroupSize[groupSize].toLocaleString('en-US')} د.ت`
          }`
      ),
      estimatedTotalDt !== null
        ? `• المجموع التقديري: ${estimatedTotalDt.toLocaleString('en-US')} د.ت`
        : '• المجموع: حسب التسعيرة النهائية للمجموعة',
      travelDate.trim() ? `• تاريخ الوصول: ${travelDate.trim()}` : '',
      fullName.trim() ? `• الاسم الكامل: ${fullName.trim()}` : '',
      phone.trim() ? `• رقم الهاتف: ${phone.trim()}` : '',
      email.trim() ? `• البريد الإلكتروني: ${email.trim()}` : '',
      notes.trim() ? `• ملاحظات: ${notes.trim()}` : '',
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  }, [
    customGroupMoreThan10,
    email,
    estimatedTotalDt,
    fullName,
    groupSize,
    notes,
    phone,
    selectedExcursions,
    travelDate,
  ]);

  const handleSubmitPilotInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedExcursions.length === 0) {
      setFormError('يرجى اختيار رحلة أو خدمة واحدة على الأقل من القائمة.');
      return;
    }
    if (fullName.trim().length < 3) {
      setFormError('يرجى إدخال الاسم الكامل (3 أحرف على الأقل).');
      return;
    }
    if (phone.replace(/\D/g, '').length < 8) {
      setFormError('يرجى إدخال رقم هاتف صحيح لا يقل عن 8 أرقام.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    const payload = buildCrmSubmissionPayload({
      pageId: page.id,
      offerId: snapshot.offerRef.externalOfferId,
      businessUniverse: page.universe,
      pageLanguage: 'ar',
      formId: snapshot.form.formId,
      attribution: snapshot.attribution,
      includeUtm: crmConfig.includeUtmAttribution,
      fields: {
        fullName: fullName.trim(),
        phoneWhatsapp: phone.trim(),
        email: email.trim(),
        travelersCount: customGroupMoreThan10 ? 12 : groupSize,
        requestedDeparture: travelDate.trim() || 'رحلات يومية القاهرة 2026',
        message: [
          `الرحلات: ${selectedExcursions.map((x) => x.title).join(' + ')}`,
          estimatedTotalDt !== null
            ? `التقدير: ${estimatedTotalDt} د.ت`
            : 'طلب مجموعة +10 أشخاص',
          notes.trim(),
        ]
          .filter(Boolean)
          .join(' | '),
        consent: true,
      },
    });

    const result = await SimulatedCrmAdapter.submitLeadForm(payload, crmConfig);
    setDispatchResult(result);
  };

  const activeTariffOffer =
    EGYPT_EXCURSIONS_CATALOG.find((ex) => ex.id === activeTariffTab) ??
    EGYPT_EXCURSIONS_CATALOG[2];

  return (
    <div dir="rtl" className="font-arabic bg-[#FAF9F6] text-[#0B162C]">
      {/* Sticky Official Brand Navigation */}
      <header className="sticky top-0 z-30 border-b border-[#0B162C]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/logo_transparent_e9918557.png"
              alt="Easy2Book"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-extrabold text-[#0B162C]">Easy2Book</p>
              <p className="text-[11px] font-semibold text-[#C8922A]">
                رحلات يومية مصر · للأفراد والجروبات
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#0B162C]/80">
            <a href="#egypt-pilot-video" className="hover:text-[#C8922A]">
              الفيديو الإعلاني
            </a>
            <a href="#egypt-pilot-catalog" className="hover:text-[#C8922A]">
              الرحلات الـ 6
            </a>
            <a href="#egypt-pilot-gallery" className="hover:text-[#C8922A]">
              معرض الصور
            </a>
            <a href="#egypt-pilot-booking" className="hover:text-[#C8922A]">
              الأسعار والحجز
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <SocialPosterControl
              variant="pilot_header"
              locale="ar"
              page={page}
              language="ar"
              pageTitle={page.title}
              slug={snapshot.seo.slug}
              universe="voyages"
              photoKey="egypt_pyramids_reel"
            />
            <PdfBrochureControl
              variant="pilot_header"
              pageTitle={page.title}
              slug={snapshot.seo.slug}
              revisionKey={page.updatedAt}
            />
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4 text-emerald-600" />
              <span className="font-mono-tabular" dir="ltr">
                98 140 514
              </span>
            </a>
            <a
              href="#egypt-pilot-booking"
              className="rounded-lg bg-[#0B162C] px-4 py-2 text-xs font-bold text-white hover:bg-[#1C4967] whitespace-nowrap shrink-0"
            >
              احجز رحلتك الآن
            </a>
          </div>
        </div>
      </header>

      {/* HERO + 9:16 REEL VIDEO PLAYER + TUNISIAN FEMININE VOICEOVER STUDIO */}
      <section
        id="egypt-pilot-video"
        className="border-b border-[#0B162C]/10 bg-gradient-to-b from-[#FAF9F6] to-white py-12 md:py-16"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#C8922A]/40 bg-[#C8922A]/10 px-3 py-1.5 text-xs font-bold text-[#9A6E1B]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>رحلات يومية مصر · سيارة خاصة ومرشد سياحي شامل · 98 140 514</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#0B162C]">
              اكتشف القاهرة والأهرامات والنيل...{' '}
              <span className="text-[#C8922A]">بسيارة خاصة وراحة تامة</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-[#475569]">
              عرض متكامل من Easy2Book يشمل التوصيل من المطار (175 د.ت)، سهرة نايل
              كروز (225 د.ت)، المتحف المصري الكبير والأهرامات، سيتي تور، جولة
              القاهرة الإسلامية، وسهرة ألحان / صاحب السعادة بصيغة للأفراد والمجموعات
              من 1 إلى 10 أشخاص.
            </p>

            {/* Voiceover & Timeline Controls */}
            <div className="rounded-2xl border border-[#0B162C]/12 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void startOrToggleVoiceover()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8922A] px-5 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#b58222]"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>
                    {audioLoading
                      ? 'جاري تجهيز الصوت النسائي التونسي...'
                      : isPlaying
                        ? 'إيقاف التشغيل مؤقتاً'
                        : 'تشغيل الفيديو بالصوت النسائي التونسي'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B162C]/15 px-3.5 py-3 text-xs font-bold text-[#0B162C] hover:bg-[#FAF9F6]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  إعادة من البداية
                </button>

                <button
                  type="button"
                  onClick={() => setShowCaptions((c) => !c)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B162C]/15 px-3.5 py-3 text-xs font-bold text-[#0B162C] hover:bg-[#FAF9F6]"
                >
                  {showCaptions ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  {showCaptions ? 'إخفاء نصوص الفيديو' : 'إظهار نصوص الفيديو'}
                </button>

                <button
                  type="button"
                  disabled={videoExporting}
                  onClick={() => void handleGenerateVideoLink()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B162C] px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#1C4967] disabled:opacity-60"
                >
                  {videoExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8922A]" />
                  ) : (
                    <Download className="h-3.5 w-3.5 text-[#C8922A]" />
                  )}
                  <span>
                    {videoExporting
                      ? `جاري إنشاء الرابط (${videoExportPct}%)`
                      : 'إنشاء رابط تحميل الفيديو (MP4)'}
                  </span>
                </button>

                <SocialPosterControl
                  variant="pilot_inline"
                  locale="ar"
                  page={page}
                  language="ar"
                  pageTitle={page.title}
                  slug={snapshot.seo.slug}
                  universe="voyages"
                  photoKey="egypt_pyramids_reel"
                />

                <PdfBrochureControl
                  variant="pilot_inline"
                  pageTitle={page.title}
                  slug={snapshot.seo.slug}
                  revisionKey={page.updatedAt}
                />
              </div>

              {/* Voice Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#475569]">
                  <span className="inline-flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5 text-[#C8922A]" />
                    نبرة المعلقة / المعلق ({VOICE_OPTIONS.length} أصوات — الافتراضي ليلى):
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {VOICE_OPTIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVoice(v.id);
                        if (isPlaying) {
                          void startOrToggleVoiceover(v.id);
                        }
                      }}
                      title={`${v.id} — ${v.descriptionFr} (${v.tone})`}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                        selectedVoice === v.id
                          ? 'border-[#0B162C] bg-[#0B162C] text-white'
                          : 'border-[#0B162C]/12 bg-[#FAF9F6] text-[#0B162C] hover:border-[#C8922A]'
                      }`}
                    >
                      <span>{v.label}</span>
                      <span
                        className={`mr-1.5 text-[10px] ${
                          selectedVoice === v.id ? 'text-[#E7B34C]' : 'text-slate-500'
                        }`}
                      >
                        · {v.tone}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {videoExporting && (
                <div data-pdf-exclude="true" className="rounded-xl border border-[#C8922A]/40 bg-[#FAF9F6] p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B162C]">
                    <span className="inline-flex items-center gap-1.5">
                      <Film className="h-3.5 w-3.5 text-[#C8922A]" />
                      {videoExportStatus || 'جاري تجهيز ملف الفيديو MP4...'}
                    </span>
                    <span className="font-mono-tabular" dir="ltr">
                      {videoExportPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#0B162C]/10">
                    <div
                      className="h-full bg-[#C8922A] transition-all duration-300"
                      style={{ width: `${videoExportPct}%` }}
                    />
                  </div>
                </div>
              )}

              {videoExportError && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {videoExportError}
                </p>
              )}

              {videoExportResult && !videoExporting && (
                <div data-pdf-exclude="true" className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>الفيديو جاهز للتحميل ({videoExportResult.format.toUpperCase()} · 9:16 HD)</span>
                    </div>
                    <span className="font-mono-tabular text-[11px] font-semibold text-emerald-800" dir="ltr">
                      {formatFileSize(videoExportResult.sizeBytes)} · {videoExportResult.durationSec}s
                      {videoExportResult.hasAudio ? ' · Audio OK' : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerVideoBlobDownload(videoExportResult)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      تحميل الفيديو الآن ({videoExportResult.format.toUpperCase()})
                    </button>

                    <a
                      href={videoExportResult.blobUrl}
                      download={videoExportResult.fileName}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      حفظ الملف مباشرة
                    </a>

                    <button
                      type="button"
                      onClick={() => void handleCopyVideoLink()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50"
                    >
                      {videoLinkCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          تم نسخ الرابط
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          نسخ رابط الخادم
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-1.5" dir="ltr">
                    <input
                      type="text"
                      readOnly
                      value={videoExportResult.downloadUrl}
                      onFocus={(e) => e.currentTarget.select()}
                      className="w-full bg-transparent font-mono text-[11px] text-[#0B162C] outline-none"
                      aria-label="رابط تحميل الفيديو"
                    />
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-[#0B162C] p-2">
                    <video
                      src={videoExportResult.blobUrl}
                      controls
                      playsInline
                      className="mx-auto max-h-64 w-auto rounded-lg"
                    />
                    <p className="mt-1.5 text-center text-[11px] text-emerald-100">
                      يمكنك أيضاً الضغط على النقاط الثلاث (⋮) في مشغل الفيديو لاختيار «تنزيل» مباشرة.
                    </p>
                  </div>
                </div>
              )}

              {audioError && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {audioError}
                </p>
              )}

              {/* Scene Progress & Scrubber */}
              <div className="rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#0B162C]">
                    المشهد الحالي: {activeScene.indexLabel} ·{' '}
                    {activeScene.arabicTitle}
                  </span>
                  <span className="font-mono-tabular text-[#475569]" dir="ltr">
                    {formatTimecode(currentTime)} /{' '}
                    {formatTimecode(totalDuration)}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleSelectScene(Number(e.target.value))}
                  className="w-full accent-[#C8922A] cursor-pointer"
                  aria-label="شريط التقدم الزمني للفيديو"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {reelConfig.scenes.map((sc) => {
                    const isCurrent = sc.id === activeScene.id;
                    const targetSec =
                      (sc.startSec / TOTAL_REEL_DURATION_SEC) * totalDuration;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleSelectScene(targetSec)}
                        className={`rounded-xl border p-2.5 text-right transition-colors ${
                          isCurrent
                            ? 'border-[#C8922A] bg-white shadow-2xs'
                            : 'border-[#0B162C]/10 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <p className="font-mono-tabular text-[11px] font-bold text-[#C8922A]">
                          {sc.indexLabel}
                        </p>
                        <p className="text-xs font-bold text-[#0B162C] truncate">
                          {sc.arabicTitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1 border-t border-[#0B162C]/10">
                  <button
                    type="button"
                    onClick={() => setShowSocialCaptions((s) => !s)}
                    className="text-xs font-bold text-[#1C4967] hover:underline"
                  >
                    {showSocialCaptions
                      ? 'إخفاء نصوص السوشيال ميديا والتيك توك ▲'
                      : 'نصوص السوشيال ميديا والتيك توك (Captions للنسخ) ▼'}
                  </button>
                  {showSocialCaptions && (
                    <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
                      {getSocialCaptionBlocks('egypt_excursions').map((cap) => (
                        <div
                          key={cap.id}
                          className="rounded-xl border border-[#0B162C]/10 bg-white p-2.5 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-[#C8922A]">
                              {cap.scene}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard
                                  ?.writeText(cap.lines.join('\n'))
                                  .then(() => {
                                    setCopiedCaptionId(cap.id);
                                    window.setTimeout(
                                      () => setCopiedCaptionId(null),
                                      1500
                                    );
                                  });
                              }}
                              className="inline-flex items-center gap-1 rounded border border-[#0B162C]/10 bg-[#FAF9F6] px-1.5 py-0.5 text-[10px] font-bold text-[#0B162C]"
                            >
                              {copiedCaptionId === cap.id ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              <span>
                                {copiedCaptionId === cap.id ? 'نُسخ' : 'نسخ'}
                              </span>
                            </button>
                          </div>
                          {cap.lines.map((line, i) => (
                            <p
                              key={i}
                              className="leading-snug text-[#0B162C]/85"
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
          </div>

          <div className="lg:col-span-5">
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

      {/* CATALOG OF THE 6 DAILY CAIRO EXCURSIONS */}
      <section
        id="egypt-pilot-catalog"
        className="bg-white py-16 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#C8922A]">
                برنامج الرحلات اليومية الـ 6 في القاهرة · الأسعار بالدينار التونسي (د.ت)
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0B162C]">
                اختر رحلاتك المفضلة وأضفها مباشرة إلى حاسبة العرض
              </h2>
            </div>
            <a
              href="#egypt-pilot-booking"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B162C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
            >
              <span>الانتقال إلى حاسبة الأسعار ({selectedExcursions.length} مختارة)</span>
            </a>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EGYPT_EXCURSIONS_CATALOG.map((offer, idx) => {
              const isSelected = selectedExcursionIds.includes(offer.id);
              return (
                <article
                  key={offer.id}
                  className={`flex flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#C8922A] bg-[#FBF9F4] shadow-md'
                      : 'border-[#0B162C]/10 bg-[#FAF9F6] hover:border-[#0B162C]/25'
                  }`}
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-200">
                      <img
                        src={offer.imageSrc}
                        alt={offer.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B162C]/80 via-[#0B162C]/15 to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="rounded-md bg-[#0B162C]/90 px-2 py-0.5 font-mono-tabular text-[10px] font-bold text-[#F5D68A]">
                          0{idx + 1}
                        </span>
                        <span className="rounded-md bg-[#C8922A] px-2 py-0.5 text-[10px] font-bold text-[#0B162C]">
                          {offer.badge}
                        </span>
                      </div>
                      <p className="absolute bottom-3 right-3 left-3 font-mono-tabular text-lg font-extrabold text-white">
                        {offer.startingPriceLabel}
                      </p>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-extrabold text-[#0B162C]">
                        {offer.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#475569]">
                        {offer.subtitle}
                      </p>
                      <ul className="space-y-1.5 pt-1">
                        {offer.highlights.map((hl) => (
                          <li
                            key={hl}
                            className="flex items-center gap-2 text-xs font-semibold text-[#0B162C]/85"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#C8922A]" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-[#0B162C]/10 p-4 flex items-center justify-between gap-2 bg-white/70">
                    <button
                      type="button"
                      onClick={() => toggleExcursionSelection(offer.id)}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                          : 'bg-[#0B162C] text-white hover:bg-[#1C4967]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>مضافة في حاسبة الحجز</span>
                        </>
                      ) : (
                        <span>+ أضف إلى باقتك</span>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROFESSIONAL PHOTO GALLERY */}
      <section
        id="egypt-pilot-gallery"
        className="bg-[#FAF9F6] py-14 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8922A]">
                <Camera className="h-3.5 w-3.5" />
                <span>معرض الصور الاحترافية · القاهرة والجيزة والنيل</span>
              </p>
              <h2 className="mt-1.5 text-2xl md:text-3xl font-extrabold text-[#0B162C]">
                لقطات حقيقية من جولات Easy2Book في مصر
              </h2>
            </div>
            <p className="text-xs text-[#475569]">
              اضغط على أي صورة للتكبير واستعراض التفاصيل
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY_PHOTOS.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxPhoto(photo)}
                className="group overflow-hidden rounded-2xl border border-[#0B162C]/10 bg-white text-right shadow-2xs transition-all hover:border-[#C8922A] hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-md bg-[#0B162C]/85 px-2 py-0.5 text-[10px] font-bold text-[#F5D68A]">
                    {photo.badge}
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="text-xs font-extrabold text-[#0B162C]">
                    {photo.title}
                  </p>
                  <p className="mt-1 text-[11px] text-[#475569] leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE GROUP PRICING SIMULATOR + TARIFF MATRICES + WHATSAPP / CRM FORM */}
      <section id="egypt-pilot-booking" className="bg-[#0B162C] py-16 text-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12">
          {/* Left: Interactive Group Estimator & Official Group Price Matrix */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-bold text-[#F5D68A]">
                حاسبة الأسعار الرسمية بالدينار التونسي (د.ت)
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                الأسعار التفصيلية للأفراد والمجموعات
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                اختر عدد الأشخاص (من 1 إلى 10) لعرض السعر الإجمالي الدقيق لكل رحلة من
                رحلات القاهرة الـ 6.
              </p>
            </div>

            {/* Group Size Selector */}
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 space-y-3">
              <p className="text-xs font-bold text-[#F5D68A]">
                1. حدد عدد المسافرين في مجموعتك:
              </p>
              <div className="flex flex-wrap gap-2">
                {GROUP_SIZE_OPTIONS.map((opt) => {
                  const active = !customGroupMoreThan10 && groupSize === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setCustomGroupMoreThan10(false);
                        setGroupSize(opt.value);
                      }}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                        active
                          ? 'border-[#C8922A] bg-[#C8922A] text-[#0B162C]'
                          : 'border-white/20 bg-white/5 text-white hover:bg-white/15'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCustomGroupMoreThan10(true)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                    customGroupMoreThan10
                      ? 'border-[#C8922A] bg-[#C8922A] text-[#0B162C]'
                      : 'border-white/20 bg-white/5 text-white hover:bg-white/15'
                  }`}
                >
                  +10 أشخاص
                </button>
              </div>
            </div>

            {/* Quick Tariff Matrix Switcher for Excursions 3, 4, 5, 6 */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
              <p className="text-xs font-bold text-[#F5D68A]">
                2. جدول أسعار الرحلات حسب عدد الأشخاص:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'pyramids_gem', label: 'المتحف + الأهرامات', icon: Landmark },
                    { id: 'city_tour', label: 'سيتي تور القاهرة', icon: Car },
                    { id: 'islamic_cairo', label: 'القاهرة الإسلامية', icon: Compass },
                    { id: 'al_han', label: 'سهرة ألحان (22-01)', icon: Moon },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTariffTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTariffTab(tab.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-right transition-colors ${
                        active
                          ? 'bg-white text-[#0B162C]'
                          : 'bg-white/8 text-slate-200 hover:bg-white/15'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#C8922A]" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-1">
                {GROUP_SIZE_OPTIONS.map((opt) => {
                  if (activeTariffOffer.id === 'pyramids_gem' && opt.value === 3) {
                    return null;
                  }
                  const price = activeTariffOffer.priceByGroupSize[opt.value];
                  const isCurrentSize = !customGroupMoreThan10 && groupSize === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                        isCurrentSize
                          ? 'border border-[#C8922A] bg-[#C8922A]/20 font-bold'
                          : 'bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-mono-tabular font-extrabold text-[#F5D68A]">
                        {price.toLocaleString('en-US')} د.ت
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/15 bg-white/8 p-3.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-[#F5D68A] shrink-0" />
                <span>نايل كروز: 225 د.ت</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-[#F5D68A] shrink-0" />
                <span>توصيل المطار: 175 د.ت</span>
              </div>
            </div>
          </div>

          {/* Right: Multi-Excursion Booking Form & WhatsApp Business / CRM */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white p-6 md:p-8 text-[#0B162C] shadow-xl">
              <div className="border-b border-[#0B162C]/10 pb-4">
                <p className="text-xs font-bold text-[#C8922A]">
                  احسب باقتك المخصصة وأرسل طلبك فوراً
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  نموذج الحجز المباشر لرحلات مصر (98 140 514)
                </h3>
              </div>

              {dispatchResult ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold">
                          تم تجهيز طلب حجز رحلات مصر بنجاح عبر عقد التكامل مع CRM
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
                      إرسال التفاصيل الآن عبر واتساب Business (98140514)
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowJsonPayload((s) => !s)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#0B162C]/15 bg-[#F5F7FA] px-3 py-3 text-xs font-bold text-[#0B162C]"
                    >
                      <Code2 className="h-4 w-4" />
                      {showJsonPayload
                        ? 'إخفاء JSON'
                        : 'معاينة عقد JSON للتكامل'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDispatchResult(null)}
                      className="text-xs font-bold text-[#1C4967] underline"
                    >
                      تعديل الطلب
                    </button>
                  </div>

                  {showJsonPayload && (
                    <pre
                      dir="ltr"
                      className="max-h-64 overflow-auto rounded-xl bg-[#102D45] p-4 font-mono text-[11px] text-slate-100"
                    >
                      {JSON.stringify(dispatchResult.payload, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={(e) => void handleSubmitPilotInquiry(e)}
                  className="mt-5 space-y-4"
                >
                  {/* Multi-Excursion Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B162C] mb-2">
                      الرحلات والخدمات المطلوبة ({selectedExcursions.length} مختارة):
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {EGYPT_EXCURSIONS_CATALOG.map((ex) => {
                        const checked = selectedExcursionIds.includes(ex.id);
                        const priceForGroup = ex.priceByGroupSize[groupSize];
                        const note = ex.groupNote?.(groupSize);
                        return (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => toggleExcursionSelection(ex.id)}
                            className={`flex items-center justify-between gap-2 rounded-xl border p-3 text-right transition-colors ${
                              checked
                                ? 'border-[#C8922A] bg-[#FBF9F4]'
                                : 'border-[#0B162C]/12 bg-white hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#0B162C] truncate">
                                {ex.title}
                              </p>
                              {note ? (
                                <p className="text-[10px] text-[#475569] truncate">
                                  {note}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono-tabular text-xs font-extrabold text-[#102D45]">
                                {customGroupMoreThan10
                                  ? 'عرض خاص'
                                  : `${priceForGroup.toLocaleString('en-US')} د.ت`}
                              </span>
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                  checked
                                    ? 'border-[#C8922A] bg-[#C8922A] text-white'
                                    : 'border-[#0B162C]/25 bg-white'
                                }`}
                              >
                                {checked && <Check className="h-3 w-3" />}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {customGroupMoreThan10 && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-950">
                      <Users className="h-4 w-4 shrink-0 text-amber-700" />
                      <span>
                        مجموعات تفوق 10 أشخاص: يرجى التواصل على 98 140 514 للحصول على
                        أفضل عرض حافلات سياحية وتأكيد الإمكانية.
                      </span>
                    </div>
                  )}

                  {/* Personal Contact Fields */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="الاسم واللقب"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        رقم الهاتف / واتساب *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="98 140 514"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.tn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        تاريخ السفر أو الوصول إلى القاهرة
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: ديسمبر 2026 / عطلة الشتاء"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      ملاحظات إضافية (اختياري)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: اسم الفندق في القاهرة، وقت الرحلة أو طلب مرشد ناطق بالعربية/الفرنسية"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                    />
                  </div>

                  {formError && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                      {formError}
                    </p>
                  )}

                  {/* Summary Bar + Dual Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0B162C]/10 pt-4">
                    <div>
                      <p className="text-xs text-[#475569]">
                        المجموع التقديري للباقة المختارة (
                        {customGroupMoreThan10 ? '+10 أشخاص' : `${groupSize} أشخاص`})
                      </p>
                      <p className="font-mono-tabular text-2xl font-extrabold text-[#0B162C]">
                        {estimatedTotalDt !== null
                          ? `${estimatedTotalDt.toLocaleString('en-US')} د.ت`
                          : 'عرض خاص عند الطلب'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="submit"
                        className="rounded-xl bg-[#0B162C] px-5 py-3 text-sm font-bold text-white hover:bg-[#1C4967]"
                      >
                        تأكيد وإرسال الطلب
                      </button>
                      <a
                        href={detailedWhatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:bg-[#1FB857]"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>أرسل عبر واتساب</span>
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BRAND FOOTER */}
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
              <p className="text-sm font-bold">Easy2Book · سفرتك أسهل</p>
              <p className="text-xs text-slate-300">
                الصفحة الرائدة · وحدة رحلات مصر اليومية · القاهرة والأهرامات والنيل
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span
              className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-[#F5D68A]"
              dir="ltr"
            >
              <Phone className="h-3.5 w-3.5" />
              98 140 514
            </span>
            <span>·</span>
            <span dir="ltr">www.easy2book.tn</span>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL FOR GALLERY PHOTOS */}
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
              aria-label="إغلاق"
              className="absolute top-3 left-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-full object-cover"
            />
            <div className="p-5">
              <span className="inline-block rounded bg-[#C8922A]/20 px-2 py-0.5 text-[11px] font-bold text-[#9A6E1B]">
                {lightboxPhoto.badge}
              </span>
              <h3 className="mt-1.5 text-lg font-extrabold text-[#0B162C]">
                {lightboxPhoto.title}
              </h3>
              <p className="mt-1 text-xs text-[#475569]">{lightboxPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
