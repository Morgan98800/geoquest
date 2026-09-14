import { Country, Continent } from '../types';

export type DifficultyLevel = 1 | 2 | 3;

export const DIFFICULTY_LEVELS = [
  {
    level: 1 as DifficultyLevel,
    title: 'Niveau 1',
    label: 'Débutant',
    description: '10 à 45 pays ancres et incontournables',
    badge: '🌱',
  },
  {
    level: 2 as DifficultyLevel,
    title: 'Niveau 2',
    label: 'Intermédiaire',
    description: 'Extension progressive (~30 à 110 pays)',
    badge: '🧭',
  },
  {
    level: 3 as DifficultyLevel,
    title: 'Niveau 3',
    label: 'Expert',
    description: 'Monde complet (174 pays & îles)',
    badge: '👑',
  },
] as const;

// ISO 3166 numeric IDs for Level 1 (Well-known major countries)
// France, USA, UK, Germany, Italy, Spain, Canada, Brazil, Russia, China, Japan, India, Australia, etc.
export const LEVEL_1_COUNTRY_IDS = new Set<string>([
  '250', // France
  '840', // USA
  '124', // Canada
  '826', // UK
  '276', // Germany
  '380', // Italy
  '724', // Spain
  '620', // Portugal
  '076', // Brazil
  '032', // Argentina
  '643', // Russia
  '156', // China
  '392', // Japan
  '356', // India
  '036', // Australia
  '554', // New Zealand
  '818', // Egypt
  '710', // South Africa
  '012', // Algeria
  '504', // Morocco
  '484', // Mexico
  '170', // Colombia
  '152', // Chile
  '604', // Peru
  '410', // South Korea
  '792', // Turkey
  '682', // Saudi Arabia
  '784', // UAE
  '360', // Indonesia
  '764', // Thailand
  '704', // Vietnam
  '608', // Philippines
  '300', // Greece
  '752', // Sweden
  '578', // Norway
  '616', // Poland
  '528', // Netherlands
  '056', // Belgium
  '756', // Switzerland
  '566', // Nigeria
  '404', // Kenya
  '804', // Ukraine
]);

// ISO 3166 numeric IDs for Level 2 (Intermediate countries)
export const LEVEL_2_COUNTRY_IDS = new Set<string>([
  '040', // Austria
  '208', // Denmark
  '246', // Finland
  '203', // Czechia
  '348', // Hungary
  '642', // Romania
  '100', // Bulgaria
  '191', // Croatia
  '688', // Serbia
  '703', // Slovakia
  '352', // Iceland
  '372', // Ireland
  '192', // Cuba
  '188', // Costa Rica
  '591', // Panama
  '388', // Jamaica
  '214', // Dominican Republic
  '218', // Ecuador
  '068', // Bolivia
  '600', // Paraguay
  '858', // Uruguay
  '862', // Venezuela
  '586', // Pakistan
  '050', // Bangladesh
  '458', // Malaysia
  '702', // Singapore
  '158', // Taiwan
  '376', // Israel
  '400', // Jordan
  '422', // Lebanon
  '368', // Iraq
  '364', // Iran
  '398', // Kazakhstan
  '860', // Uzbekistan
  '144', // Sri Lanka
  '524', // Nepal
  '496', // Mongolia
  '686', // Senegal
  '384', // Ivory Coast
  '288', // Ghana
  '120', // Cameroon
  '231', // Ethiopia
  '834', // Tanzania
  '800', // Uganda
  '450', // Madagascar
  '024', // Angola
  '894', // Zambia
  '716', // Zimbabwe
  '516', // Namibia
  '180', // DR Congo
  '266', // Gabon
  '788', // Tunisia
]);

/**
 * Get difficulty tier for a country:
 * 1: Well known (~42 countries)
 * 2: Intermediate (~52 countries)
 * 3: Advanced & small countries (Brunei, Timor-Leste, islands, etc.)
 */
export function getCountryDifficulty(countryId: string): DifficultyLevel {
  if (LEVEL_1_COUNTRY_IDS.has(countryId)) return 1;
  if (LEVEL_2_COUNTRY_IDS.has(countryId)) return 2;
  return 3;
}

/**
 * Filter countries based on StudyGe difficulty level and continent:
 * - Level 1: returns Level 1 countries only
 * - Level 2: returns Level 1 + Level 2 countries
 * - Level 3: returns all countries (Level 1 + 2 + 3)
 */
export function getFilteredCountries(
  allCountries: Country[],
  difficulty: DifficultyLevel,
  continent: Continent | 'all' = 'all'
): Country[] {
  return allCountries.filter((country) => {
    const countryDiff = getCountryDifficulty(country.id);
    const matchesDifficulty = countryDiff <= difficulty;
    const matchesContinent = continent === 'all' || country.continent === continent;
    return matchesDifficulty && matchesContinent;
  });
}

/**
 * Compute country mastery stars (StudyGe system):
 * 0: 0 star (unvisited)
 * 1: ⭐ (1-2 times discovered)
 * 2: ⭐⭐ (3-4 times discovered)
 * 3: ⭐⭐⭐ (5+ times discovered - Mastered)
 */
export function getCountryStars(timesDiscovered: number = 0): 0 | 1 | 2 | 3 {
  if (timesDiscovered >= 5) return 3;
  if (timesDiscovered >= 3) return 2;
  if (timesDiscovered >= 1) return 1;
  return 0;
}
