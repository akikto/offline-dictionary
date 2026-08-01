import React, { useState } from 'react';
import { PlusCircle, Trash2, Save, Volume2 } from 'lucide-react';
import { DictionaryEntry, WordCategory } from '../types';
import { getUserCustomWords, addUserCustomWord, deleteUserCustomWord } from '../utils/db';
import { speakWordOffline } from '../utils/phonetics';

interface CustomWordModalProps {
  onCustomWordAdded: () => void;
  onSelectWord: (word: string) => void;
}

export const CustomWordModal: React.FC<CustomWordModalProps> = ({
  onCustomWordAdded,
  onSelectWord
}) => {
  const [word, setWord] = useState('');
  const [bnMeaning, setBnMeaning] = useState('');
  const [bnPhonetic, setBnPhonetic] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('noun');
  const [enDefinition, setEnDefinition] = useState('');
  const [example, setExample] = useState('');
  const [category, setCategory] = useState<WordCategory>('General');

  const [customWords, setCustomWords] = useState<DictionaryEntry[]>(getUserCustomWords());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !bnMeaning.trim()) return;

    addUserCustomWord({
      word: word.trim(),
      englishWord: word.trim(),
      bnMeaning: bnMeaning.trim(),
      bnPhonetic: bnPhonetic.trim() || undefined,
      partOfSpeech,
      enDefinition: enDefinition.trim() || undefined,
      example: example.trim() || undefined,
      category
    });

    setCustomWords(getUserCustomWords());
    setWord('');
    setBnMeaning('');
    setBnPhonetic('');
    setEnDefinition('');
    setExample('');
    onCustomWordAdded();
  };

  const handleDelete = (id: string) => {
    deleteUserCustomWord(id);
    setCustomWords(getUserCustomWords());
    onCustomWordAdded();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border-3 border-[#22314D] rounded-[22px] p-5 sm:p-6 shadow-[6px_6px_0_#22314D]">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#22314D]/10">
        <div className="p-2 bg-[#FF6B5B] text-white rounded-xl border-2 border-[#22314D] shadow-[2px_2px_0_#22314D]">
          <PlusCircle size={20} />
        </div>
        <div>
          <h2 className="font-['Baloo_Da_2',sans-serif] font-bold text-xl text-[#22314D]">
            নিজস্ব কাস্টম শব্দ যোগ করুন
          </h2>
          <p className="text-xs text-[#22314D]/70 font-medium">
            নিজের তৈরি শব্দাবলি লোকাল মেমরিতে সংরক্ষণ করুন এবং অফলাইনে শিখুন
          </p>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleSave} className="bg-[#FFF6E4] border-2 border-[#22314D] p-4 rounded-xl shadow-[3px_3px_0_#22314D] mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#22314D] mb-1">
              মূল শব্দ (Word)*
            </label>
            <input
              type="text"
              required
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="যেমন: Euphoria"
              className="w-full font-bold px-3 py-2 border-2 border-[#22314D] rounded-xl bg-white text-sm focus:outline-none focus:border-[#0FB5A6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#22314D] mb-1">
              বাংলা অর্থ (Meaning)*
            </label>
            <input
              type="text"
              required
              value={bnMeaning}
              onChange={(e) => setBnMeaning(e.target.value)}
              placeholder="যেমন: তীব্র আনন্দ বা উল্লাস"
              className="w-full font-bold px-3 py-2 border-2 border-[#22314D] rounded-xl bg-white text-sm focus:outline-none focus:border-[#0FB5A6]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#22314D] mb-1">
              বাংলা উচ্চারণ
            </label>
            <input
              type="text"
              value={bnPhonetic}
              onChange={(e) => setBnPhonetic(e.target.value)}
              placeholder="যেমন: ইউফোরিয়া"
              className="w-full font-medium px-3 py-2 border-2 border-[#22314D] rounded-xl bg-white text-sm focus:outline-none focus:border-[#0FB5A6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#22314D] mb-1">
              পদ (Part of Speech)
            </label>
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              className="w-full font-bold px-3 py-2 border-2 border-[#22314D] rounded-xl bg-white text-sm focus:outline-none focus:border-[#0FB5A6]"
            >
              <option value="noun">Noun (বিশেষ্য)</option>
              <option value="verb">Verb (ক্রিয়া)</option>
              <option value="adjective">Adjective (বিশেষণ)</option>
              <option value="adverb">Adverb (ভাববিশেষণ)</option>
              <option value="phrase">Phrase (বাক্যাংশ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#22314D] mb-1">
              ক্যাটাগরি
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WordCategory)}
              className="w-full font-bold px-3 py-2 border-2 border-[#22314D] rounded-xl bg-white text-sm focus:outline-none focus:border-[#0FB5A6]"
            >
              <option value="General">General</option>
              <option value="Daily Life">Daily Life</option>
              <option value="Emotions">Emotions</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Nature">Nature</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#22314D] mb-1">
            সংজ্ঞা বা নোট (English Definition)
          </label>
          <input
            type="text"
            value={enDefinition}
            onChange={(e) => setEnDefinition(e.target.value)}
            placeholder="A feeling of intense excitement and happiness."
            className="w-full px-3 py-2 border-2 border-[#22314D] rounded-xl bg-white text-sm focus:outline-none focus:border-[#0FB5A6]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#22314D] mb-1">
            উদাহরণ বাক্য (Example)
          </label>
          <input
            type="text"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="In that moment, she felt pure euphoria."
            className="w-full px-3 py-2 border-2 border-[#22314D] rounded-xl bg-white text-sm focus:outline-none focus:border-[#0FB5A6]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0FB5A6] text-white font-['Baloo_2',sans-serif] font-bold text-base py-2.5 rounded-xl border-2 border-[#22314D] shadow-[3px_3px_0_#22314D] hover:bg-[#0B8F84] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Save size={18} />
          <span>অফলাইন শব্দ ডিকশনারিতে সেভ করুন</span>
        </button>
      </form>

      {/* List of Custom User Added Words */}
      <div>
        <h3 className="font-bold text-sm text-[#22314D] mb-2">
          আপনার পূর্বে যোগ করা শব্দাবলি ({customWords.length})
        </h3>

        {customWords.length === 0 ? (
          <p className="text-xs text-[#22314D]/60 italic">
            এখনো কোনো কাস্টম শব্দ যোগ করা হয়নি। ওপরের ফর্মে তথ্য লিখে সংরক্ষণ করুন।
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {customWords.map((item) => (
              <div
                key={item.id}
                className="bg-[#E4F8EC] border-2 border-[#22314D] p-3 rounded-xl shadow-[2px_2px_0_#22314D] flex items-center justify-between gap-2"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectWord(item.word)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-['Baloo_2',sans-serif] font-bold text-base text-[#E8543F]">
                      {item.word}
                    </span>
                    {item.bnPhonetic && (
                      <span className="text-[11px] font-bold bg-[#FFC93C] text-[#22314D] px-2 py-0.2 rounded-md border border-[#22314D]">
                        {item.bnPhonetic}
                      </span>
                    )}
                  </div>
                  <p className="font-['Hind_Siliguri',sans-serif] font-bold text-xs text-[#0B8F84]">
                    {item.bnMeaning}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakWordOffline(item.englishWord || item.word)}
                    className="p-1.5 bg-white rounded-lg border-2 border-[#22314D] text-[#22314D]"
                  >
                    <Volume2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-white rounded-lg border-2 border-[#22314D] text-[#E8543F]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
