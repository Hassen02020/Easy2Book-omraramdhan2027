import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
const DATA_DIR = path.join(__dirname, "data");
const CREATOR_STORE_FILE = path.join(DATA_DIR, "creator-studio.json");

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

const ALLOWED_VOICES = new Set(["Charon", "Kore", "Fenrir", "Puck", "Zephyr"]);

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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

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

      const rawScript =
        typeof req.body?.script === "string" && req.body.script.trim()
          ? req.body.script.trim()
          : DEFAULT_SCRIPT;
      const script = rawScript.slice(0, 1500);

      const requestedVoice =
        typeof req.body?.voiceName === "string" ? req.body.voiceName : "Charon";
      const voiceName = ALLOWED_VOICES.has(requestedVoice)
        ? requestedVoice
        : "Charon";

      const style =
        typeof req.body?.style === "string" && req.body.style.trim()
          ? req.body.style.trim().slice(0, 200)
          : "Warm, reassuring, inspiring Tunisian Arabic commercial narrator with dignified pacing and clear pronunciation.";

      const cacheKey = `${voiceName}::${style}::${script}`;
      const cached = voiceoverCache.get(cacheKey);
      if (cached) {
        return res.json({
          audioBase64: cached.audioBase64,
          mimeType: cached.mimeType,
          voiceName,
          cached: true,
        });
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
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        return res.status(502).json({
          error: "لم يُرجع النموذج ملفاً صوتياً، يرجى المحاولة مجدداً.",
        });
      }

      if (voiceoverCache.size >= 16) {
        const oldestKey = voiceoverCache.keys().next().value;
        if (oldestKey) voiceoverCache.delete(oldestKey);
      }

      voiceoverCache.set(cacheKey, {
        audioBase64: base64Audio,
        mimeType: "audio/wav",
        createdAt: Date.now(),
      });

      return res.json({
        audioBase64: base64Audio,
        mimeType: "audio/wav",
        voiceName,
        cached: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطأ غير متوقع أثناء توليد الصوت.";
      console.error("TTS generation error:", message);
      return res.status(500).json({
        error: "تعذّر توليد التعليق الصوتي حالياً. يمكنك متابعة العرض مع الترجمة التفاعلية.",
        details: message,
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
