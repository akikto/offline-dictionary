// Image fetching & automatic visual illustration helper for Dictionary Words

const CURATED_IMAGE_MAP: Record<string, string> = {
  serendipity: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  love: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
  knowledge: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  courage: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=800&q=80',
  freedom: 'https://images.unsplash.com/photo-1508672019048-805479767784?auto=format&fit=crop&w=800&q=80',
  nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  book: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  flower: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
  water: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80',
  sun: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
};

/**
 * Creates a dynamic, aesthetic SVG visual card Data URL for any dictionary word.
 * This ensures that EVERY word gets a beautiful visual representation even when offline
 * or when no stock image is available anywhere!
 */
export function generateWordSvgIllustration(
  englishWord: string,
  bnMeaning: string = '',
  partOfSpeech: string = 'word'
): string {
  const word = (englishWord || 'Word').trim();
  const title = word.toUpperCase();
  const meaning = bnMeaning.trim() || 'শব্দার্থ';

  // Generate deterministic color theme palette based on word string hash
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = word.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorPalettes = [
    { bg1: '#0F2027', bg2: '#203A43', bg3: '#2C5364', accent: '#00F2FE', text: '#FFFFFF', pillBg: '#00C9FF22' },
    { bg1: '#1A1A2E', bg2: '#16213E', bg3: '#0F3460', accent: '#E94560', text: '#FFFFFF', pillBg: '#E9456022' },
    { bg1: '#11998E', bg2: '#38EF7D', bg3: '#0575E6', accent: '#FFD700', text: '#FFFFFF', pillBg: '#FFFFFF22' },
    { bg1: '#8A2387', bg2: '#E94057', bg3: '#F27121', accent: '#FFD166', text: '#FFFFFF', pillBg: '#FFFFFF22' },
    { bg1: '#232526', bg2: '#414345', bg3: '#141E30', accent: '#00E676', text: '#FFFFFF', pillBg: '#00E67622' },
    { bg1: '#4A00E0', bg2: '#8E2DE2', bg3: '#182848', accent: '#FFEA00', text: '#FFFFFF', pillBg: '#FFEA0022' },
    { bg1: '#000428', bg2: '#004E92', bg3: '#00223E', accent: '#38EF7D', text: '#FFFFFF', pillBg: '#38EF7D22' },
    { bg1: '#3A1C71', bg2: '#D76D77', bg3: '#FFAF7B', accent: '#FFFFFF', text: '#FFFFFF', pillBg: '#FFFFFF22' },
  ];

  const paletteIndex = Math.abs(hash) % colorPalettes.length;
  const p = colorPalettes[paletteIndex];

  // Pick initial letter
  const firstChar = title[0] || 'W';

  // Construct SVG
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.bg1}" />
        <stop offset="50%" stop-color="${p.bg2}" />
        <stop offset="100%" stop-color="${p.bg3}" />
      </linearGradient>
      <filter id="glow_${Math.abs(hash)}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <pattern id="grid_${Math.abs(hash)}" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="1.2" fill="#FFFFFF" opacity="0.1" />
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="600" height="400" fill="url(#bgGrad_${Math.abs(hash)})" />
    <rect width="600" height="400" fill="url(#grid_${Math.abs(hash)})" />

    <!-- Ambient Glowing Orbs -->
    <circle cx="480" cy="90" r="140" fill="${p.accent}" opacity="0.16" filter="url(#glow_${Math.abs(hash)})" />
    <circle cx="100" cy="310" r="120" fill="${p.bg3}" opacity="0.35" filter="url(#glow_${Math.abs(hash)})" />

    <!-- Outer Decorative Border Frame -->
    <rect x="22" y="22" width="556" height="356" rx="20" fill="none" stroke="${p.accent}" stroke-width="2" stroke-opacity="0.35" stroke-dasharray="8 6" />

    <!-- Central Floating Disc with Giant Initial -->
    <g transform="translate(300, 145)" text-anchor="middle">
      <circle cx="0" cy="-5" r="62" fill="${p.accent}" opacity="0.14" />
      <circle cx="0" cy="-5" r="48" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-opacity="0.5" />
      
      <text x="0" y="16" font-family="'Quicksand', 'Arial', sans-serif" font-size="68" font-weight="900" fill="${p.accent}" text-anchor="middle" filter="url(#glow_${Math.abs(hash)})">
        ${firstChar}
      </text>
    </g>

    <!-- Word Title & Bengali Meaning -->
    <g transform="translate(300, 245)" text-anchor="middle">
      <!-- Part of Speech Pill -->
      <rect x="-65" y="-30" width="130" height="22" rx="11" fill="${p.pillBg}" stroke="${p.accent}" stroke-width="1.5" stroke-opacity="0.6" />
      <text x="0" y="-15" font-family="'Quicksand', sans-serif" font-size="11" font-weight="700" fill="${p.accent}" letter-spacing="1">
        ${partOfSpeech.toUpperCase()}
      </text>

      <!-- English Headword -->
      <text x="0" y="14" font-family="'Baloo 2', 'Quicksand', sans-serif" font-size="32" font-weight="800" fill="${p.text}">
        ${word}
      </text>

      <!-- Bengali Meaning -->
      <text x="0" y="48" font-family="'Baloo Da 2', 'Hind Siliguri', sans-serif" font-size="28" font-weight="700" fill="${p.accent}">
        ${meaning}
      </text>
    </g>

    <!-- Footer Tagline -->
    <g transform="translate(300, 362)" text-anchor="middle">
      <text x="0" y="0" font-family="'Hind Siliguri', sans-serif" font-size="12" font-weight="600" fill="#FFFFFF" opacity="0.55">
        শব্দকোষ • স্বয়ংক্রিয় শব্দচিত্র (Visual Word Graphic)
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}

/**
 * Fetches a visual image URL corresponding to the given English word or term.
 * 1. Curated map
 * 2. Wikipedia Summary REST API
 * 3. Pollinations AI generator URL
 * 4. Automatic SVG illustration generator fallback
 */
export async function fetchWordImage(
  englishWord: string,
  bnMeaning: string = '',
  partOfSpeech: string = 'word'
): Promise<string> {
  const cleanWord = englishWord.trim().toLowerCase();
  if (!cleanWord) {
    return generateWordSvgIllustration(englishWord, bnMeaning, partOfSpeech);
  }

  // 1. Check curated mapping first
  if (CURATED_IMAGE_MAP[cleanWord]) {
    return CURATED_IMAGE_MAP[cleanWord];
  }

  // 2. Fetch from Wikipedia Summary REST API (CORS friendly, reliable thumbnails)
  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanWord)}`;
    const res = await fetch(wikiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data?.thumbnail?.source) {
        return data.thumbnail.source;
      }
      if (data?.originalimage?.source) {
        return data.originalimage.source;
      }
    }
  } catch (err) {
    console.warn('Wikipedia image API lookup error:', err);
  }

  // 3. Pollinations AI Image Generator prompt
  try {
    const promptText = `clear 3d vector visual illustration of ${cleanWord} ${bnMeaning ? 'meaning ' + bnMeaning : ''}, high quality minimalist dictionary image`;
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=600&height=400&nologo=true&seed=${cleanWord.length * 777}`;
    return pollinationsUrl;
  } catch (err) {
    console.warn('Pollinations image generation error:', err);
  }

  // 4. Default fallback: Dynamic SVG Illustration Card
  return generateWordSvgIllustration(englishWord, bnMeaning, partOfSpeech);
}

