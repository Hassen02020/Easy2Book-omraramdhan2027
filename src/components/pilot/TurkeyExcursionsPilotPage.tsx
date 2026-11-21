import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Car,
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
  Play,
  RotateCcw,
  Ship,
  Sparkles,
  Ticket,
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

type TurkeyCategory =
  | 'all'
  | 'daily'
  | 'princes_islands'
  | 'bosphorus_cruises'
  | 'leisure_antalya'
  | 'transfers';

interface TurkeyExcursionOffer {
  id: string;
  category: Exclude<TurkeyCategory, 'all'>;
  categoryLabel: string;
  title: string;
  subtitle: string;
  priceDt: number;
  pricingUnit: 'per_person' | 'per_vehicle' | 'per_couple';
  unitLabel: string;
  imageSrc: string;
  highlights: string[];
}

const TURKEY_CATEGORY_TABS: { id: TurkeyCategory; label: string }[] = [
  { id: 'all', label: 'كل العروض والخدمات (22)' },
  { id: 'daily', label: 'الرحلات اليومية (5)' },
  { id: 'princes_islands', label: 'جزر الأميرات (4)' },
  { id: 'bosphorus_cruises', label: 'سهرات البسفور (8)' },
  { id: 'leisure_antalya', label: 'فيالاند وأنطاليا (2)' },
  { id: 'transfers', label: 'توصيل المطار VIP (4)' },
];

/**
 * Catalogue complet des excursions, croisières, loisirs, Pack Antalya et transferts Turquie
 * Tarifs officiels Easy2Book avec majoration +25 TND appliquée à chaque prestation.
 */
const TURKEY_EXCURSIONS_CATALOG: TurkeyExcursionOffer[] = [
  // 1. الرحلات اليومية (مواصلات · غذاء · دليل سياحي عربي)
  {
    id: 'tr-daily-sapanca',
    category: 'daily',
    categoryLabel: 'رحلة يومية · طبيعة وشلالات',
    title: 'صبنجا · معشوقية',
    subtitle: 'رحلة يومية إلى بحيرة صبنجا وشلالات معشوقية شاملة المواصلات والغداء والدليل السياحي العربي.',
    priceDt: 65,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_sapanca_lake.src,
    highlights: ['مواصلات حديثة مكيفة', 'وجبة غذاء شاملة', 'دليل سياحي عربي'],
  },
  {
    id: 'tr-daily-izmit',
    category: 'daily',
    categoryLabel: 'رحلة يومية شاملة',
    title: 'إزميت · صبنجا · معشوقية',
    subtitle: 'جولة متكاملة تجمع بين مدينة إزميت وبحيرة صبنجا وطبيعة معشوقية الخلابة مع الغداء.',
    priceDt: 85,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_sapanca_lake.src,
    highlights: ['3 محطات سياحية متميزة', 'مواصلات + وجبة غذاء', 'دليل سياحي عربي'],
  },
  {
    id: 'tr-daily-bursa',
    category: 'daily',
    categoryLabel: 'رحلة يومية · جبل أولوداغ',
    title: 'بورصا الخضراء',
    subtitle: 'استكشاف معالم بورصا التاريخية والطبيعية وجبل أولوداغ شاملة المواصلات والغداء والدليل العربي.',
    priceDt: 100,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.voyage_istanbul.src,
    highlights: ['مواصلات مكيفة ذهاب وإياب', 'وجبة غذاء شاملة', 'دليل سياحي عربي'],
  },
  {
    id: 'tr-daily-sile-agva',
    category: 'daily',
    categoryLabel: 'رحلة يومية · البحر الأسود',
    title: 'شيلا · أغوا',
    subtitle: 'هروب نحو طبيعة البحر الأسود ونهر أغوا ومنطقة شيلا الساحلية مع المواصلات والغداء.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_sapanca_lake.src,
    highlights: ['أجواء طبيعية على البحر الأسود', 'وجبة غذاء شاملة', 'مواصلات + دليل عربي'],
  },
  {
    id: 'tr-daily-yalova',
    category: 'daily',
    categoryLabel: 'رحلة يومية · السبت فقط',
    title: 'يلوا · السبت',
    subtitle: 'رحلة يوم السبت إلى مدينة يلوا الساحلية وحماماتها المعدنية شاملة المواصلات والغداء والدليل العربي.',
    priceDt: 145,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_princes_islands.src,
    highlights: ['موعد أسبوعي كل سبت', 'مواصلات + وجبة غذاء', 'دليل سياحي عربي'],
  },

  // 2. سفن جزر الأميرات (شامل المواصلات والغداء والدليل السياحي)
  {
    id: 'tr-island-nesmat',
    category: 'princes_islands',
    categoryLabel: 'سفينة جزر الأميرات',
    title: 'جزر الأميرات · سفينة نسمات شامية',
    subtitle: 'جولة بحرية مميزة في بحر مرمرة نحو جزر الأميرات مع أجواء شامية شاملة المواصلات والغداء والدليل.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_princes_islands.src,
    highlights: ['توصيل من وإلى الفندق', 'غداء على متن السفينة', 'دليل سياحي مرافق'],
  },
  {
    id: 'tr-island-amirate',
    category: 'princes_islands',
    categoryLabel: 'سفينة جزر الأميرات',
    title: 'جزر الأميرات · السفينة الكلاسيكية',
    subtitle: 'عبور بحري ممتع نحو بيوك أدا وجزر الأميرات شامل المواصلات ووجبة الغداء والدليل السياحي.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_princes_islands.src,
    highlights: ['شامل المواصلات والغداء', 'وقت حر للاستكشاف في الجزيرة', 'دليل سياحي مرافق'],
  },
  {
    id: 'tr-island-sabah',
    category: 'princes_islands',
    categoryLabel: 'سفينة جزر الأميرات',
    title: 'جزر الأميرات · صباح إسطنبول',
    subtitle: 'رحلة بحرية نهارية على متن سفينة صباح إسطنبول شاملة النقل من الفندق والغداء والدليل السياحي.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_princes_islands.src,
    highlights: ['إطلالة بانورامية على مرمرة', 'وجبة غداء شاملة', 'مواصلات + دليل سياحي'],
  },
  {
    id: 'tr-island-layali',
    category: 'princes_islands',
    categoryLabel: 'سفينة جزر الأميرات',
    title: 'جزر الأميرات · ليالي إسطنبول (جزيرة)',
    subtitle: 'برنامج جزر الأميرات البحري على متن سفينة ليالي إسطنبول مع المواصلات والغداء والدليل.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_princes_islands.src,
    highlights: ['خدمة نقل فندقية', 'غداء على الباخرة', 'دليل سياحي مرافق'],
  },

  // 3. السفن المسائية العربية والتركية (شامل المواصلات والعشاء)
  {
    id: 'tr-cruise-malakiya',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية عربية',
    title: 'سهرة البسفور · السفينة الملكية',
    subtitle: 'سهرة عشاء مسائية راقية في مضيق البسفور بأجواء عربية شاملة المواصلات وبوفيه العشاء.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['سهرة وعشاء على البسفور', 'مواصلات ذهاب وإياب', 'برنامج فني عربي'],
  },
  {
    id: 'tr-cruise-bosphore',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية عربية',
    title: 'سهرة البسفور · سفينة البسفور',
    subtitle: 'أمسية ساهرة بين ضفتي إسطنبول الأوروبية والآسيوية شاملة المواصلات والعشاء.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['عشاء فاخر على المضيق', 'توصيل من وإلى الفندق', 'عروض مسائية متنوعة'],
  },
  {
    id: 'tr-cruise-louloua',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية عربية',
    title: 'سهرة البسفور · لؤلؤة البسفور',
    subtitle: 'إبحار ليلي ساحر تحت جسور البسفور المضاءة مع عشاء فاخر ومواصلات مشمولة.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['شامل المواصلات والعشاء', 'جلسات عائلية مريحة', 'طرب وعروض فنية'],
  },
  {
    id: 'tr-cruise-sahar',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية عربية',
    title: 'سهرة البسفور · سهر الليالي',
    subtitle: 'سهرة عشاء مسائية مفعمة بالأجواء العربية الأصيلة على متن سفينة سهر الليالي.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['مواصلات شاملة من الفندق', 'عشاء متكامل على البسفور', 'سهرات طربية مميزة'],
  },
  {
    id: 'tr-cruise-layali-chamiya',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية عربية VIP',
    title: 'سهرة البسفور · ليالي شامية',
    subtitle: 'أمسية فاخرة من الطراز الرفيع في البسفور على متن سفينة ليالي شامية شاملة المواصلات والعشاء.',
    priceDt: 145,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['سفينة عربية فاخرة', 'عشاء شامي وتركي مميز', 'مواصلات فندقية شاملة'],
  },
  {
    id: 'tr-cruise-layali-istanbul',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية عربية',
    title: 'سهرة البسفور · ليالي إسطنبول',
    subtitle: 'جولة عشاء ليلية في قلب إسطنبول على البسفور شاملة النقل الفندقي والعشاء.',
    priceDt: 105,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['مواصلات + وجبة عشاء', 'إطلالة على معالم البسفور', 'أجواء عائلية'],
  },
  {
    id: 'tr-cruise-orient',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية تركية',
    title: 'السفينة التركية · أورينت (Orient)',
    subtitle: 'تجربة سهرة البسفور التركية الراقية على متن باخرة أورينت شاملة المواصلات والعشاء والعروض الفلكلورية.',
    priceDt: 145,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['باخرة تركية فاخرة', 'عشاء + مواصلات شاملة', 'عروض فلكلور تركي'],
  },
  {
    id: 'tr-cruise-tosan',
    category: 'bosphorus_cruises',
    categoryLabel: 'سفينة مسائية تركية VIP',
    title: 'السفينة التركية · توسان باشا (Tosan Pasha)',
    subtitle: 'أرقى سهرات العشاء التركية الفاخرة في البسفور على متن باخرة توسان باشا مع المواصلات والعشاء.',
    priceDt: 175,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    highlights: ['خدمة VIP وعشاء فاخر', 'مواصلات من وإلى الفندق', 'إطلالة بانورامية على البسفور'],
  },

  // 4. الترفيه وباقة أنطاليا الخاصة
  {
    id: 'tr-vialand',
    category: 'leisure_antalya',
    categoryLabel: 'ترفيه ومدن ألعاب',
    title: 'تكت فيالاند (Vialand / Isfanbul)',
    subtitle: 'تذكرة دخول شاملة لجميع الألعاب الترفيهية في مدينة فيالاند مع المواصلات من ميدان تقسيم ذهاباً وإياباً.',
    priceDt: 245,
    pricingUnit: 'per_person',
    unitLabel: 'للشخص الواحد',
    imageSrc: HERO_MEDIA_MAP.voyage_istanbul.src,
    highlights: ['شامل جميع الألعاب', 'مواصلات من تقسيم ميدان', 'مناسب للعائلات والشباب'],
  },
  {
    id: 'tr-pack-antalya',
    category: 'leisure_antalya',
    categoryLabel: 'باقة خاصة · ثنائي أنطاليا',
    title: 'باقة أنطاليا المتكاملة (Pack Antalya Couple)',
    subtitle: 'Zipline + Rafting مع التذاكر والغداء (أو غوص مع الغداء) + قارب القراصنة مع الغداء والسباحة + توصيل مطار AYT ذهاب وإياب + City Tours + جولات جماعية + توصيل VIP خاص.',
    priceDt: 1125,
    pricingUnit: 'per_couple',
    unitLabel: 'سعر الثنائي (Couple)',
    imageSrc: HERO_MEDIA_MAP.turkey_antalya_coast.src,
    highlights: [
      'Zipline + Rafting أو Diving مع الغداء',
      'رحلة قارب القراصنة + غذاء وسباحة',
      'توصيل ذهاب وإياب مطار أنطاليا AYT + جولات VIP',
    ],
  },

  // 5. توصيل المطار — سيارات خاصة (Transfer)
  {
    id: 'tr-trf-vito-ist',
    category: 'transfers',
    categoryLabel: 'نقل خاص · مطار إسطنبول (IST)',
    title: 'توصيل خاص · فيتو (6 أشخاص · 6 شنط كبيرة) — مطار إسطنبول',
    subtitle: 'سيارة مرسيدس فيتو خاصة مكيفة من أو إلى مطار إسطنبول الدولي (IST) تتسع لـ 6 ركاب و6 حقائب كبيرة.',
    priceDt: 185,
    pricingUnit: 'per_vehicle',
    unitLabel: 'للسيارة كاملة',
    imageSrc: HERO_MEDIA_MAP.vip_airport_transfer.src,
    highlights: ['تتسع لـ 6 أشخاص', 'تتسع لـ 6 شنط كبيرة', 'استقبال خاص في مطار IST'],
  },
  {
    id: 'tr-trf-vito-saw',
    category: 'transfers',
    categoryLabel: 'نقل خاص · مطار صبيحة (SAW)',
    title: 'توصيل خاص · فيتو (6 أشخاص · 6 شنط كبيرة) — مطار صبيحة',
    subtitle: 'سيارة مرسيدس فيتو خاصة مكيفة من أو إلى مطار صبيحة كوكجن (SAW) تتسع لـ 6 ركاب و6 حقائب كبيرة.',
    priceDt: 195,
    pricingUnit: 'per_vehicle',
    unitLabel: 'للسيارة كاملة',
    imageSrc: HERO_MEDIA_MAP.vip_airport_transfer.src,
    highlights: ['تتسع لـ 6 أشخاص', 'تتسع لـ 6 شنط كبيرة', 'استقبال خاص في مطار SAW'],
  },
  {
    id: 'tr-trf-sprinter-ist',
    category: 'transfers',
    categoryLabel: 'نقل عائلات ومجموعات · مطار إسطنبول (IST)',
    title: 'توصيل خاص · سبرنتر (14 شخص · 11 شنطة كبيرة) — مطار إسطنبول',
    subtitle: 'مرسيدس سبرنتر واسعة للمجموعات والعائلات من أو إلى مطار إسطنبول (IST) تتسع لـ 14 راكباً و11 حقيبة كبيرة.',
    priceDt: 245,
    pricingUnit: 'per_vehicle',
    unitLabel: 'للحافلة كاملة',
    imageSrc: HERO_MEDIA_MAP.vip_airport_transfer.src,
    highlights: ['تتسع لـ 14 شخصاً', 'تتسع لـ 11 شنطة كبيرة', 'مطار إسطنبول (IST)'],
  },
  {
    id: 'tr-trf-sprinter-saw',
    category: 'transfers',
    categoryLabel: 'نقل عائلات ومجموعات · مطار صبيحة (SAW)',
    title: 'توصيل خاص · سبرنتر (14 شخص · 11 شنطة كبيرة) — مطار صبيحة',
    subtitle: 'مرسيدس سبرنتر واسعة للمجموعات والعائلات من أو إلى مطار صبيحة (SAW) تتسع لـ 14 راكباً و11 حقيبة كبيرة.',
    priceDt: 265,
    pricingUnit: 'per_vehicle',
    unitLabel: 'للحافلة كاملة',
    imageSrc: HERO_MEDIA_MAP.vip_airport_transfer.src,
    highlights: ['تتسع لـ 14 شخصاً', 'تتسع لـ 11 شنطة كبيرة', 'مطار صبيحة (SAW)'],
  },
];

const EASY2BOOK_TURKEY_SERVICES = [
  'حجوزات الفنادق في إسطنبول، صبنجا، بورصا وأنطاليا',
  'خدمات النقل الخاص من وإلى المطارات (فيتو وسبرنتر)',
  'الرحلات والجولات السياحية الخاصة أو الجماعية اليومية',
  'تنظيم البرامج السياحية وباقات شهر العسل حسب رغبتكم',
  'توفير قوائم رحلات المبيت والسيارات الخاصة عند الطلب',
];

const GALLERY_PHOTOS = [
  {
    id: 'tr-gal-1',
    src: HERO_MEDIA_MAP.turkey_sapanca_lake.src,
    badge: 'الرحلات اليومية · من 65 د.ت',
    title: 'بحيرة صبنجا وشلالات معشوقية وإزميت',
    caption: 'جولات طبيعية يومية شاملة المواصلات والغداء والدليل السياحي العربي من Easy2Book',
  },
  {
    id: 'tr-gal-2',
    src: HERO_MEDIA_MAP.turkey_princes_islands.src,
    badge: 'جزر الأميرات · 105 د.ت',
    title: 'جولات سفن جزر الأميرات وبحر مرمرة',
    caption: 'نسمات شامية، جزيرة الأميرات، صباح إسطنبول وليالي إسطنبول شاملة النقل والغداء',
  },
  {
    id: 'tr-gal-3',
    src: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    badge: 'سهرات البسفور · من 105 د.ت',
    title: 'السفن المسائية العربية والتركية على البسفور',
    caption: 'الملكية، البسفور، لؤلؤة البسفور، سهر الليالي، ليالي شامية، أورينت وتوسان باشا',
  },
  {
    id: 'tr-gal-4',
    src: HERO_MEDIA_MAP.turkey_antalya_coast.src,
    badge: 'أنطاليا الثنائي · 1,125 د.ت',
    title: 'باقة أنطاليا الخاصة (Zipline، Rafting وقارب القراصنة)',
    caption: 'برنامج مغامرات وبحر متكامل للثنائي مع توصيل مطار أنطاليا AYT وجولات VIP',
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

interface TurkeyExcursionsPilotPageProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  crmConfig: CrmIntegrationConfig;
  defaultVoiceId?: string;
}

/**
 * Page Pilote Complète : "Easy2Book — رحلات تركيا اليومية (إسطنبول، صبنجا، البسفور وأنطاليا)"
 * - Lecteur Vidéo 9:16 + Timeline Scrubber + 4 Scènes Turquie + Voix féminine tunisienne Gemini TTS (Layla par défaut)
 * - Génération & téléchargement direct de la vidéo MP4 9:16
 * - Catalogue complet avec majoration +25 DT (Excursions, Îles des Princes, Croisières, Vialand, Pack Antalya, Transferts)
 * - Estimateur interactif + WhatsApp Business 98 140 514 + CRM Easy2Book + Export Brochure PDF
 */
export function TurkeyExcursionsPilotPage({
  page,
  snapshot,
  crmConfig,
  defaultVoiceId,
}: TurkeyExcursionsPilotPageProps) {
  const reelConfig = useMemo(() => getReelConfig('turkey_excursions'), []);
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

  const [activeCategory, setActiveCategory] = useState<TurkeyCategory>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<
    (typeof GALLERY_PHOTOS)[number] | null
  >(null);

  // Interactive Booking Estimator
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([
    'tr-daily-sapanca',
    'tr-cruise-bosphore',
    'tr-trf-vito-ist',
  ]);
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
    setVideoExportStatus('جاري تحضير فيديو رحلات تركيا 9:16...');

    if (videoExportResult?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoExportResult.blobUrl);
    }

    try {
      const result = await generateVideoDownloadLink({
        voiceName: selectedVoice,
        showCaptions,
        preset: 'turkey_excursions',
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

  const filteredOffers = useMemo(() => {
    if (activeCategory === 'all') return TURKEY_EXCURSIONS_CATALOG;
    return TURKEY_EXCURSIONS_CATALOG.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  const toggleOfferSelection = (id: string) => {
    setSelectedOfferIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedOffers = useMemo(
    () =>
      TURKEY_EXCURSIONS_CATALOG.filter((item) =>
        selectedOfferIds.includes(item.id)
      ),
    [selectedOfferIds]
  );

  const computeOfferTotal = (offer: TurkeyExcursionOffer): number => {
    if (offer.pricingUnit === 'per_person') {
      return offer.priceDt * travelersCount;
    }
    return offer.priceDt;
  };

  const estimatedTotalDt = useMemo(
    () =>
      selectedOffers.reduce((sum, offer) => sum + computeOfferTotal(offer), 0),
    [selectedOffers, travelersCount]
  );

  const detailedWhatsAppHref = useMemo(() => {
    const lines = [
      'السلام عليكم فريق Easy2Book،',
      'أرغب في الاستفسار والحجز في عرض: رحلات تركيا اليومية (إسطنبول / أنطاليا)',
      `• عدد المسافرين: ${travelersCount}`,
      selectedOffers.length > 0
        ? `• الخدمات والرحلات المختارة (${selectedOffers.length}):`
        : '• لم يتم تحديد رحلة بعد',
      ...selectedOffers.map(
        (ex) =>
          `  - ${ex.title} (${ex.unitLabel}): ${computeOfferTotal(ex).toLocaleString('en-US')} د.ت`
      ),
      selectedOffers.length > 0
        ? `• المجموع التقديري: ${estimatedTotalDt.toLocaleString('en-US')} د.ت`
        : '',
      travelDate.trim() ? `• تاريخ السفر: ${travelDate.trim()}` : '',
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
    fullName,
    notes,
    phone,
    selectedOffers,
    travelDate,
    travelersCount,
  ]);

  const handleSubmitPilotInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedOffers.length === 0) {
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
        travelersCount,
        requestedDeparture: travelDate.trim() || 'رحلات تركيا اليومية 2026',
        message: [
          `الرحلات: ${selectedOffers.map((x) => x.title).join(' + ')}`,
          `المجموع التقديري: ${estimatedTotalDt} د.ت`,
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

  return (
    <div dir="rtl" className="font-arabic bg-[#FAF9F6] text-[#0B162C]">
      {/* Sticky Official Easy2Book Brand Navigation */}
      <header className="sticky top-0 z-30 border-b border-[#0B162C]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/aistudio/logo_transparent_e9918557.png"
              alt="Easy2Book"
              className="h-10 w-auto object-contain"
            />
            <span className="text-sm font-extrabold text-[#0B162C] whitespace-nowrap">
              Easy2Book
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#0B162C]/80">
            <a
              href="#turkey-pilot-video"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              الفيديو الإعلاني
            </a>
            <a
              href="#turkey-pilot-catalog"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              الرحلات والسهرات
            </a>
            <a
              href="#turkey-pilot-transfers"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              توصيل المطار والخدمات
            </a>
            <a
              href="#turkey-pilot-gallery"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              معرض الصور
            </a>
            <a
              href="#turkey-pilot-booking"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              احجز الآن
            </a>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <SocialPosterControl
              variant="pilot_header"
              locale="ar"
              page={page}
              language="ar"
              pageTitle={page.title}
              slug={snapshot.seo.slug}
              universe="voyages"
              photoKey="turkey_istanbul_reel"
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
              href="#turkey-pilot-booking"
              className="rounded-lg bg-[#0B162C] px-4 py-2 text-xs font-bold text-white hover:bg-[#1C4967] whitespace-nowrap shrink-0"
            >
              احجز رحلتك الآن
            </a>
          </div>
        </div>
      </header>

      {/* HERO + 9:16 REEL VIDEO PLAYER + TUNISIAN FEMININE VOICEOVER */}
      <section
        id="turkey-pilot-video"
        className="border-b border-[#0B162C]/10 bg-gradient-to-b from-[#FAF9F6] to-white py-12 md:py-16"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#9A6E1B]">
              <span>رحلات تركيا اليومية</span>
              <span aria-hidden="true">·</span>
              <span>أسعار Easy2Book بالدينار التونسي</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular" dir="ltr">
                98 140 514
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#0B162C]">
              اكتشف سحر إسطنبول، صبنجا وأنطاليا...{' '}
              <span className="text-[#C8922A]">برحلات وسهرات Easy2Book</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-[#475569]">
              جميع الرحلات اليومية في تركيا (صبنجا، إزميت، بورصا، شيلا وأغوا، يلوا)،
              سفن جزر الأميرات والسهرات المسائية العربية والتركية على البسفور، تكت
              فيالاند، باقة أنطاليا للثنائي وتوصيل مطار إسطنبول وصبيحة بسيارات خاصة.
            </p>

            {/* Voiceover & Timeline Controls */}
            <div className="rounded-2xl border border-[#0B162C]/12 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void startOrToggleVoiceover()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8922A] px-5 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#b58222] whitespace-nowrap"
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
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B162C]/15 px-3.5 py-3 text-xs font-bold text-[#0B162C] hover:bg-[#FAF9F6] whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  إعادة من البداية
                </button>

                <button
                  type="button"
                  onClick={() => setShowCaptions((c) => !c)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B162C]/15 px-3.5 py-3 text-xs font-bold text-[#0B162C] hover:bg-[#FAF9F6] whitespace-nowrap"
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B162C] px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#1C4967] disabled:opacity-60 whitespace-nowrap"
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
                  photoKey="turkey_istanbul_reel"
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
                          selectedVoice === v.id
                            ? 'text-[#E7B34C]'
                            : 'text-slate-500'
                        }`}
                      >
                        · {v.tone}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {videoExporting && (
                <div
                  data-pdf-exclude="true"
                  className="rounded-xl border border-[#C8922A]/40 bg-[#FAF9F6] p-3.5 space-y-2"
                >
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
                <div
                  data-pdf-exclude="true"
                  className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>
                        الفيديو جاهز للتحميل ({videoExportResult.format.toUpperCase()} · 9:16 HD)
                      </span>
                    </div>
                    <span
                      className="font-mono-tabular text-[11px] font-semibold text-emerald-800"
                      dir="ltr"
                    >
                      {formatFileSize(videoExportResult.sizeBytes)} ·{' '}
                      {videoExportResult.durationSec}s
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

                  <div
                    className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-1.5"
                    dir="ltr"
                  >
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
                      {getSocialCaptionBlocks('turkey_excursions').map((cap) => (
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

      {/* CATALOG: DAILY EXCURSIONS, CRUISES, VIALAND, PACK ANTALYA & AIRPORT TRANSFERS */}
      <section
        id="turkey-pilot-catalog"
        className="bg-white py-16 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#C8922A]">
                برنامج رحلات تركيا اليومية · الأسعار بالدينار التونسي (د.ت) · Easy2Book
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0B162C]">
                الرحلات اليومية، سفن جزر الأميرات، سهرات البسفور وأنطاليا
              </h2>
            </div>
            <a
              href="#turkey-pilot-booking"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B162C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967] whitespace-nowrap shrink-0"
            >
              <span>حاسبة الباقة المختارة ({selectedOffers.length})</span>
            </a>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-1.5">
            {TURKEY_CATEGORY_TABS.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#0B162C] text-white shadow-xs'
                      : 'text-[#0B162C]/75 hover:bg-white hover:text-[#0B162C]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer, idx) => {
              const isSelected = selectedOfferIds.includes(offer.id);
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B162C]/85 via-[#0B162C]/25 to-transparent" />
                      <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between gap-2 text-white">
                        <p className="font-mono-tabular text-xl font-extrabold">
                          {offer.priceDt.toLocaleString('en-US')} د.ت
                        </p>
                        <span className="text-[11px] font-semibold text-[#F5D68A]">
                          {offer.unitLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-[#9A6E1B]">
                        <span className="font-mono-tabular">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{offer.categoryLabel}</span>
                      </div>
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
                      onClick={() => toggleOfferSelection(offer.id)}
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

      {/* STRUCTURED TARIFF SUMMARY: TRANSFERS + SPECIAL SERVICES Easy2Book */}
      <section
        id="turkey-pilot-transfers"
        className="bg-[#FAF9F6] py-14 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto grid max-w-[1200px] gap-6 px-5 lg:grid-cols-12">
          <div className="lg:col-span-6 rounded-2xl border border-[#0B162C]/12 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9A6E1B]">
              <Car className="h-4 w-4 text-[#C8922A]" />
              <span>توصيل المطارات في إسطنبول · سيارات خاصة مكيفة</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0B162C]">
              أسعار توصيل مطار إسطنبول (IST) ومطار صبيحة (SAW)
            </h3>
            <div className="divide-y divide-[#0B162C]/10 text-xs">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold text-[#0B162C]">
                    سيارة فيتو خاصة (6 أشخاص · 6 شنط كبيرة)
                  </p>
                  <p className="text-[#475569]">مطار إسطنبول الجديد (IST)</p>
                </div>
                <span className="font-mono-tabular text-base font-extrabold text-[#0B162C]">
                  185 د.ت
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold text-[#0B162C]">
                    سيارة فيتو خاصة (6 أشخاص · 6 شنط كبيرة)
                  </p>
                  <p className="text-[#475569]">مطار صبيحة كوكجن (SAW)</p>
                </div>
                <span className="font-mono-tabular text-base font-extrabold text-[#0B162C]">
                  195 د.ت
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold text-[#0B162C]">
                    حافلة سبرنتر خاصة (14 شخص · 11 شنطة كبيرة)
                  </p>
                  <p className="text-[#475569]">مطار إسطنبول الجديد (IST)</p>
                </div>
                <span className="font-mono-tabular text-base font-extrabold text-[#0B162C]">
                  245 د.ت
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold text-[#0B162C]">
                    حافلة سبرنتر خاصة (14 شخص · 11 شنطة كبيرة)
                  </p>
                  <p className="text-[#475569]">مطار صبيحة كوكجن (SAW)</p>
                </div>
                <span className="font-mono-tabular text-base font-extrabold text-[#0B162C]">
                  265 د.ت
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-[#0B162C]/12 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9A6E1B]">
              <Sparkles className="h-4 w-4 text-[#C8922A]" />
              <span>خدمات Easy2Book في تركيا · 98 140 514</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0B162C]">
              خدماتنا المتكاملة وباقات المبيت والسيارات الخاصة
            </h3>
            <ul className="space-y-2.5">
              {EASY2BOOK_TURKEY_SERVICES.map((srv) => (
                <li
                  key={srv}
                  className="flex items-center gap-2.5 text-sm font-semibold text-[#0B162C]/90"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C8922A]" />
                  <span>{srv}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-[#C8922A]/35 bg-[#FBF9F4] p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#0B162C]">
                  باقي قوائم الأسعار (رحلات مبيت · سيارات خاصة · أنطاليا)
                </p>
                <p className="text-[11px] text-[#475569]">
                  تُرسل عند الطلب مباشرة عبر مركز الحجوزات Easy2Book
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1FB857] whitespace-nowrap"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>اطلب العرض · 98 140 514</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL TURKEY PHOTO GALLERY */}
      <section
        id="turkey-pilot-gallery"
        className="bg-white py-14 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8922A]">
                <Camera className="h-3.5 w-3.5" />
                <span>معرض الصور الاحترافية · إسطنبول، صبنجا، البسفور وأنطاليا</span>
              </p>
              <h2 className="mt-1.5 text-2xl md:text-3xl font-extrabold text-[#0B162C]">
                لقطات حقيقية من رحلات Easy2Book في تركيا
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
                className="group overflow-hidden rounded-2xl border border-[#0B162C]/10 bg-[#FAF9F6] text-right shadow-2xs transition-all hover:border-[#C8922A] hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3.5 space-y-1">
                  <p className="font-mono-tabular text-[11px] font-bold text-[#9A6E1B]">
                    {photo.badge}
                  </p>
                  <p className="text-xs font-extrabold text-[#0B162C]">
                    {photo.title}
                  </p>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE ESTIMATOR + WHATSAPP 98140514 & CRM FORM */}
      <section id="turkey-pilot-booking" className="bg-[#0B162C] py-16 text-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12">
          {/* Left: Quick Reference Summary & Travelers Count */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-bold text-[#F5D68A]">
                حاسبة الأسعار الرسمية بالدينار التونسي (د.ت)
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                احسب باقة رحلاتك في تركيا في ثوانٍ
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                حدّد عدد المسافرين واختر الرحلات اليومية أو سهرات البسفور أو سيارات
                التوصيل لتظهر لك الفاتورة التقديرية مباشرة.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 space-y-3">
              <p className="text-xs font-bold text-[#F5D68A]">
                1. عدد المسافرين للرحلات الفردية والسهرات:
              </p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTravelersCount(count)}
                    className={`rounded-lg border px-3 py-1.5 font-mono-tabular text-xs font-bold transition-colors ${
                      travelersCount === count
                        ? 'border-[#C8922A] bg-[#C8922A] text-[#0B162C]'
                        : 'border-white/20 bg-white/5 text-white hover:bg-white/15'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-300">
                ملاحظة: أسعار سيارات فيتو وسبرنتر ثابتة للسيارة كاملة، وباقة أنطاليا
                بسعر الثنائي (1,125 د.ت).
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-2.5 text-xs">
              <p className="font-bold text-[#F5D68A]">
                ملخص أبرز أسعار Easy2Book في تركيا:
              </p>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="inline-flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-[#F5D68A]" />
                  الرحلات اليومية (صبنجا، إزميت، بورصا، شيلا، يلوا)
                </span>
                <span className="font-mono-tabular font-bold text-[#F5D68A]">
                  65 – 145 د.ت
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="inline-flex items-center gap-1.5">
                  <Ship className="h-3.5 w-3.5 text-[#F5D68A]" />
                  جزر الأميرات والسهرات العربية والتركية
                </span>
                <span className="font-mono-tabular font-bold text-[#F5D68A]">
                  105 – 175 د.ت
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="inline-flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5 text-[#F5D68A]" />
                  تكت فيالاند / باقة أنطاليا ثنائي
                </span>
                <span className="font-mono-tabular font-bold text-[#F5D68A]">
                  245 / 1,125 د.ت
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="inline-flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-[#F5D68A]" />
                  توصيل المطار الخاص (فيتو / سبرنتر)
                </span>
                <span className="font-mono-tabular font-bold text-[#F5D68A]">
                  185 – 265 د.ت
                </span>
              </div>
            </div>
          </div>

          {/* Right: Multi-Offer Booking Form & WhatsApp / CRM */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white p-6 md:p-8 text-[#0B162C] shadow-xl">
              <div className="border-b border-[#0B162C]/10 pb-4">
                <p className="text-xs font-bold text-[#C8922A]">
                  احسب باقتك المخصصة وأرسل طلبك فوراً
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  نموذج الحجز المباشر لرحلات تركيا (98 140 514)
                </h3>
              </div>

              {dispatchResult ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold">
                          تم تجهيز طلب حجز رحلات تركيا بنجاح عبر عقد التكامل مع CRM
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
                      إرسال التفاصيل الآن عبر واتساب Business (98 140 514)
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
                  <div>
                    <label className="block text-xs font-bold text-[#0B162C] mb-2">
                      الرحلات والخدمات المضافة ({selectedOffers.length} مختارة):
                    </label>
                    <div className="max-h-60 overflow-y-auto grid gap-2 sm:grid-cols-2 pe-1">
                      {TURKEY_EXCURSIONS_CATALOG.map((ex) => {
                        const checked = selectedOfferIds.includes(ex.id);
                        const itemTotal = computeOfferTotal(ex);
                        return (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => toggleOfferSelection(ex.id)}
                            className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 text-right transition-colors ${
                              checked
                                ? 'border-[#C8922A] bg-[#FBF9F4]'
                                : 'border-[#0B162C]/12 bg-white hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#0B162C] truncate">
                                {ex.title}
                              </p>
                              <p className="text-[10px] text-[#475569] truncate">
                                {ex.priceDt.toLocaleString('en-US')} د.ت ·{' '}
                                {ex.unitLabel}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono-tabular text-xs font-extrabold text-[#102D45]">
                                {itemTotal.toLocaleString('en-US')} د.ت
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

                  {travelersCount > 10 && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-950">
                      <Users className="h-4 w-4 shrink-0 text-amber-700" />
                      <span>
                        للمجموعات الكبيرة يرجى التواصل على 98 140 514 لتأكيد التوفر.
                      </span>
                    </div>
                  )}

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
                        تاريخ السفر إلى تركيا
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: أكتوبر 2026 / إسطنبول"
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
                      placeholder="مثال: اسم الفندق في تقسيم/الفاتح، طلب رحلات مبيت أو سيارة خاصة"
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
                        المجموع التقديري للباقة المختارة ({travelersCount} مسافرين)
                      </p>
                      <p className="font-mono-tabular text-2xl font-extrabold text-[#0B162C]">
                        {estimatedTotalDt.toLocaleString('en-US')} د.ت
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
              <p className="text-sm font-bold">Easy2Book · سفرتك أسهل</p>
              <p className="text-xs text-slate-300">
                الصفحة الرائدة · وحدة رحلات تركيا اليومية · إسطنبول، صبنجا، البسفور وأنطاليا
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
              <p className="font-mono-tabular text-[11px] font-bold text-[#9A6E1B]">
                {lightboxPhoto.badge}
              </p>
              <h3 className="mt-1 text-lg font-extrabold text-[#0B162C]">
                {lightboxPhoto.title}
              </h3>
              <p className="mt-1 text-xs text-[#475569]">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
