import { useEffect, useRef, useState, useCallback } from 'react';
import {
  DEFAULT_TUNISIAN_SCRIPT,
  TOTAL_REEL_DURATION_SEC,
} from './data/campaignData';
import { ReelPlayer } from './components/ReelPlayer';
import { BookingSection } from './components/BookingSection';
import { WhatsAppIcon, WHATSAPP_URL } from './components/WhatsAppIcon';
import {
  FAMILY_DISCOUNT_DT,
  GROUP_CALL_THRESHOLD,
  OFFER_DEADLINE_LABEL,
  ROOM_TIERS,
} from './data/pricingData';

export default function App() {
  const [selectedRoomLabel, setSelectedRoomLabel] = useState<string>(
    ROOM_TIERS[0].label
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [audioDurationSec, setAudioDurationSec] = useState<number>(TOTAL_REEL_DURATION_SEC);
  const [audioActive, setAudioActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const totalDuration = audioDurationSec;

  const stopAudioElement = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioActive(false);
    }
  }, []);

  const attachAudioElement = useCallback(
    (url: string): Promise<HTMLAudioElement> => {
      return new Promise((resolve) => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(url);
        audio.muted = isMuted;

        const finishLoad = () => {
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setAudioDurationSec(Math.ceil(audio.duration * 10) / 10);
          }
          resolve(audio);
        };

        audio.addEventListener('loadedmetadata', finishLoad, { once: true });
        audio.addEventListener('error', () => resolve(audio), { once: true });

        audio.onended = () => {
          setAudioActive(false);
          setIsPlaying(false);
          setCurrentTime(
            Number.isFinite(audio.duration) && audio.duration > 0
              ? Math.ceil(audio.duration * 10) / 10
              : TOTAL_REEL_DURATION_SEC
          );
        };

        audioRef.current = audio;
        if (audio.readyState >= 1) {
          finishLoad();
        }
      });
    },
    [isMuted]
  );

  const ensureVoiceoverAudio = useCallback(async (): Promise<HTMLAudioElement | null> => {
    if (audioDataUrl && audioRef.current) {
      return audioRef.current;
    }

    setVoiceError(null);
    try {
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: DEFAULT_TUNISIAN_SCRIPT,
          voiceName: 'Charon',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        setVoiceError(
          data.error ||
            'تعذر توليد التعليق الصوتي. يتم تشغيل الفيديو مع الترجمة النصية.'
        );
        return null;
      }

      const url = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      setAudioDataUrl(url);
      return await attachAudioElement(url);
    } catch {
      setVoiceError(
        'تعذر الاتصال بخدمة الصوت. يمكنك متابعة الفيديو مع الترجمة المتزامنة.'
      );
      return null;
    }
  }, [attachAudioElement, audioDataUrl]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudioElement();
      return;
    }

    const restartNeeded = currentTime >= totalDuration - 0.15;
    if (restartNeeded) {
      setCurrentTime(0);
    }

    const audio = await ensureVoiceoverAudio();
    setIsPlaying(true);

    if (audio) {
      try {
        const effectiveDur =
          Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration
            : totalDuration;
        const startAt = restartNeeded
          ? 0
          : Math.min(effectiveDur - 0.1, Math.max(0, currentTime));
        audio.currentTime = startAt;
        audio.muted = isMuted;
        await audio.play();
        setAudioActive(true);
      } catch {
        setAudioActive(false);
      }
    }
  };

  const handleJumpToTime = (targetSec: number) => {
    const clamped = Math.max(0, Math.min(totalDuration, targetSec));
    setCurrentTime(clamped);
    if (
      audioRef.current &&
      Number.isFinite(audioRef.current.duration) &&
      audioRef.current.duration > 0
    ) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration - 0.05,
        clamped
      );
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTickRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTickRef.current) / 1000;
      lastTickRef.current = timestamp;

      const audio = audioRef.current;
      if (audioActive && audio && !audio.paused && !audio.ended) {
        setCurrentTime(audio.currentTime);
      } else if (!audioActive) {
        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [audioActive, isPlaying, totalDuration]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF9F6] text-[#0B162C]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#0B162C]/10 bg-[#FAF9F6]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-2.5">
          {/* Zone 1: Official brand logo */}
          <a
            href="#reel"
            className="flex h-14 w-16 items-center justify-center overflow-hidden shrink-0"
            aria-label="Easy2Book"
          >
            <img
              src="/assets/aistudio/logo_transparent_e9918557.png"
              alt="Easy2Book Centrale de Réservation"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain scale-[1.4]"
            />
          </a>

          {/* Zone 2: Clean single-line nav links */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#475569]"
          >
            <a
              href="#reel"
              className="hover:text-[#0B162C] transition-colors whitespace-nowrap shrink-0"
            >
              الفيديو الإعلاني
            </a>
            <a
              href="#program"
              className="hover:text-[#0B162C] transition-colors whitespace-nowrap shrink-0"
            >
              برنامج العمرة
            </a>
            <a
              href="#booking"
              className="hover:text-[#0B162C] transition-colors whitespace-nowrap shrink-0"
            >
              الحجز المباشر
            </a>
            <a
              href="https://www.easy2book.tn"
              target="_blank"
              rel="noreferrer"
              className="font-latin hover:text-[#0B162C] transition-colors whitespace-nowrap shrink-0"
            >
              easy2book.tn
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="تواصل عبر واتساب 98 140 514"
              className="inline-flex items-center gap-1.5 text-[#15803D] hover:text-[#166534] transition-colors whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>واتساب</span>
            </a>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="shrink-0">
            <a
              href="#booking"
              className="inline-flex items-center rounded-lg bg-[#0B162C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#17284A] whitespace-nowrap shrink-0"
            >
              احجز · 98 140 514
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Split: Campaign Value Proposition + Corrected 9:16 Vertical Video */}
        <section id="reel" className="py-14 lg:py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-12 lg:grid-cols-12 items-stretch">
              {/* Narrative & Video Controls */}
              <div className="flex flex-col justify-center lg:col-span-7">
                <p className="text-sm font-semibold text-[#C8922A]">
                  عمرة شهر رمضان كامل · مكة المكرمة والمدينة المنورة
                </p>

                <h1
                  className="mt-3 font-extrabold leading-[1.2] tracking-tight text-[#0B162C]"
                  style={{
                    fontSize: 'clamp(2.25rem, 4vw, 3.4rem)',
                    textWrap: 'balance',
                  }}
                >
                  عمرة رمضان الكل في مكة المكرمة... بسفر أسهل وقلب مطمئن
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#475569]">
                  برنامج متكامل من{' '}
                  <span className="font-latin font-semibold text-[#0B162C]">
                    Easy2Book
                  </span>{' '}
                  يشمل طيران تونس – جدة – تونس، التأشيرة، التأطير الديني والإداري
                  خطوة بخطوة، إقامة مريحة في فندق ميسان الملتزم، ورحلة روحانية
                  للمدينة المنورة بأسعار تبدأ من{' '}
                  <span className="tabular-nums font-bold text-[#0B162C]">
                    5,900 د.ت
                  </span>{' '}
                  للشخص (عدد غرف محدود جداً · عرض صالح لـ {OFFER_DEADLINE_LABEL}).
                </p>

                {/* Clean Conversion Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#booking"
                    className="inline-flex items-center rounded-lg bg-[#C8922A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#AD7B1D] whitespace-nowrap shrink-0"
                  >
                    احجز مكانك الآن
                  </a>

                  <a
                    href="tel:98140514"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#0B162C]/15 bg-white px-5 py-3 text-sm font-semibold text-[#0B162C] transition-colors hover:bg-[#F2EFE9] whitespace-nowrap shrink-0"
                  >
                    <span>اتصل بنا:</span>
                    <span className="font-mono-tabular font-bold" dir="ltr">
                      98 140 514
                    </span>
                  </a>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#16A34A]/30 bg-[#16A34A]/10 px-5 py-3 text-sm font-bold text-[#15803D] transition-colors hover:bg-[#16A34A]/15 whitespace-nowrap shrink-0"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>واتساب</span>
                  </a>
                </div>

                {voiceError && (
                  <p
                    role="status"
                    className="mt-3 text-xs font-medium text-amber-800"
                  >
                    {voiceError}
                  </p>
                )}
              </div>

              {/* Dominant Visual Anchor: 9:16 Commercial Frame */}
              <div className="flex items-center justify-center lg:col-span-5">
                <ReelPlayer
                  currentTime={currentTime}
                  totalDuration={totalDuration}
                  isPlaying={isPlaying}
                  showCaptions={true}
                  isMuted={isMuted}
                  audioActive={audioActive}
                  onTogglePlay={handleTogglePlay}
                  onToggleMute={handleToggleMute}
                  onSelectScene={handleJumpToTime}
                />
              </div>
            </div>

            {/* Full-Width 4-Column Package Highlights Strip Below Hero Split */}
            <div className="mt-14 grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#0B162C]/10 rounded-xl border border-[#0B162C]/10 bg-white lg:grid-cols-4">
              <div className="p-6">
                <p className="text-xs font-semibold text-[#475569]">الأسعار للشخص</p>
                <p className="mt-1.5 tabular-nums text-2xl font-extrabold text-[#C8922A]">
                  ابتداءً من 5,900 د.ت
                </p>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-[#475569]">تخفيض العائلات</p>
                <p className="mt-1.5 tabular-nums text-2xl font-extrabold text-[#0B162C]">
                  {FAMILY_DISCOUNT_DT} د.ت (من شخصين)
                </p>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-[#475569]">الإقامة في مكة</p>
                <p className="mt-1.5 text-2xl font-extrabold text-[#0B162C]">
                  فندق ميسان الملتزم
                </p>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-[#475569]">صلاحية العرض</p>
                <p className="mt-1.5 tabular-nums text-2xl font-extrabold text-[#0B162C]">
                  {OFFER_DEADLINE_LABEL}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Program Details: Asymmetric Bento Breakdown */}
        <section id="program" className="border-t border-[#0B162C]/10 bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#C8922A]">
                تفاصيل الرحلة والخدمات المشمولة
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0B162C]">
                كل ما تحتاجه لتتفرغ للعبادة براحة بال تامة
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              <div className="rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-7 lg:col-span-7">
                <p className="font-mono-tabular text-xs font-semibold text-[#C8922A]">
                  01
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#0B162C]">
                  طيران تونس – جدة – تونس وتأشيرة العمرة الكاملة
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  نتكفّل بجميع إجراءات حجز التذاكر الدولية واستخراج تأشيرة العمرة
                  والتنقلات المريحة من المطار إلى الفندق، لتنطلق رحلتك من تونس
                  دون عناء إداري.
                </p>
              </div>

              <div className="rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-7 lg:col-span-5">
                <p className="font-mono-tabular text-xs font-semibold text-[#C8922A]">
                  02
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#0B162C]">
                  تأطير كامل مع مرشدين مرافقين
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  مرافقة ميدانية ودينية خطوة بخطوة طيلة شهر رمضان، من مناسك
                  العمرة الأولى حتى صلاة التراويح والقيام.
                </p>
              </div>

              <div className="rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-7 lg:col-span-5">
                <p className="font-mono-tabular text-xs font-semibold text-[#C8922A]">
                  03
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#0B162C]">
                  الإقامة في فندق ميسان الملتزم
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  غرف مجهزة وعناية فندقية متواصلة في مكة المكرمة تمنحك الهدوء
                  والراحة بعد أداء الصلوات.
                </p>
              </div>

              <div className="rounded-xl border border-[#0B162C]/10 bg-[#0B162C] p-7 text-white lg:col-span-7">
                <p className="font-mono-tabular text-xs font-semibold text-[#F5D68A]">
                  04
                </p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  رحلة إلى المدينة المنورة مشمولة في البرنامج
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  زيارة المسجد النبوي الشريف والروضة المباركة في أجواء رمضانية
                  هادئة ومنظمة، وكل ذلك بأسعار تبدأ من{' '}
                  <span className="tabular-nums font-bold text-[#F5D68A]">
                    5,900 دينار تونسي
                  </span>{' '}
                  للشخص في الغرفة الرباعية أو الخماسية.
                </p>
              </div>
            </div>

            {/* Room Pricing Tiers & Special Conditions */}
            <div className="mt-14 border-t border-[#0B162C]/10 pt-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#C8922A]">
                    التسعيرة حسب نوع الغرفة · عدد غرف محدود جداً
                  </p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#0B162C]">
                    اختر الغرفة المناسبة لك ولعائلتك
                  </h3>
                </div>
                <p className="text-sm font-semibold text-[#475569]">
                  عرض صالح إلى {OFFER_DEADLINE_LABEL}
                </p>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {ROOM_TIERS.map((tier) => {
                  const isSelected = selectedRoomLabel === tier.label;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        setSelectedRoomLabel(tier.label);
                        document
                          .getElementById('booking')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex flex-col justify-between rounded-xl border p-6 text-right transition-colors ${
                        isSelected
                          ? 'border-[#C8922A] bg-[#FDF8EC]'
                          : 'border-[#0B162C]/10 bg-[#FAF9F6] hover:border-[#C8922A]/60'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#475569]">
                          {tier.occupancyLabel}
                        </p>
                        <h4 className="mt-1.5 text-xl font-bold text-[#0B162C]">
                          {tier.label}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                          {tier.notes}
                        </p>
                      </div>
                      <div className="mt-6 flex items-baseline justify-between border-t border-[#0B162C]/10 pt-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="tabular-nums text-3xl font-extrabold text-[#0B162C]">
                            {tier.pricePerPersonDt.toLocaleString('en-US')}
                          </span>
                          <span className="text-sm font-bold text-[#C8922A]">
                            د.ت / للشخص
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#0B162C]">
                          اختيار الغرفة
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-4 rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-5 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-[#C8922A]">
                    تخفيض العائلات
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0B162C]">
                    تخفيض {FAMILY_DISCOUNT_DT} د.ت للعائلات انطلاقاً من شخصين
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#C8922A]">
                    المجموعات الكبيرة
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0B162C]">
                    مجموعات تفوق {GROUP_CALL_THRESHOLD} أشخاص: الاتصال على{' '}
                    <a
                      href="tel:98140514"
                      className="font-mono-tabular underline decoration-[#C8922A]"
                      dir="ltr"
                    >
                      98 140 514
                    </a>{' '}
                    للحصول على الإمكانية
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#C8922A]">
                    تنبيه التوفر
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0B162C]">
                    عدد غرف محدود جداً · عرض صالح لـ {OFFER_DEADLINE_LABEL}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Direct Reservation & Lead Capture */}
        <BookingSection
          selectedRoomLabel={selectedRoomLabel}
          onRoomLabelChange={setSelectedRoomLabel}
        />
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#0B162C]/10 bg-white py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 text-sm text-[#475569]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-14 items-center justify-center overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/logo_transparent_e9918557.png"
                alt="Easy2Book"
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain scale-[1.4]"
              />
            </div>
            <span aria-hidden="true">·</span>
            <span>سفرتك أسهل</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:98140514"
              className="font-mono-tabular font-semibold text-[#0B162C] hover:text-[#C8922A]"
              dir="ltr"
            >
              98 140 514
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.easy2book.tn"
              target="_blank"
              rel="noreferrer"
              className="font-latin font-semibold text-[#0B162C] hover:text-[#C8922A]"
              dir="ltr"
            >
              www.easy2book.tn
            </a>
          </div>
        </div>
      </footer>
      {/* Floating WhatsApp Direct Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="تواصل معنا عبر واتساب 98 140 514"
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A]"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
