import { Country, Continent, UserStats } from '../types';
import { COUNTRIES, COUNTRIES_BY_ID } from './countries';
import { DifficultyLevel, getCountryDifficulty } from './difficulty';

// 10 Anchor countries spanning all inhabited continents
export const ANCHOR_COUNTRY_IDS: string[] = [
  '250', // France (Europe)
  '392', // Japon (Asie)
  '840', // USA (Amérique du Nord)
  '076', // Brésil (Amérique du Sud)
  '818', // Égypte (Afrique)
  '036', // Australie (Océanie)
  '156', // Chine (Asie)
  '643', // Russie (Europe/Asie)
  '356', // Inde (Asie)
  '710', // Afrique du Sud (Afrique)
];

export const ANCHOR_COUNTRIES: Country[] = ANCHOR_COUNTRY_IDS.map(
  (id) => COUNTRIES_BY_ID[id]
).filter(Boolean);

/**
 * Determine player's most mastered continent based on discovery count and success
 */
export function getMostMasteredContinent(stats: UserStats): Continent {
  const continentScores: Record<Continent, number> = {
    Europe: 0,
    Asie: 0,
    Afrique: 0,
    'Amérique du Nord': 0,
    'Amérique du Sud': 0,
    Océanie: 0,
  };

  for (const [id, stamp] of Object.entries(stats.stamps || {})) {
    const country = COUNTRIES_BY_ID[id];
    if (country) {
      continentScores[country.continent] += stamp.timesDiscovered || 1;
    }
  }

  let topContinent: Continent = 'Europe';
  let maxScore = -1;

  for (const [cont, score] of Object.entries(continentScores)) {
    if (score > maxScore) {
      maxScore = score;
      topContinent = cont as Continent;
    }
  }

  return topContinent;
}

/**
 * Get active progressive pool based on XP (Axe 1: 10 ancres -> 30 consolidés -> 174 mondiaux)
 * Allows overriding when user explicitly chooses a specific continent or manual difficulty.
 */
export function getProgressivePool(
  stats: UserStats,
  allCountries: Country[] = COUNTRIES,
  manualDifficulty?: DifficultyLevel,
  selectedContinent: Continent | 'all' = 'all'
): { pool: Country[]; phase: 'anchors' | 'extension' | 'global'; description: string } {
  // 1. If user explicitly filtered a specific continent, return all matching countries from that continent
  if (selectedContinent !== 'all') {
    let list = allCountries.filter((c) => c.continent === selectedContinent);
    if (manualDifficulty) {
      list = list.filter((c) => getCountryDifficulty(c.id) <= manualDifficulty);
    }
    return {
      pool: list.length > 0 ? list : allCountries,
      phase: 'global',
      description: `${selectedContinent} (${list.length} pays)`,
    };
  }

  // 2. If user manually forces Level 3 (Expert), provide the full world
  if (manualDifficulty === 3) {
    return {
      pool: allCountries,
      phase: 'global',
      description: `Monde complet (${allCountries.length} pays)`,
    };
  }

  // 3. Progressive Pool based on player XP
  const xp = stats.xp || 0;

  // Phase 1: 0 - 100 XP -> 10 Anchor Countries
  if (xp < 100 && (!manualDifficulty || manualDifficulty === 1)) {
    return {
      pool: ANCHOR_COUNTRIES,
      phase: 'anchors',
      description: `Zone de départ (10 pays ancres)`,
    };
  }

  // Phase 2: 100 - 500 XP -> Anchors + Most Mastered Continent (capped at 30 countries)
  if (xp < 500 && (!manualDifficulty || manualDifficulty <= 2)) {
    const favoriteContinent = getMostMasteredContinent(stats);
    const continentCandidates = allCountries.filter(
      (c) => c.continent === favoriteContinent && !ANCHOR_COUNTRY_IDS.includes(c.id)
    );

    // Prioritize level 1 & 2 countries in that continent
    continentCandidates.sort((a, b) => getCountryDifficulty(a.id) - getCountryDifficulty(b.id));

    const extendedList = [...ANCHOR_COUNTRIES, ...continentCandidates.slice(0, 20)];
    return {
      pool: extendedList,
      phase: 'extension',
      description: `Zone d'extension (${extendedList.length} pays : ancres + ${favoriteContinent})`,
    };
  }

  // Phase 3: 500+ XP -> Global World (weighted selection)
  return {
    pool: allCountries,
    phase: 'global',
    description: `Zone globale (174 pays pondérés)`,
  };
}

/**
 * Calculate weight for country selection:
 * probabilité ∝ (1 - maîtrise) * coefficient_fraîcheur
 */
export function calculateCountryWeight(
  countryId: string,
  stats: UserStats,
  recentPicks: string[] = []
): number {
  const stamp = stats.stamps?.[countryId];
  const perf = stats.countryStats?.[countryId];
  const timesDiscovered = stamp?.timesDiscovered || 0;

  // 1. Base mastery from 0.0 (unseen) to 0.85 (mastered)
  let mastery = Math.min(timesDiscovered * 0.18, 0.85);

  // If player frequently failed this country, reduce mastery so it comes back more often!
  if (perf && perf.failed > 0) {
    const errorRatio = perf.failed / (perf.correct + perf.failed);
    mastery = Math.max(0, mastery - errorRatio * 0.4);
  }

  // 2. Freshness coefficient: 2.0 during first 3 appearances after discovery, else 1.0
  let freshness = 1.0;
  if (timesDiscovered >= 1 && timesDiscovered <= 3) {
    freshness = 2.0;
  } else if (timesDiscovered === 0) {
    freshness = 1.6; // High priority for unvisited countries
  }

  // 3. Avoid back-to-back repeats: strong dampener if picked in the last 2 rounds
  if (recentPicks.slice(-2).includes(countryId)) {
    return 0.05;
  }

  return Math.max(0.1, (1 - mastery) * freshness);
}

/**
 * Pick target country using weighted roulette wheel selection
 */
export function pickWeightedCountry(
  pool: Country[],
  stats: UserStats,
  excludeId?: string,
  recentPicks: string[] = []
): Country {
  if (pool.length === 0) return COUNTRIES[0];
  if (pool.length === 1) return pool[0];

  const candidates = excludeId ? pool.filter((c) => c.id !== excludeId) : pool;
  const weights = candidates.map((c) => calculateCountryWeight(c.id, stats, recentPicks));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let randomVal = Math.random() * totalWeight;
  for (let i = 0; i < candidates.length; i++) {
    randomVal -= weights[i];
    if (randomVal <= 0) {
      return candidates[i];
    }
  }

  return candidates[0];
}

/**
 * Great-circle geographic distance between two countries in kilometers
 */
export function getDistanceKm(c1: Country, c2: Country): number {
  const [lon1, lat1] = c1.coordinates;
  const [lon2, lat2] = c2.coordinates;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type DistractorNoiseLevel = 'low' | 'medium' | 'high';

/**
 * Compute dynamic noise level (DDA):
 * - Considers player XP base tier
 * - Modulated by current streak (+1 if >= 3)
 * - Lowered if consecutive errors occur
 */
export function computeDynamicNoiseLevel(
  xp: number,
  currentStreak: number,
  consecutiveErrors: number = 0
): DistractorNoiseLevel {
  let levelScore = 0; // 0: low, 1: medium, 2: high

  if (xp >= 500) {
    levelScore = 2;
  } else if (xp >= 100) {
    levelScore = 1;
  } else {
    levelScore = 0;
  }

  // DDA Adjustment: promote on winning streak
  if (currentStreak >= 3) {
    levelScore = Math.min(levelScore + 1, 2);
  }

  // DDA Adjustment: demote on repeated failures to reduce cognitive overload
  if (consecutiveErrors >= 2) {
    levelScore = Math.max(levelScore - 1, 0);
  }

  if (levelScore === 2) return 'high';
  if (levelScore === 1) return 'medium';
  return 'low';
}

/**
 * Generate 3 smart distractors according to Noise Level (Axe 3):
 * - 'low': Random countries across different continents
 * - 'medium': Countries from the SAME continent
 * - 'high': Geographically closest neighbor countries
 */
export function generateSmartDistractors(
  target: Country,
  allCountries: Country[] = COUNTRIES,
  noiseLevel: DistractorNoiseLevel = 'medium'
): Country[] {
  const others = allCountries.filter((c) => c.id !== target.id);

  if (noiseLevel === 'high') {
    // 1. Sort all other countries by geographical distance from target
    const sortedByDistance = [...others].sort(
      (a, b) => getDistanceKm(target, a) - getDistanceKm(target, b)
    );
    // Pick from closest 8 neighbors with slight shuffle for variety
    const closestPool = sortedByDistance.slice(0, 8);
    return shuffleArray(closestPool).slice(0, 3);
  }

  if (noiseLevel === 'medium') {
    // 2. Same continent distractors
    const sameContinent = others.filter((c) => c.continent === target.continent);
    if (sameContinent.length >= 3) {
      return shuffleArray(sameContinent).slice(0, 3);
    }
    // Fallback if small continent
    return shuffleArray(others).slice(0, 3);
  }

  // 3. 'low': Cross-continent distractors (diverse continents)
  const differentContinents = others.filter((c) => c.continent !== target.continent);
  const byContinent: Record<string, Country[]> = {};
  for (const c of differentContinents) {
    if (!byContinent[c.continent]) byContinent[c.continent] = [];
    byContinent[c.continent].push(c);
  }

  const selectedContinents = shuffleArray(Object.keys(byContinent)).slice(0, 3);
  const result: Country[] = [];

  for (const cont of selectedContinents) {
    const list = byContinent[cont];
    if (list && list.length > 0) {
      result.push(list[Math.floor(Math.random() * list.length)]);
    }
  }

  while (result.length < 3 && others.length > result.length) {
    const candidate = others[Math.floor(Math.random() * others.length)];
    if (!result.find((c) => c.id === candidate.id)) {
      result.push(candidate);
    }
  }

  return result;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
