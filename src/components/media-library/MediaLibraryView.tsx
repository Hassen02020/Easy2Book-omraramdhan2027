import { useRef, useState } from 'react';
import {
  Check,
  Copy,
  Eye,
  ImagePlus,
  Search,
  Tag,
  Upload,
  X,
} from 'lucide-react';
import type { BusinessUniverse, MediaAsset } from '../../types/creator';

interface MediaLibraryViewProps {
  media: MediaAsset[];
  onAddMediaAsset: (asset: MediaAsset) => void;
}

const UNIVERSE_LABELS: Record<BusinessUniverse | 'all', string> = {
  all: 'Tous les médias',
  omra: 'Omra & Spirituel',
  voyages: 'Voyages, Vols & Croisières',
  hotels_tunisie: 'Hôtels Tunisie & Excursions',
  visa: 'Visa & Mobilité',
};

export function MediaLibraryView({ media, onAddMediaAsset }: MediaLibraryViewProps) {
  const [universeFilter, setUniverseFilter] = useState<BusinessUniverse | 'all'>('all');
  const [ratioFilter, setRatioFilter] = useState<'all' | '16:9' | '9:16' | '1:1'>('all');
  const [query, setQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSrc, setNewSrc] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newRatio, setNewRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [newUniverse, setNewUniverse] = useState<BusinessUniverse | 'all'>('omra');
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = media.filter((m) => {
    const matchesUniverse =
      universeFilter === 'all' || m.universe === 'all' || m.universe === universeFilter;
    const matchesRatio = ratioFilter === 'all' || m.aspectRatio === ratioFilter;
    const matchesQuery =
      !normalizedQuery ||
      m.title.toLowerCase().includes(normalizedQuery) ||
      m.tags.some((tg) => tg.toLowerCase().includes(normalizedQuery));
    return matchesUniverse && matchesRatio && matchesQuery;
  });

  const handleCopySrc = (asset: MediaAsset) => {
    navigator.clipboard?.writeText(asset.src).catch(() => {});
    setCopiedId(asset.id);
    window.setTimeout(() => {
      setCopiedId((curr) => (curr === asset.id ? null : curr));
    }, 1800);
  };

  const handleLocalFileChange = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewSrc(reader.result);
        if (!newTitle.trim()) {
          setNewTitle(file.name.replace(/\.[^.]+$/, ''));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#102D45]">
            Médiathèque du Studio ({media.length})
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Visuels officiels Easy2Book disponibles pour vos blocs Hero, Galeries, Cartes et Modules (Omra, Voyages, Hôtels, Bateaux, Transferts, Visa).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((s) => !s)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1C4967]"
        >
          <ImagePlus className="h-4 w-4 text-[#E7B34C]" />
          {showAddForm ? 'Fermer le formulaire' : 'Ajouter un média'}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTitle.trim() || !newSrc.trim()) return;
            const parsedTags = newTags
              .split(',')
              .map((t) => t.trim().toLowerCase())
              .filter(Boolean);
            onAddMediaAsset({
              id: `media-${Date.now().toString(36)}`,
              title: newTitle.trim(),
              src: newSrc.trim(),
              universe: newUniverse,
              aspectRatio: newRatio,
              tags: parsedTags.length > 0 ? parsedTags : ['personnalisé'],
              isDemoAsset: false,
            });
            setNewTitle('');
            setNewSrc('');
            setNewTags('');
            setShowAddForm(false);
          }}
          className="grid gap-3 rounded-2xl border border-[#E7B34C]/60 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6 items-end"
        >
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-[#102D45] mb-1">
              Titre du visuel
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Plage Sousse — Hôtel 5★"
              className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-[#102D45] mb-1">
              URL Image ou Import fichier local
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                required
                value={newSrc}
                onChange={(e) => setNewSrc(e.target.value)}
                placeholder="https://... ou importer un fichier"
                className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLocalFileChange(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Importer depuis votre ordinateur"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-2 text-xs font-semibold text-[#102D45] hover:border-[#E7B34C]"
              >
                <Upload className="h-3.5 w-3.5" />
                Fichier
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#102D45] mb-1">
              Univers & Format
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={newUniverse}
                onChange={(e) =>
                  setNewUniverse(e.target.value as BusinessUniverse | 'all')
                }
                className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-2 text-xs"
              >
                <option value="all">Tous</option>
                <option value="omra">Omra</option>
                <option value="voyages">Voyages</option>
                <option value="hotels_tunisie">Hôtels Tunisie</option>
                <option value="visa">Visa</option>
              </select>
              <select
                value={newRatio}
                onChange={(e) =>
                  setNewRatio(e.target.value as '16:9' | '9:16' | '1:1')
                }
                className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-2 text-xs"
              >
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#102D45] mb-1">
              Tags (séparés par virgule)
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="ex: hotel, promo"
                className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-2 text-xs"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-[#102D45] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1C4967]"
              >
                Ajouter
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs + Search + Aspect Ratio */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#102D45]/10 bg-white p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
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
              {UNIVERSE_LABELS[u]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#102D45]/10 bg-[#F5F7FA] p-0.5 text-[11px] font-semibold">
            {(['all', '16:9', '9:16', '1:1'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setRatioFilter(ratio)}
                className={`rounded-md px-2 py-1 transition-colors ${
                  ratioFilter === ratio
                    ? 'bg-white text-[#102D45] shadow-2xs'
                    : 'text-slate-500 hover:text-[#102D45]'
                }`}
              >
                {ratio === 'all' ? 'Tous formats' : ratio}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un visuel ou tag..."
              className="w-52 rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] py-1.5 pl-8 pr-3 text-xs text-[#102D45] placeholder:text-slate-400 focus:border-[#E7B34C] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#102D45]/20 bg-white p-10 text-center text-xs text-slate-500">
          Aucun média ne correspond à votre filtre. Modifiez la recherche ou réinitialisez les filtres.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <article
              key={asset.id}
              className="group overflow-hidden rounded-2xl border border-[#102D45]/10 bg-white shadow-2xs transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
                <img
                  src={asset.src}
                  alt={asset.title}
                  referrerPolicy="no-referrer"
                  className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${
                    asset.id === 'media-easy2book-logo'
                      ? 'object-contain p-6 bg-white'
                      : 'object-cover'
                  }`}
                />
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setPreviewAsset(asset)}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#102D45]/90 px-2.5 py-1 text-[10px] font-bold text-white shadow hover:bg-[#102D45]"
                  >
                    <Eye className="h-3 w-3 text-[#E7B34C]" />
                    Aperçu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopySrc(asset)}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#102D45] shadow hover:bg-white"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        URL
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                  <span className="rounded bg-[#F5F7FA] px-1.5 py-0.5 font-semibold text-[#102D45]">
                    {asset.aspectRatio}
                  </span>
                  <span>{asset.isDemoAsset ? 'Studio Easy2Book' : 'Importé'}</span>
                </div>
                <h2 className="mt-1.5 text-xs font-bold text-[#102D45]">
                  {asset.title}
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {asset.tags.map((tg) => (
                    <button
                      key={tg}
                      type="button"
                      onClick={() => setQuery(tg)}
                      className="inline-flex items-center gap-1 rounded bg-[#F5F7FA] px-2 py-0.5 text-[10px] text-[#1C4967] hover:bg-[#E7B34C]/20"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tg}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#102D45]/10 px-5 py-3.5">
              <div>
                <h3 className="text-sm font-extrabold text-[#102D45]">
                  {previewAsset.title}
                </h3>
                <p className="text-[11px] font-mono text-slate-500">
                  Format {previewAsset.aspectRatio} · Univers {UNIVERSE_LABELS[previewAsset.universe]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-[#F5F7FA] hover:text-[#102D45]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] bg-[#0B162C] flex items-center justify-center overflow-hidden">
              <img
                src={previewAsset.src}
                alt={previewAsset.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#F5F7FA]">
              <div className="flex flex-wrap gap-1.5">
                {previewAsset.tags.map((tg) => (
                  <span
                    key={tg}
                    className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1C4967] border border-[#102D45]/10"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tg}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleCopySrc(previewAsset)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#102D45] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1C4967]"
              >
                {copiedId === previewAsset.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#E7B34C]" />
                    URL copiée
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#E7B34C]" />
                    Copier l’URL du visuel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
