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
    id: 'media-voyage-istanbul',
    title: 'Istanbul & Bosphore — Coucher de soleil',
    universe: 'voyages',
    src: HERO_MEDIA_MAP.voyage_istanbul.src,
    aspectRatio: '16:9',
    tags: ['istanbul', 'turquie', 'circuit', 'voyage'],
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
    id: 'media-visa-desk',
    title: 'Accompagnement Visa & Dossiers Consulaires',
    universe: 'visa',
    src: HERO_MEDIA_MAP.visa_desk.src,
    aspectRatio: '16:9',
    tags: ['visa', 'schengen', 'canada', 'conseil'],
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

export const DEMO_TEMPLATES: PageTemplate[] = [
  {
    id: 'tpl-omra-video-rtl',
    name: 'Omra Signature · Vidéo 9:16 + Tarifs Chambres',
    universe: 'omra',
    description: 'Modèle haute conversion RTL/FR avec lecteur vidéo 9:16, tarifs par chambre et témoignages.',
    styleTag: 'Vidéo 9:16 · Conversion',
    supportedLanguages: ['ar', 'fr', 'en'],
    defaultLanguage: 'ar',
    previewImageKey: 'makkah_haram',
    defaultBlocks: OMRA_RAMADAN_BLOCKS,
    defaultForm: makeForm('ar', 'omra-ramadan'),
  },
  {
    id: 'tpl-omra-classic',
    name: 'Omra Départ Saisonnier · Hôtels & Programme',
    universe: 'omra',
    description: 'Modèle structuré pour vacances scolaires, Mouled ou départs économiques.',
    styleTag: 'Éditorial · Départs',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'madinah_twilight',
    defaultBlocks: OMRA_RAMADAN_BLOCKS.slice(1),
    defaultForm: makeForm('fr', 'omra-classic'),
  },
  {
    id: 'tpl-voyage-circuit',
    name: 'Voyage Organisé · Itinéraire Jour par Jour',
    universe: 'voyages',
    description: 'Page circuit avec hero immersif, déroulé jour par jour, inclusions et tarifs.',
    styleTag: 'Circuit · Groupes',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'voyage_istanbul',
    defaultBlocks: VOYAGE_ISTANBUL_BLOCKS,
    defaultForm: makeForm('fr', 'voyage-circuit'),
  },
  {
    id: 'tpl-voyage-citybreak',
    name: 'Escapade & City Break · Offre Express',
    universe: 'voyages',
    description: 'Format court idéal pour campagnes Meta Ads Dubaï, Le Caire ou Europe.',
    styleTag: 'Compact · Meta Ads',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'tunis_flight',
    defaultBlocks: VOYAGE_ISTANBUL_BLOCKS,
    defaultForm: makeForm('fr', 'city-break'),
  },
  {
    id: 'tpl-hotel-promo',
    name: 'Hôtel Tunisie · Promo Saison & Formules',
    universe: 'hotels_tunisie',
    description: 'Fiche établissement, équipements, périodes de promo et tarifs All-In / DP.',
    styleTag: 'Resort · Promo',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'tunisia_resort',
    defaultBlocks: HOTEL_TUNISIE_BLOCKS,
    defaultForm: makeForm('fr', 'hotel-promo'),
  },
  {
    id: 'tpl-hotel-thalasso',
    name: 'Hôtel Thalasso & Bien-être · Week-end',
    universe: 'hotels_tunisie',
    description: 'Mise en avant cure spa, week-ends couples et réductions longs séjours.',
    styleTag: 'Thalasso · Bien-être',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr',
    previewImageKey: 'tunisia_resort',
    defaultBlocks: HOTEL_TUNISIE_BLOCKS,
    defaultForm: makeForm('fr', 'hotel-thalasso'),
  },
  {
    id: 'tpl-visa-schengen',
    name: 'Service Visa · Checklist & Étapes Officielles',
    universe: 'visa',
    description: 'Présentation claire des pays couverts, pièces requises et parcours administratif.',
    styleTag: 'Consulaire · Confiance',
    supportedLanguages: ['fr', 'ar', 'en'],
    defaultLanguage: 'fr',
    previewImageKey: 'visa_desk',
    defaultBlocks: VISA_FRANCE_BLOCKS,
    defaultForm: makeForm('fr', 'visa-schengen'),
  },
  {
    id: 'tpl-visa-multi',
    name: 'Assistance Visa Multi-Destinations (Études / Travail)',
    universe: 'visa',
    description: 'Modèle dédié aux dossiers longs séjours, visa études Canada / Europe et FAQ.',
    styleTag: 'Long séjour · FAQ',
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
