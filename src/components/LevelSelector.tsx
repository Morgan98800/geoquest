import React from 'react';
import { Continent } from '../types';
import { DifficultyLevel, DIFFICULTY_LEVELS, getCountryDifficulty } from '../data/difficulty';
import { COUNTRIES } from '../data/countries';
import { sound } from '../utils/audio';
import { Layers } from 'lucide-react';

interface LevelSelectorProps {
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  selectedContinent: Continent | 'all';
  onSelectContinent: (continent: Continent | 'all') => void;
  visitedCountryIds: string[];
  className?: string;
  compact?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  selectedContinent,
  onSelectContinent,
  visitedCountryIds,
  className = '',
  compact = false,
}) => {
  const continents: { id: Continent | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: 'Monde', emoji: '🌍' },
    { id: 'Europe', label: 'Europe', emoji: '🇪🇺' },
    { id: 'Asie', label: 'Asie', emoji: '⛩️' },
    { id: 'Afrique', label: 'Afrique', emoji: '🦁' },
    { id: 'Amérique du Nord', label: 'Am. Nord', emoji: '🗽' },
    { id: 'Amérique du Sud', label: 'Am. Sud', emoji: '🌴' },
    { id: 'Océanie', label: 'Océanie', emoji: '🏝️' },
  ];

  // Calculate stats for current level & continent
  const matchingCountries = COUNTRIES.filter((c) => {
    const diff = getCountryDifficulty(c.id);
    const diffMatch = diff <= selectedDifficulty;
    const contMatch = selectedContinent === 'all' || c.continent === selectedContinent;
    return diffMatch && contMatch;
  });

  const visitedCount = matchingCountries.filter((c) => visitedCountryIds.includes(c.id)).length;
  const totalCount = matchingCountries.length;
  const progressPercent = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  return (
    <div className={`bg-[#121927] border border-[#1f2c42] rounded-2xl p-2.5 sm:p-3 shadow-xl flex flex-col gap-2 select-none ${className}`}>
      {/* Top Row: Difficulty Levels */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 mr-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            Niveau :
          </span>

          {DIFFICULTY_LEVELS.map((tier) => {
            const isSelected = selectedDifficulty === tier.level;
            return (
              <button
                key={tier.level}
                onClick={() => {
                  sound.playClick();
                  onSelectDifficulty(tier.level);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-sky-500/25 border-sky-400 text-sky-200 ring-2 ring-sky-500/30 shadow-md'
                    : 'bg-[#1a2436] hover:bg-[#223147] border-[#2c3f58] text-slate-300'
                }`}
                title={tier.description}
              >
                <span>{tier.badge}</span>
                <span>{tier.title}</span>
                <span className="text-[10px] font-normal text-slate-400 hidden xs:inline">
                  ({tier.label})
                </span>
              </button>
            );
          })}
        </div>

        {/* Level Mastery Counter */}
        <div className="text-right shrink-0 hidden sm:block">
          <span className="text-[11px] text-slate-300 font-bold">
            {visitedCount} / {totalCount} <span className="text-emerald-400 font-extrabold">({progressPercent}%)</span>
          </span>
          <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Continents (StudyGe region filter) */}
      {!compact && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/80">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-1 shrink-0">
            Région :
          </span>
          {continents.map((cont) => {
            const isSelected = selectedContinent === cont.id;
            return (
              <button
                key={cont.id}
                onClick={() => {
                  sound.playClick();
                  onSelectContinent(cont.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-md'
                    : 'bg-[#1a2436]/90 hover:bg-[#223147] border-[#2c3f58] text-slate-300'
                }`}
              >
                <span>{cont.emoji}</span>
                <span>{cont.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
