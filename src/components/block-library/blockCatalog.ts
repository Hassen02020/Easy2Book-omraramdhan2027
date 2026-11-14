import type {
  BlockCategory,
  BlockType,
  CreatorLanguage,
  PageBlock,
} from '../../types/creator';

export interface BlockCatalogEntry {
  type: BlockType;
  category: BlockCategory;
  labels: Record<CreatorLanguage, string>;
  description: Record<CreatorLanguage, string>;
}

export const BLOCK_CATALOG: BlockCatalogEntry[] = [
  // === 15 BLOCS COMMUNS ===
  {
    type: 'hero_image',
    category: 'common',
    labels: { fr: 'Hero avec image', en: 'Image Hero', ar: 'واجهة بصورة' },
    description: {
      fr: 'Bannière principale plein impact avec image, titre, sous-titre et CTA.',
      en: 'High-impact hero banner with image, headline, copy and CTA.',
      ar: 'مقطع رئيسي بصورة جذابة وعنوان وزر إجراء.',
    },
  },
  {
    type: 'hero_video',
    category: 'common',
    labels: { fr: 'Hero avec vidéo', en: 'Video Hero', ar: 'واجهة بفيديو 9:16' },
    description: {
      fr: 'Lecteur vidéo vertical 9:16 avec narration audio et sous-titres synchronisés.',
      en: 'Vertical 9:16 commercial reel player with voiceover and captions.',
      ar: 'مشغل فيديو عمودي 9:16 مع تعليق صوتي وترجمة متزامنة.',
    },
  },
  {
    type: 'presentation',
    category: 'common',
    labels: { fr: 'Présentation', en: 'Presentation', ar: 'تقديم العرض' },
    description: {
      fr: 'Section éditoriale présentant la promesse et les points forts de l’offre.',
      en: 'Editorial overview highlighting the offer value proposition.',
      ar: 'قسم تعريفي يوضح مزايا العرض وتفاصيله الأساسية.',
    },
  },
  {
    type: 'gallery',
    category: 'common',
    labels: { fr: 'Galerie photos', en: 'Photo Gallery', ar: 'معرض الصور' },
    description: {
      fr: 'Grille visuelle multi-images issue de la médiathèque.',
      en: 'Responsive multi-image showcase sourced from Media Library.',
      ar: 'معرض صور متعدد من مكتبة الوسائط.',
    },
  },
  {
    type: 'benefits',
    category: 'common',
    labels: { fr: 'Avantages', en: 'Key Benefits', ar: 'المزايا الرئيسية' },
    description: {
      fr: 'Points de réassurance et bénéfices concrets pour le voyageur.',
      en: 'Key trust pillars and tangible traveler advantages.',
      ar: 'أبرز نقاط القوة والضمانات للمسافر.',
    },
  },
  {
    type: 'services',
    category: 'common',
    labels: { fr: 'Services', en: 'Services', ar: 'الخدمات المشمولة' },
    description: {
      fr: 'Liste structurée des services administratifs et logistiques inclus.',
      en: 'Structured breakdown of included travel and advisory services.',
      ar: 'قائمة منظمة للخدمات المرافقة واللوجستية.',
    },
  },
  {
    type: 'pricing',
    category: 'common',
    labels: { fr: 'Tarifs', en: 'Pricing Table', ar: 'جدول الأسعار' },
    description: {
      fr: 'Grille tarifaire claire liée à l’offre référencée.',
      en: 'Clear pricing cards aligned with the referenced offer.',
      ar: 'بطاقات أسعار واضحة مرتبطة بالعرض الخارجي.',
    },
  },
  {
    type: 'product_cards',
    category: 'common',
    labels: { fr: 'Cartes produits', en: 'Product Cards', ar: 'بطاقات العروض' },
    description: {
      fr: 'Comparatif de variantes, options ou surclassements disponibles.',
      en: 'Comparison cards for variants, options or upgrades.',
      ar: 'بطاقات مقارنة للخيارات والباقات المتوفرة.',
    },
  },
  {
    type: 'testimonials',
    category: 'common',
    labels: { fr: 'Témoignages', en: 'Testimonials', ar: 'شهادات العملاء' },
    description: {
      fr: 'Avis vérifiés de voyageurs précédents avec note et contexte.',
      en: 'Traveler testimonials with rating and trip context.',
      ar: 'آراء وتقييمات مسافرين سابقين لتوطيد الثقة.',
    },
  },
  {
    type: 'faq',
    category: 'common',
    labels: { fr: 'FAQ', en: 'FAQ', ar: 'الأسئلة الشائعة' },
    description: {
      fr: 'Questions fréquentes et réponses rassurantes avant demande.',
      en: 'Frequently asked questions addressing common objections.',
      ar: 'إجابات واضحة عن الأسئلة المتكررة.',
    },
  },
  {
    type: 'countdown',
    category: 'common',
    labels: { fr: 'Compte à rebours', en: 'Countdown Timer', ar: 'العد التنازلي' },
    description: {
      fr: 'Compte à rebours vers la date limite ou la date de départ.',
      en: 'Live countdown toward offer deadline or departure date.',
      ar: 'عداد تنازلي مباشر لانتهاء صلاحية العرض أو موعد السفر.',
    },
  },
  {
    type: 'cta',
    category: 'common',
    labels: { fr: "Appel à l'action", en: 'Call To Action', ar: 'دعوة لاتخاذ إجراء' },
    description: {
      fr: 'Bandeau de conversion directe vers formulaire ou contact.',
      en: 'Focused conversion banner linking to form or direct call.',
      ar: 'شريط تحويل مباشر نحو النموذج أو الاتصال.',
    },
  },
  {
    type: 'lead_form',
    category: 'common',
    labels: { fr: 'Formulaire de demande', en: 'Lead Form', ar: 'نموذج الطلب' },
    description: {
      fr: 'Formulaire configurable préparé pour le contrat d’intégration CRM.',
      en: 'Configurable inquiry form wired to the CRM integration contract.',
      ar: 'نموذج طلب قابل للتخصيص ومجهز للربط المستقبلي.',
    },
  },
  {
    type: 'whatsapp_button',
    category: 'common',
    labels: { fr: 'Bouton WhatsApp', en: 'WhatsApp Action', ar: 'زر واتساب' },
    description: {
      fr: 'Action de contact direct WhatsApp configurable (hors suivi CRM).',
      en: 'Configurable WhatsApp contact action (separate from CRM lead submission).',
      ar: 'زر تواصل مباشر عبر واتساب قابل للتخصيص.',
    },
  },
  {
    type: 'footer',
    category: 'common',
    labels: { fr: 'Footer', en: 'Footer', ar: 'التذييل' },
    description: {
      fr: 'Pied de page institutionnel Easy2Book avec coordonnées et mentions.',
      en: 'Clean brand footer with official contact links.',
      ar: 'تذييل الصفحة الرسمي مع بيانات الاتصال.',
    },
  },

  // === BLOCS OMRA ===
  {
    type: 'omra_departure_overview',
    category: 'omra',
    labels: { fr: 'Présentation du départ', en: 'Departure Overview', ar: 'تقديم رحلة العمرة' },
    description: {
      fr: 'Résumé du départ Omra (saison, ville d’arrivée, encadrement).',
      en: 'Summary of Omra departure season, flights and guidance.',
      ar: 'ملخص رحلة العمرة والموسم والتأطير.',
    },
  },
  {
    type: 'omra_program',
    category: 'omra',
    labels: { fr: 'Programme détaillé', en: 'Detailed Program', ar: 'البرنامج التفصيلي' },
    description: {
      fr: 'Étapes spirituelles entre La Mecque, Médine et Mazarat.',
      en: 'Spiritual itinerary across Makkah, Madinah and Mazarat.',
      ar: 'تفاصيل المناسك والزيارات بين مكة والمدينة.',
    },
  },
  {
    type: 'omra_hotels',
    category: 'omra',
    labels: { fr: 'Hôtels Omra', en: 'Umrah Hotels', ar: 'فنادق مكة والمدينة' },
    description: {
      fr: 'Fiches hébergement La Mecque et Médine avec distance du Haram.',
      en: 'Makkah and Madinah hotel details and proximity.',
      ar: 'بطاقات الفنادق في مكة والمدينة وقربها من الحرم.',
    },
  },
  {
    type: 'omra_room_rates',
    category: 'omra',
    labels: { fr: 'Tarifs par chambre', en: 'Room Category Rates', ar: 'الأسعار حسب الغرفة' },
    description: {
      fr: 'Double, triple, quadruple/quintuple et remise famille.',
      en: 'Double, triple, quad/quint rates and family discounts.',
      ar: 'أسعار الغرف الثنائية والثلاثية والرباعية وتخفيض العائلات.',
    },
  },
  {
    type: 'omra_services',
    category: 'omra',
    labels: { fr: 'Services inclus', en: 'Included Services', ar: 'الخدمات المشمولة' },
    description: {
      fr: 'Vols, visa Omra, transferts et accompagnement religieux.',
      en: 'Flights, Omra visa, transfers and religious guides.',
      ar: 'الطيران، التأشيرة، التنقلات والتأطير الديني.',
    },
  },
  {
    type: 'omra_dates',
    category: 'omra',
    labels: { fr: 'Dates Omra', en: 'Umrah Dates', ar: 'تواريخ الرحلة' },
    description: {
      fr: 'Calendrier aller/retour, durée du séjour et date limite.',
      en: 'Outbound/return dates, stay duration and deadline.',
      ar: 'مواعيد الذهاب والعودة ومدة الإقامة.',
    },
  },
  {
    type: 'omra_conditions',
    category: 'omra',
    labels: { fr: 'Conditions Omra', en: 'Umrah Conditions', ar: 'شروط الحجز' },
    description: {
      fr: 'Conditions de paiement, validité passeport et groupes +10 pers.',
      en: 'Payment terms, passport rules and group conditions.',
      ar: 'شروط الدفع وصلاحية الجواز وشروط المجموعات.',
    },
  },
  {
    type: 'omra_practical_info',
    category: 'omra',
    labels: { fr: 'Informations pratiques', en: 'Practical Info', ar: 'معلومات عملية' },
    description: {
      fr: 'Conseils bagages, climat et formalités sanitaires.',
      en: 'Luggage allowance, weather and travel prep tips.',
      ar: 'نصائح الأمتعة والطقس والاستعداد للسفر.',
    },
  },

  // === BLOCS VOYAGES ORGANISÉS ===
  {
    type: 'voyage_destination',
    category: 'voyages',
    labels: { fr: 'Destination', en: 'Destination Highlight', ar: 'تقديم الوجهة' },
    description: {
      fr: 'Mise en avant de la destination, ambiance et points d’intérêt.',
      en: 'Destination overview and signature experiences.',
      ar: 'لمحة شاملة عن الوجهة السياحية وأبرز معالمها.',
    },
  },
  {
    type: 'voyage_itinerary',
    category: 'voyages',
    labels: { fr: 'Itinéraire', en: 'Route Overview', ar: 'مسار الرحلة' },
    description: {
      fr: 'Enchaînement des villes et vols intérieurs du circuit.',
      en: 'City sequence and domestic connections.',
      ar: 'ترتيب المدن والتنقلات خلال الرحلة.',
    },
  },
  {
    type: 'voyage_day_by_day',
    category: 'voyages',
    labels: { fr: 'Programme par jour', en: 'Day-by-Day Program', ar: 'البرنامج يومياً' },
    description: {
      fr: 'Déroulé jour par jour des visites et excursions.',
      en: 'Daily schedule of excursions and leisure time.',
      ar: 'تفاصيل البرنامج السياحي يوماً بيوم.',
    },
  },
  {
    type: 'voyage_gallery',
    category: 'voyages',
    labels: { fr: 'Galerie circuit', en: 'Tour Gallery', ar: 'صور الرحلة' },
    description: {
      fr: 'Sélection visuelle des étapes du voyage.',
      en: 'Visual highlights of the organized tour.',
      ar: 'لقطات من محطات الرحلة.',
    },
  },
  {
    type: 'voyage_dates',
    category: 'voyages',
    labels: { fr: 'Dates départ', en: 'Departure Dates', ar: 'تواريخ المغادرة' },
    description: {
      fr: 'Créneaux de départ disponibles et durée du séjour.',
      en: 'Available departure dates and duration.',
      ar: 'مواعيد الانطلاق المتوفرة ومدة السفر.',
    },
  },
  {
    type: 'voyage_pricing',
    category: 'voyages',
    labels: { fr: 'Tarifs voyage', en: 'Tour Pricing', ar: 'أسعار الرحلة' },
    description: {
      fr: 'Tarifs adulte, supplément single et tarif enfant.',
      en: 'Adult, single supplement and child rates.',
      ar: 'أسعار البالغين والغرفة الفردية والأطفال.',
    },
  },
  {
    type: 'voyage_inclusions',
    category: 'voyages',
    labels: { fr: 'Prestations incluses', en: 'Inclusions', ar: 'الخدمات المشمولة' },
    description: {
      fr: 'Ce qui est inclus / non inclus dans le forfait circuit.',
      en: 'Clear breakdown of included and optional services.',
      ar: 'تفصيل ما يشمله العرض وما لا يشمله.',
    },
  },

  // === BLOCS HÔTELS TUNISIE ===
  {
    type: 'hotel_card',
    category: 'hotels_tunisie',
    labels: { fr: 'Fiche hôtel', en: 'Hotel Overview', ar: 'بطاقة الفندق' },
    description: {
      fr: 'Nom de l’hôtel, ville, catégorie étoiles et localisation.',
      en: 'Hotel identity, city, star rating and location.',
      ar: 'تعريف الفندق، المدينة، التصنيف والموقع.',
    },
  },
  {
    type: 'hotel_gallery',
    category: 'hotels_tunisie',
    labels: { fr: 'Galerie hôtel', en: 'Hotel Gallery', ar: 'صور الفندق' },
    description: {
      fr: 'Photos piscine, plage, chambres et restauration.',
      en: 'Pool, beachfront, rooms and dining showcase.',
      ar: 'صور المسبح والشاطئ والغرف.',
    },
  },
  {
    type: 'hotel_amenities',
    category: 'hotels_tunisie',
    labels: { fr: 'Équipements', en: 'Amenities', ar: 'المرافق والخدمات' },
    description: {
      fr: 'Spa, thalasso, club enfants, plage privée, wifi.',
      en: 'Spa, kids club, private beach and leisure amenities.',
      ar: 'السبا، نادي الأطفال، الشاطئ الخاص والمرافق.',
    },
  },
  {
    type: 'hotel_promo',
    category: 'hotels_tunisie',
    labels: { fr: 'Promotion', en: 'Promo Highlight', ar: 'العرض الترويجي' },
    description: {
      fr: 'Mise en avant de la promotion et réductions enfants.',
      en: 'Special promotion banner and child discounts.',
      ar: 'إبراز الخصم الترويجي وامتيازات العائلات.',
    },
  },
  {
    type: 'hotel_stay_period',
    category: 'hotels_tunisie',
    labels: { fr: 'Période de séjour', en: 'Stay Period', ar: 'فترة الإقامة' },
    description: {
      fr: 'Dates de validité de la promo et minimum de nuits.',
      en: 'Promotion validity dates and minimum stay.',
      ar: 'تواريخ صلاحية العرض والحد الأدنى لليالي.',
    },
  },
  {
    type: 'hotel_pricing',
    category: 'hotels_tunisie',
    labels: { fr: 'Tarifs hôtel', en: 'Hotel Rates', ar: 'أسعار الإقامة' },
    description: {
      fr: 'Tarifs par formule (All-In, Demi-Pension, LPD).',
      en: 'Rates by board basis (All-In, Half-Board, B&B).',
      ar: 'الأسعار حسب نظام الإقامة.',
    },
  },
  {
    type: 'hotel_conditions',
    category: 'hotels_tunisie',
    labels: { fr: 'Conditions promo', en: 'Promo Conditions', ar: 'شروط العرض' },
    description: {
      fr: 'Règles d’annulation, check-in/out et suppléments.',
      en: 'Cancellation policy, check-in rules and supplements.',
      ar: 'شروط الإلغاء والتسجيل.',
    },
  },

  // === BLOCS VISA ===
  {
    type: 'visa_overview',
    category: 'visa',
    labels: { fr: 'Présentation service Visa', en: 'Visa Service Intro', ar: 'تقديم خدمة التأشيرة' },
    description: {
      fr: 'Accompagnement administratif sans exposition de documents personnels.',
      en: 'Administrative visa assistance overview.',
      ar: 'تعريف خدمة المرافقة الإدارية لإعداد ملف التأشيرة.',
    },
  },
  {
    type: 'visa_countries',
    category: 'visa',
    labels: { fr: 'Pays couverts', en: 'Covered Countries', ar: 'الدول المشمولة' },
    description: {
      fr: 'Liste des pays disponibles selon la réglementation officielle.',
      en: 'Supported destination countries and jurisdictions.',
      ar: 'قائمة الوجهات والدول المتاحة.',
    },
  },
  {
    type: 'visa_types',
    category: 'visa',
    labels: { fr: 'Types de visa', en: 'Visa Categories', ar: 'أنواع التأشيرات' },
    description: {
      fr: 'Court séjour, long séjour, visiteur, études ou travail.',
      en: 'Short stay, long stay, visitor, study or work visas.',
      ar: 'تأشيرة قصيرة، طويلة، دراسة، عمل أو زيارة.',
    },
  },
  {
    type: 'visa_conditions',
    category: 'visa',
    labels: { fr: 'Conditions officielles', en: 'Official Conditions', ar: 'الشروط التنظيمية' },
    description: {
      fr: 'Critères d’éligibilité et frais consulaires indicatifs.',
      en: 'Eligibility requirements and consular fee notes.',
      ar: 'شروط الأهلية والملاحظات التنظيمية.',
    },
  },
  {
    type: 'visa_documents',
    category: 'visa',
    labels: { fr: 'Liste des pièces', en: 'Document Checklist', ar: 'قائمة الوثائق المطلوبة' },
    description: {
      fr: 'Checklist générale des justificatifs (aucune donnée personnelle exposée).',
      en: 'General required documents checklist (zero personal docs exposed).',
      ar: 'قائمة عامة بالوثائق المطلوبة لتكوين الملف.',
    },
  },
  {
    type: 'visa_steps',
    category: 'visa',
    labels: { fr: 'Étapes de traitement', en: 'Processing Steps', ar: 'مراحل المعالجة' },
    description: {
      fr: 'Audit du dossier, prise de RDV, dépôt et suivi restitution.',
      en: 'File review, appointment booking, submission and tracking.',
      ar: 'مراجعة الملف، حجز الموعد، الإيداع والمتابعة.',
    },
  },
  {
    type: 'visa_faq',
    category: 'visa',
    labels: { fr: 'FAQ Visa', en: 'Visa FAQ', ar: 'أسئلة حول التأشيرة' },
    description: {
      fr: 'Délais, biométrie et questions fréquentes sur le visa.',
      en: 'Processing delays, biometrics and common questions.',
      ar: 'إجابات حول الآجال والبصمة البيومترية.',
    },
  },
];

export function createDefaultBlock(
  type: BlockType,
  language: CreatorLanguage = 'fr'
): PageBlock {
  const entry =
    BLOCK_CATALOG.find((b) => b.type === type) ?? BLOCK_CATALOG[0];
  const isAr = language === 'ar';
  const isEn = language === 'en';
  const id = `blk-${type}-${Math.random().toString(36).slice(2, 7)}`;

  const defaultsByType: Partial<Record<BlockType, Partial<PageBlock['content']>>> = {
    hero_image: {
      eyebrow: isAr ? 'Easy2Book · عرض حصري' : isEn ? 'Easy2Book · Featured Offer' : 'Easy2Book · Offre Exclusive',
      title: isAr ? 'رحلة مصممة لراحتك من البداية إلى العودة' : isEn ? 'Curated Travel Experience From Tunis' : 'Votre voyage clé en main depuis la Tunisie',
      description: isAr ? 'تنظيم متكامل ومرافقة متواصلة طيلة الرحلة.' : 'Organisation complète, hôtels sélectionnés et accompagnement dédié.',
      imageKey: 'voyage_istanbul',
      primaryCtaLabel: isAr ? 'احجز الآن' : isEn ? 'Request Quote' : 'Demander un devis',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '98 140 514',
    },
    hero_video: {
      eyebrow: isAr ? 'عمرة شهر رمضان كامل · مكة المكرمة والمدينة المنورة' : 'Easy2Book · Présentation Vidéo 9:16',
      title: isAr ? 'عمرة رمضان الكل في مكة المكرمة... بسفر أسهل وقلب مطمئن' : 'Découvrez votre programme en vidéo immersive 9:16',
      description: isAr
        ? 'برنامج متكامل من Easy2Book يشمل طيران تونس – جدة – تونس، التأشيرة، التأطير الديني والإداري خطوة بخطوة، إقامة مريحة في فندق ميسان الملتزم، ورحلة روحانية للمدينة المنورة.'
        : 'Vidéo verticale 9:16 avec narration audio et sous-titres synchronisés.',
      imageKey: 'makkah_haram',
      primaryCtaLabel: isAr ? 'احجز مكانك الآن' : 'Réserver maintenant',
      primaryCtaTarget: '#form-block',
    },
    omra_room_rates: {
      eyebrow: isAr ? 'التسعيرة حسب نوع الغرفة' : 'Tarifs par type de chambre',
      title: isAr ? 'اختر الغرفة المناسبة لك ولعائلتك' : 'Grille tarifaire Omra (Référence catalogue)',
      description: isAr
        ? 'تخفيض 200 د.ت للعائلات انطلاقاً من شخصين · مجموعات تفوق 10 أشخاص يرجى الاتصال.'
        : 'Remise famille dès 2 personnes · Groupes +10 personnes sur disponibilité.',
      items: [
        { id: 'r1', title: isAr ? 'غرفة رباعية أو خماسية' : 'Chambre Quadruple / Quintuple', price: '5,900 د.ت', subtitle: isAr ? 'للشخص' : 'Par personne' },
        { id: 'r2', title: isAr ? 'غرفة ثلاثية' : 'Chambre Triple', price: '6,400 د.ت', subtitle: isAr ? 'للشخص' : 'Par personne' },
        { id: 'r3', title: isAr ? 'غرفة ثنائية' : 'Chambre Double', price: '6,900 د.ت', subtitle: isAr ? 'للشخص' : 'Par personne' },
      ],
    },
    countdown: {
      eyebrow: isAr ? 'عدد غرف محدود جداً' : 'Validité de l’offre',
      title: isAr ? 'الوقت المتبقي لانتهاء العرض الترويجي' : 'Offre limitée dans le temps',
      description: isAr ? 'عرض صالح لـ 15 ديسمبر 2026' : 'Réservez avant la date limite pour bénéficier du tarif affiché.',
      targetDateIso: '2026-12-15T23:59:59',
    },
    whatsapp_button: {
      eyebrow: isAr ? 'تواصل فوري' : 'Assistance directe',
      title: isAr ? 'هل لديك استفسار سريع؟ راسلنا عبر واتساب' : 'Besoin d’une réponse rapide sur WhatsApp ?',
      description: isAr
        ? 'تحدث مباشرة مع مستشار Easy2Book (نقرة واحدة لا تُسجل كطلب CRM).'
        : 'Échangez directement avec un conseiller Easy2Book (action directe hors formulaire CRM).',
      whatsapp: {
        enabled: true,
        phoneNumber: '98 140 514',
        buttonLabel: isAr ? 'راسلنا على واتساب · 98 140 514' : 'Discuter sur WhatsApp · 98 140 514',
        prefilledMessage: isAr
          ? 'السلام عليكم، أرغب في الاستفسار عن العرض المعروض في صفحة Easy2Book.'
          : 'Bonjour Easy2Book, je souhaite obtenir des informations sur cette offre.',
        trackAsCrmLead: false,
      },
    },
    lead_form: {
      eyebrow: isAr ? 'تسجيل الاهتمام' : 'Demande de devis & réservation',
      title: isAr ? 'نموذج الاتصال والاهتمام بالحجز' : 'Recevez votre proposition personnalisée',
      description: isAr
        ? 'أدخل بياناتك وسيتواصل معك مستشار Easy2Book.'
        : 'Formulaire connecté à l’adaptateur d’intégration CRM Easy2Book.',
    },
    footer: {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: isAr ? 'المركز الرسمي للحجوزات · 98 140 514 · www.easy2book.tn' : 'Centrale de Réservation · 98 140 514 · www.easy2book.tn',
    },
  };

  const specific = defaultsByType[type] ?? {};

  return {
    id,
    type,
    category: entry.category,
    name: entry.labels[language],
    visible: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    style: {
      backgroundColor: type === 'countdown' || type === 'cta' ? '#102D45' : '#FFFFFF',
      textColor: type === 'countdown' || type === 'cta' ? '#FFFFFF' : '#102D45',
      accentColor: '#E7B34C',
      alignment: isAr ? 'right' : 'left',
      paddingY: 'normal',
      fontSizeScale: 'md',
      borderStyle: 'hairline',
    },
    content: {
      eyebrow: specific.eyebrow ?? entry.labels[language],
      title: specific.title ?? entry.labels[language],
      description: specific.description ?? entry.description[language],
      imageKey: specific.imageKey,
      primaryCtaLabel: specific.primaryCtaLabel,
      primaryCtaTarget: specific.primaryCtaTarget,
      secondaryCtaLabel: specific.secondaryCtaLabel,
      targetDateIso: specific.targetDateIso,
      items: specific.items ?? [
        {
          id: `${id}-1`,
          title: isAr ? 'العنصر الأول في هذا القسم' : 'Point clé 01',
          subtitle: isAr ? 'يمكنك تعديل هذا النص من لوحة الخصائص.' : 'Personnalisable depuis le panneau droit.',
        },
        {
          id: `${id}-2`,
          title: isAr ? 'العنصر الثاني في هذا القسم' : 'Point clé 02',
          subtitle: isAr ? 'تصميم متجاوب بالكامل للكمبيوتر والهاتف.' : 'Rendu responsive ordinateur, tablette et mobile.',
        },
      ],
      whatsapp: specific.whatsapp,
    },
  };
}
