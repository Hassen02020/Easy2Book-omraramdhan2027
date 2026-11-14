import type { CrmIntegrationConfig } from '../../integration-contracts/crmAdapter';
import { createDefaultBrandIdentity } from '../../lib/commerceModulesCatalog';
import type { Page, PageVersionSnapshot } from '../../types/creator';
import { OmraRamadanPilotPage } from '../pilot/OmraRamadanPilotPage';
import { BlockRenderer } from './BlockRenderer';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

interface PagePreviewCanvasProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  viewport: PreviewViewport;
  crmConfig: CrmIntegrationConfig;
  selectedBlockId?: string | null;
  selectedZone?: 'identity' | 'header' | 'footer' | null;
  interactiveEdit?: boolean;
  forcePilotRender?: boolean;
  onSelectBlock?: (blockId: string) => void;
  onSelectPageZone?: (zone: 'identity' | 'header' | 'footer') => void;
}

export function PagePreviewCanvas({
  page,
  snapshot,
  viewport,
  crmConfig,
  selectedBlockId,
  selectedZone = null,
  interactiveEdit = false,
  forcePilotRender,
  onSelectBlock,
  onSelectPageZone,
}: PagePreviewCanvasProps) {
  const isAr = snapshot.language === 'ar';

  const frameWidthClass =
    viewport === 'mobile'
      ? 'max-w-[390px]'
      : viewport === 'tablet'
        ? 'max-w-[768px]'
        : 'w-full';

  const shouldRenderFullPilot =
    page.pilotRenderer === 'omra_ramadan_2027' &&
    (forcePilotRender ?? !interactiveEdit);

  if (shouldRenderFullPilot) {
    return (
      <div
        className={`mx-auto ${frameWidthClass} overflow-hidden rounded-2xl border border-[#102D45]/12 bg-white shadow-[0_18px_48px_-12px_rgba(16,45,69,0.16)] transition-all duration-300`}
      >
        <OmraRamadanPilotPage
          page={page}
          snapshot={snapshot}
          crmConfig={crmConfig}
        />
      </div>
    );
  }

  const brandIdentity =
    snapshot.brandIdentity ??
    page.brandIdentity ??
    createDefaultBrandIdentity({ brandName: 'Easy2Book' });
  const headerConfig = snapshot.header ?? page.header;
  const footerConfig = snapshot.footer ?? page.footer;

  const hasFirstClassFooter = Boolean(footerConfig?.enabled);

  const visibleBlocks = snapshot.blocks.filter((b) => {
    if (!b.visible) return false;
    if (hasFirstClassFooter && b.type === 'footer') return false;
    if (viewport === 'desktop') return b.visibility.desktop;
    if (viewport === 'tablet') return b.visibility.tablet;
    return b.visibility.mobile;
  });

  const canvasStyle = {
    '--brand-primary': brandIdentity.primaryColor,
    '--brand-secondary': brandIdentity.secondaryColor,
    '--brand-accent': brandIdentity.accentColor,
    '--brand-cta': brandIdentity.ctaColor,
    '--brand-cta-text': brandIdentity.ctaTextColor,
    '--brand-surface': brandIdentity.surfaceColor,
    '--brand-text': brandIdentity.textColor,
    fontFamily: isAr
      ? '"Cairo", sans-serif'
      : `"${brandIdentity.bodyFont}", "Inter", sans-serif`,
    backgroundColor: brandIdentity.surfaceColor || '#FFFFFF',
    color: brandIdentity.textColor || '#102D45',
  } as React.CSSProperties;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={canvasStyle}
      className={`mx-auto ${frameWidthClass} ${
        isAr ? 'font-arabic' : ''
      } overflow-hidden rounded-2xl border border-[#102D45]/12 shadow-[0_18px_48px_-12px_rgba(16,45,69,0.16)] transition-all duration-300`}
    >
      {headerConfig?.enabled && (
        <SiteHeader
          header={headerConfig}
          brandIdentity={brandIdentity}
          language={snapshot.language}
          selected={selectedZone === 'header'}
          interactiveEdit={interactiveEdit}
          onSelect={() => onSelectPageZone?.('header')}
        />
      )}

      {visibleBlocks.length === 0 ? (
        <div className="p-16 text-center text-sm text-slate-500">
          Aucun bloc visible pour le format{' '}
          <span className="font-semibold text-[#102D45]">{viewport}</span>.
          Ajoutez un bloc ou modifiez sa visibilité responsive.
        </div>
      ) : (
        visibleBlocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            pageId={page.id}
            universe={page.universe}
            language={snapshot.language}
            form={snapshot.form}
            offerRef={snapshot.offerRef}
            attribution={snapshot.attribution}
            crmConfig={crmConfig}
            brandIdentity={brandIdentity}
            selected={selectedZone === null && selectedBlockId === block.id}
            interactiveEdit={interactiveEdit}
            onSelectBlock={onSelectBlock}
          />
        ))
      )}

      {footerConfig?.enabled && (
        <SiteFooter
          footer={footerConfig}
          brandIdentity={brandIdentity}
          language={snapshot.language}
          selected={selectedZone === 'footer'}
          interactiveEdit={interactiveEdit}
          onSelect={() => onSelectPageZone?.('footer')}
        />
      )}
    </div>
  );
}
