export interface RoomTier {
  id: 'quad_quint' | 'triple' | 'double';
  label: string;
  shortLabel: string;
  occupancyLabel: string;
  pricePerPersonDt: number;
  notes: string;
}

export const ROOM_TIERS: RoomTier[] = [
  {
    id: 'quad_quint',
    label: 'غرفة رباعية أو خماسية',
    shortLabel: 'رباعية أو خماسية',
    occupancyLabel: '4 أو 5 أشخاص',
    pricePerPersonDt: 5900,
    notes: 'السوم الأفضل في فندق ميسان الملتزم طيلة شهر رمضان المبارك',
  },
  {
    id: 'triple',
    label: 'غرفة ثلاثية',
    shortLabel: 'ثلاثية',
    occupancyLabel: '3 أشخاص',
    pricePerPersonDt: 6400,
    notes: 'راحة مثالية للعائلات الصغيرة مع كامل التأطير والخدمات',
  },
  {
    id: 'double',
    label: 'غرفة ثنائية',
    shortLabel: 'ثنائية',
    occupancyLabel: 'شخصان',
    pricePerPersonDt: 6900,
    notes: 'إقامة خاصة وهادئة لشخصين شاملة الطيران، الفيزا، ورحلة المدينة',
  },
];

export const FAMILY_DISCOUNT_DT = 200;
export const FAMILY_MIN_PERSONS = 2;
export const GROUP_CALL_THRESHOLD = 10;
export const OFFER_DEADLINE_ISO = '2026-12-15T23:59:59';
export const OFFER_DEADLINE_LABEL = '15 ديسمبر 2026';

export function getRoomTierByLabel(label: string): RoomTier {
  return ROOM_TIERS.find((tier) => tier.label === label) ?? ROOM_TIERS[0];
}
