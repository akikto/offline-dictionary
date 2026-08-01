import React from 'react';
import { Database, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  totalOfflineWords: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, totalOfflineWords }) => {
  return (
    <div
      className={`w-full max-w-2xl mx-auto mb-5 p-3 sm:p-3.5 rounded-2xl border-3 border-[#22314D] shadow-[4px_4px_0_#22314D] flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all ${
        isOnline
          ? 'bg-[#E4F8EC] text-[#0B8F84]'
          : 'bg-[#FFF2D6] text-[#22314D]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-xl bg-white border-2 border-[#22314D] flex-shrink-0 shadow-[2px_2px_0_#22314D]">
          {isOnline ? (
            <CheckCircle2 size={18} className="text-[#0FB5A6]" />
          ) : (
            <Database size={18} className="text-[#FF6B5B]" />
          )}
        </div>
        <div>
          <p className="font-bold leading-tight">
            {isOnline
              ? 'অনলাইন সংযোগ চালু আছে'
              : '⚡ অফলাইন মোড সক্রিয় — ইন্টারনেট ছাড়াই ফুল ডিকশনারি কাজ করছে!'}
          </p>
          <p className="text-[11px] sm:text-xs opacity-85 mt-0.5 font-normal">
            {totalOfflineWords}+ টি বিল্ট-ইন শব্দ ও আগের সার্চের তথ্য সম্পূর্ণ ডিভাইস লোকাল স্টোরেজে সুরক্ষিত।
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-[#22314D]/20 text-[11px] font-bold text-[#22314D] whitespace-nowrap">
        <ShieldCheck size={14} className="text-[#0FB5A6]" />
        <span>১০০% অফলাইন প্রস্তুত</span>
      </div>
    </div>
  );
};
