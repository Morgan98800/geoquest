import React from 'react';
import { UserStats } from '../types';
import { DAILY_REWARDS, checkDailyStatus, claimDailyReward } from '../utils/storage';
import { sound } from '../utils/audio';
import { hapticSuccess, hapticLevelUp } from '../utils/haptics';
import confetti from 'canvas-confetti';
import { X, Check, Gift, Sparkles, Flame } from 'lucide-react';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onStatsUpdated: (newStats: UserStats) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  stats,
  onStatsUpdated,
}) => {
  if (!isOpen) return null;

  const status = checkDailyStatus(stats);
  const currentDay = status.currentDay;

  const handleClaim = () => {
    sound.playSparkle();
    const result = claimDailyReward(stats);
    onStatsUpdated(result.newStats);

    if (result.leveledUp) {
      hapticLevelUp();
    } else {
      hapticSuccess();
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#16202c] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shrink-0 shadow-inner">
            <Gift className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              Bonus quotidien
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              1 connexion par jour pour débloquer les bonus J1 → J7
            </p>
          </div>
        </div>

        {/* 7-Day Track Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mb-5">
          {DAILY_REWARDS.map((r) => {
            const isPast = r.day < currentDay || (!status.canClaim && r.day <= currentDay);
            const isToday = r.day === currentDay;
            const isSpecial = r.day === 7;

            let cardStyle = 'bg-[#1c2938] border-slate-800 text-slate-400 opacity-60';

            if (isPast) {
              cardStyle = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-100';
            } else if (isToday) {
              cardStyle = 'bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/40 opacity-100 shadow-md';
            }

            return (
              <div
                key={r.day}
                className={`flex flex-col items-center justify-between p-2.5 rounded-2xl border text-center transition-all ${
                  isSpecial ? 'col-span-2' : 'col-span-1'
                } ${cardStyle}`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-bold uppercase">
                  <span>J{r.day}</span>
                  {isPast && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div className="my-1 text-base select-none">
                  {r.rewardBadge ? '👑' : isPast ? '🎁' : isToday ? '⭐' : '🔒'}
                </div>

                <div className="text-[11px] font-extrabold text-white">
                  {r.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Streak summary */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 mb-5 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
            <span>Série actuelle : <strong>Jour {currentDay} / 7</strong></span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {status.canClaim ? 'Récompense disponible !' : 'À demain pour la suite !'}
          </span>
        </div>

        {/* Action Button */}
        {status.canClaim ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm transition-all active:scale-98 cursor-pointer shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Réclamer ({DAILY_REWARDS[currentDay - 1]?.label})</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm transition-all active:scale-98 cursor-pointer border border-slate-700"
          >
            Validé ✓
          </button>
        )}
      </div>
    </div>
  );
};
