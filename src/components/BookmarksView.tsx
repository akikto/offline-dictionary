import React, { useState } from 'react';
import { Bookmark, Trash2, Search, Volume2 } from 'lucide-react';
import { BookmarkItem, DictionaryEntry } from '../types';
import { speakWordOffline } from '../utils/phonetics';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  onSelectWord: (word: string) => void;
  onRemoveBookmark: (entry: DictionaryEntry) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onSelectWord,
  onRemoveBookmark
}) => {
  const [filter, setFilter] = useState('');

  const filtered = bookmarks.filter(
    (b) =>
      b.word.toLowerCase().includes(filter.toLowerCase()) ||
      b.entry.bnMeaning.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border-3 border-[#22314D] rounded-[22px] p-5 sm:p-6 shadow-[6px_6px_0_#22314D]">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-[#22314D]/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FFC93C] text-[#22314D] rounded-xl border-2 border-[#22314D] shadow-[2px_2px_0_#22314D]">
            <Bookmark size={20} />
          </div>
          <div>
            <h2 className="font-['Baloo_Da_2',sans-serif] font-bold text-xl text-[#22314D]">
              পছন্দের শব্দ তালিকা ({bookmarks.length})
            </h2>
            <p className="text-xs text-[#22314D]/70 font-medium">
              আপনার সংরক্ষিত শব্দগুলো অফলাইনে সবসময় পাওয়া যাবে
            </p>
          </div>
        </div>
      </div>

      {bookmarks.length > 0 && (
        <div className="relative mb-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="সংরক্ষিত শব্দ ফিল্টার করুন..."
            className="w-full font-['Baloo_2',sans-serif] font-medium text-sm px-4 py-2.5 border-2 border-[#22314D] rounded-xl bg-[#FFF6E4] text-[#22314D] focus:outline-none focus:border-[#0FB5A6]"
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#22314D]/50" />
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="text-center py-10 px-4">
          <div className="text-4xl mb-2">⭐</div>
          <p className="font-['Baloo_Da_2',sans-serif] font-bold text-lg text-[#22314D]">
            আপনার পছন্দের তালিকায় এখনো কোনো শব্দ নেই
          </p>
          <p className="text-xs text-[#22314D]/70 mt-1 max-w-sm mx-auto">
            যেকোনো শব্দ সার্চ করার পর ওপরের বুকমার্ক আইকনে ক্লিক করে তালিকায় সংরক্ষণ করে রাখুন।
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.word}
              className="bg-[#FFF6E4] border-2 border-[#22314D] p-3.5 rounded-xl shadow-[2px_2px_0_#22314D] flex items-center justify-between gap-3 hover:bg-[#E4F8EC] transition-colors"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelectWord(item.word)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-['Baloo_2',sans-serif] font-bold text-lg text-[#E8543F]">
                    {item.word}
                  </span>
                  {item.entry.bnPhonetic && (
                    <span className="text-xs font-semibold text-[#22314D]/60 bg-[#FFC93C] px-2 py-0.2 rounded-md border border-[#22314D]">
                      {item.entry.bnPhonetic}
                    </span>
                  )}
                </div>
                <p className="font-['Hind_Siliguri',sans-serif] font-bold text-sm text-[#0B8F84] mt-0.5">
                  {item.entry.bnMeaning}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => speakWordOffline(item.entry.englishWord || item.word)}
                  className="p-2 bg-white rounded-lg border-2 border-[#22314D] text-[#22314D] hover:bg-[#FFC93C] transition-colors"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 size={16} />
                </button>
                <button
                  onClick={() => onRemoveBookmark(item.entry)}
                  className="p-2 bg-white rounded-lg border-2 border-[#22314D] text-[#E8543F] hover:bg-[#FFD3CC] transition-colors"
                  title="তালিকা থেকে মুছুন"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
