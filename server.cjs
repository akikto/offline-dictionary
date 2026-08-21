var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/etymology", async (req, res) => {
    try {
      const { word, meaning } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key \u09B8\u09C7\u099F \u0995\u09B0\u09BE \u09A8\u09C7\u0987\u0964"
        });
      }
      const prompt = `You are an expert lexicographer and etymologist. Provide the word origin / history (Etymology) for the English word "${word.trim()}" (Bengali meaning: "${meaning || ""}").

Instructions:
1. Explain in clear, educational Bengali (\u09AC\u09BE\u0982\u09B2\u09BE).
2. Detail the historical origin (e.g., Old English, Latin, Greek, Old French, Sanskrit, etc.), original root word & meaning, and how it evolved into modern English.
3. Keep it engaging and concise (3-4 bullet points or a short clear paragraph, max 100 words).`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });
      const etymologyText = response.text?.trim() || "\u09B6\u09AC\u09CD\u09A6\u099F\u09BF\u09B0 \u0989\u09CE\u09AA\u09A4\u09CD\u09A4\u09BF \u09A4\u09A5\u09CD\u09AF \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964";
      return res.json({ etymology: etymologyText });
    } catch (error) {
      console.error("Error fetching etymology from Gemini:", error);
      return res.status(500).json({
        error: "Gemini AI \u09A5\u09C7\u0995\u09C7 \u09B6\u09AC\u09CD\u09A6 \u0987\u09A4\u09BF\u09B9\u09BE\u09B8 \u0986\u09A8\u09A4\u09C7 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
        details: error?.message
      });
    }
  });
  app.post("/api/usage", async (req, res) => {
    try {
      const { word, partOfSpeech, meaning } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key \u09B8\u09C7\u099F \u0995\u09B0\u09BE \u09A8\u09C7\u0987\u0964"
        });
      }
      const prompt = `You are a language teacher helping Bengali speakers master English vocabulary. Provide real-world contextual usage examples for the word "${word.trim()}" (Part of Speech: ${partOfSpeech || "N/A"}, Meaning: "${meaning || ""}").

Return JSON format strictly:
{
  "usageNotes": "Short 1-line Bengali note on how to use this word in conversation or writing.",
  "collocations": ["collocation 1 (\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09B0\u09CD\u09A5)", "collocation 2 (\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09B0\u09CD\u09A5)", "collocation 3 (\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09B0\u09CD\u09A5)"],
  "examples": [
    {
      "context": "\u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0995\u09A5\u09CB\u09AA\u0995\u09A5\u09A8 (Daily Conversation)",
      "english": "English example sentence 1",
      "bengali": "\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 1"
    },
    {
      "context": "\u09AA\u09CD\u09B0\u09AB\u09C7\u09B6\u09A8\u09BE\u09B2 \u09AC\u09BE \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 (Professional/Formal Usage)",
      "english": "English example sentence 2",
      "bengali": "\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 2"
    },
    {
      "context": "\u09AA\u09CD\u09B0\u09AC\u09BE\u09A6 \u09AC\u09BE \u09AB\u09CD\u09B0\u09C7\u099C (Idiom / Phrase)",
      "english": "English idiom or phrase example",
      "bengali": "\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 3"
    }
  ]
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = response.text?.trim();
      if (!text) {
        throw new Error("No response text from Gemini");
      }
      const usageData = JSON.parse(text);
      return res.json({ usage: usageData });
    } catch (error) {
      console.error("Error fetching usage from Gemini:", error);
      return res.status(500).json({
        error: "Gemini AI \u09A5\u09C7\u0995\u09C7 \u09B6\u09AC\u09CD\u09A6\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09AA\u09C7\u09A4\u09C7 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
        details: error?.message
      });
    }
  });
  app.post("/api/synonyms", async (req, res) => {
    try {
      const { word, meaning, partOfSpeech } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key \u09B8\u09C7\u099F \u0995\u09B0\u09BE \u09A8\u09C7\u0987\u0964"
        });
      }
      const prompt = `You are a linguist helping Bengali speakers build an advanced English vocabulary. Provide synonyms (\u09B8\u09AE\u09BE\u09B0\u09CD\u09A5\u0995 \u09B6\u09AC\u09CD\u09A6) and antonyms (\u09AC\u09BF\u09AA\u09B0\u09C0\u09A4 \u09B6\u09AC\u09CD\u09A6) for the English word "${word.trim()}" (Part of Speech: ${partOfSpeech || "N/A"}, Meaning: "${meaning || ""}").

Provide 4 to 6 accurate, high-frequency synonyms and 2 to 4 antonyms.

Return JSON strictly matching this schema:
{
  "synonyms": [
    {
      "word": "English synonym 1",
      "meaningBn": "\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09B0\u09CD\u09A5 1",
      "nuanceNote": "Short Bengali note on nuance or intensity (e.g., '\u09AC\u09C7\u09B6\u09BF \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995/\u0986\u09AC\u09C7\u0997\u0998\u09A8')"
    }
  ],
  "antonyms": [
    {
      "word": "English antonym 1",
      "meaningBn": "\u09AC\u09BE\u0982\u09B2\u09BE \u0985\u09B0\u09CD\u09A5 1"
    }
  ],
  "vocabularyTip": "A 1-sentence tip in Bengali explaining how to choose the right synonym in context."
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = response.text?.trim();
      if (!text) {
        throw new Error("No response text from Gemini");
      }
      const synonymsData = JSON.parse(text);
      return res.json({ synonymsData });
    } catch (error) {
      console.error("Error fetching synonyms from Gemini:", error);
      return res.status(500).json({
        error: "Gemini AI \u09A5\u09C7\u0995\u09C7 \u09B8\u09AE\u09BE\u09B0\u09CD\u09A5\u0995 \u09B6\u09AC\u09CD\u09A6 \u0986\u09A8\u09A4\u09C7 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
        details: error?.message
      });
    }
  });
  app.post("/api/generate-imagen", async (req, res) => {
    try {
      const { word, meaningBn, partOfSpeech } = req.body;
      if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Word parameter is required" });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API Key \u09B8\u09C7\u099F \u0995\u09B0\u09BE \u09A8\u09C7\u0987\u0964"
        });
      }
      const prompt = `A clean, high-resolution, vibrant, educational dictionary visual illustration depicting the word concept "${word.trim()}" (Bengali meaning: "${meaningBn || ""}", Part of Speech: ${partOfSpeech || ""}). Vector digital art style, bright colors, minimalist studio background, highly educational and clear.`;
      let base64Image = "";
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: prompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
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
      } catch (err) {
        console.warn("gemini-3.1-flash-lite-image failed, trying imagen-3.0-generate-002:", err?.message);
      }
      if (!base64Image) {
        try {
          const response = await ai.models.generateImages({
            model: "imagen-3.0-generate-002",
            prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: "image/jpeg",
              aspectRatio: "1:1"
            }
          });
          const imageObj = response.generatedImages?.[0]?.image;
          if (imageObj?.imageBytes) {
            base64Image = `data:image/jpeg;base64,${imageObj.imageBytes}`;
          }
        } catch (err) {
          console.warn("imagen-3.0-generate-002 failed:", err?.message);
        }
      }
      if (!base64Image) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-image",
            contents: {
              parts: [{ text: prompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1"
              }
            }
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
        } catch (err) {
          console.warn("gemini-3.1-flash-image failed:", err?.message);
        }
      }
      if (!base64Image) {
        throw new Error("Imagen \u09AC\u09BE Gemini Image AI \u09A6\u09BF\u09DF\u09C7 \u099B\u09AC\u09BF\u099F\u09BF \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09AA\u09C1\u09A8\u09B0\u09BE\u09DF \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964");
      }
      return res.json({ imageUrl: base64Image });
    } catch (error) {
      console.error("Error generating image with Imagen:", error);
      return res.status(500).json({
        error: "Imagen AI \u09A6\u09BF\u09DF\u09C7 \u099B\u09AC\u09BF \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
        details: error?.message
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
