import { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  Plane,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  buildCrmSubmissionPayload,
  SimulatedCrmAdapter,
  type CrmAdapterDispatchResult,
  type CrmIntegrationConfig,
} from '../../integration-contracts/crmAdapter';
import { RealFlagSvg } from '../../lib/realCountryFlags';
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

export type EgyptVisaServiceKey =
  | 'guarantee_tunis'
  | 'guarantee_abroad'
  | 'landing_coastal';

export type EgyptTravelPurposeKey =
  | 'tourism'
  | 'business'
  | 'family'
  | 'transit';

interface VisaEgyptModuleBlockProps {
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

const DEPARTURE_OPTIONS = [
  {
    id: 'TUN',
    isTunisia: true,
    fr: 'Tunis-Carthage (TUN)',
    en: 'Tunis-Carthage (TUN)',
    ar: 'مطار تونس قرطاج (TUN)',
  },
  {
    id: 'NBE_MIR',
    isTunisia: true,
    fr: 'Enfidha / Monastir (Tunisie)',
    en: 'Enfidha / Monastir (Tunisia)',
    ar: 'النفيضة / المنستير (تونس)',
  },
  {
    id: 'ABROAD',
    isTunisia: false,
    fr: 'Autre pays / Étranger (sur demande)',
    en: 'Other country / Abroad (on request)',
    ar: 'انطلاق من دولة أخرى (حسب الطلب)',
  },
] as const;

const ARRIVAL_OPTIONS = [
  {
    id: 'CAI',
    isCoastal: false,
    fr: 'Le Caire (CAI)',
    en: 'Cairo (CAI)',
    ar: 'القاهرة (CAI)',
  },
  {
    id: 'HRG',
    isCoastal: true,
    fr: 'Hurghada (HRG)',
    en: 'Hurghada (HRG)',
    ar: 'الغردقة (HRG)',
  },
  {
    id: 'SSH',
    isCoastal: true,
    fr: 'Charm el-Cheikh (SSH)',
    en: 'Sharm El Sheikh (SSH)',
    ar: 'شرم الشيخ (SSH)',
  },
  {
    id: 'HBE',
    isCoastal: true,
    fr: 'Alexandrie (HBE)',
    en: 'Alexandria (HBE)',
    ar: 'الإسكندرية (HBE)',
  },
] as const;

const PURPOSE_OPTIONS: {
  id: EgyptTravelPurposeKey;
  fr: string;
  en: string;
  ar: string;
}[] = [
  {
    id: 'tourism',
    fr: 'Tourisme & Séjour',
    en: 'Tourism & Leisure',
    ar: 'سياحة وترفيه',
  },
  {
    id: 'business',
    fr: 'Affaires & Conférence',
    en: 'Business & Conference',
    ar: 'أعمال ومؤتمر',
  },
  {
    id: 'family',
    fr: 'Visite familiale',
    en: 'Family Visit',
    ar: 'زيارة عائلية',
  },
  {
    id: 'transit',
    fr: 'Transit / Autre motif',
    en: 'Transit / Other',
    ar: 'عبور / غرض آخر',
  },
];

export function VisaEgyptModuleBlock({
  block,
  pageId,
  universe,
  language,
  offerRef,
  attribution,
  crmConfig,
  brandIdentity,
  interactiveEdit = false,
}: VisaEgyptModuleBlockProps) {
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

  // Service & routing state
  const [serviceType, setServiceType] =
    useState<EgyptVisaServiceKey>('guarantee_tunis');
  const [departureAirport, setDepartureAirport] = useState<string>('TUN');
  const [arrivalAirport, setArrivalAirport] = useState<string>('CAI');
  const [flightDate, setFlightDate] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [travelPurpose, setTravelPurpose] =
    useState<EgyptTravelPurposeKey>('tourism');

  // Traveler info state
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [nationality, setNationality] = useState<string>(
    isAr ? 'تونسية' : isEn ? 'Tunisian' : 'Tunisienne'
  );
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [documentsReady, setDocumentsReady] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  // Submission state
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] =
    useState<CrmAdapterDispatchResult | null>(null);
  const [showPayloadJson, setShowPayloadJson] = useState<boolean>(false);

  const unitPriceDt = useMemo(() => {
    if (serviceType === 'guarantee_tunis') return 90;
    if (serviceType === 'guarantee_abroad') return 150;
    return travelersCount >= 2 ? 300 : 350;
  }, [serviceType, travelersCount]);

  const totalPriceDt = unitPriceDt * Math.max(1, travelersCount);

  const serviceOptions: {
    id: EgyptVisaServiceKey;
    label: string;
    detail: string;
    priceLabel: string;
  }[] = [
    {
      id: 'guarantee_tunis',
      label: isAr
        ? 'خطاب ضمان · انطلاق من تونس'
        : isEn
          ? 'Guarantee Letter · Departure Tunisia'
          : 'Lettre / garantie · Départ Tunisie',
      detail: isAr
        ? 'إصدار خلال 4 ساعات'
        : isEn
          ? 'Issued within 4 hours'
          : 'Traitement express en 4h',
      priceLabel: isAr ? '90 د.ت' : '90 DT',
    },
    {
      id: 'guarantee_abroad',
      label: isAr
        ? 'خطاب ضمان · انطلاق من دولة أخرى'
        : isEn
          ? 'Guarantee Letter · Other Country'
          : 'Lettre / garantie · Autre pays',
      detail: isAr
        ? 'حسب الطلب · إصدار خلال 4 ساعات'
        : isEn
          ? 'On request · 4-hour processing'
          : 'Sur demande · traitement en 4h',
      priceLabel: isAr ? '150 د.ت' : '150 DT',
    },
    {
      id: 'landing_coastal',
      label: isAr
        ? 'نزول شرم الشيخ / الغردقة / الإسكندرية'
        : isEn
          ? 'Sharm / Hurghada / Alexandria Landing'
          : 'Atterrissage Charm / Hurghada / Alexandrie',
      detail:
        travelersCount >= 2
          ? isAr
            ? 'تعريفة مخفّضة ابتداءً من شخصين (300 د.ت/شخص)'
            : isEn
              ? 'Group rate applied for 2+ travelers (300 DT/pers.)'
              : 'Tarif dégressif dès 2 pers. (300 DT/pers.)'
          : isAr
            ? 'شخص واحد: 350 د.ت · ابتداءً من شخصين: 300 د.ت'
            : isEn
              ? '1 traveler: 350 DT · 2+ travelers: 300 DT/pers.'
              : '1 pers. : 350 DT · Dès 2 pers. : 300 DT/pers.',
      priceLabel:
        travelersCount >= 2
          ? isAr
            ? '300 د.ت / شخص'
            : '300 DT / pers.'
          : isAr
            ? '350 د.ت'
            : '350 DT',
    },
  ];

  const handleDepartureChange = (nextDep: string) => {
    setDepartureAirport(nextDep);
    if (serviceType !== 'landing_coastal') {
      setServiceType(nextDep === 'ABROAD' ? 'guarantee_abroad' : 'guarantee_tunis');
    }
  };

  const handleArrivalChange = (nextArr: string) => {
    setArrivalAirport(nextArr);
    const arrMeta = ARRIVAL_OPTIONS.find((a) => a.id === nextArr);
    if (arrMeta?.isCoastal) {
      setServiceType('landing_coastal');
    } else if (serviceType === 'landing_coastal') {
      setServiceType(
        departureAirport === 'ABROAD' ? 'guarantee_abroad' : 'guarantee_tunis'
      );
    }
  };

  const selectedDepLabel =
    DEPARTURE_OPTIONS.find((d) => d.id === departureAirport)?.[langKey] ??
    departureAirport;
  const selectedArrLabel =
    ARRIVAL_OPTIONS.find((a) => a.id === arrivalAirport)?.[langKey] ??
    arrivalAirport;
  const selectedPurposeLabel =
    PURPOSE_OPTIONS.find((p) => p.id === travelPurpose)?.[langKey] ??
    travelPurpose;
  const selectedServiceLabel =
    serviceOptions.find((s) => s.id === serviceType)?.label ?? serviceType;

  const whatsappHref = useMemo(() => {
    const lines = isAr
      ? [
          'مرحباً Easy2Book — طلب فيزا / خطاب ضمان وتصريح أمني لمصر (4 ساعات)',
          `• الخدمة : ${selectedServiceLabel} (${totalPriceDt.toLocaleString('fr-FR')} د.ت)`,
          fullName.trim() ? `• المسافر : ${fullName.trim()}` : '',
          passportNumber.trim()
            ? `• رقم جواز السفر : ${passportNumber.trim()}`
            : '',
          nationality.trim() ? `• الجنسية : ${nationality.trim()}` : '',
          `• عدد المسافرين : ${travelersCount}`,
          `• مطار الإنطلاق : ${selectedDepLabel}`,
          `• مطار الوصول : ${selectedArrLabel}`,
          flightDate ? `• تاريخ الرحلة : ${flightDate}` : '',
          flightNumber.trim() ? `• رقم الرحلة : ${flightNumber.trim()}` : '',
          `• غرض السفر : ${selectedPurposeLabel}`,
          notes.trim() ? `• ملاحظات : ${notes.trim()}` : '',
          '📎 سأرسل نسخة جواز السفر وتذكرة الطائرة الآن.',
        ]
      : isEn
        ? [
            'Hello Easy2Book — Visa Egypt / Security Clearance Request (4h)',
            `• Service: ${selectedServiceLabel} (${totalPriceDt.toLocaleString('fr-FR')} DT)`,
            fullName.trim() ? `• Traveler: ${fullName.trim()}` : '',
            passportNumber.trim()
              ? `• Passport No.: ${passportNumber.trim()}`
              : '',
            nationality.trim() ? `• Nationality: ${nationality.trim()}` : '',
            `• Travelers: ${travelersCount}`,
            `• Departure: ${selectedDepLabel}`,
            `• Arrival: ${selectedArrLabel}`,
            flightDate ? `• Flight Date: ${flightDate}` : '',
            flightNumber.trim() ? `• Flight No.: ${flightNumber.trim()}` : '',
            `• Travel Purpose: ${selectedPurposeLabel}`,
            notes.trim() ? `• Notes: ${notes.trim()}` : '',
            'Passport copy & flight ticket ready to share.',
          ]
        : [
            'Bonjour Easy2Book — Demande Visa / Lettre de garantie Égypte (4h)',
            `• Formule : ${selectedServiceLabel} (${totalPriceDt.toLocaleString('fr-FR')} DT)`,
            fullName.trim() ? `• Voyageur : ${fullName.trim()}` : '',
            passportNumber.trim()
              ? `• N° passeport : ${passportNumber.trim()}`
              : '',
            nationality.trim() ? `• Nationalité : ${nationality.trim()}` : '',
            `• Nombre de voyageurs : ${travelersCount}`,
            `• Départ : ${selectedDepLabel}`,
            `• Arrivée : ${selectedArrLabel}`,
            flightDate ? `• Date du vol : ${flightDate}` : '',
            flightNumber.trim() ? `• N° de vol : ${flightNumber.trim()}` : '',
            `• Motif du voyage : ${selectedPurposeLabel}`,
            notes.trim() ? `• Remarques : ${notes.trim()}` : '',
            'Copie passeport + billet d’avion prêts à transmettre.',
          ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.filter(Boolean).join('\n')
    )}`;
  }, [
    flightDate,
    flightNumber,
    fullName,
    isAr,
    isEn,
    nationality,
    notes,
    passportNumber,
    selectedArrLabel,
    selectedDepLabel,
    selectedPurposeLabel,
    selectedServiceLabel,
    totalPriceDt,
    travelersCount,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interactiveEdit) return;
    setFormError(null);

    if (!fullName.trim() || !phone.trim()) {
      setFormError(
        isAr
          ? 'يرجى إدخال الاسم الكامل ورقم الهاتف / واتساب.'
          : isEn
            ? 'Please enter the traveler full name and phone/WhatsApp number.'
            : 'Veuillez renseigner le nom complet du voyageur et un numéro de téléphone / WhatsApp.'
      );
      return;
    }
    if (!passportNumber.trim()) {
      setFormError(
        isAr
          ? 'يرجى إدخال رقم جواز السفر لمعالجة التصريح الأمني.'
          : isEn
            ? 'Please enter the passport number to process security clearance.'
            : 'Veuillez renseigner le numéro de passeport pour le traitement de l’autorisation.'
      );
      return;
    }
    if (!flightDate) {
      setFormError(
        isAr
          ? 'يرجى تحديد تاريخ الرحلة الجوية.'
          : isEn
            ? 'Please select your flight date.'
            : 'Veuillez sélectionner la date de votre vol.'
      );
      return;
    }
    if (!documentsReady) {
      setFormError(
        isAr
          ? 'يرجى تأكيد توفر نسخة جواز السفر وتذكرة الطائرة.'
          : isEn
            ? 'Please confirm that the passport copy and flight ticket are available.'
            : 'Veuillez confirmer la disponibilité de la copie passeport et du billet d’avion.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const structuredSummary = [
        `[VISA EGYPT · ${selectedServiceLabel}]`,
        `Passport: ${passportNumber.trim()} (${nationality.trim() || 'TN'})`,
        `Route: ${selectedDepLabel} -> ${selectedArrLabel}`,
        `Flight Date: ${flightDate}${flightNumber.trim() ? ` (${flightNumber.trim()})` : ''}`,
        `Travel Purpose: ${selectedPurposeLabel}`,
        `Estimated Total: ${totalPriceDt} DT (${travelersCount} pax)`,
        notes.trim() ? `Notes: ${notes.trim()}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const payload = buildCrmSubmissionPayload({
        pageId,
        offerId: offerRef.externalOfferId || 'VISA-EGYPT-4H',
        businessUniverse: universe,
        pageLanguage: language,
        formId: `module-visa-egypt-${block.id}`,
        attribution,
        includeUtm: crmConfig.includeUtmAttribution,
        fields: {
          fullName: fullName.trim(),
          phoneWhatsapp: phone.trim(),
          email: email.trim(),
          region: `${selectedDepLabel} -> ${selectedArrLabel}`,
          travelersCount: Math.max(1, travelersCount),
          requestedDeparture: `${flightDate} · ${selectedPurposeLabel}`,
          message: structuredSummary,
          consent: documentsReady,
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
      {/* Top Banner Header */}
      <div className="bg-[#102D45] px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#F6D365]">
              <RealFlagSvg
                code="EG"
                className="h-3.5 w-5 rounded-[2px] border border-white/25"
              />
              <RealFlagSvg
                code="TN"
                className="h-3.5 w-5 rounded-[2px] border border-white/25"
              />
              <span>{block.content.eyebrow}</span>
            </div>
            <h2
              style={headingStyle}
              className="text-xl md:text-2xl font-extrabold tracking-tight"
            >
              {block.content.title}
            </h2>
            {block.content.description && (
              <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
                {block.content.description}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-start shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F6D365]">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {isAr
                  ? 'أجل الإصدار : 4 ساعات'
                  : isEn
                    ? 'Processing Time: 4 Hours'
                    : 'Délai de traitement : 4 heures'}
              </span>
            </div>
            <p className="mt-1 font-mono-tabular text-xl font-extrabold text-white">
              {totalPriceDt.toLocaleString('fr-FR')} {isAr ? 'د.ت' : 'DT'}
            </p>
            <p className="text-[11px] text-slate-300">
              {isAr
                ? `المجموع التقديري لـ ${travelersCount} مسافر`
                : isEn
                  ? `Estimated total for ${travelersCount} traveler(s)`
                  : `Estimation pour ${travelersCount} voyageur(s)`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-7 space-y-6">
        {/* Step 1: Service Formula Selector */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C4967]">
              {isAr
                ? '1 · نوع الخدمة المطلوبة (فيزا / خطاب ضمان مصر)'
                : isEn
                  ? '1 · Select Egyptian Clearance Formula'
                  : '1 · Type de demande (Garantie / Autorisation Égypte)'}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <FileText className="h-3.5 w-3.5 text-[#C8922A]" />
              {isAr
                ? 'الوثائق المطلوبة : نسخة الجواز + تذكرة الطائرة'
                : isEn
                  ? 'Required docs: Passport copy + Flight ticket'
                  : 'Documents requis : Copie passeport + Billet d’avion'}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {serviceOptions.map((opt) => {
              const active = serviceType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setServiceType(opt.id)}
                  className={`flex flex-col justify-between rounded-xl border p-3.5 text-start transition-colors ${
                    active
                      ? 'border-[#C8922A] bg-[#FFFDF7]'
                      : 'border-[#102D45]/12 bg-[#FAF9F6] hover:border-[#C8922A]/60'
                  }`}
                >
                  <div>
                    <p className="text-xs font-extrabold text-[#102D45]">
                      {opt.label}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                      {opt.detail}
                    </p>
                  </div>
                  <p className="mt-2.5 border-t border-[#102D45]/10 pt-2 font-mono-tabular text-sm font-extrabold text-[#C8922A]">
                    {opt.priceLabel}
                  </p>
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
                      ? 'تم استلام طلب التصريح الأمني وخطاب الضمان لمصر بنجاح!'
                      : isEn
                        ? 'Your Egypt Visa / Security Clearance request has been logged!'
                        : 'Votre demande de Visa / Garantie Égypte a bien été enregistrée !'}
                  </p>
                  <p className="text-xs text-emerald-900">
                    {isAr
                      ? 'أرسل الآن نسخة جواز السفر وتذكرة الطائرة عبر واتساب لبدء المعالجة خلال 4 ساعات.'
                      : isEn
                        ? 'Send your passport scan & flight ticket via WhatsApp now to trigger 4-hour processing.'
                        : 'Transmettez maintenant votre copie de passeport et votre billet d’avion via WhatsApp pour lancer le traitement en 4h.'}
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
                    ? 'إرسال الجواز والتذكرة عبر واتساب (98 140 514)'
                    : isEn
                      ? 'Send Passport & Ticket on WhatsApp (98 140 514)'
                      : 'Envoyer passeport & billet sur WhatsApp (98 140 514)'}
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
                      : isEn
                        ? 'Hide CRM JSON'
                        : 'Masquer JSON CRM'
                    : isAr
                      ? 'عرض بيانات CRM'
                      : isEn
                        ? 'Inspect CRM JSON'
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
                {isAr
                  ? 'تقديم طلب آخر'
                  : isEn
                    ? 'Submit another request'
                    : 'Nouvelle demande'}
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
            {/* Step 2: Traveler Information */}
            <div className="space-y-3 border-t border-[#102D45]/10 pt-5">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1C4967]">
                <Users className="h-3.5 w-3.5 text-[#C8922A]" />
                <span>
                  {isAr
                    ? '2 · بيانات المسافر (كما في جواز السفر)'
                    : isEn
                      ? '2 · Traveler Information'
                      : '2 · Informations voyageur'}
                </span>
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'الاسم الكامل (حسب جواز السفر)'
                      : isEn
                        ? 'Full Name (as on passport)'
                        : 'Nom complet (tel que sur le passeport)'}{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      isAr
                        ? 'مثال: محمد أمين بن علي'
                        : isEn
                          ? 'e.g. Mohamed Amine Ben Ali'
                          : 'Ex : Mohamed Amine Ben Ali'
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'رقم جواز السفر'
                      : isEn
                        ? 'Passport Number'
                        : 'N° de passeport'}{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                    placeholder="E1234567"
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
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
                      ? 'الجنسية'
                      : isEn
                        ? 'Nationality'
                        : 'Nationalité'}
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder={
                      isAr ? 'تونسية' : isEn ? 'Tunisian' : 'Tunisienne'
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'البريد الإلكتروني'
                      : isEn
                        ? 'Email Address'
                        : 'Adresse e-mail'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@email.com"
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'عدد المسافرين'
                      : isEn
                        ? 'Number of Travelers'
                        : 'Nombre de voyageurs'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={travelersCount}
                    onChange={(e) =>
                      setTravelersCount(
                        Math.max(1, Math.min(25, Number(e.target.value) || 1))
                      )
                    }
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono-tabular text-sm font-bold text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Flight Date, Routing & Travel Purpose */}
            <div className="space-y-3 border-t border-[#102D45]/10 pt-5">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1C4967]">
                <Plane className="h-3.5 w-3.5 text-[#C8922A]" />
                <span>
                  {isAr
                    ? '3 · تاريخ الرحلة، المطارات وغرض السفر'
                    : isEn
                      ? '3 · Flight Date, Airports & Travel Purpose'
                      : '3 · Date du vol, aéroports & motif du voyage'}
                </span>
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#C8922A]" />
                      {isAr
                        ? 'تاريخ الرحلة'
                        : isEn
                          ? 'Flight Date'
                          : 'Date du vol'}
                    </span>{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono-tabular text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'مطار الإنطلاق'
                      : isEn
                        ? 'Departure Airport'
                        : 'Aéroport de départ'}
                  </label>
                  <select
                    value={departureAirport}
                    onChange={(e) => handleDepartureChange(e.target.value)}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  >
                    {DEPARTURE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt[langKey]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'مطار الوصول في مصر'
                      : isEn
                        ? 'Arrival Airport (Egypt)'
                        : 'Aéroport d’arrivée (Égypte)'}
                  </label>
                  <select
                    value={arrivalAirport}
                    onChange={(e) => handleArrivalChange(e.target.value)}
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  >
                    {ARRIVAL_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt[langKey]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                    {isAr
                      ? 'رقم الرحلة / شركة الطيران'
                      : isEn
                        ? 'Flight No. / Airline'
                        : 'N° de vol / Compagnie'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="TU 813 / MS 844"
                    className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Travel Purpose Selector */}
              <div className="pt-1 space-y-2">
                <label className="block text-xs font-bold text-[#102D45]">
                  {isAr
                    ? 'غرض السفر'
                    : isEn
                      ? 'Travel Purpose'
                      : 'Motif du voyage'}{' '}
                  <span className="text-rose-600">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {PURPOSE_OPTIONS.map((purpose) => {
                    const active = travelPurpose === purpose.id;
                    return (
                      <button
                        key={purpose.id}
                        type="button"
                        onClick={() => setTravelPurpose(purpose.id)}
                        className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition-colors text-start ${
                          active
                            ? 'border-[#102D45] bg-[#102D45] text-white'
                            : 'border-[#102D45]/15 bg-[#F5F7FA] text-[#102D45] hover:border-[#C8922A]'
                        }`}
                      >
                        {purpose[langKey]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-[#102D45] mb-1.5">
                  {isAr
                    ? 'ملاحظات إضافية (الفندق، المسافرون المرافقون...)'
                    : isEn
                      ? 'Additional Notes (hotel, companions, urgency)'
                      : 'Remarques complémentaires (hôtel, accompagnants, urgence)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: عائلة من 3 أفراد، نرغب في إصدار الضمان قبل رحلة الغد...'
                      : isEn
                        ? 'e.g. Family of 3 travelers, need clearance before tomorrow flight...'
                        : 'Ex : Voyage en duo, souhait de recevoir l’autorisation aujourd’hui...'
                  }
                  className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-sm text-[#102D45] focus:border-[#1C4967] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Required Documents Confirmation */}
              <label className="flex items-start gap-2.5 rounded-xl border border-[#C8922A]/35 bg-[#FFFDF7] p-3.5 text-xs text-[#102D45] cursor-pointer">
                <input
                  type="checkbox"
                  checked={documentsReady}
                  onChange={(e) => setDocumentsReady(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#102D45]"
                />
                <span>
                  {isAr
                    ? 'أؤكد أن نسخة جواز السفر + تذكرة الطائرة جاهزة للإرسال لبدء معالجة التصريح الأمني وخطاب الضمان خلال 4 ساعات.'
                    : isEn
                      ? 'I confirm my passport copy and flight ticket are ready to share to initiate the 4-hour Egyptian clearance / guarantee process.'
                      : 'Je confirme disposer de la copie du passeport et du billet d’avion afin de lancer le traitement de l’autorisation / garantie en 4 heures.'}
                </span>
              </label>
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
                    ? 'معالجة مخصصة لطلبات مصر · بدون تعقيد'
                    : isEn
                      ? 'Dedicated Egypt clearance workflow · CRM connected'
                      : 'Traitement dédié Visa & Garantie Égypte · connecté CRM'}
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
                    {isAr
                      ? 'إرسال عبر واتساب'
                      : isEn
                        ? 'Send via WhatsApp'
                        : 'Envoyer sur WhatsApp'}
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
                  <span>
                    {submitting
                      ? isAr
                        ? 'جاري الإرسال...'
                        : isEn
                          ? 'Submitting...'
                          : 'Envoi en cours...'
                      : block.content.primaryCtaLabel ||
                        (isAr
                          ? 'تقديم طلب التصريح الأمني (4 ساعات)'
                          : isEn
                            ? 'Submit Egypt Visa Request (4h)'
                            : 'Envoyer la demande Visa Égypte (4h)')}
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
