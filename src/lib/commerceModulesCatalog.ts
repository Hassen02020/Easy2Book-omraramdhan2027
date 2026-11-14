import type {
  BlockType,
  BrandIdentity,
  BrandVisualStyle,
  BusinessUniverse,
  CommerceModuleId,
  CreatorLanguage,
  HeaderVariant,
  PageFooterConfig,
  PageHeaderConfig,
} from '../types/creator';

export interface CommerceModuleDefinition {
  id: CommerceModuleId;
  labels: Record<CreatorLanguage, string>;
  capabilities: Record<CreatorLanguage, string>;
  blockType: BlockType;
  universeHint: BusinessUniverse;
  anchorId: string;
}

export const UNIVERSAL_COMMERCE_MODULES: CommerceModuleDefinition[] = [
  {
    id: 'omra',
    labels: {
      fr: 'Omra & Pèlerinages',
      en: 'Umrah & Pilgrimage',
      ar: 'العمرة والزيارات',
    },
    capabilities: {
      fr: 'Saisons, départs, hôtels Makkah/Médine, chambres et accompagnement',
      en: 'Seasons, departures, Makkah/Madinah hotels, room tiers & guidance',
      ar: 'المواسم، الرحلات، الفنادق، الغرف والمرافقة الدينية',
    },
    blockType: 'omra_departure_overview',
    universeHint: 'omra',
    anchorId: 'module-omra',
  },
  {
    id: 'hotels',
    labels: {
      fr: 'Hôtels & Séjours',
      en: 'Hotels & Resorts',
      ar: 'الفنادق والإقامات',
    },
    capabilities: {
      fr: 'Recherche, disponibilités, chambres, formules et promotions',
      en: 'Search, availability, room types, board plans & seasonal deals',
      ar: 'البحث، الغرف، الصيغ والعروض الترويجية',
    },
    blockType: 'module_hotels_search',
    universeHint: 'hotels_tunisie',
    anchorId: 'module-hotels',
  },
  {
    id: 'voyages',
    labels: {
      fr: 'Voyages organisés',
      en: 'Organized Tours',
      ar: 'الرحلات المنظمة',
    },
    capabilities: {
      fr: 'Circuits, programmes jour par jour, départs, groupes et inscriptions',
      en: 'Circuits, day-by-day itineraries, departures, groups & inquiries',
      ar: 'المسارات، البرامج اليومية، المجموعات والتسجيل',
    },
    blockType: 'voyage_itinerary',
    universeHint: 'voyages',
    anchorId: 'module-voyages',
  },
  {
    id: 'visa',
    labels: {
      fr: 'Services Visa',
      en: 'Visa Assistance',
      ar: 'خدمات التأشيرة',
    },
    capabilities: {
      fr: 'Pays couverts, types de visa, checklist pièces officielles et demandes',
      en: 'Countries, visa categories, required documents & application intake',
      ar: 'الدول، أنواع التأشيرات، قائمة الوثائق والطلبات',
    },
    blockType: 'visa_overview',
    universeHint: 'visa',
    anchorId: 'module-visa',
  },
  {
    id: 'flights',
    labels: {
      fr: 'Billetterie aérienne',
      en: 'Flight Ticketing',
      ar: 'تذاكر الطيران',
    },
    capabilities: {
      fr: 'Vols directs/escales, itinéraires, franchises bagages et émission',
      en: 'Routes, schedules, baggage rules and ticketing requests',
      ar: 'الرحلات الجوية، المسارات، الأمتعة وحجز التذاكر',
    },
    blockType: 'module_flights',
    universeHint: 'voyages',
    anchorId: 'module-vols',
  },
  {
    id: 'ferries',
    labels: {
      fr: 'Bateaux & Ferries',
      en: 'Ferries & Maritime',
      ar: 'البواخر والرحلات البحرية',
    },
    capabilities: {
      fr: 'Traversées Tunis–Gênes/Marseille, ports, cabines et véhicules',
      en: 'Crossings, ports, timetables, cabins and vehicle boarding',
      ar: 'الرحلات البحرية، الموانئ، المقصورات والسيارات',
    },
    blockType: 'module_ferries',
    universeHint: 'voyages',
    anchorId: 'module-bateaux',
  },
  {
    id: 'transfers',
    labels: {
      fr: 'Transferts Privés & Navettes',
      en: 'Airport & City Transfers',
      ar: 'النقل والتوصيل',
    },
    capabilities: {
      fr: 'Aéroport, hôtel, inter-villes, choix véhicule et demande sur mesure',
      en: 'Airport pickup, hotel/city transfers, vehicles & quotes',
      ar: 'نقل المطار، الفنادق، المدن واختيار المركبة',
    },
    blockType: 'module_transfers',
    universeHint: 'hotels_tunisie',
    anchorId: 'module-transferts',
  },
  {
    id: 'excursions',
    labels: {
      fr: 'Excursions & Attractions',
      en: 'Excursions & Attractions',
      ar: 'الرحلات اليومية والأنشطة',
    },
    capabilities: {
      fr: 'Activités, visites guidées, billets d’entrée, dates et participants',
      en: 'Tours, attraction tickets, schedules & participant requests',
      ar: 'الأنشطة السياحية، التذاكر، الجولات والمواعيد',
    },
    blockType: 'module_excursions',
    universeHint: 'voyages',
    anchorId: 'module-excursions',
  },
  {
    id: 'car_rental',
    labels: {
      fr: 'Location de voitures',
      en: 'Car Rental',
      ar: 'كراء السيارات',
    },
    capabilities: {
      fr: 'Catégories véhicules, agences de retrait, périodes et conditions',
      en: 'Vehicle fleet categories, pickup hubs, dates & rental conditions',
      ar: 'أنواع السيارات، نقاط الاستلام والفترات',
    },
    blockType: 'module_car_rental',
    universeHint: 'hotels_tunisie',
    anchorId: 'module-voitures',
  },
  {
    id: 'travel_insurance',
    labels: {
      fr: 'Assurance voyage',
      en: 'Travel Insurance',
      ar: 'تأمين السفر',
    },
    capabilities: {
      fr: 'Formules Schengen/Monde, garanties médicales, durée et devis',
      en: 'Schengen/worldwide coverage tiers, medical assistance & quotes',
      ar: 'صيغ التغطية الصحية للسفر والتأشيرة',
    },
    blockType: 'module_travel_insurance',
    universeHint: 'visa',
    anchorId: 'module-assurance',
  },
  {
    id: 'cruises',
    labels: {
      fr: 'Croisières & Restaurants',
      en: 'Cruises & Dining',
      ar: 'الرحلات البحرية والمطاعم',
    },
    capabilities: {
      fr: 'Croisières Méditerranée/Nil, escales, tables & expériences culinaires',
      en: 'Sea/river cruises, ports of call & culinary packages',
      ar: 'رحلات الكروز، الموانئ والتجارب المختارة',
    },
    blockType: 'module_cruises_vip',
    universeHint: 'voyages',
    anchorId: 'module-croisieres',
  },
  {
    id: 'vip_concierge',
    labels: {
      fr: 'Services VIP & Événements',
      en: 'VIP Concierge & Events',
      ar: 'خدمات كبار الشخصيات والفعاليات',
    },
    capabilities: {
      fr: 'Packages dynamiques, excursions privées, salons VIP et sur-mesure',
      en: 'Bespoke packages, private tours, VIP lounges & event travel',
      ar: 'باقات مخصصة، جولات خاصة واستقبال VIP',
    },
    blockType: 'module_cruises_vip',
    universeHint: 'voyages',
    anchorId: 'module-vip',
  },
];

export const STYLE_PALETTE_PRESETS: Record<
  BrandVisualStyle,
  Omit<BrandIdentity, 'brandName' | 'tagline' | 'logoSrc' | 'isProvisionalLogo'>
> = {
  premium: {
    primaryColor: '#102D45',
    secondaryColor: '#1C4967',
    accentColor: '#E7B34C',
    ctaColor: '#E7B34C',
    ctaTextColor: '#102D45',
    surfaceColor: '#FFFFFF',
    textColor: '#102D45',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'DM Sans',
    imageStyle: 'rounded',
    cardShape: 'soft',
    iconStyle: 'duotone',
    spacingScale: 'balanced',
    visualStyle: 'premium',
  },
  moderne: {
    primaryColor: '#0F172A',
    secondaryColor: '#0369A1',
    accentColor: '#0EA5E9',
    ctaColor: '#0284C7',
    ctaTextColor: '#FFFFFF',
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A',
    headingFont: 'Outfit',
    bodyFont: 'DM Sans',
    imageStyle: 'full_bleed',
    cardShape: 'rounded',
    iconStyle: 'outline',
    spacingScale: 'balanced',
    visualStyle: 'moderne',
  },
  luxe: {
    primaryColor: '#161B22',
    secondaryColor: '#2B3544',
    accentColor: '#C8922A',
    ctaColor: '#C8922A',
    ctaTextColor: '#FFFFFF',
    surfaceColor: '#FCFAF6',
    textColor: '#161B22',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    imageStyle: 'editorial',
    cardShape: 'sharp',
    iconStyle: 'outline',
    spacingScale: 'spacious',
    visualStyle: 'luxe',
  },
  minimaliste: {
    primaryColor: '#111827',
    secondaryColor: '#374151',
    accentColor: '#102D45',
    ctaColor: '#111827',
    ctaTextColor: '#FFFFFF',
    surfaceColor: '#FFFFFF',
    textColor: '#111827',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    imageStyle: 'editorial',
    cardShape: 'sharp',
    iconStyle: 'outline',
    spacingScale: 'spacious',
    visualStyle: 'minimaliste',
  },
  familial: {
    primaryColor: '#0F4C5C',
    secondaryColor: '#1D7075',
    accentColor: '#E7B34C',
    ctaColor: '#E7B34C',
    ctaTextColor: '#0F4C5C',
    surfaceColor: '#FFFFFF',
    textColor: '#0F3642',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    imageStyle: 'rounded',
    cardShape: 'rounded',
    iconStyle: 'duotone',
    spacingScale: 'balanced',
    visualStyle: 'familial',
  },
  commercial: {
    primaryColor: '#102D45',
    secondaryColor: '#1C4967',
    accentColor: '#D97706',
    ctaColor: '#D97706',
    ctaTextColor: '#FFFFFF',
    surfaceColor: '#FFFFFF',
    textColor: '#102D45',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    imageStyle: 'rounded',
    cardShape: 'soft',
    iconStyle: 'solid',
    spacingScale: 'compact',
    visualStyle: 'commercial',
  },
};

export function createDefaultBrandIdentity(params?: {
  brandName?: string;
  tagline?: string;
  logoSrc?: string | null;
  visualStyle?: BrandVisualStyle;
}): BrandIdentity {
  const style = params?.visualStyle ?? 'premium';
  const preset = STYLE_PALETTE_PRESETS[style];
  const logoSrc = params?.logoSrc ?? null;
  return {
    ...preset,
    brandName: params?.brandName?.trim() || 'Easy2Book',
    tagline: params?.tagline?.trim() || 'Plateforme Voyage, Hôtels & Omra',
    logoSrc,
    isProvisionalLogo: !logoSrc,
  };
}

export function createDefaultHeaderConfig(params?: {
  language?: CreatorLanguage;
  variant?: HeaderVariant;
  whatsappNumber?: string;
}): PageHeaderConfig {
  const lang = params?.language ?? 'fr';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';
  const wa = params?.whatsappNumber?.trim() ?? '';

  return {
    enabled: true,
    variant: params?.variant ?? 'premium',
    sticky: true,
    showLogo: true,
    showBrandName: true,
    navLinks: [
      {
        id: 'nav-presentation',
        label: isAr ? 'من نحن' : isEn ? 'Overview' : 'Présentation',
        target: '#presentation',
      },
      {
        id: 'nav-offres',
        label: isAr ? 'العروض' : isEn ? 'Offers' : 'Offres',
        target: '#offres',
      },
      {
        id: 'nav-avantages',
        label: isAr ? 'المزايا' : isEn ? 'Benefits' : 'Avantages',
        target: '#avantages',
      },
      {
        id: 'nav-faq',
        label: isAr ? 'الأسئلة' : isEn ? 'FAQ' : 'FAQ',
        target: '#faq',
      },
    ],
    ctaLabel: isAr ? 'اطلب عرضك' : isEn ? 'Request Quote' : 'Demander un devis',
    ctaTarget: '#form-block',
    showWhatsapp: Boolean(wa),
    whatsappNumber: wa,
    whatsappLabel: 'WhatsApp',
  };
}

export function createDefaultFooterConfig(params?: {
  brandName?: string;
  language?: CreatorLanguage;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}): PageFooterConfig {
  const lang = params?.language ?? 'fr';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';
  const brand = params?.brandName?.trim() || 'Easy2Book';
  const year = new Date().getFullYear();

  return {
    enabled: true,
    showLogo: true,
    companyDescription:
      params?.description?.trim() ||
      (isAr
        ? 'منصة متخصصة في تنظيم رحلات العمرة، الأسفار المنظمة، حجوزات الفنادق وخدمات التأشيرة.'
        : isEn
          ? 'Travel platform dedicated to organized tours, hotels, Umrah departures and visa advisory.'
          : 'Plateforme dédiée aux séjours organisés, hôtels en Tunisie, départs Omra et accompagnement Visa.'),
    navLinks: [
      {
        id: 'fnav-1',
        label: isAr ? 'الرئيسية' : isEn ? 'Home' : 'Accueil',
        target: '#top',
      },
      {
        id: 'fnav-2',
        label: isAr ? 'الخدمات' : isEn ? 'Services' : 'Services & Modules',
        target: '#offres',
      },
      {
        id: 'fnav-3',
        label: isAr ? 'الأسئلة الشائعة' : isEn ? 'FAQ' : 'Questions fréquentes',
        target: '#faq',
      },
      {
        id: 'fnav-4',
        label: isAr ? 'تواصل معنا' : isEn ? 'Contact' : 'Demande de contact',
        target: '#form-block',
      },
    ],
    phone: params?.phone?.trim() ?? '',
    whatsapp: params?.whatsapp?.trim() ?? '',
    email: params?.email?.trim() ?? '',
    address: params?.address?.trim() ?? '',
    socialLinks: {},
    legalLinks: {},
    copyrightText: `© ${year} ${brand}`,
  };
}
