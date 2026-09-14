export type Continent = 'Afrique' | 'Asie' | 'Europe' | 'Amérique du Nord' | 'Amérique du Sud' | 'Océanie';

export interface Country {
  id: string; // ISO 3166-1 numeric string (matches GeoJSON)
  code: string; // ISO alpha-2
  code3: string; // ISO alpha-3
  name: string;
  capital: string;
  continent: Continent;
  flag: string;
  coordinates: [number, number]; // [lng, lat]
  funFacts: string[];
  areaKm2?: number;
  population?: string;
  currency?: string;
  language?: string;
}

export type GameMode = 'map' | 'flags' | 'capitals' | 'atlas' | 'passport' | 'stats' | 'srs';

export interface Stamp {
  countryId: string;
  date: string;
  timesDiscovered: number;
}

export interface CountryPerformance {
  correct: number;
  failed: number;
}

export interface SrsCard {
  countryId: string;
  level: number; // 0: Due, 1: 1 day, 2: 3 days, 3: 7 days, 4: 14 days, 5: 30 days
  nextReviewDate: number; // timestamp in ms
  lastReviewedDate: number; // timestamp in ms
  streak: number;
}

export interface DailyRewardDay {
  day: number; // 1 to 7
  xp: number;
  label: string;
  rewardBadge?: string;
}

export interface UserStats {
  username?: string;
  xp: number;
  currentStreak: number;
  bestStreak: number;
  totalCorrect: number;
  totalAnswered: number;
  stamps: Record<string, Stamp>;
  unlockedFacts: Record<string, number[]>; // countryId -> array of fact indices unlocked
  soundEnabled: boolean;
  
  // 7-day Daily Login Retention
  dailyStreak: number; // 1 to 7
  lastLoginDate?: string; // YYYY-MM-DD
  lastClaimedDate?: string; // YYYY-MM-DD

  // Detailed Statistics
  responseTimes: number[]; // response times in ms (last 50 responses)
  countryStats: Record<string, CountryPerformance>; // countryId -> { correct, failed }
  continentStats: Record<string, { correct: number; total: number }>; // continent -> { correct, total }
  xpHistory: Record<string, number>; // YYYY-MM-DD -> XP earned

  // Spaced Repetition System (SRS)
  srsData: Record<string, SrsCard>; // countryId -> SrsCard
}

export interface QuizQuestion {
  targetCountry: Country;
  type: 'flag' | 'capital' | 'map';
  options: Country[]; // 4 choices for multiple choice
}
