import { useState } from 'react';
import { Pause, Play, Volume2, VolumeX, Plane, Building2, Compass } from 'lucide-react';
import {
  REEL_SCENES,
  SUBTITLE_CUES,
  TOTAL_REEL_DURATION_SEC,
  type ReelScene,
} from '../data/campaignData';

interface ReelPlayerProps {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  showCaptions: boolean;
  isMuted: boolean;
  audioActive: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSelectScene: (targetSec: number) => void;
}

function getScaledTime(timeSec: number, totalDuration: number): number {
  if (totalDuration <= 0) return 0;
  return (timeSec / totalDuration) * TOTAL_REEL_DURATION_SEC;
}

function getSceneAtTime(timeSec: number, totalDuration: number): ReelScene {
  const scaled = Math.max(
    0,
    Math.min(TOTAL_REEL_DURATION_SEC - 0.01, getScaledTime(timeSec, totalDuration))
  );
  return (
    REEL_SCENES.find((s) => scaled >= s.startSec && scaled < s.endSec) ||
    REEL_SCENES[0]
  );
}

function getSubtitleAtTime(timeSec: number, totalDuration: number): string {
  const scaled = Math.max(
    0,
    Math.min(TOTAL_REEL_DURATION_SEC - 0.01, getScaledTime(timeSec, totalDuration))
  );
  const cue = SUBTITLE_CUES.find(
    (c) => scaled >= c.startSec && scaled < c.endSec
  );
  return cue ? cue.text : SUBTITLE_CUES[0].text;
}

function formatTimecode(sec: number): string {
  const whole = Math.max(0, Math.floor(sec));
  const s = String(whole % 60).padStart(2, '0');
  const m = String(Math.floor(whole / 60)).padStart(2, '0');
  return `${m}:${s}`;
}

export function ReelPlayer({
  currentTime,
  totalDuration,
  isPlaying,
  showCaptions,
  isMuted,
  audioActive,
  onTogglePlay,
  onToggleMute,
  onSelectScene,
}: ReelPlayerProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scaledTime = getScaledTime(currentTime, totalDuration);
  const activeScene = getSceneAtTime(currentTime, totalDuration);
  const elapsedInScene = scaledTime - activeScene.startSec;

  const isScene2Secondary =
    activeScene.id === 'scene-2' &&
    typeof activeScene.matchCutOffsetSec === 'number' &&
    elapsedInScene >= activeScene.matchCutOffsetSec;

  const isStudioScene = activeScene.id === 'scene-4';
  const activeSubtitle = getSubtitleAtTime(currentTime, totalDuration);

  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  return (
    <div className="relative mx-auto w-full max-w-[360px] select-none">
      {/* 9:16 Vertical Commercial Frame */}
      <div
        className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-[#0B162C] border border-[#0B162C]/15 shadow-[0_24px_60px_-15px_rgba(11,22,44,0.28)]"
        role="region"
        aria-label="فيديو الإعلان العمودي 9:16"
      >
        {/* Top Progress Bars (Reels / Stories style) */}
        <div
          className="absolute inset-x-3 top-3 z-30 flex gap-1.5"
          dir="ltr"
          aria-label="مؤشر المشاهد"
        >
          {REEL_SCENES.map((scene) => {
            const duration = scene.endSec - scene.startSec;
            let fillPercent = 0;
            if (scaledTime >= scene.endSec) {
              fillPercent = 100;
            } else if (scaledTime > scene.startSec) {
              fillPercent = ((scaledTime - scene.startSec) / duration) * 100;
            }
            const targetRealTime =
              (scene.startSec / TOTAL_REEL_DURATION_SEC) * totalDuration;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelectScene(targetRealTime)}
                className="group h-1.5 flex-1 overflow-hidden rounded-full bg-white/30 transition-opacity hover:bg-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8922A]"
                aria-label={`الانتقال إلى ${scene.arabicTitle}`}
              >
                <div
                  className="h-full bg-[#C8922A] transition-[width] duration-100 ease-linear"
                  style={{ width: `${fillPercent}%` }}
                />
              </button>
            );
          })}
        </div>

        {/* Top Bar Inside Frame: Brand & Audio Toggle */}
        <div className="absolute inset-x-4 top-7 z-30 flex items-center justify-between">
          <button
            type="button"
            onClick={onToggleMute}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B162C]/55 text-white backdrop-blur-sm transition-colors hover:bg-[#0B162C]/80 focus-visible:outline-2 focus-visible:outline-[#C8922A]"
            aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-white/95 drop-shadow">
            <span className="font-mono-tabular">
              {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-latin font-semibold tracking-tight">Easy2Book</span>
          </div>
        </div>

        {/* Visual Scene Canvas Layer */}
        <div className="absolute inset-0">
          {REEL_SCENES.map((scene) => {
            const isActive = scene.id === activeScene.id;
            const animationName =
              scene.id === 'scene-1'
                ? 'reelDroneGlide 10s ease-out forwards'
                : scene.id === 'scene-2'
                  ? 'reelAirplaneClimb 6s ease-out forwards'
                  : scene.id === 'scene-3'
                    ? 'reelMadinahTilt 9s ease-out forwards'
                    : 'reelStudioDrift 10s ease-in-out infinite';

            const primaryBroken = failedImages[scene.primaryImage];

            return (
              <div
                key={scene.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Primary Image */}
                {!primaryBroken ? (
                  <img
                    src={scene.primaryImage}
                    alt={scene.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(scene.primaryImage)}
                    className={`h-full w-full object-cover ${
                      isActive && isPlaying ? 'reel-motion-active' : ''
                    }`}
                    style={
                      isActive && isPlaying
                        ? { animation: animationName }
                        : undefined
                    }
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#0B162C] to-[#1A2D4F] p-6 text-center text-white">
                    <Compass className="mb-3 h-10 w-10 text-[#C8922A]" />
                    <p className="text-base font-semibold">{scene.arabicTitle}</p>
                  </div>
                )}

                {/* Secondary Match-Cut Image for Scene 2 */}
                {scene.secondaryImage && (
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      isScene2Secondary
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-110 pointer-events-none'
                    }`}
                  >
                    {!failedImages[scene.secondaryImage] ? (
                      <img
                        src={scene.secondaryImage}
                        alt={scene.secondaryImageAlt || scene.imageAlt}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          handleImageError(scene.secondaryImage as string)
                        }
                        className={`h-full w-full object-cover ${
                          isActive && isPlaying && isScene2Secondary
                            ? 'reel-motion-active'
                            : ''
                        }`}
                        style={
                          isActive && isPlaying && isScene2Secondary
                            ? { animation: 'reelSuitePush 7.5s ease-out forwards' }
                            : undefined
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#0B162C] to-[#1E335A] p-6 text-center text-white">
                        <Building2 className="mb-3 h-10 w-10 text-[#C8922A]" />
                        <p className="text-base font-semibold">فندق ميسان الملتزم · مكة المكرمة</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Scene 4 Floating Gold Particles Overlay */}
                {scene.id === 'scene-4' && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[
                      { top: '18%', left: '22%', delay: '0s' },
                      { top: '26%', left: '76%', delay: '0.8s' },
                      { top: '48%', left: '15%', delay: '1.4s' },
                      { top: '54%', left: '84%', delay: '0.4s' },
                      { top: '34%', left: '52%', delay: '1.9s' },
                    ].map((p, idx) => (
                      <span
                        key={idx}
                        className="absolute h-2 w-2 rounded-full bg-[#C8922A]/70 blur-[0.5px]"
                        style={{
                          top: p.top,
                          left: p.left,
                          animation: isPlaying
                            ? `floatGoldParticle 3.2s ease-in-out ${p.delay} infinite`
                            : 'none',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contrast Scrim for Photographic Scenes (1-3) */}
        {!isStudioScene && (
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#070E1C]/90 via-[#070E1C]/25 to-[#070E1C]/45" />
        )}

        {/* Center Play/Pause Interactive Hit Target */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="group absolute inset-0 z-20 flex items-center justify-center focus-visible:outline-none"
          aria-label={isPlaying ? 'إيقاف الإعلان مؤقتاً' : 'تشغيل الإعلان'}
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-[#0B162C]/60 text-white backdrop-blur-md transition-all duration-200 ${
              isPlaying
                ? 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                : 'opacity-100 scale-100 hover:bg-[#C8922A] hover:border-[#C8922A]'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Play className="h-6 w-6 translate-x-[-1px]" aria-hidden="true" />
            )}
          </span>
        </button>

        {/* Scene 4 Centered Brand Lockup (Placed inside the designed negative space) */}
        {isStudioScene && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pt-12 pb-28 text-center">
            <img
              src="/assets/aistudio/logo_transparent_e9918557.png"
              alt="Easy2Book Centrale de Réservation"
              referrerPolicy="no-referrer"
              className="h-24 w-auto object-contain"
            />
            <p className="mt-1.5 text-base font-bold text-[#0B162C]">
              سفرتك أسهل
            </p>
            <div className="mt-3 h-px w-16 bg-[#C8922A]/60" />
            {showCaptions && (
              <div className="mt-3 space-y-1 text-[#0B162C]">
                <p className="text-xs font-bold text-[#9A6E1B]">
                  عدد غرف محدود جداً · عرض صالح لـ 15 ديسمبر 2026
                </p>
                <p className="font-mono-tabular text-lg font-extrabold text-[#0B162C]" dir="ltr">
                  📞 98 140 514
                </p>
                <p className="font-latin text-xs font-semibold text-[#C8922A]" dir="ltr">
                  www.easy2book.tn
                </p>
              </div>
            )}
          </div>
        )}

        {/* On-Screen Commercial Typography Overlays for Scenes 1-3 */}
        {showCaptions && !isStudioScene && (
          <div className="pointer-events-none absolute inset-x-5 bottom-24 z-20 text-right">
            <h3 className="text-2xl font-extrabold leading-snug text-white drop-shadow-md">
              {activeScene.overlayHeadline}
            </h3>
            <div className="mt-2.5 space-y-1.5">
              {activeScene.overlayLines.map((line, index) => (
                <p
                  key={index}
                  className="text-sm font-semibold leading-relaxed text-[#F8E7C2] drop-shadow"
                >
                  {line}
                </p>
              ))}
            </div>
            {activeScene.id === 'scene-2' && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-white/80">
                <Plane className="h-3.5 w-3.5 text-[#C8922A]" aria-hidden="true" />
                <span>
                  {isScene2Secondary
                    ? 'جناح فندقي فاخر · إطلالة مكة'
                    : 'رحلة مباشرة تونس - جدة'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Synchronized Voiceover Subtitle Bar */}
        <div
          className={`pointer-events-none absolute inset-x-4 bottom-4 z-20 rounded-xl px-3.5 py-2.5 text-center transition-colors ${
            isStudioScene
              ? 'bg-[#0B162C]/92 text-white'
              : 'bg-black/60 text-white backdrop-blur-sm'
          }`}
        >
          <p className="text-xs leading-relaxed font-medium text-white/95">
            {activeSubtitle}
          </p>
          {audioActive && (
            <p className="mt-1 text-[11px] font-medium text-[#F5D68A]">
              التعليق الصوتي باللهجة التونسية قيد التشغيل
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
