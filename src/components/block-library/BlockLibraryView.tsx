import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { BLOCK_CATALOG } from './blockCatalog';
import type { BlockCategory, BlockType, CreatorLanguage, Page } from '../../types/creator';

interface BlockLibraryViewProps {
  language: CreatorLanguage;
  pages: Page[];
  activeEditorPageId: string | null;
  onAddBlockToPage: (pageId: string, blockType: BlockType) => void;
}

const CATEGORY_LABELS: Record<BlockCategory | 'all', string> = {
  all: 'Tous les blocs (44)',
  common: 'Blocs communs (15)',
  omra: 'Blocs Omra (8)',
  voyages: 'Blocs Voyages (7)',
  hotels_tunisie: 'Blocs Hôtels (7)',
  visa: 'Blocs Visa (7)',
};

export function BlockLibraryView({
  language,
  pages,
  activeEditorPageId,
  onAddBlockToPage,
}: BlockLibraryViewProps) {
  const [category, setCategory] = useState<BlockCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [targetPageId, setTargetPageId] = useState<string>(
    activeEditorPageId ?? pages[0]?.id ?? ''
  );

  const filtered = BLOCK_CATALOG.filter((b) => {
    if (category !== 'all' && b.category !== category) return false;
    if (query.trim()) {
      const hay = `${b.labels[language]} ${b.description[language]} ${b.type}`.toLowerCase();
      if (!hay.includes(query.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#102D45]">
            Bibliothèque modulaire de blocs ({BLOCK_CATALOG.length})
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Blocs communs et blocs spécialisés Omra, Voyages, Hôtels Tunisie et Visa.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#102D45]/12 bg-white px-3 py-2">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
            Ajouter vers :
          </span>
          <select
            value={targetPageId}
            onChange={(e) => setTargetPageId(e.target.value)}
            className="text-xs font-bold text-[#102D45] bg-transparent focus:outline-none max-w-[240px]"
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#102D45]/10 bg-white p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'common', 'omra', 'voyages', 'hotels_tunisie', 'visa'] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  category === cat
                    ? 'bg-[#102D45] text-white'
                    : 'bg-[#F5F7FA] text-[#1C4967] hover:text-[#102D45]'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            )
          )}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrer un bloc..."
            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] py-1.5 pl-8 pr-3 text-xs text-[#102D45]"
          />
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((entry) => (
          <div
            key={entry.type}
            className="flex flex-col justify-between rounded-2xl border border-[#102D45]/10 bg-white p-5 transition-colors hover:border-[#E7B34C]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded bg-[#F5F7FA] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#1C4967]">
                  {entry.category}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {entry.type}
                </span>
              </div>
              <h2 className="mt-2.5 text-sm font-bold text-[#102D45]">
                {entry.labels[language]}
              </h2>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {entry.description[language]}
              </p>
            </div>

            <button
              type="button"
              disabled={!targetPageId}
              onClick={() => targetPageId && onAddBlockToPage(targetPageId, entry.type)}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] py-2 text-xs font-bold text-[#102D45] transition-colors hover:bg-[#102D45] hover:text-white disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Insérer dans la page sélectionnée
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
