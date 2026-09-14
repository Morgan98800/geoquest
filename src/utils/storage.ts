import { UserStats } from '../types';
import { sound } from './audio';

const ACTIVE_USER_STORAGE_KEY = 'geoquest_active_username_v1';
const LEGACY_STORAGE_KEY = 'geoquest_user_stats_v1';

export const DEFAULT_ACCOUNTS = ['MathildeLPB', 'Morgan'];

export const LEVELS = [
  { level: 1, title: '🌱 Touriste Curieuse', minXp: 0, maxXp: 80, badge: '🌱' },
  { level: 2, title: '🎒 Randonneuse des Villes', minXp: 80, maxXp: 200, badge: '🎒' },
  { level: 3, title: '🧭 Baroudeuse des Continents', minXp: 200, maxXp: 450, badge: '🧭' },
  { level: 4, title: '✈️ Pilote Globe-Trotteuse', minXp: 450, maxXp: 800, badge: '✈️' },
  { level: 5, title: '👑 Reine de la Mappemonde', minXp: 800, maxXp: 1400, badge: '👑' },
  { level: 6, title: '🌌 Maîtresse Suprême du Globe', minXp: 1400, maxXp: 999999, badge: '🌌' },
];

export const createDefaultStats = (username: string = 'MathildeLPB'): UserStats => ({
  username,
  xp: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  stamps: {},
  unlockedFacts: {},
  soundEnabled: true,
});

export const DEFAULT_STATS = createDefaultStats('MathildeLPB');

export function getActiveUsername(): string {
  try {
    const saved = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return 'MathildeLPB';
}

export function setActiveUsername(username: string): void {
  try {
    const clean = username.trim() || 'MathildeLPB';
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, clean);
  } catch (e) {
    console.error('Failed to set active username', e);
  }
}

function getUserStorageKey(username: string): string {
  const normalized = username.trim().toLowerCase() || 'mathildelpb';
  return `geoquest_account_${normalized}_v1`;
}

export function loadUserStats(customUsername?: string): UserStats {
  const username = customUsername || getActiveUsername();
  const key = getUserStorageKey(username);

  try {
    // 1. Check if backup code in URL hash with user specified
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#backup=')) {
      const hashContent = window.location.hash.replace('#backup=', '');
      const [encoded, urlUser] = hashContent.split('&user=');
      const targetUser = urlUser ? decodeURIComponent(urlUser) : username;
      const imported = importStatsFromCode(encoded);
      if (imported) {
        imported.username = targetUser;
        setActiveUsername(targetUser);
        saveUserStats(imported, targetUser);
        window.history.replaceState(null, '', window.location.pathname);
        return imported;
      }
    }

    // 2. Load from user-specific key
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      const stats = { ...createDefaultStats(username), ...parsed, username };
      sound.setEnabled(stats.soundEnabled);
      return stats;
    }

    // 3. Seamless Migration: if no stats under this user yet, but legacy exists, migrate to MathildeLPB
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw && (username === 'MathildeLPB' || !localStorage.getItem(getUserStorageKey('MathildeLPB')))) {
      const parsed = JSON.parse(legacyRaw);
      const migrated = { ...createDefaultStats(username), ...parsed, username };
      saveUserStats(migrated, username);
      sound.setEnabled(migrated.soundEnabled);
      return migrated;
    }

    return createDefaultStats(username);
  } catch {
    return createDefaultStats(username);
  }
}

export function saveUserStats(stats: UserStats, customUsername?: string): void {
  const username = customUsername || stats.username || getActiveUsername();
  const key = getUserStorageKey(username);
  try {
    const toSave = { ...stats, username };
    localStorage.setItem(key, JSON.stringify(toSave));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(toSave)); // sync legacy for safety
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      const current = LEVELS[i];
      const next = LEVELS[i + 1] || current;
      const progress =
        next === current
          ? 100
          : Math.min(100, Math.round(((xp - current.minXp) / (current.maxXp - current.minXp)) * 100));
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
      return { ...createDefaultStats(parsed.username || 'MathildeLPB'), ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

export function downloadBackupFile(stats: UserStats): void {
  const username = stats.username || 'MathildeLPB';
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `geoquest_${username}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
