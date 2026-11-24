import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Loader2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  FLIGHTS_FERRIES_ARABIC_SCRIPT,
  FLIGHTS_FERRIES_SCRIPT,
  FLIGHTS_FERRIES_SHOOTING_TIPS,
  getReelConfig,
  getSocialCaptionBlocks,
  getSubtitleCues,
  OMRA_SUR_MESURE_AD_TIPS,
  OMRA_SUR_MESURE_BODY_SCRIPT,
  OMRA_SUR_MESURE_HOOKS,
  OMRA_SUR_MESURE_STORYBOARD_ROWS,
  OMRA_SUR_MESURE_VEO_PROMPTS,
  OMRA_SUR_MESURE_VEO_SETTINGS,
  REEL_PRESET_CATALOG,
  VISA_EVISA_HOOK_ANGLES,
  VISA_EVISA_LEGAL_DISCLAIMER_AR,
  VISA_EVISA_LEGAL_DISCLAIMER_FR,
  VISA_EVISA_MARKETING_ADVICE,
  VISA_EVISA_RETENTION_TIPS,
  VISA_EVISA_STORYBOARD_ROWS,
  VOICE_OPTIONS,
  WORLD_HOTELS_PRODUCTION_NOTES,
  WORLD_HOTELS_TND_STORYBOARD_ROWS,
  type ReelPresetId,
} from '../../data/campaignData';
import {
  formatFileSize,
  generateVideoDownloadLink,
  triggerVideoBlobDownload,
  type VideoExportResult,
} from '../../lib/reelVideoExporter';
import type { CreatorLanguage, MediaAsset, Page } from '../../types/creator';
import { ReelPlayer } from '../ReelPlayer';

interface VideosStudioViewProps {
  language: CreatorLanguage;
  pages: Page[];
  onOpenPagePreview: (pageId: string) => void;
  onAttachVideoToPageGallery: (
    pageId: string,
    video: {
      title: string;
      caption: string;
      url: string;
      badge: string;
      posterKey: string;
    }
  ) => void;
  onAddMediaAsset: (asset: MediaAsset) => void;
}

type CategoryFilter =
  | 'all'
  | 'hotels_monde'
  | 'billetterie'
  | 'visa'
  | 'excursions'
  | 'omra';

function decodeBase64ToUint8Array(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function formatTimecode(sec: number): string {
  const whole = Math.max(0, Math.floor(sec));
  const m = String(Math.floor(whole / 60)).padStart(2, '0');
  const s = String(whole % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function VideosStudioView({
  language,
  pages,
  onOpenPagePreview,
  onAttachVideoToPageGallery,
  onAddMediaAsset,
}: VideosStudioViewProps) {
  const isAr = language === 'ar';
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedPreset, setSelectedPreset] =
    useState<ReelPresetId>('omra_sur_mesure');

  const reelConfig = useMemo(
    () => getReelConfig(selectedPreset),
    [selectedPreset]
  );
  const presetMeta = useMemo(
    () =>
      REEL_PRESET_CATALOG.find((p) => p.id === selectedPreset) ??
      REEL_PRESET_CATALOG[0],
    [selectedPreset]
  );
  const subtitleCues = useMemo(
    () => getSubtitleCues(selectedPreset),
    [selectedPreset]
  );
  const socialCaptions = useMemo(
    () => getSocialCaptionBlocks(selectedPreset),
    [selectedPreset]
  );

  const [customScripts, setCustomScripts] = useState<
    Partial<Record<ReelPresetId, string>>
  >({});
  const activeScript =
    customScripts[selectedPreset] !== undefined
      ? (customScripts[selectedPreset] as string)
      : reelConfig.script;

  const [selectedVoice, setSelectedVoice] = useState<string>(
    reelConfig.defaultVoiceId
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(reelConfig.totalDurationSec);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const [videoExporting, setVideoExporting] = useState(false);
  const [videoExportPct, setVideoExportPct] = useState(0);
  const [videoExportStatus, setVideoExportStatus] = useState('');
  const [videoExportResult, setVideoExportResult] =
    useState<VideoExportResult | null>(null);
  const [videoExportError, setVideoExportError] = useState<string | null>(null);
  const [videoLinkCopied, setVideoLinkCopied] = useState(false);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);
  const [selectedEvisaHookId, setSelectedEvisaHookId] = useState<string | null>(
    null
  );
  const [selectedOmraCustomHookId, setSelectedOmraCustomHookId] = useState<
    'hook1' | 'hook2' | 'hook3'
  >('hook1');
  const [copiedVeoPromptId, setCopiedVeoPromptId] = useState<string | null>(
    null
  );
  const [attachTargetPageId, setAttachTargetPageId] = useState<string>(
    presetMeta.linkedPageId
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlMapRef = useRef<Map<string, string>>(new Map());

  const filteredPresets = useMemo(() => {
    if (categoryFilter === 'all') return REEL_PRESET_CATALOG;
    return REEL_PRESET_CATALOG.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const handleSelectPreset = (nextPreset: ReelPresetId) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioActive(false);
    setAudioError(null);
    setCurrentTime(0);
    setSelectedEvisaHookId(null);
    setVideoExportError(null);
    setVideoExportResult(null);
    setSelectedPreset(nextPreset);
    const nextCfg = getReelConfig(nextPreset);
    setTotalDuration(nextCfg.totalDurationSec);
    setSelectedVoice(nextCfg.defaultVoiceId);
    const meta = REEL_PRESET_CATALOG.find((p) => p.id === nextPreset);
    if (meta) {
      setAttachTargetPageId(meta.linkedPageId);
    }
  };

  const effectiveScenes = useMemo(() => {
    if (selectedPreset === 'omra_sur_mesure') {
      const chosenHook = OMRA_SUR_MESURE_HOOKS.find(
        (h) => h.id === selectedOmraCustomHookId
      );
      if (!chosenHook) return reelConfig.scenes;
      return reelConfig.scenes.map((scene, idx) =>
        idx === 0
          ? {
              ...scene,
              overlayHeadline: chosenHook.screenHeadline,
              overlayLines: [
                chosenHook.screenSubline,
                'مكة المكرمة 📍 • المدينة المنورة 📍',
              ],
              overlayPosition: 'center' as const,
            }
          : scene
      );
    }
    if (selectedPreset !== 'visa_evisa' || !selectedEvisaHookId) {
      return reelConfig.scenes;
    }
    const chosenHook = VISA_EVISA_HOOK_ANGLES.find(
      (h) => h.id === selectedEvisaHookId
    );
    if (!chosenHook) return reelConfig.scenes;
    return reelConfig.scenes.map((scene, idx) =>
      idx === 0
        ? {
            ...scene,
            overlayHeadline: chosenHook.screenHeadline,
            overlayLines: [chosenHook.screenSubline],
            overlayPosition: 'center' as const,
          }
        : scene
    );
  }, [
    reelConfig.scenes,
    selectedEvisaHookId,
    selectedOmraCustomHookId,
    selectedPreset,
  ]);

  useEffect(() => {
    if (!isPlaying || audioActive) return;
    const id = window.setInterval(() => {
      setCurrentTime((prev) =>
        prev + 0.1 >= totalDuration ? 0 : prev + 0.1
      );
    }, 100);
    return () => window.clearInterval(id);
  }, [audioActive, isPlaying, totalDuration]);

  useEffect(() => {
    const map = audioUrlMapRef.current;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      map.forEach((url) => URL.revokeObjectURL(url));
      map.clear();
    };
  }, []);

  const baseDurationSec = Math.max(1, reelConfig.totalDurationSec);
  const scaledTime =
    totalDuration > 0
      ? (currentTime / totalDuration) * baseDurationSec
      : 0;

  const activeCue =
    subtitleCues.find((c) => scaledTime >= c.startSec && scaledTime < c.endSec) ??
    subtitleCues[0];

  const handleTogglePlay = async (forceVoice?: string) => {
    const voice = forceVoice || selectedVoice;
    setAudioError(null);

    if (isPlaying && !forceVoice) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    setIsPlaying(true);
    const cacheKey = `${selectedPreset}:${voice}:${activeScript}`;
    let url = audioUrlMapRef.current.get(cacheKey);
    if (!url && !audioLoading) {
      setAudioLoading(true);
      const voiceMeta = VOICE_OPTIONS.find((v) => v.id === voice);
      try {
        const res = await fetch('/api/voiceover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: activeScript,
            voiceName: voice,
            style: voiceMeta?.stylePrompt,
          }),
        });
        if (!res.ok) {
          throw new Error(
            'Synthèse vocale temporairement indisponible — aperçu visuel actif.'
          );
        }
        const data = (await res.json()) as {
          audioBase64?: string;
          mimeType?: string;
        };
        if (data.audioBase64) {
          const bytes = decodeBase64ToUint8Array(data.audioBase64);
          const blob = new Blob([bytes.buffer as ArrayBuffer], {
            type: data.mimeType || 'audio/wav',
          });
          url = URL.createObjectURL(blob);
          audioUrlMapRef.current.set(cacheKey, url);
        }
      } catch (err) {
        setAudioError(
          err instanceof Error
            ? err.message
            : 'Lecture visuelle sans piste vocale.'
        );
      } finally {
        setAudioLoading(false);
      }
    }

    if (url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.muted = isMuted;
      audio.onloadedmetadata = () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setTotalDuration(audio.duration);
        }
      };
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      audio.onended = () => {
        setAudioActive(false);
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audioRef.current = audio;
      setAudioActive(true);
      await audio.play().catch(() => {
        setAudioActive(false);
      });
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  const handleExportMp4 = async () => {
    if (videoExporting) return;
    setVideoExportError(null);
    setVideoLinkCopied(false);
    setVideoExporting(true);
    setVideoExportPct(8);
    setVideoExportStatus('Préparation du montage 9:16...');

    if (videoExportResult?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoExportResult.blobUrl);
    }

    try {
      const result = await generateVideoDownloadLink({
        preset: selectedPreset,
        voiceName: selectedVoice,
        showCaptions,
        customScript: activeScript,
        scenesOverride: effectiveScenes,
        autoDownload: true,
        onProgress: (pct, label) => {
          setVideoExportPct(pct);
          setVideoExportStatus(label);
        },
      });
      setVideoExportResult(result);
    } catch (err) {
      setVideoExportError(
        err instanceof Error
          ? err.message
          : 'Impossible de générer la vidéo MP4.'
      );
    } finally {
      setVideoExporting(false);
    }
  };

  const handleCopyVideoLink = async () => {
    if (!videoExportResult) return;
    try {
      await navigator.clipboard.writeText(videoExportResult.downloadUrl);
      setVideoLinkCopied(true);
      window.setTimeout(() => setVideoLinkCopied(false), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  const getPosterKeyForPreset = (preset: ReelPresetId): string => {
    if (preset === 'omra_sur_mesure') return 'omra_vip_haram';
    if (preset === 'world_hotels_tnd') return 'world_hotels_canada_niagara';
    if (preset === 'world_hotels_packages') return 'world_hotels_zanzibar_beach';
    if (preset === 'world_hotels_cafe') return 'world_hotels_cafe_booking';
    if (preset === 'flights_ferries') return 'flights_mediterranean_ship';
    if (preset === 'visa_egypt' || preset === 'egypt_excursions') {
      return 'egypt_pyramids_reel';
    }
    if (
      preset === 'visa_dubai' ||
      preset === 'visa_qatar' ||
      preset === 'excursions_general'
    ) {
      return 'dubai_skyline';
    }
    if (preset === 'visa_oman') return 'airline_business_cabin';
    if (preset === 'visa_international') return 'visa_canada';
    if (preset === 'visa_omra') return 'omra_vip_haram';
    if (preset === 'visa_evisa') return 'evisa_passport_globe';
    if (preset === 'visa_services' || preset === 'visa_schengen') {
      return 'visa_desk';
    }
    if (preset === 'turkey_excursions') return 'turkey_istanbul_reel';
    return 'omra_vip_haram';
  };

  const handleSaveToMediaAndGallery = () => {
    if (!videoExportResult) return;
    const inlinePath = videoExportResult.downloadPath.startsWith('/')
      ? `${videoExportResult.downloadPath}?inline=1`
      : videoExportResult.downloadPath;
    const posterKey = getPosterKeyForPreset(selectedPreset);
    const targetPage =
      pages.find((p) => p.id === attachTargetPageId) ?? pages[0];

    onAddMediaAsset({
      id: `media-reel-${Date.now().toString(36)}`,
      title: `${presetMeta.titleFr} (${selectedVoice})`,
      universe:
        presetMeta.category === 'visa'
          ? 'visa'
          : presetMeta.category === 'excursions' ||
              presetMeta.category === 'billetterie' ||
              presetMeta.category === 'hotels_monde'
            ? 'voyages'
            : 'omra',
      src: inlinePath,
      aspectRatio: '9:16',
      tags: ['reel', '9:16', 'mp4', presetMeta.category, selectedPreset],
      isDemoAsset: false,
    });

    if (targetPage) {
      onAttachVideoToPageGallery(targetPage.id, {
        badge: `Reel 9:16 · ${selectedVoice}`,
        title: presetMeta.titleAr,
        caption: `${presetMeta.summaryFr} · MP4 (${videoExportResult.durationSec}s)`,
        url: inlinePath,
        posterKey,
      });
    }
  };

  const linkedPage = pages.find((p) => p.id === presetMeta.linkedPageId);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Studio Header Banner */}
      <section className="rounded-2xl bg-[#102D45] p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-bold text-[#E7B34C]">
              <Film className="h-3.5 w-3.5" />
              <span>Easy2Book Studio Vidéo 9:16 · Même principe que Omra</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {isAr
                ? 'استوديو فيديوهات الريلز 9:16 — التأشيرات، الرحلات اليومية والعمرة'
                : 'Studio Vidéos & Reels 9:16 — Visas, Excursions & Omra'}
            </h1>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              Créez, personnalisez et exportez en MP4 HD (720×1280) vos Reels
              commerciaux verticaux avec voix tunisienne féminine ou masculine,
              sous-titres synchronisés, captions prêts à copier et intégration
              directe dans vos pages Easy2Book.
            </p>
          </div>

          {/* Category Switcher */}
          <div className="flex flex-wrap items-center rounded-xl border border-white/15 bg-white/10 p-1">
            {(
              [
                { id: 'all', label: `Tout (${REEL_PRESET_CATALOG.length})` },
                {
                  id: 'hotels_monde',
                  label: `Hôtels Monde (${REEL_PRESET_CATALOG.filter((p) => p.category === 'hotels_monde').length})`,
                },
                {
                  id: 'billetterie',
                  label: `Avion & Bateau (${REEL_PRESET_CATALOG.filter((p) => p.category === 'billetterie').length})`,
                },
                {
                  id: 'visa',
                  label: `Visas (${REEL_PRESET_CATALOG.filter((p) => p.category === 'visa').length})`,
                },
                {
                  id: 'excursions',
                  label: `Excursions (${REEL_PRESET_CATALOG.filter((p) => p.category === 'excursions').length})`,
                },
                {
                  id: 'omra',
                  label: `Omra (${REEL_PRESET_CATALOG.filter((p) => p.category === 'omra').length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  categoryFilter === tab.id
                    ? 'bg-[#E7B34C] text-[#102D45]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPresets.map((item) => {
            const active = item.id === selectedPreset;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPreset(item.id)}
                className={`flex flex-col justify-between rounded-xl border p-3.5 text-start transition-all ${
                  active
                    ? 'border-[#E7B34C] bg-white text-[#102D45] shadow-md'
                    : 'border-white/15 bg-white/8 text-white hover:bg-white/12'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        active ? 'text-[#C8922A]' : 'text-[#E7B34C]'
                      }`}
                    >
                      {item.badgeFr}
                    </span>
                    {item.category === 'visa' && (
                      <ShieldCheck className="h-3.5 w-3.5 text-[#C8922A]" />
                    )}
                  </div>
                  <p className="mt-1.5 text-xs font-extrabold leading-snug">
                    {item.titleFr}
                  </p>
                  <p
                    dir="rtl"
                    className={`mt-1 text-[11px] font-semibold ${
                      active ? 'text-[#1C4967]' : 'text-slate-300'
                    }`}
                  >
                    {item.titleAr}
                  </p>
                </div>
                <p
                  className={`mt-2 text-[11px] leading-snug line-clamp-2 ${
                    active ? 'text-slate-600' : 'text-slate-300/85'
                  }`}
                >
                  {item.summaryFr}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Production Workspace */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Controls & Storyboard */}
        <div className="lg:col-span-7 space-y-5">
          {/* Action & Voiceover Controls Card */}
          <div className="rounded-2xl border border-[#102D45]/10 bg-white p-5 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#102D45]/10 pb-3">
              <div>
                <p className="text-[11px] font-bold text-[#C8922A]">
                  {presetMeta.badgeFr}
                </p>
                <h2 className="text-base font-extrabold text-[#102D45]">
                  {presetMeta.titleFr}
                </h2>
              </div>
              {linkedPage && (
                <button
                  type="button"
                  onClick={() => onOpenPagePreview(linkedPage.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-1.5 text-xs font-bold text-[#102D45] hover:border-[#E7B34C]"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#1C4967]" />
                  <span>Ouvrir la page associée</span>
                </button>
              )}
            </div>

            {/* Playback & Export Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => void handleTogglePlay()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E7B34C] px-4 py-2.5 text-xs font-extrabold text-[#102D45] hover:bg-[#f0c264]"
              >
                {audioLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>
                  {audioLoading
                    ? 'Synthèse vocale...'
                    : isPlaying
                      ? 'Mettre en pause'
                      : 'Lire Reel + Voix Tunisienne'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowCaptions((c) => !c)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2.5 text-xs font-bold text-[#102D45] hover:bg-white"
              >
                {showCaptions ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                <span>{showCaptions ? 'Masquer textes' : 'Afficher textes'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2.5 text-xs font-bold text-[#102D45] hover:bg-white"
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
                <span>{isMuted ? 'Son coupé' : 'Son actif'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentTime(0);
                  if (audioRef.current) audioRef.current.currentTime = 0;
                }}
                className="rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] p-2.5 text-[#102D45] hover:bg-white"
                title="Recommencer à 00:00"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                disabled={videoExporting}
                onClick={() => void handleExportMp4()}
                className="ms-auto inline-flex items-center gap-2 rounded-xl bg-[#102D45] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#1C4967] disabled:opacity-60"
              >
                {videoExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#E7B34C]" />
                ) : (
                  <Download className="h-4 w-4 text-[#E7B34C]" />
                )}
                <span>
                  {videoExporting
                    ? `Génération MP4 (${videoExportPct}%)`
                    : 'Générer & Télécharger MP4 9:16'}
                </span>
              </button>
            </div>

            {audioError && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                {audioError}
              </p>
            )}

            {/* Progress Bar */}
            {videoExporting && (
              <div className="rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#102D45]">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#C8922A]" />
                    {videoExportStatus}
                  </span>
                  <span className="font-mono-tabular" dir="ltr">
                    {videoExportPct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#102D45]/10">
                  <div
                    className="h-full bg-[#C8922A] transition-all duration-300"
                    style={{ width: `${videoExportPct}%` }}
                  />
                </div>
              </div>
            )}

            {videoExportError && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
                {videoExportError}
              </p>
            )}

            {/* Export Result & Direct Attachment to Page Video Gallery */}
            {videoExportResult && !videoExporting && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-900">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Vidéo MP4 9:16 générée & téléchargée
                  </span>
                  <span className="font-mono-tabular" dir="ltr">
                    {videoExportResult.format.toUpperCase()} ·{' '}
                    {formatFileSize(videoExportResult.sizeBytes)} ·{' '}
                    {videoExportResult.durationSec}s
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerVideoBlobDownload(videoExportResult)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Re-télécharger ({videoExportResult.format.toUpperCase()})
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCopyVideoLink()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-900"
                  >
                    {videoLinkCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Lien copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copier lien MP4
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-white p-2.5">
                  <select
                    value={attachTargetPageId}
                    onChange={(e) => setAttachTargetPageId(e.target.value)}
                    className="flex-1 min-w-[200px] rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs font-semibold text-[#102D45]"
                  >
                    {pages.map((pg) => (
                      <option key={pg.id} value={pg.id}>
                        Page : {pg.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveToMediaAndGallery}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#102D45] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1C4967]"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#E7B34C]" />
                    Intégrer dans la Galerie Vidéo & Médiathèque
                  </button>
                </div>

                <div className="rounded-lg bg-[#0B162C] p-2">
                  <video
                    src={videoExportResult.blobUrl}
                    controls
                    playsInline
                    className="mx-auto max-h-60 w-auto rounded"
                  />
                </div>
              </div>
            )}

            {/* 16 Tunisian Voices Selector */}
            <div className="space-y-2 border-t border-[#102D45]/10 pt-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#102D45]">
                <span className="inline-flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-[#C8922A]" />
                  Voix Tunisienne Gemini TTS ({VOICE_OPTIONS.length}) — Défaut{' '}
                  {reelConfig.defaultVoiceId}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Voix féminines recommandées : Layla, Sarah, Amira, Nour
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {VOICE_OPTIONS.map((v) => {
                  const selected = selectedVoice === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVoice(v.id);
                        if (isPlaying) void handleTogglePlay(v.id);
                      }}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                        selected
                          ? 'border-[#102D45] bg-[#102D45] text-white'
                          : 'border-[#102D45]/15 bg-[#F5F7FA] text-[#102D45] hover:border-[#C8922A]'
                      }`}
                    >
                      {v.id} · {v.descriptionFr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Voiceover Script */}
            <div className="space-y-2 border-t border-[#102D45]/10 pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-[#102D45]">
                  {selectedPreset === 'flights_ferries'
                    ? 'Script voix off (Français ou Arabe Tunisien · modifiable avant export MP4)'
                    : 'Script voix off tunisienne (modifiable avant lecture & export MP4)'}
                </label>
                <div className="flex items-center gap-2">
                  {selectedPreset === 'flights_ferries' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomScripts((prev) => ({
                            ...prev,
                            flights_ferries: FLIGHTS_FERRIES_SCRIPT,
                          }))
                        }
                        className="rounded-md border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-0.5 text-[11px] font-bold text-[#102D45] hover:border-[#C8922A]"
                      >
                        Script FR (30s)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomScripts((prev) => ({
                            ...prev,
                            flights_ferries: FLIGHTS_FERRIES_ARABIC_SCRIPT,
                          }))
                        }
                        className="rounded-md border border-[#102D45]/15 bg-[#F5F7FA] px-2 py-0.5 text-[11px] font-bold text-[#102D45] hover:border-[#C8922A]"
                      >
                        النسخة التونسية AR
                      </button>
                    </>
                  )}
                  {customScripts[selectedPreset] !== undefined && (
                    <button
                      type="button"
                      onClick={() =>
                        setCustomScripts((prev) => {
                          const next = { ...prev };
                          delete next[selectedPreset];
                          return next;
                        })
                      }
                      className="text-[11px] font-bold text-[#1C4967] hover:underline"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
              <textarea
                rows={4}
                dir={/[\u0600-\u06FF]/.test(activeScript) ? 'rtl' : 'ltr'}
                value={activeScript}
                onChange={(e) =>
                  setCustomScripts((prev) => ({
                    ...prev,
                    [selectedPreset]: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] p-3 text-xs leading-relaxed text-[#102D45] focus:border-[#E7B34C] focus:bg-white outline-none"
              />
            </div>
          </div>

          {selectedPreset === 'omra_sur_mesure' && (
            <div className="rounded-2xl border border-[#C8922A]/35 bg-[#FFFDF7] p-5 space-y-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold text-[#C8922A]">
                    OMRA SUR-MESURE · مكة 📍 · المدينة المنورة 📍 · 25–30s (9:16)
                  </p>
                  <h3 className="text-sm font-extrabold text-[#102D45]">
                    عمرتك على كيفك! — 3 Hooks Darja, Découpage 30s & 4 Prompts Veo / AI Studio
                  </h3>
                </div>
                <span className="font-mono-tabular text-[11px] font-bold text-[#1C4967]">
                  30 s · 100% TND · 98 140 514
                </span>
              </div>

              {/* 3 Interactive Tunisian Darja Hooks */}
              <div className="space-y-2.5">
                <p className="text-xs font-extrabold text-[#102D45]">
                  3 Hooks (0:00 – 0:04) — cliquez pour appliquer sur l’aperçu 9:16 et le script voix off
                </p>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {OMRA_SUR_MESURE_HOOKS.map((hook) => {
                    const active = selectedOmraCustomHookId === hook.id;
                    return (
                      <button
                        key={hook.id}
                        type="button"
                        onClick={() => {
                          setSelectedOmraCustomHookId(hook.id);
                          setCustomScripts((prev) => ({
                            ...prev,
                            omra_sur_mesure: `${hook.voiceoverAr} ${OMRA_SUR_MESURE_BODY_SCRIPT}`,
                          }));
                          setCurrentTime(0);
                          if (audioRef.current) audioRef.current.currentTime = 0;
                        }}
                        className={`rounded-xl border p-3.5 text-start transition-colors space-y-1.5 ${
                          active
                            ? 'border-[#102D45] bg-[#102D45] text-white'
                            : 'border-[#102D45]/12 bg-white text-[#102D45] hover:border-[#C8922A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                          <span className={active ? 'text-[#F6D365]' : 'text-[#C8922A]'}>
                            HOOK {hook.numberLabel}
                          </span>
                          {active && (
                            <span className="text-[#F6D365]">Actif 0–4 s</span>
                          )}
                        </div>
                        <p
                          dir="rtl"
                          className={`font-arabic text-[11px] font-bold ${
                            active ? 'text-[#F6D365]' : 'text-[#1C4967]'
                          }`}
                        >
                          {hook.tagAr}
                        </p>
                        <p
                          dir="rtl"
                          className={`font-arabic text-xs leading-relaxed font-semibold ${
                            active ? 'text-white' : 'text-[#102D45]'
                          }`}
                        >
                          « {hook.voiceoverAr} »
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5-Row Click-to-Seek Storyboard Table */}
              <div className="overflow-x-auto rounded-xl border border-[#102D45]/10 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#102D45]/10 bg-[#FAF9F6] text-[11px] font-bold text-[#1C4967]">
                      <th className="px-3 py-2.5 whitespace-nowrap">التوقيت</th>
                      <th className="px-3 py-2.5">المشهد البصري (Visual / AI)</th>
                      <th className="px-3 py-2.5">النص على الشاشة (Motion Text)</th>
                      <th className="px-3 py-2.5">التعليق الصوتي (دارجة تونسية)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#102D45]/8">
                    {OMRA_SUR_MESURE_STORYBOARD_ROWS.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => {
                          const target =
                            (row.startSec /
                              Math.max(1, reelConfig.totalDurationSec)) *
                            totalDuration;
                          setCurrentTime(target);
                          if (audioRef.current)
                            audioRef.current.currentTime = target;
                        }}
                        className="cursor-pointer hover:bg-[#FFF9EB] transition-colors"
                      >
                        <td className="px-3 py-2.5 font-mono-tabular font-extrabold text-[#C8922A] whitespace-nowrap">
                          {row.timeRange}
                        </td>
                        <td className="px-3 py-2.5">
                          <p dir="rtl" className="font-arabic text-[11px] font-bold text-[#102D45]">
                            {row.visualAr}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500">
                            {row.visualFr}
                          </p>
                        </td>
                        <td
                          dir="rtl"
                          className="px-3 py-2.5 font-arabic text-[11px] font-extrabold text-[#102D45]"
                        >
                          {row.onScreenText}
                        </td>
                        <td
                          dir="rtl"
                          className="px-3 py-2.5 font-arabic text-[11px] font-semibold text-slate-700"
                        >
                          {row.voiceoverExcerpt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 4 Copy-Ready Cinematic 9:16 AI Video Prompts (Google AI Studio / Veo) */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-[#102D45]">
                    4 Prompts Cinématiques 9:16 prêts à copier (Google AI Studio / Veo)
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Format vertical 9:16 · 4K · Sans texte incrusté
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {OMRA_SUR_MESURE_VEO_PROMPTS.map((item) => {
                    const copied = copiedVeoPromptId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between rounded-xl border border-[#102D45]/12 bg-white p-3.5 space-y-2.5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono-tabular text-[10px] font-extrabold text-[#C8922A]">
                              {item.timeRange}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard
                                  ?.writeText(item.promptEn)
                                  .then(() => {
                                    setCopiedVeoPromptId(item.id);
                                    window.setTimeout(
                                      () => setCopiedVeoPromptId(null),
                                      1800
                                    );
                                  });
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1 text-[10px] font-bold text-[#102D45] hover:border-[#C8922A]"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-600" />
                                  <span>Copié</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copier Prompt Veo</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs font-extrabold text-[#102D45]">
                            {item.sceneLabelFr}
                          </p>
                          <p dir="rtl" className="font-arabic text-[11px] font-semibold text-[#1C4967]">
                            {item.sceneLabelAr}
                          </p>
                        </div>
                        <p
                          dir="ltr"
                          className="rounded-lg bg-[#F8FAFC] border border-[#102D45]/8 p-2.5 font-mono text-[10.5px] leading-relaxed text-slate-700"
                        >
                          {item.promptEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ad Success Tips (FB / IG / TikTok) + Veo / CapCut Settings */}
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-xl bg-[#102D45] p-4 text-white space-y-2.5">
                  <p dir="rtl" className="font-arabic text-xs font-extrabold text-[#F6D365]">
                    نصائح سريعة لنجاح الإعلان (Facebook / Instagram / TikTok)
                  </p>
                  <div className="space-y-2">
                    {OMRA_SUR_MESURE_AD_TIPS.map((tip) => (
                      <div
                        key={tip.id}
                        className="rounded-lg border border-white/15 bg-white/8 p-3 space-y-1"
                      >
                        <p dir="rtl" className="font-arabic text-xs font-extrabold text-[#F6D365]">
                          {tip.titleAr}
                        </p>
                        <p dir="rtl" className="font-arabic text-[11px] leading-relaxed text-slate-100">
                          {tip.detailAr}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#102D45]/12 bg-white p-4 space-y-2.5">
                  <p className="text-xs font-extrabold text-[#102D45]">
                    Conseils de réglage Google AI Studio / Veo & Montage CapCut / Premiere
                  </p>
                  <div className="space-y-2">
                    {OMRA_SUR_MESURE_VEO_SETTINGS.map((st) => (
                      <div
                        key={st.id}
                        className="rounded-lg border border-[#102D45]/10 bg-[#F8FAFC] p-3 space-y-1"
                      >
                        <p className="text-xs font-extrabold text-[#102D45]">
                          {st.titleFr}
                        </p>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {st.detailFr}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(selectedPreset === 'world_hotels_tnd' ||
            selectedPreset === 'world_hotels_packages' ||
            selectedPreset === 'world_hotels_cafe') && (
            <div className="rounded-2xl border border-[#C8922A]/35 bg-[#FFFDF7] p-5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold text-[#C8922A]">
                    CAMPAGNE EASY2BOOK.TN · +500 000 HÔTELS EN DINAR TUNISIEN (TND)
                  </p>
                  <h3 className="text-sm font-extrabold text-[#102D45]">
                    3 Scénarios Vidéo (Arabie Saoudite/Omra, Égypte, Canada, Turquie, Maroc, Dubaï, Malaisie, Zanzibar)
                  </h3>
                </div>
                <span className="font-mono-tabular text-[11px] font-bold text-[#1C4967]">
                  100% TND · 98 140 514
                </span>
              </div>

              {/* Quick 3-Scenario Switcher */}
              <div className="grid gap-2 sm:grid-cols-3">
                {(
                  [
                    {
                      id: 'world_hotels_tnd',
                      tag: 'Scénario 1 · 35 s',
                      ar: 'العالم الكل بالدينار التونسي',
                      fr: 'Dynamique & rapide · Voucher Visa',
                    },
                    {
                      id: 'world_hotels_packages',
                      tag: 'Scénario 2 · 40 s',
                      ar: '3 باقات حسب جوّك',
                      fr: 'Sans Visa · Omra/Soleil · Canada/EU',
                    },
                    {
                      id: 'world_hotels_cafe',
                      tag: 'Scénario 3 · 45 s',
                      ar: 'حوار المقهى المحدّث',
                      fr: 'Sketch objections · Allocation & Canada',
                    },
                  ] as const
                ).map((sc) => {
                  const active = selectedPreset === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleSelectPreset(sc.id)}
                      className={`rounded-xl border p-3 text-start transition-colors ${
                        active
                          ? 'border-[#102D45] bg-[#102D45] text-white'
                          : 'border-[#102D45]/12 bg-white text-[#102D45] hover:border-[#C8922A]'
                      }`}
                    >
                      <p
                        className={`text-[10px] font-extrabold uppercase tracking-wider ${
                          active ? 'text-[#E7B34C]' : 'text-[#C8922A]'
                        }`}
                      >
                        {sc.tag}
                      </p>
                      <p dir="rtl" className="mt-1 font-arabic text-xs font-extrabold">
                        {sc.ar}
                      </p>
                      <p
                        className={`mt-0.5 text-[11px] ${
                          active ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {sc.fr}
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedPreset === 'world_hotels_tnd' && (
                <div className="overflow-x-auto rounded-xl border border-[#102D45]/10 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#102D45]/10 bg-[#FAF9F6] text-[11px] font-bold text-[#1C4967]">
                        <th className="px-3 py-2.5 whitespace-nowrap">Temps</th>
                        <th className="px-3 py-2.5">Visuel (المشهد)</th>
                        <th className="px-3 py-2.5">Voix Off Tunisienne</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">Texte à l’écran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#102D45]/8">
                      {WORLD_HOTELS_TND_STORYBOARD_ROWS.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => {
                            const target =
                              (row.startSec /
                                Math.max(1, reelConfig.totalDurationSec)) *
                              totalDuration;
                            setCurrentTime(target);
                            if (audioRef.current)
                              audioRef.current.currentTime = target;
                          }}
                          className="cursor-pointer hover:bg-[#FFF9EB] transition-colors"
                        >
                          <td className="px-3 py-2.5 font-mono-tabular font-extrabold text-[#C8922A] whitespace-nowrap">
                            {row.timeRange}
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-[#102D45]">
                            <p>{row.visualFr}</p>
                            <p dir="rtl" className="font-arabic text-[11px] text-[#1C4967]">
                              {row.visualAr}
                            </p>
                          </td>
                          <td dir="rtl" className="px-3 py-2.5 font-arabic text-[11px] font-semibold text-slate-700">
                            {row.voiceoverExcerpt}
                          </td>
                          <td dir="rtl" className="px-3 py-2.5 font-arabic font-extrabold text-[#102D45] whitespace-nowrap">
                            {row.onScreenText}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Production Notes (Saudi/Egypt, Canada + Green Passport, Motion Text) */}
              <div className="rounded-xl bg-[#102D45] p-4 text-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-extrabold text-[#F6D365]">
                    💡 ملاحظات للإنتاج والتصوير · Notes de Production (Easy2Book.tn)
                  </p>
                  <span dir="rtl" className="font-arabic text-[11px] font-extrabold text-white">
                    عمرة • مصر • كندا • تركيا • دبي — الخلاص بالدينار التونسي 🇹🇳
                  </span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {WORLD_HOTELS_PRODUCTION_NOTES.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg border border-white/15 bg-white/8 p-3 space-y-1.5"
                    >
                      <p dir="rtl" className="font-arabic text-xs font-extrabold text-[#F6D365]">
                        {note.titleAr}
                      </p>
                      <p dir="rtl" className="font-arabic text-[11px] leading-relaxed text-slate-100">
                        {note.detailAr}
                      </p>
                      <p className="text-[10px] leading-relaxed text-slate-300 border-t border-white/10 pt-1.5">
                        {note.detailFr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedPreset === 'flights_ferries' && (
            <div className="rounded-2xl border border-[#C8922A]/30 bg-[#FFFDF7] p-5 space-y-3 shadow-2xs">
              <h3 className="text-sm font-extrabold text-[#102D45]">
                Conseils de tournage pour maximiser les conversions (25 à 35s)
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {FLIGHTS_FERRIES_SHOOTING_TIPS.map((tip) => (
                  <div
                    key={tip.id}
                    className="rounded-xl border border-[#102D45]/10 bg-white p-3.5"
                  >
                    <p className="text-xs font-extrabold text-[#102D45]">
                      {tip.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                      {tip.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPreset === 'visa_evisa' && (
            <div className="rounded-2xl border border-[#C8922A]/35 bg-[#FFFDF7] p-5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-[#102D45]">
                  Découpage conseillé pour le montage (42 s) & Conseil marketing E-Visa
                </h3>
                <span className="font-mono-tabular text-[11px] font-bold text-[#1C4967]">
                  0–42 s · 5 séquences
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#102D45]/10 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#102D45]/10 bg-[#FAF9F6] text-[11px] font-bold text-[#1C4967]">
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Temps</th>
                      <th className="px-3.5 py-2.5">Image à afficher</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Texte à l’écran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#102D45]/8">
                    {VISA_EVISA_STORYBOARD_ROWS.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => {
                          const target =
                            (row.startSec / Math.max(1, reelConfig.totalDurationSec)) *
                            totalDuration;
                          setCurrentTime(target);
                          if (audioRef.current) audioRef.current.currentTime = target;
                        }}
                        className="cursor-pointer hover:bg-[#FFF9EB] transition-colors"
                      >
                        <td className="px-3.5 py-2.5 font-mono-tabular font-extrabold text-[#C8922A] whitespace-nowrap">
                          {row.timeRange}
                        </td>
                        <td className="px-3.5 py-2.5 font-semibold text-[#102D45]">
                          {row.visualFr}
                        </td>
                        <td className="px-3.5 py-2.5 font-extrabold text-[#102D45] whitespace-nowrap">
                          {row.onScreenText}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#102D45]/10 bg-white p-3.5 space-y-1">
                  <p className="text-xs font-extrabold text-[#102D45]">
                    {VISA_EVISA_MARKETING_ADVICE.titleFr}
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {VISA_EVISA_MARKETING_ADVICE.detailFr}
                  </p>
                </div>
                <div className="rounded-xl border border-[#102D45]/10 bg-white p-3.5 space-y-1.5">
                  <p className="text-xs font-extrabold text-[#102D45]">
                    Mention légale obligatoire (AR / FR)
                  </p>
                  <p dir="rtl" className="font-arabic text-[11px] font-semibold leading-relaxed text-[#1C4967]">
                    {VISA_EVISA_LEGAL_DISCLAIMER_AR}
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {VISA_EVISA_LEGAL_DISCLAIMER_FR}
                  </p>
                </div>
              </div>

              {/* 4 Opening Hook Angles (0–3 s) */}
              <div className="space-y-3 border-t border-[#102D45]/10 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-[#102D45]">
                    4 angles d’accroche (0–3 s) — cliquez pour prévisualiser sur le Reel 9:16
                  </h4>
                  {selectedEvisaHookId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvisaHookId(null);
                        setCurrentTime(0);
                        if (audioRef.current) audioRef.current.currentTime = 0;
                      }}
                      className="text-[11px] font-bold text-[#1C4967] hover:underline"
                    >
                      Accroche par défaut
                    </button>
                  )}
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {VISA_EVISA_HOOK_ANGLES.map((angle) => {
                    const active = selectedEvisaHookId === angle.id;
                    return (
                      <button
                        key={angle.id}
                        type="button"
                        onClick={() => {
                          setSelectedEvisaHookId(angle.id);
                          setCurrentTime(0);
                          if (audioRef.current) audioRef.current.currentTime = 0;
                        }}
                        className={`rounded-xl border p-3.5 text-start transition-colors space-y-1.5 ${
                          active
                            ? 'border-[#C8922A] bg-[#102D45] text-white'
                            : 'border-[#102D45]/10 bg-white text-[#102D45] hover:border-[#C8922A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                          <span className={active ? 'text-[#F6D365]' : 'text-[#C8922A]'}>
                            HOOK {angle.numberLabel} · {angle.tagFr}
                          </span>
                          {active && (
                            <span className="text-[#F6D365]">Actif 0–4 s</span>
                          )}
                        </div>
                        <p className="text-xs font-extrabold leading-snug">
                          {angle.titleFr}
                        </p>
                        <p
                          className={`text-[11px] font-semibold leading-snug ${
                            active ? 'text-[#F6D365]' : 'text-[#1C4967]'
                          }`}
                        >
                          {angle.hookVoiceoverFr}
                        </p>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            active ? 'text-slate-200' : 'text-slate-600'
                          }`}
                        >
                          {angle.visualFr}
                        </p>
                        <p
                          className={`text-[10px] leading-relaxed ${
                            active ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          <span className="font-bold">Pourquoi ça marche : </span>
                          {angle.whyItWorksFr}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* 3-Second Retention Playbook */}
                <div className="rounded-xl bg-[#102D45] p-4 text-white space-y-2.5">
                  <p className="text-xs font-extrabold text-[#F6D365]">
                    💡 Astuce pour maximiser la rétention sur les 3 premières secondes
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {VISA_EVISA_RETENTION_TIPS.map((tip) => (
                      <div
                        key={tip.id}
                        className="rounded-lg border border-white/15 bg-white/8 p-3 space-y-1"
                      >
                        <p className="text-[11px] font-extrabold text-[#F6D365]">
                          {tip.titleFr}
                        </p>
                        <p className="text-[11px] leading-relaxed text-slate-200">
                          {tip.detailFr}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scene Timeline Scrubber + Subtitle Cue */}
          <div className="rounded-2xl border border-[#102D45]/10 bg-white p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold text-[#102D45]">
                Découpage des {reelConfig.scenes.length} Scènes 9:16
              </h3>
              <span
                dir="ltr"
                className="font-mono-tabular text-xs font-bold text-[#1C4967]"
              >
                {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const val = Number.parseFloat(e.target.value);
                setCurrentTime(val);
                if (audioRef.current) audioRef.current.currentTime = val;
              }}
              className="w-full accent-[#C8922A] cursor-pointer"
              aria-label="Progression du Reel 9:16"
            />

            {activeCue && (
              <div
                dir={selectedPreset === 'flights_ferries' ? 'ltr' : 'rtl'}
                className="rounded-xl border border-[#E7B34C]/40 bg-[#FFFDF7] px-3.5 py-2.5 text-xs font-semibold text-[#102D45]"
              >
                {activeCue.text}
              </div>
            )}

            <div className="grid gap-2.5 sm:grid-cols-2">
              {reelConfig.scenes.map((scene) => {
                const isActiveScene =
                  scaledTime >= scene.startSec && scaledTime < scene.endSec;
                const sceneDir = scene.overlayDir === 'ltr' ? 'ltr' : 'rtl';
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      const ratio =
                        baseDurationSec > 0
                          ? scene.startSec / baseDurationSec
                          : 0;
                      const jump = ratio * totalDuration;
                      setCurrentTime(jump);
                      if (audioRef.current) audioRef.current.currentTime = jump;
                    }}
                    className={`rounded-xl border p-3 text-start transition-all ${
                      isActiveScene
                        ? 'border-[#C8922A] bg-[#102D45] text-white'
                        : 'border-[#102D45]/10 bg-[#F5F7FA] text-[#102D45] hover:border-[#C8922A]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono-tabular">
                      <span
                        className={
                          isActiveScene ? 'text-[#E7B34C] font-bold' : 'text-[#C8922A] font-bold'
                        }
                      >
                        SCÈNE {scene.indexLabel}
                      </span>
                      <span>
                        {scene.startSec}s – {scene.endSec}s
                      </span>
                    </div>
                    <p dir={sceneDir} className="mt-1 text-xs font-bold">
                      {scene.arabicTitle}
                    </p>
                    <p
                      dir={sceneDir}
                      className={`mt-0.5 text-[11px] leading-snug ${
                        isActiveScene ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {scene.subtitleSummary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copyable TikTok / Reels / WhatsApp Captions */}
          <div className="rounded-2xl border border-[#102D45]/10 bg-white p-5 space-y-3 shadow-2xs">
            <h3 className="text-sm font-extrabold text-[#102D45]">
              Captions TikTok, Reels & WhatsApp prêts à copier
            </h3>
            <div
              className="grid gap-3 sm:grid-cols-3"
              dir={selectedPreset === 'flights_ferries' ? 'ltr' : 'rtl'}
            >
              {socialCaptions.map((cap) => (
                <div
                  key={cap.id}
                  className="rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[#C8922A]">{cap.scene}</span>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard
                          ?.writeText(cap.lines.join('\n'))
                          .then(() => {
                            setCopiedCaptionId(cap.id);
                            window.setTimeout(
                              () => setCopiedCaptionId(null),
                              1600
                            );
                          });
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-[#102D45]/10 bg-white px-2 py-0.5 text-[10px] font-bold text-[#102D45]"
                    >
                      {copiedCaptionId === cap.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedCaptionId === cap.id ? 'نُسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                  {cap.lines.map((line, i) => (
                    <p key={i} className="text-[11px] leading-relaxed text-[#102D45]/90">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky 9:16 Live Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <ReelPlayer
            currentTime={currentTime}
            totalDuration={totalDuration}
            isPlaying={isPlaying}
            showCaptions={showCaptions}
            isMuted={isMuted}
            audioActive={audioActive}
            scenes={effectiveScenes}
            endBadgeText={reelConfig.endBadgeText}
            secondaryLabelA={reelConfig.secondarySceneLabelA}
            secondaryLabelB={reelConfig.secondarySceneLabelB}
            onTogglePlay={() => void handleTogglePlay()}
            onToggleMute={handleToggleMute}
            onSelectScene={(sec) => {
              const ratio = baseDurationSec > 0 ? sec / baseDurationSec : 0;
              const jump = ratio * totalDuration;
              setCurrentTime(jump);
              if (audioRef.current) audioRef.current.currentTime = jump;
            }}
          />
        </div>
      </div>
    </div>
  );
}
