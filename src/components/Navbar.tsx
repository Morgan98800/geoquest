import React, { useState, useRef, useEffect } from 'react';
import { GameMode, UserStats } from '../types';
import { getLevelInfo } from '../utils/storage';
import { sound } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Flame,
  Globe,
  Compass,
  Flag,
  Landmark,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  Check,
  Smartphone,
} from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: UserStats;
  currentUsername: string;
  onToggleSound: () => void;
  onOpenBackup: () => void;
  onOpenAccount: () => void;
  onOpenInstall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stats,
  currentUsername,
  onToggleSound,
  onOpenBackup,
  onOpenAccount,
  onOpenInstall,
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
    <header className="sticky top-0 z-40 w-full bg-[#0d1b2a] border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col gap-1.5 sm:gap-2">
        
        {/* ROW 1: Logo + User Profile + Controls */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('map');
            }}
            className="flex items-center gap-2 text-left group cursor-pointer shrink-0"
          >
            <span className="text-2xl sm:text-3xl transform group-hover:scale-105 transition-transform select-none">
              🌍
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
                GeoQuest
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                PRO
              </span>
            </div>
          </button>

          {/* User Profile & Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Install App Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenInstall();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              title="Installer comme application sur l'écran d'accueil"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline">App 📲</span>
            </button>

            {/* Account Switcher */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAccount();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all cursor-pointer active:scale-95"
              title="Changer de profil (MathildeLPB / Morgan)"
            >
              <span className="text-sm select-none">{userEmoji}</span>
              <span className="text-amber-300 max-w-[85px] sm:max-w-none truncate font-extrabold">
                {currentUsername}
              </span>
            </button>

            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 font-extrabold text-xs"
              title={`Série : ${stats.currentStreak}`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
              <span>{stats.currentStreak}</span>
            </div>

            {/* Backup Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenBackup();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-emerald-400 transition-all active:scale-90 cursor-pointer"
              title="Sauvegarder ma progression"
              aria-label="Sauvegarder ma progression"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-90 cursor-pointer"
              title={stats.soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              aria-label="Contrôle du son"
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* ROW 2: CLEAN MODE SELECTOR & LEVEL PROGRESS */}
        <div className="flex items-center justify-between gap-2 w-full pt-1 border-t border-slate-800/80 sm:border-0 sm:pt-0">
          
          {/* MODE SELECTOR DROPDOWN */}
          <div className="relative flex-1 sm:flex-initial" ref={dropdownRef}>
            <button
              onClick={() => {
                sound.playClick();
                setDropdownOpen(!dropdownOpen);
              }}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-white font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer active:scale-98"
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
              <div className="absolute left-0 right-0 sm:right-auto sm:w-[320px] mt-1.5 rounded-2xl bg-[#102238] border border-slate-700 shadow-2xl p-1.5 z-50 animate-pop overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Choisir un mode de jeu
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
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-base shrink-0 border border-slate-750">
                            {item.emoji}
                          </div>
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
          <div className="flex items-center gap-2 bg-slate-850 px-2.5 py-1.5 rounded-xl border border-slate-800 shrink-0">
            <span className="text-sm select-none">{levelInfo.badge}</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-200 leading-tight">
                Niv. {levelInfo.level}
              </div>
              <div className="w-14 sm:w-18 bg-slate-800 h-1.5 rounded-full mt-0.5 overflow-hidden">
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
