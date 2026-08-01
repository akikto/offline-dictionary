// Helper function to translate English text to Bengali via MyMemory API

export async function translateToBengali(text: string): Promise<string | null> {
  if (!text || !text.trim()) return null;
  
  // Clean up clean English string
  const cleanText = text.trim();
  
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|bn`
    );
    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && typeof translated === 'string' && translated.trim() !== cleanText) {
        // Clean response HTML entities if present
        const doc = new DOMParser().parseFromString(translated, 'text/html');
        return doc.body.textContent || translated;
      }
    }
  } catch (err) {
    console.warn('Translation lookup failed:', err);
  }
  return null;
}
