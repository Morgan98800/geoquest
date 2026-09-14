import React from 'react';
import { GameMode, UserStats } from '../types';
import { getLevelInfo } from '../utils/storage';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Flame, Globe, Compass, Flag, Landmark, BookOpen, ShieldCheck } from 'lucide-react';

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
  const levelInfo = getLevelInfo(stats.xp);

  const navItems: { mode: GameMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'map', label: 'Carte', icon: <Compass className="w-5 h-5 sm:w-4 sm:h-4" /> },
    { mode: 'flags', label: 'Drapeaux', icon: <Flag className="w-5 h-5 sm:w-4 sm:h-4" /> },
    { mode: 'capitals', label: 'Capitales', icon: <Landmark className="w-5 h-5 sm:w-4 sm:h-4" /> },
    { mode: 'atlas', label: 'Atlas', icon: <Globe className="w-5 h-5 sm:w-4 sm:h-4" /> },
    { mode: 'passport', label: 'Passeport', icon: <BookOpen className="w-5 h-5 sm:w-4 sm:h-4" /> },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          
          {/* Logo & Level progress */}
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
              <div className="hidden sm:block text-[11px] text-slate-400 font-medium">
                Apprends la Terre en t'amusant !
              </div>
            </div>
          </button>

          {/* Desktop Navigation Tabs (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => {
                    sound.playClick();
                    onSelectMode(item.mode);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/30'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats Bar (Responsive Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Level & XP Gauge */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/80 px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl border border-white/5 shadow-inner">
              <span className="text-base sm:text-xl select-none">{levelInfo.badge}</span>
              <div className="text-left">
                <div className="text-[10px] sm:text-xs font-black text-white leading-tight">
                  Niv. {levelInfo.level}
                </div>
                <div className="w-12 sm:w-20 bg-slate-700 h-1 sm:h-1.5 rounded-full mt-0.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-black text-xs sm:text-sm"
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
              className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white transition-all active:scale-90 cursor-pointer"
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

      {/* Fixed Native-like Bottom Navigation for Smartphones */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => {
                sound.playClick();
                onSelectMode(item.mode);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
                isActive
                  ? 'text-sky-400 font-black'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-sky-500/15' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
