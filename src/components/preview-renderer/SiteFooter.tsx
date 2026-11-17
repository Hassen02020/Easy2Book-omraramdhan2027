import { Mail, MapPin, Phone } from 'lucide-react';
import type {
  BrandIdentity,
  CreatorLanguage,
  PageFooterConfig,
} from '../../types/creator';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { BrandLogoMark } from './SiteHeader';

interface SiteFooterProps {
  footer: PageFooterConfig;
  brandIdentity: BrandIdentity;
  language: CreatorLanguage;
  selected?: boolean;
  interactiveEdit?: boolean;
  onSelect?: () => void;
}

export function SiteFooter({
  footer,
  brandIdentity,
  language,
  selected = false,
  interactiveEdit = false,
  onSelect,
}: SiteFooterProps) {
  if (!footer.enabled) return null;

  const isAr = language === 'ar';
  const isEn = language === 'en';

  const hasPhone = Boolean(footer.phone.trim());
  const hasWhatsapp = Boolean(footer.whatsapp.trim());
  const hasEmail = Boolean(footer.email.trim());
  const hasAddress = Boolean(footer.address.trim());
  const hasAnyContact = hasPhone || hasWhatsapp || hasEmail || hasAddress;

  const socialEntries = [
    { key: 'Facebook', url: footer.socialLinks.facebook?.trim() },
    { key: 'Instagram', url: footer.socialLinks.instagram?.trim() },
    { key: 'LinkedIn', url: footer.socialLinks.linkedin?.trim() },
    { key: 'YouTube', url: footer.socialLinks.youtube?.trim() },
  ].filter((s): s is { key: string; url: string } => Boolean(s.url));

  const hasTerms = Boolean(footer.legalLinks.termsLabel?.trim());
  const hasPrivacy = Boolean(footer.legalLinks.privacyLabel?.trim());

  const handleAnchor = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: string
  ) => {
    if (interactiveEdit) {
      e.preventDefault();
      return;
    }
    if (target.startsWith('#')) {
      const el = document.getElementById(target.slice(1));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer
      onClick={
        interactiveEdit
          ? (e) => {
              e.stopPropagation();
              onSelect?.();
            }
          : undefined
      }
      style={{
        backgroundColor: brandIdentity.primaryColor,
        color: '#FFFFFF',
      }}
      className={`relative border-t border-white/10 ${
        interactiveEdit
          ? `cursor-pointer group ${
              selected
                ? 'ring-2 ring-inset ring-[#E7B34C]'
                : 'hover:ring-1 hover:ring-inset hover:ring-white/40'
            }`
          : ''
      }`}
    >
      {interactiveEdit && (
        <div
          data-pdf-exclude="true"
          className={`pointer-events-none absolute top-2 z-30 ${
            isAr ? 'left-3' : 'right-3'
          } rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white transition-opacity ${
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          Footer · Coordonnées réelles
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              {footer.showLogo && (
                <BrandLogoMark brandIdentity={brandIdentity} darkBg />
              )}
              <div>
                <p
                  className="text-base font-extrabold"
                  style={{
                    fontFamily: `"${brandIdentity.headingFont}", sans-serif`,
                  }}
                >
                  {brandIdentity.brandName}
                </p>
                {brandIdentity.tagline && (
                  <p className="text-[11px] text-white/70">
                    {brandIdentity.tagline}
                  </p>
                )}
              </div>
            </div>
            {footer.companyDescription && (
              <p className="text-xs leading-relaxed text-white/80 max-w-md">
                {footer.companyDescription}
              </p>
            )}
            {socialEntries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {socialEntries.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => interactiveEdit && e.preventDefault()}
                    className="rounded-lg border border-white/15 bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/15"
                  >
                    {s.key}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-2.5">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: brandIdentity.accentColor }}
            >
              {isAr ? 'روابط سريعة' : isEn ? 'Navigation' : 'Navigation'}
            </p>
            <ul className="space-y-2 text-xs text-white/80">
              {footer.navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.target}
                    onClick={(e) => handleAnchor(e, link.target)}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Real Verified Contacts */}
          <div className="md:col-span-4 space-y-2.5">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: brandIdentity.accentColor }}
            >
              {isAr ? 'بيانات الاتصال' : isEn ? 'Contact Details' : 'Coordonnées'}
            </p>
            {hasAnyContact ? (
              <ul className="space-y-2 text-xs text-white/85">
                {hasPhone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 opacity-75" />
                    <span dir="ltr" className="font-mono-tabular">
                      {footer.phone}
                    </span>
                  </li>
                )}
                {hasWhatsapp && (
                  <li className="flex items-center gap-2">
                    <WhatsAppIcon className="h-3.5 w-3.5 shrink-0 text-[#25D366]" />
                    <span dir="ltr" className="font-mono-tabular">
                      WhatsApp : {footer.whatsapp}
                    </span>
                  </li>
                )}
                {hasEmail && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 opacity-75" />
                    <span dir="ltr">{footer.email}</span>
                  </li>
                )}
                {hasAddress && (
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-75" />
                    <span>{footer.address}</span>
                  </li>
                )}
              </ul>
            ) : interactiveEdit ? (
              <p className="rounded-lg border border-dashed border-white/25 bg-white/5 p-3 text-[11px] text-white/75">
                Coordonnées non renseignées (masquées en aperçu public).
                Complétez-les dans l’onglet Footer.
              </p>
            ) : (
              <p className="text-xs text-white/70">
                {isAr
                  ? 'يرجى استخدام نموذج الطلب للتواصل المباشر.'
                  : isEn
                    ? 'Use the inquiry form above to reach our advisors.'
                    : 'Utilisez le formulaire de demande ci-dessus pour être recontacté.'}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-5 text-[11px] text-white/70">
          <p>{footer.copyrightText}</p>
          {(hasTerms || hasPrivacy) && (
            <div className="flex items-center gap-4">
              {hasTerms && (
                <a
                  href={footer.legalLinks.termsUrl || '#'}
                  onClick={(e) => interactiveEdit && e.preventDefault()}
                  className="hover:text-white"
                >
                  {footer.legalLinks.termsLabel}
                </a>
              )}
              {hasPrivacy && (
                <a
                  href={footer.legalLinks.privacyUrl || '#'}
                  onClick={(e) => interactiveEdit && e.preventDefault()}
                  className="hover:text-white"
                >
                  {footer.legalLinks.privacyLabel}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
