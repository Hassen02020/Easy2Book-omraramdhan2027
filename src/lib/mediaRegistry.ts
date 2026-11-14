import makkahSunriseImg from '../assets/images/makkah_haram_sunrise_1794604285606.jpg';
import tunisFlightImg from '../assets/images/tunis_jeddah_flight_1794604285597.jpg';
import makkahSuiteImg from '../assets/images/makkah_maysan_suite_1794604285710.jpg';
import madinahTwilightImg from '../assets/images/madinah_umbrellas_twilight_1794604286691.jpg';
import voyageIstanbulImg from '../assets/images/voyage_istanbul_sunset_1794651031350.jpg';
import tunisiaResortImg from '../assets/images/tunisia_resort_twilight_1794651030831.jpg';
import visaDeskImg from '../assets/images/visa_travel_desk_1794651030778.jpg';

export type HeroImageKey =
  | 'makkah_haram'
  | 'tunis_flight'
  | 'maysan_suite'
  | 'madinah_twilight'
  | 'voyage_istanbul'
  | 'tunisia_resort'
  | 'visa_desk';

export const HERO_MEDIA_MAP: Record<
  HeroImageKey,
  { src: string; label: string }
> = {
  makkah_haram: {
    src: makkahSunriseImg,
    label: 'La Mecque — Masjid Al-Haram',
  },
  tunis_flight: {
    src: tunisFlightImg,
    label: 'Vol direct Tunis – Djeddah',
  },
  maysan_suite: {
    src: makkahSuiteImg,
    label: 'Hôtel Maysan Al Multazim',
  },
  madinah_twilight: {
    src: madinahTwilightImg,
    label: 'Médine — Masjid Nabawi',
  },
  voyage_istanbul: {
    src: voyageIstanbulImg,
    label: 'Voyages — Istanbul & Bosphore',
  },
  tunisia_resort: {
    src: tunisiaResortImg,
    label: 'Hôtels Tunisie — Resort 5*',
  },
  visa_desk: {
    src: visaDeskImg,
    label: 'Service Visa & Accompagnement',
  },
};

export function getHeroImageSrc(key?: string): string {
  if (!key) return makkahSunriseImg;
  if (key in HERO_MEDIA_MAP) {
    return HERO_MEDIA_MAP[key as HeroImageKey].src;
  }
  if (key.startsWith('http') || key.startsWith('/')) {
    return key;
  }
  return makkahSunriseImg;
}
