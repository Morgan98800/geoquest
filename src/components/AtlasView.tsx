import React, { useState } from 'react';
import { Country } from '../types';
import { COUNTRIES, COUNTRIES_BY_ID } from '../data/countries';
import { InteractiveMap } from './InteractiveMap';
import { Search, MapPin, Sparkles, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface AtlasViewProps {
  visitedCountryIds: string[];
}

export const AtlasView: React.FC<AtlasViewProps> = ({ visitedCountryIds }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES_BY_ID['275'] || COUNTRIES[0] // Default to Palestine
  );
  const [search, setSearch] = useState<string>('');

  const filteredCountries = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.capital.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = (c: Country) => {
    sound.playClick();
    setSelectedCountry(c);
    setSearch('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
      {/* Search & Shortcuts Bar */}
      <div className="bg-[#0e1f34] border border-slate-750 rounded-2xl p-3.5 sm:p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input with autocomplete */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Explorer un pays ou une capitale..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
          />

          {filteredCountries.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-750 rounded-xl shadow-2xl overflow-hidden z-40">
              {filteredCountries.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className="w-full px-4 py-2 text-left text-xs sm:text-sm hover:bg-slate-800 text-white flex items-center justify-between border-b border-slate-800 last:border-0 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <span className="font-bold">{c.name}</span>
                  </span>
                  <span className="text-xs text-sky-300">{c.capital}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick jump buttons (scrollable horizontally on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Raccourcis :</span>
          {[
            { id: '275', label: '🇵🇸 Palestine' },
            { id: '158', label: '🇹🇼 Taïwan' },
            { id: '250', label: '🇫🇷 France' },
            { id: '392', label: '🇯🇵 Japon' },
            { id: '504', label: '🇲🇦 Maroc' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const c = COUNTRIES_BY_ID[item.id];
                if (c) handleSelect(c);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] sm:text-xs font-bold text-slate-200 whitespace-nowrap transition-all cursor-pointer active:scale-95 shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map on top/left, Country Sheet on bottom/right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <InteractiveMap
            mode="atlas"
            targetCountry={selectedCountry}
            highlightedCountryId={selectedCountry?.id}
            onCountryClick={handleSelect}
            visitedCountryIds={visitedCountryIds}
            className="w-full aspect-[16/10] sm:aspect-[16/9] min-h-[260px] max-h-[560px]"
          />
        </div>

        {/* Selected Country Dossier Card */}
        <div className="bg-[#0e1f34] border border-slate-750 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {selectedCountry.continent}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
                Code : {selectedCountry.code}
              </span>
            </div>

            <div className="text-5xl sm:text-6xl mb-2 sm:mb-3 drop-shadow-md select-none">{selectedCountry.flag}</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedCountry.name}
            </h2>

            <div className="mt-2 sm:mt-3 flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Capitale : <strong className="text-white">{selectedCountry.capital}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Coordonnées : {selectedCountry.coordinates[0]}°, {selectedCountry.coordinates[1]}°</span>
              </div>
            </div>

            {/* Fun Facts (if available) */}
            {selectedCountry.funFacts && selectedCountry.funFacts.length > 0 && (
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-sky-900/50">
                <div className="flex items-center gap-1.5 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Repères & Anecdotes
                </div>
                <div className="space-y-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
                  {selectedCountry.funFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="text-xs leading-relaxed text-slate-200 bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-white/5"
                    >
                      "{fact}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
