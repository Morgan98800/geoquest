import React from 'react';
import { UserStats, Country, Continent } from '../types';
import { COUNTRIES, COUNTRIES_BY_ID, CONTINENTS } from '../data/countries';
import { Clock, Target, Flame, Globe2, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface StatsViewProps {
  stats: UserStats;
  onPracticeCountry?: (country: Country) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats, onPracticeCountry }) => {
  // 1. Average Response Time
  const responseTimes = stats.responseTimes || [];
  const avgResponseTimeSec =
    responseTimes.length > 0
      ? (responseTimes.reduce((acc, t) => acc + t, 0) / responseTimes.length / 1000).toFixed(1)
      : null;

  // 2. Global Accuracy
  const totalAnswered = stats.totalAnswered || 0;
  const totalCorrect = stats.totalCorrect || 0;
  const accuracyPercent =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // 3. Top 5 Most Failed Countries
  const failedList = Object.entries(stats.countryStats || {})
    .filter(([_, perf]) => perf.failed > 0)
    .sort((a, b) => b[1].failed - a[1].failed)
    .slice(0, 5)
    .map(([id, perf]) => {
      const country = COUNTRIES_BY_ID[id] || { name: 'Pays inconnu', flag: '🏳️', id };
      const totalAttempts = perf.correct + perf.failed;
      const failRate = Math.round((perf.failed / totalAttempts) * 100);
      return { country, perf, failRate };
    });

  // 4. Accuracy by Continent
  const continentData: {
    continent: Continent;
    correct: number;
    total: number;
    percent: number;
  }[] = CONTINENTS.map((cont) => {
    const data = stats.continentStats?.[cont] || { correct: 0, total: 0 };
    const percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    return {
      continent: cont,
      correct: data.correct,
      total: data.total,
      percent,
    };
  });

  // 5. XP History over last 14-30 days for SVG Chart
  const lastDaysCount = 14;
  const chartDays: { date: string; label: string; xp: number }[] = [];
  const now = new Date();

  for (let i = lastDaysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const xp = stats.xpHistory?.[dateStr] || 0;
    chartDays.push({ date: dateStr, label, xp });
  }

  const maxXp = Math.max(...chartDays.map((d) => d.xp), 50);
  const chartWidth = 500;
  const chartHeight = 150;
  const padX = 25;
  const padY = 20;

  const points = chartDays.map((d, index) => {
    const x = padX + (index / (chartDays.length - 1)) * (chartWidth - padX * 2);
    const y = chartHeight - padY - (d.xp / maxXp) * (chartHeight - padY * 2);
    return { x, y, ...d };
  });

  const pathD =
    points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
      : '';

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padY} L ${points[0].x} ${
          chartHeight - padY
        } Z`
      : '';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6 text-white pb-6">
      {/* Top Header */}
      <div className="bg-[#16202c] border border-slate-750 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Statistiques
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-semibold block">Profil :</span>
          <span className="text-sm sm:text-base font-extrabold text-amber-300">
            {stats.username || 'MathildeLPB'}
          </span>
        </div>
      </div>

      {/* 4 Quick KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Response Time */}
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Vitesse Moyenne</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {avgResponseTimeSec ? `${avgResponseTimeSec}s` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {responseTimes.length > 0 ? 'Sur les 50 derniers quiz' : 'En attente de réponses'}
          </div>
        </div>

        {/* Global Accuracy */}
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Précision</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {accuracyPercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {totalCorrect} / {totalAnswered} questions
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Record Série</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {stats.bestStreak || 0} 🔥
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Actuelle : {stats.currentStreak || 0}
          </div>
        </div>

        {/* Countries Discovered */}
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span>Mappe Découverte</span>
            <Globe2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {Object.keys(stats.stamps || {}).length} / {COUNTRIES.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {Math.round((Object.keys(stats.stamps || {}).length / COUNTRIES.length) * 100)}% du globe
          </div>
        </div>
      </div>

      {/* Grid: Most Failed Countries & Accuracy by Continent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Top 5 Most Failed Countries */}
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-4 sm:p-5 shadow-md">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Pays à réviser</span>
          </div>

          {failedList.length > 0 ? (
            <div className="space-y-2.5">
              {failedList.map(({ country, perf, failRate }) => (
                <div
                  key={country.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl select-none">{country.flag}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{country.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {perf.failed} erreur{perf.failed > 1 ? 's' : ''} ({failRate}% d'échec)
                      </div>
                    </div>
                  </div>

                  {onPracticeCountry && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        const c = COUNTRIES_BY_ID[country.id];
                        if (c) onPracticeCountry(c);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 font-bold text-[11px] transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      Réviser
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-80" />
              <span>Aucune erreur enregistrée</span>
            </div>
          )}
        </div>

        {/* Accuracy by Continent */}
        <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-4 sm:p-5 shadow-md">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Précision par continent</span>
          </div>

          <div className="space-y-3">
            {continentData.map((item) => (
              <div key={item.continent}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">{item.continent}</span>
                  <span className="text-slate-400">
                    <strong className="text-white">{item.percent}%</strong> ({item.correct}/{item.total})
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XP Progression Curve (14-30 Days SVG Chart) */}
      <div className="bg-[#1c2938] border border-[#2e4056] rounded-2xl p-4 sm:p-5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Activité XP (14 jours)</span>
          </div>
          <span className="text-xs text-slate-400">Max quotidien : {maxXp} XP</span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40 overflow-visible">
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline */}
            <line
              x1={padX}
              y1={chartHeight - padY}
              x2={chartWidth - padX}
              y2={chartHeight - padY}
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Filled Area under Curve */}
            {areaD && <path d={areaD} fill="url(#xpGrad)" />}

            {/* Line Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points and Dates */}
            {points.map((p, idx) => (
              <g key={p.date}>
                <circle cx={p.x} cy={p.y} r={p.xp > 0 ? 3.5 : 2} fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                {idx % 2 === 0 && (
                  <text
                    x={p.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
