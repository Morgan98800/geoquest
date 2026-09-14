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
  BookOpen,
  ChevronDown,
  Check,
} from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: UserStats;
  currentUsername: string;
  onOpenAccount: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stats,
  currentUsername,
  onOpenAccount,
  className = '',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const levelInfo = getLevelInfo(stats.xp);

  const gameModes: {
    mode: GameMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    emoji: string;
  }[] = [
    {
      mode: 'map',
      label: 'Trouve sur la carte',
      description: 'Localise le pays demandé sur la mappemonde',
      icon: <Compass className="w-4 h-4 text-sky-400" />,
      emoji: '🗺️',
    },
    {
      mode: 'flags',
      label: 'Drapeaux du Monde',
      description: 'Devine le pays correspondant au drapeau',
      icon: <Flag className="w-4 h-4 text-emerald-400" />,
      emoji: '🏴',
    },
    {
      mode: 'capitals',
      label: 'Capitales',
      description: 'Associe les villes et capitales aux nations',
      icon: <Landmark className="w-4 h-4 text-amber-400" />,
      emoji: '🏛️',
    },
    {
      mode: 'atlas',
      label: 'Atlas du Monde',
      description: 'Exploration libre et recherche de pays',
      icon: <Globe className="w-4 h-4 text-indigo-400" />,
      emoji: '📖',
    },
    {
      mode: 'passport',
      label: 'Mon Passeport',
      description: 'Tes tampons et secrets découverts',
      icon: <BookOpen className="w-4 h-4 text-rose-400" />,
      emoji: '🛂',
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
    <header className={`sticky top-0 z-40 w-full bg-[#16202c] border-b border-slate-800 shadow-sm select-none ${className}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col gap-1.5 sm:gap-2">
        
        {/* ROW 1: Logo + User Profile + Streak */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('map');
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#243547] hover:bg-[#2c4056] border border-[#354c66] text-white font-bold text-xs transition-all cursor-pointer active:scale-95"
              title="Changer de profil (MathildeLPB / Morgan)"
            >
              <span className="text-sm select-none">{userEmoji}</span>
              <span className="text-amber-300 max-w-[90px] sm:max-w-none truncate font-extrabold">
                {currentUsername}
              </span>
            </button>

            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs"
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
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#202e3e] hover:bg-[#283b4e] border border-[#2f4359] text-white font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer active:scale-98"
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
              <div className="absolute left-0 right-0 sm:right-auto sm:w-[300px] mt-1.5 rounded-2xl bg-[#1c2938] border border-[#2e4056] shadow-2xl p-1.5 z-50 animate-pop overflow-hidden">
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
                            ? 'bg-sky-600/20 text-sky-200 border border-sky-500/40 font-bold'
                            : 'hover:bg-slate-800 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{item.emoji}</span>
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-white">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                              {item.description}
                            </div>
                          </div>
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

          {/* Level Progress */}
          <div className="flex items-center gap-2 bg-[#202e3e] px-2.5 py-1.5 rounded-xl border border-[#2f4359] shrink-0">
            <span className="text-sm select-none">{levelInfo.badge}</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-200 leading-tight">
                Niv. {levelInfo.level}
              </div>
              <div className="w-14 sm:w-20 bg-slate-800 h-1.5 rounded-full mt-0.5 overflow-hidden">
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
