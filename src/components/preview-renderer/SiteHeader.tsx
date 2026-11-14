import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type {
  BrandIdentity,
  CreatorLanguage,
  PageHeaderConfig,
} from '../../types/creator';
import { WhatsAppIcon } from '../WhatsAppIcon';

interface SiteHeaderProps {
  header: PageHeaderConfig;
  brandIdentity: BrandIdentity;
  language: CreatorLanguage;
  selected?: boolean;
  interactiveEdit?: boolean;
  onSelect?: () => void;
}

function buildWaHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (!digits) return '#';
  const normalized =
    digits.length === 8 && !digits.startsWith('216') ? `216${digits}` : digits;
  return `https://wa.me/${normalized.replace(/^\+/, '')}`;
}

export function BrandLogoMark({
  brandIdentity,
  darkBg = false,
  compact = false,
}: {
  brandIdentity: BrandIdentity;
  darkBg?: boolean;
  compact?: boolean;
}) {
  if (brandIdentity.logoSrc) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${
          darkBg ? 'rounded-lg bg-white px-2 py-1 shadow-2xs' : ''
        }`}
      >
        <img
          src={brandIdentity.logoSrc}
          alt={brandIdentity.brandName}
          className={`${compact ? 'h-7' : 'h-8'} w-auto max-w-[140px] object-contain`}
        />
      </div>
    );
  }

  // Stylized provisional typographic monogram (never an invented graphic icon)
  const initials = brandIdentity.brandName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'E2';

  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-extrabold text-xs tracking-tight border"
      style={{
        backgroundColor: darkBg
          ? brandIdentity.accentColor
          : brandIdentity.primaryColor,
        color: darkBg ? brandIdentity.primaryColor : '#FFFFFF',
        borderColor: darkBg
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(16,45,69,0.12)',
        fontFamily: `"${brandIdentity.headingFont}", sans-serif`,
      }}
    >
      {initials}
    </span>
  );
}

export function SiteHeader({
  header,
  brandIdentity,
  language,
  selected = false,
  interactiveEdit = false,
  onSelect,
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAr = language === 'ar';

  if (!header.enabled) return null;

  const variant = header.variant;
  const hasWhatsapp =
    header.showWhatsapp && Boolean(header.whatsappNumber.trim());

  const isDarkHeader = variant === 'premium';
  const isHotelier = variant === 'hotelier';
  const isMinimaliste = variant === 'minimaliste';
  const isTouristique = variant === 'touristique';

  const headerStyle: React.CSSProperties =
    variant === 'premium'
      ? {
          backgroundColor: brandIdentity.primaryColor,
          color: '#FFFFFF',
          borderBottom: `1px solid ${brandIdentity.accentColor}40`,
        }
      : variant === 'hotelier'
        ? {
            backgroundColor: '#FCFAF6',
            color: brandIdentity.primaryColor,
            borderBottom: `1px solid ${brandIdentity.accentColor}55`,
          }
        : variant === 'touristique'
          ? {
              backgroundColor: '#FFFFFF',
              color: brandIdentity.primaryColor,
              borderBottom: `2px solid ${brandIdentity.accentColor}`,
            }
          : variant === 'minimaliste'
            ? {
                backgroundColor: brandIdentity.surfaceColor || '#FFFFFF',
                color: brandIdentity.textColor,
                borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
              }
            : {
                // corporate
                backgroundColor: '#FFFFFF',
                color: brandIdentity.primaryColor,
                borderTop: `3px solid ${brandIdentity.primaryColor}`,
                borderBottom: '1px solid rgba(16, 45, 69, 0.12)',
              };

  const buttonRadiusClass =
    brandIdentity.cardShape === 'sharp'
      ? 'rounded-none'
      : brandIdentity.cardShape === 'rounded'
        ? 'rounded-full'
        : 'rounded-lg';

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: string
  ) => {
    if (interactiveEdit) {
      e.preventDefault();
      return;
    }
    if (target.startsWith('#')) {
      const id = target.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileOpen(false);
      }
    }
  };

  return (
    <header
      id="top"
      onClick={
        interactiveEdit
          ? (e) => {
              e.stopPropagation();
              onSelect?.();
            }
          : undefined
      }
      style={headerStyle}
      className={`${
        header.sticky ? 'sticky top-0 z-30' : 'relative z-20'
      } transition-all ${
        interactiveEdit
          ? `cursor-pointer group ${
              selected
                ? 'ring-2 ring-inset ring-[#E7B34C]'
                : 'hover:ring-1 hover:ring-inset hover:ring-[#1C4967]/40'
            }`
          : ''
      }`}
    >
      {interactiveEdit && (
        <div
          className={`pointer-events-none absolute top-1.5 z-40 ${
            isAr ? 'left-3' : 'right-3'
          } rounded bg-[#102D45]/90 px-2 py-0.5 text-[10px] font-semibold text-white transition-opacity ${
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          Header · {variant}
        </div>
      )}

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        {/* Brand Block */}
        <a
          href="#top"
          onClick={(e) => {
            if (interactiveEdit) {
              e.preventDefault();
            }
          }}
          className="flex items-center gap-2.5 min-w-0 shrink-0"
        >
          {header.showLogo && (
            <BrandLogoMark
              brandIdentity={brandIdentity}
              darkBg={isDarkHeader}
            />
          )}
          {header.showBrandName && (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm md:text-base font-extrabold tracking-tight truncate ${
                    isHotelier ? 'tracking-wide' : ''
                  }`}
                  style={{
                    fontFamily: `"${brandIdentity.headingFont}", sans-serif`,
                  }}
                >
                  {brandIdentity.brandName}
                </span>
                {interactiveEdit && brandIdentity.isProvisionalLogo && (
                  <span
                    className={`hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      isDarkHeader
                        ? 'bg-white/15 text-[#E7B34C]'
                        : 'bg-[#E7B34C]/20 text-[#102D45]'
                    }`}
                  >
                    Logo provisoire
                  </span>
                )}
              </div>
              {brandIdentity.tagline && !isMinimaliste && (
                <p className="hidden xl:block text-[10px] opacity-75 truncate">
                  {brandIdentity.tagline}
                </p>
              )}
            </div>
          )}
        </a>

        {/* Desktop Nav */}
        <nav
          aria-label="Navigation principale"
          className={`hidden lg:flex items-center ${
            isTouristique ? 'gap-5' : isMinimaliste ? 'gap-7' : 'gap-6'
          }`}
        >
          {header.navLinks.map((link) => (
            <a
              key={link.id}
              href={link.target}
              onClick={(e) => handleAnchorClick(e, link.target)}
              className={`text-xs font-semibold transition-opacity hover:opacity-75 whitespace-nowrap ${
                variant === 'corporate' ? 'uppercase tracking-wider text-[11px]' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions + Mobile Hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          {hasWhatsapp && (
            <a
              href={buildWaHref(header.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (interactiveEdit) e.preventDefault();
                e.stopPropagation();
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 ${buttonRadiusClass} px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                isDarkHeader
                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              <span>{header.whatsappLabel || 'WhatsApp'}</span>
            </a>
          )}

          {header.ctaLabel && (
            <a
              href={header.ctaTarget || '#form-block'}
              onClick={(e) => handleAnchorClick(e, header.ctaTarget || '#form-block')}
              style={{
                backgroundColor: isMinimaliste
                  ? 'transparent'
                  : brandIdentity.ctaColor,
                color: isMinimaliste
                  ? brandIdentity.primaryColor
                  : brandIdentity.ctaTextColor,
                border: isMinimaliste
                  ? `1px solid ${brandIdentity.primaryColor}`
                  : 'none',
              }}
              className={`hidden sm:inline-flex items-center justify-center ${buttonRadiusClass} px-4 py-2 text-xs font-bold transition-transform hover:scale-[1.01] whitespace-nowrap shrink-0`}
            >
              {header.ctaLabel}
            </a>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen((v) => !v);
            }}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-current/20 p-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-current/15 px-5 py-4 space-y-3"
          style={{
            backgroundColor: isDarkHeader
              ? brandIdentity.primaryColor
              : '#FFFFFF',
          }}
        >
          <div className="flex flex-col space-y-2">
            {header.navLinks.map((link) => (
              <a
                key={link.id}
                href={link.target}
                onClick={(e) => handleAnchorClick(e, link.target)}
                className="rounded-lg px-2 py-1.5 text-sm font-semibold hover:bg-current/5"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-current/10">
            {hasWhatsapp && (
              <a
                href={buildWaHref(header.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => interactiveEdit && e.preventDefault()}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 ${buttonRadiusClass} bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white whitespace-nowrap`}
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>{header.whatsappLabel || 'WhatsApp'}</span>
              </a>
            )}
            {header.ctaLabel && (
              <a
                href={header.ctaTarget || '#form-block'}
                onClick={(e) =>
                  handleAnchorClick(e, header.ctaTarget || '#form-block')
                }
                style={{
                  backgroundColor: brandIdentity.ctaColor,
                  color: brandIdentity.ctaTextColor,
                }}
                className={`inline-flex flex-1 items-center justify-center ${buttonRadiusClass} px-4 py-2.5 text-xs font-bold whitespace-nowrap`}
              >
                {header.ctaLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
