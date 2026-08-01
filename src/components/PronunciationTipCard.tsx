import React, { useState } from 'react';
import { Volume2, HelpCircle, CheckCircle2, XCircle, Info, Sliders, Sparkles, Lightbulb } from 'lucide-react';
import { generatePronunciationTip, speakWordOffline, PronunciationTipData } from '../utils/phonetics';

interface PronunciationTipCardProps {
  word: string;
  ipa?: string;
  phoneticBn?: string;
}

export const PronunciationTipCard: React.FC<PronunciationTipCardProps> = ({
  word,
  ipa,
  phoneticBn,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);

  const tipData: PronunciationTipData = generatePronunciationTip(word, ipa, phoneticBn);

  const handlePlaySound = (rate: number = 0.85, isSlow: boolean = false) => {
    if (isPlaying || isPlayingSlow) return;
    if (isSlow) setIsPlayingSlow(true);
    else setIsPlaying(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPlayingSlow(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPlayingSlow(false);
      };
      
      setTimeout(() => {
        setIsPlaying(false);
        setIsPlayingSlow(false);
      }, 2500);
      window.speechSynthesis.speak(utterance);
    } else {
      speakWordOffline(
        word,
        'en-US',
        () => {
          setIsPlaying(false);
          setIsPlayingSlow(false);
        },
        () => {
          setIsPlaying(false);
          setIsPlayingSlow(false);
        }
      );
    }
  };

  return (
    <div className="mt-5 pt-4 border-t-2 border-dashed border-[#22314D]/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <span className="font-['Quicksand',sans-serif] font-bold text-xs tracking-wider uppercase text-[#E8543F] flex items-center gap-1.5">
          <Lightbulb size={15} className="text-[#FFC93C]" />
          উচ্চারণ টিপস (PRONUNCIATION TIP)
        </span>
        <span className="text-[11px] font-extrabold text-[#7440D6] bg-[#F2EBFE] border border-[#7440D6]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span>ধ্বনি প্রতিকী:</span>
          <span className="font-mono text-xs">{tipData.phoneticSymbol}</span>
        </span>
      </div>

      <div className="bg-[#FFFDF7] border-2 border-[#22314D] rounded-2xl p-4 shadow-[3px_3px_0_#22314D] space-y-3">
        {/* Title & Mouth Icon Banner */}
        <div className="flex items-start justify-between gap-3 bg-[#FFF0ED] border border-[#E8543F]/25 p-3 rounded-xl">
          <div className="flex items-start gap-2.5">
            <span className="text-2xl shrink-0 p-1 bg-white rounded-xl border border-[#E8543F]/20 shadow-xs">
              {tipData.mouthVisualIcon}
            </span>
            <div>
              <h4 className="font-['Baloo_2',sans-serif] font-bold text-sm text-[#22314D]">
                {tipData.titleBn}
              </h4>
              <p className="font-['Hind_Siliguri',sans-serif] text-xs font-semibold text-[#22314D]/80 mt-0.5 leading-snug">
                {tipData.ruleBn}
              </p>
            </div>
          </div>
        </div>

        {/* Syllable Breakdown if available */}
        {tipData.syllableBreakdown && (
          <div className="flex items-center justify-between bg-[#F4F1EA] border border-[#22314D]/15 px-3 py-2 rounded-xl flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#22314D]/70 font-['Hind_Siliguri',sans-serif]">
                শব্দাংশ বিভাজন (Syllables):
              </span>
              <span className="font-['Baloo_2',sans-serif] font-extrabold text-sm text-[#7440D6] bg-white px-2.5 py-0.5 rounded-lg border border-[#7440D6]/30 tracking-wider">
                {tipData.syllableBreakdown}
              </span>
            </div>

            {/* Quick Play Audio Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePlaySound(0.85, false)}
                disabled={isPlaying || isPlayingSlow}
                className="px-2.5 py-1 bg-[#8E5CF7] text-white rounded-lg text-xs font-bold border border-[#22314D] shadow-[1.5px_1.5px_0_#22314D] hover:bg-[#7440D6] active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="স্বাভাবিক গতিতে শুনুন"
              >
                <Volume2 size={12} />
                <span>{isPlaying ? 'শব্দ হচ্ছে...' : 'শুনুন'}</span>
              </button>

              <button
                onClick={() => handlePlaySound(0.55, true)}
                disabled={isPlaying || isPlayingSlow}
                className="px-2 py-1 bg-[#FFC93C] text-[#22314D] rounded-lg text-xs font-bold border border-[#22314D] shadow-[1.5px_1.5px_0_#22314D] hover:bg-[#F2BA22] active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="ধীর গতিতে উচ্চারণ বিশ্লেষণ শুনুন (0.55x)"
              >
                <Sliders size={12} />
                <span>{isPlayingSlow ? 'ধীর...' : 'ধীর (0.5x)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Mouth & Tongue Position Guide */}
        <div className="bg-[#E4F8EC] border border-[#0FB5A6]/30 rounded-xl p-3">
          <span className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#0FB5A6] flex items-center gap-1 mb-1">
            <Info size={14} />
            মুখের ভঙ্গি ও জিবের কাজ (Mouth & Tongue Position):
          </span>
          <p className="font-['Hind_Siliguri',sans-serif] text-xs font-semibold text-[#22314D] leading-relaxed">
            {tipData.mouthActionBn}
          </p>
        </div>

        {/* Common Mistakes vs Correct Pronunciation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* Wrong / Common Bengali Mistake */}
          <div className="bg-[#FFF0ED] border border-[#E8543F]/30 rounded-xl p-2.5 flex items-start gap-2">
            <XCircle size={16} className="text-[#E8543F] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-[#E8543F] uppercase tracking-wider block">
                সাধারণ ভুল (Common Mistake):
              </span>
              <p className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#22314D] mt-0.5">
                {tipData.wrongVsRight.wrongBn}
              </p>
            </div>
          </div>

          {/* Correct Pronunciation */}
          <div className="bg-[#E4F8EC] border border-[#0FB5A6]/30 rounded-xl p-2.5 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-[#0FB5A6] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-[#0FB5A6] uppercase tracking-wider block">
                সঠিক উচ্চারণ (Correct Sound):
              </span>
              <p className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#22314D] mt-0.5">
                {tipData.wrongVsRight.rightBn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
