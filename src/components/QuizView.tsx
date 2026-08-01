import React, { useState, useEffect } from 'react';
import { Award, RotateCcw, CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { BUILTIN_DICTIONARY } from '../data/dictionaryData';
import { speakWordOffline } from '../utils/phonetics';

interface Question {
  id: number;
  word: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  englishWord: string;
}

export const QuizView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const generateNewQuiz = () => {
    // Pick 5 random words from offline dataset
    const shuffled = [...BUILTIN_DICTIONARY].sort(() => 0.5 - Math.random()).slice(0, 5);

    const generatedQuestions: Question[] = shuffled.map((item, idx) => {
      const isEnglishToBn = Math.random() > 0.4;
      const word = item.word;
      const correctAnswer = isEnglishToBn ? item.bnMeaning : item.word;

      // Distractors
      const otherItems = BUILTIN_DICTIONARY.filter((x) => x.id !== item.id);
      const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);
      const distractorAnswers = shuffledOthers.map((x) =>
        isEnglishToBn ? x.bnMeaning : x.word
      );

      const options = [correctAnswer, ...distractorAnswers].sort(() => 0.5 - Math.random());

      return {
        id: idx + 1,
        word,
        englishWord: item.englishWord || item.word,
        questionText: isEnglishToBn
          ? `"${word}" শব্দটির সঠিক বাংলা মানে কোনটি?`
          : `"${item.bnMeaning}" কথাটির সঠিক ইংরেজি শব্দ কোনটি?`,
        correctAnswer,
        options,
        explanation: `${word}: ${item.bnMeaning} ${
          item.bnPhonetic ? `(উচ্চারণ: ${item.bnPhonetic})` : ''
        }`
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null) return; // prevent double clicks
    setSelectedAnswer(option);

    if (option === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border-3 border-[#22314D] rounded-[22px] p-5 sm:p-6 shadow-[6px_6px_0_#22314D]">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-[#22314D]/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#22314D] text-[#FFC93C] rounded-xl border-2 border-[#22314D] shadow-[2px_2px_0_#FFC93C]">
            <Award size={20} />
          </div>
          <div>
            <h2 className="font-['Baloo_Da_2',sans-serif] font-bold text-xl text-[#22314D]">
              অফলাইন ভোকাবুলারি কুইজ
            </h2>
            <p className="text-xs text-[#22314D]/70 font-medium">
              আপনার ইংরেজি ও বাংলা শব্দের জ্ঞান পরীক্ষা করুন
            </p>
          </div>
        </div>

        <button
          onClick={generateNewQuiz}
          className="p-2 bg-[#FFF6E4] border-2 border-[#22314D] rounded-xl text-xs font-bold text-[#22314D] hover:bg-[#FFC93C] transition-colors flex items-center gap-1 shadow-[2px_2px_0_#22314D]"
        >
          <RotateCcw size={14} />
          <span>নতুন কুইজ</span>
        </button>
      </div>

      {!quizFinished ? (
        <div>
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-bold text-[#22314D] mb-3">
            <span>প্রশ্ন {currentIndex + 1} / {questions.length}</span>
            <span className="bg-[#E4F8EC] text-[#0B8F84] px-2.5 py-1 rounded-full border border-[#22314D]">
              স্কোর: {score}
            </span>
          </div>

          {/* Question Card */}
          <div className="bg-[#FFF6E4] border-2 border-[#22314D] p-4 sm:p-5 rounded-2xl shadow-[3px_3px_0_#22314D] mb-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-[#8E5CF7] uppercase tracking-wider">
                শব্দ জ্ঞান পরীক্ষা
              </span>
              <button
                onClick={() => speakWordOffline(currentQ.englishWord)}
                className="p-1.5 bg-white rounded-lg border-2 border-[#22314D] text-[#22314D] hover:bg-[#FFC93C]"
                title="উচ্চারণ শুনুন"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <h3 className="font-['Baloo_Da_2',sans-serif] font-extrabold text-xl sm:text-2xl text-[#22314D] leading-snug">
              {currentQ.questionText}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-2.5 mb-5">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedAnswer === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let style = 'bg-white hover:bg-[#FFF6E4] text-[#22314D] border-[#22314D]';

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  style = 'bg-[#E4F8EC] text-[#0B8F84] border-[#0FB5A6] font-bold';
                } else if (isChosen && !isCorrect) {
                  style = 'bg-[#FFD3CC] text-[#E8543F] border-[#FF6B5B] font-bold';
                } else {
                  style = 'bg-gray-50 text-gray-400 border-gray-300 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-3.5 rounded-xl border-2 shadow-[2px_2px_0_#22314D] font-['Hind_Siliguri',sans-serif] text-sm sm:text-base transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {selectedAnswer !== null && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 size={18} className="text-[#0FB5A6]" />
                      ) : isChosen ? (
                        <XCircle size={18} className="text-[#FF6B5B]" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next button */}
          {selectedAnswer !== null && (
            <div className="bg-[#EAF1EF] border-2 border-[#22314D] p-3.5 rounded-xl mb-4 text-xs font-semibold text-[#22314D]">
              💡 ব্যাখ্যা: {currentQ.explanation}
            </div>
          )}

          {selectedAnswer !== null && (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-[#0FB5A6] text-white font-['Baloo_2',sans-serif] font-bold text-base py-3 rounded-xl border-2 border-[#22314D] shadow-[3px_3px_0_#22314D] hover:bg-[#0B8F84] active:translate-x-0.5 active:translate-y-0.5"
            >
              {currentIndex + 1 < questions.length ? 'পরবর্তী প্রশ্ন ➔' : 'ফলাফল দেখুন 🎉'}
            </button>
          )}
        </div>
      ) : (
        /* Quiz Finished Score Card */
        <div className="text-center py-6 px-3">
          <div className="inline-block p-4 bg-[#FFC93C] rounded-full border-3 border-[#22314D] shadow-[3px_3px_0_#22314D] mb-3">
            <Award size={40} className="text-[#22314D]" />
          </div>

          <h3 className="font-['Baloo_Da_2',sans-serif] font-extrabold text-2xl text-[#22314D]">
            কুইজ সম্পন্ন হয়েছে!
          </h3>

          <div className="my-4 bg-[#FFF6E4] border-2 border-[#22314D] p-4 rounded-2xl max-w-xs mx-auto shadow-[3px_3px_0_#22314D]">
            <p className="text-xs text-[#22314D]/70 font-bold uppercase">আপনার মোট স্কোর</p>
            <p className="font-['Baloo_2',sans-serif] font-extrabold text-4xl text-[#E8543F] mt-1">
              {score} / {questions.length}
            </p>
            <p className="text-xs font-bold text-[#0B8F84] mt-1">
              {score === 5
                ? 'অসাধারণ! আপনি চমৎকার দক্ষতা দেখিয়েছেন 🌟'
                : score >= 3
                ? 'খুব ভালো! শব্দকোষ চর্চা চালিয়ে যান 👍'
                : 'আরও অনুশীলনের সুযোগ রয়েছে 💪'}
            </p>
          </div>

          <button
            onClick={generateNewQuiz}
            className="bg-[#8E5CF7] text-white font-['Baloo_2',sans-serif] font-bold text-base px-6 py-3 rounded-xl border-2 border-[#22314D] shadow-[3px_3px_0_#22314D] hover:bg-[#7440D6] active:translate-x-0.5 active:translate-y-0.5"
          >
            আবার কুইজ খেলুন 🔄
          </button>
        </div>
      )}
    </div>
  );
};
