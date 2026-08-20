import React from 'react';
import { Home, Search, BookOpen, Bookmark, PlusCircle, Award, Wifi, WifiOff, DownloadCloud } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  activeTab: 'search' | 'categories' | 'bookmarks' | 'custom' | 'quiz' | 'settings';
  setActiveTab: (tab: 'search' | 'categories' | 'bookmarks' | 'custom' | 'quiz' | 'settings') => void;
  isOnline: boolean;
  bookmarkCount: number;
  customWordCount: number;
  installedPacksCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  bookmarkCount,
  customWordCount,
  installedPacksCount = 0
}) => {
  return (
    <header className="w-full max-w-2xl mx-auto mb-6 text-center">
      {/* Top Banner Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          onClick={() => setActiveTab('search')}
          className="inline-block font-sans font-bold text-xs uppercase tracking-wider text-white bg-[#8E5CF7] px-3.5 py-1.5 rounded-full border-2 border-[#22314D] shadow-[2px_2px_0_#22314D] -rotate-1 hover:scale-105 active:scale-95 transition-transform text-left cursor-pointer"
          title="হোম স্ক্রিনে যান"
        >
          Word · অর্থ · উচ্চারণ
        </button>

        {/* Network Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 border-[#22314D] shadow-[2px_2px_0_#22314D] ${
            isOnline ? 'bg-[#E4F8EC] text-[#0B8F84]' : 'bg-[#FFF3D6] text-[#E8543F]'
          }`}
          title={isOnline ? 'অনলাইন কানেকশন রয়েছে' : 'অফলাইন মোড চালু রয়েছে'}
        >
          {isOnline ? (
            <>
              <Wifi size={14} className="text-[#0B8F84]" />
              <span>অনলাইন</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-[#E8543F]" />
              <span className="animate-pulse">অফলাইন মোড</span>
            </>
          )}
        </div>
      </div>

      {/* Main App Title */}
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('search')}
          className="group text-center inline-flex items-center justify-center gap-3 focus:outline-none cursor-pointer"
          title="হোমে ফিরুন"
        >
          <AppLogo size={56} className="group-hover:scale-105" />
          <h1 className="font-['Baloo_Da_2','Baloo_2',sans-serif] font-extrabold text-4xl sm:text-5xl text-[#22314D] drop-shadow-[3px_3px_0_#FFC93C] tracking-tight group-hover:scale-[1.02] transition-transform">
            শব্দকোষ
          </h1>
        </button>
        <p className="text-xs sm:text-sm text-[#22314D]/80 font-medium mt-1">
          ১০০% অফলাইন বাংলা-ইংরেজি শব্দকোষ, উচ্চারণ ও অর্থ
        </p>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 p-1.5 bg-[#EAF1EF] border-2 border-[#22314D] rounded-2xl shadow-[3px_3px_0_#22314D] overflow-x-auto no-scrollbar max-w-full">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'search'
              ? 'bg-[#0FB5A6] text-white shadow-[2px_2px_0_#22314D] border-2 border-[#22314D]'
              : 'text-[#22314D] hover:bg-white/60'
          }`}
        >
          <Home size={15} />
          <span>খুঁজুন</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'categories'
              ? 'bg-[#8E5CF7] text-white shadow-[2px_2px_0_#22314D] border-2 border-[#22314D]'
              : 'text-[#22314D] hover:bg-white/60'
          }`}
        >
          <BookOpen size={15} />
          <span>বিভাগ</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'bookmarks'
              ? 'bg-[#FFC93C] text-[#22314D] shadow-[2px_2px_0_#22314D] border-2 border-[#22314D]'
              : 'text-[#22314D] hover:bg-white/60'
          }`}
        >
          <Bookmark size={15} />
          <span>পছন্দ</span>
          {bookmarkCount > 0 && (
            <span className="ml-0.5 bg-[#22314D] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {bookmarkCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'custom'
              ? 'bg-[#FF6B5B] text-white shadow-[2px_2px_0_#22314D] border-2 border-[#22314D]'
              : 'text-[#22314D] hover:bg-white/60'
          }`}
        >
          <PlusCircle size={15} />
          <span>নিজস্ব শব্দ</span>
          {customWordCount > 0 && (
            <span className="ml-0.5 bg-white text-[#FF6B5B] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {customWordCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-[#22314D] text-white shadow-[2px_2px_0_#FFC93C] border-2 border-[#22314D]'
              : 'text-[#22314D] hover:bg-white/60'
          }`}
        >
          <Award size={15} />
          <span>কুইজ</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'settings'
              ? 'bg-[#0B8F84] text-white shadow-[2px_2px_0_#22314D] border-2 border-[#22314D]'
              : 'text-[#22314D] hover:bg-white/60'
          }`}
        >
          <DownloadCloud size={15} />
          <span>প্যাকস & সেটিংস</span>
          {installedPacksCount > 0 && (
            <span className="ml-0.5 bg-[#FFC93C] text-[#22314D] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {installedPacksCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};
