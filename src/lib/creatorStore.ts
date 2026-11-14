import type {
  BlockType,
  CreatorLanguage,
  Page,
  PageBlock,
  PageStatus,
  PageTemplate,
  PageVersion,
} from '../types/creator';
import { createDefaultBlock } from '../components/block-library/blockCatalog';

export function clonePageData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createPageFromTemplate(params: {
  template: PageTemplate;
  title: string;
  slug: string;
  language?: CreatorLanguage;
  folderGroup?: string;
  externalOfferId?: string;
  offerLabel?: string;
}): Page {
  const now = new Date().toISOString();
  const lang = params.language ?? params.template.defaultLanguage;
  const id = `page-${Date.now().toString(36)}`;
  const blocks = clonePageData(params.template.defaultBlocks);
  const form = clonePageData(params.template.defaultForm);

  const page: Page = {
    id,
    title: params.title,
    universe: params.template.universe,
    folderGroup:
      params.folderGroup?.trim() ||
      params.template.recommendedGroup ||
      (params.template.universe === 'omra' ? 'Ramadan 2027' : undefined),
    templateId: params.template.id,
    language: lang,
    isDemoData: true,
    createdAt: now,
    updatedAt: now,
    publication: {
      status: 'draft',
    },
    offerRef: {
      externalOfferId: params.externalOfferId || `EXT-${params.template.universe.toUpperCase()}-NEW`,
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
      metaTitle: `Easy2Book — ${params.title}`,
      metaDescription: params.template.description,
      ogTitle: `Easy2Book — ${params.title}`,
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
    }),
  };
}

export function addBlockToPage(page: Page, type: BlockType): Page {
  const block = createDefaultBlock(type, page.language);
  const footerIdx = page.blocks.findIndex((b) => b.type === 'footer');
  const nextBlocks = [...page.blocks];
  if (footerIdx >= 0) {
    nextBlocks.splice(footerIdx, 0, block);
  } else {
    nextBlocks.push(block);
  }
  return {
    ...page,
    blocks: nextBlocks,
    updatedAt: new Date().toISOString(),
  };
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
  const fresh = createDefaultBlock(target.type, page.language);
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
  // Important: updating draft never mutates `page.publishedVersion`
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
