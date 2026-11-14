export type CreatorLanguage = 'fr' | 'en' | 'ar';

export type BusinessUniverse = 'omra' | 'voyages' | 'hotels_tunisie' | 'visa';

export type CreationMode = 'full_page' | 'modules';

export type BrandVisualStyle =
  | 'premium'
  | 'moderne'
  | 'luxe'
  | 'minimaliste'
  | 'familial'
  | 'commercial';

export type HeaderVariant =
  | 'corporate'
  | 'premium'
  | 'touristique'
  | 'minimaliste'
  | 'hotelier';

export type CommerceModuleId =
  | 'omra'
  | 'voyages'
  | 'hotels'
  | 'visa'
  | 'flights'
  | 'ferries'
  | 'transfers'
  | 'excursions'
  | 'car_rental'
  | 'travel_insurance'
  | 'cruises'
  | 'vip_concierge';

export type PageStatus =
  | 'draft'
  | 'in_review'
  | 'scheduled'
  | 'published'
  | 'expired'
  | 'archived';

export type BlockCategory =
  | 'common'
  | 'omra'
  | 'voyages'
  | 'hotels_tunisie'
  | 'visa'
  | 'commerce';

export type BlockType =
  // 15 existing Common blocks + 4 Full-Homepage structural sections
  | 'hero_image'
  | 'hero_video'
  | 'presentation'
  | 'brand_story'
  | 'destinations_grid'
  | 'why_choose_us'
  | 'booking_process'
  | 'gallery'
  | 'benefits'
  | 'services'
  | 'pricing'
  | 'product_cards'
  | 'testimonials'
  | 'faq'
  | 'countdown'
  | 'cta'
  | 'lead_form'
  | 'whatsapp_button'
  | 'footer'
  // Omra blocks
  | 'omra_departure_overview'
  | 'omra_program'
  | 'omra_hotels'
  | 'omra_room_rates'
  | 'omra_services'
  | 'omra_dates'
  | 'omra_conditions'
  | 'omra_practical_info'
  // Voyages blocks
  | 'voyage_destination'
  | 'voyage_itinerary'
  | 'voyage_day_by_day'
  | 'voyage_gallery'
  | 'voyage_dates'
  | 'voyage_pricing'
  | 'voyage_inclusions'
  // Hotels blocks
  | 'hotel_card'
  | 'hotel_gallery'
  | 'hotel_amenities'
  | 'hotel_promo'
  | 'hotel_stay_period'
  | 'hotel_pricing'
  | 'hotel_conditions'
  // Visa blocks
  | 'visa_overview'
  | 'visa_countries'
  | 'visa_types'
  | 'visa_conditions'
  | 'visa_documents'
  | 'visa_steps'
  | 'visa_faq'
  // Universal Travel Commerce Modules
  | 'module_hotels_search'
  | 'module_flights'
  | 'module_ferries'
  | 'module_transfers'
  | 'module_excursions'
  | 'module_car_rental'
  | 'module_travel_insurance'
  | 'module_cruises_vip';

export type LocalizedText = Record<CreatorLanguage, string>;

export interface BrandIdentity {
  brandName: string;
  tagline?: string;
  /** Real uploaded/selected logo path or data URL; null triggers clean provisional typographic brand mark */
  logoSrc: string | null;
  isProvisionalLogo: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  ctaColor: string;
  ctaTextColor: string;
  surfaceColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  imageStyle: 'rounded' | 'editorial' | 'full_bleed';
  cardShape: 'sharp' | 'soft' | 'rounded';
  iconStyle: 'outline' | 'duotone' | 'solid';
  spacingScale: 'compact' | 'balanced' | 'spacious';
  visualStyle: BrandVisualStyle;
}

export interface HeaderNavLink {
  id: string;
  label: string;
  target: string;
}

export interface PageHeaderConfig {
  enabled: boolean;
  variant: HeaderVariant;
  sticky: boolean;
  showLogo: boolean;
  showBrandName: boolean;
  navLinks: HeaderNavLink[];
  ctaLabel: string;
  ctaTarget: string;
  showWhatsapp: boolean;
  whatsappNumber: string;
  whatsappLabel: string;
}

export interface PageFooterConfig {
  enabled: boolean;
  showLogo: boolean;
  companyDescription: string;
  navLinks: HeaderNavLink[];
  /** Empty strings mean unconfigured -> automatically hidden in public render & flagged in editor */
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  legalLinks: {
    termsLabel?: string;
    termsUrl?: string;
    privacyLabel?: string;
    privacyUrl?: string;
  };
  copyrightText: string;
}

export interface BlockResponsiveVisibility {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
}

export interface BlockStyleSettings {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  alignment: 'left' | 'center' | 'right';
  paddingY: 'compact' | 'normal' | 'spacious';
  fontSizeScale: 'sm' | 'md' | 'lg';
  borderStyle: 'none' | 'hairline' | 'accent';
}

export interface BlockListItem {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  badge?: string;
}

export interface WhatsAppActionConfig {
  enabled: boolean;
  phoneNumber: string;
  buttonLabel: string;
  prefilledMessage: string;
  trackAsCrmLead: false; // Strictly false per architecture specification
}

export interface PageBlock {
  id: string;
  type: BlockType;
  category: BlockCategory;
  name: string;
  /** Optional HTML anchor id (e.g. 'presentation', 'offres', 'faq') linked from PageHeaderConfig */
  anchorId?: string;
  visible: boolean;
  visibility: BlockResponsiveVisibility;
  style: BlockStyleSettings;
  content: {
    eyebrow: string;
    title: string;
    description: string;
    imageKey?: string;
    galleryImageKeys?: string[];
    primaryCtaLabel?: string;
    primaryCtaTarget?: string;
    secondaryCtaLabel?: string;
    targetDateIso?: string;
    items?: BlockListItem[];
    whatsapp?: WhatsAppActionConfig;
  };
}

export type PageSection = PageBlock;

export type FormFieldKey =
  | 'fullName'
  | 'phoneWhatsapp'
  | 'email'
  | 'region'
  | 'travelersCount'
  | 'requestedDeparture'
  | 'message'
  | 'consent';

export interface FormFieldConfig {
  key: FormFieldKey;
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
}

export interface FormDefinition {
  formId: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  confirmationMessage: string;
  fields: FormFieldConfig[];
}

export interface OfferReference {
  externalOfferId: string;
  externalSourceName: string;
  universe: BusinessUniverse;
  offerCode: string;
  displayLabel: string;
  /** Read-only cached preview from external catalog (never authoritative source of truth) */
  cachedSummary: {
    startingPriceLabel: string;
    datesOrValidity: string;
    availabilityLabel: string;
    conditionsSummary: string;
  };
  syncMode: 'external_reference' | 'manual_preview_stub';
}

export interface SEOSettings {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  canonicalPath: string;
  noIndex: boolean;
}

export interface AttributionSettings {
  acquisitionSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

export interface PublicationSettings {
  status: PageStatus;
  scheduledAt?: string;
  expiresAt?: string;
  publishedAt?: string;
  publishedBy?: string;
}

export interface PageVersionSnapshot {
  blocks: PageBlock[];
  form: FormDefinition;
  seo: SEOSettings;
  attribution: AttributionSettings;
  offerRef: OfferReference;
  language: CreatorLanguage;
  title: string;
  folderGroup?: string;
  creationMode?: CreationMode;
  brandIdentity?: BrandIdentity;
  header?: PageHeaderConfig;
  footer?: PageFooterConfig;
  commerceModules?: CommerceModuleId[];
}

export interface PageVersion {
  versionId: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  note: string;
  isPublishedSnapshot: boolean;
  snapshot: PageVersionSnapshot;
}

export interface Page {
  id: string;
  title: string;
  universe: BusinessUniverse;
  /** Arborescence / dossier métier (ex: "Ramadan 2027" dans le module Omra) */
  folderGroup?: string;
  isPilotPage?: boolean;
  pilotRenderer?: 'omra_ramadan_2027';
  creationMode?: CreationMode;
  brandIdentity?: BrandIdentity;
  header?: PageHeaderConfig;
  footer?: PageFooterConfig;
  commerceModules?: CommerceModuleId[];
  templateId: string;
  language: CreatorLanguage;
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
  publication: PublicationSettings;
  offerRef: OfferReference;
  seo: SEOSettings;
  attribution: AttributionSettings;
  form: FormDefinition;
  blocks: PageBlock[];
  /** Live published snapshot remains isolated until explicitly republished */
  publishedVersion: PageVersion | null;
  versions: PageVersion[];
}

export interface PageTemplate {
  id: string;
  name: string;
  universe: BusinessUniverse;
  description: string;
  styleTag: string;
  trendSegment?: string;
  targetAudience?: string;
  recommendedGroup?: string;
  supportedLanguages: CreatorLanguage[];
  defaultLanguage: CreatorLanguage;
  previewImageKey: string;
  defaultBlocks: PageBlock[];
  defaultForm: FormDefinition;
}

export interface MediaAsset {
  id: string;
  title: string;
  universe: BusinessUniverse | 'all';
  src: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  tags: string[];
  isDemoAsset: boolean;
}

export interface CreatorNotification {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  kind: 'autosave' | 'expiry' | 'publication' | 'scheduled';
  pageId?: string;
}

export interface CreatorSettings {
  defaultLanguage: CreatorLanguage;
  defaultWhatsappNumber: string;
  defaultVoiceId?: string;
  autoSaveEnabled: boolean;
  crmIntegration: {
    endpointUrl: string;
    mode: 'simulated_adapter' | 'configured_webhook';
    timeoutMs: number;
    includeUtmAttribution: boolean;
  };
}

export interface CreatorState {
  pages: Page[];
  templates: PageTemplate[];
  media: MediaAsset[];
  notifications: CreatorNotification[];
  settings: CreatorSettings;
}
