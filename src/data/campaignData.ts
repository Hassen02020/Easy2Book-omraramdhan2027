import makkahSunriseImg from '../assets/images/makkah_haram_sunrise_1794604285606.jpg';
import tunisFlightImg from '../assets/images/tunis_jeddah_flight_1794604285597.jpg';
import makkahSuiteImg from '../assets/images/makkah_maysan_suite_1794604285710.jpg';
import madinahTwilightImg from '../assets/images/madinah_umbrellas_twilight_1794604286691.jpg';
import studioBackdropImg from '../assets/images/easy2book_studio_backdrop_1794604286505.jpg';

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

export const TOTAL_REEL_DURATION_SEC = 48;

export const DEFAULT_TUNISIAN_SCRIPT =
  'تحب تعيش روحانية شهر رمضان الكل في مكة المكرمة، وإنت مرتاح البال ومن غير حتى تعب؟ مع Easy2Book، حضرنالك برنامج عمرة شهر رمضان كامل: طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة، وإقامة مريحة في فندق ميسان الملتزم، وزيد معاهم رحلة للمدينة المنورة! الأسعار تبدأ من خمسة آلاف وتسعمية دينار للشخص في غرفة رباعية أو خماسية، ستة آلاف وأربعمية دينار في غرفة ثلاثية، وستة آلاف وتسعمية دينار في غرفة ثنائية... مع تخفيض ميتين دينار للعائلات انطلاقاً من شخصين! وللمجموعات أكثر من عشرة أشخاص كلمونا للحصول على الإمكانية. عدد الغرف محدود جداً والعرض صالح لـ خمسطاش ديسمبر ألفين وستة وعشرين! كلمنا توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا احجز على easy2book.tn. Easy2Book... سفرتك أسهل!';

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
