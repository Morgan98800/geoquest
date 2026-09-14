import React, { useState } from 'react';
import { Country, Continent } from '../types';
import { DifficultyLevel } from '../data/difficulty';
import { InteractiveMap } from './InteractiveMap';
import { LevelSelector } from './LevelSelector';
import { MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface MapQuizProps {
  targetCountry: Country;
  onCountryGuessed: (guessedCountry: Country) => void;
  visitedCountryIds: string[];
  countryMastery?: Record<string, number>;
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  selectedContinent: Continent | 'all';
  onSelectContinent: (continent: Continent | 'all') => void;
  isLandscape?: boolean;
}

export const MapQuiz: React.FC<MapQuizProps> = ({
  targetCountry,
  onCountryGuessed,
  visitedCountryIds,
  countryMastery = {},
  selectedDifficulty,
  onSelectDifficulty,
  selectedContinent,
  onSelectContinent,
  isLandscape = false,
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
      }, 1200);
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

  // FULL LANDSCAPE MODE (StudyGe Edge-to-Edge Experience)
  if (isLandscape) {
    return (
      <div className="fixed inset-0 z-30 w-screen h-screen overflow-hidden bg-[#16202c]">
        {/* Sleek Floating Question Pill - Minimal & Centered */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c2938]/95 border border-[#2e4056] shadow-xl text-white">
          <span className="text-xl select-none">{targetCountry.flag}</span>
          <span className="text-xs font-bold text-slate-300">Trouve :</span>
          <span className="text-sm font-black text-white">{targetCountry.name}</span>
          <span className="text-xs text-slate-400 hidden xs:inline">
            • <strong className="text-amber-300 font-semibold">{targetCountry.capital}</strong>
          </span>

          {/* Quick Level Switcher for Landscape */}
          <button
            onClick={() => {
              sound.playClick();
              const nextLevel = ((selectedDifficulty % 3) + 1) as DifficultyLevel;
              onSelectDifficulty(nextLevel);
            }}
            className="ml-1 px-2 py-0.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-[10px] font-black cursor-pointer active:scale-90 transition-all flex items-center gap-1"
            title="Changer de niveau (1: Débutant, 2: Intermédiaire, 3: Expert)"
          >
            <span>{selectedDifficulty === 1 ? '🌱' : selectedDifficulty === 2 ? '🧭' : '👑'}</span>
            <span>Niv.{selectedDifficulty}</span>
          </button>

          {hintLevel < 2 && (
            <button
              onClick={handleUseHint}
              className="ml-0.5 p-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all active:scale-90 cursor-pointer"
              title={hintLevel === 0 ? "Indice continent" : "Cadrer sur le pays"}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {hintLevel >= 1 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              {targetCountry.continent}
            </span>
          )}
        </div>

        {/* Floating Feedback Toast */}
        {feedback && !feedback.isCorrect && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 animate-wiggle bg-rose-600/90 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-2xl flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-white shrink-0" />
            <span>C'est {feedback.clickedCountryName}. Réessaie !</span>
          </div>
        )}

        {/* 100% Screen Edge-to-Edge Map */}
        <InteractiveMap
          mode="quiz"
          targetCountry={targetCountry}
          highlightedCountryId={hintLevel >= 2 ? targetCountry.id : null}
          onCountryClick={handleCountryClick}
          visitedCountryIds={visitedCountryIds}
          countryMastery={countryMastery}
          feedbackState={feedback}
          focusTrigger={focusTrigger}
          className="w-full h-full rounded-none border-0"
        />
      </div>
    );
  }

  // PORTRAIT MODE (Clean Minimalist StudyGe Layout)
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-2.5 sm:gap-3">
      {/* Target Question Card */}
      <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3 sm:p-4 shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left min-w-0">
          <div className="text-3xl sm:text-4xl select-none shrink-0">
            {targetCountry.flag}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-400">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Localise ce pays</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight truncate">
              {targetCountry.name}
            </h2>
            <div className="text-xs text-slate-300 truncate">
              Capitale : <strong className="text-amber-300 font-semibold">{targetCountry.capital}</strong>
              {hintLevel >= 1 && (
                <span className="ml-1.5 inline-block px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {targetCountry.continent}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hint button */}
        {hintLevel < 2 && (
          <button
            onClick={handleUseHint}
            className="px-3 py-1.5 rounded-xl bg-[#243547] hover:bg-[#2c4056] border border-[#354c66] text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0 touch-manipulation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{hintLevel === 0 ? "Indice" : "Cadrer"}</span>
          </button>
        )}
      </div>

      {/* StudyGe Level & Continent Selector */}
      <LevelSelector
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={onSelectDifficulty}
        selectedContinent={selectedContinent}
        onSelectContinent={onSelectContinent}
        visitedCountryIds={visitedCountryIds}
      />

      {/* Wrong answer alert toast */}
      {feedback && !feedback.isCorrect && (
        <div className="animate-wiggle bg-rose-600/90 text-white px-3 py-1.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span>C'est {feedback.clickedCountryName}. Réessaie !</span>
        </div>
      )}

      {/* Interactive Map */}
      <InteractiveMap
        mode="quiz"
        targetCountry={targetCountry}
        highlightedCountryId={hintLevel >= 2 ? targetCountry.id : null}
        onCountryClick={handleCountryClick}
        visitedCountryIds={visitedCountryIds}
        countryMastery={countryMastery}
        feedbackState={feedback}
        focusTrigger={focusTrigger}
        className="w-full aspect-[16/10] sm:aspect-[16/9] min-h-[260px] max-h-[580px]"
      />
    </div>
  );
};
