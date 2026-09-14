import React, { useState, useEffect } from 'react';
import { Country, UserStats, SrsCard } from '../types';
import { COUNTRIES, COUNTRIES_BY_ID, getRandomCountries } from '../data/countries';
import { getDueCountries, getSrsSummary } from '../utils/srs';
import { sound } from '../utils/audio';
import { hapticSuccess, hapticError, hapticLevelUp } from '../utils/haptics';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface SrsReviewViewProps {
  stats: UserStats;
  onRecordAnswer: (
    country: Country,
    isCorrect: boolean,
    responseTimeMs: number
  ) => { leveledUp: boolean };
  onSwitchToMap: () => void;
}

export const SrsReviewView: React.FC<SrsReviewViewProps> = ({
  stats,
  onRecordAnswer,
  onSwitchToMap,
}) => {
  // Compute due countries
  const [dueList, setDueList] = useState<Country[]>(() => {
    return getDueCountries(stats.srsData || {}, COUNTRIES);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<Country[]>([]);
  const [selectedOption, setSelectedOption] = useState<Country | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [reviewType, setReviewType] = useState<'capital' | 'flag'>('capital');

  const currentCountry = dueList[currentIndex];
  const srsSummary = getSrsSummary(stats.srsData || {}, COUNTRIES.length);

  // When current country changes, prepare options
  useEffect(() => {
    if (currentCountry) {
      const decoys = getRandomCountries(3, currentCountry.id);
      const allFour = [currentCountry, ...decoys].sort(() => 0.5 - Math.random());
      setOptions(allFour);
      setSelectedOption(null);
      setIsAnswered(false);
      setReviewType(Math.random() > 0.5 ? 'capital' : 'flag');
      setQuestionStartTime(Date.now());
    }
  }, [currentCountry]);

  const handleSelectOption = (country: Country) => {
    if (isAnswered || !currentCountry) return;

    const elapsedMs = Date.now() - questionStartTime;
    const isCorrect = country.id === currentCountry.id;
    setSelectedOption(country);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playCorrect();
      hapticSuccess();
    } else {
      sound.playWrong();
      hapticError();
    }

    const { leveledUp } = onRecordAnswer(currentCountry, isCorrect, elapsedMs);
    if (leveledUp) {
      hapticLevelUp();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < dueList.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Re-evaluate due countries
      const remainingDue = getDueCountries(stats.srsData || {}, COUNTRIES);
      setDueList(remainingDue);
      setCurrentIndex(0);
    }
  };

  const handleStartFreePractice = () => {
    sound.playClick();
    // Gather lowest-level or failed countries for a customized practice round
    const lowestCards = Object.values(stats.srsData || {})
      .filter((card) => card.level < 3)
      .map((card) => COUNTRIES_BY_ID[card.countryId])
      .filter((c): c is Country => c !== undefined);

    if (lowestCards.length > 0) {
      setDueList(lowestCards.slice(0, 10));
      setCurrentIndex(0);
    } else {
      // Pick 10 random countries
      const randoms = [...COUNTRIES].sort(() => 0.5 - Math.random()).slice(0, 10);
      setDueList(randoms);
      setCurrentIndex(0);
    }
  };

  // Level description helper
  const getLevelBadge = (card?: SrsCard) => {
    if (!card) return { text: 'Nouveau', color: 'bg-slate-700 text-slate-300' };
    switch (card.level) {
      case 0:
        return { text: 'À revoir (0j)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 1:
        return { text: 'Niveau 1 (1j)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 2:
        return { text: 'Niveau 2 (3j)', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 3:
        return { text: 'Niveau 3 (7j)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 4:
        return { text: 'Niveau 4 (14j)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 5:
        return { text: 'Maîtrisé 👑 (30j)', color: 'bg-amber-400/25 text-amber-200 border-amber-400/50' };
      default:
        return { text: 'En cours', color: 'bg-slate-700 text-slate-300' };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 text-white pb-6">
      {/* Top Banner */}
      <div className="bg-[#16202c] border border-slate-750 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            Mémoire à Long Terme (SRS)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Révision Intelligente
          </h1>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-semibold block">À réviser aujourd'hui :</span>
          <span className={`text-base sm:text-xl font-black ${dueList.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {dueList.length} pays
          </span>
        </div>
      </div>

      {/* SRS Retention Overview Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3 text-center">
          <div className="text-xs text-rose-400 font-bold uppercase mb-0.5">À réviser</div>
          <div className="text-2xl font-black text-white">{srsSummary.dueCount}</div>
          <div className="text-[10px] text-slate-400">Échéance dépassée</div>
        </div>

        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3 text-center">
          <div className="text-xs text-sky-400 font-bold uppercase mb-0.5">En cours</div>
          <div className="text-2xl font-black text-white">{srsSummary.learningCount}</div>
          <div className="text-[10px] text-slate-400">Intervalles 1 à 7j</div>
        </div>

        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3 text-center">
          <div className="text-xs text-emerald-400 font-bold uppercase mb-0.5">Maîtrisés 👑</div>
          <div className="text-2xl font-black text-white">{srsSummary.masteredCount}</div>
          <div className="text-[10px] text-slate-400">Intervalles 14j & 30j</div>
        </div>

        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3 text-center">
          <div className="text-xs text-slate-400 font-bold uppercase mb-0.5">Non vus</div>
          <div className="text-2xl font-black text-white">{srsSummary.unseenCount}</div>
          <div className="text-[10px] text-slate-400">À explorer</div>
        </div>
      </div>

      {/* Active Question or All Caught Up Screen */}
      {dueList.length > 0 && currentCountry ? (
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col gap-6">
          {/* Progress bar in current batch */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold">
              Question {currentIndex + 1} sur {dueList.length}
            </span>
            {(() => {
              const badge = getLevelBadge(stats.srsData?.[currentCountry.id]);
              return (
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${badge.color}`}>
                  {badge.text}
                </span>
              );
            })()}
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / dueList.length) * 100}%` }}
            />
          </div>

          {/* Question Prompt */}
          <div className="text-center space-y-2">
            <div className="text-6xl sm:text-7xl select-none mb-2 animate-pop">
              {currentCountry.flag}
            </div>

            {reviewType === 'capital' ? (
              <div>
                <span className="text-xs sm:text-sm text-slate-400 font-semibold block uppercase tracking-wider">
                  Quelle est la capitale de ce pays ?
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {currentCountry.name}
                </h2>
              </div>
            ) : (
              <div>
                <span className="text-xs sm:text-sm text-slate-400 font-semibold block uppercase tracking-wider">
                  À quel pays correspond ce drapeau ?
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Capitale : <span className="text-amber-400">{currentCountry.capital}</span>
                </h2>
              </div>
            )}
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option) => {
              const isTarget = option.id === currentCountry.id;
              const isChosen = selectedOption?.id === option.id;

              let btnStyle = 'bg-[#202e3e] hover:bg-[#283b4e] border-[#2f4359] text-white';

              if (isAnswered) {
                if (isTarget) {
                  btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-black shadow-lg shadow-emerald-950/40';
                } else if (isChosen && !isTarget) {
                  btnStyle = 'bg-rose-600/80 border-rose-400 text-white font-bold opacity-90';
                } else {
                  btnStyle = 'bg-[#182330] border-slate-800 text-slate-400 opacity-50';
                }
              }

              const label = reviewType === 'capital' ? option.capital : option.name;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-98 ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {reviewType === 'capital' ? (
                      <span className="text-slate-400 font-normal text-xs">Capitale :</span>
                    ) : (
                      <span className="text-xl select-none">{option.flag}</span>
                    )}
                    <span className="truncate">{label}</span>
                  </div>

                  {isAnswered && isTarget && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />
                  )}
                  {isAnswered && isChosen && !isTarget && (
                    <XCircle className="w-5 h-5 text-white shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button after answering */}
          {isAnswered && (
            <div className="pt-2 animate-fadeIn flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-950/40 active:scale-95 transition-all"
              >
                <span>Suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* All caught up celebration view */
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-3xl p-6 sm:p-10 text-center flex flex-col items-center gap-4 shadow-lg">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl shadow-inner">
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Tu es 100% à jour ! 🎉
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Tous tes pays révisés sont enregistrés dans ta mémoire à long terme. Reviens demain pour le prochain cycle de répétition espacée !
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleStartFreePractice}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Entraînement libre (10 pays)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSwitchToMap();
              }}
              className="px-5 py-3 rounded-2xl bg-[#202e3e] hover:bg-[#283b4e] border border-[#2f4359] text-white font-bold text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>Retourner sur la carte</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
