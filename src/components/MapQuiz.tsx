import React, { useState } from 'react';
import { Country } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface MapQuizProps {
  targetCountry: Country;
  onCountryGuessed: (guessedCountry: Country) => void;
  visitedCountryIds: string[];
}

export const MapQuiz: React.FC<MapQuizProps> = ({
  targetCountry,
  onCountryGuessed,
  visitedCountryIds,
}) => {
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    countryId: string;
    isCorrect: boolean;
    clickedCountryName?: string;
  } | null>(null);

  const handleCountryClick = (clickedCountry: Country) => {
    const isCorrect = clickedCountry.id === targetCountry.id;
    setFeedback({
      countryId: clickedCountry.id,
      isCorrect,
      clickedCountryName: clickedCountry.name,
    });

    if (isCorrect) {
      sound.playCorrect();
      setTimeout(() => {
        onCountryGuessed(clickedCountry);
        setFeedback(null);
        setHintLevel(0);
      }, 500);
    } else {
      sound.playWrong();
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const handleUseHint = () => {
    sound.playSparkle();
    setHintLevel((prev) => Math.min(prev + 1, 2));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4">
      {/* Target Question Card */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-sky-500/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 text-left w-full sm:w-auto">
          <div className="text-4xl sm:text-6xl drop-shadow-md select-none shrink-0 transform hover:scale-110 transition-transform">
            {targetCountry.flag}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-400 mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Localise ce pays</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {targetCountry.name}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 text-xs text-slate-300">
              <span>Capitale : <strong className="text-amber-300">{targetCountry.capital}</strong></span>
              {hintLevel >= 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  {targetCountry.continent}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hint button */}
        <div className="w-full sm:w-auto flex justify-end">
          {hintLevel < 2 && (
            <button
              onClick={handleUseHint}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl sm:rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 active:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {hintLevel === 0 ? "Indice continent" : "Cadrer sur la région"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Wrong answer alert toast */}
      {feedback && !feedback.isCorrect && (
        <div className="animate-wiggle bg-rose-500/20 border border-rose-500/40 text-rose-200 px-3.5 py-2.5 rounded-2xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            Oups ! Tu as cliqué sur <strong>{feedback.clickedCountryName}</strong>. Réessaie !
          </span>
        </div>
      )}

      {/* Interactive Map */}
      <InteractiveMap
        mode="quiz"
        targetCountry={targetCountry}
        onCountryClick={handleCountryClick}
        visitedCountryIds={visitedCountryIds}
        feedbackState={feedback}
        className="h-[380px] sm:h-[540px]"
      />

      <div className="text-center text-[11px] sm:text-xs text-slate-400 font-medium pb-2">
        💡 Fais glisser avec ton doigt pour déplacer la carte, écarte 2 doigts pour zoomer !
      </div>
    </div>
  );
};
