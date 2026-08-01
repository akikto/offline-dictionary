// Rule-based IPA -> Bengali script phonetic transliteration engine

const BN_VOWEL_MATRA: Record<string, string> = {
  'iː': 'ী',
  'ɪ': 'ি',
  'eɪ': 'ে',
  'e': 'ে',
  'ɛ': 'ে',
  'æ': '্যা',
  'ɑː': 'া',
  'ɑ': 'া',
  'ɒ': '',
  'ɔː': '',
  'ɔ': '',
  'ʊ': 'ু',
  'uː': 'ু',
  'ʌ': 'া',
  'ə': '',
  'oʊ': 'ো',
  'əʊ': 'ো',
  'aɪ': 'াই',
  'aʊ': 'াউ',
  'ɔɪ': 'য়',
  'ɜː': 'ার্',
  'ɜ': 'ার্',
  'ɚ': 'ার্',
  'ɝ': 'ার্',
  'eəʳ': 'েয়ার',
  'eər': 'েয়ার',
  'ɪəʳ': 'িয়ার',
  'ɪər': 'িয়ার',
  'ʊəʳ': 'ুয়ার',
  'ʊər': 'ুয়ার'
};

const BN_VOWEL_INDEP: Record<string, string> = {
  'iː': 'ঈ',
  'ɪ': 'ই',
  'eɪ': 'এই',
  'e': 'এ',
  'ɛ': 'এ',
  'æ': 'অ্যা',
  'ɑː': 'আ',
  'ɑ': 'আ',
  'ɒ': 'অ',
  'ɔː': 'অ',
  'ɔ': 'অ',
  'ʊ': 'উ',
  'uː': 'ঊ',
  'ʌ': 'আ',
  'ə': 'আ',
  'oʊ': 'ও',
  'əʊ': 'ও',
  'aɪ': 'আই',
  'aʊ': 'আউ',
  'ɔɪ': 'অয়',
  'ɜː': 'আর্',
  'ɜ': 'আর্',
  'ɚ': 'আর্',
  'ɝ': 'আর্',
  'eəʳ': 'এয়ার',
  'eər': 'এয়ার',
  'ɪəʳ': 'ইয়ার',
  'ɪər': 'ইয়ার',
  'ʊəʳ': 'উয়ার',
  'ʊər': 'উয়ার'
};

const BN_CONSONANT: Record<string, string> = {
  tʃ: 'চ',
  dʒ: 'জ',
  p: 'প',
  b: 'ব',
  t: 'ট',
  d: 'ড',
  k: 'ক',
  g: 'গ',
  ɡ: 'গ',
  f: 'ফ',
  v: 'ভ',
  θ: 'থ',
  ð: 'দ',
  s: 'স',
  z: 'জ়',
  ʃ: 'শ',
  ʒ: 'জ়',
  h: 'হ',
  m: 'ম',
  n: 'ন',
  ŋ: 'ং',
  l: 'ল',
  r: 'র',
  ɹ: 'র',
  j: 'য়',
  w: 'ও'
};

const IPA_TOKENS = Object.keys(BN_VOWEL_MATRA)
  .concat(Object.keys(BN_CONSONANT))
  .filter((v, i, a) => a.indexOf(v) === i)
  .sort((a, b) => b.length - a.length);

const IPA_TOKEN_REGEX = new RegExp(
  IPA_TOKENS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'g'
);

function tokenizeIpaWord(word: string): string[] {
  const cleaned = word
    .replace(/[ˈˌ.ʔ\u0361\u035C]/g, '')
    .replace(/:/g, 'ː');
  return cleaned.match(IPA_TOKEN_REGEX) || [];
}

function tokensToBengali(tokens: string[]): string {
  let result = '';
  let awaitingVowel = false;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const next = tokens[i + 1];

    if (BN_VOWEL_MATRA.hasOwnProperty(tok)) {
      result += awaitingVowel ? BN_VOWEL_MATRA[tok] : BN_VOWEL_INDEP[tok];
      awaitingVowel = false;
    } else if (BN_CONSONANT.hasOwnProperty(tok)) {
      result += BN_CONSONANT[tok];
      const nextIsConsonant = next && BN_CONSONANT.hasOwnProperty(next);
      if (nextIsConsonant) {
        result += '্';
        awaitingVowel = false;
      } else {
        awaitingVowel = true;
      }
    }
  }
  return result;
}

export function ipaToBengaliApprox(ipaRaw: string | undefined): string {
  if (!ipaRaw) return '';
  const stripped = ipaRaw.replace(/[\/\[\]]/g, '').trim();
  if (!stripped) return '';

  return stripped
    .split(/\s+/)
    .map((w) => tokensToBengali(tokenizeIpaWord(w)))
    .filter(Boolean)
    .join(' ');
}

export function englishToBengaliApprox(englishWord: string): string {
  if (!englishWord) return '';
  const w = englishWord.toLowerCase().trim();

  // Handle common word overrides directly for perfect pronunciation
  const commonMap: Record<string, string> = {
    local: 'লোকাল',
    global: 'গ্লোবাল',
    elephant: 'এলিফ্যান্ট',
    apple: 'অ্যাপল',
    book: 'বুক',
    water: 'ওয়াটার',
    cat: 'ক্যাট',
    dog: 'ডগ',
    sun: 'সান',
    moon: 'মুন',
    tree: 'ট্রি',
    flower: 'ফ্লাওয়ার',
    house: 'হাউস',
    car: 'কার',
    school: 'স্কুল',
    student: 'স্টুডেন্ট',
    teacher: 'টিচার',
    friend: 'ফ্রেন্ড',
    family: 'ফ্যামিলি',
    mother: 'মাদার',
    father: 'ফাদার',
    brother: 'ব্রাদার',
    sister: 'সিস্টার',
    city: 'সিটি',
    country: 'কান্ট্রি',
    world: 'ওয়ার্ল্ড',
    computer: 'কম্পিউটার',
    phone: 'ফোন',
    internet: 'ইন্টারনেট',
    language: 'ল্যাঙ্গুয়েজ',
    dictionary: 'ডিকশনারি'
  };

  if (commonMap[w]) return commonMap[w];

  return w
    .replace(/tion/g, 'শন')
    .replace(/sion/g, 'শন')
    .replace(/ment/g, 'মেন্ট')
    .replace(/ture/g, 'চার')
    .replace(/ness/g, 'নেস')
    .replace(/ling/g, 'লিং')
    .replace(/ing/g, 'ইং')
    .replace(/al$/g, 'াল')
    .replace(/ble$/g, 'বল')
    .replace(/ly$/g, 'লি')
    .replace(/ty$/g, 'টি')
    .replace(/ch/g, 'চ')
    .replace(/sh/g, 'শ')
    .replace(/th/g, 'থ')
    .replace(/ph/g, 'ফ')
    .replace(/ck/g, 'ক')
    .replace(/qu/g, 'ক্ব')
    .replace(/ee/g, 'ী')
    .replace(/ea/g, 'ী')
    .replace(/oo/g, 'ু')
    .replace(/ou/g, 'াউ')
    .replace(/ow/g, 'াও')
    .replace(/ai/g, 'েই')
    .replace(/ay/g, 'েই')
    .replace(/oa/g, 'ো')
    .replace(/ar/g, 'ার')
    .replace(/er/g, 'ার')
    .replace(/or/g, 'োর')
    .replace(/ir/g, 'ার')
    .replace(/ur/g, 'ার')
    .replace(/a/g, 'া')
    .replace(/e/g, 'ে')
    .replace(/i/g, 'ি')
    .replace(/o/g, 'ো')
    .replace(/u/g, 'ু')
    .replace(/b/g, 'ব')
    .replace(/c/g, 'ক')
    .replace(/d/g, 'ড')
    .replace(/f/g, 'ফ')
    .replace(/g/g, 'গ')
    .replace(/h/g, 'হ')
    .replace(/j/g, 'জ')
    .replace(/k/g, 'ক')
    .replace(/l/g, 'ল')
    .replace(/m/g, 'ম')
    .replace(/n/g, 'ন')
    .replace(/p/g, 'প')
    .replace(/q/g, 'ক')
    .replace(/r/g, 'র')
    .replace(/s/g, 'স')
    .replace(/t/g, 'ট')
    .replace(/v/g, 'ভ')
    .replace(/w/g, 'ও')
    .replace(/x/g, 'ক্স')
    .replace(/y/g, 'ওয়াই')
    .replace(/z/g, 'জ');
}

export function getBengaliPronunciationText(word: string, bnPhonetic?: string, ipaPhonetic?: string): string {
  if (bnPhonetic && bnPhonetic.trim()) {
    return bnPhonetic.trim();
  }
  if (ipaPhonetic) {
    const approx = ipaToBengaliApprox(ipaPhonetic);
    if (approx) return approx;
  }
  return englishToBengaliApprox(word);
}

// Web Speech Synthesis (Speech TTS - works offline in modern browsers)
export function speakWordOffline(
  text: string,
  lang: 'en-US' | 'bn-BD' = 'en-US',
  onEnd?: () => void,
  onError?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onError?.();
    return;
  }

  const cleanText = text.trim();
  if (!cleanText) {
    onError?.();
    return;
  }

  try {
    // Cancel any ongoing speech synthesis
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 0.85; // Natural clear pace
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const targetLangPrefix = lang.split('-')[0]; // 'en' or 'bn'
      const matchVoice =
        voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLangPrefix)) ||
        voices.find((v) => v.default);
      if (matchVoice) {
        utterance.voice = matchVoice;
      }
    }

    let finished = false;
    const cleanup = () => {
      if (!finished) {
        finished = true;
        onEnd?.();
      }
    };

    utterance.onend = () => {
      cleanup();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesisUtterance error:', e);
      if (!finished) {
        finished = true;
        onError ? onError() : onEnd?.();
      }
    };

    // Safety fallback timer for browsers that miss onend event
    const estimatedDurationMs = Math.max(1200, cleanText.length * 200);
    setTimeout(() => {
      if (!finished) {
        cleanup();
      }
    }, estimatedDurationMs);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis execution error:', err);
    onError ? onError() : onEnd?.();
  }
}

// Pronunciation Tip Data Interface
export interface PronunciationTipData {
  soundKey: string;
  titleBn: string;
  phoneticSymbol: string;
  mouthVisualIcon: string;
  ruleBn: string;
  mouthActionBn: string;
  wrongVsRight: { wrongBn: string; rightBn: string; note: string };
  syllableBreakdown?: string;
  stressNoteBn?: string;
}

// Helper to chunk word into approximate syllables
export function getApproxSyllables(word: string): string {
  if (!word) return '';
  const clean = word.trim().toLowerCase();
  if (clean.length <= 4) return clean;

  // Simple English syllable splitting rule
  const syllables = clean
    .replace(/(?:[^laeiouy]|ed|es|e)$/gi, '')
    .replace(/^y/gi, '')
    .match(/[aeiouy]{1,2}[^aeiouy]*/g);

  if (syllables && syllables.length > 1) {
    return syllables.join(' • ');
  }
  
  // Fallback regex split
  return clean.replace(/([aeiouy]{1,2})/g, '$1•').replace(/•$/, '');
}

// Pronunciation Tip Generator for difficult sounds (Bengali learner targeted)
export function generatePronunciationTip(
  word: string,
  ipa?: string,
  bnPhonetic?: string
): PronunciationTipData {
  const w = (word || '').toLowerCase().trim();
  const rawIpa = (ipa || '').toLowerCase();
  const approxBn = bnPhonetic || ipaToBengaliApprox(ipa);
  const syllables = getApproxSyllables(word);

  // 1. Silent Letters Check
  if (w.startsWith('kn')) {
    return {
      soundKey: 'silent_k',
      titleBn: 'অনুচ্চারিত বর্ণ (Silent K) এর টিপস',
      phoneticSymbol: 'k (Silent)',
      mouthVisualIcon: '🤫',
      ruleBn: 'শব্দের শুরুতে K-এর পর N থাকলে K বর্ণটির উচ্চারণ পুরোপুরি অনুচ্চারিত বা সাইলেন্ট থাকে।',
      mouthActionBn: 'মুখের ভঙ্গি: সরাসরি /n/ (ন) ধ্বনি দিয়ে শব্দ শুরু করুন। K উচ্চারণ করতে গিয়ে গলার পেছনের অংশ ব্লক করবেন না।',
      wrongVsRight: {
        wrongBn: '❌ "ক্‌নাইফ" বা "ক্‌নো"',
        rightBn: '✅ "নাইফ" (Knife) / "নো" (Know)',
        note: 'K সম্পূর্ণ বাদ যাবে।'
      },
      syllableBreakdown: syllables,
      stressNoteBn: 'প্রথম সিলেবল "N"-এ স্ট্রেস দিন।'
    };
  }

  if (w.endsWith('mb') || w.includes('bt')) {
    return {
      soundKey: 'silent_b',
      titleBn: 'অনুচ্চারিত বর্ণ (Silent B) এর টিপস',
      phoneticSymbol: 'b (Silent)',
      mouthVisualIcon: '🤫',
      ruleBn: 'শব্দের শেষে M-এর পর B থাকলে (যেমন: comb, bomb) অথবা T-এর আগে B থাকলে (যেমন: doubt) B অনুচ্চারিত থাকে।',
      mouthActionBn: 'মুখের ভঙ্গি: M এর পর ঠোঁট খুললেই উচ্চারণ শেষ হয়ে যাবে, B-এর জন্য বাতাস আটকাবেন না।',
      wrongVsRight: {
        wrongBn: '❌ "কোম্ব" বা "ডাউব্ট"',
        rightBn: '✅ "কোম" (Comb) / "ডাউট" (Doubt)',
        note: 'B একদম বলবেন না।'
      },
      syllableBreakdown: syllables,
    };
  }

  if (w.startsWith('wr') || w.startsWith('wh')) {
    return {
      soundKey: 'silent_w_h',
      titleBn: 'অনুচ্চারিত W / H ধ্বনির টিপস',
      phoneticSymbol: 'w/h (Silent)',
      mouthVisualIcon: '🤫',
      ruleBn: 'R-এর আগে W থাকলে W উচ্চারণ হবে না (Write)। WH দিয়ে শুরু হলে সাধারণত H অনুচ্চারিত থাকে (What, White)।',
      mouthActionBn: 'মুখের ভঙ্গি: সরাসরি R বা W ধ্বনিতে ঠোঁট গোল করে উচ্চারণ শুরু করুন।',
      wrongVsRight: {
        wrongBn: '❌ "উরাইট" বা "হোয়াট"',
        rightBn: '✅ "রাইট" (Write) / "ওয়াট" (What)',
        note: 'মসৃণভাবে ফ্লুইড ফ্লো বজায় রাখুন।'
      },
      syllableBreakdown: syllables,
    };
  }

  // 2. /v/ sound (Dentilabial friction) vs /b/
  if (w.includes('v') || rawIpa.includes('v')) {
    return {
      soundKey: 'v_sound',
      titleBn: 'V (/v/) ধ্বনির সঠিক উচ্চারণ নিয়ম',
      phoneticSymbol: '/v/',
      mouthVisualIcon: '🦷',
      ruleBn: 'V উচ্চারণ করার সময় ওপরের পাটির দাঁত নিচের ঠোঁটের ভেতরের অংশে আলতো করে স্পর্শ করাবে।',
      mouthActionBn: 'মুখের পজিশন: ওপরের দাঁত নিচের ঠোঁটে রেখে বাতাস ছাড়ুন ও গলায় কম্পন (Buzzing/Vibration) অনুভব করুন (v-v-v)।',
      wrongVsRight: {
        wrongBn: '❌ "বোট" (Boat) বা "ভোট" (বাংলা দুটো ঠোঁট আটকে)',
        rightBn: '✅ "V-v-vote" (দাঁত ও ঠোঁটের সংযোগে স্পর্শ)',
        note: 'বাংলা "ভ"-এর মতো দুই ঠোঁট জোড়া লাগাবেন না।'
      },
      syllableBreakdown: syllables,
      stressNoteBn: 'স্বরযন্ত্র বা গলায় হাত দিয়ে স্পন্দন (vibration) অনুভব করতে পারেন।'
    };
  }

  // 3. /th/ sound (/θ/ Unvoiced & /ð/ Voiced)
  if (w.includes('th') || rawIpa.includes('θ') || rawIpa.includes('ð')) {
    const isVoiced = rawIpa.includes('ð') || ['this', 'that', 'there', 'their', 'them', 'other', 'mother', 'father', 'brother', 'smooth'].includes(w);
    return {
      soundKey: 'th_sound',
      titleBn: `TH (${isVoiced ? '/ð/ Voiced' : '/θ/ Unvoiced'}) ধ্বনির সঠিক উচ্চারণ`,
      phoneticSymbol: isVoiced ? '/ð/' : '/θ/',
      mouthVisualIcon: '👅',
      ruleBn: 'TH এর উচ্চারণে জিবের ডগা ওপরের ও নিচের দাঁতের মাঝখানে সামান্য বের করে বাতাস ছাঁকতে হবে।',
      mouthActionBn: isVoiced
        ? 'মুখের পজিশন: জিবের ডগা দুই দাঁতের ফাঁকে রেখে গলায় শব্দ/কম্পন করুন (যেমন: this, mother)।'
        : 'মুখের পজিশন: জিবের ডগা দুই দাঁতের ফাঁকে রেখে শুধুই ফুসফুসের শিস বাতাস ছাড়ুন (যেমন: think, thank)।',
      wrongVsRight: {
        wrongBn: isVoiced ? '❌ "ডিস" বা "দিস" (দাঁতের পেছনে জিব দিয়ে)' : '❌ "থিংক" (বাংলা থ-এর মতো শক্ত)',
        rightBn: isVoiced ? '✅ "ð-ð-this" (জিভ ফাঁকে বের করে)' : '✅ "θ-θ-think" (নরম বাতাস বের করে)',
        note: 'জিভ দুই দাঁতের ফাঁকে আলতো বের হওয়া আবশ্যক।'
      },
      syllableBreakdown: syllables,
    };
  }

  // 4. /z/ sound (Buzzing vibration)
  if (w.includes('z') || w.includes('x') || rawIpa.includes('z') || rawIpa.includes('ʒ')) {
    return {
      soundKey: 'z_sound',
      titleBn: 'Z (/z/) ধ্বনির গুঞ্জন (Buzzing) নিয়ম',
      phoneticSymbol: '/z/',
      mouthVisualIcon: '🐝',
      ruleBn: 'Z উচ্চারণে মৌমাছির ভনভন বা বাযিং (Buzzing) শব্দের মতো স্বরযন্ত্রে স্পন্দন তৈরি করতে হয়।',
      mouthActionBn: 'মুখের পজিশon: ওপর ও নিচের দাঁত কাছাকাছি এনে ফাঁক দিয়ে বাতাস ঠেলে বের করার সময় গলায় শব্দ করুন (z-z-z)।',
      wrongVsRight: {
        wrongBn: '❌ "জিরো" বা "জিপ" (বাংলা জ বা ঝ-এর মতো)',
        rightBn: '✅ "Zzz-ero" / "Zzz-oo" (মৌমাছির মতো বাযিং)',
        note: 'গলায় আঙুল দিলে থরথর করে কাঁপবে।'
      },
      syllableBreakdown: syllables,
    };
  }

  // 5. /w/ sound (O-shaped lips) vs /v/
  if (w.includes('w') || rawIpa.includes('w')) {
    return {
      soundKey: 'w_sound',
      titleBn: 'W (/w/) ধ্বনির গোল ঠোঁট নিয়ম',
      phoneticSymbol: '/w/',
      mouthVisualIcon: '😮',
      ruleBn: 'W উচ্চারণ করার সময় ঠোঁট দুটোকে একদম গোল (O-shape) বানিয়ে সংকুচিত করতে হয়, কিন্তু দাঁত স্পর্শ করবে না।',
      mouthActionBn: 'মুখের পজিশন: ঠোঁট গোল করে "ওউ" আকারের মতো থেকে ঝটকা দিয়ে বাতাস ছেড়ে শব্দে যান (w-w-water)।',
      wrongVsRight: {
        wrongBn: '❌ "ভাটার" বা "ভোটার" (দাঁত ঠোঁটে লাগিয়ে)',
        rightBn: '✅ "W-w-water" (গোল ঠোঁট থেকে ছড়াবে)',
        note: 'দাঁত কখনোই নিচের ঠোঁটে লাগবে না।'
      },
      syllableBreakdown: syllables,
    };
  }

  // 6. /f/ or /ph/ sound
  if (w.includes('f') || w.includes('ph') || rawIpa.includes('f')) {
    return {
      soundKey: 'f_sound',
      titleBn: 'F / PH (/f/) ধ্বনির সঠিক নিয়ম',
      phoneticSymbol: '/f/',
      mouthVisualIcon: '💨',
      ruleBn: 'F ধ্বনিতে ওপরের দাঁত নিচের ঠোঁট স্পর্শ করে কিন্তু কোনো গলার আওয়াজ ছাড়া কেবল ফুসফুসের বাতাস বের হয়।',
      mouthActionBn: 'মুখের পজিশন: ওপরের পাটির দাঁত নিচের ঠোঁটে চেপে ধরে আলতো শিস বাতাস ছাড়ুন (f-f-f)।',
      wrongVsRight: {
        wrongBn: '❌ "ফ্যান" বা "ফটো" (বাংলা "ফ"-এর মতো দুই ঠোঁট জোড়া দিয়ে)',
        rightBn: '✅ "F-f-fan" (দাঁত ও ঠোঁটের ফাঁকে হালকা বাতাস)',
        note: 'গলায় কোনো কম্পন বা আওয়াজ থাকবে না।'
      },
      syllableBreakdown: syllables,
    };
  }

  // 7. /sh/ /ʃ/ vs /s/ /s/
  if (w.includes('sh') || w.includes('tion') || w.includes('sion') || rawIpa.includes('ʃ')) {
    return {
      soundKey: 'sh_sound',
      titleBn: 'SH (/ʃ/) ধ্বনির শিহরণ নিয়ম',
      phoneticSymbol: '/ʃ/',
      mouthVisualIcon: '👄',
      ruleBn: 'SH উচ্চারণে ঠোঁট দুটোকে গোল করে সামনের দিকে সামান্য ছড়িয়ে দিয়ে সুক্ষ্ম "শ" ধ্বনি তৈরি করতে হয়।',
      mouthActionBn: 'মুখের পজিশন: কাউকে চুপ করতে বলার সময় যেমন "শ্‌শ্‌শ" বলি, ঠিক সেভাবে ঠোঁট গোল করে বাতাস ছাড়ুন।',
      wrongVsRight: {
        wrongBn: '❌ "সুপ" (Ship কে Sip বলা)',
        rightBn: '✅ "Sh-sh-ship" (ঠোঁট গোল করে বাতাস)',
        note: 'S-এর ক্ষেত্রে চ্যাপ্টা হাসি মুখ, SH-এর ক্ষেত্রে গোল ঠোঁট।'
      },
      syllableBreakdown: syllables,
    };
  }

  // 8. /r/ sound (Retroflex / Curved tongue)
  if (w.includes('r') || rawIpa.includes('r') || rawIpa.includes('ɹ')) {
    return {
      soundKey: 'r_sound',
      titleBn: 'R (/r/) ধ্বনির বাঁকানো জিভ নিয়ম',
      phoneticSymbol: '/r/',
      mouthVisualIcon: '👅',
      ruleBn: 'ইংরেজি R উচ্চারণে জিব মুখের তালু বা ওপরের দাঁতে কখনোই স্পর্শ করবে না। জিব পেছনে বাঁকিয়ে ভাসিয়ে রাখতে হয়।',
      mouthActionBn: 'মুখের পজিশন: জিবের ডগা পেছনের দিকে উল্টে একটু বাঁকিয়ে বাতাস ছেড়ে বলুন (r-r-red)।',
      wrongVsRight: {
        wrongBn: '❌ "র‍্যাট" (বাংলা "র"-এর মতো তালুতে জিভ বাড়ি দিয়ে)',
        rightBn: '✅ "R-r-rat" (জিভ তালু না ছুঁয়ে বাতাসে ভাসিয়ে)',
        note: 'আমেরিকান একসেন্টে R স্পস্ট ও কার্ভড হয়।'
      },
      syllableBreakdown: syllables,
    };
  }

  // Default / General Syllable & Rhythm Tip
  return {
    soundKey: 'general_rhythm',
    titleBn: 'উচ্চারণ ও স্বরাঘাত (Syllable Stress) টিপস',
    phoneticSymbol: rawIpa || '/ˈpəʊ.ən/',
    mouthVisualIcon: '🎯',
    ruleBn: `শব্দটি উচ্চারণে সঠিক ছন্দ ধরে রাখতে সিলেবল বা শব্দাংশ বিভাজন ঠিক রেখে বলুন: "${syllables}"`,
    mouthActionBn: 'মুখের পজিশন: প্রথম চিহ্নিত সিলেবলে একটু বেশি চাপ (Stress) দিয়ে ও বাকি অংশে নরম স্বরে উচ্চারণ সম্পূর্ণ করুন।',
    wrongVsRight: {
      wrongBn: '❌ একদম ফ্ল্যাট বা সমতলে সব ধ্বনি সমানভাবে বলা',
      rightBn: `✅ "${approxBn || word}" — প্রথম সিলেবলে স্বাভাবিক ঝোঁক রাখুন`,
      note: 'ইংরেজি একটি স্ট্রেস-টাইমড ভাষা।'
    },
    syllableBreakdown: syllables,
    stressNoteBn: 'স্বাভাবিক গতিতে ২-৩ বার একটানা শুনতে প্লে বাটনটি ব্যবহার করুন।'
  };
}

