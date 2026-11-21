import { getHeroImageSrc, HERO_MEDIA_MAP, type HeroImageKey } from './mediaRegistry';
import { drawRealFlagCanvas, type CountryFlagCode } from './realCountryFlags';
import type { BusinessUniverse, CreatorLanguage, Page } from '../types/creator';

export type SocialPosterFormatId =
  | 'instagram_portrait'
  | 'square'
  | 'story';

export type SocialPosterStyleId =
  | 'editorial_luxury'
  | 'magazine_split'
  | 'ivory_concierge';

export interface SocialPosterFormatSpec {
  id: SocialPosterFormatId;
  width: number;
  height: number;
  ratioLabel: string;
  labelFr: string;
  labelAr: string;
  platformsFr: string;
  platformsAr: string;
}

export const SOCIAL_POSTER_FORMATS: SocialPosterFormatSpec[] = [
  {
    id: 'instagram_portrait',
    width: 1080,
    height: 1350,
    ratioLabel: '4:5',
    labelFr: 'Feed Portrait (4:5)',
    labelAr: 'منشور عمودي (4:5)',
    platformsFr: 'Instagram & Facebook (Recommandé)',
    platformsAr: 'إنستغرام وفيسبوك (موصى به)',
  },
  {
    id: 'square',
    width: 1080,
    height: 1080,
    ratioLabel: '1:1',
    labelFr: 'Post Carré (1:1)',
    labelAr: 'منشور مربع (1:1)',
    platformsFr: 'Facebook, Instagram & LinkedIn',
    platformsAr: 'فيسبوك وإنستغرام ولينكدإن',
  },
  {
    id: 'story',
    width: 1080,
    height: 1920,
    ratioLabel: '9:16',
    labelFr: 'Story & Reels (9:16)',
    labelAr: 'ستوري وريلز (9:16)',
    platformsFr: 'Story IG / FB, TikTok & Statut WhatsApp',
    platformsAr: 'ستوري وتيك توك وحالة واتساب',
  },
];

export interface PosterPhotoOption {
  id: string;
  category: 'visa' | 'hotels' | 'destinations';
  labelFr: string;
  labelAr: string;
  src: string;
}

export const CURATED_POSTER_PHOTOS: PosterPhotoOption[] = [
  // Visas & Voyages Pro
  {
    id: 'poster_visa_luxury_airport',
    category: 'visa',
    labelFr: 'Visa Salon VIP & Passeport',
    labelAr: 'فيزا صالة VIP وجواز السفر',
    src: HERO_MEDIA_MAP.poster_visa_luxury_airport.src,
  },
  {
    id: 'poster_visa_schengen_europe',
    category: 'visa',
    labelFr: 'Visa Schengen · Paris Doré',
    labelAr: 'فيزا شنغن · باريس الذهبية',
    src: HERO_MEDIA_MAP.poster_visa_schengen_europe.src,
  },
  {
    id: 'evisa_passport_globe',
    category: 'visa',
    labelFr: 'Passeport Tunisien Vert & Globe',
    labelAr: 'جواز السفر التونسي الأخضر والكرة الأرضية',
    src: HERO_MEDIA_MAP.evisa_passport_globe.src,
  },
  {
    id: 'egypt_pyramids_reel',
    category: 'visa',
    labelFr: 'Égypte · Pyramides de Gizeh',
    labelAr: 'مصر · أهرامات الجيزة',
    src: HERO_MEDIA_MAP.egypt_pyramids_reel.src,
  },
  {
    id: 'dubai_skyline',
    category: 'visa',
    labelFr: 'Dubaï Marina & Skyline Luxe',
    labelAr: 'دبي مارينا وأفق المدينة',
    src: HERO_MEDIA_MAP.dubai_skyline.src,
  },
  {
    id: 'visa_canada',
    category: 'visa',
    labelFr: 'Canada & International · Toronto',
    labelAr: 'كندا والدولية · تورونتو',
    src: HERO_MEDIA_MAP.visa_canada.src,
  },
  {
    id: 'visa_desk',
    category: 'visa',
    labelFr: 'Accompagnement Visa & Dossier',
    labelAr: 'مكتب تحضير ملفات التأشيرات',
    src: HERO_MEDIA_MAP.visa_desk.src,
  },
  // Hôtels 5★ & Resorts
  {
    id: 'poster_hotel_tunisia_resort',
    category: 'hotels',
    labelFr: 'Resort 5★ Tunisie · Piscine Infini',
    labelAr: 'منتجع 5 نجوم تونس · مسبح على البحر',
    src: HERO_MEDIA_MAP.poster_hotel_tunisia_resort.src,
  },
  {
    id: 'poster_hotel_suite_luxury',
    category: 'hotels',
    labelFr: 'Suite 5★ Vue Mer & Terrasse',
    labelAr: 'جناح فندقي 5 نجوم بإطلالة بحرية',
    src: HERO_MEDIA_MAP.poster_hotel_suite_luxury.src,
  },
  {
    id: 'tunisia_resort',
    category: 'hotels',
    labelFr: 'Hôtel Hammamet 5★ Crépuscule',
    labelAr: 'فندق الحمامات 5 نجوم وقت الغروب',
    src: HERO_MEDIA_MAP.tunisia_resort.src,
  },
  {
    id: 'djerba_thalasso',
    category: 'hotels',
    labelFr: 'Djerba Thalasso & Plage 5★',
    labelAr: 'جربة ثالاسو وشاطئ 5 نجوم',
    src: HERO_MEDIA_MAP.djerba_thalasso.src,
  },
  {
    id: 'hammamet_marina',
    category: 'hotels',
    labelFr: 'Yasmine Hammamet & Marina',
    labelAr: 'ياسمين الحمامات والمارينا',
    src: HERO_MEDIA_MAP.hammamet_marina.src,
  },
  {
    id: 'maldives_honeymoon',
    category: 'hotels',
    labelFr: 'Villa Luxe sur Pilotis · Noces',
    labelAr: 'فيلا فاخرة على البحر · شهر عسل',
    src: HERO_MEDIA_MAP.maldives_honeymoon.src,
  },
  {
    id: 'marrakech_riad',
    category: 'hotels',
    labelFr: 'Riad & Palace Luxe 5★',
    labelAr: 'رياض وقصر فاخر 5 نجوم',
    src: HERO_MEDIA_MAP.marrakech_riad.src,
  },
  {
    id: 'sahara_tozeur',
    category: 'hotels',
    labelFr: 'Resort Oasis Sahara Tozeur',
    labelAr: 'منتجع واحة توزر والصحراء',
    src: HERO_MEDIA_MAP.sahara_tozeur.src,
  },
  // Omra, Billetterie & Excursions
  {
    id: 'makkah_haram',
    category: 'destinations',
    labelFr: 'La Mecque · Masjid Al-Haram',
    labelAr: 'مكة المكرمة · المسجد الحرام',
    src: HERO_MEDIA_MAP.makkah_haram.src,
  },
  {
    id: 'omra_vip_haram',
    category: 'destinations',
    labelFr: 'Suite 5★ Vue Haram · Omra VIP',
    labelAr: 'جناح 5 نجوم إطلالة الحرم',
    src: HERO_MEDIA_MAP.omra_vip_haram.src,
  },
  {
    id: 'turkey_istanbul_reel',
    category: 'destinations',
    labelFr: 'Istanbul & Bosphore',
    labelAr: 'إسطنبول ومضيق البسفور',
    src: HERO_MEDIA_MAP.turkey_istanbul_reel.src,
  },
  {
    id: 'flights_mediterranean_ship',
    category: 'destinations',
    labelFr: 'Avion & Bateau Méditerranée',
    labelAr: 'طيران وبواخر المتوسط',
    src: HERO_MEDIA_MAP.flights_mediterranean_ship.src,
  },
  {
    id: 'airline_business_cabin',
    category: 'destinations',
    labelFr: 'Vol Business & Billetterie',
    labelAr: 'رحلات الطيران والتذاكر',
    src: HERO_MEDIA_MAP.airline_business_cabin.src,
  },
];

export interface SocialPosterConfig {
  format: SocialPosterFormatId;
  style: SocialPosterStyleId;
  language: CreatorLanguage;
  photoSrc: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  highlights: [string, string, string];
  showPrice: boolean;
  priceLabel: string;
  ctaLabel: string;
  phoneLabel: string;
  websiteLabel: string;
  brandName: string;
  flagCodes: CountryFlagCode[];
  accentColor: string;
  primaryColor: string;
}

export interface PosterSeedInput {
  page?: Page;
  pageTitle?: string;
  slug?: string;
  universe?: BusinessUniverse;
  language?: CreatorLanguage;
  eyebrow?: string;
  headline?: string;
  subtitle?: string;
  highlights?: string[];
  priceLabel?: string;
  showPrice?: boolean;
  photoKey?: HeroImageKey | string;
  flagCodes?: CountryFlagCode[];
}

function cleanText(raw?: string | null, fallback = ''): string {
  return (raw || '').replace(/\s+/g, ' ').trim() || fallback;
}

export function buildDefaultPosterConfig(input: PosterSeedInput): SocialPosterConfig {
  const page = input.page;
  const language: CreatorLanguage =
    input.language ?? page?.language ?? 'fr';
  const isAr = language === 'ar';
  const universe: BusinessUniverse =
    input.universe ?? page?.universe ?? 'visa';
  const slugLower = `${input.slug ?? page?.seo?.slug ?? ''} ${page?.id ?? ''} ${input.pageTitle ?? page?.title ?? ''}`.toLowerCase();

  const heroBlock = page?.blocks?.find(
    (b) => b.type === 'hero_video' || b.type === 'hero_image'
  );
  const firstItems = page?.blocks
    ?.flatMap((b) => b.content.items ?? [])
    .map((it) => cleanText(it.title))
    .filter(Boolean)
    .slice(0, 3);

  const brandName = page?.brandIdentity?.brandName || 'Easy2Book';
  const accentColor = '#E7B34C';
  const primaryColor = '#0D263E';

  // Defaults by specific campaign / vertical
  let photoSrc = input.photoKey
    ? getHeroImageSrc(input.photoKey)
    : heroBlock?.content?.imageKey
      ? getHeroImageSrc(heroBlock.content.imageKey)
      : HERO_MEDIA_MAP.poster_visa_luxury_airport.src;

  let eyebrow = cleanText(
    input.eyebrow || heroBlock?.content?.eyebrow,
    isAr ? 'خدمات Easy2Book الرسمية' : 'Easy2Book · Centrale de Réservation'
  );
  let headline = cleanText(
    input.headline || heroBlock?.content?.title || input.pageTitle || page?.title,
    isAr ? 'سفرتك أسهل مع Easy2Book' : 'Votre prochain voyage simplifié'
  );
  let subtitle = cleanText(
    input.subtitle || heroBlock?.content?.description,
    isAr
      ? 'مرافقة احترافية وسريعة من تونس إلى وجهتك بكل ثقة.'
      : 'Accompagnement personnalisé, confirmation rapide et assistance dédiée.'
  );
  let highlights: [string, string, string] = [
    input.highlights?.[0] ||
      firstItems?.[0] ||
      (isAr ? 'معالجة سريعة ومضمونة' : 'Traitement rapide & suivi dédié'),
    input.highlights?.[1] ||
      firstItems?.[1] ||
      (isAr ? 'ملف واضح بدون تعقيد' : 'Dossier clair & zéro prise de tête'),
    input.highlights?.[2] ||
      firstItems?.[2] ||
      (isAr ? 'مرافقة مباشرة عبر واتساب' : 'Assistance directe WhatsApp 7j/7'),
  ];
  let showPrice = input.showPrice ?? false;
  let priceLabel = cleanText(
    input.priceLabel || page?.offerRef?.cachedSummary?.startingPriceLabel,
    ''
  );
  let flagCodes: CountryFlagCode[] = input.flagCodes ?? [];
  let style: SocialPosterStyleId = 'editorial_luxury';

  // Smart presets for Visas & Hotels so posters look instantly commercial and magnetic
  if (slugLower.includes('visa-egypt') || slugLower.includes('مصر') && universe === 'visa') {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : HERO_MEDIA_MAP.egypt_pyramids_reel.src;
    eyebrow = isAr
      ? 'فيزا وخطاب ضمان مصر · إصدار خلال 4 ساعات'
      : 'Visa & Garantie Égypte · Express 4 Heures';
    headline = isAr
      ? 'تصريح أمني وخطاب ضمان لمصر في 4 ساعات'
      : 'Autorisation & Garantie Égypte en 4h';
    subtitle = isAr
      ? 'ابعث تذكرتك ونسخة من جواز سفرك فقط — بدون أي تعقيد.'
      : 'Envoyez simplement votre billet d’avion et la copie de votre passeport.';
    highlights = isAr
      ? [
          'مطار الإنطلاق: تونس أو أي مكان في العالم',
          'مطار الوصول: القاهرة · الغردقة · شرم الشيخ',
          'تصريح أمني وضمان جاهز خلال 4 ساعات',
        ]
      : [
          'Départ de Tunisie ou depuis n’importe quel pays',
          'Arrivée : Le Caire, Hurghada, Charm el-Cheikh',
          'Autorisation sécuritaire & garantie en 4 heures',
        ];
    flagCodes = ['EG', 'TN'];
    showPrice = false;
  } else if (slugLower.includes('evisa') || slugLower.includes('e-visa')) {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : HERO_MEDIA_MAP.evisa_passport_globe.src;
    eyebrow = isAr
      ? 'جواز السفر التونسي · E-Visa إلكترونياً'
      : 'Passeport Tunisien · Formalités E-Visa';
    headline = isAr
      ? 'سافر واكتشف العالم بفيزا إلكترونية'
      : 'Le monde vous attend en E-Visa';
    subtitle = isAr
      ? 'وجهات في إفريقيا وآسيا وأوروبا والأمريكيتين بإجراءات إلكترونية مبسّطة.'
      : 'Des destinations accessibles avec des formalités électroniques simplifiées.';
    highlights = isAr
      ? [
          'رواندا · تنزانيا · قطر · البحرين · فيتنام',
          'أوزبكستان · ألبانيا · كولومبيا · البهاماس',
          'مرافقة Easy2Book لتجهيز وثائقك بسهولة',
        ]
      : [
          'Rwanda · Tanzanie · Qatar · Bahreïn · Vietnam',
          'Ouzbékistan · Albanie · Colombie · Bahamas',
          'Accompagnement complet pour préparer votre dossier',
        ];
    flagCodes = ['TN', 'QA', 'VN', 'AL', 'CO'];
    showPrice = false;
  } else if (
    slugLower.includes('schengen') ||
    slugLower.includes('france') ||
    slugLower.includes('etudes') ||
    slugLower.includes('affaires')
  ) {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : HERO_MEDIA_MAP.poster_visa_schengen_europe.src;
    eyebrow = isAr
      ? 'خدمات فيزا شنغن · دراسة · أعمال'
      : 'Visa Schengen · Tourisme, Études & Affaires';
    headline = isAr
      ? 'تحضير ملف فيزا شنغن وحجز الموعد باحترافية'
      : 'Votre dossier Visa Schengen sans erreur';
    subtitle = isAr
      ? 'تدقيق شامل للوثائق، حجوزات الطيران والفنادق وتأمين السفر المعتمد.'
      : 'Audit complet des pièces, prise de rendez-vous TLS / VFS et assurance conforme.';
    highlights = isAr
      ? [
          'مواعيد قياسية و Prime Time حسب الإمكانية',
          'تجهيز الاستمارات، التأمين وحجوزات السفر',
          'مرافقة خاصة للطلبة، العائلات ورجال الأعمال',
        ]
      : [
          'Prise de RDV Standard & Prime Time',
          'Formulaires, assurance voyage & réservations conformes',
          'Suivi personnalisé tourisme, études & affaires',
        ];
    flagCodes = ['TN'];
    showPrice = false;
  } else if (slugLower.includes('dubai') || slugLower.includes('دبي')) {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : HERO_MEDIA_MAP.dubai_skyline.src;
    eyebrow = isAr
      ? 'فيزا دبي والإمارات · سياحية وإقامة'
      : 'Visa Dubaï & Émirats · Tourisme & Résidence';
    headline = isAr
      ? 'فيزا دبي والإمارات سريعة ومضمونة'
      : 'Visa Dubaï Express · Simple & Fiable';
    subtitle = isAr
      ? 'تأشيرات سياحية بالضمان أو بدون ضمان، خيار Express 48–72h وإقامة سنتين.'
      : 'Visas touristiques 1 ou 2 mois, option Express 48–72h et résidence 2 ans ID inclus.';
    highlights = isAr
      ? [
          'بالضمان أو بدون ضمان · شهر أو شهران',
          'خيار Express السريع خلال 48 إلى 72 ساعة',
          'الوثائق: نسخة الجواز + صورة خلفية بيضاء',
        ]
      : [
          'Formules avec ou sans garantie (1 mois / 2 mois)',
          'Option Express rapide en 48 à 72 heures',
          'Documents simples : passeport + photo fond blanc',
        ];
    showPrice = false;
  } else if (universe === 'visa') {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : HERO_MEDIA_MAP.poster_visa_luxury_airport.src;
    eyebrow = isAr
      ? 'مركز خدمات التأشيرات · Easy2Book'
      : 'Pôle Services Visa & E-Visa · Easy2Book';
    headline = cleanText(
      input.headline || input.pageTitle || page?.title,
      isAr ? 'خدمات الفيزا والـ E-Visa باحترافية' : 'Vos Visas & E-Visa en toute sérénité'
    );
    subtitle = isAr
      ? 'مصر، شنغن، دبي، قطر، عُمان، كندا، أمريكا وأكثر من 53 وجهة E-Visa.'
      : 'Égypte 4h, Schengen, Dubaï, Qatar, Oman, Canada, USA & +53 destinations E-Visa.';
    highlights = isAr
      ? [
          'تجهيز كامل للملف وتدقيق جميع الوثائق',
          'متابعة دقيقة للمواعيد القنصلية والـ E-Visa',
          'مرافقة فورية عبر الهاتف وواتساب',
        ]
      : [
          'Constitution et audit complet de votre dossier',
          'Suivi rapide RDV consulaires & E-Visa en ligne',
          'Assistance dédiée téléphone & WhatsApp',
        ];
    flagCodes = ['TN'];
    showPrice = false;
  } else if (universe === 'hotels_tunisie') {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : slugLower.includes('djerba')
        ? HERO_MEDIA_MAP.djerba_thalasso.src
        : slugLower.includes('suite') || slugLower.includes('sousse')
          ? HERO_MEDIA_MAP.poster_hotel_suite_luxury.src
          : HERO_MEDIA_MAP.poster_hotel_tunisia_resort.src;
    style = 'ivory_concierge';
    eyebrow = isAr
      ? 'فنادق ومنتجعات تونس 5★ · Easy2Book'
      : 'Hôtels & Resorts Tunisie 5★ · Sélection Easy2Book';
    headline = cleanText(
      input.headline || heroBlock?.content?.title || input.pageTitle || page?.title,
      isAr ? 'عطلة فاخرة في أجمل فنادق تونس' : 'Évasion 5★ dans les plus beaux hôtels de Tunisie'
    );
    subtitle = isAr
      ? 'الحمامات، جربة، سوسة وتوزر — إقامة شاملة، شواطئ خاصة وأفضل الأسعار التفاوضية.'
      : 'Hammamet, Djerba, Sousse & Tozeur — All Inclusive, plages privées et tarifs négociés.';
    highlights = isAr
      ? [
          'فنادق 4★ و 5★ مختارة بعناية للعائلات والأزواج',
          'إقامة All Inclusive أو نصف إقامة وتخفيضات الأطفال',
          'تأكيد فوري ومرافقة قبل وأثناء الإقامة',
        ]
      : [
          'Hôtels 4★ & 5★ sélectionnés · Familles & Couples',
          'Formules All Inclusive, Demi-Pension & avantages enfants',
          'Confirmation rapide & assistance Easy2Book 7j/7',
        ];
    showPrice = Boolean(priceLabel);
  } else if (universe === 'omra') {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : HERO_MEDIA_MAP.makkah_haram.src;
    eyebrow = isAr
      ? 'برنامج عمرة متكامل · Easy2Book'
      : 'Programme Omra Accompagnée · Easy2Book';
    highlights = isAr
      ? [
          'طيران مباشر تونس – جدة – تونس + فيزا العمرة',
          'إقامة مريحة بمكة المكرمة ورحلة المدينة المنورة',
          'تأطير ديني وتنظيمي متواصل خطوة بخطوة',
        ]
      : [
          'Vol direct Tunis – Djeddah + Visa Omra inclus',
          'Hôtels sélectionnés à La Mecque & Médine',
          'Encadrement religieux & logistique complet',
        ];
    showPrice = Boolean(priceLabel);
  } else if (
    slugLower.includes('billetterie') ||
    slugLower.includes('avion') ||
    slugLower.includes('bateau')
  ) {
    photoSrc = input.photoKey
      ? getHeroImageSrc(input.photoKey)
      : HERO_MEDIA_MAP.flights_mediterranean_ship.src;
    eyebrow = isAr
      ? 'تذاكر الطيران والبواخر · 3 نقرات فقط'
      : 'Billetterie Avion & Bateau · En 3 Clics';
    headline = isAr
      ? 'تذكرة الطائرة أو الباخرة في مكان واحد'
      : 'Avion ou Bateau : réservez en 3 clics';
    subtitle = isAr
      ? 'قارن كل شركات الطيران والرحلات البحرية واستلم تذكرتك الإلكترونية فوراً.'
      : 'Toutes les compagnies aériennes & traversées Méditerranée au même endroit.';
    highlights = isAr
      ? [
          'رحلات جوية وبحرية: تونس – فرنسا – إيطاليا',
          'بدون مصاريف خفية وتأكيد فوري على هاتفك',
          'دعم مباشر عبر الهاتف وواتساب Easy2Book',
        ]
      : [
          'Vols express & traversées Tunisie–France / Italie',
          'Zéro frais surprises · E-billet direct sur téléphone',
          'Service client Easy2Book disponible 7j/7',
        ];
    showPrice = false;
  }

  return {
    format: 'instagram_portrait',
    style,
    language,
    photoSrc,
    eyebrow,
    headline,
    subtitle,
    highlights,
    showPrice,
    priceLabel,
    ctaLabel: isAr ? 'احجز الآن عبر واتساب' : 'Réservez sur WhatsApp',
    phoneLabel: '98 140 514',
    websiteLabel: 'www.easy2book.tn',
    brandName,
    flagCodes,
    accentColor,
    primaryColor,
  };
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focalY = 0.45
) {
  const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
  const boxRatio = w / Math.max(1, h);
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > boxRatio) {
    sw = img.naturalHeight * boxRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / boxRatio;
    sy = (img.naturalHeight - sh) * focalY;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${current} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
      if (lines.length === maxLines - 1) {
        // Append remaining words onto last line and truncate cleanly if needed
        const rest = [current, ...words.slice(i + 1)].join(' ');
        let trimmed = rest;
        while (trimmed.length > 3 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
          trimmed = trimmed.slice(0, -1).trim();
        }
        lines.push(rest === trimmed ? rest : `${trimmed}…`);
        return lines;
      }
    }
  }
  lines.push(current);
  return lines.slice(0, maxLines);
}

function drawFlagStrip(
  ctx: CanvasRenderingContext2D,
  flagCodes: CountryFlagCode[],
  x: number,
  y: number,
  isRtl: boolean,
  flagW = 52,
  flagH = 34
) {
  if (!flagCodes.length) return;
  const gap = 12;
  const items = flagCodes.slice(0, 5);
  items.forEach((code, idx) => {
    const fx = isRtl
      ? x - flagW - idx * (flagW + gap)
      : x + idx * (flagW + gap);
    ctx.save();
    drawRoundedRectPath(ctx, fx, y, flagW, flagH, 5);
    ctx.clip();
    drawRealFlagCanvas(ctx, code, fx, y, flagW, flagH);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1.5;
    drawRoundedRectPath(ctx, fx, y, flagW, flagH, 5);
    ctx.stroke();
    ctx.restore();
  });
}

function drawCheckBullet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  circleColor: string,
  checkColor: string
) {
  ctx.save();
  ctx.fillStyle = circleColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = checkColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.42, cy + radius * 0.02);
  ctx.lineTo(cx - radius * 0.1, cy + radius * 0.36);
  ctx.lineTo(cx + radius * 0.45, cy - radius * 0.34);
  ctx.stroke();
  ctx.restore();
}

export async function renderSocialPosterToCanvas(
  canvas: HTMLCanvasElement,
  config: SocialPosterConfig
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading timeout
    }
  }

  const fmt =
    SOCIAL_POSTER_FORMATS.find((f) => f.id === config.format) ??
    SOCIAL_POSTER_FORMATS[0];
  const W = fmt.width;
  const H = fmt.height;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isAr = config.language === 'ar';
  const fontFamily = isAr
    ? 'Cairo, "Plus Jakarta Sans", sans-serif'
    : '"Plus Jakarta Sans", Cairo, sans-serif';
  const displayFamily = isAr
    ? 'Cairo, sans-serif'
    : '"Plus Jakarta Sans", sans-serif';

  const [photoImg, logoImg] = await Promise.all([
    loadImage(config.photoSrc),
    loadImage('/assets/aistudio/logo_transparent_e9918557.png'),
  ]);

  const pad = 64;
  const isStory = config.format === 'story';
  const isSquare = config.format === 'square';

  ctx.clearRect(0, 0, W, H);

  if (config.style === 'editorial_luxury') {
    // 1. Full-bleed high-impact background photo
    if (photoImg) {
      drawCoverImage(ctx, photoImg, 0, 0, W, H, 0.42);
    } else {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0B1E33');
      bg.addColorStop(1, '#1C4967');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Measured cinematic contrast scrim (preserves vivid upper photo while ensuring AA+ contrast below)
    const scrim = ctx.createLinearGradient(0, 0, 0, H);
    scrim.addColorStop(0, 'rgba(7, 17, 31, 0.56)');
    scrim.addColorStop(0.24, 'rgba(7, 17, 31, 0.14)');
    scrim.addColorStop(0.46, 'rgba(7, 17, 31, 0.42)');
    scrim.addColorStop(0.72, 'rgba(7, 17, 31, 0.88)');
    scrim.addColorStop(1, 'rgba(7, 17, 31, 0.96)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, W, H);

    // Subtle luxury perimeter hairline frame
    ctx.save();
    ctx.strokeStyle = 'rgba(231, 179, 76, 0.34)';
    ctx.lineWidth = 2;
    drawRoundedRectPath(ctx, 26, 26, W - 52, H - 52, 22);
    ctx.stroke();
    ctx.restore();

    // 3. Top header row: Ivory Logo Plate + Real Country Flag(s)
    const topY = isStory ? 84 : 56;
    const plateW = 246;
    const plateH = 74;
    const plateX = isAr ? W - pad - plateW : pad;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    drawRoundedRectPath(ctx, plateX, topY, plateW, plateH, 16);
    ctx.fill();
    if (logoImg) {
      const ratio = logoImg.naturalWidth / Math.max(1, logoImg.naturalHeight);
      const lh = 50;
      const lw = Math.min(plateW - 32, lh * ratio);
      ctx.drawImage(
        logoImg,
        plateX + (plateW - lw) / 2,
        topY + (plateH - lh) / 2,
        lw,
        lh
      );
    } else {
      ctx.fillStyle = '#0D263E';
      ctx.font = `800 28px ${displayFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.brandName, plateX + plateW / 2, topY + plateH / 2);
    }
    ctx.restore();

    // Country flags on opposite corner
    if (config.flagCodes.length > 0) {
      const flagAnchorX = isAr ? pad : W - pad;
      drawFlagStrip(ctx, config.flagCodes, flagAnchorX, topY + 20, !isAr, 54, 34);
    }

    // 4. Optional Gold Price Callout Badge (only when enabled)
    const footerH = isSquare ? 132 : 148;
    const footerY = H - footerH;

    // 5. Lower Editorial Content Block
    const contentBottomY = footerY - (isSquare ? 34 : 46);
    const activeHighlights = config.highlights
      .map((h) => h.trim())
      .filter(Boolean);
    const hlRowH = isSquare ? 46 : 54;
    const highlightsTotalH = activeHighlights.length * hlRowH;

    // Measure subtitle & headline from bottom up so spacing is mathematically balanced
    const textMaxW = W - pad * 2;
    const headlineSize = isSquare ? 54 : isStory ? 68 : 60;
    const subtitleSize = isSquare ? 25 : isStory ? 31 : 28;
    const eyebrowSize = isSquare ? 22 : isStory ? 26 : 24;

    ctx.font = `800 ${headlineSize}px ${displayFamily}`;
    const headlineLines = wrapTextLines(ctx, config.headline, textMaxW, 3);
    const headlineLineH = Math.round(headlineSize * (isAr ? 1.32 : 1.16));

    ctx.font = `500 ${subtitleSize}px ${fontFamily}`;
    const subtitleLines = config.subtitle.trim()
      ? wrapTextLines(ctx, config.subtitle, textMaxW, 2)
      : [];
    const subtitleLineH = Math.round(subtitleSize * 1.42);

    const priceBlockH =
      config.showPrice && config.priceLabel.trim() ? (isSquare ? 72 : 84) : 0;

    const totalTextH =
      eyebrowSize +
      20 +
      headlineLines.length * headlineLineH +
      (subtitleLines.length ? 16 + subtitleLines.length * subtitleLineH : 0) +
      (activeHighlights.length ? 28 + highlightsTotalH : 0) +
      (priceBlockH ? 24 + priceBlockH : 0);

    let cursorY = contentBottomY - totalTextH;
    const alignX = isAr ? W - pad : pad;

    ctx.save();
    ctx.direction = isAr ? 'rtl' : 'ltr';
    ctx.textAlign = isAr ? 'right' : 'left';
    ctx.textBaseline = 'top';

    // Gold Eyebrow + short gold rule
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(isAr ? alignX - 72 : alignX, cursorY - 14, 72, 4);
    ctx.font = `700 ${eyebrowSize}px ${fontFamily}`;
    ctx.fillText(config.eyebrow, alignX, cursorY);
    cursorY += eyebrowSize + 20;

    // Display Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 18;
    ctx.font = `800 ${headlineSize}px ${displayFamily}`;
    headlineLines.forEach((line) => {
      ctx.fillText(line, alignX, cursorY);
      cursorY += headlineLineH;
    });
    ctx.shadowBlur = 0;

    // Subtitle
    if (subtitleLines.length > 0) {
      cursorY += 14;
      ctx.fillStyle = 'rgba(241, 245, 249, 0.92)';
      ctx.font = `500 ${subtitleSize}px ${fontFamily}`;
      subtitleLines.forEach((line) => {
        ctx.fillText(line, alignX, cursorY);
        cursorY += subtitleLineH;
      });
    }

    // 3 Crisp Highlight Rows
    if (activeHighlights.length > 0) {
      cursorY += 26;
      const hlFontSize = isSquare ? 24 : isStory ? 29 : 26;
      ctx.font = `600 ${hlFontSize}px ${fontFamily}`;
      activeHighlights.forEach((item) => {
        const bulletR = 13;
        const bulletCx = isAr ? alignX - bulletR : alignX + bulletR;
        const bulletCy = cursorY + Math.round(hlFontSize * 0.65);
        drawCheckBullet(ctx, bulletCx, bulletCy, bulletR, config.accentColor, '#0B1E33');

        ctx.fillStyle = '#FFFFFF';
        const textX = isAr ? alignX - bulletR * 2 - 16 : alignX + bulletR * 2 + 16;
        ctx.fillText(item, textX, cursorY, textMaxW - 48);
        cursorY += hlRowH;
      });
    }

    // Optional Price Callout
    if (config.showPrice && config.priceLabel.trim()) {
      cursorY += 20;
      const pText = config.priceLabel.trim();
      ctx.font = `800 ${isSquare ? 34 : 38}px ${displayFamily}`;
      const measured = ctx.measureText(pText).width;
      const boxW = Math.min(textMaxW, measured + 76);
      const boxH = isSquare ? 68 : 76;
      const boxX = isAr ? alignX - boxW : alignX;

      ctx.fillStyle = config.accentColor;
      drawRoundedRectPath(ctx, boxX, cursorY, boxW, boxH, 16);
      ctx.fill();

      ctx.fillStyle = '#0B1E33';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pText, boxX + boxW / 2, cursorY + boxH / 2 + 1, boxW - 32);
    }
    ctx.restore();

    // 6. Structured Bottom Contact Footer Bar
    ctx.save();
    ctx.fillStyle = 'rgba(11, 30, 51, 0.96)';
    ctx.fillRect(0, footerY, W, footerH);
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(0, footerY, W, 4);

    // Left/Right Footer CTA & Contact info
    const ctaText = config.ctaLabel || (isAr ? 'احجز الآن' : 'Réservez maintenant');
    ctx.font = `800 24px ${fontFamily}`;
    const ctaW = Math.min(430, Math.max(290, ctx.measureText(ctaText).width + 64));
    const ctaH = 66;
    const ctaX = isAr ? W - pad - ctaW : pad;
    const ctaY = footerY + (footerH - ctaH) / 2;

    ctx.fillStyle = config.accentColor;
    drawRoundedRectPath(ctx, ctaX, ctaY, ctaW, ctaH, 14);
    ctx.fill();

    ctx.fillStyle = '#0B1E33';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = isAr ? 'rtl' : 'ltr';
    ctx.fillText(ctaText, ctaX + ctaW / 2, ctaY + ctaH / 2 + 1, ctaW - 28);

    // Phone + Website on opposite side
    const infoX = isAr ? pad : W - pad;
    ctx.direction = 'ltr';
    ctx.textAlign = isAr ? 'left' : 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 34px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`WhatsApp · ${config.phoneLabel}`, infoX, footerY + footerH / 2 - 4);
    ctx.fillStyle = config.accentColor;
    ctx.font = `600 22px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(config.websiteLabel, infoX, footerY + footerH / 2 + 30);
    ctx.restore();
    return;
  }

  if (config.style === 'magazine_split') {
    const splitY = Math.round(H * (isStory ? 0.54 : isSquare ? 0.48 : 0.52));

    // Upper high-impact unobstructed photograph
    if (photoImg) {
      drawCoverImage(ctx, photoImg, 0, 0, W, splitY, 0.44);
    } else {
      ctx.fillStyle = '#1C4967';
      ctx.fillRect(0, 0, W, splitY);
    }

    // Subtle top gradient for logo clarity
    const topGrad = ctx.createLinearGradient(0, 0, 0, 200);
    topGrad.addColorStop(0, 'rgba(7, 17, 31, 0.52)');
    topGrad.addColorStop(1, 'rgba(7, 17, 31, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, 200);

    // Logo plate in top corner
    const plateW = 236;
    const plateH = 70;
    const plateX = isAr ? W - pad - plateW : pad;
    const topY = isStory ? 74 : 46;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    drawRoundedRectPath(ctx, plateX, topY, plateW, plateH, 16);
    ctx.fill();
    if (logoImg) {
      const ratio = logoImg.naturalWidth / Math.max(1, logoImg.naturalHeight);
      const lh = 46;
      const lw = Math.min(plateW - 28, lh * ratio);
      ctx.drawImage(
        logoImg,
        plateX + (plateW - lw) / 2,
        topY + (plateH - lh) / 2,
        lw,
        lh
      );
    }
    ctx.restore();

    if (config.flagCodes.length > 0) {
      drawFlagStrip(
        ctx,
        config.flagCodes,
        isAr ? pad : W - pad,
        topY + 18,
        !isAr,
        54,
        34
      );
    }

    // Lower Midnight Navy Editorial Panel
    ctx.fillStyle = '#0B1E33';
    ctx.fillRect(0, splitY, W, H - splitY);
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(0, splitY, W, 6);

    // Optional Floating Price Plate bridging the split seam
    if (config.showPrice && config.priceLabel.trim()) {
      const pText = config.priceLabel.trim();
      ctx.save();
      ctx.font = `800 32px ${displayFamily}`;
      const pw = Math.min(W - pad * 2, ctx.measureText(pText).width + 64);
      const ph = 66;
      const px = isAr ? pad : W - pad - pw;
      const py = splitY - ph / 2;
      ctx.fillStyle = config.accentColor;
      drawRoundedRectPath(ctx, px, py, pw, ph, 14);
      ctx.fill();
      ctx.fillStyle = '#0B1E33';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pText, px + pw / 2, py + ph / 2 + 1, pw - 24);
      ctx.restore();
    }

    const alignX = isAr ? W - pad : pad;
    const textMaxW = W - pad * 2;
    let cursorY = splitY + (isSquare ? 42 : 56);

    ctx.save();
    ctx.direction = isAr ? 'rtl' : 'ltr';
    ctx.textAlign = isAr ? 'right' : 'left';
    ctx.textBaseline = 'top';

    ctx.fillStyle = config.accentColor;
    ctx.font = `700 ${isSquare ? 21 : 24}px ${fontFamily}`;
    ctx.fillText(config.eyebrow, alignX, cursorY, textMaxW);
    cursorY += isSquare ? 38 : 44;

    const hlSize = isSquare ? 44 : isStory ? 60 : 50;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${hlSize}px ${displayFamily}`;
    const hLines = wrapTextLines(ctx, config.headline, textMaxW, 2);
    const hStep = Math.round(hlSize * (isAr ? 1.3 : 1.18));
    hLines.forEach((line) => {
      ctx.fillText(line, alignX, cursorY);
      cursorY += hStep;
    });

    if (config.subtitle.trim()) {
      cursorY += 10;
      const subSize = isSquare ? 22 : isStory ? 28 : 25;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.88)';
      ctx.font = `500 ${subSize}px ${fontFamily}`;
      const sLines = wrapTextLines(ctx, config.subtitle, textMaxW, 2);
      sLines.forEach((line) => {
        ctx.fillText(line, alignX, cursorY);
        cursorY += Math.round(subSize * 1.42);
      });
    }

    const activeHighlights = config.highlights.map((h) => h.trim()).filter(Boolean);
    if (activeHighlights.length > 0) {
      cursorY += isSquare ? 18 : 26;
      const itemSize = isSquare ? 22 : isStory ? 27 : 24;
      const rowStep = isSquare ? 40 : isStory ? 54 : 46;
      ctx.font = `600 ${itemSize}px ${fontFamily}`;
      activeHighlights.forEach((item) => {
        const bulletR = 11;
        const bx = isAr ? alignX - bulletR : alignX + bulletR;
        const by = cursorY + Math.round(itemSize * 0.65);
        drawCheckBullet(ctx, bx, by, bulletR, config.accentColor, '#0B1E33');
        ctx.fillStyle = '#F8FAFC';
        const tx = isAr ? alignX - bulletR * 2 - 14 : alignX + bulletR * 2 + 14;
        ctx.fillText(item, tx, cursorY, textMaxW - 44);
        cursorY += rowStep;
      });
    }
    ctx.restore();

    // Footer strip inside navy panel
    const footerH = isSquare ? 104 : 122;
    const footerY = H - footerH;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(0, footerY, W, footerH);
    ctx.fillStyle = 'rgba(231, 179, 76, 0.35)';
    ctx.fillRect(pad, footerY, W - pad * 2, 1.5);

    const ctaText = config.ctaLabel || (isAr ? 'احجز الآن' : 'Réservez maintenant');
    ctx.font = `800 22px ${fontFamily}`;
    const ctaW = Math.min(410, Math.max(260, ctx.measureText(ctaText).width + 54));
    const ctaH = 58;
    const ctaX = isAr ? W - pad - ctaW : pad;
    const ctaY = footerY + (footerH - ctaH) / 2;
    ctx.fillStyle = config.accentColor;
    drawRoundedRectPath(ctx, ctaX, ctaY, ctaW, ctaH, 12);
    ctx.fill();
    ctx.fillStyle = '#0B1E33';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = isAr ? 'rtl' : 'ltr';
    ctx.fillText(ctaText, ctaX + ctaW / 2, ctaY + ctaH / 2 + 1, ctaW - 24);

    const infoX = isAr ? pad : W - pad;
    ctx.direction = 'ltr';
    ctx.textAlign = isAr ? 'left' : 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 32px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`WhatsApp · ${config.phoneLabel}`, infoX, footerY + footerH / 2 - 2);
    ctx.fillStyle = config.accentColor;
    ctx.font = `600 20px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(config.websiteLabel, infoX, footerY + footerH / 2 + 28);
    ctx.restore();
    return;
  }

  // Style 3: 'ivory_concierge' — Bright Luxury Hospitality / Resort Editorial Frame
  ctx.fillStyle = '#FAF8F3';
  ctx.fillRect(0, 0, W, H);

  // Subtle gold architectural top bar
  ctx.fillStyle = '#0D263E';
  ctx.fillRect(0, 0, W, 10);

  // Top Header Row on Ivory
  const topBarY = isStory ? 64 : 40;
  if (logoImg) {
    const ratio = logoImg.naturalWidth / Math.max(1, logoImg.naturalHeight);
    const lh = 56;
    const lw = Math.min(240, lh * ratio);
    const lx = isAr ? W - pad - lw : pad;
    ctx.drawImage(logoImg, lx, topBarY, lw, lh);
  } else {
    ctx.fillStyle = '#0D263E';
    ctx.font = `800 32px ${displayFamily}`;
    ctx.textAlign = isAr ? 'right' : 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(config.brandName, isAr ? W - pad : pad, topBarY + 8);
  }

  // Right/Left Eyebrow or flags in top bar
  if (config.flagCodes.length > 0) {
    drawFlagStrip(
      ctx,
      config.flagCodes,
      isAr ? pad : W - pad,
      topBarY + 12,
      !isAr,
      50,
      32
    );
  } else {
    ctx.save();
    ctx.fillStyle = '#9A6E1B';
    ctx.font = `700 22px ${fontFamily}`;
    ctx.direction = isAr ? 'rtl' : 'ltr';
    ctx.textAlign = isAr ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.websiteLabel, isAr ? pad : W - pad, topBarY + 28);
    ctx.restore();
  }

  // Framed Hero Photography Window
  const photoTop = topBarY + 78;
  const photoH = Math.round(H * (isStory ? 0.45 : isSquare ? 0.42 : 0.44));
  const photoW = W - pad * 2;
  ctx.save();
  drawRoundedRectPath(ctx, pad, photoTop, photoW, photoH, 26);
  ctx.clip();
  if (photoImg) {
    drawCoverImage(ctx, photoImg, pad, photoTop, photoW, photoH, 0.46);
  } else {
    ctx.fillStyle = '#1C4967';
    ctx.fillRect(pad, photoTop, photoW, photoH);
  }
  ctx.restore();

  // Hairline gold border around photo
  ctx.save();
  ctx.strokeStyle = 'rgba(200, 146, 42, 0.45)';
  ctx.lineWidth = 2;
  drawRoundedRectPath(ctx, pad, photoTop, photoW, photoH, 26);
  ctx.stroke();
  ctx.restore();

  // Optional Navy/Gold Price Card overlapping bottom corner of photo
  if (config.showPrice && config.priceLabel.trim()) {
    const pText = config.priceLabel.trim();
    ctx.save();
    ctx.font = `800 32px ${displayFamily}`;
    const pw = Math.min(photoW - 40, ctx.measureText(pText).width + 64);
    const ph = 66;
    const px = isAr ? pad + 24 : W - pad - 24 - pw;
    const py = photoTop + photoH - ph - 22;
    ctx.fillStyle = '#0D263E';
    drawRoundedRectPath(ctx, px, py, pw, ph, 14);
    ctx.fill();
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = config.accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pText, px + pw / 2, py + ph / 2 + 1, pw - 24);
    ctx.restore();
  }

  // Editorial Typography Section Below Photo
  const alignX = isAr ? W - pad : pad;
  const textMaxW = W - pad * 2;
  let cursorY = photoTop + photoH + (isSquare ? 34 : 46);

  ctx.save();
  ctx.direction = isAr ? 'rtl' : 'ltr';
  ctx.textAlign = isAr ? 'right' : 'left';
  ctx.textBaseline = 'top';

  ctx.fillStyle = '#B47B19';
  ctx.font = `700 ${isSquare ? 20 : 23}px ${fontFamily}`;
  ctx.fillText(config.eyebrow, alignX, cursorY, textMaxW);
  cursorY += isSquare ? 34 : 40;

  const hlSize = isSquare ? 42 : isStory ? 56 : 48;
  ctx.fillStyle = '#0D263E';
  ctx.font = `800 ${hlSize}px ${displayFamily}`;
  const hLines = wrapTextLines(ctx, config.headline, textMaxW, 2);
  hLines.forEach((line) => {
    ctx.fillText(line, alignX, cursorY);
    cursorY += Math.round(hlSize * (isAr ? 1.3 : 1.16));
  });

  if (config.subtitle.trim()) {
    cursorY += 8;
    const subSize = isSquare ? 21 : isStory ? 27 : 24;
    ctx.fillStyle = '#334155';
    ctx.font = `500 ${subSize}px ${fontFamily}`;
    const sLines = wrapTextLines(ctx, config.subtitle, textMaxW, 2);
    sLines.forEach((line) => {
      ctx.fillText(line, alignX, cursorY);
      cursorY += Math.round(subSize * 1.4);
    });
  }

  const activeHighlights = config.highlights.map((h) => h.trim()).filter(Boolean);
  if (activeHighlights.length > 0) {
    cursorY += isSquare ? 16 : 24;
    const itemSize = isSquare ? 21 : isStory ? 26 : 23;
    const rowStep = isSquare ? 38 : isStory ? 50 : 44;
    ctx.font = `700 ${itemSize}px ${fontFamily}`;
    activeHighlights.forEach((item) => {
      const bulletR = 11;
      const bx = isAr ? alignX - bulletR : alignX + bulletR;
      const by = cursorY + Math.round(itemSize * 0.65);
      drawCheckBullet(ctx, bx, by, bulletR, '#0D263E', config.accentColor);
      ctx.fillStyle = '#0D263E';
      const tx = isAr ? alignX - bulletR * 2 - 14 : alignX + bulletR * 2 + 14;
      ctx.fillText(item, tx, cursorY, textMaxW - 44);
      cursorY += rowStep;
    });
  }
  ctx.restore();

  // Solid Navy Bottom Footer Bar
  const footerH = isSquare ? 104 : 124;
  const footerY = H - footerH;
  ctx.save();
  ctx.fillStyle = '#0D263E';
  ctx.fillRect(0, footerY, W, footerH);
  ctx.fillStyle = config.accentColor;
  ctx.fillRect(0, footerY, W, 4);

  const ctaText = config.ctaLabel || (isAr ? 'احجز الآن' : 'Réservez maintenant');
  ctx.font = `800 22px ${fontFamily}`;
  const ctaW = Math.min(410, Math.max(260, ctx.measureText(ctaText).width + 54));
  const ctaH = 58;
  const ctaX = isAr ? W - pad - ctaW : pad;
  const ctaY = footerY + (footerH - ctaH) / 2;
  ctx.fillStyle = config.accentColor;
  drawRoundedRectPath(ctx, ctaX, ctaY, ctaW, ctaH, 12);
  ctx.fill();
  ctx.fillStyle = '#0D263E';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = isAr ? 'rtl' : 'ltr';
  ctx.fillText(ctaText, ctaX + ctaW / 2, ctaY + ctaH / 2 + 1, ctaW - 24);

  const infoX = isAr ? pad : W - pad;
  ctx.direction = 'ltr';
  ctx.textAlign = isAr ? 'left' : 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 32px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(`WhatsApp · ${config.phoneLabel}`, infoX, footerY + footerH / 2 - 2);
  ctx.fillStyle = config.accentColor;
  ctx.font = `600 20px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(config.websiteLabel, infoX, footerY + footerH / 2 + 28);
  ctx.restore();
}

export function slugifyPosterName(raw: string): string {
  return (
    raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 48) || 'easy2book-affiche'
  );
}

export async function exportSocialPosterPng(
  config: SocialPosterConfig,
  baseSlug: string
): Promise<{ fileName: string; sizeBytes: number; width: number; height: number }> {
  const fmt =
    SOCIAL_POSTER_FORMATS.find((f) => f.id === config.format) ??
    SOCIAL_POSTER_FORMATS[0];
  const offscreen = document.createElement('canvas');
  await renderSocialPosterToCanvas(offscreen, config);

  const blob = await new Promise<Blob>((resolve, reject) => {
    offscreen.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Impossible de générer le fichier PNG.'));
    }, 'image/png');
  });

  const safeSlug = slugifyPosterName(baseSlug || config.headline);
  const fileName = `Easy2Book-Affiche-${safeSlug}-${fmt.width}x${fmt.height}.png`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);

  return {
    fileName,
    sizeBytes: blob.size,
    width: fmt.width,
    height: fmt.height,
  };
}
