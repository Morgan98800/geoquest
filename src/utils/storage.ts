import { UserStats } from '../types';
import { sound } from './audio';

const STORAGE_KEY = 'geoquest_user_stats_v1';

export const LEVELS = [
  { level: 1, title: '🌱 Touriste Curieuse', minXp: 0, maxXp: 80, badge: '🌱' },
  { level: 2, title: '🎒 Randonneuse des Villes', minXp: 80, maxXp: 200, badge: '🎒' },
  { level: 3, title: '🧭 Baroudeuse des Continents', minXp: 200, maxXp: 450, badge: '🧭' },
  { level: 4, title: '✈️ Pilote Globe-Trotteuse', minXp: 450, maxXp: 800, badge: '✈️' },
  { level: 5, title: '👑 Reine de la Mappemonde', minXp: 800, maxXp: 1400, badge: '👑' },
  { level: 6, title: '🌌 Maîtresse Suprême du Globe', minXp: 1400, maxXp: 999999, badge: '🌌' },
];

export const DEFAULT_STATS: UserStats = {
  xp: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  stamps: {},
  unlockedFacts: {},
  soundEnabled: true,
};

export function loadUserStats(): UserStats {
  try {
    // Check if a backup is provided in the URL hash (e.g. #backup=...)
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#backup=')) {
      const encoded = window.location.hash.replace('#backup=', '');
      const imported = importStatsFromCode(encoded);
      if (imported) {
        saveUserStats(imported);
        window.history.replaceState(null, '', window.location.pathname);
        return imported;
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    const stats = { ...DEFAULT_STATS, ...parsed };
    sound.setEnabled(stats.soundEnabled);
    return stats;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      const current = LEVELS[i];
      const next = LEVELS[i + 1] || current;
      const progress = next === current ? 100 : Math.min(100, Math.round(((xp - current.minXp) / (current.maxXp - current.minXp)) * 100));
      return {
        ...current,
        nextLevelXp: current.maxXp,
        progressPercent: progress,
      };
    }
  }
  return { ...LEVELS[0], nextLevelXp: LEVELS[0].maxXp, progressPercent: 0 };
}

export function recordAnswer(
  prevStats: UserStats,
  isCorrect: boolean,
  countryId: string,
  bonusXp: number = 0
): { newStats: UserStats; leveledUp: boolean; newStamp: boolean } {
  const oldLevel = getLevelInfo(prevStats.xp).level;

  if (!isCorrect) {
    const updated: UserStats = {
      ...prevStats,
      currentStreak: 0,
      totalAnswered: prevStats.totalAnswered + 1,
    };
    saveUserStats(updated);
    return { newStats: updated, leveledUp: false, newStamp: false };
  }

  const streak = prevStats.currentStreak + 1;
  const bestStreak = Math.max(streak, prevStats.bestStreak);
  const earnedXp = 15 + (streak > 3 ? Math.min(streak * 2, 20) : 0) + bonusXp;
  const totalXp = prevStats.xp + earnedXp;

  const isFirstDiscovery = !prevStats.stamps[countryId];
  const currentCount = (prevStats.stamps[countryId]?.timesDiscovered || 0) + 1;

  const stamps = {
    ...prevStats.stamps,
    [countryId]: {
      countryId,
      date: new Date().toISOString(),
      timesDiscovered: currentCount,
    },
  };

  const existingFacts = prevStats.unlockedFacts[countryId] || [];
  const nextFactIndex = existingFacts.length;
  const unlockedFacts = {
    ...prevStats.unlockedFacts,
    [countryId]: Array.from(new Set([...existingFacts, nextFactIndex])),
  };

  const updated: UserStats = {
    ...prevStats,
    xp: totalXp,
    currentStreak: streak,
    bestStreak,
    totalCorrect: prevStats.totalCorrect + 1,
    totalAnswered: prevStats.totalAnswered + 1,
    stamps,
    unlockedFacts,
  };

  saveUserStats(updated);

  const newLevel = getLevelInfo(totalXp).level;
  const leveledUp = newLevel > oldLevel;

  return { newStats: updated, leveledUp, newStamp: isFirstDiscovery };
}

// Backup & Transfer utilities
export function exportStatsAsCode(stats: UserStats): string {
  try {
    const json = JSON.stringify(stats);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

export function importStatsFromCode(code: string): UserStats | null {
  try {
    const json = decodeURIComponent(atob(code.trim()));
    const parsed = JSON.parse(json);
    if (typeof parsed.xp === 'number' && parsed.stamps) {
      return { ...DEFAULT_STATS, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

export function downloadBackupFile(stats: UserStats): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `geoquest_sauvegarde_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
