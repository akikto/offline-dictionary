import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, Sparkles, AlertCircle } from 'lucide-react';
import { SearchDirection, DictionaryEntry, SearchHistoryItem } from '../types';
import { getOfflineSuggestions } from '../utils/db';

interface SearchSectionProps {
  direction: SearchDirection;
  setDirection: (dir: SearchDirection) => void;
  onSearch: (word: string) => void;
  isLoading: boolean;
  history: SearchHistoryItem[];
  onClearHistory: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  direction,
  setDirection,
  onSearch,
  isLoading,
  history,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<DictionaryEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live autocomplete matching against local offline database
  useEffect(() => {
    if (searchTerm.trim().length >= 1) {
      const matches = getOfflineSuggestions(searchTerm, 8);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [searchTerm]);

  // Handle keyboard navigation inside search input
  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        const selectedWord = suggestions[selectedIndex].word;
        handleSelectSuggestion(selectedWord);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      onSearch(searchTerm.trim());
    }
  };

  const handleSelectSuggestion = (word: string) => {
    setSearchTerm(word);
    setShowSuggestions(false);
    onSearch(word);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      {/* Input Field & Action Buttons Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Top: Full-width Search Input Field */}
        <div className="relative w-full" ref={dropdownRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onKeyDown={handleKeyDownInput}
            placeholder={
              direction === 'en-bn'
                ? 'যেমন: serendipity'
                : 'যেমন: ভালোবাসা'
            }
            className="w-full font-['Baloo_2',sans-serif] font-semibold text-base sm:text-xl px-5 py-3.5 border-3 border-[#22314D] rounded-[24px] bg-white text-[#22314D] shadow-[4px_4px_0_#0FB5A6] focus:outline-none focus:border-[#22314D] transition-all pr-10"
            autoComplete="off"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#22314D]/50 hover:text-[#22314D] p-1"
              aria-label="Clear input"
            >
              <X size={18} />
            </button>
          )}

          {/* Offline Autocomplete Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-3 border-[#22314D] rounded-2xl shadow-[6px_6px_0_#22314D] z-50 overflow-hidden divide-y divide-[#22314D]/10 max-h-64 overflow-y-auto">
              <div className="px-3 py-2 bg-[#FFF6E4] text-[11px] font-bold text-[#0B8F84] uppercase tracking-wider flex items-center justify-between border-b border-[#22314D]/15">
                <div className="flex items-center gap-2">
                  <span>⚡ অফলাইন ম্যাচ</span>
                  <span className="text-[10px] bg-[#0FB5A6]/15 text-[#0B8F84] px-2 py-0.5 rounded-full font-extrabold">
                    {suggestions.length} টি সম্ভাব্য শব্দ
                  </span>
                </div>
                {/* Cancel / Dismiss Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-[#FF6B5B] hover:text-[#E8543F] bg-white hover:bg-[#FF6B5B]/10 px-2 py-1 rounded-lg border border-[#FF6B5B]/30 transition-colors cursor-pointer"
                  title="তালিকাটি বন্ধ করুন"
                >
                  <X size={14} />
                  <span>বন্ধ করুন</span>
                </button>
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(item.word)}
                  className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                    idx === selectedIndex ? 'bg-[#E4F8EC] border-l-4 border-[#0FB5A6]' : 'hover:bg-[#E4F8EC]'
                  }`}
                >
                  <div>
                    <span className="font-['Baloo_2',sans-serif] font-bold text-base text-[#E8543F]">
                      {item.word}
                    </span>
                    {item.bnPhonetic && (
                      <span className="ml-2 text-xs text-[#22314D]/60 font-medium">
                        ({item.bnPhonetic})
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-['Hind_Siliguri',sans-serif] font-bold text-[#0B8F84] truncate max-w-[160px]">
                    {item.bnMeaning}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: EN ⇄ BN Direction Toggle + Search Button on One Line */}
        <div className="flex items-center gap-2.5">
          {/* EN ⇄ BN Toggle Button */}
          <button
            type="button"
            onClick={() => setDirection(direction === 'en-bn' ? 'bn-en' : 'en-bn')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#EAF1EF] hover:bg-[#dbe6e3] text-[#22314D] font-black text-lg sm:text-xl tracking-wide rounded-[20px] border-3 border-[#22314D] shadow-[3px_3px_0_#22314D] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#22314D] transition-all cursor-pointer group"
            title="ভাষা পরিবর্তন করতে চাপুন"
          >
            {direction === 'en-bn' ? (
              <>
                <span className="text-[#22314D]">EN</span>
                <span className="text-lg sm:text-xl text-[#0FB5A6] font-bold group-hover:scale-125 transition-transform px-0.5">⇄</span>
                <span className="text-[#22314D]">BN</span>
              </>
            ) : (
              <>
                <span className="text-[#22314D]">BN</span>
                <span className="text-lg sm:text-xl text-[#FF6B5B] font-bold group-hover:scale-125 transition-transform px-0.5">⇄</span>
                <span className="text-[#22314D]">EN</span>
              </>
            )}
          </button>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className="flex-1 bg-[#0FB5A6] text-white font-['Baloo_2',sans-serif] font-bold text-base sm:text-lg px-4 sm:px-6 py-3 rounded-[20px] border-3 border-[#22314D] shadow-[3px_3px_0_#22314D] hover:bg-[#0B8F84] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#22314D] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Search size={19} />
            <span>খুঁজুন</span>
          </button>
        </div>
      </form>

      {/* Recent Search Chips */}
      {history.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22314D]/60 flex items-center gap-1">
              <History size={13} />
              <span>সাম্প্রতিক খোঁজা শব্দ</span>
            </span>
            <button
              onClick={onClearHistory}
              className="text-[11px] font-semibold text-[#E8543F] hover:underline"
            >
              মুছে ফেলুন
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => {
              const bgColors = ['bg-[#FFC93C]', 'bg-[#B9F3E4]', 'bg-[#FFD3CC]', 'bg-[#E3D4FC]'];
              const bg = bgColors[idx % bgColors.length];

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSearchTerm(item.word);
                    onSearch(item.word);
                  }}
                  className={`font-['Quicksand',sans-serif] font-bold text-xs sm:text-sm text-[#22314D] border-2 border-[#22314D] px-3.5 py-1.5 rounded-2xl shadow-[2.5px_2.5px_0_#22314D] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-transform ${bg}`}
                >
                  {item.word}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
