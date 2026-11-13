import { useEffect, useMemo, useState } from 'react';
import { OFFER_DEADLINE_ISO, OFFER_DEADLINE_LABEL } from '../data/pricingData';

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

export function CountdownTimer() {
  const offerTargetMs = useMemo(() => new Date(OFFER_DEADLINE_ISO).getTime(), []);
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
      return new Intl.DateTimeFormat('ar-TN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(ramadanDate);
    } catch {
      return '8 فيفري 2027';
    }
  }, [ramadanDate]);

  return (
    <div
      className="mt-6 rounded-xl border border-white/15 bg-white/5 p-5"
      aria-label="العد التنازلي لصلاحية العرض وبداية شهر رمضان"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span className="font-semibold text-[#F5D68A]">
          عدد غرف محدود جداً · عرض صالح لـ {OFFER_DEADLINE_LABEL}
        </span>
        <span className="tabular-nums text-slate-300">
          {offerRemaining.hasExpired ? 'انتهت مدة العرض' : 'الوقت المتبقي للعرض'}
        </span>
      </div>

      {!offerRemaining.hasExpired ? (
        <div className="mt-4 grid grid-cols-4 divide-x divide-x-reverse divide-white/15 text-center">
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-white">
              {String(offerRemaining.days).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">يوم</p>
          </div>
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-[#F5D68A]">
              {String(offerRemaining.hours).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">ساعة</p>
          </div>
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-white">
              {String(offerRemaining.minutes).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">دقيقة</p>
          </div>
          <div className="px-2">
            <p className="font-mono-tabular text-2xl font-extrabold text-slate-200">
              {String(offerRemaining.seconds).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">ثانية</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-200">
          انتهى العرض الترويجي بتاريخ {OFFER_DEADLINE_LABEL}. اتصل بنا على 98 140 514 للتحقق من التعريفة الحالية.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs text-slate-300">
        <span>بداية شهر رمضان ({hijriYear} هـ · {formattedRamadanGregorian})</span>
        {!ramadanRemaining.hasExpired && (
          <span className="font-mono-tabular font-semibold text-[#F5D68A]">
            باقي {ramadanRemaining.days} يوم · {String(ramadanRemaining.hours).padStart(2, '0')} ساعة
          </span>
        )}
      </div>
    </div>
  );
}
