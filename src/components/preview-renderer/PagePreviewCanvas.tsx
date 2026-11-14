import type { CrmIntegrationConfig } from '../../integration-contracts/crmAdapter';
import type { Page, PageVersionSnapshot } from '../../types/creator';
import { OmraRamadanPilotPage } from '../pilot/OmraRamadanPilotPage';
import { BlockRenderer } from './BlockRenderer';

export type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

interface PagePreviewCanvasProps {
  page: Page;
  snapshot: PageVersionSnapshot;
  viewport: PreviewViewport;
  crmConfig: CrmIntegrationConfig;
  selectedBlockId?: string | null;
  interactiveEdit?: boolean;
  forcePilotRender?: boolean;
  onSelectBlock?: (blockId: string) => void;
}

export function PagePreviewCanvas({
  page,
  snapshot,
  viewport,
  crmConfig,
  selectedBlockId,
  interactiveEdit = false,
  forcePilotRender,
  onSelectBlock,
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

  const visibleBlocks = snapshot.blocks.filter((b) => {
    if (!b.visible) return false;
    if (viewport === 'desktop') return b.visibility.desktop;
    if (viewport === 'tablet') return b.visibility.tablet;
    return b.visibility.mobile;
  });

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`mx-auto ${frameWidthClass} ${
        isAr ? 'font-arabic' : ''
      } overflow-hidden rounded-2xl border border-[#102D45]/12 bg-white shadow-[0_18px_48px_-12px_rgba(16,45,69,0.16)] transition-all duration-300`}
    >
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
            selected={selectedBlockId === block.id}
            interactiveEdit={interactiveEdit}
            onSelectBlock={onSelectBlock}
          />
        ))
      )}
    </div>
  );
}
