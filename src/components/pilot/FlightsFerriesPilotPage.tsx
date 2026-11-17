import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Anchor,
  ArrowDown,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Code2,
  Copy,
  Download,
  Eye,
  EyeOff,
  Film,
  Globe,
  Loader2,
  Pause,
  Phone,
  Plane,
  Play,
  RotateCcw,
  ShieldCheck,
  Ship,
  Smartphone,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import {
  FLIGHTS_FERRIES_ARABIC_SCRIPT,
  FLIGHTS_FERRIES_SCRIPT,
  FLIGHTS_FERRIES_SHOOTING_TIPS,
  getReelConfig,
  getSocialCaptionBlocks,
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
import { WhatsAppIcon } from '../WhatsAppIcon';

type TransportMode = 'flight' | 'ferry' | 'combo';
type VoiceScriptLang = 'fr' | 'ar';

interface RouteOption {
  id: string;
  mode: 'flight' | 'ferry';
  corridorFr: string;
  corridorAr: string;
  companiesFr: string;
  companiesAr: string;
  highlightsFr: string[];
  highlightsAr: string[];
  imageSrc: string;
}

const ROUTE_CATALOG: RouteOption[] = [
  {
    id: 'air-paris-france',
    mode: 'flight',
    corridorFr: 'Tunis / Monastir / Djerba ↔ Paris, Marseille, Lyon, Nice',
    corridorAr: 'تونس / المنستير / جربة ↔ باريس، مرسيليا، ليون، نيس',
    companiesFr: 'Tunisair · Nouvelair · Air France · Transavia',
    companiesAr: 'الخطوط التونسية · الطيران الجديد · Air France · Transavia',
    highlightsFr: ['Vols directs & express quotidiens', 'Option avec ou sans bagage soute', 'E-billet immédiat sur mobile'],
    highlightsAr: ['رحلات مباشرة وسريعة يومياً', 'اختيار مع أو بدون أمتعة شحن', 'تذكرة إلكترونية فورية على الهاتف'],
    imageSrc: HERO_MEDIA_MAP.tunis_jeddah_flight.src,
  },
  {
    id: 'air-europe-med',
    mode: 'flight',
    corridorFr: 'Tunis ↔ Rome, Milan, Istanbul, Dubaï & Le Caire',
    corridorAr: 'تونس ↔ روما، ميلانو، إسطنبول، دبي والقاهرة',
    companiesFr: 'ITA Airways · Turkish Airlines · Emirates · EgyptAir',
    companiesAr: 'ITA Airways · Turkish Airlines · طيران الإمارات · مصر للطيران',
    highlightsFr: ['Comparatif multi-compagnies en 1 écran', '0 frais cachés avant confirmation', 'Service WhatsApp 7j/7'],
    highlightsAr: ['مقارنة كل الشركات في شاشة واحدة', 'دون مصاريف خفية عند التأكيد', 'مرافقة عبر واتساب 7/7'],
    imageSrc: HERO_MEDIA_MAP.airline_business_cabin.src,
  },
  {
    id: 'sea-france-tunisia',
    mode: 'ferry',
    corridorFr: 'La Goulette / Zarzis ↔ Marseille (Traversée d’été & annuelle)',
    corridorAr: 'حلق الوادي / جرجيس ↔ مرسيليا (عبّارات الصيف والسنوية)',
    companiesFr: 'CTN (Carthage / Tanit) · Corsica Linea',
    companiesAr: 'الشركة التونسية للملاحة CTN · Corsica Linea',
    highlightsFr: ['Passagers, voitures, vans & camping-cars', 'Cabines intérieures, hublot ou fauteuils', 'Billetterie maritime officielle'],
    highlightsAr: ['مسافرون، سيارات وعربات عائلية', 'غرف داخلية، بنافذة أو مقاعد مريحة', 'تذاكر بحرية رسمية ومعتمدة'],
    imageSrc: HERO_MEDIA_MAP.flights_mediterranean_ship.src,
  },
  {
    id: 'sea-italy-islands',
    mode: 'ferry',
    corridorFr: 'La Goulette ↔ Gênes, Civitavecchia (Rome), Palerme, Salerne & Îles',
    corridorAr: 'حلق الوادي ↔ جنوة، روما (تشيفيتافيكيا)، باليرمو، ساليرنو والجزر',
    companiesFr: 'CTN · GNV (Grandi Navi Veloci) · Grimaldi Lines',
    companiesAr: 'CTN · GNV · Grimaldi Lines',
    highlightsFr: ['Traversées Méditerranée Italie & Îles', 'Restauration & cabines familiales', 'Embarquement QR / e-billet sur téléphone'],
    highlightsAr: ['رحلات بحرية نحو إيطاليا وجزر المتوسط', 'غرف عائلية وخدمات على متن الباخرة', 'تذكرة عبور رقمية على الهاتف'],
    imageSrc: HERO_MEDIA_MAP.flights_relaxed_suitcase.src,
  },
];

interface ScenarioRow {
  id: string;
  timeRange: string;
  jumpSec: number;
  visualFr: string;
  audioFr: string;
  onScreenFr: string;
  visualAr: string;
  audioAr: string;
  onScreenAr: string;
}

const SCENARIO_ROWS: ScenarioRow[] = [
  {
    id: 'scene-1',
    timeRange: '0:00 – 0:03',
    jumpSec: 0,
    visualFr:
      'Plan serré face caméra. La personne a l’air exaspérée devant son ordinateur/téléphone avec plein d’onglets ouverts.',
    audioFr:
      '(Ton dynamique) « 15 onglets ouverts juste pour réserver un billet d’avion ou de bateau ? Arrête tout de suite. »',
    onScreenFr: 'STOP aux 15 onglets ouverts ! 🛑',
    visualAr: 'لقطة قريبة أمام الكاميرا: مسافر متذمر أمام الحاسوب والهاتف مع 15 نافذة مقارنة مفتوحة.',
    audioAr: '« خمسطاش نافذة محلولة بش تحجز تذكرة طيارة ولا باخرة؟ وقّف هذا الكل توا! »',
    onScreenAr: 'أوقف فوضى الـ 15 نافذة! 🛑',
  },
  {
    id: 'scene-2',
    timeRange: '0:03 – 0:08',
    jumpSec: 3,
    visualFr:
      'Transition rapide (clap de main). On passe d’un décor stressant à un décor détendu (valise prête, lunettes de soleil).',
    audioFr:
      '« Que tu partes par les airs ou par la mer, il y a beaucoup plus simple. »',
    onScreenFr: 'Avion ✈️ ou Bateau ⛴️ ?',
    visualAr: 'انتقال سريع (تصفيقة يد): التحول من التوتر إلى أجواء السفر المريحة مع الحقيبة ونظارات الشمس.',
    audioAr: '« سواء مسافر في الجو ولا في البحر، الحل أسهل برشة مع Easy2Book. »',
    onScreenAr: 'طائرة ✈️ أم باخرة ⛴️ ؟',
  },
  {
    id: 'scene-3',
    timeRange: '0:08 – 0:18',
    jumpSec: 8,
    visualFr:
      'Capture d’écran fluide du site/app Easy2Book : sélectionner "Avion" puis "Bateau", choisir la destination (ex. traversées Méditerranée Tunisie–France/Italie, îles, vols express à 0:12) et valider en 3 clics.',
    audioFr:
      '« Sur Easy2Book, toutes les compagnies aériennes et maritimes sont au même endroit. Que ce soit pour un vol express ou ta traversée d’été, tu compares, tu choisis ton tarif, et c’est réservé en quelques secondes. »',
    onScreenFr: 'Tout au même endroit. Zéro prise de tête.',
    visualAr:
      'عرض سلس لمنصة Easy2Book: اختيار "طيران" ثم "باخرة" (رحلات تونس–فرنسا/إيطاليا والجزر في 0:12) والتأكيد في 3 خطوات.',
    audioAr:
      '« على Easy2Book، كل شركات الطيران والبواخر في بلاصة وحدة: تقارن الأسعار، تختار رحلتك وتحجز في ثواني! »',
    onScreenAr: 'كل شيء في مكان واحد. بدون تعقيد.',
  },
  {
    id: 'scene-4',
    timeRange: '0:18 – 0:25',
    jumpSec: 18,
    visualFr:
      'Retour face caméra, sourire confiant. La personne montre son e-billet sur son téléphone.',
    audioFr:
      '« Pas de frais surprises à la fin, ton billet est directement dans ton téléphone. Easy2Book, the easiest way to travel. »',
    onScreenFr: 'Ton billet en 3 clics 📲',
    visualAr: 'عودة للكاميرا بابتسامة واثقة مع عرض التذكرة الإلكترونية QR مباشرة على شاشة الهاتف.',
    audioAr: '« لا مصاريف مفاجئة في الأخير، تذكرتك توصلك مباشرة على هاتفك مع Easy2Book. »',
    onScreenAr: 'تذكرتك في 3 نقرات 📲',
  },
  {
    id: 'scene-5',
    timeRange: '0:25 – 0:30',
    jumpSec: 25,
    visualFr: 'Logo Easy2Book animé + flèche pointant vers le lien.',
    audioFr:
      '« Prépare tes valises, clique sur le lien et réserve ton prochain départ maintenant. »',
    onScreenFr: 'Réserve sur Easy2Book 👇',
    visualAr: 'شعار Easy2Book متحرك + سهم يشير مباشرة إلى رابط الحجز الفوري.',
    audioAr: '« حضّر حقيبتك، اضغط على الرابط واحجز سفرتك القادمة الآن! »',
    onScreenAr: 'احجز الآن على Easy2Book 👇',
  },
];

const GALLERY_PHOTOS = [
  {
    id: 'ff-gal-1',
    src: HERO_MEDIA_MAP.flights_tabs_stress.src,
    badgeFr: '0:00 – 0:03 · Le Problème',
    badgeAr: '0:00 – 0:03 · المشكلة',
    titleFr: 'Finis les 15 onglets ouverts pour comparer',
    titleAr: 'وداعاً لـ 15 نافذة مقارنة مفتوحة',
    captionFr: 'Centralisez toutes vos recherches vols et traversées maritimes sur une seule interface.',
    captionAr: 'كل رحلات الطيران والبواخر مجتمعة في منصة واحدة واضحة.',
  },
  {
    id: 'ff-gal-2',
    src: HERO_MEDIA_MAP.flights_relaxed_suitcase.src,
    badgeFr: '0:03 – 0:08 · Le Déclic',
    badgeAr: '0:03 – 0:08 · الانتقال',
    titleFr: 'Avion ✈️ ou Bateau ⛴️ : le départ en toute sérénité',
    titleAr: 'طائرة ✈️ أو باخرة ⛴️ : سفر مريح بدون توتر',
    captionFr: 'Transition clap de main : passez du casse-tête aux préparatifs de voyage sereins.',
    captionAr: 'انتقال سريع من فوضى البحث إلى متعة التحضير للسفر.',
  },
  {
    id: 'ff-gal-3',
    src: HERO_MEDIA_MAP.flights_mediterranean_ship.src,
    badgeFr: '0:08 – 0:18 · Méditerranée & Îles',
    badgeAr: '0:08 – 0:18 · المتوسط والجزر',
    titleFr: 'Traversées Tunisie–France, Tunisie–Italie & Vols Express',
    titleAr: 'عبّارات تونس–فرنسا/إيطاليا ورحلات الطيران السريعة',
    captionFr: 'Mention locale à 0:12 : cabines, véhicules et billets d’avion comparés en quelques secondes.',
    captionAr: 'حجز الغرف والسيارات على البواخر وتذاكر الطيران في ثوانٍ.',
  },
  {
    id: 'ff-gal-4',
    src: HERO_MEDIA_MAP.flights_mobile_eticket.src,
    badgeFr: '0:18 – 0:25 · Preuve Mobile',
    badgeAr: '0:18 – 0:25 · التذكرة الهاتفية',
    titleFr: 'E-billet directement sur votre téléphone · 0 frais surprises',
    titleAr: 'تذكرتك الإلكترونية مباشرة في هاتفك بدون مصاريف خفية',
    captionFr: 'Reçu instantané sur smartphone et assistance directe Easy2Book 98 140 514.',
    captionAr: 'استلام فوري للتذكرة على الهاتف مع دعم مباشر على 98 140 514.',
  },
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    qFr: 'Quelles compagnies aériennes et maritimes puis-je réserver sur Easy2Book ?',
    aFr: 'Toutes les principales compagnies aériennes (Tunisair, Nouvelair, Air France, Transavia, Turkish Airlines, ITA Airways, Emirates, EgyptAir, Saudia) ainsi que les compagnies maritimes Méditerranée (CTN, Corsica Linea, GNV, Grimaldi Lines) sont comparées au même endroit.',
    qAr: 'ما هي شركات الطيران والبواخر المتوفرة على Easy2Book؟',
    aAr: 'نوفر مقارنة وحجزاً لكل شركات الطيران الكبرى (الخطوط التونسية، الطيران الجديد، Air France، Transavia، التركية...) وكذلك البواخر المتوسطية (CTN، Corsica Linea، GNV، Grimaldi Lines).',
  },
  {
    id: 'faq-2',
    qFr: 'Y a-t-il des frais surprises à la fin de la réservation ?',
    aFr: 'Non. Le montant communiqué par votre conseiller ou affiché dans votre récapitulatif est transparent avant validation, sans frais cachés de dernière minute.',
    qAr: 'هل توجد مصاريف خفية في نهاية الحجز؟',
    aAr: 'لا، السعر المعتمد يظهر بوضوح تام قبل التأكيد النهائي دون أي زيادات مفاجئة.',
  },
  {
    id: 'faq-3',
    qFr: 'Comment puis-je recevoir mon e-billet et embarquer ?',
    aFr: 'Dès l’émission, votre e-billet avion ou titre d’embarquement bateau est envoyé directement sur votre téléphone (WhatsApp & e-mail) prêt pour l’enregistrement.',
    qAr: 'كيف أستلم تذكرتي الإلكترونية؟',
    aAr: 'بمجرد إصدار التذكرة، تصلك فوراً بصيغة رقمية على هاتفك عبر واتساب والبريد الإلكتروني جاهزة للسفر والعبور.',
  },
  {
    id: 'faq-4',
    qFr: 'Puis-je réserver une traversée en bateau avec véhicule et cabine familiale ?',
    aFr: 'Oui : précisez le gabarit de votre voiture, van ou camping-car ainsi que le type d’installation souhaité (cabine privée intérieure, cabine hublot ou fauteuil) dans le configurateur 3 clics.',
    qAr: 'هل يمكن حجز تذكرة باخرة مع سيارة وغرفة عائلية؟',
    aAr: 'نعم بالتأكيد: حدّد نوع السيارة وموديل الغرفة المطلوبة (غرفة خاصة، بنافذة أو مقعد) في أداة الحجز السريع وسيتم تأكيدها مباشرة.',
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

interface FlightsFerriesPilotPageProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  crmConfig: CrmIntegrationConfig;
  defaultVoiceId?: string;
}

export function FlightsFerriesPilotPage({
  page,
  snapshot,
  crmConfig,
  defaultVoiceId,
}: FlightsFerriesPilotPageProps) {
  const [lang, setLang] = useState<'fr' | 'ar'>(
    snapshot.language === 'ar' ? 'ar' : 'fr'
  );
  const isAr = lang === 'ar';

  const reelConfig = useMemo(() => getReelConfig('flights_ferries'), []);
  const socialCaptions = useMemo(() => getSocialCaptionBlocks('flights_ferries'), []);
  const baseDuration = reelConfig.totalDurationSec;

  const initialVoice =
    defaultVoiceId && defaultVoiceId !== 'Charon'
      ? defaultVoiceId
      : reelConfig.defaultVoiceId;

  const [voiceScriptLang, setVoiceScriptLang] = useState<VoiceScriptLang>(
    snapshot.language === 'ar' ? 'ar' : 'fr'
  );
  const activeVoiceScript =
    voiceScriptLang === 'ar' ? FLIGHTS_FERRIES_ARABIC_SCRIPT : FLIGHTS_FERRIES_SCRIPT;

  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(baseDuration);
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

  // 3-Click Configurator State
  const [transportMode, setTransportMode] = useState<TransportMode>('flight');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    ROUTE_CATALOG[0].id
  );
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [passengersCount, setPassengersCount] = useState<number>(2);
  const [withVehicle, setWithVehicle] = useState<boolean>(true);
  const [cabinOption, setCabinOption] = useState<'cabin' | 'seat'>('cabin');
  const [checkedBaggage, setCheckedBaggage] = useState<boolean>(true);

  const filteredRoutes = useMemo(() => {
    if (transportMode === 'combo') return ROUTE_CATALOG;
    return ROUTE_CATALOG.filter((r) => r.mode === transportMode);
  }, [transportMode]);

  const activeRoute =
    ROUTE_CATALOG.find((r) => r.id === selectedRouteId) ??
    filteredRoutes[0] ??
    ROUTE_CATALOG[0];

  const [lightboxPhoto, setLightboxPhoto] = useState<
    (typeof GALLERY_PHOTOS)[number] | null
  >(null);
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  // Form / CRM State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelDates, setTravelDates] = useState('');
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
      if (audioRef.current) {
        audioRef.current.pause();
      }
      map.forEach((url) => URL.revokeObjectURL(url));
      map.clear();
    };
  }, []);

  const scaledTime =
    totalDuration > 0 ? (currentTime / totalDuration) * baseDuration : 0;

  const activeScene = useMemo(() => {
    return (
      reelConfig.scenes.find(
        (s) => scaledTime >= s.startSec && scaledTime < s.endSec
      ) ?? reelConfig.scenes[0]
    );
  }, [reelConfig.scenes, scaledTime]);

  const startOrToggleVoiceover = async (
    forceVoice?: string,
    forceScriptLang?: VoiceScriptLang
  ) => {
    const voice = forceVoice || selectedVoice;
    const sLang = forceScriptLang || voiceScriptLang;
    const scriptText =
      sLang === 'ar' ? FLIGHTS_FERRIES_ARABIC_SCRIPT : FLIGHTS_FERRIES_SCRIPT;

    setAudioError(null);

    if (isPlaying && !forceVoice && !forceScriptLang) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    setIsPlaying(true);

    const cacheKey = `${voice}:${sLang}`;
    let url = audioUrlMapRef.current.get(cacheKey);
    if (!url) {
      setAudioLoading(true);
      const voiceMeta = VOICE_OPTIONS.find((v) => v.id === voice);
      try {
        const res = await fetch('/api/voiceover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: scriptText,
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
              (isAr
                ? 'تعذّر توليد التعليق الصوتي، العرض المرئي يواصل التشغيل.'
                : 'Synthèse vocale temporairement indisponible — l’aperçu visuel continue.')
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
              ? 'تعذّر توليد الصوت.'
              : 'Lecture visuelle active sans piste vocale.'
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
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
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

  const handleSelectSceneTime = (sceneStartSec: number) => {
    const ratio = baseDuration > 0 ? sceneStartSec / baseDuration : 0;
    const jump = ratio * totalDuration;
    setCurrentTime(jump);
    if (audioRef.current) audioRef.current.currentTime = jump;
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  const handleExportMp4 = async () => {
    if (videoExporting) return;
    setVideoExportError(null);
    setVideoLinkCopied(false);
    setVideoExporting(true);
    setVideoExportPct(8);
    setVideoExportStatus(
      isAr
        ? 'جاري تجهيز المونتاج العمودي 9:16...'
        : 'Préparation du montage promo 9:16 (30s)...'
    );

    if (videoExportResult?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoExportResult.blobUrl);
    }

    try {
      const result = await generateVideoDownloadLink({
        preset: 'flights_ferries',
        voiceName: selectedVoice,
        showCaptions,
        customScript: activeVoiceScript,
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
            ? 'تعذّر إنشاء ملف الفيديو MP4.'
            : 'Impossible de générer la vidéo MP4.'
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
      // Clipboard blocked
    }
  };

  const selectedModeLabelFr =
    transportMode === 'flight'
      ? 'Billet d’Avion ✈️'
      : transportMode === 'ferry'
        ? 'Billet de Bateau ⛴️'
        : 'Combiné Vol + Bateau ✈️⛴️';

  const selectedModeLabelAr =
    transportMode === 'flight'
      ? 'تذكرة طيران ✈️'
      : transportMode === 'ferry'
        ? 'تذكرة باخرة ⛴️'
        : 'طيران + باخرة ✈️⛴️';

  const summaryOptionsFr = [
    tripType === 'roundtrip' ? 'Aller-Retour' : 'Aller Simple',
    `${passengersCount} passager(s)`,
    transportMode !== 'ferry'
      ? checkedBaggage
        ? 'Avec bagage soute'
        : 'Bagage cabine'
      : null,
    transportMode !== 'flight'
      ? `${withVehicle ? 'Avec véhicule' : 'Piéton'} · ${
          cabinOption === 'cabin' ? 'Cabine privée' : 'Fauteuil / Pont'
        }`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const summaryOptionsAr = [
    tripType === 'roundtrip' ? 'ذهاب وإياب' : 'ذهاب فقط',
    `${passengersCount} مسافرين`,
    transportMode !== 'ferry'
      ? checkedBaggage
        ? 'مع أمتعة شحن'
        : 'حقيبة يد فقط'
      : null,
    transportMode !== 'flight'
      ? `${withVehicle ? 'مع سيارة' : 'بدون سيارة'} · ${
          cabinOption === 'cabin' ? 'غرفة خاصة' : 'مقعد / قاعة'
        }`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const quickWhatsAppHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour Easy2Book ! Je souhaite comparer et réserver : ${selectedModeLabelFr} (${activeRoute.corridorFr} · ${summaryOptionsFr}).`
  )}`;

  const detailedWhatsAppHref = useMemo(() => {
    const lines = [
      'Bonjour Easy2Book, demande Billet Avion & Bateau (Réservation 3 Clics) :',
      `- Mode : ${selectedModeLabelFr}`,
      `- Trajet : ${activeRoute.corridorFr}`,
      `- Compagnies : ${activeRoute.companiesFr}`,
      `- Configuration : ${summaryOptionsFr}`,
      travelDates.trim() ? `- Dates souhaitées : ${travelDates.trim()}` : null,
      fullName.trim() ? `- Nom : ${fullName.trim()}` : null,
      phone.trim() ? `- Téléphone : ${phone.trim()}` : null,
      email.trim() ? `- Email : ${email.trim()}` : null,
      notes.trim() ? `- Remarques : ${notes.trim()}` : null,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [
    activeRoute.companiesFr,
    activeRoute.corridorFr,
    email,
    fullName,
    notes,
    phone,
    selectedModeLabelFr,
    summaryOptionsFr,
    travelDates,
  ]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError(
        isAr
          ? 'يرجى إدخال الاسم الكامل، رقم الهاتف والبريد الإلكتروني.'
          : 'Veuillez renseigner votre nom complet, téléphone et e-mail.'
      );
      return;
    }

    const payload = buildCrmSubmissionPayload({
      page,
      snapshot,
      crmConfig,
      fields: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        selectedOffer: `${selectedModeLabelFr} · ${activeRoute.corridorFr} (${summaryOptionsFr})`,
        passengersCount: String(passengersCount),
        travelDates: travelDates.trim(),
        message: notes.trim(),
      },
    });
    const res = await SimulatedCrmAdapter.submitLead(payload, crmConfig);
    setDispatchResult(res);
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      data-brochure-root="true"
      className="min-h-screen bg-[#FAF9F6] text-[#0B162C]"
    >
      {/* STICKY EDITORIAL HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#0B162C]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/assets/aistudio/logo_transparent_e9918557.png"
              alt="Easy2Book"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div className="hidden sm:block min-w-0">
              <p className="text-xs font-extrabold text-[#0B162C] truncate">
                {isAr
                  ? 'Easy2Book · تذاكر الطيران والبواخر'
                  : 'Easy2Book · Billetterie Avion & Bateau'}
              </p>
              <p className="text-[11px] font-medium text-[#475569] truncate">
                {isAr
                  ? 'تونس ↔ فرنسا · إيطاليا · أوروبا · المتوسط في 3 نقرات'
                  : 'Toutes les compagnies au même endroit · E-billet en 3 clics'}
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-[#102D45]">
            <a
              href="#flights-pilot-video"
              className="whitespace-nowrap shrink-0 hover:text-[#C8922A] transition-colors"
            >
              {isAr ? 'الفيديو الترويجي' : 'Vidéo Promo 30s'}
            </a>
            <a
              href="#flights-pilot-scenario"
              className="whitespace-nowrap shrink-0 hover:text-[#C8922A] transition-colors"
            >
              {isAr ? 'السيناريو والنصائح' : 'Scénario & Conseils'}
            </a>
            <a
              href="#flights-pilot-3clicks"
              className="whitespace-nowrap shrink-0 hover:text-[#C8922A] transition-colors"
            >
              {isAr ? 'الحجز في 3 نقرات' : 'Avion & Bateau (3 Clics)'}
            </a>
            <a
              href="#flights-pilot-gallery"
              className="whitespace-nowrap shrink-0 hover:text-[#C8922A] transition-colors"
            >
              {isAr ? 'معرض المشاهد' : 'Visuels'}
            </a>
            <a
              href="#flights-pilot-booking"
              className="whitespace-nowrap shrink-0 hover:text-[#C8922A] transition-colors"
            >
              {isAr ? 'اطلب تذكرتك' : 'Réserver'}
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-pdf-exclude="true"
              onClick={() => setLang((prev) => (prev === 'fr' ? 'ar' : 'fr'))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B162C]/15 bg-white px-2.5 py-2 text-xs font-bold text-[#102D45] hover:border-[#C8922A] whitespace-nowrap shrink-0"
              title="Changer la langue / تغيير اللغة"
            >
              <Globe className="h-3.5 w-3.5 text-[#C8922A]" />
              <span>{isAr ? 'FR' : 'عربي'}</span>
            </button>

            <PdfBrochureControl
              variant="pilot_header"
              locale={lang}
              pageTitle={
                isAr
                  ? 'Easy2Book — تذاكر الطيران والبواخر (3 نقرات)'
                  : 'Easy2Book — Billet d’Avion & Bateau (3 Clics)'
              }
              slug="billetterie-avion-bateau-easy2book"
              revisionKey={`${transportMode}-${selectedRouteId}-${lang}`}
            />

            <a
              href={quickWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1FB857] whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              <span dir="ltr">98 140 514</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO + 9:16 REEL VIDEO STUDIO SECTION */}
      <section
        id="flights-pilot-video"
        className="mx-auto max-w-[1200px] px-5 pt-10 pb-14 lg:py-16"
      >
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Copy & Video Production Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#C8922A]/35 bg-[#FBF9F4] px-3.5 py-1.5 text-xs font-extrabold text-[#9A6E1B]">
              <Clapperboard className="h-3.5 w-3.5 text-[#C8922A]" />
              <span>
                {isAr
                  ? 'قسم تذاكر الطيران والبواخر · فيديو إعلاني 30 ثانية 9:16'
                  : 'Rubrique Billet d’Avion & Bateau · Vidéo Promo 30s (9:16)'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.16] tracking-tight text-[#0B162C]">
              {isAr ? (
                <>
                  أوقف فوضى الـ 15 نافذة مفتوحة!{' '}
                  <span className="text-[#C8922A]">تذكرتك جوّاً أو بحراً</span>{' '}
                  في 3 نقرات فقط
                </>
              ) : (
                <>
                  STOP aux 15 onglets ouverts !{' '}
                  <span className="text-[#C8922A]">Avion ✈️ ou Bateau ⛴️</span>,
                  réserve en 3 clics
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[#475569] max-w-2xl">
              {isAr
                ? 'على Easy2Book، كل شركات الطيران والبواخر المتوسطية (تونس–فرنسا، تونس–إيطاليا، الجزر والرحلات السريعة) مجتمعة في مكان واحد. قارن، اختر سعرك، واستلم تذكرتك الإلكترونية مباشرة على هاتفك دون أي مصاريف مفاجئة.'
                : 'Sur Easy2Book, toutes les compagnies aériennes et maritimes (vols express, traversées Méditerranée Tunisie–France/Italie & îles) sont réunies au même endroit. Compare, choisis ton tarif sans frais surprises et reçois ton e-billet directement sur ton téléphone.'}
            </p>

            {/* Primary Value Props Grid (Zero-Pill Clean Cards) */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#0B162C]/10 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#102D45]">
                  <Plane className="h-4 w-4 text-[#C8922A]" />
                  <span>{isAr ? 'طيران وبواخر معاً' : 'Avion + Bateau'}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#475569]">
                  {isAr
                    ? 'كل الشركات الجوية والبحرية في نفس الواجهة'
                    : 'Toutes les compagnies au même endroit'}
                </p>
              </div>
              <div className="rounded-xl border border-[#0B162C]/10 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#102D45]">
                  <Smartphone className="h-4 w-4 text-[#C8922A]" />
                  <span>{isAr ? 'في 3 نقرات فقط' : 'Billet en 3 clics'}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#475569]">
                  {isAr
                    ? 'تذكرتك الإلكترونية مباشرة على هاتفك'
                    : 'E-billet direct dans ton téléphone'}
                </p>
              </div>
              <div className="rounded-xl border border-[#0B162C]/10 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#102D45]">
                  <ShieldCheck className="h-4 w-4 text-[#C8922A]" />
                  <span>{isAr ? '0 مصاريف خفية' : '0 Frais Surprises'}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#475569]">
                  {isAr
                    ? 'سعر شفاف ومقارنة واضحة قبل الدفع'
                    : 'Tarif comparé clair & support 98 140 514'}
                </p>
              </div>
            </div>

            {/* Video Player & Voiceover Production Box */}
            <div className="rounded-2xl border border-[#0B162C]/12 bg-white p-5 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#102D45]">
                  <Film className="h-4 w-4 text-[#C8922A]" />
                  <span>
                    {isAr
                      ? 'مشغّل الفيديو الإعلاني 9:16 (30 ثانية · 5 مشاهد)'
                      : 'Lecteur Vidéo Promotionnelle 9:16 (30s · 5 Scènes)'}
                  </span>
                </div>

                {/* Voice Script Language Selector */}
                <div className="flex items-center gap-1 rounded-lg border border-[#0B162C]/12 bg-[#FAF9F6] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceScriptLang('fr');
                      if (isPlaying) void startOrToggleVoiceover(selectedVoice, 'fr');
                    }}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      voiceScriptLang === 'fr'
                        ? 'bg-[#102D45] text-white'
                        : 'text-[#475569] hover:text-[#0B162C]'
                    }`}
                  >
                    Voix FR (Scénario)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceScriptLang('ar');
                      if (isPlaying) void startOrToggleVoiceover(selectedVoice, 'ar');
                    }}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      voiceScriptLang === 'ar'
                        ? 'bg-[#102D45] text-white'
                        : 'text-[#475569] hover:text-[#0B162C]'
                    }`}
                  >
                    تعليق تونسي AR
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void startOrToggleVoiceover()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8922A] px-4 py-3 text-xs font-extrabold text-[#0B162C] hover:bg-[#E7B34C] transition-colors"
                >
                  {audioLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>
                    {audioLoading
                      ? isAr
                        ? 'جاري توليد الصوت...'
                        : 'Synthèse vocale...'
                      : isPlaying
                        ? isAr
                          ? 'إيقاف مؤقت'
                          : 'Mettre en pause'
                        : isAr
                          ? 'تشغيل الفيديو بالصوت'
                          : 'Lire Vidéo + Voix-Off'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCaptions((c) => !c)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-3 text-xs font-bold text-[#0B162C] hover:bg-white"
                >
                  {showCaptions ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {showCaptions
                      ? isAr
                        ? 'إخفاء النصوص'
                        : 'Masquer textes'
                      : isAr
                        ? 'إظهار النصوص'
                        : 'Textes écran'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTime(0);
                    if (audioRef.current) audioRef.current.currentTime = 0;
                  }}
                  className="rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] p-3 text-[#0B162C] hover:bg-white"
                  title={isAr ? 'البدء من 00:00' : 'Redémarrer à 00:00'}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={videoExporting}
                  onClick={() => void handleExportMp4()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B162C] px-4 py-3 text-xs font-extrabold text-white hover:bg-[#1C4967] disabled:opacity-60"
                >
                  {videoExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#E7B34C]" />
                  ) : (
                    <Download className="h-4 w-4 text-[#E7B34C]" />
                  )}
                  <span>
                    {videoExporting
                      ? `MP4 (${videoExportPct}%)`
                      : isAr
                        ? 'تحميل فيديو MP4 9:16'
                        : 'Télécharger MP4 9:16'}
                  </span>
                </button>

                <PdfBrochureControl
                  variant="pilot_inline"
                  locale={lang}
                  pageTitle={
                    isAr
                      ? 'Easy2Book — تذاكر الطيران والبواخر (3 نقرات)'
                      : 'Easy2Book — Billet d’Avion & Bateau (3 Clics)'
                  }
                  slug="billetterie-avion-bateau-easy2book"
                />
              </div>

              {audioError && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                  {audioError}
                </p>
              )}

              {/* Export Progress & Ready Card */}
              {videoExporting && (
                <div className="rounded-xl border border-[#102D45]/12 bg-[#FAF9F6] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#102D45]">
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#C8922A]" />
                      {videoExportStatus}
                    </span>
                    <span className="font-mono-tabular" dir="ltr">
                      {videoExportPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#102D45]/10">
                    <div
                      className="h-full bg-[#C8922A] transition-all duration-300"
                      style={{ width: `${videoExportPct}%` }}
                    />
                  </div>
                </div>
              )}

              {videoExportError && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
                  {videoExportError}
                </p>
              )}

              {videoExportResult && !videoExporting && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-950">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {isAr
                        ? 'تم تجهيز الفيديو بنجاح!'
                        : 'Vidéo promo 9:16 générée & téléchargée'}
                    </span>
                    <span className="font-mono-tabular" dir="ltr">
                      {videoExportResult.format.toUpperCase()} ·{' '}
                      {formatFileSize(videoExportResult.sizeBytes)} ·{' '}
                      {videoExportResult.durationSec}s
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerVideoBlobDownload(videoExportResult)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {isAr ? 'إعادة التحميل' : 'Télécharger à nouveau'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopyVideoLink()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900"
                    >
                      {videoLinkCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          {isAr ? 'تم النسخ' : 'Lien copié'}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          {isAr ? 'نسخ الرابط' : 'Copier lien MP4'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline Scrubber & 5-Scene Jump Buttons */}
              <div className="space-y-2.5 border-t border-[#0B162C]/10 pt-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#102D45]">
                  <span>
                    {isAr
                      ? 'الجدول الزمني للمشاهد (30 ثانية)'
                      : 'Timeline des 5 séquences (Format court 30s)'}
                  </span>
                  <span className="font-mono-tabular text-[#C8922A]" dir="ltr">
                    {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    const val = Number.parseFloat(e.target.value);
                    setCurrentTime(val);
                    if (audioRef.current) audioRef.current.currentTime = val;
                  }}
                  className="w-full accent-[#C8922A] cursor-pointer"
                  aria-label="Barre de progression vidéo 30s"
                />
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {reelConfig.scenes.map((sc) => {
                    const isCurrent = sc.id === activeScene.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleSelectSceneTime(sc.startSec)}
                        className={`rounded-lg border px-2 py-2 text-start transition-colors ${
                          isCurrent
                            ? 'border-[#C8922A] bg-[#102D45] text-white'
                            : 'border-[#0B162C]/10 bg-[#FAF9F6] text-[#0B162C] hover:border-[#C8922A]'
                        }`}
                      >
                        <p
                          dir="ltr"
                          className={`font-mono-tabular text-[10px] font-extrabold ${
                            isCurrent ? 'text-[#E7B34C]' : 'text-[#C8922A]'
                          }`}
                        >
                          0:{String(sc.startSec).padStart(2, '0')}–0:
                          {String(sc.endSec).padStart(2, '0')}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold truncate">
                          {sc.overlayHeadline}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voiceover Voice Choice + Collapsible Captions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#0B162C]/10 pt-3">
                <div className="flex items-center gap-2 text-xs">
                  <Volume2 className="h-3.5 w-3.5 text-[#C8922A]" />
                  <span className="font-bold text-[#102D45]">
                    {isAr ? 'الصوت:' : 'Voix :'}
                  </span>
                  <select
                    value={selectedVoice}
                    onChange={(e) => {
                      setSelectedVoice(e.target.value);
                      if (isPlaying) void startOrToggleVoiceover(e.target.value);
                    }}
                    className="rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-2.5 py-1 text-xs font-bold text-[#0B162C]"
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
                  onClick={() => setShowSocialCaptions((s) => !s)}
                  className="text-xs font-bold text-[#1C4967] hover:text-[#C8922A]"
                >
                  {showSocialCaptions
                    ? isAr
                      ? 'إخفاء نصوص النشر (Reels / TikTok)'
                      : 'Masquer les captions TikTok / Reels'
                    : isAr
                      ? 'نسخ نصوص النشر (TikTok / Reels / WhatsApp)'
                      : 'Captions TikTok / Reels & WhatsApp →'}
                </button>
              </div>

              {showSocialCaptions && (
                <div className="grid gap-2.5 sm:grid-cols-3 pt-1">
                  {socialCaptions.map((cap) => (
                    <div
                      key={cap.id}
                      className="rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-[#C8922A] text-[11px]">
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
                                  1600
                                );
                              });
                          }}
                          className="inline-flex items-center gap-1 rounded border border-[#0B162C]/10 bg-white px-2 py-0.5 text-[10px] font-bold text-[#102D45]"
                        >
                          {copiedCaptionId === cap.id ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedCaptionId === cap.id ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>
                      {cap.lines.map((line, i) => (
                        <p key={i} className="text-[11px] leading-snug text-[#475569]">
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Vertical 9:16 Video Frame */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
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
              onSelectScene={(sec) => {
                setCurrentTime(sec);
                if (audioRef.current) audioRef.current.currentTime = sec;
              }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: SCÉNARIO VIDÉO (FORMAT COURT 25-35s) & CONSEILS DE TOURNAGE */}
      <section
        id="flights-pilot-scenario"
        className="border-y border-[#0B162C]/10 bg-white py-14"
      >
        <div className="mx-auto max-w-[1200px] px-5 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#C8922A]">
                {isAr
                  ? 'السيناريو الإعلاني الكامل · مدة قصيرة 25 إلى 35 ثانية'
                  : '3. Scénario Vidéo (Format court : 25 à 35 secondes)'}
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0B162C]">
                {isAr
                  ? 'تقطيع المشاهد، التعليق الصوتي والنصوص على الشاشة'
                  : 'Découpage exact scène par scène — Cliquez pour prévisualiser'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void startOrToggleVoiceover()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
            >
              <Play className="h-3.5 w-3.5 text-[#E7B34C]" />
              <span>
                {isAr ? 'تشغيل السيناريو الكامل' : 'Lancer l’aperçu complet (30s)'}
              </span>
            </button>
          </div>

          {/* 5-Row Scenario Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#0B162C]/12 bg-[#FAF9F6] shadow-xs">
            <table className="w-full border-collapse text-start text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#0B162C]/12 bg-[#102D45] text-white">
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">
                    {isAr ? 'التوقيت' : 'Temps'}
                  </th>
                  <th className="px-4 py-3.5 font-extrabold">
                    {isAr ? 'المشهد المرئي (ما نراه)' : 'Visuel (Ce qu’on voit à l’écran)'}
                  </th>
                  <th className="px-4 py-3.5 font-extrabold">
                    {isAr ? 'الصوت / التعليق' : 'Audio / Voix-off (Ce qu’on entend)'}
                  </th>
                  <th className="px-4 py-3.5 font-extrabold">
                    {isAr ? 'النص على الشاشة' : 'Texte à l’écran'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B162C]/10">
                {SCENARIO_ROWS.map((row) => {
                  const isCurrent = row.id === activeScene.id;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleSelectSceneTime(row.jumpSec)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-[#FFF7E2]'
                          : 'bg-white hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <td className="px-4 py-4 align-top font-mono-tabular font-extrabold text-[#102D45] whitespace-nowrap">
                        <span dir="ltr">{row.timeRange}</span>
                      </td>
                      <td className="px-4 py-4 align-top text-[#475569] leading-relaxed">
                        {isAr ? row.visualAr : row.visualFr}
                      </td>
                      <td className="px-4 py-4 align-top font-medium text-[#0B162C] leading-relaxed">
                        {isAr ? row.audioAr : row.audioFr}
                      </td>
                      <td className="px-4 py-4 align-top font-extrabold text-[#9A6E1B] whitespace-nowrap">
                        {isAr ? row.onScreenAr : row.onScreenFr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Conseils de tournage pour maximiser les conversions */}
          <div className="rounded-2xl border border-[#C8922A]/35 bg-[#FBF9F4] p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-[#C8922A]" />
              <h3 className="text-lg font-extrabold text-[#0B162C]">
                {isAr
                  ? 'نصائح التصوير والمونتاج لرفع نسبة التحويل والمبيعات'
                  : 'Conseils de tournage pour maximiser les conversions'}
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {FLIGHTS_FERRIES_SHOOTING_TIPS.map((tip, idx) => (
                <div
                  key={tip.id}
                  className="rounded-xl border border-[#0B162C]/10 bg-white p-4 shadow-2xs"
                >
                  <p className="text-xs font-extrabold uppercase tracking-wide text-[#C8922A]">
                    {idx === 0 ? 'Conseil 01 · Cadence' : 'Conseil 02 · Ciblage Maritime'}
                  </p>
                  <h4 className="mt-1 text-base font-extrabold text-[#0B162C]">
                    {tip.title}
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#475569]">
                    {tip.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPARATEUR & RÉSERVATION EN 3 CLICS (AVION OU BATEAU) */}
      <section
        id="flights-pilot-3clicks"
        className="mx-auto max-w-[1200px] px-5 py-14 space-y-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#C8922A]">
              {isAr
                ? 'احجز في 3 نقرات · الطيران أو البواخر'
                : 'Tout au même endroit · Zéro prise de tête'}
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0B162C]">
              {isAr
                ? 'اختر وسيلة السفر، الخط والركاب واستلم تذكرتك على هاتفك'
                : 'Avion ✈️ ou Bateau ⛴️ : préparez votre billet en 3 clics'}
            </h2>
          </div>
          <a
            href="#flights-pilot-booking"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B162C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
          >
            <span>{isAr ? 'انتقل إلى تأكيد الحجز' : 'Finaliser mon départ'}</span>
            <ArrowDown className="h-3.5 w-3.5 text-[#E7B34C]" />
          </a>
        </div>

        {/* Clic 1: Mode Tabs */}
        <div className="rounded-2xl border border-[#0B162C]/12 bg-white p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0B162C]/10 pb-5">
            <div>
              <p className="text-xs font-extrabold text-[#C8922A]">
                {isAr ? 'الخطوة 1 · وسيلة السفر' : 'Clic 1 · Choisissez votre mode'}
              </p>
              <h3 className="text-lg font-extrabold text-[#0B162C]">
                {isAr ? 'طيران أو باخرة أو دمج بينهما' : 'Par les airs ou par la mer'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  {
                    id: 'flight',
                    icon: Plane,
                    labelFr: 'Avion ✈️ (Vols Express & Réguliers)',
                    labelAr: 'طائرة ✈️ (رحلات مباشرة وسريعة)',
                  },
                  {
                    id: 'ferry',
                    icon: Ship,
                    labelFr: 'Bateau ⛴️ (Traversées Méditerranée)',
                    labelAr: 'باخرة ⛴️ (عبّارات المتوسط والجزر)',
                  },
                  {
                    id: 'combo',
                    icon: Anchor,
                    labelFr: 'Tout Voir (Avion + Bateau)',
                    labelAr: 'الكل (طيران + بواخر)',
                  },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = transportMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setTransportMode(tab.id);
                      const firstMatch =
                        tab.id === 'combo'
                          ? ROUTE_CATALOG[0]
                          : ROUTE_CATALOG.find((r) => r.mode === tab.id);
                      if (firstMatch) setSelectedRouteId(firstMatch.id);
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors ${
                      active
                        ? 'border-[#C8922A] bg-[#102D45] text-white'
                        : 'border-[#0B162C]/15 bg-[#FAF9F6] text-[#0B162C] hover:border-[#C8922A]'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-[#E7B34C]" />
                    <span>{isAr ? tab.labelAr : tab.labelFr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clic 2: Route & Compagnies Cards */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-[#C8922A]">
              {isAr
                ? 'الخطوة 2 · اختر الوجهة والشركات'
                : 'Clic 2 · Sélectionnez votre trajet & comparez les compagnies'}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredRoutes.map((route) => {
                const isSelected = activeRoute.id === route.id;
                const Icon = route.mode === 'flight' ? Plane : Ship;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`group flex flex-col justify-between overflow-hidden rounded-2xl border text-start transition-all ${
                      isSelected
                        ? 'border-[#C8922A] bg-[#FBF9F4] ring-2 ring-[#C8922A]/25'
                        : 'border-[#0B162C]/12 bg-white hover:border-[#C8922A]/60'
                    }`}
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <img
                        src={route.imageSrc}
                        alt={isAr ? route.corridorAr : route.corridorFr}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B162C]/85 via-[#0B162C]/25 to-transparent" />
                      <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-2 text-white">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold">
                          <Icon className="h-4 w-4 text-[#E7B34C]" />
                          {route.mode === 'flight'
                            ? isAr
                              ? 'شركات الطيران'
                              : 'Aérien'
                            : isAr
                              ? 'شركات الملاحة البحرية'
                              : 'Maritime'}
                        </span>
                        <span className="rounded bg-[#C8922A] px-2 py-0.5 text-[10px] font-extrabold text-[#0B162C]">
                          {isAr ? 'مقارنة مباشرة' : 'Comparatif direct'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5 flex-1">
                      <h4 className="text-sm sm:text-base font-extrabold text-[#0B162C]">
                        {isAr ? route.corridorAr : route.corridorFr}
                      </h4>
                      <p className="text-xs font-bold text-[#1C4967]">
                        {isAr ? route.companiesAr : route.companiesFr}
                      </p>
                      <ul className="space-y-1 text-xs text-[#475569]">
                        {(isAr ? route.highlightsAr : route.highlightsFr).map(
                          (item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 shrink-0 text-[#C8922A]" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clic 3: Options & E-Billet Mobile Preview */}
          <div className="grid gap-6 lg:grid-cols-12 items-center border-t border-[#0B162C]/10 pt-6">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-extrabold text-[#C8922A]">
                {isAr
                  ? 'الخطوة 3 · حدّد تفاصيل السفر والأمتعة أو السيارة'
                  : 'Clic 3 · Ajustez vos options (0 frais surprises)'}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr ? 'نوع الرحلة' : 'Type de trajet'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTripType('roundtrip')}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                        tripType === 'roundtrip'
                          ? 'border-[#C8922A] bg-[#102D45] text-white'
                          : 'border-[#0B162C]/15 bg-[#FAF9F6] text-[#0B162C]'
                      }`}
                    >
                      {isAr ? 'ذهاب وإياب' : 'Aller-Retour'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('oneway')}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                        tripType === 'oneway'
                          ? 'border-[#C8922A] bg-[#102D45] text-white'
                          : 'border-[#0B162C]/15 bg-[#FAF9F6] text-[#0B162C]'
                      }`}
                    >
                      {isAr ? 'ذهاب فقط' : 'Aller Simple'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr ? 'عدد المسافرين' : 'Passagers'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPassengersCount(n)}
                        className={`rounded-lg border px-3 py-2 font-mono-tabular text-xs font-bold ${
                          passengersCount === n
                            ? 'border-[#C8922A] bg-[#C8922A] text-[#0B162C]'
                            : 'border-[#0B162C]/15 bg-[#FAF9F6] text-[#0B162C]'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {transportMode !== 'ferry' && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-3">
                  <Plane className="h-4 w-4 text-[#C8922A]" />
                  <span className="text-xs font-bold text-[#102D45]">
                    {isAr ? 'الأمتعة على الطائرة:' : 'Bagages Avion :'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCheckedBaggage(true)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      checkedBaggage
                        ? 'bg-[#102D45] text-white'
                        : 'bg-white text-[#475569] border border-[#0B162C]/10'
                    }`}
                  >
                    {isAr ? 'مع أمتعة شحن (23 كغ)' : 'Avec bagage en soute'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckedBaggage(false)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      !checkedBaggage
                        ? 'bg-[#102D45] text-white'
                        : 'bg-white text-[#475569] border border-[#0B162C]/10'
                    }`}
                  >
                    {isAr ? 'حقيبة يد فقط' : 'Bagage cabine seul'}
                  </button>
                </div>
              )}

              {transportMode !== 'flight' && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-3">
                  <Car className="h-4 w-4 text-[#C8922A]" />
                  <span className="text-xs font-bold text-[#102D45]">
                    {isAr ? 'الباخرة (سيارة وغرفة):' : 'Traversée Bateau :'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setWithVehicle((v) => !v)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      withVehicle
                        ? 'bg-[#102D45] text-white'
                        : 'bg-white text-[#475569] border border-[#0B162C]/10'
                    }`}
                  >
                    {withVehicle
                      ? isAr
                        ? 'مع سيارة ✓'
                        : 'Avec véhicule ✓'
                      : isAr
                        ? 'مسافر بدون سيارة'
                        : 'Piéton (sans véhicule)'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCabinOption((c) => (c === 'cabin' ? 'seat' : 'cabin'))
                    }
                    className="rounded-lg border border-[#0B162C]/15 bg-white px-3 py-1 text-xs font-bold text-[#102D45]"
                  >
                    {cabinOption === 'cabin'
                      ? isAr
                        ? 'غرفة خاصة (Cabine)'
                        : 'Cabine privée'
                      : isAr
                        ? 'مقعد مريح (Fauteuil)'
                        : 'Fauteuil / Pont'}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile E-Billet Card */}
            <div className="lg:col-span-5 rounded-2xl bg-[#102D45] p-5 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#E7B34C]">
                  <Smartphone className="h-4 w-4" />
                  <span>
                    {isAr
                      ? 'معاينة تذكرتك الهاتفية (E-Billet)'
                      : 'Aperçu E-Billet Mobile Easy2Book'}
                  </span>
                </div>
                <span className="font-mono-tabular text-[11px] font-bold text-emerald-300">
                  {isAr ? '0 مصاريف خفية' : '0 frais surprises'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-extrabold text-sm text-white">
                  {isAr ? activeRoute.corridorAr : activeRoute.corridorFr}
                </p>
                <p className="text-slate-300">
                  {isAr ? activeRoute.companiesAr : activeRoute.companiesFr}
                </p>
                <p className="text-[#F5D68A] font-semibold">
                  {isAr ? summaryOptionsAr : summaryOptionsFr}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href="#flights-pilot-booking"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#E7B34C] px-4 py-2.5 text-xs font-extrabold text-[#0B162C] hover:bg-[#f0c264]"
                >
                  {isAr ? 'احصل على السعر الآن' : 'Valider en 3 clics 👇'}
                </a>
                <a
                  href={quickWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2.5 text-xs font-bold text-white hover:bg-[#1FB857]"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: GALERIE DES SCÈNES & VISUELS 9:16 */}
      <section
        id="flights-pilot-gallery"
        className="border-y border-[#0B162C]/10 bg-white py-14"
      >
        <div className="mx-auto max-w-[1200px] px-5 space-y-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#C8922A]">
            <Camera className="h-4 w-4" />
            <span>
              {isAr ? 'معرض مشاهد الفيديو والرحلات' : 'Galerie Visuelle · Scènes du Reel 9:16'}
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY_PHOTOS.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxPhoto(photo)}
                className="group overflow-hidden rounded-2xl border border-[#0B162C]/10 bg-[#FAF9F6] text-start transition-all hover:border-[#C8922A]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={photo.src}
                    alt={isAr ? photo.titleAr : photo.titleFr}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-mono-tabular text-[10px] font-extrabold text-[#C8922A]">
                    {isAr ? photo.badgeAr : photo.badgeFr}
                  </p>
                  <h3 className="text-sm font-extrabold text-[#0B162C]">
                    {isAr ? photo.titleAr : photo.titleFr}
                  </h3>
                  <p className="text-xs text-[#475569] line-clamp-2">
                    {isAr ? photo.captionAr : photo.captionFr}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section className="mx-auto max-w-[1200px] px-5 py-14 space-y-6">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#C8922A]">
            {isAr ? 'الأسئلة الشائعة' : 'Questions Fréquentes'}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#0B162C]">
            {isAr
              ? 'كل ما تحتاج معرفته حول حجز تذاكر الطيران والبواخر'
              : 'E-Billet, Traversées Bateau & Transparence Tarifaire'}
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#0B162C]/10 bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start text-sm font-extrabold text-[#0B162C]"
                >
                  <span>{isAr ? item.qAr : item.qFr}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#C8922A] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-[#0B162C]/10 px-5 py-3.5 text-xs sm:text-sm leading-relaxed text-[#475569]">
                    {isAr ? item.aAr : item.aFr}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: BOOKING & CRM DISPATCH */}
      <section
        id="flights-pilot-booking"
        className="bg-[#102D45] py-16 text-white"
      >
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#E7B34C]">
              {isAr ? 'تأكيد سريع · 98 140 514' : 'Réserve sur Easy2Book 👇'}
            </p>
            <h2 className="text-3xl font-extrabold leading-tight">
              {isAr
                ? 'حضّر حقيبتك واحجز رحلتك القادمة جوّاً أو بحراً الآن'
                : 'Prépare tes valises et réserve ton prochain départ maintenant'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'أرسل لنا مسارك وتاريخ السفر المقترح، وسيوافيك فريق Easy2Book بأفضل تسعيرة مقارنة للشركات الجوية أو البحرية مع التذكرة الإلكترونية مباشرة على هاتفك.'
                : 'Indiquez votre trajet Avion ou Bateau et vos dates souhaitées : nos conseillers comparent toutes les compagnies et vous transmettent le tarif net garanti sans frais cachés.'}
            </p>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 space-y-2 text-xs">
              <p className="font-extrabold text-[#F5D68A]">
                {isAr ? 'الاختيار المفعّل حالياً:' : 'Configuration sélectionnée :'}
              </p>
              <p className="font-bold text-white">
                {isAr ? selectedModeLabelAr : selectedModeLabelFr}
              </p>
              <p className="text-slate-200">
                {isAr ? activeRoute.corridorAr : activeRoute.corridorFr}
              </p>
              <p className="text-[#F5D68A]">
                {isAr ? summaryOptionsAr : summaryOptionsFr}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white p-6 md:p-8 text-[#0B162C] shadow-xl">
              <div className="border-b border-[#0B162C]/10 pb-4">
                <p className="text-xs font-extrabold text-[#C8922A]">
                  {isAr
                    ? 'إيداع طلب حجز فوري · بدون مصاريف مفاجئة'
                    : 'Comparatif & Réservation Directe Easy2Book (98 140 514)'}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  {isAr
                    ? 'اطلب تسعيرتك وحجز تذكرتك الآن'
                    : 'Recevez votre comparatif & e-billet sur téléphone'}
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
                            ? 'تم تجهيز طلب تذكرة السفر بنجاح عبر CRM Easy2Book'
                            : 'Votre demande Billet Avion & Bateau a été enregistrée avec succès.'}
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
                        ? 'إرسال عبر واتساب (98 140 514)'
                        : 'Envoyer sur WhatsApp Business (98 140 514)'}
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowJsonPayload((s) => !s)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#0B162C]/15 bg-[#F5F7FA] px-3 py-3 text-xs font-bold text-[#0B162C]"
                    >
                      <Code2 className="h-4 w-4" />
                      {showJsonPayload
                        ? isAr
                          ? 'إخفاء JSON'
                          : 'Masquer JSON'
                        : isAr
                          ? 'معاينة عقد CRM'
                          : 'Voir contrat CRM JSON'}
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
                      className="max-h-64 overflow-auto rounded-xl bg-[#102D45] p-4 font-mono text-[11px] text-slate-100"
                    >
                      {JSON.stringify(dispatchResult.payload, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={(e) => void handleSubmitInquiry(e)}
                  className="mt-5 space-y-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'الاسم الكامل *' : 'Nom complet *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'الاسم واللقب' : 'Prénom & Nom'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'رقم الهاتف / واتساب *' : 'Téléphone / WhatsApp *'}
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
                        {isAr ? 'البريد الإلكتروني *' : 'Adresse e-mail *'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nom@exemple.tn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">
                        {isAr ? 'تاريخ الذهاب والعودة' : 'Dates de départ & retour'}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          isAr
                            ? 'مثال: 15 جويلية – 10 أوت'
                            : 'Ex. : Départ 15 juillet · Retour 10 août'
                        }
                        value={travelDates}
                        onChange={(e) => setTravelDates(e.target.value)}
                        className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {isAr
                        ? 'ملاحظات (طراز السيارة، أمتعة إضافية، تفضيل شركة...)'
                        : 'Précisions (modèle de véhicule bateau, compagnie préférée, escale...)'}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        isAr
                          ? 'مثال: سيارة عائلية + غرفة بـ 4 أسرة على CTN'
                          : 'Ex. : Traversée CTN / GNV avec SUV + cabine hublot, ou vol direct Paris ORY'
                      }
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

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0B162C]/10 pt-4">
                    <div>
                      <p className="text-xs text-[#475569]">
                        {isAr
                          ? 'سعر مقارن في الحين بدون مصاريف خفية'
                          : 'Comparatif net multi-compagnies · E-billet mobile'}
                      </p>
                      <p className="text-sm font-extrabold text-[#102D45]">
                        {isAr ? 'تسعيرة مؤكدة قبل الحجز' : '0 frais surprises · Tarif net sur devis'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="submit"
                        className="rounded-xl bg-[#0B162C] px-5 py-3 text-sm font-bold text-white hover:bg-[#1C4967]"
                      >
                        {isAr ? 'إرسال وتأكيد الطلب' : 'Comparer & Réserver'}
                      </button>
                      <a
                        href={detailedWhatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:bg-[#1FB857]"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>{isAr ? 'واتساب مباشر' : 'WhatsApp direct'}</span>
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
                Easy2Book · The easiest way to travel
              </p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? 'قسم تذاكر الطيران والبواخر · جميع الشركات في مكان واحد'
                  : 'Rubrique Billet d’Avion & Bateau · Vols & Traversées Méditerranée'}
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
              aria-label="Fermer"
              className="absolute top-3 end-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxPhoto.src}
              alt={isAr ? lightboxPhoto.titleAr : lightboxPhoto.titleFr}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-full object-cover"
            />
            <div className="p-5">
              <p className="font-mono-tabular text-[11px] font-bold text-[#9A6E1B]">
                {isAr ? lightboxPhoto.badgeAr : lightboxPhoto.badgeFr}
              </p>
              <h3 className="mt-1 text-lg font-extrabold text-[#0B162C]">
                {isAr ? lightboxPhoto.titleAr : lightboxPhoto.titleFr}
              </h3>
              <p className="mt-1 text-xs text-[#475569]">
                {isAr ? lightboxPhoto.captionAr : lightboxPhoto.captionFr}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
