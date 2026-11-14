import makkahSunriseImg from '../assets/images/makkah_haram_sunrise_1794604285606.jpg';
import tunisFlightImg from '../assets/images/tunis_jeddah_flight_1794604285597.jpg';
import makkahSuiteImg from '../assets/images/makkah_maysan_suite_1794604285710.jpg';
import madinahTwilightImg from '../assets/images/madinah_umbrellas_twilight_1794604286691.jpg';
import voyageIstanbulImg from '../assets/images/voyage_istanbul_sunset_1794651031350.jpg';
import tunisiaResortImg from '../assets/images/tunisia_resort_twilight_1794651030831.jpg';
import visaDeskImg from '../assets/images/visa_travel_desk_1794651030778.jpg';
import dubaiSkylineImg from '../assets/images/dubai_skyline_luxury_1794652718471.jpg';
import cairoNileImg from '../assets/images/cairo_nile_sunset_1794652719074.jpg';
import saharaTozeurImg from '../assets/images/sahara_tozeur_oasis_1794652720195.jpg';
import djerbaThalassoImg from '../assets/images/djerba_thalasso_spa_1794652720219.jpg';
import omraVipHaramImg from '../assets/images/omra_vip_haram_view_1794652720059.jpg';
import visaEuropeParisImg from '../assets/images/visa_europe_paris_1794652721585.jpg';

export type HeroImageKey =
  | 'makkah_haram'
  | 'omra_vip_haram'
  | 'tunis_flight'
  | 'maysan_suite'
  | 'madinah_twilight'
  | 'voyage_istanbul'
  | 'dubai_skyline'
  | 'cairo_nile'
  | 'tunisia_resort'
  | 'djerba_thalasso'
  | 'sahara_tozeur'
  | 'visa_desk'
  | 'visa_europe';

export const HERO_MEDIA_MAP: Record<
  HeroImageKey,
  { src: string; label: string }
> = {
  makkah_haram: {
    src: makkahSunriseImg,
    label: 'La Mecque — Masjid Al-Haram (Lever du soleil)',
  },
  omra_vip_haram: {
    src: omraVipHaramImg,
    label: 'Omra VIP 5★ — Suite Vue Panoramique Haram',
  },
  tunis_flight: {
    src: tunisFlightImg,
    label: 'Vol direct Tunis – Djeddah',
  },
  maysan_suite: {
    src: makkahSuiteImg,
    label: 'Hôtel Maysan Al Multazim — Suite',
  },
  madinah_twilight: {
    src: madinahTwilightImg,
    label: 'Médine — Masjid Nabawi au crépuscule',
  },
  voyage_istanbul: {
    src: voyageIstanbulImg,
    label: 'Voyages — Istanbul & Bosphore',
  },
  dubai_skyline: {
    src: dubaiSkylineImg,
    label: 'Voyages — Dubaï Marina & Skyline Luxe',
  },
  cairo_nile: {
    src: cairoNileImg,
    label: 'Voyages — Le Caire & Croisière Nil',
  },
  tunisia_resort: {
    src: tunisiaResortImg,
    label: 'Hôtels Tunisie — Resort Hammamet 5★',
  },
  djerba_thalasso: {
    src: djerbaThalassoImg,
    label: 'Hôtels Tunisie — Djerba Thalasso & Plage 5★',
  },
  sahara_tozeur: {
    src: saharaTozeurImg,
    label: 'Tunisie — Oasis & Resort Sahara Tozeur',
  },
  visa_desk: {
    src: visaDeskImg,
    label: 'Service Visa & Accompagnement Consulaire',
  },
  visa_europe: {
    src: visaEuropeParisImg,
    label: 'Visa Europe / Schengen — Paris & Affaires',
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
