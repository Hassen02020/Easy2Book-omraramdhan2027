import {
  getReelConfig,
  TOTAL_REEL_DURATION_SEC,
  VOICE_OPTIONS,
  type ReelPresetId,
  type ReelScene,
} from '../data/campaignData';

export interface VideoExportResult {
  blobUrl: string;
  downloadUrl: string;
  downloadPath: string;
  fileName: string;
  sizeBytes: number;
  durationSec: number;
  hasAudio: boolean;
  format: 'mp4' | 'webm';
  source: 'server_mp4' | 'browser_webm';
}

interface OverlaySegment {
  startSec: number;
  endSec: number;
  scene: ReelScene;
}

const WIDTH = 720;
const HEIGHT = 1280;

function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function buildOverlayTimeline(scenes: ReelScene[]): OverlaySegment[] {
  return scenes.map((scene) => ({
    startSec: scene.startSec,
    endSec: scene.endSec,
    scene,
  }));
}

function renderOverlayToCanvas(
  ctx: CanvasRenderingContext2D,
  seg: OverlaySegment,
  scenes: ReelScene[],
  endBadgeText: string,
  showCaptions: boolean,
  logoImg: HTMLImageElement | null
) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const isStudioScene = seg.scene.id === 'scene-4';
  const midTime = (seg.startSec + seg.endSec) / 2;

  // 1. Subtle editorial gradient scrim for photographic scenes (1-3)
  if (!isStudioScene) {
    const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grad.addColorStop(0, 'rgba(7, 14, 28, 0.50)');
    grad.addColorStop(0.32, 'rgba(7, 14, 28, 0.12)');
    grad.addColorStop(0.62, 'rgba(7, 14, 28, 0.35)');
    grad.addColorStop(1, 'rgba(7, 14, 28, 0.90)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // 2. Top Story/Reel Progress Bars
  const barY = 26;
  const barGap = 10;
  const sidePad = 24;
  const totalBarsWidth = WIDTH - sidePad * 2 - barGap * (scenes.length - 1);
  const barW = totalBarsWidth / scenes.length;

  scenes.forEach((sc, idx) => {
    const bx = sidePad + idx * (barW + barGap);
    ctx.fillStyle = isStudioScene ? 'rgba(11, 22, 44, 0.16)' : 'rgba(255, 255, 255, 0.32)';
    drawRoundedRect(ctx, bx, barY, barW, 8, 4);
    ctx.fill();

    let pct = 0;
    if (midTime >= sc.endSec) pct = 1;
    else if (midTime > sc.startSec) {
      pct = Math.min(1, (midTime - sc.startSec) / (sc.endSec - sc.startSec));
    }
    if (pct > 0) {
      ctx.fillStyle = '#C8922A';
      drawRoundedRect(ctx, bx, barY, Math.max(8, barW * pct), 8, 4);
      ctx.fill();
    }
  });

  // 3. Brand Top Badge
  ctx.save();
  ctx.direction = 'ltr';
  ctx.textAlign = 'right';
  ctx.font = '700 24px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillStyle = isStudioScene ? '#0B162C' : 'rgba(255, 255, 255, 0.95)';
  ctx.fillText('Easy2Book', WIDTH - 28, 76);
  ctx.restore();

  // 4. Scene 4 Centered Brand Lockup
  if (isStudioScene) {
    const centerX = WIDTH / 2;
    if (logoImg) {
      const targetH = 156;
      const ratio = logoImg.width / Math.max(1, logoImg.height);
      const targetW = targetH * ratio;
      ctx.drawImage(logoImg, centerX - targetW / 2, 340, targetW, targetH);
    }

    ctx.save();
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.font = '800 32px Cairo, sans-serif';
    ctx.fillStyle = '#0B162C';
    ctx.fillText('سفرتك أسهل', centerX, 540);

    ctx.fillStyle = 'rgba(200, 146, 42, 0.65)';
    ctx.fillRect(centerX - 64, 566, 128, 2);

    if (showCaptions) {
      ctx.font = '700 24px Cairo, sans-serif';
      ctx.fillStyle = '#9A6E1B';
      ctx.fillText(endBadgeText, centerX, 616);

      ctx.direction = 'ltr';
      ctx.font = '800 36px "JetBrains Mono", monospace';
      ctx.fillStyle = '#0B162C';
      ctx.fillText('98 140 514', centerX, 674);

      ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#C8922A';
      ctx.fillText('www.easy2book.tn', centerX, 718);
    }
    ctx.restore();
  }

  // 5. On-Screen Commercial Typography (Scenes 1-3)
  if (showCaptions && !isStudioScene) {
    ctx.save();
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 12;

    const lines = seg.scene.overlayLines;
    const baseBottom = HEIGHT - 96;
    const lineHeight = 40;
    const linesStartY = baseBottom - (lines.length - 1) * lineHeight;

    ctx.font = '800 42px Cairo, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(seg.scene.overlayHeadline, WIDTH - 38, linesStartY - 48);

    ctx.font = '700 26px Cairo, sans-serif';
    ctx.fillStyle = '#F8E7C2';
    lines.forEach((line, idx) => {
      ctx.fillText(line, WIDTH - 38, linesStartY + idx * lineHeight);
    });
    ctx.restore();
  }
}

async function renderBrowserWebmFallback(params: {
  voiceName: string;
  showCaptions: boolean;
  preset?: ReelPresetId;
  onProgress?: (pct: number, label: string) => void;
}): Promise<VideoExportResult> {
  const { voiceName, showCaptions, preset = 'omra', onProgress } = params;
  const config = getReelConfig(preset);
  const scenes = config.scenes;
  onProgress?.(10, 'Préparation du rendu navigateur...');

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponible');

  const [logoImg, ...sceneImgs] = await Promise.all([
    loadImageSafe('/assets/aistudio/logo_transparent_e9918557.png'),
    ...scenes.flatMap((sc) => [
      loadImageSafe(sc.primaryImage),
      sc.secondaryImage ? loadImageSafe(sc.secondaryImage) : Promise.resolve(null),
    ]),
  ]);

  const imgMap = new Map<string, HTMLImageElement | null>();
  let idx = 0;
  for (const sc of scenes) {
    imgMap.set(sc.primaryImage, sceneImgs[idx++]);
    const secImg = sceneImgs[idx++];
    if (sc.secondaryImage) imgMap.set(sc.secondaryImage, secImg);
  }

  const timeline = buildOverlayTimeline(scenes);
  const mimeCandidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  const mimeType =
    mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  // Quick 16s condensed browser capture so fallback completes promptly if server ffmpeg is unavailable
  const fallbackDuration = 16;
  const scale = fallbackDuration / TOTAL_REEL_DURATION_SEC;

  const stream = canvas.captureStream(24);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2_800_000,
  });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.width = WIDTH;
  overlayCanvas.height = HEIGHT;
  const overlayCtx = overlayCanvas.getContext('2d');

  const startedAt = performance.now();
  recorder.start(250);

  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const pct = Math.min(99, Math.round((elapsed / fallbackDuration) * 90) + 10);
      onProgress?.(pct, 'Encodage vidéo WebM...');

      const virtualSec = Math.min(
        TOTAL_REEL_DURATION_SEC - 0.01,
        elapsed / scale
      );
      const seg =
        timeline.find(
          (s) => virtualSec >= s.startSec && virtualSec < s.endSec
        ) ?? timeline[0];

      const elapsedInScene = virtualSec - seg.scene.startSec;
      const useSec =
        seg.scene.id === 'scene-2' &&
        typeof seg.scene.matchCutOffsetSec === 'number' &&
        elapsedInScene >= seg.scene.matchCutOffsetSec &&
        seg.scene.secondaryImage;

      const bgImg = imgMap.get(
        useSec ? (seg.scene.secondaryImage as string) : seg.scene.primaryImage
      );

      if (bgImg) {
        const imgAspect = bgImg.width / Math.max(1, bgImg.height);
        const targetAspect = WIDTH / HEIGHT;
        let dw = WIDTH;
        let dh = HEIGHT;
        let dx = 0;
        let dy = 0;
        if (imgAspect > targetAspect) {
          dw = HEIGHT * imgAspect;
          dx = (WIDTH - dw) / 2;
        } else {
          dh = WIDTH / imgAspect;
          dy = (HEIGHT - dh) / 2;
        }
        ctx.drawImage(bgImg, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = '#0B162C';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      if (overlayCtx) {
        renderOverlayToCanvas(overlayCtx, seg, scenes, config.endBadgeText, showCaptions, logoImg);
        ctx.drawImage(overlayCanvas, 0, 0);
      }

      if (elapsed >= fallbackDuration) {
        recorder.stop();
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });

  await new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  const blob = new Blob(chunks, { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);
  onProgress?.(100, 'Lien prêt');

  return {
    blobUrl,
    downloadUrl: blobUrl,
    downloadPath: blobUrl,
    fileName: `${config.outputBaseName}-${voiceName}.webm`,
    sizeBytes: blob.size,
    durationSec: fallbackDuration,
    hasAudio: false,
    format: 'webm',
    source: 'browser_webm',
  };
}

export async function generateVideoDownloadLink(params: {
  voiceName: string;
  showCaptions: boolean;
  preset?: ReelPresetId;
  onProgress?: (pct: number, label: string) => void;
}): Promise<VideoExportResult> {
  const { voiceName, showCaptions, preset = 'omra', onProgress } = params;
  const config = getReelConfig(preset);
  const scenes = config.scenes;

  try {
    onProgress?.(15, 'Préparation des calques HD 9:16...');
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const logoImg = await loadImageSafe(
      '/assets/aistudio/logo_transparent_e9918557.png'
    );

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponible');

    const segments = buildOverlayTimeline(scenes);
    const overlays = segments.map((seg) => {
      renderOverlayToCanvas(ctx, seg, scenes, config.endBadgeText, showCaptions, logoImg);
      return {
        startSec: seg.startSec,
        endSec: seg.endSec,
        pngBase64: canvas.toDataURL('image/png'),
      };
    });

    onProgress?.(45, 'Assemblage MP4 & voix tunisienne sur le serveur...');

    const voiceStyle = VOICE_OPTIONS.find((v) => v.id === voiceName)?.stylePrompt;
    const res = await fetch('/api/video/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preset,
        script: config.script,
        voiceName,
        voiceStyle,
        showCaptions,
        overlays,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as {
      downloadPath: string;
      fileName: string;
      sizeBytes: number;
      durationSec: number;
      hasAudio: boolean;
      format: 'mp4';
    };

    onProgress?.(85, 'Téléchargement du flux MP4 en mémoire...');
    const fileRes = await fetch(data.downloadPath, {
      credentials: 'include',
    });
    if (!fileRes.ok) {
      throw new Error(`Téléchargement HTTP ${fileRes.status}`);
    }
    const mp4Blob = await fileRes.blob();
    const blobUrl = URL.createObjectURL(mp4Blob);

    onProgress?.(100, 'Vidéo MP4 prête au téléchargement');
    const absoluteUrl = `${window.location.origin}${data.downloadPath}`;

    return {
      blobUrl,
      downloadUrl: absoluteUrl,
      downloadPath: data.downloadPath,
      fileName: data.fileName,
      sizeBytes: mp4Blob.size || data.sizeBytes,
      durationSec: data.durationSec,
      hasAudio: data.hasAudio,
      format: 'mp4',
      source: 'server_mp4',
    };
  } catch (err) {
    console.warn('Server MP4 export failed, switching to browser WebM fallback:', err);
    return renderBrowserWebmFallback(params);
  }
}

export function triggerVideoBlobDownload(result: VideoExportResult): void {
  const link = document.createElement('a');
  link.href = result.blobUrl || result.downloadUrl;
  link.download = result.fileName;
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    document.body.removeChild(link);
  }, 150);
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} Mo`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}
