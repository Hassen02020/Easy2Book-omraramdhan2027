import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

export interface PdfBrochureResult {
  fileName: string;
  blobUrl: string;
  downloadUrl: string;
  sizeBytes: number;
  pageCount: number;
  blob: Blob;
}

export interface GeneratePdfBrochureOptions {
  rootElement?: HTMLElement | null;
  pageTitle?: string;
  slug?: string;
  onProgress?: (pct: number, statusLabel: string) => void;
}

function buildSafePdfFilename(slug?: string, pageTitle?: string): string {
  const base = (slug || pageTitle || 'Easy2Book-Brochure')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  const safeBase = base || 'Easy2Book-Brochure';
  return safeBase.toLowerCase().startsWith('easy2book')
    ? `${safeBase}-Brochure.pdf`
    : `Easy2Book-${safeBase}-Brochure.pdf`;
}

async function captureSectionCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  const commonOptions = {
    pixelRatio: 1.75,
    backgroundColor: '#FFFFFF',
    cacheBust: false,
    filter: (node: HTMLElement) => {
      if (node instanceof HTMLElement && node.hasAttribute('data-pdf-exclude')) {
        return false;
      }
      return true;
    },
  };

  try {
    return await toCanvas(el, commonOptions);
  } catch {
    // Graceful retry skipping external font embedding if a stylesheet rejects CORS
    return await toCanvas(el, { ...commonOptions, skipFonts: true });
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Impossible de lire le PDF généré.'));
    reader.readAsDataURL(blob);
  });
}

function collectBrochureSections(rootElement: HTMLElement): HTMLElement[] {
  // Check top-level sections inside the preview canvas or pilot wrapper
  const directSections = Array.from(
    rootElement.querySelectorAll<HTMLElement>(
      ':scope > header, :scope > section, :scope > footer, :scope > div > header, :scope > div > section, :scope > div > footer'
    )
  ).filter((el) => {
    if (el.hasAttribute('data-pdf-exclude')) return false;
    const rect = el.getBoundingClientRect();
    return rect.height > 16 && rect.width > 16;
  });

  if (directSections.length > 0) {
    return directSections;
  }
  return [rootElement];
}

export async function generatePdfBrochureLink({
  rootElement,
  pageTitle,
  slug,
  onProgress,
}: GeneratePdfBrochureOptions): Promise<PdfBrochureResult> {
  const targetRoot =
    rootElement ??
    (document.querySelector('[data-brochure-root="true"]') as HTMLElement | null);

  if (!targetRoot) {
    throw new Error('Contenu de la page introuvable pour générer la brochure PDF.');
  }

  onProgress?.(6, 'Préparation de la mise en page brochure A4...');

  if ('fonts' in document) {
    await document.fonts.ready.catch(() => undefined);
  }

  // Temporarily hide PDF-excluded elements & disable sticky headers / motion animations
  const hiddenNodes: { el: HTMLElement; prevDisplay: string }[] = [];
  targetRoot.querySelectorAll<HTMLElement>('[data-pdf-exclude="true"]').forEach((el) => {
    hiddenNodes.push({ el, prevDisplay: el.style.display });
    el.style.display = 'none';
  });

  const stickyHeaders: { el: HTMLElement; prevPos: string }[] = [];
  targetRoot.querySelectorAll<HTMLElement>('header').forEach((hdr) => {
    const computed = window.getComputedStyle(hdr).position;
    if (computed === 'sticky' || computed === 'fixed') {
      stickyHeaders.push({ el: hdr, prevPos: hdr.style.position });
      hdr.style.position = 'static';
    }
  });

  const animatedNodes: { el: HTMLElement; prevAnim: string }[] = [];
  targetRoot.querySelectorAll<HTMLElement>('.reel-motion-active').forEach((node) => {
    animatedNodes.push({ el: node, prevAnim: node.style.animation });
    node.style.animation = 'none';
  });

  const sectionCanvases: HTMLCanvasElement[] = [];

  try {
    const sections = collectBrochureSections(targetRoot);
    for (let i = 0; i < sections.length; i++) {
      const pct = Math.round(10 + ((i + 1) / sections.length) * 58);
      onProgress?.(
        pct,
        `Capture haute définition de la section ${i + 1}/${sections.length}...`
      );
      const canvas = await captureSectionCanvas(sections[i]);
      if (canvas.width > 0 && canvas.height > 0) {
        sectionCanvases.push(canvas);
      }
    }
  } finally {
    hiddenNodes.forEach(({ el, prevDisplay }) => {
      el.style.display = prevDisplay;
    });
    stickyHeaders.forEach(({ el, prevPos }) => {
      el.style.position = prevPos;
    });
    animatedNodes.forEach(({ el, prevAnim }) => {
      el.style.animation = prevAnim;
    });
  }

  if (sectionCanvases.length === 0) {
    throw new Error('Aucune section capturée pour générer le PDF.');
  }

  onProgress?.(74, 'Assemblage de la brochure A4 multi-pages...');

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidthMm = 210;
  const pageHeightMm = 297;
  const marginX = 8;
  const marginTop = 8;
  const footerReserveMm = 12;
  const contentWidthMm = pageWidthMm - marginX * 2; // 194mm
  const usableHeightMm = pageHeightMm - marginTop - footerReserveMm; // 277mm

  let currentY = marginTop;

  for (const canvas of sectionCanvases) {
    const imgHeightMm = (canvas.height / canvas.width) * contentWidthMm;

    if (imgHeightMm <= usableHeightMm) {
      if (currentY > marginTop && currentY + imgHeightMm > marginTop + usableHeightMm) {
        pdf.addPage();
        currentY = marginTop;
      }
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      pdf.addImage(
        imgData,
        'JPEG',
        marginX,
        currentY,
        contentWidthMm,
        imgHeightMm,
        undefined,
        'FAST'
      );
      currentY += imgHeightMm + 3;
    } else {
      // Section taller than one A4 page -> start on fresh page and slice cleanly
      if (currentY > marginTop) {
        pdf.addPage();
        currentY = marginTop;
      }

      const maxSlicePx = Math.floor((usableHeightMm / contentWidthMm) * canvas.width);
      let offsetY = 0;
      let isFirstSlice = true;

      while (offsetY < canvas.height) {
        if (!isFirstSlice) {
          pdf.addPage();
          currentY = marginTop;
        }
        isFirstSlice = false;

        const sliceHeightPx = Math.min(maxSlicePx, canvas.height - offsetY);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeightPx;
        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            offsetY,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx
          );
          const sliceHeightMm = (sliceHeightPx / canvas.width) * contentWidthMm;
          const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.9);
          pdf.addImage(
            sliceData,
            'JPEG',
            marginX,
            currentY,
            contentWidthMm,
            sliceHeightMm,
            undefined,
            'FAST'
          );
          currentY += sliceHeightMm + 3;
        }
        offsetY += sliceHeightPx;
      }
    }
  }

  // Stamp clean Easy2Book Brochure footer on every A4 page
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(230, 234, 240);
    pdf.line(marginX, pageHeightMm - 10, pageWidthMm - marginX, pageHeightMm - 10);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(16, 45, 69);
    pdf.text(
      'Easy2Book · Centrale de Réservation · Tél / WhatsApp : 98 140 514 · www.easy2book.tn',
      marginX,
      pageHeightMm - 5.5
    );
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `Page ${p} / ${totalPages}`,
      pageWidthMm - marginX,
      pageHeightMm - 5.5,
      { align: 'right' }
    );
  }

  const fileName = buildSafePdfFilename(slug, pageTitle);
  const blob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  onProgress?.(90, 'Création du lien de téléchargement PDF...');

  let downloadUrl = blobUrl;
  try {
    const pdfBase64 = await blobToBase64(blob);
    const res = await fetch('/api/brochure/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, fileName }),
    });
    if (res.ok) {
      const data = (await res.json()) as { downloadPath?: string };
      if (data.downloadPath) {
        downloadUrl = new URL(data.downloadPath, window.location.origin).toString();
      }
    }
  } catch {
    // Keep instant client blobUrl if server link upload is unavailable
  }

  onProgress?.(100, 'Brochure PDF prête !');

  return {
    fileName,
    blobUrl,
    downloadUrl,
    sizeBytes: blob.size,
    pageCount: totalPages,
    blob,
  };
}

export function triggerPdfBlobDownload(result: PdfBrochureResult): void {
  const link = document.createElement('a');
  link.href = result.blobUrl;
  link.download = result.fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    document.body.removeChild(link);
  }, 1500);
}
