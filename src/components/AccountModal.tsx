import React, { useState } from 'react';
import { UserStats } from '../types';
import { loadUserStats, setActiveUsername, getLevelInfo, resetUserStats } from '../utils/storage';
import { sound } from '../utils/audio';
import { User, Sparkles, Check, ArrowRight, X, RotateCcw } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onSwitchUser: (newUsername: string, newStats: UserStats) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
  onSwitchUser,
}) => {
  const [inputName, setInputName] = useState<string>('');
  const [, setRefreshTick] = useState<number>(0);

  if (!isOpen) return null;

  const handleSelectUser = (name: string) => {
    const clean = name.trim();
    if (!clean) return;

    sound.playLevelUp();
    setActiveUsername(clean);
    const loaded = loadUserStats(clean);
    onSwitchUser(clean, loaded);
    onClose();
  };

  const handleResetUser = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Réinitialiser toute l'XP et la progression de ${name} à 0 ?`)) {
      sound.playClick();
      const fresh = resetUserStats(name);
      if (currentUsername.toLowerCase() === name.toLowerCase()) {
        onSwitchUser(name, fresh);
      }
      setRefreshTick((t) => t + 1);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      handleSelectUser(inputName.trim());
      setInputName('');
    }
  };

  // Preview stats for the 2 main accounts
  const mathildeStats = loadUserStats('MathildeLPB');
  const mathildeLevel = getLevelInfo(mathildeStats.xp);

  const morganStats = loadUserStats('Morgan');
  const morganLevel = getLevelInfo(morganStats.xp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] text-left animate-pop overflow-hidden">
        
        {/* Liquid glass light specular flare */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-400/15 rounded-full blur-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 border border-white/20 text-sky-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Profil & Connexion</h3>
            <p className="text-xs text-slate-400">Choisis ton compte pour charger ta progression</p>
          </div>
        </div>

        {/* 2 Quick Profile Cards: MathildeLPB & Morgan */}
        <div className="space-y-2.5 mb-5">
          {/* MathildeLPB Card */}
          <div
            onClick={() => handleSelectUser('MathildeLPB')}
            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 active:scale-98 ${
              currentUsername.toLowerCase() === 'mathildelpb'
                ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/15 border-emerald-400/50 shadow-lg'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-3xl select-none shrink-0">👑</div>
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5 truncate">
                  <span>MathildeLPB</span>
                  {currentUsername.toLowerCase() === 'mathildelpb' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black">
                      Actif
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-300 mt-0.5 truncate">
                  Niv. {mathildeLevel.level} • {mathildeStats.xp} XP • {Object.keys(mathildeStats.stamps).length} pays
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => handleResetUser(e, 'MathildeLPB')}
                className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer active:scale-90"
                title="Réinitialiser l'XP et la progression de MathildeLPB à 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {currentUsername.toLowerCase() === 'mathildelpb' ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
              )}
            </div>
          </div>

          {/* Morgan Card */}
          <div
            onClick={() => handleSelectUser('Morgan')}
            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 active:scale-98 ${
              currentUsername.toLowerCase() === 'morgan'
                ? 'bg-gradient-to-r from-sky-500/25 to-indigo-500/15 border-sky-400/50 shadow-lg'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-3xl select-none shrink-0">🧭</div>
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5 truncate">
                  <span>Morgan</span>
                  {currentUsername.toLowerCase() === 'morgan' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-black">
                      Actif
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-300 mt-0.5 truncate">
                  Niv. {morganLevel.level} • {morganStats.xp} XP • {Object.keys(morganStats.stamps).length} pays
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => handleResetUser(e, 'Morgan')}
                className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer active:scale-90"
                title="Réinitialiser l'XP et la progression de Morgan à 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {currentUsername.toLowerCase() === 'morgan' ? (
                <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Custom Name / Switch Form */}
        <form onSubmit={handleCustomSubmit} className="pt-3 border-t border-white/10">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ou entrer un autre prénom :</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: MathildeLPB, Morgan..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Se connecter
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
