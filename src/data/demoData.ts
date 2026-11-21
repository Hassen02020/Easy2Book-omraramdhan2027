import { createDefaultBrandIdentity } from '../lib/commerceModulesCatalog';
import { HERO_MEDIA_MAP } from '../lib/mediaRegistry';
import studioBackdropImg from '../assets/images/easy2book_studio_backdrop_1794604286505.jpg';
import type {
  CreatorLanguage,
  CreatorNotification,
  CreatorSettings,
  CreatorState,
  FormDefinition,
  MediaAsset,
  OfferReference,
  Page,
  PageBlock,
  PageTemplate,
  PageVersion,
  PageVersionSnapshot,
} from '../types/creator';

function makeForm(language: CreatorLanguage, universeLabel: string): FormDefinition {
  const isAr = language === 'ar';
  const isEn = language === 'en';
  return {
    formId: `form-${universeLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: isAr
      ? 'اطلب عرضك المخصص أو سجّل اهتمامك'
      : isEn
        ? 'Request Your Personalized Proposal'
        : 'Recevez votre proposition personnalisée',
    subtitle: isAr
      ? 'البيانات المرسلة عبر هذا النموذج مهيأة للربط مع نظام CRM الخارجي.'
      : isEn
        ? 'Submissions follow the typed Easy2Book CRM integration contract.'
        : 'Soumission préparée selon le contrat d’intégration CRM Easy2Book.',
    submitLabel: isAr
      ? 'إرسال طلب الاهتمام'
      : isEn
        ? 'Send Inquiry'
        : 'Envoyer ma demande',
    confirmationMessage: isAr
      ? 'تم تسجيل طلبك التجريبي بنجاح وتجهيز حمولة التكامل مع CRM.'
      : isEn
        ? 'Your demo inquiry was validated and formatted for the CRM contract.'
        : 'Demande validée en mode simulation et formatée selon le contrat CRM.',
    fields: [
      {
        key: 'fullName',
        label: isAr ? 'الاسم الكامل' : isEn ? 'Full Name' : 'Nom complet',
        placeholder: isAr ? 'مثال: أحمد بن علي' : isEn ? 'Ex: Amine Ben Ali' : 'Ex: Amine Ben Ali',
        enabled: true,
        required: true,
      },
      {
        key: 'phoneWhatsapp',
        label: isAr ? 'رقم الهاتف / واتساب' : isEn ? 'Phone / WhatsApp' : 'Téléphone / WhatsApp',
        placeholder: '98 140 514',
        enabled: true,
        required: true,
      },
      {
        key: 'email',
        label: isAr ? 'البريد الإلكتروني' : isEn ? 'Email Address' : 'Adresse e-mail',
        placeholder: 'client@exemple.tn',
        enabled: true,
        required: true,
      },
      {
        key: 'region',
        label: isAr ? 'الولاية / المدينة' : isEn ? 'City / Governorate' : 'Gouvernorat / Ville',
        placeholder: isAr ? 'تونس، صفاقس، سوسة...' : 'Tunis, Sfax, Sousse...',
        enabled: true,
        required: false,
      },
      {
        key: 'travelersCount',
        label: isAr ? 'عدد المسافرين' : isEn ? 'Number of Travelers' : 'Nombre de voyageurs',
        placeholder: '2',
        enabled: true,
        required: true,
      },
      {
        key: 'requestedDeparture',
        label: isAr ? 'تاريخ أو فترة السفر المطلوبة' : isEn ? 'Preferred Departure' : 'Date ou départ souhaité',
        placeholder: isAr ? 'رمضان 2027 / ديسمبر 2026' : 'Selon calendrier',
        enabled: true,
        required: false,
      },
      {
        key: 'message',
        label: isAr ? 'ملاحظات إضافية' : isEn ? 'Additional Notes' : 'Précisions complémentaires',
        placeholder: isAr ? 'غرف متجاورة، مرافقة كبار السن...' : 'Chambres communicantes, préférences...',
        enabled: true,
        required: false,
      },
      {
        key: 'consent',
        label: isAr
          ? 'أوافق على تواصل مستشار Easy2Book معي بخصوص هذا العرض'
          : isEn
            ? 'I agree to be contacted by an Easy2Book advisor regarding this offer'
            : 'J’accepte d’être recontacté par un conseiller Easy2Book pour cette offre',
        placeholder: '',
        enabled: true,
        required: true,
      },
    ],
  };
}

function blockBase(
  id: string,
  type: PageBlock['type'],
  category: PageBlock['category'],
  name: string,
  content: PageBlock['content'],
  style?: Partial<PageBlock['style']>
): PageBlock {
  return {
    id,
    type,
    category,
    name,
    visible: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    style: {
      backgroundColor: style?.backgroundColor ?? '#FFFFFF',
      textColor: style?.textColor ?? '#102D45',
      accentColor: style?.accentColor ?? '#E7B34C',
      alignment: style?.alignment ?? 'left',
      paddingY: style?.paddingY ?? 'normal',
      fontSizeScale: style?.fontSizeScale ?? 'md',
      borderStyle: style?.borderStyle ?? 'hairline',
    },
    content,
  };
}

export const DEMO_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'media-makkah-haram',
    title: 'La Mecque — Lever de soleil sur Masjid Al-Haram',
    universe: 'omra',
    src: HERO_MEDIA_MAP.makkah_haram.src,
    aspectRatio: '9:16',
    tags: ['omra', 'makkah', 'haram', 'ramadan'],
    isDemoAsset: true,
  },
  {
    id: 'media-tunis-flight',
    title: 'Vol Tunis – Djeddah au coucher du soleil',
    universe: 'omra',
    src: HERO_MEDIA_MAP.tunis_flight.src,
    aspectRatio: '9:16',
    tags: ['vol', 'tunisair', 'saudia', 'omra'],
    isDemoAsset: true,
  },
  {
    id: 'media-maysan-suite',
    title: 'Hôtel Maysan Al Multazim — Suite La Mecque',
    universe: 'omra',
    src: HERO_MEDIA_MAP.maysan_suite.src,
    aspectRatio: '9:16',
    tags: ['hotel', 'makkah', 'maysan', 'suite'],
    isDemoAsset: true,
  },
  {
    id: 'media-madinah-twilight',
    title: 'Médine — Esplanade Masjid Nabawi au crépuscule',
    universe: 'omra',
    src: HERO_MEDIA_MAP.madinah_twilight.src,
    aspectRatio: '9:16',
    tags: ['medine', 'nabawi', 'omra'],
    isDemoAsset: true,
  },
  {
    id: 'media-omra-vip-haram',
    title: 'Omra VIP 5★ — Suite Vue Panoramique Haram',
    universe: 'omra',
    src: HERO_MEDIA_MAP.omra_vip_haram.src,
    aspectRatio: '16:9',
    tags: ['omra', 'vip', '5-etoiles', 'haram', 'suite'],
    isDemoAsset: true,
  },
  {
    id: 'media-voyage-istanbul',
    title: 'Istanbul & Bosphore — Coucher de soleil',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.voyage_istanbul.src,
    aspectRatio: '16:9',
    tags: ['istanbul', 'turquie', 'circuit', 'voyage'],
    isDemoAsset: true,
  },
  {
    id: 'media-dubai-skyline',
    title: 'Dubaï Marina & Yachts — Skyline Luxe au crépuscule',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.dubai_skyline.src,
    aspectRatio: '16:9',
    tags: ['dubai', 'emirats', 'luxe', 'marina', 'yacht'],
    isDemoAsset: true,
  },
  {
    id: 'media-cairo-nile',
    title: 'Le Caire & Croisière Nil — Pyramides au coucher du soleil',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.cairo_nile.src,
    aspectRatio: '16:9',
    tags: ['caire', 'egypte', 'nil', 'pyramides', 'croisiere'],
    isDemoAsset: true,
  },
  {
    id: 'media-tunisia-resort',
    title: 'Hôtel Resort Tunisie 5★ — Piscine & Front de mer',
    universe: 'hotels_tunisie',
    src: HERO_MEDIA_MAP.tunisia_resort.src,
    aspectRatio: '16:9',
    tags: ['hammamet', 'djerba', 'resort', 'promo'],
    isDemoAsset: true,
  },
  {
    id: 'media-djerba-thalasso',
    title: 'Djerba Thalasso & Spa 5★ — Pavillon & Bien-être',
    universe: 'hotels_tunisie',
    src: HERO_MEDIA_MAP.djerba_thalasso.src,
    aspectRatio: '16:9',
    tags: ['djerba', 'thalasso', 'spa', 'plage', 'bien-etre'],
    isDemoAsset: true,
  },
  {
    id: 'media-sahara-tozeur',
    title: 'Sahara & Oasis Tozeur — Lodge Désert & Palmiers',
    universe: 'hotels_tunisie',
    src: HERO_MEDIA_MAP.sahara_tozeur.src,
    aspectRatio: '16:9',
    tags: ['tozeur', 'sahara', 'oasis', 'ecotourisme', 'desert'],
    isDemoAsset: true,
  },
  {
    id: 'media-visa-desk',
    title: 'Accompagnement Visa & Dossiers Consulaires',
    universe: 'visa',
    src: HERO_MEDIA_MAP.visa_desk.src,
    aspectRatio: '16:9',
    tags: ['visa', 'schengen', 'canada', 'conseil'],
    isDemoAsset: true,
  },
  {
    id: 'media-visa-europe',
    title: 'Visa Europe / Schengen — Paris & Mobilité Internationale',
    universe: 'visa',
    src: HERO_MEDIA_MAP.visa_europe.src,
    aspectRatio: '16:9',
    tags: ['visa', 'schengen', 'paris', 'etudes', 'affaires'],
    isDemoAsset: true,
  },
  {
    id: 'media-makkah-night',
    title: 'La Mecque — Masjid Al-Haram illuminé de nuit (Reel 9:16)',
    universe: 'omra',
    src: HERO_MEDIA_MAP.makkah_haram_night.src,
    aspectRatio: '9:16',
    tags: ['omra', 'makkah', 'haram', 'nuit', 'reel'],
    isDemoAsset: true,
  },
  {
    id: 'media-airline-cabin',
    title: 'Billetterie Aérienne — Vol au-dessus des nuages dorés',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.airline_business_cabin.src,
    aspectRatio: '16:9',
    tags: ['avion', 'billetterie', 'vols', 'affaires'],
    isDemoAsset: true,
  },
  {
    id: 'media-ferry-cruise',
    title: 'Bateaux & Ferries — Traversée & Croisière Méditerranée',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.ferry_mediterranean_cruise.src,
    aspectRatio: '16:9',
    tags: ['bateau', 'ferry', 'croisiere', 'mediterranee', 'ctn', 'gnv'],
    isDemoAsset: true,
  },
  {
    id: 'media-maldives-villa',
    title: 'Maldives — Villas sur pilotis & Voyage de noces',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.maldives_honeymoon.src,
    aspectRatio: '16:9',
    tags: ['maldives', 'lune-de-miel', 'evasion', 'lagon', 'luxe'],
    isDemoAsset: true,
  },
  {
    id: 'media-marrakech-riad',
    title: 'Marrakech & Atlas — Riad de luxe & Circuit culturel',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.marrakech_riad.src,
    aspectRatio: '16:9',
    tags: ['marrakech', 'maroc', 'riad', 'circuit', 'maghreb'],
    isDemoAsset: true,
  },
  {
    id: 'media-hammamet-marina',
    title: 'Yasmine Hammamet — Marina 5★ & Promenade Balnéaire',
    universe: 'hotels_tunisie',
    src: HERO_MEDIA_MAP.hammamet_marina.src,
    aspectRatio: '16:9',
    tags: ['hammamet', 'marina', 'yacht', 'hotel', 'tunisie'],
    isDemoAsset: true,
  },
  {
    id: 'media-sidi-bou-said',
    title: 'Sidi Bou Saïd — Excursions & Patrimoine Méditerranéen',
    universe: 'hotels_tunisie',
    src: HERO_MEDIA_MAP.sidi_bou_said.src,
    aspectRatio: '16:9',
    tags: ['sidi-bou-said', 'tunis', 'excursion', 'attraction', 'tunisie'],
    isDemoAsset: true,
  },
  {
    id: 'media-vip-transfer',
    title: 'Transferts VIP — Chauffeur Privé Aéroport & Hôtel 5★',
    universe: 'all',
    src: HERO_MEDIA_MAP.vip_airport_transfer.src,
    aspectRatio: '16:9',
    tags: ['transfert', 'vip', 'aeroport', 'voiture', 'chauffeur'],
    isDemoAsset: true,
  },
  {
    id: 'media-visa-canada',
    title: 'Visa Canada & Amérique du Nord — Toronto Waterfront',
    universe: 'visa',
    src: HERO_MEDIA_MAP.visa_canada.src,
    aspectRatio: '16:9',
    tags: ['visa', 'canada', 'toronto', 'etudes', 'immigration'],
    isDemoAsset: true,
  },
  {
    id: 'media-studio-backdrop',
    title: 'Fond Studio Easy2Book Blanc & Or 3D',
    universe: 'all',
    src: studioBackdropImg,
    aspectRatio: '9:16',
    tags: ['brand', 'backdrop', 'studio'],
    isDemoAsset: true,
  },
  {
    id: 'media-easy2book-logo',
    title: 'Logo Officiel Easy2Book (PNG Transparent)',
    universe: 'all',
    src: '/assets/aistudio/logo_transparent_e9918557.png',
    aspectRatio: '1:1',
    tags: ['logo', 'brand', 'officiel'],
    isDemoAsset: true,
  },
  {
    id: 'media-egypt-pyramids-gem',
    title: 'Le Caire — Pyramides de Gizeh & Grand Musée Égyptien (16:9)',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.egypt_pyramids_museum.src,
    aspectRatio: '16:9',
    tags: ['egypte', 'caire', 'pyramides', 'musee', 'excursion'],
    isDemoAsset: true,
  },
  {
    id: 'media-egypt-nile-dinner',
    title: 'Soirée Dîner-Croisière sur le Nil — Le Caire (16:9)',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.egypt_nile_dinner.src,
    aspectRatio: '16:9',
    tags: ['egypte', 'nil', 'croisiere', 'soiree', 'caire'],
    isDemoAsset: true,
  },
  {
    id: 'media-egypt-islamic-cairo',
    title: 'Le Caire Islamique — Citadelle & Khan El Khalili (16:9)',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.egypt_islamic_cairo.src,
    aspectRatio: '16:9',
    tags: ['egypte', 'caire', 'islamique', 'citadelle', 'khan-el-khalili'],
    isDemoAsset: true,
  },
  {
    id: 'media-egypt-pyramids-reel',
    title: 'Reel Égypte 9:16 — Pyramides de Gizeh & Grand Musée',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.egypt_pyramids_reel.src,
    aspectRatio: '9:16',
    tags: ['egypte', 'reel', '9:16', 'pyramides', 'video'],
    isDemoAsset: true,
  },
  {
    id: 'media-egypt-nile-reel',
    title: 'Reel Égypte 9:16 — Dîner-Croisière sur le Nil & Soirée',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.egypt_nile_reel.src,
    aspectRatio: '9:16',
    tags: ['egypte', 'reel', '9:16', 'nil', 'croisiere'],
    isDemoAsset: true,
  },
  {
    id: 'media-egypt-transfer-reel',
    title: 'Reel Égypte 9:16 — Transfert Privé VIP Aéroport Le Caire',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.egypt_transfer_reel.src,
    aspectRatio: '9:16',
    tags: ['egypte', 'reel', '9:16', 'transfert', 'vip'],
    isDemoAsset: true,
  },
  {
    id: 'media-egypt-islamic-reel',
    title: 'Reel Égypte 9:16 — القاهرة الإسلامية وشارع المعز',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.egypt_islamic_reel.src,
    aspectRatio: '9:16',
    tags: ['egypte', 'reel', '9:16', 'islamique', 'khan-el-khalili'],
    isDemoAsset: true,
  },
  {
    id: 'media-turkey-sapanca-lake',
    title: 'Turquie — Lac de Sapanca & Maşukiye (16:9)',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.turkey_sapanca_lake.src,
    aspectRatio: '16:9',
    tags: ['turquie', 'sapanca', 'masukiye', 'izmit', 'excursion'],
    isDemoAsset: true,
  },
  {
    id: 'media-turkey-bosphorus-cruise',
    title: 'Turquie — Soirée Dîner-Croisière sur le Bosphore (16:9)',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.turkey_bosphorus_cruise.src,
    aspectRatio: '16:9',
    tags: ['turquie', 'istanbul', 'bosphore', 'croisiere', 'soiree'],
    isDemoAsset: true,
  },
  {
    id: 'media-turkey-princes-islands',
    title: 'Turquie — Croisière Îles des Princes Büyükada (16:9)',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.turkey_princes_islands.src,
    aspectRatio: '16:9',
    tags: ['turquie', 'istanbul', 'iles-des-princes', 'croisiere'],
    isDemoAsset: true,
  },
  {
    id: 'media-turkey-antalya-coast',
    title: 'Turquie — Pack Antalya Côte Turquoise & Bateau Pirate (16:9)',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.turkey_antalya_coast.src,
    aspectRatio: '16:9',
    tags: ['turquie', 'antalya', 'zipline', 'rafting', 'couple'],
    isDemoAsset: true,
  },
  {
    id: 'media-turkey-istanbul-reel',
    title: 'Reel Turquie 9:16 — Istanbul & Bosphore au coucher du soleil',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.turkey_istanbul_reel.src,
    aspectRatio: '9:16',
    tags: ['turquie', 'reel', '9:16', 'istanbul', 'video'],
    isDemoAsset: true,
  },
  {
    id: 'media-turkey-bosphorus-reel',
    title: 'Reel Turquie 9:16 — Soirée Dîner-Croisière Bosphore',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.turkey_bosphorus_reel.src,
    aspectRatio: '9:16',
    tags: ['turquie', 'reel', '9:16', 'bosphore', 'soiree'],
    isDemoAsset: true,
  },
  {
    id: 'media-turkey-sapanca-reel',
    title: 'Reel Turquie 9:16 — Sapanca, Maşukiye & Transfert Vito VIP',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.turkey_sapanca_reel.src,
    aspectRatio: '9:16',
    tags: ['turquie', 'reel', '9:16', 'sapanca', 'transfert'],
    isDemoAsset: true,
  },
  {
    id: 'media-visa-desk-reel',
    title: 'Reel Visa 9:16 — Dossiers Consulaires, Égypte 4h & E-Visa',
    universe: 'visa',
    src: HERO_MEDIA_MAP.visa_desk.src,
    aspectRatio: '9:16',
    tags: ['visa', 'reel', '9:16', 'schengen', 'e-visa'],
    isDemoAsset: true,
  },
  {
    id: 'media-visa-europe-reel',
    title: 'Reel Visa 9:16 — Schengen Paris, Études & Affaires',
    universe: 'visa',
    src: HERO_MEDIA_MAP.visa_europe.src,
    aspectRatio: '9:16',
    tags: ['visa', 'reel', '9:16', 'schengen', 'paris'],
    isDemoAsset: true,
  },
  {
    id: 'media-visa-canada-reel',
    title: 'Reel Visa 9:16 — Canada, USA, UK & Australie',
    universe: 'visa',
    src: HERO_MEDIA_MAP.visa_canada.src,
    aspectRatio: '9:16',
    tags: ['visa', 'reel', '9:16', 'canada', 'usa'],
    isDemoAsset: true,
  },
  {
    id: 'media-excursions-general-reel',
    title: 'Reel Excursions 9:16 — Égypte, Turquie, Dubaï & Tunisie',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.dubai_skyline.src,
    aspectRatio: '9:16',
    tags: ['excursions', 'reel', '9:16', 'dubai', 'circuits'],
    isDemoAsset: true,
  },
  {
    id: 'media-flights-tabs-stress',
    title: 'Reel Avion & Bateau 9:16 — Scène 1 : STOP aux 15 onglets ouverts',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.flights_tabs_stress.src,
    aspectRatio: '9:16',
    tags: ['avion', 'bateau', 'reel', '9:16', 'billetterie'],
    isDemoAsset: true,
  },
  {
    id: 'media-flights-relaxed-suitcase',
    title: 'Reel Avion & Bateau 9:16 — Scène 2 : Clap détendu, valise prête',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.flights_relaxed_suitcase.src,
    aspectRatio: '9:16',
    tags: ['avion', 'bateau', 'reel', '9:16', 'voyage'],
    isDemoAsset: true,
  },
  {
    id: 'media-flights-med-ship',
    title: 'Reel Avion & Bateau 9:16 — Scène 3 : Traversées Méditerranée & Ferries',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.flights_mediterranean_ship.src,
    aspectRatio: '9:16',
    tags: ['bateau', 'ferry', 'mediterranee', '9:16'],
    isDemoAsset: true,
  },
  {
    id: 'media-flights-mobile-eticket',
    title: 'Reel Avion & Bateau 9:16 — Scène 4 : E-billet en 3 clics sur mobile',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.flights_mobile_eticket.src,
    aspectRatio: '9:16',
    tags: ['ebillet', 'mobile', 'avion', 'bateau', '9:16'],
    isDemoAsset: true,
  },
  {
    id: 'media-evisa-passport-globe',
    title: 'Reel E-Visa 9:16 — 0–4 s : Passeport tunisien + globe',
    universe: 'visa',
    src: HERO_MEDIA_MAP.evisa_passport_globe.src,
    aspectRatio: '9:16',
    tags: ['e-visa', 'passeport', 'tunisie', 'reel', '9:16'],
    isDemoAsset: true,
  },
  {
    id: 'media-evisa-world-map',
    title: 'Reel E-Visa 9:16 — 4–10 s : Carte du monde & connexions',
    universe: 'visa',
    src: HERO_MEDIA_MAP.evisa_world_map.src,
    aspectRatio: '9:16',
    tags: ['e-visa', 'carte', 'monde', 'reel', '9:16'],
    isDemoAsset: true,
  },
  {
    id: 'media-evisa-destinations-collage',
    title: 'Reel E-Visa 9:16 — 10–23 s : Destinations E-Visa (Afrique, Asie, Europe, Amériques)',
    universe: 'visa',
    src: HERO_MEDIA_MAP.evisa_destinations_collage.src,
    aspectRatio: '9:16',
    tags: ['e-visa', 'destinations', 'rwanda', 'vietnam', 'albanie', '9:16'],
    isDemoAsset: true,
  },
  {
    id: 'media-evisa-mobile-companion',
    title: 'Reel E-Visa 9:16 — 23–33 s : Accompagnement Easy2Book & téléphone',
    universe: 'visa',
    src: HERO_MEDIA_MAP.evisa_mobile_companion.src,
    aspectRatio: '9:16',
    tags: ['e-visa', 'accompagnement', 'easy2book', '9:16'],
    isDemoAsset: true,
  },
];

const OMRA_RAMADAN_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-omra-hero-vid',
    'hero_video',
    'common',
    'Hero Vidéo 9:16 (Voix Tunisienne)',
    {
      eyebrow: 'عمرة شهر رمضان كامل · مكة المكرمة والمدينة المنورة',
      title: 'عمرة رمضان الكل في مكة المكرمة... بسفر أسهل وقلب مطمئن',
      description:
        'برنامج متكامل من Easy2Book يشمل طيران تونس – جدة – تونس، التأشيرة، التأطير الديني والإداري خطوة بخطوة، إقامة مريحة في فندق ميسان الملتزم، ورحلة روحانية للمدينة المنورة.',
      imageKey: 'makkah_haram',
      primaryCtaLabel: 'احجز مكانك الآن',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { alignment: 'right', backgroundColor: '#FBF9F4', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-omra-overview',
    'omra_departure_overview',
    'omra',
    'Présentation Départ Omra',
    {
      eyebrow: 'تقديم الرحلة والموسم',
      title: 'رحلة روحانية متكاملة بإشراف إداري وديني متواصل',
      description:
        'تنطلق الرحلة من مطار تونس قرطاج نحو جدة مع استقبال ومرافقة ميدانية من لحظة الوصول حتى العودة.',
      items: [
        { id: 'ov1', title: 'طيران مباشر ذهاباً وإياباً', subtitle: 'تونس – جدة – تونس على رحلات منتظمة', badge: 'طيران' },
        { id: 'ov2', title: 'استخراج التأشيرة والإجراءات', subtitle: 'تكفّل إداري كامل بملف العمرة', badge: 'تأشيرة' },
        { id: 'ov3', title: 'تأطير ديني وميداني مرافق', subtitle: 'مرشدون متخصصون طيلة فترة الإقامة', badge: 'مرافقة' },
      ],
    },
    { alignment: 'right' }
  ),
  blockBase(
    'blk-omra-hotels',
    'omra_hotels',
    'omra',
    'Hôtels Omra (Makkah & Madinah)',
    {
      eyebrow: 'الإقامة المختارة',
      title: 'فنادق قريبة ومنظمة في مكة والمدينة',
      description: 'مختارة بعناية لراحة العائلات وكبار السن طيلة الشهر الفضيل.',
      imageKey: 'maysan_suite',
      items: [
        { id: 'h1', title: 'مكة المكرمة · فندق ميسان الملتزم', subtitle: 'إقامة مريحة مع خدمة التوصيل والنظافة اليومية', badge: 'مكة' },
        { id: 'h2', title: 'المدينة المنورة · المنطقة المركزية', subtitle: 'إقامة هادئة ومجاورة للساحات النبوية', badge: 'المدينة' },
      ],
    },
    { alignment: 'right', backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-omra-rates',
    'omra_room_rates',
    'omra',
    'Tarifs par Chambre & Remise Famille',
    {
      eyebrow: 'الأسعار الرسمية للعرض',
      title: 'التسعيرة حسب نوع الغرفة',
      description:
        'تخفيض 200 د.ت للعائلات انطلاقاً من شخصين · مجموعات تفوق 10 أشخاص الاتصال للحصول على الإمكانية.',
      items: [
        { id: 'rate-quad', title: 'غرفة رباعية أو خماسية', price: '5,900 د.ت', subtitle: 'للشخص · شاملة الطيران والتأشيرة' },
        { id: 'rate-triple', title: 'غرفة ثلاثية', price: '6,400 د.ت', subtitle: 'للشخص · مثالية للعائلات الصغيرة' },
        { id: 'rate-double', title: 'غرفة ثنائية', price: '6,900 د.ت', subtitle: 'للشخص · خصوصية وراحة للأزواج' },
      ],
    },
    { alignment: 'right' }
  ),
  blockBase(
    'blk-omra-testimonials',
    'testimonials',
    'common',
    'شهادات العملاء السابقين',
    {
      eyebrow: 'تجارب حقيقية موثقة من تونس',
      title: 'شهادات العملاء الذين سافروا مع Easy2Book',
      description: 'آراء معتمرين وعائلات رافقناهم خلال المواسم السابقة.',
    },
    { alignment: 'right' }
  ),
  blockBase(
    'blk-omra-countdown',
    'countdown',
    'common',
    'Compte à rebours Validité',
    {
      eyebrow: 'عدد غرف محدود جداً',
      title: 'عرض صالح لـ 15 ديسمبر 2026',
      description: 'احجز قبل انتهاء الصلاحية للاستفادة من تعريفة الحجز المبكر.',
      targetDateIso: '2026-12-15T23:59:59',
    },
    { alignment: 'right', backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
  blockBase(
    'blk-omra-form',
    'lead_form',
    'common',
    'Formulaire de demande CRM',
    {
      eyebrow: 'حجز واستفسار',
      title: 'أرسل طلبك ليتواصل معك مستشار العمرة',
      description: 'سيتم توجيه بيانات هذا الطلب عبر عقد التكامل المخصص لنظام CRM.',
    },
    { alignment: 'right' }
  ),
  blockBase(
    'blk-omra-wa',
    'whatsapp_button',
    'common',
    'Bouton WhatsApp 98 140 514',
    {
      eyebrow: 'تواصل مباشر',
      title: 'أو تحدث مباشرة مع فريق Easy2Book على واتساب',
      description: 'إجراء تواصل سريع ومستقل عن نموذج CRM.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'واتساب مباشر · 98 140 514',
        prefilledMessage: 'السلام عليكم، أرغب في الاستفسار عن عمرة شهر رمضان كامل مع Easy2Book.',
        trackAsCrmLead: false,
      },
    },
    { alignment: 'right', backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-omra-footer',
    'footer',
    'common',
    'Footer Easy2Book',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { alignment: 'right', backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const VOYAGE_ISTANBUL_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-voy-hero',
    'hero_image',
    'common',
    'Hero Voyage Istanbul',
    {
      eyebrow: 'Easy2Book · Voyages Organisés',
      title: 'Istanbul & Bosphore — 8 Jours / 7 Nuits en Hôtel 4★',
      description:
        'Vol direct Tunis – Istanbul – Tunis, transferts privés, croisière sur le Bosphore et visites guidées francophones.',
      imageKey: 'voyage_istanbul',
      primaryCtaLabel: 'Demander un devis',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-voy-tr-hero-vid',
    'hero_video',
    'common',
    'Vidéo 9:16 · Excursions Turquie (Voix Tunisienne)',
    {
      eyebrow: 'Easy2Book · رحلات تركيا اليومية (فيديو 9:16)',
      title: 'اكتشف إسطنبول، صبنجا، البسفور وأنطاليا بالفيديو 9:16',
      description:
        'فيديو ترويجي عمودي مع تعليق صوتي نسائي تونسي (Layla) يغطي الرحلات اليومية وتوصيل المطار VIP في إسطنبول وأنطاليا.',
      imageKey: 'turkey_istanbul_reel',
      reelPreset: 'turkey_excursions',
      primaryCtaLabel: 'احجز رحلتك في تركيا',
      primaryCtaTarget: '#form-block',
    },
    { backgroundColor: '#FAF9F6' }
  ),
  blockBase(
    'blk-voy-itinerary',
    'voyage_day_by_day',
    'voyages',
    'Programme Jour par Jour',
    {
      eyebrow: 'Itinéraire du circuit',
      title: 'Les temps forts de votre séjour',
      description: 'Un équilibre pensé entre découvertes culturelles et temps libre shopping.',
      items: [
        { id: 'd1', title: 'Jour 1 – 2 · Arrivée & Quartier Historique', subtitle: 'Sultanahmet, Sainte-Sophie, Mosquée Bleue & Grand Bazar' },
        { id: 'd2', title: 'Jour 3 – 4 · Croisière Bosphore & Îles des Princes', subtitle: 'Déjeuner à bord, Palais de Dolmabahçe & quartier Taksim' },
        { id: 'd3', title: 'Jour 5 – 8 · Excursion Bursa & Temps libre', subtitle: 'Téléphérique Uludağ, marchés traditionnels et vol retour' },
      ],
    }
  ),
  blockBase(
    'blk-voy-pricing',
    'voyage_pricing',
    'voyages',
    'Tarifs & Départs',
    {
      eyebrow: 'Grille indicative (référence catalogue)',
      title: 'Formules & Options',
      description: 'Tarifs affichés à titre de référence depuis l’offre liée.',
      items: [
        { id: 'vp1', title: 'Adulte en chambre double', price: '2,490 DT', subtitle: 'Vol + Hôtel 4★ PDJ + Transferts' },
        { id: 'vp2', title: 'Supplément chambre single', price: '+620 DT', subtitle: 'Selon disponibilité hôtelière' },
        { id: 'vp3', title: 'Enfant (-12 ans avec 2 adultes)', price: '1,890 DT', subtitle: 'Lit supplémentaire inclus' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-voy-form',
    'lead_form',
    'common',
    'Formulaire Voyage',
    {
      eyebrow: 'Réservation & Disponibilités',
      title: 'Recevez le programme détaillé PDF & devis',
      description: 'Réponse rapide par un conseiller voyages Easy2Book.',
    }
  ),
  blockBase(
    'blk-voy-wa',
    'whatsapp_button',
    'common',
    'Bouton WhatsApp',
    {
      eyebrow: 'Contact direct',
      title: 'Parler à un conseiller Circuit',
      description: 'Lien WhatsApp configurable sans création de lead CRM.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'WhatsApp Voyages · 98 140 514',
        prefilledMessage: 'Bonjour Easy2Book, je souhaite des informations sur le circuit Istanbul 8J/7N.',
        trackAsCrmLead: false,
      },
    }
  ),
  blockBase(
    'blk-voy-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const HOTEL_TUNISIE_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-htl-hero',
    'hero_image',
    'common',
    'Hero Hôtel Tunisie',
    {
      eyebrow: 'Hôtels Tunisie · Promotion Saisonnière',
      title: 'Séjour Resort 5★ Yasmine Hammamet — All Inclusive',
      description:
        'Profitez des tarifs préférentiels hiver & printemps avec accès Thalasso, piscine chauffée et gratuité 1er enfant.',
      imageKey: 'tunisia_resort',
      primaryCtaLabel: 'Vérifier les disponibilités',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-htl-card',
    'hotel_card',
    'hotels_tunisie',
    'Fiche Hôtel & Atouts',
    {
      eyebrow: 'Établissement partenaire',
      title: 'Catégorie 5★ · Front de mer · Yasmine Hammamet',
      description: 'Idéal pour séjours couples et familles avec animation et spa.',
      items: [
        { id: 'ha1', title: 'Piscine couverte chauffée & Spa Thalasso', subtitle: 'Accès préférentiel pour nos clients' },
        { id: 'ha2', title: 'Restauration All-Inclusive', subtitle: 'Buffets variés & boissons locales incluses' },
      ],
    }
  ),
  blockBase(
    'blk-htl-pricing',
    'hotel_pricing',
    'hotels_tunisie',
    'Tarifs par formule',
    {
      eyebrow: 'Tarification promotionnelle',
      title: 'Formules disponibles',
      description: 'Tarifs par personne et par nuit selon la période choisie.',
      items: [
        { id: 'hp1', title: 'Demi-Pension (DP)', price: '215 DT / nuit', subtitle: 'Petit déjeuner + dîner buffet' },
        { id: 'hp2', title: 'All-Inclusive Soft', price: '265 DT / nuit', subtitle: 'Tous repas + pauses gourmandes' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-htl-form',
    'lead_form',
    'common',
    'Formulaire Hôtel',
    {
      eyebrow: 'Demande de disponibilité',
      title: 'Confirmez vos dates de séjour',
      description: 'Transmettez vos dates et nombre d’adultes/enfants.',
    }
  ),
  blockBase(
    'blk-htl-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const VISA_FRANCE_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-vis-hero',
    'hero_image',
    'common',
    'Hero Service Visa',
    {
      eyebrow: 'Easy2Book · Assistance Visa & Dossiers',
      title: 'Accompagnement Visa Schengen (France) — Tourisme & Affaires',
      description:
        'Audit préalable de votre dossier, prise de rendez-vous TLScontact, réservation hôtelière & attestation de vol vérifiable.',
      imageKey: 'visa_desk',
      primaryCtaLabel: 'Demander une évaluation',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-vis-fr-hero-vid',
    'hero_video',
    'common',
    'Vidéo 9:16 · Visa Schengen & Mobilité',
    {
      eyebrow: 'Easy2Book · فيزا شنغن وأوروبا (فيديو 9:16)',
      title: 'تحضير ملف فيزا شنغن وفرنسا بالفيديو مع تعليق صوتي تونسي',
      description:
        'عرض عمودي 9:16 بتعليق صوتي نسائي تونسي (Layla) يشرح مراحل تحضير الملف، المواعيد القياسية و Prime Time، وحجوزات السفر.',
      imageKey: 'visa_europe',
      reelPreset: 'visa_schengen',
      primaryCtaLabel: 'أودع ملف التأشيرة',
      primaryCtaTarget: '#form-block',
    },
    { backgroundColor: '#FAF9F6' }
  ),
  {
    ...blockBase(
      'blk-vis-fr-pricing',
      'voyage_pricing',
      'visa',
      'Tarifs Espace Schengen · Standard & Prime Time',
      {
        eyebrow: 'ESPACE SCHENGEN • TARIFS EASY2BOOK',
        title: 'Formules Rendez-vous & Dossier Consulaire',
        description: 'Documents requis : Copie passeport + photo d’identité fond blanc.',
        items: [
          {
            id: 'vfr-1',
            badge: 'RDV Standard',
            title: 'Rendez-vous Schengen Standard + Dossier',
            subtitle: 'Saisie officielle, réservations et assurance voyage',
            price: '180 DT',
          },
          {
            id: 'vfr-2',
            badge: 'Prime Time inclus',
            title: 'Rendez-vous Schengen · Prime Time inclus',
            subtitle: 'Accès prioritaire aux créneaux Prime Time',
            price: '280 DT',
          },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-vis-docs',
    'visa_documents',
    'visa',
    'Checklist Générale des Pièces',
    {
      eyebrow: 'Préparation administrative',
      title: 'Pièces généralement demandées (Checklist indicative)',
      description:
        'Note : Cette page présente uniquement la liste publique des pièces requises. Aucune pièce ni dossier client personnel n’est stocké ou affiché ici.',
      items: [
        { id: 'vd1', title: 'Passeport en cours de validité (+3 mois après retour)', subtitle: 'Avec au moins 2 pages vierges' },
        { id: 'vd2', title: 'Justificatifs socio-professionnels & bancaires', subtitle: 'Attestation de travail / registre / relevés 3 mois' },
        { id: 'vd3', title: 'Assurance voyage & pré-réservations', subtitle: 'Préparés avec votre conseiller Easy2Book' },
      ],
    }
  ),
  blockBase(
    'blk-vis-steps',
    'visa_steps',
    'visa',
    'Étapes de Traitement',
    {
      eyebrow: 'Méthode Easy2Book',
      title: 'Votre accompagnement en 4 étapes',
      description: 'Un parcours transparent du diagnostic jusqu’au dépôt.',
      items: [
        { id: 'vs1', title: '1. Audit de conformité du profil', subtitle: 'Vérification des critères consulaires officiels' },
        { id: 'vs2', title: '2. Montage complet & formulaire officiel', subtitle: 'Saisie sans erreur + réservations justificatives' },
        { id: 'vs3', title: '3. Planification RDV biométrique', subtitle: 'Préparation de l’entretien et du dossier papier' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-vis-form',
    'lead_form',
    'common',
    'Formulaire Demande Visa',
    {
      eyebrow: 'Évaluation rapide',
      title: 'Prenez rendez-vous avec notre pôle Visa',
      description: 'Indiquez votre pays de destination et vos dates envisagées.',
    }
  ),
  blockBase(
    'blk-vis-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const OMRA_VIP_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-omra-vip-hero',
    'hero_image',
    'common',
    'Hero Omra VIP 5★ Vue Haram',
    {
      eyebrow: 'Easy2Book Prestige · Omra 5★ Accès Direct Haram',
      title: 'Omra Prestige 5★ — Suites Vue Kaaba & Transferts Privés',
      description:
        'Un accompagnement haut de gamme conçu pour les dirigeants, couples et familles souhaitant un accès piéton direct à l’esplanade du Haram et des prestations sur mesure.',
      imageKey: 'omra_vip_haram',
      primaryCtaLabel: 'Réserver un entretien VIP',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-omra-vip-hotels',
    'omra_hotels',
    'omra',
    'Palaces & Suites Sélectionnées',
    {
      eyebrow: 'Hôtellerie 5★ sur l’Esplanade',
      title: 'Zéro navette : accès immédiat aux prières',
      description: 'Petit-déjeuner international et Iftar / Dîner gastronomique inclus.',
      imageKey: 'omra_vip_haram',
      items: [
        { id: 'vip-h1', title: 'La Mecque · Swissôtel / Clock Tower 5★', subtitle: 'Chambres & Suites avec vue directe sur Masjid Al-Haram', badge: '0m du Haram' },
        { id: 'vip-h2', title: 'Médine · Pullman Zamzam / Oberoi 5★', subtitle: 'Face à la porte des femmes et esplanade Nabawi', badge: '5★ Central' },
      ],
    }
  ),
  blockBase(
    'blk-omra-vip-rates',
    'omra_room_rates',
    'omra',
    'Grille Suites & Chambres VIP',
    {
      eyebrow: 'Tarification Prestige (Référence catalogue)',
      title: 'Formules Double, Suite & Affaires',
      description: 'Option vol en Classe Affaires Tunis – Djeddah sur demande.',
      items: [
        { id: 'vip-r1', title: 'Chambre Triple Prestige', price: '8,450 DT', subtitle: 'Vol direct + Hôtels 5★ esplanade + Train Haramain' },
        { id: 'vip-r2', title: 'Chambre Double Vue Haram', price: '9,800 DT', subtitle: 'Accès direct Haram + Transfert privé GMC' },
        { id: 'vip-r3', title: 'Suite Junior Famille', price: 'Sur devis', subtitle: 'Capacité 2 à 4 personnes avec salon privé' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-omra-vip-form',
    'lead_form',
    'common',
    'Formulaire Conseiller VIP',
    {
      eyebrow: 'Ligne directe Conseiller Prestige',
      title: 'Recevez la brochure VIP & disponibilités suites',
      description: 'Transmission immédiate à votre conseiller dédié.',
    }
  ),
  blockBase(
    'blk-omra-vip-wa',
    'whatsapp_button',
    'common',
    'WhatsApp VIP',
    {
      eyebrow: 'Conciergerie WhatsApp',
      title: 'Échange confidentiel sur WhatsApp Business',
      description: 'Réponse prioritaire pour les départs VIP & groupes familiaux.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'WhatsApp Prestige · 98 140 514',
        prefilledMessage: 'Bonjour Easy2Book, je souhaite des informations sur la formule Omra VIP 5★.',
        trackAsCrmLead: false,
      },
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-omra-vip-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const OMRA_FAMILLE_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-omra-fam-hero',
    'hero_image',
    'common',
    'Hero Omra Familles & Vacances',
    {
      eyebrow: 'Départs Vacances Scolaires · Programme Adapté',
      title: 'Omra en Famille — Encadrement Bienveillant & Chambres Communicantes',
      description:
        'Un départ pensé pour réunir parents, enfants et grands-parents dans la sérénité : vols directs, visites éducatives à Médine et tarifs préférentiels enfants.',
      imageKey: 'madinah_twilight',
      primaryCtaLabel: 'Vérifier les places famille',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-omra-fam-services',
    'omra_services',
    'omra',
    'Atouts Accompagnement Famille',
    {
      eyebrow: 'Confort & Sérénité',
      title: 'Pensé pour tous les âges',
      description: 'Chaque détail logistique est préparé avant le départ de Tunis.',
      items: [
        { id: 'fam-s1', title: 'Chambres communicantes & lits bébés', subtitle: 'Priorité d’attribution dès la réservation', badge: 'Hébergement' },
        { id: 'fam-s2', title: 'Assistance mobilité seniors', subtitle: 'Fauteuils roulants et accompagnement Tawaf / Sa’i', badge: 'Seniors' },
        { id: 'fam-s3', title: 'Visites guidées historiques', subtitle: 'Ouhoud, Quba et parcours pédagogique à Médine', badge: 'Médine' },
      ],
    }
  ),
  blockBase(
    'blk-omra-fam-rates',
    'omra_room_rates',
    'omra',
    'Tarifs Familles & Remise',
    {
      eyebrow: 'Conditions familiales',
      title: 'Tarifs par catégorie & réductions enfants',
      description: 'Remise famille appliquée dès 2 voyageurs inscrits ensemble.',
      items: [
        { id: 'fam-r1', title: 'Quadruple Famille', price: '4,490 DT', subtitle: 'Idéal couple + 2 enfants · Demi-pension' },
        { id: 'fam-r2', title: 'Triple Confort', price: '4,890 DT', subtitle: 'Proche esplanade · Transferts climatisés' },
        { id: 'fam-r3', title: 'Tarif Enfant (-12 ans)', price: '-450 DT', subtitle: 'Réduction appliquée sur part adulte' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-omra-fam-testimonials',
    'testimonials',
    'common',
    'Témoignages Familles',
    {
      eyebrow: 'Confiance Easy2Book',
      title: 'Ils ont accompli la Omra en famille avec nous',
      description: 'Retours d’expérience authentiques de pèlerins tunisiens.',
    }
  ),
  blockBase(
    'blk-omra-fam-form',
    'lead_form',
    'common',
    'Formulaire Omra Familles',
    {
      eyebrow: 'Devis sur mesure',
      title: 'Indiquez le nombre d’adultes et d’enfants',
      description: 'Nous vérifions les chambres communicantes disponibles.',
    }
  ),
  blockBase(
    'blk-omra-fam-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const OMRA_ECO_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-omra-eco-hero',
    'hero_image',
    'common',
    'Hero Omra Économique',
    {
      eyebrow: 'Omra Toute l’Année · Meilleur Rapport Qualité / Prix',
      title: 'Omra Essentielle 14 Jours — Départ Garanti depuis Tunis',
      description:
        'Toutes les formalités de visa, billet d’avion aller-retour, encadrement religieux et hôtels sélectionnés avec navettes 24h/24 vers le Haram.',
      imageKey: 'tunis_flight',
      primaryCtaLabel: 'Bloquer le tarif préférentiel',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-omra-eco-rates',
    'omra_room_rates',
    'omra',
    'Tarifs Économiques',
    {
      eyebrow: 'Tarification transparente',
      title: 'Choisissez votre chambre',
      description: 'Possibilité de paiement échelonné selon calendrier du départ.',
      items: [
        { id: 'eco-r1', title: 'Chambre Quadruple / Quintuple', price: '3,790 DT', subtitle: 'Vol + Visa + Hôtels Makkah & Médine' },
        { id: 'eco-r2', title: 'Chambre Triple', price: '4,150 DT', subtitle: 'Avec accompagnement administratif complet' },
        { id: 'eco-r3', title: 'Chambre Double', price: '4,590 DT', subtitle: 'Idéal couples et proches' },
      ],
    }
  ),
  blockBase(
    'blk-omra-eco-faq',
    'faq',
    'common',
    'Questions Fréquentes Omra',
    {
      eyebrow: 'Informations pratiques',
      title: 'Ce qu’il faut savoir avant de réserver',
      description: 'Validité du passeport, vaccins et bagages inclus.',
      items: [
        { id: 'eco-f1', title: 'Quels documents sont nécessaires pour le visa Omra ?', subtitle: 'Passeport valide minimum 6 mois après la date de retour et 2 photos d’identité récentes sur fond blanc.' },
        { id: 'eco-f2', title: 'Le transport Médine – La Mecque est-il inclus ?', subtitle: 'Oui, en bus touristiques climatisés modernes (option train Haramain TGV disponible).' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-omra-eco-form',
    'lead_form',
    'common',
    'Formulaire Inscription',
    {
      eyebrow: 'Places limitées par vol',
      title: 'Demandez les prochaines dates de départ',
      description: 'Réponse sous 2h ouvrées par notre cellule Omra.',
    }
  ),
  blockBase(
    'blk-omra-eco-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const VOYAGE_DUBAI_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-dxb-hero',
    'hero_image',
    'common',
    'Hero Dubaï Luxe',
    {
      eyebrow: 'Easy2Book Prestige · Émirats Arabes Unis',
      title: 'Dubaï Marina & Skyline 5★ — 6 Jours / 5 Nuits VIP',
      description:
        'Vol direct Emirates / Nouvelair, Visa Émirats inclus, dîner-croisière en yacht à la Marina, safari désert premium et accès Burj Khalifa.',
      imageKey: 'dubai_skyline',
      primaryCtaLabel: 'Recevoir le programme Dubaï',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-dxb-hero-vid',
    'hero_video',
    'common',
    'Vidéo 9:16 · Excursions & Circuits VIP',
    {
      eyebrow: 'Easy2Book · رحلات وجولات VIP (فيديو 9:16)',
      title: 'فيديو ترويجي للرحلات اليومية والجولات الخاصة 9:16',
      description:
        'ريلز عمودي 9:16 مع صوت نسائي تونسي (Layla) وتصدير MP4 مباشر لحملاتكم الإعلانية في دبي، تركيا، مصر وتونس.',
      imageKey: 'dubai_skyline',
      reelPreset: 'excursions_general',
      primaryCtaLabel: 'اطلب برنامجك الآن',
      primaryCtaTarget: '#form-block',
    },
    { backgroundColor: '#FAF9F6' }
  ),
  blockBase(
    'blk-dxb-inclusions',
    'voyage_inclusions',
    'voyages',
    'Expériences & Prestations Incluses',
    {
      eyebrow: 'Programme Signature',
      title: 'Le meilleur de Dubaï sans frais cachés',
      description: 'Hôtels 4★ Sup ou 5★ à Downtown / Al Barsha / Marina.',
      items: [
        { id: 'dxb-i1', title: 'Croisière Yacht Sunset Marina', subtitle: 'Balade panoramique JBR, Ain Dubai & Atlantis', badge: 'Expérience' },
        { id: 'dxb-i2', title: 'Safari Désert Premium 4x4', subtitle: 'Dunes rouges, campement VIP & dîner spectacle', badge: 'Aventure' },
        { id: 'dxb-i3', title: 'Visa Émirats & Assurance inclus', subtitle: 'Traitement complet de votre e-visa par Easy2Book', badge: 'Visa Inclus' },
      ],
    }
  ),
  blockBase(
    'blk-dxb-pricing',
    'voyage_pricing',
    'voyages',
    'Tarifs Séjour Dubaï',
    {
      eyebrow: 'Tarifs par catégorie hôtelière',
      title: 'Choisissez votre gamme d’hébergement',
      description: 'Taxes de séjour Tourism Dirham précisées au devis.',
      items: [
        { id: 'dxb-p1', title: 'Formule 4★ Sup Downtown / Al Barsha', price: '3,490 DT', subtitle: 'Vol + Visa + Hôtel PDJ + Safari + Yacht' },
        { id: 'dxb-p2', title: 'Formule 5★ Dubaï Marina', price: '4,290 DT', subtitle: 'Vue Marina, transferts privés & Burj Khalifa' },
        { id: 'dxb-p3', title: 'Enfant (-11 ans)', price: '2,650 DT', subtitle: 'Partageant chambre avec 2 adultes' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-dxb-form',
    'lead_form',
    'common',
    'Formulaire Dubaï',
    {
      eyebrow: 'Départs chaque semaine',
      title: 'Obtenez votre devis personnalisé Dubaï',
      description: 'Indiquez vos dates préférées et le nombre de voyageurs.',
    }
  ),
  blockBase(
    'blk-dxb-wa',
    'whatsapp_button',
    'common',
    'WhatsApp Dubaï',
    {
      eyebrow: 'Conseiller Moyen-Orient',
      title: 'Disponible sur WhatsApp Business',
      description: 'Tarifs groupes & voyages de noces sur mesure.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'WhatsApp Dubaï · 98 140 514',
        prefilledMessage: 'Bonjour Easy2Book, je souhaite des informations sur le séjour Dubaï Luxe.',
        trackAsCrmLead: false,
      },
    }
  ),
  blockBase(
    'blk-dxb-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const VOYAGE_CAIRO_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-cai-hero',
    'hero_image',
    'common',
    'Hero Le Caire & Nil',
    {
      eyebrow: 'Circuits Culturels · Égypte Éternelle',
      title: 'Le Caire, Pyramides & Croisière 5★ sur le Nil (9 Jours)',
      description:
        'Un voyage fascinant entre le plateau de Gizeh, le Grand Musée Égyptien, Khan El Khalili et 4 nuits de croisière Louxor – Assouan.',
      imageKey: 'cairo_nile',
      primaryCtaLabel: 'Découvrir le circuit complet',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-cai-eg-hero-vid',
    'hero_video',
    'common',
    'Vidéo 9:16 · Excursions Égypte (Voix Tunisienne)',
    {
      eyebrow: 'Easy2Book · رحلات يومية مصر (فيديو 9:16)',
      title: 'فيديو الأهرامات، المتحف الكبير وسهرات النيل في القاهرة',
      description:
        'فيديو 9:16 بصوت نسائي تونسي (Layla) يبرز الرحلات الستة في القاهرة وتوصيل المطار والأسعار بالدينار التونسي.',
      imageKey: 'egypt_pyramids_reel',
      reelPreset: 'egypt_excursions',
      primaryCtaLabel: 'احجز جولاتك في مصر',
      primaryCtaTarget: '#form-block',
    },
    { backgroundColor: '#FAF9F6' }
  ),
  blockBase(
    'blk-cai-itinerary',
    'voyage_day_by_day',
    'voyages',
    'Déroulé Culturel',
    {
      eyebrow: 'Itinéraire complet',
      title: 'Du Caire historique à la Haute-Égypte',
      description: 'Guides égyptologues francophones & arabophones tout au long du circuit.',
      items: [
        { id: 'cai-d1', title: 'Jours 1–3 · Le Caire & Gizeh', subtitle: 'Pyramides, Sphinx, Grand Musée Égyptien & soirée bateau sur le Nil' },
        { id: 'cai-d2', title: 'Jours 4–7 · Croisière Louxor → Assouan', subtitle: 'Vallée des Rois, Karnak, Edfou, Kom Ombo en bateau 5★ pension complète' },
        { id: 'cai-d3', title: 'Jours 8–9 · Shopping & Retour Tunis', subtitle: 'Souk Khan El Khalili, Citadelle de Saladin et vol retour direct' },
      ],
    }
  ),
  blockBase(
    'blk-cai-pricing',
    'voyage_pricing',
    'voyages',
    'Tarifs Circuit Égypte',
    {
      eyebrow: 'Vols internationaux + vols internes inclus',
      title: 'Tarifs du départ groupé',
      description: 'Départs garantis pendant les vacances d’hiver et de printemps.',
      items: [
        { id: 'cai-p1', title: 'Circuit Complet 9J/8N (Double)', price: '3,190 DT', subtitle: 'Le Caire + Croisière Nil 5★ + Vols internes' },
        { id: 'cai-p2', title: 'Option Le Caire Seul 6J/5N', price: '1,980 DT', subtitle: 'Hôtel 5★ Vue Nil + Excursions incluses' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-cai-form',
    'lead_form',
    'common',
    'Formulaire Égypte',
    {
      eyebrow: 'Réservation & Visa Égypte',
      title: 'Recevez les prochaines dates de départ Égypte',
      description: 'Assistance visa incluse dans nos packs.',
    }
  ),
  blockBase(
    'blk-cai-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const VOYAGE_CITYBREAK_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-cb-hero',
    'hero_image',
    'common',
    'Hero City Break Express',
    {
      eyebrow: 'Offre Flash · Campagne Réseaux Sociaux',
      title: 'Escapade City Break 4 Jours / 3 Nuits — Vol + Hôtel Centre-Ville',
      description:
        'Un format court, clair et percutant spécialement conçu pour convertir rapidement le trafic Instagram, Facebook & TikTok.',
      imageKey: 'tunis_flight',
      primaryCtaLabel: 'Je veux profiter de l’offre',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-cb-countdown',
    'countdown',
    'common',
    'Compte à rebours Offre Flash',
    {
      eyebrow: 'Vente Flash Limitée',
      title: 'Tarif promotionnel valable jusqu’à épuisement du quota sièges',
      description: 'Bloquez votre place en 60 secondes via le formulaire ci-dessous.',
      targetDateIso: '2026-12-20T23:59:59',
    },
    { backgroundColor: '#FBF9F4' }
  ),
  blockBase(
    'blk-cb-form',
    'lead_form',
    'common',
    'Formulaire Rapide',
    {
      eyebrow: 'Réponse rapide',
      title: 'Demandez la disponibilité pour votre week-end',
      description: 'Précisez votre destination et votre ville de départ.',
    }
  ),
  blockBase(
    'blk-cb-wa',
    'whatsapp_button',
    'common',
    'Bouton WhatsApp',
    {
      eyebrow: 'Direct WhatsApp',
      title: 'Un conseiller vous répond en direct',
      description: 'Numéro officiel Centrale Easy2Book.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'WhatsApp Express · 98 140 514',
        prefilledMessage: 'Bonjour Easy2Book, je souhaite profiter de l’offre City Break Express.',
        trackAsCrmLead: false,
      },
    }
  ),
  blockBase(
    'blk-cb-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const HOTEL_DJERBA_THALASSO_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-dje-hero',
    'hero_image',
    'common',
    'Hero Djerba Thalasso & Spa',
    {
      eyebrow: 'Hôtels Tunisie · Bien-être & Détente',
      title: 'Djerba Thalasso & Spa 5★ — Cures, Suites Plage & Douceur de Vivre',
      description:
        'Offrez-vous une parenthèse ressourçante sur la côte de Djerba : piscine d’eau de mer chauffée, parcours bio-marin, hammam traditionnel et suites vue mer.',
      imageKey: 'djerba_thalasso',
      primaryCtaLabel: 'Réserver mon séjour bien-être',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-dje-amenities',
    'hotel_amenities',
    'hotels_tunisie',
    'Prestations Thalasso & Hébergement',
    {
      eyebrow: 'Centre Thalasso Intégré',
      title: 'Des équipements pensés pour la récupération et le calme',
      description: 'Programmes 2, 4 ou 6 jours avec bilan bien-être.',
      items: [
        { id: 'dje-a1', title: 'Parcours Aqua-Tonique & Eau de Mer', subtitle: 'Bassin chauffé 33°C, jets hydromassants & vue jardin', badge: 'Thalasso' },
        { id: 'dje-a2', title: 'Suites Juniors Front de Mer', subtitle: 'Balcon privé, literie premium et accueil VIP en chambre', badge: 'Confort 5★' },
        { id: 'dje-a3', title: 'Gastronomie Méditerranéenne', subtitle: 'Formule Demi-Pension ou All-Inclusive Soft au choix', badge: 'Restauration' },
      ],
    }
  ),
  blockBase(
    'blk-dje-pricing',
    'hotel_pricing',
    'hotels_tunisie',
    'Forfaits Séjour + Cure',
    {
      eyebrow: 'Tarifs préférentiels Easy2Book',
      title: 'Formules Week-end & Semaine',
      description: 'Réduction longs séjours à partir de 4 nuits.',
      items: [
        { id: 'dje-p1', title: 'Nuitée Demi-Pension (Hors Cure)', price: '235 DT / pers', subtitle: 'Accès piscine chauffée inclus' },
        { id: 'dje-p2', title: 'Pack Week-end 2 Nuits + 2 Soins Spa', price: '590 DT / pers', subtitle: 'Hammam, gommage & massage relaxant 50 min' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-dje-form',
    'lead_form',
    'common',
    'Formulaire Djerba',
    {
      eyebrow: 'Vérification immédiate',
      title: 'Demandez la disponibilité pour vos dates à Djerba',
      description: 'Précisez si vous souhaitez les vols Tunis – Djerba.',
    }
  ),
  blockBase(
    'blk-dje-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const HOTEL_SAHARA_TOZEUR_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-toz-hero',
    'hero_image',
    'common',
    'Hero Sahara Tozeur',
    {
      eyebrow: 'Hôtels Tunisie · Évasion Sud & Écotourisme',
      title: 'Lodge & Oasis Tozeur 5★ — Architecture Saharienne & Expériences Désert',
      description:
        'Découvrez la magie de l’automne et de l’hiver dans le Sud tunisien : pavillons oasiens, dîner sous les étoiles, canyons de Chebika et 4x4 à Ong Jemel.',
      imageKey: 'sahara_tozeur',
      primaryCtaLabel: 'Planifier mon escapade Sud',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-toz-card',
    'hotel_card',
    'hotels_tunisie',
    'Expériences Incluses & Cadre',
    {
      eyebrow: 'Immersion authentique',
      title: 'Entre palmeraie millénaire et dunes du Sahara',
      description: 'Séjour modulable de 2 à 5 nuits pour couples, familles ou séminaires.',
      items: [
        { id: 'toz-c1', title: 'Villas & Suites Vue Palmeraie', subtitle: 'Terrasse privée, architecture en briques de Tozeur & cheminée', badge: 'Hébergement' },
        { id: 'toz-c2', title: 'Excursions 4x4 Chebika, Tamerza & Ong Jemel', subtitle: 'Chauffeurs-guides expérimentés au départ de l’hôtel', badge: 'Excursions' },
      ],
    }
  ),
  blockBase(
    'blk-toz-pricing',
    'hotel_pricing',
    'hotels_tunisie',
    'Tarifs Séjour Tozeur',
    {
      eyebrow: 'Saison Octobre – Avril',
      title: 'Tarifs par formule',
      description: 'Conditions préférentielles pour ponts et vacances scolaires.',
      items: [
        { id: 'toz-p1', title: 'Logement & Petit Déjeuner (LPD)', price: '295 DT / nuit', subtitle: 'Par personne en chambre double' },
        { id: 'toz-p2', title: 'Package Week-end 3J/2N + Excursion 4x4', price: '790 DT / pers', subtitle: 'Demi-pension + circuit oasis de montagne' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-toz-form',
    'lead_form',
    'common',
    'Formulaire Tozeur',
    {
      eyebrow: 'Places limitées pendant les vacances',
      title: 'Réservez votre séjour à Tozeur',
      description: 'Réponse rapide de notre équipe Tunisie.',
    }
  ),
  blockBase(
    'blk-toz-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const HOTEL_EARLY_FAMILLE_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-eb-hero',
    'hero_image',
    'common',
    'Hero Early Booking Familles',
    {
      eyebrow: 'Hôtels Tunisie · Early Booking Été',
      title: 'Promo Early Booking Familles — Jusqu’à -30% & Gratuité Enfants',
      description:
        'Anticipez vos vacances balnéaires à Hammamet, Sousse, Mahdia ou Monastir et verrouillez les meilleurs tarifs avant la haute saison.',
      imageKey: 'tunisia_resort',
      primaryCtaLabel: 'Profiter du tarif Early Booking',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-eb-promo',
    'hotel_promo',
    'hotels_tunisie',
    'Avantages Early Booking',
    {
      eyebrow: 'Avantages exclusifs',
      title: 'Pourquoi réserver dès maintenant avec Easy2Book ?',
      description: 'Conditions négociées directement avec les plus grands resorts 4★ et 5★.',
      items: [
        { id: 'eb-1', title: '1er Enfant Gratuit (-12 ans)', subtitle: 'Dans la chambre de 2 adultes selon l’hôtel choisi', badge: 'Gratuité' },
        { id: 'eb-2', title: 'Acompte réduit & flexibilité', subtitle: 'Bloquez votre chambre avec modification facilitée', badge: 'Souplesse' },
        { id: 'eb-3', title: 'Aquapark & Mini-Club inclus', subtitle: 'Hôtels sélectionnés pour le bonheur des enfants', badge: 'Famille' },
      ],
    }
  ),
  blockBase(
    'blk-eb-countdown',
    'countdown',
    'common',
    'Fin de l’offre Early Booking',
    {
      eyebrow: 'Offre à durée limitée',
      title: 'Fin de la première vague Early Booking',
      description: 'Les tarifs réaugumenteront automatiquement après cette date.',
      targetDateIso: '2026-12-31T23:59:59',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
  blockBase(
    'blk-eb-form',
    'lead_form',
    'common',
    'Formulaire Early Booking',
    {
      eyebrow: 'Devis sur mesure',
      title: 'Comparez nos hôtels disponibles sur vos dates',
      description: 'Indiquez l’âge des enfants pour calculer exactement les gratuités.',
    }
  ),
  blockBase(
    'blk-eb-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const VISA_ETUDES_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-ve-hero',
    'hero_image',
    'common',
    'Hero Visa Études',
    {
      eyebrow: 'Easy2Book Mobilité · France, Canada & Europe',
      title: 'Accompagnement Visa Études — Campus France, CAQ & Logement Étudiant',
      description:
        'Un encadrement rigoureux pour les bacheliers et étudiants : vérification des pièces académiques, justificatif de ressources, attestation d’hébergement et prise de rendez-vous.',
      imageKey: 'visa_europe',
      primaryCtaLabel: 'Évaluer mon dossier étudiant',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-ve-hero-vid',
    'hero_video',
    'common',
    'Vidéo 9:16 · Visa Études & Mobilité',
    {
      eyebrow: 'Easy2Book · فيزا الدراسة وشنغن (فيديو 9:16)',
      title: 'دليلك المصوّر لتحضير ملف فيزا الدراسة في أوروبا وكندا',
      description:
        'فيديو عمودي 9:16 بتعليق صوتي تونسي وتصدير MP4 HD موجه للطلبة والأولياء.',
      imageKey: 'visa_canada',
      reelPreset: 'visa_schengen',
      primaryCtaLabel: 'قيّم ملفك الآن',
      primaryCtaTarget: '#form-block',
    },
    { backgroundColor: '#FAF9F6' }
  ),
  blockBase(
    'blk-ve-steps',
    'visa_steps',
    'visa',
    'Parcours Étudiant en 4 Étapes',
    {
      eyebrow: 'Méthodologie consulaire',
      title: 'Un dossier complet, ordonné et conforme aux attentes',
      description: 'Aucune donnée personnelle sensible n’est stockée sur cette page vitrine.',
      items: [
        { id: 've-s1', title: '1. Audit d’admission & calendrier', subtitle: 'Vérification lettre d’acceptation / Campus France / CAQ' },
        { id: 've-s2', title: '2. Montage financier & logement', subtitle: 'Conseil sur AVI / compte bloqué et réservation étudiante' },
        { id: 've-s3', title: '3. Préparation dépôt & entretien', subtitle: 'Simulation d’entretien consulaire et classement du dossier' },
      ],
    }
  ),
  blockBase(
    'blk-ve-faq',
    'visa_faq',
    'visa',
    'FAQ Visa Études',
    {
      eyebrow: 'Questions fréquentes des familles',
      title: 'Tout savoir sur le dépôt Visa Étudiant',
      description: 'Réponses claires basées sur les exigences publiques officielles.',
      items: [
        { id: 've-f1', title: 'Combien de temps à l’avance faut-il préparer le dossier ?', subtitle: 'Idéalement 3 à 4 mois avant la rentrée universitaire pour anticiper les créneaux de rendez-vous.' },
        { id: 've-f2', title: 'Accompagnez-vous aussi la recherche d’attestation de logement ?', subtitle: 'Oui, nous orientons vers des solutions reconnues et préparons les justificatifs de voyage aller.' },
      ],
    },
    { backgroundColor: '#F8FAFC' }
  ),
  blockBase(
    'blk-ve-form',
    'lead_form',
    'common',
    'Formulaire Visa Études',
    {
      eyebrow: 'Cellule Mobilité Étudiante',
      title: 'Prenez rendez-vous avec un conseiller Visa Études',
      description: 'Précisez le pays d’accueil et la date de rentrée prévue.',
    }
  ),
  blockBase(
    'blk-ve-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const VISA_AFFAIRES_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-va-hero',
    'hero_image',
    'common',
    'Hero Visa Affaires',
    {
      eyebrow: 'Easy2Book Corporate · Déplacements Professionnels',
      title: 'Visa Affaires Express — Salons Internationaux, Missions & Dirigeants',
      description:
        'Montage accéléré pour dirigeants, cadres commerciaux et exposants : lettre d’invitation, justificatifs société, vols flexibles et assurance multirisque.',
      imageKey: 'visa_europe',
      primaryCtaLabel: 'Planifier un dossier affaires',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-va-hero-vid',
    'hero_video',
    'common',
    'Vidéo 9:16 · Visa Affaires Express',
    {
      eyebrow: 'Easy2Book Corporate · فيزا الأعمال وشنغن (فيديو 9:16)',
      title: 'تجهيز ملفات فيزا الأعمال والمؤتمرات الدولية بالفيديو 9:16',
      description:
        'ريلز تعريفي لخدمات المواعيد السريعة Prime Time وملفات الشركات ورجال الأعمال.',
      imageKey: 'visa_europe',
      reelPreset: 'visa_schengen',
      primaryCtaLabel: 'اطلب معالجة أولوية',
      primaryCtaTarget: '#form-block',
    },
    { backgroundColor: '#FAF9F6' }
  ),
  blockBase(
    'blk-va-docs',
    'visa_documents',
    'visa',
    'Checklist Entreprise & Dirigeant',
    {
      eyebrow: 'Pièces standard requises',
      title: 'Préparation spécifique aux voyages professionnels',
      description: 'Liste informative générale pour déplacements en Europe, UK, USA ou Émirats.',
      items: [
        { id: 'va-d1', title: 'Documents juridiques de l’entreprise', subtitle: 'RNE récent, patente, quittance fiscale & ordre de mission' },
        { id: 'va-d2', title: 'Invitation partenaire ou badge salon', subtitle: 'Lettre d’invitation officielle de l’organisme hôte' },
        { id: 'va-d3', title: 'Itinéraire vol + hôtel vérifiables', subtitle: 'Émis et coordonnés par votre conseiller Easy2Book Corporate' },
      ],
    }
  ),
  blockBase(
    'blk-va-form',
    'lead_form',
    'common',
    'Formulaire Corporate',
    {
      eyebrow: 'Traitement prioritaire',
      title: 'Transmettez votre demande de déplacement professionnel',
      description: 'Réponse dédiée pour demandes individuelles ou délégations d’entreprise.',
    }
  ),
  blockBase(
    'blk-va-wa',
    'whatsapp_button',
    'common',
    'WhatsApp Corporate',
    {
      eyebrow: 'Ligne directe Affaires',
      title: 'Contact WhatsApp Business Easy2Book',
      description: 'Coordination rapide des rendez-vous et billets.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'WhatsApp Affaires · 98 140 514',
        prefilledMessage: 'Bonjour Easy2Book, je souhaite organiser un dossier Visa Affaires.',
        trackAsCrmLead: false,
      },
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-va-footer',
    'footer',
    'common',
    'Footer',
    {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
    { backgroundColor: '#102D45', textColor: '#FFFFFF' }
  ),
];

const EGYPT_EXCURSIONS_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-eg-hero-vid',
    'hero_video',
    'common',
    'فيديو ريلز 9:16 — رحلات مصر (بصوت نسائي)',
    {
      eyebrow: 'Easy2Book · مركز الحجوزات · 98 140 514',
      title: 'رحلات يومية مصر — للأفراد والجروبات بصوت نسائي دافئ',
      description:
        'اكتشف القاهرة، أهرامات الجيزة، المتحف المصري الكبير، القاهرة الإسلامية وسهرات النيل بسيارة خاصة ومرشد سياحي شامل. الحجز المباشر مع Easy2Book على الرقم 98 140 514.',
      imageKey: 'egypt_pyramids_museum',
      primaryCtaLabel: 'احجز رحلتك الآن',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: 'واتساب 98 140 514',
    },
    { alignment: 'right', backgroundColor: '#FBF9F4', paddingY: 'spacious' }
  ),
  blockBase(
    'blk-eg-hero',
    'hero_image',
    'common',
    'واجهة العرض الرئيسية — رحلات مصر Easy2Book',
    {
      eyebrow: 'الرحلات اليومية في القاهرة · الأسعار بالدينار التونسي (د.ت)',
      title: 'أجمل الجولات السياحية في القاهرة — من المطار إلى الأهرامات وسهرة النيل',
      description:
        'سيارة مكيفة خاصة بسائق ومرشد سياحي محترف مع خيارات للأفراد والعائلات والمجموعات من 1 إلى 10 أشخاص بأفضل أسعار Easy2Book.',
      imageKey: 'egypt_pyramids_museum',
      primaryCtaLabel: 'اكتشف الأسعار والرحلات',
      primaryCtaTarget: '#offres',
      secondaryCtaLabel: 'تواصل معنا · 98 140 514',
    },
    { alignment: 'right', backgroundColor: '#102D45', textColor: '#FFFFFF', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-eg-overview',
      'voyage_pricing',
      'voyages',
      'قائمة الرحلات والخدمات اليومية الـ 6 في القاهرة',
      {
        eyebrow: 'أسعار Easy2Book · بالدينار التونسي (د.ت)',
        title: 'رحلاتنا وخدماتنا اليومية الـ 6 في القاهرة',
        description:
          'سيارة مكيفة مع سائق ومرشد سياحي شامل حسب كل باقة. للحجز والاستفسار مع Easy2Book: 98 140 514.',
        items: [
          {
            id: 'eg-sum-1',
            badge: 'توصيل خاص',
            title: 'توصيل من المطار إلى النزل',
            subtitle: 'سيارة خاصة مع استقبال شخصي مريح من مطار القاهرة إلى الفندق.',
            price: '175 د.ت',
          },
          {
            id: 'eg-sum-2',
            badge: 'عشاء وسهرة على النيل',
            title: 'سهرة نايل كروز (Nile Cruise)',
            subtitle: 'شامل: سيارة خاصة + مرشد + عشاء فاخر وعرض فني على متن الباخرة.',
            price: '225 د.ت',
          },
          {
            id: 'eg-sum-3',
            badge: 'الأكثر طلباً',
            title: 'المتحف المصري الكبير + الأهرامات',
            subtitle: 'سيارة + مرشد + تذاكر الدخول شاملة (من 1 إلى 10 أشخاص).',
            price: 'ابتداءً من 425 د.ت',
          },
          {
            id: 'eg-sum-4',
            badge: 'جولة وتسوق',
            title: 'سيتي تور القاهرة (City Tour)',
            subtitle: 'مول القاهرة + وسط البلد · سيارة خاصة مع مرشد (من 1 إلى 10 أشخاص).',
            price: 'ابتداءً من 225 د.ت',
          },
          {
            id: 'eg-sum-5',
            badge: 'تراث وتاريخ',
            title: 'جولة القاهرة الإسلامية (شاملة)',
            subtitle: 'القلعة، محمد علي، خان الخليلي، الأزهر، الحسين، المعز · شاملة التذاكر.',
            price: 'ابتداءً من 385 د.ت',
          },
          {
            id: 'eg-sum-6',
            badge: 'سهرة ليلية 22:00 – 01:00',
            title: 'سهرة ألحان / صاحب السعادة',
            subtitle: 'من 22:00 إلى 01:00 بعد منتصف الليل · سيارة + مرشد (1 إلى 10 أشخاص).',
            price: 'ابتداءً من 225 د.ت',
          },
        ],
      },
      { alignment: 'right', backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'offres',
  },
  {
    ...blockBase(
      'blk-eg-gallery',
      'voyage_gallery',
      'voyages',
      'معرض صور رحلات مصر الاحترافي',
      {
        eyebrow: 'صور حصرية من قلب القاهرة',
        title: 'لقطات من برنامج رحلات مصر مع Easy2Book',
        description:
          'أهرامات الجيزة والمتحف المصري الكبير، عشاء النيل الساحر، القاهرة الإسلامية التاريخية وخدمة التوصيل الخاصة.',
        galleryImageKeys: [
          'egypt_pyramids_museum',
          'egypt_nile_dinner',
          'egypt_islamic_cairo',
          'vip_airport_transfer',
        ],
      },
      { alignment: 'right', backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'galerie',
  },
  {
    ...blockBase(
      'blk-eg-pyramids',
      'voyage_pricing',
      'voyages',
      'جدول أسعار المتحف الكبير والأهرامات',
      {
        eyebrow: 'الرحلة رقم 3 · متحف كبير + الأهرامات',
        title: 'المتحف المصري الكبير وأهرامات الجيزة',
        description: 'سيارة خاصة + مرشد سياحي + تذاكر الدخول شاملة — السعر الإجمالي حسب عدد الأشخاص:',
        items: [
          { id: 'pyr-1', badge: 'فردي', title: 'شخص واحد (1)', subtitle: 'سيارة خاصة + مرشد + تذاكر الدخول', price: '425 د.ت' },
          { id: 'pyr-2', badge: 'ثنائي', title: 'شخصان (2)', subtitle: 'سيارة خاصة + مرشد + تذاكر الدخول', price: '725 د.ت' },
          { id: 'pyr-4', badge: 'عائلي', title: '4 أشخاص', subtitle: 'سيارة خاصة + مرشد + تذاكر الدخول', price: '1,165 د.ت' },
          { id: 'pyr-5', badge: 'مجموعة 5', title: '5 أشخاص', subtitle: 'سيارة عائلية واسعة + مرشد + تذاكر', price: '1,365 د.ت' },
          { id: 'pyr-7', badge: 'مجموعة 7', title: '7 أشخاص', subtitle: 'ميني فان مريح + مرشد + تذاكر الدخول', price: '1,745 د.ت' },
          { id: 'pyr-10', badge: 'مجموعة 10', title: '10 أشخاص', subtitle: 'ميني باص سياحي + مرشد + تذاكر الدخول', price: '2,425 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'pyramides',
  },
  {
    ...blockBase(
      'blk-eg-citytour',
      'voyage_pricing',
      'voyages',
      'جدول أسعار سيتي تور القاهرة',
      {
        eyebrow: 'الرحلة رقم 4 · سيتي تور',
        title: 'سيتي تور — مول القاهرة ووسط البلد',
        description: 'سيارة مكيفة مع مرشد سياحي مرفق (من 1 إلى 10 أشخاص):',
        items: [
          { id: 'ct-1', title: 'شخص واحد (1)', subtitle: 'مول القاهرة + وسط البلد', price: '225 د.ت' },
          { id: 'ct-2', title: 'شخصان (2)', subtitle: 'مول القاهرة + وسط البلد', price: '265 د.ت' },
          { id: 'ct-3', title: '3 أشخاص', subtitle: 'مول القاهرة + وسط البلد', price: '265 د.ت' },
          { id: 'ct-4', title: '4 أشخاص', subtitle: 'مول القاهرة + وسط البلد', price: '345 د.ت' },
          { id: 'ct-5', title: '5 أشخاص', subtitle: 'مول القاهرة + وسط البلد', price: '365 د.ت' },
          { id: 'ct-7-10', badge: 'أفضل عرض', title: '7 أو 10 أشخاص', subtitle: 'ميني باص + مرشد مرافق شامل', price: '385 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'city-tour',
  },
  {
    ...blockBase(
      'blk-eg-islamic',
      'voyage_pricing',
      'voyages',
      'جدول أسعار جولة القاهرة الإسلامية',
      {
        eyebrow: 'الرحلة رقم 5 · جولة القاهرة الإسلامية',
        title: 'جولة القاهرة الإسلامية — شاملة بالكامل',
        description:
          'قلعة صلاح الدين، مسجد محمد علي، المتحف الحربي، خان الخليلي، الجامع الأزهر، الحسين، شارع المعز، أبو العربي ووقت حر للتسوق · شامل السيارة والمرشد والتذاكر:',
        items: [
          { id: 'isl-1', title: 'شخص واحد (1)', subtitle: 'سيارة + مرشد + تذاكر الدخول شاملة', price: '385 د.ت' },
          { id: 'isl-2', title: 'شخصان (2)', subtitle: 'سيارة + مرشد + تذاكر الدخول شاملة', price: '505 د.ت' },
          { id: 'isl-3', title: '3 أشخاص', subtitle: 'سيارة + مرشد + تذاكر الدخول شاملة', price: '625 د.ت' },
          { id: 'isl-4', title: '4 أشخاص', subtitle: 'سيارة + مرشد + تذاكر الدخول شاملة', price: '705 د.ت' },
          { id: 'isl-5', title: '5 أشخاص', subtitle: 'سيارة + مرشد + تذاكر الدخول شاملة', price: '765 د.ت' },
          { id: 'isl-7', title: '7 أشخاص', subtitle: 'سيارة + مرشد + تذاكر الدخول شاملة', price: '865 د.ت' },
          { id: 'isl-10', badge: 'سعر المجموعة', title: '10 أشخاص', subtitle: 'ميني باص + مرشد + تذاكر شاملة', price: '1,045 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'caire-islamique',
  },
  {
    ...blockBase(
      'blk-eg-alhan',
      'module_excursions',
      'commerce',
      'سهرة ألحان / صاحب السعادة — القاهرة ليلاً',
      {
        eyebrow: 'الرحلة رقم 6 · سهرة ألحان / صاحب السعادة (22:00 – 01:00)',
        title: 'سهرة ألحان / صاحب السعادة — سيارة ومرشد مرافق',
        description:
          'خرجة ليلية مميزة في القاهرة من الساعة 22:00 إلى 01:00 صباحاً مع سيارة خاصة ومرشد مرافق من Easy2Book.',
        imageKey: 'egypt_nile_dinner',
        primaryCtaLabel: 'احجز عبر واتساب · 98 140 514',
        primaryCtaTarget: '#form-block',
        items: [
          { id: 'alh-1', title: 'شخص واحد (1)', subtitle: '22:00 إلى 01:00 · سيارة + مرشد', price: '225 د.ت' },
          { id: 'alh-2', title: 'شخصان (2)', subtitle: '22:00 إلى 01:00 · سيارة + مرشد', price: '265 د.ت' },
          { id: 'alh-3', title: '3 أشخاص', subtitle: '22:00 إلى 01:00 · سيارة + مرشد', price: '305 د.ت' },
          { id: 'alh-4', title: '4 أشخاص', subtitle: '22:00 إلى 01:00 · سيارة + مرشد', price: '305 د.ت' },
          { id: 'alh-5-10', badge: 'باقة المجموعة', title: 'من 5 إلى 10 أشخاص', subtitle: '22:00 إلى 01:00 · سيارة + مرشد', price: '425 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'soiree-alhan',
  },
  blockBase(
    'blk-eg-wa',
    'whatsapp_button',
    'common',
    'تواصل مباشر Easy2Book 98 140 514',
    {
      eyebrow: 'للحجوزات والاستفسارات · Easy2Book',
      title: 'تواصل مع Easy2Book عبر الهاتف أو الواتساب: 98 140 514',
      description:
        'تأكيد فوري لرحلاتكم وتوصيلاتكم في القاهرة عبر مركز الحجوزات المباشر Easy2Book.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'واتساب Easy2Book · 98 140 514',
        prefilledMessage:
          'السلام عليكم Easy2Book (98 140 514)، أرغب في حجز رحلة يومية في مصر.',
        trackAsCrmLead: false,
      },
    },
    { alignment: 'right', backgroundColor: '#FFFFFF' }
  ),
  blockBase(
    'blk-eg-form',
    'lead_form',
    'common',
    'استمارة حجز رحلات مصر المباشر',
    {
      eyebrow: 'الحجز المباشر Easy2Book · 98 140 514',
      title: 'احجز رحلاتك وتوصيلاتك في القاهرة الآن',
      description: 'أدخل التواريخ المطلوبة، عدد المسافرين والرحلات المختارة وسنتواصل معك فوراً.',
    },
    { alignment: 'right' }
  ),
];

const TURKEY_EXCURSIONS_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-tr-hero-vid',
    'hero_video',
    'common',
    'فيديو ريلز 9:16 — رحلات تركيا (بصوت نسائي)',
    {
      eyebrow: 'Easy2Book · مركز الحجوزات · 98 140 514',
      title: 'رحلات تركيا اليومية — إسطنبول، صبنجا، البسفور وأنطاليا بصوت نسائي دافئ',
      description:
        'اكتشف صبنجا ومعشوقية، إزميت، بورصا، شيلا وأغوا، جزر الأميرات، السهرات المسائية على البسفور، تكت فيالاند وباقة أنطاليا مع توصيل المطار الخاص من Easy2Book على الرقم 98 140 514.',
      imageKey: 'turkey_sapanca_lake',
      primaryCtaLabel: 'احجز رحلتك الآن',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: 'واتساب 98 140 514',
    },
    { alignment: 'right', backgroundColor: '#FBF9F4', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-tr-daily',
      'voyage_pricing',
      'voyages',
      'الرحلات اليومية في تركيا (مواصلات + غذاء + دليل عربي)',
      {
        eyebrow: 'أسعار Easy2Book · بالدينار التونسي (د.ت)',
        title: 'الرحلات اليومية — إسطنبول والمناطق الطبيعية',
        description: 'مواصلات حديثة مكيفة + وجبة غذاء + دليل سياحي عربي (جميع الأسعار بالدينار التونسي):',
        items: [
          { id: 'tr-b-1', badge: 'رحلة يومية', title: 'صبنجا · معشوقية', subtitle: 'مواصلات + غذاء + دليل سياحي عربي', price: '65 د.ت' },
          { id: 'tr-b-2', badge: 'رحلة يومية', title: 'إزميت · صبنجا · معشوقية', subtitle: 'مواصلات + غذاء + دليل سياحي عربي', price: '85 د.ت' },
          { id: 'tr-b-3', badge: 'رحلة يومية', title: 'بورصا الخضراء', subtitle: 'مواصلات + غذاء + دليل سياحي عربي', price: '100 د.ت' },
          { id: 'tr-b-4', badge: 'رحلة يومية', title: 'شيلا · أغوا', subtitle: 'مواصلات + غذاء + دليل سياحي عربي', price: '105 د.ت' },
          { id: 'tr-b-5', badge: 'السبت فقط', title: 'يلوا · السبت', subtitle: 'مواصلات + غذاء + دليل سياحي عربي', price: '145 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'offres',
  },
  {
    ...blockBase(
      'blk-tr-cruises',
      'voyage_pricing',
      'voyages',
      'السفن والجولات البحرية (جزر الأميرات والبسفور)',
      {
        eyebrow: 'جزر الأميرات · سهرات البسفور العربية والتركية',
        title: 'سفن جزر الأميرات والسهرات المسائية على البسفور',
        description: 'جزر الأميرات شاملة المواصلات والغداء والدليل، والسهرات المسائية شاملة المواصلات والعشاء:',
        items: [
          { id: 'tr-c-1', badge: 'جزر الأميرات', title: 'نسمات شامية / جزيرة الأميرات / صباح إسطنبول / ليالي إسطنبول', subtitle: 'شامل المواصلات والغداء والدليل السياحي', price: '105 د.ت' },
          { id: 'tr-c-2', badge: 'سهرات عربية', title: 'الملكية / البسفور / لؤلؤة البسفور / سهر الليالي / ليالي إسطنبول', subtitle: 'شامل المواصلات والعشاء', price: '105 د.ت' },
          { id: 'tr-c-3', badge: 'سهرات عربية VIP', title: 'سفينة ليالي شامية المسائية', subtitle: 'شامل المواصلات والعشاء', price: '145 د.ت' },
          { id: 'tr-c-4', badge: 'سفينة تركية', title: 'السفينة التركية أورينت (Orient)', subtitle: 'شامل المواصلات والعشاء', price: '145 د.ت' },
          { id: 'tr-c-5', badge: 'سفينة تركية VIP', title: 'السفينة التركية توسان باشا', subtitle: 'شامل المواصلات والعشاء', price: '175 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'croisieres',
  },
  {
    ...blockBase(
      'blk-tr-leisure-antalya',
      'voyage_pricing',
      'voyages',
      'الترفيه (فيالاند) وباقة أنطاليا وتوصيل المطار VIP',
      {
        eyebrow: 'الترفيه · Pack Antalya · توصيل المطار',
        title: 'فيالاند، باقة أنطاليا للثنائي وسيارات المطار الخاصة',
        description: 'خيارات الترفيه والنقل الخاص بسيارات مرسيدس فيتو وسبرنتر مع Easy2Book (98 140 514):',
        items: [
          { id: 'tr-l-1', badge: 'ترفيه', title: 'تكت فيالاند (Vialand)', subtitle: 'يشمل جميع الألعاب ومواصلات من تقسيم ميدان', price: '245 د.ت' },
          { id: 'tr-l-2', badge: 'باقة أنطاليا للثنائي', title: 'Pack Antalya (Zipline + Rafting + قارب القراصنة + توصيل AYT)', subtitle: 'باقة كاملة للثنائي شاملة الغداء والنقل', price: '1,125 د.ت' },
          { id: 'tr-l-3', badge: 'سيارة فيتو 6 أشخاص', title: 'توصيل فيتو (6 ركاب · 6 شنط) — مطار إسطنبول / صبيحة', subtitle: 'IST 185 د.ت · SAW 195 د.ت', price: '185 / 195 د.ت' },
          { id: 'tr-l-4', badge: 'حافلة سبرنتر 14 شخص', title: 'توصيل سبرنتر (14 راكب · 11 شنطة) — مطار إسطنبول / صبيحة', subtitle: 'IST 245 د.ت · SAW 265 د.ت', price: '245 / 265 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'transferts',
  },
  {
    ...blockBase(
      'blk-tr-gallery',
      'voyage_gallery',
      'voyages',
      'معرض صور رحلات تركيا الاحترافي',
      {
        eyebrow: 'صور حصرية من تركيا',
        title: 'لقطات من رحلات إسطنبول، صبنجا، البسفور وأنطاليا',
        description: 'جولات يومية شاملة، سهرات بحرية على مضيق البسفور، شواطئ أنطاليا وتوصيل خاص.',
        galleryImageKeys: [
          'turkey_sapanca_lake',
          'turkey_princes_islands',
          'turkey_bosphorus_cruise',
          'turkey_antalya_coast',
        ],
      },
      { alignment: 'right', backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'galerie',
  },
  blockBase(
    'blk-tr-whatsapp',
    'whatsapp_button',
    'common',
    'الحجز المباشر لرحلات تركيا عبر واتساب Easy2Book',
    {
      eyebrow: 'مركز الحجوزات Easy2Book',
      title: 'تواصل معنا عبر الهاتف أو واتساب: 98 140 514',
      description: 'تأكيد فوري لرحلاتكم اليومية، سهرات البسفور، باقة أنطاليا وتوصيل المطار عبر Easy2Book.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'واتساب Easy2Book · 98 140 514',
        prefilledMessage: 'السلام عليكم Easy2Book (98 140 514)، أرغب في حجز رحلة يومية في تركيا.',
        trackAsCrmLead: false,
      },
    },
    { alignment: 'right', backgroundColor: '#FFFFFF' }
  ),
  blockBase(
    'blk-tr-form',
    'lead_form',
    'common',
    'استمارة حجز رحلات تركيا المباشر',
    {
      eyebrow: 'الحجز المباشر Easy2Book · 98 140 514',
      title: 'احجز رحلاتك وتوصيلاتك في تركيا الآن',
      description: 'أدخل التواريخ المطلوبة، عدد المسافرين والرحلات المختارة وسنتواصل معك فوراً.',
    },
    { alignment: 'right' }
  ),
];

export const VISA_SERVICES_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-visa-hero-video',
    'hero_video',
    'visa',
    'فيديو تعريفي 9:16 لخدمات الفيزا و E-Visa بالصوت النسائي التونسي',
    {
      eyebrow: 'قسم التأشيرات Easy2Book · 98 140 514',
      title: 'تأشيرات السفر، الإقامة و E-Visa الشاملة — Easy2Book',
      description:
        'فيزا مصر في 4 ساعات، مواعيد شنغن، دبي، قطر، عُمان، العمرة، الصين، ألبانيا، تايلاند، كندا وأمريكا وبريطانيا وأستراليا بالإضافة إلى 53 وجهة E-Visa.',
      imageKey: 'visa_desk',
      primaryCtaLabel: 'أودع ملفك الآن',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: 'واتساب 98 140 514',
    },
    { alignment: 'right', backgroundColor: '#FBF9F4', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-visa-eg-schengen',
      'voyage_pricing',
      'visa',
      'فيزا مصر وفضاء شنغن (مواعيد قياسية و Prime Time)',
      {
        eyebrow: 'أسعار Easy2Book · بالدينار التونسي (د.ت)',
        title: 'تأشيرة وضمان مصر (في 4 ساعات) + فضاء شنغن',
        description: 'إصدار سريع لضمان مصر ومواعيد فضاء شنغن مع تجهيز الملف بالكامل:',
        items: [
          { id: 'vs-b-1', badge: 'مصر · 4 ساعات', title: 'ضمان فيزا مصر · انطلاق من تونس', subtitle: 'نسخة جواز السفر + تذكرة الطائرة', price: '90 د.ت' },
          { id: 'vs-b-2', badge: 'مصر · حسب الطلب', title: 'ضمان فيزا مصر · انطلاق من دولة أخرى', subtitle: 'نسخة جواز السفر + تذكرة الطائرة', price: '150 د.ت' },
          { id: 'vs-b-3', badge: 'شرم / الإسكندرية / الغردقة', title: 'نزول شرم الشيخ / الإسكندرية / الغردقة', subtitle: 'مسافر واحد 350 د.ت · من شخصين 300 د.ت للشخص', price: '300 / 350 د.ت' },
          { id: 'vs-b-4', badge: 'فضاء شنغن', title: 'ملف + موعد فضاء شنغن (Standard)', subtitle: 'نسخة جواز السفر + صورة خلفية بيضاء', price: '180 د.ت' },
          { id: 'vs-b-5', badge: 'شنغن VIP', title: 'ملف + موعد فضاء شنغن (Prime Time شامل)', subtitle: 'نسخة جواز السفر + صورة خلفية بيضاء', price: '280 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'offres',
  },
  {
    ...blockBase(
      'blk-visa-gulf-omra',
      'voyage_pricing',
      'visa',
      'فيزا دبي، قطر، عُمان وفيزا العمرة',
      {
        eyebrow: 'دبي · قطر · عُمان · السعودية',
        title: 'تأشيرات الخليج السياحية وإقامات السنتين وفيزا العمرة',
        description: 'خيار Express متوفر لدبي خلال 48–72 ساعة (+60 د.ت):',
        items: [
          { id: 'vs-g-1', badge: 'دبي بالضمان', title: 'فيزا دبي بالضمان (شهر / شهران)', subtitle: 'دخول واحد · رجل وامرأة (Express +60 د.ت)', price: '350 / 550 د.ت' },
          { id: 'vs-g-2', badge: 'دبي بدون ضمان', title: 'فيزا دبي بدون ضمان (شهر / شهران)', subtitle: 'دخول واحد · إقامة سنتين ID شاملة 6,830 د.ت', price: '430 / 680 د.ت' },
          { id: 'vs-g-3', badge: 'قطر', title: 'فيزا قطر (سياحية شهر / سنوية بدون ID)', subtitle: 'السنوية +1650 ريال قطري تُدفع في قطر', price: '170 / 1,380+ د.ت' },
          { id: 'vs-g-4', badge: 'عُمان', title: 'فيزا عُمان (10 أيام / شهر / إقامة سنتين)', subtitle: '10 أيام 230 د.ت · شهر 330-380 د.ت · إقامة 7,530-9,530 د.ت', price: 'من 230 د.ت' },
          { id: 'vs-g-5', badge: 'العمرة', title: 'فيزا العمرة · المملكة العربية السعودية', subtitle: 'جواز + صورة + تذكرة + رمز Saudi Bio', price: '820 د.ت' },
        ],
      },
      { alignment: 'right', backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'golfe',
  },
  {
    ...blockBase(
      'blk-visa-intl-new',
      'voyage_pricing',
      'visa',
      'الصين، كندا، أمريكا، بريطانيا، أستراليا، ألبانيا وتايلاند + 53 E-Visa',
      {
        eyebrow: 'الدولية · الوجهات الجديدة · 53 دولة E-Visa',
        title: 'ملفات الدول الكبرى وألبانيا وتايلاند وتأشيرات E-Visa',
        description: 'مرافقة شاملة مع تحضير الاستمارات، الترجمة وحجز المواعيد:',
        items: [
          { id: 'vs-i-1', badge: 'الصين', title: 'فيزا الصين السياحية / دعوة رسمية', subtitle: 'ملف كامل سياحي 1,830 د.ت · دعوة رسمية 3,030 د.ت', price: '1,830 / 3,030 د.ت' },
          { id: 'vs-i-2', badge: 'ملفات دولية (موعد شامل)', title: 'كندا 830 · أمريكا 1,030 · بريطانيا 1,430 · أستراليا 1,530 د.ت', subtitle: 'نسخة جواز السفر + صورة شمسية خلفية بيضاء', price: 'من 830 د.ت' },
          { id: 'vs-i-3', badge: 'ألبانيا (مشمول الترجمة)', title: 'فيزا ألبانيا (شاملة المعاليم + ترجمة Easy2Book)', subtitle: 'ملف موظفين / تجار + كشف بنكي 12 شهراً', price: '380 د.ت' },
          { id: 'vs-i-4', badge: 'تايلاند', title: 'فيزا تايلاند السياحية', subtitle: 'جواز + كشف بنكي + صورة + تذكرة + حجز فندقي', price: '130 د.ت' },
          { id: 'vs-i-5', badge: '53 دولة E-Visa', title: 'تأشيرات E-Visa لـ 53 وجهة جديدة حسب الطلب', subtitle: 'سنغافورة، فيتنام، أذربيجان/كازاخستان، تنزانيا، كولومبيا وغيرها', price: 'حسب الطلب' },
        ],
      },
      { alignment: 'right', backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'international',
  },
  {
    ...blockBase(
      'blk-visa-gallery',
      'voyage_gallery',
      'visa',
      'معرض الوجهات والخدمات القنصلية',
      {
        eyebrow: 'خدمات التأشيرات Easy2Book',
        title: 'مرافقة احترافية لجميع التأشيرات حول العالم',
        description: 'أوروبا، الخليج، آسيا، أمريكا الشمالية وأكثر من 53 دولة E-Visa.',
        galleryImageKeys: ['visa_desk', 'visa_europe', 'dubai_skyline', 'visa_canada'],
      },
      { alignment: 'right', backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'galerie',
  },
  blockBase(
    'blk-visa-whatsapp',
    'whatsapp_button',
    'common',
    'التواصل المباشر لخدمات الفيزا عبر واتساب Easy2Book',
    {
      eyebrow: 'مركز خدمات الفيزا Easy2Book',
      title: 'تواصل معنا عبر الهاتف أو واتساب: 98 140 514',
      description: 'مراجعة فورية لوثائقكم وحجز مواعيد شنغن وكندا وإصدار فيزا مصر ودبي وقطر وعُمان.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'واتساب Easy2Book · 98 140 514',
        prefilledMessage: 'السلام عليكم Easy2Book (98 140 514)، أرغب في الاستفسار عن خدمة الفيزا.',
        trackAsCrmLead: false,
      },
    },
    { alignment: 'right', backgroundColor: '#FFFFFF' }
  ),
  blockBase(
    'blk-visa-form',
    'lead_form',
    'common',
    'استمارة إيداع ملف الفيزا Easy2Book',
    {
      eyebrow: 'إيداع ملف Easy2Book · 98 140 514',
      title: 'أرسل طلب التأشيرة أو ملف E-Visa الآن',
      description: 'أدخل بياناتك والوجهة المطلوبة وسيتواصل معك مستشار الفيزا في Easy2Book فوراً.',
    },
    { alignment: 'right' }
  ),
];

const VISA_EGYPTE_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-veg-hero-vid',
    'hero_video',
    'visa',
    'فيديو 9:16 · فيزا وضمان مصر (4 ساعات)',
    {
      eyebrow: 'Easy2Book · فيزا مصر • التعريفات الرسمية · الأجل: 4 ساعات',
      title: 'فيزا وضمان مصر — رسالة السفر من تونس وموافقات شرم الشيخ والإسكندرية والغردقة',
      description:
        'فيديو 9:16 بالتعليق الصوتي التونسي (ليلى)، تعريفة تبدأ من 90 د.ت، معالجة فورية خلال 4 ساعات ووثائق مبسطة (نسخة من جواز السفر + تذكرة الطائرة).',
      imageKey: 'egypt_pyramids_reel',
      reelPreset: 'visa_egypt',
      primaryCtaLabel: 'أودع ملف فيزا مصر الآن',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-veg-tariffs',
      'voyage_pricing',
      'visa',
      'فيزا مصر • التعريفات الرسمية',
      {
        eyebrow: 'فيزا مصر • التعريفات · الأجل : 4 ساعات',
        title: 'جدول التعريفات الرسمية لفيزا وضمان مصر',
        description: 'الوثائق المطلوبة : نسخة من جواز السفر + تذكرة الطائرة.',
        items: [
          {
            id: 'veg-t1',
            badge: 'الأجل : 4 ساعات',
            title: 'رسالة / ضمان السفر · انطلاق من تونس',
            subtitle: 'للمسافرين المنطلقين من المطارات التونسية',
            price: '90 د.ت',
          },
          {
            id: 'veg-t2',
            badge: 'حسب الطلب',
            title: 'رسالة / ضمان السفر · انطلاق من دولة أخرى (حسب الطلب)',
            subtitle: 'الإقلاع من خارج تونس نحو مصر',
            price: '150 د.ت',
          },
          {
            id: 'veg-t3',
            badge: 'شخص واحد',
            title: 'نزول شرم الشيخ / الإسكندرية / الغردقة · شخص واحد',
            subtitle: 'موافقة نزول اسمية فردية (خلال 4 ساعات)',
            price: '350 د.ت',
          },
          {
            id: 'veg-t4',
            badge: 'من شخصين · للشخص',
            title: 'ابتداءً من شخصين · للشخص الواحد',
            subtitle: 'شرم الشيخ / الإسكندرية / الغردقة (تعريفة الفرد)',
            price: '300 د.ت',
          },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-veg-docs',
    'visa_documents',
    'visa',
    'الوثائق المطلوبة لفيزا مصر',
    {
      eyebrow: 'الوثائق المطلوبة',
      title: 'المستندات اللازمة لفيزا وضمان مصر',
      description: 'أرسل صور الوثائق عبر الواتساب على 98 140 514 (الإنجاز في 4 ساعات فقط).',
      items: [
        {
          id: 'veg-d1',
          title: 'نسخة من جواز السفر + تذكرة الطائرة',
          subtitle: 'إصدار سريع خلال 4 ساعات عمل مع متابعة Easy2Book',
          badge: 'إلزامي',
        },
      ],
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-veg-wa',
    'whatsapp_button',
    'common',
    'واتساب مباشر Easy2Book',
    {
      eyebrow: 'معالجة سريعة في 4 ساعات',
      title: 'أرسل جواز السفر وتذكرة الطائرة عبر الواتساب',
      description: 'مركز حجوزات Easy2Book · 98 140 514.',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: 'واتساب فيزا مصر · 98 140 514',
        prefilledMessage: 'مرحباً Easy2Book، أرغب في طلب فيزا / ضمان السفر إلى مصر (نسخة جواز السفر + تذكرة الطائرة).',
        trackAsCrmLead: false,
      },
    }
  ),
  blockBase(
    'blk-veg-form',
    'lead_form',
    'common',
    'استمارة طلب فيزا مصر',
    {
      eyebrow: 'طلب مباشر عبر Easy2Book',
      title: 'أودع طلب فيزا مصر الآن',
      description: 'استلام ومعالجة خلال 4 ساعات · 98 140 514.',
    }
  ),
];

const VISA_DUBAI_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-vdxb-hero-vid',
    'hero_video',
    'visa',
    'Vidéo 9:16 · Visa Dubaï & Émirats',
    {
      eyebrow: 'EASY2BOOK · VISA DUBAÏ & ÉMIRATS',
      title: 'Visa Dubaï Touristique, Express (+60 DT) & Résidence 2 Ans ID Inclus',
      description: 'Avec garantie (350/550 DT), sans garantie (430/680 DT), enfant <12 ans, multi-entrée, prolongation 1 110 DT & Résidence 2 ans 6 830 DT.',
      imageKey: 'dubai_skyline',
      reelPreset: 'visa_dubai',
      primaryCtaLabel: 'Demander mon Visa Dubaï',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-vdxb-tariffs',
      'voyage_pricing',
      'visa',
      'Tarifs Visa Dubaï',
      {
        eyebrow: 'VISA DUBAÏ • TARIFS EASY2BOOK',
        title: 'Touristique 1 & 2 Mois, Multi-Entrée & Résidence 2 Ans',
        description: 'Option Express 48–72h (+60 DT). Documents : Copie passeport + photo fond blanc.',
        items: [
          { id: 'vdxb-1', badge: 'Avec garantie', title: 'Touristique 1 mois / 2 mois (H/F)', subtitle: 'Express +60 DT disponible (48–72h)', price: '350 / 550 DT' },
          { id: 'vdxb-2', badge: 'Sans garantie', title: 'Touristique 1 mois / 2 mois (H/F)', subtitle: 'Sans dépôt de garantie', price: '430 / 680 DT' },
          { id: 'vdxb-3', badge: 'Enfant <12 ans', title: 'Visa Enfant 1 mois / 2 mois', subtitle: 'Tarif réduit enfant', price: '330 / 430 DT' },
          { id: 'vdxb-4', badge: 'Multi-entrée / Sur place', title: 'Multi-entrée (710/1 010 DT) & Prolongation (1 110 DT)', subtitle: 'Prolongation 1 mois à l’intérieur des Émirats', price: '710 – 1 110 DT' },
          { id: 'vdxb-5', badge: 'Emirates ID inclus', title: 'Visa Résidence 2 ans (Délai 15–20 jours)', subtitle: 'Emirates ID inclus', price: '6 830 DT' },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-vdxb-docs',
    'visa_documents',
    'visa',
    'DOCUMENTS À FOURNIR · Dubaï',
    {
      eyebrow: 'DOCUMENTS À FOURNIR',
      title: 'Pièces requises pour Visa Dubaï',
      description: 'Délai touristique : 2j à 1 semaine (Express 48–72h hors week-end).',
      items: [
        { id: 'vdxb-d1', title: 'Copie passeport', subtitle: 'Passeport valide +6 mois', badge: 'Requis' },
        { id: 'vdxb-d2', title: 'Photo fond blanc bien scannée', subtitle: 'Haute résolution sans ombres', badge: 'Requis' },
      ],
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-vdxb-form',
    'lead_form',
    'common',
    'Formulaire Visa Dubaï',
    {
      eyebrow: 'Easy2Book · 98 140 514',
      title: 'Demandez votre Visa Dubaï',
      description: 'Sélectionnez la durée et l’option Express si nécessaire.',
    }
  ),
];

const VISA_QATAR_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-vqa-hero-vid',
    'hero_video',
    'visa',
    'Vidéo 9:16 · Visa Qatar',
    {
      eyebrow: 'EASY2BOOK · VISA QATAR',
      title: 'Visa Qatar — Touristique 1 Mois (170 DT) & Annuel / Travail sans ID Qatar',
      description: 'Touristique 170 DT, Annuel Homme 1 380 DT / Femme 1 980 DT (+ 1 650 QAR à payer au Qatar).',
      imageKey: 'dubai_skyline',
      reelPreset: 'visa_qatar',
      primaryCtaLabel: 'Déposer mon dossier Qatar',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-vqa-tariffs',
      'voyage_pricing',
      'visa',
      'Tarifs Visa Qatar',
      {
        eyebrow: 'VISA QATAR • TARIFS EASY2BOOK',
        title: 'Touristique 1 Mois & Annuel / Travail sans ID Qatar',
        description: 'Documents : Copie passeport + photo fond blanc bien scannée.',
        items: [
          { id: 'vqa-1', badge: 'Touristique', title: 'Visa Touristique Qatar · 1 mois', subtitle: 'Séjour 30 jours', price: '170 DT' },
          { id: 'vqa-2', badge: 'Homme · sans ID', title: 'Visa Annuel / Travail · Homme', subtitle: '+ 1 650 QAR au Qatar (médical, empreintes, ID)', price: '1 380 DT' },
          { id: 'vqa-3', badge: 'Femme · sans ID', title: 'Visa Annuel / Travail · Femme', subtitle: '+ 1 650 QAR au Qatar (médical, empreintes, ID)', price: '1 980 DT' },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-vqa-docs',
    'visa_documents',
    'visa',
    'DOCUMENTS À FOURNIR · Qatar',
    {
      eyebrow: 'DOCUMENTS À FOURNIR',
      title: 'Pièces requises pour Visa Qatar',
      description: 'Envoi rapide via WhatsApp 98 140 514.',
      items: [
        { id: 'vqa-d1', title: 'Copie passeport', subtitle: 'Validité +6 mois', badge: 'Requis' },
        { id: 'vqa-d2', title: 'Photo fond blanc bien scannée', subtitle: 'Format identité net', badge: 'Requis' },
      ],
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-vqa-form',
    'lead_form',
    'common',
    'Formulaire Visa Qatar',
    {
      eyebrow: 'Easy2Book · 98 140 514',
      title: 'Demandez votre Visa Qatar',
      description: 'Notre équipe vous confirme la procédure en quelques minutes.',
    }
  ),
];

const VISA_OMAN_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-vom-hero-vid',
    'hero_video',
    'visa',
    'Vidéo 9:16 · Visa Oman',
    {
      eyebrow: 'EASY2BOOK · VISA SULTANAT D’OMAN',
      title: 'Visa Oman — 10 Jours (230 DT), 1 Mois (330/380 DT) & Résidence 2 Ans ID Inclus',
      description: 'Touristique sous 2j à 1 semaine et Résidence 2 ans ID inclus Homme 7 530 DT / Femme 9 530 DT (15–20j).',
      imageKey: 'airline_business_cabin',
      reelPreset: 'visa_oman',
      primaryCtaLabel: 'Demander mon Visa Oman',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-vom-tariffs',
      'voyage_pricing',
      'visa',
      'Tarifs Visa Oman',
      {
        eyebrow: 'VISA OMAN • TARIFS EASY2BOOK',
        title: 'Séjours Touristiques & Résidence 2 Ans ID Inclus',
        description: 'Documents : Copie du passeport + photo fond blanc bien scannée.',
        items: [
          { id: 'vom-1', badge: '2j à 1 sem.', title: 'Visa Touristique Oman · 10 jours', subtitle: 'Court séjour Oman', price: '230 DT' },
          { id: 'vom-2', badge: '2j à 1 sem.', title: 'Visa Touristique 1 mois · Homme / Femme', subtitle: 'Homme 330 DT · Femme 380 DT', price: '330 / 380 DT' },
          { id: 'vom-3', badge: '15 à 20 jours', title: 'Visa Résidence 2 ans (ID inclus)', subtitle: 'Homme 7 530 DT · Femme 9 530 DT', price: '7 530 / 9 530 DT' },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-vom-docs',
    'visa_documents',
    'visa',
    'DOCUMENTS À FOURNIR · Oman',
    {
      eyebrow: 'DOCUMENTS À FOURNIR',
      title: 'Pièces requises pour Visa Oman',
      description: 'Traitement rapide Easy2Book · 98 140 514.',
      items: [
        { id: 'vom-d1', title: 'Copie du passeport', subtitle: 'Scan clair page identité', badge: 'Requis' },
        { id: 'vom-d2', title: 'Photo d’identité fond blanc bien scannée', subtitle: 'Netteté optimale requise', badge: 'Requis' },
      ],
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-vom-form',
    'lead_form',
    'common',
    'Formulaire Visa Oman',
    {
      eyebrow: 'Easy2Book · 98 140 514',
      title: 'Déposez votre dossier Visa Oman',
      description: 'Précisez visa touristique ou résidence 2 ans.',
    }
  ),
];

const VISA_OMRA_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-vomr-hero-vid',
    'hero_video',
    'visa',
    'Vidéo 9:16 · Visa Omra Arabie Saoudite',
    {
      eyebrow: 'EASY2BOOK · VISA OMRA ARABIE SAOUDITE',
      title: 'Visa Omra Arabie Saoudite — Traitement Complet 820 DT',
      description: 'Émission Visa Omra électronique avec assistance code empreintes biométriques Saudi Bio · 98 140 514.',
      imageKey: 'omra_vip_haram',
      reelPreset: 'visa_omra',
      primaryCtaLabel: 'Demander Visa Omra (820 DT)',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-vomr-tariffs',
      'voyage_pricing',
      'visa',
      'Tarif Visa Omra',
      {
        eyebrow: 'VISA OMRA • ARABIE SAOUDITE',
        title: 'Visa Omra Électronique & Suivi Saudi Bio',
        description: 'Documents : passeport, photo fond blanc, billet d’avion & code Saudi Bio.',
        items: [
          {
            id: 'vomr-1',
            badge: 'Arabie Saoudite',
            title: 'Visa Omra — Arabie Saoudite',
            subtitle: 'Contrôle complet du dossier et du code Saudi Bio inclus',
            price: '820 DT',
          },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-vomr-docs',
    'visa_documents',
    'visa',
    'DOCUMENTS À FOURNIR · Visa Omra',
    {
      eyebrow: 'DOCUMENTS À FOURNIR',
      title: 'Pièces requises pour Visa Omra',
      description: 'Accompagnement pas à pas pour la validation Saudi Bio.',
      items: [
        { id: 'vomr-d1', title: 'Copie du passeport', subtitle: 'Validité +6 mois', badge: 'Requis' },
        { id: 'vomr-d2', title: 'Photo d’identité fond blanc', subtitle: 'Récente', badge: 'Requis' },
        { id: 'vomr-d3', title: 'Billet d’avion', subtitle: 'Itinéraire aller-retour', badge: 'Requis' },
        { id: 'vomr-d4', title: 'Code des empreintes Saudi Bio', subtitle: 'Via application Saudi Visa Bio', badge: 'Biométrie' },
      ],
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-vomr-form',
    'lead_form',
    'common',
    'Formulaire Visa Omra',
    {
      eyebrow: 'Easy2Book · 98 140 514',
      title: 'Déposez votre demande Visa Omra',
      description: 'Prise en charge immédiate.',
    }
  ),
];

const VISA_INTERNATIONAL_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-vint-hero-vid',
    'hero_video',
    'visa',
    'Vidéo 9:16 · Chine & Dossiers Internationaux',
    {
      eyebrow: 'EASY2BOOK · CHINE, CANADA, USA, UK & AUSTRALIE',
      title: 'Visa Chine & Dossiers Internationaux (Rendez-vous inclus)',
      description: 'Canada 830 DT, USA 1 030 DT, UK 1 430 DT, Australie 1 530 DT, Chine Touristique 1 830 DT & Invitation 3 030 DT.',
      imageKey: 'visa_canada',
      reelPreset: 'visa_international',
      primaryCtaLabel: 'Ouvrir mon dossier international',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-vint-tariffs',
      'voyage_pricing',
      'visa',
      'Tarifs Chine & Internationaux',
      {
        eyebrow: 'CHINE & INTERNATIONAUX • TARIFS EASY2BOOK',
        title: 'Dossiers Long-Courriers & Visa Chine',
        description: 'Formulaires officiels DS-160 / IRCC / UKVI et prise de RDV inclus.',
        items: [
          { id: 'vint-1', badge: 'RDV inclus', title: 'Dossier Canada (830 DT) & USA (1 030 DT)', subtitle: 'Copie passeport + photo fond blanc', price: '830 / 1 030 DT' },
          { id: 'vint-2', badge: 'RDV inclus', title: 'Dossier Royaume-Uni (1 430 DT) & Australie (1 530 DT)', subtitle: 'Copie passeport + photo fond blanc', price: '1 430 / 1 530 DT' },
          { id: 'vint-3', badge: 'Chine', title: 'Visa Chine Touristique (1 830 DT) · Invitation (3 030 DT)', subtitle: 'Visa Travail (Z) sur demande', price: '1 830 / 3 030 DT' },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-vint-docs',
    'visa_documents',
    'visa',
    'DOCUMENTS À FOURNIR · Chine & Internationaux',
    {
      eyebrow: 'DOCUMENTS À FOURNIR',
      title: 'Pièces requises par destination',
      description: 'Vérification complète avant soumission consulaire.',
      items: [
        { id: 'vint-d1', title: 'Canada / USA / UK / Australie', subtitle: 'Copie passeport + photo fond blanc', badge: 'RDV inclus' },
        { id: 'vint-d2', title: 'Chine Touristique', subtitle: 'Passeport, photo fond blanc, formulaire, relevés bancaires, B3, attestation de travail', badge: 'Complet' },
      ],
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-vint-form',
    'lead_form',
    'common',
    'Formulaire Visa International',
    {
      eyebrow: 'Easy2Book · 98 140 514',
      title: 'Planifiez votre dossier international',
      description: 'Réponse rapide de votre conseiller consulaire.',
    }
  ),
];

const VISA_EVISA_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-vev-hero-vid',
    'hero_video',
    'visa',
    'Vidéo 9:16 (42s) · Passeport Tunisien & Formalités E-Visa',
    {
      eyebrow: 'EASY2BOOK · PASSEPORT TUNISIEN · FORMALITÉS ÉLECTRONIQUES (E-VISA)',
      title: 'Des destinations accessibles avec des formalités électroniques (E-Visa)',
      description:
        'Rwanda, Tanzanie, Cameroun, Qatar, Bahreïn, Vietnam, Ouzbékistan, Albanie (380 DT), Colombie, Bahamas, Thaïlande (130 DT) et +50 destinations E-Visa. Un E-Visa reste une demande officielle soumise aux autorités du pays concerné.',
      imageKey: 'evisa_passport_globe',
      reelPreset: 'visa_evisa',
      primaryCtaLabel: 'Demander mon accompagnement E-Visa',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-vev-tariffs',
      'voyage_pricing',
      'visa',
      'Tarifs E-Visa & Formalités Électroniques',
      {
        eyebrow: 'E-VISA • VISA EN LIGNE',
        title: 'Des destinations accessibles avec des formalités électroniques',
        description:
          'Easy2Book vous accompagne pour comprendre les procédures, vérifier les pièces et préparer votre demande E-Visa.',
        items: [
          { id: 'vev-1', badge: 'Traduction incluse', title: 'Visa Albanie (frais + traduction en anglais par Easy2Book)', subtitle: 'Passeport, relevé 12 mois, dossier salarié/commerçant', price: '380 DT' },
          { id: 'vev-2', badge: 'Touristique', title: 'Visa Thaïlande', subtitle: 'Passeport, relevé 6 mois, photo, billet, réservation hôtel', price: '130 DT' },
          { id: 'vev-3', badge: 'Formalités électroniques', title: 'Destinations E-Visa sur demande (Afrique, Asie, Europe, Amériques)', subtitle: 'Rwanda, Tanzanie, Cameroun, Qatar, Bahreïn, Vietnam, Ouzbékistan, Colombie, Bahamas…', price: 'Sur demande' },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'tarifs',
  },
  blockBase(
    'blk-vev-docs',
    'visa_documents',
    'visa',
    'DOCUMENTS À FOURNIR · E-Visa',
    {
      eyebrow: 'DOCUMENTS À FOURNIR',
      title: 'Pièces par destination E-Visa',
      description: 'Les conditions varient selon le pays, la nationalité et la durée du séjour.',
      items: [
        { id: 'vev-d1', title: 'Albanie (380 DT)', subtitle: 'Passeport, relevé bancaire 12 mois + attestation de travail/CNSS ou patente/RNE/quittance', badge: 'Traduction incluse' },
        { id: 'vev-d2', title: 'Thaïlande (130 DT)', subtitle: 'Passeport, relevé bancaire 6 mois, photo, billet d’avion & réservation hôtel', badge: 'Touristique' },
      ],
    },
    { backgroundColor: '#F5F7FA' }
  ),
  blockBase(
    'blk-vev-form',
    'lead_form',
    'common',
    'Formulaire E-Visa',
    {
      eyebrow: 'Easy2Book · خطوتك الأولى نحو العالم · 98 140 514',
      title: 'Demandez votre accompagnement E-Visa',
      description: 'Indiquez votre destination : la décision finale appartient toujours aux autorités du pays concerné.',
    }
  ),
];

const FLIGHTS_FERRIES_BLOCKS: PageBlock[] = [
  blockBase(
    'blk-ff-hero-vid',
    'hero_video',
    'voyages',
    'Vidéo Promo 30s · Billet d’Avion & Bateau',
    {
      eyebrow: 'RUBRIQUE BILLET D’AVION & BATEAUX · VIDÉO 30s (9:16)',
      title: '15 onglets ouverts juste pour réserver un billet d’avion ou de bateau ? Arrête tout de suite.',
      description:
        'Sur Easy2Book, toutes les compagnies aériennes et maritimes sont au même endroit. Pas de frais surprises à la fin : ton e-billet en 3 clics.',
      imageKey: 'flights_tabs_stress',
      reelPreset: 'flights_ferries',
      primaryCtaLabel: 'Réserve sur Easy2Book 👇',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    { backgroundColor: '#FAF9F6', paddingY: 'spacious' }
  ),
  {
    ...blockBase(
      'blk-ff-flights-module',
      'module_flights',
      'voyages',
      'Billetterie Aérienne · Vols Express & Internationaux',
      {
        eyebrow: 'AVION ✈️ · COMPARATEUR MULTI-COMPAGNIES',
        title: 'Vols express, directs et correspondances en 3 clics',
        description:
          'Comparez toutes les compagnies aériennes (Tunisair, Nouvelair, Air France, Transavia, Emirates, Turkish Airlines...) au même endroit sans frais surprises.',
        items: [
          {
            id: 'ff-v1',
            badge: 'Vol express',
            title: 'Tunis / Monastir / Djerba ↔ Paris, Lyon, Marseille, Nice',
            subtitle: 'Comparatif temps réel · bagage cabine ou soute inclus selon choix',
            price: 'Sur devis',
          },
          {
            id: 'ff-v2',
            badge: 'Europe & Italie',
            title: 'Tunisie ↔ Rome, Milan, Francfort, Madrid & Londres',
            subtitle: 'Émission e-billet immédiate sans frais cachés',
            price: 'Sur devis',
          },
          {
            id: 'ff-v3',
            badge: 'Moyen-Orient',
            title: 'Tunis ↔ Istanbul, Le Caire, Dubaï, Djeddah & Doha',
            subtitle: 'Idéal vacances, affaires, visas et Omra',
            price: 'Sur devis',
          },
        ],
      },
      { backgroundColor: '#FFFFFF' }
    ),
    anchorId: 'module-vols',
  },
  {
    ...blockBase(
      'blk-ff-ferries-module',
      'module_ferries',
      'voyages',
      'Bateaux & Ferries · Traversées Méditerranée',
      {
        eyebrow: 'BATEAU ⛴️ · TRAVERSÉES MÉDITERRANÉE & ÎLES',
        title: 'Tunisie ↔ France / Italie & traversées d’été',
        description:
          'Réservez CTN, Corsica Linea, GNV et Grimaldi Lines (La Goulette ↔ Marseille, Gênes, Civitavecchia, Palerme, Salerne) avec cabine ou fauteuil et véhicule.',
        items: [
          {
            id: 'ff-b1',
            badge: 'Tunisie–France',
            title: 'La Goulette ↔ Marseille (CTN · Corsica Linea)',
            subtitle: 'Passagers, cabine familiale ou véhicule embarqué',
            price: 'Sur devis',
          },
          {
            id: 'ff-b2',
            badge: 'Tunisie–Italie',
            title: 'La Goulette ↔ Gênes / Civitavecchia / Palerme',
            subtitle: 'Traversées d’été et liaisons régulières GNV & Grimaldi',
            price: 'Sur devis',
          },
          {
            id: 'ff-b3',
            badge: 'Îles & Combiné',
            title: 'Traversées îles & combinés Vol + Bateau',
            subtitle: 'E-billet embarquement immédiat directement sur téléphone',
            price: 'Sur devis',
          },
        ],
      },
      { backgroundColor: '#F5F7FA' }
    ),
    anchorId: 'module-bateaux',
  },
  blockBase(
    'blk-ff-whatsapp',
    'whatsapp_button',
    'common',
    'Assistance WhatsApp Billetterie 98 140 514',
    {
      eyebrow: 'WHATSAPP DIRECT · 98 140 514',
      title: 'Émission express Avion ou Bateau sur WhatsApp',
      description: 'Recevez votre e-billet sans frais surprises sur votre téléphone.',
      primaryCtaLabel: 'Réserver sur WhatsApp · 98 140 514',
    }
  ),
  blockBase(
    'blk-ff-form',
    'lead_form',
    'common',
    'Formulaire Billetterie Avion & Bateau',
    {
      eyebrow: 'Easy2Book · The easiest way to travel',
      title: 'Réserve ton prochain départ Avion ou Bateau en 3 clics',
      description: 'Indiquez votre trajet (Avion, Bateau ou Combiné), vos dates et le nombre de passagers.',
    }
  ),
];

export const DEMO_TEMPLATES: PageTemplate[] = [
  // === UNIVERS 1 : OMRA (4 modèles) ===
  {
    id: 'tpl-omra-video-rtl',
    name: 'Omra Signature · Vidéo 9:16 + Tarifs Chambres',
    universe: 'omra',
    description: 'Modèle haute conversion RTL/FR avec lecteur vidéo 9:16, tarifs par chambre, compte à rebours et témoignages.',
    styleTag: 'Vidéo 9:16 · Haute Conversion',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Familles & Pèlerins via Reels / TikTok / Meta Ads',
    recommendedGroup: 'Ramadan 2027',
    supportedLanguages: ['ar', 'fr', 'en'],
    defaultLanguage: 'ar',
    previewImageKey: 'makkah_haram',
    defaultBlocks: OMRA_RAMADAN_BLOCKS,
    defaultForm: makeForm('ar', 'omra-ramadan'),
  },
  {
    id: 'tpl-omra-vip-5s',
    name: 'Omra VIP 5★ · Vue Panoramique Haram',
    universe: 'omra',
    description: 'Page prestige dédiée aux hôtels 5★ sur l’esplanade (0m du Haram), transferts privés et suites familiales.',
    styleTag: 'Prestige 5★ · Esplanade',
    trendSegment: 'Luxe & VIP',
    targetAudience: 'Dirigeants, Couples & Voyageurs Confort VIP',
    recommendedGroup: 'Ramadan 2027',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'omra_vip_haram',
    defaultBlocks: OMRA_VIP_BLOCKS,
    defaultForm: makeForm('fr', 'omra-vip'),
  },
  {
    id: 'tpl-omra-classic',
    name: 'Omra Familles & Vacances Scolaires',
    universe: 'omra',
    description: 'Modèle conçu pour les vacances d’hiver et de printemps : chambres communicantes, réduction enfants et visites à Médine.',
    styleTag: 'Familles · Encadrement',
    trendSegment: 'Familles & Groupes',
    targetAudience: 'Parents avec Enfants & Familles Multi-Générations',
    recommendedGroup: 'Vacances Scolaires',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'madinah_twilight',
    defaultBlocks: OMRA_FAMILLE_BLOCKS,
    defaultForm: makeForm('fr', 'omra-familles'),
  },
  {
    id: 'tpl-omra-eco',
    name: 'Omra Économique · Premier Départ Garanti',
    universe: 'omra',
    description: 'Présentation transparente pour départs économiques (quadruple/triple), FAQ passeport & visa et formulaire rapide.',
    styleTag: 'Essentiel · Prix Appel',
    trendSegment: 'Early Booking & Promo',
    targetAudience: 'Jeunes Actifs, Étudiants & Groupes Associatifs',
    recommendedGroup: 'Saison Hiver 2027',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'tunis_flight',
    defaultBlocks: OMRA_ECO_BLOCKS,
    defaultForm: makeForm('fr', 'omra-eco'),
  },

  // === UNIVERS 2 : VOYAGES ORGANISÉS (4 modèles) ===
  {
    id: 'tpl-voyage-circuit',
    name: 'Istanbul & Bosphore · Circuit Classique 8J/7N',
    universe: 'voyages',
    description: 'Page circuit complète avec hero immersif, déroulé jour par jour, options d’excursions et tarifs clairs.',
    styleTag: 'Circuit · Programme Détaillé',
    trendSegment: 'Familles & Groupes',
    targetAudience: 'Couples, Familles & Groupes Loisirs',
    recommendedGroup: 'Circuits Turquie',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'voyage_istanbul',
    defaultBlocks: VOYAGE_ISTANBUL_BLOCKS,
    defaultForm: makeForm('fr', 'voyage-circuit'),
  },
  {
    id: 'tpl-voyage-dubai-luxe',
    name: 'Dubaï Luxe & Marina · Yachts, Burj & Désert VIP',
    universe: 'voyages',
    description: 'Modèle premium orienté lifestyle & expériences haut de gamme pour Dubaï, Abu Dhabi ou Doha.',
    styleTag: 'Lifestyle · Moyen-Orient VIP',
    trendSegment: 'Luxe & VIP',
    targetAudience: 'Couples, Voyages de Noces & Cadres Supérieurs',
    recommendedGroup: 'Moyen-Orient VIP',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'dubai_skyline',
    defaultBlocks: VOYAGE_DUBAI_BLOCKS,
    defaultForm: makeForm('fr', 'voyage-dubai'),
  },
  {
    id: 'tpl-voyage-egypte-nil',
    name: 'Égypte Éternelle · Le Caire & Croisière Nil 5★',
    universe: 'voyages',
    description: 'Structure culturelle idéale pour les circuits combinés (Le Caire + Louxor/Assouan, Maroc Impérial, Jordanie).',
    styleTag: 'Culture & Croisière · 9J/8N',
    trendSegment: 'Familles & Groupes',
    targetAudience: 'Passionnés d’Histoire, Familles & Amis',
    recommendedGroup: 'Circuits Culturels',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'cairo_nile',
    defaultBlocks: VOYAGE_CAIRO_BLOCKS,
    defaultForm: makeForm('fr', 'voyage-egypte'),
  },
  {
    id: 'tpl-voyage-excursions-egypte',
    name: 'رحلات يومية مصر · فيديو 9:16 + شبكة الأسعار (Easy2Book)',
    universe: 'voyages',
    description: 'قالب عربي متكامل للرحلات الـ 6 في القاهرة مع فيديو ريلز 9:16 بصوت نسائي تونسي ومعرض صور احترافي — الحجز 98 140 514.',
    styleTag: 'فيديو 9:16 + معرض صور · القاهرة',
    trendSegment: 'Familles & Groupes',
    targetAudience: 'المسافرون التونسيون والعائلات والمجموعات إلى مصر',
    recommendedGroup: 'Excursions Égypte',
    supportedLanguages: ['ar', 'fr', 'en'],
    defaultLanguage: 'ar',
    previewImageKey: 'egypt_pyramids_museum',
    defaultBlocks: EGYPT_EXCURSIONS_BLOCKS,
    defaultForm: makeForm('ar', 'excursions-egypte'),
  },
  {
    id: 'tpl-voyage-excursions-turquie',
    name: 'رحلات تركيا اليومية · فيديو 9:16 + السهرات وأنطاليا (Easy2Book)',
    universe: 'voyages',
    description: 'قالب عربي متكامل لرحلات تركيا (صبنجا، بورصا، جزر الأميرات، سهرات البسفور، فيالاند، باقة أنطاليا وتوصيل المطار) — الحجز 98 140 514.',
    styleTag: 'فيديو 9:16 + معرض صور · تركيا',
    trendSegment: 'Familles & Groupes',
    targetAudience: 'المسافرون التونسيون والعائلات إلى إسطنبول وأنطاليا',
    recommendedGroup: 'Excursions Turquie',
    supportedLanguages: ['ar', 'fr', 'en'],
    defaultLanguage: 'ar',
    previewImageKey: 'turkey_bosphorus_cruise',
    defaultBlocks: TURKEY_EXCURSIONS_BLOCKS,
    defaultForm: makeForm('ar', 'excursions-turquie'),
  },
  {
    id: 'tpl-voyage-citybreak',
    name: 'Escapade City Break · Format Meta Ads Express',
    universe: 'voyages',
    description: 'Tunnel court haute vélocité avec compte à rebours promo et formulaire court pour campagnes Instagram/Facebook.',
    styleTag: 'Funnel Court · Social Ads',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Trafic Payant Social Media & Week-ends Express',
    recommendedGroup: 'City Breaks Express',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'tunis_flight',
    defaultBlocks: VOYAGE_CITYBREAK_BLOCKS,
    defaultForm: makeForm('fr', 'city-break'),
  },

  // === UNIVERS 3 : HÔTELS TUNISIE (4 modèles) ===
  {
    id: 'tpl-hotel-promo',
    name: 'Resort Hammamet 5★ · Promo Saison & All-In',
    universe: 'hotels_tunisie',
    description: 'Fiche établissement 5★, atouts resort, grille tarifaire Demi-Pension / All-Inclusive et vérification de dates.',
    styleTag: 'Resort Balnéaire · Promo',
    trendSegment: 'Early Booking & Promo',
    targetAudience: 'Familles Tunisiennes & Week-ends Balnéaires',
    recommendedGroup: 'Cap Bon & Hammamet',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'tunisia_resort',
    defaultBlocks: HOTEL_TUNISIE_BLOCKS,
    defaultForm: makeForm('fr', 'hotel-promo'),
  },
  {
    id: 'tpl-hotel-thalasso',
    name: 'Djerba Thalasso & Spa · Séjour Couples & Bien-être',
    universe: 'hotels_tunisie',
    description: 'Mise en avant cure thalasso, piscine d’eau de mer chauffée, suites couples et réductions longs séjours.',
    styleTag: 'Thalasso 5★ · Bien-être',
    trendSegment: 'Luxe & VIP',
    targetAudience: 'Couples, Jeunes Mariés & Clientèle Détente',
    recommendedGroup: 'Djerba & Sud',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'djerba_thalasso',
    defaultBlocks: HOTEL_DJERBA_THALASSO_BLOCKS,
    defaultForm: makeForm('fr', 'hotel-thalasso'),
  },
  {
    id: 'tpl-hotel-sahara-tozeur',
    name: 'Sahara & Oasis Tozeur · Écotourisme & Dunes',
    universe: 'hotels_tunisie',
    description: 'Modèle dédié aux lodges sahariens, circuits 4x4 oasis de montagne et séjours automne-hiver dans le Sud.',
    styleTag: 'Désert & Oasis · Automne/Hiver',
    trendSegment: 'Écotourisme / Sahara',
    targetAudience: 'Amateurs Nature, Évasion Hivernale & Incentives',
    recommendedGroup: 'Djerba & Sud',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'sahara_tozeur',
    defaultBlocks: HOTEL_SAHARA_TOZEUR_BLOCKS,
    defaultForm: makeForm('fr', 'hotel-tozeur'),
  },
  {
    id: 'tpl-hotel-early-famille',
    name: 'Early Booking Été Famille · Gratuité Enfants',
    universe: 'hotels_tunisie',
    description: 'Conçu pour convertir les réservations estivales anticipées avec mise en avant gratuité 1er enfant et compte à rebours.',
    styleTag: 'Early Booking · Gratuité Enfant',
    trendSegment: 'Early Booking & Promo',
    targetAudience: 'Familles Anticipant Juillet / Août en Tunisie',
    recommendedGroup: 'Été Familles',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'tunisia_resort',
    defaultBlocks: HOTEL_EARLY_FAMILLE_BLOCKS,
    defaultForm: makeForm('fr', 'hotel-early-booking'),
  },

  // === UNIVERS 4 : SERVICES VISA (4 modèles) ===
  {
    id: 'tpl-visa-schengen',
    name: 'Visa Schengen Tourisme & Affaires · Checklist',
    universe: 'visa',
    description: 'Présentation structurée de la checklist publique des pièces requises et des étapes d’accompagnement consulaire.',
    styleTag: 'Schengen · Checklist & Confiance',
    trendSegment: 'Consulaire & Études',
    targetAudience: 'Particuliers & Voyageurs Tourisme / Visite Familiale',
    recommendedGroup: 'Espace Schengen',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'visa_desk',
    defaultBlocks: VISA_FRANCE_BLOCKS,
    defaultForm: makeForm('fr', 'visa-schengen'),
  },
  {
    id: 'tpl-visa-etudes',
    name: 'Visa Études & Mobilité Internationale (France / Canada)',
    universe: 'visa',
    description: 'Modèle spécialisé Campus France, CAQ Canada, justificatifs académiques, FAQ parents et rendez-vous conseil.',
    styleTag: 'Étudiants · Long Séjour',
    trendSegment: 'Consulaire & Études',
    targetAudience: 'Bacheliers, Étudiants & Parents Accompagnants',
    recommendedGroup: 'Études & Long Séjour',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'visa_europe',
    defaultBlocks: VISA_ETUDES_BLOCKS,
    defaultForm: makeForm('fr', 'visa-etudes'),
  },
  {
    id: 'tpl-visa-affaires',
    name: 'Visa Affaires Express & Salons Professionnels',
    universe: 'visa',
    description: 'Page B2B pour dirigeants, commerciaux et exposants : documents entreprise, lettre d’invitation et WhatsApp direct.',
    styleTag: 'Corporate B2B · Express',
    trendSegment: 'Consulaire & Études',
    targetAudience: 'Dirigeants PME, Cadres & Délégations Commerciales',
    recommendedGroup: 'Mobilité Affaires',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'visa_europe',
    defaultBlocks: VISA_AFFAIRES_BLOCKS,
    defaultForm: makeForm('fr', 'visa-affaires'),
  },
  {
    id: 'tpl-visa-multi',
    name: 'Accompagnement Visa Multi-Destinations & FAQ',
    universe: 'visa',
    description: 'Présentation polyvalente pour Royaume-Uni, USA, Émirats, Chine ou Turquie avec parcours en 4 étapes.',
    styleTag: 'Monde · Multi-Pays',
    trendSegment: 'Consulaire & Études',
    targetAudience: 'Demandeurs Visas Hors Schengen & Dossiers Spécifiques',
    recommendedGroup: 'Destinations Monde',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'visa_desk',
    defaultBlocks: VISA_FRANCE_BLOCKS,
    defaultForm: makeForm('fr', 'visa-long'),
  },
  {
    id: 'tpl-visa-catalogue-easy2book',
    name: 'Catalogue Complet Visa & E-Visa · Easy2Book (AR/RTL)',
    universe: 'visa',
    description:
      'Page catalogue arabe RTL avec vidéo 9:16 voix féminine tunisienne, Egypte 4h, Schengen, Dubaï, Qatar, Oman, Omra, Chine, Canada/USA/UK/AU, Albanie, Thaïlande & 53 E-Visa.',
    styleTag: 'Catalogue Visa · Vidéo + 53 E-Visa',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Voyageurs Tunisie, Familles, Hommes d’Affaires & Résidences',
    recommendedGroup: 'Visas & E-Visa',
    supportedLanguages: ['ar', 'fr', 'en'],
    defaultLanguage: 'ar',
    previewImageKey: 'visa_desk',
    defaultBlocks: VISA_SERVICES_BLOCKS,
    defaultForm: makeForm('ar', 'visas-services'),
  },
  {
    id: 'tpl-visa-egypte-easy2book',
    name: 'فيزا وضمان مصر • التعريفات الرسمية (4 ساعات · 90 / 150 / 350 / 300 د.ت) · فيديو 9:16',
    universe: 'visa',
    description:
      'صفحة هبوط مخصصة لفيزا وضمان مصر بالكامل باللغة العربية RTL مع فيديو 9:16 بالصوت التونسي، التعريفات (90 / 150 / 350 / 300 د.ت)، الوثائق (نسخة جواز السفر + تذكرة الطائرة) وبروشور PDF.',
    styleTag: 'فيزا مصر بالعربية · فيديو 9:16',
    trendSegment: 'Conversion Vidéo AR',
    targetAudience: 'المسافرون من تونس أو من دول أخرى · شرم الشيخ، الإسكندرية والغردقة',
    recommendedGroup: 'Visas par Type',
    supportedLanguages: ['ar', 'fr', 'en'],
    defaultLanguage: 'ar',
    previewImageKey: 'egypt_pyramids_reel',
    defaultBlocks: VISA_EGYPTE_BLOCKS,
    defaultForm: makeForm('ar', 'visa-egypte'),
  },
  {
    id: 'tpl-visa-dubai-easy2book',
    name: 'Visa Dubaï & Émirats (330–6 830 DT + Express 48–72h) · Vidéo 9:16',
    universe: 'visa',
    description:
      'Landing page dédiée Visa Dubaï : touristique avec/sans garantie, enfant, multi-entrée, prolongation, Résidence 2 ans ID inclus (6 830 DT) & vidéo 9:16.',
    styleTag: 'Visa Dubaï · Vidéo 9:16 + Express',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Touristes, Familles & Résidents Émirats',
    recommendedGroup: 'Visas par Type',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'dubai_skyline',
    defaultBlocks: VISA_DUBAI_BLOCKS,
    defaultForm: makeForm('fr', 'visa-dubai'),
  },
  {
    id: 'tpl-visa-qatar-easy2book',
    name: 'Visa Qatar (Touristique 170 DT & Annuel sans ID) · Vidéo 9:16',
    universe: 'visa',
    description:
      'Landing page dédiée Visa Qatar avec vidéo 9:16 : touristique 1 mois (170 DT) et annuel/travail Homme 1 380 DT / Femme 1 980 DT (+1 650 QAR).',
    styleTag: 'Visa Qatar · Vidéo 9:16',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Touristes & Travailleurs Qatar',
    recommendedGroup: 'Visas par Type',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'dubai_skyline',
    defaultBlocks: VISA_QATAR_BLOCKS,
    defaultForm: makeForm('fr', 'visa-qatar'),
  },
  {
    id: 'tpl-visa-oman-easy2book',
    name: 'Visa Oman (10j 230 DT · 1 mois 330/380 DT · Résidence 2 ans) · Vidéo 9:16',
    universe: 'visa',
    description:
      'Landing page dédiée Visa Oman avec vidéo 9:16, séjours 10 jours / 1 mois (2j–1 sem.) et Résidence 2 ans ID inclus (7 530 / 9 530 DT).',
    styleTag: 'Visa Oman · Vidéo 9:16',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Voyageurs & Résidents Sultanat d’Oman',
    recommendedGroup: 'Visas par Type',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'airline_business_cabin',
    defaultBlocks: VISA_OMAN_BLOCKS,
    defaultForm: makeForm('fr', 'visa-oman'),
  },
  {
    id: 'tpl-visa-omra-easy2book',
    name: 'Visa Omra Arabie Saoudite (820 DT + Saudi Bio) · Vidéo 9:16',
    universe: 'visa',
    description:
      'Landing page dédiée Visa Omra électronique à 820 DT avec assistance empreintes Saudi Bio, vidéo 9:16 et brochure PDF.',
    styleTag: 'Visa Omra · Vidéo 9:16',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Pèlerins individuels & Familles Omra',
    recommendedGroup: 'Visas par Type',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'omra_vip_haram',
    defaultBlocks: VISA_OMRA_BLOCKS,
    defaultForm: makeForm('fr', 'visa-omra'),
  },
  {
    id: 'tpl-visa-international-easy2book',
    name: 'Visa Chine & Internationaux (Canada, USA, UK, Australie) · Vidéo 9:16',
    universe: 'visa',
    description:
      'Landing page dédiée Chine (1 830 / 3 030 DT), Canada (830 DT), USA (1 030 DT), UK (1 430 DT) et Australie (1 530 DT) RDV inclus + vidéo 9:16.',
    styleTag: 'Chine & Internationaux · Vidéo 9:16',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Voyageurs Long-Courriers & Affaires',
    recommendedGroup: 'Visas par Type',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'visa_canada',
    defaultBlocks: VISA_INTERNATIONAL_BLOCKS,
    defaultForm: makeForm('fr', 'visa-international'),
  },
  {
    id: 'tpl-visa-evisa-easy2book',
    name: 'Passeport Tunisien · Destinations E-Visa & Vidéo 42s (9:16)',
    universe: 'visa',
    description:
      'Landing page dédiée aux destinations accessibles avec des formalités électroniques (E-Visa), voix off dialecte tunisien 42s, découpage 5 séquences et explorateur interactif.',
    styleTag: 'E-Visa 42s · Vidéo 9:16',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Voyageurs Passeport Tunisien & Formalités Électroniques',
    recommendedGroup: 'Visas par Type',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'evisa_passport_globe',
    defaultBlocks: VISA_EVISA_BLOCKS,
    defaultForm: makeForm('fr', 'visa-evisa'),
  },
  // === UNIVERS BILLETTERIE AVION & BATEAU ===
  {
    id: 'tpl-billetterie-avion-bateau-easy2book',
    name: "Billetterie Avion & Bateau · Vidéo Promo 30s (9:16)",
    universe: 'voyages',
    description:
      "Landing page dédiée Rubrique Billet d'Avion & Bateaux avec scénario vidéo 30s (STOP 15 onglets → Avion/Bateau → 3 clics), comparateur vols & traversées Méditerranée.",
    styleTag: 'Avion & Bateau · Vidéo 30s',
    trendSegment: 'Conversion Vidéo',
    targetAudience: 'Voyageurs Vols Express, Traversées Méditerranée & Familles',
    recommendedGroup: 'Billetterie Avion & Bateau',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'flights_mediterranean_ship',
    defaultBlocks: FLIGHTS_FERRIES_BLOCKS,
    defaultForm: makeForm('fr', 'billetterie-avion-bateau'),
  },
];

function makeInitialVersions(page: Omit<Page, 'versions' | 'publishedVersion'>, published: boolean): {
  versions: PageVersion[];
  publishedVersion: PageVersion | null;
} {
  const snapshot: PageVersionSnapshot = {
    blocks: JSON.parse(JSON.stringify(page.blocks)) as PageBlock[],
    form: JSON.parse(JSON.stringify(page.form)) as FormDefinition,
    seo: { ...page.seo },
    attribution: { ...page.attribution },
    offerRef: JSON.parse(JSON.stringify(page.offerRef)) as OfferReference,
    language: page.language,
    title: page.title,
    folderGroup: page.folderGroup,
    creationMode: page.creationMode,
    brandIdentity: page.brandIdentity
      ? (JSON.parse(JSON.stringify(page.brandIdentity)) as Page['brandIdentity'])
      : undefined,
    header: page.header
      ? (JSON.parse(JSON.stringify(page.header)) as Page['header'])
      : undefined,
    footer: page.footer
      ? (JSON.parse(JSON.stringify(page.footer)) as Page['footer'])
      : undefined,
    commerceModules: page.commerceModules ? [...page.commerceModules] : undefined,
  };

  const v1: PageVersion = {
    versionId: `ver-${page.id}-1`,
    versionNumber: 1,
    createdAt: page.createdAt,
    createdBy: 'Studio Editor (Démo)',
    note: 'Création initiale depuis modèle',
    isPublishedSnapshot: false,
    snapshot,
  };

  if (published) {
    const v2: PageVersion = {
      versionId: `ver-${page.id}-2`,
      versionNumber: 2,
      createdAt: page.updatedAt,
      createdBy: 'Studio Editor (Démo)',
      note: 'Publication validée v2',
      isPublishedSnapshot: true,
      snapshot,
    };
    return { versions: [v2, v1], publishedVersion: v2 };
  }

  return { versions: [v1], publishedVersion: null };
}

function buildDemoPage(
  base: Omit<Page, 'versions' | 'publishedVersion'>
): Page {
  const isPub = base.publication.status === 'published';
  const { versions, publishedVersion } = makeInitialVersions(base, isPub);
  return {
    ...base,
    versions,
    publishedVersion,
  };
}

export const DEMO_PAGES: Page[] = [
  buildDemoPage({
    id: 'page-omra-ramadan-2027',
    title: 'Easy2Book — عمرة رمضان كامل',
    universe: 'omra',
    folderGroup: 'Ramadan 2027',
    isPilotPage: true,
    pilotRenderer: 'omra_ramadan_2027',
    templateId: 'tpl-omra-video-rtl',
    language: 'ar',
    isDemoData: true,
    createdAt: '2026-11-01T09:00:00Z',
    updatedAt: '2026-11-13T16:40:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-13T16:40:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
      expiresAt: '2026-12-15T23:59:59Z',
    },
    offerRef: {
      externalOfferId: 'CAT-OMR-RAM-2027',
      externalSourceName: 'Catalogue Omra Easy2Book (Référence externe)',
      universe: 'omra',
      offerCode: 'OMR-27-RAM',
      displayLabel: 'Omra Ramadan Complet 30 Jours · Maysan Al Multazim',
      cachedSummary: {
        startingPriceLabel: 'À partir de 5,900 DT',
        datesOrValidity: 'Offre valable jusqu’au 15/12/2026',
        availabilityLabel: 'Places limitées (démo)',
        conditionsSummary: 'Remise famille 200 DT dès 2 pers. · Groupes +10 sur appel',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'omra-ramadan-2027',
      metaTitle: 'Easy2Book — عمرة شهر رمضان كامل 2027',
      metaDescription: 'برنامج عمرة شهر رمضان كامل من تونس مع إقامة فندق ميسان الملتزم وزيارة المدينة المنورة.',
      ogTitle: 'Easy2Book — عمرة رمضان 2027',
      ogDescription: 'ابتداءً من 5,900 د.ت مع تخفيض 200 د.ت للعائلات.',
      canonicalPath: '/p/omra-ramadan-2027',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Meta Ads Reels',
      utmSource: 'instagram',
      utmMedium: 'paid_reels',
      utmCampaign: 'omra_ramadan_2027_tn',
      utmContent: 'video_9_16_charon',
    },
    form: makeForm('ar', 'omra-ramadan-2027'),
    blocks: OMRA_RAMADAN_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-voyage-istanbul-2027',
    title: 'Istanbul & Bosphore — Vacances Hiver',
    universe: 'voyages',
    templateId: 'tpl-voyage-circuit',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-04T10:20:00Z',
    updatedAt: '2026-11-12T14:15:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-12T14:15:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
      expiresAt: '2026-12-20T23:59:59Z',
    },
    offerRef: {
      externalOfferId: 'CAT-VOY-IST-2027',
      externalSourceName: 'Catalogue Voyages Easy2Book (Référence externe)',
      universe: 'voyages',
      offerCode: 'VOY-IST-08',
      displayLabel: 'Circuit Istanbul 8 Jours / 7 Nuits · Hôtel 4★ Taksim',
      cachedSummary: {
        startingPriceLabel: 'À partir de 2,490 DT',
        datesOrValidity: 'Départs Janvier – Mars 2027',
        availabilityLabel: '14 sièges restants (démo)',
        conditionsSummary: 'Passeport valide +6 mois',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'voyage-istanbul-bosphore-2027',
      metaTitle: 'Easy2Book — Circuit Istanbul & Bosphore 2027',
      metaDescription: 'Vol direct Tunis-Istanbul, hôtel 4 étoiles et excursions guidées.',
      ogTitle: 'Istanbul 8J/7N — Easy2Book',
      ogDescription: 'À partir de 2,490 DT tout compris.',
      canonicalPath: '/p/voyage-istanbul-bosphore-2027',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Google Search',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'istanbul_hiver_2027',
      utmContent: 'search_ad_1',
    },
    form: makeForm('fr', 'voyage-istanbul'),
    blocks: VOYAGE_ISTANBUL_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-omra-vacances-dec-2026',
    title: 'Omra Vacances Scolaires Décembre',
    universe: 'omra',
    folderGroup: 'Vacances Scolaires',
    templateId: 'tpl-omra-classic',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-06T08:45:00Z',
    updatedAt: '2026-11-13T11:30:00Z',
    publication: {
      status: 'scheduled',
      scheduledAt: '2026-11-18T09:00:00Z',
      expiresAt: '2026-12-05T23:59:59Z',
    },
    offerRef: {
      externalOfferId: 'CAT-OMR-DEC-2026',
      externalSourceName: 'Catalogue Omra Easy2Book (Référence externe)',
      universe: 'omra',
      offerCode: 'OMR-26-VAC',
      displayLabel: 'Omra Familles Vacances d’Hiver · 12 Jours',
      cachedSummary: {
        startingPriceLabel: 'À partir de 4,350 DT',
        datesOrValidity: 'Départ du 19/12 au 31/12/2026',
        availabilityLabel: 'Programmée pour lancement',
        conditionsSummary: 'Tarif préférentiel enfants -12 ans',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'omra-vacances-decembre-2026',
      metaTitle: 'Easy2Book — Omra Vacances Scolaires Décembre 2026',
      metaDescription: 'Départ Omra spécial familles pendant les vacances scolaires de décembre.',
      ogTitle: 'Omra Vacances Décembre — Easy2Book',
      ogDescription: '12 jours à La Mecque et Médine.',
      canonicalPath: '/p/omra-vacances-decembre-2026',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Meta Ads',
      utmSource: 'facebook',
      utmMedium: 'paid_social',
      utmCampaign: 'omra_vacances_dec',
      utmContent: 'carousel_famille',
    },
    form: makeForm('fr', 'omra-vacances'),
    blocks: OMRA_RAMADAN_BLOCKS.slice(1).map((b) => ({
      ...b,
      style: { ...b.style, alignment: 'left' },
    })),
  }),

  buildDemoPage({
    id: 'page-hotel-hammamet-promo',
    title: 'Promo Hôtel Yasmine Hammamet 5★',
    universe: 'hotels_tunisie',
    templateId: 'tpl-hotel-promo',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-08T15:00:00Z',
    updatedAt: '2026-11-13T09:10:00Z',
    publication: {
      status: 'in_review',
      expiresAt: '2026-12-28T23:59:59Z',
    },
    offerRef: {
      externalOfferId: 'CAT-HTL-HAM-2026',
      externalSourceName: 'Catalogue Hôtels Tunisie (Référence externe)',
      universe: 'hotels_tunisie',
      offerCode: 'HTL-HAM-5S',
      displayLabel: 'Yasmine Hammamet Resort 5★ · Offre All Inclusive',
      cachedSummary: {
        startingPriceLabel: 'À partir de 215 DT / nuit',
        datesOrValidity: 'Séjours Nov 2026 – Fév 2027',
        availabilityLabel: 'En révision éditoriale',
        conditionsSummary: 'Gratuité 1er enfant -6 ans',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'hotel-hammamet-all-in-hiver',
      metaTitle: 'Easy2Book — Promo Hôtel 5★ Yasmine Hammamet',
      metaDescription: 'Promotion hiver en All Inclusive ou Demi-Pension à Yasmine Hammamet.',
      ogTitle: 'Promo Hôtel 5★ Hammamet — Easy2Book',
      ogDescription: 'À partir de 215 DT / nuit.',
      canonicalPath: '/p/hotel-hammamet-all-in-hiver',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Newsletter Easy2Book',
      utmSource: 'email',
      utmMedium: 'crm_newsletter',
      utmCampaign: 'promo_hotels_hiver',
      utmContent: 'hammamet_5s',
    },
    form: makeForm('fr', 'hotel-hammamet'),
    blocks: HOTEL_TUNISIE_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-schengen-france',
    title: 'Easy2Book — Visa Espace Schengen (RDV 180 / 280 DT · Vidéo 9:16)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'Centrale Visas & Réservations',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-sh-1', label: 'Tarifs', target: '#tarifs' },
        { id: 'nav-sh-2', label: 'Documents', target: '#visa-documents' },
        { id: 'nav-sh-3', label: 'Demander', target: '#form-block' },
      ],
      ctaLabel: '98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription:
        'Easy2Book — Espace Schengen : rendez-vous Standard (180 DT) et Prime Time (280 DT) avec montage complet du dossier.',
      navLinks: [
        { id: 'ft-sh-1', label: 'Tarifs Schengen', target: '#tarifs' },
        { id: 'ft-sh-2', label: 'Déposer un dossier', target: '#form-block' },
      ],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · Centrale de Réservation · 98 140 514',
    },
    commerceModules: ['visa', 'travel_insurance'],
    templateId: 'tpl-visa-schengen',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-02T11:00:00Z',
    updatedAt: '2026-11-11T17:20:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-11T17:20:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VIS-FR-SCH',
      externalSourceName: 'Catalogue Services Visa (Référence externe)',
      universe: 'visa',
      offerCode: 'VISA-SCH-2026',
      displayLabel: 'Visa Espace Schengen · Standard (180 DT) & Prime Time (280 DT)',
      cachedSummary: {
        startingPriceLabel: 'À partir de 180 DT (Prime Time 280 DT)',
        datesOrValidity: 'Service permanent toute l’année',
        availabilityLabel: 'Créneaux TLS / VFS / BLS ouverts',
        conditionsSummary: 'Copie passeport + photo fond blanc · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-schengen-france-accompagnement',
      metaTitle: 'Easy2Book — Visa Espace Schengen (180 / 280 DT) & Vidéo 9:16',
      metaDescription: 'Rendez-vous Standard 180 DT ou Prime Time 280 DT, préparation complète du dossier Visa Schengen et export brochure PDF.',
      ogTitle: 'Visa Espace Schengen — Easy2Book · 98 140 514',
      ogDescription: 'À partir de 180 DT avec vidéo 9:16 et accompagnement complet.',
      canonicalPath: '/p/visa-schengen-france-accompagnement',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'SEO Organique',
      utmSource: 'organic',
      utmMedium: 'search',
      utmCampaign: 'visa_schengen_2026',
      utmContent: 'landing_video',
    },
    form: makeForm('fr', 'visa-france'),
    blocks: VISA_FRANCE_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-omra-eco-brouillon',
    title: 'Omra Économique Janvier 2027 (Brouillon)',
    universe: 'omra',
    folderGroup: 'Saison Hiver 2027',
    templateId: 'tpl-omra-classic',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-10T14:00:00Z',
    updatedAt: '2026-11-14T08:30:00Z',
    publication: {
      status: 'draft',
    },
    offerRef: {
      externalOfferId: 'CAT-OMR-JAN-2027',
      externalSourceName: 'Catalogue Omra Easy2Book (Référence externe)',
      universe: 'omra',
      offerCode: 'OMR-27-ECO',
      displayLabel: 'Omra Rajab / Janvier · Formule Économique',
      cachedSummary: {
        startingPriceLabel: 'En attente validation tarif',
        datesOrValidity: 'Janvier 2027 · 14 jours',
        availabilityLabel: 'Brouillon interne',
        conditionsSummary: 'Sous réserve confirmation vols',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'omra-economique-janvier-2027',
      metaTitle: 'Easy2Book — Omra Économique Janvier 2027',
      metaDescription: 'Brouillon de page commerciale Omra Janvier.',
      ogTitle: 'Omra Janvier 2027',
      ogDescription: 'Formule économique depuis Tunis.',
      canonicalPath: '/p/omra-economique-janvier-2027',
      noIndex: true,
    },
    attribution: {
      acquisitionSource: 'Meta Ads',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      utmCampaign: 'omra_jan_2027',
      utmContent: 'draft',
    },
    form: makeForm('fr', 'omra-janvier'),
    blocks: OMRA_RAMADAN_BLOCKS.slice(1, 5),
  }),

  buildDemoPage({
    id: 'page-hotel-djerba-expiring',
    title: 'Djerba Early Booking Automne (Expirée)',
    universe: 'hotels_tunisie',
    templateId: 'tpl-hotel-promo',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    publication: {
      status: 'expired',
      expiresAt: '2026-11-01T00:00:00Z',
    },
    offerRef: {
      externalOfferId: 'CAT-HTL-DJE-2026',
      externalSourceName: 'Catalogue Hôtels Tunisie (Référence externe)',
      universe: 'hotels_tunisie',
      offerCode: 'HTL-DJE-AUT',
      displayLabel: 'Promo Djerba Zone Touristique',
      cachedSummary: {
        startingPriceLabel: '180 DT / nuit',
        datesOrValidity: 'Expirée le 01/11/2026',
        availabilityLabel: 'Période terminée',
        conditionsSummary: 'À dupliquer pour la saison Printemps',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'hotel-djerba-automne-2026',
      metaTitle: 'Easy2Book — Promo Djerba Automne 2026',
      metaDescription: 'Offre expirée Djerba.',
      ogTitle: 'Djerba Automne',
      ogDescription: 'Offre saisonnière terminée.',
      canonicalPath: '/p/hotel-djerba-automne-2026',
      noIndex: true,
    },
    attribution: {
      acquisitionSource: 'Meta Ads',
      utmSource: 'facebook',
      utmMedium: 'paid_social',
      utmCampaign: 'djerba_automne',
      utmContent: 'promo_oct',
    },
    form: makeForm('fr', 'djerba-automne'),
    blocks: HOTEL_TUNISIE_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-voyage-dubai-archive',
    title: 'Dubai Shopping Festival (Archivée)',
    universe: 'voyages',
    templateId: 'tpl-voyage-citybreak',
    language: 'en',
    isDemoData: true,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z',
    publication: {
      status: 'archived',
    },
    offerRef: {
      externalOfferId: 'CAT-VOY-DXB-2026',
      externalSourceName: 'Catalogue Voyages Easy2Book (Référence externe)',
      universe: 'voyages',
      offerCode: 'VOY-DXB-26',
      displayLabel: 'Dubai City Break 6 Days / 5 Nights',
      cachedSummary: {
        startingPriceLabel: 'From 3,250 DT',
        datesOrValidity: 'Archived 2026 Season',
        availabilityLabel: 'Archivée',
        conditionsSummary: 'Peut être dupliquée pour 2027',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'voyage-dubai-archive-2026',
      metaTitle: 'Easy2Book — Dubai City Break',
      metaDescription: 'Archived seasonal travel landing page.',
      ogTitle: 'Dubai City Break — Easy2Book',
      ogDescription: '6 Days / 5 Nights from Tunis.',
      canonicalPath: '/p/voyage-dubai-archive-2026',
      noIndex: true,
    },
    attribution: {
      acquisitionSource: 'Instagram',
      utmSource: 'instagram',
      utmMedium: 'stories',
      utmCampaign: 'dubai_2026',
      utmContent: 'archive',
    },
    form: makeForm('en', 'dubai-archive'),
    blocks: VOYAGE_ISTANBUL_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-excursions-egypte-easy2book',
    title: 'Easy2Book — رحلات يومية مصر (أفراد وجروبات · 98 140 514)',
    universe: 'voyages',
    folderGroup: 'Excursions Égypte',
    isPilotPage: true,
    pilotRenderer: 'egypt_excursions_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'مركز الحجوزات',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'touristique',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-eg-1', label: 'الرحلات', target: '#offres' },
        { id: 'nav-eg-2', label: 'معرض الصور', target: '#galerie' },
        { id: 'nav-eg-3', label: 'الأهرامات', target: '#pyramides' },
        { id: 'nav-eg-4', label: 'القاهرة الإسلامية', target: '#caire-islamique' },
        { id: 'nav-eg-5', label: 'احجز الآن', target: '#form-block' },
      ],
      ctaLabel: 'احجز الآن · 98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'واتساب 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription:
        'Easy2Book — مركز الحجوزات. رحلات يومية في مصر للأفراد والمجموعات مع توصيل خاص، مرشد سياحي وتذاكر الدخول شاملة.',
      navLinks: [
        { id: 'ft-eg-1', label: 'الرحلات الـ 6', target: '#offres' },
        { id: 'ft-eg-2', label: 'معرض الصور', target: '#galerie' },
        { id: 'ft-eg-3', label: 'طلب عرض سعر', target: '#form-block' },
      ],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'تونس · مركز الحجوزات Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · مركز الحجوزات · 98 140 514',
    },
    commerceModules: ['excursions', 'transfers', 'voyages'],
    templateId: 'tpl-voyage-excursions-egypte',
    language: 'ar',
    isDemoData: true,
    createdAt: '2026-11-14T14:00:00Z',
    updatedAt: '2026-11-14T14:20:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-14T14:20:00Z',
      publishedBy: 'فريق استوديو Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-EXC-EGY-2026',
      externalSourceName: 'دليل رحلات Easy2Book',
      universe: 'voyages',
      offerCode: 'EGY-EXC-06',
      displayLabel: 'رحلات يومية مصر · Easy2Book (98 140 514)',
      cachedSummary: {
        startingPriceLabel: 'توصيل المطار 175 د.ت · الرحلات ابتداءً من 225 د.ت',
        datesOrValidity: 'رحلات يومية على مدار السنة',
        availabilityLabel: 'أفراد ومجموعات (من 1 إلى 10 أشخاص)',
        conditionsSummary: 'حجوزات Easy2Book المباشرة · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'excursions-egypte-easy2book',
      metaTitle: 'Easy2Book — رحلات يومية مصر · القاهرة والأهرامات (98 140 514)',
      metaDescription:
        'توصيل المطار، سهرة نايل كروز، المتحف المصري الكبير والأهرامات، سيتي تور، القاهرة الإسلامية وسهرة ألحان مع Easy2Book (98 140 514).',
      ogTitle: 'رحلات يومية مصر — Easy2Book · 98 140 514',
      ogDescription: 'للأفراد والمجموعات من 1 إلى 10 أشخاص ابتداءً من 175 د.ت مع فيديو تعريفي وصور احترافية.',
      canonicalPath: '/p/excursions-egypte-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'عرض Easy2Book المباشر',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'excursions_egypte_ar_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('ar', 'excursions-egypte'),
    blocks: EGYPT_EXCURSIONS_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-excursions-turquie-easy2book',
    title: 'Easy2Book — رحلات تركيا اليومية (إسطنبول، البسفور وأنطاليا · 98 140 514)',
    universe: 'voyages',
    folderGroup: 'Excursions Turquie',
    isPilotPage: true,
    pilotRenderer: 'turkey_excursions_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'مركز الحجوزات',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'touristique',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-tr-1', label: 'الرحلات اليومية', target: '#offres' },
        { id: 'nav-tr-2', label: 'البسفور وجزر الأميرات', target: '#croisieres' },
        { id: 'nav-tr-3', label: 'فيالاند والتوصيل', target: '#transferts' },
        { id: 'nav-tr-4', label: 'معرض الصور', target: '#galerie' },
        { id: 'nav-tr-5', label: 'احجز الآن', target: '#form-block' },
      ],
      ctaLabel: 'احجز الآن · 98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'واتساب 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription:
        'Easy2Book — مركز الحجوزات. رحلات يومية في تركيا، جزر الأميرات، سهرات البسفور، باقة أنطاليا وتوصيل مطار إسطنبول وصبيحة الخاص.',
      navLinks: [
        { id: 'ft-tr-1', label: 'الرحلات اليومية', target: '#offres' },
        { id: 'ft-tr-2', label: 'البسفور وجزر الأميرات', target: '#croisieres' },
        { id: 'ft-tr-3', label: 'توصيل المطار', target: '#transferts' },
      ],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'تونس · مركز الحجوزات Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · مركز الحجوزات · 98 140 514',
    },
    commerceModules: ['excursions', 'transfers', 'cruises', 'voyages'],
    templateId: 'tpl-voyage-excursions-turquie',
    language: 'ar',
    isDemoData: true,
    createdAt: '2026-11-14T14:30:00Z',
    updatedAt: '2026-11-14T14:35:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-14T14:35:00Z',
      publishedBy: 'فريق استوديو Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-EXC-TRK-2026',
      externalSourceName: 'دليل رحلات Easy2Book',
      universe: 'voyages',
      offerCode: 'TRK-EXC-2026',
      displayLabel: 'رحلات تركيا اليومية · Easy2Book (98 140 514)',
      cachedSummary: {
        startingPriceLabel: 'الرحلات اليومية ابتداءً من 65 د.ت · السهرات من 105 د.ت · أنطاليا 1,125 د.ت',
        datesOrValidity: 'رحلات يومية ابتداءً من 01.10.2026',
        availabilityLabel: 'أفراد، عائلات وثنائيات (إسطنبول، صبنجا، بورصا وأنطاليا)',
        conditionsSummary: 'حجوزات Easy2Book المباشرة · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'excursions-turquie-easy2book',
      metaTitle: 'Easy2Book — رحلات تركيا اليومية · إسطنبول، صبنجا والبسفور (98 140 514)',
      metaDescription:
        'صبنجا ومعشوقية، إزميت، بورصا، شيلا وأغوا، سفن جزر الأميرات، سهرات البسفور، فيالاند، باقة أنطاليا وتوصيل مطار إسطنبول وصبيحة مع Easy2Book (98 140 514).',
      ogTitle: 'رحلات تركيا اليومية — Easy2Book · 98 140 514',
      ogDescription: 'ابتداءً من 65 د.ت للرحلات اليومية مع فيديو تعريفي وصور احترافية وحجز مباشر عبر واتساب.',
      canonicalPath: '/p/excursions-turquie-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'عرض Easy2Book المباشر',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'excursions_turquie_ar_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('ar', 'excursions-turquie'),
    blocks: TURKEY_EXCURSIONS_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visas-services-easy2book',
    title: 'Easy2Book — خدمات الفيزا و E-Visa الشاملة (مصر، شنغن، دبي، قطر والدولية · 98 140 514)',
    universe: 'visa',
    folderGroup: 'Visas & E-Visa',
    isPilotPage: true,
    pilotRenderer: 'visa_services_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'مركز الحجوزات والتأشيرات',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-vs-1', label: 'التأشيرات والملفات', target: '#offres' },
        { id: 'nav-vs-2', label: 'الخليج والعمرة', target: '#golfe' },
        { id: 'nav-vs-3', label: 'الدولية و E-Visa', target: '#international' },
        { id: 'nav-vs-4', label: 'معرض الصور', target: '#galerie' },
        { id: 'nav-vs-5', label: 'أودع ملفك', target: '#form-block' },
      ],
      ctaLabel: 'أودع ملفك · 98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'واتساب 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription:
        'Easy2Book — مركز الحجوزات والتأشيرات. خدمات إصدار فيزا مصر، شنغن، دبي، قطر، عُمان، العمرة، الصين، ألبانيا، تايلاند، كندا وأمريكا وبريطانيا وأستراليا و 53 وجهة E-Visa.',
      navLinks: [
        { id: 'ft-vs-1', label: 'مصر وشنغن', target: '#offres' },
        { id: 'ft-vs-2', label: 'دبي وقطر وعُمان', target: '#golfe' },
        { id: 'ft-vs-3', label: '53 دولة E-Visa', target: '#international' },
      ],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'تونس · مركز الحجوزات Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · مركز الحجوزات · 98 140 514',
    },
    commerceModules: ['visa', 'travel_insurance', 'vip_concierge'],
    templateId: 'tpl-visa-catalogue-easy2book',
    language: 'ar',
    isDemoData: true,
    createdAt: '2026-11-14T15:00:00Z',
    updatedAt: '2026-11-14T15:05:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-14T15:05:00Z',
      publishedBy: 'فريق استوديو Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-E2B-2026',
      externalSourceName: 'دليل التأشيرات Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-E2B-2026',
      displayLabel: 'خدمات الفيزا و E-Visa · Easy2Book (98 140 514)',
      cachedSummary: {
        startingPriceLabel: 'فيزا مصر 90 د.ت · تايلاند 130 د.ت · شنغن من 180 د.ت · دبي من 350 د.ت',
        datesOrValidity: 'تعريفة محيّنة · نوفمبر 2026',
        availabilityLabel: '33 خدمة تأشيرة + 53 وجهة E-Visa حسب الطلب',
        conditionsSummary: 'إيداع ومتابعة Easy2Book المباشرة · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visas-services-easy2book',
      metaTitle: 'Easy2Book — خدمات الفيزا و E-Visa · مصر، شنغن، دبي، قطر والدولية (98 140 514)',
      metaDescription:
        'فيزا مصر في 4 ساعات، مواعيد شنغن، دبي، قطر، عُمان، العمرة، الصين، ألبانيا، تايلاند، كندا وأمريكا وبريطانيا وأستراليا و 53 دولة E-Visa مع Easy2Book.',
      ogTitle: 'خدمات الفيزا و E-Visa — Easy2Book · 98 140 514',
      ogDescription: 'ابتداءً من 90 د.ت مع فيديو تعريفي، حاسبة وثائق، تصدير PDF وحجز مباشر عبر واتساب.',
      canonicalPath: '/p/visas-services-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'عرض Easy2Book المباشر',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'visa_services_ar_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('ar', 'visas-services'),
    blocks: VISA_SERVICES_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-egypte-easy2book',
    title: 'Easy2Book — فيزا وضمان مصر (4 ساعات · 90 / 150 / 350 / 300 د.ت · فيديو 9:16)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'مركز التأشيرات والحجوزات',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Cairo',
      bodyFont: 'Cairo',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-veg-1', label: 'التعريفات الرسمية', target: '#tarifs' },
        { id: 'nav-veg-2', label: 'الوثائق المطلوبة', target: '#visa-documents' },
        { id: 'nav-veg-3', label: 'تقديم الطلب', target: '#form-block' },
      ],
      ctaLabel: 'أودع ملفك · 98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'واتساب 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription:
        'Easy2Book — فيزا وضمان مصر : رسالة انطلاق من تونس 90 د.ت، من دولة أخرى 150 د.ت، ونزول شرم الشيخ / الإسكندرية / الغردقة 350 د.ت (300 د.ت ابتداءً من شخصين). الوثائق المطلوبة: نسخة من جواز السفر + تذكرة الطائرة.',
      navLinks: [
        { id: 'ft-veg-1', label: 'تعريفات فيزا مصر', target: '#tarifs' },
        { id: 'ft-veg-2', label: 'الوثائق المطلوبة', target: '#visa-documents' },
      ],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'تونس · المركز الرئيسي Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · مركز الحجوزات والتأشيرات · 98 140 514',
    },
    commerceModules: ['visa', 'travel_insurance'],
    templateId: 'tpl-visa-egypte-easy2book',
    language: 'ar',
    isDemoData: true,
    createdAt: '2026-11-15T09:00:00Z',
    updatedAt: '2026-11-16T14:15:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-16T14:15:00Z',
      publishedBy: 'فريق استوديو Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-EGY-2026',
      externalSourceName: 'دليل التأشيرات Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-EGY-2026',
      displayLabel: 'فيزا وضمان مصر • التعريفات الرسمية (إصدار في 4 ساعات)',
      cachedSummary: {
        startingPriceLabel: 'ابتداءً من 90 د.ت (الأجل : 4 ساعات)',
        datesOrValidity: 'معالجة سريعة طوال السنة',
        availabilityLabel: 'تونس 90 د.ت · دولة أخرى 150 د.ت · شرم/الإسكندرية/الغردقة 350 / 300 د.ت',
        conditionsSummary: 'الوثائق المطلوبة : نسخة من جواز السفر + تذكرة الطائرة',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-egypte-easy2book',
      metaTitle: 'Easy2Book — فيزا وضمان مصر (90 / 150 / 350 / 300 د.ت) وفيديو 9:16',
      metaDescription:
        'فيزا مصر وضمان السفر انطلاقاً من تونس 90 د.ت، من دولة أخرى 150 د.ت، ونزول شرم الشيخ/الإسكندرية/الغردقة 350 د.ت (300 د.ت ابتداءً من شخصين). الوثائق: نسخة جواز السفر + تذكرة الطائرة.',
      ogTitle: 'فيزا وضمان مصر — Easy2Book (98 140 514)',
      ogDescription: 'ابتداءً من 90 د.ت خلال 4 ساعات مع فيديو 9:16 بالصوت التونسي وبروشور PDF.',
      canonicalPath: '/p/visa-egypte-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'عرض Easy2Book المباشر',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'visa_egypte_ar_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('ar', 'visa-egypte'),
    blocks: VISA_EGYPTE_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-dubai-easy2book',
    title: 'Easy2Book — Visa Dubaï & Émirats (330–6 830 DT · Express 48–72h · Vidéo 9:16)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'Centrale Visas & Réservations',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-dxb-1', label: 'Tarifs Dubaï', target: '#tarifs' },
        { id: 'nav-dxb-2', label: 'Documents', target: '#visa-documents' },
        { id: 'nav-dxb-3', label: 'Déposer', target: '#form-block' },
      ],
      ctaLabel: '98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription: 'Easy2Book — Visa Dubaï & Émirats : touristique avec/sans garantie, Express +60 DT & Résidence 2 ans ID inclus.',
      navLinks: [{ id: 'ft-dxb-1', label: 'Tarifs Dubaï', target: '#tarifs' }],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · Centrale de Réservation · 98 140 514',
    },
    commerceModules: ['visa', 'travel_insurance'],
    templateId: 'tpl-visa-dubai-easy2book',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-15T09:15:00Z',
    updatedAt: '2026-11-15T09:20:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-15T09:20:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-DXB-2026',
      externalSourceName: 'Catalogue Visas Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-DXB-2026',
      displayLabel: 'Visa Dubaï & Émirats · Touristique, Express & Résidence 2 ans',
      cachedSummary: {
        startingPriceLabel: 'À partir de 330 DT (Résidence 2 ans 6 830 DT)',
        datesOrValidity: '2j à 1 sem. · Express 48–72h (+60 DT)',
        availabilityLabel: '10 formules Dubaï disponibles',
        conditionsSummary: 'Copie passeport + photo fond blanc · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-dubai-easy2book',
      metaTitle: 'Easy2Book — Visa Dubaï & Émirats (330–6 830 DT) & Vidéo 9:16',
      metaDescription: 'Touristique 1/2 mois avec ou sans garantie, enfant <12 ans, multi-entrée, prolongation & Résidence 2 ans ID inclus.',
      ogTitle: 'Visa Dubaï — Easy2Book · 98 140 514',
      ogDescription: 'À partir de 330 DT + option Express 48–72h.',
      canonicalPath: '/p/visa-dubai-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Offre Directe Easy2Book',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'visa_dubai_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('fr', 'visa-dubai'),
    blocks: VISA_DUBAI_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-qatar-easy2book',
    title: 'Easy2Book — Visa Qatar (Touristique 170 DT & Annuel sans ID · Vidéo 9:16)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'Centrale Visas & Réservations',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-qa-1', label: 'Tarifs Qatar', target: '#tarifs' },
        { id: 'nav-qa-2', label: 'Documents', target: '#visa-documents' },
        { id: 'nav-qa-3', label: 'Déposer', target: '#form-block' },
      ],
      ctaLabel: '98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription: 'Easy2Book — Visa Qatar : Touristique 1 mois (170 DT) & Annuel / Travail sans ID Qatar.',
      navLinks: [{ id: 'ft-qa-1', label: 'Tarifs Qatar', target: '#tarifs' }],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · Centrale de Réservation · 98 140 514',
    },
    commerceModules: ['visa'],
    templateId: 'tpl-visa-qatar-easy2book',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-15T09:25:00Z',
    updatedAt: '2026-11-15T09:30:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-15T09:30:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-QAT-2026',
      externalSourceName: 'Catalogue Visas Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-QAT-2026',
      displayLabel: 'Visa Qatar · Touristique 170 DT & Annuel sans ID Qatar',
      cachedSummary: {
        startingPriceLabel: 'À partir de 170 DT (Annuel 1 380 / 1 980 DT)',
        datesOrValidity: 'Service permanent',
        availabilityLabel: 'Touristique & Travail sans ID',
        conditionsSummary: '+ 1 650 QAR au Qatar pour l’annuel · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-qatar-easy2book',
      metaTitle: 'Easy2Book — Visa Qatar (170 DT · Annuel 1 380/1 980 DT) & Vidéo 9:16',
      metaDescription: 'Visa touristique Qatar 1 mois 170 DT et Visa Annuel/Travail sans ID Qatar.',
      ogTitle: 'Visa Qatar — Easy2Book · 98 140 514',
      ogDescription: 'À partir de 170 DT avec vidéo 9:16 et brochure PDF.',
      canonicalPath: '/p/visa-qatar-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Offre Directe Easy2Book',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'visa_qatar_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('fr', 'visa-qatar'),
    blocks: VISA_QATAR_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-oman-easy2book',
    title: 'Easy2Book — Visa Oman (230–9 530 DT · Séjour & Résidence 2 ans · Vidéo 9:16)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'Centrale Visas & Réservations',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-om-1', label: 'Tarifs Oman', target: '#tarifs' },
        { id: 'nav-om-2', label: 'Documents', target: '#visa-documents' },
        { id: 'nav-om-3', label: 'Déposer', target: '#form-block' },
      ],
      ctaLabel: '98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription: 'Easy2Book — Visa Sultanat d’Oman : 10 jours 230 DT, 1 mois 330/380 DT & Résidence 2 ans ID inclus.',
      navLinks: [{ id: 'ft-om-1', label: 'Tarifs Oman', target: '#tarifs' }],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · Centrale de Réservation · 98 140 514',
    },
    commerceModules: ['visa'],
    templateId: 'tpl-visa-oman-easy2book',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-15T09:35:00Z',
    updatedAt: '2026-11-15T09:40:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-15T09:40:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-OMN-2026',
      externalSourceName: 'Catalogue Visas Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-OMN-2026',
      displayLabel: 'Visa Oman · 10 jours, 1 mois & Résidence 2 ans ID inclus',
      cachedSummary: {
        startingPriceLabel: 'À partir de 230 DT (Résidence 7 530 / 9 530 DT)',
        datesOrValidity: '2j–7j touristique · 15–20j résidence',
        availabilityLabel: '5 formules Oman disponibles',
        conditionsSummary: 'Copie passeport + photo fond blanc · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-oman-easy2book',
      metaTitle: 'Easy2Book — Visa Oman (230 / 330 / 380 / 7 530 / 9 530 DT) & Vidéo 9:16',
      metaDescription: 'Visa Oman 10 jours 230 DT, 1 mois Homme/Femme et Résidence 2 ans ID inclus.',
      ogTitle: 'Visa Oman — Easy2Book · 98 140 514',
      ogDescription: 'À partir de 230 DT avec vidéo 9:16 et brochure PDF.',
      canonicalPath: '/p/visa-oman-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Offre Directe Easy2Book',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'visa_oman_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('fr', 'visa-oman'),
    blocks: VISA_OMAN_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-omra-easy2book',
    title: 'Easy2Book — Visa Omra Arabie Saoudite (820 DT + Saudi Bio · Vidéo 9:16)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'Centrale Visas & Réservations',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-omr-1', label: 'Tarif Visa Omra', target: '#tarifs' },
        { id: 'nav-omr-2', label: 'Documents & Saudi Bio', target: '#visa-documents' },
        { id: 'nav-omr-3', label: 'Déposer', target: '#form-block' },
      ],
      ctaLabel: '98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription: 'Easy2Book — Visa Omra électronique Arabie Saoudite (820 DT) avec contrôle code Saudi Bio.',
      navLinks: [{ id: 'ft-omr-1', label: 'Tarif Omra', target: '#tarifs' }],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · Centrale de Réservation · 98 140 514',
    },
    commerceModules: ['visa', 'omra'],
    templateId: 'tpl-visa-omra-easy2book',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-15T09:45:00Z',
    updatedAt: '2026-11-15T09:50:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-15T09:50:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-OMR-2026',
      externalSourceName: 'Catalogue Visas Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-OMR-2026',
      displayLabel: 'Visa Omra Arabie Saoudite · 820 DT + Saudi Bio',
      cachedSummary: {
        startingPriceLabel: '820 DT (Traitement complet)',
        datesOrValidity: 'Toute la saison Omra',
        availabilityLabel: 'Assistance Saudi Bio incluse',
        conditionsSummary: 'Passeport, photo, billet & code Saudi Bio · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-omra-easy2book',
      metaTitle: 'Easy2Book — Visa Omra Arabie Saoudite (820 DT) & Vidéo 9:16',
      metaDescription: 'Obtenez votre Visa Omra électronique à 820 DT avec assistance Saudi Bio.',
      ogTitle: 'Visa Omra — Easy2Book · 98 140 514',
      ogDescription: '820 DT avec vidéo 9:16 et brochure PDF.',
      canonicalPath: '/p/visa-omra-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Offre Directe Easy2Book',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'visa_omra_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('fr', 'visa-omra'),
    blocks: VISA_OMRA_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-international-easy2book',
    title: 'Easy2Book — Visa Chine & Internationaux (Canada, USA, UK, Australie · Vidéo 9:16)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'Centrale Visas & Réservations',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-int-1', label: 'Chine & Internationaux', target: '#tarifs' },
        { id: 'nav-int-2', label: 'Documents', target: '#visa-documents' },
        { id: 'nav-int-3', label: 'Déposer', target: '#form-block' },
      ],
      ctaLabel: '98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription: 'Easy2Book — Chine (1 830 / 3 030 DT), Canada (830 DT), USA (1 030 DT), Royaume-Uni (1 430 DT) & Australie (1 530 DT).',
      navLinks: [{ id: 'ft-int-1', label: 'Tarifs Internationaux', target: '#tarifs' }],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · Centrale de Réservation · 98 140 514',
    },
    commerceModules: ['visa', 'travel_insurance'],
    templateId: 'tpl-visa-international-easy2book',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-15T09:55:00Z',
    updatedAt: '2026-11-15T10:00:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-15T10:00:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-INT-2026',
      externalSourceName: 'Catalogue Visas Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-INT-2026',
      displayLabel: 'Chine & Dossiers Internationaux (Canada, USA, UK, Australie)',
      cachedSummary: {
        startingPriceLabel: 'À partir de 830 DT (RDV inclus)',
        datesOrValidity: 'Service permanent',
        availabilityLabel: 'Canada, USA, UK, Australie & Chine',
        conditionsSummary: 'Formulaires officiels & prise de RDV incluse · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-international-easy2book',
      metaTitle: 'Easy2Book — Visa Chine, Canada, USA, UK & Australie + Vidéo 9:16',
      metaDescription: 'Dossiers complets avec prise de RDV : Canada 830 DT, USA 1 030 DT, UK 1 430 DT, Australie 1 530 DT, Chine 1 830 / 3 030 DT.',
      ogTitle: 'Visas Chine & Internationaux — Easy2Book · 98 140 514',
      ogDescription: 'À partir de 830 DT avec vidéo 9:16 et brochure PDF.',
      canonicalPath: '/p/visa-international-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Offre Directe Easy2Book',
      utmSource: 'easy2book',
      utmMedium: 'catalogue',
      utmCampaign: 'visa_international_2026',
      utmContent: 'direct_98140514',
    },
    form: makeForm('fr', 'visa-international'),
    blocks: VISA_INTERNATIONAL_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-visa-evisa-easy2book',
    title: 'Easy2Book — Passeport Tunisien · E-Visa & Formalités Électroniques (Vidéo 42s)',
    universe: 'visa',
    folderGroup: 'Visas par Type',
    isPilotPage: true,
    pilotRenderer: 'visa_category_2026',
    creationMode: 'full_page',
    brandIdentity: {
      brandName: 'Easy2Book',
      tagline: 'Centrale Visas & Formalités Électroniques',
      logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
      isProvisionalLogo: false,
      primaryColor: '#102D45',
      secondaryColor: '#1C4967',
      accentColor: '#E7B34C',
      ctaColor: '#E7B34C',
      ctaTextColor: '#102D45',
      surfaceColor: '#FFFFFF',
      textColor: '#102D45',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      imageStyle: 'rounded',
      cardShape: 'soft',
      iconStyle: 'duotone',
      spacingScale: 'balanced',
      visualStyle: 'moderne',
    },
    header: {
      enabled: true,
      variant: 'corporate',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-ev-1', label: 'Scénario 42s', target: '#evisa-storyboard' },
        { id: 'nav-ev-2', label: 'Tarifs E-Visa', target: '#tarifs' },
        { id: 'nav-ev-3', label: 'Demander', target: '#form-block' },
      ],
      ctaLabel: '98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription:
        'Easy2Book — Des destinations accessibles avec des formalités électroniques (E-Visa) pour passeport tunisien. Les conditions varient selon le pays et la décision finale relève des autorités concernées.',
      navLinks: [{ id: 'ft-ev-1', label: 'Tarifs E-Visa', target: '#tarifs' }],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · خطوتك الأولى نحو العالم · 98 140 514',
    },
    commerceModules: ['visa'],
    templateId: 'tpl-visa-evisa-easy2book',
    language: 'ar',
    isDemoData: true,
    createdAt: '2026-11-15T10:05:00Z',
    updatedAt: '2026-11-20T05:10:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-20T05:10:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-VISA-EVS-2026',
      externalSourceName: 'Catalogue Visas Easy2Book',
      universe: 'visa',
      offerCode: 'VISA-EVS-2026',
      displayLabel: 'Des destinations accessibles avec des formalités électroniques (E-Visa)',
      cachedSummary: {
        startingPriceLabel: 'Thaïlande 130 DT · Albanie 380 DT · +50 E-Visa',
        datesOrValidity: 'Accompagnement E-Visa en ligne · 42 s',
        availabilityLabel: 'Afrique, Asie, Europe & Amériques sur demande',
        conditionsSummary: 'Décision finale des autorités du pays concerné · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-evisa-easy2book',
      metaTitle: 'Easy2Book — Passeport Tunisien & E-Visa · Formalités Électroniques (Vidéo 42s)',
      metaDescription:
        'Des destinations accessibles avec des formalités électroniques (Rwanda, Tanzanie, Cameroun, Qatar, Bahreïn, Vietnam, Ouzbékistan, Albanie, Colombie, Bahamas). Vidéo 9:16 voix tunisienne 42s.',
      ogTitle: 'Passeport Tunisien · E-Visa en ligne — Easy2Book · 98 140 514',
      ogDescription: 'Vidéo 42s en dialecte tunisien, découpage 5 séquences et accompagnement E-Visa.',
      canonicalPath: '/p/visa-evisa-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Campagne Reels E-Visa Easy2Book',
      utmSource: 'easy2book',
      utmMedium: 'reels_tiktok',
      utmCampaign: 'visa_evisa_passeport_tn_2026',
      utmContent: 'voix_tunisienne_42s',
    },
    form: makeForm('ar', 'visa-evisa'),
    blocks: VISA_EVISA_BLOCKS,
  }),

  buildDemoPage({
    id: 'page-billetterie-avion-bateau-easy2book',
    title: "Easy2Book — Billet d'Avion & Bateau (Vidéo Promo 30s · 3 Clics)",
    universe: 'voyages',
    folderGroup: 'Billetterie Avion & Bateau',
    isPilotPage: true,
    pilotRenderer: 'flights_ferries_2026',
    creationMode: 'full_page',
    brandIdentity: {
      ...createDefaultBrandIdentity({
        brandName: 'Easy2Book',
        tagline: 'The easiest way to travel · Avion & Bateau',
        logoSrc: '/assets/aistudio/logo_transparent_e9918557.png',
        visualStyle: 'premium',
      }),
    },
    header: {
      enabled: true,
      variant: 'premium',
      sticky: true,
      showLogo: true,
      showBrandName: true,
      navLinks: [
        { id: 'nav-ff-1', label: 'Vidéo 30s', target: '#video-promo' },
        { id: 'nav-ff-2', label: 'Scénario & Conseils', target: '#scenario-tournage' },
        { id: 'nav-ff-3', label: 'Avion & Bateau', target: '#configurateur' },
        { id: 'nav-ff-4', label: 'Réserver', target: '#form-block' },
      ],
      ctaLabel: 'Réserve sur Easy2Book · 98 140 514',
      ctaTarget: '#form-block',
      showWhatsapp: true,
      whatsappNumber: '98 140 514',
      whatsappLabel: 'WhatsApp 98 140 514',
    },
    footer: {
      enabled: true,
      showLogo: true,
      companyDescription:
        "Easy2Book — Billetterie Avion & Bateaux : toutes les compagnies aériennes et traversées Méditerranée (Tunisie–France/Italie, îles) au même endroit, sans frais surprises, ton e-billet en 3 clics.",
      navLinks: [
        { id: 'ft-ff-1', label: 'Vidéo 30s (9:16)', target: '#video-promo' },
        { id: 'ft-ff-2', label: 'Scénario & Tournage', target: '#scenario-tournage' },
        { id: 'ft-ff-3', label: 'Comparateur Avion & Bateau', target: '#configurateur' },
      ],
      phone: '98 140 514',
      whatsapp: '98 140 514',
      email: 'contact@easy2book.tn',
      address: 'Tunisie · Centrale Billetterie Avion & Maritime Easy2Book',
      socialLinks: {},
      legalLinks: {},
      copyrightText: '© 2026 Easy2Book · The easiest way to travel · 98 140 514',
    },
    commerceModules: ['flights', 'ferries'],
    templateId: 'tpl-billetterie-avion-bateau-easy2book',
    language: 'fr',
    isDemoData: true,
    createdAt: '2026-11-17T10:00:00Z',
    updatedAt: '2026-11-17T10:30:00Z',
    publication: {
      status: 'published',
      publishedAt: '2026-11-17T10:30:00Z',
      publishedBy: 'Équipe Studio Easy2Book',
    },
    offerRef: {
      externalOfferId: 'CAT-BILLETTERIE-2026',
      externalSourceName: 'Centrale Billetterie Avion & Bateau Easy2Book',
      universe: 'voyages',
      offerCode: 'FF-3CLICS-2026',
      displayLabel: 'Avion ✈️ & Bateau ⛴️ · Toutes compagnies au même endroit (3 clics)',
      cachedSummary: {
        startingPriceLabel: 'Comparatif temps réel · 0 frais surprises · Tarif sur devis',
        datesOrValidity: 'Vols express & traversées été / toute l’année',
        availabilityLabel: 'Tunisie–France/Italie, îles & vols internationaux',
        conditionsSummary: 'E-billet directement dans ton téléphone · 98 140 514',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'billetterie-avion-bateau-easy2book',
      metaTitle: "Easy2Book — Billet d'Avion & Bateau en 3 clics (Vidéo Promo 30s · 9:16)",
      metaDescription:
        "STOP aux 15 onglets ouverts ! Comparez toutes les compagnies aériennes et maritimes (Tunisie-France/Italie, îles) au même endroit sur Easy2Book. Pas de frais surprises, e-billet sur téléphone.",
      ogTitle: "Avion ✈️ ou Bateau ⛴️ ? Ton billet en 3 clics — Easy2Book · 98 140 514",
      ogDescription:
        'Vidéo promotionnelle 30s 9:16, scénario & conseils de tournage, comparateur Avion/Bateau et export MP4/PDF.',
      canonicalPath: '/p/billetterie-avion-bateau-easy2book',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Campagne Reels/TikTok Billetterie Easy2Book',
      utmSource: 'easy2book',
      utmMedium: 'reels_tiktok',
      utmCampaign: 'avion_bateau_3clics_2026',
      utmContent: 'promo_30s_98140514',
    },
    form: makeForm('fr', 'billetterie-avion-bateau'),
    blocks: FLIGHTS_FERRIES_BLOCKS,
  }),
];

export const DEMO_NOTIFICATIONS: CreatorNotification[] = [
  {
    id: 'notif-1',
    title: 'Page programmée bientôt active',
    detail: '« Omra Vacances Scolaires Décembre » passera en publication le 18/11.',
    timeLabel: 'Il y a 18 min',
    kind: 'scheduled',
    pageId: 'page-omra-vacances-dec-2026',
  },
  {
    id: 'notif-2',
    title: 'Expiration prochaine détectée',
    detail: '« عمرة رمضان 2027 » expire le 15/12/2026 (compte à rebours actif).',
    timeLabel: 'Il y a 2 h',
    kind: 'expiry',
    pageId: 'page-omra-ramadan-2027',
  },
  {
    id: 'notif-3',
    title: 'Sauvegarde automatique active',
    detail: 'Vos modifications dans l’éditeur sont enregistrées localement et sur le serveur Studio.',
    timeLabel: 'Aujourd’hui',
    kind: 'autosave',
  },
];

export const DEFAULT_CREATOR_SETTINGS: CreatorSettings = {
  defaultLanguage: 'fr',
  defaultWhatsappNumber: '98 140 514',
  defaultVoiceId: 'Charon',
  autoSaveEnabled: true,
  crmIntegration: {
    endpointUrl: 'https://crm.easy2book.tn/api/integrations/landing-leads',
    mode: 'simulated_adapter',
    timeoutMs: 8000,
    includeUtmAttribution: true,
  },
};

export function createInitialCreatorState(): CreatorState {
  return {
    pages: JSON.parse(JSON.stringify(DEMO_PAGES)) as Page[],
    templates: JSON.parse(JSON.stringify(DEMO_TEMPLATES)) as PageTemplate[],
    media: JSON.parse(JSON.stringify(DEMO_MEDIA_ASSETS)) as MediaAsset[],
    notifications: JSON.parse(JSON.stringify(DEMO_NOTIFICATIONS)) as CreatorNotification[],
    settings: JSON.parse(JSON.stringify(DEFAULT_CREATOR_SETTINGS)) as CreatorSettings,
  };
}
