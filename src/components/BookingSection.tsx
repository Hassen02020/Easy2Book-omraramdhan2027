import { useState, type FormEvent } from 'react';
import { Phone, Globe, CheckCircle2 } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { WhatsAppIcon, WHATSAPP_URL } from './WhatsAppIcon';

interface ConfirmedBooking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  pilgrimsCount: number;
  roomType: string;
  departureNote?: string;
  createdAt: string;
}

const PRICE_PER_PERSON_DT = 5900;

function buildBookingWhatsAppUrl(params: {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  pilgrimsCount: number;
  roomType: string;
  departureNote?: string;
}): string {
  const total = params.pilgrimsCount * PRICE_PER_PERSON_DT;
  const lines = [
    'السلام عليكم Easy2Book، أرغب في تأكيد طلب حجز عمرة شهر رمضان كامل:',
    params.id ? `• مرجع الطلب: ${params.id}` : null,
    `• اسم العميل: ${params.fullName.trim() || 'غير محدد'}`,
    `• رقم الهاتف: ${params.phone.trim() || 'غير محدد'}`,
    `• البريد الإلكتروني: ${params.email.trim() || 'غير محدد'}`,
    `• عدد المعتمرين: ${params.pilgrimsCount}`,
    `• نوع الغرفة (فندق ميسان الملتزم): ${params.roomType}`,
    `• التكلفة التقديرية: ${total.toLocaleString('en-US')} د.ت`,
    params.departureNote?.trim()
      ? `• ملاحظات إضافية: ${params.departureNote.trim()}`
      : null,
  ].filter(Boolean);

  return `https://wa.me/21698140514?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function BookingSection() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pilgrimsCount, setPilgrimsCount] = useState(2);
  const [roomType, setRoomType] = useState('غرفة ثنائية');
  const [departureNote, setDepartureNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  const estimatedTotal = pilgrimsCount * PRICE_PER_PERSON_DT;
  const liveWhatsAppUrl = buildBookingWhatsAppUrl({
    fullName,
    phone,
    email,
    pilgrimsCount,
    roomType,
    departureNote,
  });

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
          {/* Right Column: Direct Contact & Urgency Info */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#0B162C] p-8 text-white lg:col-span-5">
            <div>
              <p className="text-sm font-semibold text-[#F5D68A]">
                الأماكن محدودة لشهر رمضان المبارك
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-snug text-white">
                احجز مكانك الآن في عمرة شهر رمضان كامل
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                فريق Easy2Book يتكفّل بجميع الإجراءات من مطار تونس قرطاج إلى مكة
                المكرمة والمدينة المنورة، مع مرافقة دينية وإدارية متواصلة.
              </p>

              <CountdownTimer />

              <div className="mt-6 border-t border-white/15 pt-6">
                <p className="text-xs text-slate-300">السوم الاستثنائي للشخص</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="tabular-nums text-4xl font-extrabold text-[#F5D68A]">
                    5,900
                  </span>
                  <span className="text-base font-semibold text-white">
                    دينار تونسي
                  </span>
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
                  لتأكيد الجوازات والدفعة الأولى.
                </p>

                <div className="mt-6 grid gap-4 rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-[#475569]">مرجع الطلب</p>
                    <p className="mt-1 font-mono-tabular text-sm font-bold text-[#0B162C]">
                      {confirmed.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#475569]">عدد المعتمرين</p>
                    <p className="mt-1 tabular-nums text-sm font-bold text-[#0B162C]">
                      {confirmed.pilgrimsCount} أشخاص
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#475569]">نوع الغرفة</p>
                    <p className="mt-1 text-sm font-bold text-[#0B162C]">
                      {confirmed.roomType}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={buildBookingWhatsAppUrl({
                      id: confirmed.id,
                      fullName: confirmed.fullName,
                      phone: confirmed.phone,
                      email: confirmed.email,
                      pilgrimsCount: confirmed.pilgrimsCount,
                      roomType: confirmed.roomType,
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
                      أدخل اسمك ورقم هاتفك وبريدك الإلكتروني وسيقوم فريقنا بالاتصال
                      بك لتأكيد الحجز.
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
                      htmlFor="pilgrims-count"
                      className="block text-sm font-semibold text-[#0B162C]"
                    >
                      عدد المعتمرين
                    </label>
                    <select
                      id="pilgrims-count"
                      value={pilgrimsCount}
                      onChange={(e) => setPilgrimsCount(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-sm font-semibold text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'معتمر' : n === 2 ? 'معتمران' : 'معتمرين'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="room-type"
                      className="block text-sm font-semibold text-[#0B162C]"
                    >
                      نوع الإقامة في فندق ميسان الملتزم
                    </label>
                    <select
                      id="room-type"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-4 py-2.5 text-sm font-semibold text-[#0B162C] focus:border-[#C8922A] focus:outline-none"
                    >
                      <option value="غرفة ثنائية">غرفة ثنائية</option>
                      <option value="غرفة ثلاثية">غرفة ثلاثية</option>
                      <option value="غرفة رباعية عائلية">غرفة رباعية عائلية</option>
                    </select>
                  </div>
                </div>

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
                    <p className="text-xs text-[#475569]">التكلفة التقديرية الإجمالية</p>
                    <p className="tabular-nums text-xl font-extrabold text-[#0B162C]">
                      {estimatedTotal.toLocaleString('en-US')} د.ت
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
