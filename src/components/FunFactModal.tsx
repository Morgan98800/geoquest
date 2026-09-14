import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Country } from '../types';
import { Sparkles, ArrowRight, MapPin, Flame, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface FunFactModalProps {
  isOpen: boolean;
  country: Country;
  onNext: () => void;
  earnedXp: number;
  currentStreak: number;
  leveledUp?: boolean;
  newLevelTitle?: string;
  isFirstDiscovery?: boolean;
}

export const FunFactModal: React.FC<FunFactModalProps> = ({
  isOpen,
  country,
  onNext,
  earnedXp,
  currentStreak,
  leveledUp = false,
  newLevelTitle = '',
  isFirstDiscovery = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playCorrect();
      setTimeout(() => sound.playStamp(), 220);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#818cf8'],
      });

      if (leveledUp) {
        setTimeout(() => {
          sound.playLevelUp();
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.4 },
          });
        }, 500);
      }
    }
  }, [isOpen, leveledUp]);

  if (!isOpen) return null;

  const fact = country.funFacts[0] || "Un pays extraordinaire avec une richesse culturelle et historique unique au monde !";
  const secondFact = country.funFacts[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl text-center transform animate-pop">
        
        {/* Leveled Up Banner */}
        {leveledUp && (
          <div className="mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg animate-bounce">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" /> NOUVEAU NIVEAU : {newLevelTitle} !
          </div>
        )}

        {/* First Discovery Alert */}
        {isFirstDiscovery && !leveledUp && (
          <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold uppercase tracking-wide">
            ⭐ Nouveau pays découvert !
          </div>
        )}

        {/* Flag & Title */}
        <div className="text-6xl sm:text-7xl mb-2 sm:mb-3 drop-shadow-md select-none transform hover:scale-110 transition-transform">
          {country.flag}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>{country.name}</span>
        </h2>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-sky-300 font-semibold">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            Capitale : <strong className="text-white">{country.capital}</strong>
          </span>
          <span>•</span>
          <span className="bg-sky-950/60 px-2 py-0.5 rounded-lg border border-sky-800/40">
            {country.continent}
          </span>
        </div>

        {/* Fun Fact Card */}
        <div className="mt-4 sm:mt-6 text-left bg-gradient-to-br from-slate-900/90 to-sky-950/70 border border-sky-500/30 rounded-2xl p-4 sm:p-5 shadow-inner relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            Le savais-tu ? (Fun Fact 💡)
          </div>
          <p className="text-slate-100 text-xs sm:text-base leading-relaxed font-medium">
            "{fact}"
          </p>

          {secondFact && (
            <div className="mt-2.5 pt-2.5 border-t border-sky-800/30">
              <p className="text-slate-300 text-[11px] sm:text-sm leading-relaxed">
                ✨ {secondFact}
              </p>
            </div>
          )}
        </div>

        {/* Rewards Bar */}
        <div className="mt-4 sm:mt-6 flex items-center justify-between px-3.5 py-2 sm:py-2.5 rounded-2xl bg-slate-900/60 border border-white/5 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="text-base sm:text-lg">+{earnedXp}</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wide text-slate-400">Points XP</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-black">
            <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
            <span>Série : {currentStreak}</span>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="mt-4 sm:mt-6 w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-95 group cursor-pointer"
        >
          <span>Continuer l'aventure</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
