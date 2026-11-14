import { History, RotateCcw } from 'lucide-react';
import type { PageVersion } from '../../types/creator';

interface VersionHistoryPanelProps {
  versions: PageVersion[];
  onRestoreVersion: (versionId: string) => void;
}

export function VersionHistoryPanel({
  versions,
  onRestoreVersion,
}: VersionHistoryPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102D45]">
          <History className="h-3.5 w-3.5 text-[#1C4967]" />
          Historique des versions ({versions.length})
        </span>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {versions.map((ver, idx) => (
          <div
            key={ver.versionId}
            className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono-tabular text-xs font-bold text-[#102D45]">
                  v{ver.versionNumber}
                </span>
                {ver.isPublishedSnapshot && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Publiée
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {ver.createdAt.slice(0, 16).replace('T', ' ')}
              </span>
            </div>

            <p className="text-[11px] font-medium text-[#102D45]">
              {ver.note}
            </p>
            <p className="text-[10px] text-slate-500">
              {ver.createdBy} · {ver.snapshot.blocks.length} blocs
            </p>

            {idx > 0 && (
              <button
                type="button"
                onClick={() => onRestoreVersion(ver.versionId)}
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1 text-[11px] font-bold text-[#1C4967] hover:bg-[#102D45] hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                Restaurer cette version
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
