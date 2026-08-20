import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Bookmark, BookmarkCheck, Share2, Check, HardDrive, Image as ImageIcon, Maximize2, X, Loader2, Languages, FileText, FileDown, Printer, Download, History, Sparkles, AlertCircle, CheckCircle2, BookOpen, MessageSquare, Layers, Lightbulb, Search, Copy } from 'lucide-react';
import { PronunciationPractice } from './PronunciationPractice';
import { PronunciationTipCard } from './PronunciationTipCard';
import { DictionaryEntry } from '../types';
import { speakWordOffline, getBengaliPronunciationText } from '../utils/phonetics';
import { fetchWordImage, generateWordSvgIllustration } from '../utils/images';

export function formatPartOfSpeech(posRaw?: string): { abbr: string; fullBn: string; combined: string } {
  if (!posRaw) return { abbr: 'n.', fullBn: 'বিশেষ্য', combined: 'n. (বিশেষ্য)' };
  const pos = posRaw.toLowerCase().trim();

  if (pos.includes('noun')) return { abbr: 'n.', fullBn: 'বিশেষ্য', combined: 'n. (বিশেষ্য)' };
  if (pos.includes('verb')) return { abbr: 'v.', fullBn: 'ক্রিয়া', combined: 'v. (ক্রিয়া)' };
  if (pos.includes('adj')) return { abbr: 'adj.', fullBn: 'বিশেষণ', combined: 'adj. (বিশেষণ)' };
  if (pos.includes('adv')) return { abbr: 'adv.', fullBn: 'ভাববিশেষণ', combined: 'adv. (ভাববিশেষণ)' };
  if (pos.includes('prep')) return { abbr: 'prep.', fullBn: 'অব্যয়', combined: 'prep. (অব্যয়)' };
  if (pos.includes('conj')) return { abbr: 'conj.', fullBn: 'সংযোজক অব্যয়', combined: 'conj. (সংযোজক)' };
  if (pos.includes('pron')) return { abbr: 'pron.', fullBn: 'সর্বনাম', combined: 'pron. (সর্বনাম)' };
  if (pos.includes('interj')) return { abbr: 'interj.', fullBn: 'আবেগসূচক', combined: 'interj. (আবেগসূচক)' };

  return { abbr: pos, fullBn: pos, combined: `${pos}` };
}
import { translateToBengali } from '../utils/translation';
import { WordUsageData, generateOfflineUsageData } from '../utils/usage';

export interface SynItem {
  word: string;
  meaningBn?: string;
  nuanceNote?: string;
}

export interface AntItem {
  word: string;
  meaningBn?: string;
}

export interface GeminiSynonymsData {
  synonyms: SynItem[];
  antonyms?: AntItem[];
  vocabularyTip?: string;
}

interface WordCardProps {
  entry: DictionaryEntry;
  isBookmarked: boolean;
  onToggleBookmark: (entry: DictionaryEntry) => void;
  originalBnTerm?: string;
  onSelectWord?: (word: string) => void;
}

export interface FormattedExample {
  id: number;
  label: string;
  english: string;
  bengali?: string;
  context?: string;
}

export function getTwoExampleSentences(
  entry: DictionaryEntry,
  exBn?: string,
  ex2Bn?: string,
  usageData?: WordUsageData | null
): FormattedExample[] {
  const headword = entry.word || entry.englishWord;
  const meaning = entry.bnMeaning || '';
  const pos = (entry.partOfSpeech || 'noun').toLowerCase();

  const results: FormattedExample[] = [];

  // 1. Primary Example Sentence
  const firstEn = entry.example || (usageData?.examples && usageData.examples[0]?.english);
  const firstBn = exBn || entry.exampleBn || (usageData?.examples && usageData.examples[0]?.bengali);

  if (firstEn) {
    results.push({
      id: 1,
      label: 'উদাহরণ ১ (Example 1)',
      english: firstEn,
      bengali: firstBn,
      context: usageData?.examples?.[0]?.context
    });
  } else {
    let gen1En = `Understanding the word '${headword}' is helpful in vocabulary building.`;
    let gen1Bn = `শব্দভাণ্ডার বৃদ্ধিতে '${headword}' (${meaning}) শব্দটির সঠিক ব্যবহার জানা অত্যন্ত সহায়ক।`;
    if (pos.includes('noun')) {
      gen1En = `The concept of ${headword} plays an important role in daily life.`;
      gen1Bn = `দৈনন্দিন জীবনে ${meaning}-এর ধারণা একটি গুরুত্বপূর্ণ ভূমিকা পালন করে।`;
    } else if (pos.includes('verb')) {
      gen1En = `You should learn how to ${headword} properly in various contexts.`;
      gen1Bn = `বিভিন্ন পরিস্থিতিতে কীভাবে ${meaning} সম্পাদন করতে হয় তা আপনার শেখা উচিত।`;
    } else if (pos.includes('adj')) {
      gen1En = `He gave a very ${headword} explanation during the presentation.`;
      gen1Bn = `সে উপস্থাপনার সময় একটি অত্যন্ত চমৎকার ও স্পষ্ট ব্যাখ্যা দিয়েছিল।`;
    }
    results.push({
      id: 1,
      label: 'উদাহরণ ১ (Example 1)',
      english: gen1En,
      bengali: gen1Bn
    });
  }

  // 2. Secondary Example Sentence
  const secondEn = entry.example2 || (usageData?.examples && usageData.examples.find(e => e.english !== results[0].english)?.english);
  const secondBn = ex2Bn || entry.example2Bn || (usageData?.examples && usageData.examples.find(e => e.english !== results[0].english)?.bengali);

  if (secondEn) {
    results.push({
      id: 2,
      label: 'উদাহরণ ২ (Example 2)',
      english: secondEn,
      bengali: secondBn,
      context: usageData?.examples?.find(e => e.english === secondEn)?.context
    });
  } else {
    let gen2En = `She used '${headword}' in her sentence to express her thoughts clearly.`;
    let gen2Bn = `তার চিন্তাভাবনা স্পষ্টভাবে প্রকাশ করতে সে বাক্যে '${headword}' শব্দটি ব্যবহার করেছিল।`;

    if (pos.includes('noun')) {
      gen2En = `Everyone appreciated the importance of ${headword} shown in the event.`;
      gen2Bn = `অনুষ্ঠানে প্রদর্শিত ${meaning}-এর গুরুত্ব সবাই খুব পছন্দ করেছিল।`;
    } else if (pos.includes('verb')) {
      gen2En = `It is essential to ${headword} with confidence and consistency.`;
      gen2Bn = `আত্মবিশ্বাস ও ধারাবাহিকতার সাথে ${meaning} করা আবশ্যক।`;
    } else if (pos.includes('adj')) {
      gen2En = `The result of their hard work was truly ${headword} and impressive.`;
      gen2Bn = `তাদের কঠোর পরিশ্রমের ফলাফল সত্যিই অত্যন্ত দারুণ ও প্রশংসনীয় ছিল।`;
    } else if (pos.includes('adv')) {
      gen2En = `The task was completed ${headword} by the dedicated team.`;
      gen2Bn = `উৎসর্গীকৃত টিম দ্বারা কাজটি অত্যন্ত দক্ষতার সাথে সম্পন্ন হয়েছিল।`;
    }

    results.push({
      id: 2,
      label: 'উদাহরণ ২ (Example 2)',
      english: gen2En,
      bengali: gen2Bn
    });
  }

  return results;
}

export const WordCard: React.FC<WordCardProps> = ({
  entry,
  isBookmarked,
  onToggleBookmark,
  originalBnTerm,
  onSelectWord
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(entry.imageUrl || null);
  const [isImgLoading, setIsImgLoading] = useState<boolean>(!entry.imageUrl);
  const [imgError, setImgError] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  // Bengali translations for definition and example
  const [defBn, setDefBn] = useState<string | undefined>(entry.enDefBn);
  const [exBn, setExBn] = useState<string | undefined>(entry.exampleBn);
  const [ex2Bn, setEx2Bn] = useState<string | undefined>(entry.example2Bn);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Etymology state
  const [etymology, setEtymology] = useState<string | null>(entry.etymology || null);
  const [isEtymologyLoading, setIsEtymologyLoading] = useState<boolean>(false);
  const [etymologyError, setEtymologyError] = useState<string | null>(null);

  // Word Usage state
  const [usageData, setUsageData] = useState<WordUsageData | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState<boolean>(false);
  const [usageError, setUsageError] = useState<string | null>(null);

  // Synonyms & Antonyms state (Gemini AI Powered)
  const [synonymsData, setSynonymsData] = useState<GeminiSynonymsData | null>(null);
  const [isSynonymsLoading, setIsSynonymsLoading] = useState<boolean>(false);
  const [synonymsError, setSynonymsError] = useState<string | null>(null);

  // Imagen AI Image state
  const [isImagenLoading, setIsImagenLoading] = useState<boolean>(false);
  const [imagenError, setImagenError] = useState<string | null>(null);
  const [isImagenGenerated, setIsImagenGenerated] = useState<boolean>(false);

  const headword = entry.word || entry.englishWord;
  const firstLetter = (headword[0] || 'A').toUpperCase();

  const handleGenerateImagen = async () => {
    const targetWord = (entry.englishWord || headword).trim();
    setIsImagenLoading(true);
    setImagenError(null);

    try {
      const res = await fetch('/api/generate-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          meaningBn: entry.bnMeaning,
          partOfSpeech: entry.partOfSpeech,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Imagen AI থেকে ছবি ইলাস্ট্রেশন জেনারেট করতে সমস্যা হয়েছে।');
      }

      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setImgError(false);
        setIsImagenGenerated(true);

        // Save image locally in localStorage
        const localImagenKey = `shobdokosh_imagen_${targetWord.toLowerCase()}`;
        try {
          localStorage.setItem(localImagenKey, data.imageUrl);
        } catch (e) {
          console.warn('LocalStorage quota exceeded, image not cached in browser:', e);
        }
      } else {
        throw new Error('কোনো ইমেজ ডেটা পাওয়া যায়নি');
      }
    } catch (err: any) {
      console.error('Imagen generation error:', err);
      setImagenError(err.message || 'অফলাইন মোড বা সংযোগ বিচ্ছিন্ন।');
    } finally {
      setIsImagenLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const cleanWord = (entry.englishWord || headword).trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `shobdokosh_imagen_${cleanWord}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchEtymology = async () => {
    const targetWord = (entry.englishWord || headword).trim();
    const wordKey = `shobdokosh_etym_${targetWord.toLowerCase()}`;

    // Check localStorage cache
    const cached = localStorage.getItem(wordKey);
    if (cached) {
      setEtymology(cached);
      setEtymologyError(null);
      return;
    }

    setIsEtymologyLoading(true);
    setEtymologyError(null);

    try {
      const res = await fetch('/api/etymology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          meaning: entry.bnMeaning,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gemini AI থেকে উৎপত্তি তথ্য আনা সম্ভব হয়নি।');
      }

      const data = await res.json();
      if (data.etymology) {
        setEtymology(data.etymology);
        localStorage.setItem(wordKey, data.etymology);
      } else {
        throw new Error('কোনো ইতিহাস পাওয়া যায়নি');
      }
    } catch (err: any) {
      console.warn('Etymology fetch error:', err);
      setEtymologyError(err.message || 'অফলাইন মোডে আছেন বা সার্ভিস সাময়িকভাবে অনুপলব্ধ।');
    } finally {
      setIsEtymologyLoading(false);
    }
  };

  const fetchUsageFromGemini = async () => {
    const targetWord = (entry.englishWord || headword).trim();
    const usageKey = `shobdokosh_usage_${targetWord.toLowerCase()}`;
    setIsUsageLoading(true);
    setUsageError(null);

    try {
      const res = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          partOfSpeech: entry.partOfSpeech,
          meaning: entry.bnMeaning,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gemini AI থেকে ব্যবহারের তথ্য পেতে সমস্যা হয়েছে।');
      }

      const data = await res.json();
      if (data.usage) {
        setUsageData(data.usage);
        localStorage.setItem(usageKey, JSON.stringify(data.usage));
      } else {
        throw new Error('কোনো ব্যবহারের তথ্য পাওয়া যায়নি');
      }
    } catch (err: any) {
      console.warn('Usage fetch error:', err);
      setUsageError(err.message || 'অফলাইন মোড বা সংযোগ বিচ্ছিন্ন।');
    } finally {
      setIsUsageLoading(false);
    }
  };

  const fetchSynonymsFromGemini = async () => {
    const targetWord = (entry.englishWord || headword).trim();
    const synsKey = `shobdokosh_syns_${targetWord.toLowerCase()}`;
    setIsSynonymsLoading(true);
    setSynonymsError(null);

    try {
      const res = await fetch('/api/synonyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          partOfSpeech: entry.partOfSpeech,
          meaning: entry.bnMeaning,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gemini AI থেকে সমার্থক শব্দ পেতে সমস্যা হয়েছে।');
      }

      const data = await res.json();
      if (data.synonymsData) {
        setSynonymsData(data.synonymsData);
        localStorage.setItem(synsKey, JSON.stringify(data.synonymsData));
      } else {
        throw new Error('কোনো সমার্থক শব্দ পাওয়া যায়নি');
      }
    } catch (err: any) {
      console.warn('Synonyms fetch error:', err);
      setSynonymsError(err.message || 'অফলাইন মোড বা সংযোগ বিচ্ছিন্ন।');
    } finally {
      setIsSynonymsLoading(false);
    }
  };

  useEffect(() => {
    setImageUrl(entry.imageUrl || null);
    setImgError(false);
    setDefBn(entry.enDefBn);
    setExBn(entry.exampleBn);
    setEx2Bn(entry.example2Bn);

    const targetWord = (entry.englishWord || headword).trim();
    const wordKey = `shobdokosh_etym_${targetWord.toLowerCase()}`;
    const cachedEtym = localStorage.getItem(wordKey);
    if (cachedEtym) {
      setEtymology(cachedEtym);
    } else {
      setEtymology(entry.etymology || null);
    }
    setEtymologyError(null);

    // Initialize usage data
    const usageKey = `shobdokosh_usage_${targetWord.toLowerCase()}`;
    const cachedUsageStr = localStorage.getItem(usageKey);
    const defaultUsage = generateOfflineUsageData(
      entry.englishWord || headword,
      entry.bnMeaning,
      entry.partOfSpeech,
      entry.example,
      entry.exampleBn
    );
    if (cachedUsageStr) {
      try {
        setUsageData(JSON.parse(cachedUsageStr));
      } catch {
        setUsageData(defaultUsage);
      }
    } else {
      setUsageData(defaultUsage);
    }
    setUsageError(null);

    // Initialize synonyms data
    const synsKey = `shobdokosh_syns_${targetWord.toLowerCase()}`;
    const cachedSynsStr = localStorage.getItem(synsKey);
    const fallbackSyns: GeminiSynonymsData = {
      synonyms: (entry.synonyms || []).map((s) => ({ word: s, meaningBn: '' })),
      antonyms: (entry.antonyms || []).map((a) => ({ word: a, meaningBn: '' })),
      vocabularyTip: entry.synonyms && entry.synonyms.length > 0
        ? `'${targetWord}' শব্দের সমার্থক শব্দগুলো জানা থাকলে বাক্যের বৈচিত্র্য ও প্রকাশের গভীরতা বাড়ে।`
        : undefined
    };

    if (cachedSynsStr) {
      try {
        setSynonymsData(JSON.parse(cachedSynsStr));
      } catch {
        setSynonymsData(fallbackSyns);
      }
    } else {
      setSynonymsData(fallbackSyns);
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        fetchSynonymsFromGemini();
      }
    }
    setSynonymsError(null);

    let isMounted = true;

    // Check for cached Imagen generated image
    const localImagenKey = `shobdokosh_imagen_${targetWord.toLowerCase()}`;
    const cachedImagen = localStorage.getItem(localImagenKey);

    if (cachedImagen) {
      setImageUrl(cachedImagen);
      setIsImgLoading(false);
      setIsImagenGenerated(true);
    } else if (!entry.imageUrl) {
      setIsImgLoading(true);
      fetchWordImage(entry.englishWord || headword, entry.bnMeaning, entry.partOfSpeech)
        .then((url) => {
          if (isMounted) {
            setImageUrl(url);
            setIsImgLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            const svgUrl = generateWordSvgIllustration(
              headword,
              entry.bnMeaning,
              entry.partOfSpeech
            );
            setImageUrl(svgUrl);
            setIsImgLoading(false);
            setImgError(false);
          }
        });
    } else {
      setIsImgLoading(false);
    }

    // Auto-translate definition and example sentences if not provided
    async function translateMissingText() {
      if (!entry.enDefBn && entry.enDefinition) {
        setIsTranslating(true);
        const translatedDef = await translateToBengali(entry.enDefinition);
        if (isMounted && translatedDef) {
          setDefBn(translatedDef);
        }
      }
      if (!entry.exampleBn && entry.example) {
        setIsTranslating(true);
        const translatedExample = await translateToBengali(entry.example);
        if (isMounted && translatedExample) {
          setExBn(translatedExample);
        }
      }
      if (!entry.example2Bn && entry.example2) {
        setIsTranslating(true);
        const translatedExample2 = await translateToBengali(entry.example2);
        if (isMounted && translatedExample2) {
          setEx2Bn(translatedExample2);
        }
      }
      if (isMounted) {
        setIsTranslating(false);
      }
    }

    translateMissingText();

    return () => {
      isMounted = false;
    };
  }, [entry]);

  const handlePlayAudio = (textToSpeak?: string, lang: 'en-US' | 'bn-BD' = 'en-US') => {
    const text = textToSpeak || entry.englishWord || headword;
    setIsPlaying(true);
    if (entry.audioUrl && !textToSpeak) {
      const audio = new Audio(entry.audioUrl);
      audio
        .play()
        .then(() => {
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => {
            speakWordOffline(text, lang, () => setIsPlaying(false), () => setIsPlaying(false));
          };
        })
        .catch(() => {
          speakWordOffline(text, lang, () => setIsPlaying(false), () => setIsPlaying(false));
        });
    } else {
      speakWordOffline(text, lang, () => setIsPlaying(false), () => setIsPlaying(false));
    }
  };

  const handleGenerateAutoIllustration = () => {
    setIsImgLoading(true);
    setTimeout(() => {
      const autoSvg = generateWordSvgIllustration(
        headword,
        entry.bnMeaning,
        entry.partOfSpeech
      );
      setImageUrl(autoSvg);
      setImgError(false);
      setIsImgLoading(false);
    }, 250);
  };

  const handleImgError = () => {
    const fallbackSvg = generateWordSvgIllustration(
      headword,
      entry.bnMeaning,
      entry.partOfSpeech
    );
    setImageUrl(fallbackSvg);
    setImgError(false);
  };

  const handleCopy = () => {
    const textToCopy = `${headword} (${entry.partOfSpeech || 'word'})\nউচ্চারণ: ${entry.bnPhonetic || entry.ipaPhonetic || ''}\nবাংলা অর্থ: ${entry.bnMeaning}\nসংজ্ঞা: ${entry.enDefinition || ''}\nউদাহরণ: ${entry.example || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = () => {
    const collocationsText = usageData?.collocations && usageData.collocations.length > 0
      ? usageData.collocations.join(', ')
      : 'N/A';

    const usageExamplesText = usageData?.examples && usageData.examples.length > 0
      ? usageData.examples.map(e => `• [${e.context}]\n  En: ${e.english}\n  Bn: ${e.bengali}`).join('\n')
      : 'N/A';

    const formattedSynonyms = synonymsData?.synonyms && synonymsData.synonyms.length > 0
      ? synonymsData.synonyms.map(s => `${s.word}${s.meaningBn ? ` (${s.meaningBn})` : ''}`).join(', ')
      : entry.synonyms && entry.synonyms.length > 0
        ? entry.synonyms.join(', ')
        : 'N/A';

    const formattedAntonyms = synonymsData?.antonyms && synonymsData.antonyms.length > 0
      ? synonymsData.antonyms.map(a => `${a.word}${a.meaningBn ? ` (${a.meaningBn})` : ''}`).join(', ')
      : entry.antonyms && entry.antonyms.length > 0
        ? entry.antonyms.join(', ')
        : 'N/A';

    const textContent = `==================================================
শব্দকোষ — অফলাইন শব্দ নোট (Shobdokosh Word Note)
==================================================
শব্দ (Word):        ${headword}
পদ (Part of Speech): ${entry.partOfSpeech || 'শব্দ'}
উচ্চারণ (Phonetic):  ${entry.bnPhonetic || ''} (${entry.ipaPhonetic || ''})
বাংলা অর্থ (Meaning): ${entry.bnMeaning}
--------------------------------------------------
সংজ্ঞা (English Definition):
${entry.enDefinition || 'N/A'}

বাংলা অনুবাদ (Bengali Explanation):
${defBn || entry.enDefBn || 'N/A'}

বাক্যে প্রয়োগ (Primary Example):
${entry.example ? `"${entry.example}"` : 'N/A'}

শব্দের বিভিন্ন ব্যবহার ও প্রেজ বা কলকেশন (Word Usage & Collocations):
${usageData?.usageNotes ? `ব্যবহারের নিয়ম: ${usageData.usageNotes}\n` : ''}কলকেশন/ফ্রেজ: ${collocationsText}

ব্যবহারের উদাহরণ (Usage Examples):
${usageExamplesText}

শব্দের ইতিহাস ও উৎপত্তি (Word Etymology):
${etymology || 'N/A'}

সমার্থক শব্দ (Synonyms):
${formattedSynonyms}

বিপরীত শব্দ (Antonyms):
${formattedAntonyms}
--------------------------------------------------
রপ্তানির তারিখ: ${new Date().toLocaleDateString('bn-BD')}
শব্দকোষ — অফলাইন বাংলা-ইংরেজি অভিধান
==================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${headword.toLowerCase().replace(/[^a-z0-9]/g, '_')}_note.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('পপআপ উইন্ডোটি ব্লক করা আছে। অনুগ্রহ করে পপআপ এলাউ (Allow Popup) করুন।');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${headword} — শব্দকোষ অফলাইন নোট</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Hind+Siliguri:wght@500;600;700&display=swap');
    body {
      font-family: 'Hind Siliguri', 'Baloo 2', sans-serif;
      padding: 30px;
      color: #22314D;
      background: #F8FAF9;
    }
    .card {
      max-width: 620px;
      margin: 0 auto;
      border: 3px solid #22314D;
      border-radius: 20px;
      padding: 32px;
      background: #FFFEF9;
      box-shadow: 6px 6px 0px #22314D;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px dashed #22314D;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .word {
      font-size: 38px;
      font-weight: 800;
      color: #E8543F;
      margin: 0;
      line-height: 1.1;
    }
    .pos {
      background: #8E5CF7;
      color: white;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
      border: 1.5px solid #22314D;
    }
    .phonetic {
      font-size: 16px;
      color: #22314D;
      margin-top: 8px;
      font-weight: 600;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #0B8F84;
      text-transform: uppercase;
      margin-top: 20px;
      margin-bottom: 6px;
      letter-spacing: 1px;
    }
    .meaning {
      font-size: 30px;
      font-weight: 800;
      color: #8E5CF7;
    }
    .box {
      background: #FFF6E4;
      border: 2px solid #22314D;
      border-radius: 12px;
      padding: 12px 16px;
      margin-top: 6px;
      font-size: 15px;
      line-height: 1.5;
    }
    .example {
      font-style: italic;
      border-left: 4px solid #FFC93C;
      padding-left: 14px;
      margin-top: 8px;
      font-size: 16px;
      color: #334155;
    }
    .footer {
      margin-top: 32px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
      border-top: 1px solid #CBD5E1;
      padding-top: 12px;
      font-weight: 600;
    }
    @media print {
      body { background: white; padding: 0; }
      .card { box-shadow: none; border-color: #000; width: 100%; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 class="word">${headword}</h1>
        <div class="phonetic">
          ${entry.bnPhonetic ? 'বাংলা: ' + entry.bnPhonetic : ''}
          ${entry.ipaPhonetic ? ' | IPA: ' + entry.ipaPhonetic : ''}
        </div>
      </div>
      <span class="pos">${entry.partOfSpeech || 'শব্দ'}</span>
    </div>

    <div class="section-title">বাংলা অর্থ</div>
    <div class="meaning">${entry.bnMeaning}</div>

    ${entry.enDefinition ? `
    <div class="section-title">সংজ্ঞা (ENGLISH DEFINITION)</div>
    <div class="box">${entry.enDefinition}</div>
    ` : ''}

    ${defBn || entry.enDefBn ? `
    <div class="section-title">বাংলা অনুবাদ (BENGALI EXPLANATION)</div>
    <div class="box">${defBn || entry.enDefBn}</div>
    ` : ''}

    ${entry.example ? `
    <div class="section-title">বাক্যে প্রয়োগ (EXAMPLE SENTENCE)</div>
    <div class="example">"${entry.example}"</div>
    ` : ''}

    ${usageData ? `
    <div class="section-title">শব্দের বাস্তব ব্যবহার ও প্রয়োগ (WORD USAGE & COLLOCATIONS)</div>
    <div class="box" style="background:#EBF5FF; border-color:#2B6CB0;">
      ${usageData.usageNotes ? `<div style="font-weight:bold; margin-bottom:6px; color:#1A365D;">💡 ${usageData.usageNotes}</div>` : ''}
      ${usageData.collocations && usageData.collocations.length > 0 ? `
        <div style="font-size:13px; margin-bottom:8px; font-weight:bold; color:#2B6CB0;">
          📌 কলকেশন / ফ্রেজ: ${usageData.collocations.join(' • ')}
        </div>
      ` : ''}
      ${usageData.examples && usageData.examples.length > 0 ? `
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
          ${usageData.examples.map(e => `
            <div style="background:white; padding:8px 12px; border-radius:8px; border:1px solid #CBD5E1;">
              <div style="font-size:11px; font-weight:bold; color:#0B8F84;">${e.context}</div>
              <div style="font-weight:600; color:#1E293B;">"${e.english}"</div>
              <div style="font-size:13px; color:#475569;">অ ${e.bengali}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
    ` : ''}

    ${etymology ? `
    <div class="section-title">শব্দের ইতিহাস ও উৎপত্তি (WORD ETYMOLOGY)</div>
    <div class="box" style="background:#F2EBFE; border-color:#8E5CF7;">${etymology}</div>
    ` : ''}

    ${entry.synonyms && entry.synonyms.length > 0 ? `
    <div class="section-title">সমার্থক শব্দ (SYNONYMS)</div>
    <div>${entry.synonyms.join(', ')}</div>
    ` : ''}

    ${entry.antonyms && entry.antonyms.length > 0 ? `
    <div class="section-title">বিপরীত শব্দ (ANTONYMS)</div>
    <div>${entry.antonyms.join(', ')}</div>
    ` : ''}

    <div class="footer">
      শব্দকোষ — অফলাইন অভিধান নোট • তারিখ: ${new Date().toLocaleDateString('bn-BD')}
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const twoExamples = getTwoExampleSentences(entry, exBn, ex2Bn, usageData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative bg-[#FFFEF9] border-3 border-[#22314D] rounded-[22px] p-6 sm:p-8 mt-6 shadow-[7px_7px_0_#22314D] transform -rotate-[0.6deg] w-full transition-transform hover:rotate-0"
    >
      {/* Top Floating Letter Badge */}
      <div className="absolute -top-5 left-3 sm:left-4 w-12 h-12 sm:w-14 sm:h-14 bg-[#FFC93C] border-3 border-[#22314D] rounded-full flex items-center justify-center font-['Baloo_2',sans-serif] font-extrabold text-2xl text-[#22314D] -rotate-12 shadow-[3px_3px_0_#22314D]">
        {firstLetter}
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 pl-12 sm:pl-14">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-['Quicksand',sans-serif] font-bold text-xs text-white bg-[#8E5CF7] border-2 border-[#22314D] rounded-full px-3.5 py-0.5 shadow-[1.5px_1.5px_0_#22314D]">
            {formatPartOfSpeech(entry.partOfSpeech).combined}
          </span>

          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#22314D]/30 ${
              entry.source === 'user-added'
                ? 'bg-[#FFD3CC] text-[#E8543F]'
                : entry.source === 'cached'
                ? 'bg-[#E3D4FC] text-[#7440D6]'
                : 'bg-[#B9F3E4] text-[#0B8F84]'
            }`}
          >
            <HardDrive size={11} />
            {entry.source === 'user-added'
              ? 'কাস্টম যোগ করা'
              : entry.source === 'cached'
              ? 'ক্যাশড অফলাইন'
              : 'অফলাইন ডাটাবেস'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(entry)}
            className={`p-2 rounded-full border-2 border-[#22314D] transition-transform active:scale-95 shadow-[2px_2px_0_#22314D] ${
              isBookmarked
                ? 'bg-[#FFC93C] text-[#22314D]'
                : 'bg-white text-[#22314D] hover:bg-[#FFF6E4]'
            }`}
            title={isBookmarked ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় সংরক্ষণ করুন'}
            aria-label="Bookmark word"
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-full bg-white text-[#22314D] border-2 border-[#22314D] hover:bg-[#FFF6E4] transition-transform active:scale-95 shadow-[2px_2px_0_#22314D]"
            title="কপি করুন"
            aria-label="Copy word details"
          >
            {copied ? <Check size={18} className="text-[#0FB5A6]" /> : <Share2 size={18} />}
          </button>
        </div>
      </div>

      {/* Word Headword Title with Pronunciation in Parentheses: e.g. local - (লোকাল) */}
      <div className="my-2">
        <h2 className="font-['Baloo_2',sans-serif] font-extrabold text-3xl sm:text-4xl text-[#E8543F] tracking-wide break-words flex flex-wrap items-baseline gap-2">
          <span>{headword}</span>
          <span className="text-xl sm:text-2xl text-[#22314D]/85 font-bold font-['Baloo_Da_2',sans-serif]">
            - ({getBengaliPronunciationText(headword, entry.bnPhonetic, entry.ipaPhonetic)})
          </span>
        </h2>
        {originalBnTerm && (
          <p className="text-xs text-[#22314D]/70 font-semibold mt-0.5">
            💡 "{originalBnTerm}" থেকে অনূদিত
          </p>
        )}
      </div>

      {/* Phonetic Row & Audio Playback Button */}
      <div className="flex items-center gap-2.5 my-3 flex-wrap">
        {entry.ipaPhonetic && (
          <span className="font-['JetBrains_Mono',monospace] font-medium text-xs sm:text-sm text-white bg-[#22314D] px-3 py-1 rounded-xl">
            {entry.ipaPhonetic}
          </span>
        )}

        {entry.bnPhonetic && (
          <span className="font-['Baloo_Da_2',sans-serif] font-bold text-sm text-[#22314D] bg-[#FFC93C] border-2 border-[#22314D] px-3 py-0.5 rounded-xl shadow-[1.5px_1.5px_0_#22314D]">
            {entry.bnPhonetic}
          </span>
        )}

        <button
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className="w-10 h-10 rounded-full bg-[#FF6B5B] text-white border-2 border-[#22314D] flex items-center justify-center shadow-[3px_3px_0_#22314D] hover:bg-[#E8543F] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          title="উচ্চারণ শুনুন (অফলাইন স্পিচ)"
          aria-label="Play pronunciation"
        >
          <Volume2 size={20} className={isPlaying ? 'animate-bounce' : ''} />
        </button>

        <span className="text-[11px] text-[#22314D]/60 font-medium italic">
          (বাংলা ও আইপিএ উচ্চারণ)
        </span>
      </div>

      <hr className="border-t-3 border-dashed border-[#22314D]/20 my-4" />

      {/* Bengali Meaning */}
      <div className="mb-4">
        <span className="font-['Quicksand',sans-serif] font-bold text-[11px] tracking-wider uppercase text-[#0B8F84] block mb-1">
          বাংলা মানে
        </span>
        <p className="font-['Baloo_Da_2',sans-serif] font-bold text-2xl sm:text-3xl text-[#7440D6] leading-snug">
          {entry.bnMeaning}
        </p>
      </div>

      {/* Word Image Section */}
      <div className="my-5">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="font-['Quicksand',sans-serif] font-bold text-[11px] tracking-wider uppercase text-[#0B8F84] flex items-center gap-1.5">
            <ImageIcon size={13} />
            সম্পর্কিত চিত্র (Word Visual)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGenerateImagen}
              disabled={isImagenLoading}
              className="text-[11px] font-bold text-white bg-[#8E5CF7] hover:bg-[#7440D6] border-2 border-[#22314D] px-3 py-1 rounded-full shadow-[2px_2px_0_#22314D] flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
              title="Imagen AI দিয়ে শব্দের চমৎকার ভিজ্যুয়াল ইলাস্ট্রেশন জেনারেট করুন"
            >
              {isImagenLoading ? (
                <>
                  <Loader2 size={12} className="animate-spin text-white" />
                  <span>Imagen ছবি তৈরি করছে...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="text-[#FFC93C]" />
                  <span>Imagen AI দিয়ে ছবি তৈরি করুন</span>
                </>
              )}
            </button>

            {imageUrl && (
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="text-[11px] font-bold text-[#E8543F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 size={12} />
                বড় করে দেখুন
              </button>
            )}
          </div>
        </div>

        <div className="relative w-full h-52 sm:h-64 bg-[#FFF6E4] rounded-[20px] border-3 border-[#22314D] shadow-[4px_4px_0_#22314D] overflow-hidden flex items-center justify-center group">
          {isImagenLoading ? (
            <div className="flex flex-col items-center justify-center text-[#22314D] gap-2.5 p-4 text-center bg-[#F2EBFE]">
              <Loader2 size={32} className="animate-spin text-[#8E5CF7]" />
              <span className="text-sm font-bold font-['Hind_Siliguri',sans-serif] text-[#7440D6]">
                Imagen AI নির্দেশাবলী বিশ্লেষণ করে HD ইলাস্ট্রেশন ছবি তৈরি করছে...
              </span>
              <span className="text-xs text-[#22314D]/70 font-semibold">
                শব্দ: <span className="text-[#22314D] font-bold">"{headword}"</span> ({entry.bnMeaning})
              </span>
            </div>
          ) : isImgLoading ? (
            <div className="flex flex-col items-center justify-center text-[#22314D]/70 gap-2 p-4">
              <Loader2 size={26} className="animate-spin text-[#0FB5A6]" />
              <span className="text-xs font-bold font-['Hind_Siliguri',sans-serif]">শব্দটির ছবি স্বয়ংক্রিয় লোড করা হচ্ছে...</span>
            </div>
          ) : imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={headword}
                referrerPolicy="no-referrer"
                onError={handleImgError}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              />

              {/* Status Badges Overlay */}
              {isImagenGenerated && (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap pointer-events-none">
                  <span className="bg-[#8E5CF7] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white/40 shadow-xs flex items-center gap-1">
                    <Sparkles size={11} className="text-[#FFC93C]" />
                    Imagen AI Generated
                  </span>
                </div>
              )}

              {/* Fullscreen Controls Overlay */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="bg-[#22314D]/90 hover:bg-[#22314D] text-white p-1.5 rounded-xl border border-white/20 shadow-xs cursor-pointer transition-transform active:scale-95"
                  title="ফুল স্ক্রিন দেখুন"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#22314D] gap-3 p-4 text-center">
              {imagenError && (
                <div className="text-xs text-[#E8543F] font-semibold bg-[#FFF0ED] p-2 rounded-xl border border-[#E8543F]/30 flex items-center gap-1.5 mb-1">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{imagenError}</span>
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={handleGenerateImagen}
                  className="px-4 py-2 bg-[#8E5CF7] text-white border-2 border-[#22314D] rounded-xl font-bold text-xs shadow-[2px_2px_0_#22314D] hover:bg-[#7440D6] active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} className="text-[#FFC93C]" />
                  <span>Imagen AI দিয়ে ইলাস্ট্রেশন ছবি আঁকুন</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* English Definition & Explanation */}
      {entry.enDefinition && (
        <div className="mb-4 bg-[#F8FDFA] border border-[#0FB5A6]/20 rounded-2xl p-4 shadow-2xs">
          <span className="font-['Quicksand',sans-serif] font-bold text-[11px] tracking-wider uppercase text-[#0B8F84] block mb-1">
            অর্থ ও ব্যাখ্যা (ENGLISH DEFINITION & EXPLANATION)
          </span>
          <p className="font-sans font-medium text-base text-[#22314D] leading-relaxed">
            {entry.enDefinition}
          </p>
          {defBn ? (
            <p className="font-['Hind_Siliguri',sans-serif] font-bold text-sm sm:text-base text-[#0B8F84] mt-2 bg-[#E4F8EC] px-3.5 py-2 rounded-xl border border-[#0FB5A6]/30 shadow-2xs">
              অ সহজ বাংলা ব্যাখ্যা: {defBn}
            </p>
          ) : isTranslating ? (
            <div className="text-xs text-[#0B8F84] font-['Hind_Siliguri',sans-serif] mt-1.5 flex items-center gap-1.5 animate-pulse">
              <Loader2 size={12} className="animate-spin text-[#0FB5A6]" />
              <span>বাংলা অনুবাদ তৈরি করা হচ্ছে...</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Example Sentences Section (2 Example Sentences with Bengali Translation) */}
      <div className="mt-4 pt-3 border-t border-[#22314D]/10">
        <div className="flex items-center justify-between mb-2">
          <span className="font-['Quicksand',sans-serif] font-bold text-[11px] tracking-wider uppercase text-[#0B8F84] flex items-center gap-1.5">
            <MessageSquare size={13} className="text-[#0FB5A6]" />
            উদাহরণ ও অনুবাদ (EXAMPLE & USAGE)
          </span>
          <span className="text-[10px] font-bold text-[#0B8F84] bg-[#E4F8EC] px-2.5 py-0.5 rounded-full border border-[#0FB5A6]/30 flex items-center gap-1">
            <span>২টি বাক্য ও অনুবাদ</span>
          </span>
        </div>

        <div className="space-y-3">
          {twoExamples.map((ex) => (
            <div key={ex.id} className="bg-[#F8FDFA] border-1.5 border-[#0FB5A6]/25 rounded-2xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#0B8F84] bg-[#E4F8EC] px-2.5 py-0.5 rounded-md border border-[#0FB5A6]/20 flex items-center gap-1">
                  <span>{ex.label}</span>
                  {ex.context && <span className="opacity-75">· {ex.context}</span>}
                </span>

                <button
                  onClick={() => handlePlayAudio(ex.english, 'en-US')}
                  className="text-[11px] font-bold text-[#0FB5A6] bg-white hover:bg-[#E4F8EC] border border-[#0FB5A6]/40 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors active:scale-95 shrink-0"
                  title="পুরো বাক্যটি শুনুন (Play Sentence)"
                >
                  <Volume2 size={12} />
                  <span>শুনুন</span>
                </button>
              </div>

              {/* English Example & Bengali Translation formatted: English — Bengali */}
              <div className="pl-3 border-l-3 border-[#FFC93C] py-1 space-y-1">
                <p className="font-sans font-semibold text-sm sm:text-base text-[#22314D] leading-snug">
                  <span className="italic">"{ex.english}"</span>
                  {ex.bengali && (
                    <span className="not-italic text-[#0B8F84] font-['Hind_Siliguri',sans-serif] font-bold ml-1">
                      — {ex.bengali}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pronunciation Tip Section */}
      <PronunciationTipCard
        word={headword}
        ipa={entry.ipa}
        phoneticBn={entry.phoneticBn}
      />

      {/* Pronunciation Practice Section */}
      <PronunciationPractice
        word={headword}
        ipa={entry.ipa}
        phoneticBn={entry.phoneticBn}
      />

      {/* Synonyms & Antonyms Section (Gemini AI Powered) */}
      <div className="mt-5 pt-4 border-t-2 border-dashed border-[#22314D]/20">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-['Quicksand',sans-serif] font-bold text-[11px] tracking-wider uppercase text-[#7440D6] flex items-center gap-1.5">
              <Languages size={14} className="text-[#8E5CF7]" />
              সমার্থক ও বিপরীত শব্দ (SYNONYMS & ANTONYMS)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {synonymsData?.synonyms && synonymsData.synonyms.length > 0 && (
              <button
                onClick={() => {
                  const text = synonymsData.synonyms.map(s => s.word).join(', ');
                  navigator.clipboard.writeText(text);
                  alert('সমার্থক শব্দগুলো কপি করা হয়েছে!');
                }}
                className="text-[11px] font-bold text-[#22314D] bg-white hover:bg-gray-100 border border-[#22314D]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                title="সকল সমার্থক শব্দ কপি করুন"
              >
                <Copy size={11} />
                <span>কপি</span>
              </button>
            )}

            <button
              onClick={fetchSynonymsFromGemini}
              disabled={isSynonymsLoading}
              className="text-[11px] font-bold text-[#8E5CF7] bg-[#F2EBFE] hover:bg-[#E5D7FD] border border-[#8E5CF7]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
              title="Gemini AI দিয়ে গভীর সমার্থক ও বিপরীত শব্দ বিশ্লেষণ করুন"
            >
              {isSynonymsLoading ? (
                <>
                  <Loader2 size={12} className="animate-spin text-[#8E5CF7]" />
                  <span>বিশ্লেষণ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="text-[#8E5CF7]" />
                  <span>AI দিয়ে প্রসারিত করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#FAF5FF] border-2 border-[#22314D] rounded-2xl p-4 shadow-[3px_3px_0_#22314D] relative space-y-3">
          {isSynonymsLoading ? (
            <div className="flex items-center gap-2.5 py-3 text-[#22314D]">
              <Loader2 size={18} className="animate-spin text-[#8E5CF7]" />
              <span className="text-xs sm:text-sm font-bold font-['Hind_Siliguri',sans-serif]">
                Gemini AI শব্দটির সমার্থক শব্দ, সূক্ষ্ম পার্থক্য ও বাংলা অর্থ সংগ্রহ করছে...
              </span>
            </div>
          ) : synonymsData ? (
            <>
              {/* Vocabulary Tip */}
              {synonymsData.vocabularyTip && (
                <div className="bg-[#FFFDF7] border border-[#8E5CF7]/25 rounded-xl p-2.5 flex items-start gap-2">
                  <Lightbulb size={16} className="text-[#FFB800] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] font-bold text-[#22314D] leading-snug">
                    {synonymsData.vocabularyTip}
                  </p>
                </div>
              )}

              {/* Synonyms Grid */}
              {synonymsData.synonyms && synonymsData.synonyms.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#7440D6] flex items-center gap-1">
                      <Layers size={13} />
                      সমার্থক শব্দাবলি (Synonyms):
                    </span>
                    <span className="text-[10px] font-bold text-[#7440D6]/70 bg-white/80 px-2 py-0.5 rounded-md border border-[#8E5CF7]/20">
                      শব্দে ক্লিক করে খুঁজুন 🔍
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {synonymsData.synonyms.map((syn, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-1.5 border-[#22314D]/20 rounded-xl p-2.5 shadow-2xs flex flex-col justify-between hover:border-[#8E5CF7] transition-all group"
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          <button
                            onClick={() => onSelectWord && onSelectWord(syn.word)}
                            className="font-sans font-bold text-sm text-[#22314D] capitalize hover:text-[#8E5CF7] flex items-center gap-1 cursor-pointer transition-colors text-left"
                            title={`"${syn.word}" শব্দটি ডিকশনারিতে খুঁজুন`}
                          >
                            <span>{syn.word}</span>
                            <Search size={11} className="opacity-0 group-hover:opacity-100 text-[#8E5CF7] transition-opacity" />
                          </button>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handlePlayAudio(syn.word, 'en-US')}
                              className="text-[10px] font-bold text-[#8E5CF7] hover:bg-[#F2EBFE] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 cursor-pointer"
                              title="উচ্চারণ শুনুন"
                            >
                              <Volume2 size={11} />
                              <span>শুনুন</span>
                            </button>

                            {onSelectWord && (
                              <button
                                onClick={() => onSelectWord(syn.word)}
                                className="text-[10px] font-bold text-[#0FB5A6] hover:bg-[#E4F8EC] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 cursor-pointer"
                                title="শব্দটি ডিকশনারিতে খুলুন"
                              >
                                <Search size={10} />
                                <span>খুঁজুন</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {syn.meaningBn && (
                          <p className="font-['Hind_Siliguri',sans-serif] font-semibold text-xs text-[#7440D6]">
                            অ {syn.meaningBn}
                          </p>
                        )}
                        {syn.nuanceNote && (
                          <p className="font-['Hind_Siliguri',sans-serif] text-[11px] text-[#22314D]/70 italic mt-0.5 bg-[#FAF5FF] p-1 rounded-md">
                            💡 {syn.nuanceNote}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms Grid */}
              {synonymsData.antonyms && synonymsData.antonyms.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#8E5CF7]/20">
                  <span className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#E8543F] flex items-center gap-1">
                    <X size={13} />
                    বিপরীত শব্দাবলি (Antonyms):
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {synonymsData.antonyms.map((ant, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FFF0ED] border border-[#E8543F]/30 px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 font-semibold text-[#22314D] hover:border-[#E8543F] transition-colors"
                      >
                        <button
                          onClick={() => onSelectWord && onSelectWord(ant.word)}
                          className="font-bold text-[#E8543F] capitalize hover:underline cursor-pointer flex items-center gap-0.5"
                          title={`"${ant.word}" শব্দটি খুঁজুন`}
                        >
                          <span>{ant.word}</span>
                          <Search size={10} className="text-[#E8543F]" />
                        </button>
                        {ant.meaningBn && (
                          <span className="text-[#22314D]/70 text-[11px]">({ant.meaningBn})</span>
                        )}
                        <button
                          onClick={() => handlePlayAudio(ant.word, 'en-US')}
                          className="text-[#E8543F] hover:opacity-80 cursor-pointer ml-0.5"
                          title="উচ্চারণ শুনুন"
                        >
                          <Volume2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : synonymsError ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E8543F]">
                <AlertCircle size={15} />
                <span>{synonymsError}</span>
              </div>
              <button
                onClick={fetchSynonymsFromGemini}
                className="text-xs font-bold text-[#8E5CF7] underline hover:text-[#7440D6] cursor-pointer"
              >
                পুনরায় চেষ্টা করুন
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 py-1">
              <span className="text-xs font-semibold text-[#22314D]/70 font-['Hind_Siliguri',sans-serif]">
                শব্দটির বিস্তারিত সমার্থক শব্দ, বিপরীত শব্দ ও বাংলা সূক্ষ্ম পার্থক্য পেতে AI বাটন চাপুন।
              </span>
              <button
                onClick={fetchSynonymsFromGemini}
                className="text-xs font-bold text-[#8E5CF7] underline hover:text-[#7440D6] cursor-pointer shrink-0"
              >
                AI দিয়ে দেখুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Word Usage & Collocations Section */}
      <div className="mt-5 pt-4 border-t-2 border-dashed border-[#22314D]/20">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-['Quicksand',sans-serif] font-bold text-[11px] tracking-wider uppercase text-[#0B8F84] flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#0FB5A6]" />
              শব্দের বাস্তব ব্যবহার ও প্রয়োগ (WORD USAGE & COLLOCATIONS)
            </span>
          </div>

          <button
            onClick={fetchUsageFromGemini}
            disabled={isUsageLoading}
            className="text-[11px] font-bold text-[#0B8F84] bg-[#E4F8EC] hover:bg-[#C9F3E8] border border-[#0FB5A6]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
            title="Gemini AI দিয়ে বাস্তব জীবনের নতুন ব্যবহার দেখুন"
          >
            {isUsageLoading ? (
              <>
                <Loader2 size={12} className="animate-spin text-[#0FB5A6]" />
                <span>ব্যবহার বিশ্লেষণ করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles size={12} className="text-[#0FB5A6]" />
                <span>AI দিয়ে বাস্তব প্রয়োগ দেখুন</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#EDF7F6] border-2 border-[#22314D] rounded-2xl p-4 shadow-[3px_3px_0_#22314D] relative space-y-3">
          {isUsageLoading ? (
            <div className="flex items-center gap-2.5 py-3 text-[#22314D]">
              <Loader2 size={18} className="animate-spin text-[#0FB5A6]" />
              <span className="text-xs sm:text-sm font-bold font-['Hind_Siliguri',sans-serif]">
                Gemini AI শব্দটির বিভিন্ন বাস্তব ব্যবহার, কলকেশন ও বিভিন্ন প্রসঙ্গ তৈরি করছে...
              </span>
            </div>
          ) : usageData ? (
            <>
              {/* Usage Note */}
              {usageData.usageNotes && (
                <div className="bg-[#FFFDF7] border border-[#22314D]/20 rounded-xl p-2.5 flex items-start gap-2">
                  <Lightbulb size={16} className="text-[#FFB800] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] font-bold text-[#22314D] leading-snug">
                    {usageData.usageNotes}
                  </p>
                </div>
              )}

              {/* Collocations / Phrasal Combinations */}
              {usageData.collocations && usageData.collocations.length > 0 && (
                <div>
                  <span className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#0B8F84] flex items-center gap-1 mb-1.5">
                    <Layers size={13} />
                    সাধারণ জুটি ও ফ্রেজ (Collocations & Phrases):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {usageData.collocations.map((col, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-[#22314D]/30 px-2.5 py-1 rounded-xl text-xs font-semibold text-[#22314D] shadow-2xs"
                      >
                        📌 {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Examples by Context */}
              {usageData.examples && usageData.examples.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#0B8F84] flex items-center gap-1">
                    <MessageSquare size={13} />
                    প্রসঙ্গভেদে ব্যবহার ও উদাহরণ (Contextual Usage Examples):
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {usageData.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-1.5 border-[#22314D]/25 rounded-xl p-3 shadow-2xs relative hover:border-[#0FB5A6] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-extrabold text-[#7440D6] bg-[#F2EBFE] px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#8E5CF7]/20">
                            {ex.context}
                          </span>
                          <button
                            onClick={() => handlePlayAudio(ex.english, 'en-US')}
                            className="text-[11px] font-bold text-[#0FB5A6] hover:bg-[#E4F8EC] px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                            title="উদাহরণটি শুনুন"
                          >
                            <Volume2 size={12} />
                            <span>শুনুন</span>
                          </button>
                        </div>
                        <p className="font-sans font-bold text-xs sm:text-sm text-[#22314D] mb-0.5">
                          "{ex.english}"
                        </p>
                        <p className="font-['Hind_Siliguri',sans-serif] font-semibold text-xs sm:text-sm text-[#0B8F84]">
                          অ {ex.bengali}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : usageError ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E8543F]">
                <AlertCircle size={15} />
                <span>{usageError}</span>
              </div>
              <button
                onClick={fetchUsageFromGemini}
                className="text-xs font-bold text-[#0B8F84] underline hover:text-[#0FB5A6] cursor-pointer"
              >
                পুনরায় চেষ্টা করুন
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Word Etymology / Origin Section (Gemini AI Powered) */}
      <div className="mt-5 pt-4 border-t-2 border-dashed border-[#22314D]/20">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-['Quicksand',sans-serif] font-bold text-[11px] tracking-wider uppercase text-[#7440D6] flex items-center gap-1.5">
              <History size={14} className="text-[#8E5CF7]" />
              শব্দের ইতিহাস ও উৎপত্তি (WORD ETYMOLOGY)
            </span>
            {etymology && (
              <span className="text-[10px] font-bold text-[#0B8F84] bg-[#E4F8EC] px-2 py-0.5 rounded-full border border-[#0FB5A6]/30 flex items-center gap-1">
                <CheckCircle2 size={10} />
                অফলাইনে সংরক্ষিত
              </span>
            )}
          </div>

          <button
            onClick={fetchEtymology}
            disabled={isEtymologyLoading}
            className="text-[11px] font-bold text-[#7440D6] bg-[#F2EBFE] hover:bg-[#E5D7FD] border border-[#8E5CF7]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
            title="Gemini AI দিয়ে শব্দের ইতিহাস বিশ্লেষণ করুন"
          >
            {isEtymologyLoading ? (
              <>
                <Loader2 size={12} className="animate-spin text-[#8E5CF7]" />
                <span>ইতিহাস খোঁজা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles size={12} className="text-[#8E5CF7]" />
                <span>{etymology ? 'পুনরায় লোড করুন' : 'AI দিয়ে ইতিহাস দেখুন'}</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#F6F0FE] border-2 border-[#22314D] rounded-2xl p-3.5 sm:p-4 shadow-[3px_3px_0_#22314D] relative">
          {isEtymologyLoading ? (
            <div className="flex items-center gap-2.5 py-2 text-[#22314D]">
              <Loader2 size={18} className="animate-spin text-[#8E5CF7]" />
              <span className="text-xs sm:text-sm font-bold font-['Hind_Siliguri',sans-serif]">
                Gemini AI শব্দটির প্রাচীন ইতিহাস ও ব্যাকরণগত বিবর্তন বিশ্লেষণ করছে...
              </span>
            </div>
          ) : etymology ? (
            <div className="space-y-1">
              <p className="font-['Hind_Siliguri',sans-serif] text-sm sm:text-base text-[#22314D] font-medium leading-relaxed whitespace-pre-line">
                {etymology}
              </p>
            </div>
          ) : etymologyError ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E8543F]">
                <AlertCircle size={15} />
                <span>{etymologyError}</span>
              </div>
              <button
                onClick={fetchEtymology}
                className="text-xs font-bold text-[#7440D6] underline hover:text-[#8E5CF7] cursor-pointer"
              >
                পুনরায় চেষ্টা করুন
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1">
              <p className="text-xs text-[#22314D]/75 font-['Hind_Siliguri',sans-serif] font-medium">
                শব্দটির মূল ভাষা (ল্যাটিন, গ্রীক, পুরনো ইংরেজি ইত্যাদি) ও ঐতিহাসিক রূপান্তরের তথ্য দেখুন।
              </p>
              <button
                onClick={fetchEtymology}
                className="text-xs font-bold text-[#7440D6] bg-white border border-[#22314D] px-3 py-1 rounded-xl shadow-[1.5px_1.5px_0_#22314D] hover:bg-[#F2EBFE] active:translate-y-0.5 cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Sparkles size={12} className="text-[#8E5CF7]" />
                ইতিহাস দেখুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Offline Export Toolbar */}
      <div className="mt-5 pt-4 border-t-2 border-dashed border-[#22314D]/20 flex items-center justify-between flex-wrap gap-2 bg-[#FFFDF7] p-3.5 rounded-2xl border-2 border-[#22314D]/20">
        <span className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#22314D] flex items-center gap-1.5">
          <Download size={15} className="text-[#0FB5A6]" />
          অফলাইনে নোট সেভ বা প্রিন্ট করুন:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportTxt}
            className="px-3 py-1.5 bg-[#FFF6E4] hover:bg-[#FFE3B3] text-[#22314D] border-2 border-[#22314D] rounded-xl font-bold text-xs shadow-[2px_2px_0_#22314D] flex items-center gap-1.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="টেক্সট নোট সেভ করুন (.txt)"
          >
            <FileText size={14} className="text-[#E8543F]" />
            <span>TXT নোট</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 bg-[#E4F8EC] hover:bg-[#C9F3E8] text-[#22314D] border-2 border-[#22314D] rounded-xl font-bold text-xs shadow-[2px_2px_0_#22314D] flex items-center gap-1.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="PDF বা প্রিন্ট আউট সেভ করুন"
          >
            <Printer size={14} className="text-[#0FB5A6]" />
            <span>PDF / প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#22314D]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-2xl w-full bg-[#FFFEF9] border-4 border-[#22314D] rounded-[24px] p-4 sm:p-6 shadow-[8px_8px_0_#22314D] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-3 right-3 p-2 bg-[#FF6B5B] text-white rounded-full border-2 border-[#22314D] hover:bg-[#E8543F] shadow-[2px_2px_0_#22314D] cursor-pointer"
                aria-label="Close image modal"
              >
                <X size={20} />
              </button>

              <h3 className="font-['Baloo_2',sans-serif] font-bold text-xl text-[#22314D] capitalize flex items-center gap-2">
                <ImageIcon size={20} className="text-[#0FB5A6]" />
                {headword} — দৃশ্যমান রূপ
              </h3>

              <div className="w-full max-h-[70vh] rounded-2xl overflow-hidden border-2 border-[#22314D]">
                <img
                  src={imageUrl}
                  alt={headword}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[65vh] object-contain mx-auto bg-[#FFF6E4]"
                />
              </div>

              <p className="font-['Baloo_Da_2',sans-serif] font-bold text-lg text-[#7440D6] text-center">
                বাংলা মানে: {entry.bnMeaning}
              </p>

              <button
                onClick={handleDownloadImage}
                className="px-5 py-2 bg-[#0FB5A6] hover:bg-[#0B8F84] text-white font-bold text-sm rounded-xl border-2 border-[#22314D] shadow-[3px_3px_0_#22314D] flex items-center gap-2 cursor-pointer active:translate-y-0.5 transition-all"
              >
                <Download size={16} />
                <span>ছবি ফাইল হিসেবে সেভ / ডাউনলোড করুন</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
