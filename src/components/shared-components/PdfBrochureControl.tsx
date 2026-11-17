import { useCallback, useEffect, useRef, useState } from 'react';
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
  /** 'pilot_inline' for RTL hero controls, 'pilot_header' for compact sticky bar, 'toolbar' for Studio bar */
  variant?: 'pilot_inline' | 'pilot_header' | 'toolbar';
  locale?: 'ar' | 'fr';
  rootSelector?: string;
  revisionKey?: string;
  autoDownload?: boolean;
  autoTrigger?: boolean;
  onAutoTriggered?: () => void;
}

export function PdfBrochureControl({
  pageTitle,
  slug,
  variant = 'toolbar',
  locale,
  rootSelector = '[data-brochure-root="true"]',
  revisionKey,
  autoDownload = true,
  autoTrigger = false,
  onAutoTriggered,
}: PdfBrochureControlProps) {
  const isFrLocale = locale === 'fr' || (!locale && variant === 'toolbar');
  const [exporting, setExporting] = useState(false);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<PdfBrochureResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const autoTriggeredRef = useRef(false);

  useEffect(() => {
    setResult((prev) => {
      if (prev?.blobUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(prev.blobUrl);
      }
      return null;
    });
  }, [pageTitle, slug, revisionKey]);

  useEffect(() => {
    return () => {
      if (result?.blobUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(result.blobUrl);
      }
    };
  }, [result]);

  const handleGeneratePdf = useCallback(async () => {
    if (exporting) return;
    setError(null);
    setCopied(false);
    setExporting(true);
    setPanelOpen(true);
    setPct(6);
    setStatus(
      isFrLocale
        ? 'Préparation de la page en PDF...'
        : 'جاري تجهيز الصفحة بصيغة PDF...'
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
      if (autoDownload) {
        triggerPdfBlobDownload(pdfRes);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isFrLocale
            ? 'Impossible de générer le fichier PDF.'
            : 'تعذّر إنشاء ملف PDF حالياً.'
      );
    } finally {
      setExporting(false);
    }
  }, [autoDownload, exporting, isFrLocale, pageTitle, result, rootSelector, slug]);

  useEffect(() => {
    if (!autoTrigger) {
      autoTriggeredRef.current = false;
      return;
    }
    if (autoTriggeredRef.current) return;
    autoTriggeredRef.current = true;
    const timer = window.setTimeout(() => {
      void handleGeneratePdf();
      onAutoTriggered?.();
    }, 280);
    return () => window.clearTimeout(timer);
  }, [autoTrigger, handleGeneratePdf, onAutoTriggered]);

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

  if (variant === 'pilot_header') {
    return (
      <>
        <button
          type="button"
          data-pdf-exclude="true"
          disabled={exporting}
          onClick={() => void handleGeneratePdf()}
          title={
            isFrLocale
              ? 'Télécharger toute la page en PDF'
              : 'تحميل الصفحة كاملة بصيغة PDF'
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B162C]/15 bg-[#FAF9F6] px-3 py-2 text-xs font-bold text-[#0B162C] hover:border-[#C8922A] hover:bg-[#FBF9F4] disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          {exporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8922A]" />
          ) : (
            <FileDown className="h-3.5 w-3.5 text-[#C8922A]" />
          )}
          <span>
            {exporting ? `PDF ${pct}%` : isFrLocale ? 'Brochure PDF' : 'تحميل PDF'}
          </span>
        </button>

        {panelOpen && (exporting || error || result) && (
          <div
            dir={isFrLocale ? 'ltr' : 'rtl'}
            data-pdf-exclude="true"
            className={`fixed bottom-5 ${
              isFrLocale ? 'right-5 text-left' : 'left-5 text-right'
            } z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#102D45]/15 bg-white p-4 shadow-2xl`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#102D45]/10 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#102D45]">
                <FileText className="h-4 w-4 text-[#C8922A]" />
                <span>
                  {isFrLocale
                    ? 'Export Brochure Page (PDF A4)'
                    : 'تصدير الصفحة كاملة (PDF A4)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="إغلاق"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-[#102D45]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {exporting && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#1C4967]">
                  <span className="truncate">{status}</span>
                  <span className="font-mono-tabular" dir="ltr">
                    {pct}%
                  </span>
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
                    {isFrLocale ? 'PDF généré et téléchargé' : 'تم تجهيز وتحميل PDF'}
                  </span>
                  <span
                    className="font-mono-tabular text-[11px] font-semibold text-slate-600"
                    dir="ltr"
                  >
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
                    {isFrLocale ? 'Télécharger PDF' : 'إعادة التحميل (PDF)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCopyLink()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-bold text-[#102D45] hover:bg-slate-100"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        {isFrLocale ? 'Copié' : 'تم النسخ'}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        {isFrLocale ? 'Copier lien' : 'نسخ الرابط'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  if (variant === 'pilot_inline') {
    return (
      <>
        <button
          type="button"
          disabled={exporting}
          onClick={() => void handleGeneratePdf()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B162C]/20 bg-[#F5F7FA] px-4 py-3 text-xs font-bold text-[#0B162C] shadow-xs hover:bg-[#E7B34C]/20 hover:border-[#C8922A] disabled:opacity-60 whitespace-nowrap"
        >
          {exporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8922A]" />
          ) : (
            <FileDown className="h-3.5 w-3.5 text-[#C8922A]" />
          )}
          <span>
            {exporting
              ? `جاري تحضير الصفحة PDF (${pct}%)`
              : 'تحميل الصفحة كـ PDF'}
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
                <span>تم تجهيز وتحميل الصفحة بصيغة PDF A4</span>
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
                تحميل الصفحة الآن (PDF)
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
                    نسخ رابط PDF
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
                aria-label="رابط تحميل الصفحة PDF"
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
            triggerPdfBlobDownload(result);
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
        <span>{exporting ? `PDF ${pct}%` : 'Télécharger PDF'}</span>
      </button>

      {panelOpen && (exporting || error || result) && (
        <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#102D45]/15 bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-2 border-b border-[#102D45]/10 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#102D45]">
              <FileText className="h-4 w-4 text-[#C8922A]" />
              <span>Téléchargement Page PDF (A4)</span>
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
                  PDF généré et téléchargé
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
                aria-label="Lien de téléchargement Page PDF"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
