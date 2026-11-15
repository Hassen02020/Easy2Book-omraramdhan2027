import { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileDown,
  FileText,
  Loader2,
  X,
} from 'lucide-react';
import {
  generatePdfBrochureLink,
  triggerPdfBlobDownload,
  type PdfBrochureResult,
} from '../../lib/pdfBrochureExporter';
import { formatFileSize } from '../../lib/reelVideoExporter';

interface PdfBrochureControlProps {
  pageTitle: string;
  slug?: string;
  /** 'pilot_inline' shows Arabic RTL hero button + inline result panel (for Pilot Pages); 'toolbar' shows compact Studio button + clean dropdown panel */
  variant?: 'pilot_inline' | 'toolbar';
  rootSelector?: string;
}

export function PdfBrochureControl({
  pageTitle,
  slug,
  variant = 'toolbar',
  rootSelector = '[data-brochure-root="true"]',
}: PdfBrochureControlProps) {
  const [exporting, setExporting] = useState(false);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<PdfBrochureResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (result?.blobUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(result.blobUrl);
      }
    };
  }, [result]);

  const handleGeneratePdf = async () => {
    if (exporting) return;
    setError(null);
    setCopied(false);
    setExporting(true);
    setPanelOpen(true);
    setPct(6);
    setStatus(
      variant === 'pilot_inline'
        ? 'جاري تجهيز البروشور بصيغة PDF...'
        : 'Préparation de la brochure PDF...'
    );

    if (result?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(result.blobUrl);
    }

    try {
      const rootEl = document.querySelector(rootSelector) as HTMLElement | null;
      const pdfRes = await generatePdfBrochureLink({
        rootElement: rootEl,
        pageTitle,
        slug,
        onProgress: (nextPct, nextLabel) => {
          setPct(nextPct);
          setStatus(nextLabel);
        },
      });
      setResult(pdfRes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : variant === 'pilot_inline'
            ? 'تعذّر إنشاء ملف البروشور PDF حالياً.'
            : 'Impossible de générer la brochure PDF.'
      );
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.downloadUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback handled via readonly input selection
    }
  };

  if (variant === 'pilot_inline') {
    return (
      <>
        <button
          type="button"
          disabled={exporting}
          onClick={() => void handleGeneratePdf()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B162C]/20 bg-[#F5F7FA] px-4 py-3 text-xs font-bold text-[#0B162C] shadow-xs hover:bg-[#E7B34C]/20 hover:border-[#C8922A] disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8922A]" />
          ) : (
            <FileDown className="h-3.5 w-3.5 text-[#C8922A]" />
          )}
          <span>
            {exporting
              ? `جاري تحضير البروشور (${pct}%)`
              : 'تحميل البروشور كـ PDF'}
          </span>
        </button>

        {exporting && (
          <div
            data-pdf-exclude="true"
            className="w-full rounded-xl border border-[#C8922A]/40 bg-[#FAF9F6] p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#0B162C]">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#C8922A]" />
                {status || 'جاري تجهيز ملف البروشور PDF...'}
              </span>
              <span className="font-mono-tabular" dir="ltr">
                {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#0B162C]/10">
              <div
                className="h-full bg-[#C8922A] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p
            data-pdf-exclude="true"
            className="w-full rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800"
          >
            {error}
          </p>
        )}

        {result && !exporting && (
          <div
            data-pdf-exclude="true"
            className="w-full rounded-xl border border-[#102D45]/20 bg-[#F5F7FA] p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#102D45]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>البروشور جاهز للتحميل والطباعة (PDF A4)</span>
              </div>
              <span
                className="font-mono-tabular text-[11px] font-semibold text-[#1C4967]"
                dir="ltr"
              >
                {result.pageCount} pages · {formatFileSize(result.sizeBytes)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => triggerPdfBlobDownload(result)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
              >
                <Download className="h-3.5 w-3.5 text-[#E7B34C]" />
                تحميل البروشور الآن (PDF)
              </button>

              <a
                href={result.blobUrl}
                download={result.fileName}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/20 bg-white px-3.5 py-2.5 text-xs font-bold text-[#102D45] hover:bg-slate-50"
              >
                <FileDown className="h-3.5 w-3.5" />
                حفظ الملف مباشرة
              </a>

              <button
                type="button"
                onClick={() => void handleCopyLink()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/20 bg-white px-3.5 py-2.5 text-xs font-bold text-[#102D45] hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    تم نسخ الرابط
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    نسخ رابط البروشور
                  </>
                )}
              </button>
            </div>

            <div
              className="flex items-center gap-2 rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5"
              dir="ltr"
            >
              <input
                type="text"
                readOnly
                value={result.downloadUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full bg-transparent font-mono text-[11px] text-[#0B162C] outline-none"
                aria-label="رابط تحميل البروشور PDF"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Toolbar variant for Studio Preview & Page Editor
  return (
    <div className="relative">
      <button
        type="button"
        disabled={exporting}
        onClick={() => {
          if (result && !panelOpen) {
            setPanelOpen(true);
            return;
          }
          void handleGeneratePdf();
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#102D45] hover:bg-[#F5F7FA] disabled:opacity-60 whitespace-nowrap shrink-0"
      >
        {exporting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8922A]" />
        ) : (
          <FileDown className="h-3.5 w-3.5 text-[#C8922A]" />
        )}
        <span>{exporting ? `PDF ${pct}%` : 'Brochure PDF'}</span>
      </button>

      {panelOpen && (exporting || error || result) && (
        <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#102D45]/15 bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-2 border-b border-[#102D45]/10 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#102D45]">
              <FileText className="h-4 w-4 text-[#C8922A]" />
              <span>Export Brochure PDF (Format A4)</span>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Fermer"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-[#102D45]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {exporting && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#1C4967]">
                <span className="truncate">{status}</span>
                <span className="font-mono-tabular">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#102D45]/10">
                <div
                  className="h-full bg-[#C8922A] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}

          {result && !exporting && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Brochure prête
                </span>
                <span className="font-mono-tabular text-[11px] font-semibold text-slate-600">
                  {result.pageCount} pages · {formatFileSize(result.sizeBytes)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerPdfBlobDownload(result)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#102D45] px-3 py-2 text-xs font-bold text-white hover:bg-[#1C4967]"
                >
                  <Download className="h-3.5 w-3.5 text-[#E7B34C]" />
                  Télécharger PDF
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-bold text-[#102D45] hover:bg-slate-100"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copier lien
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void handleGeneratePdf()}
                  className="rounded-xl border border-[#102D45]/15 px-2.5 py-2 text-[11px] font-semibold text-[#1C4967] hover:bg-slate-50"
                >
                  Régénérer
                </button>
              </div>

              <input
                type="text"
                readOnly
                value={result.downloadUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-lg border border-[#102D45]/12 bg-[#F5F7FA] px-2.5 py-1.5 font-mono text-[10px] text-[#102D45] outline-none"
                aria-label="Lien de téléchargement Brochure PDF"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
