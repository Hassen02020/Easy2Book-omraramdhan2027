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
];

function makeInitialVersions(page: Omit<Page, 'versions' | 'publishedVersion'>, published: boolean): {
  versions: PageVersion[];
  publishedVersion: PageVersion | null;
} {
  const snapshot = {
    blocks: JSON.parse(JSON.stringify(page.blocks)) as PageBlock[],
    form: JSON.parse(JSON.stringify(page.form)) as FormDefinition,
    seo: { ...page.seo },
    attribution: { ...page.attribution },
    offerRef: JSON.parse(JSON.stringify(page.offerRef)) as OfferReference,
    language: page.language,
    title: page.title,
    folderGroup: page.folderGroup,
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
    title: 'Service Visa Schengen — France',
    universe: 'visa',
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
      offerCode: 'VIS-FR-CS',
      displayLabel: 'Assistance Dossier Visa Court Séjour France',
      cachedSummary: {
        startingPriceLabel: 'Pack Accompagnement sur devis',
        datesOrValidity: 'Service permanent toute l’année',
        availabilityLabel: 'Créneaux conseil ouverts',
        conditionsSummary: 'Sans exposition de données personnelles',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: 'visa-schengen-france-accompagnement',
      metaTitle: 'Easy2Book — Accompagnement Visa Schengen France',
      metaDescription: 'Checklist officielle des pièces, prise de RDV et préparation complète de votre dossier visa.',
      ogTitle: 'Assistance Visa France — Easy2Book',
      ogDescription: 'Accompagnement administratif complet en Tunisie.',
      canonicalPath: '/p/visa-schengen-france-accompagnement',
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'SEO Organique',
      utmSource: 'organic',
      utmMedium: 'search',
      utmCampaign: 'visa_france_2026',
      utmContent: 'landing_checklist',
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
