import { useEffect, useMemo, useState } from 'react';
import type { CreatorLanguage } from '../types/creator';

const DEFAULT_DEADLINE_ISO = '2026-12-15T23:59:59';
const DEFAULT_DEADLINE_LABEL = '15 ديسمبر 2026';

interface CountdownTimerProps {
  deadlineIso?: string;
  deadlineLabel?: string;
  language?: CreatorLanguage;
  showRamadanLine?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasExpired: boolean;
}

function getNextRamadanTarget(): { date: Date; hijriYear: string } {
  const now = new Date();
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    for (let offsetDays = 0; offsetDays <= 400; offsetDays++) {
      const candidate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + offsetDays,
        0,
        0,
        0
      );
      const parts = fmt.formatToParts(candidate);
      const month = parts.find((p) => p.type === 'month')?.value;
      const day = parts.find((p) => p.type === 'day')?.value;
      const year = parts.find((p) => p.type === 'year')?.value || '1448';

      if (month === '9' && day === '1' && candidate.getTime() > now.getTime()) {
        return { date: candidate, hijriYear: year };
      }
    }
  } catch {
    // Fallback if islamic-umalqura calendar is unavailable
  }

  return {
    date: new Date('2027-02-08T00:00:00'),
    hijriYear: '1448',
  };
}

function calculateRemaining(targetMs: number): TimeRemaining {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasExpired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, hasExpired: false };
}

export function CountdownTimer({
  deadlineIso = DEFAULT_DEADLINE_ISO,
  deadlineLabel,
  language = 'ar',
  showRamadanLine = true,
}: CountdownTimerProps) {
  const offerTargetMs = useMemo(() => {
    const parsed = new Date(deadlineIso).getTime();
    return Number.isFinite(parsed)
      ? parsed
      : new Date(DEFAULT_DEADLINE_ISO).getTime();
  }, [deadlineIso]);

  const resolvedDeadlineLabel = useMemo(() => {
    if (deadlineLabel) return deadlineLabel;
    if (deadlineIso === DEFAULT_DEADLINE_ISO && language === 'ar') {
      return DEFAULT_DEADLINE_LABEL;
    }
    try {
      const locale =
        language === 'ar' ? 'ar-TN' : language === 'en' ? 'en-GB' : 'fr-FR';
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(offerTargetMs));
    } catch {
      return DEFAULT_DEADLINE_LABEL;
    }
  }, [deadlineIso, deadlineLabel, language, offerTargetMs]);

  const { date: ramadanDate, hijriYear } = useMemo(() => getNextRamadanTarget(), []);

  const [offerRemaining, setOfferRemaining] = useState<TimeRemaining>(() =>
    calculateRemaining(offerTargetMs)
  );
  const [ramadanRemaining, setRamadanRemaining] = useState<TimeRemaining>(() =>
    calculateRemaining(ramadanDate.getTime())
  );

  useEffect(() => {
    const updateAll = () => {
      setOfferRemaining(calculateRemaining(offerTargetMs));
      setRamadanRemaining(calculateRemaining(ramadanDate.getTime()));
    };
    updateAll();

    const timer = window.setInterval(updateAll, 1000);
    return () => window.clearInterval(timer);
  }, [offerTargetMs, ramadanDate]);

  const formattedRamadanGregorian = useMemo(() => {
    try {
      const locale =
        language === 'ar' ? 'ar-TN' : language === 'en' ? 'en-GB' : 'fr-FR';
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(ramadanDate);
    } catch {
      return language === 'ar'
        ? '8 فيفري 2027'
        : language === 'en'
          ? '8 February 2027'
          : '8 février 2027';
    }
  }, [language, ramadanDate]);

  const isAr = language === 'ar';
  const isEn = language === 'en';

  return (
    <div
      className="mt-6 rounded-xl border border-white/15 bg-white/5 p-5"
      aria-label={
        isAr
          ? 'العد التنازلي لصلاحية العرض وبداية شهر رمضان'
          : isEn
            ? 'Offer deadline countdown'
            : 'Compte à rebours de validité de l’offre'
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span className="font-semibold text-[#F5D68A]">
          {isAr
            ? `عدد غرف محدود جداً · عرض صالح لـ ${resolvedDeadlineLabel}`
            : isEn
              ? `Limited availability · Valid until ${resolvedDeadlineLabel}`
              : `Disponibilité limitée · Offre valable jusqu’au ${resolvedDeadlineLabel}`}
        </span>
        <span className="tabular-nums text-slate-300">
          {offerRemaining.hasExpired
            ? isAr
              ? 'انتهت مدة العرض'
              : isEn
                ? 'Offer expired'
                : 'Offre expirée'
            : isAr
              ? 'الوقت المتبقي للعرض'
              : isEn
                ? 'Time remaining'
                : 'Temps restant'}
        </span>
      </div>

      {!offerRemaining.hasExpired ? (
        <div
          className={`mt-4 grid grid-cols-4 divide-x ${
            isAr ? 'divide-x-reverse' : ''
          } divide-white/15 text-center`}
        >
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-white">
              {String(offerRemaining.days).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">
              {isAr ? 'يوم' : isEn ? 'Days' : 'Jours'}
            </p>
          </div>
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-[#F5D68A]">
              {String(offerRemaining.hours).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">
              {isAr ? 'ساعة' : isEn ? 'Hours' : 'Heures'}
            </p>
          </div>
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-white">
              {String(offerRemaining.minutes).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">
              {isAr ? 'دقيقة' : 'Min'}
            </p>
          </div>
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-slate-200">
              {String(offerRemaining.seconds).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">
              {isAr ? 'ثانية' : 'Sec'}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-200">
          {isAr
            ? `انتهى العرض الترويجي بتاريخ ${resolvedDeadlineLabel}. اتصل بنا على 98 140 514 للتحقق من التعريفة الحالية.`
            : isEn
              ? `This promotion expired on ${resolvedDeadlineLabel}. Call 98 140 514 for current rates.`
              : `Cette offre a expiré le ${resolvedDeadlineLabel}. Contactez-nous au 98 140 514 pour le tarif actualisé.`}
        </p>
      )}

      {showRamadanLine && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs text-slate-300">
          <span>
            {isAr
              ? `بداية شهر رمضان (${hijriYear} هـ · ${formattedRamadanGregorian})`
              : isEn
                ? `Ramadan start (${hijriYear} H · ${formattedRamadanGregorian})`
                : `Début Ramadan (${hijriYear} H · ${formattedRamadanGregorian})`}
          </span>
          {!ramadanRemaining.hasExpired && (
            <span className="font-mono-tabular font-semibold text-[#F5D68A]">
              {isAr
                ? `باقي ${ramadanRemaining.days} يوم · ${String(ramadanRemaining.hours).padStart(2, '0')} ساعة`
                : `J-${ramadanRemaining.days} · ${String(ramadanRemaining.hours).padStart(2, '0')}h`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
