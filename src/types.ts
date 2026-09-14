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

export type GameMode = 'map' | 'flags' | 'capitals' | 'atlas' | 'passport';

export interface Stamp {
  countryId: string;
  date: string;
  timesDiscovered: number;
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
}

export interface QuizQuestion {
  targetCountry: Country;
  type: 'flag' | 'capital' | 'map';
  options: Country[]; // 4 choices for multiple choice
}
