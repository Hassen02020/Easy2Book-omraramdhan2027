import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

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

interface BookingRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  pilgrimsCount: number;
  roomType: string;
  departureNote: string;
  createdAt: string;
}

const voiceoverCache = new Map<string, CachedAudio>();
const bookingsStore: BookingRecord[] = [];

const DEFAULT_SCRIPT =
  "تحب تعيش روحانية شهر رمضان الكل في مكة المكرمة، وإنت مرتاح البال ومن غير حتى تعب؟ مع إيزي تو بوك، حضرنالك برنامج عمرة شهر رمضان كامل: طيران تونس جدة تونس، فيزا، وتأطير كامل مع مرشدين مرافقين ليكم خطوة بخطوة، وإقامة مريحة في فندق ميسان الملتزم. وزيد معاهم رحلة للمدينة المنورة... والكل بسوم استثنائي: خمسة آلاف وتسعمية دينار برك للشخص! الأماكن محدودة برشا! كلمنا توا على ثمانية وتسعين، مية وأربعين، خمس مية وأربعطاش، ولا احجز ديريكت على إيزي تو بوك بوان تي إن. إيزي تو بوك... سفرتك أسهل!";

const ALLOWED_VOICES = new Set(["Charon", "Kore", "Fenrir", "Puck", "Zephyr"]);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

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

  app.get("/api/bookings", (_req, res) => {
    res.json({ bookings: bookingsStore });
  });

  app.post("/api/bookings", (req, res) => {
    const fullName =
      typeof req.body?.fullName === "string" ? req.body.fullName.trim() : "";
    const phone =
      typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
    const email =
      typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const pilgrimsCount = Number(req.body?.pilgrimsCount) || 1;
    const roomType =
      typeof req.body?.roomType === "string" && req.body.roomType.trim()
        ? req.body.roomType.trim()
        : "غرفة ثنائية";
    const departureNote =
      typeof req.body?.departureNote === "string"
        ? req.body.departureNote.trim().slice(0, 400)
        : "";

    if (fullName.length < 3) {
      return res.status(400).json({
        error: "يرجى إدخال الاسم الكامل (3 أحرف على الأقل).",
      });
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 8) {
      return res.status(400).json({
        error: "يرجى إدخال رقم هاتف صحيح لا يقل عن 8 أرقام.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "يرجى إدخال بريد إلكتروني صحيح.",
      });
    }

    if (pilgrimsCount < 1 || pilgrimsCount > 12) {
      return res.status(400).json({
        error: "عدد المعتمرين يجب أن يكون بين 1 و 12.",
      });
    }

    const record: BookingRecord = {
      id: `E2B-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName,
      phone,
      email,
      pilgrimsCount,
      roomType,
      departureNote,
      createdAt: new Date().toISOString(),
    };

    bookingsStore.unshift(record);
    if (bookingsStore.length > 50) bookingsStore.pop();

    return res.status(201).json({ booking: record });
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
    console.log(`Easy2Book server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
