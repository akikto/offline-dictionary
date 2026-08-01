import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  HardDrive,
  CheckCircle2,
  Trash2,
  Sparkles,
  Search,
  Database,
  FileDown,
  FileUp,
  RefreshCw,
  Info,
  Check,
  Loader2,
  Sliders,
  FolderDown,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SPECIALIZED_DICTIONARY_PACKS, DictionaryPack } from '../data/specializedDictionaries';
import {
  isPackInstalled,
  installDictionaryPack,
  uninstallDictionaryPack,
  getStorageUsageSummary,
  exportOfflineDataBackup,
  importOfflineDataBackup,
  searchOfflineDatabase
} from '../utils/db';
import { DictionaryEntry } from '../types';

interface SettingsViewProps {
  onPacksUpdated: () => void;
  onSelectWord: (word: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onPacksUpdated,
  onSelectWord,
}) => {
  const [downloadingPackId, setDownloadingPackId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});
  const [storageSummary, setStorageSummary] = useState(getStorageUsageSummary());
  
  // Verification test search
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<DictionaryEntry | null>(null);

  // Backup / Import feedback
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  useEffect(() => {
    refreshPacksState();
  }, []);

  const refreshPacksState = () => {
    const map: Record<string, boolean> = {};
    SPECIALIZED_DICTIONARY_PACKS.forEach((pack) => {
      map[pack.id] = isPackInstalled(pack.id);
    });
    setInstalledMap(map);
    setStorageSummary(getStorageUsageSummary());
  };

  const handleInstallPack = (pack: DictionaryPack) => {
    if (downloadingPackId) return;

    setDownloadingPackId(pack.id);
    setDownloadProgress(10);

    // Realistic simulated offline package download and store animation
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      installDictionaryPack(pack.id);
      refreshPacksState();
      onPacksUpdated();
      setDownloadingPackId(null);
      setDownloadProgress(0);
    }, 1300);
  };

  const handleUninstallPack = (packId: string) => {
    uninstallDictionaryPack(packId);
    refreshPacksState();
    onPacksUpdated();
  };

  const handleTestSearch = (query: string) => {
    setTestQuery(query);
    if (!query.trim()) {
      setTestResult(null);
      return;
    }
    const match = searchOfflineDatabase(query);
    setTestResult(match);
  };

  const handleExportBackup = () => {
    const jsonStr = exportOfflineDataBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shobdokosh_offline_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBackupMessage('✅ ব্যাকআপ ফাইল সফলভাবে তৈরি ও ডাউনলোড হয়েছে!');
    setTimeout(() => setBackupMessage(null), 4000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importOfflineDataBackup(content);
        if (success) {
          refreshPacksState();
          onPacksUpdated();
          setBackupMessage('🎉 ব্যাকআপ ফাইল সফলভাবে ইম্পোর্ট ও রিস্টোর করা হয়েছে!');
        } else {
          setBackupMessage('❌ ফাইল ইম্পোর্ট করতে সমস্যা হয়েছে। সঠিক JSON ফাইল নির্বাচন করুন।');
        }
        setTimeout(() => setBackupMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFDF7] border-3 border-[#22314D] rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0_#22314D]">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#8E5CF7] text-white rounded-2xl border-2 border-[#22314D] shadow-[2px_2px_0_#22314D]">
              <DownloadCloud size={24} />
            </div>
            <div>
              <h2 className="font-['Baloo_2',sans-serif] font-bold text-xl sm:text-2xl text-[#22314D]">
                অফলাইন ডিকশনারি প্যাকস ও সেটিংস
              </h2>
              <p className="font-['Hind_Siliguri',sans-serif] text-xs sm:text-sm text-[#22314D]/80 font-semibold">
                মেডিকেল, লিগ্যাল ও টেকনিক্যাল পরিভাষা ডাউনলোড করে অফলাইন ডাটাবেস সমৃদ্ধ করুন।
              </p>
            </div>
          </div>

          <span className="bg-[#E4F8EC] text-[#0FB5A6] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0FB5A6]/40 flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            অফলাইন ইঞ্জিন রেডি
          </span>
        </div>

        {/* Database Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#FFF6E4] border-2 border-[#22314D] rounded-2xl p-3 shadow-[2px_2px_0_#22314D] text-center">
            <span className="text-[11px] font-bold text-[#22314D]/70 uppercase block">মোট অফলাইন শব্দ</span>
            <span className="font-['Baloo_2',sans-serif] font-extrabold text-xl text-[#7440D6]">
              {storageSummary.totalOfflineWords} টি
            </span>
          </div>

          <div className="bg-[#F2EBFE] border-2 border-[#22314D] rounded-2xl p-3 shadow-[2px_2px_0_#22314D] text-center">
            <span className="text-[11px] font-bold text-[#22314D]/70 uppercase block">ডাউনলোডকৃত প্যাক</span>
            <span className="font-['Baloo_2',sans-serif] font-extrabold text-xl text-[#8E5CF7]">
              {storageSummary.installedPacksCount} টি
            </span>
          </div>

          <div className="bg-[#E4F8EC] border-2 border-[#22314D] rounded-2xl p-3 shadow-[2px_2px_0_#22314D] text-center">
            <span className="text-[11px] font-bold text-[#22314D]/70 uppercase block">প্যাক থেকে সংগৃহীত</span>
            <span className="font-['Baloo_2',sans-serif] font-extrabold text-xl text-[#0FB5A6]">
              +{storageSummary.downloadedPacksWordCount} শব্দ
            </span>
          </div>

          <div className="bg-[#FFF0ED] border-2 border-[#22314D] rounded-2xl p-3 shadow-[2px_2px_0_#22314D] text-center">
            <span className="text-[11px] font-bold text-[#22314D]/70 uppercase block">মেমোরি জায়গা (Storage)</span>
            <span className="font-['Baloo_2',sans-serif] font-extrabold text-xl text-[#E8543F]">
              ~{storageSummary.estimatedKb} KB
            </span>
          </div>
        </div>
      </div>

      {/* Available Offline Dictionary Packs List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-['Baloo_2',sans-serif] font-bold text-lg text-[#22314D] flex items-center gap-2">
            <FolderDown size={20} className="text-[#8E5CF7]" />
            উপলব্ধ বিশেষায়িত অফলাইন শব্দকোষ প্যাকসমূহ
          </h3>
          <span className="text-xs font-semibold text-[#22314D]/70">
            ইন্টারনেট ছাড়াই ১০০% কাজ করবে
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {SPECIALIZED_DICTIONARY_PACKS.map((pack) => {
            const isInstalled = !!installedMap[pack.id];
            const isDownloading = downloadingPackId === pack.id;

            return (
              <div
                key={pack.id}
                className={`bg-white border-3 border-[#22314D] rounded-2xl p-4 shadow-[4px_4px_0_#22314D] transition-all relative overflow-hidden ${
                  isInstalled ? 'bg-[#FFFDF7]' : ''
                }`}
              >
                {/* Download Progress Bar Overlay */}
                {isDownloading && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-[#8E5CF7]/15 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                )}

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Pack Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl">{pack.icon}</span>
                      <h4 className="font-['Baloo_2',sans-serif] font-extrabold text-base sm:text-lg text-[#22314D]">
                        {pack.nameBn}
                      </h4>
                      <span className="text-xs font-mono font-semibold text-[#22314D]/60 bg-[#F4F1EA] px-2 py-0.5 rounded-md border border-[#22314D]/20">
                        {pack.nameEn}
                      </span>
                    </div>

                    <p className="font-['Hind_Siliguri',sans-serif] text-xs sm:text-sm text-[#22314D]/80 leading-snug">
                      {pack.descriptionBn}
                    </p>

                    {/* Sample Term Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-[#22314D]/60">নমুনা শব্দসমূহ:</span>
                      {pack.previewWords.map((w, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold text-[#22314D] bg-[#F2EBFE] border border-[#8E5CF7]/30 px-2 py-0.5 rounded-lg"
                        >
                          {w}
                        </span>
                      ))}
                    </div>

                    {/* Meta Badge */}
                    <div className="flex items-center gap-3 text-xs font-bold text-[#22314D]/70 pt-1">
                      <span>বই সংখ্যা: <strong className="text-[#8E5CF7]">{pack.wordCount} টি পরিভাষা</strong></span>
                      <span>•</span>
                      <span>সাইজ: <strong className="text-[#0FB5A6]">{pack.estimatedSize}</strong></span>
                    </div>
                  </div>

                  {/* Right Download / Installed Action */}
                  <div className="shrink-0 flex items-center gap-2">
                    {isDownloading ? (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F2EBFE] border-2 border-[#22314D] rounded-xl font-bold text-xs text-[#8E5CF7]">
                        <Loader2 size={16} className="animate-spin text-[#8E5CF7]" />
                        <span>ইন্সটল হচ্ছে... {downloadProgress}%</span>
                      </div>
                    ) : isInstalled ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3.5 py-2 bg-[#E4F8EC] text-[#0FB5A6] border-2 border-[#22314D] rounded-xl font-extrabold text-xs shadow-[2px_2px_0_#22314D] flex items-center gap-1.5">
                          <CheckCircle2 size={15} />
                          ইন্সটলড (সক্রিয়)
                        </span>

                        <button
                          onClick={() => handleUninstallPack(pack.id)}
                          className="p-2 text-[#E8543F] hover:bg-[#FFF0ED] border-2 border-[#22314D] rounded-xl shadow-[2px_2px_0_#22314D] active:translate-y-0.5 cursor-pointer transition-colors"
                          title="প্যাকটি অফলাইন ডাটাবেস থেকে রিমুভ করুন"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleInstallPack(pack)}
                        className="px-4 py-2.5 bg-[#8E5CF7] hover:bg-[#7440D6] text-white font-extrabold text-xs sm:text-sm rounded-xl border-2 border-[#22314D] shadow-[3px_3px_0_#22314D] flex items-center gap-2 active:translate-y-0.5 cursor-pointer transition-all"
                      >
                        <DownloadCloud size={16} className="text-[#FFC93C]" />
                        <span>ডাউনলোড ও ইন্সটল</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline Search Verification Box */}
      <div className="bg-[#FFFDF7] border-3 border-[#22314D] rounded-2xl p-5 shadow-[4px_4px_0_#22314D] space-y-3">
        <h3 className="font-['Baloo_2',sans-serif] font-bold text-base sm:text-lg text-[#22314D] flex items-center gap-2">
          <Search size={18} className="text-[#0FB5A6]" />
          নতুন অফলাইন প্যাক সার্চ পরীক্ষা (Offline Verification Test)
        </h3>
        <p className="font-['Hind_Siliguri',sans-serif] text-xs text-[#22314D]/80">
          ডাউনলোডকৃত প্যাকের যেকোনো শব্দ টাইপ করে দেখুন অফলাইন ডাটাবেস সেটি তাৎক্ষণিক খুঁজে বের করতে পারে কিনা:
        </p>

        <div className="relative">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => handleTestSearch(e.target.value)}
            placeholder="পরীক্ষা করুন (যেমন: Anatomy, Affidavit, Algorithm, Inflation)..."
            className="w-full bg-white border-2 border-[#22314D] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#22314D] shadow-[2px_2px_0_#22314D] focus:outline-none focus:ring-2 focus:ring-[#0FB5A6]"
          />
          {testQuery && (
            <button
              onClick={() => handleTestSearch('')}
              className="absolute right-3 top-2.5 text-xs text-[#22314D]/60 hover:text-[#22314D] font-bold"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* Test Search Result Preview */}
        {testQuery && (
          <div className="mt-2 p-3 bg-[#E4F8EC] border-2 border-[#22314D] rounded-xl shadow-[2px_2px_0_#22314D]">
            {testResult ? (
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#22314D] capitalize">{testResult.word}</span>
                    <span className="text-xs font-semibold text-[#7440D6]">({testResult.bnMeaning})</span>
                  </div>
                  <p className="text-xs text-[#22314D]/70 font-semibold mt-0.5 line-clamp-1">
                    {testResult.enDefBn || testResult.enDefinition}
                  </p>
                </div>
                <button
                  onClick={() => onSelectWord(testResult.word)}
                  className="px-3 py-1 bg-[#0FB5A6] text-white text-xs font-bold rounded-lg border border-[#22314D] shadow-[1.5px_1.5px_0_#22314D] hover:bg-[#0B8F84] cursor-pointer flex items-center gap-1"
                >
                  <span>কার্ডে দেখুন</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ) : (
              <span className="text-xs font-bold text-[#E8543F]">
                ⚠️ "{testQuery}" — অফলাইন তালিকায় পাওয়া যায়নি। প্যাকটি ইন্সটল করা আছে কি?
              </span>
            )}
          </div>
        )}
      </div>

      {/* Database Backup & Restore Options */}
      <div className="bg-[#FFFDF7] border-3 border-[#22314D] rounded-2xl p-5 shadow-[4px_4px_0_#22314D] space-y-3">
        <h3 className="font-['Baloo_2',sans-serif] font-bold text-base sm:text-lg text-[#22314D] flex items-center gap-2">
          <Database size={18} className="text-[#FFC93C]" />
          ডাটাবেস ব্যাকআপ ও রিস্টোর (Backup & Restore)
        </h3>
        <p className="font-['Hind_Siliguri',sans-serif] text-xs text-[#22314D]/80 leading-relaxed">
          আপনার যুক্ত করা নিজস্ব শব্দাবলি, বুকমার্ক ও ইন্সটলকৃত প্যাকসের ব্যাকআপ ফাইল সেভ করুন অথবা অন্য ডিভাইসে ট্রান্সফার করতে ইম্পোর্ট করুন:
        </p>

        {backupMessage && (
          <div className="p-3 bg-[#F2EBFE] border-2 border-[#22314D] rounded-xl text-xs font-bold text-[#7440D6]">
            {backupMessage}
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-[#FFC93C] hover:bg-[#F2BA22] text-[#22314D] font-extrabold text-xs rounded-xl border-2 border-[#22314D] shadow-[2.5px_2.5px_0_#22314D] flex items-center gap-2 cursor-pointer active:translate-y-0.5 transition-all"
          >
            <FileDown size={16} />
            <span>অফলাইন ব্যাকআপ ডাউনলোড (JSON)</span>
          </button>

          <label className="px-4 py-2.5 bg-[#FFF] hover:bg-[#F4F1EA] text-[#22314D] font-extrabold text-xs rounded-xl border-2 border-[#22314D] shadow-[2.5px_2.5px_0_#22314D] flex items-center gap-2 cursor-pointer active:translate-y-0.5 transition-all">
            <FileUp size={16} className="text-[#8E5CF7]" />
            <span>ব্যাকআপ ইম্পোর্ট করুন</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
