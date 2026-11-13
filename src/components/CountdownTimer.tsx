import { useEffect, useMemo, useState } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasStarted: boolean;
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
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasStarted: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, hasStarted: false };
}

export function CountdownTimer() {
  const { date: targetDate, hijriYear } = useMemo(() => getNextRamadanTarget(), []);
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    calculateRemaining(targetDate.getTime())
  );

  useEffect(() => {
    const targetMs = targetDate.getTime();
    setRemaining(calculateRemaining(targetMs));

    const timer = window.setInterval(() => {
      setRemaining(calculateRemaining(targetMs));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const formattedGregorian = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('ar-TN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(targetDate);
    } catch {
      return '8 فيفري 2027';
    }
  }, [targetDate]);

  if (remaining.hasStarted) {
    return (
      <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4">
        <p className="text-xs font-semibold text-[#F5D68A]">
          انطلقت رحلات شهر رمضان المبارك {hijriYear} هـ
        </p>
        <p className="mt-1 text-sm text-slate-200">
          تواصل معنا مباشرة للتحقق من آخر المقاعد المتاحة.
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-6 rounded-xl border border-white/15 bg-white/5 p-5"
      aria-label="العد التنازلي لبداية شهر رمضان"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span className="font-semibold text-[#F5D68A]">
          الوقت المتبقي لبداية شهر رمضان
        </span>
        <span className="tabular-nums">
          1 رمضان {hijriYear} هـ · {formattedGregorian}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 divide-x divide-x-reverse divide-white/15 text-center">
        <div className="px-2">
          <p className="font-mono-tabular text-2xl font-extrabold text-white">
            {String(remaining.days).padStart(2, '0')}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-300">يوم</p>
        </div>
        <div className="px-2">
          <p className="font-mono-tabular text-2xl font-extrabold text-[#F5D68A]">
            {String(remaining.hours).padStart(2, '0')}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-300">ساعة</p>
        </div>
        <div className="px-2">
          <p className="font-mono-tabular text-2xl font-extrabold text-white">
            {String(remaining.minutes).padStart(2, '0')}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-300">دقيقة</p>
        </div>
        <div className="px-2">
          <p className="font-mono-tabular text-2xl font-extrabold text-slate-200">
            {String(remaining.seconds).padStart(2, '0')}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-300">ثانية</p>
        </div>
      </div>
    </div>
  );
}
