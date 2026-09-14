import React, { useState } from 'react';
import { Country } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { MapPin, Sparkles, AlertCircle, RotateCw } from 'lucide-react';
import { sound } from '../utils/audio';

interface MapQuizProps {
  targetCountry: Country;
  onCountryGuessed: (guessedCountry: Country) => void;
  visitedCountryIds: string[];
  isLandscape?: boolean;
  onOpenInstall?: () => void;
}

export const MapQuiz: React.FC<MapQuizProps> = ({
  targetCountry,
  onCountryGuessed,
  visitedCountryIds,
  isLandscape = false,
  onOpenInstall,
}) => {
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [focusTrigger, setFocusTrigger] = useState<number>(0);
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
    const nextLevel = Math.min(hintLevel + 1, 2);
    setHintLevel(nextLevel);
    if (nextLevel >= 2) {
      setFocusTrigger((prev) => prev + 1);
    }
  };

  // LANDSCAPE LAYOUT (StudyGe full-screen experience)
  if (isLandscape) {
    return (
      <div className="relative w-full h-[calc(100vh-68px)] flex flex-col overflow-hidden rounded-2xl border border-slate-800">
        {/* Floating Minimalist Top HUD */}
        <div className="absolute top-2 left-2 right-14 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md text-white">
            <span className="text-2xl select-none shrink-0">{targetCountry.flag}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-sky-400">Trouve :</span>
              <span className="text-sm font-black text-white">{targetCountry.name}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                (Capitale : <strong className="text-amber-300 font-semibold">{targetCountry.capital}</strong>)
              </span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {hintLevel < 2 && (
              <button
                onClick={handleUseHint}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer touch-manipulation"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{hintLevel === 0 ? "Indice continent" : "Cadrer sur le pays"}</span>
              </button>
            )}
            {hintLevel >= 1 && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                {targetCountry.continent}
              </span>
            )}
          </div>
        </div>

        {/* Floating Feedback Toast */}
        {feedback && !feedback.isCorrect && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 animate-wiggle bg-rose-600/90 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
            <span>Oups ! C'est {feedback.clickedCountryName}. Réessaie !</span>
          </div>
        )}

        {/* Edge-to-Edge Map */}
        <InteractiveMap
          mode="quiz"
          targetCountry={targetCountry}
          onCountryClick={handleCountryClick}
          visitedCountryIds={visitedCountryIds}
          feedbackState={feedback}
          focusTrigger={focusTrigger}
          className="w-full h-full rounded-none border-0"
        />
      </div>
    );
  }

  // PORTRAIT LAYOUT
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-2.5 sm:gap-3.5">
      {/* Horizontal Mode Suggestion Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <RotateCw className="w-3.5 h-3.5 text-sky-400 shrink-0 animate-spin-slow" />
          <span><strong>Conseil :</strong> Tourne ton téléphone en paysage pour le mode plein écran !</span>
        </div>
        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="text-amber-300 hover:text-amber-200 font-bold text-[11px] underline shrink-0 ml-2 cursor-pointer"
          >
            Mode App 📲
          </button>
        )}
      </div>

      {/* Target Question Card - Clean StudyGe Style */}
      <div className="bg-[#0e1f34] border border-slate-750 rounded-2xl p-3.5 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
          <div className="text-4xl sm:text-5xl drop-shadow select-none shrink-0">
            {targetCountry.flag}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-0.5">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Localise ce pays</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
              {targetCountry.name}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 text-xs text-slate-300">
              <span>Capitale : <strong className="text-amber-300 font-bold">{targetCountry.capital}</strong></span>
              {hintLevel >= 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  {targetCountry.continent}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hint button */}
        <div className="w-full sm:w-auto flex justify-end shrink-0">
          {hintLevel < 2 && (
            <button
              onClick={handleUseHint}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm touch-manipulation"
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
        <div className="animate-wiggle bg-rose-950/80 border border-rose-500/40 text-rose-200 px-3.5 py-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
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
        focusTrigger={focusTrigger}
        className="w-full aspect-[16/10] sm:aspect-[16/9] min-h-[250px] max-h-[560px]"
      />
    </div>
  );
};
