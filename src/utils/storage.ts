import { UserStats, DailyRewardDay, Continent } from '../types';
import { sound } from './audio';

const ACTIVE_USER_STORAGE_KEY = 'geoquest_active_username_v2';
const LEGACY_STORAGE_KEY = 'geoquest_user_stats_v2';

// Explicit cleanup of legacy stats to reset Morgan & Mathilde to 0 XP
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('geoquest_account_mathildelpb_v1');
    localStorage.removeItem('geoquest_account_morgan_v1');
    localStorage.removeItem('geoquest_user_stats_v1');
    localStorage.removeItem('geoquest_active_username_v1');
  } catch {}
}

export const DEFAULT_ACCOUNTS = ['MathildeLPB', 'Morgan'];

export const LEVELS = [
  { level: 1, title: '🌱 Curieux du Monde', minXp: 0, maxXp: 80, badge: '🌱' },
  { level: 2, title: '🎒 Apprenti Voyageur', minXp: 80, maxXp: 200, badge: '🎒' },
  { level: 3, title: '🧭 Baroudeur des Continents', minXp: 200, maxXp: 450, badge: '🧭' },
  { level: 4, title: '✈️ Pilote Globe-Trotteur', minXp: 450, maxXp: 800, badge: '✈️' },
  { level: 5, title: '👑 Maître de la Mappemonde', minXp: 800, maxXp: 1400, badge: '👑' },
  { level: 6, title: '🌌 Souverain Suprême du Globe', minXp: 1400, maxXp: 999999, badge: '🌌' },
];

export const DAILY_REWARDS: DailyRewardDay[] = [
  { day: 1, xp: 25, label: '+25 XP' },
  { day: 2, xp: 50, label: '+50 XP' },
  { day: 3, xp: 75, label: '+75 XP' },
  { day: 4, xp: 110, label: '+110 XP' },
  { day: 5, xp: 150, label: '+150 XP' },
  { day: 6, xp: 200, label: '+200 XP' },
  { day: 7, xp: 300, label: '+300 XP & Sceau d\'Or 👑', rewardBadge: '👑' },
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
  dailyStreak: 1,
  responseTimes: [],
  countryStats: {},
  continentStats: {},
  xpHistory: {},
  srsData: {},
});

export const DEFAULT_STATS = createDefaultStats('MathildeLPB');

export function resetUserStats(username: string): UserStats {
  const clean = username.trim() || 'MathildeLPB';
  const fresh = createDefaultStats(clean);
  saveUserStats(fresh, clean);
  return fresh;
}

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
  return `geoquest_account_${normalized}_v2`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
        return sanitizeStats(imported, targetUser);
      }
    }

    // 2. Load from user-specific key
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      const stats = sanitizeStats(parsed, username);
      sound.setEnabled(stats.soundEnabled);
      return stats;
    }

    // 3. Seamless Migration: if legacy exists
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw && (username === 'MathildeLPB' || !localStorage.getItem(getUserStorageKey('MathildeLPB')))) {
      const parsed = JSON.parse(legacyRaw);
      const migrated = sanitizeStats(parsed, username);
      saveUserStats(migrated, username);
      sound.setEnabled(migrated.soundEnabled);
      return migrated;
    }

    return createDefaultStats(username);
  } catch {
    return createDefaultStats(username);
  }
}

function sanitizeStats(raw: Partial<UserStats>, username: string): UserStats {
  const defaults = createDefaultStats(username);
  return {
    ...defaults,
    ...raw,
    username,
    stamps: raw.stamps || {},
    unlockedFacts: raw.unlockedFacts || {},
    responseTimes: Array.isArray(raw.responseTimes) ? raw.responseTimes : [],
    countryStats: raw.countryStats || {},
    continentStats: raw.continentStats || {},
    xpHistory: raw.xpHistory || {},
    srsData: raw.srsData || {},
    dailyStreak: typeof raw.dailyStreak === 'number' && raw.dailyStreak >= 1 ? raw.dailyStreak : 1,
  };
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

// 7-Day Login Retention Checker
export function checkDailyStatus(stats: UserStats): {
  canClaim: boolean;
  currentDay: number;
  isNewStreak: boolean;
  todayStr: string;
} {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const lastClaimed = stats.lastClaimedDate;

  // Already claimed today
  if (lastClaimed === today) {
    return {
      canClaim: false,
      currentDay: Math.min(Math.max(stats.dailyStreak, 1), 7),
      isNewStreak: false,
      todayStr: today,
    };
  }

  // Claimed yesterday -> advance streak (wrap 7 back to 1)
  if (lastClaimed === yesterday) {
    const nextDay = stats.dailyStreak >= 7 ? 1 : stats.dailyStreak + 1;
    return {
      canClaim: true,
      currentDay: nextDay,
      isNewStreak: false,
      todayStr: today,
    };
  }

  // Missed a day or first time -> streak reset to 1
  return {
    canClaim: true,
    currentDay: 1,
    isNewStreak: true,
    todayStr: today,
  };
}

export function claimDailyReward(stats: UserStats): {
  newStats: UserStats;
  reward: DailyRewardDay;
  leveledUp: boolean;
} {
  const status = checkDailyStatus(stats);
  const dayIndex = Math.min(Math.max(status.currentDay, 1), 7) - 1;
  const reward = DAILY_REWARDS[dayIndex] || DAILY_REWARDS[0];

  const oldLevel = getLevelInfo(stats.xp).level;
  const newXp = stats.xp + reward.xp;
  const newLevel = getLevelInfo(newXp).level;

  const today = status.todayStr;
  const currentDailyXp = stats.xpHistory[today] || 0;
  const updatedXpHistory = {
    ...stats.xpHistory,
    [today]: currentDailyXp + reward.xp,
  };

  const updated: UserStats = {
    ...stats,
    xp: newXp,
    dailyStreak: status.currentDay,
    lastClaimedDate: today,
    lastLoginDate: today,
    xpHistory: updatedXpHistory,
  };

  saveUserStats(updated);

  return {
    newStats: updated,
    reward,
    leveledUp: newLevel > oldLevel,
  };
}

export function recordAnswer(
  prevStats: UserStats,
  isCorrect: boolean,
  countryId: string,
  bonusXp: number = 0,
  responseTimeMs?: number,
  continent?: Continent
): { newStats: UserStats; leveledUp: boolean; newStamp: boolean } {
  const oldLevel = getLevelInfo(prevStats.xp).level;
  const today = getTodayDateString();

  // 1. Update response times (keep last 50)
  let updatedResponseTimes = prevStats.responseTimes || [];
  if (responseTimeMs !== undefined && responseTimeMs > 0 && responseTimeMs < 60000) {
    updatedResponseTimes = [responseTimeMs, ...updatedResponseTimes].slice(0, 50);
  }

  // 2. Update country-level performance
  const countryPerf = prevStats.countryStats[countryId] || { correct: 0, failed: 0 };
  const updatedCountryStats = {
    ...prevStats.countryStats,
    [countryId]: {
      correct: countryPerf.correct + (isCorrect ? 1 : 0),
      failed: countryPerf.failed + (isCorrect ? 0 : 1),
    },
  };

  // 3. Update continent-level performance
  let updatedContinentStats = prevStats.continentStats || {};
  if (continent) {
    const contPerf = updatedContinentStats[continent] || { correct: 0, total: 0 };
    updatedContinentStats = {
      ...updatedContinentStats,
      [continent]: {
        correct: contPerf.correct + (isCorrect ? 1 : 0),
        total: contPerf.total + 1,
      },
    };
  }

  if (!isCorrect) {
    const updated: UserStats = {
      ...prevStats,
      currentStreak: 0,
      totalAnswered: prevStats.totalAnswered + 1,
      responseTimes: updatedResponseTimes,
      countryStats: updatedCountryStats,
      continentStats: updatedContinentStats,
      lastLoginDate: today,
    };
    saveUserStats(updated);
    return { newStats: updated, leveledUp: false, newStamp: false };
  }

  // Success handling
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

  // Update XP history for today
  const currentDailyXp = prevStats.xpHistory[today] || 0;
  const updatedXpHistory = {
    ...prevStats.xpHistory,
    [today]: currentDailyXp + earnedXp,
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
    responseTimes: updatedResponseTimes,
    countryStats: updatedCountryStats,
    continentStats: updatedContinentStats,
    xpHistory: updatedXpHistory,
    lastLoginDate: today,
  };

  saveUserStats(updated);

  const newLevel = getLevelInfo(totalXp).level;
  return {
    newStats: updated,
    leveledUp: newLevel > oldLevel,
    newStamp: isFirstDiscovery,
  };
}

export function exportStatsToCode(stats: UserStats): string {
  try {
    const json = JSON.stringify(stats);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error('Failed to export stats', e);
    return '';
  }
}

export const exportStatsAsCode = exportStatsToCode;

export function downloadBackupFile(stats: UserStats): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `geopd_sauvegarde_${stats.username || 'joueur'}_${getTodayDateString()}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (e) {
    console.error('Failed to download backup file', e);
  }
}

export function importStatsFromCode(code: string): UserStats | null {
  try {
    const json = decodeURIComponent(escape(atob(code.trim())));
    const parsed = JSON.parse(json);
    if (typeof parsed.xp === 'number' && typeof parsed.stamps === 'object') {
      return sanitizeStats(parsed, parsed.username || getActiveUsername());
    }
    return null;
  } catch (e) {
    console.error('Failed to import stats code', e);
    return null;
  }
}

