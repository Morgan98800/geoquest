import React, { useState } from 'react';
import { Country } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, Flame } from 'lucide-react';

interface QuizCardProps {
  type: 'flags' | 'capitals';
  targetCountry: Country;
  options: Country[];
  onAnswer: (selected: Country) => void;
  streak: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  type,
  targetCountry,
  options,
  onAnswer,
  streak,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const handleSelect = (country: Country) => {
    if (hasAnswered) return;
    setSelectedId(country.id);
    setHasAnswered(true);

    const isCorrect = country.id === targetCountry.id;
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    setTimeout(() => {
      onAnswer(country);
      setSelectedId(null);
      setHasAnswered(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl">
      {/* Header Question */}
      <div className="text-center mb-5 sm:mb-8">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            {type === 'flags' ? '🏴 Devine le Drapeau' : '🏛️ Devine la Capitale'}
          </span>
          <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
            <span>Série : {streak}</span>
          </div>
        </div>

        {type === 'flags' ? (
          <div>
            <div className="text-7xl sm:text-8xl mb-2 sm:mb-3 drop-shadow-lg select-none transform hover:scale-105 transition-transform">
              {targetCountry.flag}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
              À quel pays appartient ce drapeau ?
            </h2>
          </div>
        ) : (
          <div>
            <div className="text-6xl sm:text-7xl mb-2 drop-shadow-md select-none">
              {targetCountry.flag}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {targetCountry.name}
            </h2>
            <p className="text-xs sm:text-sm text-amber-300 font-bold mt-1">
              Quelle est la capitale ?
            </p>
          </div>
        )}
      </div>

      {/* 4 Choices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrectTarget = option.id === targetCountry.id;

          let btnStyle = 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 text-slate-100 hover:border-sky-500/50';

          if (hasAnswered) {
            if (isCorrectTarget) {
              btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
            } else if (isSelected) {
              btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 animate-shake';
            } else {
              btnStyle = 'opacity-40 bg-slate-800/40 border-slate-800 text-slate-500';
            }
          }

          return (
            <button
              key={option.id}
              disabled={hasAnswered}
              onClick={() => handleSelect(option)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left font-bold text-sm sm:text-base min-h-[56px] transition-all duration-150 flex items-center justify-between shadow-lg active:scale-95 cursor-pointer touch-manipulation ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                {type === 'flags' ? (
                  <>
                    <span className="text-2xl leading-none shrink-0">{option.flag}</span>
                    <span className="leading-snug">{option.name}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg select-none shrink-0">🏛️</span>
                    <span className="leading-snug text-base font-bold text-white">{option.capital}</span>
                  </>
                )}
              </div>

              {hasAnswered && isCorrectTarget && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
              )}
              {hasAnswered && isSelected && !isCorrectTarget && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
