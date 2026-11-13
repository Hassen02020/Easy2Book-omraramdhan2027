import { useState } from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  pilgrimName: string;
  cityAndContext: string;
  tripLabel: string;
  category: 'family' | 'guidance' | 'stay';
  rating: number;
  headline: string;
  quote: string;
  outcomeMetric: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    pilgrimName: 'عبد الرزاق بن سالم وعائلته',
    cityAndContext: 'تونس العاصمة · حجز عائلي (4 أشخاص)',
    tripLabel: 'عمرة رمضان · غرفة رباعية',
    category: 'family',
    rating: 5,
    headline: 'من مطار تونس قرطاج حتى باب الفندق، ما تعبنا في حتى إجراء',
    quote:
      'سافرنا مع الوالدة والأسرة كاملة وكنّا متخوفين من إجراءات التأشيرة والتنقل في مكة. فريق Easy2Book استقبلنا خطوة بخطوة، الإقامة في فندق ميسان الملتزم كانت منظمة وهادئة، وتخفيض العائلات سهّل علينا الحجز من الأول.',
    outcomeMetric: 'إقامة 30 يوماً · فندق ميسان الملتزم',
  },
  {
    id: 't-2',
    pilgrimName: 'سميرة العيادي',
    cityAndContext: 'صفاقس · مسافرة برفقة والدتها',
    tripLabel: 'عمرة رمضان · غرفة ثنائية',
    category: 'guidance',
    rating: 5,
    headline: 'تأطير ديني وإداري قريب منا في كل مناسك العمرة',
    quote:
      'أكثر حاجة طمنتني هي وجود المرشدين المرافقين معنا في الطواف والسعي وكل الزيارات. حتى في أوقات الزحام في رمضان كان التنظيم محكماً والتواصل متواصلاً على مدار اليوم.',
    outcomeMetric: 'مرافقة ميدانية · طيران تونس ⇄ جدة',
  },
  {
    id: 't-3',
    pilgrimName: 'نزار ومريم القاسمي',
    cityAndContext: 'سوسة · رحلة زوجين',
    tripLabel: 'عمرة رمضان · غرفة ثنائية',
    category: 'stay',
    rating: 5,
    headline: 'رحلة المدينة المنورة كانت من أجمل لحظات العمر بدون أي ضغط',
    quote:
      'البرنامج كان واضحاً من يوم الحجز في تونس: مواعيد الطيران مضبوطة، الغرف مطابقة تماماً للوصف، وزيارة المسجد النبوي والروضة الشريفة مرتبة بأعلى درجات السكينة والالتزام.',
    outcomeMetric: 'مكة المكرمة + المدينة المنورة',
  },
  {
    id: 't-4',
    pilgrimName: 'لطفي الحمروني',
    cityAndContext: 'نابل · مجموعة عائلية (6 أشخاص)',
    tripLabel: 'عمرة رمضان · غرفتان ثلاثيتان',
    category: 'family',
    rating: 5,
    headline: 'شفافية كاملة في الأسعار ومرافقة محترفة قبل السفر وأثناءه',
    quote:
      'تعاملنا مع Easy2Book كان مباشراً وواضحاً من أول اتصال على الرقم 98 140 514. استلمنا التأشيرات وتذاكر تونس – جدة – تونس في الموعد المحدد دون أي مفاجآت أو مصاريف إضافية.',
    outcomeMetric: '6 معتمرين · التزام تام بالمواعيد',
  },
];

type FilterCategory = 'all' | 'family' | 'guidance' | 'stay';

const FILTER_OPTIONS: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'جميع الشهادات' },
  { id: 'family', label: 'تجارب العائلات' },
  { id: 'guidance', label: 'التأطير والمرافقة' },
  { id: 'stay', label: 'الإقامة والمدينة' },
];

export function TestimonialsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const visibleTestimonials =
    activeFilter === 'all'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((item) => item.category === activeFilter);

  return (
    <section
      id="testimonials"
      className="border-t border-[#0B162C]/10 bg-white py-20"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#C8922A]">
              شهادات العملاء السابقين · تجارب موثقة من تونس
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0B162C]">
              ثقة المعتمرين الذين سافروا مع Easy2Book
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#475569]">
              آراء حقيقية لعائلات ومعتمرين رافقناهم من مطار تونس قرطاج إلى مكة
              المكرمة والمدينة المنورة خلال مواسم العمرة السابقة.
            </p>
          </div>

          <div className="flex items-center gap-6 border-r border-[#0B162C]/10 pr-6">
            <div>
              <p className="font-mono-tabular text-3xl font-extrabold text-[#0B162C]">
                4.9 / 5
              </p>
              <p className="mt-0.5 text-xs font-medium text-[#475569]">
                متوسط تقييم المعتمرين
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-3xl font-extrabold text-[#C8922A]">
                98%
              </p>
              <p className="mt-0.5 text-xs font-medium text-[#475569]">
                نسبة الرضا عن التأطير
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Category Filter Controls */}
        <div
          className="mt-8 flex flex-wrap items-center gap-1.5 rounded-lg bg-[#FAF9F6] p-1.5 border border-[#0B162C]/10 w-fit"
          role="tablist"
          aria-label="تصفية شهادات المعتمرين"
        >
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(option.id)}
                className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#0B162C] text-white'
                    : 'text-[#475569] hover:text-[#0B162C]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {visibleTestimonials.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-[#0B162C]/10 bg-[#FAF9F6] p-7 transition-colors hover:border-[#C8922A]/45"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-1 text-[#C8922A]"
                    aria-label={`تقييم ${item.rating} من 5`}
                  >
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-4 w-4 fill-[#C8922A] text-[#C8922A]"
                        aria-hidden="true"
                      />
                    ))}
                    <span className="mr-1.5 font-mono-tabular text-xs font-bold text-[#0B162C]">
                      {item.rating}.0
                    </span>
                  </div>

                  <Quote
                    className="h-5 w-5 text-[#0B162C]/20 shrink-0"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-4 text-lg font-bold leading-snug text-[#0B162C]">
                  «{item.headline}»
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  {item.quote}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#0B162C]/10 pt-4">
                <div>
                  <p className="text-sm font-bold text-[#0B162C]">
                    {item.pilgrimName}
                  </p>
                  <p className="mt-0.5 text-xs text-[#475569]">
                    {item.cityAndContext}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-xs font-semibold text-[#C8922A]">
                    {item.tripLabel}
                  </p>
                  <p className="mt-0.5 text-xs text-[#475569]">
                    {item.outcomeMetric}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
