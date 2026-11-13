import { useEffect, useState, type FormEvent } from 'react';
import { Phone, Globe, CheckCircle2 } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { WhatsAppIcon, WHATSAPP_URL } from './WhatsAppIcon';
import {
  FAMILY_DISCOUNT_DT,
  FAMILY_MIN_PERSONS,
  GROUP_CALL_THRESHOLD,
  OFFER_DEADLINE_LABEL,
  ROOM_TIERS,
  getRoomTierByLabel,
} from '../data/pricingData';

interface BookingSectionProps {
  selectedRoomLabel?: string;
  onRoomLabelChange?: (label: string) => void;
}

interface ConfirmedBooking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  pilgrimsCount: number;
  roomType: string;
  isFamily: boolean;
  isGroupInquiry: boolean;
  estimatedTotalDt: number | null;
  departureNote?: string;
  createdAt: string;
}

function buildBookingWhatsAppUrl(params: {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  pilgrimsCount: number;
  roomType: string;
  isFamily: boolean;
  isGroupInquiry: boolean;
  estimatedTotalDt: number | null;
  departureNote?: string;
}): string {
  const tier = getRoomTierByLabel(params.roomType);
  const pilgrimsText = params.isGroupInquiry
    ? 'أكثر من 10 أشخاص (مجموعة — طلب الحصول على الإمكانية)'
    : `${params.pilgrimsCount}`;

  const lines = [
    'السلام عليكم Easy2Book، أرغب في تأكيد طلب حجز عمرة شهر رمضان كامل:',
    params.id ? `• مرجع الطلب: ${params.id}` : null,
    `• اسم العميل: ${params.fullName.trim() || 'غير محدد'}`,
    `• رقم الهاتف: ${params.phone.trim() || 'غير محدد'}`,
    `• البريد الإلكتروني: ${params.email.trim() || 'غير محدد'}`,
    `• نوع الغرفة (فندق ميسان الملتزم): ${tier.label} (${tier.pricePerPersonDt.toLocaleString('en-US')} د.ت / شخص)`,
    `• عدد المعتمرين: ${pilgrimsText}`,
    params.isFamily && !params.isGroupInquiry
      ? `• تخفيض العائلات (انطلاقاً من شخصين): -${FAMILY_DISCOUNT_DT} د.ت`
      : null,
    params.isGroupInquiry
      ? '• التعريفة: حسب الإمكانية (مجموعة تفوق 10 أشخاص)'
      : params.estimatedTotalDt !== null
        ? `• التكلفة التقديرية الإجمالية: ${params.estimatedTotalDt.toLocaleString('en-US')} د.ت`
        : null,
    `• صلاحية العرض: عرض صالح لـ ${OFFER_DEADLINE_LABEL}`,
    params.departureNote?.trim()
      ? `• ملاحظات إضافية: ${params.departureNote.trim()}`
      : null,
  ].filter(Boolean);

  return `https://wa.me/21698140514?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function BookingSection({
  selectedRoomLabel,
  onRoomLabelChange,
}: BookingSectionProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pilgrimsCount, setPilgrimsCount] = useState(2);
  const [roomType, setRoomType] = useState(
    selectedRoomLabel || ROOM_TIERS[0].label
  );
  const [isFamily, setIsFamily] = useState(false);
  const [departureNote, setDepartureNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    if (selectedRoomLabel && selectedRoomLabel !== roomType) {
      setRoomType(selectedRoomLabel);
      setConfirmed(null);
    }
  }, [selectedRoomLabel, roomType]);

  const activeTier = getRoomTierByLabel(roomType);
  const isGroupInquiry = pilgrimsCount > GROUP_CALL_THRESHOLD;
  const familyEligible =
    pilgrimsCount >= FAMILY_MIN_PERSONS && !isGroupInquiry;
  const appliedFamilyDiscount = familyEligible && isFamily ? FAMILY_DISCOUNT_DT : 0;
  const baseTotal = isGroupInquiry
    ? null
    : pilgrimsCount * activeTier.pricePerPersonDt;
  const estimatedTotal =
    baseTotal !== null ? Math.max(0, baseTotal - appliedFamilyDiscount) : null;

  const liveWhatsAppUrl = buildBookingWhatsAppUrl({
    fullName,
    phone,
    email,
    pilgrimsCount,
    roomType,
    isFamily: appliedFamilyDiscount > 0,
    isGroupInquiry,
    estimatedTotalDt: estimatedTotal,
    departureNote,
  });

  const handleRoomChange = (label: string) => {
    setRoomType(label);
    onRoomLabelChange?.(label);
  };

  const handlePilgrimsChange = (count: number) => {
    setPilgrimsCount(count);
    if (count < FAMILY_MIN_PERSONS || count > GROUP_CALL_THRESHOLD) {
      setIsFamily(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const digitsOnly = phone.replace(/\D/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedName.length < 3) {
      setErrorMessage('يرجى كتابة اسم العميل الكامل (3 أحرف على الأقل).');
      return;
    }
    if (digitsOnly.length < 8) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح لا يقل عن 8 أرقام.');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          phone: phone.trim(),
          email: trimmedEmail,
          pilgrimsCount,
          roomType,
          isFamily: appliedFamilyDiscount > 0,
          isGroupInquiry,
          departureNote: departureNote.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'تعذر تسجيل الطلب، حاول مرة أخرى.');
        return;
      }
      setConfirmed(data.booking);
      setFullName('');
      setPhone('');
      setEmail('');
      setDepartureNote('');
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم، يمكنك الاتصال بنا مباشرة على 98 140 514.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-[#FAF9F6]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 lg:grid-cols-12 items-stretch">
          {/* Right Column: Pricing Tiers, Urgency Countdown & Direct Contact */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#0B162C] p-8 text-white lg:col-span-5">
            <div>
              <p className="text-sm font-semibold text-[#F5D68A]">
                عدد غرف محدود جداً · عرض صالح لـ {OFFER_DEADLINE_LABEL}
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-snug text-white">
                احجز مكانك الآن في عمرة شهر رمضان كامل
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                فريق Easy2Book يتكفّل بجميع الإجراءات من مطار تونس قرطاج إلى مكة
                المكرمة والمدينة المنورة، مع مرافقة دينية وإدارية متواصلة.
              </p>

              <CountdownTimer />

              {/* Compact Pricing Breakdown */}
              <div className="mt-6 border-t border-white/15 pt-5 space-y-2.5">
                {ROOM_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-200">{tier.label}</span>
                    <span className="font-mono-tabular font-bold text-[#F5D68A]">
                      {tier.pricePerPersonDt.toLocaleString('en-US')} د.ت / شخص
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                  <p className="font-semibold text-emerald-300">
                    • تخفيض {FAMILY_DISCOUNT_DT} د.ت للعائلات انطلاقاً من شخصين
                  </p>
                  <p>
                    • مجموعات تفوق {GROUP_CALL_THRESHOLD} أشخاص: الاتصال على 98 140 514 للحصول على الإمكانية
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3 border-t border-white/15 pt-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-[#22C55E]/35 bg-[#22C55E]/15 px-4 py-3.5 transition-colors hover:bg-[#22C55E]/25"
              >
                <div className="flex items-center gap-3">
                  <WhatsAppIcon className="h-4 w-4 text-[#4ADE80]" />
                  <span className="text-sm font-semibold">راسلنا على واتساب</span>
                </div>
                <span className="font-mono-tabular text-base font-bold text-[#4ADE80]" dir="ltr">
                  98 140 514
                </span>
              </a>

              <a
                href="tel:98140514"
                className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#F5D68A]" aria-hidden="true" />
                  <span className="text-sm font-semibold">اتصل بنا مباشرة</span>
                </div>
                <span className="font-mono-tabular text-base font-bold text-[#F5D68A]" dir="ltr">
                  98 140 514
                </span>
              </a>

              <a
                href="https://www.easy2book.tn"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-[#F5D68A]" aria-hidden="true" />
                  <span className="text-sm font-semibold">الموقع الرسمي</span>
                </div>
                <span className="font-latin text-sm font-semibold text-white" dir="ltr">
                  www.easy2book.tn
                </span>
              </a>
            </div>
          </div>

          {/* Left Column: Simple Contact & Booking Interest Form */}
          <div className="rounded-2xl border border-[#0B162C]/10 bg-white p-8 lg:col-span-7">
            {confirmed ? (
              <div className="flex h-full flex-col justify-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-[#0B162C]">
                  تم تسجيل طلب الاهتمام بالحجز بنجاح
                </h3>
                <p className="mt-2 text-base text-[#475569]">
                  شكراً لك {confirmed.fullName}. سيتواصل معك مستشار العمرة من
                  Easy2Book قريباً على الرقم{' '}
                  <span className="font-mono-tabular font-semibold text-[#0B162C]" dir="ltr">
                    {confirmed.phone}
                  </span>{' '}
                  أو عبر البريد{' '}
                  <span className="font-latin font-semibold text-[#0B162C]" dir="ltr">
                    {confirmed.email}
                  </span>{' '}
                  لتأكيد الجوازات والغرف قبل {OFFER_DEADLINE_LABEL}.
                </p>

                <div className="mt-6 grid gap-4 rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-[#475569]">مرجع الطلب</p>
                    <p className="mt-1 font-mono-tabular text-sm font-bold text-[#0B162C]">
                      {confirmed.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#475569]">عدد المعتمرين</p>
                    <p className="mt-1 tabular-nums text-sm font-bold text-[#0B162C]">
                      {confirmed.isGroupInquiry
                        ? 'أكثر من 10 أشخاص'
                        : `${confirmed.pilgrimsCount} أشخاص`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#475569]">نوع الغرفة</p>
                    <p className="mt-1 text-sm font-bold text-[#0B162C]">
                      {confirmed.roomType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#475569]">التكلفة التقديرية</p>
                    <p className="mt-1 tabular-nums text-sm font-bold text-[#0B162C]">
                      {confirmed.isGroupInquiry
                        ? 'حسب الإمكانية (اتصال)'
                        : `${(confirmed.estimatedTotalDt ?? 0).toLocaleString('en-US')} د.ت`}
                    </p>
                  </div>
                </div>

                {confirmed.isFamily && !confirmed.isGroupInquiry && (
                  <p className="mt-3 text-xs font-semibold text-emerald-700">
                    تم احتساب تخفيض العائلات (-{FAMILY_DISCOUNT_DT} د.ت) ضمن التكلفة التقديرية.
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={buildBookingWhatsAppUrl({
                      id: confirmed.id,
                      fullName: confirmed.fullName,
                      phone: confirmed.phone,
                      email: confirmed.email,
                      pilgrimsCount: confirmed.pilgrimsCount,
                      roomType: confirmed.roomType,
                      isFamily: confirmed.isFamily,
                      isGroupInquiry: confirmed.isGroupInquiry,
                      estimatedTotalDt: confirmed.estimatedTotalDt,
                      departureNote: confirmed.departureNote,
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#15803D] whitespace-nowrap shrink-0"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>إرسال التفاصيل إلى واتساب Business · 98 140 514</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setConfirmed(null)}
                    className="rounded-lg border border-[#0B162C]/15 px-4 py-2.5 text-sm font-semibold text-[#0B162C] hover:bg-[#FAF9F6] whitespace-nowrap shrink-0"
                  >
                    تسجيل طلب اهتمام آخر
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0B162C]">
                      نموذج الاتصال والاهتمام بالحجز
                    </h3>
                    <p className="mt-1 text-sm text-[#475569]">
                      اختر نوع الغرفة وعدد المعتمرين وأدخل بياناتك لإتمام الحجز
                      قبل {OFFER_DEADLINE_LABEL}.
                    </p>
                  </div>
                  <div className="hidden h-16 w-20 items-center justify-center overflow-hidden shrink-0 sm:flex">
                    <img
                      src="/assets/aistudio/logo_transparent_e9918557.png"
                      alt="Easy2Book"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain scale-[1.35]"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="full-name"
                      className="block text-sm font-semibold text-[#0B162C]"
                    >
                      اسم العميل
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: حسان الطرهوني"
                      className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-semibold text-[#0B162C]"
                    >
                      رقم الهاتف
                    </label>
                    <input
                      id="phone-number"
                      type="tel"
                      required
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98 140 514"
                      className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-left font-mono-tabular text-sm text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="client-email"
                    className="block text-sm font-semibold text-[#0B162C]"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-left font-latin text-sm text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="room-type"
                      className="block text-sm font-semibold text-[#0B162C]"
                    >
                      نوع الغرفة (فندق ميسان الملتزم)
                    </label>
                    <select
                      id="room-type"
                      value={roomType}
                      onChange={(e) => handleRoomChange(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-sm font-semibold text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                    >
                      {ROOM_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.label}>
                          {tier.label} — {tier.pricePerPersonDt.toLocaleString('en-US')} د.ت/شخص
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="pilgrims-count"
                      className="block text-sm font-semibold text-[#0B162C]"
                    >
                      عدد المعتمرين
                    </label>
                    <select
                      id="pilgrims-count"
                      value={pilgrimsCount}
                      onChange={(e) => handlePilgrimsChange(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-sm font-semibold text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'معتمر' : n === 2 ? 'معتمران' : 'معتمرين'}
                        </option>
                      ))}
                      <option value={11}>
                        أكثر من 10 أشخاص (مجموعة — حسب الإمكانية)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Family Discount Option OR >10 Group Notice */}
                {isGroupInquiry ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C8922A]/40 bg-[#FDF8EC] p-4">
                    <div className="text-sm">
                      <p className="font-bold text-[#0B162C]">
                        مجموعات تفوق 10 أشخاص
                      </p>
                      <p className="mt-0.5 text-xs text-[#475569]">
                        يرجى الاتصال مباشرة للحصول على الإمكانية وتأكيد توفر الغرف.
                      </p>
                    </div>
                    <a
                      href="tel:98140514"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#0B162C] px-4 py-2 text-xs font-bold text-white hover:bg-[#17284A] whitespace-nowrap shrink-0"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#F5D68A]" aria-hidden="true" />
                      <span dir="ltr">98 140 514</span>
                    </a>
                  </div>
                ) : (
                  <label
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      familyEligible
                        ? isFamily
                          ? 'border-emerald-300 bg-emerald-50/70 cursor-pointer'
                          : 'border-[#0B162C]/15 bg-[#FAF9F6] hover:border-[#C8922A]/50 cursor-pointer'
                        : 'border-[#0B162C]/10 bg-slate-50 opacity-70 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={familyEligible && isFamily}
                        disabled={!familyEligible}
                        onChange={(e) => setIsFamily(e.target.checked)}
                        className="h-4 w-4 accent-[#16A34A]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0B162C]">
                          حجز عائلي (تخفيض {FAMILY_DISCOUNT_DT} د.ت انطلاقاً من شخصين)
                        </p>
                        <p className="text-xs text-[#475569]">
                          {familyEligible
                            ? 'متاح لعدد المعتمرين المختار — يتم خصم 200 د.ت فوراً'
                            : 'اختر شخصين فأكثر لتفعيل تخفيض العائلات'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-emerald-700 whitespace-nowrap shrink-0">
                      -{FAMILY_DISCOUNT_DT} د.ت
                    </span>
                  </label>
                )}

                <div>
                  <label
                    htmlFor="departure-note"
                    className="block text-sm font-semibold text-[#0B162C]"
                  >
                    ملاحظات إضافية (اختياري)
                  </label>
                  <input
                    id="departure-note"
                    type="text"
                    value={departureNote}
                    onChange={(e) => setDepartureNote(e.target.value)}
                    placeholder="مثال: مرافقة كبار السن أو طلب غرف متجاورة"
                    className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                  />
                </div>

                {errorMessage && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-800"
                  >
                    {errorMessage}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0B162C]/10 pt-5">
                  <div>
                    <p className="text-xs text-[#475569]">
                      {isGroupInquiry
                        ? 'التسعيرة للمجموعات (+10 أشخاص)'
                        : appliedFamilyDiscount > 0
                          ? `الإجمالي بعد تخفيض العائلات (-${appliedFamilyDiscount} د.ت)`
                          : 'التكلفة التقديرية الإجمالية'}
                    </p>
                    <p className="tabular-nums text-xl font-extrabold text-[#0B162C]">
                      {isGroupInquiry
                        ? 'حسب الإمكانية · اتصل 98 140 514'
                        : `${(estimatedTotal ?? 0).toLocaleString('en-US')} د.ت`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={liveWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15803D] whitespace-nowrap shrink-0"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>إرسال عبر واتساب · 98 140 514</span>
                    </a>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-[#0B162C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#17284A] disabled:opacity-60 whitespace-nowrap shrink-0"
                    >
                      {isSubmitting ? 'جاري تسجيل الطلب...' : 'إرسال طلب الاهتمام بالحجز'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
