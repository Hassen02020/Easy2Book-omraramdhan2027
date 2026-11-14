import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, Type } from "@google/genai";

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
