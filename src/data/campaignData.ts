import makkahSunriseImg from '../assets/images/makkah_haram_sunrise_1794604285606.jpg';
import tunisFlightImg from '../assets/images/tunis_jeddah_flight_1794604285597.jpg';
import makkahSuiteImg from '../assets/images/makkah_maysan_suite_1794604285710.jpg';
import madinahTwilightImg from '../assets/images/madinah_umbrellas_twilight_1794604286691.jpg';
import studioBackdropImg from '../assets/images/easy2book_studio_backdrop_1794604286505.jpg';
import egyptPyramidsReelImg from '../assets/images/egypt_pyramids_gem_9x16_1794694253332.jpg';
import egyptNileReelImg from '../assets/images/egypt_nile_cruise_9x16_1794694254619.jpg';
import egyptTransferReelImg from '../assets/images/egypt_vip_transfer_9x16_1794694254172.jpg';
import egyptIslamicReelImg from '../assets/images/egypt_islamic_cairo_9x16_1794694254977.jpg';
import turkeyIstanbulReelImg from '../assets/images/turkey_istanbul_reel_9x16_1794695568829.jpg';
import turkeyBosphorusReelImg from '../assets/images/turkey_bosphorus_reel_9x16_1794695569156.jpg';
import turkeySapancaReelImg from '../assets/images/turkey_sapanca_reel_9x16_1794695570077.jpg';
import visaDeskImg from '../assets/images/visa_travel_desk_1794651030778.jpg';
import visaEuropeImg from '../assets/images/visa_europe_paris_1794652721585.jpg';
import dubaiSkylineImg from '../assets/images/dubai_skyline_luxury_1794652718471.jpg';
import visaCanadaImg from '../assets/images/visa_canada_toronto_1794678796674.jpg';
import airlineCabinImg from '../assets/images/airline_business_cabin_1794678794936.jpg';
import sidiBouSaidImg from '../assets/images/sidi_bou_said_tunisia_1794678794613.jpg';
import flightsTabsStressImg from '../assets/images/flights_ferries_tabs_stress_1794942092639.jpg';
import flightsRelaxedSuitcaseImg from '../assets/images/flights_ferries_relaxed_suitcase_1794942092319.jpg';
import flightsMedShipImg from '../assets/images/flights_ferries_mediterranean_ship_1794942095727.jpg';
import flightsMobileEticketImg from '../assets/images/flights_ferries_mobile_eticket_1794942092613.jpg';
import evisaPassportGlobeImg from '../assets/images/evisa_green_passport_globe_1795182883677.jpg';
import evisaWorldMapImg from '../assets/images/evisa_world_map_routes_1795179879338.jpg';
import evisaDestinationsCollageImg from '../assets/images/evisa_destinations_collage_1795179879370.jpg';
import evisaMobileCompanionImg from '../assets/images/evisa_mobile_companion_1795179881635.jpg';
import type { CountryFlagCode } from '../lib/realCountryFlags';

export interface ReelScene {
  id: string;
  indexLabel: string;
  arabicTitle: string;
  subtitleSummary: string;
  startSec: number;
  endSec: number;
  primaryImage: string;
  secondaryImage?: string;
  matchCutOffsetSec?: number;
  imageAlt: string;
  secondaryImageAlt?: string;
  overlayHeadline: string;
  overlayLines: string[];
  promptText: string;
  cameraMoveLabel: string;
  isStudioLockup?: boolean;
  overlayDir?: 'rtl' | 'ltr';
  overlayPosition?: 'bottom' | 'center';
  flagCodes?: CountryFlagCode[];
}

export interface SubtitleCue {
  startSec: number;
  endSec: number;
  text: string;
}

export interface VoiceOption {
  id: string;
  label: string;
  tone: string;
  descriptionFr: string;
  prebuiltVoice: string;
  stylePrompt: string;
}

export type ReelPresetId =
  | 'omra'
  | 'visa_services'
  | 'visa_egypt'
  | 'visa_schengen'
  | 'visa_dubai'
  | 'visa_qatar'
  | 'visa_oman'
  | 'visa_omra'
  | 'visa_international'
  | 'visa_evisa'
  | 'egypt_excursions'
  | 'turkey_excursions'
  | 'excursions_general'
  | 'flights_ferries';

export const TOTAL_REEL_DURATION_SEC = 48;

export const DEFAULT_TUNISIAN_SCRIPT =
  'تحب تعيش روحانية شهر رمضان الكل في مكة المكرمة، وإنت مرتاح البال ومن غير حتى تعب؟ مع Easy2Book، حضرنالك برنامج عمرة شهر رمضان كامل: طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة، وإقامة مريحة في فندق ميسان الملتزم، وزيد معاهم رحلة للمدينة المنورة! الأسعار تبدأ من خمسة آلاف وتسعمية دينار للشخص في غرفة رباعية أو خماسية، ستة آلاف وأربعمية دينار في غرفة ثلاثية، وستة آلاف وتسعمية دينار في غرفة ثنائية... مع تخفيض ميتين دينار للعائلات انطلاقاً من شخصين! وللمجموعات أكثر من عشرة أشخاص كلمونا للحصول على الإمكانية. عدد الغرف محدود جداً والعرض صالح لـ خمسطاش ديسمبر ألفين وستة وعشرين! كلمنا توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا احجز على easy2book.tn. Easy2Book... سفرتك أسهل!';

export const EGYPT_TUNISIAN_SCRIPT =
  'مسافرة ولا مسافر لمصر وتحب تعيش سحر القاهرة والأهرامات براحة تامة ومن غير قلق؟ مع Easy2Book، وفرنالك ستة رحلات وخدمات يومية للأفراد والمجموعات بأحسن الأسعار! توصيل بسيارة خاصة من المطار للنزل بمية وخمسة وسبعين دينار، وسهرة نايل كروز بالعشاء والمرشد بميتين وخمسة وعشرين دينار! وزيد عيش عظمة المتحف المصري الكبير والأهرامات شاملة الدخول ابتداءً من أربعمية وخمسة وعشرين دينار، مع جولة سيتي تور ابتداءً من ميتين وخمسة وعشرين دينار، وجولة القاهرة الإسلامية وخان الخليلي ابتداءً من ثلاثمية وخمسة وثمانين دينار، وسهرة الحان وصاحب السعادة من العشرة للوحدة متاع الليل! للحجز الفوري والاستفسار، كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا تواصل معانا على الواتساب. Easy2Book... سفرتك أسهل!';

export const TURKEY_TUNISIAN_SCRIPT =
  'مسافرة ولا مسافر لتركيا وتحب تستمتع بأجمل الرحلات اليومية في إسطنبول وأنطاليا من غير حتى تعب؟ مع Easy2Book، حضرنالك باقة كاملة: رحلات يومية بالمواصلات والغداء والدليل العربي لصبنجا ومعشوقية بخمسة وستين دينار، إزميت بخمسة وثمانين دينار، بورصا بمية دينار، وشيلا وأغوا بمية وخمسة دينار! وزيد جولات سفن جزر الأميرات والسهرات المسائية العربية والتركية على البسفور ابتداءً من مية وخمسة دينار شاملة المواصلات والعشاء! وتكت فيالاند الشامل بميتين وخمسة وأربعين دينار، وباقة أنطاليا للثنائي بألف ومية وخمسة وعشرين دينار، مع توصيل مطار إسطنبول وصبيحة بسيارة فيتو الخاصة ابتداءً من مية وخمسة وثمانين دينار! كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا ابعتلنا على الواتساب. Easy2Book... سفرتك أسهل!';

export const VISA_TUNISIAN_SCRIPT =
  'تلوج على خدمة فيزا موثوقة وسريعة من غير تعقيد ولا تأخير؟ مع Easy2Book، نجهزولك ملف التأشيرة متاعك الكل باحترافية! فيزا مصر في أربع ساعات فقط ابتداءً من تسعين دينار، مواعيد فضاء شنغن ابتداءً من مية وثمانين دينار، فيزا قطر شهر بمية وسبعين دينار، وفيزا دبي بالضمان ابتداءً من ثلاثمية وخمسين دينار، وعُمان ابتداءً من ميتين وثلاثين دينار، وفيزا العمرة بثمانمية وعشرين دينار! وزيد ملفات كندا بثمانمية وثلاثين، أمريكا بألف وثلاثين، بريطانيا بألف وأربعمية وثلاثين، أستراليا بألف وخمسمية وثلاثين، الصين بألف وثمانمية وثلاثين، ألبانيا ثلاثمية وثمانين مع الترجمة، وتايلاند بمية وثلاثين دينار، مع خدمة E-Visa لأكثر من خمسين وجهة دولية! كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش. Easy2Book... سفرتك أسهل!';

export const VISA_EGYPT_TUNISIAN_SCRIPT =
  'مبرمج مشية لمصر ومطلوب عليك خطاب ضمان؟ ابعث تسكرتك ونسخة من باسبورك! مطار الإنطلاق تونس أو أي مكان في العالم، مطار الوصول القاهرة، الغردقة، شرم الشيخ! في أربع ساعات يكون عندك تصريح أمني وضمان من غير حتى تعقيد. معانا، Easy2Book... سفرتك أسهل!';

export const VISA_EGYPT_TUNISIAN_SCRIPT_DISPLAY = `مبرمج مشية لمصر ومطلوب عليك خطاب ضمان؟
ابعث تسكرتك ونسخة من باسبورك!
مطار الإنطلاق: تونس أو أي مكان في العالم،
مطار الوصول: القاهرة، الغردقة، شرم الشيخ!
4 ساعات يكون عندك تصريح أمني وضمان من غير حتى تعقيد.
معانا... سفرتك أسهل!`;

export interface EgyptStoryboardRow {
  id: string;
  timeRange: string;
  startSec: number;
  visualAr: string;
  visualFr: string;
  onScreenText: string;
  voiceoverExcerpt: string;
}

export const VISA_EGYPT_STORYBOARD_ROWS: EgyptStoryboardRow[] = [
  {
    id: 'eg-sb-1',
    timeRange: '0–5 s',
    startSec: 0,
    visualAr: 'أهرامات الجيزة وعلم مصر الحقيقي',
    visualFr: 'Pyramides de Gizeh + drapeau réel d’Égypte',
    onScreenText: 'مبرمج مشية لمصر؟',
    voiceoverExcerpt: 'مبرمج مشية لمصر ومطلوب عليك خطاب ضمان؟',
  },
  {
    id: 'eg-sb-2',
    timeRange: '5–9 s',
    startSec: 5,
    visualAr: 'جواز السفر التونسي الأخضر + تذكرة الطائرة',
    visualFr: 'Passeport tunisien vert + billet d’avion',
    onScreenText: 'ابعث تسكرتك وباسبورك',
    voiceoverExcerpt: 'ابعث تسكرتك ونسخة من باسبورك!',
  },
  {
    id: 'eg-sb-3',
    timeRange: '9–14 s',
    startSec: 9,
    visualAr: 'مطار الإنطلاق ومطارات الوصول في مصر',
    visualFr: 'Aéroports de départ (Tunis / Monde) → Le Caire, Hurghada, Charm el-Cheikh',
    onScreenText: 'تونس أو أي مكان → القاهرة · الغردقة · شرم الشيخ',
    voiceoverExcerpt:
      'مطار الإنطلاق تونس أو أي مكان في العالم، مطار الوصول القاهرة، الغردقة، شرم الشيخ!',
  },
  {
    id: 'eg-sb-4',
    timeRange: '14–19 s',
    startSec: 14,
    visualAr: 'إصدار سريع خلال 4 ساعات (تصريح أمني وخطاب ضمان)',
    visualFr: 'Délivrance express en 4 heures · Autorisation sécuritaire & garantie',
    onScreenText: '4 ساعات · تصريح أمني وضمان',
    voiceoverExcerpt: '4 ساعات يكون عندك تصريح أمني وضمان من غير حتى تعقيد.',
  },
  {
    id: 'eg-sb-5',
    timeRange: '19–24 s',
    startSec: 19,
    visualAr: 'شعار Easy2Book وتواصل واتساب المباشر',
    visualFr: 'Logo Easy2Book & WhatsApp 98 140 514',
    onScreenText: 'معانا... سفرتك أسهل!',
    voiceoverExcerpt: 'معانا... سفرتك أسهل! Easy2Book · 98 140 514',
  },
];

export const VISA_SCHENGEN_TUNISIAN_SCRIPT =
  'تحب تحضّر ملف فيزا شنغن، فرنسا، كندا أو فيزا دراسة وأعمال من غير أخطاء ومن غير قلق؟ مع Easy2Book، نرافقوك خطوة بخطوة في تجهيز الملف الكامل! حجز مواعيد فضاء شنغن القياسية بمية وثمانين دينار، ومواعيد Prime Time شاملة بميتين وثمانين دينار! ونحضّرولك وثائق السفر، حجوزات الطيران والفنادق المؤكدة، الترجمة المعتمدة وتأمين السفر المطابق للشروط القنصلية! وزيد تحضير ملفات فيزا كندا بثمانمية وثلاثين دينار، أمريكا بألف وثلاثين، وبريطانيا بألف وأربعمية وثلاثين دينار للطلبة ورجال الأعمال والعائلات! كلم مركز الفيزا Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا ابعتلنا على الواتساب. Easy2Book... سفرتك أسهل!';

export const VISA_DUBAI_TUNISIAN_SCRIPT =
  'ناوية ولا ناوي تسافر لدبي والإمارات؟ مع Easy2Book، تستخرج فيزا دبي السياحية أو الإقامة بكل سلاسة! فيزا سياحية بالضمان بثلاثمية وخمسين دينار لشهر واحد وخمسمية وخمسين دينار لشهرين، أو بدون ضمان بأربعمية وثلاثين دينار لشهر وستمية وثمانين دينار لشهرين! وعندنا زادة فيزا الأطفال أقل من طناش سنة ابتداءً من ثلاثمية وثلاثين دينار، فيزا متعددة الدخول من سبعمية وعشرة دينار، تمديد الإقامة داخل الإمارات بألف ومية وعشرة دينار، وإقامة سنتين شاملة الهوية الإماراتية بستة آلاف وثمانمية وثلاثين دينار، مع خيار Express السريع في ثمانية وأربعين إلى اثنين وسبعين ساعة! الوثائق: نسخة جواز السفر وصورة خلفية بيضاء واضحة. كلم Easy2Book على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش!';

export const VISA_QATAR_TUNISIAN_SCRIPT =
  'تحب تسافر لقطر للسياحة ولا للعمل؟ مع Easy2Book، وفرنالك كل حلول فيزا قطر الرسمية! الفيزا السياحية لمدة شهر بمية وسبعين دينار برك، وتجهزلك بسرعة وبأبسط الوثائق: نسخة جواز السفر وصورة شمسية واضحة على خلفية بيضاء! وللراغبين في فيزا قطر السنوية أو للعمل بدون ID قطر، متوفرة بألف وثلاثمية وثمانين دينار للرجال وألف وتسعمية وثمانين دينار للنساء، مع وضوح كامل لرسوم الفحص الطبي والبصمة وبطاقة الإقامة في قطر! تواصل توا مع فريق Easy2Book على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، واحجز ملفك اليوم. Easy2Book... سفرتك أسهل!';

export const VISA_OMAN_TUNISIAN_SCRIPT =
  'تحب تزور سلطنة عُمان للسياحة ولا للإقامة؟ مع Easy2Book، نوفرولك كل تأشيرات عُمان من يومين إلى أسبوع! فيزا سياحية عشرة أيام بميتين وثلاثين دينار، وفيزا شهر واحد بثلاثمية وثلاثين دينار للرجال وثلاثمية وثمانين دينار للنساء! وإذا تلوج على إقامة طويلة، فيزا إقامة سنتين شاملة بطاقة الهوية في عُمان بسبعة آلاف وخمسمية وثلاثين دينار للرجال وتسعة آلاف وخمسمية وثلاثين دينار للنساء في خمسطاش إلى عشرين يوم! الأوراق المطلوبة: نسخة جواز السفر وصورة على خلفية بيضاء ممسوحة بوضوح. كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش!';

export const VISA_OMRA_TUNISIAN_SCRIPT =
  'تحب تستخرج فيزا العمرة للمملكة العربية السعودية بكل طمأنينة وسرعة؟ مع Easy2Book، نجهزولك فيزا العمرة الرسمية بثمانمية وعشرين دينار فقط! نحرصو على مراجعة نسخة جواز السفر، الصورة الشمسية على خلفية بيضاء، تذكرة الطائرة، ومرافقتك في تأكيد رمز البصمة السعودية Saudi Bio خطوة بخطوة باش يكون سفرك لمكة والمدينة ميسر ومن غير حتى تعب! للطلب السريع والاستفسار، كلم مركز خدمات التأشيرات Easy2Book على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش. Easy2Book... سفرتك أسهل!';

export const VISA_INTERNATIONAL_TUNISIAN_SCRIPT =
  'تحضّر لسفر دولي نحو الصين، كندا، أمريكا، بريطانيا ولا أستراليا؟ مع Easy2Book، نتكفلو بإعداد ملفك القنصلي كامل وحجز الموعد! ملف فيزا كندا شامل الموعد بثمانمية وثلاثين دينار، أمريكا بألف وثلاثين، بريطانيا بألف وأربعمية وثلاثين، وأستراليا بألف وخمسمية وثلاثين دينار، والوثائق المبدئية نسخة الجواز وصورة خلفية بيضاء! وللصين، نجهزو الملف السياحي الكامل بألف وثمانمية وثلاثين دينار، الدعوة الرسمية بثلاثة آلاف وثلاثين دينار، وفيزا العمل Z حسب الطلب! كلم Easy2Book على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش!';

export const VISA_EVISA_TUNISIAN_SCRIPT =
  'تحب تسافر وتكتشف العالم؟ وعندك Passeport تونسي؟ اسمع المعلومة هاذي! فمّا برشا وجهات في العالم تنجم تقدّم على الفيزا متاعها إلكترونياً، من غير ما تبدأ بالإجراءات التقليدية متاع السفارة. من إفريقيا لآسيا، ومن أوروبا للأمريكيتين… وجهات مختلفة تستنّاك! كيف رواندا، تنزانيا، الكاميرون، قطر، البحرين، فيتنام، أوزبكستان، ألبانيا، كولومبيا، والبهاماس! مع Easy2Book، نعاونك تفهم إجراءات التأشيرة، تعرف الوثائق المطلوبة، وتحضّر مطلبك بطريقة أسهل. ما تخليش إجراءات الفيزا توقف أحلامك! Easy2Book — خطوتك الأولى نحو العالم! ابعثلنا توّة، واسألنا على وجهتك!';

export const VISA_EVISA_TUNISIAN_SCRIPT_DISPLAY = `تحب تسافر وتكتشف العالم؟ 🌍
وعندك Passeport تونسي؟

اسمع المعلومة هاذي!

فمّا برشا وجهات في العالم تنجم تقدّم على الفيزا متاعها إلكترونياً، من غير ما تبدأ بالإجراءات التقليدية متاع السفارة.

من إفريقيا لآسيا، ومن أوروبا للأمريكيتين…
وجهات مختلفة تستنّاك!

كيف رواندا، تنزانيا، الكاميرون، قطر، البحرين، فيتنام، أوزبكستان، ألبانيا، كولومبيا، والبهاماس!

مع Easy2Book، نعاونك تفهم إجراءات التأشيرة، تعرف الوثائق المطلوبة، وتحضّر مطلبك بطريقة أسهل.

ما تخليش إجراءات الفيزا توقف أحلامك!

Easy2Book — خطوتك الأولى نحو العالم! ✈️

ابعثلنا توّة، واسألنا على وجهتك!`;

export const VISA_EVISA_LEGAL_DISCLAIMER_AR =
  'ملاحظة: شروط التأشيرة تختلف حسب البلد، والجنسية، ومدة الإقامة. القبول النهائي يبقى من اختصاص سلطات البلد المعني.';

export const VISA_EVISA_LEGAL_DISCLAIMER_FR =
  'Note : Les conditions de visa varient selon le pays, la nationalité et la durée du séjour. L’approbation finale relève exclusivement des autorités du pays concerné.';

export const VISA_EVISA_MARKETING_ADVICE = {
  titleFr: 'Conseil marketing & conformité E-Visa',
  titleAr: 'نصيحة تسويقية ومهنية حول E-Visa',
  recommendedFr: 'Des destinations accessibles avec des formalités électroniques',
  avoidFr: '42 pays sans visa',
  detailFr:
    'Utilise « Des destinations accessibles avec des formalités électroniques » plutôt que « 42 pays sans visa ». Un E-Visa reste une demande de visa, et son obtention n’est jamais garantie.',
  detailAr:
    'استعمل عبارة « وجهات متاحة بإجراءات تأشيرة إلكترونية » بدل « 42 دولة بدون فيزا ». لأن الـ E-Visa يبقى مطلب تأشيرة إلكتروني، والقبول النهائي يبقى دائماً من اختصاص سلطات البلد المعني.',
};

export interface EvisaHookAngle {
  id: string;
  numberLabel: string;
  titleFr: string;
  titleAr: string;
  tagFr: string;
  visualFr: string;
  visualAr: string;
  hookVoiceoverFr: string;
  screenHeadline: string;
  screenSubline: string;
  whyItWorksFr: string;
  whyItWorksAr: string;
  sfxCueFr: string;
}

export const VISA_EVISA_HOOK_ANGLES: EvisaHookAngle[] = [
  {
    id: 'hook-shock',
    numberLabel: '01',
    titleFr: 'L’angle « Choc & Croyance limitante »',
    titleAr: 'زاوية « الصدمة وكسر الفكرة الشائعة »',
    tagFr: 'Très fort pour l’engagement',
    visualFr:
      'Quelqu’un qui regarde son passeport tunisien d’un air blasé, puis qui le jette sur une table où apparaissent soudainement des billets d’avion et des paysages paradisiaques.',
    visualAr:
      'شخص ينظر إلى جواز سفره التونسي بملل، ثم يضعه على الطاولة فتظهر فجأة تذاكر طيران ومناظر سياحية ساحرة.',
    hookVoiceoverFr:
      '« Tu penses que ton passeport tunisien te bloque partout ? Détrompe-toi. »',
    screenHeadline: 'TU PENSES ÊTRE BLOQUÉ ?',
    screenSubline: 'Détrompe-toi : des dizaines de destinations t’attendent en E-Visa.',
    whyItWorksFr:
      'Ça brise immédiatement une frustration commune en Tunisie et crée un effet de surprise qui retient l’attention dès la première seconde.',
    whyItWorksAr:
      'يكسر فوراً إحباطاً شائعاً في تونس ويصنع عنصر مفاجأة يشد الانتباه من الثانية الأولى.',
    sfxCueFr: 'SFX 0,5 s : Tampon de passeport qui claque',
  },
  {
    id: 'hook-speed',
    numberLabel: '02',
    titleFr: 'L’angle « Rapidité & Zéro galère »',
    titleAr: 'زاوية « السرعة وبدون تعقيد »',
    tagFr: 'Axé sur la solution',
    visualFr:
      'Gros plan sur un téléphone où l’on clique sur "Valider", transition immédiate (match cut) vers la porte d’embarquement à l’aéroport de Tunis-Carthage.',
    visualAr:
      'لقطة قريبة على الهاتف عند الضغط على « Valider »، مع انتقال فوري (Match Cut) إلى بوابة الصعود في مطار تونس قرطاج.',
    hookVoiceoverFr:
      '« Oublie les rendez-vous interminables à l’ambassade. Voici 42 pays accessibles en quelques clics. »',
    screenHeadline: 'ZÉRO AMBASSADE · EN 3 CLICS ⚡',
    screenSubline: 'Des formalités électroniques simples avant Tunis-Carthage.',
    whyItWorksFr:
      'Ça attaque directement la douleur principale des voyageurs (la paperasse et l’attente) en promettant de la simplicité.',
    whyItWorksAr:
      'يعالج مباشرة أكبر مشكلة لدى المسافرين (الأوراق والانتظار الطويل) ويقدّم وعداً بالبساطة.',
    sfxCueFr: 'SFX 0,5 s : Clic sec + notification de validation',
  },
  {
    id: 'hook-curiosity',
    numberLabel: '03',
    titleFr: 'L’angle « Curiosité & Chiffre précis »',
    titleAr: 'زاوية « الفضول والرقم الدقيق »',
    tagFr: 'Idéal pour l’animation de drapeaux',
    visualFr:
      'Gros plan dynamique sur la couverture verte du passeport tunisien qui s’ouvre, laissant jaillir une vague de drapeaux réels des pays.',
    visualAr:
      'لقطة ديناميكية على الغلاف الأخضر لجواز السفر التونسي وهو يُفتح لتخرج منه موجة من الأعلام الحقيقية للدول.',
    hookVoiceoverFr:
      '« 42 destinations dans le monde n’attendent que ton passeport tunisien… et ton e-visa. »',
    screenHeadline: '42 DESTINATIONS · E-VISA 🌍',
    screenSubline: 'Passeport tunisien + formalités en ligne : découvre la liste.',
    whyItWorksFr:
      'Le chiffre exact (42) intrigue et donne envie de rester pour voir quels pays font partie de la liste.',
    whyItWorksAr:
      'الرقم الدقيق (42) يثير الفضول ويدفع المشاهد للبقاء حتى يعرف قائمة الدول المتاحة.',
    sfxCueFr: 'SFX 0,5 s : Whoosh dynamique sur l’ouverture du passeport',
  },
  {
    id: 'hook-urgency',
    numberLabel: '04',
    titleFr: 'L’angle « Urgence / Appel au voyage »',
    titleAr: 'زاوية « التشويق ودعوة السفر الفوري »',
    tagFr: 'Émotionnel',
    visualFr:
      'Une valise qui se ferme d’un coup sec, suivi d’un plan rapide d’un passeport posé à côté d’un café à l’aéroport.',
    visualAr:
      'حقيبة سفر تُغلق بحركة سريعة، متبوعة بلقطة لجواز سفر موضوع بجانب قهوة في المطار.',
    hookVoiceoverFr:
      '« Et si ton prochain voyage commençait aujourd’hui, sans même sortir de chez toi ? »',
    screenHeadline: 'TON VOYAGE COMMENCE ICI ✈️',
    screenSubline: 'Prépare ton E-Visa aujourd’hui, sans même sortir de chez toi.',
    whyItWorksFr:
      'Ça projette immédiatement le spectateur dans l’excitation du départ.',
    whyItWorksAr:
      'يدخل المشاهد مباشرة في حماس الاستعداد للسفر والانطلاق.',
    sfxCueFr: 'SFX 0,5 s : Zip sec de valise + whoosh aéroport',
  },
];

export const VISA_EVISA_RETENTION_TIPS = [
  {
    id: 'ret-sound',
    titleFr: 'Le son (dès 0,5 s)',
    titleAr: 'الصوت (عند الثانية 0.5)',
    detailFr:
      'Utilise un bruitage sec (type whoosh, tampon de passeport qui claque ou notification de validation) dès la 0,5ème seconde pour stopper le scroll.',
    detailAr:
      'استعمل مؤثراً صوتياً حاداً (Whoosh، صوت ختم جواز السفر أو إشعار تأكيد) عند الثانية 0.5 لإيقاف التمرير فوراً.',
  },
  {
    id: 'ret-text',
    titleFr: 'Le texte à l’écran (70 % sans son)',
    titleAr: 'النص على الشاشة (70% بدون صوت)',
    detailFr:
      'Garde un texte très gros, contrasté (blanc ou jaune sur fond sombre/flouté) et centré, car 70 % des utilisateurs regardent les vidéos sans le son au début.',
    detailAr:
      'حافظ على نص كبير جداً ومتباين (أبيض أو أصفر على خلفية داكنة/مموهة) في وسط الشاشة لأن 70% يشاهدون الثواني الأولى بدون صوت.',
  },
];

export interface EvisaStoryboardRow {
  id: string;
  timeRange: string;
  startSec: number;
  visualFr: string;
  visualAr: string;
  onScreenText: string;
  voiceoverExcerpt: string;
}

export const VISA_EVISA_STORYBOARD_ROWS: EvisaStoryboardRow[] = [
  {
    id: 'ev-sb-1',
    timeRange: '0–4 s',
    startSec: 0,
    visualFr: 'Passeport tunisien vert + globe',
    visualAr: 'جواز السفر التونسي الأخضر + كرة أرضية',
    onScreenText: 'PASSEPORT TUNISIEN ?',
    voiceoverExcerpt:
      'تحب تسافر وتكتشف العالم؟ 🌍 وعندك Passeport تونسي؟ اسمع المعلومة هاذي!',
  },
  {
    id: 'ev-sb-2',
    timeRange: '4–10 s',
    startSec: 4,
    visualFr: 'Animation de carte du monde',
    visualAr: 'تحريك خريطة العالم ومسارات السفر',
    onScreenText: 'LE MONDE VOUS ATTEND 🌍',
    voiceoverExcerpt:
      'فمّا برشا وجهات في العالم تنجم تقدّم على الفيزا متاعها إلكترونياً، من غير ما تبدأ بالإجراءات التقليدية متاع السفارة.',
  },
  {
    id: 'ev-sb-3',
    timeRange: '10–23 s',
    startSec: 10,
    visualFr: 'Drapeaux des destinations',
    visualAr: 'أعلام وصور الوجهات الدولية',
    onScreenText: 'E-VISA • VISA EN LIGNE',
    voiceoverExcerpt:
      'من إفريقيا لآسيا، ومن أوروبا للأمريكيتين… وجهات مختلفة تستنّاك! كيف رواندا، تنزانيا، الكاميرون، قطر، البحرين، فيتنام، أوزبكستان، ألبانيا، كولومبيا، والبهاماس!',
  },
  {
    id: 'ev-sb-4',
    timeRange: '23–33 s',
    startSec: 23,
    visualFr: 'Logo Easy2Book + téléphone',
    visualAr: 'شعار Easy2Book + هاتف وتحضير الملف',
    onScreenText: 'ON VOUS ACCOMPAGNE',
    voiceoverExcerpt:
      'مع Easy2Book، نعاونك تفهم إجراءات التأشيرة، تعرف الوثائق المطلوبة، وتحضّر مطلبك بطريقة أسهل. ما تخليش إجراءات الفيزا توقف أحلامك!',
  },
  {
    id: 'ev-sb-5',
    timeRange: '33–42 s',
    startSec: 33,
    visualFr: 'WhatsApp / contact Easy2Book',
    visualAr: 'واتساب وتواصل Easy2Book المباشر',
    onScreenText: 'CONTACTEZ-NOUS',
    voiceoverExcerpt:
      'Easy2Book — خطوتك الأولى نحو العالم! ✈️ ابعثلنا توّة، واسألنا على وجهتك!',
  },
];

export const EXCURSIONS_GENERAL_TUNISIAN_SCRIPT =
  'تحب تعيش أجمل الرحلات اليومية والجولات السياحية في مصر، تركيا، دبي وتونس براحة تامة وتنظيم محترف؟ مع Easy2Book، اخترنا لك باقة رحلات للأفراد والعائلات والمجموعات بأحسن الأسعار! في مصر، توصيل المطار بمية وخمسة وسبعين دينار، سهرة نايل كروز بميتين وخمسة وعشرين دينار، والأهرامات والمتحف الكبير ابتداءً من أربعمية وخمسة وعشرين دينار! وفي تركيا، رحلات صبنجا وبورصا ابتداءً من خمسة وستين دينار وسهرات البسفور ابتداءً من مية وخمسة دينار مع توصيل مطار إسطنبول VIP! وزيد رحلات دبي وسيدي بوسعيد والصحراء التونسية بسيارات خاصة مكيفة ومرشد مرافق! كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش. Easy2Book... سفرتك أسهل!';

export const FLIGHTS_FERRIES_SCRIPT =
  "15 onglets ouverts juste pour réserver un billet d’avion ou de bateau ? Arrête tout de suite. Que tu partes par les airs ou par la mer, il y a beaucoup plus simple. Sur Easy2Book, toutes les compagnies aériennes et maritimes sont au même endroit. Que ce soit pour un vol express ou ta traversée d'été Méditerranée Tunisie-France, Tunisie-Italie ou vers les îles, tu compares, tu choisis ton tarif, et c'est réservé en quelques secondes. Pas de frais surprises à la fin, ton billet est directement dans ton téléphone. Easy2Book, the easiest way to travel. Prépare tes valises, clique sur le lien et réserve ton prochain départ maintenant.";

export const FLIGHTS_FERRIES_ARABIC_SCRIPT =
  'خمسطاش نافذة محلولة بش تحجز تذكرة طيارة ولا باخرة؟ وقّف هذا الكل توا! سواء مسافر في الجو ولا في البحر، الحل أسهل برشة. على Easy2Book، كل شركات الطيران والبواخر في بلاصة وحدة: رحلات جوية سريعة ولا عبّارات الصيف تونس-فرنسا وتونس-إيطاليا والجزر. تقارن، تختار سعرك وتحجز في ثواني من غير مصاريف خفية، وتذكرتك توصلك مباشرة على تليفونك. حضّر شنطتك، اضغط على الرابط واحجز سفرتك القادمة توا مع Easy2Book على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش!';

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'Elias',
    label: 'إلياس · عميق وسردي (Elias)',
    tone: 'عميق وسردي',
    descriptionFr: 'Voix masculine, profonde, narrative',
    prebuiltVoice: 'Algenib',
    stylePrompt:
      'Deep, resonant, authoritative masculine narrative storyteller voice in Tunisian Arabic with calm, captivating pacing.',
  },
  {
    id: 'Layla',
    label: 'ليلى · ناعمة ومرحبة (Layla)',
    tone: 'ناعمة ومرحبة',
    descriptionFr: 'Voix féminine, douce, accueillante',
    prebuiltVoice: 'Sulafat',
    stylePrompt:
      'Soft, gentle, warmly welcoming feminine voice in Tunisian Arabic evoking hospitality and peace of mind.',
  },
  {
    id: 'Omar',
    label: 'عمر · حيوي وملهم (Omar)',
    tone: 'حيوي وملهم',
    descriptionFr: 'Voix masculine, dynamique, inspirante',
    prebuiltVoice: 'Orus',
    stylePrompt:
      'Dynamic, inspiring, confident masculine Tunisian Arabic voice with uplifting commercial clarity.',
  },
  {
    id: 'Sarah',
    label: 'سارة · احترافية وواضحة (Sarah)',
    tone: 'احترافية وواضحة',
    descriptionFr: 'Voix féminine, professionnelle, claire',
    prebuiltVoice: 'Zephyr',
    stylePrompt:
      'Clear, articulate, polished professional feminine voice in Tunisian Arabic for travel and hospitality offers.',
  },
  {
    id: 'Charon',
    label: 'صوت رخيم دافئ (Charon)',
    tone: 'وقور وهادئ',
    descriptionFr: 'Voix masculine, posée et chaleureuse',
    prebuiltVoice: 'Charon',
    stylePrompt:
      'Warm, reassuring, inspiring Tunisian Arabic commercial narrator with dignified pacing and clear pronunciation.',
  },
  {
    id: 'Kore',
    label: 'صوت ناعم واضح (Kore)',
    tone: 'ودود ومطمئن',
    descriptionFr: 'Voix féminine, claire et rassurante',
    prebuiltVoice: 'Kore',
    stylePrompt:
      'Gentle, crystal-clear, welcoming Tunisian Arabic female narrator with reassuring family-friendly warmth.',
  },
  {
    id: 'Fenrir',
    label: 'صوت إعلاني جهوري (Fenrir)',
    tone: 'حماسي للإعلان',
    descriptionFr: 'Voix masculine, puissante et commerciale',
    prebuiltVoice: 'Fenrir',
    stylePrompt:
      'Bold, resonant, energetic Tunisian Arabic commercial broadcast announcer with persuasive clarity.',
  },
  {
    id: 'Puck',
    label: 'صوت حيوي مشرق (Puck)',
    tone: 'خفيف وسلس',
    descriptionFr: 'Voix rythmée, légère et fluide',
    prebuiltVoice: 'Puck',
    stylePrompt:
      'Upbeat, lively, engaging Tunisian Arabic narrator with crisp modern commercial rhythm.',
  },
  {
    id: 'Zephyr',
    label: 'صوت نسائي مشرق وواضح (Zephyr)',
    tone: 'واضح ومنعش',
    descriptionFr: 'Voix féminine, lumineuse et fluide',
    prebuiltVoice: 'Zephyr',
    stylePrompt:
      'Bright, articulate, uplifting female Tunisian Arabic travel presenter with smooth flow.',
  },
  {
    id: 'Aoede',
    label: 'صوت نسائي هادئ وطبيعي (Aoede)',
    tone: 'سلس ومريح',
    descriptionFr: 'Voix féminine, naturelle et apaisante',
    prebuiltVoice: 'Aoede',
    stylePrompt:
      'Breezy, natural, calm female Tunisian Arabic storyteller with warm hospitality tone.',
  },
  {
    id: 'Orus',
    label: 'صوت رجالي رصين وموثوق (Orus)',
    tone: 'رصين ومقنع',
    descriptionFr: 'Voix masculine, posée et fiable',
    prebuiltVoice: 'Orus',
    stylePrompt:
      'Firm, trustworthy, steady male Tunisian Arabic advisor delivering clear travel details.',
  },
  {
    id: 'Leda',
    label: 'صوت شاب حيوي ومباشر (Leda)',
    tone: 'عصري وحيوي',
    descriptionFr: 'Voix féminine, jeune et énergique',
    prebuiltVoice: 'Leda',
    stylePrompt:
      'Youthful, dynamic, vibrant female Tunisian Arabic social reel voiceover with crisp energy.',
  },
  {
    id: 'Sulafat',
    label: 'صوت دافئ رقيق ومطمئن (Sulafat)',
    tone: 'روحاني دافئ',
    descriptionFr: 'Voix chaleureuse et spirituelle',
    prebuiltVoice: 'Sulafat',
    stylePrompt:
      'Warm, serene, compassionate Tunisian Arabic voice suited for spiritual Ramadan Umrah narration.',
  },
  {
    id: 'Achird',
    label: 'صوت ترحيبي قريب وودود (Achird)',
    tone: 'ترحيبي وودود',
    descriptionFr: 'Voix conviviale et proche',
    prebuiltVoice: 'Achird',
    stylePrompt:
      'Friendly, approachable, conversational Tunisian Arabic travel concierge voice.',
  },
  {
    id: 'Algenib',
    label: 'صوت عميق وفخم (Algenib)',
    tone: 'عميق وفخم',
    descriptionFr: 'Voix grave, premium et posée',
    prebuiltVoice: 'Algenib',
    stylePrompt:
      'Deep, gravelly, authoritative luxury hospitality narrator in Tunisian Arabic.',
  },
  {
    id: 'Enceladus',
    label: 'صوت هادئ وباعث على السكينة (Enceladus)',
    tone: 'هادئ وروحاني',
    descriptionFr: 'Voix douce et sereine',
    prebuiltVoice: 'Enceladus',
    stylePrompt:
      'Soft, calm, peaceful Tunisian Arabic narrator evoking serenity and trust.',
  },
];

export const REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'إشراقة الحرم المكي',
    subtitleSummary: 'لقطة جوية بالدرون فوق المسجد الحرام عند شروق الشمس',
    startSec: 0,
    endSec: 10,
    primaryImage: makkahSunriseImg,
    imageAlt: 'لقطة جوية للمسجد الحرام في مكة المكرمة وقت الشروق الذهبي',
    overlayHeadline: 'عمرة رمضان كامل 🌙',
    overlayLines: ['مع Easy2Book'],
    cameraMoveLabel: 'Drone Forward Glide',
    promptText:
      'Vertical 9:16, cinematic aerial drone shot at golden hour sunrise over the Masjid al-Haram in Makkah, soft warm sunbeams illuminating the white marble courtyard and pilgrims in white Ihram attire, serene spiritual atmosphere, smooth slow forward camera glide, ultra-realistic 8k photography, shallow depth of field, warm golden and deep navy blue color grading, no text, no watermarks.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'الرحلة والإقامة الفاخرة',
    subtitleSummary: 'انتقال بصري من الطائرة نحو جناح فندق ميسان الملتزم بمكة',
    startSec: 10,
    endSec: 25,
    primaryImage: tunisFlightImg,
    secondaryImage: makkahSuiteImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'طائرة ركاب تحلق عبر سحب ذهبية عند الغروب في رحلة تونس جدة',
    secondaryImageAlt: 'جناح فندقي عصري في مكة المكرمة يطل على الحرم مع مستقبل رحلات ببدلة كحلية',
    overlayHeadline: 'شهر كامل في مكة 🕋',
    overlayLines: [
      '✈️ طيران تونس - جدة - تونس',
      '🛂 فيزا + تأطير كامل',
      '🏨 فندق ميسان الملتزم',
    ],
    cameraMoveLabel: 'Seamless Match-Cut · Gimbal Push',
    promptText:
      'Vertical 9:16, seamless cinematic match-cut sequence: first, a commercial passenger airplane ascending through golden clouds at sunset; transitioning smoothly into a luxury modern hotel suite in Makkah with floor-to-ceiling windows overlooking the holy city, warm ambient lighting, crisp white bedding, and a welcoming travel concierge smiling warmly in a tailored navy blue blazer, 4k photorealistic, fluid gimbal movement, no text.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'المدينة المنورة والأسعار',
    subtitleSummary: 'ساحة المسجد النبوي بالمظلات المضاءة وأسعار الغرف والتخفيض العائلي',
    startSec: 25,
    endSec: 36,
    primaryImage: madinahTwilightImg,
    imageAlt: 'ساحة المسجد النبوي في المدينة المنورة وقت الغسق مع المظلات المضاءة بالذهب',
    overlayHeadline: 'أسعار تبدأ من 5,900 د.ت',
    overlayLines: [
      'رباعية/خماسية 5,900 · ثلاثية 6,400 · ثنائية 6,900 د.ت',
      'تخفيض 200 د.ت للعائلات انطلاقاً من شخصين',
    ],
    cameraMoveLabel: 'Gentle Camera Tilt Up',
    promptText:
      "Vertical 9:16, cinematic wide-to-medium shot of the Prophet's Mosque courtyard in Madinah at twilight, iconic giant white umbrellas illuminated by warm golden lanterns against a deep twilight navy blue sky, peaceful families walking calmly in traditional modest attire, gentle camera tilt up, rich atmospheric lighting, 8k filmic look, no text.",
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'خاتمة Easy2Book',
    subtitleSummary: 'خلفية ثلاثية الأبعاد بأمواج زجاجية ذهبية وكحلية للشعار والدعوة للحجز',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو ثلاثية الأبعاد بيضاء ناعمة مع أمواج زجاجية كحلية وذهبية',
    overlayHeadline: 'عدد غرف محدود جداً ⏳',
    overlayLines: ['عرض صالح لـ 15 ديسمبر 2026', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: '60fps Studio Glass Motion',
    promptText:
      'Vertical 9:16, clean minimalist 3D motion graphic background, soft luminous off-white studio environment with subtle floating golden light particles and sleek translucent navy blue and warm gold glass waves gently moving in the background, bright centered negative space designed for logo placement, commercial broadcast quality, 60fps smooth motion, no text.',
  },
];

export const EGYPT_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'المتحف الكبير والأهرامات',
    subtitleSummary: 'لقطة بانورامية لأهرامات الجيزة وأبو الهول وقت الشروق الذهبي',
    startSec: 0,
    endSec: 10,
    primaryImage: egyptPyramidsReelImg,
    imageAlt: 'أهرامات الجيزة وأبو الهول في مصر عند الشروق الذهبي',
    overlayHeadline: 'رحلات يومية مصر 🇪🇬',
    overlayLines: ['مع Easy2Book · للأفراد والجروبات'],
    cameraMoveLabel: 'سيارة خاصة + مرشد شامل الدخول',
    promptText:
      'Vertical 9:16 cinematic shot of the Great Pyramids of Giza at golden hour sunrise.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'نايل كروز والتوصيل الخاص',
    subtitleSummary: 'انتقال سلس من سهرة النايل كروز إلى سيارة التوصيل الخاصة في القاهرة',
    startSec: 10,
    endSec: 25,
    primaryImage: egyptNileReelImg,
    secondaryImage: egyptTransferReelImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'سهرة عشاء على متن باخرة نايل كروز فاخرة في القاهرة ليلاً',
    secondaryImageAlt: 'سيارة خاصة فاخرة للاستقبال والتوصيل من المطار إلى الفندق بالقاهرة',
    overlayHeadline: 'راحة وأناقة في القاهرة ✨',
    overlayLines: [
      '🚘 توصيل المطار → النزل : 175 د.ت',
      '🚢 سهرة نايل كروز شاملة العشاء : 225 د.ت',
      '🏛️ الأهرامات + المتحف : من 425 د.ت',
    ],
    cameraMoveLabel: 'سيارة خاصة مكيفة + مرشد Easy2Book',
    promptText:
      'Vertical 9:16 Nile River luxury dinner cruise transitioning to VIP black sedan outside Cairo five-star hotel.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'القاهرة الإسلامية وسيتي تور',
    subtitleSummary: 'خان الخليلي والقلعة وسيتي تور وسهرة الحان / صاحب السعادة',
    startSec: 25,
    endSec: 36,
    primaryImage: egyptIslamicReelImg,
    imageAlt: 'شارع المعز وخان الخليلي ومسجد محمد علي بالقاهرة الإسلامية ليلاً',
    overlayHeadline: 'تاريخ، تسوّق وسهرات القاهرة',
    overlayLines: [
      '🕌 القاهرة الإسلامية شاملة التذاكر : من 385 د.ت',
      '🛍️ سيتي تور / 🎶 سهرة الحان : من 225 د.ت',
    ],
    cameraMoveLabel: 'مرافقة كاملة للأفراد من 1 إلى 10 أشخاص',
    promptText:
      'Vertical 9:16 architectural evening view of Islamic Cairo Khan El Khalili and Citadel Mosque.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'خاتمة Easy2Book · 98 140 514',
    subtitleSummary: 'شعار Easy2Book والرقم المباشر للحجز السريع عبر الهاتف والواتساب',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'احجز رحلاتك في مصر اليوم 📞',
    overlayLines: ['مركزية الحجز Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'خدمة متوفرة يومياً للأفراد والجروبات',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const TURKEY_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'إسطنبول والرحلات اليومية',
    subtitleSummary: 'صبنجا، معشوقية، إزميت، بورصا، شيلا وأغوا ويلوا مع الغداء والدليل العربي',
    startSec: 0,
    endSec: 10,
    primaryImage: turkeyIstanbulReelImg,
    imageAlt: 'إطلالة ساحرة على إسطنبول ومضيق البسفور وقت الغروب الذهبي',
    overlayHeadline: 'رحلات تركيا اليومية 🇹🇷',
    overlayLines: ['مع Easy2Book · صبنجا 65 د.ت · بورصا 100 د.ت'],
    cameraMoveLabel: 'مواصلات + غذاء + دليل سياحي عربي',
    promptText:
      'Vertical 9:16 golden sunset aerial shot overlooking Istanbul Bosphorus and Galata Tower.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'صبنجا وتوصيل المطار VIP',
    subtitleSummary: 'انتقال بصري من بحيرة صبنجا الخلابة إلى سيارات فيتو وسبرنتر الخاصة',
    startSec: 10,
    endSec: 25,
    primaryImage: turkeySapancaReelImg,
    secondaryImage: egyptTransferReelImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'بحيرة صبنجا وجبال معشوقية في تركيا مع سيارة فيتو خاصة',
    secondaryImageAlt: 'سيارة مرسيدس خاصة للتوصيل من مطار إسطنبول وصبيحة',
    overlayHeadline: 'طبيعة، راحة وتوصيل خاص ✨',
    overlayLines: [
      '🌿 صبنجا 65 د.ت · إزميت 85 د.ت · شيلا 105 د.ت',
      '🚐 فيتو 6 أشخاص : IST 185 د.ت / SAW 195 د.ت',
      '🚌 سبرنتر 14 شخص : IST 245 د.ت / SAW 265 د.ت',
    ],
    cameraMoveLabel: 'سيارات مرسيدس مكيفة من المطار وإلى المعالم',
    promptText:
      'Vertical 9:16 Sapanca Lake morning mist matching to VIP black Mercedes airport transfer.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'سهرات البسفور، فيالاند وأنطاليا',
    subtitleSummary: 'سفن جزر الأميرات والسهرات العربية والتركية وفيالاند وباقة أنطاليا للثنائي',
    startSec: 25,
    endSec: 36,
    primaryImage: turkeyBosphorusReelImg,
    imageAlt: 'باخرة عشاء فاخرة في مضيق البسفور بإسطنبول ليلاً مع أضواء الجسر',
    overlayHeadline: 'جزر الأميرات، البسفور وأنطاليا',
    overlayLines: [
      '🚢 جزر الأميرات والسهرات العربية : ابتداءً من 105 د.ت',
      '🎡 تكت فيالاند : 245 د.ت · 🏖️ باقة أنطاليا ثنائي : 1,125 د.ت',
    ],
    cameraMoveLabel: 'شامل المواصلات والعشاء · حجز فوري Easy2Book',
    promptText:
      'Vertical 9:16 luxury Bosphorus night dinner cruise deck illuminated bridge view.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'خاتمة Easy2Book · 98 140 514',
    subtitleSummary: 'شعار Easy2Book والرقم المباشر للحجز الفوري لرحلات تركيا عبر الهاتف والواتساب',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'احجز رحلاتك في تركيا اليوم 📞',
    overlayLines: ['مركز الحجوزات Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'خدمة يومية شاملة في إسطنبول وأنطاليا',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const VISA_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'خدمات الفيزا في Easy2Book',
    subtitleSummary: 'فيزا مصر في 4 ساعات ومواعيد فضاء شنغن مع تحضير كامل للملف',
    startSec: 0,
    endSec: 10,
    primaryImage: visaDeskImg,
    imageAlt: 'مكتب خدمات الفيزا والملفات القنصلية في Easy2Book',
    overlayHeadline: 'خدمة الفيزا و E-Visa الشاملة 🛂',
    overlayLines: ['مع Easy2Book · مصر من 90 د.ت · شنغن من 180 د.ت'],
    cameraMoveLabel: 'تجهيز احترافي وسريع لجميع التأشيرات',
    promptText:
      'Vertical 9:16 editorial desk view of passport and travel visa dossier preparation.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'شنغن، دبي، قطر، عُمان والعمرة',
    subtitleSummary: 'إصدار تأشيرات الخليج السياحية والإقامة لـ 2 سنوات وفيزا العمرة',
    startSec: 10,
    endSec: 25,
    primaryImage: visaEuropeImg,
    secondaryImage: dubaiSkylineImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'فضاء شنغن وأوروبا — مواعيد قياسية و Prime Time',
    secondaryImageAlt: 'فيزا دبي وقطر وعُمان السياحية والسنوية والإقامة',
    overlayHeadline: 'دبي، قطر، عُمان وشنغن ✨',
    overlayLines: [
      '🇦🇪 دبي بالضمان : 350 د.ت (شهر) / 550 د.ت (شهران)',
      '🇶🇦 قطر شهر : 170 د.ت · 🇴🇲 عُمان : من 230 د.ت',
      '🕋 فيزا العمرة : 820 د.ت (شاملة Saudi Bio)',
    ],
    cameraMoveLabel: 'إصدار سريع 2 إلى 7 أيام · خدمة Express متوفرة',
    promptText:
      'Vertical 9:16 Paris Schengen to Dubai skyline luxury visa travel transition.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'الملفات الدولية، الصين و +50 E-Visa',
    subtitleSummary: 'كندا، أمريكا، بريطانيا، أستراليا، الصين، ألبانيا، تايلاند و53 وجهة E-Visa',
    startSec: 25,
    endSec: 36,
    primaryImage: visaCanadaImg,
    imageAlt: 'ملفات التأشيرات الدولية كندا، أستراليا، بريطانيا، أمريكا والصين',
    overlayHeadline: 'كندا، أمريكا، الصين وألبانيا 🌍',
    overlayLines: [
      '🇨🇦 كندا 830 · 🇺🇸 أمريكا 1,030 · 🇬🇧 UK 1,430 · 🇦🇺 1,530 د.ت',
      '🇨🇳 الصين 1,830 · 🇦🇱 ألبانيا 380 · 🇹🇭 تايلاند 130 د.ت',
    ],
    cameraMoveLabel: 'مع 53 وجهة E-Visa متوفرة عند الطلب',
    promptText:
      'Vertical 9:16 Toronto international skyline visa services backdrop.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'تواصل مع Easy2Book · 98 140 514',
    subtitleSummary: 'مركز الفيزا Easy2Book للحجز والمتابعة السريعة عبر الهاتف والواتساب',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'قدّم ملف التأشيرة اليوم 📞',
    overlayLines: ['قسم الفيزا Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'مرافقة كاملة من الوثائق إلى استلام التأشيرة',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const VISA_EGYPT_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: '0–5 ث · مبرمج مشية لمصر وخطاب ضمان؟',
    subtitleSummary: 'مبرمج مشية لمصر ومطلوب عليك خطاب ضمان؟',
    startSec: 0,
    endSec: 5,
    primaryImage: egyptPyramidsReelImg,
    imageAlt: 'أهرامات الجيزة — خطاب ضمان وتصريح أمني لمصر مع Easy2Book',
    overlayHeadline: 'مبرمج مشية لمصر؟',
    overlayLines: ['مطلوب عليك خطاب ضمان أو تصريح أمني؟'],
    cameraMoveLabel: '0–5 ث · خطاف افتتاحي سريع · مصر',
    promptText: 'Vertical 9:16 Giza Pyramids editorial shot for Visa Egypte security clearance.',
    overlayDir: 'rtl',
    overlayPosition: 'center',
    flagCodes: ['EG'],
    isStudioLockup: false,
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: '5–9 ث · ابعث تسكرتك ونسخة من باسبورك',
    subtitleSummary: 'الوثائق المطلوبة فقط: نسخة من الجواز التونسي + تذكرة الطائرة',
    startSec: 5,
    endSec: 9,
    primaryImage: evisaPassportGlobeImg,
    imageAlt: 'جواز السفر التونسي الأخضر وتذكرة الطائرة لفيزا مصر',
    overlayHeadline: 'ابعث تسكرتك وباسبورك',
    overlayLines: ['نسخة من جواز السفر التونسي + تذكرة الطائرة برك!'],
    cameraMoveLabel: '5–9 ث · الجواز التونسي الأخضر وتذكرة الطائرة',
    promptText: 'Vertical 9:16 authentic dark green Tunisian passport beside travel globe.',
    overlayDir: 'rtl',
    overlayPosition: 'center',
    flagCodes: ['TN'],
    isStudioLockup: false,
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: '9–14 ث · مطار الإنطلاق والوصول',
    subtitleSummary: 'الإنطلاق تونس أو أي مكان في العالم ← القاهرة، الغردقة، شرم الشيخ',
    startSec: 9,
    endSec: 14,
    primaryImage: airlineCabinImg,
    imageAlt: 'رحلات جوية من تونس أو أي مطار في العالم نحو مصر',
    overlayHeadline: 'مطار الإنطلاق ✈️ مطار الوصول',
    overlayLines: [
      'الإنطلاق: تونس أو أي مكان في العالم',
      'الوصول: القاهرة · الغردقة · شرم الشيخ',
    ],
    cameraMoveLabel: '9–14 ث · جميع مطارات الإنطلاق والوصول',
    promptText: 'Vertical 9:16 aircraft flight view connecting Tunisia and worldwide airports to Egypt.',
    overlayDir: 'rtl',
    isStudioLockup: false,
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: '14–19 ث · في 4 ساعات تصريح أمني وضمان',
    subtitleSummary: '4 ساعات يكون عندك تصريح أمني وضمان من غير حتى تعقيد',
    startSec: 14,
    endSec: 19,
    primaryImage: egyptNileReelImg,
    imageAlt: 'إصدار التصريح الأمني وخطاب الضمان لمصر خلال 4 ساعات',
    overlayHeadline: 'في 4 ساعات فقط ⚡',
    overlayLines: [
      'تصريح أمني وضمان من غير حتى تعقيد',
      'ابعث تسكرتك ونسخة من باسبورك على واتساب',
    ],
    cameraMoveLabel: '14–19 ث · إصدار مضمون في 4 ساعات بدون تعقيد',
    promptText: 'Vertical 9:16 golden Cairo Nile skyline for 4-hour express Egypt guarantee.',
    overlayDir: 'rtl',
    isStudioLockup: false,
  },
  {
    id: 'scene-5',
    indexLabel: '05',
    arabicTitle: '19–24 ث · معانا... سفرتك أسهل!',
    subtitleSummary: 'Easy2Book · 98 140 514 · www.easy2book.tn',
    startSec: 19,
    endSec: 24,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'معانا... سفرتك أسهل!',
    overlayLines: ['مركز فيزا وضمان مصر Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: '19–24 ث · خاتمة Easy2Book وتواصل فوري',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
    overlayDir: 'rtl',
    isStudioLockup: true,
  },
];

export const VISA_DUBAI_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'فيزا دبي والإمارات السريعة',
    subtitleSummary: 'سياحية بالضمان أو بدون ضمان وإقامة سنتين ID شاملة',
    startSec: 0,
    endSec: 10,
    primaryImage: dubaiSkylineImg,
    imageAlt: 'أفق دبي مارينا — تأشيرات دبي والإمارات Easy2Book',
    overlayHeadline: 'فيزا دبي والإمارات 🇦🇪',
    overlayLines: ['بالضمان 350 / 550 DT · بدون ضمان 430 / 680 DT'],
    cameraMoveLabel: 'إصدار 2 إلى 7 أيام + خيار Express 48–72h',
    promptText: 'Vertical 9:16 Dubai Marina luxury skyline sunset.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'تعريفة السياحة والعائلات والتمديد',
    subtitleSummary: 'أطفال <12 سنة، دخول متعدد وتمديد من داخل الإمارات',
    startSec: 10,
    endSec: 25,
    primaryImage: visaDeskImg,
    secondaryImage: airlineCabinImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'ملفات تأشيرة دبي بالضمان وبدون ضمان',
    secondaryImageAlt: 'رحلات الطيران إلى دبي والإمارات',
    overlayHeadline: 'عروض دبي السياحية والعائلية ✨',
    overlayLines: [
      '👶 طفل (<12 سنة): 330 DT (شهر) / 430 DT (شهران)',
      '🔁 متعددة الدخول: 710 / 1,010 DT · تمديد 1,110 DT',
      '⚡ خيار Express سريع (48–72h): +60 DT',
    ],
    cameraMoveLabel: 'صالحة للرجال والنساء · الوثائق: جواز + صورة بيضاء',
    promptText: 'Vertical 9:16 visa desk transitioning to flight cabin.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'إقامة دبي سنتين (ID شاملة)',
    subtitleSummary: 'إقامة سنتين شاملة بطاقة الهوية الإماراتية بـ 6,830 د.ت',
    startSec: 25,
    endSec: 36,
    primaryImage: dubaiSkylineImg,
    imageAlt: 'إقامة دبي لمدة سنتين شاملة الهوية ID',
    overlayHeadline: 'إقامة سنتين ID شاملة 🏙️',
    overlayLines: [
      '🇦🇪 فيزا إقامة سنتين (ID مشمولة): 6,830 DT',
      '⏱️ مدة الإنجاز: 15 إلى 20 يوماً · جواز + صورة واضحة',
    ],
    cameraMoveLabel: 'مرافقة كاملة للأفراد ورواد الأعمال',
    promptText: 'Vertical 9:16 Dubai skyline dusk backdrop.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'تواصل مع Easy2Book · 98 140 514',
    subtitleSummary: 'تقديم ملف فيزا دبي وإقامة الإمارات عبر Easy2Book',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'قدّم ملف فيزا دبي اليوم 📞',
    overlayLines: ['قسم الفيزا Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'استجابة فورية على الهاتف والواتساب',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const VISA_QATAR_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'فيزا قطر السياحية والسنوية',
    subtitleSummary: 'تأشيرة سياحية شهر واحد بـ 170 د.ت فقط',
    startSec: 0,
    endSec: 10,
    primaryImage: dubaiSkylineImg,
    imageAlt: 'أفق الخليج والدوحة — فيزا قطر السياحية والعمل',
    overlayHeadline: 'فيزا قطر الرسمية 🇶🇦',
    overlayLines: ['سياحية شهر 170 DT · سنوية/عمل من 1,380 DT'],
    cameraMoveLabel: 'ملف مبسط · نسخة جواز + صورة بيضاء',
    promptText: 'Vertical 9:16 Gulf modern architecture skyline.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'السياحية والعمل (رجل وامرأة)',
    subtitleSummary: 'فيزا سنوية بدون ID قطر للرجال والنساء',
    startSec: 10,
    endSec: 25,
    primaryImage: visaDeskImg,
    secondaryImage: airlineCabinImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'ملفات فيزا قطر السياحية والعمل في Easy2Book',
    secondaryImageAlt: 'سفر مريح نحو الدوحة قطر',
    overlayHeadline: 'باقات فيزا قطر 2026 ✨',
    overlayLines: [
      '🏖️ فيزا قطر السياحية (شهر واحد): 170 DT',
      '👔 فيزا سنوية / عمل رجل (بدون ID): 1,380 DT',
      '👩‍💼 فيزا سنوية / عمل امرأة (بدون ID): 1,980 DT',
    ],
    cameraMoveLabel: 'متابعة دقيقة لإجراءات الدوحة',
    promptText: 'Vertical 9:16 dossier preparation matching airline travel.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'الرسوم التكميلية والوثائق',
    subtitleSummary: 'نسخة جواز السفر + صورة خلفية بيضاء واضحة',
    startSec: 25,
    endSec: 36,
    primaryImage: dubaiSkylineImg,
    imageAlt: 'شروط ورسوم فيزا قطر السنوية',
    overlayHeadline: 'وضوح كامل في الوثائق 📋',
    overlayLines: [
      '🛂 نسخة جواز السفر + صورة خلفية بيضاء ممسوحة بوضوح',
      '🏥 السنوية: +1,650 QAR تُدفع بقطر (فحص، بصمة، إقامة)',
    ],
    cameraMoveLabel: 'شفافية تامة قبل الإيداع',
    promptText: 'Vertical 9:16 Gulf business district twilight.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'تواصل مع Easy2Book · 98 140 514',
    subtitleSummary: 'احجز فيزا قطر السياحية أو السنوية مع Easy2Book',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'اطلب فيزا قطر اليوم 📞',
    overlayLines: ['قسم الفيزا Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'مرافقة مباشرة عبر الهاتف والواتساب',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const VISA_OMAN_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'فيزا سلطنة عُمان السريعة',
    subtitleSummary: '10 أيام 230 د.ت · شهر واحد ابتداءً من 330 د.ت',
    startSec: 0,
    endSec: 10,
    primaryImage: airlineCabinImg,
    imageAlt: 'السفر إلى سلطنة عُمان مع Easy2Book',
    overlayHeadline: 'فيزا سلطنة عُمان 🇴🇲',
    overlayLines: ['10 أيام 230 DT · شهر واحد من 330 DT'],
    cameraMoveLabel: 'السياحية في يومين إلى أسبوع',
    promptText: 'Vertical 9:16 luxury cabin sunrise flight toward Oman.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'السياحية وإقامة السنتين ID',
    subtitleSummary: 'تأشيرات رجال ونساء وإقامة سنتين شاملة الهوية',
    startSec: 10,
    endSec: 25,
    primaryImage: visaDeskImg,
    secondaryImage: dubaiSkylineImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'تحضير ملف فيزا سلطنة عُمان في Easy2Book',
    secondaryImageAlt: 'إقامة سنتين في عُمان شاملة بطاقة الهوية ID',
    overlayHeadline: 'تعريفة فيزا عُمان الكاملة ✨',
    overlayLines: [
      '🌴 10 أيام: 230 DT · شهر رجل 330 DT / امرأة 380 DT',
      '🏛️ إقامة سنتين (ID شاملة): رجل 7,530 DT',
      '👩 إقامة سنتين (ID شاملة): امرأة 9,530 DT',
    ],
    cameraMoveLabel: 'السياحية 2–7 أيام · الإقامة 15–20 يوماً',
    promptText: 'Vertical 9:16 visa desk matching modern Gulf coast architecture.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'الوثائق المطلوبة لعُمان',
    subtitleSummary: 'نسخة جواز السفر + صورة شمسية خلفية بيضاء واضحة',
    startSec: 25,
    endSec: 36,
    primaryImage: visaDeskImg,
    imageAlt: 'الوثائق المطلوبة لفيزا عُمان',
    overlayHeadline: 'الوثائق المطلوبة 📄',
    overlayLines: [
      '🛂 نسخة من جواز السفر',
      '📸 صورة شمسية بخلفية بيضاء ممسوحة بوضوح',
    ],
    cameraMoveLabel: 'استلام إلكتروني سريع بدون عناء',
    promptText: 'Vertical 9:16 passport visa documentation view.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'تواصل مع Easy2Book · 98 140 514',
    subtitleSummary: 'أودع طلب فيزا عُمان عبر Easy2Book',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'اطلب فيزا عُمان الآن 📞',
    overlayLines: ['قسم الفيزا Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'متابعة يومية مع مستشار التأشيرات',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const VISA_OMRA_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'فيزا العمرة · المملكة العربية السعودية',
    subtitleSummary: 'استخراج فيزا العمرة الإلكترونية الرسمية بـ 820 د.ت',
    startSec: 0,
    endSec: 10,
    primaryImage: makkahSunriseImg,
    imageAlt: 'المسجد الحرام بمكة المكرمة — فيزا العمرة Easy2Book',
    overlayHeadline: 'فيزا العمرة السعودية 🕋',
    overlayLines: ['السعر الموحد: 820 DT · متابعة Saudi Bio'],
    cameraMoveLabel: 'إصدار سريع ومضمون لضيوف الرحمن',
    promptText: 'Vertical 9:16 Masjid Al-Haram Makkah sunrise view.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'المرافقة الكاملة لـ Saudi Bio',
    subtitleSummary: 'تدقيق الجواز وتذكرة الطائرة وتفعيل رمز البصمة',
    startSec: 10,
    endSec: 25,
    primaryImage: tunisFlightImg,
    secondaryImage: madinahTwilightImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'رحلات تونس نحو جدة والمدينة المنورة',
    secondaryImageAlt: 'المسجد النبوي بالمدينة المنورة وقت الغسق',
    overlayHeadline: 'إجراءات ميسرة وواضحة ✨',
    overlayLines: [
      '🛂 مراجعة جواز السفر وتذكرة الطائرة',
      '📲 إرشاد كامل لتوليد رمز البصمة Saudi Bio',
      '📄 إصدار التأشيرة الإلكترونية المعتمدة',
    ],
    cameraMoveLabel: 'جاهزية تامة للسفر إلى مكة والمدينة',
    promptText: 'Vertical 9:16 flight to Jeddah transitioning to Madinah courtyard.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'الوثائق المطلوبة لفيزا العمرة',
    subtitleSummary: 'جواز، صورة، تذكرة طائرة، ورمز Saudi Bio',
    startSec: 25,
    endSec: 36,
    primaryImage: makkahSuiteImg,
    imageAlt: 'قائمة وثائق فيزا العمرة الأربعة',
    overlayHeadline: 'الوثائق الأربعة المطلوبة 📋',
    overlayLines: [
      '• نسخة جواز السفر + صورة خلفية بيضاء',
      '• تذكرة الطائرة + رمز البصمات Saudi Bio',
    ],
    cameraMoveLabel: 'سعر الفيزا: 820 DT',
    promptText: 'Vertical 9:16 Makkah view concierge preparation.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'تواصل مع Easy2Book · 98 140 514',
    subtitleSummary: 'احجز فيزا العمرة مع Easy2Book على 98 140 514',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'قدّم طلب فيزا العمرة 📞',
    overlayLines: ['قسم العمرة والفيزا Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'خدمة يومية مباشرة لحجوزات العمرة',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const VISA_INTERNATIONAL_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'الصين والملفات الدولية الكبرى',
    subtitleSummary: 'كندا، أمريكا، بريطانيا، أستراليا والصين بإعداد كامل',
    startSec: 0,
    endSec: 10,
    primaryImage: visaCanadaImg,
    imageAlt: 'فيزا كندا، أمريكا، بريطانيا وأستراليا في Easy2Book',
    overlayHeadline: 'التأشيرات الدولية الكبرى 🌍',
    overlayLines: ['كندا 830 · أمريكا 1,030 · بريطانيا 1,430 DT'],
    cameraMoveLabel: 'شاملة تحضير الملف وحجز المواعيد',
    promptText: 'Vertical 9:16 Toronto international downtown architecture.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'كندا، أمريكا، بريطانيا وأستراليا',
    subtitleSummary: 'تجهيز الاستمارات القنصلية والمواعيد الرسمية',
    startSec: 10,
    endSec: 25,
    primaryImage: visaEuropeImg,
    secondaryImage: airlineCabinImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'خدمات إعداد ملفات كندا وأمريكا وبريطانيا وأستراليا',
    secondaryImageAlt: 'رحلات دولية بعيدة المدى',
    overlayHeadline: 'ملفات دولية · الموعد مشمول ✈️',
    overlayLines: [
      '🇨🇦 كندا: 830 DT · 🇺🇸 أمريكا: 1,030 DT',
      '🇬🇧 بريطانيا: 1,430 DT · 🇦🇺 أستراليا: 1,530 DT',
      '📄 الوثائق: نسخة الجواز + صورة خلفية بيضاء',
    ],
    cameraMoveLabel: 'استمارات DS-160 / IRCC / UKVI بدقة عالية',
    promptText: 'Vertical 9:16 diplomatic travel matching to long-haul flight.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'ملفات فيزا الصين (سياحة وعمل)',
    subtitleSummary: 'السياحية 1,830 د.ت · الدعوة الرسمية 3,030 د.ت',
    startSec: 25,
    endSec: 36,
    primaryImage: visaDeskImg,
    imageAlt: 'ملف فيزا الصين السياحي والتجاري',
    overlayHeadline: 'تأشيرات الصين 🇨🇳',
    overlayLines: [
      '🏯 السياحية: 1,830 DT · دعوة رسمية: 3,030 DT',
      '💼 عمل (Z): حسب الطلب · جواز، كشف، B3، عمل',
    ],
    cameraMoveLabel: 'متابعة كاملة لتأشيرات رجال الأعمال والسياحة',
    promptText: 'Vertical 9:16 commercial visa desk dossier review.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'تواصل مع Easy2Book · 98 140 514',
    subtitleSummary: 'أودع ملفك الدولي عبر Easy2Book',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'ابدأ ملفك الدولي اليوم 📞',
    overlayLines: ['قسم التأشيرات الدولية Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'استشارة ومتابعة حتى الموعد القنصلي',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const VISA_EVISA_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: '0–4 s · Passeport tunisien vert + globe',
    subtitleSummary: 'تحب تسافر وتكتشف العالم؟ وعندك Passeport تونسي؟ اسمع المعلومة هاذي!',
    startSec: 0,
    endSec: 4,
    primaryImage: evisaPassportGlobeImg,
    imageAlt: 'Passeport tunisien vert foncé posé à côté d’un globe terrestre doré',
    overlayHeadline: 'PASSEPORT TUNISIEN ?',
    overlayLines: ['تحب تسافر وتكتشف العالم؟ وعندك Passeport تونسي؟'],
    cameraMoveLabel: '0–4 s · Plan serré passeport tunisien vert + globe',
    promptText: 'Vertical 9:16 editorial close-up of authentic dark green Tunisian passport beside brass world globe.',
    overlayDir: 'ltr',
    overlayPosition: 'center',
    flagCodes: ['TN'],
    isStudioLockup: false,
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: '4–10 s · Animation de carte du monde',
    subtitleSummary: 'وجهات في العالم تنجم تقدّم على الفيزا متاعها إلكترونياً من غير إجراءات السفارة التقليدية',
    startSec: 4,
    endSec: 10,
    primaryImage: evisaWorldMapImg,
    imageAlt: 'Carte du monde marine et or avec lignes aériennes depuis la Tunisie',
    overlayHeadline: 'LE MONDE VOUS ATTEND',
    overlayLines: ['Des destinations accessibles avec des formalités électroniques'],
    cameraMoveLabel: '4–10 s · Animation carte du monde depuis la Tunisie',
    promptText: 'Vertical 9:16 luxury navy and gold world map with glowing flight paths.',
    overlayDir: 'ltr',
    isStudioLockup: false,
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: '10–23 s · Drapeaux réels des destinations',
    subtitleSummary: 'رواندا، تنزانيا، الكاميرون، قطر، البحرين، فيتنام، أوزبكستان، ألبانيا، كولومبيا والبهاماس',
    startSec: 10,
    endSec: 23,
    primaryImage: evisaDestinationsCollageImg,
    imageAlt: 'Destinations E-Visa en Afrique, Asie, Europe et Amériques',
    overlayHeadline: 'E-VISA • VISA EN LIGNE',
    overlayLines: [
      'Afrique · Asie · Europe · Amériques — formalités électroniques',
    ],
    cameraMoveLabel: '10–23 s · Défilé des drapeaux réels des 10 destinations E-Visa',
    promptText: 'Vertical 9:16 editorial collage of E-Visa destinations across 4 continents with real national flags.',
    overlayDir: 'ltr',
    flagCodes: ['RW', 'TZ', 'CM', 'QA', 'BH', 'VN', 'UZ', 'AL', 'CO', 'BS'],
    isStudioLockup: false,
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: '23–33 s · Logo Easy2Book + téléphone',
    subtitleSummary: 'مع Easy2Book نعاونك تفهم الإجراءات، تعرف الوثائق المطلوبة وتحضّر مطلبك أسهل',
    startSec: 23,
    endSec: 33,
    primaryImage: evisaMobileCompanionImg,
    imageAlt: 'Voyageuse tunisienne souriante présentant son dossier E-Visa sur téléphone',
    overlayHeadline: 'ON VOUS ACCOMPAGNE',
    overlayLines: [
      'Easy2Book — خطوتك الأولى نحو العالم! ✈️',
      'فهم الإجراءات · الوثائق المطلوبة · تحضير المطلب بسهولة',
    ],
    cameraMoveLabel: '23–33 s · Logo Easy2Book + téléphone & dossier digital',
    promptText: 'Vertical 9:16 Tunisian traveler holding smartphone with digital travel confirmation.',
    overlayDir: 'ltr',
    isStudioLockup: false,
  },
  {
    id: 'scene-5',
    indexLabel: '05',
    arabicTitle: '33–42 s · WhatsApp / contact Easy2Book',
    subtitleSummary: 'ابعثلنا توّة، واسألنا على وجهتك · القبول النهائي من اختصاص سلطات البلد المعني',
    startSec: 33,
    endSec: 42,
    primaryImage: studioBackdropImg,
    imageAlt: 'Écran final studio Easy2Book contact WhatsApp 98 140 514',
    overlayHeadline: 'CONTACTEZ-NOUS',
    overlayLines: [
      'Easy2Book — خطوتك الأولى نحو العالم! ✈️',
      '📞 WhatsApp : 98 140 514 · www.easy2book.tn',
    ],
    cameraMoveLabel: '33–42 s · Contact WhatsApp Easy2Book + mention légale',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup with WhatsApp CTA.',
    overlayDir: 'ltr',
    isStudioLockup: true,
  },
];

export const VISA_SCHENGEN_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'فيزا شنغن، أوروبا وأمريكا الشمالية',
    subtitleSummary: 'تحضير الملف القنصلي والمواعيد القياسية و Prime Time لفضاء شنغن',
    startSec: 0,
    endSec: 10,
    primaryImage: visaEuropeImg,
    imageAlt: 'باريس وفضاء شنغن — خدمات ملفات التأشيرات والمواعيد في Easy2Book',
    overlayHeadline: 'فيزا شنغن، الدراسة والأعمال 🇪🇺',
    overlayLines: ['مع Easy2Book · مواعيد 180 د.ت · Prime Time 280 د.ت'],
    cameraMoveLabel: 'مراجعة دقيقة للملف القنصلي والتأمين',
    promptText:
      'Vertical 9:16 Paris architectural twilight for Schengen & business visa editorial backdrop.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'تجهيز الوثائق وحجوزات الطيران',
    subtitleSummary: 'انتقال من مكتب تجهيز الملفات إلى رحلات الطيران الأوروبية والدولية',
    startSec: 10,
    endSec: 25,
    primaryImage: visaDeskImg,
    secondaryImage: airlineCabinImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'مكتب تحضير ملفات شنغن، Campus France، كندا وأمريكا',
    secondaryImageAlt: 'طائرة دولية نحو أوروبا وأمريكا الشمالية',
    overlayHeadline: 'ملف متكامل بدون أخطاء 🛂',
    overlayLines: [
      '📄 تدقيق شامل للوثائق والاستمارات الرسمية',
      '✈️ حجوزات طيران وإقامة مطابقة للقنصلية',
      '🏥 تأمين سفر معتمد + مواعيد TLS / VFS',
    ],
    cameraMoveLabel: 'مرافقة للطلبة، العائلات ورجال الأعمال',
    promptText:
      'Vertical 9:16 passport dossier review matching smoothly to executive airline sunrise view.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'كندا، أمريكا، بريطانيا وأستراليا',
    subtitleSummary: 'تحضير ملفات الدراسة، السياحة والمهمات المهنية في الدول الكبرى',
    startSec: 25,
    endSec: 36,
    primaryImage: visaCanadaImg,
    imageAlt: 'تورونتو كندا — خدمات ملفات كندا وأمريكا وبريطانيا',
    overlayHeadline: 'كندا، أمريكا وبريطانيا 🌍',
    overlayLines: [
      '🇨🇦 كندا 830 د.ت · 🇺🇸 أمريكا 1,030 د.ت',
      '🇬🇧 بريطانيا 1,430 د.ت · 🇦🇺 أستراليا 1,530 د.ت',
    ],
    cameraMoveLabel: 'مواعيد وتجهيز احترافي لجميع المسافرين',
    promptText:
      'Vertical 9:16 Toronto modern skyline representing Canada and North America mobility visas.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'تواصل مع Easy2Book · 98 140 514',
    subtitleSummary: 'قسم التأشيرات Easy2Book للمرافقة السريعة وحجز الموعد',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'أودع ملف التأشيرة اليوم 📞',
    overlayLines: ['قسم الفيزا Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'تقييم أولي سريع ومرافقة حتى القنصلية',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const EXCURSIONS_GENERAL_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: 'رحلات يومية مصر، تركيا وتونس',
    subtitleSummary: 'جولات خاصة للأفراد والعائلات والمجموعات بسيارة مكيفة ومرشد',
    startSec: 0,
    endSec: 10,
    primaryImage: egyptPyramidsReelImg,
    imageAlt: 'الأهرامات والمتحف الكبير — رحلات وجولات Easy2Book',
    overlayHeadline: 'أجمل الرحلات اليومية 🌍',
    overlayLines: ['مع Easy2Book · مصر، تركيا، دبي وتونس'],
    cameraMoveLabel: 'سيارة خاصة مكيفة + مرشد سياحي مرافق',
    promptText:
      'Vertical 9:16 golden pyramids panorama launching multi-destination Easy2Book excursions reel.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: 'البسفور، صبنجا وسيدي بوسعيد',
    subtitleSummary: 'انتقال من سهرات البسفور بإسطنبول إلى سحر المتوسط في سيدي بوسعيد',
    startSec: 10,
    endSec: 25,
    primaryImage: turkeyBosphorusReelImg,
    secondaryImage: sidiBouSaidImg,
    matchCutOffsetSec: 6.5,
    imageAlt: 'سهرة عشاء على مضيق البسفور بإسطنبول',
    secondaryImageAlt: 'جولات سيدي بوسعيد والسياحة التونسية والعالمية',
    overlayHeadline: 'جولات بحرية وتجارب VIP ✨',
    overlayLines: [
      '🇪🇬 القاهرة: توصيل 175 · نايل كروز 225 · أهرامات 425 د.ت',
      '🇹🇷 تركيا: صبنجا 65 · بورصا 100 · البسفور 105 د.ت',
      '🇹🇳 تونس: سيدي بوسعيد، الحمامات والصحراء VIP',
    ],
    cameraMoveLabel: 'تنظيم يومي للأفراد والعائلات حتى 10 أشخاص',
    promptText:
      'Vertical 9:16 Bosphorus evening cruise matching to sunny Mediterranean Sidi Bou Said terrace.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: 'دبي، أنطاليا وتوصيل المطار VIP',
    subtitleSummary: 'رحلات ترفيهية وسيارات مرسيدس فيتو وسبرنتر من وإلى المطار',
    startSec: 25,
    endSec: 36,
    primaryImage: dubaiSkylineImg,
    imageAlt: 'دبي مارينا وأفق المدينة — رحلات وجولات VIP',
    overlayHeadline: 'دبي، أنطاليا وتوصيل VIP 🚐',
    overlayLines: [
      '🏖️ باقة أنطاليا ثنائي : 1,125 د.ت · فيالاند 245 د.ت',
      '🚐 فيتو مطار إسطنبول/القاهرة بأحسن الأسعار',
    ],
    cameraMoveLabel: 'تأكيد فوري حسب تواريخ سفركم',
    promptText:
      'Vertical 9:16 Dubai Marina skyline twilight representing VIP excursions and private transfers.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'خاتمة Easy2Book · 98 140 514',
    subtitleSummary: 'احجز رحلاتك اليومية وجولاتك الخاصة مباشرة مع Easy2Book',
    startSec: 36,
    endSec: 48,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو Easy2Book الذهبية والكحلية',
    overlayHeadline: 'احجز رحلتك اليوم 📞',
    overlayLines: ['مركز الحجوزات Easy2Book', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'خدمة يومية مباشرة عبر الهاتف والواتساب',
    promptText: 'Vertical 9:16 Easy2Book studio closing lockup.',
  },
];

export const FLIGHTS_FERRIES_REEL_SCENES: ReelScene[] = [
  {
    id: 'scene-1',
    indexLabel: '01',
    arabicTitle: '0:00 - 0:03 · Hook Multi-Onglets',
    subtitleSummary: 'Plan serré face caméra : personne exaspérée devant plein d’onglets ouverts',
    startSec: 0,
    endSec: 3,
    primaryImage: flightsTabsStressImg,
    imageAlt: 'Voyageur exaspéré devant 15 onglets ouverts sur ordinateur et téléphone',
    overlayHeadline: 'STOP aux 15 onglets ouverts ! 🛑',
    overlayLines: ['Arrête de comparer partout sans fin'],
    cameraMoveLabel: 'Jump Cut Rapide · Plan serré face caméra',
    overlayDir: 'ltr',
    promptText:
      '0:00-0:03 Plan serré face caméra. Personne exaspérée devant ordinateur/téléphone avec plein d’onglets ouverts.',
  },
  {
    id: 'scene-2',
    indexLabel: '02',
    arabicTitle: '0:03 - 0:08 · Transition Clap Détente',
    subtitleSummary: 'Clap de main : passage du stress au décor détendu (valise prête, lunettes de soleil)',
    startSec: 3,
    endSec: 8,
    primaryImage: flightsRelaxedSuitcaseImg,
    imageAlt: 'Voyageur détendu avec valise prête et lunettes de soleil face à la mer',
    overlayHeadline: 'Avion ✈️ ou Bateau ⛴️ ?',
    overlayLines: ['Par les airs ou par la mer, en toute simplicité'],
    cameraMoveLabel: 'Transition Clap de Main · Ambiance Soleil',
    overlayDir: 'ltr',
    promptText:
      '0:03-0:08 Transition rapide clap de main vers un décor détendu, valise prête et lunettes de soleil.',
  },
  {
    id: 'scene-3',
    indexLabel: '03',
    arabicTitle: '0:08 - 0:18 · Plateforme Easy2Book & Méditerranée',
    subtitleSummary: 'Sélection Avion puis Bateau (Tunisie-France/Italie, îles) et validation en 3 clics',
    startSec: 8,
    endSec: 18,
    primaryImage: flightsMedShipImg,
    secondaryImage: airlineCabinImg,
    matchCutOffsetSec: 5,
    imageAlt: 'Avion et Ferry Méditerranée — Traversées Tunisie-France, Italie et îles',
    secondaryImageAlt: 'Vols express et compagnies aériennes et maritimes sur Easy2Book',
    overlayHeadline: 'Tout au même endroit. Zéro prise de tête.',
    overlayLines: [
      '✈️ Vols express & toutes compagnies aériennes',
      '⛴️ Traversées Méditerranée : Tunisie–France, Italie & îles',
    ],
    cameraMoveLabel: 'Screen Flow Easy2Book · Mention locale 0:12',
    overlayDir: 'ltr',
    promptText:
      '0:08-0:18 Capture fluide Easy2Book : sélectionner Avion puis Bateau, trajets Tunisie-France/Italie, valider en 3 clics.',
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: '0:18 - 0:25 · E-Billet sur Téléphone',
    subtitleSummary: 'Retour face caméra, sourire confiant, présentation du e-billet sur smartphone',
    startSec: 18,
    endSec: 25,
    primaryImage: flightsMobileEticketImg,
    imageAlt: 'Voyageur souriant présentant son e-billet QR code directement sur smartphone',
    overlayHeadline: 'Ton billet en 3 clics 📲',
    overlayLines: [
      '0 frais surprises · E-billet direct sur ton téléphone',
      'Easy2Book, the easiest way to travel.',
    ],
    cameraMoveLabel: 'Face Caméra · Sourire & Preuve Mobile',
    overlayDir: 'ltr',
    promptText:
      '0:18-0:25 Retour face caméra, sourire confiant, la personne montre son e-billet sur son téléphone.',
  },
  {
    id: 'scene-5',
    indexLabel: '05',
    arabicTitle: '0:25 - 0:30 · Logo Easy2Book & CTA',
    subtitleSummary: 'Logo Easy2Book animé + flèche pointant vers le lien de réservation',
    startSec: 25,
    endSec: 30,
    primaryImage: studioBackdropImg,
    imageAlt: 'Logo Easy2Book animé avec appel à réserver',
    overlayHeadline: 'Réserve sur Easy2Book 👇',
    overlayLines: ['Prépare tes valises et réserve ton départ', '📞 98 140 514', '🌐 www.easy2book.tn'],
    cameraMoveLabel: 'Lockup Studio Animé · Flèche vers lien',
    isStudioLockup: true,
    overlayDir: 'ltr',
    promptText: '0:25-0:30 Logo Easy2Book animé + flèche pointant vers le lien.',
  },
];

export const FLIGHTS_FERRIES_SHOOTING_TIPS = [
  {
    id: 'tip-rhythm',
    title: 'Le rythme (Jump Cuts)',
    detail:
      'Coupez tous les blancs entre vos phrases (jump cuts) pour garder une énergie haute du début à la fin (format nerveux 25 à 35s).',
  },
  {
    id: 'tip-local',
    title: 'L’aspect local à 0:12 (Très fort pour le bateau)',
    detail:
      'Ciblez explicitement vos trajets phares à 0:12 — ex. traversées Méditerranée, Tunisie–France, Tunisie–Italie, îles (« Que ce soit pour un vol express ou ta traversée d’été... ») — pour booster immédiatement le taux de clic.',
  },
];

export interface ReelPresetCatalogEntry {
  id: ReelPresetId;
  category: 'visa' | 'excursions' | 'omra' | 'billetterie';
  titleFr: string;
  titleAr: string;
  badgeFr: string;
  summaryFr: string;
  defaultVoiceId: string;
  linkedPageId: string;
}

export const REEL_PRESET_CATALOG: ReelPresetCatalogEntry[] = [
  {
    id: 'flights_ferries',
    category: 'billetterie',
    titleFr: "Billetterie Avion & Bateau · Scénario Court 30s (3 Clics)",
    titleAr: 'فيديو تذاكر الطيران والبواخر (سيناريو سريع 30 ثانية)',
    badgeFr: 'Avion & Bateau · Format 30s',
    summaryFr:
      'Scénario 5 temps (0:00–0:30) : STOP 15 onglets → Avion/Bateau → Tout au même endroit (Tunisie–France/Italie) → E-billet 3 clics → Réserve Easy2Book.',
    defaultVoiceId: 'Omar',
    linkedPageId: 'page-billetterie-avion-bateau-easy2book',
  },
  {
    id: 'visa_egypt',
    category: 'visa',
    titleFr: 'Visa Égypte • Lettre de Garantie & Autorisation 4h (24s)',
    titleAr: 'فيديو خطاب ضمان وتصريح أمني لمصر في 4 ساعات (24 ثانية)',
    badgeFr: 'Visa Égypte · Format 24s',
    summaryFr:
      'Départ Tunis ou partout dans le monde → Le Caire, Hurghada, Charm el-Cheikh. Passeport + billet : autorisation sécuritaire & garantie en 4h.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-egypte-easy2book',
  },
  {
    id: 'visa_schengen',
    category: 'visa',
    titleFr: 'Visa Espace Schengen, Études & Affaires (180 / 280 DT)',
    titleAr: 'فيديو فيزا شنغن، الدراسة والأعمال (180 / 280 د.ت)',
    badgeFr: 'Visa Schengen · Voix Layla',
    summaryFr:
      'RDV Standard 180 DT et Prime Time inclus 280 DT · Audit dossier consulaire, vols, hébergement & assurance Schengen.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-schengen-france',
  },
  {
    id: 'visa_dubai',
    category: 'visa',
    titleFr: 'Visa Dubaï & Émirats (330 DT à 6 830 DT + Express 48–72h)',
    titleAr: 'فيديو فيزا دبي والإمارات (سياحية، Express وإقامة سنتين)',
    badgeFr: 'Visa Dubaï · Voix Layla',
    summaryFr:
      'Avec garantie (350/550 DT), sans garantie (430/680 DT), enfant <12 ans, multi-entrée, prolongation 1 110 DT & Résidence 2 ans ID inclus 6 830 DT.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-dubai-easy2book',
  },
  {
    id: 'visa_qatar',
    category: 'visa',
    titleFr: 'Visa Qatar (Touristique 170 DT & Annuel/Travail sans ID)',
    titleAr: 'فيديو فيزا قطر (سياحية 170 د.ت وسنوية بدون ID)',
    badgeFr: 'Visa Qatar · Voix Layla',
    summaryFr:
      'Touristique 1 mois 170 DT · Annuel Homme 1 380 DT / Femme 1 980 DT sans ID (+ 1 650 QAR au Qatar).',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-qatar-easy2book',
  },
  {
    id: 'visa_oman',
    category: 'visa',
    titleFr: 'Visa Oman (10j 230 DT · 1 mois 330/380 DT · Résidence 2 ans)',
    titleAr: 'فيديو فيزا سلطنة عُمان (10 أيام، شهر وإقامة سنتين)',
    badgeFr: 'Visa Oman · Voix Layla',
    summaryFr:
      '10 jours 230 DT, 1 mois H/F 330/380 DT (2j–1 sem.) & Résidence 2 ans ID inclus H 7 530 DT / F 9 530 DT (15–20j).',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-oman-easy2book',
  },
  {
    id: 'visa_omra',
    category: 'visa',
    titleFr: 'Visa Omra — Arabie Saoudite (820 DT + Saudi Bio)',
    titleAr: 'فيديو فيزا العمرة — السعودية (820 د.ت + Saudi Bio)',
    badgeFr: 'Visa Omra · Voix Layla',
    summaryFr:
      'Visa Omra 820 DT · Docs : copie passeport, photo fond blanc, billet d’avion et code des empreintes Saudi Bio.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-omra-easy2book',
  },
  {
    id: 'visa_international',
    category: 'visa',
    titleFr: 'Visa Chine & Internationaux (Canada, USA, UK, Australie)',
    titleAr: 'فيديو فيزا الصين والملفات الدولية (كندا، أمريكا، بريطانيا، أستراليا)',
    badgeFr: 'Chine & Internationaux · Voix Layla',
    summaryFr:
      'Canada 830 DT, USA 1 030 DT, UK 1 430 DT, Australie 1 530 DT (RDV inclus), Chine Touristique 1 830 DT & Invitation 3 030 DT.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-international-easy2book',
  },
  {
    id: 'visa_evisa',
    category: 'visa',
    titleFr: 'Passeport Tunisien · E-Visa & Formalités Électroniques (42s)',
    titleAr: 'جواز السفر التونسي · وجهات E-Visa إلكترونياً (42 ثانية)',
    badgeFr: 'E-Visa 42s · Dialecte Tunisien (Layla)',
    summaryFr:
      'Des destinations accessibles avec des formalités électroniques : Rwanda, Tanzanie, Cameroun, Qatar, Bahreïn, Vietnam, Ouzbékistan, Albanie, Colombie, Bahamas + 53 E-Visa.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visa-evisa-easy2book',
  },
  {
    id: 'visa_services',
    category: 'visa',
    titleFr: 'Visas & E-Visa · Catalogue Complet (33 formules + 53 E-Visa)',
    titleAr: 'فيديو خدمات الفيزا الشاملة و 53 وجهة E-Visa',
    badgeFr: 'Catalogue Visas · Voix Layla',
    summaryFr:
      'Égypte 4h (dès 90 DT), Schengen (180/280 DT), Dubaï (350/550 DT), Qatar, Oman, Omra, Chine, Albanie, Thaïlande, Canada/USA/UK/AU.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-visas-services-easy2book',
  },
  {
    id: 'egypt_excursions',
    category: 'excursions',
    titleFr: 'Excursions Quotidiennes Égypte (6 Formules Le Caire)',
    titleAr: 'فيديو رحلات يومية مصر (الأهرامات، النيل، القاهرة الإسلامية)',
    badgeFr: 'Excursions Égypte · Voix Layla',
    summaryFr:
      'Transfert 175 DT, Nile Cruise 225 DT, Grand Musée + Pyramides dès 425 DT, City Tour, Caire Islamique & Soirée Al Han.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-excursions-egypte-easy2book',
  },
  {
    id: 'turkey_excursions',
    category: 'excursions',
    titleFr: 'Excursions & Croisières Turquie (22 Formules + Pack Antalya)',
    titleAr: 'فيديو رحلات تركيا (صبنجا، البسفور، أنطاليا وتوصيل المطار)',
    badgeFr: 'Excursions Turquie · Voix Layla',
    summaryFr:
      'Sapanca 65 DT, Bursa 100 DT, Îles des Princes & Bosphore dès 105 DT, Vialand 245 DT, Pack Antalya 1,125 DT, Vito/Sprinter.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-excursions-turquie-easy2book',
  },
  {
    id: 'excursions_general',
    category: 'excursions',
    titleFr: 'Excursions & Circuits Évasion (Égypte, Turquie, Dubaï & Tunisie)',
    titleAr: 'فيديو باقة الرحلات اليومية والجولات السياحية',
    badgeFr: 'Excursions & Circuits',
    summaryFr:
      'Reel transversal pour vos campagnes excursions & circuits : Le Caire, Istanbul/Bosphore, Dubaï Marina, Sidi Bou Saïd & Sahara.',
    defaultVoiceId: 'Layla',
    linkedPageId: 'page-voyage-istanbul-2027',
  },
  {
    id: 'omra',
    category: 'omra',
    titleFr: 'Omra Ramadan 2027 (Modèle de référence)',
    titleAr: 'فيديو عمرة شهر رمضان كامل (النموذج المرجعي)',
    badgeFr: 'Omra · Modèle de référence',
    summaryFr:
      'Reel officiel Omra Ramadan 9:16 avec voix tunisienne Gemini TTS, 4 scènes Makkah/Vol/Médine/Studio et tarifs chambres.',
    defaultVoiceId: 'Charon',
    linkedPageId: 'page-omra-ramadan-2027',
  },
];

export function getReelConfig(preset: ReelPresetId = 'omra'): {
  preset: ReelPresetId;
  scenes: ReelScene[];
  script: string;
  totalDurationSec: number;
  defaultVoiceId: string;
  endBadgeText: string;
  secondarySceneLabelA: string;
  secondarySceneLabelB: string;
  outputBaseName: string;
} {
  if (preset === 'visa_egypt') {
    return {
      preset: 'visa_egypt',
      scenes: VISA_EGYPT_REEL_SCENES,
      script: VISA_EGYPT_TUNISIAN_SCRIPT,
      totalDurationSec: 24,
      defaultVoiceId: 'Layla',
      endBadgeText: 'تصريح أمني وضمان في 4 ساعات · من غير حتى تعقيد',
      secondarySceneLabelA: 'مطار الإنطلاق: تونس أو أي مكان في العالم',
      secondarySceneLabelB: 'مطار الوصول: القاهرة · الغردقة · شرم الشيخ',
      outputBaseName: 'Easy2Book-Visa-Egypte-4h-24s',
    };
  }
  if (preset === 'visa_dubai') {
    return {
      preset: 'visa_dubai',
      scenes: VISA_DUBAI_REEL_SCENES,
      script: VISA_DUBAI_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'سياحية، Express 48–72h (+60 DT) وإقامة سنتين ID شاملة',
      secondarySceneLabelA: 'بالضمان 350 / 550 د.ت · بدون ضمان 430 / 680 د.ت',
      secondarySceneLabelB: 'طيران وتأشيرات سريعة نحو دبي والإمارات',
      outputBaseName: 'Easy2Book-Visa-Dubai',
    };
  }
  if (preset === 'visa_qatar') {
    return {
      preset: 'visa_qatar',
      scenes: VISA_QATAR_REEL_SCENES,
      script: VISA_QATAR_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'سياحية شهر 170 د.ت · سنوية/عمل بدون ID قطر',
      secondarySceneLabelA: 'فيزا سياحية 170 د.ت وسنوية للرجال والنساء',
      secondarySceneLabelB: 'رحلات الدوحة ومتابعة الإجراءات الرسمية',
      outputBaseName: 'Easy2Book-Visa-Qatar',
    };
  }
  if (preset === 'visa_oman') {
    return {
      preset: 'visa_oman',
      scenes: VISA_OMAN_REEL_SCENES,
      script: VISA_OMAN_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: '10 أيام 230 د.ت · شهر 330/380 د.ت · إقامة سنتين ID',
      secondarySceneLabelA: 'فيزا عُمان السياحية 2–7 أيام',
      secondarySceneLabelB: 'إقامة سنتين شاملة الهوية ID خلال 15–20 يوماً',
      outputBaseName: 'Easy2Book-Visa-Oman',
    };
  }
  if (preset === 'visa_omra') {
    return {
      preset: 'visa_omra',
      scenes: VISA_OMRA_REEL_SCENES,
      script: VISA_OMRA_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'فيزا العمرة 820 د.ت · متابعة رمز البصمة Saudi Bio',
      secondarySceneLabelA: 'الوثائق: جواز، صورة، تذكرة و Saudi Bio',
      secondarySceneLabelB: 'مرافقة ميسرة للمسافرين نحو مكة والمدينة',
      outputBaseName: 'Easy2Book-Visa-Omra',
    };
  }
  if (preset === 'visa_international') {
    return {
      preset: 'visa_international',
      scenes: VISA_INTERNATIONAL_REEL_SCENES,
      script: VISA_INTERNATIONAL_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'الصين 1,830 د.ت · كندا 830 · أمريكا 1,030 · بريطانيا 1,430 د.ت',
      secondarySceneLabelA: 'إعداد الاستمارات القنصلية وحجز المواعيد',
      secondarySceneLabelB: 'وجهات كندا، أمريكا، بريطانيا، أستراليا والصين',
      outputBaseName: 'Easy2Book-Visa-International',
    };
  }
  if (preset === 'visa_evisa') {
    return {
      preset: 'visa_evisa',
      scenes: VISA_EVISA_REEL_SCENES,
      script: VISA_EVISA_TUNISIAN_SCRIPT,
      totalDurationSec: 42,
      defaultVoiceId: 'Layla',
      endBadgeText: 'Des destinations accessibles avec des formalités électroniques · 98 140 514',
      secondarySceneLabelA: '🇹🇳 PASSEPORT TUNISIEN ? · E-VISA EN LIGNE',
      secondarySceneLabelB: 'Easy2Book — خطوتك الأولى نحو العالم!',
      outputBaseName: 'Easy2Book-Passeport-Tunisien-EVisa-42s',
    };
  }
  if (preset === 'visa_services') {
    return {
      preset: 'visa_services',
      scenes: VISA_REEL_SCENES,
      script: VISA_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'مصر، شنغن، الخليج، الدولية و53 وجهة E-Visa · حجز فوري',
      secondarySceneLabelA: 'فضاء شنغن · مواعيد قياسية و Prime Time',
      secondarySceneLabelB: 'دبي، قطر، عُمان وفيزا العمرة · معالجة سريعة',
      outputBaseName: 'Easy2Book-Visas-Services',
    };
  }
  if (preset === 'visa_schengen') {
    return {
      preset: 'visa_schengen',
      scenes: VISA_SCHENGEN_REEL_SCENES,
      script: VISA_SCHENGEN_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'مواعيد شنغن، فيزا الدراسة، الأعمال وكندا · تحضير كامل',
      secondarySceneLabelA: 'تدقيق الملف القنصلي وحجوزات السفر',
      secondarySceneLabelB: 'رحلات أوروبا وأمريكا الشمالية · متابعة Easy2Book',
      outputBaseName: 'Easy2Book-Visa-Schengen-Mobilite',
    };
  }
  if (preset === 'turkey_excursions') {
    return {
      preset: 'turkey_excursions',
      scenes: TURKEY_REEL_SCENES,
      script: TURKEY_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'رحلات يومية، سهرات البسفور وباقة أنطاليا · حجز فوري',
      secondarySceneLabelA: 'بحيرة صبنجا ومعشوقية · مواصلات وغداء',
      secondarySceneLabelB: 'توصيل مطار إسطنبول وصبيحة · فيتو وسبرنتر VIP',
      outputBaseName: 'Easy2Book-Excursions-Turquie',
    };
  }
  if (preset === 'egypt_excursions') {
    return {
      preset: 'egypt_excursions',
      scenes: EGYPT_REEL_SCENES,
      script: EGYPT_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'رحلات يومية للأفراد والجروبات · حجز فوري',
      secondarySceneLabelA: 'سهرة عشاء فاخرة على النيل',
      secondarySceneLabelB: 'سيارة خاصة + مرشد مرافق Easy2Book',
      outputBaseName: 'Easy2Book-Excursions-Egypte',
    };
  }
  if (preset === 'excursions_general') {
    return {
      preset: 'excursions_general',
      scenes: EXCURSIONS_GENERAL_REEL_SCENES,
      script: EXCURSIONS_GENERAL_TUNISIAN_SCRIPT,
      totalDurationSec: TOTAL_REEL_DURATION_SEC,
      defaultVoiceId: 'Layla',
      endBadgeText: 'رحلات يومية مصر، تركيا، دبي وتونس · حجز مباشر',
      secondarySceneLabelA: 'سهرات البسفور والنيل والرحلات اليومية',
      secondarySceneLabelB: 'جولات تونس وسيدي بوسعيد والصحراء VIP',
      outputBaseName: 'Easy2Book-Excursions-Circuits',
    };
  }
  if (preset === 'flights_ferries') {
    return {
      preset: 'flights_ferries',
      scenes: FLIGHTS_FERRIES_REEL_SCENES,
      script: FLIGHTS_FERRIES_SCRIPT,
      totalDurationSec: 30,
      defaultVoiceId: 'Omar',
      endBadgeText: 'Réserve sur Easy2Book 👇 · Avion & Bateau en 3 clics',
      secondarySceneLabelA: 'Vols express & traversées Tunisie–France / Italie',
      secondarySceneLabelB: 'Toutes les compagnies au même endroit · 0 frais cachés',
      outputBaseName: 'Easy2Book-Avion-Bateau-30s',
    };
  }
  return {
    preset: 'omra',
    scenes: REEL_SCENES,
    script: DEFAULT_TUNISIAN_SCRIPT,
    totalDurationSec: TOTAL_REEL_DURATION_SEC,
    defaultVoiceId: 'Charon',
    endBadgeText: 'عدد غرف محدود جداً · عرض صالح لـ 15 ديسمبر 2026',
    secondarySceneLabelA: 'رحلة مباشرة تونس - جدة',
    secondarySceneLabelB: 'جناح فندقي فاخر · إطلالة مكة',
    outputBaseName: 'Easy2Book-Omra-Ramadan-2027',
  };
}

export const SUBTITLE_CUES: SubtitleCue[] = [
  {
    startSec: 0,
    endSec: 6,
    text: 'تحب تعيش روحانية شهر رمضان الكل في مكة المكرمة، وإنت مرتاح البال ومن غير حتى تعب؟',
  },
  {
    startSec: 6,
    endSec: 10,
    text: 'مع Easy2Book، حضرنالك برنامج عمرة شهر رمضان كامل...',
  },
  {
    startSec: 10,
    endSec: 18,
    text: 'طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة،',
  },
  {
    startSec: 18,
    endSec: 25,
    text: 'وإقامة مريحة في فندق ميسان الملتزم، وزيد معاهم رحلة للمدينة المنورة!',
  },
  {
    startSec: 25,
    endSec: 36,
    text: 'ابتداءً من 5,900 د.ت (رباعية/خماسية)، 6,400 د.ت (ثلاثية)، 6,900 د.ت (ثنائية) — وتخفيض 200 د.ت للعائلات من شخصين!',
  },
  {
    startSec: 36,
    endSec: 48,
    text: 'عدد غرف محدود جداً والعرض صالح لـ 15 ديسمبر 2026! للمجموعات +10 أشخاص اتصلوا على 98 140 514 · easy2book.tn',
  },
];

export const SOCIAL_CAPTION_BLOCKS = [
  {
    id: 'cap-1',
    scene: 'المشهد 01',
    lines: ['عمرة رمضان كامل 🌙', 'مع Easy2Book'],
  },
  {
    id: 'cap-2',
    scene: 'المشهد 02 و 03',
    lines: [
      'فندق ميسان الملتزم + المدينة المنورة',
      'رباعية/خماسية: 5,900 د.ت | ثلاثية: 6,400 د.ت | ثنائية: 6,900 د.ت',
      'تخفيض 200 د.ت للعائلات انطلاقاً من شخصين',
    ],
  },
  {
    id: 'cap-3',
    scene: 'المشهد 04',
    lines: [
      'عدد غرف محدود جداً · عرض صالح لـ 15 ديسمبر 2026',
      'مجموعات تفوق 10 أشخاص: الاتصال على 98 140 514',
      '🌐 www.easy2book.tn',
    ],
  },
];

export function getSubtitleCues(preset: ReelPresetId = 'omra'): SubtitleCue[] {
  if (preset === 'visa_egypt') {
    return [
      {
        startSec: 0,
        endSec: 5,
        text: 'مبرمج مشية لمصر ومطلوب عليك خطاب ضمان؟',
      },
      {
        startSec: 5,
        endSec: 9,
        text: 'ابعث تسكرتك ونسخة من باسبورك!',
      },
      {
        startSec: 9,
        endSec: 14,
        text: 'مطار الإنطلاق تونس أو أي مكان في العالم، مطار الوصول القاهرة، الغردقة، شرم الشيخ!',
      },
      {
        startSec: 14,
        endSec: 19,
        text: '4 ساعات يكون عندك تصريح أمني وضمان من غير حتى تعقيد.',
      },
      {
        startSec: 19,
        endSec: 24,
        text: 'معانا... سفرتك أسهل! Easy2Book · 98 140 514 · www.easy2book.tn',
      },
    ];
  }
  if (preset === 'visa_dubai') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'فيزا دبي والإمارات مع Easy2Book: بالضمان شهر 350 DT وشهران 550 DT · بدون ضمان 430 / 680 DT!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'فيزا طفل (<12 سنة) 330 / 430 DT · متعددة الدخول 710 / 1,010 DT · تمديد داخل الإمارات 1,110 DT و Express +60 DT!',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'إقامة سنتين ID شاملة بـ 6,830 DT (خلال 15–20 يوم). الوثائق: نسخة جواز + صورة خلفية بيضاء واضحة.',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'تواصل الآن مع قسم الفيزا Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'visa_qatar') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'فيزا قطر السياحية شهر واحد بـ 170 DT فقط مع Easy2Book!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'فيزا قطر السنوية / العمل بدون ID: رجل 1,380 DT وامرأة 1,980 DT (+ 1,650 QAR في قطر).',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'الوثائق المطلوبة: نسخة جواز السفر + صورة شمسية خلفية بيضاء ممسوحة بوضوح.',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'قدّم طلبك لـ Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'visa_oman') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'فيزا سلطنة عُمان السياحية مع Easy2Book: 10 أيام بـ 230 DT وشهر واحد 330 DT للرجل و 380 DT للمرأة!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'فيزا إقامة عُمان سنتين شاملة الهوية ID: رجل 7,530 DT وامرأة 9,530 DT في 15 إلى 20 يوماً.',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'الوثائق المطلوبة: نسخة من جواز السفر + صورة على خلفية بيضاء ممسوحة بوضوح.',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'تواصل مع Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'visa_omra') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'فيزا العمرة للمملكة العربية السعودية بـ 820 DT فقط مع Easy2Book!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'مرافقة شاملة في إجراءات التأشيرة وتوليد رمز البصمات الرسمي Saudi Bio خطوة بخطوة.',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'الوثائق المطلوبة: نسخة الجواز · صورة خلفية بيضاء · تذكرة الطائرة · رمز Saudi Bio.',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'احجز فيزا العمرة الآن مع Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'visa_international') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'تجهيز ملفات التأشيرات الدولية الكبرى مع الموعد: كندا 830 DT وأمريكا 1,030 DT!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'ملف بريطانيا 1,430 DT وأستراليا 1,530 DT · الوثائق المبدئية: نسخة الجواز + صورة خلفية بيضاء.',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'فيزا الصين السياحية 1,830 DT · دعوة رسمية 3,030 DT · عمل Z حسب الطلب مع مراجعة كاملة للوثائق.',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'تواصل مع Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'visa_evisa') {
    return [
      {
        startSec: 0,
        endSec: 4,
        text: 'تحب تسافر وتكتشف العالم؟ 🌍 وعندك Passeport تونسي؟ اسمع المعلومة هاذي!',
      },
      {
        startSec: 4,
        endSec: 10,
        text: 'فمّا برشا وجهات في العالم تنجم تقدّم على الفيزا متاعها إلكترونياً، من غير ما تبدأ بالإجراءات التقليدية متاع السفارة.',
      },
      {
        startSec: 10,
        endSec: 23,
        text: 'من إفريقيا لآسيا، ومن أوروبا للأمريكيتين… وجهات مختلفة تستنّاك! كيف رواندا، تنزانيا، الكاميرون، قطر، البحرين، فيتنام، أوزبكستان، ألبانيا، كولومبيا، والبهاماس!',
      },
      {
        startSec: 23,
        endSec: 33,
        text: 'مع Easy2Book، نعاونك تفهم إجراءات التأشيرة، تعرف الوثائق المطلوبة، وتحضّر مطلبك بطريقة أسهل. ما تخليش إجراءات الفيزا توقف أحلامك!',
      },
      {
        startSec: 33,
        endSec: 42,
        text: 'Easy2Book — خطوتك الأولى نحو العالم! ✈️ ابعثلنا توّة، واسألنا على وجهتك! (القبول النهائي من اختصاص سلطات البلد المعني)',
      },
    ];
  }
  if (preset === 'visa_services') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'تلوج على خدمة فيزا موثوقة وسريعة؟ مع Easy2Book فيزا مصر في 4 ساعات من 90 د.ت ومواعيد شنغن من 180 د.ت!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'دبي بالضمان 350 د.ت (شهر) و 550 د.ت (شهران) · قطر 170 د.ت · عُمان من 230 د.ت · وفيزا العمرة 820 د.ت!',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'ملفات كندا 830 · أمريكا 1,030 · بريطانيا 1,430 · أستراليا 1,530 · الصين 1,830 · ألبانيا 380 · تايلاند 130 د.ت و53 دولة E-Visa!',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'أودع ملف التأشيرة اليوم مع Easy2Book على 98 140 514 · www.easy2book.tn — سفرتك أسهل!',
      },
    ];
  }
  if (preset === 'visa_schengen') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'تحضّر ملف فيزا شنغن، فرنسا، الدراسة أو الأعمال؟ مواعيد قياسية 180 د.ت و Prime Time شاملة 280 د.ت!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'تدقيق شامل للوثائق، حجوزات طيران وإقامة مؤكدة، ترجمة وتأمين سفر معتمد بدون أخطاء.',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'تجهيز ملفات كندا 830 د.ت، أمريكا 1,030 د.ت، بريطانيا 1,430 د.ت وأستراليا 1,530 د.ت.',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'تواصل الآن مع قسم الفيزا Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'egypt_excursions') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'مسافرة لمصر؟ Easy2Book وفرتلك 6 رحلات وخدمات يومية في القاهرة للأفراد والمجموعات!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'توصيل المطار 175 د.ت · سهرة نايل كروز بالعشاء 225 د.ت · الأهرامات والمتحف الكبير ابتداءً من 425 د.ت!',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'القاهرة الإسلامية من 385 د.ت · سيتي تور من 225 د.ت · وسهرة ألحان / صاحب السعادة من 22:00 إلى 01:00!',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'للحجز الفوري عبر الهاتف أو واتساب Easy2Book: 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'turkey_excursions') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'مسافرة لتركيا؟ رحلات يومية بالمواصلات والغداء والدليل العربي: صبنجا 65 د.ت، إزميت 85 د.ت، بورصا 100 د.ت وشيلا 105 د.ت!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'توصيل مطار إسطنبول وصبيحة بسيارة فيتو الخاصة (185 / 195 د.ت) أو سبرنتر 14 شخص (245 / 265 د.ت)!',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'جزر الأميرات وسهرات البسفور من 105 د.ت · تكت فيالاند 245 د.ت · وباقة أنطاليا للثنائي 1,125 د.ت!',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'احجز رحلاتك في تركيا اليوم مع Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'excursions_general') {
    return [
      {
        startSec: 0,
        endSec: 10,
        text: 'أجمل الرحلات اليومية والجولات السياحية في مصر، تركيا، دبي وتونس بسيارة خاصة ومرشد من Easy2Book!',
      },
      {
        startSec: 10,
        endSec: 25,
        text: 'مصر: نايل كروز 225 د.ت والأهرامات 425 د.ت · تركيا: صبنجا 65 د.ت، بورصا 100 د.ت والبسفور 105 د.ت!',
      },
      {
        startSec: 25,
        endSec: 36,
        text: 'دبي مارينا، باقة أنطاليا 1,125 د.ت، سيدي بوسعيد والصحراء التونسية مع توصيل مطار VIP!',
      },
      {
        startSec: 36,
        endSec: 48,
        text: 'تأكيد فوري لحجوزاتكم مع Easy2Book على 98 140 514 · www.easy2book.tn.',
      },
    ];
  }
  if (preset === 'flights_ferries') {
    return [
      {
        startSec: 0,
        endSec: 3,
        text: '« 15 onglets ouverts juste pour réserver un billet d’avion ou de bateau ? Arrête tout de suite. »',
      },
      {
        startSec: 3,
        endSec: 8,
        text: '« Que tu partes par les airs ou par la mer, il y a beaucoup plus simple. »',
      },
      {
        startSec: 8,
        endSec: 18,
        text: '« Sur Easy2Book, toutes les compagnies aériennes et maritimes sont au même endroit (vols express & traversées Méditerranée Tunisie–France/Italie, îles). Tu compares, tu choisis ton tarif, et c’est réservé en quelques secondes. »',
      },
      {
        startSec: 18,
        endSec: 25,
        text: '« Pas de frais surprises à la fin, ton billet est directement dans ton téléphone. Easy2Book, the easiest way to travel. »',
      },
      {
        startSec: 25,
        endSec: 30,
        text: '« Prépare tes valises, clique sur le lien et réserve ton prochain départ maintenant. »',
      },
    ];
  }
  return SUBTITLE_CUES;
}

export function getSocialCaptionBlocks(preset: ReelPresetId = 'omra') {
  if (preset === 'flights_ferries') {
    return [
      {
        id: 'cap-ff-1',
        scene: '0:00 – 0:08 · Hook',
        lines: [
          '🛑 STOP aux 15 onglets ouverts !',
          '✈️ Avion ou ⛴️ Bateau : tout ce qu’il te faut pour partir sereinement est au même endroit.',
        ],
      },
      {
        id: 'cap-ff-2',
        scene: '0:08 – 0:25 · Offre & Preuve',
        lines: [
          'Toutes les compagnies aériennes et maritimes (Tunisie–France, Tunisie–Italie, îles & vols express) en 3 clics.',
          '📲 Zéro frais surprises · Ton e-billet directement sur ton téléphone !',
        ],
      },
      {
        id: 'cap-ff-3',
        scene: '0:25 – 0:30 · CTA',
        lines: [
          '👇 Réserve ton prochain départ sur Easy2Book : www.easy2book.tn',
          '📞 Infos & réservation directe WhatsApp : 98 140 514',
        ],
      },
    ];
  }
  if (preset === 'visa_egypt') {
    return [
      {
        id: 'cap-veg-1',
        scene: '0–9 ث · الخطاف والوثائق',
        lines: [
          'مبرمج مشية لمصر ومطلوب عليك خطاب ضمان؟',
          'ابعث تسكرتك ونسخة من باسبورك فقط!',
        ],
      },
      {
        id: 'cap-veg-2',
        scene: '9–19 ث · المطارات و 4 ساعات',
        lines: [
          'مطار الإنطلاق: تونس أو أي مكان في العالم',
          'مطار الوصول: القاهرة، الغردقة، شرم الشيخ · 4 ساعات يكون عندك تصريح أمني وضمان بدون تعقيد!',
        ],
      },
      {
        id: 'cap-veg-3',
        scene: '19–24 ث · التواصل',
        lines: [
          'معانا... سفرتك أسهل! 📞 واتساب Easy2Book : 98 140 514',
          '🌐 www.easy2book.tn',
        ],
      },
    ];
  }
  if (preset === 'visa_dubai') {
    return [
      {
        id: 'cap-vdxb-1',
        scene: 'المشهد 01',
        lines: ['🇦🇪 فيزا دبي والإمارات · بالضمان أو بدون ضمان', 'بالضمان 350 / 550 DT | بدون ضمان 430 / 680 DT'],
      },
      {
        id: 'cap-vdxb-2',
        scene: 'المشهد 02 و 03',
        lines: [
          'طفل <12 سنة 330 / 430 DT · متعددة الدخول 710 / 1,010 DT · تمديد 1,110 DT',
          'إقامة سنتين ID شاملة 6,830 DT · Express 48–72h (+60 DT) · جواز + صورة بيضاء',
        ],
      },
      {
        id: 'cap-vdxb-3',
        scene: 'المشهد 04',
        lines: ['📞 تواصل عبر واتساب Easy2Book: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'visa_qatar') {
    return [
      {
        id: 'cap-vqa-1',
        scene: 'المشهد 01',
        lines: ['🇶🇦 فيزا قطر السياحية والسنوية · Easy2Book', 'السياحية شهر واحد: 170 DT'],
      },
      {
        id: 'cap-vqa-2',
        scene: 'المشهد 02 و 03',
        lines: [
          'السنوية/العمل بدون ID : رجل 1,380 DT | امرأة 1,980 DT (+1,650 QAR بقطر)',
          '📋 الوثائق: نسخة جواز السفر + صورة شمسية خلفية بيضاء واضحة',
        ],
      },
      {
        id: 'cap-vqa-3',
        scene: 'المشهد 04',
        lines: ['📞 اتصل أو أرسل على واتساب: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'visa_oman') {
    return [
      {
        id: 'cap-vom-1',
        scene: 'المشهد 01',
        lines: ['🇴🇲 فيزا سلطنة عُمان · سياحية وإقامة سنتين', '10 أيام 230 DT | شهر رجل 330 DT / امرأة 380 DT'],
      },
      {
        id: 'cap-vom-2',
        scene: 'المشهد 02 و 03',
        lines: [
          'إقامة سنتين شاملة الهوية ID : رجل 7,530 DT | امرأة 9,530 DT',
          '📋 الوثائق: نسخة جواز السفر + صورة شمسية خلفية بيضاء واضحة',
        ],
      },
      {
        id: 'cap-vom-3',
        scene: 'المشهد 04',
        lines: ['📞 Easy2Book واتساب وهاتف: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'visa_omra') {
    return [
      {
        id: 'cap-vomr-1',
        scene: 'المشهد 01',
        lines: ['🕋 فيزا العمرة · المملكة العربية السعودية', 'السعر المعتمد: 820 DT'],
      },
      {
        id: 'cap-vomr-2',
        scene: 'المشهد 02 و 03',
        lines: [
          '📋 الوثائق المطلوبة: نسخة جواز السفر · صورة خلفية بيضاء · تذكرة الطائرة · رمز Saudi Bio',
        ],
      },
      {
        id: 'cap-vomr-3',
        scene: 'المشهد 04',
        lines: ['📞 لحجز فيزا العمرة Easy2Book: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'visa_international') {
    return [
      {
        id: 'cap-vint-1',
        scene: 'المشهد 01',
        lines: ['🌍 فيزا الصين والملفات الدولية الكبرى (شاملة الموعد)', 'كندا 830 · أمريكا 1,030 · بريطانيا 1,430 · أستراليا 1,530 DT'],
      },
      {
        id: 'cap-vint-2',
        scene: 'المشهد 02 و 03',
        lines: [
          '🇨🇳 الصين: سياحية 1,830 DT · دعوة رسمية 3,030 DT · عمل Z حسب الطلب',
          '📋 تجهيز كامل للاستمارات وحجز المواعيد القنصلية',
        ],
      },
      {
        id: 'cap-vint-3',
        scene: 'المشهد 04',
        lines: ['📞 استشارة وحجز ملفك: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'visa_evisa') {
    return [
      {
        id: 'cap-vev-1',
        scene: '0–10 s · Accroche',
        lines: [
          '🇹🇳 PASSEPORT TUNISIEN ? · LE MONDE VOUS ATTEND 🌍',
          'Des destinations accessibles avec des formalités électroniques (E-Visa).',
        ],
      },
      {
        id: 'cap-vev-2',
        scene: '10–33 s · Destinations & Accompagnement',
        lines: [
          'E-VISA • VISA EN LIGNE : 🇷🇼 Rwanda, 🇹🇿 Tanzanie, 🇨🇲 Cameroun, 🇶🇦 Qatar, 🇧🇭 Bahreïn, 🇻🇳 Vietnam, 🇺🇿 Ouzbékistan, 🇦🇱 Albanie, 🇨🇴 Colombie, 🇧🇸 Bahamas.',
          'ON VOUS ACCOMPAGNE : Easy2Book — خطوتك الأولى نحو العالم! ✈️',
        ],
      },
      {
        id: 'cap-vev-3',
        scene: '33–42 s · Contact & Mention légale',
        lines: [
          '📞 CONTACTEZ-NOUS · WhatsApp Easy2Book : 98 140 514 | www.easy2book.tn',
          'ملاحظة: شروط التأشيرة تختلف حسب البلد، والجنسية، ومدة الإقامة. القبول النهائي يبقى من اختصاص سلطات البلد المعني.',
        ],
      },
    ];
  }
  if (preset === 'visa_services') {
    return [
      {
        id: 'cap-vs-1',
        scene: 'المشهد 01',
        lines: ['🛂 خدمات الفيزا و E-Visa الشاملة · Easy2Book', 'مصر في 4 ساعات من 90 د.ت | مواعيد شنغن من 180 د.ت'],
      },
      {
        id: 'cap-vs-2',
        scene: 'المشهد 02 و 03',
        lines: [
          '🇦🇪 دبي بالضمان 350 / 550 د.ت | 🇶🇦 قطر 170 د.ت | 🇴🇲 عُمان من 230 د.ت | 🕋 العمرة 820 د.ت',
          '🇨🇦 كندا 830 | 🇺🇸 أمريكا 1,030 | 🇬🇧 UK 1,430 | 🇦🇺 1,530 | 🇨🇳 الصين 1,830 د.ت',
          '🇦🇱 ألبانيا 380 د.ت (بالترجمة) | 🇹🇭 تايلاند 130 د.ت | +53 وجهة E-Visa',
        ],
      },
      {
        id: 'cap-vs-3',
        scene: 'المشهد 04',
        lines: ['📞 للحجز والاستفسار عبر واتساب أو الهاتف: 98 140 514', '🌐 www.easy2book.tn · Easy2Book'],
      },
    ];
  }
  if (preset === 'visa_schengen') {
    return [
      {
        id: 'cap-vsch-1',
        scene: 'المشهد 01',
        lines: ['🇪🇺 تحضير ملفات فيزا شنغن، الدراسة والأعمال', 'Standard 180 د.ت | Prime Time شاملة 280 د.ت'],
      },
      {
        id: 'cap-vsch-2',
        scene: 'المشهد 02 و 03',
        lines: [
          'تدقيق الوثائق + حجوزات الطيران والإقامة + التأمين الصحي',
          '🇨🇦 كندا 830 · 🇺🇸 أمريكا 1,030 · 🇬🇧 بريطانيا 1,430 · 🇦🇺 أستراليا 1,530 د.ت',
        ],
      },
      {
        id: 'cap-vsch-3',
        scene: 'المشهد 04',
        lines: ['📞 تواصل مع مستشار الفيزا Easy2Book: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'egypt_excursions') {
    return [
      {
        id: 'cap-eg-1',
        scene: 'المشهد 01',
        lines: ['🇪🇬 رحلات يومية في القاهرة · للأفراد والمجموعات (1 إلى 10 أشخاص)', 'سيارة مكيفة خاصة + مرشد سياحي'],
      },
      {
        id: 'cap-eg-2',
        scene: 'المشهد 02 و 03',
        lines: [
          '🚘 توصيل المطار 175 د.ت | 🚢 نايل كروز 225 د.ت',
          '🏛️ المتحف الكبير + الأهرامات من 425 د.ت | 🕌 القاهرة الإسلامية من 385 د.ت',
          '🛍️ سيتي تور / 🎶 سهرة ألحان (22h-01h) من 225 د.ت',
        ],
      },
      {
        id: 'cap-eg-3',
        scene: 'المشهد 04',
        lines: ['📞 حجز مباشر واتساب Easy2Book: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'turkey_excursions') {
    return [
      {
        id: 'cap-tr-1',
        scene: 'المشهد 01',
        lines: ['🇹🇷 رحلات تركيا اليومية · إسطنبول وأنطاليا مع Easy2Book', 'مواصلات + غذاء + دليل سياحي عربي'],
      },
      {
        id: 'cap-tr-2',
        scene: 'المشهد 02 و 03',
        lines: [
          '🌿 صبنجا 65 | إزميت 85 | بورصا 100 | شيلا 105 | يلوا 145 د.ت',
          '🚢 جزر الأميرات والبسفور من 105 د.ت | 🎡 فيالاند 245 د.ت | 🏖️ أنطاليا ثنائي 1,125 د.ت',
          '🚐 توصيل مطار فيتو (IST 185 / SAW 195 د.ت) وسبرنتر (245 / 265 د.ت)',
        ],
      },
      {
        id: 'cap-tr-3',
        scene: 'المشهد 04',
        lines: ['📞 مركز حجوزات Easy2Book: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  if (preset === 'excursions_general') {
    return [
      {
        id: 'cap-exg-1',
        scene: 'المشهد 01',
        lines: ['🌍 رحلات يومية وجولات خاصة — مصر، تركيا، دبي وتونس', 'سيارة مكيفة + سائق + مرشد مرافق'],
      },
      {
        id: 'cap-exg-2',
        scene: 'المشهد 02 و 03',
        lines: [
          '🇪🇬 مصر من 175 د.ت | 🇹🇷 تركيا من 65 د.ت',
          '🇦🇪 جولات دبي VIP وتوصيل مطارات · 🇹🇳 رحلات سيدي بوسعيد والصحراء',
        ],
      },
      {
        id: 'cap-exg-3',
        scene: 'المشهد 04',
        lines: ['📞 احجز الآن عبر الهاتف أو الواتساب: 98 140 514', '🌐 www.easy2book.tn'],
      },
    ];
  }
  return SOCIAL_CAPTION_BLOCKS;
}
