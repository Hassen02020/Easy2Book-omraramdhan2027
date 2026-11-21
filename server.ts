import "dotenv/config";
import express from "express";
import { execFile } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { GoogleGenAI, Type } from "@google/genai";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
const DATA_DIR = path.join(__dirname, "data");
const CREATOR_STORE_FILE = path.join(DATA_DIR, "creator-studio.json");
const VIDEOS_DIR = path.join(DATA_DIR, "generated-videos");
const BROCHURES_DIR = path.join(DATA_DIR, "generated-brochures");
const VOICEOVER_CACHE_DIR = path.join(DATA_DIR, "voiceover-cache");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "v1beta",
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

interface CachedAudio {
  audioBase64: string;
  mimeType: string;
  createdAt: number;
}

const voiceoverCache = new Map<string, CachedAudio>();

const DEFAULT_SCRIPT =
  "تحب تعيش روحانية شهر رمضان الكل في مكة المكرمة، وإنت مرتاح البال ومن غير حتى تعب؟ مع Easy2Book، حضرنالك برنامج عمرة شهر رمضان كامل: طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة، وإقامة مريحة في فندق ميسان الملتزم، وزيد معاهم رحلة للمدينة المنورة! الأسعار تبدأ من خمسة آلاف وتسعمية دينار للشخص في غرفة رباعية أو خماسية، ستة آلاف وأربعمية دينار في غرفة ثلاثية، وستة آلاف وتسعمية دينار في غرفة ثنائية... مع تخفيض ميتين دينار للعائلات انطلاقاً من شخصين! وللمجموعات أكثر من عشرة أشخاص كلمونا للحصول على الإمكانية. عدد الغرف محدود جداً والعرض صالح لـ خمسطاش ديسمبر ألفين وستة وعشرين! كلمنا توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا احجز على easy2book.tn. Easy2Book... سفرتك أسهل!";

const DEFAULT_FLIGHTS_FERRIES_SCRIPT =
  "15 onglets ouverts juste pour réserver un billet d’avion ou de bateau ? Arrête tout de suite. Que tu partes par les airs ou par la mer, il y a beaucoup plus simple. Sur Easy2Book, toutes les compagnies aériennes et maritimes sont au même endroit. Que ce soit pour un vol express ou ta traversée d’été en Méditerranée, Tunisie-France, Italie ou les îles, tu compares, tu choisis ton tarif, et c’est réservé en quelques secondes. Pas de frais surprises à la fin, ton billet est directement dans ton téléphone. Easy2Book, the easiest way to travel. Prépare tes valises, clique sur le lien et réserve ton prochain départ maintenant.";

const DEFAULT_VISA_EVISA_SCRIPT =
  "تحب تسافر وتكتشف العالم؟ وعندك Passeport تونسي؟ اسمع المعلومة هاذي! فمّا برشا وجهات في العالم تنجم تقدّم على الفيزا متاعها إلكترونياً، من غير ما تبدأ بالإجراءات التقليدية متاع السفارة. من إفريقيا لآسيا، ومن أوروبا للأمريكيتين… وجهات مختلفة تستنّاك! كيف رواندا، تنزانيا، الكاميرون، قطر، البحرين، فيتنام، أوزبكستان، ألبانيا، كولومبيا، والبهاماس! مع Easy2Book، نعاونك تفهم إجراءات التأشيرة، تعرف الوثائق المطلوبة، وتحضّر مطلبك بطريقة أسهل. ما تخليش إجراءات الفيزا توقف أحلامك! Easy2Book — خطوتك الأولى نحو العالم! ابعثلنا توّة، واسألنا على وجهتك!";

const DEFAULT_VISA_EGYPT_SCRIPT =
  "مبرمج مشية لمصر ومطلوب عليك خطاب ضمان؟ ابعث تسكرتك ونسخة من باسبورك! مطار الإنطلاق تونس أو أي مكان في العالم، مطار الوصول القاهرة، الغردقة، شرم الشيخ! في أربع ساعات يكون عندك تصريح أمني وضمان من غير حتى تعقيد. معانا، Easy2Book... سفرتك أسهل!";

const ALLOWED_VOICES = new Set([
  "Elias",
  "Layla",
  "Omar",
  "Sarah",
  "Charon",
  "Kore",
  "Fenrir",
  "Puck",
  "Zephyr",
  "Aoede",
  "Orus",
  "Leda",
  "Sulafat",
  "Achird",
  "Algenib",
  "Enceladus",
]);

const VOICE_PERSONA_MAP: Record<
  string,
  { prebuiltVoice: string; defaultStyle: string }
> = {
  Elias: {
    prebuiltVoice: "Algenib",
    defaultStyle:
      "Deep, resonant, authoritative masculine narrative storyteller voice in Tunisian Arabic with calm, captivating pacing.",
  },
  Layla: {
    prebuiltVoice: "Sulafat",
    defaultStyle:
      "Soft, gentle, warmly welcoming feminine voice in Tunisian Arabic evoking hospitality and peace of mind.",
  },
  Omar: {
    prebuiltVoice: "Orus",
    defaultStyle:
      "Dynamic, inspiring, confident masculine Tunisian Arabic voice with uplifting commercial clarity.",
  },
  Sarah: {
    prebuiltVoice: "Zephyr",
    defaultStyle:
      "Clear, articulate, polished professional feminine voice in Tunisian Arabic for travel and hospitality offers.",
  },
};

function readCreatorStore(): unknown | null {
  try {
    if (fs.existsSync(CREATOR_STORE_FILE)) {
      const raw = fs.readFileSync(CREATOR_STORE_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read creator store:", err);
  }
  return null;
}

function writeCreatorStore(state: unknown): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(CREATOR_STORE_FILE, JSON.stringify(state, null, 2), "utf8");
}

async function synthesizeVoiceoverWav(params: {
  script?: string;
  voiceName?: string;
  style?: string;
}): Promise<{
  audioBase64: string;
  mimeType: string;
  voiceName: string;
  cached: boolean;
}> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const rawScript =
    typeof params.script === "string" && params.script.trim()
      ? params.script.trim()
      : DEFAULT_SCRIPT;
  const script = rawScript.slice(0, 1500);

  const requestedVoice =
    typeof params.voiceName === "string" ? params.voiceName : "Charon";
  const voiceName = ALLOWED_VOICES.has(requestedVoice)
    ? requestedVoice
    : "Charon";
  const persona = VOICE_PERSONA_MAP[voiceName];
  const apiPrebuiltVoice = persona?.prebuiltVoice ?? voiceName;

  const hasArabic = /[\u0600-\u06FF]/.test(script);
  const rawStyle =
    typeof params.style === "string" && params.style.trim()
      ? params.style.trim().slice(0, 200)
      : persona?.defaultStyle ??
        "Warm, reassuring, inspiring Tunisian Arabic commercial narrator with dignified pacing and clear pronunciation.";
  const style =
    !hasArabic && rawStyle.toLowerCase().includes("arabic")
      ? "Dynamic, energetic, confident French commercial reel narrator with crisp jump-cut pacing, natural pronunciation, and engaging warmth."
      : rawStyle;

  const cacheKey = `${voiceName}::${style}::${script}`;
  const cached = voiceoverCache.get(cacheKey);
  if (cached) {
    return {
      audioBase64: cached.audioBase64,
      mimeType: cached.mimeType,
      voiceName,
      cached: true,
    };
  }

  const hash = crypto.createHash("sha256").update(cacheKey).digest("hex").slice(0, 24);
  const diskCachePath = path.join(VOICEOVER_CACHE_DIR, `${hash}.wav`);
  if (fs.existsSync(diskCachePath)) {
    const audioBase64 = fs.readFileSync(diskCachePath).toString("base64");
    voiceoverCache.set(cacheKey, {
      audioBase64,
      mimeType: "audio/wav",
      createdAt: Date.now(),
    });
    return {
      audioBase64,
      mimeType: "audio/wav",
      voiceName,
      cached: true,
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash-lite-tts",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: script,
            speechMetadata: {
              style,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: apiPrebuiltVoice },
        },
      },
    },
  });

  const base64Audio =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error("EMPTY_AUDIO_RESPONSE");
  }

  if (voiceoverCache.size >= 32) {
    const oldestKey = voiceoverCache.keys().next().value;
    if (oldestKey) voiceoverCache.delete(oldestKey);
  }

  voiceoverCache.set(cacheKey, {
    audioBase64: base64Audio,
    mimeType: "audio/wav",
    createdAt: Date.now(),
  });

  try {
    fs.mkdirSync(VOICEOVER_CACHE_DIR, { recursive: true });
    fs.writeFileSync(diskCachePath, Buffer.from(base64Audio, "base64"));
  } catch {
    // Non-fatal disk cache write failure
  }

  return {
    audioBase64: base64Audio,
    mimeType: "audio/wav",
    voiceName,
    cached: false,
  };
}

function cleanupOldGeneratedVideos(): void {
  try {
    if (fs.existsSync(VIDEOS_DIR)) {
      const files = fs
        .readdirSync(VIDEOS_DIR)
        .filter((f) => f.endsWith(".mp4"))
        .map((f) => {
          const full = path.join(VIDEOS_DIR, f);
          return { name: f, full, mtimeMs: fs.statSync(full).mtimeMs };
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);
      for (const stale of files.slice(24)) {
        fs.unlinkSync(stale.full);
      }
    }
    if (fs.existsSync(DATA_DIR)) {
      const now = Date.now();
      for (const entry of fs.readdirSync(DATA_DIR)) {
        if (!entry.startsWith("tmp-video-")) continue;
        const full = path.join(DATA_DIR, entry);
        const stat = fs.statSync(full);
        if (now - stat.mtimeMs > 10 * 60 * 1000) {
          fs.rmSync(full, { recursive: true, force: true });
        }
      }
    }
  } catch {
    // Best-effort cleanup
  }
}

function cleanupOldGeneratedBrochures(): void {
  try {
    if (fs.existsSync(BROCHURES_DIR)) {
      const files = fs
        .readdirSync(BROCHURES_DIR)
        .filter((f) => f.endsWith(".pdf"))
        .map((f) => {
          const full = path.join(BROCHURES_DIR, f);
          return { name: f, full, mtimeMs: fs.statSync(full).mtimeMs };
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);
      for (const stale of files.slice(24)) {
        fs.unlinkSync(stale.full);
      }
    }
  } catch {
    // Best-effort cleanup
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "35mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // ==========================================================
  // LANDING PAGE CREATOR PERSISTENCE (NO CRM / NO LEADS)
  // ==========================================================
  app.get("/api/creator/state", (_req, res) => {
    const state = readCreatorStore();
    return res.json({ state });
  });

  app.put("/api/creator/state", (req, res) => {
    const state = req.body;
    if (
      !state ||
      typeof state !== "object" ||
      !Array.isArray((state as { pages?: unknown }).pages) ||
      !Array.isArray((state as { templates?: unknown }).templates)
    ) {
      return res.status(400).json({
        error: "Format d'état Landing Page Studio invalide.",
      });
    }
    try {
      writeCreatorStore(state);
      return res.json({ saved: true });
    } catch (err) {
      console.error("Failed to save creator store:", err);
      return res.status(500).json({
        error: "Impossible d'enregistrer l'état du Studio.",
      });
    }
  });

  app.delete("/api/creator/state", (_req, res) => {
    try {
      if (fs.existsSync(CREATOR_STORE_FILE)) {
        fs.unlinkSync(CREATOR_STORE_FILE);
      }
      return res.json({ reset: true });
    } catch (err) {
      console.error("Failed to reset creator store:", err);
      return res.status(500).json({ error: "Erreur lors de la réinitialisation." });
    }
  });

  // ==========================================================
  // GEMINI TTS VOICEOVER FOR 9:16 VIDEO HERO BLOCK PREVIEW
  // ==========================================================
  app.post("/api/voiceover", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error:
            "خدمة التوليد الصوتي غير مفعّلة حالياً لأن مفتاح Gemini API غير مضبوط.",
        });
      }

      const result = await synthesizeVoiceoverWav({
        script: req.body?.script,
        voiceName: req.body?.voiceName,
        style: req.body?.style,
      });

      return res.json(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطأ غير متوقع أثناء توليد الصوت.";
      if (message === "EMPTY_AUDIO_RESPONSE") {
        return res.status(502).json({
          error: "لم يُرجع النموذج ملفاً صوتياً، يرجى المحاولة مجدداً.",
        });
      }
      if (
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED")
      ) {
        return res.status(429).json({
          error:
            "تم بلوغ الحد اليومي لتوليد الأصوات المجاني حالياً. يمكنك تشغيل العرض البصري أو المحاولة لاحقاً.",
          details: message,
        });
      }
      console.error("TTS generation error:", message);
      return res.status(500).json({
        error:
          "تعذّر توليد التعليق الصوتي حالياً. يمكنك متابعة العرض مع الترجمة التفاعلية.",
        details: message,
      });
    }
  });

  // ==========================================================
  // MP4 VIDEO EXPORT & DIRECT DOWNLOAD LINK GENERATOR (9:16)
  // ==========================================================
  app.post("/api/video/export", async (req, res) => {
    const jobId = crypto.randomBytes(6).toString("hex");
    const tempDir = path.join(DATA_DIR, `tmp-video-${jobId}`);

    try {
      fs.mkdirSync(VIDEOS_DIR, { recursive: true });
      fs.mkdirSync(tempDir, { recursive: true });

      const voiceName =
        typeof req.body?.voiceName === "string" &&
        ALLOWED_VOICES.has(req.body.voiceName)
          ? req.body.voiceName
          : "Charon";

      const rawOverlays = Array.isArray(req.body?.overlays)
        ? (req.body.overlays as Array<{
            startSec?: number;
            endSec?: number;
            pngBase64?: string;
          }>)
        : [];

      const ALLOWED_PRESETS = new Set([
        "omra",
        "flights_ferries",
        "egypt_excursions",
        "turkey_excursions",
        "excursions_general",
        "visa_services",
        "visa_schengen",
        "visa_egypt",
        "visa_dubai",
        "visa_qatar",
        "visa_oman",
        "visa_omra",
        "visa_international",
        "visa_evisa",
      ]);
      const preset = ALLOWED_PRESETS.has(req.body?.preset)
        ? String(req.body.preset)
        : "omra";

      // Resolve scene images (supporting src/assets/images)
      const PRESET_IMAGES_MAP: Record<string, string[]> = {
        flights_ferries: [
          "flights_ferries_tabs_stress_1794942092639.jpg",
          "flights_ferries_relaxed_suitcase_1794942092319.jpg",
          "flights_ferries_mediterranean_ship_1794942095727.jpg",
          "flights_ferries_mobile_eticket_1794942092613.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_egypt: [
          "egypt_pyramids_gem_9x16_1794694253332.jpg",
          "evisa_green_passport_globe_1795182883677.jpg",
          "airline_business_cabin_1794678794936.jpg",
          "egypt_nile_cruise_9x16_1794694254619.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_dubai: [
          "dubai_skyline_luxury_1794652718471.jpg",
          "visa_travel_desk_1794651030778.jpg",
          "airline_business_cabin_1794678794936.jpg",
          "dubai_skyline_luxury_1794652718471.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_qatar: [
          "dubai_skyline_luxury_1794652718471.jpg",
          "visa_travel_desk_1794651030778.jpg",
          "airline_business_cabin_1794678794936.jpg",
          "dubai_skyline_luxury_1794652718471.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_oman: [
          "airline_business_cabin_1794678794936.jpg",
          "visa_travel_desk_1794651030778.jpg",
          "dubai_skyline_luxury_1794652718471.jpg",
          "visa_travel_desk_1794651030778.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_omra: [
          "makkah_haram_sunrise_1794604285606.jpg",
          "tunis_jeddah_flight_1794604285597.jpg",
          "madinah_umbrellas_twilight_1794604286691.jpg",
          "makkah_maysan_suite_1794604285710.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_international: [
          "visa_canada_toronto_1794678796674.jpg",
          "visa_europe_paris_1794652721585.jpg",
          "airline_business_cabin_1794678794936.jpg",
          "visa_travel_desk_1794651030778.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_evisa: [
          "evisa_green_passport_globe_1795182883677.jpg",
          "evisa_world_map_routes_1795179879338.jpg",
          "evisa_destinations_collage_1795179879370.jpg",
          "evisa_mobile_companion_1795179881635.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_services: [
          "visa_travel_desk_1794651030778.jpg",
          "visa_europe_paris_1794652721585.jpg",
          "dubai_skyline_luxury_1794652718471.jpg",
          "visa_canada_toronto_1794678796674.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        visa_schengen: [
          "visa_europe_paris_1794652721585.jpg",
          "visa_travel_desk_1794651030778.jpg",
          "airline_business_cabin_1794678794936.jpg",
          "visa_canada_toronto_1794678796674.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        turkey_excursions: [
          "turkey_istanbul_reel_9x16_1794695568829.jpg",
          "turkey_sapanca_reel_9x16_1794695570077.jpg",
          "egypt_vip_transfer_9x16_1794694254172.jpg",
          "turkey_bosphorus_reel_9x16_1794695569156.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        egypt_excursions: [
          "egypt_pyramids_gem_9x16_1794694253332.jpg",
          "egypt_nile_cruise_9x16_1794694254619.jpg",
          "egypt_vip_transfer_9x16_1794694254172.jpg",
          "egypt_islamic_cairo_9x16_1794694254977.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        excursions_general: [
          "egypt_pyramids_gem_9x16_1794694253332.jpg",
          "turkey_bosphorus_reel_9x16_1794695569156.jpg",
          "sidi_bou_said_tunisia_1794678794613.jpg",
          "dubai_skyline_luxury_1794652718471.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
        omra: [
          "makkah_haram_sunrise_1794604285606.jpg",
          "tunis_jeddah_flight_1794604285597.jpg",
          "makkah_maysan_suite_1794604285710.jpg",
          "madinah_umbrellas_twilight_1794604286691.jpg",
          "easy2book_studio_backdrop_1794604286505.jpg",
        ],
      };
      const imageNames = PRESET_IMAGES_MAP[preset] || PRESET_IMAGES_MAP.omra;
      const imagePaths = imageNames.map((name) =>
        path.join(__dirname, "src", "assets", "images", name)
      );
      for (const p of imagePaths) {
        if (!fs.existsSync(p)) {
          return res.status(500).json({
            error: "ASSET_MISSING",
            message: `Scene asset missing: ${path.basename(p)}`,
          });
        }
      }

      // 1. Optional Gemini TTS audio synthesis
      const baseTotalDuration =
        preset === "flights_ferries"
          ? 30
          : preset === "visa_evisa"
            ? 42
            : preset === "visa_egypt"
              ? 24
              : 48;
      let wavPath: string | null = null;
      let totalDuration = baseTotalDuration;
      let hasAudio = false;

      if (process.env.GEMINI_API_KEY) {
        try {
          const voiceStyle =
            typeof req.body?.voiceStyle === "string"
              ? req.body.voiceStyle
              : undefined;
          const customScript =
            typeof req.body?.script === "string" && req.body.script.trim()
              ? req.body.script.trim()
              : preset === "flights_ferries"
                ? DEFAULT_FLIGHTS_FERRIES_SCRIPT
                : preset === "visa_evisa"
                  ? DEFAULT_VISA_EVISA_SCRIPT
                  : preset === "visa_egypt"
                    ? DEFAULT_VISA_EGYPT_SCRIPT
                    : DEFAULT_SCRIPT;
          const tts = await synthesizeVoiceoverWav({
            script: customScript,
            voiceName,
            style: voiceStyle,
          });
          const audioBuf = Buffer.from(tts.audioBase64, "base64");
          wavPath = path.join(tempDir, "voiceover.wav");
          fs.writeFileSync(wavPath, audioBuf);

          const { stdout } = await execFileAsync("ffprobe", [
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            wavPath,
          ]);
          const parsedDur = Number.parseFloat(stdout.trim());
          if (Number.isFinite(parsedDur) && parsedDur > 5) {
            totalDuration = parsedDur;
            hasAudio = true;
          }
        } catch (ttsErr) {
          console.warn(
            "Video export proceeding without TTS audio:",
            ttsErr instanceof Error ? ttsErr.message : ttsErr
          );
          wavPath = null;
        }
      }

      // 2. Write valid PNG overlays rendered in browser canvas
      const validOverlays: {
        filePath: string;
        startSec: number;
        endSec: number;
      }[] = [];
      const scale = totalDuration / baseTotalDuration;
      for (let i = 0; i < Math.min(rawOverlays.length, 10); i++) {
        const ov = rawOverlays[i];
        if (
          typeof ov?.pngBase64 === "string" &&
          typeof ov.startSec === "number" &&
          typeof ov.endSec === "number"
        ) {
          const cleanB64 = ov.pngBase64.replace(/^data:image\/png;base64,/, "");
          const ovPath = path.join(tempDir, `overlay-${i}.png`);
          fs.writeFileSync(ovPath, Buffer.from(cleanB64, "base64"));
          validOverlays.push({
            filePath: ovPath,
            startSec: Math.max(0, ov.startSec * scale),
            endSec: Math.min(totalDuration + 0.1, ov.endSec * scale),
          });
        }
      }

      // 3. Build 5-clip 9:16 timeline with smooth Ken Burns zoom & crossfades
      const fadeDur =
        preset === "flights_ferries" ||
        preset === "visa_evisa" ||
        preset === "visa_egypt"
          ? 0.3
          : 0.5;
      const baseSegments =
        preset === "flights_ferries"
          ? [3, 5, 10, 7, 5]
          : preset === "visa_evisa"
            ? [4, 6, 13, 10, 9]
            : preset === "visa_egypt"
              ? [5, 4, 5, 5, 5]
              : [10, 6.5, 8.5, 11, 12];
      const clipDurations = baseSegments.map((s, idx) =>
        Math.max(1.2, s * scale + (idx < baseSegments.length - 1 ? fadeDur : 0))
      );

      const fps = 24;
      const ffmpegArgs: string[] = ["-y"];

      imagePaths.forEach((imgPath) => {
        ffmpegArgs.push("-i", imgPath);
      });

      const overlayInputOffset = imagePaths.length;
      validOverlays.forEach((ov) => {
        ffmpegArgs.push("-i", ov.filePath);
      });

      const audioInputIndex =
        wavPath && hasAudio ? overlayInputOffset + validOverlays.length : -1;
      if (wavPath && hasAudio) {
        ffmpegArgs.push("-i", wavPath);
      }

      const filters: string[] = [];
      for (let i = 0; i < imagePaths.length; i++) {
        const frames = Math.max(24, Math.ceil(clipDurations[i] * fps));
        filters.push(
          `[${i}:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1,zoompan=z='min(zoom+0.0007,1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=720x1280:fps=${fps},format=yuv420p[v${i}]`
        );
      }

      // Chain xfades across the 5 clips
      let prevLabel = "v0";
      let timelineCursor = 0;
      for (let i = 1; i < imagePaths.length; i++) {
        timelineCursor += baseSegments[i - 1] * scale;
        const offset = Math.max(0.3, timelineCursor);
        const outLabel = i === imagePaths.length - 1 ? "vbase" : `xf${i}`;
        filters.push(
          `[${prevLabel}][v${i}]xfade=transition=fade:duration=${fadeDur}:offset=${offset.toFixed(3)}[${outLabel}]`
        );
        prevLabel = outLabel;
      }

      // Overlay crisp RTL PNG layers at exact cue timestamps
      let finalVideoLabel = "vbase";
      validOverlays.forEach((ov, idx) => {
        const inIdx = overlayInputOffset + idx;
        const outLabel = idx === validOverlays.length - 1 ? "vout" : `ov${idx}`;
        filters.push(
          `[${finalVideoLabel}][${inIdx}:v]overlay=0:0:enable='between(t,${ov.startSec.toFixed(3)},${ov.endSec.toFixed(3)})'[${outLabel}]`
        );
        finalVideoLabel = outLabel;
      });

      const PRESET_FILE_SLUGS: Record<string, { prefix: string; label: string }> = {
        flights_ferries: {
          prefix: "flights-ferries",
          label: "Easy2Book-Avion-Bateau-30s-9x16.mp4",
        },
        visa_egypt: {
          prefix: "visa-egypt",
          label: "Easy2Book-Visa-Egypte-4h-24s-9x16.mp4",
        },
        visa_dubai: { prefix: "visa-dubai", label: "Easy2Book-Visa-Dubai-9x16.mp4" },
        visa_qatar: { prefix: "visa-qatar", label: "Easy2Book-Visa-Qatar-9x16.mp4" },
        visa_oman: { prefix: "visa-oman", label: "Easy2Book-Visa-Oman-9x16.mp4" },
        visa_omra: { prefix: "visa-omra", label: "Easy2Book-Visa-Omra-9x16.mp4" },
        visa_international: { prefix: "visa-intl", label: "Easy2Book-Visa-International-9x16.mp4" },
        visa_evisa: {
          prefix: "visa-evisa",
          label: "Easy2Book-Passeport-Tunisien-EVisa-42s-9x16.mp4",
        },
        visa_schengen: { prefix: "visa-schengen", label: "Easy2Book-Visa-Schengen-Mobilite-9x16.mp4" },
        visa_services: { prefix: "visa", label: "Easy2Book-Visas-Services-9x16.mp4" },
        turkey_excursions: { prefix: "turkey", label: "Easy2Book-Excursions-Turquie-9x16.mp4" },
        egypt_excursions: { prefix: "egypt", label: "Easy2Book-Excursions-Egypte-9x16.mp4" },
        excursions_general: { prefix: "excursions", label: "Easy2Book-Excursions-Circuits-9x16.mp4" },
        omra: { prefix: "omra-2027", label: "Easy2Book-Omra-Ramadan-2027-9x16.mp4" },
      };
      const fileSlugMeta = PRESET_FILE_SLUGS[preset] || PRESET_FILE_SLUGS.omra;
      const outputFileName = `easy2book-${fileSlugMeta.prefix}-${jobId}.mp4`;
      const outputPath = path.join(VIDEOS_DIR, outputFileName);

      ffmpegArgs.push(
        "-filter_complex",
        filters.join(";"),
        "-map",
        `[${finalVideoLabel}]`
      );

      if (audioInputIndex >= 0) {
        ffmpegArgs.push(
          "-map",
          `${audioInputIndex}:a`,
          "-c:a",
          "aac",
          "-b:a",
          "160k",
          "-shortest"
        );
      } else {
        ffmpegArgs.push("-an");
      }

      ffmpegArgs.push(
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outputPath
      );

      await execFileAsync("ffmpeg", ffmpegArgs, { timeout: 90000 });

      const stat = fs.statSync(outputPath);
      cleanupOldGeneratedVideos();

      return res.json({
        videoId: jobId,
        downloadPath: `/api/video/download/${outputFileName}`,
        fileName: fileSlugMeta.label,
        sizeBytes: stat.size,
        durationSec: Number(totalDuration.toFixed(1)),
        hasAudio,
        format: "mp4",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erreur lors de la génération MP4.";
      console.error("Video export error:", msg);
      return res.status(500).json({
        error: "VIDEO_EXPORT_FAILED",
        message: msg,
      });
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore temp cleanup failure
      }
    }
  });

  app.get("/api/video/download/:filename", (req, res) => {
    const raw = req.params.filename || "";
    const safeName = path.basename(raw);
    if (
      !/^easy2book-(omra-2027|flights-ferries|egypt|turkey|excursions|visa-egypt|visa-dubai|visa-qatar|visa-oman|visa-omra|visa-intl|visa-evisa|visa-schengen|visa)-[a-f0-9]+\.mp4$/i.test(
        safeName
      )
    ) {
      return res.status(400).json({ error: "Nom de fichier invalide." });
    }
    const targetPath = path.join(VIDEOS_DIR, safeName);
    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({
        error: "Vidéo expirée ou introuvable. Veuillez régénérer le lien.",
      });
    }
    const lowerName = safeName.toLowerCase();
    const DOWNLOAD_LABELS: [string, string][] = [
      ["easy2book-flights-ferries-", "Easy2Book-Avion-Bateau-30s-9x16.mp4"],
      ["easy2book-visa-schengen-", "Easy2Book-Visa-Schengen-Mobilite-9x16.mp4"],
      ["easy2book-visa-egypt-", "Easy2Book-Visa-Egypte-4h-24s-9x16.mp4"],
      ["easy2book-visa-dubai-", "Easy2Book-Visa-Dubai-9x16.mp4"],
      ["easy2book-visa-qatar-", "Easy2Book-Visa-Qatar-9x16.mp4"],
      ["easy2book-visa-oman-", "Easy2Book-Visa-Oman-9x16.mp4"],
      ["easy2book-visa-omra-", "Easy2Book-Visa-Omra-9x16.mp4"],
      ["easy2book-visa-intl-", "Easy2Book-Visa-International-9x16.mp4"],
      ["easy2book-visa-evisa-", "Easy2Book-Passeport-Tunisien-EVisa-42s-9x16.mp4"],
      ["easy2book-visa-", "Easy2Book-Visas-Services-9x16.mp4"],
      ["easy2book-turkey-", "Easy2Book-Excursions-Turquie-9x16.mp4"],
      ["easy2book-egypt-", "Easy2Book-Excursions-Egypte-9x16.mp4"],
      ["easy2book-excursions-", "Easy2Book-Excursions-Circuits-9x16.mp4"],
      ["easy2book-omra-2027-", "Easy2Book-Omra-Ramadan-2027-9x16.mp4"],
    ];
    const matchedLabel = DOWNLOAD_LABELS.find(([prefix]) =>
      lowerName.startsWith(prefix)
    );
    const downloadLabel = matchedLabel
      ? matchedLabel[1]
      : "Easy2Book-Omra-Ramadan-2027-9x16.mp4";
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "video/mp4");
    if (req.query.inline === "1") {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${downloadLabel}"`
      );
      return res.sendFile(targetPath);
    }
    return res.download(targetPath, downloadLabel);
  });

  // ==========================================================
  // PDF BROCHURE EXPORT & DIRECT DOWNLOAD LINK GENERATOR
  // ==========================================================
  app.post("/api/brochure/export", (req, res) => {
    try {
      fs.mkdirSync(BROCHURES_DIR, { recursive: true });
      const rawPdfBase64 =
        typeof req.body?.pdfBase64 === "string" ? req.body.pdfBase64 : "";
      const cleanBase64 = rawPdfBase64.replace(
        /^data:application\/pdf;base64,/,
        ""
      );
      if (!cleanBase64) {
        return res.status(400).json({ error: "Contenu PDF manquant." });
      }
      const pdfBuffer = Buffer.from(cleanBase64, "base64");
      if (
        pdfBuffer.length < 100 ||
        !pdfBuffer.subarray(0, 5).toString("ascii").startsWith("%PDF-")
      ) {
        return res.status(400).json({ error: "Fichier PDF invalide." });
      }

      const jobId = crypto.randomBytes(6).toString("hex");
      const storageFileName = `easy2book-brochure-${jobId}.pdf`;
      const outputPath = path.join(BROCHURES_DIR, storageFileName);
      fs.writeFileSync(outputPath, pdfBuffer);
      cleanupOldGeneratedBrochures();

      const requestedName =
        typeof req.body?.fileName === "string" && req.body.fileName.trim()
          ? path
              .basename(req.body.fileName.trim())
              .replace(/[^a-zA-Z0-9._-]/g, "-")
          : "Easy2Book-Brochure.pdf";
      const safeDownloadName = requestedName.toLowerCase().endsWith(".pdf")
        ? requestedName
        : `${requestedName}.pdf`;

      return res.json({
        brochureId: jobId,
        downloadPath: `/api/brochure/download/${storageFileName}?name=${encodeURIComponent(
          safeDownloadName
        )}`,
        fileName: safeDownloadName,
        sizeBytes: pdfBuffer.length,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement de la brochure PDF.";
      console.error("Brochure export error:", msg);
      return res.status(500).json({
        error: "BROCHURE_EXPORT_FAILED",
        message: msg,
      });
    }
  });

  app.get("/api/brochure/download/:filename", (req, res) => {
    const raw = req.params.filename || "";
    const safeName = path.basename(raw);
    if (!/^easy2book-brochure-[a-f0-9]+\.pdf$/i.test(safeName)) {
      return res.status(400).json({ error: "Nom de fichier invalide." });
    }
    const targetPath = path.join(BROCHURES_DIR, safeName);
    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({
        error: "Brochure PDF expirée ou introuvable. Veuillez régénérer le PDF.",
      });
    }
    const rawQueryName =
      typeof req.query.name === "string" && req.query.name.trim()
        ? path
            .basename(req.query.name.trim())
            .replace(/[^a-zA-Z0-9._-]/g, "-")
        : "Easy2Book-Brochure.pdf";
    const downloadLabel = rawQueryName.toLowerCase().endsWith(".pdf")
      ? rawQueryName
      : `${rawQueryName}.pdf`;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/pdf");
    if (req.query.inline === "1") {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${downloadLabel}"`
      );
      return res.sendFile(targetPath);
    }
    return res.download(targetPath, downloadLabel);
  });

  // ==========================================================
  // GEMINI FULL PAGE GENERATOR (MODE A — STRUCTURED HOMEPAGE)
  // ==========================================================
  app.post("/api/ai/generate-full-page", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Clé Gemini API non configurée sur le serveur. Mode de génération structurée locale activé.",
        });
      }

      const prompt =
        typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
      const language =
        req.body?.language === "ar" || req.body?.language === "en"
          ? req.body.language
          : "fr";
      const brandName =
        typeof req.body?.brandName === "string" && req.body.brandName.trim()
          ? req.body.brandName.trim().slice(0, 80)
          : "Easy2Book";
      const visualStyle =
        typeof req.body?.visualStyle === "string"
          ? req.body.visualStyle
          : "premium";
      const commerceModules = Array.isArray(req.body?.commerceModules)
        ? req.body.commerceModules.filter(
            (m: unknown): m is string => typeof m === "string"
          )
        : [];
      const offerContext =
        req.body?.offerSummary && typeof req.body.offerSummary === "object"
          ? JSON.stringify(req.body.offerSummary)
          : "Aucune offre chiffrée fournie : utiliser 'Sur devis' ou 'Selon disponibilité'.";

      const langLabel =
        language === "ar"
          ? "Arabic (Modern Standard Arabic, natural tourism/hospitality tone)"
          : language === "en"
            ? "English"
            : "French";

      const systemPrompt = `You are a senior travel SaaS product copywriter and conversion architect for "${brandName}".
Generate a complete, cohesive, production-grade homepage blueprint in ${langLabel} for a travel/tourism business based on the user's description.

STRICT RULES (NO EXCEPTIONS):
1. ZERO FABRICATED DATA: Never invent phone numbers, WhatsApp numbers, emails, street addresses, URLs, social media handles, prices, exact room counts, or client testimonials/reviews. If an offer price is not explicitly in OfferContext, state "Sur devis" / "Selon disponibilités".
2. IMAGE KEYS: Only pick imageKey values from this exact allowlist:
   makkah_haram, omra_vip_haram, tunis_flight, maysan_suite, madinah_twilight, voyage_istanbul, dubai_skyline, cairo_nile, tunisia_resort, djerba_thalasso, sahara_tozeur, visa_desk, visa_europe.
3. UNIVERSE: Classify "universe" as one of: "omra", "voyages", "hotels_tunisie", "visa".
4. VISUAL STYLE: Match the "${visualStyle}" tone cleanly without hype clichés.
5. MODULES: Write concise custom titles & descriptions for each selected moduleId in: ${JSON.stringify(commerceModules)}.`;

      const userPrompt = `User brief: ${prompt || "Agence de voyage complète proposant séjours hôtels, voyages organisés, billetterie et départs Omra."}
Requested language: ${language}
Brand name: ${brandName}
Selected commerce modules: ${commerceModules.join(", ") || "none"}
OfferContext: ${offerContext}`;

      const itemSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          badge: { type: Type.STRING },
        },
        required: ["title", "subtitle"],
      };

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              pageTitle: { type: Type.STRING },
              slug: { type: Type.STRING },
              universe: { type: Type.STRING },
              tagline: { type: Type.STRING },
              footerBio: { type: Type.STRING },
              headerCtaLabel: { type: Type.STRING },
              hero: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  primaryCtaLabel: { type: Type.STRING },
                  imageKey: { type: Type.STRING },
                },
                required: [
                  "eyebrow",
                  "title",
                  "description",
                  "primaryCtaLabel",
                  "imageKey",
                ],
              },
              brandStory: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  imageKey: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: itemSchema },
                },
                required: ["eyebrow", "title", "description", "imageKey", "items"],
              },
              offersShowcase: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: itemSchema },
                },
                required: ["eyebrow", "title", "description", "items"],
              },
              whyChooseUs: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: itemSchema },
                },
                required: ["eyebrow", "title", "description", "items"],
              },
              bookingProcess: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: itemSchema },
                },
                required: ["eyebrow", "title", "description", "items"],
              },
              gallery: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  imageKeys: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["eyebrow", "title", "description", "imageKeys"],
              },
              faq: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: itemSchema },
                },
                required: ["eyebrow", "title", "description", "items"],
              },
              cta: {
                type: Type.OBJECT,
                properties: {
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  primaryCtaLabel: { type: Type.STRING },
                },
                required: ["eyebrow", "title", "description", "primaryCtaLabel"],
              },
              form: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  submitLabel: { type: Type.STRING },
                  confirmationMessage: { type: Type.STRING },
                },
                required: [
                  "title",
                  "subtitle",
                  "submitLabel",
                  "confirmationMessage",
                ],
              },
              seo: {
                type: Type.OBJECT,
                properties: {
                  metaTitle: { type: Type.STRING },
                  metaDescription: { type: Type.STRING },
                },
                required: ["metaTitle", "metaDescription"],
              },
              moduleOverrides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    moduleId: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["moduleId", "title", "description"],
                },
              },
            },
            required: [
              "pageTitle",
              "slug",
              "universe",
              "tagline",
              "footerBio",
              "headerCtaLabel",
              "hero",
              "brandStory",
              "offersShowcase",
              "whyChooseUs",
              "bookingProcess",
              "gallery",
              "faq",
              "cta",
              "form",
              "seo",
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(502).json({ error: "EMPTY_MODEL_RESPONSE" });
      }
      const parsed = JSON.parse(text);
      return res.json({ blueprint: parsed, source: "gemini" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur génération IA.";
      console.error("Full page generation error:", message);
      return res.status(500).json({
        error: "GENERATION_FAILED",
        message,
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Easy2Book Landing Page Studio server running on http://0.0.0.0:${PORT}`
    );
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
