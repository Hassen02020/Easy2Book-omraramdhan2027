import {
  getReelConfig,
  TOTAL_REEL_DURATION_SEC,
  VOICE_OPTIONS,
  type ReelPresetId,
  type ReelScene,
} from '../data/campaignData';
import {
  drawRealFlagCanvas,
  EVISA_FLAG_CATALOG,
} from './realCountryFlags';

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

  const isStudioScene = Boolean(
    seg.scene.isStudioLockup ?? seg.scene.id === 'scene-4'
  );
  const isLtr = seg.scene.overlayDir === 'ltr';
  const midTime = (seg.startSec + seg.endSec) / 2;

  // 1. Subtle editorial gradient scrim for photographic scenes
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
    ctx.fillStyle = isStudioScene
      ? 'rgba(11, 22, 44, 0.16)'
      : 'rgba(255, 255, 255, 0.32)';
    drawRoundedRect(ctx, bx, barY, barW, 8, 4);
    ctx.fill();

    let pct = 0;
    if (midTime >= sc.endSec) pct = 1;
    else if (midTime > sc.startSec) {
      pct = Math.min(
        1,
        (midTime - sc.startSec) / Math.max(0.5, sc.endSec - sc.startSec)
      );
    }
    if (pct > 0) {
      ctx.fillStyle = '#C8922A';
      drawRoundedRect(ctx, bx, barY, Math.max(8, barW * pct), 8, 4);
      ctx.fill();
    }
  });

  // 3. Brand Top Badge (strictly omitted when hideBrandOverlay is set on scenes 1-4)
  if (!seg.scene.hideBrandOverlay) {
    ctx.save();
    ctx.direction = 'ltr';
    ctx.textAlign = 'right';
    ctx.font = '700 24px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillStyle = isStudioScene ? '#0B162C' : 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('Easy2Book', WIDTH - 28, 76);
    ctx.restore();
  }

  // 4. Studio Scene Centered Brand Lockup
  if (isStudioScene) {
    const centerX = WIDTH / 2;

    if (seg.scene.endCardStyle === 'cream_gold') {
      // Elegant warm cream-and-gold minimalist background card (covers any footage)
      const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
      bgGrad.addColorStop(0, '#FFFDF8');
      bgGrad.addColorStop(0.55, '#F7EFE0');
      bgGrad.addColorStop(1, '#EFE0BE');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Subtle gold inner border frame
      ctx.save();
      ctx.strokeStyle = 'rgba(200, 146, 42, 0.40)';
      ctx.lineWidth = 2.5;
      drawRoundedRect(ctx, 28, 28, WIDTH - 56, HEIGHT - 56, 30);
      ctx.stroke();

      // Re-draw subtle progress bars cleanly on top of cream background
      scenes.forEach((sc, idx) => {
        const bx = sidePad + idx * (barW + barGap);
        ctx.fillStyle = 'rgba(16, 45, 69, 0.14)';
        drawRoundedRect(ctx, bx, barY, barW, 8, 4);
        ctx.fill();
        let pct = 0;
        if (midTime >= sc.endSec) pct = 1;
        else if (midTime > sc.startSec) {
          pct = Math.min(
            1,
            (midTime - sc.startSec) / Math.max(0.5, sc.endSec - sc.startSec)
          );
        }
        if (pct > 0) {
          ctx.fillStyle = '#C8922A';
          drawRoundedRect(ctx, bx, barY, Math.max(8, barW * pct), 8, 4);
          ctx.fill();
        }
      });

      // 1. Official Easy2Book Logo
      if (logoImg) {
        const targetH = 168;
        const ratio = logoImg.width / Math.max(1, logoImg.height);
        const targetW = Math.min(WIDTH - 140, targetH * ratio);
        const finalH = targetW / Math.max(0.1, ratio);
        ctx.drawImage(logoImg, centerX - targetW / 2, 310, targetW, finalH);
      }

      // Gold hairline separator
      ctx.fillStyle = 'rgba(200, 146, 42, 0.65)';
      ctx.fillRect(centerX - 84, 522, 168, 2.5);

      // 2. Bold Arabic Middle Headline
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.font = '900 40px Cairo, sans-serif';
      ctx.fillStyle = '#102D45';
      ctx.fillText(
        seg.scene.overlayHeadline || 'مع Easy2Book رحلتك أسهل ✨',
        centerX,
        590,
        WIDTH - 96
      );

      // 3. Warm Gold Sub-headline
      ctx.font = '800 32px Cairo, sans-serif';
      ctx.fillStyle = '#9A6E1B';
      ctx.fillText(endBadgeText || 'توكل على ربي! 🤲', centerX, 650, WIDTH - 96);

      // 4. Bottom Contact Block (High-Contrast Dark Navy & Gold Card)
      const boxW = 490;
      const boxH = 178;
      const boxX = Math.round((WIDTH - boxW) / 2);
      const boxY = 716;
      ctx.fillStyle = '#102D45';
      drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(200, 146, 42, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.direction = 'ltr';
      ctx.textAlign = 'center';
      ctx.font = '900 44px "JetBrains Mono", monospace';
      ctx.fillStyle = '#F6D365';
      ctx.fillText('📞 98 140 514', centerX, boxY + 76);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fillRect(centerX - 90, boxY + 102, 180, 1.5);

      ctx.font = '700 28px "Plus Jakarta Sans", Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('🌐 www.easy2book.tn', centerX, boxY + 148);
      ctx.restore();
    } else {
      if (logoImg) {
        const targetH = 156;
        const ratio = logoImg.width / Math.max(1, logoImg.height);
        const targetW = targetH * ratio;
        ctx.drawImage(logoImg, centerX - targetW / 2, 340, targetW, targetH);
      }

      ctx.save();
      if (isLtr) {
        ctx.direction = 'ltr';
        ctx.textAlign = 'center';
        ctx.font = '800 30px "Plus Jakarta Sans", Inter, sans-serif';
        ctx.fillStyle = '#0B162C';
        ctx.fillText('The easiest way to travel', centerX, 536, WIDTH - 64);
      } else {
        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        ctx.font = '800 32px Cairo, sans-serif';
        ctx.fillStyle = '#0B162C';
        ctx.fillText('سفرتك أسهل', centerX, 540);
      }

      ctx.fillStyle = 'rgba(200, 146, 42, 0.65)';
      ctx.fillRect(centerX - 64, 566, 128, 2);

      if (showCaptions) {
        if (isLtr && seg.scene.overlayHeadline) {
          ctx.direction = 'ltr';
          ctx.font = '800 30px "Plus Jakarta Sans", Inter, sans-serif';
          ctx.fillStyle = '#102D45';
          ctx.fillText(seg.scene.overlayHeadline, centerX, 608, WIDTH - 64);

          ctx.font = '700 21px "Plus Jakarta Sans", Inter, sans-serif';
          ctx.fillStyle = '#9A6E1B';
          ctx.fillText(endBadgeText, centerX, 646, WIDTH - 64);

          ctx.font = '800 34px "JetBrains Mono", monospace';
          ctx.fillStyle = '#0B162C';
          ctx.fillText('98 140 514', centerX, 700);

          ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#C8922A';
          ctx.fillText('www.easy2book.tn', centerX, 742);
        } else {
          ctx.font = '700 24px Cairo, sans-serif';
          ctx.fillStyle = '#9A6E1B';
          ctx.fillText(endBadgeText, centerX, 616, WIDTH - 64);

          ctx.direction = 'ltr';
          ctx.font = '800 36px "JetBrains Mono", monospace';
          ctx.fillStyle = '#0B162C';
          ctx.fillText('98 140 514', centerX, 674);

          ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#C8922A';
          ctx.fillText('www.easy2book.tn', centerX, 718);
        }
      }
      ctx.restore();
    }
  }

  // 5. On-Screen Commercial Typography + Real Country Flags
  if (showCaptions && !isStudioScene) {
    ctx.save();
    const lines = seg.scene.overlayLines;
    const flags = seg.scene.flagCodes ?? [];

    if (seg.scene.overlayPosition === 'center') {
      const cardW = WIDTH - 64;
      const cardX = 32;
      const hasSingleFlag = flags.length === 1;
      const cardH = (hasSingleFlag ? 74 : 0) + 110 + lines.length * 36;
      const cardY = Math.round((HEIGHT - cardH) / 2);

      ctx.fillStyle = 'rgba(7, 14, 28, 0.78)';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();

      let cursorY = cardY + 34;
      if (hasSingleFlag) {
        const fw = 78;
        const fh = 52;
        drawRealFlagCanvas(ctx, flags[0], (WIDTH - fw) / 2, cursorY, fw, fh);
        cursorY += fh + 38;
      } else {
        cursorY += 28;
      }

      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 10;
      ctx.direction = isLtr ? 'ltr' : 'rtl';
      ctx.textAlign = 'center';
      ctx.font = isLtr
        ? '900 42px "Plus Jakarta Sans", Inter, sans-serif'
        : '900 44px Cairo, sans-serif';
      ctx.fillStyle = '#F6D365';
      ctx.fillText(seg.scene.overlayHeadline, WIDTH / 2, cursorY, cardW - 48);

      ctx.font = '700 25px Cairo, "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      lines.forEach((line, idx) => {
        ctx.fillText(line, WIDTH / 2, cursorY + 46 + idx * 36, cardW - 48);
      });
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 12;

      const baseBottom = HEIGHT - 92;
      const lineHeight = 38;
      const linesStartY = baseBottom - (lines.length - 1) * lineHeight;
      const maxWidth = WIDTH - 76;

      // Real Country Flags Grid above Headline (e.g., 10 E-Visa Destinations)
      if (flags.length > 1) {
        ctx.save();
        ctx.shadowBlur = 0;
        const cols = 2;
        const rows = Math.ceil(flags.length / cols);
        const boxPad = 18;
        const cellGapX = 14;
        const cellGapY = 12;
        const cellH = 44;
        const gridW = WIDTH - 64;
        const gridX = 32;
        const gridH = boxPad * 2 + rows * cellH + (rows - 1) * cellGapY;
        const gridY = linesStartY - 102 - gridH;

        ctx.fillStyle = 'rgba(7, 14, 28, 0.78)';
        drawRoundedRect(ctx, gridX, gridY, gridW, gridH, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const cellW = (gridW - boxPad * 2 - cellGapX) / cols;
        flags.forEach((code, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cx = gridX + boxPad + col * (cellW + cellGapX);
          const cy = gridY + boxPad + row * (cellH + cellGapY);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
          drawRoundedRect(ctx, cx, cy, cellW, cellH, 10);
          ctx.fill();

          drawRealFlagCanvas(ctx, code, cx + 10, cy + 9, 39, 26);

          ctx.direction = 'ltr';
          ctx.textAlign = 'left';
          ctx.font = '700 21px "Plus Jakarta Sans", Inter, sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(
            EVISA_FLAG_CATALOG[code]?.nameFr ?? code,
            cx + 60,
            cy + 29,
            cellW - 70
          );
        });
        ctx.restore();
      }

      if (isLtr) {
        ctx.direction = 'ltr';
        ctx.textAlign = 'left';
        ctx.font = '800 38px "Plus Jakarta Sans", Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(seg.scene.overlayHeadline, 38, linesStartY - 46, maxWidth);

        ctx.font = '700 24px "Plus Jakarta Sans", Inter, sans-serif';
        ctx.fillStyle = '#F8E7C2';
        lines.forEach((line, idx) => {
          ctx.fillText(line, 38, linesStartY + idx * lineHeight, maxWidth);
        });
      } else {
        ctx.direction = 'rtl';
        ctx.textAlign = 'right';
        ctx.font = '800 42px Cairo, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(seg.scene.overlayHeadline, WIDTH - 38, linesStartY - 48, maxWidth);

        ctx.font = '700 26px Cairo, sans-serif';
        ctx.fillStyle = '#F8E7C2';
        lines.forEach((line, idx) => {
          ctx.fillText(line, WIDTH - 38, linesStartY + idx * lineHeight, maxWidth);
        });
      }
    }
    ctx.restore();
  }
}

async function renderBrowserWebmFallback(params: {
  voiceName: string;
  showCaptions: boolean;
  preset?: ReelPresetId;
  customScript?: string;
  scenesOverride?: ReelScene[];
  autoDownload?: boolean;
  onProgress?: (pct: number, label: string) => void;
}): Promise<VideoExportResult> {
  const {
    voiceName,
    showCaptions,
    preset = 'omra',
    scenesOverride,
    onProgress,
  } = params;
  const config = getReelConfig(preset);
  const scenes = scenesOverride && scenesOverride.length > 0 ? scenesOverride : config.scenes;
  const baseTotalSec = Math.max(
    1,
    config.totalDurationSec || TOTAL_REEL_DURATION_SEC
  );
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

  // Quick condensed browser capture so fallback completes promptly if server ffmpeg is unavailable
  const fallbackDuration = Math.min(16, baseTotalSec);
  const scale = fallbackDuration / baseTotalSec;

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

      const virtualSec = Math.min(baseTotalSec - 0.01, elapsed / scale);
      const seg =
        timeline.find(
          (s) => virtualSec >= s.startSec && virtualSec < s.endSec
        ) ?? timeline[0];

      const elapsedInScene = virtualSec - seg.scene.startSec;
      const useSec =
        Boolean(seg.scene.secondaryImage) &&
        typeof seg.scene.matchCutOffsetSec === 'number' &&
        elapsedInScene >= seg.scene.matchCutOffsetSec;

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
  customScript?: string;
  scenesOverride?: ReelScene[];
  autoDownload?: boolean;
  onProgress?: (pct: number, label: string) => void;
}): Promise<VideoExportResult> {
  const {
    voiceName,
    showCaptions,
    preset = 'omra',
    customScript,
    scenesOverride,
    autoDownload = false,
    onProgress,
  } = params;
  const config = getReelConfig(preset);
  const scenes = scenesOverride && scenesOverride.length > 0 ? scenesOverride : config.scenes;
  const resolvedScript = customScript?.trim() || config.script;

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
        script: resolvedScript,
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

    const result: VideoExportResult = {
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
    if (autoDownload) {
      triggerVideoBlobDownload(result);
    }
    return result;
  } catch (err) {
    console.warn('Server MP4 export failed, switching to browser WebM fallback:', err);
    const fallbackResult = await renderBrowserWebmFallback(params);
    if (autoDownload) {
      triggerVideoBlobDownload(fallbackResult);
    }
    return fallbackResult;
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
