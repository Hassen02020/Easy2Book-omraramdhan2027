import type {
  BlockCategory,
  BlockType,
  BusinessUniverse,
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
    type: 'video_gallery',
    category: 'common',
    labels: { fr: 'Galerie Vidéo', en: 'Video Gallery', ar: 'معرض الفيديو' },
    description: {
      fr: 'Grille de vidéos promotionnelles YouTube ou MP4 avec lecture automatique et boucle (idéal modules Omra).',
      en: 'Promotional YouTube or MP4 video showcase with autoplay and loop controls (ideal for Umrah modules).',
      ar: 'معرض فيديوهات ترويجية (YouTube أو MP4) مع خيارات التشغيل التلقائي والتكرار لبرامج العمرة.',
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
    type: 'omra_sur_mesure_builder',
    category: 'omra',
    labels: {
      fr: 'Module Omra Sur-Mesure (3 Étapes · 100% TND)',
      en: 'Custom Umrah Builder (3 Steps · 100% TND)',
      ar: 'وحدة عمرتك على كيفك (3 خطوات · بالدينار التونسي)',
    },
    description: {
      fr: 'Configurateur interactif en 3 étapes : (1) Programme de vol libre, (2) Chambre à La Mecque en TND, (3) Séjour à Médine selon disponibilité + Devis WhatsApp direct.',
      en: 'Interactive 3-step custom Umrah builder: flights, Makkah hotel in TND, Madinah stay + instant WhatsApp quote.',
      ar: 'وحدة تفاعلية لتفصيل العمرة في 3 خطوات: الطيران بالتاريخ المناسب، فنادق مكة بالدينار التونسي، وفنادق المدينة حسب المتاح مع إرسال فوري للواتساب.',
    },
  },
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
  {
    type: 'module_visa_egypt',
    category: 'visa',
    labels: {
      fr: 'Module Visa Égypte (Garantie & Autorisation 4h)',
      en: 'Visa Egypt Module (Security Clearance & Guarantee)',
      ar: 'وحدة فيزا وخطاب ضمان مصر (تصريح أمني 4 ساعات)',
    },
    description: {
      fr: 'Formulaire interactif dédié aux demandes de visa / lettre de garantie Égypte : infos voyageur, passeport, date du vol, aéroports, motif du voyage et calcul tarifaire 4h.',
      en: 'Interactive intake module for Egyptian visa & security clearance requests with traveler info, passport number, flight date, airports, travel purpose and 4h tariff calculation.',
      ar: 'وحدة تفاعلية متخصصة لطلبات فيزا وخطاب ضمان وتصريح أمني لمصر تشمل بيانات المسافر، رقم الجواز، تاريخ الرحلة، المطارات، غرض السفر وحساب التعريفة في 4 ساعات.',
    },
  },

  // === 4 BLOCS STRUCTURELS PAGE COMPLÈTE ===
  {
    type: 'brand_story',
    category: 'common',
    labels: { fr: 'Histoire & Identité', en: 'Brand Story', ar: 'قصة العلامة والهوية' },
    description: {
      fr: 'Section éditoriale présentant l’agence, son positionnement et son engagement qualité.',
      en: 'Editorial brand narrative highlighting positioning, trust and expertise.',
      ar: 'قسم تعريفي يبرز هوية الوكالة وخبرتها والتزامها بالجودة.',
    },
  },
  {
    type: 'destinations_grid',
    category: 'common',
    labels: { fr: 'Grille Destinations / Univers', en: 'Destinations Showcase', ar: 'شبكة الوجهات والعروض' },
    description: {
      fr: 'Grille vitrine des destinations ou gammes phares avec renvoi vers devis.',
      en: 'Multi-card destination showcase linking directly to inquiry.',
      ar: 'عرض مرئي للوجهات والباقات الرئيسية مع رابط للطلب.',
    },
  },
  {
    type: 'why_choose_us',
    category: 'common',
    labels: { fr: 'Pourquoi nous choisir', en: 'Why Choose Us', ar: 'لماذا تختاروننا' },
    description: {
      fr: 'Piliers de confiance structurés (accompagnement, transparence, assistance).',
      en: 'Structured trust pillars highlighting reliability and advisory.',
      ar: 'ركائز الثقة والجودة والشفافية ومرافقة المسافرين.',
    },
  },
  {
    type: 'booking_process',
    category: 'common',
    labels: { fr: 'Parcours de réservation', en: 'Booking Process', ar: 'مراحل الحجز' },
    description: {
      fr: 'Étapes claires en 3 ou 4 temps : demande, conseil, confirmation, départ.',
      en: 'Clear step-by-step customer journey from inquiry to departure.',
      ar: 'خطوات واضحة من إرسال الطلب إلى تأكيد السفر.',
    },
  },

  // === 8 MODULES COMMERCE VOYAGE UNIVERSELS ===
  {
    type: 'module_hotels_search',
    category: 'commerce',
    labels: { fr: 'Module Hôtels & Séjours', en: 'Hotels & Stays Module', ar: 'وحدة الفنادق والإقامات' },
    description: {
      fr: 'Module de pré-sélection séjour hôtelier (destination, dates, formule) vers devis CRM.',
      en: 'Hotel stay inquiry selector (destination, dates, board plan) linked to CRM form.',
      ar: 'وحدة اختيار الإقامة الفندقية والتواريخ مرتبطة بنموذج الطلب.',
    },
  },
  {
    type: 'module_world_hotels',
    category: 'commerce',
    labels: {
      fr: 'Module Hôtels dans le Monde (100% TND & Voucher Visa)',
      en: 'Worldwide Hotels Module (100% TND & Visa Voucher)',
      ar: 'وحدة فنادق العالم بالدينار التونسي (TND + Voucher فيزا)',
    },
    description: {
      fr: 'Module interactif +500 000 hôtels dans le monde (Arabie Saoudite/Omra, Égypte, Canada, Turquie, Maroc, Dubaï, Malaisie, Zanzibar) payables 100% en Dinar Tunisien sans carte devise, avec Voucher officiel pour dossiers Visa.',
      en: 'Interactive +500,000 worldwide hotels module (Saudi/Umrah, Egypt, Canada, Turkey, Morocco, Dubai, Malaysia, Zanzibar) paid 100% in TND with instant confirmed Voucher for travel & Visa files.',
      ar: 'وحدة تفاعلية لحجز أكثر من 500 ألف فندق في العالم (السعودية والعمرة، مصر، كندا، تركيا، المغرب، دبي، ماليزيا وزنجبار) بالخلاص 100% بالدينار التونسي بدون كارت دوفيز مع Voucher رسمي مؤكد لملفات الفيزا.',
    },
  },
  {
    type: 'module_flights',
    category: 'commerce',
    labels: { fr: 'Module Billetterie Aérienne', en: 'Flights Ticketing Module', ar: 'وحدة تذاكر الطيران' },
    description: {
      fr: 'Module vols directs/escales avec choix cabine, bagages et demande de tarif.',
      en: 'Flight routing & fare inquiry module with cabin and baggage options.',
      ar: 'وحدة حجز تذاكر الطيران واختيار المسار ودرجة السفر.',
    },
  },
  {
    type: 'module_ferries',
    category: 'commerce',
    labels: { fr: 'Module Bateaux & Ferries', en: 'Ferries & Maritime Module', ar: 'وحدة البواخر والعبّارات' },
    description: {
      fr: 'Traversées maritimes (Tunis–Gênes / Marseille), cabines et véhicules.',
      en: 'Maritime crossings, cabin tiers and vehicle boarding requests.',
      ar: 'الرحلات البحرية والمقصورات وشحن السيارات.',
    },
  },
  {
    type: 'module_transfers',
    category: 'commerce',
    labels: { fr: 'Module Transferts Privés', en: 'Private Transfers Module', ar: 'وحدة النقل والتوصيل' },
    description: {
      fr: 'Navettes aéroport, transferts inter-villes et flotte berline / van VIP.',
      en: 'Airport pickups, city-to-city transfers and vehicle category selector.',
      ar: 'نقل المطار والتنقلات الخاصة بين المدن والفنادق.',
    },
  },
  {
    type: 'module_excursions',
    category: 'commerce',
    labels: { fr: 'Module Excursions & Activités', en: 'Excursions & Activities', ar: 'وحدة الأنشطة والرحلات اليومية' },
    description: {
      fr: 'Catalogue d’excursions guidées, visites culturelles et billetterie attractions.',
      en: 'Guided excursions, attraction passes and participant scheduling.',
      ar: 'برامج الجولات السياحية والتذاكر والأنشطة اليومية.',
    },
  },
  {
    type: 'module_car_rental',
    category: 'commerce',
    labels: { fr: 'Module Location de Voitures', en: 'Car Rental Module', ar: 'وحدة كراء السيارات' },
    description: {
      fr: 'Catégories de véhicules, agences de retrait et durée souhaitée.',
      en: 'Vehicle classes, pickup hubs and rental period request module.',
      ar: 'فئات السيارات ونقاط الاستلام وفترة الإيجار.',
    },
  },
  {
    type: 'module_travel_insurance',
    category: 'commerce',
    labels: { fr: 'Module Assurance Voyage', en: 'Travel Insurance Module', ar: 'وحدة تأمين السفر' },
    description: {
      fr: 'Garanties Schengen, assistance médicale internationale et couverture multi-séjours.',
      en: 'Schengen-compliant coverage tiers and international medical assistance.',
      ar: 'صيغ التأمين الصحي للسفر وتأشيرة شنغن.',
    },
  },
  {
    type: 'module_cruises_vip',
    category: 'commerce',
    labels: { fr: 'Module Croisières & VIP', en: 'Cruises & VIP Concierge', ar: 'وحدة الكروز وخدمات VIP' },
    description: {
      fr: 'Croisières Méditerranée, expériences gastronomiques et conciergerie sur mesure.',
      en: 'Mediterranean cruises, fine dining and bespoke VIP concierge services.',
      ar: 'رحلات الكروز البحرية والضيافة وخدمات كبار الشخصيات.',
    },
  },
];

export function createDefaultBlock(
  type: BlockType,
  language: CreatorLanguage = 'fr',
  universe?: BusinessUniverse
): PageBlock {
  const entry =
    BLOCK_CATALOG.find((b) => b.type === type) ?? BLOCK_CATALOG[0];
  const isAr = language === 'ar';
  const isEn = language === 'en';
  const id = `blk-${type}-${Math.random().toString(36).slice(2, 7)}`;

  const anchorByType: Partial<Record<BlockType, string>> = {
    hero_image: 'top',
    hero_video: 'top',
    presentation: 'presentation',
    brand_story: 'presentation',
    destinations_grid: 'offres',
    product_cards: 'offres',
    services: 'offres',
    pricing: 'tarifs',
    why_choose_us: 'avantages',
    benefits: 'avantages',
    booking_process: 'parcours',
    gallery: 'galerie',
    video_gallery: 'videos',
    faq: 'faq',
    visa_faq: 'faq',
    lead_form: 'form-block',
    module_visa_egypt: 'module-visa-egypte',
    module_hotels_search: 'module-hotels',
    module_world_hotels: 'module-hotels-monde',
    module_flights: 'module-vols',
    module_ferries: 'module-bateaux',
    module_transfers: 'module-transferts',
    module_excursions: 'module-excursions',
    module_car_rental: 'module-voitures',
    module_travel_insurance: 'module-assurance',
    module_cruises_vip: 'module-vip',
  };

  const defaultsByType: Partial<Record<BlockType, Partial<PageBlock['content']>>> = {
    hero_image: {
      eyebrow: isAr ? 'Easy2Book · عرض حصري' : isEn ? 'Easy2Book · Featured Offer' : 'Easy2Book · Offre Exclusive',
      title: isAr ? 'رحلة مصممة لراحتك من البداية إلى العودة' : isEn ? 'Curated Travel Experience From Tunis' : 'Votre voyage clé en main depuis la Tunisie',
      description: isAr ? 'تنظيم متكامل ومرافقة متواصلة طيلة الرحلة.' : 'Organisation complète, hôtels sélectionnés et accompagnement dédié.',
      imageKey: 'voyage_istanbul',
      primaryCtaLabel: isAr ? 'احجز الآن' : isEn ? 'Request Quote' : 'Demander un devis',
      primaryCtaTarget: '#form-block',
      secondaryCtaLabel: '',
    },
    hero_video:
      universe === 'visa'
        ? {
            eyebrow: isAr
              ? 'Easy2Book · خدمات الفيزا و E-Visa (فيديو 9:16)'
              : 'Easy2Book · Visas & E-Visa · Vidéo 9:16',
            title: isAr
              ? 'ملف الفيزا جاهز خطوة بخطوة مع Easy2Book'
              : 'Préparez votre dossier Visa & E-Visa en vidéo 9:16',
            description: isAr
              ? 'عرض مرئي بتعليق صوتي نسائي تونسي يغطي مصر (4 ساعات)، شنغن، دبي، قطر، عُمان، العمرة و53 وجهة E-Visa.'
              : 'Reel vertical 9:16 avec voix tunisienne dédiée aux services Visa, RDV Schengen et +53 E-Visa.',
            imageKey: 'visa_desk',
            reelPreset: 'visa_services',
            primaryCtaLabel: isAr ? 'أودع ملفك الآن' : 'Déposer mon dossier',
            primaryCtaTarget: '#form-block',
          }
        : universe === 'voyages' || universe === 'hotels_tunisie'
          ? {
              eyebrow: isAr
                ? 'Easy2Book · رحلات يومية وجولات خاصة (فيديو 9:16)'
                : 'Easy2Book · Excursions & Circuits · Vidéo 9:16',
              title: isAr
                ? 'اكتشف أجمل الرحلات اليومية مع سيارة ومرشد خاص'
                : 'Découvrez nos excursions quotidiennes & circuits en vidéo 9:16',
              description: isAr
                ? 'فيديو ترويجي عمودي 9:16 بتعليق صوتي نسائي تونسي للرحلات اليومية في مصر، تركيا، دبي وتونس.'
                : 'Reel vertical 9:16 avec voix tunisienne dédiée aux excursions guidées, croisières et transferts VIP.',
              imageKey: 'egypt_pyramids_museum',
              reelPreset: 'excursions_general',
              primaryCtaLabel: isAr ? 'احجز رحلتك الآن' : 'Réserver une excursion',
              primaryCtaTarget: '#form-block',
            }
          : {
              eyebrow: isAr
                ? 'عمرة شهر رمضان كامل · مكة المكرمة والمدينة المنورة'
                : 'Easy2Book · Présentation Vidéo 9:16',
              title: isAr
                ? 'عمرة رمضان الكل في مكة المكرمة... بسفر أسهل وقلب مطمئن'
                : 'Découvrez votre programme en vidéo immersive 9:16',
              description: isAr
                ? 'برنامج متكامل من Easy2Book يشمل طيران تونس – جدة – تونس، التأشيرة، التأطير الديني والإداري خطوة بخطوة، إقامة مريحة في فندق ميسان الملتزم، ورحلة روحانية للمدينة المنورة.'
                : 'Vidéo verticale 9:16 avec narration audio et sous-titres synchronisés.',
              imageKey: 'makkah_haram',
              reelPreset: 'omra',
              primaryCtaLabel: isAr ? 'احجز مكانك الآن' : 'Réserver maintenant',
              primaryCtaTarget: '#form-block',
            },
    brand_story: {
      eyebrow: isAr ? 'رؤيتنا ورسالتنا' : isEn ? 'Who We Are' : 'Notre identité & engagement',
      title: isAr ? 'مرافقة احترافية لكل تفاصيل سفرك' : isEn ? 'A Trusted Travel Partner Built Around Clarity' : 'Un partenaire voyage pensé pour la sérénité et la clarté',
      description: isAr
        ? 'من التخطيط المبدئي إلى العودة، نجمع بين الخبرة الميدانية والالتزام بالمواعيد لتقديم رحلات وإقامات منظمة.'
        : 'De la conception du programme jusqu’au retour, chaque dossier bénéficie d’un interlocuteur dédié, d’hébergements vérifiés et d’une transparence totale.',
      imageKey: 'dubai_skyline',
      items: [
        {
          id: `${id}-bs1`,
          title: isAr ? 'تخطيط مخصص' : isEn ? 'Tailored Planning' : 'Conseil sur mesure',
          subtitle: isAr ? 'برامج متكيفة مع العائلات والمجموعات.' : isEn ? 'Adapted to families, couples and groups.' : 'Des propositions adaptées aux familles, couples et groupes.',
          badge: '01',
        },
        {
          id: `${id}-bs2`,
          title: isAr ? 'متابعة مستمرة' : isEn ? 'End-to-End Follow-up' : 'Suivi complet du dossier',
          subtitle: isAr ? 'تواصل واضح قبل الرحلة وأثناءها.' : isEn ? 'Clear support before and during travel.' : 'Assistance dédiée avant le départ et pendant le séjour.',
          badge: '02',
        },
      ],
    },
    destinations_grid: {
      eyebrow: isAr ? 'وجهاتنا المختارة' : isEn ? 'Featured Universes' : 'Nos univers & destinations',
      title: isAr ? 'حلول سفر شاملة حسب وجهتك' : isEn ? 'Explore Our Travel Solutions' : 'Des offres adaptées à chaque projet de voyage',
      description: isAr
        ? 'اختر الخدمة أو الوجهة المناسبة للحصول على عرض مفصل حسب تواريخك.'
        : 'Chaque rubrique renvoie vers une demande personnalisée selon vos dates et votre nombre de voyageurs.',
      items: [
        {
          id: `${id}-dg1`,
          title: isAr ? 'رحلات العمرة' : isEn ? 'Umrah Departures' : 'Omra & Pèlerinages',
          subtitle: isAr ? 'تنظيم متكامل ومرافقة دينية ولوجستية.' : isEn ? 'Full pilgrimage organization & guidance.' : 'Départs saisonniers et accompagnement complet.',
          badge: 'Sur devis / Catalogue',
        },
        {
          id: `${id}-dg2`,
          title: isAr ? 'الرحلات المنظمة' : isEn ? 'Organized Tours' : 'Voyages organisés',
          subtitle: isAr ? 'مسارات ثقافية وترفيهية متوازنة.' : isEn ? 'Curated multi-day itineraries.' : 'Circuits accompagnés et séjours clé en main.',
          badge: 'Sur devis / Catalogue',
        },
        {
          id: `${id}-dg3`,
          title: isAr ? 'فنادق ومنتجعات' : isEn ? 'Hotels & Resorts' : 'Hôtels & Séjours Tunisie',
          subtitle: isAr ? 'إقامات مختارة للعائلات والأزواج.' : isEn ? 'Verified seaside & city stays.' : 'Établissements sélectionnés selon vos formules.',
          badge: 'Sur devis / Catalogue',
        },
      ],
    },
    why_choose_us: {
      eyebrow: isAr ? 'ضمانات الجودة' : isEn ? 'Trust Pillars' : 'Pourquoi voyager avec nous',
      title: isAr ? 'معايير واضحة لبناء الثقة' : isEn ? 'Clear Standards At Every Step' : 'Des engagements concrets à chaque étape',
      description: isAr
        ? 'نركز على وضوح الشروط وتنظيم الملفات دون مفاجآت.'
        : 'Transparence des prestations, partenaires sélectionnés et accompagnement humain réactif.',
      items: [
        {
          id: `${id}-wc1`,
          title: isAr ? 'شفافية الشروط' : isEn ? 'Clear Conditions' : 'Conditions lisibles et vérifiées',
          subtitle: isAr ? 'تفصيل دقيق لما يشمله البرنامج.' : isEn ? 'Detailed breakdown of included services.' : 'Présentation claire des prestations incluses et optionnelles.',
          badge: '01',
        },
        {
          id: `${id}-wc2`,
          title: isAr ? 'شركاء موثوقون' : isEn ? 'Vetted Partners' : 'Partenaires & hôtels audités',
          subtitle: isAr ? 'اختيار دقيق للفنادق وشركات النقل.' : isEn ? 'Selected hotels and reliable carriers.' : 'Sélection exigeante des hébergements et transporteurs.',
          badge: '02',
        },
        {
          id: `${id}-wc3`,
          title: isAr ? 'مرافقة مستمرة' : isEn ? 'Dedicated Advisors' : 'Conseillers dédiés',
          subtitle: isAr ? 'إجابة سريعة ومرافقة قبل وأثناء السفر.' : isEn ? 'Responsive follow-up from quote to return.' : 'Un interlocuteur unique du premier échange jusqu’au retour.',
          badge: '03',
        },
      ],
    },
    booking_process: {
      eyebrow: isAr ? 'كيف تحجز معنا' : isEn ? 'How It Works' : 'Votre parcours en 4 étapes',
      title: isAr ? 'خطوات بسيطة لتأكيد رحلتك' : isEn ? 'From Request To Departure' : 'De votre demande jusqu’au départ',
      description: isAr
        ? 'عملية واضحة تضمن لك التوجيه الصحيح قبل تأكيد الحجز.'
        : 'Un circuit fluide permettant de valider vos disponibilités et préférences avec un conseiller.',
      items: [
        {
          id: `${id}-bp1`,
          title: isAr ? '1. إرسال الطلب' : isEn ? '1. Send Inquiry' : '1. Demande en ligne',
          subtitle: isAr ? 'حدد وجهتك وتواريخك وعدد المسافرين.' : isEn ? 'Share destination, dates & travelers.' : 'Précisez votre besoin, vos dates et le nombre de voyageurs.',
        },
        {
          id: `${id}-bp2`,
          title: isAr ? '2. دراسة العرض' : isEn ? '2. Tailored Proposal' : '2. Proposition vérifiée',
          subtitle: isAr ? 'تثبيت الإمكانية والأسعار الفعلية.' : isEn ? 'Advisor checks live availability.' : 'Vérification des disponibilités et envoi d’une offre claire.',
        },
        {
          id: `${id}-bp3`,
          title: isAr ? '3. الملف والتأكيد' : isEn ? '3. File & Confirmation' : '3. Validation dossier',
          subtitle: isAr ? 'إتمام الوثائق وتأكيد الحجز.' : isEn ? 'Documents & booking finalization.' : 'Finalisation administrative et confirmation officielle.',
        },
        {
          id: `${id}-bp4`,
          title: isAr ? '4. السفر بأمان' : isEn ? '4. Guided Travel' : '4. Départ serein',
          subtitle: isAr ? 'استلام المستندات والمرافقة.' : isEn ? 'Receive vouchers & travel support.' : 'Remise des titres de voyage et assistance continue.',
        },
      ],
    },
    gallery: {
      eyebrow: isAr ? 'معرض الصور' : isEn ? 'Visual Gallery' : 'Galerie visuelle',
      title: isAr ? 'لقطات من الوجهات والإقامات' : isEn ? 'Curated Destinations & Stays' : 'Aperçu des destinations & hébergements',
      description: isAr
        ? 'صور عالية الدقة من مكتبة الوسائط.'
        : 'Sélection multi-visuels configurable depuis votre médiathèque.',
      imageKey: 'voyage_istanbul',
      galleryImageKeys: ['voyage_istanbul', 'tunisia_resort', 'makkah_haram', 'dubai_skyline'],
    },
    video_gallery: {
      eyebrow: isAr ? 'فيديوهات العمرة والرحلات' : isEn ? 'Promotional Video Gallery' : 'Vidéos Promotionnelles · Omra & Circuits',
      title: isAr ? 'اكتشف أجواء العمرة والفنادق بالفيديو' : isEn ? 'Watch Our Promotional Videos' : 'Découvrez nos programmes Omra en vidéo',
      description: isAr
        ? 'معرض فيديوهات ترويجية (YouTube أو MP4) مع دعم التشغيل التلقائي والتكرار.'
        : 'Intégrez vos vidéos promotionnelles YouTube ou MP4 avec lecture automatique et boucle.',
      videoSettings: {
        autoplay: false,
        loop: true,
        muted: true,
        showControls: true,
        columns: 2,
      },
      videos: [
        {
          id: `${id}-vid-1`,
          badge: isAr ? 'عمرة رمضان · 16:9' : 'Omra · YouTube / MP4',
          title: isAr ? 'جولة الحرم المكي وفندق ميسان' : 'Présentation Omra Makkah & Médine',
          caption: isAr
            ? 'أضف رابط فيديو YouTube أو MP4 الترويجي من لوحة الإعدادات.'
            : 'Collez un lien YouTube ou MP4 dans l’inspecteur droit.',
          url: '',
          posterKey: 'omra_vip_haram',
          aspectRatio: '16:9',
        },
        {
          id: `${id}-vid-2`,
          badge: isAr ? 'ريلز عمودي · 9:16' : 'Reel Omra · MP4 / YouTube',
          title: isAr ? 'إقامة قريبة من المسجد النبوي' : 'Atmosphère Spirituelle & Hébergement',
          caption: isAr
            ? 'يدعم التشغيل التلقائي والتكرار المستمر.'
            : 'Compatible lecture automatique, boucle infinie et format MP4.',
          url: '',
          posterKey: 'makkah_haram',
          aspectRatio: '16:9',
        },
      ],
    },
    module_hotels_search: {
      eyebrow: isAr ? 'وحدة الفنادق' : isEn ? 'Module · Hotels' : 'Module Commerce · Hôtels & Séjours',
      title: isAr ? 'البحث وطلب الإقامة الفندقية' : isEn ? 'Hotels & Resorts Request' : 'Demande de disponibilité Hôtels & Resorts',
      description: isAr
        ? 'حدد الوجهة وفترة الإقامة ونوع الغرفة لإرسال طلب دقيق.'
        : 'Pré-sélectionnez votre ville, vos dates et votre formule pour recevoir les disponibilités vérifiées.',
      imageKey: 'tunisia_resort',
      primaryCtaLabel: isAr ? 'تحقق من الإمكانية' : isEn ? 'Check Availability' : 'Vérifier les disponibilités',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-mh1`, title: isAr ? 'الوجهة / المدينة' : 'Zone / Ville', subtitle: 'Hammamet, Djerba, Sousse, Gammarth, Monastir' },
        { id: `${id}-mh2`, title: isAr ? 'نظام الإقامة' : 'Formules', subtitle: 'LPD · Demi-pension · Pension complète · All Inclusive' },
        { id: `${id}-mh3`, title: isAr ? 'الغرف والعائلات' : 'Hébergement', subtitle: isAr ? 'غرف ثنائية، عائلية أو متصلة' : 'Chambres doubles, familiales, suites & communicantes' },
      ],
    },
    module_flights: {
      eyebrow: isAr ? 'وحدة الطيران' : isEn ? 'Module · Flights' : 'Module Commerce · Billetterie Aérienne',
      title: isAr ? 'حجز وطلب تذاكر الطيران' : isEn ? 'Flight Ticketing Inquiry' : 'Billetterie aérienne internationale & régionale',
      description: isAr
        ? 'رحلات ذهاب وعودة أو وجهات متعددة مع خيارات الأمتعة.'
        : 'Itinéraires directs ou avec escales, tarifs familles, groupes et franchises bagages vérifiées.',
      imageKey: 'tunis_flight',
      primaryCtaLabel: isAr ? 'طلب تسعيرة طيران' : isEn ? 'Request Flight Quote' : 'Demander un tarif vol',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-mf1`, title: isAr ? 'نوع الرحلة' : 'Type de trajet', subtitle: 'Aller-Retour · Aller Simple · Multi-destinations' },
        { id: `${id}-mf2`, title: isAr ? 'درجة السفر' : 'Cabines', subtitle: 'Économique · Premium · Affaires' },
        { id: `${id}-mf3`, title: isAr ? 'الخدمات' : 'Services inclus', subtitle: isAr ? 'اختيار المقاعد والأمتعة الإضافية' : 'Bagages en soute, flexibilité et assistance émission' },
      ],
    },
    module_ferries: {
      eyebrow: isAr ? 'وحدة البواخر' : isEn ? 'Module · Ferries' : 'Module Commerce · Bateaux & Ferries',
      title: isAr ? 'الرحلات البحرية والمقصورات' : isEn ? 'Maritime Crossings & Cabins' : 'Traversées maritimes, cabines & véhicules',
      description: isAr
        ? 'تونس – جنوة / مرسيليا مع حجز المقصورات أو السيارات.'
        : 'Lignes Méditerranée avec sélection cabine, fauteuil et embarquement véhicule.',
      imageKey: 'cairo_nile',
      primaryCtaLabel: isAr ? 'طلب حجز بحري' : isEn ? 'Request Crossing' : 'Demander une traversée',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-mfr1`, title: isAr ? 'الموانئ' : 'Lignes principales', subtitle: 'La Goulette ↔ Marseille / Gênes / Civitavecchia' },
        { id: `${id}-mfr2`, title: isAr ? 'الإقامة على متن الباخرة' : 'Installation à bord', subtitle: 'Cabine privée, suite ou fauteuil confort' },
        { id: `${id}-mfr3`, title: isAr ? 'المركبات' : 'Embarquement véhicule', subtitle: 'Voiture tourisme, utilitaire ou moto selon dimensions' },
      ],
    },
    module_transfers: {
      eyebrow: isAr ? 'وحدة التنقلات' : isEn ? 'Module · Transfers' : 'Module Commerce · Transferts Privés',
      title: isAr ? 'نقل المطار والتنقلات الخاصة' : isEn ? 'Airport & Intercity Transfers' : 'Transferts aéroports, hôtels & navettes privées',
      description: isAr
        ? 'سيارات مريحة ومكيفة مع سائقين محترفين حسب عدد المسافرين.'
        : 'Prise en charge ponctuelle à l’arrivée, berlines, minivans familiaux et autocars groupes.',
      imageKey: 'sahara_tozeur',
      primaryCtaLabel: isAr ? 'حجز خدمة النقل' : isEn ? 'Book Transfer' : 'Réserver un transfert',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-mt1`, title: isAr ? 'نقل المطار' : 'Aéroports', subtitle: 'Tunis-Carthage · Enfidha · Monastir · Djerba' },
        { id: `${id}-mt2`, title: isAr ? 'المركبات المتاحة' : 'Flotte disponible', subtitle: 'Berline VIP · Van 7–9 places · Minibus groupe' },
        { id: `${id}-mt3`, title: isAr ? 'الاستقبال' : 'Accueil personnalisé', subtitle: 'Suivi vol en temps réel et accueil pancarte' },
      ],
    },
    module_excursions: {
      eyebrow: isAr ? 'وحدة الأنشطة' : isEn ? 'Module · Excursions' : 'Module Commerce · Excursions & Attractions',
      title: isAr ? 'الجولات السياحية والتذاكر' : isEn ? 'Guided Tours & Attractions' : 'Excursions guidées, sorties & billetterie loisirs',
      description: isAr
        ? 'برامج نصف يوم أو يوم كامل مع مرشدين معتمدين.'
        : 'Découvertes culturelles, safaris Sahara, sorties en mer et billets coupe-file.',
      imageKey: 'voyage_istanbul',
      primaryCtaLabel: isAr ? 'احجز نشاطك' : isEn ? 'Inquire Excursion' : 'Demander un programme',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-me1`, title: isAr ? 'جولات ثقافية' : 'Découverte & Culture', subtitle: 'Guides francophones, arabophones et anglophones' },
        { id: `${id}-me2`, title: isAr ? 'رحلات صحراوية وبحرية' : 'Expériences Nature', subtitle: 'Tozeur, Douz, îles et sorties privatives' },
        { id: `${id}-me3`, title: isAr ? 'تنظيم المجموعات' : 'Formules flexibles', subtitle: 'Individuels, familles ou incentives entreprises' },
      ],
    },
    module_car_rental: {
      eyebrow: isAr ? 'وحدة كراء السيارات' : isEn ? 'Module · Car Rental' : 'Module Commerce · Location de Voitures',
      title: isAr ? 'كراء السيارات بكل الفئات' : isEn ? 'Car Rental Fleet Inquiry' : 'Location de véhicules courte et moyenne durée',
      description: isAr
        ? 'استلام من المطار أو المدينة مع شروط تأمين واضحة.'
        : 'Citadines, SUV, familiales et utilitaires avec retrait aéroport ou agence.',
      imageKey: 'djerba_thalasso',
      primaryCtaLabel: isAr ? 'طلب كراء سيارة' : isEn ? 'Request Vehicle' : 'Demander un devis véhicule',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-mc1`, title: isAr ? 'فئات السيارات' : 'Catégories', subtitle: 'Économique · Compacte · SUV · Familiale 7 places' },
        { id: `${id}-mc2`, title: isAr ? 'نقاط الاستلام' : 'Lieux de retrait', subtitle: 'Aéroports internationaux et centres-villes' },
        { id: `${id}-mc3`, title: isAr ? 'خيارات إضافية' : 'Options disponibles', subtitle: 'Siège bébé, conducteur additionnel, kilométrage' },
      ],
    },
    module_travel_insurance: {
      eyebrow: isAr ? 'وحدة تأمين السفر' : isEn ? 'Module · Travel Insurance' : 'Module Commerce · Assurance Voyage',
      title: isAr ? 'تأمين سفر معتمد للتأشيرات والرحلات' : isEn ? 'Schengen & Worldwide Travel Insurance' : 'Assurance voyage internationale & couverture Schengen',
      description: isAr
        ? 'تغطية صحية مطابقة لمتطلبات السفارات ومراكز التأشيرة.'
        : 'Attestations conformes aux exigences consulaires, assistance médicale et rapatriement.',
      imageKey: 'visa_europe',
      primaryCtaLabel: isAr ? 'طلب وثيقة التأمين' : isEn ? 'Request Coverage' : 'Demander une attestation',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-mi1`, title: isAr ? 'تأمين شنغن' : 'Conformité Consulaire', subtitle: 'Couverture minimale 30 000 € pour dossiers Schengen' },
        { id: `${id}-mi2`, title: isAr ? 'المساعدة الطبية' : 'Garanties Santé', subtitle: 'Frais médicaux d’urgence, hospitalisation & assistance' },
        { id: `${id}-mi3`, title: isAr ? 'المدة' : 'Durées flexibles', subtitle: 'Court séjour, multi-voyages annuel ou études' },
      ],
    },
    module_cruises_vip: {
      eyebrow: isAr ? 'وحدة الكروز وVIP' : isEn ? 'Module · Cruises & VIP' : 'Module Commerce · Croisières & Services VIP',
      title: isAr ? 'رحلات بحرية فاخرة وخدمات كبار الشخصيات' : isEn ? 'Luxury Cruises & VIP Concierge' : 'Croisières, tables sélectionnées & conciergerie VIP',
      description: isAr
        ? 'إقامات بحرية على المتوسط والنيل وباقات ضيافة خاصة.'
        : 'Itinéraires croisière, salons VIP aéroport, accueils privés et séjours sur mesure.',
      imageKey: 'omra_vip_haram',
      primaryCtaLabel: isAr ? 'استشارة VIP' : isEn ? 'VIP Inquiry' : 'Contacter la conciergerie',
      primaryCtaTarget: '#form-block',
      items: [
        { id: `${id}-mv1`, title: isAr ? 'كروز المتوسط والنيل' : 'Croisières sélectionnées', subtitle: 'Méditerranée, Îles Grecques & Croisière Nil' },
        { id: `${id}-mv2`, title: isAr ? 'استقبال VIP بالمطار' : 'Salons & Fast-Track', subtitle: 'Assistance coupe-file et transferts privés' },
        { id: `${id}-mv3`, title: isAr ? 'تصميم حسب الطلب' : 'Packages sur mesure', subtitle: 'Voyages de noces, directions et événements privés' },
      ],
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
        phoneNumber: '',
        buttonLabel: isAr ? 'تواصل عبر واتساب' : 'Discuter sur WhatsApp',
        prefilledMessage: isAr
          ? 'السلام عليكم، أرغب في الاستفسار عن العرض المعروض في الصفحة.'
          : 'Bonjour, je souhaite obtenir des informations sur cette offre.',
        trackAsCrmLead: false,
      },
    },
    module_world_hotels: {
      eyebrow: isAr
        ? '+500,000 فندق في العالم · الخلاص 100% بالدينار التونسي (TND)'
        : isEn
          ? '+500,000 Hotels Worldwide · 100% Paid in Tunisian Dinar (TND)'
          : '+500 000 Hôtels dans le Monde · Paiement 100% en Dinar Tunisien (TND)',
      title: isAr
        ? 'احجز فندقك في أي دولة في العالم بالدينار التونسي بدون كارت دوفيز'
        : isEn
          ? 'Book Worldwide Hotels in TND — Zero Foreign Card Needed'
          : 'Réservez votre hôtel partout dans le monde en Dinar Tunisien (TND)',
      description: isAr
        ? 'السعودية والعمرة، مصر، كندا، تركيا، المغرب، دبي، ماليزيا وزنجبار — Voucher رسمي ومؤكد فوري بدون المساس بمنحتك السياحية.'
        : isEn
          ? 'Saudi Arabia/Umrah, Egypt, Canada, Turkey, Morocco, Dubai, Malaysia & Zanzibar — instant confirmed Voucher for travel and Visa dossiers without touching your tourist allowance.'
          : 'Arabie Saoudite (Omra), Égypte, Canada, Turquie, Maroc, Dubaï, Malaisie & Zanzibar — Voucher officiel confirmé immédiatement sans toucher à votre allocation touristique.',
      imageKey: 'world_hotels_canada_niagara',
      primaryCtaLabel: isAr
        ? 'اطلب عرضك بالدينار التونسي والـ Voucher'
        : isEn
          ? 'Request TND Hotel Quote & Voucher'
          : 'Demander mon tarif en TND & Voucher',
      items: [
        {
          id: 'wh-1',
          title: isAr ? 'باقة السفر السريع بلاش فيزا' : 'Pack 1 · Sans Visa (Départ rapide)',
          subtitle: isAr
            ? 'تركيا · المغرب · ماليزيا · زنجبار'
            : 'Turquie · Maroc · Malaisie · Zanzibar',
        },
        {
          id: 'wh-2',
          title: isAr ? 'باقة شمس الشتاء والعمرة' : 'Pack 2 · Soleil d’Hiver & Omra',
          subtitle: isAr
            ? 'السعودية (العمرة) · مصر (القاهرة وشرم الشيخ) · دبي'
            : 'Arabie Saoudite (Omra) · Égypte · Dubaï',
        },
        {
          id: 'wh-3',
          title: isAr ? 'الوجهات الكبرى وملفات الفيزا' : 'Pack 3 · Canada, Europe & Dossiers Visa',
          subtitle: isAr
            ? 'كندا (مونتريال/تورونتو) وأوروبا · Voucher رسمي ومؤكد'
            : 'Canada (Montréal/Toronto) & Europe · Voucher officiel confirmé',
        },
      ],
    },
    module_visa_egypt: {
      eyebrow: isAr
        ? 'فيزا وتصريح أمني لمصر · إصدار في 4 ساعات'
        : isEn
          ? 'Visa Egypt & Security Clearance · 4-Hour Processing'
          : 'Visa Égypte & Autorisation sécuritaire · Délai 4h',
      title: isAr
        ? 'طلب خطاب ضمان وتصريح أمني للسفر إلى مصر'
        : isEn
          ? 'Request Egyptian Visa / Security Clearance'
          : 'Demande de Visa & Lettre de Garantie Égypte',
      description: isAr
        ? 'أدخل بيانات المسافر، تاريخ الرحلة، مطار الإنطلاق والوصول وغرض السفر لبدء معالجة ملفك في 4 ساعات فقط.'
        : isEn
          ? 'Fill in traveler information, flight date, departure/arrival airports, and travel purpose to process your Egyptian visa or guarantee letter within 4 hours.'
          : 'Renseignez les informations du voyageur, la date du vol, les aéroports et le motif du voyage pour lancer votre autorisation sécuritaire ou lettre de garantie en 4 heures.',
      imageKey: 'egypt_pyramids_museum',
      primaryCtaLabel: isAr
        ? 'إرسال طلب التصريح الأمني (4 ساعات)'
        : isEn
          ? 'Submit Egypt Visa Request (4h)'
          : 'Envoyer la demande Visa Égypte (4h)',
      items: [
        {
          id: 'eg-t1',
          title: isAr
            ? 'خطاب ضمان انطلاق من تونس'
            : isEn
              ? 'Guarantee Letter · Departure Tunisia'
              : 'Lettre / garantie départ Tunisie',
          price: isAr ? '90 د.ت' : '90 DT',
          subtitle: isAr ? 'إصدار خلال 4 ساعات' : 'Délai 4h · Passeport + billet',
        },
        {
          id: 'eg-t2',
          title: isAr
            ? 'خطاب ضمان انطلاق من دولة أخرى'
            : isEn
              ? 'Guarantee Letter · Other Country'
              : 'Lettre / garantie autre pays',
          price: isAr ? '150 د.ت' : '150 DT',
          subtitle: isAr ? 'حسب الطلب · 4 ساعات' : 'Sur demande · Délai 4h',
        },
        {
          id: 'eg-t3',
          title: isAr
            ? 'نزول شرم الشيخ / الغردقة / الإسكندرية'
            : isEn
              ? 'Sharm / Hurghada / Alexandria Landing'
              : 'Atterrissage Charm / Hurghada / Alexandrie',
          price: isAr ? '350 / 300 د.ت' : '350 / 300 DT',
          subtitle: isAr
            ? '350 د.ت (فردي) · 300 د.ت (+2)'
            : '350 DT (1 pers.) · 300 DT (dès 2 pers.)',
        },
      ],
    },
    lead_form: {
      eyebrow: isAr ? 'تسجيل الاهتمام' : 'Demande de devis & réservation',
      title: isAr ? 'نموذج الاتصال والاهتمام بالحجز' : 'Recevez votre proposition personnalisée',
      description: isAr
        ? 'أدخل بياناتك وسيتواصل معك مستشار مخصص.'
        : 'Formulaire connecté à l’adaptateur d’intégration CRM.',
    },
    omra_sur_mesure_builder: {
      eyebrow: isAr
        ? 'عمرتك على كيفك · 3 خطوات · الخلاص بالدينار التونسي'
        : isEn
          ? 'Custom Umrah · 3 Steps · Paid in TND'
          : 'Omra Sur-Mesure · 3 Étapes · 100% TND',
      title: isAr
        ? 'فصّل برنامج عمرتك على قياسك — بدون برامج مفروضة'
        : isEn
          ? 'Build Your Own Umrah Program in 3 Simple Steps'
          : 'Composez votre Omra sur mesure en 3 étapes simples',
      description: isAr
        ? 'اختار برنامج الطيران، غرفتك في فنادق مكة بالدينار التونسي، وإقامتك في المدينة المنورة حسب المتاح.'
        : 'Choisissez librement votre vol, votre chambre à La Mecque en Dinar Tunisien et votre hôtel à Médine.',
    },
    footer: {
      eyebrow: 'Easy2Book',
      title: 'Create. Publish. Convert.',
      description: isAr ? 'المركز الرسمي للحجوزات · www.easy2book.tn' : 'Centrale de Réservation · www.easy2book.tn',
    },
  };

  const specific = defaultsByType[type] ?? {};

  return {
    id,
    type,
    category: entry.category,
    name: entry.labels[language],
    anchorId: anchorByType[type],
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
      reelPreset: specific.reelPreset,
      customReelScript: specific.customReelScript,
      galleryImageKeys: specific.galleryImageKeys,
      videos: specific.videos,
      videoSettings: specific.videoSettings,
      primaryCtaLabel: specific.primaryCtaLabel,
      primaryCtaTarget: specific.primaryCtaTarget,
      secondaryCtaLabel: specific.secondaryCtaLabel,
      targetDateIso: specific.targetDateIso,
      items:
        specific.items ??
        (type === 'video_gallery'
          ? undefined
          : [
              {
                id: `${id}-1`,
                title: isAr ? 'العنصر الأول في هذا القسم' : 'Point clé 01',
                subtitle: isAr
                  ? 'يمكنك تعديل هذا النص من لوحة الخصائص.'
                  : 'Personnalisable depuis le panneau droit.',
              },
              {
                id: `${id}-2`,
                title: isAr ? 'العنصر الثاني في هذا القسم' : 'Point clé 02',
                subtitle: isAr
                  ? 'تصميم متجاوب بالكامل للكمبيوتر والهاتف.'
                  : 'Rendu responsive ordinateur, tablette et mobile.',
              },
            ]),
      whatsapp: specific.whatsapp,
    },
  };
}
