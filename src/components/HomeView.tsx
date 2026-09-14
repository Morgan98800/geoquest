import React from 'react';
import { GameMode, UserStats } from '../types';
import { getLevelInfo } from '../utils/storage';
import { sound } from '../utils/audio';
import {
  Globe,
  Flame,
  Award,
  ChevronRight,
  Play,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  stats: UserStats;
  currentUsername: string;
  onSelectMode: (mode: GameMode) => void;
  onOpenDailyReward?: () => void;
  hasDailyReward?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  currentUsername,
  onSelectMode,
  onOpenDailyReward,
  hasDailyReward = false,
}) => {
  const levelInfo = getLevelInfo(stats.xp);
  const totalAnswers = stats.totalAnswered > 0 ? stats.totalAnswered : stats.totalCorrect;
  const accuracy = totalAnswers > 0 ? Math.round((stats.totalCorrect / totalAnswers) * 100) : 0;
  const discoveredCount = Object.keys(stats.stamps || {}).length;

  const handleLaunch = (mode: GameMode) => {
    sound.playClick();
    onSelectMode(mode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 sm:gap-6 py-2">
      {/* Profile & Progression Header Card */}
      <div className="bg-[#121927] border border-[#1f2c42] rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/30 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shrink-0 select-none">
              🌍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Bonjour, {currentUsername} !
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-sky-300 font-bold flex items-center gap-1.5 mt-0.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Niveau {levelInfo.level} — {levelInfo.title}</span>
              </p>
            </div>
          </div>

          {/* Quick Play Primary CTA */}
          <button
            onClick={() => handleLaunch('map')}
            className="self-stretch sm:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Jouer (Carte)</span>
          </button>
        </div>

        {/* Level XP Bar */}
        <div className="mt-5 pt-4 border-t border-[#1f2c42]">
          <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
            <span className="text-slate-400">Progression vers le niveau {levelInfo.level + 1}</span>
            <span className="text-amber-400">{stats.xp} / {levelInfo.nextLevelXp} XP</span>
          </div>
          <div className="h-2.5 w-full bg-[#0c1322] rounded-full overflow-hidden p-0.5 border border-[#1f2c42]">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, levelInfo.progressPercent))}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <div className="p-2.5 rounded-2xl bg-[#0e1624] border border-[#1c2a3d] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Série</div>
              <div className="text-sm font-black text-white">{stats.currentStreak} 🔥</div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#0e1624] border border-[#1c2a3d] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Découvertes</div>
              <div className="text-sm font-black text-white">{discoveredCount} / 174</div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#0e1624] border border-[#1c2a3d] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Précision</div>
              <div className="text-sm font-black text-white">{accuracy}%</div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#0e1624] border border-[#1c2a3d] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">XP Total</div>
              <div className="text-sm font-black text-white">{stats.xp} pts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Reward Banner (if claimable) */}
      {hasDailyReward && onOpenDailyReward && (
        <button
          onClick={() => {
            sound.playClick();
            onOpenDailyReward();
          }}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/40 flex items-center justify-between text-left transition-all hover:border-amber-400 active:scale-98 shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
              🎁
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-amber-300">
                Récompense Quotidienne Disponible !
              </div>
              <div className="text-[11px] text-slate-300">
                Jour {stats.dailyStreak || 1} • Clique pour réclamer ton bonus d'XP quotidien.
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400 shrink-0" />
        </button>
      )}

      {/* Main Game Modes Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-300">
            Modes de Jeu
          </h2>
          <span className="text-xs text-sky-400 font-bold">Sélectionne une partie</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* MAP QUIZ */}
          <button
            onClick={() => handleLaunch('map')}
            className="p-5 rounded-3xl bg-[#121927] hover:bg-[#182236] border border-[#1f2c42] hover:border-sky-500/50 text-left transition-all duration-200 group active:scale-98 shadow-xl flex flex-col justify-between min-h-[170px] cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🗺️
                </div>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-black">
                  POPULAIRE
                </span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                Trouve sur la carte
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Pointe les pays sur le globe interactif avec zoom fluide et indices progressifs.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs font-bold text-sky-400">
              <span>Lancer la partie</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* FLAGS QUIZ */}
          <button
            onClick={() => handleLaunch('flags')}
            className="p-5 rounded-3xl bg-[#121927] hover:bg-[#182236] border border-[#1f2c42] hover:border-emerald-500/50 text-left transition-all duration-200 group active:scale-98 shadow-xl flex flex-col justify-between min-h-[170px] cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏴
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black">
                  RAPIDE
                </span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                Drapeaux du Monde
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Reconnais les bannières nationales avec distracteurs intelligents et DDA.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs font-bold text-emerald-400">
              <span>Lancer la partie</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* CAPITALS QUIZ */}
          <button
            onClick={() => handleLaunch('capitals')}
            className="p-5 rounded-3xl bg-[#121927] hover:bg-[#182236] border border-[#1f2c42] hover:border-amber-500/50 text-left transition-all duration-200 group active:scale-98 shadow-xl flex flex-col justify-between min-h-[170px] cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-black">
                  CULTURE
                </span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                Capitales
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Trouve les capitales des nations du monde entier parmi 4 choix pertinents.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs font-bold text-amber-400">
              <span>Lancer la partie</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Exploration & Insights Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-300">
            Exploration & Analyse
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* ATLAS */}
          <button
            onClick={() => handleLaunch('atlas')}
            className="p-4 sm:p-5 rounded-2xl bg-[#121927] hover:bg-[#182236] border border-[#1f2c42] hover:border-indigo-500/50 text-left transition-all duration-200 group active:scale-98 shadow-xl flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                📖
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                  Atlas Mondial
                </h3>
                <p className="text-xs text-slate-400">
                  Navigue sur la carte, inspecte chaque pays et lis ses anecdotes.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-400 shrink-0 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* STATS */}
          <button
            onClick={() => handleLaunch('stats')}
            className="p-4 sm:p-5 rounded-2xl bg-[#121927] hover:bg-[#182236] border border-[#1f2c42] hover:border-rose-500/50 text-left transition-all duration-200 group active:scale-98 shadow-xl flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                📊
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-rose-300 transition-colors">
                  Statistiques
                </h3>
                <p className="text-xs text-slate-400">
                  Consulte tes performances par continent et tes pays à renforcer.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-400 shrink-0 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
