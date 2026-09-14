import React, { useState, useRef, useEffect } from 'react';
import { GameMode, UserStats } from '../types';
import { getLevelInfo } from '../utils/storage';
import { sound } from '../utils/audio';
import {
  Flame,
  Globe,
  Compass,
  Flag,
  Landmark,
  ChevronDown,
  Check,
  BarChart3,
  Gift,
  Home,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: UserStats;
  currentUsername: string;
  onOpenAccount: () => void;
  onOpenDailyReward?: () => void;
  onExit?: () => void;
  hasDailyReward?: boolean;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stats,
  currentUsername,
  onOpenAccount,
  onOpenDailyReward,
  onExit,
  hasDailyReward = false,
  className = '',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const levelInfo = getLevelInfo(stats.xp);

  const gameModes: {
    mode: GameMode;
    label: string;
    icon: React.ReactNode;
    emoji: string;
  }[] = [
    {
      mode: 'home',
      label: 'Accueil / Menu',
      icon: <Home className="w-4 h-4 text-sky-400" />,
      emoji: '🏠',
    },
    {
      mode: 'map',
      label: 'Trouve sur la carte',
      icon: <Compass className="w-4 h-4 text-sky-400" />,
      emoji: '🗺️',
    },
    {
      mode: 'flags',
      label: 'Drapeaux du Monde',
      icon: <Flag className="w-4 h-4 text-emerald-400" />,
      emoji: '🏴',
    },
    {
      mode: 'capitals',
      label: 'Capitales',
      icon: <Landmark className="w-4 h-4 text-amber-400" />,
      emoji: '🏛️',
    },
    {
      mode: 'stats',
      label: 'Statistiques',
      icon: <BarChart3 className="w-4 h-4 text-rose-400" />,
      emoji: '📊',
    },
    {
      mode: 'atlas',
      label: 'Atlas du Monde',
      icon: <Globe className="w-4 h-4 text-indigo-400" />,
      emoji: '📖',
    },
  ];

  const currentModeInfo = gameModes.find((m) => m.mode === currentMode) || gameModes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleSelect = (mode: GameMode) => {
    sound.playClick();
    onSelectMode(mode);
    setDropdownOpen(false);
  };

  const isMathilde = currentUsername.toLowerCase() === 'mathildelpb';
  const userEmoji = isMathilde ? '👑' : '🧭';

  return (
    <header className={`sticky top-0 z-40 w-full bg-[#0a0e17]/95 border-b border-[#1f2c42] shadow-lg backdrop-blur-md select-none ${className}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col gap-1.5 sm:gap-2">
        
        {/* ROW 1: Logo + User Profile + Streak */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('home');
            }}
            className="flex items-center gap-2 text-left group cursor-pointer shrink-0"
          >
            <span className="text-2xl transform group-hover:scale-105 transition-transform select-none">
              🌍
            </span>
            <span className="text-lg sm:text-xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
              Geo-PD
            </span>
          </button>

          {/* User Profile & Streak */}
          <div className="flex items-center gap-2">
            {/* Account Switcher */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAccount();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#162236] hover:bg-[#1f2f49] border border-[#26374f] text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Changer de profil (MathildeLPB / Morgan)"
            >
              <span className="text-sm select-none">{userEmoji}</span>
              <span className="text-amber-300 max-w-[90px] sm:max-w-none truncate font-extrabold">
                {currentUsername}
              </span>
            </button>

            {/* Daily Retention Calendar Button */}
            {onOpenDailyReward && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenDailyReward();
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all active:scale-95 shadow-sm ${
                  hasDailyReward
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-[#162236] hover:bg-[#1f2f49] border-[#26374f] text-slate-300'
                }`}
                title="Calendrier des récompenses quotidiennes"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>J{stats.dailyStreak || 1}</span>
                {hasDailyReward && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-0.5" />
                )}
              </button>
            )}

            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-400 font-extrabold text-xs shadow-sm"
              title={`Série : ${stats.currentStreak}`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{stats.currentStreak}</span>
            </div>
          </div>
        </div>

        {/* ROW 2: GAME MODE SELECTOR & LEVEL PROGRESS */}
        <div className="flex items-center justify-between gap-2 w-full pt-1 border-t border-slate-800/80 sm:border-0 sm:pt-0">
          
          {/* MODE SELECTOR DROPDOWN */}
          <div className="relative flex-1 sm:flex-initial" ref={dropdownRef}>
            <button
              onClick={() => {
                sound.playClick();
                setDropdownOpen(!dropdownOpen);
              }}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#121927] hover:bg-[#1a2538] border border-[#1f2c42] text-white font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer active:scale-98 shadow-sm"
              aria-label="Sélectionner un mode de jeu"
            >
              <div className="flex items-center gap-2">
                <span className="text-base select-none">{currentModeInfo.emoji}</span>
                <span className="text-slate-400 text-xs font-semibold hidden xs:inline">Mode :</span>
                <span className="text-slate-100 font-bold truncate">
                  {currentModeInfo.label}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                  dropdownOpen ? 'rotate-180 text-sky-400' : ''
                }`}
              />
            </button>

            {/* DROPDOWN MENU */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 sm:right-auto sm:w-[300px] mt-1.5 rounded-2xl bg-[#121927] border border-[#1f2c42] shadow-2xl p-1.5 z-50 animate-pop overflow-hidden backdrop-blur-lg">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Modes de Jeu
                </div>

                <div className="space-y-1 mt-1">
                  {gameModes.map((item) => {
                    const isSelected = currentMode === item.mode;
                    return (
                      <button
                        key={item.mode}
                        onClick={() => handleSelect(item.mode)}
                        className={`w-full text-left p-2 rounded-xl transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 font-bold'
                            : 'hover:bg-[#1a2436] text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{item.emoji}</span>
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {item.label}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Exit Game Button (when in active game) */}
          {onExit && (currentMode === 'map' || currentMode === 'flags' || currentMode === 'capitals') && (
            <button
              onClick={() => {
                sound.playClick();
                onExit();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#162236] hover:bg-rose-950/40 border border-[#26374f] hover:border-rose-500/40 text-slate-300 hover:text-rose-300 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
              title="Quitter la partie en cours"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="hidden xs:inline">Quitter la partie</span>
              <span className="xs:hidden">Quitter</span>
            </button>
          )}

          {/* Level Progress */}
          <div className="flex items-center gap-2 bg-[#121927] px-2.5 py-1.5 rounded-xl border border-[#1f2c42] shrink-0 shadow-sm">
            <span className="text-sm select-none">{levelInfo.badge}</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-200 leading-tight">
                Niv. {levelInfo.level}
              </div>
              <div className="w-14 sm:w-20 bg-slate-800/80 h-1.5 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
