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
  onToggleSound: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stats,
  onToggleSound,
  onOpenBackup,
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

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        
        {/* Logo */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectMode('map');
          }}
          className="flex items-center gap-2 text-left group cursor-pointer shrink-0"
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

        {/* LIQUID GLASS "MODE DE JEU" DROPDOWN TRIGGER */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              sound.playClick();
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.2] backdrop-blur-xl border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 group"
            aria-label="Sélectionner un mode de jeu"
          >
            {/* Animated Gamepad glass icon */}
            <div className="p-1 rounded-xl bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 border border-white/10 text-sky-300">
              <Gamepad2 className="w-4 h-4 text-sky-300 group-hover:rotate-12 transition-transform" />
            </div>

            <span className="text-slate-300 text-xs hidden xs:inline">Mode :</span>
            <span className="text-amber-300 font-bold">{currentModeInfo.label}</span>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-sky-400' : ''
              }`}
            />
          </button>

          {/* LIQUID GLASS DROPDOWN MENU */}
          {dropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-[310px] sm:w-[350px] rounded-3xl bg-slate-900/85 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] p-2 z-50 animate-pop overflow-hidden">
              
              {/* Glossy liquid specular reflection */}
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-28 bg-gradient-to-b from-sky-400/20 to-transparent rounded-full blur-2xl" />

              {/* Header inside dropdown */}
              <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-white/10 flex items-center justify-between">
                <span>Modes de Jeu</span>
                <span className="flex items-center gap-1 text-amber-400 text-[10px]">
                  <Sparkles className="w-3.5 h-3.5" /> Choisis ton défi
                </span>
              </div>

              {/* Mode list */}
              <div className="space-y-1.5 mt-2">
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
                      <div className="flex items-center gap-3">
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
                          <div className="text-[11px] text-slate-400 font-medium line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Level & XP Gauge */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/[0.05] backdrop-blur-md px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl border border-white/10 shadow-inner">
            <span className="text-base sm:text-xl select-none">{levelInfo.badge}</span>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs font-black text-white leading-tight">
                Niv. {levelInfo.level}
              </div>
              <div className="w-12 sm:w-16 bg-slate-700/60 h-1 sm:h-1.5 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-xs sm:text-sm shadow-sm"
            title={`Série : ${stats.currentStreak}`}
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 animate-pulse" />
            <span>{stats.currentStreak}</span>
          </div>

          {/* Backup Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBackup();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1 transition-all active:scale-90 cursor-pointer shadow-sm"
            title="Sauvegarder ma progression"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Sauvegarde</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all active:scale-90 cursor-pointer"
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
    </header>
  );
};
