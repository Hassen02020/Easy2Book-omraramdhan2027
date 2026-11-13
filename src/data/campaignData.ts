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
}

export const TOTAL_REEL_DURATION_SEC = 42;

export const DEFAULT_TUNISIAN_SCRIPT =
  'تحب تعيش روحانية شهر رمضان الكل في مكة المكرمة، وإنت مرتاح البال ومن غير حتى تعب؟ مع إيزي تو بوك، حضرنالك برنامج عمرة شهر رمضان كامل: طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة، وإقامة مريحة في فندق ميسان الملتزم. وزيد معاهم رحلة للمدينة المنورة... والكل بسوم استثنائي: خمسة آلاف وتسعمية دينار برك للشخص! الأماكن محدودة برشا! كلمنا توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا احجز ديريكت على إيزي تو بوك بوان تي إن. إيزي تو بوك... سفرتك أسهل!';

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Charon', label: 'صوت رخيم دافئ (Charon)', tone: 'وقور وهادئ' },
  { id: 'Kore', label: 'صوت ناعم واضح (Kore)', tone: 'ودود ومطمئن' },
  { id: 'Fenrir', label: 'صوت إعلاني جهوري (Fenrir)', tone: 'حماسي للإعلان' },
  { id: 'Puck', label: 'صوت حيوي مشرق (Puck)', tone: 'خفيف وسلس' },
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
    endSec: 23,
    primaryImage: tunisFlightImg,
    secondaryImage: makkahSuiteImg,
    matchCutOffsetSec: 5.5,
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
    arabicTitle: 'سكينة المدينة المنورة',
    subtitleSummary: 'ساحة المسجد النبوي بالمظلات المضاءة وقت الغسق',
    startSec: 23,
    endSec: 32,
    primaryImage: madinahTwilightImg,
    imageAlt: 'ساحة المسجد النبوي في المدينة المنورة وقت الغسق مع المظلات المضاءة بالذهب',
    overlayHeadline: 'رحلة للمدينة المنورة',
    overlayLines: ['سوم استثنائي: 5,900 د.ت للشخص'],
    cameraMoveLabel: 'Gentle Camera Tilt Up',
    promptText:
      "Vertical 9:16, cinematic wide-to-medium shot of the Prophet's Mosque courtyard in Madinah at twilight, iconic giant white umbrellas illuminated by warm golden lanterns against a deep twilight navy blue sky, peaceful families walking calmly in traditional modest attire, gentle camera tilt up, rich atmospheric lighting, 8k filmic look, no text.",
  },
  {
    id: 'scene-4',
    indexLabel: '04',
    arabicTitle: 'خاتمة Easy2Book',
    subtitleSummary: 'خلفية ثلاثية الأبعاد بأمواج زجاجية ذهبية وكحلية للشعار والدعوة للحجز',
    startSec: 32,
    endSec: 42,
    primaryImage: studioBackdropImg,
    imageAlt: 'خلفية استوديو ثلاثية الأبعاد بيضاء ناعمة مع أمواج زجاجية كحلية وذهبية',
    overlayHeadline: 'الأماكن محدودة ⏳',
    overlayLines: ['📞 98 140 514', '🌐 www.easy2book.tn'],
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
    text: 'مع إيزي تو بوك، حضرنالك برنامج عمرة شهر رمضان كامل...',
  },
  {
    startSec: 10,
    endSec: 17,
    text: 'طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة،',
  },
  {
    startSec: 17,
    endSec: 23,
    text: 'وإقامة مريحة في فندق ميسان الملتزم.',
  },
  {
    startSec: 23,
    endSec: 32,
    text: 'وزيد معاهم رحلة للمدينة المنورة... والكل بسوم استثنائي: خمسة آلاف وتسعمية دينار برك للشخص!',
  },
  {
    startSec: 32,
    endSec: 42,
    text: 'الأماكن محدودة برشا! كلمنا توا على 98 140 514، ولا احجز ديريكت على easy2book.tn — إيزي تو بوك... سفرتك أسهل!',
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
    scene: 'المشهد 02',
    lines: [
      'شهر كامل في مكة 🕋',
      '✈️ طيران تونس - جدة - تونس',
      '🛂 فيزا + تأطير كامل',
      '🏨 فندق ميسان الملتزم',
    ],
  },
  {
    id: 'cap-3',
    scene: 'المشهد 03 و 04',
    lines: ['الأماكن محدودة ⏳', '📞 98 140 514', '🌐 www.easy2book.tn'],
  },
];
