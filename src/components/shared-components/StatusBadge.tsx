import { STUDIO_I18N } from '../../lib/i18n';
import type { BusinessUniverse, CreatorLanguage, PageStatus } from '../../types/creator';

const STATUS_STYLE_MAP: Record<PageStatus, { dot: string; text: string; bg: string }> = {
  published: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-800',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  draft: {
    dot: 'bg-slate-400',
    text: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200',
  },
  in_review: {
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    bg: 'bg-amber-50 border-amber-200',
  },
  scheduled: {
    dot: 'bg-sky-500',
    text: 'text-sky-800',
    bg: 'bg-sky-50 border-sky-200',
  },
  expired: {
    dot: 'bg-rose-500',
    text: 'text-rose-800',
    bg: 'bg-rose-50 border-rose-200',
  },
  archived: {
    dot: 'bg-zinc-400',
    text: 'text-zinc-600',
    bg: 'bg-zinc-100 border-zinc-200',
  },
};

export function StatusBadge({
  status,
  language,
}: {
  status: PageStatus;
  language: CreatorLanguage;
}) {
  const style = STATUS_STYLE_MAP[status];
  const label = STUDIO_I18N[language].statuses[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap shrink-0 ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

const UNIVERSE_COLORS: Record<BusinessUniverse, string> = {
  omra: 'text-[#102D45] border-[#E7B34C]/50 bg-[#E7B34C]/12',
  voyages: 'text-[#1C4967] border-[#1C4967]/25 bg-[#1C4967]/8',
  hotels_tunisie: 'text-teal-900 border-teal-700/20 bg-teal-50',
  visa: 'text-indigo-950 border-indigo-700/20 bg-indigo-50',
};

export function UniverseTag({
  universe,
  language,
}: {
  universe: BusinessUniverse;
  language: CreatorLanguage;
}) {
  const label = STUDIO_I18N[language].universes[universe].label;
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap shrink-0 ${UNIVERSE_COLORS[universe]}`}
    >
      {label}
    </span>
  );
}
