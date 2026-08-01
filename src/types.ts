export type SearchDirection = 'en-bn' | 'bn-en';

export type WordCategory =
  | 'Daily Life'
  | 'Emotions'
  | 'Education'
  | 'Technology'
  | 'Nature'
  | 'Business'
  | 'Health'
  | 'Abstract'
  | 'General';

export interface DictionaryEntry {
  id: string;
  word: string; // The primary headword (e.g., 'serendipity' or 'ভালোবাসা')
  englishWord: string; // Clean English word for audio/lookup
  bnMeaning: string; // Main Bengali meaning (e.g., 'হঠাৎ প্রাপ্ত সুখকর বা অপ্রত্যাশিত আবিষ্কার')
  bnPhonetic?: string; // Bengali phonetic spelling (e.g., 'সেরেনডিপটি')
  ipaPhonetic?: string; // IPA notation (e.g., '/ˌsɛrənˈdɪpɪti/')
  partOfSpeech: string; // noun, verb, adjective, adverb, etc.
  enDefinition: string; // English definition
  enDefBn?: string; // Bengali translation of definition
  example?: string; // English example sentence 1
  exampleBn?: string; // Bengali translation of example sentence 1
  example2?: string; // English example sentence 2
  example2Bn?: string; // Bengali translation of example sentence 2
  category?: WordCategory;
  synonyms?: string[];
  antonyms?: string[];
  source?: 'built-in' | 'cached' | 'user-added';
  etymology?: string;
  imageUrl?: string;
  imageCreator?: string;
  imageLicense?: string;
  audioUrl?: string;
  dateAdded?: number;
}

export interface SearchHistoryItem {
  id: string;
  word: string;
  timestamp: number;
  direction: SearchDirection;
}

export interface BookmarkItem {
  word: string;
  entry: DictionaryEntry;
  timestamp: number;
}
