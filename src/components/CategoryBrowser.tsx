import React, { useState } from 'react';
import { BookOpen, Tag, Sparkles, Filter } from 'lucide-react';
import { DictionaryEntry, WordCategory } from '../types';
import { getAllOfflineEntries } from '../utils/db';

interface CategoryBrowserProps {
  onSelectWord: (word: string) => void;
}

const CATEGORIES: { name: WordCategory; labelBn: string; icon: string; color: string }[] = [
  { name: 'Daily Life', labelBn: 'দৈনন্দিন জীবন', icon: '🏠', color: 'bg-[#FFC93C]' },
  { name: 'Emotions', labelBn: 'অনুভূতি ও আবেগ', icon: '❤️', color: 'bg-[#FFD3CC]' },
  { name: 'Education', labelBn: 'শিক্ষা ও জ্ঞান', icon: '🎓', color: 'bg-[#B9F3E4]' },
  { name: 'Technology', labelBn: 'প্রযুক্তি ও বিজ্ঞান', icon: '💻', color: 'bg-[#E3D4FC]' },
  { name: 'Nature', labelBn: 'প্রকৃতি ও ভ্রমণ', icon: '🌿', color: 'bg-[#C8E6C9]' },
  { name: 'Health', labelBn: 'স্বাস্থ্য ও জীবনধারা', icon: '🍎', color: 'bg-[#FFCCBC]' },
  { name: 'Abstract', labelBn: 'ভাবনা ও দর্শন', icon: '✨', color: 'bg-[#E1BEE7]' }
];

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({ onSelectWord }) => {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'All'>('All');
  const [selectedLetter, setSelectedLetter] = useState<string | 'All'>('All');

  const allEntries = getAllOfflineEntries();

  // Filter words
  const filteredWords = allEntries.filter((entry) => {
    const categoryMatch =
      selectedCategory === 'All' || entry.category === selectedCategory;
    const firstChar = (entry.word[0] || '').toUpperCase();
    const letterMatch =
      selectedLetter === 'All' || firstChar === selectedLetter;
    return categoryMatch && letterMatch;
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border-3 border-[#22314D] rounded-[22px] p-5 sm:p-6 shadow-[6px_6px_0_#22314D]">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#22314D]/10">
        <div className="p-2 bg-[#8E5CF7] text-white rounded-xl border-2 border-[#22314D] shadow-[2px_2px_0_#22314D]">
          <BookOpen size={20} />
        </div>
        <div>
          <h2 className="font-['Baloo_Da_2',sans-serif] font-bold text-xl text-[#22314D]">
            অফলাইন শব্দতালিকা ব্রাউজ করুন
          </h2>
          <p className="text-xs text-[#22314D]/70 font-medium">
            বিষয়ভিত্তিক ও বর্ণমালা অনুযায়ী শব্দের অর্থ ও উচ্চারণ শিখুন
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-4">
        <span className="text-xs font-bold text-[#22314D]/70 uppercase tracking-wider block mb-2">
          বিষয় নির্বাচন:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs border-2 border-[#22314D] transition-transform ${
              selectedCategory === 'All'
                ? 'bg-[#22314D] text-white shadow-[2px_2px_0_#FFC93C]'
                : 'bg-[#FFF6E4] text-[#22314D] hover:bg-white'
            }`}
          >
            সব বিষয় ({allEntries.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border-2 border-[#22314D] transition-transform flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-[#0FB5A6] text-white shadow-[2px_2px_0_#22314D]'
                  : `${cat.color} text-[#22314D] hover:opacity-90`
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.labelBn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="mb-5">
        <span className="text-xs font-bold text-[#22314D]/70 uppercase tracking-wider block mb-2">
          বর্ণানুক্রমিক (A-Z):
        </span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedLetter('All')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs border-2 border-[#22314D] ${
              selectedLetter === 'All'
                ? 'bg-[#FF6B5B] text-white'
                : 'bg-white text-[#22314D] hover:bg-[#FFF6E4]'
            }`}
          >
            সব
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-7 h-7 rounded-lg font-['Baloo_2',sans-serif] font-bold text-xs border-2 border-[#22314D] ${
                selectedLetter === letter
                  ? 'bg-[#FFC93C] text-[#22314D]'
                  : 'bg-white text-[#22314D] hover:bg-[#FFF6E4]'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      <div className="border-t-2 border-[#22314D]/10 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#0B8F84]">
            প্রাপ্ত শব্দ: {filteredWords.length} টি
          </span>
        </div>

        {filteredWords.length === 0 ? (
          <div className="text-center py-8 text-[#22314D]/60 font-medium text-sm">
            এই ফিল্টারে কোনো শব্দ পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredWords.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelectWord(entry.word)}
                className="text-left bg-[#FFF6E4] hover:bg-[#E4F8EC] border-2 border-[#22314D] p-3 rounded-xl shadow-[2px_2px_0_#22314D] transition-transform active:translate-x-0.5 active:translate-y-0.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-['Baloo_2',sans-serif] font-bold text-lg text-[#E8543F]">
                    {entry.word}
                  </span>
                  <span className="text-[10px] font-bold bg-[#8E5CF7] text-white px-2 py-0.2 rounded-full border border-[#22314D]">
                    {entry.partOfSpeech || 'word'}
                  </span>
                </div>
                {entry.bnPhonetic && (
                  <span className="text-xs text-[#22314D]/70 font-semibold mt-0.5">
                    উচ্চারণ: {entry.bnPhonetic}
                  </span>
                )}
                <span className="font-['Hind_Siliguri',sans-serif] font-bold text-sm text-[#0B8F84] mt-1 line-clamp-1">
                  {entry.bnMeaning}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
