import { useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  CreditCard,
  FileCheck2,
  Globe2,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import {
  buildCrmSubmissionPayload,
  SimulatedCrmAdapter,
  type CrmAdapterDispatchResult,
  type CrmIntegrationConfig,
} from '../../integration-contracts/crmAdapter';
import { getHeroImageSrc, type HeroImageKey } from '../../lib/mediaRegistry';
import { RealFlagSvg, type CountryFlagCode } from '../../lib/realCountryFlags';
import type {
  AttributionSettings,
  BrandIdentity,
  BusinessUniverse,
  CreatorLanguage,
  OfferReference,
  PageBlock,
} from '../../types/creator';
import { WhatsAppIcon } from '../WhatsAppIcon';

const WHATSAPP_NUMBER = '21698140514';

export type WorldHotelPackageGroup = 'fast_no_visa' | 'winter_omra' | 'major_visa';

export type WorldHotelPurposeKey =
  | 'tourism'
  | 'omra'
  | 'visa_voucher'
  | 'business';

interface WorldDestinationItem {
  id: string;
  group: WorldHotelPackageGroup;
  flag: CountryFlagCode;
  imageKey: HeroImageKey;
  fr: string;
  en: string;
  ar: string;
  citiesFr: string;
  citiesAr: string;
  tagFr: string;
  tagAr: string;
}

const WORLD_DESTINATIONS: WorldDestinationItem[] = [
  // Pack 1: Sans Visa · Départ rapide
  {
    id: 'turkey',
    group: 'fast_no_visa',
    flag: 'TR',
    imageKey: 'turkey_istanbul_reel',
    fr: 'Turquie',
    en: 'Turkey',
    ar: 'تركيا',
    citiesFr: 'Istanbul · Antalya · Bursa',
    citiesAr: 'إسطنبول · أنطاليا · بورصا',
    tagFr: 'Sans visa · Départ rapide',
    tagAr: 'بلاش فيزا · سفر سريع',
  },
  {
    id: 'morocco',
    group: 'fast_no_visa',
    flag: 'MA',
    imageKey: 'marrakech_riad',
    fr: 'Maroc',
    en: 'Morocco',
    ar: 'المغرب',
    citiesFr: 'Marrakech · Casablanca · Tanger',
    citiesAr: 'مراكش · الدار البيضاء · طنجة',
    tagFr: 'Sans visa · Riads & 5★',
    tagAr: 'بلاش فيزا · رياضات و5★',
  },
  {
    id: 'malaysia',
    group: 'fast_no_visa',
    flag: 'MY',
    imageKey: 'world_hotels_malaysia_kuala',
    fr: 'Malaisie',
    en: 'Malaysia',
    ar: 'ماليزيا',
    citiesFr: 'Kuala Lumpur · Langkawi',
    citiesAr: 'كوالالمبور · لنكاوي',
    tagFr: 'Sans visa · Hôtels 5★',
    tagAr: 'بلاش فيزا · فنادق 5★',
  },
  {
    id: 'zanzibar',
    group: 'fast_no_visa',
    flag: 'TZ',
    imageKey: 'world_hotels_zanzibar_beach',
    fr: 'Zanzibar',
    en: 'Zanzibar',
    ar: 'زنجبار',
    citiesFr: 'Nungwi · Kendwa · Stone Town',
    citiesAr: 'نونغوي · كيندوا · ستون تاون',
    tagFr: 'Resorts plage turquoise',
    tagAr: 'منتجعات شاطئية فاخرة',
  },
  // Pack 2: Soleil d'hiver & Omra
  {
    id: 'saudi_omra',
    group: 'winter_omra',
    flag: 'SA',
    imageKey: 'makkah_haram',
    fr: 'Arabie Saoudite · Omra',
    en: 'Saudi Arabia · Umrah',
    ar: 'السعودية · العمرة',
    citiesFr: 'La Mecque · Médine · Djeddah',
    citiesAr: 'مكة المكرمة · المدينة المنورة',
    tagFr: 'Hôtels proches du Haram',
    tagAr: 'فنادق قريبة من الحرم',
  },
  {
    id: 'egypt',
    group: 'winter_omra',
    flag: 'EG',
    imageKey: 'egypt_pyramids_reel',
    fr: 'Égypte',
    en: 'Egypt',
    ar: 'مصر',
    citiesFr: 'Le Caire · Charm el-Cheikh · Hurghada',
    citiesAr: 'القاهرة · شرم الشيخ · الغردقة',
    tagFr: 'Soleil d’hiver & Nil',
    tagAr: 'شمس الشتاء والأهرامات',
  },
  {
    id: 'dubai',
    group: 'winter_omra',
    flag: 'AE',
    imageKey: 'dubai_skyline',
    fr: 'Dubaï & Émirats',
    en: 'Dubai & UAE',
    ar: 'دبي والإمارات',
    citiesFr: 'Downtown · Marina · Palm Jumeirah',
    citiesAr: 'برج خليفة · المارينا · النخلة',
    tagFr: 'Hôtels 4★ & 5★ TND',
    tagAr: 'فنادق 4★ و 5★ بالدينار',
  },
  // Pack 3: Grandes Destinations & Dossiers Visa
  {
    id: 'canada',
    group: 'major_visa',
    flag: 'CA',
    imageKey: 'world_hotels_canada_niagara',
    fr: 'Canada',
    en: 'Canada',
    ar: 'كندا',
    citiesFr: 'Montréal · Toronto · Niagara',
    citiesAr: 'مونتريال · تورونتو · نياغارا',
    tagFr: 'Voucher confirmé dossier Visa',
    tagAr: 'حجز مؤكد لدوسي فيزا كندا',
  },
  {
    id: 'europe_world',
    group: 'major_visa',
    flag: 'TN',
    imageKey: 'poster_visa_schengen_europe',
    fr: 'Europe & +500 000 hôtels',
    en: 'Europe & 500k+ Hotels',
    ar: 'أوروبا وأكثر من 500 ألف فندق',
    citiesFr: 'Paris · Rome · Madrid · Londres',
    citiesAr: 'باريس · روما · مدريد · لندن',
    tagFr: 'Voucher officiel dossier Visa',
    tagAr: 'Voucher رسمي لملفات الفيزا',
  },
];

const PACKAGE_TABS: {
  id: WorldHotelPackageGroup | 'all';
  fr: string;
  en: string;
  ar: string;
}[] = [
  {
    id: 'all',
    fr: 'Toutes les destinations (9)',
    en: 'All Destinations (9)',
    ar: 'كل الوجهات (9)',
  },
  {
    id: 'fast_no_visa',
    fr: '1 · Sans Visa (Départ rapide)',
    en: '1 · Visa-Free Fast Escape',
    ar: '1 · السفر السريع بلاش فيزا',
  },
  {
    id: 'winter_omra',
    fr: '2 · Omra & Soleil d’Hiver',
    en: '2 · Umrah & Winter Sun',
    ar: '2 · شمس الشتاء والعمرة',
  },
  {
    id: 'major_visa',
    fr: '3 · Canada, Europe & Dossiers Visa',
    en: '3 · Canada, Europe & Visa Files',
    ar: '3 · كندا وأوروبا وملفات الفيزا',
  },
];

const PURPOSE_OPTIONS: {
  id: WorldHotelPurposeKey;
  fr: string;
  en: string;
  ar: string;
}[] = [
  {
    id: 'tourism',
    fr: 'Séjour touristique / Vacances',
    en: 'Tourism & Leisure',
    ar: 'سياحة وعطلة',
  },
  {
    id: 'visa_voucher',
    fr: 'Dossier Visa (Voucher officiel confirmé)',
    en: 'Visa File (Confirmed Hotel Voucher)',
    ar: 'دوسي فيزا (Voucher حجز مؤكد)',
  },
  {
    id: 'omra',
    fr: 'Omra & Séjour La Mecque / Médine',
    en: 'Umrah (Makkah / Madinah)',
    ar: 'عمرة (مكة والمدينة المنورة)',
  },
  {
    id: 'business',
    fr: 'Déplacement professionnel / Affaires',
    en: 'Business Travel',
    ar: 'رحلة عمل ومؤتمر',
  },
];

interface WorldHotelsModuleBlockProps {
  block: PageBlock;
  pageId: string;
  universe: BusinessUniverse;
  language: CreatorLanguage;
  offerRef: OfferReference;
  attribution: AttributionSettings;
  crmConfig: CrmIntegrationConfig;
  brandIdentity?: BrandIdentity;
  interactiveEdit?: boolean;
}

export function WorldHotelsModuleBlock({
  block,
  pageId,
  universe,
  language,
  offerRef,
  attribution,
  crmConfig,
  brandIdentity,
  interactiveEdit = false,
}: WorldHotelsModuleBlockProps) {
  const isAr = language === 'ar';
  const isEn = language === 'en';
  const langKey = isAr ? 'ar' : isEn ? 'en' : 'fr';

  const cardRadiusClass =
    brandIdentity?.cardShape === 'sharp'
      ? 'rounded-none'
      : brandIdentity?.cardShape === 'rounded'
        ? 'rounded-2xl'
        : 'rounded-xl';

  const headingStyle: React.CSSProperties | undefined = brandIdentity?.headingFont
    ? { fontFamily: `"${brandIdentity.headingFont}", sans-serif` }
    : undefined;

  const [activeGroup, setActiveGroup] = useState<WorldHotelPackageGroup | 'all'>(
    'all'
  );
  const [selectedDestId, setSelectedDestId] = useState<string>('canada');
  const [customCity, setCustomCity] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [starRating, setStarRating] = useState<'3' | '4' | '5'>('4');
  const [purpose, setPurpose] = useState<WorldHotelPurposeKey>('visa_voucher');
  const [includeFlightTnd, setIncludeFlightTnd] = useState<boolean>(true);
  const [needOfficialVoucher, setNeedOfficialVoucher] = useState<boolean>(true);

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] =
    useState<CrmAdapterDispatchResult | null>(null);
  const [showPayloadJson, setShowPayloadJson] = useState<boolean>(false);

  const visibleDestinations = useMemo(() => {
    if (activeGroup === 'all') return WORLD_DESTINATIONS;
    return WORLD_DESTINATIONS.filter((d) => d.group === activeGroup);
  }, [activeGroup]);

  const selectedDest = useMemo(
    () =>
      WORLD_DESTINATIONS.find((d) => d.id === selectedDestId) ??
      WORLD_DESTINATIONS[0],
    [selectedDestId]
  );

  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  }, [checkIn, checkOut]);

  const selectedPurposeLabel =
    PURPOSE_OPTIONS.find((p) => p.id === purpose)?.[langKey] ?? purpose;

  const destinationSummary = customCity.trim()
    ? `${selectedDest[langKey]} (${customCity.trim()})`
    : `${selectedDest[langKey]} — ${isAr ? selectedDest.citiesAr : selectedDest.citiesFr}`;

  const whatsappHref = useMemo(() => {
    const lines = isAr
      ? [
          'مرحباً Easy2Book — طلب حجز فندق في العالم 100% بالدينار التونسي (TND)',
          `• الوجهة : ${destinationSummary}`,
          checkIn ? `• تاريخ الدخول : ${checkIn}` : '',
          checkOut ? `• تاريخ المغادرة : ${checkOut}${nightsCount ? ` (${nightsCount} ليالي)` : ''}` : '',
          `• الغرف والمسافرون : ${roomsCount} غرفة · ${adultsCount} بالغ${childrenCount > 0 ? ` · ${childrenCount} طفل` : ''}`,
          `• فئة الفندق : ${starRating}★`,
          `• الغرض : ${selectedPurposeLabel}`,
          includeFlightTnd ? '• يشمل حجز تذكرة الطائرة بالدينار التونسي (TND)' : '',
          needOfficialVoucher
            ? '• مطلوب Voucher رسمي ومؤكد (للسفر أو ملف الفيزا)'
            : '',
          fullName.trim() ? `• الاسم : ${fullName.trim()}` : '',
          notes.trim() ? `• ملاحظات : ${notes.trim()}` : '',
          '💳 الخلاص 100% بالدينار التونسي بدون كارت دوفيز ودون المساس بالمنحة السياحية.',
        ]
      : isEn
        ? [
            'Hello Easy2Book — Worldwide Hotel Booking Request (100% in TND)',
            `• Destination: ${destinationSummary}`,
            checkIn ? `• Check-in: ${checkIn}` : '',
            checkOut ? `• Check-out: ${checkOut}${nightsCount ? ` (${nightsCount} nights)` : ''}` : '',
            `• Rooms & Guests: ${roomsCount} room(s) · ${adultsCount} adult(s)${childrenCount > 0 ? ` · ${childrenCount} child(ren)` : ''}`,
            `• Hotel Category: ${starRating}★`,
            `• Purpose: ${selectedPurposeLabel}`,
            includeFlightTnd ? '• Include return flight in TND' : '',
            needOfficialVoucher ? '• Official confirmed hotel Voucher requested' : '',
            fullName.trim() ? `• Traveler: ${fullName.trim()}` : '',
            notes.trim() ? `• Notes: ${notes.trim()}` : '',
          ]
        : [
            'Bonjour Easy2Book — Demande Hôtels dans le Monde 100% en Dinar Tunisien (TND)',
            `• Destination : ${destinationSummary}`,
            checkIn ? `• Arrivée : ${checkIn}` : '',
            checkOut ? `• Départ : ${checkOut}${nightsCount ? ` (${nightsCount} nuits)` : ''}` : '',
            `• Chambres & Voyageurs : ${roomsCount} ch. · ${adultsCount} adulte(s)${childrenCount > 0 ? ` · ${childrenCount} enfant(s)` : ''}`,
            `• Catégorie souhaitée : ${starRating}★`,
            `• Motif : ${selectedPurposeLabel}`,
            includeFlightTnd ? '• Option Vol + Hôtel en Dinar Tunisien (TND)' : '',
            needOfficialVoucher
              ? '• Voucher officiel confirmé demandé (voyage / dossier Visa)'
              : '',
            fullName.trim() ? `• Voyageur : ${fullName.trim()}` : '',
            notes.trim() ? `• Remarques : ${notes.trim()}` : '',
            '💳 Paiement 100% en TND sans carte devise et sans toucher l’allocation touristique.',
          ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.filter(Boolean).join('\n')
    )}`;
  }, [
    adultsCount,
    checkIn,
    checkOut,
    childrenCount,
    destinationSummary,
    fullName,
    includeFlightTnd,
    isAr,
    isEn,
    needOfficialVoucher,
    nightsCount,
    notes,
    roomsCount,
    selectedPurposeLabel,
    starRating,
  ]);

  const handleSelectDestination = (dest: WorldDestinationItem) => {
    setSelectedDestId(dest.id);
    if (dest.id === 'saudi_omra') {
      setPurpose('omra');
    } else if (dest.group === 'major_visa') {
      setPurpose('visa_voucher');
      setNeedOfficialVoucher(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interactiveEdit) return;
    setFormError(null);

    if (!fullName.trim() || !phone.trim()) {
      setFormError(
        isAr
          ? 'يرجى إدخال الاسم الكامل ورقم الهاتف / واتساب.'
          : isEn
            ? 'Please enter your full name and phone / WhatsApp number.'
            : 'Veuillez renseigner votre nom complet et votre numéro de téléphone / WhatsApp.'
      );
      return;
    }

    if (!checkIn) {
      setFormError(
        isAr
          ? 'يرجى تحديد تاريخ الدخول للفندق.'
          : isEn
            ? 'Please select your hotel check-in date.'
            : 'Veuillez sélectionner votre date d’arrivée à l’hôtel.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const summary = [
        `[HOTELS MONDE TND · ${destinationSummary}]`,
        `Dates: ${checkIn}${checkOut ? ` -> ${checkOut}` : ''}${nightsCount ? ` (${nightsCount} nuits)` : ''}`,
        `Config: ${roomsCount} ch · ${adultsCount} ad · ${childrenCount} enf · ${starRating}★`,
        `Motif: ${selectedPurposeLabel}`,
        `Vol TND: ${includeFlightTnd ? 'Oui' : 'Non'} · Voucher Visa: ${needOfficialVoucher ? 'Oui' : 'Non'}`,
        `Paiement: 100% TND (Sans carte devise / Sans allocation touristique)`,
        notes.trim() ? `Notes: ${notes.trim()}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const payload = buildCrmSubmissionPayload({
        pageId,
        offerId: offerRef.externalOfferId || 'WORLD-HOTELS-TND-500K',
        businessUniverse: universe,
        pageLanguage: language,
        formId: `module-world-hotels-${block.id}`,
        attribution,
        includeUtm: crmConfig.includeUtmAttribution,
        fields: {
          fullName: fullName.trim(),
          phoneWhatsapp: phone.trim(),
          email: email.trim(),
          region: destinationSummary,
          travelersCount: Math.max(1, adultsCount + childrenCount),
          requestedDeparture: `${checkIn}${checkOut ? ` → ${checkOut}` : ''}`,
          message: summary,
          consent: true,
        },
      });

      const result = await SimulatedCrmAdapter.submitLeadForm(
        payload,
        crmConfig
      );
      setDispatchResult(result);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      onClick={(e) => {
        if (!interactiveEdit) e.stopPropagation();
      }}
      className={`${cardRadiusClass} border border-[#102D45]/12 bg-white text-[#102D45] shadow-xs overflow-hidden`}
    >
      {/* Top Hero Header Band */}
      <div className="bg-[#102D45] px-6 py-6 text-white">
        <div className="grid gap-5 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#F6D365]">
              <Globe2 className="h-3.5 w-3.5" />
              <span>
                {block.content.eyebrow ||
                  (isAr
                    ? '+500,000 فندق في العالم · الخلاص 100% بالدينار التونسي (TND)'
                    : isEn
                      ? '+500,000 Hotels Worldwide · 100% Paid in Tunisian Dinar (TND)'
                      : '+500 000 Hôtels dans le Monde · Paiement 100% en Dinar Tunisien (TND)')}
              </span>
            </div>
            <h2
              style={headingStyle}
              className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight"
            >
              {block.content.title ||
                (isAr
                  ? 'احجز فندقك في أي دولة في العالم بالدينار التونسي من غير كارت دوفيز'
                  : isEn
                    ? 'Book Worldwide Hotels in TND — No Foreign Card Needed'
                    : 'Réservez votre hôtel partout dans le monde en Dinar Tunisien (TND)')}
            </h2>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {block.content.description ||
                (isAr
                  ? 'عمرة السعودية، مصر، كندا، تركيا، المغرب، دبي، ماليزيا وزنجبار — احصل على Voucher رسمي ومؤكد في الحين لرحلتك أو لملف الفيزا بدون ما تمس منحتك السياحية.'
                  : 'Arabie Saoudite (Omra), Égypte, Canada, Turquie, Maroc, Dubaï, Malaisie & Zanzibar — recevez votre Voucher officiel confirmé immédiatement sans toucher à votre allocation touristique.')}
            </p>

            {/* Real Flag Strip of Featured World Destinations */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {(
                ['SA', 'EG', 'CA', 'TR', 'MA', 'AE', 'MY', 'TZ', 'TN'] as CountryFlagCode[]
              ).map((code) => (
                <RealFlagSvg
                  key={code}
                  code={code}
                  className="h-4 w-6 rounded-[2px] border border-white/25"
                />
              ))}
            </div>
          </div>

          {/* Right Key Guarantees Card */}
          <div className="lg:col-span-4 rounded-xl border border-[#E7B34C]/35 bg-white/8 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#F6D365]">
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>
                {isAr
                  ? 'الخلاص 100% بالدينار التونسي (TND)'
                  : isEn
                    ? '100% Paid in Tunisian Dinar (TND)'
                    : '100% en Dinar Tunisien (TND)'}
              </span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-200">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E7B34C]" />
                <span>
                  {isAr
                    ? 'بدون كارت دوفيز وبدون المساس بالمنحة السياحية'
                    : 'Sans carte devise · Allocation touristique préservée'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E7B34C]" />
                <span>
                  {isAr
                    ? 'Voucher رسمي ومؤكد فوري (مقبول في ملفات فيزا كندا وأوروبا)'
                    : 'Voucher officiel confirmé (valable dossiers Visa Canada & Europe)'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E7B34C]" />
                <span>
                  {isAr
                    ? 'أكثر من 500,000 فندق + إمكانية دمج تذكرة الطائرة'
                    : '+500 000 hôtels + option Vol A/R inclus'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Module Body */}
      <div className="p-6 md:p-7 space-y-6">
        {/* Step 1: 3-Package Filter + Destination Cards with Real Photos & Flags */}
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C4967]">
              {isAr
                ? '1 · اختر وجهتك أو الباقة المناسبة لجوّك'
                : isEn
                  ? '1 · Select Your Destination or Travel Pack'
                  : '1 · Choisissez votre destination (3 gammes monde)'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PACKAGE_TABS.map((tab) => {
                const active = activeGroup === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveGroup(tab.id)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      active
                        ? 'bg-[#102D45] text-white'
                        : 'bg-[#F5F7FA] text-[#1C4967] hover:text-[#102D45]'
                    }`}
                  >
                    {tab[langKey]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleDestinations.map((dest) => {
              const active = selectedDestId === dest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectDestination(dest)}
                  className={`group flex items-center gap-3 rounded-xl border p-2.5 text-start transition-all ${
                    active
                      ? 'border-[#C8922A] bg-[#FFFDF7] ring-1 ring-[#C8922A]/40'
                      : 'border-[#102D45]/12 bg-[#FAF9F6] hover:border-[#C8922A]/60 hover:bg-white'
                  }`}
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#102D45]">
                    <img
                      src={getHeroImageSrc(dest.imageKey)}
                      alt={dest[langKey]}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 start-1">
                      <RealFlagSvg
                        code={dest.flag}
                        className="h-3.5 w-5 rounded-[2px] border border-white/60 shadow-xs"
                      />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#102D45] truncate">
                      {dest[langKey]}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-600 truncate">
                      {isAr ? dest.citiesAr : dest.citiesFr}
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-[#9A6E1B] truncate">
                      {isAr ? dest.tagAr : dest.tagFr}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {dispatchResult ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="space-y-1">
                  <p className="text-sm font-extrabold">
                    {isAr
                      ? 'تم تسجيل طلب حجز الفندق بالدينار التونسي بنجاح!'
                      : isEn
                        ? 'Your Worldwide Hotel (TND) booking request is logged!'
                        : 'Votre demande Hôtel Monde en Dinar Tunisien (TND) est enregistrée !'}
                  </p>
                  <p className="text-xs text-emerald-900">
                    {isAr
                      ? `الوجهة: ${destinationSummary} · سيتواصل معك مستشار Easy2Book لإرسال عروض الفنادق بالدينار وإصدار الـ Voucher المؤكد.`
                      : `Destination : ${destinationSummary} · Un conseiller Easy2Book vous transmet les meilleurs tarifs en TND et votre Voucher officiel confirmé.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#1FB857]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>
                  {isAr
                    ? 'متابعة الحجز فوراً عبر واتساب (98 140 514)'
                    : 'Finaliser sur WhatsApp (98 140 514)'}
                </span>
              </a>
              <button
                type="button"
                onClick={() => setShowPayloadJson((s) => !s)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3.5 py-2.5 text-xs font-bold text-[#102D45]"
              >
                <Code2 className="h-3.5 w-3.5 text-[#1C4967]" />
                <span>
                  {showPayloadJson
                    ? isAr
                      ? 'إخفاء بيانات CRM'
                      : 'Masquer JSON CRM'
                    : isAr
                      ? 'عرض بيانات CRM'
                      : 'Inspecter JSON CRM'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDispatchResult(null);
                  setShowPayloadJson(false);
                }}
                className="text-xs font-bold text-[#1C4967] underline"
              >
                {isAr ? 'حجز وجهة أخرى' : 'Nouvelle recherche'}
              </button>
            </div>

            {showPayloadJson && (
              <pre
                dir="ltr"
                className="max-h-72 overflow-auto rounded-xl bg-[#102D45] p-4 font-mono text-[11px] text-slate-100"
              >
                {JSON.stringify(dispatchResult.payload, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
            {/* Step 2: Stay Details & Dates */}
            <div className="space-y-3.5 border-t border-[#102D45]/10 pt-5">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1C4967]">
                <Building2 className="h-3.5 w-3.5 text-[#C8922A]" />
                <span>
                  {isAr
                    ? '2 · تفاصيل الإقامة، التواريخ وفئة الفندق'
                    : isEn
                      ? '2 · Stay Dates, City & Hotel Category'
                      : '2 · Dates de séjour, ville & catégorie d’hôtel'}
                </span>
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'المدينة أو اسم الفندق (اختياري)'
                      : isEn
                        ? 'Specific City or Hotel'
                        : 'Ville précise ou nom d’hôtel'}
                  </label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder={
                      isAr ? selectedDest.citiesAr : selectedDest.citiesFr
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#C8922A]" />
                      {isAr ? 'تاريخ الدخول' : isEn ? 'Check-in' : 'Date d’arrivée'}
                    </span>{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono-tabular text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#C8922A]" />
                      {isAr
                        ? 'تاريخ المغادرة'
                        : isEn
                          ? 'Check-out'
                          : 'Date de départ'}
                    </span>
                    {nightsCount !== null && (
                      <span className="ms-1.5 font-mono-tabular text-[11px] text-[#9A6E1B]">
                        ({nightsCount} {isAr ? 'ليالي' : isEn ? 'nights' : 'nuits'})
                      </span>
                    )}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || undefined}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono-tabular text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[#C8922A]" />
                      {isAr
                        ? 'تصنيف الفندق'
                        : isEn
                          ? 'Hotel Rating'
                          : 'Catégorie hôtel'}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['3', '4', '5'] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setStarRating(tier)}
                        className={`rounded-lg border py-2 text-xs font-extrabold transition-colors ${
                          starRating === tier
                            ? 'border-[#102D45] bg-[#102D45] text-[#F6D365]'
                            : 'border-[#102D45]/15 bg-[#F5F7FA] text-[#102D45] hover:border-[#C8922A]'
                        }`}
                      >
                        {tier}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr ? 'عدد الغرف' : isEn ? 'Rooms' : 'Chambres'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={roomsCount}
                    onChange={(e) =>
                      setRoomsCount(
                        Math.max(1, Math.min(10, Number(e.target.value) || 1))
                      )
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono-tabular text-sm font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr ? 'عدد البالغين' : isEn ? 'Adults' : 'Adultes'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={adultsCount}
                    onChange={(e) =>
                      setAdultsCount(
                        Math.max(1, Math.min(20, Number(e.target.value) || 1))
                      )
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono-tabular text-sm font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr ? 'الأطفال' : isEn ? 'Children' : 'Enfants'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={childrenCount}
                    onChange={(e) =>
                      setChildrenCount(
                        Math.max(0, Math.min(10, Number(e.target.value) || 0))
                      )
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono-tabular text-sm font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Purpose & TND Options */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-bold text-[#102D45]">
                  {isAr
                    ? 'غرض الحجز'
                    : isEn
                      ? 'Booking Purpose'
                      : 'Objectif de votre réservation'}
                </label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {PURPOSE_OPTIONS.map((opt) => {
                    const active = purpose === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPurpose(opt.id)}
                        className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition-colors text-start ${
                          active
                            ? 'border-[#102D45] bg-[#102D45] text-white'
                            : 'border-[#102D45]/15 bg-[#F5F7FA] text-[#102D45] hover:border-[#C8922A]'
                        }`}
                      >
                        {opt[langKey]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-2.5 rounded-xl border border-[#102D45]/12 bg-[#FAF9F6] p-3 text-xs text-[#102D45] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needOfficialVoucher}
                    onChange={(e) => setNeedOfficialVoucher(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#102D45]"
                  />
                  <span className="flex items-start gap-1.5">
                    <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C8922A]" />
                    <span>
                      <strong>
                        {isAr
                          ? 'إصدار Voucher رسمي ومؤكد'
                          : 'Voucher officiel confirmé'}
                      </strong>{' '}
                      {isAr
                        ? '— معتمد لدعم ملفات فيزا كندا وأوروبا.'
                        : '— prêt à joindre à votre dossier Visa (Canada, Europe).'}
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 rounded-xl border border-[#102D45]/12 bg-[#FAF9F6] p-3 text-xs text-[#102D45] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFlightTnd}
                    onChange={(e) => setIncludeFlightTnd(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#102D45]"
                  />
                  <span className="flex items-start gap-1.5">
                    <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#1C4967]" />
                    <span>
                      <strong>
                        {isAr
                          ? 'إضافة حجز الطائرة بالدينار التونسي'
                          : 'Ajouter le billet d’avion en TND'}
                      </strong>{' '}
                      {isAr
                        ? '— طيران + فندق في عملية خلاص واحدة.'
                        : '— Vol + Hôtel réglés ensemble en Dinar Tunisien.'}
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Step 3: Traveler Coordinates */}
            <div className="space-y-3 border-t border-[#102D45]/10 pt-5">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1C4967]">
                <Users className="h-3.5 w-3.5 text-[#C8922A]" />
                <span>
                  {isAr
                    ? '3 · بيانات المسافر لتلقي العرض بالدينار والـ Voucher'
                    : isEn
                      ? '3 · Contact Details for TND Quote & Voucher'
                      : '3 · Vos coordonnées pour recevoir le devis TND & Voucher'}
                </span>
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr ? 'الاسم الكامل' : isEn ? 'Full Name' : 'Nom complet'}{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isAr ? 'الاسم واللقب' : 'Ex : Karim Ben Salem'}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'الهاتف / واتساب'
                      : isEn
                        ? 'Phone / WhatsApp'
                        : 'Téléphone / WhatsApp'}{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+216 98 140 514"
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'البريد الإلكتروني (لاستلام Voucher)'
                      : isEn
                        ? 'Email (for Voucher)'
                        : 'E-mail (réception Voucher)'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voyageur@email.com"
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                  {isAr
                    ? 'تفاصيل إضافية (قريب من الحرم، إطلالة بحر، ميزانية بالدينار...)'
                    : 'Précisions (proximité Haram, petit-déjeuner, budget en TND...)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: أريد فندق 4 نجوم في مونتريال مع Voucher مؤكد لملف فيزا كندا...'
                      : 'Ex : Hôtel 4★ centre Montréal avec Voucher officiel pour dossier Visa Canada...'
                  }
                  className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {formError && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800">
                {formError}
              </p>
            )}

            {/* Submit & WhatsApp Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#102D45]/10 pt-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <ShieldCheck className="h-4 w-4 text-[#1C4967] shrink-0" />
                <span>
                  {isAr
                    ? 'Easy2Book.tn · حجز آمن 100% بالدينار التونسي · 98 140 514'
                    : 'Easy2Book.tn · Paiement 100% TND sans carte devise · 98 140 514'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => interactiveEdit && e.preventDefault()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2.5 text-xs font-extrabold text-[#128C43] hover:bg-[#25D366]/18 whitespace-nowrap"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>
                    {isAr ? 'احجز عبر واتساب' : 'Réserver sur WhatsApp'}
                  </span>
                </a>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: brandIdentity?.ctaColor ?? '#102D45',
                    color: brandIdentity?.ctaTextColor ?? '#FFFFFF',
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold shadow-xs transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {submitting
                      ? isAr
                        ? 'جاري إرسال الطلب...'
                        : 'Envoi en cours...'
                      : block.content.primaryCtaLabel ||
                        (isAr
                          ? 'اطلب عرضك بالدينار التونسي (TND)'
                          : 'Demander mon tarif en TND & Voucher')}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
