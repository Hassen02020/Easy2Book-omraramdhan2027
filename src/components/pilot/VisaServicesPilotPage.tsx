import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
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
import { EVISA_53_COUNTRIES } from '../../data/visaTypesCatalog';
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

type VisaCategory =
  | 'all'
  | 'egypt_schengen'
  | 'gulf_omra'
  | 'china_intl'
  | 'new_destinations';

interface VisaServiceOffer {
  id: string;
  category: Exclude<VisaCategory, 'all'>;
  countryGroup: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  priceDt: number;
  unitLabel: string;
  delayLabel: string;
  noteLabel?: string;
  supportsExpressDubai?: boolean;
  imageSrc: string;
  requiredDocs: string[];
}

const VISA_CATEGORY_TABS: { id: VisaCategory; label: string }[] = [
  { id: 'all', label: 'كل التأشيرات والملفات (33)' },
  { id: 'egypt_schengen', label: 'مصر وفضاء شنغن (6)' },
  { id: 'gulf_omra', label: 'دبي، قطر، عُمان والعمرة (19)' },
  { id: 'china_intl', label: 'الصين والدولية (6)' },
  { id: 'new_destinations', label: 'ألبانيا وتايلاند (2)' },
];

/**
 * Catalogue complet des services Visa & E-Visa Easy2Book (Novembre 2026)
 * Tarifs publics Easy2Book avec majoration +30 TND appliquée à chaque prestation.
 */
const VISA_SERVICES_CATALOG: VisaServiceOffer[] = [
  // === 1. VISA ÉGYPTE (4) ===
  {
    id: 'visa-eg-tunisia',
    category: 'egypt_schengen',
    countryGroup: 'مصر · Visa Égypte',
    categoryLabel: 'مصر · ضمان السفر (في 4 ساعات)',
    title: 'ضمان فيزا مصر · انطلاق من تونس',
    subtitle: 'إصدار ضمان / موافقة السفر إلى مصر للمسافرين المنطلقين من تونس في أجل قياسي.',
    priceDt: 90,
    unitLabel: 'للمسافر الواحد',
    delayLabel: '4 ساعات',
    imageSrc: HERO_MEDIA_MAP.egypt_pyramids_museum.src,
    requiredDocs: ['نسخة من جواز السفر', 'تذكرة الطائرة'],
  },
  {
    id: 'visa-eg-other',
    category: 'egypt_schengen',
    countryGroup: 'مصر · Visa Égypte',
    categoryLabel: 'مصر · ضمان السفر (انطلاق دولي)',
    title: 'ضمان فيزا مصر · انطلاق من دولة أخرى',
    subtitle: 'خدمة ضمان السفر إلى مصر عند الانطلاق من خارج تونس (تُؤكّد حسب الطلب).',
    priceDt: 150,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'حسب الطلب · ~4 ساعات',
    imageSrc: HERO_MEDIA_MAP.cairo_nile.src,
    requiredDocs: ['نسخة من جواز السفر', 'تذكرة الطائرة'],
  },
  {
    id: 'visa-eg-ssh-1',
    category: 'egypt_schengen',
    countryGroup: 'مصر · Visa Égypte',
    categoryLabel: 'مصر · شرم الشيخ / الإسكندرية / الغردقة',
    title: 'نزول شرم الشيخ / الإسكندرية / الغردقة (مسافر واحد)',
    subtitle: 'استقبال وموافقة النزول في مطارات شرم الشيخ أو الإسكندرية أو الغردقة لمسافر فردي.',
    priceDt: 350,
    unitLabel: 'ملف فردي (شخص واحد)',
    delayLabel: '4 ساعات',
    imageSrc: HERO_MEDIA_MAP.egypt_nile_dinner.src,
    requiredDocs: ['نسخة من جواز السفر', 'تذكرة الطائرة'],
  },
  {
    id: 'visa-eg-ssh-2p',
    category: 'egypt_schengen',
    countryGroup: 'مصر · Visa Égypte',
    categoryLabel: 'مصر · شرم الشيخ / الإسكندرية / الغردقة',
    title: 'نزول شرم الشيخ / الإسكندرية / الغردقة (ابتداءً من شخصين)',
    subtitle: 'تعريفة مخفضة للشخص الواحد عند السفر ابتداءً من مسافرين اثنين فأكثر.',
    priceDt: 300,
    unitLabel: 'للشخص (من شخصين فأكثر)',
    delayLabel: '4 ساعات',
    imageSrc: HERO_MEDIA_MAP.egypt_islamic_cairo.src,
    requiredDocs: ['نسخة من جواز السفر', 'تذكرة الطائرة'],
  },

  // === 2. ESPACE SCHENGEN (2) ===
  {
    id: 'visa-sh-std',
    category: 'egypt_schengen',
    countryGroup: 'فضاء شنغن · Espace Schengen',
    categoryLabel: 'فضاء شنغن · موعد عادي',
    title: 'ملف وموعد فيزا شنغن (عادي Standard)',
    subtitle: 'تجهيز ملف فيزا شنغن بالكامل وحجز الموعد العادي مع مراجعة الوثائق القنصلية.',
    priceDt: 180,
    unitLabel: 'للملف الواحد',
    delayLabel: 'حسب توفر المواعيد',
    imageSrc: HERO_MEDIA_MAP.visa_europe.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء'],
  },
  {
    id: 'visa-sh-prime',
    category: 'egypt_schengen',
    countryGroup: 'فضاء شنغن · Espace Schengen',
    categoryLabel: 'فضاء شنغن · موعد Prime Time',
    title: 'ملف وموعد فيزا شنغن (شامل Prime Time)',
    subtitle: 'تجهيز ملف فيزا شنغن بالكامل مع حجز موعد مميز Prime Time مضمون السرعة.',
    priceDt: 280,
    unitLabel: 'للملف الواحد',
    delayLabel: 'أولوية Prime Time',
    imageSrc: HERO_MEDIA_MAP.visa_europe.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء'],
  },

  // === 3. VISA QATAR (3) ===
  {
    id: 'visa-qa-tour',
    category: 'gulf_omra',
    countryGroup: 'قطر · Visa Qatar',
    categoryLabel: 'قطر · تأشيرة سياحية',
    title: 'فيزا قطر السياحية · شهر واحد',
    subtitle: 'تأشيرة سياحية لدولة قطر صالحة لمدة شهر واحد مع متابعة Easy2Book الكاملة.',
    priceDt: 170,
    unitLabel: 'للملف الواحد',
    delayLabel: 'إصدار سريع',
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-qa-work-m',
    category: 'gulf_omra',
    countryGroup: 'قطر · Visa Qatar',
    categoryLabel: 'قطر · فيزا سنوية / عمل (رجل)',
    title: 'فيزا قطر السنوية / العمل · رجل (بدون ID قطر)',
    subtitle: 'تأشيرة عمل / سنوية للرجال إلى قطر (بدون بطاقة الإقامة القطرية ID).',
    priceDt: 1380,
    unitLabel: 'للملف الواحد',
    delayLabel: 'حسب الإجراءات القنصلية',
    noteLabel:
      'يُضاف 1650 ريال قطري (تدفع في قطر: فحص طبي، بصمة، بطاقة إقامة)',
    imageSrc: HERO_MEDIA_MAP.visa_desk.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-qa-work-f',
    category: 'gulf_omra',
    countryGroup: 'قطر · Visa Qatar',
    categoryLabel: 'قطر · فيزا سنوية / عمل (امرأة)',
    title: 'فيزا قطر السنوية / العمل · امرأة (بدون ID قطر)',
    subtitle: 'تأشيرة عمل / سنوية للنساء إلى قطر (بدون بطاقة الإقامة القطرية ID).',
    priceDt: 1980,
    unitLabel: 'للملف الواحد',
    delayLabel: 'حسب الإجراءات القنصلية',
    noteLabel:
      'يُضاف 1650 ريال قطري (تدفع في قطر: فحص طبي، بصمة، بطاقة إقامة)',
    imageSrc: HERO_MEDIA_MAP.visa_desk.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },

  // === 4. VISA DUBAÏ (10) ===
  {
    id: 'visa-dxb-gar-1m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · بالضمان (رجل وامرأة)',
    title: 'فيزا دبي بالضمان · شهر واحد · دخول واحد',
    subtitle: 'تأشيرة دخول واحد لدبي لمدة 30 يوماً مع الضمان (صالحة للرجال والنساء).',
    priceDt: 350,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع (Express 48–72h متوفر)',
    noteLabel: 'خيار Express سريع (+60 د.ت) خلال 48–72 ساعة خارج عطلة نهاية الأسبوع',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-gar-2m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · بالضمان (رجل وامرأة)',
    title: 'فيزا دبي بالضمان · شهران · دخول واحد',
    subtitle: 'تأشيرة دخول واحد لدبي لمدة 60 يوماً مع الضمان (صالحة للرجال والنساء).',
    priceDt: 550,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع (Express 48–72h متوفر)',
    noteLabel: 'خيار Express سريع (+60 د.ت) خلال 48–72 ساعة خارج عطلة نهاية الأسبوع',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-nogar-1m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · بدون ضمان (رجل وامرأة)',
    title: 'فيزا دبي بدون ضمان · شهر واحد · دخول واحد',
    subtitle: 'تأشيرة دخول واحد لدبي لمدة شهر بدون الحاجة لضمان مالي (رجل وامرأة).',
    priceDt: 430,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع (Express 48–72h متوفر)',
    noteLabel: 'خيار Express سريع (+60 د.ت) خلال 48–72 ساعة خارج عطلة نهاية الأسبوع',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-nogar-2m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · بدون ضمان (رجل وامرأة)',
    title: 'فيزا دبي بدون ضمان · شهران · دخول واحد',
    subtitle: 'تأشيرة دخول واحد لدبي لمدة شهرين بدون ضمان مالي (رجل وامرأة).',
    priceDt: 680,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع (Express 48–72h متوفر)',
    noteLabel: 'خيار Express سريع (+60 د.ت) خلال 48–72 ساعة خارج عطلة نهاية الأسبوع',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-res-2y',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · إقامة سنتان (شاملة ID)',
    title: 'إقامة دبي لمدة سنتين · رجل وامرأة (ID شاملة)',
    subtitle: 'إصدار إقامة كاملة في دبي لمدة سنتين شاملة بطاقة الهوية الإماراتية ID.',
    priceDt: 6830,
    unitLabel: 'للملف الواحد',
    delayLabel: '15 إلى 20 يوماً',
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-child-1m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · طفل أقل من 12 سنة',
    title: 'فيزا دبي للطفل (أقل من 12 سنة) · شهر واحد',
    subtitle: 'تأشيرة دبي المخصصة للأطفال دون 12 سنة صالحة لمدة شهر واحد.',
    priceDt: 330,
    unitLabel: 'للطفل الواحد',
    delayLabel: 'يومين إلى أسبوع',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-child-2m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · طفل أقل من 12 سنة',
    title: 'فيزا دبي للطفل (أقل من 12 سنة) · شهران',
    subtitle: 'تأشيرة دبي المخصصة للأطفال دون 12 سنة صالحة لمدة شهرين.',
    priceDt: 430,
    unitLabel: 'للطفل الواحد',
    delayLabel: 'يومين إلى أسبوع',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-multi-1m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · دخول متعدد Multi-entrée',
    title: 'فيزا دبي متعددة الدخول · شهر واحد',
    subtitle: 'تأشيرة دخول متعدد إلى الإمارات صالحة لمدة شهر واحد للرجال والنساء.',
    priceDt: 710,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع (Express 48–72h متوفر)',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-multi-2m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · دخول متعدد Multi-entrée',
    title: 'فيزا دبي متعددة الدخول · شهران',
    subtitle: 'تأشيرة دخول متعدد إلى الإمارات صالحة لمدة شهرين للرجال والنساء.',
    priceDt: 1010,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع (Express 48–72h متوفر)',
    supportsExpressDubai: true,
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-dxb-ext-1m',
    category: 'gulf_omra',
    countryGroup: 'دبي · Visa Dubaï',
    categoryLabel: 'دبي · تمديد داخل الإمارات',
    title: 'تمديد فيزا دبي داخل الإمارات · شهر واحد',
    subtitle: 'تمديد الإقامة السياحية من داخل دولة الإمارات لمدة شهر واحد دون مغادرة.',
    priceDt: 1110,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'معالجة داخلية سريعة',
    imageSrc: HERO_MEDIA_MAP.dubai_skyline.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },

  // === 5. VISA OMAN (5) ===
  {
    id: 'visa-om-10d',
    category: 'gulf_omra',
    countryGroup: 'عُمان · Visa Oman',
    categoryLabel: 'سلطنة عُمان · تأشيرة 10 أيام',
    title: 'فيزا عُمان السياحية · 10 أيام',
    subtitle: 'تأشيرة سياحية سريعة لسلطنة عُمان صالحة لمدة 10 أيام.',
    priceDt: 230,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع',
    imageSrc: HERO_MEDIA_MAP.airline_business_cabin.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-om-1m-m',
    category: 'gulf_omra',
    countryGroup: 'عُمان · Visa Oman',
    categoryLabel: 'سلطنة عُمان · شهر واحد (رجل)',
    title: 'فيزا عُمان السياحية · شهر واحد · رجل',
    subtitle: 'تأشيرة سياحية لسلطنة عُمان صالحة لمدة شهر واحد (رجال).',
    priceDt: 330,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'يومين إلى أسبوع',
    imageSrc: HERO_MEDIA_MAP.airline_business_cabin.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-om-1m-f',
    category: 'gulf_omra',
    countryGroup: 'عُمان · Visa Oman',
    categoryLabel: 'سلطنة عُمان · شهر واحد (امرأة)',
    title: 'فيزا عُمان السياحية · شهر واحد · امرأة',
    subtitle: 'تأشيرة سياحية لسلطنة عُمان صالحة لمدة شهر واحد (نساء).',
    priceDt: 380,
    unitLabel: 'للمسافرة الواحدة',
    delayLabel: 'يومين إلى أسبوع',
    imageSrc: HERO_MEDIA_MAP.airline_business_cabin.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-om-res-m',
    category: 'gulf_omra',
    countryGroup: 'عُمان · Visa Oman',
    categoryLabel: 'سلطنة عُمان · إقامة سنتان (رجل)',
    title: 'إقامة سلطنة عُمان سنتان · رجل (ID شاملة)',
    subtitle: 'تأشيرة إقامة عُمان لمدة سنتين للرجال شاملة بطاقة الإقامة ID.',
    priceDt: 7530,
    unitLabel: 'للملف الواحد',
    delayLabel: '15 إلى 20 يوماً',
    imageSrc: HERO_MEDIA_MAP.airline_business_cabin.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },
  {
    id: 'visa-om-res-f',
    category: 'gulf_omra',
    countryGroup: 'عُمان · Visa Oman',
    categoryLabel: 'سلطنة عُمان · إقامة سنتان (امرأة)',
    title: 'إقامة سلطنة عُمان سنتان · امرأة (ID شاملة)',
    subtitle: 'تأشيرة إقامة عُمان لمدة سنتين للنساء شاملة بطاقة الإقامة ID.',
    priceDt: 9530,
    unitLabel: 'للملف الواحد',
    delayLabel: '15 إلى 20 يوماً',
    imageSrc: HERO_MEDIA_MAP.airline_business_cabin.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء ممسوحة بوضوح'],
  },

  // === 6. VISA OMRA (1) ===
  {
    id: 'visa-omra',
    category: 'gulf_omra',
    countryGroup: 'العمرة · السعودية',
    categoryLabel: 'المملكة العربية السعودية · تأشيرة العمرة',
    title: 'فيزا العمرة (شاملة المتابعة و Saudi Bio)',
    subtitle: 'إصدار تأشيرة العمرة إلكترونياً بعد استكمال رمز البصمة Saudi Bio وحجز الطيران.',
    priceDt: 820,
    unitLabel: 'للمعتمر الواحد',
    delayLabel: 'إصدار إلكتروني سريع',
    imageSrc: HERO_MEDIA_MAP.omra_vip_haram.src,
    requiredDocs: [
      'نسخة من جواز السفر',
      'صورة شمسية خلفية بيضاء',
      'تذكرة الطائرة',
      'رمز البصمة السعودية (Saudi Bio)',
    ],
  },

  // === 7. VISA CHINE (2) ===
  {
    id: 'visa-cn-tour',
    category: 'china_intl',
    countryGroup: 'الصين · Visa Chine',
    categoryLabel: 'الصين · تأشيرة سياحية',
    title: 'فيزا الصين السياحية (ملف متكامل)',
    subtitle: 'معالجة وتجهيز ملف التأشيرة السياحية إلى جمهورية الصين الشعبية.',
    priceDt: 1830,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'حسب مواعيد السفارة',
    imageSrc: HERO_MEDIA_MAP.visa_desk.src,
    requiredDocs: [
      'نسخة من جواز السفر',
      'صورة شمسية خلفية بيضاء',
      'استمارة طلب التأشيرة',
      'كشوفات حساب بنكية',
      'بطاقة السوابق العدلية (B3)',
      'شهادة عمل',
    ],
  },
  {
    id: 'visa-cn-inv',
    category: 'china_intl',
    countryGroup: 'الصين · Visa Chine',
    categoryLabel: 'الصين · دعوة رسمية للأعمال',
    title: 'دعوة رسمية للصين (Invitation officielle)',
    subtitle: 'استصدار دعوة رسمية معتمدة لملف فيزا الأعمال أو الزيارات التجارية إلى الصين.',
    priceDt: 3030,
    unitLabel: 'للملف الواحد',
    delayLabel: 'حسب نوع الدعوة',
    imageSrc: HERO_MEDIA_MAP.visa_desk.src,
    requiredDocs: [
      'نسخة من جواز السفر',
      'صورة شمسية خلفية بيضاء',
      'شهادة عمل / سجل تجاري',
    ],
  },

  // === 8. DOSSIERS INTERNATIONAUX (4) ===
  {
    id: 'visa-intl-ca',
    category: 'china_intl',
    countryGroup: 'دولية · كندا وأمريكا وبريطانيا وأستراليا',
    categoryLabel: 'ملف دولي · كندا',
    title: 'تحضير ملف وحجز موعد كندا (Canada)',
    subtitle: 'تجهيز استمارة وملف فيزا كندا بالكامل شامل حجز الموعد الرسمي.',
    priceDt: 830,
    unitLabel: 'للملف الواحد',
    delayLabel: 'موعد مشمول',
    imageSrc: HERO_MEDIA_MAP.visa_canada.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء'],
  },
  {
    id: 'visa-intl-us',
    category: 'china_intl',
    countryGroup: 'دولية · كندا وأمريكا وبريطانيا وأستراليا',
    categoryLabel: 'ملف دولي · الولايات المتحدة',
    title: 'تحضير ملف وحجز موعد أمريكا (USA)',
    subtitle: 'تعبئة استمارة DS-160 وتجهيز الملف بالكامل مع حجز موعد السفارة الأمريكية.',
    priceDt: 1030,
    unitLabel: 'للملف الواحد',
    delayLabel: 'موعد مشمول',
    imageSrc: HERO_MEDIA_MAP.visa_canada.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء'],
  },
  {
    id: 'visa-intl-uk',
    category: 'china_intl',
    countryGroup: 'دولية · كندا وأمريكا وبريطانيا وأستراليا',
    categoryLabel: 'ملف دولي · بريطانيا',
    title: 'تحضير ملف وحجز موعد بريطانيا (UK)',
    subtitle: 'تجهيز ملف تأشيرة المملكة المتحدة عبر الإنترنت وحجز موعد تسليم البيومتري.',
    priceDt: 1430,
    unitLabel: 'للملف الواحد',
    delayLabel: 'موعد مشمول',
    imageSrc: HERO_MEDIA_MAP.visa_europe.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء'],
  },
  {
    id: 'visa-intl-au',
    category: 'china_intl',
    countryGroup: 'دولية · كندا وأمريكا وبريطانيا وأستراليا',
    categoryLabel: 'ملف دولي · أستراليا',
    title: 'تحضير ملف وحجز موعد أستراليا (Australie)',
    subtitle: 'إعداد وتدقيق ملف تأشيرة أستراليا الإلكتروني مع حجز الموعد اللازم.',
    priceDt: 1530,
    unitLabel: 'للملف الواحد',
    delayLabel: 'موعد مشمول',
    imageSrc: HERO_MEDIA_MAP.visa_canada.src,
    requiredDocs: ['نسخة من جواز السفر', 'صورة شمسية خلفية بيضاء'],
  },

  // === 9. NOUVELLES DESTINATIONS (2) ===
  {
    id: 'visa-albania',
    category: 'new_destinations',
    countryGroup: 'وجهات جديدة · ألبانيا',
    categoryLabel: 'ألبانيا · شاملة معاليم التأشيرة والترجمة',
    title: 'فيزا ألبانيا (معاليم + ترجمة Easy2Book مشمولة)',
    subtitle:
      'تشمل معاليم التأشيرة والترجمة الكاملة للوثائق إلى الإنجليزية من قبل فريق Easy2Book.',
    priceDt: 380,
    unitLabel: 'للملف الواحد (شامل الترجمة)',
    delayLabel: 'شامل الترجمة للإنجليزية',
    noteLabel: 'معاليم الفيزا والترجمة للإنجليزية مشمولة بالكامل لدى Easy2Book',
    imageSrc: HERO_MEDIA_MAP.visa_europe.src,
    requiredDocs: [
      'جواز السفر ساري المفعول',
      'شهادة عمل أو مضمون السجل التجاري RNE + الباتيندا',
      'إذن عطلة (Titre de congé)',
      'آخر 3 بطاقات خلاص (3 dernières fiches de paie)',
      'كشف حساب بنكي لآخر 12 شهراً',
      'صورة شمسية خلفية بيضاء',
      'عقد زواج (للمتزوجين)',
    ],
  },
  {
    id: 'visa-thailand',
    category: 'new_destinations',
    countryGroup: 'وجهات جديدة · تايلاند',
    categoryLabel: 'تايلاند · تأشيرة سياحية',
    title: 'فيزا تايلاند السياحية (Visa Thaïlande)',
    subtitle: 'إيداع ومتابعة ملف فيزا تايلاند السياحية مع تدقيق كافة الحجوزات المرفقة.',
    priceDt: 130,
    unitLabel: 'للمسافر الواحد',
    delayLabel: 'ملف مبسّط وسريع',
    imageSrc: HERO_MEDIA_MAP.visa_desk.src,
    requiredDocs: [
      'جواز السفر ساري المفعول',
      'كشف حساب بنكي (Extrait bancaire)',
      'صورة شمسية خلفية بيضاء',
      'تذكرة الطائرة',
      'حجز فندقي (Réservation d’hôtel)',
    ],
  },
];

const GALLERY_PHOTOS = [
  {
    id: 'visa-gal-1',
    src: HERO_MEDIA_MAP.visa_desk.src,
    badge: 'مصر في 4 ساعات · من 90 د.ت',
    title: 'تأشيرة وضمان مصر والملفات القنصلية',
    caption: 'تجهيز فوري لضمان مصر والملفات المعتمدة مع متابعة Easy2Book المباشرة.',
  },
  {
    id: 'visa-gal-2',
    src: HERO_MEDIA_MAP.visa_europe.src,
    badge: 'فضاء شنغن · من 180 د.ت',
    title: 'ملفات ومواعيد شنغن وبريطانيا وألبانيا',
    caption: 'مواعيد Standard و Prime Time مع مراجعة دقيقة لكل وثيقة قبل الإيداع.',
  },
  {
    id: 'visa-gal-3',
    src: HERO_MEDIA_MAP.dubai_skyline.src,
    badge: 'دبي وقطر وعُمان · من 170 د.ت',
    title: 'تأشيرات الخليج السياحية وإقامات السنتين',
    caption: 'إصدار تأشيرات دبي وقطر وعُمان مع خيار Express لدبي خلال 48–72 ساعة.',
  },
  {
    id: 'visa-gal-4',
    src: HERO_MEDIA_MAP.visa_canada.src,
    badge: 'دولية و E-Visa · 53 دولة',
    title: 'كندا، أمريكا، أستراليا و E-Visa العالمي',
    caption: 'تغطية عالمية تشمل ملفات أمريكا الشمالية والصين و53 وجهة E-Visa حسب الطلب.',
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

interface VisaServicesPilotPageProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  crmConfig: CrmIntegrationConfig;
  defaultVoiceId?: string;
}

/**
 * Page Pilote Complète : "Easy2Book — خدمات الفيزا و E-Visa الشاملة (98 140 514)"
 * - Lecteur Vidéo 9:16 + Timeline Scrubber + 4 Scènes Visa + Voix féminine tunisienne Gemini TTS (Layla par défaut)
 * - Génération & téléchargement direct de la vidéo MP4 9:16 + Export Brochure PDF
 * - Catalogue complet avec majoration +30 DT (33 formules Visa + Option Express Dubaï +60 DT + 53 pays E-Visa)
 * - Calculateur interactif + WhatsApp Business 98 140 514 + CRM Easy2Book
 */
export function VisaServicesPilotPage({
  page,
  snapshot,
  crmConfig,
  defaultVoiceId,
}: VisaServicesPilotPageProps) {
  const reelConfig = useMemo(() => getReelConfig('visa_services'), []);
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

  const [activeCategory, setActiveCategory] = useState<VisaCategory>('all');
  const [evisaSearch, setEvisaSearch] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState<
    (typeof GALLERY_PHOTOS)[number] | null
  >(null);

  // Interactive Booking Estimator
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [dubaiExpressOption, setDubaiExpressOption] = useState<boolean>(false);
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([
    'visa-eg-tunisia',
    'visa-dxb-gar-1m',
  ]);
  const [selectedEvisaCountries, setSelectedEvisaCountries] = useState<string[]>(
    []
  );
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
    setVideoExportStatus('جاري تحضير فيديو خدمات الفيزا 9:16...');

    if (videoExportResult?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoExportResult.blobUrl);
    }

    try {
      const result = await generateVideoDownloadLink({
        voiceName: selectedVoice,
        showCaptions,
        preset: 'visa_services',
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
    if (activeCategory === 'all') return VISA_SERVICES_CATALOG;
    return VISA_SERVICES_CATALOG.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  const filteredEvisaCountries = useMemo(() => {
    const q = evisaSearch.trim().toLowerCase();
    if (!q) return EVISA_53_COUNTRIES;
    return EVISA_53_COUNTRIES.filter(
      (c) => c.fr.toLowerCase().includes(q) || c.ar.includes(q)
    );
  }, [evisaSearch]);

  const toggleOfferSelection = (id: string) => {
    setSelectedOfferIds((prev) =>
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

  const selectedOffers = useMemo(
    () =>
      VISA_SERVICES_CATALOG.filter((item) =>
        selectedOfferIds.includes(item.id)
      ),
    [selectedOfferIds]
  );

  const hasSelectedDubaiExpressCapable = useMemo(
    () => selectedOffers.some((o) => o.supportsExpressDubai),
    [selectedOffers]
  );

  const computeOfferTotal = (offer: VisaServiceOffer): number => {
    const expressExtra =
      dubaiExpressOption && offer.supportsExpressDubai ? 60 : 0;
    return (offer.priceDt + expressExtra) * travelersCount;
  };

  const estimatedTotalDt = useMemo(
    () =>
      selectedOffers.reduce((sum, offer) => sum + computeOfferTotal(offer), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOffers, travelersCount, dubaiExpressOption]
  );

  const consolidatedRequiredDocs = useMemo(() => {
    const docs = new Set<string>();
    selectedOffers.forEach((offer) => {
      offer.requiredDocs.forEach((d) => docs.add(d));
    });
    if (selectedEvisaCountries.length > 0 && docs.size === 0) {
      docs.add('نسخة من جواز السفر');
      docs.add('صورة شمسية خلفية بيضاء');
    }
    return Array.from(docs);
  }, [selectedEvisaCountries.length, selectedOffers]);

  const detailedWhatsAppHref = useMemo(() => {
    const lines = [
      'السلام عليكم فريق Easy2Book،',
      'أرغب في التقديم والاستفسار عن خدمات الفيزا و E-Visa:',
      `• عدد المسافرين: ${travelersCount}`,
      selectedOffers.length > 0
        ? `• التأشيرات والملفات المختارة (${selectedOffers.length}):`
        : '',
      ...selectedOffers.map(
        (v) =>
          `  - ${v.title}${dubaiExpressOption && v.supportsExpressDubai ? ' + Express 48–72h' : ''}: ${((v.priceDt + (dubaiExpressOption && v.supportsExpressDubai ? 60 : 0)) * travelersCount).toLocaleString('en-US')} د.ت`
      ),
      selectedOffers.length > 0
        ? `• المجموع التقديري: ${estimatedTotalDt.toLocaleString('en-US')} د.ت`
        : '',
      selectedEvisaCountries.length > 0
        ? `• وجهات E-Visa حسب الطلب (${selectedEvisaCountries.length}): ${selectedEvisaCountries.join('، ')}`
        : '',
      travelDate.trim() ? `• موعد السفر المتوقع: ${travelDate.trim()}` : '',
      fullName.trim() ? `• الاسم الكامل: ${fullName.trim()}` : '',
      phone.trim() ? `• رقم الهاتف: ${phone.trim()}` : '',
      email.trim() ? `• البريد الإلكتروني: ${email.trim()}` : '',
      notes.trim() ? `• ملاحظات: ${notes.trim()}` : '',
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  }, [
    dubaiExpressOption,
    email,
    estimatedTotalDt,
    fullName,
    notes,
    phone,
    selectedEvisaCountries,
    selectedOffers,
    travelDate,
    travelersCount,
  ]);

  const handleSubmitPilotInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedOffers.length === 0 && selectedEvisaCountries.length === 0) {
      setFormError(
        'يرجى اختيار خدمة فيزا واحدة على الأقل أو تحديد وجهة من قائمة E-Visa.'
      );
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
        requestedDeparture: travelDate.trim() || 'ملفات الفيزا 2026',
        message: [
          selectedOffers.length > 0
            ? `التأشيرات: ${selectedOffers.map((x) => x.title).join(' + ')}`
            : '',
          dubaiExpressOption && hasSelectedDubaiExpressCapable
            ? 'مع خيار دبي Express (+60 د.ت)'
            : '',
          selectedEvisaCountries.length > 0
            ? `E-Visa حسب الطلب: ${selectedEvisaCountries.join(', ')}`
            : '',
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
              href="#visa-pilot-video"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              الفيديو الإعلاني
            </a>
            <a
              href="#visa-pilot-catalog"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              أسعار التأشيرات والملفات
            </a>
            <a
              href="#visa-pilot-evisa"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              وجهات E-Visa (53 دولة)
            </a>
            <a
              href="#visa-pilot-gallery"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              معرض الصور
            </a>
            <a
              href="#visa-pilot-booking"
              className="hover:text-[#C8922A] whitespace-nowrap shrink-0"
            >
              تقديم ملف الآن
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
              universe="visa"
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
              href="#visa-pilot-booking"
              className="rounded-lg bg-[#0B162C] px-4 py-2 text-xs font-bold text-white hover:bg-[#1C4967] whitespace-nowrap shrink-0"
            >
              أودع ملفك الآن
            </a>
          </div>
        </div>
      </header>

      {/* HERO + 9:16 REEL VIDEO PLAYER + TUNISIAN FEMININE VOICEOVER */}
      <section
        id="visa-pilot-video"
        className="border-b border-[#0B162C]/10 bg-gradient-to-b from-[#FAF9F6] to-white py-12 md:py-16"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#9A6E1B]">
              <span>قسم التأشيرات والملفات القنصلية</span>
              <span aria-hidden="true">·</span>
              <span>أسعار Easy2Book بالدينار التونسي</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular" dir="ltr">
                98 140 514
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#0B162C]">
              تأشيرات السفر، الإقامة و E-Visa...{' '}
              <span className="text-[#C8922A]">بمتابعة Easy2Book السريعة</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-[#475569]">
              فيزا مصر في 4 ساعات، مواعيد فضاء شنغن العادية و Prime Time،
              تأشيرات دبي وقطر وعُمان السياحية والسنوية وإقامات السنتين، فيزا
              العمرة، الصين، ألبانيا، تايلاند، وملفات كندا وأمريكا وبريطانيا
              وأستراليا بالإضافة إلى 53 وجهة E-Visa حسب الطلب عبر 98 140 514.
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
                  universe="visa"
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
                      {getSocialCaptionBlocks('visa_services').map((cap) => (
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

      {/* CATALOG: ALL VISA TARIF CARDS WITH FILTER TABS & REQUIRED DOCUMENTS */}
      <section
        id="visa-pilot-catalog"
        className="bg-white py-16 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#C8922A]">
                دليل التأشيرات الرسمي · الأسعار بالدينار التونسي (د.ت) · Easy2Book
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0B162C]">
                مصر، شنغن، دبي، قطر، عُمان، العمرة، الصين، ألبانيا، تايلاند والدولية
              </h2>
            </div>
            <a
              href="#visa-pilot-booking"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B162C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967] whitespace-nowrap shrink-0"
            >
              <span>
                حاسبة الملفات المختارة ({selectedOffers.length + selectedEvisaCountries.length})
              </span>
            </a>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-1.5">
            {VISA_CATEGORY_TABS.map((tab) => {
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
                    <div className="relative h-40 w-full overflow-hidden bg-slate-200">
                      <img
                        src={offer.imageSrc}
                        alt={offer.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B162C]/88 via-[#0B162C]/30 to-transparent" />
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
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[#9A6E1B]">
                        <span className="font-mono-tabular">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{offer.categoryLabel}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#0B162C] leading-snug">
                        {offer.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#475569]">
                        {offer.subtitle}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1C4967]">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-[#C8922A]" />
                        <span>الأجل: {offer.delayLabel}</span>
                      </div>

                      {offer.noteLabel && (
                        <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1.5 text-[11px] font-semibold text-amber-900">
                          {offer.noteLabel}
                        </p>
                      )}

                      <div className="pt-1">
                        <p className="text-[11px] font-bold text-[#0B162C]/75 mb-1.5">
                          الوثائق المطلوبة:
                        </p>
                        <ul className="space-y-1">
                          {offer.requiredDocs.map((doc) => (
                            <li
                              key={doc}
                              className="flex items-start gap-2 text-xs font-semibold text-[#0B162C]/85"
                            >
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8922A]" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                          <span>مضافة في حاسبة الملف</span>
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

      {/* 53 E-VISA DESTINATIONS EXPLORER + TIMELINES & SPECIAL NOTES */}
      <section
        id="visa-pilot-evisa"
        className="bg-[#FAF9F6] py-14 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto max-w-[1200px] px-5 space-y-8">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Dubai & Oman Express / General Timelines */}
            <div className="lg:col-span-5 rounded-2xl border border-[#0B162C]/12 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#9A6E1B]">
                <ShieldCheck className="h-4 w-4 text-[#C8922A]" />
                <span>الآجال والملاحظات القنصلية · Easy2Book</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0B162C]">
                مواعيد الإصدار وخيار Express السريع
              </h3>
              <div className="divide-y divide-[#0B162C]/10 text-xs">
                <div className="py-3 space-y-1">
                  <p className="font-bold text-[#0B162C]">
                    فيزا مصر · إصدار في 4 ساعات فقط
                  </p>
                  <p className="text-[#475569]">
                    انطلاق من تونس 90 د.ت · من دولة أخرى 150 د.ت · شرم الشيخ
                    والإسكندرية والغردقة 350 د.ت (أو 300 د.ت ابتداءً من شخصين).
                  </p>
                </div>
                <div className="py-3 space-y-1">
                  <p className="font-bold text-[#0B162C]">
                    فيزا دبي وعُمان · سياحية وإقامة
                  </p>
                  <p className="text-[#475569]">
                    السياحية: يومان إلى أسبوع · الإقامة لمدة سنتين: 15 إلى 20
                    يوماً شاملة الهوية ID. لدبي يتوفر خيار Express خلال 48–72
                    ساعة (+60 د.ت خارج عطلة نهاية الأسبوع).
                  </p>
                </div>
                <div className="py-3 space-y-1">
                  <p className="font-bold text-[#0B162C]">
                    فيزا قطر السنوية / العمل (بدون ID)
                  </p>
                  <p className="text-[#475569]">
                    تُستكمل في قطر برسوم 1650 ريال قطري (فحص طبي، بصمة وبطاقة
                    إقامة). السياحية شهر واحد: 170 د.ت فقط.
                  </p>
                </div>
                <div className="py-3 space-y-1">
                  <p className="font-bold text-[#0B162C]">
                    فيزا ألبانيا (380 د.ت) وتايلاند (130 د.ت)
                  </p>
                  <p className="text-[#475569]">
                    ألبانيا تشمل معاليم الفيزا والترجمة إلى الإنجليزية من طرف
                    Easy2Book. تايلاند تشمل متابعة الملف بالوثائق المبسّطة.
                  </p>
                </div>
              </div>
            </div>

            {/* 53 E-Visa Destinations Interactive Finder */}
            <div className="lg:col-span-7 rounded-2xl border border-[#0B162C]/12 bg-white p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#9A6E1B]">
                    <Globe2 className="h-4 w-4 text-[#C8922A]" />
                    <span>E-Visa · وجهات إلكترونية جديدة (حسب الطلب)</span>
                  </div>
                  <h3 className="mt-1 text-xl font-extrabold text-[#0B162C]">
                    53 وجهة E-Visa متوفرة عند الطلب مع Easy2Book
                  </h3>
                </div>
                <span className="font-mono-tabular text-xs font-bold text-[#1C4967]">
                  {selectedEvisaCountries.length > 0
                    ? `${selectedEvisaCountries.length} محددة`
                    : 'اختر وجهة للطلب'}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={evisaSearch}
                  onChange={(e) => setEvisaSearch(e.target.value)}
                  placeholder="ابحث عن بلد بالاسم العربي أو الفرنسي (مثال: فيتنام، Singapour، تايلاند...)"
                  className="w-full rounded-xl border border-[#0B162C]/15 bg-[#FAF9F6] pr-9 pl-4 py-2.5 text-xs text-[#0B162C] outline-none focus:border-[#C8922A]"
                />
              </div>

              <div className="max-h-64 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pe-1">
                {filteredEvisaCountries.map((country) => {
                  const selected = selectedEvisaCountries.includes(country.fr);
                  return (
                    <button
                      key={country.fr}
                      type="button"
                      onClick={() => toggleEvisaCountry(country.fr)}
                      className={`flex items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-right transition-colors ${
                        selected
                          ? 'border-[#C8922A] bg-[#FBF9F4] text-[#0B162C]'
                          : 'border-[#0B162C]/10 bg-[#FAF9F6] text-[#0B162C]/85 hover:border-[#C8922A]/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          {country.ar}
                        </p>
                        <p
                          className="text-[10px] text-slate-500 truncate"
                          dir="ltr"
                        >
                          {country.fr}
                        </p>
                      </div>
                      {selected && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-[#C8922A]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C8922A]/35 bg-[#FBF9F4] p-3.5">
                <p className="text-xs font-semibold text-[#0B162C]">
                  {selectedEvisaCountries.length > 0
                    ? `الوجهات المختارة: ${selectedEvisaCountries.join('، ')}`
                    : 'اضغط على أي وجهة من الـ 53 دولة لإضافتها إلى طلب التسعير الفوري.'}
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    selectedEvisaCountries.length > 0
                      ? `السلام عليكم Easy2Book (98 140 514)، أرغب في تسعيرة E-Visa للوجهات التالية: ${selectedEvisaCountries.join('، ')}`
                      : 'السلام عليكم Easy2Book (98 140 514)، أرغب في الاستفسار عن تأشيرات E-Visa.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1FB857] whitespace-nowrap"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>اطلب تسعيرة E-Visa · 98 140 514</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL PHOTO GALLERY */}
      <section
        id="visa-pilot-gallery"
        className="bg-white py-14 border-b border-[#0B162C]/10"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8922A]">
                <Camera className="h-3.5 w-3.5" />
                <span>الوجهات القنصلية والدولية · Easy2Book</span>
              </p>
              <h2 className="mt-1.5 text-2xl md:text-3xl font-extrabold text-[#0B162C]">
                مرافقة متكاملة من تجهيز الملف إلى استلام التأشيرة
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
      <section id="visa-pilot-booking" className="bg-[#0B162C] py-16 text-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-12">
          {/* Left: Travelers Count, Dubai Express Toggle & Required Documents */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-bold text-[#F5D68A]">
                حاسبة ملفات التأشيرات بالدينار التونسي (د.ت)
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                احسب تكلفة التأشيرة وجهّز وثائقك في ثوانٍ
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                حدّد عدد المسافرين واختر التأشيرات المطلوبة لتظهر لك التكلفة
                التقديرية وقائمة الوثائق الموحّدة مباشرة.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 space-y-3">
              <p className="text-xs font-bold text-[#F5D68A]">
                1. عدد المسافرين (الجوازات):
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

              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDubaiExpressOption((v) => !v)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 text-right transition-colors ${
                    dubaiExpressOption
                      ? 'border-[#E7B34C] bg-[#E7B34C]/15 text-white'
                      : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#F5D68A] shrink-0" />
                    <div>
                      <p className="text-xs font-bold">
                        خيار دبي Express (48–72 ساعة)
                      </p>
                      <p className="text-[11px] text-slate-300">
                        +60 د.ت للمسافر عند اختيار فيزا دبي السياحية
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      dubaiExpressOption
                        ? 'border-[#E7B34C] bg-[#E7B34C] text-[#0B162C]'
                        : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {dubaiExpressOption && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              </div>
            </div>

            {consolidatedRequiredDocs.length > 0 && (
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-2.5 text-xs">
                <p className="inline-flex items-center gap-1.5 font-bold text-[#F5D68A]">
                  <FileText className="h-3.5 w-3.5" />
                  الوثائق المطلوبة لملفك الحالي ({consolidatedRequiredDocs.length}):
                </p>
                <ul className="space-y-1.5 text-slate-200">
                  {consolidatedRequiredDocs.map((doc) => (
                    <li key={doc} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F5D68A]" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Multi-Visa Booking Form & WhatsApp / CRM */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white p-6 md:p-8 text-[#0B162C] shadow-xl">
              <div className="border-b border-[#0B162C]/10 pb-4">
                <p className="text-xs font-bold text-[#C8922A]">
                  احسب تكلفة ملفك وأرسل طلبك فوراً
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  استمارة إيداع ملف فيزا Easy2Book (98 140 514)
                </h3>
              </div>

              {dispatchResult ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold">
                          تم تسجيل طلب ملف الفيزا بنجاح عبر عقد التكامل مع CRM
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
                      التأشيرات المختارة ({selectedOffers.length} مختارة):
                    </label>
                    <div className="max-h-60 overflow-y-auto grid gap-2 sm:grid-cols-2 pe-1">
                      {VISA_SERVICES_CATALOG.map((vx) => {
                        const checked = selectedOfferIds.includes(vx.id);
                        const itemTotal = computeOfferTotal(vx);
                        return (
                          <button
                            key={vx.id}
                            type="button"
                            onClick={() => toggleOfferSelection(vx.id)}
                            className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 text-right transition-colors ${
                              checked
                                ? 'border-[#C8922A] bg-[#FBF9F4]'
                                : 'border-[#0B162C]/12 bg-white hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#0B162C] truncate">
                                {vx.title}
                              </p>
                              <p className="text-[10px] text-[#475569] truncate">
                                {vx.priceDt.toLocaleString('en-US')} د.ت ·{' '}
                                {vx.delayLabel}
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

                  {travelersCount > 5 && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-950">
                      <Users className="h-4 w-4 shrink-0 text-amber-700" />
                      <span>
                        للملفات العائلية والمجموعات (+5 جوازات) يرجى التواصل
                        على 98 140 514 للمرافقة المباشرة.
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
                        تاريخ السفر المتوقع
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: ديسمبر 2026 / دبي أو شنغن"
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
                      placeholder="مثال: نوع الوظيفة، سفارة الإيداع، أو طلب E-Visa معين"
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
                        المجموع التقديري ({travelersCount} مسافرين)
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
                        تأكيد وإرسال طلب الفيزا
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
                الصفحة الرائدة · وحدة الفيزا و E-Visa الشاملة (مصر، شنغن، دبي، قطر، عُمان، العمرة والدولية)
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
