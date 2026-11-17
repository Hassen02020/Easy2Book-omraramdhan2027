import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  Code2,
  Compass,
  Copy,
  Download,
  Eye,
  EyeOff,
  Film,
  Loader2,
  Pause,
  Phone,
  Plane,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';
import {
  DEFAULT_TUNISIAN_SCRIPT,
  getSocialCaptionBlocks,
  REEL_SCENES,
  TOTAL_REEL_DURATION_SEC,
  VOICE_OPTIONS,
} from '../../data/campaignData';
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
import { CountdownTimer } from '../CountdownTimer';
import { ReelPlayer } from '../ReelPlayer';
import { PdfBrochureControl } from '../shared-components/PdfBrochureControl';
import { TestimonialsSection } from '../TestimonialsSection';
import { WhatsAppIcon } from '../WhatsAppIcon';

interface RoomTier {
  id: 'quad_quint' | 'triple' | 'double';
  title: string;
  subtitle: string;
  priceDt: number;
  badge?: string;
}

const PILOT_ROOM_TIERS: RoomTier[] = [
  {
    id: 'quad_quint',
    title: 'غرفة رباعية أو خماسية',
    subtitle: '5,900 د.ت للشخص · مناسبة للعائلات والمجموعات',
    priceDt: 5900,
    badge: 'الأكثر طلباً',
  },
  {
    id: 'triple',
    title: 'غرفة ثلاثية',
    subtitle: '6,400 د.ت للشخص · راحة مثالية لثلاثة معتمرين',
    priceDt: 6400,
  },
  {
    id: 'double',
    title: 'غرفة ثنائية',
    subtitle: '6,900 د.ت للشخص · خصوصية تامة للأزواج',
    priceDt: 6900,
  },
];

const FAMILY_DISCOUNT_DT = 200;
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

interface OmraRamadanPilotPageProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  crmConfig: CrmIntegrationConfig;
  defaultVoiceId?: string;
}

/**
 * Page Pilote Complète : "Easy2Book — عمرة رمضان كامل"
 * Conservée intégralement dans le module Omra / Arborescence Groupe Ramadan 2027
 * avec toutes ses fonctions d'origine :
 * - Lecteur Vidéo 9:16 + Timeline Scrubber + 4 Scènes cliquables + Voix Tunisienne Gemini TTS
 * - Programme complet (Tunis-Jeddah-Tunis, Visa, Encadrement, Hôtel Maysan Al Multazim, Médine)
 * - Grille tarifaire interactive (5900 / 6400 / 6900 د.ت) + Remise Famille 200 د.ت + Alerte +10 pers.
 * - Compte à rebours 15 Décembre 2026 + Début Ramadan 1448 H
 * - Section Témoignages (شهادات العملاء السابقين)
 * - Envoi de la demande avec détail complet vers WhatsApp Business 98140514 + Contrat CRM simulé
 */
export function OmraRamadanPilotPage({
  page,
  snapshot,
  crmConfig,
  defaultVoiceId,
}: OmraRamadanPilotPageProps) {
  // Video & Gemini Tunisian Voiceover state
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(TOTAL_REEL_DURATION_SEC);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(
    defaultVoiceId || 'Charon'
  );

  useEffect(() => {
    if (defaultVoiceId) {
      setSelectedVoice(defaultVoiceId);
    }
  }, [defaultVoiceId]);
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

  // Interactive Pricing & Family Estimator + WhatsApp / CRM Form state
  const [selectedRoomId, setSelectedRoomId] =
    useState<RoomTier['id']>('quad_quint');
  const [pilgrimsCount, setPilgrimsCount] = useState<number>(2);
  const [isFamily, setIsFamily] = useState<boolean>(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
      REEL_SCENES.find((s) => scaled >= s.startSec && scaled < s.endSec) ??
      REEL_SCENES[0]
    );
  }, [currentTime, totalDuration]);

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
            script: DEFAULT_TUNISIAN_SCRIPT,
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
    setVideoExportStatus('جاري تحضير الفيديو 9:16...');

    if (videoExportResult?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoExportResult.blobUrl);
    }

    try {
      const result = await generateVideoDownloadLink({
        voiceName: selectedVoice,
        showCaptions,
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
      // Fallback: focus/select handled by readOnly input
    }
  };

  // Pricing Estimator logic
  const selectedRoom =
    PILOT_ROOM_TIERS.find((r) => r.id === selectedRoomId) ??
    PILOT_ROOM_TIERS[0];
  const isGroupInquiry = pilgrimsCount > 10;
  const familyDiscountApplied =
    !isGroupInquiry && isFamily && pilgrimsCount >= 2;
  const estimatedTotalDt = isGroupInquiry
    ? null
    : Math.max(
        0,
        pilgrimsCount * selectedRoom.priceDt -
          (familyDiscountApplied ? FAMILY_DISCOUNT_DT : 0)
      );

  const detailedWhatsAppHref = useMemo(() => {
    const lines = [
      'السلام عليكم فريق Easy2Book،',
      'أرغب في الاستفسار والحجز في عرض: عمرة شهر رمضان كامل (رمضان 2027)',
      `• نوع الغرفة: ${selectedRoom.title} (${selectedRoom.priceDt.toLocaleString('en-US')} د.ت/شخص)`,
      `• عدد المعتمرين: ${pilgrimsCount}`,
      isGroupInquiry
        ? '• ملاحظة: مجموعة تفوق 10 أشخاص (طلب تأكيد الإمكانية)'
        : `• تخفيض العائلات (200 د.ت): ${familyDiscountApplied ? 'نعم مطبق' : 'لا'}`,
      estimatedTotalDt !== null
        ? `• التكلفة التقديرية الإجمالية: ${estimatedTotalDt.toLocaleString('en-US')} د.ت`
        : '• التكلفة: حسب عرض المجموعة',
      fullName.trim() ? `• الاسم الكامل: ${fullName.trim()}` : '',
      phone.trim() ? `• رقم الهاتف: ${phone.trim()}` : '',
      email.trim() ? `• البريد الإلكتروني: ${email.trim()}` : '',
      notes.trim() ? `• ملاحظات: ${notes.trim()}` : '',
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  }, [
    email,
    estimatedTotalDt,
    familyDiscountApplied,
    fullName,
    isGroupInquiry,
    notes,
    phone,
    pilgrimsCount,
    selectedRoom.priceDt,
    selectedRoom.title,
  ]);

  const handleSubmitPilotInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

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
        travelersCount: pilgrimsCount,
        requestedDeparture: `رمضان 2027 · ${selectedRoom.title}`,
        message: [
          notes.trim(),
          familyDiscountApplied ? 'تخفيض عائلات 200 د.ت' : '',
          estimatedTotalDt !== null
            ? `التقدير: ${estimatedTotalDt} د.ت`
            : 'طلب مجموعة +10',
        ]
          .filter(Boolean)
          .join(' | '),
        consent: true,
      },
    });

    const result = await SimulatedCrmAdapter.submitLeadForm(payload, crmConfig);
    setDispatchResult(result);
  };

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
                عمرة شهر رمضان كامل · رمضان 2027
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#0B162C]/80">
            <a href="#pilot-video" className="hover:text-[#C8922A]">
              الفيديو الإعلاني
            </a>
            <a href="#pilot-program" className="hover:text-[#C8922A]">
              تفاصيل البرنامج
            </a>
            <a href="#pilot-pricing" className="hover:text-[#C8922A]">
              الأسعار والحجز
            </a>
            <a href="#testimonials" className="hover:text-[#C8922A]">
              شهادات العملاء
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
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
              href="#pilot-pricing"
              className="rounded-lg bg-[#0B162C] px-4 py-2 text-xs font-bold text-white hover:bg-[#1C4967] whitespace-nowrap shrink-0"
            >
              احجز مكانك الآن
            </a>
          </div>
        </div>
      </header>

      {/* HERO + 9:16 REEL VIDEO PLAYER + TUNISIAN VOICEOVER STUDIO */}
      <section
        id="pilot-video"
        className="border-b border-[#0B162C]/10 bg-gradient-to-b from-[#FAF9F6] to-white py-12 md:py-16"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#C8922A]/40 bg-[#C8922A]/10 px-3 py-1.5 text-xs font-bold text-[#9A6E1B]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>عمرة شهر رمضان كامل · طيران مباشر تونس – جدة – تونس</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#0B162C]">
              عمرة رمضان الكل في مكة المكرمة...{' '}
              <span className="text-[#C8922A]">بسفر أسهل وقلب مطمئن</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-[#475569]">
              برنامج متكامل من Easy2Book يشمل طيران تونس – جدة – تونس، التأشيرة،
              التأطير الديني والإداري خطوة بخطوة، إقامة مريحة في فندق ميسان
              الملتزم، ورحلة روحانية للمدينة المنورة بسوم استثنائي 5,900 د.ت
              للشخص.
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
                      ? 'جاري تجهيز الصوت التونسي...'
                      : isPlaying
                        ? 'إيقاف التشغيل مؤقتاً'
                        : 'تشغيل الفيديو بالصوت التونسي'}
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
                    نبرة المعلق ({VOICE_OPTIONS.length} أصوات متاحة):
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
                  {REEL_SCENES.map((sc) => {
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
                      {getSocialCaptionBlocks('omra').map((cap) => (
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
              onTogglePlay={() => void startOrToggleVoiceover()}
              onToggleMute={handleToggleMute}
              onSelectScene={handleSelectScene}
            />
          </div>
        </div>
      </section>

      {/* PROGRAM & SERVICES HIGHLIGHTS */}
      <section id="pilot-program" className="bg-white py-16 border-b border-[#0B162C]/10">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#C8922A]">
              برنامج عمرة رمضان كامل · مجموعة رمضان 2027
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0B162C]">
              كل تفاصيل السفر والإقامة منظمة قبل الانطلاق
            </h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#0B162C]/10 bg-[#FAF9F6] p-6">
              <Plane className="h-7 w-7 text-[#C8922A]" />
              <h3 className="mt-4 text-base font-bold">
                طيران تونس – جدة – تونس
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                رحلات منتظمة ومريحة مع استقبال ومرافقة من مطار تونس قرطاج حتى
                الوصول إلى مكة المكرمة.
              </p>
            </div>
            <div className="rounded-2xl border border-[#0B162C]/10 bg-[#FAF9F6] p-6">
              <ShieldCheck className="h-7 w-7 text-[#C8922A]" />
              <h3 className="mt-4 text-base font-bold">
                تأشيرة وتأطير ديني وإداري
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                إنجاز كامل إجراءات التأشيرة مع مرشدين مرافقين خطوة بخطوة في
                المناسك والزيارات.
              </p>
            </div>
            <div className="rounded-2xl border border-[#0B162C]/10 bg-[#FAF9F6] p-6">
              <Building2 className="h-7 w-7 text-[#C8922A]" />
              <h3 className="mt-4 text-base font-bold">
                فندق ميسان الملتزم بمكة
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                إقامة مريحة ومنظمة للعائلات والأفراد مع خدمات متواصلة طوال شهر
                رمضان المبارك.
              </p>
            </div>
            <div className="rounded-2xl border border-[#0B162C]/10 bg-[#FAF9F6] p-6">
              <Compass className="h-7 w-7 text-[#C8922A]" />
              <h3 className="mt-4 text-base font-bold">
                رحلة روحانية للمدينة المنورة
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                زيارة المسجد النبوي الشريف والروضة والمزارات التاريخية في أجواء
                هادئة ومؤطرة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRICING + COUNTDOWN + WHATSAPP BUSINESS / CRM FORM */}
      <section id="pilot-pricing" className="bg-[#0B162C] py-16 text-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12">
          {/* Left: Official Pricing Tiers & Countdown */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-bold text-[#F5D68A]">
                عدد غرف محدود جداً · عرض صالح لـ 15 ديسمبر 2026
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                الأسعار الرسمية لعمرة رمضان
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                تخفيض 200 د.ت للعائلات انطلاقاً من شخصين · مجموعات تفوق 10
                أشخاص الاتصال للحصول على الإمكانية.
              </p>
            </div>

            <div className="space-y-3">
              {PILOT_ROOM_TIERS.map((tier) => {
                const active = selectedRoomId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedRoomId(tier.id)}
                    className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-right transition-all ${
                      active
                        ? 'border-[#C8922A] bg-white/12'
                        : 'border-white/15 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-white">
                          {tier.title}
                        </p>
                        {tier.badge && (
                          <span className="rounded bg-[#C8922A] px-2 py-0.5 text-[10px] font-bold text-[#0B162C]">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-300">
                        {tier.subtitle}
                      </p>
                    </div>
                    <p className="font-mono-tabular text-2xl font-extrabold text-[#F5D68A] shrink-0">
                      {tier.priceDt.toLocaleString('en-US')} د.ت
                    </p>
                  </button>
                );
              })}
            </div>

            <CountdownTimer
              deadlineIso="2026-12-15T23:59:59"
              deadlineLabel="15 ديسمبر 2026"
              language="ar"
              showRamadanLine
            />
          </div>

          {/* Right: Interactive Estimator & Booking Actions */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white p-6 md:p-8 text-[#0B162C] shadow-xl">
              <div className="border-b border-[#0B162C]/10 pb-4">
                <p className="text-xs font-bold text-[#C8922A]">
                  احسب تكلفتك التقديرية وأرسل طلبك
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  نموذج الحجز والاستفسار المباشر
                </h3>
              </div>

              {dispatchResult ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold">
                          تم تجهيز طلب الاهتمام بالحجز عبر عقد التكامل مع CRM
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
                  {/* Pilgrims count & Family discount */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#0B162C] mb-1.5">
                        عدد المعتمرين
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={pilgrimsCount}
                          onChange={(e) =>
                            setPilgrimsCount(
                              Math.max(1, Number(e.target.value) || 1)
                            )
                          }
                          className="w-24 rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2 font-mono-tabular text-sm font-bold"
                        />
                        <span className="text-xs text-[#475569]">
                          ({selectedRoom.title})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <label className="flex w-full items-center gap-2.5 rounded-xl border border-[#C8922A]/40 bg-[#C8922A]/10 px-3.5 py-2.5 text-xs font-bold text-[#0B162C] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFamily}
                          disabled={pilgrimsCount < 2 || isGroupInquiry}
                          onChange={(e) => setIsFamily(e.target.checked)}
                          className="h-4 w-4 accent-[#C8922A]"
                        />
                        <span>
                          تخفيض العائلات (-200 د.ت انطلاقاً من شخصين)
                        </span>
                      </label>
                    </div>
                  </div>

                  {isGroupInquiry && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-950">
                      <Users className="h-4 w-4 shrink-0 text-amber-700" />
                      <span>
                        مجموعات تفوق 10 أشخاص: يرجى الاتصال على 98 140 514 أو
                        مراسلتنا لتأكيد الإمكانية والأسعار الخاصة.
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
                      ملاحظات إضافية (اختياري)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مرافقة كبار السن أو طلب غرف متجاورة"
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

                  {/* Summary Bar + Dual Actions (CRM Contract Submit & WhatsApp Business with full details) */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0B162C]/10 pt-4">
                    <div>
                      <p className="text-xs text-[#475569]">
                        التكلفة التقديرية الإجمالية
                      </p>
                      <p className="font-mono-tabular text-2xl font-extrabold text-[#0B162C]">
                        {estimatedTotalDt !== null
                          ? `${estimatedTotalDt.toLocaleString('en-US')} د.ت`
                          : 'عرض خاص للمجموعات'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="submit"
                        className="rounded-xl bg-[#0B162C] px-5 py-3 text-sm font-bold text-white hover:bg-[#1C4967]"
                      >
                        إرسال طلب الاهتمام بالحجز
                      </button>
                      <a
                        href={detailedWhatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:bg-[#1FB857]"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>أرسل التفاصيل عبر واتساب</span>
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* BRAND FOOTER */}
      <footer className="bg-[#0B162C] py-10 text-white">
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
                صفحة العرض الرائدة · وحدة العمرة · مجموعة رمضان 2027
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-[#F5D68A]" dir="ltr">
              <Phone className="h-3.5 w-3.5" />
              98 140 514
            </span>
            <span>·</span>
            <span dir="ltr">www.easy2book.tn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
