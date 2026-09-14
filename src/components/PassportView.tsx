import React, { useState } from 'react';
import { UserStats, Continent, Country } from '../types';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import { CheckCircle2, Sparkles, Star, Search, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface PassportViewProps {
  stats: UserStats;
  onSelectCountryForAtlas?: (country: Country) => void;
  onOpenBackup?: () => void;
}

export const PassportView: React.FC<PassportViewProps> = ({
  stats,
  onSelectCountryForAtlas,
  onOpenBackup,
}) => {
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'Tous'>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectCountry, setInspectCountry] = useState<Country | null>(null);

  const discoveredCount = Object.keys(stats.stamps).length;
  const totalCount = COUNTRIES.length;
  const completionPercent = Math.round((discoveredCount / totalCount) * 100);

  const filteredCountries = COUNTRIES.filter((country) => {
    const matchesContinent = selectedContinent === 'Tous' || country.continent === selectedContinent;
    const matchesSearch =
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.capital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  const handleCountryInspect = (c: Country) => {
    sound.playClick();
    setInspectCountry(c);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Passport Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              Carnet de Voyage Officiel
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Mon Passeport Géographique 🛂
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Chaque bonne réponse tamponne un pays et débloque ses secrets insolites !
            </p>

            {onOpenBackup && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenBackup();
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sauvegarder ou transférer mon carnet</span>
                </button>
              </div>
            )}
          </div>

          {/* Progress Gauge */}
          <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 text-center min-w-[180px] shadow-lg">
            <div className="text-3xl font-black text-amber-400">
              {discoveredCount} / {totalCount}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Pays Tamponnés ({completionPercent}%)
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Continent Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedContinent('Tous')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              selectedContinent === 'Tous'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-white/5'
            }`}
          >
            Tous ({COUNTRIES.length})
          </button>
          {CONTINENTS.map((cont) => {
            const count = COUNTRIES.filter((c) => c.continent === cont).length;
            return (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedContinent === cont
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {cont} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un pays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredCountries.map((country) => {
          const stamp = stats.stamps[country.id];
          const isDiscovered = !!stamp;

          return (
            <div
              key={country.id}
              onClick={() => handleCountryInspect(country)}
              className={`relative rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all cursor-pointer group select-none ${
                isDiscovered
                  ? 'bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-amber-500/40 hover:border-amber-400 shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1'
                  : 'bg-slate-900/40 border border-slate-800/60 opacity-60 hover:opacity-90'
              }`}
            >
              {/* Stamp Badge */}
              {isDiscovered ? (
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 text-xs mb-2">
                  ✓
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs mb-2">
                  ?
                </div>
              )}

              {/* Flag */}
              <div
                className={`text-4xl mb-2 transition-transform duration-200 group-hover:scale-110 ${
                  isDiscovered ? 'filter-none' : 'grayscale opacity-40'
                }`}
              >
                {country.flag}
              </div>

              {/* Name & Capital */}
              <div className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                {country.name}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1">
                {isDiscovered ? country.capital : '???'}
              </div>

              {/* Special badge for Palestine and Taiwan */}
              {(country.id === '275' || country.id === '158') && (
                <span className="mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Pays Indépendant
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Country Detail Modal */}
      {inspectCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center animate-pop">
            <button
              onClick={() => setInspectCountry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="text-6xl mb-3">{inspectCountry.flag}</div>
            <h3 className="text-2xl font-black text-white">{inspectCountry.name}</h3>
            <div className="text-sm text-amber-400 font-semibold mb-4">
              Capitale : {inspectCountry.capital} • {inspectCountry.continent}
            </div>

            {/* Stamp info */}
            {stats.stamps[inspectCountry.id] ? (
              <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Tamponné {stats.stamps[inspectCountry.id].timesDiscovered} fois !
              </div>
            ) : (
              <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                🔒 Pas encore tamponné ! Joue aux quiz pour le débloquer !
              </div>
            )}

            {/* Fun Facts List */}
            <div className="text-left bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 max-h-60 overflow-y-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Anecdotes & Faits Découverts
              </div>
              {inspectCountry.funFacts.map((fact, idx) => (
                <p key={idx} className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  💡 {fact}
                </p>
              ))}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setInspectCountry(null);
                if (onSelectCountryForAtlas) onSelectCountryForAtlas(inspectCountry);
              }}
              className="mt-5 w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
