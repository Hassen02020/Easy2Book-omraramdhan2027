import makkahSunriseImg from '../assets/images/makkah_haram_sunrise_1794604285606.jpg';
import makkahNightImg from '../assets/images/makkah_haram_night_1794678796907.jpg';
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
import ferryCruiseImg from '../assets/images/ferry_mediterranean_cruise_1794678792861.jpg';
import vipTransferImg from '../assets/images/vip_airport_transfer_1794678794842.jpg';
import sidiBouSaidImg from '../assets/images/sidi_bou_said_tunisia_1794678794613.jpg';
import airlineCabinImg from '../assets/images/airline_business_cabin_1794678794936.jpg';
import maldivesVillaImg from '../assets/images/maldives_honeymoon_villa_1794678795488.jpg';
import marrakechRiadImg from '../assets/images/marrakech_luxury_riad_1794678796686.jpg';
import visaCanadaImg from '../assets/images/visa_canada_toronto_1794678796674.jpg';
import hammametMarinaImg from '../assets/images/hammamet_yasmine_marina_1794678798347.jpg';
import egyptPyramidsMuseum16x9 from '../assets/images/egypt_pyramids_museum_16x9_1794694254911.jpg';
import egyptNileDinner16x9 from '../assets/images/egypt_nile_dinner_16x9_1794694255137.jpg';
import egyptIslamicCairo16x9 from '../assets/images/egypt_islamic_cairo_16x9_1794694256042.jpg';
import egyptPyramidsReel9x16 from '../assets/images/egypt_pyramids_gem_9x16_1794694253332.jpg';
import egyptNileReel9x16 from '../assets/images/egypt_nile_cruise_9x16_1794694254619.jpg';
import egyptTransferReel9x16 from '../assets/images/egypt_vip_transfer_9x16_1794694254172.jpg';
import egyptIslamicReel9x16 from '../assets/images/egypt_islamic_cairo_9x16_1794694254977.jpg';
import turkeySapanca16x9 from '../assets/images/turkey_sapanca_lake_16x9_1794695566454.jpg';
import turkeyBosphorusCruise16x9 from '../assets/images/turkey_bosphorus_cruise_16x9_1794695567416.jpg';
import turkeyPrincesIslands16x9 from '../assets/images/turkey_princes_islands_16x9_1794695568390.jpg';
import turkeyAntalyaCoast16x9 from '../assets/images/turkey_antalya_coast_16x9_1794695568838.jpg';
import turkeyIstanbulReel9x16 from '../assets/images/turkey_istanbul_reel_9x16_1794695568829.jpg';
import turkeyBosphorusReel9x16 from '../assets/images/turkey_bosphorus_reel_9x16_1794695569156.jpg';
import turkeySapancaReel9x16 from '../assets/images/turkey_sapanca_reel_9x16_1794695570077.jpg';

export type HeroImageKey =
  | 'makkah_haram'
  | 'makkah_haram_night'
  | 'omra_vip_haram'
  | 'tunis_flight'
  | 'airline_business_cabin'
  | 'maysan_suite'
  | 'madinah_twilight'
  | 'voyage_istanbul'
  | 'dubai_skyline'
  | 'cairo_nile'
  | 'egypt_pyramids_museum'
  | 'egypt_nile_dinner'
  | 'egypt_islamic_cairo'
  | 'egypt_pyramids_reel'
  | 'egypt_nile_reel'
  | 'egypt_transfer_reel'
  | 'egypt_islamic_reel'
  | 'turkey_sapanca_lake'
  | 'turkey_bosphorus_cruise'
  | 'turkey_princes_islands'
  | 'turkey_antalya_coast'
  | 'turkey_istanbul_reel'
  | 'turkey_bosphorus_reel'
  | 'turkey_sapanca_reel'
  | 'maldives_honeymoon'
  | 'marrakech_riad'
  | 'ferry_mediterranean_cruise'
  | 'tunisia_resort'
  | 'djerba_thalasso'
  | 'hammamet_marina'
  | 'sidi_bou_said'
  | 'sahara_tozeur'
  | 'vip_airport_transfer'
  | 'visa_desk'
  | 'visa_europe'
  | 'visa_canada';

export const HERO_MEDIA_MAP: Record<
  HeroImageKey,
  { src: string; label: string }
> = {
  makkah_haram: {
    src: makkahSunriseImg,
    label: 'La Mecque — Masjid Al-Haram (Lever du soleil)',
  },
  makkah_haram_night: {
    src: makkahNightImg,
    label: 'La Mecque — Masjid Al-Haram de nuit (Format 9:16)',
  },
  omra_vip_haram: {
    src: omraVipHaramImg,
    label: 'Omra VIP 5★ — Suite Vue Panoramique Haram',
  },
  tunis_flight: {
    src: tunisFlightImg,
    label: 'Vol direct Tunis – Djeddah',
  },
  airline_business_cabin: {
    src: airlineCabinImg,
    label: 'Billetterie Aérienne — Vol au lever du soleil',
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
  egypt_pyramids_museum: {
    src: egyptPyramidsMuseum16x9,
    label: 'Égypte — Grand Musée Égyptien & Pyramides de Gizeh (16:9)',
  },
  egypt_nile_dinner: {
    src: egyptNileDinner16x9,
    label: 'Égypte — Dîner-Croisière sur le Nil au crépuscule (16:9)',
  },
  egypt_islamic_cairo: {
    src: egyptIslamicCairo16x9,
    label: 'Égypte — Le Caire Islamique & Khan El Khalili (16:9)',
  },
  egypt_pyramids_reel: {
    src: egyptPyramidsReel9x16,
    label: 'Égypte Reel 9:16 — Pyramides de Gizeh au lever du soleil',
  },
  egypt_nile_reel: {
    src: egyptNileReel9x16,
    label: 'Égypte Reel 9:16 — Croisière Nocturne sur le Nil',
  },
  egypt_transfer_reel: {
    src: egyptTransferReel9x16,
    label: 'Égypte Reel 9:16 — Transfert Privé VIP Hôtel Caire',
  },
  egypt_islamic_reel: {
    src: egyptIslamicReel9x16,
    label: 'Égypte Reel 9:16 — القاهرة الإسلامية والقلعة',
  },
  turkey_sapanca_lake: {
    src: turkeySapanca16x9,
    label: 'Turquie — Lac de Sapanca & Cascades de Maşukiye (16:9)',
  },
  turkey_bosphorus_cruise: {
    src: turkeyBosphorusCruise16x9,
    label: 'Turquie — Dîner-Croisière sur le Bosphore (16:9)',
  },
  turkey_princes_islands: {
    src: turkeyPrincesIslands16x9,
    label: 'Turquie — Îles des Princes Büyükada (16:9)',
  },
  turkey_antalya_coast: {
    src: turkeyAntalyaCoast16x9,
    label: 'Turquie — Côte Turquoise & Pack Antalya (16:9)',
  },
  turkey_istanbul_reel: {
    src: turkeyIstanbulReel9x16,
    label: 'Turquie Reel 9:16 — Istanbul & Bosphore au coucher du soleil',
  },
  turkey_bosphorus_reel: {
    src: turkeyBosphorusReel9x16,
    label: 'Turquie Reel 9:16 — Soirée Dîner-Croisière Bosphore',
  },
  turkey_sapanca_reel: {
    src: turkeySapancaReel9x16,
    label: 'Turquie Reel 9:16 — Sapanca, Maşukiye & Van VIP',
  },
  maldives_honeymoon: {
    src: maldivesVillaImg,
    label: 'Voyages — Maldives Villas sur Pilotis & Noces',
  },
  marrakech_riad: {
    src: marrakechRiadImg,
    label: 'Voyages — Marrakech Riad Luxe & Atlas',
  },
  ferry_mediterranean_cruise: {
    src: ferryCruiseImg,
    label: 'Bateaux & Croisières — Ferry Méditerranée (Tunis / Europe)',
  },
  tunisia_resort: {
    src: tunisiaResortImg,
    label: 'Hôtels Tunisie — Resort Hammamet 5★',
  },
  djerba_thalasso: {
    src: djerbaThalassoImg,
    label: 'Hôtels Tunisie — Djerba Thalasso & Plage 5★',
  },
  hammamet_marina: {
    src: hammametMarinaImg,
    label: 'Hôtels Tunisie — Yasmine Hammamet & Marina 5★',
  },
  sidi_bou_said: {
    src: sidiBouSaidImg,
    label: 'Excursions Tunisie — Sidi Bou Saïd & Méditerranée',
  },
  sahara_tozeur: {
    src: saharaTozeurImg,
    label: 'Tunisie — Oasis & Resort Sahara Tozeur',
  },
  vip_airport_transfer: {
    src: vipTransferImg,
    label: 'Transferts VIP — Chauffeur Privé Aéroport & Hôtel',
  },
  visa_desk: {
    src: visaDeskImg,
    label: 'Service Visa & Accompagnement Consulaire',
  },
  visa_europe: {
    src: visaEuropeParisImg,
    label: 'Visa Europe / Schengen — Paris & Affaires',
  },
  visa_canada: {
    src: visaCanadaImg,
    label: 'Visa Canada & Amérique du Nord — Toronto',
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
