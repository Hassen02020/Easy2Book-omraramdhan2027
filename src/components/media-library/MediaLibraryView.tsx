import { useState } from 'react';
import { ImagePlus, Tag } from 'lucide-react';
import type { BusinessUniverse, MediaAsset } from '../../types/creator';

interface MediaLibraryViewProps {
  media: MediaAsset[];
  onAddMediaAsset: (asset: MediaAsset) => void;
}

export function MediaLibraryView({ media, onAddMediaAsset }: MediaLibraryViewProps) {
  const [universeFilter, setUniverseFilter] = useState<BusinessUniverse | 'all'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newSrc, setNewSrc] = useState('');
  const [newUniverse, setNewUniverse] = useState<BusinessUniverse | 'all'>('omra');
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = media.filter(
    (m) => universeFilter === 'all' || m.universe === 'all' || m.universe === universeFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#102D45]">
            Médiathèque du Studio ({media.length})
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Visuels officiels Easy2Book disponibles pour vos blocs Hero, Galeries et Cartes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((s) => !s)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
        >
          <ImagePlus className="h-4 w-4 text-[#E7B34C]" />
          Ajouter un média externe
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTitle.trim() || !newSrc.trim()) return;
            onAddMediaAsset({
              id: `media-${Date.now().toString(36)}`,
              title: newTitle.trim(),
              src: newSrc.trim(),
              universe: newUniverse,
              aspectRatio: '16:9',
              tags: ['personnalisé'],
              isDemoAsset: false,
            });
            setNewTitle('');
            setNewSrc('');
            setShowAddForm(false);
          }}
          className="grid gap-3 rounded-2xl border border-[#E7B34C]/60 bg-white p-4 sm:grid-cols-4 items-end"
        >
          <div>
            <label className="block text-[11px] font-bold text-[#102D45] mb-1">
              Titre du visuel
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Plage Sousse"
              className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#102D45] mb-1">
              URL Image
            </label>
            <input
              type="url"
              required
              value={newSrc}
              onChange={(e) => setNewSrc(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#102D45] mb-1">
              Univers
            </label>
            <select
              value={newUniverse}
              onChange={(e) =>
                setNewUniverse(e.target.value as BusinessUniverse | 'all')
              }
              className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs"
            >
              <option value="all">Tous</option>
              <option value="omra">Omra</option>
              <option value="voyages">Voyages</option>
              <option value="hotels_tunisie">Hôtels Tunisie</option>
              <option value="visa">Visa</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#102D45] px-4 py-2 text-xs font-bold text-white"
          >
            Enregistrer dans la médiathèque
          </button>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#102D45]/10 bg-white p-3.5">
        {(['all', 'omra', 'voyages', 'hotels_tunisie', 'visa'] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUniverseFilter(u)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              universeFilter === u
                ? 'bg-[#102D45] text-white'
                : 'bg-[#F5F7FA] text-[#1C4967] hover:text-[#102D45]'
            }`}
          >
            {u === 'all' ? 'Tous les médias' : u}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <article
            key={asset.id}
            className="overflow-hidden rounded-2xl border border-[#102D45]/10 bg-white shadow-2xs"
          >
            <div className="h-44 bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
              <img
                src={asset.src}
                alt={asset.title}
                className={`h-full w-full ${
                  asset.id === 'media-easy2book-logo'
                    ? 'object-contain p-6 bg-white'
                    : 'object-cover'
                }`}
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                <span>{asset.aspectRatio}</span>
                <span>{asset.isDemoAsset ? 'Démo Studio' : 'Ajouté'}</span>
              </div>
              <h2 className="mt-1 text-xs font-bold text-[#102D45]">
                {asset.title}
              </h2>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {asset.tags.map((tg) => (
                  <span
                    key={tg}
                    className="inline-flex items-center gap-1 rounded bg-[#F5F7FA] px-2 py-0.5 text-[10px] text-[#1C4967]"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
