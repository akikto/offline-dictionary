import { DictionaryEntry, SearchDirection, BookmarkItem, SearchHistoryItem } from '../types';
import { BUILTIN_DICTIONARY } from '../data/dictionaryData';
import { SPECIALIZED_DICTIONARY_PACKS, DictionaryPack } from '../data/specializedDictionaries';
import { ipaToBengaliApprox } from './phonetics';
import { fetchWordImage } from './images';
import { translateToBengali } from './translation';

const CACHED_ENTRIES_KEY = 'shobdokosh_cached_entries';
const USER_WORDS_KEY = 'shobdokosh_user_words';
const BOOKMARKS_KEY = 'shobdokosh_bookmarks';
const HISTORY_KEY = 'shobdokosh_history';
const INSTALLED_PACKS_KEY = 'shobdokosh_installed_packs';

// --- LocalStorage Helpers ---

function getStoredArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return [];
  }
}

function setStoredArray<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Get all user custom added offline words
export function getUserCustomWords(): DictionaryEntry[] {
  return getStoredArray<DictionaryEntry>(USER_WORDS_KEY);
}

// Add user custom word offline
export function addUserCustomWord(entry: Omit<DictionaryEntry, 'id' | 'source' | 'dateAdded'>): DictionaryEntry {
  const customWords = getUserCustomWords();
  const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullEntry: DictionaryEntry = {
    ...entry,
    id,
    source: 'user-added',
    dateAdded: Date.now(),
    bnPhonetic: entry.bnPhonetic || ipaToBengaliApprox(entry.ipaPhonetic)
  };

  const updated = [fullEntry, ...customWords];
  setStoredArray(USER_WORDS_KEY, updated);
  return fullEntry;
}

// Delete custom word
export function deleteUserCustomWord(id: string): void {
  const customWords = getUserCustomWords().filter((w) => w.id !== id);
  setStoredArray(USER_WORDS_KEY, customWords);
}

// Get all cached entries (words fetched when online)
export function getCachedEntries(): DictionaryEntry[] {
  return getStoredArray<DictionaryEntry>(CACHED_ENTRIES_KEY);
}

// Save entry into offline cache
export function saveEntryToCache(entry: DictionaryEntry): void {
  const cached = getCachedEntries();
  const existingIndex = cached.findIndex(
    (e) => e.word.toLowerCase() === entry.word.toLowerCase()
  );

  let updated: DictionaryEntry[];
  if (existingIndex >= 0) {
    updated = [...cached];
    updated[existingIndex] = { ...entry, source: 'cached' };
  } else {
    updated = [{ ...entry, source: 'cached' }, ...cached];
  }

  // Keep up to 200 cached entries
  setStoredArray(CACHED_ENTRIES_KEY, updated.slice(0, 200));
}

// --- Specialized Offline Dictionary Packs Management ---

export function getInstalledPackIds(): string[] {
  return getStoredArray<string>(INSTALLED_PACKS_KEY);
}

export function isPackInstalled(packId: string): boolean {
  return getInstalledPackIds().includes(packId);
}

export function installDictionaryPack(packId: string): void {
  const installed = getInstalledPackIds();
  if (!installed.includes(packId)) {
    setStoredArray(INSTALLED_PACKS_KEY, [...installed, packId]);
  }
}

export function uninstallDictionaryPack(packId: string): void {
  const installed = getInstalledPackIds().filter((id) => id !== packId);
  setStoredArray(INSTALLED_PACKS_KEY, installed);
}

export function getDownloadedPackEntries(): DictionaryEntry[] {
  const installedIds = getInstalledPackIds();
  const entries: DictionaryEntry[] = [];

  SPECIALIZED_DICTIONARY_PACKS.forEach((pack) => {
    if (installedIds.includes(pack.id)) {
      entries.push(...pack.entries);
    }
  });

  return entries;
}

// Storage Usage & Backup Summary Helper
export function getStorageUsageSummary() {
  const customWords = getUserCustomWords();
  const cachedEntries = getCachedEntries();
  const installedPackIds = getInstalledPackIds();
  const downloadedEntries = getDownloadedPackEntries();

  let estimatedBytes = 0;
  if (typeof localStorage !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('shobdokosh_')) {
        const val = localStorage.getItem(key) || '';
        estimatedBytes += key.length + val.length;
      }
    }
  }

  const estimatedKb = Math.round(estimatedBytes / 1024);

  return {
    customCount: customWords.length,
    cachedCount: cachedEntries.length,
    installedPacksCount: installedPackIds.length,
    downloadedPacksWordCount: downloadedEntries.length,
    totalOfflineWords: getAllOfflineEntries().length,
    estimatedKb: estimatedKb > 0 ? estimatedKb : 12,
  };
}

// Export backup of custom data & settings
export function exportOfflineDataBackup(): string {
  const backupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    customWords: getUserCustomWords(),
    installedPackIds: getInstalledPackIds(),
    bookmarks: getBookmarks(),
  };
  return JSON.stringify(backupData, null, 2);
}

// Import backup data
export function importOfflineDataBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.customWords)) {
      setStoredArray(USER_WORDS_KEY, data.customWords);
    }
    if (Array.isArray(data.installedPackIds)) {
      setStoredArray(INSTALLED_PACKS_KEY, data.installedPackIds);
    }
    if (Array.isArray(data.bookmarks)) {
      setStoredArray(BOOKMARKS_KEY, data.bookmarks);
    }
    return true;
  } catch (err) {
    console.error('Failed to parse import JSON:', err);
    return false;
  }
}

// Combine all available offline databases: Built-in + Downloaded Packs + User Added + Online Cached
export function getAllOfflineEntries(): DictionaryEntry[] {
  const builtIn = BUILTIN_DICTIONARY;
  const downloadedPacks = getDownloadedPackEntries();
  const custom = getUserCustomWords();
  const cached = getCachedEntries();

  // Deduplicate by word
  const map = new Map<string, DictionaryEntry>();

  // Order of priority: custom > downloadedPacks > cached > built-in
  builtIn.forEach((item) => map.set(item.word.toLowerCase(), item));
  cached.forEach((item) => map.set(item.word.toLowerCase(), item));
  downloadedPacks.forEach((item) => map.set(item.word.toLowerCase(), item));
  custom.forEach((item) => map.set(item.word.toLowerCase(), item));

  return Array.from(map.values());
}

// Search offline database
export function searchOfflineDatabase(
  query: string,
  direction: SearchDirection = 'en-bn'
): DictionaryEntry | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  const allEntries = getAllOfflineEntries();

  // 1. Exact match on headword
  const exactHeadword = allEntries.find(
    (e) => e.word.toLowerCase() === clean
  );
  if (exactHeadword) return exactHeadword;

  // 2. Exact match on English word reference
  const exactEnglishRef = allEntries.find(
    (e) => e.englishWord.toLowerCase() === clean
  );
  if (exactEnglishRef) return exactEnglishRef;

  // 3. Match on Bengali meaning substring
  if (direction === 'bn-en') {
    const bnMatch = allEntries.find(
      (e) => e.word.includes(query) || e.bnMeaning.includes(query)
    );
    if (bnMatch) return bnMatch;
  }

  // 4. Prefix match
  const prefixMatch = allEntries.find((e) =>
    e.word.toLowerCase().startsWith(clean)
  );
  if (prefixMatch) return prefixMatch;

  // 5. Partial match
  const partialMatch = allEntries.find((e) =>
    e.word.toLowerCase().includes(clean)
  );
  if (partialMatch) return partialMatch;

  return null;
}

// Get autocomplete suggestions offline
export function getOfflineSuggestions(
  query: string,
  limit: number = 6
): DictionaryEntry[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const allEntries = getAllOfflineEntries();

  // Sort by relevance: Exact match -> Starts with -> Includes
  const exactMatches: DictionaryEntry[] = [];
  const startsWithMatches: DictionaryEntry[] = [];
  const includesMatches: DictionaryEntry[] = [];

  for (const e of allEntries) {
    const word = e.word.toLowerCase();
    const englishWord = e.englishWord.toLowerCase();
    const bnMeaning = e.bnMeaning.toLowerCase();

    if (word === clean || englishWord === clean) {
      exactMatches.push(e);
    } else if (word.startsWith(clean) || englishWord.startsWith(clean) || bnMeaning.startsWith(clean)) {
      startsWithMatches.push(e);
    } else if (word.includes(clean) || englishWord.includes(clean) || bnMeaning.includes(clean)) {
      includesMatches.push(e);
    }
  }

  return [...exactMatches, ...startsWithMatches, ...includesMatches].slice(0, limit);
}

// --- Bookmarks Management ---

export function getBookmarks(): BookmarkItem[] {
  return getStoredArray<BookmarkItem>(BOOKMARKS_KEY);
}

export function isBookmarked(word: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.word.toLowerCase() === word.toLowerCase());
}

export function toggleBookmark(entry: DictionaryEntry): boolean {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some(
    (b) => b.word.toLowerCase() === entry.word.toLowerCase()
  );

  let updated: BookmarkItem[];
  if (exists) {
    updated = bookmarks.filter(
      (b) => b.word.toLowerCase() !== entry.word.toLowerCase()
    );
  } else {
    updated = [
      { word: entry.word, entry, timestamp: Date.now() },
      ...bookmarks
    ];
  }

  setStoredArray(BOOKMARKS_KEY, updated);
  return !exists;
}

// --- Search History Management ---

export function getSearchHistory(): SearchHistoryItem[] {
  return getStoredArray<SearchHistoryItem>(HISTORY_KEY);
}

export function addToHistory(word: string, direction: SearchDirection): SearchHistoryItem[] {
  const clean = word.trim();
  if (!clean) return getSearchHistory();

  const history = getSearchHistory().filter(
    (item) => item.word.toLowerCase() !== clean.toLowerCase()
  );

  const newItem: SearchHistoryItem = {
    id: `hist_${Date.now()}`,
    word: clean,
    timestamp: Date.now(),
    direction
  };

  const updated = [newItem, ...history].slice(0, 12);
  setStoredArray(HISTORY_KEY, updated);
  return updated;
}

export function clearSearchHistory(): void {
  setStoredArray(HISTORY_KEY, []);
}

// --- Online API Lookup with Offline Fallback ---

export async function lookupWordOnlineOrOffline(
  word: string,
  direction: SearchDirection = 'en-bn',
  isOnline: boolean = true
): Promise<{ entry: DictionaryEntry | null; isOfflineData: boolean }> {
  const cleanWord = word.trim();
  if (!cleanWord) return { entry: null, isOfflineData: true };

  // Always check local offline database first
  const offlineMatch = searchOfflineDatabase(cleanWord, direction);

  // If we are offline, return local match directly
  if (!isOnline || !navigator.onLine) {
    return { entry: offlineMatch, isOfflineData: true };
  }

  // If online, attempt live network fetch for missing or deeper API details
  try {
    let searchTarget = cleanWord;
    let originalBnTerm: string | undefined = undefined;

    if (direction === 'bn-en') {
      // If searching in Bengali, translate to English term first
      const translateRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=bn|en`
      );
      if (translateRes.ok) {
        const transData = await translateRes.json();
        const translatedText = transData?.responseData?.translatedText;
        if (translatedText) {
          originalBnTerm = cleanWord;
          searchTarget = translatedText.split(/\s+/)[0].replace(/[^a-zA-Z'-]/g, '');
        }
      }
    }

    if (!searchTarget) {
      return { entry: offlineMatch, isOfflineData: true };
    }

    // Fetch dictionary API + Bengali MyMemory translation + Word image concurrently
    const [dictRes, bnRes, imageUrl] = await Promise.all([
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchTarget)}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(searchTarget)}&langpair=en|bn`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetchWordImage(searchTarget).catch(() => null)
    ]);

    const dictData = Array.isArray(dictRes) ? dictRes[0] : null;
    const translatedBnMeaning = bnRes?.responseData?.translatedText || null;

    if (!dictData) {
      // API didn't find entry; return offline match if available
      return { entry: offlineMatch, isOfflineData: true };
    }

    const firstMeaning = (dictData.meanings || [])[0] || {};
    const firstDef = (firstMeaning.definitions || [])[0] || {};
    const phoneticObj = (dictData.phonetics || []).find((p: any) => p.text) || {};
    const audioObj = (dictData.phonetics || []).find((p: any) => p.audio);

    const ipa = (dictData.phonetic || phoneticObj.text || '').replace(/[()]/g, '');
    const bnPhonetic = ipaToBengaliApprox(ipa);

    const enDef = firstDef.definition || '';
    const exampleStr = firstDef.example ? `${firstDef.example}` : '';

    // Extract a second example sentence if available in dictData
    let example2Str = '';
    for (const m of (dictData.meanings || [])) {
      for (const d of (m.definitions || [])) {
        if (d.example && d.example !== exampleStr) {
          example2Str = `${d.example}`;
          break;
        }
      }
      if (example2Str) break;
    }

    // Translate definition and example sentences to Bengali concurrently
    const [enDefBn, exampleBn, example2Bn] = await Promise.all([
      enDef ? translateToBengali(enDef) : Promise.resolve(null),
      exampleStr ? translateToBengali(exampleStr) : Promise.resolve(null),
      example2Str ? translateToBengali(example2Str) : Promise.resolve(null)
    ]);

    // Form final dictionary entry
    const newEntry: DictionaryEntry = {
      id: `online_${searchTarget}_${Date.now()}`,
      word: originalBnTerm || dictData.word || searchTarget,
      englishWord: searchTarget,
      bnMeaning: translatedBnMeaning || offlineMatch?.bnMeaning || 'অর্থ লোড করা হয়েছে',
      bnPhonetic: bnPhonetic || offlineMatch?.bnPhonetic,
      ipaPhonetic: ipa,
      partOfSpeech: firstMeaning.partOfSpeech || 'noun',
      enDefinition: enDef,
      enDefBn: enDefBn || offlineMatch?.enDefBn,
      example: exampleStr,
      exampleBn: exampleBn || offlineMatch?.exampleBn,
      example2: example2Str || offlineMatch?.example2,
      example2Bn: example2Bn || offlineMatch?.example2Bn,
      audioUrl: audioObj?.audio,
      imageUrl: imageUrl || offlineMatch?.imageUrl,
      synonyms: firstMeaning.synonyms || [],
      antonyms: firstMeaning.antonyms || [],
      source: 'cached',
      dateAdded: Date.now()
    };

    // Save to offline cache for future offline access!
    saveEntryToCache(newEntry);

    return { entry: newEntry, isOfflineData: false };
  } catch (err) {
    console.warn('Network lookup failed, serving from offline DB:', err);
    return { entry: offlineMatch, isOfflineData: true };
  }
}
