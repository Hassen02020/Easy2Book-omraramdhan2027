import type { BusinessUniverse, CreatorLanguage, PageStatus } from '../types/creator';

export interface StudioStrings {
  studioTitle: string;
  studioSubtitle: string;
  signature: string;
  demoBadge: string;
  searchPlaceholder: string;
  notificationsTitle: string;
  userRoleLabel: string;
  nav: {
    dashboard: string;
    allPages: string;
    createPage: string;
    templates: string;
    blockLibrary: string;
    mediaLibrary: string;
    drafts: string;
    published: string;
    archives: string;
    settings: string;
  };
  kpis: {
    totalPages: string;
    publishedPages: string;
    drafts: string;
    scheduledPages: string;
    expiringSoon: string;
    recentlyModified: string;
  };
  universes: Record<BusinessUniverse, { label: string; summary: string; cta: string }>;
  statuses: Record<PageStatus, string>;
  actions: {
    newPage: string;
    edit: string;
    preview: string;
    publish: string;
    unpublish: string;
    duplicate: string;
    archive: string;
    save: string;
    restore: string;
  };
}

export const STUDIO_I18N: Record<CreatorLanguage, StudioStrings> = {
  fr: {
    studioTitle: 'Landing Page Studio',
    studioSubtitle:
      'Créez des expériences commerciales qui transforment vos offres en demandes clients.',
    signature: 'Create. Publish. Convert.',
    demoBadge: 'Données de démonstration',
    searchPlaceholder: 'Rechercher une page, un slug ou une offre...',
    notificationsTitle: 'Notifications du Creator',
    userRoleLabel: 'Studio Builder · Mode démo',
    nav: {
      dashboard: "Vue d'ensemble",
      allPages: 'Toutes les pages',
      createPage: 'Créer une page',
      templates: 'Modèles',
      blockLibrary: 'Bibliothèque de blocs',
      mediaLibrary: 'Médias',
      drafts: 'Brouillons',
      published: 'Pages publiées',
      archives: 'Archives',
      settings: 'Paramètres du Creator',
    },
    kpis: {
      totalPages: 'Nombre total de pages',
      publishedPages: 'Pages publiées',
      drafts: 'Brouillons',
      scheduledPages: 'Pages programmées',
      expiringSoon: 'Expirant prochainement',
      recentlyModified: 'Modifiées récemment',
    },
    universes: {
      omra: {
        label: 'Omra',
        summary: 'Omra toute l’année, Ramadan, vacances scolaires & départs individuels',
        cta: 'Créer une page Omra',
      },
      voyages: {
        label: 'Voyages organisés',
        summary: 'Destinations, circuits, groupes, séjours & départs saisonniers',
        cta: 'Créer une page Voyage',
      },
      hotels_tunisie: {
        label: 'Hôtels Tunisie',
        summary: 'Hôtels, promotions multiples, formules et tarifs saisonniers',
        cta: 'Créer une page Hôtel',
      },
      visa: {
        label: 'Services Visa',
        summary: 'Pays, types de visa, pièces à fournir & étapes administratives',
        cta: 'Créer une page Visa',
      },
    },
    statuses: {
      draft: 'Brouillon',
      in_review: 'En révision',
      scheduled: 'Programmée',
      published: 'Publiée',
      expired: 'Expirée',
      archived: 'Archivée',
    },
    actions: {
      newPage: 'Créer une nouvelle page',
      edit: 'Ouvrir l’éditeur',
      preview: 'Prévisualiser',
      publish: 'Publier',
      unpublish: 'Dépublier',
      duplicate: 'Dupliquer',
      archive: 'Archiver',
      save: 'Enregistrer',
      restore: 'Restaurer',
    },
  },
  en: {
    studioTitle: 'Landing Page Studio',
    studioSubtitle:
      'Build commercial experiences that turn travel offers into client inquiries.',
    signature: 'Create. Publish. Convert.',
    demoBadge: 'Demo dataset',
    searchPlaceholder: 'Search a page, slug or offer...',
    notificationsTitle: 'Creator Notifications',
    userRoleLabel: 'Studio Builder · Demo mode',
    nav: {
      dashboard: 'Overview',
      allPages: 'All Pages',
      createPage: 'Create Page',
      templates: 'Templates',
      blockLibrary: 'Block Library',
      mediaLibrary: 'Media Library',
      drafts: 'Drafts',
      published: 'Published Pages',
      archives: 'Archives',
      settings: 'Creator Settings',
    },
    kpis: {
      totalPages: 'Total Pages',
      publishedPages: 'Published Pages',
      drafts: 'Drafts',
      scheduledPages: 'Scheduled Pages',
      expiringSoon: 'Expiring Soon',
      recentlyModified: 'Recently Modified',
    },
    universes: {
      omra: {
        label: 'Umrah',
        summary: 'Year-round Umrah, Ramadan, school holidays & individual departures',
        cta: 'Create Umrah Page',
      },
      voyages: {
        label: 'Organized Tours',
        summary: 'Destinations, circuits, group trips, stays & seasonal departures',
        cta: 'Create Tour Page',
      },
      hotels_tunisie: {
        label: 'Tunisia Hotels',
        summary: 'Hotels, concurrent promotions, board formulas & seasonal deals',
        cta: 'Create Hotel Page',
      },
      visa: {
        label: 'Visa Services',
        summary: 'Countries, visa types, document checklists & processing steps',
        cta: 'Create Visa Page',
      },
    },
    statuses: {
      draft: 'Draft',
      in_review: 'In Review',
      scheduled: 'Scheduled',
      published: 'Published',
      expired: 'Expired',
      archived: 'Archived',
    },
    actions: {
      newPage: 'Create New Page',
      edit: 'Open Editor',
      preview: 'Preview',
      publish: 'Publish',
      unpublish: 'Unpublish',
      duplicate: 'Duplicate',
      archive: 'Archive',
      save: 'Save',
      restore: 'Restore',
    },
  },
  ar: {
    studioTitle: 'Landing Page Studio',
    studioSubtitle:
      'أنشئ تجارب تجارية احترافية تحوّل عروضكم إلى طلبات عملاء حقيقية.',
    signature: 'Create. Publish. Convert.',
    demoBadge: 'بيانات تجريبية',
    searchPlaceholder: 'ابحث عن صفحة أو رابط أو عرض...',
    notificationsTitle: 'إشعارات الاستوديو',
    userRoleLabel: 'محرر الصفحات · وضع تجريبي',
    nav: {
      dashboard: 'نظرة عامة',
      allPages: 'جميع الصفحات',
      createPage: 'إنشاء صفحة',
      templates: 'القوالب',
      blockLibrary: 'مكتبة الكتل',
      mediaLibrary: 'الوسائط',
      drafts: 'المسودات',
      published: 'الصفحات المنشورة',
      archives: 'الأرشيف',
      settings: 'إعدادات المنشئ',
    },
    kpis: {
      totalPages: 'إجمالي الصفحات',
      publishedPages: 'الصفحات المنشورة',
      drafts: 'المسودات',
      scheduledPages: 'صفحات مجدولة',
      expiringSoon: 'تنتهي قريباً',
      recentlyModified: 'معدلة حديثاً',
    },
    universes: {
      omra: {
        label: 'العمرة',
        summary: 'عمرة على مدار السنة، رمضان، العطل المدرسية والرحلات الفردية',
        cta: 'إنشاء صفحة عمرة',
      },
      voyages: {
        label: 'الرحلات المنظمة',
        summary: 'وجهات، مسارات سياحية، مجموعات، إقامات ورحلات موسمية',
        cta: 'إنشاء صفحة رحلة',
      },
      hotels_tunisie: {
        label: 'فنادق تونس',
        summary: 'فنادق، عروض ترويجية متعددة، صيغ إقامة وأسعار موسمية',
        cta: 'إنشاء صفحة فندق',
      },
      visa: {
        label: 'خدمات التأشيرة',
        summary: 'دول، أنواع التأشيرات، قائمة الوثائق ومراحل المعالجة الإدارية',
        cta: 'إنشاء صفحة تأشيرة',
      },
    },
    statuses: {
      draft: 'مسودة',
      in_review: 'قيد المراجعة',
      scheduled: 'مجدولة',
      published: 'منشورة',
      expired: 'منتهية',
      archived: 'مؤرشفة',
    },
    actions: {
      newPage: 'إنشاء صفحة جديدة',
      edit: 'فتح المحرر',
      preview: 'معاينة',
      publish: 'نشر',
      unpublish: 'إلغاء النشر',
      duplicate: 'نسخ',
      archive: 'أرشفة',
      save: 'حفظ',
      restore: 'استعادة',
    },
  },
};
