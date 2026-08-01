import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for word etymology using Gemini API
  app.post("/api/etymology", async (req, res) => {
    try {
      const { word, meaning } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key সেট করা নেই।",
        });
      }

      const prompt = `You are an expert lexicographer and etymologist. Provide the word origin / history (Etymology) for the English word "${word.trim()}" (Bengali meaning: "${meaning || ''}").

Instructions:
1. Explain in clear, educational Bengali (বাংলা).
2. Detail the historical origin (e.g., Old English, Latin, Greek, Old French, Sanskrit, etc.), original root word & meaning, and how it evolved into modern English.
3. Keep it engaging and concise (3-4 bullet points or a short clear paragraph, max 100 words).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const etymologyText = response.text?.trim() || "শব্দটির উৎপত্তি তথ্য পাওয়া যায়নি।";
      return res.json({ etymology: etymologyText });
    } catch (error: any) {
      console.error("Error fetching etymology from Gemini:", error);
      return res.status(500).json({
        error: "Gemini AI থেকে শব্দ ইতিহাস আনতে সমস্যা হয়েছে।",
        details: error?.message,
      });
    }
  });

  // API route for detailed Word Usage (শব্দের বাস্তব ব্যবহার ও প্রয়োগ) using Gemini API
  app.post("/api/usage", async (req, res) => {
    try {
      const { word, partOfSpeech, meaning } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key সেট করা নেই।",
        });
      }

      const prompt = `You are a language teacher helping Bengali speakers master English vocabulary. Provide real-world contextual usage examples for the word "${word.trim()}" (Part of Speech: ${partOfSpeech || 'N/A'}, Meaning: "${meaning || ''}").

Return JSON format strictly:
{
  "usageNotes": "Short 1-line Bengali note on how to use this word in conversation or writing.",
  "collocations": ["collocation 1 (বাংলা অর্থ)", "collocation 2 (বাংলা অর্থ)", "collocation 3 (বাংলা অর্থ)"],
  "examples": [
    {
      "context": "দৈনন্দিন কথোপকথন (Daily Conversation)",
      "english": "English example sentence 1",
      "bengali": "বাংলা অনুবাদ 1"
    },
    {
      "context": "প্রফেশনাল বা প্রাতিষ্ঠানিক ব্যবহার (Professional/Formal Usage)",
      "english": "English example sentence 2",
      "bengali": "বাংলা অনুবাদ 2"
    },
    {
      "context": "প্রবাদ বা ফ্রেজ (Idiom / Phrase)",
      "english": "English idiom or phrase example",
      "bengali": "বাংলা অনুবাদ 3"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error("No response text from Gemini");
      }

      const usageData = JSON.parse(text);
      return res.json({ usage: usageData });
    } catch (error: any) {
      console.error("Error fetching usage from Gemini:", error);
      return res.status(500).json({
        error: "Gemini AI থেকে শব্দের ব্যবহার পেতে সমস্যা হয়েছে।",
        details: error?.message,
      });
    }
  });

  // API route for detailed Synonyms & Antonyms (সমার্থক ও বিপরীত শব্দ) using Gemini API
  app.post("/api/synonyms", async (req, res) => {
    try {
      const { word, meaning, partOfSpeech } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key সেট করা নেই।",
        });
      }

      const prompt = `You are a linguist helping Bengali speakers build an advanced English vocabulary. Provide synonyms (সমার্থক শব্দ) and antonyms (বিপরীত শব্দ) for the English word "${word.trim()}" (Part of Speech: ${partOfSpeech || 'N/A'}, Meaning: "${meaning || ''}").

Provide 4 to 6 accurate, high-frequency synonyms and 2 to 4 antonyms.

Return JSON strictly matching this schema:
{
  "synonyms": [
    {
      "word": "English synonym 1",
      "meaningBn": "বাংলা অর্থ 1",
      "nuanceNote": "Short Bengali note on nuance or intensity (e.g., 'বেশি প্রাতিষ্ঠানিক/আবেগঘন')"
    }
  ],
  "antonyms": [
    {
      "word": "English antonym 1",
      "meaningBn": "বাংলা অর্থ 1"
    }
  ],
  "vocabularyTip": "A 1-sentence tip in Bengali explaining how to choose the right synonym in context."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error("No response text from Gemini");
      }

      const synonymsData = JSON.parse(text);
      return res.json({ synonymsData });
    } catch (error: any) {
      console.error("Error fetching synonyms from Gemini:", error);
      return res.status(500).json({
        error: "Gemini AI থেকে সমার্থক শব্দ আনতে সমস্যা হয়েছে।",
        details: error?.message,
      });
    }
  });

  // API route for generating visual word illustration using Imagen / Gemini Image models
  app.post("/api/generate-imagen", async (req, res) => {
    try {
      const { word, meaningBn, partOfSpeech } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key সেট করা নেই।",
        });
      }

      const prompt = `A clean, high-resolution, vibrant, educational dictionary visual illustration depicting the word concept "${word.trim()}" (Bengali meaning: "${meaningBn || ''}", Part of Speech: ${partOfSpeech || ''}). Vector digital art style, bright colors, minimalist studio background, highly educational and clear.`;

      let base64Image = "";

      // Attempt 1: Try gemini-3.1-flash-lite-image model
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || "image/png";
              base64Image = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (err: any) {
        console.warn("gemini-3.1-flash-lite-image failed, trying imagen-3.0-generate-002:", err?.message);
      }

      // Attempt 2: Try imagen-3.0-generate-002 if attempt 1 did not return an image
      if (!base64Image) {
        try {
          const response = await (ai.models as any).generateImages({
            model: "imagen-3.0-generate-002",
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: "image/jpeg",
              aspectRatio: "1:1",
            },
          });

          const imageObj = response.generatedImages?.[0]?.image;
          if (imageObj?.imageBytes) {
            base64Image = `data:image/jpeg;base64,${imageObj.imageBytes}`;
          }
        } catch (err: any) {
          console.warn("imagen-3.0-generate-002 failed:", err?.message);
        }
      }

      // Attempt 3: Try gemini-3.1-flash-image
      if (!base64Image) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-image",
            contents: {
              parts: [{ text: prompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1",
              },
            },
          });

          const parts = response.candidates?.[0]?.content?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || "image/png";
                base64Image = `data:${mime};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
        } catch (err: any) {
          console.warn("gemini-3.1-flash-image failed:", err?.message);
        }
      }

      if (!base64Image) {
        throw new Error("Imagen বা Gemini Image AI দিয়ে ছবিটি তৈরি করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
      }

      return res.json({ imageUrl: base64Image });
    } catch (error: any) {
      console.error("Error generating image with Imagen:", error);
      return res.status(500).json({
        error: "Imagen AI দিয়ে ছবি তৈরি করতে সমস্যা হয়েছে।",
        details: error?.message,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
