import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { SearchSection } from './components/SearchSection';
import { WordCard } from './components/WordCard';
import { CategoryBrowser } from './components/CategoryBrowser';
import { BookmarksView } from './components/BookmarksView';
import { CustomWordModal } from './components/CustomWordModal';
import { QuizView } from './components/QuizView';
import { SettingsView } from './components/SettingsView';

import {
  DictionaryEntry,
  SearchDirection,
  BookmarkItem,
  SearchHistoryItem
} from './types';
import {
  lookupWordOnlineOrOffline,
  getBookmarks,
  isBookmarked,
  toggleBookmark,
  getSearchHistory,
  addToHistory,
  clearSearchHistory,
  getAllOfflineEntries,
  getUserCustomWords,
  getInstalledPackIds
} from './utils/db';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'categories' | 'bookmarks' | 'custom' | 'quiz' | 'settings'>('search');
  const [direction, setDirection] = useState<SearchDirection>('en-bn');
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [activeEntry, setActiveEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalBnTerm, setOriginalBnTerm] = useState<string | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [customWordCount, setCustomWordCount] = useState<number>(0);
  const [installedPacksCount, setInstalledPacksCount] = useState<number>(0);
  const [totalOfflineWords, setTotalOfflineWords] = useState<number>(0);

  // Initialize network listeners & load initial data
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load
    refreshLocalCounts();
    setHistory(getSearchHistory());

    // Display a featured initial word on app start
    handleSearch('serendipity');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshLocalCounts = () => {
    setBookmarks(getBookmarks());
    setCustomWordCount(getUserCustomWords().length);
    setInstalledPacksCount(getInstalledPackIds().length);
    setTotalOfflineWords(getAllOfflineEntries().length);
  };

  const handleSearch = async (wordToSearch: string) => {
    if (!wordToSearch.trim()) return;

    setIsLoading(true);
    setStatusMessage('খোঁজা হচ্ছে...');

    try {
      const { entry, isOfflineData } = await lookupWordOnlineOrOffline(
        wordToSearch,
        direction,
        isOnline
      );

      if (entry) {
        setActiveEntry(entry);
        setOriginalBnTerm(direction === 'bn-en' ? wordToSearch : undefined);
        const updatedHistory = addToHistory(wordToSearch, direction);
        setHistory(updatedHistory);

        if (isOfflineData) {
          setStatusMessage('⚡ অফলাইন ডাটাবেস থেকে তথ্য প্রদান করা হয়েছে');
        } else {
          setStatusMessage('🌐 অনলাইন সংযোগের মাধ্যমে নতুন তথ্য পাওয়া গেছে');
        }
      } else {
        setStatusMessage(
          `"${wordToSearch}" — এই শব্দটি অভিধানে খুঁজে পাওয়া যায়নি। অফলাইন তালিকায় থাকা অন্য কোনো শব্দ টাইপ করে দেখুন।`
        );
      }
    } catch (err) {
      console.error('Search error:', err);
      setStatusMessage('অনুসন্ধান প্রক্রিয়ায় সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
      refreshLocalCounts();
    }
  };

  const handleToggleBookmark = (entryToBookmark: DictionaryEntry) => {
    toggleBookmark(entryToBookmark);
    refreshLocalCounts();
  };

  const handleSelectFromOtherViews = (word: string) => {
    setActiveTab('search');
    handleSearch(word);
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#FFF6E4] text-[#22314D] font-['Hind_Siliguri','Quicksand',sans-serif] px-4 py-8 sm:py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header & Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOnline={isOnline}
          bookmarkCount={bookmarks.length}
          customWordCount={customWordCount}
          installedPacksCount={installedPacksCount}
        />

        {/* Tab 1: Search View */}
        {activeTab === 'search' && (
          <main>
            <SearchSection
              direction={direction}
              setDirection={setDirection}
              onSearch={handleSearch}
              isLoading={isLoading}
              history={history}
              onClearHistory={handleClearHistory}
            />

            {/* Status Message */}
            {statusMessage && (
              <div
                className="text-center font-['Quicksand',sans-serif] font-bold text-xs sm:text-sm text-[#0B8F84] mb-3 transition-all"
                role="status"
              >
                {statusMessage}
              </div>
            )}

            {/* Word Card Result */}
            <AnimatePresence mode="wait">
              {activeEntry && (
                <WordCard
                  key={activeEntry.word || activeEntry.id}
                  entry={activeEntry}
                  isBookmarked={isBookmarked(activeEntry.word)}
                  onToggleBookmark={handleToggleBookmark}
                  originalBnTerm={originalBnTerm}
                  onSelectWord={handleSelectFromOtherViews}
                />
              )}
            </AnimatePresence>
          </main>
        )}

        {/* Tab 2: Category Browser */}
        {activeTab === 'categories' && (
          <main>
            <CategoryBrowser onSelectWord={handleSelectFromOtherViews} />
          </main>
        )}

        {/* Tab 3: Bookmarks View */}
        {activeTab === 'bookmarks' && (
          <main>
            <BookmarksView
              bookmarks={bookmarks}
              onSelectWord={handleSelectFromOtherViews}
              onRemoveBookmark={handleToggleBookmark}
            />
          </main>
        )}

        {/* Tab 4: Custom Words Saver */}
        {activeTab === 'custom' && (
          <main>
            <CustomWordModal
              onCustomWordAdded={refreshLocalCounts}
              onSelectWord={handleSelectFromOtherViews}
            />
          </main>
        )}

        {/* Tab 5: Quiz */}
        {activeTab === 'quiz' && (
          <main>
            <QuizView />
          </main>
        )}

        {/* Tab 6: Settings & Offline Packs */}
        {activeTab === 'settings' && (
          <main>
            <SettingsView
              onPacksUpdated={refreshLocalCounts}
              onSelectWord={handleSelectFromOtherViews}
            />
          </main>
        )}

      </div>
    </div>
  );
}
