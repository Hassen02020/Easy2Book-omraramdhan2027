import { useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Code2,
  MessageCircle,
  Plane,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  buildCrmSubmissionPayload,
  SimulatedCrmAdapter,
  type CrmAdapterDispatchResult,
  type CrmIntegrationConfig,
} from '../../integration-contracts/crmAdapter';
import { getHeroImageSrc } from '../../lib/mediaRegistry';
import { RealFlagSvg } from '../../lib/realCountryFlags';
import type {
  AttributionSettings,
  BusinessUniverse,
  CreatorLanguage,
  OfferReference,
  PageBlock,
} from '../../types/creator';

interface OmraSurMesureModuleBlockProps {
  block: PageBlock;
  pageId?: string;
  universe?: BusinessUniverse;
  language: CreatorLanguage;
  offerRef?: OfferReference;
  attribution?: AttributionSettings;
  crmConfig?: CrmIntegrationConfig;
  interactiveEdit?: boolean;
  onEditBlockField?: (
    field: 'eyebrow' | 'title' | 'description',
    value: string
  ) => void;
}

const MAKKAH_TIERS = [
  {
    id: 'makkah_5_haram',
    labelAr: '5★ مطل على الحرم (0–150م)',
    labelFr: '5★ Vue Haram (0–150m)',
    noteAr: 'إطلالة مباشرة وراحة قصوى للصلوات',
    noteFr: 'Vue panoramique Kaaba & accès immédiat',
  },
  {
    id: 'makkah_5_close',
    labelAr: '5★ قريب من الساحة (200–450م)',
    labelFr: '5★ Proche Esplanade (200–450m)',
    noteAr: 'مشي بضع دقائق إلى المسجد الحرام',
    noteFr: 'Accès piéton rapide au Haram',
  },
  {
    id: 'makkah_4_comfort',
    labelAr: '4★ مريح مع نقل مجاني 24/24',
    labelFr: '4★ Confort avec navette 24h/24',
    noteAr: 'توازن مثالي بين الراحة والسعر بالدينار',
    noteFr: 'Excellent rapport confort / budget TND',
  },
  {
    id: 'makkah_3_eco',
    labelAr: '3★ اقتصادي ومنظّم',
    labelFr: '3★ Économique vérifié',
    noteAr: 'إقامة نظيفة ومضمونة بالدينار التونسي',
    noteFr: 'Hébergement vérifié payable en TND',
  },
] as const;

const MADINAH_TIERS = [
  {
    id: 'madinah_5_central',
    labelAr: '5★ المنطقة المركزية الشمالية',
    labelFr: '5★ Zone Centrale Nord (Masjid Nabawi)',
    noteAr: 'خطوات من أبواب المسجد النبوي الشريف',
    noteFr: 'À quelques pas des portes du Masjid Nabawi',
  },
  {
    id: 'madinah_4_close',
    labelAr: '4★ قريب من المسجد النبوي',
    labelFr: '4★ Proche Masjid Nabawi',
    noteAr: 'إقامة هادئة للعائلات والأزواج',
    noteFr: 'Séjour paisible familles & couples',
  },
  {
    id: 'madinah_3_flex',
    labelAr: '3★ مرن حسب المتاح',
    labelFr: '3★ Flexible selon disponibilité',
    noteAr: 'خيار عملي ومضمون حسب التواريخ',
    noteFr: 'Option souple selon dates choisies',
  },
] as const;

export function OmraSurMesureModuleBlock({
  block,
  pageId = 'page-omra-sur-mesure-easy2book',
  universe = 'omra',
  language,
  offerRef,
  attribution,
  crmConfig,
  interactiveEdit = false,
  onEditBlockField,
}: OmraSurMesureModuleBlockProps) {
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  // Step 1: Flight
  const [departureAirport, setDepartureAirport] = useState('TUN');
  const [arrivalAirport, setArrivalAirport] = useState('JED');
  const [airlinePref, setAirlinePref] = useState('flexible');
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 25);
    return d.toISOString().slice(0, 10);
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 35);
    return d.toISOString().slice(0, 10);
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Step 2: Makkah Hotel
  const [makkahNights, setMakkahNights] = useState(6);
  const [makkahTier, setMakkahTier] = useState<string>('makkah_5_haram');
  const [roomType, setRoomType] = useState<'double' | 'triple' | 'quad' | 'suite'>('double');
  const [boardPlan, setBoardPlan] = useState<'bb' | 'hb' | 'ro'>('bb');

  // Step 3: Madinah Hotel & Extras
  const [madinahNights, setMadinahNights] = useState(4);
  const [madinahTier, setMadinahTier] = useState<string>('madinah_5_central');
  const [includeOmraVisa, setIncludeOmraVisa] = useState(true);
  const [includeTransfers, setIncludeTransfers] = useState(true);

  // Traveler Contact
  const [fullName, setFullName] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<CrmAdapterDispatchResult | null>(null);
  const [showPayload, setShowPayload] = useState(false);

  const totalNights = useMemo(
    () => Math.max(1, makkahNights + madinahNights),
    [makkahNights, madinahNights]
  );

  const selectedMakkahMeta =
    MAKKAH_TIERS.find((t) => t.id === makkahTier) ?? MAKKAH_TIERS[0];
  const selectedMadinahMeta =
    MADINAH_TIERS.find((t) => t.id === madinahTier) ?? MADINAH_TIERS[0];

  const roomLabel = useMemo(() => {
    if (roomType === 'double') return isAr ? 'غرفة ثنائية (2)' : 'Chambre Double (2)';
    if (roomType === 'triple') return isAr ? 'غرفة ثلاثية (3)' : 'Chambre Triple (3)';
    if (roomType === 'quad') return isAr ? 'غرفة رباعية (4)' : 'Chambre Quadruple (4)';
    return isAr ? 'جناح عائلي' : 'Suite Familiale';
  }, [isAr, roomType]);

  const boardLabel = useMemo(() => {
    if (boardPlan === 'bb') return isAr ? 'مع فطور الصباح' : 'Petit-déjeuner inclus';
    if (boardPlan === 'hb') return isAr ? 'نصف إقامة (فطور + عشاء)' : 'Demi-pension';
    return isAr ? 'إقامة فقط' : 'Logement seul';
  }, [boardPlan, isAr]);

  const whatsappHref = useMemo(() => {
    const normalized = '21698140514';
    const summaryLines = [
      'السلام عليكم Easy2Book — طلب عرض سعر لعمرة على كيفي (بالدينار التونسي) 🕋',
      `1. الطيران: ${departureAirport} ↔ ${arrivalAirport} (${airlinePref === 'flexible' ? 'أفضل توقيت' : airlinePref}) | من ${departureDate} إلى ${returnDate}`,
      `   المعتمرين: ${adults} بالغين${children > 0 ? ` + ${children} أطفال` : ''}`,
      `2. مكة المكرمة: ${makkahNights} ليالي · ${selectedMakkahMeta.labelAr} · ${roomLabel} · ${boardLabel}`,
      `3. المدينة المنورة: ${madinahNights} ليالي · ${selectedMadinahMeta.labelAr}`,
      `الخدمات الإضافية: ${includeOmraVisa ? 'فيزا العمرة ✅' : 'بدون فيزا'} · ${includeTransfers ? 'التنقلات/القطار السريع ✅' : 'بدون تنقلات'}`,
      fullName.trim() ? `الاسم: ${fullName.trim()}` : '',
      phoneWhatsapp.trim() ? `الهاتف: ${phoneWhatsapp.trim()}` : '',
      notes.trim() ? `ملاحظات: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${normalized}?text=${encodeURIComponent(summaryLines)}`;
  }, [
    adults,
    airlinePref,
    arrivalAirport,
    boardLabel,
    children,
    departureAirport,
    departureDate,
    fullName,
    includeOmraVisa,
    includeTransfers,
    madinahNights,
    makkahNights,
    notes,
    phoneWhatsapp,
    returnDate,
    roomLabel,
    selectedMadinahMeta.labelAr,
    selectedMakkahMeta.labelAr,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interactiveEdit) return;
    if (!fullName.trim() || !phoneWhatsapp.trim()) {
      setFormError(
        isAr
          ? 'الرجاء إدخال الاسم الكامل ورقم الهاتف أو الواتساب لاستلام عرض السعر بالدينار التونسي.'
          : 'Veuillez renseigner votre nom complet et votre numéro téléphone / WhatsApp.'
      );
      return;
    }
    setFormError(null);
    setSubmitting(true);

    const structuredMessage = [
      `[OMRA SUR-MESURE 3 ÉTAPES · 100% TND]`,
      `Vol: ${departureAirport} -> ${arrivalAirport} | Compagnie: ${airlinePref} | Dates: ${departureDate} au ${returnDate}`,
      `Makkah (${makkahNights}n): ${selectedMakkahMeta.labelFr} | ${roomLabel} | ${boardLabel}`,
      `Madinah (${madinahNights}n): ${selectedMadinahMeta.labelFr}`,
      `Options: Visa Omra=${includeOmraVisa ? 'Oui' : 'Non'}, Transferts/TGV Haramain=${includeTransfers ? 'Oui' : 'Non'}`,
      notes.trim() ? `Notes: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' · ');

    const effectiveCrmConfig: CrmIntegrationConfig = crmConfig ?? {
      endpointUrl: 'https://crm.easy2book.tn/api/integrations/omra-sur-mesure',
      mode: 'simulated_adapter',
      timeoutMs: 8000,
      includeUtmAttribution: true,
    };

    const payload = buildCrmSubmissionPayload({
      pageId,
      offerId: offerRef?.externalOfferId || 'CAT-OMRA-SUR-MESURE-2026',
      businessUniverse: universe,
      pageLanguage: language,
      formId: 'form-omra-sur-mesure',
      attribution: attribution ?? {
        acquisitionSource: 'Campagne FB/IG/TikTok Omra Sur-Mesure Easy2Book',
        utmSource: 'easy2book',
        utmMedium: 'reels_tiktok',
        utmCampaign: 'omra_sur_mesure_2026',
        utmContent: '3_hooks_30s_veo',
      },
      fields: {
        fullName: fullName.trim(),
        phoneWhatsapp: phoneWhatsapp.trim(),
        email: email.trim() || undefined,
        travelersCount: adults + children,
        requestedDeparture: `${departureDate} -> ${returnDate} (${totalNights} nuits)`,
        message: structuredMessage,
        consent: true,
      },
      includeUtm: effectiveCrmConfig.includeUtmAttribution,
    });

    const res = await SimulatedCrmAdapter.submitLeadForm(
      payload,
      effectiveCrmConfig
    );
    setResult(res);
    setSubmitting(false);
  };

  return (
    <section
      id={block.anchorId || 'omra-sur-mesure-builder'}
      dir={dir}
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
    >
      {/* Editorial Section Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#102D45]/10 pb-6">
        <div className="max-w-3xl space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#C8922A]">
            <RealFlagSvg code="TN" className="h-3.5 w-5 rounded-[2px] shadow-2xs" />
            <RealFlagSvg code="SA" className="h-3.5 w-5 rounded-[2px] shadow-2xs" />
            <span
              contentEditable={interactiveEdit}
              suppressContentEditableWarning
              onBlur={(e) =>
                onEditBlockField?.('eyebrow', e.currentTarget.textContent || '')
              }
            >
              {block.content.eyebrow ||
                (isAr
                  ? 'عمرتك على كيفك · 3 خطوات · الخلاص بالدينار التونسي'
                  : 'Omra Sur-Mesure · 3 Étapes · Paiement en Dinar Tunisien (TND)')}
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102D45] [text-wrap:balance]"
            contentEditable={interactiveEdit}
            suppressContentEditableWarning
            onBlur={(e) =>
              onEditBlockField?.('title', e.currentTarget.textContent || '')
            }
          >
            {block.content.title ||
              (isAr
                ? 'فصّل برنامج عمرتك على قياسك في 3 خطوات — بدون برامج مفروضة'
                : 'Composez votre Omra sur mesure en 3 étapes — sans programme imposé')}
          </h2>
          <p
            className="text-sm leading-relaxed text-slate-600"
            contentEditable={interactiveEdit}
            suppressContentEditableWarning
            onBlur={(e) =>
              onEditBlockField?.(
                'description',
                e.currentTarget.textContent || ''
              )
            }
          >
            {block.content.description ||
              (isAr
                ? 'اختار برنامج الطيران إلي يناسب ظروفك، حدّد غرفتك في مكة والمدينة قبل ما تسافر، وخلّص 100% بالدينار التونسي مع Easy2Book.'
                : 'Choisissez librement vos dates de vol, votre chambre à La Mecque et votre séjour à Médine, avec réservation confirmée et paiement en Dinar Tunisien.')}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="font-mono-tabular font-bold text-[#102D45]">
            {totalNights} {isAr ? 'ليالي إجمالية' : 'nuits au total'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{isAr ? 'حجز مسبق بالدينار التونسي' : '100% Dinar Tunisien'}</span>
        </div>
      </div>

      {/* 3-Step Visual Preview Strip */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          {
            step: '01',
            icon: Plane,
            img: getHeroImageSrc('tunis_flight'),
            titleAr: 'اختار برنامج طيرانك',
            titleFr: 'Choisissez votre vol',
            descAr: 'التاريخ، المطار والتوقيت إلي يساعد ظروفك وخدمتك',
            descFr: 'Aéroport, dates et horaires selon votre agenda',
          },
          {
            step: '02',
            icon: Building2,
            img: getHeroImageSrc('omra_vip_haram'),
            titleAr: 'اختار غرفتك في مكة',
            titleFr: 'Choisissez votre hôtel à La Mecque',
            descAr: 'حجز مسبق ومضمون في فنادق مكة بالدينار التونسي',
            descFr: 'Chambre confirmée à l’avance en Dinar Tunisien',
          },
          {
            step: '03',
            icon: ShieldCheck,
            img: getHeroImageSrc('madinah_twilight'),
            titleAr: 'اختار إقامتك في المدينة',
            titleFr: 'Choisissez votre séjour à Médine',
            descAr: 'فنادق المسجد النبوي حسب المتاح وبكل مرونة',
            descFr: 'Hôtels près du Masjid Nabawi en toute souplesse',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="overflow-hidden rounded-2xl border border-[#102D45]/10 bg-white"
            >
              <div className="relative h-36 w-full overflow-hidden bg-[#102D45]">
                <img
                  src={item.img}
                  alt={isAr ? item.titleAr : item.titleFr}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102D45]/85 via-[#102D45]/25 to-transparent" />
                <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between text-white">
                  <span className="font-mono-tabular text-xs font-extrabold text-[#E7B34C]">
                    {isAr ? `الخطوة ${item.step}` : `Étape ${item.step}`}
                  </span>
                  <Icon className="h-4 w-4 text-[#E7B34C]" />
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-extrabold text-[#102D45]">
                  {isAr ? item.titleAr : item.titleFr}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {isAr ? item.descAr : item.descFr}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Configurator Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-12 items-start"
      >
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: FLIGHT */}
          <div className="rounded-2xl border border-[#102D45]/12 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#102D45]/8 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-tabular text-xs font-extrabold text-[#C8922A]">
                  01.
                </span>
                <h3 className="text-sm font-extrabold text-[#102D45]">
                  {isAr
                    ? 'برنامج الطيران والتواريخ (اختيارك الحر)'
                    : 'Programme de vol & dates souhaitées'}
                </h3>
              </div>
              <Plane className="h-4 w-4 text-[#1C4967]" />
            </div>

            <div className="grid gap-3.5 sm:grid-cols-3">
              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'مطار الإنطلاق' : 'Aéroport de départ'}</span>
                <select
                  value={departureAirport}
                  onChange={(e) => setDepartureAirport(e.target.value)}
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2.5 text-xs font-semibold text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                >
                  <option value="TUN">
                    {isAr ? 'تونس قرطاج (TUN)' : 'Tunis-Carthage (TUN)'}
                  </option>
                  <option value="MIR">
                    {isAr ? 'المنستير (MIR)' : 'Monastir (MIR)'}
                  </option>
                  <option value="DJE">
                    {isAr ? 'جربة جرجيس (DJE)' : 'Djerba-Zarzis (DJE)'}
                  </option>
                  <option value="SFA">
                    {isAr ? 'صفاقس طينة (SFA)' : 'Sfax-Thyna (SFA)'}
                  </option>
                </select>
              </label>

              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'وجهة الوصول' : 'Arrivée en Arabie Saoudite'}</span>
                <select
                  value={arrivalAirport}
                  onChange={(e) => setArrivalAirport(e.target.value)}
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2.5 text-xs font-semibold text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                >
                  <option value="JED">
                    {isAr ? 'جدة — نحو مكة المكرمة (JED)' : 'Djeddah — Accès La Mecque (JED)'}
                  </option>
                  <option value="MED">
                    {isAr ? 'المدينة المنورة مباشرة (MED)' : 'Médine direct (MED)'}
                  </option>
                </select>
              </label>

              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'شركة الطيران المفضلة' : 'Compagnie souhaitée'}</span>
                <select
                  value={airlinePref}
                  onChange={(e) => setAirlinePref(e.target.value)}
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2.5 text-xs font-semibold text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                >
                  <option value="flexible">
                    {isAr ? 'أفضل توقيت وسعر متاح' : 'Meilleur horaire & tarif'}
                  </option>
                  <option value="Saudia">Saudia (الخطوط السعودية)</option>
                  <option value="Tunisair">Tunisair (الخطوط التونسية)</option>
                  <option value="Nouvelair">Nouvelair</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-4">
              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#C8922A]" />
                  {isAr ? 'تاريخ الذهاب' : 'Départ'}
                </span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold font-mono-tabular text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                />
              </label>

              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#C8922A]" />
                  {isAr ? 'تاريخ العودة' : 'Retour'}
                </span>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold font-mono-tabular text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                />
              </label>

              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#C8922A]" />
                  {isAr ? 'عدد البالغين' : 'Adultes'}
                </span>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={adults}
                  onChange={(e) =>
                    setAdults(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2 text-xs font-bold font-mono-tabular text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                />
              </label>

              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'أطفال (-12 سنة)' : 'Enfants (-12 ans)'}</span>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={children}
                  onChange={(e) =>
                    setChildren(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2 text-xs font-bold font-mono-tabular text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                />
              </label>
            </div>
          </div>

          {/* STEP 2: MAKKAH HOTEL */}
          <div className="rounded-2xl border border-[#102D45]/12 bg-white p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#102D45]/8 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-tabular text-xs font-extrabold text-[#C8922A]">
                  02.
                </span>
                <h3 className="text-sm font-extrabold text-[#102D45]">
                  {isAr
                    ? 'غرفتك في فنادق مكة المكرمة (حجز مسبق بالدينار التونسي)'
                    : 'Votre chambre à La Mecque (pré-réservation 100% TND)'}
                </h3>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#1C4967]">
                {makkahNights} {isAr ? 'ليالي بمكة' : 'nuits à La Mecque'}
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {MAKKAH_TIERS.map((tier) => {
                const selected = makkahTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setMakkahTier(tier.id)}
                    className={`rounded-xl border p-3.5 text-start transition-colors ${
                      selected
                        ? 'border-[#102D45] bg-[#102D45] text-white'
                        : 'border-[#102D45]/12 bg-[#F8FAFC] text-[#102D45] hover:border-[#C8922A]'
                    }`}
                  >
                    <p className="text-xs font-extrabold">
                      {isAr ? tier.labelAr : tier.labelFr}
                    </p>
                    <p
                      className={`mt-1 text-[11px] ${
                        selected ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {isAr ? tier.noteAr : tier.noteFr}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3.5 sm:grid-cols-3">
              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'عدد الليالي في مكة' : 'Nuits à La Mecque'}</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={makkahNights}
                  onChange={(e) =>
                    setMakkahNights(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2 text-xs font-bold font-mono-tabular text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                />
              </label>

              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'نوع الغرفة' : 'Type de chambre'}</span>
                <select
                  value={roomType}
                  onChange={(e) =>
                    setRoomType(
                      e.target.value as 'double' | 'triple' | 'quad' | 'suite'
                    )
                  }
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                >
                  <option value="double">
                    {isAr ? 'غرفة ثنائية (2)' : 'Chambre Double (2)'}
                  </option>
                  <option value="triple">
                    {isAr ? 'غرفة ثلاثية (3)' : 'Chambre Triple (3)'}
                  </option>
                  <option value="quad">
                    {isAr ? 'غرفة رباعية (4)' : 'Chambre Quadruple (4)'}
                  </option>
                  <option value="suite">
                    {isAr ? 'جناح عائلي' : 'Suite Familiale'}
                  </option>
                </select>
              </label>

              <label className="space-y-1.5 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'نظام الإقامة' : 'Formule repas'}</span>
                <select
                  value={boardPlan}
                  onChange={(e) =>
                    setBoardPlan(e.target.value as 'bb' | 'hb' | 'ro')
                  }
                  className="w-full rounded-xl border border-[#102D45]/15 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#102D45] outline-none focus:border-[#C8922A] focus:bg-white"
                >
                  <option value="bb">
                    {isAr ? 'مع فطور الصباح' : 'Petit-déjeuner inclus'}
                  </option>
                  <option value="hb">
                    {isAr ? 'نصف إقامة (فطور + عشاء)' : 'Demi-pension'}
                  </option>
                  <option value="ro">
                    {isAr ? 'إقامة فقط' : 'Logement seul'}
                  </option>
                </select>
              </label>
            </div>
          </div>

          {/* STEP 3: MADINAH HOTEL */}
          <div className="rounded-2xl border border-[#102D45]/12 bg-white p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#102D45]/8 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-tabular text-xs font-extrabold text-[#C8922A]">
                  03.
                </span>
                <h3 className="text-sm font-extrabold text-[#102D45]">
                  {isAr
                    ? 'إقامتك في المدينة المنورة (حسب المتاح وبكل مرونة)'
                    : 'Votre séjour à Médine (flexible selon disponibilité)'}
                </h3>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#1C4967]">
                {madinahNights} {isAr ? 'ليالي بالمدينة' : 'nuits à Médine'}
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {MADINAH_TIERS.map((tier) => {
                const selected = madinahTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setMadinahTier(tier.id)}
                    className={`rounded-xl border p-3.5 text-start transition-colors ${
                      selected
                        ? 'border-[#102D45] bg-[#102D45] text-white'
                        : 'border-[#102D45]/12 bg-[#F8FAFC] text-[#102D45] hover:border-[#C8922A]'
                    }`}
                  >
                    <p className="text-xs font-extrabold">
                      {isAr ? tier.labelAr : tier.labelFr}
                    </p>
                    <p
                      className={`mt-1 text-[11px] ${
                        selected ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {isAr ? tier.noteAr : tier.noteFr}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#102D45]">
                <span>{isAr ? 'ليالي المدينة:' : 'Nuits Médine :'}</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={madinahNights}
                  onChange={(e) =>
                    setMadinahNights(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-20 rounded-lg border border-[#102D45]/15 bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-bold font-mono-tabular text-[#102D45]"
                />
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#102D45] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeOmraVisa}
                  onChange={(e) => setIncludeOmraVisa(e.target.checked)}
                  className="h-4 w-4 accent-[#102D45]"
                />
                <span>
                  {isAr ? 'إدراج فيزا العمرة والتأمين' : 'Inclure Visa Omra & assurance'}
                </span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#102D45] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTransfers}
                  onChange={(e) => setIncludeTransfers(e.target.checked)}
                  className="h-4 w-4 accent-[#102D45]"
                />
                <span>
                  {isAr
                    ? 'إدراج التنقلات أو قطار الحرمين'
                    : 'Inclure transferts VIP / TGV Haramain'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sticky Summary & Direct Contact Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-6 rounded-2xl border border-[#102D45]/15 bg-[#102D45] p-5 text-white space-y-4">
          <div className="border-b border-white/15 pb-3.5 space-y-1">
            <p className="text-[11px] font-bold text-[#E7B34C]">
              {isAr
                ? 'ملخّص برنامج عمرتك على كيفك'
                : 'Récapitulatif de votre Omra sur mesure'}
            </p>
            <h3 className="text-base font-extrabold">
              {isAr
                ? 'خلاص 100% بالدينار التونسي · 98 140 514'
                : 'Paiement 100% TND · 98 140 514'}
            </h3>
          </div>

          <dl className="space-y-2.5 text-xs">
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2">
              <dt className="text-slate-300">{isAr ? 'الطيران' : 'Vol'}</dt>
              <dd className="font-bold text-end font-mono-tabular">
                {departureAirport} ↔ {arrivalAirport} ({adults + children}{' '}
                {isAr ? 'أفراد' : 'pers.'})
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2">
              <dt className="text-slate-300">{isAr ? 'التواريخ' : 'Dates'}</dt>
              <dd className="font-bold text-end font-mono-tabular" dir="ltr">
                {departureDate} → {returnDate}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2">
              <dt className="text-slate-300">
                {isAr ? `مكة (${makkahNights} ليالي)` : `La Mecque (${makkahNights}n)`}
              </dt>
              <dd className="font-bold text-end">
                {isAr ? selectedMakkahMeta.labelAr : selectedMakkahMeta.labelFr}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2">
              <dt className="text-slate-300">
                {isAr ? `المدينة (${madinahNights} ليالي)` : `Médine (${madinahNights}n)`}
              </dt>
              <dd className="font-bold text-end">
                {isAr ? selectedMadinahMeta.labelAr : selectedMadinahMeta.labelFr}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-300">{isAr ? 'الغرفة والوجبات' : 'Chambre'}</dt>
              <dd className="font-bold text-end">
                {roomLabel} · {boardLabel}
              </dd>
            </div>
          </dl>

          {/* Traveler Inputs */}
          <div className="space-y-2.5 pt-2 border-t border-white/15">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAr ? 'الاسم الكامل *' : 'Nom complet *'}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white placeholder:text-slate-300 outline-none focus:border-[#E7B34C]"
            />
            <input
              type="tel"
              value={phoneWhatsapp}
              onChange={(e) => setPhoneWhatsapp(e.target.value)}
              placeholder={
                isAr ? 'رقم الهاتف أو الواتساب * (+216)' : 'Téléphone / WhatsApp * (+216)'
              }
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white placeholder:text-slate-300 outline-none focus:border-[#E7B34C]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optionnel)'
              }
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white placeholder:text-slate-300 outline-none focus:border-[#E7B34C]"
            />
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isAr
                  ? 'ملاحظات إضافية (فندق معين، أطفال، موعد مفضل...)'
                  : 'Précisions (hôtel précis, besoins familiaux...)'
              }
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white placeholder:text-slate-300 outline-none focus:border-[#E7B34C]"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-amber-500/20 px-3 py-2 text-xs font-semibold text-[#F6D365]">
              {formError}
            </p>
          )}

          {result ? (
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  {isAr
                    ? 'تم تسجيل طلب عمرتك بنجاح! سيتواصل معك فريق Easy2Book.'
                    : 'Votre demande Omra sur mesure est enregistrée !'}
                </span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                {result.note}
              </p>
              <button
                type="button"
                onClick={() => setShowPayload((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E7B34C] hover:underline"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>{showPayload ? 'Masquer JSON CRM' : 'Voir payload CRM'}</span>
              </button>
              {showPayload && (
                <pre
                  dir="ltr"
                  className="max-h-40 overflow-auto rounded-lg bg-[#081726] p-2.5 text-[10px] text-slate-200"
                >
                  {JSON.stringify(result.payload, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <button
              type="submit"
              disabled={submitting || interactiveEdit}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E7B34C] px-4 py-3 text-xs font-extrabold text-[#102D45] hover:bg-[#f1c161] transition-colors disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              <span>
                {submitting
                  ? isAr
                    ? 'جاري الإرسال...'
                    : 'Envoi en cours...'
                  : isAr
                    ? 'استلم عرض السعر بالدينار التونسي'
                    : 'Recevoir mon devis Omra en TND'}
              </span>
            </button>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            <span>
              {isAr
                ? 'ابعث برنامجك مباشرة على واتساب · 98 140 514'
                : 'Envoyer sur WhatsApp direct · 98 140 514'}
            </span>
          </a>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300">
            <Check className="h-3.5 w-3.5 text-[#E7B34C]" />
            <span>
              {isAr
                ? 'توكل على ربي · www.easy2book.tn'
                : 'Confirmation officielle · www.easy2book.tn'}
            </span>
          </p>
        </div>
      </form>
    </section>
  );
}
