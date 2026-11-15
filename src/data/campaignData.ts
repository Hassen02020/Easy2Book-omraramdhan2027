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
  | 'egypt_excursions'
  | 'turkey_excursions'
  | 'visa_services';

export const TOTAL_REEL_DURATION_SEC = 48;

export const DEFAULT_TUNISIAN_SCRIPT =
  'تحب تعيش روحانية شهر رمضان الكل في مكة المكرمة، وإنت مرتاح البال ومن غير حتى تعب؟ مع Easy2Book، حضرنالك برنامج عمرة شهر رمضان كامل: طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة، وإقامة مريحة في فندق ميسان الملتزم، وزيد معاهم رحلة للمدينة المنورة! الأسعار تبدأ من خمسة آلاف وتسعمية دينار للشخص في غرفة رباعية أو خماسية، ستة آلاف وأربعمية دينار في غرفة ثلاثية، وستة آلاف وتسعمية دينار في غرفة ثنائية... مع تخفيض ميتين دينار للعائلات انطلاقاً من شخصين! وللمجموعات أكثر من عشرة أشخاص كلمونا للحصول على الإمكانية. عدد الغرف محدود جداً والعرض صالح لـ خمسطاش ديسمبر ألفين وستة وعشرين! كلمنا توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا احجز على easy2book.tn. Easy2Book... سفرتك أسهل!';

export const EGYPT_TUNISIAN_SCRIPT =
  'مسافرة ولا مسافر لمصر وتحب تعيش سحر القاهرة والأهرامات براحة تامة ومن غير قلق؟ مع Easy2Book، وفرنالك ستة رحلات وخدمات يومية للأفراد والمجموعات بأحسن الأسعار! توصيل بسيارة خاصة من المطار للنزل بمية وخمسة وسبعين دينار، وسهرة نايل كروز بالعشاء والمرشد بميتين وخمسة وعشرين دينار! وزيد عيش عظمة المتحف المصري الكبير والأهرامات شاملة الدخول ابتداءً من أربعمية وخمسة وعشرين دينار، مع جولة سيتي تور ابتداءً من ميتين وخمسة وعشرين دينار، وجولة القاهرة الإسلامية وخان الخليلي ابتداءً من ثلاثمية وخمسة وثمانين دينار، وسهرة الحان وصاحب السعادة من العشرة للوحدة متاع الليل! للحجز الفوري والاستفسار، كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا تواصل معانا على الواتساب. Easy2Book... سفرتك أسهل!';

export const TURKEY_TUNISIAN_SCRIPT =
  'مسافرة ولا مسافر لتركيا وتحب تستمتع بأجمل الرحلات اليومية في إسطنبول وأنطاليا من غير حتى تعب؟ مع Easy2Book، حضرنالك باقة كاملة: رحلات يومية بالمواصلات والغداء والدليل العربي لصبنجا ومعشوقية بخمسة وستين دينار، إزميت بخمسة وثمانين دينار، بورصا بمية دينار، وشيلا وأغوا بمية وخمسة دينار! وزيد جولات سفن جزر الأميرات والسهرات المسائية العربية والتركية على البسفور ابتداءً من مية وخمسة دينار شاملة المواصلات والعشاء! وتكت فيالاند الشامل بميتين وخمسة وأربعين دينار، وباقة أنطاليا للثنائي بألف ومية وخمسة وعشرين دينار، مع توصيل مطار إسطنبول وصبيحة بسيارة فيتو الخاصة ابتداءً من مية وخمسة وثمانين دينار! كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا ابعتلنا على الواتساب. Easy2Book... سفرتك أسهل!';

export const VISA_TUNISIAN_SCRIPT =
  'تلوج على خدمة فيزا موثوقة وسريعة من غير تعقيد ولا تأخير؟ مع Easy2Book، نجهزولك ملف التأشيرة متاعك الكل باحترافية! فيزا مصر في أربع ساعات فقط ابتداءً من ثمانين دينار، مواعيد فضاء شنغن ابتداءً من مية وثمانين دينار، فيزا قطر شهر بمية وسبعين دينار، وفيزا دبي بالضمان ابتداءً من ثلاثمية وخمسين دينار، وعُمان ابتداءً من ميتين وثلاثين دينار، وفيزا العمرة بثمانمية وعشرين دينار! وزيد ملفات كندا بثمانمية وثلاثين، أمريكا بألف وثلاثين، بريطانيا بألف وأربعمية وثلاثين، أستراليا بألف وخمسمية وثلاثين، الصين بألف وثمانمية وثلاثين، ألبانيا ثلاثمية وثمانين مع الترجمة، وتايلاند بمية وثلاثين دينار، مع خدمة E-Visa لأكثر من خمسين وجهة دولية! كلم Easy2Book توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش. Easy2Book... سفرتك أسهل!';

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
    overlayLines: ['مع Easy2Book · مصر من 80 د.ت · شنغن من 180 د.ت'],
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
