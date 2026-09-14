import { Country, SrsCard } from '../types';

export const SRS_INTERVALS_MS: Record<number, number> = {
  0: 0, // due immediately
  1: 24 * 60 * 60 * 1000, // 1 day
  2: 3 * 24 * 60 * 60 * 1000, // 3 days
  3: 7 * 24 * 60 * 60 * 1000, // 7 days
  4: 14 * 24 * 60 * 60 * 1000, // 14 days
  5: 30 * 24 * 60 * 60 * 1000, // 30 days (Mastered)
};

export function updateSrsCard(
  card: SrsCard | undefined,
  countryId: string,
  isCorrect: boolean
): SrsCard {
  const now = Date.now();

  if (!card) {
    // First time seeing this card
    if (isCorrect) {
      return {
        countryId,
        level: 1,
        nextReviewDate: now + SRS_INTERVALS_MS[1],
        lastReviewedDate: now,
        streak: 1,
      };
    } else {
      return {
        countryId,
        level: 0,
        nextReviewDate: now, // due immediately
        lastReviewedDate: now,
        streak: 0,
      };
    }
  }

  if (isCorrect) {
    const nextLevel = Math.min(card.level + 1, 5);
    const interval = SRS_INTERVALS_MS[nextLevel];
    return {
      countryId,
      level: nextLevel,
      nextReviewDate: now + interval,
      lastReviewedDate: now,
      streak: card.streak + 1,
    };
  } else {
    // Reset to level 0 on error
    return {
      countryId,
      level: 0,
      nextReviewDate: now, // due immediately
      lastReviewedDate: now,
      streak: 0,
    };
  }
}

export function getDueCountries(
  srsData: Record<string, SrsCard>,
  allCountries: Country[]
): Country[] {
  const now = Date.now();
  const countryMap = new Map(allCountries.map((c) => [c.id, c]));

  // 1. Countries that have SRS data and are due
  const dueCountryIds = Object.values(srsData)
    .filter((card) => card.nextReviewDate <= now)
    .sort((a, b) => a.level - b.level) // lowest level first (most urgent)
    .map((card) => card.countryId);

  const dueCountries = dueCountryIds
    .map((id) => countryMap.get(id))
    .filter((c): c is Country => c !== undefined);

  return dueCountries;
}

export function getSrsSummary(
  srsData: Record<string, SrsCard>,
  totalCountries: number
) {
  const now = Date.now();
  let dueCount = 0;
  let masteredCount = 0;
  let learningCount = 0;

  for (const card of Object.values(srsData)) {
    if (card.nextReviewDate <= now) {
      dueCount++;
    }
    if (card.level >= 4) {
      masteredCount++;
    } else if (card.level >= 1) {
      learningCount++;
    }
  }

  const seenCount = Object.keys(srsData).length;
  const unseenCount = Math.max(0, totalCountries - seenCount);

  return {
    dueCount,
    masteredCount,
    learningCount,
    unseenCount,
    totalSeen: seenCount,
  };
}
