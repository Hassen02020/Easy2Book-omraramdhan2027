import type {
  BlockType,
  BrandIdentity,
  BusinessUniverse,
  CommerceModuleId,
  CreationMode,
  CreatorLanguage,
  FormDefinition,
  Page,
  PageBlock,
  PageFooterConfig,
  PageHeaderConfig,
  PageStatus,
  PageTemplate,
  PageVersion,
} from '../types/creator';
import { createDefaultBlock } from '../components/block-library/blockCatalog';
import {
  createDefaultBrandIdentity,
  createDefaultFooterConfig,
  createDefaultHeaderConfig,
  UNIVERSAL_COMMERCE_MODULES,
} from './commerceModulesCatalog';

export function clonePageData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createDefaultCrmForm(language: CreatorLanguage): FormDefinition {
  const isAr = language === 'ar';
  const isEn = language === 'en';
  return {
    formId: `form-${Date.now().toString(36)}`,
    title: isAr
      ? 'أرسل طلبك أو استفسارك'
      : isEn
        ? 'Request a tailored proposal'
        : 'Recevez votre proposition personnalisée',
    subtitle: isAr
      ? 'فريقنا يتواصل معك لتأكيد التواريخ والإمكانية.'
      : isEn
        ? 'Our advisors confirm live availability and conditions.'
        : 'Nos conseillers vérifient les disponibilités et vous répondent rapidement.',
    submitLabel: isAr
      ? 'إرسال الطلب'
      : isEn
        ? 'Send Request'
        : 'Envoyer ma demande',
    confirmationMessage: isAr
      ? 'تم تسجيل طلبك بنجاح وسيتم التواصل معك قريباً.'
      : isEn
        ? 'Your inquiry has been submitted successfully.'
        : 'Votre demande a bien été transmise à notre équipe.',
    fields: [
      {
        key: 'fullName',
        label: isAr ? 'الاسم الكامل' : isEn ? 'Full Name' : 'Nom complet',
        placeholder: isAr ? 'مثال: أمين بن صالح' : 'Ex: Amine Ben Salah',
        enabled: true,
        required: true,
      },
      {
        key: 'phoneWhatsapp',
        label: isAr ? 'الهاتف / واتساب' : isEn ? 'Phone / WhatsApp' : 'Téléphone / WhatsApp',
        placeholder: '+216 ...',
        enabled: true,
        required: true,
      },
      {
        key: 'email',
        label: isAr ? 'البريد الإلكتروني' : 'Email',
        placeholder: 'nom@exemple.com',
        enabled: true,
        required: false,
      },
      {
        key: 'travelersCount',
        label: isAr ? 'عدد المسافرين' : isEn ? 'Travelers' : 'Nombre de voyageurs',
        placeholder: '2',
        enabled: true,
        required: true,
      },
      {
        key: 'requestedDeparture',
        label: isAr ? 'التواريخ أو الوجهة المطلوبة' : isEn ? 'Preferred Dates / Destination' : 'Dates ou destination souhaitée',
        placeholder: isAr ? 'مثال: منتصف ديسمبر - 7 ليالٍ' : 'Ex: Juin 2027 · 7 nuits',
        enabled: true,
        required: false,
      },
      {
        key: 'message',
        label: isAr ? 'ملاحظات إضافية' : isEn ? 'Additional notes' : 'Précisions complémentaires',
        placeholder: isAr ? 'تفضيلات الغرف أو الخدمات...' : 'Préférences de chambre, prestations...',
        enabled: true,
        required: false,
      },
      {
        key: 'consent',
        label: isAr
          ? 'أوافق على التواصل معي بخصوص هذا الطلب'
          : isEn
            ? 'I agree to be contacted regarding this inquiry'
            : 'J’accepte d’être recontacté au sujet de cette demande',
        placeholder: '',
        enabled: true,
        required: true,
      },
    ],
  };
}

export function createPageFromTemplate(params: {
  template: PageTemplate;
  title: string;
  slug: string;
  language?: CreatorLanguage;
  folderGroup?: string;
  externalOfferId?: string;
  offerLabel?: string;
  creationMode?: CreationMode;
  brandIdentity?: BrandIdentity;
  header?: PageHeaderConfig;
  footer?: PageFooterConfig;
  commerceModules?: CommerceModuleId[];
}): Page {
  const now = new Date().toISOString();
  const lang = params.language ?? params.template.defaultLanguage;
  const id = `page-${Date.now().toString(36)}`;
  const blocks = clonePageData(params.template.defaultBlocks);
  const form = clonePageData(params.template.defaultForm);

  const brandIdentity =
    params.brandIdentity ??
    createDefaultBrandIdentity({ brandName: 'Easy2Book' });
  const header =
    params.header ??
    createDefaultHeaderConfig({ language: lang, variant: 'premium' });
  const footer =
    params.footer ??
    createDefaultFooterConfig({
      brandName: brandIdentity.brandName,
      language: lang,
    });

  const page: Page = {
    id,
    title: params.title,
    universe: params.template.universe,
    folderGroup:
      params.folderGroup?.trim() ||
      params.template.recommendedGroup ||
      (params.template.universe === 'omra' ? 'Ramadan 2027' : undefined),
    creationMode: params.creationMode ?? 'modules',
    brandIdentity,
    header,
    footer,
    commerceModules: params.commerceModules ?? [],
    templateId: params.template.id,
    language: lang,
    isDemoData: true,
    createdAt: now,
    updatedAt: now,
    publication: {
      status: 'draft',
    },
    offerRef: {
      externalOfferId:
        params.externalOfferId ||
        `EXT-${params.template.universe.toUpperCase()}-NEW`,
      externalSourceName: 'Catalogue Central Easy2Book (Référence externe)',
      universe: params.template.universe,
      offerCode: `E2B-${params.template.universe.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      displayLabel: params.offerLabel || params.title,
      cachedSummary: {
        startingPriceLabel: 'Alimenté par catalogue externe',
        datesOrValidity: 'Selon fiche offre externe',
        availabilityLabel: 'Synchronisé à l’intégration',
        conditionsSummary: 'Référence externe non dupliquée',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: params.slug,
      metaTitle: `${brandIdentity.brandName} — ${params.title}`,
      metaDescription: params.template.description,
      ogTitle: `${brandIdentity.brandName} — ${params.title}`,
      ogDescription: params.template.description,
      canonicalPath: `/p/${params.slug}`,
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Meta Ads',
      utmSource: 'facebook',
      utmMedium: 'paid_social',
      utmCampaign: params.slug,
      utmContent: 'v1',
    },
    form,
    blocks,
    publishedVersion: null,
    versions: [],
  };

  page.versions.push(
    createVersionSnapshot(page, 'Création initiale depuis modèle', false)
  );
  return page;
}

export function createBlankModularPage(params: {
  title: string;
  slug: string;
  universe: BusinessUniverse;
  language: CreatorLanguage;
  brandName?: string;
  folderGroup?: string;
}): Page {
  const now = new Date().toISOString();
  const id = `page-${Date.now().toString(36)}`;
  const brandName = params.brandName?.trim() || 'Easy2Book';
  const brandIdentity = createDefaultBrandIdentity({ brandName });
  const header = createDefaultHeaderConfig({
    language: params.language,
    variant: 'premium',
  });
  const footer = createDefaultFooterConfig({
    brandName,
    language: params.language,
  });

  const starterHero = createDefaultBlock('hero_image', params.language);
  starterHero.style.backgroundColor = brandIdentity.primaryColor;
  starterHero.style.textColor = '#FFFFFF';
  starterHero.style.accentColor = brandIdentity.accentColor;

  const starterForm = createDefaultBlock('lead_form', params.language);

  const page: Page = {
    id,
    title: params.title,
    universe: params.universe,
    folderGroup: params.folderGroup?.trim() || undefined,
    creationMode: 'modules',
    brandIdentity,
    header,
    footer,
    commerceModules: [],
    templateId: 'blank-modular',
    language: params.language,
    isDemoData: true,
    createdAt: now,
    updatedAt: now,
    publication: { status: 'draft' },
    offerRef: {
      externalOfferId: `EXT-${params.universe.toUpperCase()}-MOD`,
      externalSourceName: 'Catalogue Central (Référence externe)',
      universe: params.universe,
      offerCode: `E2B-${params.universe.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      displayLabel: params.title,
      cachedSummary: {
        startingPriceLabel: 'Sur devis / Catalogue externe',
        datesOrValidity: 'Selon fiche offre externe',
        availabilityLabel: 'Vérification conseiller',
        conditionsSummary: 'Page modulaire évolutive',
      },
      syncMode: 'external_reference',
    },
    seo: {
      slug: params.slug,
      metaTitle: `${brandName} — ${params.title}`,
      metaDescription: `Page commerciale modulaire ${brandName}`,
      ogTitle: `${brandName} — ${params.title}`,
      ogDescription: `Page commerciale modulaire ${brandName}`,
      canonicalPath: `/p/${params.slug}`,
      noIndex: false,
    },
    attribution: {
      acquisitionSource: 'Studio Direct',
      utmSource: 'direct',
      utmMedium: 'landing_page',
      utmCampaign: params.slug,
      utmContent: 'v1',
    },
    form: createDefaultCrmForm(params.language),
    blocks: [starterHero, starterForm],
    publishedVersion: null,
    versions: [],
  };

  page.versions.push(
    createVersionSnapshot(page, 'Création page vierge (Mode B)', false)
  );
  return page;
}

export function createVersionSnapshot(
  page: Page,
  note: string,
  isPublishedSnapshot: boolean
): PageVersion {
  const nextNumber = (page.versions[0]?.versionNumber ?? 0) + 1;
  return {
    versionId: `ver-${Date.now().toString(36)}-${nextNumber}`,
    versionNumber: nextNumber,
    createdAt: new Date().toISOString(),
    createdBy: 'Studio Editor (Démo)',
    note,
    isPublishedSnapshot,
    snapshot: clonePageData({
      blocks: page.blocks,
      form: page.form,
      seo: page.seo,
      attribution: page.attribution,
      offerRef: page.offerRef,
      language: page.language,
      title: page.title,
      folderGroup: page.folderGroup,
      creationMode: page.creationMode,
      brandIdentity: page.brandIdentity,
      header: page.header,
      footer: page.footer,
      commerceModules: page.commerceModules,
    }),
  };
}

export function addBlockToPage(page: Page, type: BlockType): Page {
  const block = createDefaultBlock(type, page.language, page.universe);
  const formIdx = page.blocks.findIndex((b) => b.type === 'lead_form');
  const footerIdx = page.blocks.findIndex((b) => b.type === 'footer');
  const insertAt =
    type === 'lead_form' || type === 'footer'
      ? footerIdx >= 0
        ? footerIdx
        : page.blocks.length
      : formIdx >= 0
        ? formIdx
        : footerIdx >= 0
          ? footerIdx
          : page.blocks.length;

  const nextBlocks = [...page.blocks];
  nextBlocks.splice(insertAt, 0, block);
  return {
    ...page,
    blocks: nextBlocks,
    updatedAt: new Date().toISOString(),
  };
}

export function toggleCommerceModuleOnPage(
  page: Page,
  moduleId: CommerceModuleId
): Page {
  const def = UNIVERSAL_COMMERCE_MODULES.find((m) => m.id === moduleId);
  if (!def) return page;

  const currentModules = page.commerceModules ?? [];
  const isActive = currentModules.includes(moduleId);

  if (isActive) {
    const remainingModules = currentModules.filter((m) => m !== moduleId);
    // Keep shared blockType if another active module still maps to it
    const stillNeedsBlock = remainingModules.some((mId) => {
      const other = UNIVERSAL_COMMERCE_MODULES.find((x) => x.id === mId);
      return other?.blockType === def.blockType;
    });
    return {
      ...page,
      commerceModules: remainingModules,
      blocks: stillNeedsBlock
        ? page.blocks
        : page.blocks.filter((b) => b.type !== def.blockType),
      updatedAt: new Date().toISOString(),
    };
  }

  let updatedPage: Page = {
    ...page,
    commerceModules: [...currentModules, moduleId],
    updatedAt: new Date().toISOString(),
  };

  const hasBlockAlready = updatedPage.blocks.some(
    (b) => b.type === def.blockType
  );
  if (!hasBlockAlready) {
    updatedPage = addBlockToPage(updatedPage, def.blockType);
    // Custom anchor id aligned with module catalog
    const addedIdx = updatedPage.blocks.findIndex(
      (b) => b.type === def.blockType
    );
    if (addedIdx >= 0) {
      updatedPage.blocks[addedIdx] = {
        ...updatedPage.blocks[addedIdx],
        anchorId: def.anchorId,
      };
    }
  }
  return updatedPage;
}

export function moveBlockInPage(
  page: Page,
  blockId: string,
  direction: 'up' | 'down'
): Page {
  const idx = page.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) return page;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= page.blocks.length) return page;

  const next = [...page.blocks];
  const [moved] = next.splice(idx, 1);
  next.splice(targetIdx, 0, moved);
  return {
    ...page,
    blocks: next,
    updatedAt: new Date().toISOString(),
  };
}

export function duplicateBlockInPage(page: Page, blockId: string): Page {
  const idx = page.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) return page;
  const copy = clonePageData(page.blocks[idx]);
  copy.id = `${copy.type}-copy-${Math.random().toString(36).slice(2, 6)}`;
  copy.name = `${copy.name} (Copie)`;
  const next = [...page.blocks];
  next.splice(idx + 1, 0, copy);
  return {
    ...page,
    blocks: next,
    updatedAt: new Date().toISOString(),
  };
}

export function removeBlockFromPage(page: Page, blockId: string): Page {
  return {
    ...page,
    blocks: page.blocks.filter((b) => b.id !== blockId),
    updatedAt: new Date().toISOString(),
  };
}

export function resetBlockInPage(page: Page, blockId: string): Page {
  const target = page.blocks.find((b) => b.id === blockId);
  if (!target) return page;
  const fresh = createDefaultBlock(target.type, page.language, page.universe);
  fresh.id = target.id;
  return {
    ...page,
    blocks: page.blocks.map((b) => (b.id === blockId ? fresh : b)),
    updatedAt: new Date().toISOString(),
  };
}

export function updateBlockInPage(
  page: Page,
  blockId: string,
  updater: (block: PageBlock) => PageBlock
): Page {
  return {
    ...page,
    blocks: page.blocks.map((b) => (b.id === blockId ? updater(b) : b)),
    updatedAt: new Date().toISOString(),
  };
}

export function saveDraftVersion(page: Page, note = 'Sauvegarde brouillon'): Page {
  const version = createVersionSnapshot(page, note, false);
  return {
    ...page,
    updatedAt: version.createdAt,
    versions: [version, ...page.versions].slice(0, 20),
  };
}

export function publishPageSnapshot(page: Page): Page {
  const now = new Date().toISOString();
  const version = createVersionSnapshot(
    page,
    `Publication v${(page.versions[0]?.versionNumber ?? 0) + 1}`,
    true
  );
  return {
    ...page,
    updatedAt: now,
    publication: {
      ...page.publication,
      status: 'published',
      publishedAt: now,
      publishedBy: 'Studio Editor (Démo)',
    },
    publishedVersion: version,
    versions: [version, ...page.versions].slice(0, 20),
  };
}

export function setPageLifecycleStatus(page: Page, status: PageStatus): Page {
  return {
    ...page,
    updatedAt: new Date().toISOString(),
    publication: {
      ...page.publication,
      status,
    },
  };
}

export function restorePageFromVersion(page: Page, versionId: string): Page {
  const target = page.versions.find((v) => v.versionId === versionId);
  if (!target) return page;

  const snap = clonePageData(target.snapshot);
  const restored: Page = {
    ...page,
    title: snap.title,
    language: snap.language,
    folderGroup: snap.folderGroup ?? page.folderGroup,
    creationMode: snap.creationMode ?? page.creationMode,
    brandIdentity: snap.brandIdentity ?? page.brandIdentity,
    header: snap.header ?? page.header,
    footer: snap.footer ?? page.footer,
    commerceModules: snap.commerceModules ?? page.commerceModules,
    blocks: snap.blocks,
    form: snap.form,
    seo: snap.seo,
    attribution: snap.attribution,
    offerRef: snap.offerRef,
    updatedAt: new Date().toISOString(),
  };
  const restoreLog = createVersionSnapshot(
    restored,
    `Restauration de la version v${target.versionNumber}`,
    false
  );
  return {
    ...restored,
    versions: [restoreLog, ...page.versions].slice(0, 20),
  };
}

export function duplicatePageEntity(page: Page): Page {
  const now = new Date().toISOString();
  const copy = clonePageData(page);
  const suffix = Math.floor(100 + Math.random() * 899);
  copy.id = `page-${Date.now().toString(36)}`;
  copy.title = `${page.title} (Copie)`;
  copy.seo.slug = `${page.seo.slug}-${suffix}`;
  copy.seo.canonicalPath = `/p/${copy.seo.slug}`;
  copy.createdAt = now;
  copy.updatedAt = now;
  copy.publication = { status: 'draft' };
  copy.publishedVersion = null;
  copy.versions = [
    createVersionSnapshot(copy, `Duplication depuis "${page.title}"`, false),
  ];
  return copy;
}
