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
  Gamepad2,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: UserStats;
  currentUsername: string;
  onToggleSound: () => void;
  onOpenBackup: () => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stats,
  currentUsername,
  onToggleSound,
  onOpenBackup,
  onOpenAccount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const levelInfo = getLevelInfo(stats.xp);

  const gameModes: {
    mode: GameMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    emoji: string;
  }[] = [
    {
      mode: 'map',
      label: 'Trouve sur la carte',
      description: 'Localise le pays demandé sur la mappemonde',
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/25 to-blue-500/10',
      emoji: '🗺️',
    },
    {
      mode: 'flags',
      label: 'Drapeaux du Monde',
      description: 'Devine le pays correspondant au drapeau',
      icon: <Flag className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/25 to-teal-500/10',
      emoji: '🏴',
    },
    {
      mode: 'capitals',
      label: 'Capitales',
      description: 'Associe les villes et capitales aux nations',
      icon: <Landmark className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/25 to-orange-500/10',
      emoji: '🏛️',
    },
    {
      mode: 'atlas',
      label: 'Atlas du Monde',
      description: 'Exploration libre et recherche de pays',
      icon: <Globe className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/25 to-indigo-500/10',
      emoji: '📖',
    },
    {
      mode: 'passport',
      label: 'Mon Passeport',
      description: 'Tes tampons et secrets découverts',
      icon: <BookOpen className="w-5 h-5 text-rose-400" />,
      color: 'from-rose-500/25 to-pink-500/10',
      emoji: '🛂',
    },
  ];

  const currentModeInfo = gameModes.find((m) => m.mode === currentMode) || gameModes[0];

  // Close dropdown on click outside
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
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 shadow-xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex flex-col gap-2">
        
        {/* ROW 1: Logo + User Profile + Controls (Sound & Backup) */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('map');
            }}
            className="flex items-center gap-1.5 text-left group cursor-pointer shrink-0"
          >
            <span className="text-2xl sm:text-3xl transform group-hover:rotate-12 transition-transform select-none">
              🌍
            </span>
            <div>
              <div className="text-base sm:text-xl font-black tracking-tight text-white flex items-center gap-1 font-['Outfit',sans-serif]">
                GeoQuest <span className="text-[10px] sm:text-xs bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent uppercase tracking-wider font-extrabold">Plus</span>
              </div>
            </div>
          </button>

          {/* User Profile Pill & Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Account Login / Switcher Pill */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAccount();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:bg-white/[0.22] backdrop-blur-xl border border-white/20 text-white font-extrabold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Changer de compte (MathildeLPB / Morgan)"
            >
              <span className="text-sm select-none">{userEmoji}</span>
              <span className="font-bold text-amber-300 max-w-[90px] sm:max-w-none truncate">
                {currentUsername}
              </span>
            </button>

            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-xs shadow-sm"
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
              className="p-1.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1 transition-all active:scale-90 cursor-pointer shadow-sm"
              title="Sauvegarder ma progression"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-xl sm:rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all active:scale-90 cursor-pointer"
              title={stats.soundEnabled ? 'Désactiver le son' : 'Activer le son'}
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* ROW 2: LIQUID GLASS "MODE DE JEU" DROPDOWN + LEVEL PROGRESS */}
        <div className="flex items-center justify-between gap-2 w-full pt-1 border-t border-white/5 sm:border-0 sm:pt-0">
          
          {/* LIQUID GLASS DROPDOWN BUTTON */}
          <div className="relative flex-1 sm:flex-initial" ref={dropdownRef}>
            <button
              onClick={() => {
                sound.playClick();
                setDropdownOpen(!dropdownOpen);
              }}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-sky-500/15 via-white/[0.08] to-indigo-500/15 hover:bg-white/[0.15] active:bg-white/[0.22] backdrop-blur-2xl border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-98 group"
              aria-label="Sélectionner un mode de jeu"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-sky-500/30 border border-sky-400/30 text-sky-300 shrink-0">
                  <Gamepad2 className="w-4 h-4 text-sky-300 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-slate-400 text-xs font-semibold hidden xs:inline">Mode :</span>
                <span className="text-sky-300 font-bold truncate">
                  {currentModeInfo.label}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-300 transition-transform duration-200 shrink-0 ${
                  dropdownOpen ? 'rotate-180 text-sky-400' : ''
                }`}
              />
            </button>

            {/* LIQUID GLASS DROPDOWN MENU */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 sm:right-auto sm:w-[340px] mt-2 rounded-3xl bg-slate-900/95 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.3)] p-2 z-50 animate-pop overflow-hidden">
                <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-28 bg-gradient-to-b from-sky-400/20 to-transparent rounded-full blur-2xl" />

                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-white/10 flex items-center justify-between">
                  <span>Modes de Jeu</span>
                  <span className="flex items-center gap-1 text-amber-400 text-[10px]">
                    <Sparkles className="w-3.5 h-3.5" /> Choisis ton défi
                  </span>
                </div>

                <div className="space-y-1 mt-1.5">
                  {gameModes.map((item) => {
                    const isSelected = currentMode === item.mode;
                    return (
                      <button
                        key={item.mode}
                        onClick={() => handleSelect(item.mode)}
                        className={`w-full text-left p-2.5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group active:scale-98 ${
                          isSelected
                            ? `bg-gradient-to-r ${item.color} border-sky-400/50 shadow-md`
                            : 'bg-white/[0.03] hover:bg-white/[0.09] border-white/5 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-2 rounded-xl border backdrop-blur-md transition-transform group-hover:scale-110 ${
                              isSelected
                                ? 'bg-slate-950/60 border-sky-400/40'
                                : 'bg-slate-800/60 border-white/10'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                              <span>{item.label}</span>
                              <span className="text-xs select-none">{item.emoji}</span>
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
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
          <div className="flex items-center gap-2 bg-white/[0.05] backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-inner shrink-0">
            <span className="text-base select-none">{levelInfo.badge}</span>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs font-black text-white leading-tight">
                Niv. {levelInfo.level}
              </div>
              <div className="w-14 sm:w-20 bg-slate-700/60 h-1.5 rounded-full mt-0.5 overflow-hidden">
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
