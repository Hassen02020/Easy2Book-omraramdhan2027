import { createDefaultBlock } from '../components/block-library/blockCatalog';
import {
  createDefaultBrandIdentity,
  createDefaultFooterConfig,
  createDefaultHeaderConfig,
  STYLE_PALETTE_PRESETS,
  UNIVERSAL_COMMERCE_MODULES,
} from './commerceModulesCatalog';
import { createDefaultCrmForm, createVersionSnapshot } from './creatorStore';
import { HERO_MEDIA_MAP, type HeroImageKey } from './mediaRegistry';
import type {
  BrandVisualStyle,
  BusinessUniverse,
  CommerceModuleId,
  CreatorLanguage,
  HeaderVariant,
  OfferReference,
  Page,
  PageBlock,
} from '../types/creator';

export interface FullPageGenerationRequest {
  prompt: string;
  language: CreatorLanguage;
  brandName: string;
  tagline?: string;
  logoSrc: string | null;
  visualStyle: BrandVisualStyle;
  headerVariant: HeaderVariant;
  commerceModules: CommerceModuleId[];
  includeVerifiedTestimonials: boolean;
  folderGroup?: string;
  linkedOfferRef?: OfferReference;
  contacts: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
}

interface BlueprintItem {
  title: string;
  subtitle: string;
  badge?: string;
}

export interface FullPageBlueprint {
  pageTitle: string;
  slug: string;
  universe: string;
  tagline: string;
  footerBio: string;
  headerCtaLabel: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    imageKey: string;
  };
  brandStory: {
    eyebrow: string;
    title: string;
    description: string;
    imageKey: string;
    items: BlueprintItem[];
  };
  offersShowcase: {
    eyebrow: string;
    title: string;
    description: string;
    items: BlueprintItem[];
  };
  whyChooseUs: {
    eyebrow: string;
    title: string;
    description: string;
    items: BlueprintItem[];
  };
  bookingProcess: {
    eyebrow: string;
    title: string;
    description: string;
    items: BlueprintItem[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    description: string;
    imageKeys: string[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: BlueprintItem[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
  };
  form: {
    title: string;
    subtitle: string;
    submitLabel: string;
    confirmationMessage: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  moduleOverrides?: {
    moduleId: string;
    title: string;
    description: string;
  }[];
}

function sanitizeImageKey(key: string | undefined, fallback: HeroImageKey): HeroImageKey {
  if (key && key in HERO_MEDIA_MAP) {
    return key as HeroImageKey;
  }
  return fallback;
}

function sanitizeUniverse(val: string | undefined): BusinessUniverse {
  if (val === 'omra' || val === 'voyages' || val === 'hotels_tunisie' || val === 'visa') {
    return val;
  }
  return 'voyages';
}

function slugify(raw: string): string {
  return (
    raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 42) || `page-${Date.now().toString(36)}`
  );
}

function buildLocalFallbackBlueprint(req: FullPageGenerationRequest): FullPageBlueprint {
  const isAr = req.language === 'ar';
  const isEn = req.language === 'en';
  const promptLower = req.prompt.toLowerCase();

  let detectedUniverse: BusinessUniverse = 'voyages';
  let heroImg: HeroImageKey = 'voyage_istanbul';
  let storyImg: HeroImageKey = 'dubai_skyline';

  if (
    promptLower.includes('omra') ||
    promptLower.includes('umrah') ||
    promptLower.includes('عمرة') ||
    promptLower.includes('makkah')
  ) {
    detectedUniverse = 'omra';
    heroImg = 'makkah_haram';
    storyImg = 'madinah_twilight';
  } else if (
    promptLower.includes('hôtel') ||
    promptLower.includes('hotel') ||
    promptLower.includes('resort') ||
    promptLower.includes('djerba') ||
    promptLower.includes('hammamet') ||
    promptLower.includes('فندق')
  ) {
    detectedUniverse = 'hotels_tunisie';
    heroImg = 'tunisia_resort';
    storyImg = 'djerba_thalasso';
  } else if (
    promptLower.includes('visa') ||
    promptLower.includes('schengen') ||
    promptLower.includes('تأشيرة')
  ) {
    detectedUniverse = 'visa';
    heroImg = 'visa_desk';
    storyImg = 'visa_europe';
  }

  if (req.linkedOfferRef) {
    detectedUniverse = req.linkedOfferRef.universe;
  }

  const brand = req.brandName.trim() || 'Easy2Book';
  const shortSummary = req.prompt.trim().slice(0, 140);

  return {
    pageTitle: req.linkedOfferRef?.displayLabel || (isAr ? `${brand} — بوابة السفر والحجوزات` : isEn ? `${brand} — Full Travel Experience` : `${brand} — Portail Voyage & Réservations`),
    slug: slugify(`${brand}-${detectedUniverse}`),
    universe: detectedUniverse,
    tagline: req.tagline?.trim() || (isAr ? 'رحلات، فنادق، عمرة وخدمات التأشيرة' : isEn ? 'Hotels, Organized Tours, Umrah & Visa Advisory' : 'Hôtels, Voyages, Omra & Accompagnement Visa'),
    footerBio: isAr
      ? `${brand} منصة متخصصة في تنظيم الأسفار، حجوزات الفنادق، رحلات العمرة ومرافقة ملفات التأشيرة بمعايير واضحة.`
      : isEn
        ? `${brand} curates stays, organized tours, Umrah departures and visa advisory with clear guidance.`
        : `${brand} accompagne vos séjours hôteliers, circuits organisés, départs Omra et dossiers Visa avec transparence.`,
    headerCtaLabel: isAr ? 'اطلب عرضك' : isEn ? 'Request Quote' : 'Demander un devis',
    hero: {
      eyebrow: `${brand} · ${req.visualStyle.toUpperCase()}`,
      title: isAr
        ? `تجربة سفر متكاملة وموثوقة مع ${brand}`
        : isEn
          ? `Tailored Travel & Stays Designed Around Your Goals`
          : `Des séjours et voyages organisés conçus avec exigence`,
      description:
        shortSummary ||
        (isAr
          ? 'حلول سفر شاملة تجمع بين الإقامة المختارة، التنظيم اللوجستي والمرافقة المباشرة.'
          : 'Une plateforme structurée réunissant hébergements vérifiés, circuits accompagnés et conseil personnalisé.'),
      primaryCtaLabel: isAr ? 'اطلب استشارة مجانية' : isEn ? 'Start Your Request' : 'Demander un devis personnalisé',
      imageKey: heroImg,
    },
    brandStory: {
      eyebrow: isAr ? 'من نحن' : isEn ? 'Our Identity' : 'Présentation & savoir-faire',
      title: isAr
        ? `لماذا يثق المسافرون في ${brand}`
        : isEn
          ? `Structured Guidance From First Inquiry To Return`
          : `Un accompagnement structuré de la demande jusqu’au retour`,
      description: isAr
        ? 'نحرص على وضوح البرنامج والشروط قبل التأكيد مع متابعة مستمرة عبر مستشار مختص.'
        : 'Chaque demande est étudiée selon vos dates, votre budget et vos préférences d’hébergement avant validation.',
      imageKey: storyImg,
      items: [
        {
          title: isAr ? 'عروض واضحة ومحددة' : isEn ? 'Verified Proposals' : 'Propositions vérifiées',
          subtitle: isAr ? 'معلومات دقيقة دون التباس في الشروط.' : 'Conditions détaillées et lisibles avant confirmation.',
          badge: '01',
        },
        {
          title: isAr ? 'متابعة مخصصة' : isEn ? 'Dedicated Advisors' : 'Conseillers dédiés',
          subtitle: isAr ? 'تواصل مباشر للعائلات والأفراد والمجموعات.' : 'Un suivi humain réactif pour familles, couples et groupes.',
          badge: '02',
        },
      ],
    },
    offersShowcase: {
      eyebrow: isAr ? 'الخدمات والعروض' : isEn ? 'Core Offerings' : 'Offres & Univers',
      title: isAr ? 'حلول متكاملة لجميع رحلاتك' : isEn ? 'Explore Our Core Travel Lines' : 'Nos domaines d’expertise',
      description: isAr
        ? 'تواصل معنا للحصول على التسعيرة الدقيقة حسب الفترة وعدد المسافرين.'
        : 'Les disponibilités et tarifs précis sont confirmés sur devis selon vos dates et votre configuration.',
      items: [
        {
          title: isAr ? 'الفنادق والإقامات' : isEn ? 'Hotels & Resorts' : 'Hôtels & Séjours sélectionnés',
          subtitle: isAr ? 'خيارات إقامة عائلية ومنتجعات مختارة.' : 'Établissements vérifiés selon votre formule.',
          badge: 'Sur devis / Catalogue',
        },
        {
          title: isAr ? 'الرحلات المنظمة والعمرة' : isEn ? 'Tours & Umrah' : 'Voyages organisés & Omra',
          subtitle: isAr ? 'برامج مؤطرة تشمل الطيران والإقامة والتنقلات.' : 'Forfaits structurés avec encadrement et transferts.',
          badge: 'Sur devis / Catalogue',
        },
        {
          title: isAr ? 'التأشيرة والتنقلات' : isEn ? 'Visa & Mobility' : 'Assistance Visa & Mobilité',
          subtitle: isAr ? 'تجهيز الملفات وتذاكر الطيران والتنقلات.' : 'Préparation de dossiers, billetterie et transferts.',
          badge: 'Sur devis / Catalogue',
        },
      ],
    },
    whyChooseUs: {
      eyebrow: isAr ? 'نقاط القوة' : isEn ? 'Why Choose Us' : 'Nos engagements qualité',
      title: isAr ? 'التزام بالوضوح وجودة الخدمة' : isEn ? 'Reliability At Every Milestone' : 'Pourquoi préparer votre projet avec nous',
      description: isAr
        ? 'نعتمد معايير واضحة في اختيار الشركاء وتوضيح التفاصيل.'
        : 'Des engagements vérifiables sans promesses exagérées.',
      items: [
        {
          title: isAr ? 'معلومات موثقة' : 'Transparence complète',
          subtitle: isAr ? 'عرض دقيق لما يشمله السفر وما لا يشمله.' : 'Détail clair des prestations incluses, horaires et conditions.',
          badge: '01',
        },
        {
          title: isAr ? 'مرونة الحلول' : 'Offres évolutives',
          subtitle: isAr ? 'تكييف البرنامج حسب رغبة العائلة أو المجموعة.' : 'Adaptation selon la durée, la ville de départ et la chambre.',
          badge: '02',
        },
        {
          title: isAr ? 'دعم مستمر' : 'Assistance réactive',
          subtitle: isAr ? 'مواكبة إدارية ولوجستية متواصلة.' : 'Coordination fluide avant, pendant et après votre séjour.',
          badge: '03',
        },
      ],
    },
    bookingProcess: {
      eyebrow: isAr ? 'مراحل الحجز' : isEn ? 'Booking Steps' : 'Comment ça fonctionne',
      title: isAr ? '4 خطوات سهلة للتأكيد' : isEn ? 'Four Clear Steps To Depart' : 'Votre parcours en 4 étapes',
      description: isAr ? 'مسار منظم يبدأ بطلبك وينتهي بتأكيد رحلتك.' : 'Un processus simple pour vérifier la disponibilité réelle avant engagement.',
      items: [
        { title: isAr ? '1. حدد طلبك' : '1. Exprimez votre besoin', subtitle: isAr ? 'الوجهة، التواريخ وعدد المسافرين.' : 'Destination, dates souhaitées et nombre de voyageurs.' },
        { title: isAr ? '2. مراجعة الإمكانية' : '2. Vérification catalogue', subtitle: isAr ? 'تأكيد التوفر من المصادر المعتمدة.' : 'Contrôle des disponibilités et proposition détaillée.' },
        { title: isAr ? '3. تأكيد الملف' : '3. Validation & Dossier', subtitle: isAr ? 'مراجعة الوثائق وتثبيت الحجز.' : 'Vérification des pièces et confirmation officielle.' },
        { title: isAr ? '4. انطلاق مريح' : '4. Voyage serein', subtitle: isAr ? 'استلام التذاكر والمستندات النهائية.' : 'Remise des documents et suivi jusqu’au retour.' },
      ],
    },
    gallery: {
      eyebrow: isAr ? 'معرض الصور' : isEn ? 'Visual Gallery' : 'Galerie Destinations',
      title: isAr ? 'لمحة من الوجهات والإقامات' : isEn ? 'Selected Destinations & Hotels' : 'Aperçu de nos destinations phares',
      description: isAr ? 'صور احترافية من مكتبة الوسائط.' : 'Visuels issus de la médiathèque Easy2Book.',
      imageKeys: [heroImg, storyImg, 'cairo_nile', 'sahara_tozeur'],
    },
    faq: {
      eyebrow: 'FAQ',
      title: isAr ? 'الأسئلة الشائعة' : isEn ? 'Frequently Asked Questions' : 'Questions fréquentes',
      description: isAr ? 'إجابات واضحة حول الإجراءات والتسعير.' : 'Réponses essentielles avant l’envoi de votre demande.',
      items: [
        {
          title: isAr ? 'كيف يتم تأكيد الأسعار والإمكانية؟' : isEn ? 'How are prices and availability confirmed?' : 'Comment sont confirmés les tarifs et disponibilités ?',
          subtitle: isAr ? 'تؤكد الإمكانية الفورية مباشرة بعد دراسة طلبك عبر النظام.' : 'Nos conseillers vérifient la disponibilité en temps réel selon vos dates exactes.',
        },
        {
          title: isAr ? 'هل يمكن تخصيص العرض للعائلات أو المجموعات؟' : isEn ? 'Can offers be tailored for families or groups?' : 'Les programmes sont-ils adaptables aux familles et groupes ?',
          subtitle: isAr ? 'نعم، يمكن تكييف الغرف والخدمات حسب عدد المسافرين.' : 'Oui, les chambres, transferts et formules sont ajustés selon la taille de votre groupe.',
        },
      ],
    },
    cta: {
      eyebrow: isAr ? 'جاهز للسفر؟' : isEn ? 'Ready To Plan?' : 'Prêt à lancer votre projet ?',
      title: isAr ? 'احصل على عرضك المخصص الآن' : isEn ? 'Receive Your Tailored Travel Proposal' : 'Recevez une proposition claire adaptée à vos dates',
      description: isAr ? 'فريقنا يجيبك بسرعة وبوضوح.' : 'Complétez le formulaire ci-dessous pour être recontacté.',
      primaryCtaLabel: isAr ? 'أرسل الطلب الآن' : isEn ? 'Send Request' : 'Compléter ma demande',
    },
    form: {
      title: isAr ? 'نموذج طلب عرض سفر' : isEn ? 'Travel Inquiry Form' : 'Demande de devis & disponibilité',
      subtitle: isAr ? 'املأ البيانات التالية وسيتواصل معك مستشارنا.' : 'Formulaire connecté à votre adaptateur CRM.',
      submitLabel: isAr ? 'إرسال الطلب' : isEn ? 'Submit Inquiry' : 'Envoyer ma demande',
      confirmationMessage: isAr ? 'شكراً لك، تم تسجيل طلبك بنجاح.' : 'Votre demande a bien été transmise.',
    },
    seo: {
      metaTitle: `${brand} — ${req.tagline || 'Voyages, Hôtels & Omra'}`,
      metaDescription: shortSummary || `Découvrez les services voyage de ${brand}.`,
    },
  };
}

export async function generateFullPageFromBrief(
  req: FullPageGenerationRequest
): Promise<{ page: Page; usedAi: boolean }> {
  let blueprint: FullPageBlueprint | null = null;
  let usedAi = false;

  try {
    const res = await fetch('/api/ai/generate-full-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: req.prompt,
        language: req.language,
        brandName: req.brandName,
        visualStyle: req.visualStyle,
        commerceModules: req.commerceModules,
        offerSummary: req.linkedOfferRef?.cachedSummary,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        blueprint?: FullPageBlueprint;
        source?: string;
      };
      if (data.blueprint && data.blueprint.hero && data.blueprint.brandStory) {
        blueprint = data.blueprint;
        usedAi = data.source === 'gemini';
      }
    }
  } catch {
    // Graceful fallback below
  }

  if (!blueprint) {
    blueprint = buildLocalFallbackBlueprint(req);
  }

  const universe = req.linkedOfferRef?.universe ?? sanitizeUniverse(blueprint.universe);
  const preset = STYLE_PALETTE_PRESETS[req.visualStyle];
  const brandIdentity = {
    ...createDefaultBrandIdentity({
      brandName: req.brandName,
      tagline: req.tagline || blueprint.tagline,
      logoSrc: req.logoSrc,
      visualStyle: req.visualStyle,
    }),
  };

  // Build dynamic anchor nav links matching generated sections
  const isAr = req.language === 'ar';
  const isEn = req.language === 'en';
  const navLinks = [
    {
      id: 'nav-pres',
      label: isAr ? 'من نحن' : isEn ? 'About' : 'Identité',
      target: '#presentation',
    },
    {
      id: 'nav-offers',
      label: isAr ? 'العروض' : isEn ? 'Offers' : 'Offres',
      target: '#offres',
    },
    {
      id: 'nav-benefits',
      label: isAr ? 'المزايا' : isEn ? 'Why Us' : 'Engagements',
      target: '#avantages',
    },
    {
      id: 'nav-galerie',
      label: isAr ? 'الصور' : isEn ? 'Gallery' : 'Galerie',
      target: '#galerie',
    },
    {
      id: 'nav-faq',
      label: isAr ? 'الأسئلة' : isEn ? 'FAQ' : 'FAQ',
      target: '#faq',
    },
  ];

  const header = createDefaultHeaderConfig({
    language: req.language,
    variant: req.headerVariant,
    whatsappNumber: req.contacts.whatsapp,
  });
  header.navLinks = navLinks;
  header.ctaLabel = blueprint.headerCtaLabel || header.ctaLabel;

  const footer = createDefaultFooterConfig({
    brandName: brandIdentity.brandName,
    language: req.language,
    description: blueprint.footerBio,
    phone: req.contacts.phone,
    whatsapp: req.contacts.whatsapp,
    email: req.contacts.email,
    address: req.contacts.address,
  });
  footer.navLinks = [
    { id: 'fn-top', label: isAr ? 'الرئيسية' : isEn ? 'Home' : 'Accueil', target: '#top' },
    ...navLinks,
  ];

  // Construct cohesive full-homepage blocks
  const blocks: PageBlock[] = [];

  // 1. Hero
  const hero = createDefaultBlock('hero_image', req.language);
  hero.anchorId = 'top';
  hero.style.backgroundColor = preset.primaryColor;
  hero.style.textColor = '#FFFFFF';
  hero.style.accentColor = preset.accentColor;
  hero.style.paddingY = 'spacious';
  hero.content = {
    eyebrow: blueprint.hero.eyebrow,
    title: blueprint.hero.title,
    description: blueprint.hero.description,
    primaryCtaLabel: blueprint.hero.primaryCtaLabel,
    primaryCtaTarget: '#form-block',
    imageKey: sanitizeImageKey(blueprint.hero.imageKey, 'voyage_istanbul'),
  };
  blocks.push(hero);

  // 2. Brand Story
  const story = createDefaultBlock('brand_story', req.language);
  story.anchorId = 'presentation';
  story.style.backgroundColor = preset.surfaceColor;
  story.style.textColor = preset.textColor;
  story.style.accentColor = preset.accentColor;
  story.content = {
    eyebrow: blueprint.brandStory.eyebrow,
    title: blueprint.brandStory.title,
    description: blueprint.brandStory.description,
    imageKey: sanitizeImageKey(blueprint.brandStory.imageKey, 'dubai_skyline'),
    items: (blueprint.brandStory.items ?? []).map((it, idx) => ({
      id: `bs-${idx}`,
      title: it.title,
      subtitle: it.subtitle,
      badge: it.badge,
    })),
  };
  blocks.push(story);

  // 3. Destinations / Offers Showcase
  const offers = createDefaultBlock('destinations_grid', req.language);
  offers.anchorId = 'offres';
  offers.style.backgroundColor = '#F5F7FA';
  offers.style.textColor = preset.textColor;
  offers.style.accentColor = preset.accentColor;
  offers.content = {
    eyebrow: blueprint.offersShowcase.eyebrow,
    title: blueprint.offersShowcase.title,
    description: blueprint.offersShowcase.description,
    items: (blueprint.offersShowcase.items ?? []).map((it, idx) => ({
      id: `off-${idx}`,
      title: it.title,
      subtitle: it.subtitle,
      badge: it.badge || 'Sur devis / Catalogue',
    })),
  };
  blocks.push(offers);

  // 4. Activated Universal Travel Commerce Modules (avoiding duplicate blockTypes)
  const insertedModuleBlockTypes = new Set<string>();
  for (const modId of req.commerceModules) {
    const def = UNIVERSAL_COMMERCE_MODULES.find((m) => m.id === modId);
    if (!def || insertedModuleBlockTypes.has(def.blockType)) continue;
    insertedModuleBlockTypes.add(def.blockType);

    const modBlock = createDefaultBlock(def.blockType, req.language);
    modBlock.anchorId = def.anchorId;
    modBlock.style.accentColor = preset.accentColor;
    modBlock.style.textColor = preset.textColor;
    const override = blueprint.moduleOverrides?.find((o) => o.moduleId === modId);
    if (override) {
      modBlock.content.title = override.title || modBlock.content.title;
      modBlock.content.description = override.description || modBlock.content.description;
    }
    blocks.push(modBlock);
  }

  // 5. Why Choose Us
  const why = createDefaultBlock('why_choose_us', req.language);
  why.anchorId = 'avantages';
  why.style.backgroundColor = preset.surfaceColor;
  why.style.textColor = preset.textColor;
  why.style.accentColor = preset.accentColor;
  why.content = {
    eyebrow: blueprint.whyChooseUs.eyebrow,
    title: blueprint.whyChooseUs.title,
    description: blueprint.whyChooseUs.description,
    items: (blueprint.whyChooseUs.items ?? []).map((it, idx) => ({
      id: `why-${idx}`,
      title: it.title,
      subtitle: it.subtitle,
      badge: it.badge,
    })),
  };
  blocks.push(why);

  // 6. Booking Process
  const process = createDefaultBlock('booking_process', req.language);
  process.anchorId = 'parcours';
  process.style.backgroundColor = '#F5F7FA';
  process.style.textColor = preset.textColor;
  process.style.accentColor = preset.accentColor;
  process.content = {
    eyebrow: blueprint.bookingProcess.eyebrow,
    title: blueprint.bookingProcess.title,
    description: blueprint.bookingProcess.description,
    items: (blueprint.bookingProcess.items ?? []).map((it, idx) => ({
      id: `bp-${idx}`,
      title: it.title,
      subtitle: it.subtitle,
    })),
  };
  blocks.push(process);

  // 7. Visual Gallery
  const gallery = createDefaultBlock('gallery', req.language);
  gallery.anchorId = 'galerie';
  gallery.style.backgroundColor = preset.surfaceColor;
  gallery.style.textColor = preset.textColor;
  gallery.style.accentColor = preset.accentColor;
  const safeGalleryKeys = (blueprint.gallery.imageKeys ?? [])
    .map((k) => sanitizeImageKey(k, 'voyage_istanbul'))
    .slice(0, 4);
  gallery.content = {
    eyebrow: blueprint.gallery.eyebrow,
    title: blueprint.gallery.title,
    description: blueprint.gallery.description,
    galleryImageKeys:
      safeGalleryKeys.length >= 2
        ? safeGalleryKeys
        : ['voyage_istanbul', 'tunisia_resort', 'dubai_skyline', 'makkah_haram'],
  };
  blocks.push(gallery);

  // 8. Verified Testimonials ONLY if user explicitly confirmed verified data
  if (req.includeVerifiedTestimonials) {
    const testi = createDefaultBlock('testimonials', req.language);
    testi.anchorId = 'temoignages';
    blocks.push(testi);
  }

  // 9. FAQ
  const faq = createDefaultBlock('faq', req.language);
  faq.anchorId = 'faq';
  faq.style.backgroundColor = '#F5F7FA';
  faq.style.textColor = preset.textColor;
  faq.style.accentColor = preset.accentColor;
  faq.content = {
    eyebrow: blueprint.faq.eyebrow,
    title: blueprint.faq.title,
    description: blueprint.faq.description,
    items: (blueprint.faq.items ?? []).map((it, idx) => ({
      id: `faq-${idx}`,
      title: it.title,
      subtitle: it.subtitle,
    })),
  };
  blocks.push(faq);

  // 10. Final CTA
  const cta = createDefaultBlock('cta', req.language);
  cta.style.backgroundColor = preset.primaryColor;
  cta.style.textColor = '#FFFFFF';
  cta.style.accentColor = preset.accentColor;
  cta.content = {
    eyebrow: blueprint.cta.eyebrow,
    title: blueprint.cta.title,
    description: blueprint.cta.description,
    primaryCtaLabel: blueprint.cta.primaryCtaLabel,
    primaryCtaTarget: '#form-block',
  };
  blocks.push(cta);

  // 11. CRM Lead Form
  const formBlock = createDefaultBlock('lead_form', req.language);
  formBlock.anchorId = 'form-block';
  blocks.push(formBlock);

  const formDef = createDefaultCrmForm(req.language);
  formDef.title = blueprint.form.title || formDef.title;
  formDef.subtitle = blueprint.form.subtitle || formDef.subtitle;
  formDef.submitLabel = blueprint.form.submitLabel || formDef.submitLabel;
  formDef.confirmationMessage =
    blueprint.form.confirmationMessage || formDef.confirmationMessage;

  const now = new Date().toISOString();
  const pageSlug = `${slugify(blueprint.slug)}-${Math.floor(10 + Math.random() * 89)}`;

  const page: Page = {
    id: `page-${Date.now().toString(36)}`,
    title: blueprint.pageTitle,
    universe,
    folderGroup: req.folderGroup?.trim() || undefined,
    creationMode: 'full_page',
    brandIdentity,
    header,
    footer,
    commerceModules: [...req.commerceModules],
    templateId: 'ai-full-page',
    language: req.language,
    isDemoData: false,
    createdAt: now,
    updatedAt: now,
    publication: { status: 'draft' },
    offerRef: req.linkedOfferRef ?? {
      externalOfferId: `EXT-${universe.toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      externalSourceName: 'Catalogue Central (Référence externe)',
      universe,
      offerCode: `E2B-FULL-${Math.floor(100 + Math.random() * 899)}`,
      displayLabel: blueprint.pageTitle,
      cachedSummary: {
        startingPriceLabel: 'Sur devis / Selon catalogue',
        datesOrValidity: 'Selon fiche offre externe',
        availabilityLabel: 'Confirmation conseiller',
        conditionsSummary: 'Page d’accueil complète générée (Mode A)',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: pageSlug,
      metaTitle: blueprint.seo.metaTitle || blueprint.pageTitle,
      metaDescription: blueprint.seo.metaDescription || blueprint.footerBio,
      ogTitle: blueprint.seo.metaTitle || blueprint.pageTitle,
      ogDescription: blueprint.seo.metaDescription || blueprint.footerBio,
      canonicalPath: `/p/${pageSlug}`,
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Studio Full Page Generator',
      utmSource: 'easy2book',
      utmMedium: 'homepage',
      utmCampaign: pageSlug,
      utmContent: usedAi ? 'gemini-mode-a' : 'structured-mode-a',
    },
    form: formDef,
    blocks,
    publishedVersion: null,
    versions: [],
  };

  page.versions.push(
    createVersionSnapshot(
      page,
      usedAi
        ? 'Génération IA Page Complète (Mode A)'
        : 'Génération structurée Page Complète (Mode A)',
      false
    )
  );

  return { page, usedAi };
}
