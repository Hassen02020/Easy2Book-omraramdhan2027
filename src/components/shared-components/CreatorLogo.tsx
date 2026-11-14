interface CreatorLogoProps {
  compact?: boolean;
  dark?: boolean;
  subtitle?: string;
}

export function CreatorLogo({
  compact = false,
  dark = false,
  subtitle = 'Landing Page Studio',
}: CreatorLogoProps) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
          dark
            ? 'border-white/15 bg-white/10'
            : 'border-[#102D45]/10 bg-white shadow-xs'
        } p-1.5`}
      >
        <img
          src="/assets/aistudio/logo_transparent_e9918557.png"
          alt="Easy2Book"
          className="h-full w-full object-contain"
        />
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold tracking-tight whitespace-nowrap ${
                dark ? 'text-white' : 'text-[#102D45]'
              }`}
            >
              Easy<span className="text-[#E7B34C]">2</span>Book
            </span>
          </div>
          <p
            className={`text-[11px] font-medium truncate ${
              dark ? 'text-slate-300' : 'text-[#1C4967]'
            }`}
          >
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}
