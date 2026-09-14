// Database of countries with rich facts, capitals, coordinates and flags
// Explicitly recognizes Palestine (PSE) and Taiwan (TWN) as sovereign independent nations.
import { Country, Continent } from '../types';

export const COUNTRIES: Country[] = [
  {
    "id": "242",
    "code": "FJ",
    "code3": "FJI",
    "name": "Fidji",
    "capital": "Suva",
    "continent": "Océanie",
    "flag": "🇫🇯",
    "coordinates": [
      178.57,
      -17.32
    ],
    "funFacts": []
  },
  {
    "id": "834",
    "code": "TZ",
    "code3": "TZA",
    "name": "République unie de Tanzanie",
    "capital": "Dodoma",
    "continent": "Afrique",
    "flag": "🇹🇿",
    "coordinates": [
      34.74,
      -6.25
    ],
    "funFacts": []
  },
  {
    "id": "732",
    "code": "EH",
    "code3": "ESH",
    "name": "Sahara occidental",
    "capital": "Laâyoune",
    "continent": "Afrique",
    "flag": "🇪🇭",
    "coordinates": [
      -12.19,
      24.28
    ],
    "funFacts": []
  },
  {
    "id": "124",
    "code": "CA",
    "code3": "CAN",
    "name": "Canada",
    "capital": "Ottawa",
    "continent": "Amérique du Nord",
    "flag": "🇨🇦",
    "coordinates": [
      -96.4,
      60.48
    ],
    "funFacts": [
      "Le Canada compte plus de 2 millions de lacs : c'est plus que l'ensemble des autres pays de la planète réunis !",
      "Le littoral maritime canadien est le plus long de la Terre (plus de 202 000 km) : il faudrait plus de 4 ans pour le longer à pied !",
      "Le Québec abrite une réserve stratégique mondiale de sirop d'érable gardée sous très haute surveillance !"
    ]
  },
  {
    "id": "840",
    "code": "US",
    "code3": "USA",
    "name": "États-Unis",
    "capital": "Washington D.C.",
    "continent": "Amérique du Nord",
    "flag": "🇺🇸",
    "coordinates": [
      -103.57,
      44.76
    ],
    "funFacts": [
      "L'Alaska possède un littoral maritime plus étendu que celui de tous les 49 autres États américains réunis !",
      "Les États-Unis n'ont aucune langue officielle inscrite dans leur constitution fédérale.",
      "Le parc national de Yellowstone abrite une supercaldeira volcanique concentrant plus de la moitié des geysers actifs du globe !"
    ]
  },
  {
    "id": "398",
    "code": "KZ",
    "code3": "KAZ",
    "name": "Kazakhstan",
    "capital": "Astana",
    "continent": "Asie",
    "flag": "🇰🇿",
    "coordinates": [
      67.24,
      48.41
    ],
    "funFacts": []
  },
  {
    "id": "860",
    "code": "UZ",
    "code3": "UZB",
    "name": "Ouzbékistan",
    "capital": "Tachkent",
    "continent": "Asie",
    "flag": "🇺🇿",
    "coordinates": [
      63.37,
      41.77
    ],
    "funFacts": []
  },
  {
    "id": "598",
    "code": "PG",
    "code3": "PNG",
    "name": "Papouasie-Nouvelle-Guinée",
    "capital": "Port Moresby",
    "continent": "Océanie",
    "flag": "🇵🇬",
    "coordinates": [
      145.31,
      -6.46
    ],
    "funFacts": []
  },
  {
    "id": "360",
    "code": "ID",
    "code3": "IDN",
    "name": "Indonésie",
    "capital": "Jakarta / Nusantara",
    "continent": "Asie",
    "flag": "🇮🇩",
    "coordinates": [
      117.36,
      -2.27
    ],
    "funFacts": []
  },
  {
    "id": "032",
    "code": "AR",
    "code3": "ARG",
    "name": "Argentine",
    "capital": "Buenos Aires",
    "continent": "Amérique du Sud",
    "flag": "🇦🇷",
    "coordinates": [
      -64.75,
      -34.74
    ],
    "funFacts": [
      "L'Argentine abrite à la fois le sommet le plus élevé d'Amérique (l'Aconcagua à 6 961 m) et la dépression la plus basse (Laguna del Carbón à -105 m) !",
      "Ushuaïa, en Terre de Feu, est mondialement renommée comme la ville la plus au sud de notre planète, 'le bout du monde'.",
      "Le tango est né au XIXe siècle dans les faubourgs métissés du port de Buenos Aires avant d'enflammer les salons du monde entier."
    ]
  },
  {
    "id": "152",
    "code": "CL",
    "code3": "CHL",
    "name": "Chili",
    "capital": "Santiago",
    "continent": "Amérique du Sud",
    "flag": "🇨🇱",
    "coordinates": [
      -71.18,
      -37.31
    ],
    "funFacts": []
  },
  {
    "id": "180",
    "code": "CD",
    "code3": "COD",
    "name": "République démocratique du Congo",
    "capital": "Kinshasa",
    "continent": "Afrique",
    "flag": "🇨🇩",
    "coordinates": [
      23.58,
      -2.84
    ],
    "funFacts": []
  },
  {
    "id": "706",
    "code": "SO",
    "code3": "SOM",
    "name": "Somalie",
    "capital": "Mogadiscio",
    "continent": "Afrique",
    "flag": "🇸🇴",
    "coordinates": [
      45.7,
      4.74
    ],
    "funFacts": []
  },
  {
    "id": "404",
    "code": "KE",
    "code3": "KEN",
    "name": "Kenya",
    "capital": "Nairobi",
    "continent": "Afrique",
    "flag": "🇰🇪",
    "coordinates": [
      37.79,
      0.6
    ],
    "funFacts": []
  },
  {
    "id": "729",
    "code": "SD",
    "code3": "SDN",
    "name": "Soudan",
    "capital": "Khartoum",
    "continent": "Afrique",
    "flag": "🇸🇩",
    "coordinates": [
      29.83,
      15.97
    ],
    "funFacts": []
  },
  {
    "id": "148",
    "code": "TD",
    "code3": "TCD",
    "name": "Tchad",
    "capital": "N'Djaména",
    "continent": "Afrique",
    "flag": "🇹🇩",
    "coordinates": [
      18.57,
      15.28
    ],
    "funFacts": []
  },
  {
    "id": "332",
    "code": "HT",
    "code3": "HTI",
    "name": "Haïti",
    "capital": "Port-au-Prince",
    "continent": "Amérique du Nord",
    "flag": "🇭🇹",
    "coordinates": [
      -72.66,
      18.9
    ],
    "funFacts": []
  },
  {
    "id": "214",
    "code": "DO",
    "code3": "DOM",
    "name": "République Dominicaine",
    "capital": "Saint-Domingue",
    "continent": "Amérique du Nord",
    "flag": "🇩🇴",
    "coordinates": [
      -70.46,
      18.89
    ],
    "funFacts": []
  },
  {
    "id": "643",
    "code": "RU",
    "code3": "RUS",
    "name": "Russie",
    "capital": "Moscou",
    "continent": "Europe",
    "flag": "🇷🇺",
    "coordinates": [
      95.79,
      66.07
    ],
    "funFacts": []
  },
  {
    "id": "044",
    "code": "BS",
    "code3": "BHS",
    "name": "Bahamas",
    "capital": "Nassau",
    "continent": "Amérique du Nord",
    "flag": "🇧🇸",
    "coordinates": [
      -77.93,
      25.51
    ],
    "funFacts": []
  },
  {
    "id": "238",
    "code": "FK",
    "code3": "FLK",
    "name": "Îles Malouines",
    "capital": "Stanley",
    "continent": "Amérique du Sud",
    "flag": "🇫🇰",
    "coordinates": [
      -59.42,
      -51.72
    ],
    "funFacts": []
  },
  {
    "id": "578",
    "code": "NO",
    "code3": "NOR",
    "name": "Norvège",
    "capital": "Oslo",
    "continent": "Europe",
    "flag": "🇳🇴",
    "coordinates": [
      12.83,
      66.65
    ],
    "funFacts": []
  },
  {
    "id": "304",
    "code": "GL",
    "code3": "GRL",
    "name": "Groenland",
    "capital": "Nuuk",
    "continent": "Amérique du Nord",
    "flag": "🇬🇱",
    "coordinates": [
      -41.96,
      73.15
    ],
    "funFacts": []
  },
  {
    "id": "260",
    "code": "TF",
    "code3": "ATF",
    "name": "Terres australes françaises",
    "capital": "Territoires français du Sud",
    "continent": "Afrique",
    "flag": "🇹🇫",
    "coordinates": [
      69.53,
      -49.31
    ],
    "funFacts": []
  },
  {
    "id": "626",
    "code": "TL",
    "code3": "TLS",
    "name": "Timor-Leste",
    "capital": "Dili",
    "continent": "Asie",
    "flag": "🇹🇱",
    "coordinates": [
      125.97,
      -8.77
    ],
    "funFacts": []
  },
  {
    "id": "710",
    "code": "ZA",
    "code3": "ZAF",
    "name": "Afrique du Sud",
    "capital": "Pretoria / Le Cap",
    "continent": "Afrique",
    "flag": "🇿🇦",
    "coordinates": [
      25.16,
      -28.92
    ],
    "funFacts": []
  },
  {
    "id": "426",
    "code": "LS",
    "code3": "LSO",
    "name": "Lesotho",
    "capital": "Maseru",
    "continent": "Afrique",
    "flag": "🇱🇸",
    "coordinates": [
      28.17,
      -29.62
    ],
    "funFacts": []
  },
  {
    "id": "484",
    "code": "MX",
    "code3": "MEX",
    "name": "Mexique",
    "capital": "Mexico",
    "continent": "Amérique du Nord",
    "flag": "🇲🇽",
    "coordinates": [
      -102.22,
      23.91
    ],
    "funFacts": [
      "Mexico a été fondée sur l'ancien lac Texcoco et s'enfonce dans le sol meuble de 10 à 50 cm chaque année !",
      "Le chocolat a été créé par les Mayas et les Aztèques sous forme d'une boisson mousseuse sacrée parfumée au piment et à la vanille.",
      "La Grande Pyramide de Cholula est la pyramide au plus grand volume jamais édifiée sur Terre (4,45 millions de m³) !"
    ]
  },
  {
    "id": "858",
    "code": "UY",
    "code3": "URY",
    "name": "Uruguay",
    "capital": "Montevideo",
    "continent": "Amérique du Sud",
    "flag": "🇺🇾",
    "coordinates": [
      -56.01,
      -32.77
    ],
    "funFacts": []
  },
  {
    "id": "076",
    "code": "BR",
    "code3": "BRA",
    "name": "Brésil",
    "capital": "Brasilia",
    "continent": "Amérique du Sud",
    "flag": "🇧🇷",
    "coordinates": [
      -53.17,
      -10.66
    ],
    "funFacts": [
      "La forêt amazonienne brésilienne héberge environ 10% de toutes les espèces végétales et animales identifiées sur Terre !",
      "Brasilia, la capitale futuriste, a été bâtie en plein cœur du plateau central en seulement 41 mois et vue du ciel, elle a la silhouette d'un avion !",
      "Le Brésil est le seul pays du continent américain dont la langue officielle est le portugais."
    ]
  },
  {
    "id": "068",
    "code": "BO",
    "code3": "BOL",
    "name": "Bolivie",
    "capital": "Sucre / La Paz",
    "continent": "Amérique du Sud",
    "flag": "🇧🇴",
    "coordinates": [
      -64.65,
      -16.7
    ],
    "funFacts": []
  },
  {
    "id": "604",
    "code": "PE",
    "code3": "PER",
    "name": "Pérou",
    "capital": "Lima",
    "continent": "Amérique du Sud",
    "flag": "🇵🇪",
    "coordinates": [
      -74.43,
      -9.15
    ],
    "funFacts": []
  },
  {
    "id": "170",
    "code": "CO",
    "code3": "COL",
    "name": "Colombie",
    "capital": "Bogota",
    "continent": "Amérique du Sud",
    "flag": "🇨🇴",
    "coordinates": [
      -73.07,
      3.92
    ],
    "funFacts": []
  },
  {
    "id": "591",
    "code": "PA",
    "code3": "PAN",
    "name": "Panama",
    "capital": "Panama",
    "continent": "Amérique du Nord",
    "flag": "🇵🇦",
    "coordinates": [
      -80.11,
      8.53
    ],
    "funFacts": []
  },
  {
    "id": "188",
    "code": "CR",
    "code3": "CRI",
    "name": "Costa Rica",
    "capital": "San José",
    "continent": "Amérique du Nord",
    "flag": "🇨🇷",
    "coordinates": [
      -84.17,
      9.97
    ],
    "funFacts": []
  },
  {
    "id": "558",
    "code": "NI",
    "code3": "NIC",
    "name": "Nicaragua",
    "capital": "Managua",
    "continent": "Amérique du Nord",
    "flag": "🇳🇮",
    "coordinates": [
      -85.02,
      12.85
    ],
    "funFacts": []
  },
  {
    "id": "340",
    "code": "HN",
    "code3": "HND",
    "name": "Honduras",
    "capital": "Tegucigalpa",
    "continent": "Amérique du Nord",
    "flag": "🇭🇳",
    "coordinates": [
      -86.59,
      14.83
    ],
    "funFacts": []
  },
  {
    "id": "222",
    "code": "SV",
    "code3": "SLV",
    "name": "El Salvador",
    "capital": "San Salvador",
    "continent": "Amérique du Nord",
    "flag": "🇸🇻",
    "coordinates": [
      -88.87,
      13.73
    ],
    "funFacts": []
  },
  {
    "id": "320",
    "code": "GT",
    "code3": "GTM",
    "name": "Guatemala",
    "capital": "Guatemala",
    "continent": "Amérique du Nord",
    "flag": "🇬🇹",
    "coordinates": [
      -90.37,
      15.7
    ],
    "funFacts": []
  },
  {
    "id": "084",
    "code": "BZ",
    "code3": "BLZ",
    "name": "Belize",
    "capital": "Belmopan",
    "continent": "Amérique du Nord",
    "flag": "🇧🇿",
    "coordinates": [
      -88.7,
      17.19
    ],
    "funFacts": []
  },
  {
    "id": "862",
    "code": "VE",
    "code3": "VEN",
    "name": "Venezuela",
    "capital": "Caracas",
    "continent": "Amérique du Sud",
    "flag": "🇻🇪",
    "coordinates": [
      -66.15,
      7.16
    ],
    "funFacts": []
  },
  {
    "id": "328",
    "code": "GY",
    "code3": "GUY",
    "name": "Guyana",
    "capital": "Georgetown",
    "continent": "Amérique du Sud",
    "flag": "🇬🇾",
    "coordinates": [
      -58.97,
      4.79
    ],
    "funFacts": []
  },
  {
    "id": "740",
    "code": "SR",
    "code3": "SUR",
    "name": "Suriname",
    "capital": "Paramaribo",
    "continent": "Amérique du Sud",
    "flag": "🇸🇷",
    "coordinates": [
      -55.91,
      4.12
    ],
    "funFacts": []
  },
  {
    "id": "250",
    "code": "FR",
    "code3": "FRA",
    "name": "France",
    "capital": "Paris",
    "continent": "Europe",
    "flag": "🇫🇷",
    "coordinates": [
      -6.8,
      43.14
    ],
    "funFacts": [
      "Grâce à ses territoires d'outre-mer sur tous les océans, la France est le pays qui s'étend sur le plus grand nombre de fuseaux horaires au monde (12 au total) !",
      "On recense plus de 1 200 variétés différentes de fromages en France !",
      "Il faudrait environ 100 jours sans interruption pour admirer chaque œuvre du musée du Louvre pendant seulement 30 secondes !"
    ]
  },
  {
    "id": "218",
    "code": "EC",
    "code3": "ECU",
    "name": "Équateur",
    "capital": "Quito",
    "continent": "Amérique du Sud",
    "flag": "🇪🇨",
    "coordinates": [
      -78.38,
      -1.45
    ],
    "funFacts": []
  },
  {
    "id": "630",
    "code": "PR",
    "code3": "PRI",
    "name": "Porto Rico",
    "capital": "San Juan",
    "continent": "Amérique du Nord",
    "flag": "🇵🇷",
    "coordinates": [
      -66.48,
      18.24
    ],
    "funFacts": []
  },
  {
    "id": "388",
    "code": "JM",
    "code3": "JAM",
    "name": "Jamaïque",
    "capital": "Kingston",
    "continent": "Amérique du Nord",
    "flag": "🇯🇲",
    "coordinates": [
      -77.32,
      18.14
    ],
    "funFacts": []
  },
  {
    "id": "192",
    "code": "CU",
    "code3": "CUB",
    "name": "Cuba",
    "capital": "La Havane",
    "continent": "Amérique du Nord",
    "flag": "🇨🇺",
    "coordinates": [
      -78.93,
      21.65
    ],
    "funFacts": []
  },
  {
    "id": "716",
    "code": "ZW",
    "code3": "ZWE",
    "name": "Zimbabwe",
    "capital": "Harare",
    "continent": "Afrique",
    "flag": "🇿🇼",
    "coordinates": [
      29.79,
      -18.9
    ],
    "funFacts": []
  },
  {
    "id": "072",
    "code": "BW",
    "code3": "BWA",
    "name": "Botswana",
    "capital": "Gaborone",
    "continent": "Afrique",
    "flag": "🇧🇼",
    "coordinates": [
      23.78,
      -22.08
    ],
    "funFacts": []
  },
  {
    "id": "516",
    "code": "NA",
    "code3": "NAM",
    "name": "Namibie",
    "capital": "Windhoek",
    "continent": "Afrique",
    "flag": "🇳🇦",
    "coordinates": [
      17.14,
      -22.04
    ],
    "funFacts": []
  },
  {
    "id": "686",
    "code": "SN",
    "code3": "SEN",
    "name": "Sénégal",
    "capital": "Dakar",
    "continent": "Afrique",
    "flag": "🇸🇳",
    "coordinates": [
      -14.51,
      14.35
    ],
    "funFacts": []
  },
  {
    "id": "466",
    "code": "ML",
    "code3": "MLI",
    "name": "Mali",
    "capital": "Bamako",
    "continent": "Afrique",
    "flag": "🇲🇱",
    "coordinates": [
      -3.59,
      17.24
    ],
    "funFacts": []
  },
  {
    "id": "478",
    "code": "MR",
    "code3": "MRT",
    "name": "Mauritanie",
    "capital": "Nouakchott",
    "continent": "Afrique",
    "flag": "🇲🇷",
    "coordinates": [
      -10.35,
      20.18
    ],
    "funFacts": []
  },
  {
    "id": "204",
    "code": "BJ",
    "code3": "BEN",
    "name": "Bénin",
    "capital": "Porto-Novo",
    "continent": "Afrique",
    "flag": "🇧🇯",
    "coordinates": [
      2.34,
      9.64
    ],
    "funFacts": []
  },
  {
    "id": "562",
    "code": "NE",
    "code3": "NER",
    "name": "Niger",
    "capital": "Niamey",
    "continent": "Afrique",
    "flag": "🇳🇪",
    "coordinates": [
      9.27,
      17.34
    ],
    "funFacts": []
  },
  {
    "id": "566",
    "code": "NG",
    "code3": "NGA",
    "name": "Nigéria",
    "capital": "Abuja",
    "continent": "Afrique",
    "flag": "🇳🇬",
    "coordinates": [
      7.99,
      9.54
    ],
    "funFacts": []
  },
  {
    "id": "120",
    "code": "CM",
    "code3": "CMR",
    "name": "Cameroun",
    "capital": "Yaoundé",
    "continent": "Afrique",
    "flag": "🇨🇲",
    "coordinates": [
      12.61,
      5.65
    ],
    "funFacts": []
  },
  {
    "id": "768",
    "code": "TG",
    "code3": "TGO",
    "name": "Togo",
    "capital": "Lomé",
    "continent": "Afrique",
    "flag": "🇹🇬",
    "coordinates": [
      1,
      8.43
    ],
    "funFacts": []
  },
  {
    "id": "288",
    "code": "GH",
    "code3": "GHA",
    "name": "Ghana",
    "capital": "Accra",
    "continent": "Afrique",
    "flag": "🇬🇭",
    "coordinates": [
      -1.24,
      7.92
    ],
    "funFacts": []
  },
  {
    "id": "384",
    "code": "CI",
    "code3": "CIV",
    "name": "Côte-d'Ivoire",
    "capital": "Yamoussoukro",
    "continent": "Afrique",
    "flag": "🇨🇮",
    "coordinates": [
      -5.61,
      7.55
    ],
    "funFacts": []
  },
  {
    "id": "324",
    "code": "GN",
    "code3": "GIN",
    "name": "Guinée",
    "capital": "Conakry",
    "continent": "Afrique",
    "flag": "🇬🇳",
    "coordinates": [
      -11.06,
      10.45
    ],
    "funFacts": []
  },
  {
    "id": "624",
    "code": "GW",
    "code3": "GNB",
    "name": "Guinée-Bissau",
    "capital": "Bissau",
    "continent": "Afrique",
    "flag": "🇬🇼",
    "coordinates": [
      -15.11,
      12.02
    ],
    "funFacts": []
  },
  {
    "id": "430",
    "code": "LR",
    "code3": "LBR",
    "name": "Libéria",
    "capital": "Monrovia",
    "continent": "Afrique",
    "flag": "🇱🇷",
    "coordinates": [
      -9.41,
      6.43
    ],
    "funFacts": []
  },
  {
    "id": "694",
    "code": "SL",
    "code3": "SLE",
    "name": "Sierra Leone",
    "capital": "Freetown",
    "continent": "Afrique",
    "flag": "🇸🇱",
    "coordinates": [
      -11.8,
      8.53
    ],
    "funFacts": []
  },
  {
    "id": "854",
    "code": "BF",
    "code3": "BFA",
    "name": "Burkina Faso",
    "capital": "Ouagadougou",
    "continent": "Afrique",
    "flag": "🇧🇫",
    "coordinates": [
      -1.78,
      12.31
    ],
    "funFacts": []
  },
  {
    "id": "140",
    "code": "CF",
    "code3": "CAF",
    "name": "République Centrafricaine",
    "capital": "Bangui",
    "continent": "Afrique",
    "flag": "🇨🇫",
    "coordinates": [
      20.37,
      6.55
    ],
    "funFacts": []
  },
  {
    "id": "178",
    "code": "CG",
    "code3": "COG",
    "name": "République du Congo",
    "capital": "Brazzaville",
    "continent": "Afrique",
    "flag": "🇨🇬",
    "coordinates": [
      15.14,
      -0.84
    ],
    "funFacts": []
  },
  {
    "id": "266",
    "code": "GA",
    "code3": "GAB",
    "name": "Gabon",
    "capital": "Libreville",
    "continent": "Afrique",
    "flag": "🇬🇦",
    "coordinates": [
      11.69,
      -0.65
    ],
    "funFacts": []
  },
  {
    "id": "226",
    "code": "GQ",
    "code3": "GNQ",
    "name": "Guinée équatoriale",
    "capital": "Malabo",
    "continent": "Afrique",
    "flag": "🇬🇶",
    "coordinates": [
      10.37,
      1.65
    ],
    "funFacts": []
  },
  {
    "id": "894",
    "code": "ZM",
    "code3": "ZMB",
    "name": "Zambie",
    "capital": "Lusaka",
    "continent": "Afrique",
    "flag": "🇿🇲",
    "coordinates": [
      27.76,
      -13.39
    ],
    "funFacts": []
  },
  {
    "id": "454",
    "code": "MW",
    "code3": "MWI",
    "name": "Malawi",
    "capital": "Lilongwe",
    "continent": "Afrique",
    "flag": "🇲🇼",
    "coordinates": [
      34.19,
      -13.16
    ],
    "funFacts": []
  },
  {
    "id": "508",
    "code": "MZ",
    "code3": "MOZ",
    "name": "Mozambique",
    "capital": "Maputo",
    "continent": "Afrique",
    "flag": "🇲🇿",
    "coordinates": [
      35.54,
      -17.15
    ],
    "funFacts": []
  },
  {
    "id": "748",
    "code": "SZ",
    "code3": "SWZ",
    "name": "Royaume d'Eswatini",
    "capital": "Mbabane / Lobamba",
    "continent": "Afrique",
    "flag": "🇸🇿",
    "coordinates": [
      31.4,
      -26.49
    ],
    "funFacts": []
  },
  {
    "id": "024",
    "code": "AO",
    "code3": "AGO",
    "name": "Angola",
    "capital": "Luanda",
    "continent": "Afrique",
    "flag": "🇦🇴",
    "coordinates": [
      17.47,
      -12.23
    ],
    "funFacts": []
  },
  {
    "id": "108",
    "code": "BI",
    "code3": "BDI",
    "name": "Burundi",
    "capital": "Gitega",
    "continent": "Afrique",
    "flag": "🇧🇮",
    "coordinates": [
      29.91,
      -3.38
    ],
    "funFacts": []
  },
  {
    "id": "376",
    "code": "IL",
    "code3": "ISR",
    "name": "Israël",
    "capital": "Tel Aviv / Jérusalem",
    "continent": "Asie",
    "flag": "🇮🇱",
    "coordinates": [
      35,
      31.48
    ],
    "funFacts": []
  },
  {
    "id": "422",
    "code": "LB",
    "code3": "LBN",
    "name": "Liban",
    "capital": "Beyrouth",
    "continent": "Asie",
    "flag": "🇱🇧",
    "coordinates": [
      35.87,
      33.91
    ],
    "funFacts": []
  },
  {
    "id": "450",
    "code": "MG",
    "code3": "MDG",
    "name": "Madagascar",
    "capital": "Antananarivo",
    "continent": "Afrique",
    "flag": "🇲🇬",
    "coordinates": [
      46.73,
      -19.3
    ],
    "funFacts": []
  },
  {
    "id": "275",
    "code": "PS",
    "code3": "PSE",
    "name": "Palestine",
    "capital": "Jérusalem-Est / Ramallah",
    "continent": "Asie",
    "flag": "🇵🇸",
    "coordinates": [
      35.27,
      31.94
    ],
    "funFacts": [
      "L'olivier d'Al-Walaja près de Bethléem a plus de 4 000 ans : il produisait déjà des olives du temps des pharaons !",
      "L'art du 'Tatreez' (broderie palestinienne traditionnelle) est inscrit au patrimoine immatériel de l'UNESCO : chaque motif raconte l'histoire d'un village.",
      "Jéricho est reconnue comme l'une des cités les plus anciennes continuellement habitées au monde, avec plus de 10 000 ans d'histoire !"
    ]
  },
  {
    "id": "270",
    "code": "GM",
    "code3": "GMB",
    "name": "Gambie",
    "capital": "Banjul",
    "continent": "Afrique",
    "flag": "🇬🇲",
    "coordinates": [
      -15.43,
      13.48
    ],
    "funFacts": []
  },
  {
    "id": "788",
    "code": "TN",
    "code3": "TUN",
    "name": "Tunisie",
    "capital": "Tunis",
    "continent": "Afrique",
    "flag": "🇹🇳",
    "coordinates": [
      9.54,
      34.14
    ],
    "funFacts": []
  },
  {
    "id": "012",
    "code": "DZ",
    "code3": "DZA",
    "name": "Algérie",
    "capital": "Alger",
    "continent": "Afrique",
    "flag": "🇩🇿",
    "coordinates": [
      2.61,
      28.09
    ],
    "funFacts": []
  },
  {
    "id": "400",
    "code": "JO",
    "code3": "JOR",
    "name": "Jordanie",
    "capital": "Amman",
    "continent": "Asie",
    "flag": "🇯🇴",
    "coordinates": [
      36.77,
      31.24
    ],
    "funFacts": []
  },
  {
    "id": "784",
    "code": "AE",
    "code3": "ARE",
    "name": "Émirats Arabes Unis",
    "capital": "Abou Dabi",
    "continent": "Asie",
    "flag": "🇦🇪",
    "coordinates": [
      54.2,
      23.87
    ],
    "funFacts": []
  },
  {
    "id": "634",
    "code": "QA",
    "code3": "QAT",
    "name": "Qatar",
    "capital": "Doha",
    "continent": "Asie",
    "flag": "🇶🇦",
    "coordinates": [
      51.18,
      25.32
    ],
    "funFacts": []
  },
  {
    "id": "414",
    "code": "KW",
    "code3": "KWT",
    "name": "Koweït",
    "capital": "Koweït",
    "continent": "Asie",
    "flag": "🇰🇼",
    "coordinates": [
      47.6,
      29.31
    ],
    "funFacts": []
  },
  {
    "id": "368",
    "code": "IQ",
    "code3": "IRQ",
    "name": "Irak",
    "capital": "Bagdad",
    "continent": "Asie",
    "flag": "🇮🇶",
    "coordinates": [
      43.79,
      33.01
    ],
    "funFacts": []
  },
  {
    "id": "512",
    "code": "OM",
    "code3": "OMN",
    "name": "Oman",
    "capital": "Mascate",
    "continent": "Asie",
    "flag": "🇴🇲",
    "coordinates": [
      56.07,
      20.59
    ],
    "funFacts": []
  },
  {
    "id": "548",
    "code": "VU",
    "code3": "VUT",
    "name": "Vanuatu",
    "capital": "Port-Vila",
    "continent": "Océanie",
    "flag": "🇻🇺",
    "coordinates": [
      167.07,
      -15.54
    ],
    "funFacts": []
  },
  {
    "id": "116",
    "code": "KH",
    "code3": "KHM",
    "name": "Cambodge",
    "capital": "Phnom Penh",
    "continent": "Asie",
    "flag": "🇰🇭",
    "coordinates": [
      104.87,
      12.68
    ],
    "funFacts": []
  },
  {
    "id": "764",
    "code": "TH",
    "code3": "THA",
    "name": "Thaïlande",
    "capital": "Bangkok",
    "continent": "Asie",
    "flag": "🇹🇭",
    "coordinates": [
      101,
      14.98
    ],
    "funFacts": []
  },
  {
    "id": "418",
    "code": "LA",
    "code3": "LAO",
    "name": "Laos",
    "capital": "Vientiane",
    "continent": "Asie",
    "flag": "🇱🇦",
    "coordinates": [
      103.79,
      18.43
    ],
    "funFacts": []
  },
  {
    "id": "104",
    "code": "MM",
    "code3": "MMR",
    "name": "Myanmar",
    "capital": "Rangoun / Naypyidaw",
    "continent": "Asie",
    "flag": "🇲🇲",
    "coordinates": [
      96.51,
      20.94
    ],
    "funFacts": []
  },
  {
    "id": "704",
    "code": "VN",
    "code3": "VNM",
    "name": "Vietnam",
    "capital": "Hanoï",
    "continent": "Asie",
    "flag": "🇻🇳",
    "coordinates": [
      106.33,
      16.56
    ],
    "funFacts": []
  },
  {
    "id": "408",
    "code": "KP",
    "code3": "PRK",
    "name": "Corée du Nord",
    "capital": "Pyongyang",
    "continent": "Asie",
    "flag": "🇰🇵",
    "coordinates": [
      127.13,
      40.13
    ],
    "funFacts": []
  },
  {
    "id": "410",
    "code": "KR",
    "code3": "KOR",
    "name": "Corée du Sud",
    "capital": "Séoul",
    "continent": "Asie",
    "flag": "🇰🇷",
    "coordinates": [
      127.82,
      36.42
    ],
    "funFacts": []
  },
  {
    "id": "496",
    "code": "MN",
    "code3": "MNG",
    "name": "Mongolie",
    "capital": "Oulan-Bator",
    "continent": "Asie",
    "flag": "🇲🇳",
    "coordinates": [
      103.02,
      46.95
    ],
    "funFacts": []
  },
  {
    "id": "356",
    "code": "IN",
    "code3": "IND",
    "name": "Inde",
    "capital": "New Delhi",
    "continent": "Asie",
    "flag": "🇮🇳",
    "coordinates": [
      79.54,
      22.82
    ],
    "funFacts": []
  },
  {
    "id": "050",
    "code": "BD",
    "code3": "BGD",
    "name": "Bangladesh",
    "capital": "Dacca",
    "continent": "Asie",
    "flag": "🇧🇩",
    "coordinates": [
      90.28,
      23.83
    ],
    "funFacts": []
  },
  {
    "id": "064",
    "code": "BT",
    "code3": "BTN",
    "name": "Bhoutan",
    "capital": "Thimphou",
    "continent": "Asie",
    "flag": "🇧🇹",
    "coordinates": [
      90.47,
      27.43
    ],
    "funFacts": []
  },
  {
    "id": "524",
    "code": "NP",
    "code3": "NPL",
    "name": "Népal",
    "capital": "Katmandou",
    "continent": "Asie",
    "flag": "🇳🇵",
    "coordinates": [
      84.04,
      28.25
    ],
    "funFacts": []
  },
  {
    "id": "586",
    "code": "PK",
    "code3": "PAK",
    "name": "Pakistan",
    "capital": "Islamabad",
    "continent": "Asie",
    "flag": "🇵🇰",
    "coordinates": [
      69.23,
      29.91
    ],
    "funFacts": []
  },
  {
    "id": "004",
    "code": "AF",
    "code3": "AFG",
    "name": "Afghanistan",
    "capital": "Kaboul",
    "continent": "Asie",
    "flag": "🇦🇫",
    "coordinates": [
      66,
      33.84
    ],
    "funFacts": []
  },
  {
    "id": "762",
    "code": "TJ",
    "code3": "TJK",
    "name": "Tadjikistan",
    "capital": "Tachkent",
    "continent": "Asie",
    "flag": "🇹🇯",
    "coordinates": [
      71.05,
      38.59
    ],
    "funFacts": []
  },
  {
    "id": "417",
    "code": "KG",
    "code3": "KGZ",
    "name": "Kirghizistan",
    "capital": "Bichkek",
    "continent": "Asie",
    "flag": "🇰🇬",
    "coordinates": [
      74.59,
      41.52
    ],
    "funFacts": []
  },
  {
    "id": "795",
    "code": "TM",
    "code3": "TKM",
    "name": "Turkménistan",
    "capital": "Achgabat",
    "continent": "Asie",
    "flag": "🇹🇲",
    "coordinates": [
      59.35,
      39.1
    ],
    "funFacts": []
  },
  {
    "id": "364",
    "code": "IR",
    "code3": "IRN",
    "name": "Iran",
    "capital": "Téhéran",
    "continent": "Asie",
    "flag": "🇮🇷",
    "coordinates": [
      54.45,
      32.47
    ],
    "funFacts": []
  },
  {
    "id": "760",
    "code": "SY",
    "code3": "SYR",
    "name": "Syrie",
    "capital": "Damas",
    "continent": "Asie",
    "flag": "🇸🇾",
    "coordinates": [
      38.52,
      35.01
    ],
    "funFacts": []
  },
  {
    "id": "051",
    "code": "AM",
    "code3": "ARM",
    "name": "Arménie",
    "capital": "Erevan",
    "continent": "Asie",
    "flag": "🇦🇲",
    "coordinates": [
      45.01,
      40.21
    ],
    "funFacts": []
  },
  {
    "id": "752",
    "code": "SE",
    "code3": "SWE",
    "name": "Suède",
    "capital": "Stockholm",
    "continent": "Europe",
    "flag": "🇸🇪",
    "coordinates": [
      16.11,
      62.42
    ],
    "funFacts": []
  },
  {
    "id": "112",
    "code": "BY",
    "code3": "BLR",
    "name": "Biélorussie",
    "capital": "Minsk",
    "continent": "Europe",
    "flag": "🇧🇾",
    "coordinates": [
      27.96,
      53.5
    ],
    "funFacts": []
  },
  {
    "id": "804",
    "code": "UA",
    "code3": "UKR",
    "name": "Ukraine",
    "capital": "Kyiv",
    "continent": "Europe",
    "flag": "🇺🇦",
    "coordinates": [
      31.29,
      49.19
    ],
    "funFacts": []
  },
  {
    "id": "616",
    "code": "PL",
    "code3": "POL",
    "name": "Pologne",
    "capital": "Varsovie",
    "continent": "Europe",
    "flag": "🇵🇱",
    "coordinates": [
      19.34,
      52.13
    ],
    "funFacts": []
  },
  {
    "id": "040",
    "code": "AT",
    "code3": "AUT",
    "name": "Autriche",
    "capital": "Vienne",
    "continent": "Europe",
    "flag": "🇦🇹",
    "coordinates": [
      14.06,
      47.62
    ],
    "funFacts": []
  },
  {
    "id": "348",
    "code": "HU",
    "code3": "HUN",
    "name": "Hongrie",
    "capital": "Budapest",
    "continent": "Europe",
    "flag": "🇭🇺",
    "coordinates": [
      19.34,
      47.2
    ],
    "funFacts": []
  },
  {
    "id": "498",
    "code": "MD",
    "code3": "MDA",
    "name": "Moldavie",
    "capital": "Chisinau",
    "continent": "Europe",
    "flag": "🇲🇩",
    "coordinates": [
      28.42,
      47.2
    ],
    "funFacts": []
  },
  {
    "id": "642",
    "code": "RO",
    "code3": "ROU",
    "name": "Roumanie",
    "capital": "Bucarest",
    "continent": "Europe",
    "flag": "🇷🇴",
    "coordinates": [
      24.95,
      45.85
    ],
    "funFacts": []
  },
  {
    "id": "440",
    "code": "LT",
    "code3": "LTU",
    "name": "Lituanie",
    "capital": "Vilnius",
    "continent": "Europe",
    "flag": "🇱🇹",
    "coordinates": [
      23.89,
      55.28
    ],
    "funFacts": []
  },
  {
    "id": "428",
    "code": "LV",
    "code3": "LVA",
    "name": "Lettonie",
    "capital": "Riga",
    "continent": "Europe",
    "flag": "🇱🇻",
    "coordinates": [
      24.84,
      56.82
    ],
    "funFacts": []
  },
  {
    "id": "233",
    "code": "EE",
    "code3": "EST",
    "name": "Estonie",
    "capital": "Tallinn",
    "continent": "Europe",
    "flag": "🇪🇪",
    "coordinates": [
      25.83,
      58.64
    ],
    "funFacts": []
  },
  {
    "id": "276",
    "code": "DE",
    "code3": "DEU",
    "name": "Allemagne",
    "capital": "Berlin",
    "continent": "Europe",
    "flag": "🇩🇪",
    "coordinates": [
      10.27,
      51.08
    ],
    "funFacts": [
      "Il existe plus de 1 000 sortes de saucisses et 3 000 variétés de pains traditionnels répertoriés en Allemagne !",
      "Berlin possède plus de ponts que la ville de Venise (environ 1 700 ponts à Berlin contre 400 à Venise) !",
      "Environ 65% du réseau autoroutier allemand (Autobahn) ne possède pas de limitation de vitesse légale obligatoire !"
    ]
  },
  {
    "id": "100",
    "code": "BG",
    "code3": "BGR",
    "name": "Bulgarie",
    "capital": "Sofia",
    "continent": "Europe",
    "flag": "🇧🇬",
    "coordinates": [
      25.19,
      42.76
    ],
    "funFacts": []
  },
  {
    "id": "300",
    "code": "GR",
    "code3": "GRC",
    "name": "Grèce",
    "capital": "Athènes",
    "continent": "Europe",
    "flag": "🇬🇷",
    "coordinates": [
      22.72,
      39.04
    ],
    "funFacts": []
  },
  {
    "id": "792",
    "code": "TR",
    "code3": "TUR",
    "name": "Turquie",
    "capital": "Ankara",
    "continent": "Asie",
    "flag": "🇹🇷",
    "coordinates": [
      35.12,
      39.15
    ],
    "funFacts": []
  },
  {
    "id": "008",
    "code": "AL",
    "code3": "ALB",
    "name": "Albanie",
    "capital": "Tirana",
    "continent": "Europe",
    "flag": "🇦🇱",
    "coordinates": [
      20.03,
      41.13
    ],
    "funFacts": []
  },
  {
    "id": "191",
    "code": "HR",
    "code3": "HRV",
    "name": "Croatie",
    "capital": "Zagreb",
    "continent": "Europe",
    "flag": "🇭🇷",
    "coordinates": [
      16.57,
      45.01
    ],
    "funFacts": []
  },
  {
    "id": "756",
    "code": "CH",
    "code3": "CHE",
    "name": "Suisse",
    "capital": "Berne",
    "continent": "Europe",
    "flag": "🇨🇭",
    "coordinates": [
      8.12,
      46.79
    ],
    "funFacts": []
  },
  {
    "id": "442",
    "code": "LU",
    "code3": "LUX",
    "name": "Luxembourg",
    "capital": "Luxembourg",
    "continent": "Europe",
    "flag": "🇱🇺",
    "coordinates": [
      5.97,
      49.76
    ],
    "funFacts": []
  },
  {
    "id": "056",
    "code": "BE",
    "code3": "BEL",
    "name": "Belgique",
    "capital": "Bruxelles",
    "continent": "Europe",
    "flag": "🇧🇪",
    "coordinates": [
      4.59,
      50.65
    ],
    "funFacts": []
  },
  {
    "id": "528",
    "code": "NL",
    "code3": "NLD",
    "name": "Pays-Bas",
    "capital": "Amsterdam",
    "continent": "Europe",
    "flag": "🇳🇱",
    "coordinates": [
      5.5,
      52.29
    ],
    "funFacts": []
  },
  {
    "id": "620",
    "code": "PT",
    "code3": "PRT",
    "name": "Portugal",
    "capital": "Lisbonne",
    "continent": "Europe",
    "flag": "🇵🇹",
    "coordinates": [
      -8.06,
      39.61
    ],
    "funFacts": []
  },
  {
    "id": "724",
    "code": "ES",
    "code3": "ESP",
    "name": "Espagne",
    "capital": "Madrid",
    "continent": "Europe",
    "flag": "🇪🇸",
    "coordinates": [
      -3.62,
      40.32
    ],
    "funFacts": [
      "L'hymne national espagnol (la Marcha Real) est l'un des rarissimes hymnes au monde sans aucune parole officielle !",
      "La Sagrada Família à Barcelone est en chantier depuis 1882, soit plus longtemps que la construction des grandes pyramides d'Égypte !",
      "Chaque été à Buñol a lieu 'La Tomatina', une immense fête populaire où plus de 100 tonnes de tomates bien mûres sont projetées en bataille !"
    ]
  },
  {
    "id": "372",
    "code": "IE",
    "code3": "IRL",
    "name": "Irlande",
    "capital": "Dublin",
    "continent": "Europe",
    "flag": "🇮🇪",
    "coordinates": [
      -8.02,
      53.17
    ],
    "funFacts": []
  },
  {
    "id": "540",
    "code": "NC",
    "code3": "NCL",
    "name": "Nouvelle-Calédonie",
    "capital": "Nouméa",
    "continent": "Océanie",
    "flag": "🇳🇨",
    "coordinates": [
      165.53,
      -21.26
    ],
    "funFacts": []
  },
  {
    "id": "090",
    "code": "SB",
    "code3": "SLB",
    "name": "Îles Salomon",
    "capital": "Honiara",
    "continent": "Océanie",
    "flag": "🇸🇧",
    "coordinates": [
      159.96,
      -8.85
    ],
    "funFacts": []
  },
  {
    "id": "554",
    "code": "NZ",
    "code3": "NZL",
    "name": "Nouvelle-Zélande",
    "capital": "Wellington",
    "continent": "Océanie",
    "flag": "🇳🇿",
    "coordinates": [
      172.95,
      -41.55
    ],
    "funFacts": []
  },
  {
    "id": "036",
    "code": "AU",
    "code3": "AUS",
    "name": "Australie",
    "capital": "Canberra",
    "continent": "Océanie",
    "flag": "🇦🇺",
    "coordinates": [
      134.31,
      -25.76
    ],
    "funFacts": [
      "L'Australie compte environ 50 millions de kangourous, soit le double de sa population humaine !",
      "La Grande Barrière de Corail est la plus grande structure vivante de la planète et peut être aperçue depuis l'orbite spatiale !",
      "L'ornithorynque et l'échidné sont les deux seuls mammifères au monde qui pondent des œufs au lieu de mettre bas."
    ]
  },
  {
    "id": "144",
    "code": "LK",
    "code3": "LKA",
    "name": "Sri Lanka",
    "capital": "Sri Jayawardenepura Kotte / Colombo",
    "continent": "Asie",
    "flag": "🇱🇰",
    "coordinates": [
      80.67,
      7.7
    ],
    "funFacts": []
  },
  {
    "id": "156",
    "code": "CN",
    "code3": "CHN",
    "name": "Chine",
    "capital": "Pékin",
    "continent": "Asie",
    "flag": "🇨🇳",
    "coordinates": [
      103.45,
      36.68
    ],
    "funFacts": []
  },
  {
    "id": "158",
    "code": "TW",
    "code3": "TWN",
    "name": "Taïwan",
    "capital": "Taipei",
    "continent": "Asie",
    "flag": "🇹🇼",
    "coordinates": [
      120.97,
      23.74
    ],
    "funFacts": [
      "Taïwan est la patrie du célèbre Bubble Tea (thé aux perles de tapioca), inventé à Taichung dans les années 1980 !",
      "Les camions de ramassage des ordures à Taïwan diffusent 'La Lettre à Élise' de Beethoven pour avertir les habitants de descendre en musique !",
      "La tour Taipei 101 possède une gigantesque sphère dorée de 660 tonnes suspendue au 87e étage pour stabiliser la tour contre les séismes et typhons !"
    ]
  },
  {
    "id": "380",
    "code": "IT",
    "code3": "ITA",
    "name": "Italie",
    "capital": "Rome",
    "continent": "Europe",
    "flag": "🇮🇹",
    "coordinates": [
      12.27,
      42.67
    ],
    "funFacts": [
      "L'Italie compte le plus grand nombre de sites classés au patrimoine mondial de l'UNESCO sur Terre (près de 60 sites) !",
      "Chaque jour, environ 3 000 euros en pièces de monnaie sont jetés dans la Fontaine de Trevi à Rome (reversés aux banques alimentaires) !",
      "L'Italie encercle complètement deux micro-États souverains : la Cité du Vatican et la République de Saint-Marin !"
    ]
  },
  {
    "id": "208",
    "code": "DK",
    "code3": "DNK",
    "name": "Danemark",
    "capital": "Copenhague",
    "continent": "Europe",
    "flag": "🇩🇰",
    "coordinates": [
      9.89,
      56.06
    ],
    "funFacts": []
  },
  {
    "id": "826",
    "code": "GB",
    "code3": "GBR",
    "name": "Royaume-Uni",
    "capital": "Londres",
    "continent": "Europe",
    "flag": "🇬🇧",
    "coordinates": [
      -2.76,
      53.81
    ],
    "funFacts": [
      "Big Ben ne désigne pas la tour ni l'horloge du Parlement, mais la cloche géante de 13,7 tonnes suspendue à l'intérieur !",
      "Les Britanniques boivent environ 100 millions de tasses de thé par jour, soit près de 36 milliards de tasses chaque année !",
      "Le monarque régnant est la seule personne du pays légalement dispensée d'avoir un permis pour conduire !"
    ]
  },
  {
    "id": "352",
    "code": "IS",
    "code3": "ISL",
    "name": "Islande",
    "capital": "Reykjavik",
    "continent": "Europe",
    "flag": "🇮🇸",
    "coordinates": [
      -18.77,
      65.08
    ],
    "funFacts": []
  },
  {
    "id": "031",
    "code": "AZ",
    "code3": "AZE",
    "name": "Azerbaïdjan",
    "capital": "Bakou",
    "continent": "Asie",
    "flag": "🇦🇿",
    "coordinates": [
      47.56,
      40.22
    ],
    "funFacts": []
  },
  {
    "id": "268",
    "code": "GE",
    "code3": "GEO",
    "name": "Géorgie",
    "capital": "Tbilissi",
    "continent": "Asie",
    "flag": "🇬🇪",
    "coordinates": [
      43.5,
      42.17
    ],
    "funFacts": []
  },
  {
    "id": "608",
    "code": "PH",
    "code3": "PHL",
    "name": "Philippines",
    "capital": "Manille",
    "continent": "Asie",
    "flag": "🇵🇭",
    "coordinates": [
      122.94,
      11.72
    ],
    "funFacts": []
  },
  {
    "id": "458",
    "code": "MY",
    "code3": "MYS",
    "name": "Malaisie",
    "capital": "Kuala Lumpur",
    "continent": "Asie",
    "flag": "🇲🇾",
    "coordinates": [
      109.7,
      3.75
    ],
    "funFacts": []
  },
  {
    "id": "096",
    "code": "BN",
    "code3": "BRN",
    "name": "Brunei Darussalam",
    "capital": "Bandar Seri Begawan",
    "continent": "Asie",
    "flag": "🇧🇳",
    "coordinates": [
      114.92,
      4.69
    ],
    "funFacts": []
  },
  {
    "id": "705",
    "code": "SI",
    "code3": "SVN",
    "name": "Slovénie",
    "capital": "Ljubljana",
    "continent": "Europe",
    "flag": "🇸🇮",
    "coordinates": [
      14.93,
      46.13
    ],
    "funFacts": []
  },
  {
    "id": "246",
    "code": "FI",
    "code3": "FIN",
    "name": "Finlande",
    "capital": "Helsinki",
    "continent": "Europe",
    "flag": "🇫🇮",
    "coordinates": [
      26.14,
      64.26
    ],
    "funFacts": []
  },
  {
    "id": "703",
    "code": "SK",
    "code3": "SVK",
    "name": "Slovaquie",
    "capital": "Bratislava",
    "continent": "Europe",
    "flag": "🇸🇰",
    "coordinates": [
      19.5,
      48.73
    ],
    "funFacts": []
  },
  {
    "id": "203",
    "code": "CZ",
    "code3": "CZE",
    "name": "République Tchèque",
    "capital": "Prague",
    "continent": "Europe",
    "flag": "🇨🇿",
    "coordinates": [
      15.34,
      49.78
    ],
    "funFacts": []
  },
  {
    "id": "232",
    "code": "ER",
    "code3": "ERI",
    "name": "Érythrée",
    "capital": "Asmara",
    "continent": "Afrique",
    "flag": "🇪🇷",
    "coordinates": [
      38.69,
      15.43
    ],
    "funFacts": []
  },
  {
    "id": "392",
    "code": "JP",
    "code3": "JPN",
    "name": "Japon",
    "capital": "Tokyo",
    "continent": "Asie",
    "flag": "🇯🇵",
    "coordinates": [
      137.71,
      37.54
    ],
    "funFacts": [
      "Il y a plus de 5 millions de distributeurs automatiques au Japon, proposant du café fumant, des glaces, des parapluies ou des soupes chaudes !",
      "Les trains Shinkansen affichent un retard annuel moyen de moins d'une minute par trajet.",
      "Le Japon abrite des îles entières où les animaux règnent en maîtres : l'île aux lapins (Ōkunoshima) et plusieurs îles aux chats (comme Aoshima) !"
    ]
  },
  {
    "id": "600",
    "code": "PY",
    "code3": "PRY",
    "name": "Paraguay",
    "capital": "Asunción",
    "continent": "Amérique du Sud",
    "flag": "🇵🇾",
    "coordinates": [
      -58.43,
      -23.23
    ],
    "funFacts": []
  },
  {
    "id": "887",
    "code": "YE",
    "code3": "YEM",
    "name": "Yémen",
    "capital": "Sanaa",
    "continent": "Asie",
    "flag": "🇾🇪",
    "coordinates": [
      47.52,
      15.92
    ],
    "funFacts": []
  },
  {
    "id": "682",
    "code": "SA",
    "code3": "SAU",
    "name": "Arabie Saoudite",
    "capital": "Riyad",
    "continent": "Asie",
    "flag": "🇸🇦",
    "coordinates": [
      44.64,
      24.09
    ],
    "funFacts": []
  },
  {
    "id": "010",
    "code": "AQ",
    "code3": "ATA",
    "name": "Antarctique",
    "capital": "—",
    "continent": "Océanie",
    "flag": "🇦🇶",
    "coordinates": [
      82.51,
      -84.97
    ],
    "funFacts": []
  },
  {
    "id": "196",
    "code": "CY",
    "code3": "CYP",
    "name": "Chypre",
    "capital": "Nicosie",
    "continent": "Europe",
    "flag": "🇨🇾",
    "coordinates": [
      33.04,
      34.91
    ],
    "funFacts": []
  },
  {
    "id": "504",
    "code": "MA",
    "code3": "MAR",
    "name": "Maroc",
    "capital": "Rabat",
    "continent": "Afrique",
    "flag": "🇲🇦",
    "coordinates": [
      -8.69,
      29.82
    ],
    "funFacts": [
      "L'Université Al Quaraouiyine de Fès, fondée en 859 par Fatima al-Fihriya, est la plus ancienne université encore en activité de l'Histoire !",
      "La perle bleue du Rif, Chefchaouen, attire les voyageurs du monde entier avec ses ruelles pavées et ses maisons peintes en dégradés d'azur.",
      "Au Maroc, on peut observer des chèvres agiles qui grimpent tout en haut des branches tortueuses des arganiers pour brouter !"
    ]
  },
  {
    "id": "818",
    "code": "EG",
    "code3": "EGY",
    "name": "Égypte",
    "capital": "Le Caire",
    "continent": "Afrique",
    "flag": "🇪🇬",
    "coordinates": [
      29.86,
      26.47
    ],
    "funFacts": [
      "La Grande Pyramide de Gizeh est l'unique merveille du monde antique encore debout aujourd'hui, après plus de 45 siècles d'histoire !",
      "Dans l'Égypte antique, les chats étaient vénérés comme des animaux sacrés symboles de la déesse Bastet.",
      "Le Nil est l'un des fleuves les plus longs du monde avec plus de 6 650 kilomètres de voyage à travers l'Afrique !"
    ]
  },
  {
    "id": "434",
    "code": "LY",
    "code3": "LBY",
    "name": "Libye",
    "capital": "Tripoli",
    "continent": "Afrique",
    "flag": "🇱🇾",
    "coordinates": [
      18.03,
      26.99
    ],
    "funFacts": []
  },
  {
    "id": "231",
    "code": "ET",
    "code3": "ETH",
    "name": "Éthiopie",
    "capital": "Addis-Abeba",
    "continent": "Afrique",
    "flag": "🇪🇹",
    "coordinates": [
      39.56,
      8.65
    ],
    "funFacts": []
  },
  {
    "id": "262",
    "code": "DJ",
    "code3": "DJI",
    "name": "Djibouti",
    "capital": "Djibouti",
    "continent": "Afrique",
    "flag": "🇩🇯",
    "coordinates": [
      42.5,
      11.77
    ],
    "funFacts": []
  },
  {
    "id": "800",
    "code": "UG",
    "code3": "UGA",
    "name": "Ouganda",
    "capital": "Kampala",
    "continent": "Afrique",
    "flag": "🇺🇬",
    "coordinates": [
      32.36,
      1.3
    ],
    "funFacts": []
  },
  {
    "id": "646",
    "code": "RW",
    "code3": "RWA",
    "name": "Rwanda",
    "capital": "Kigali",
    "continent": "Afrique",
    "flag": "🇷🇼",
    "coordinates": [
      29.92,
      -2.01
    ],
    "funFacts": []
  },
  {
    "id": "070",
    "code": "BA",
    "code3": "BIH",
    "name": "Bosnie-Herzégovine",
    "capital": "Sarajevo",
    "continent": "Europe",
    "flag": "🇧🇦",
    "coordinates": [
      17.82,
      44.18
    ],
    "funFacts": []
  },
  {
    "id": "807",
    "code": "MK",
    "code3": "MKD",
    "name": "Macédoine du Nord",
    "capital": "Skopje",
    "continent": "Europe",
    "flag": "🇲🇰",
    "coordinates": [
      21.7,
      41.61
    ],
    "funFacts": []
  },
  {
    "id": "688",
    "code": "RS",
    "code3": "SRB",
    "name": "Serbie",
    "capital": "Belgrade",
    "continent": "Europe",
    "flag": "🇷🇸",
    "coordinates": [
      20.84,
      44.22
    ],
    "funFacts": []
  },
  {
    "id": "499",
    "code": "ME",
    "code3": "MNE",
    "name": "Monténégro",
    "capital": "Podgorica",
    "continent": "Europe",
    "flag": "🇲🇪",
    "coordinates": [
      19.29,
      42.79
    ],
    "funFacts": []
  },
  {
    "id": "780",
    "code": "TT",
    "code3": "TTO",
    "name": "Trinité-et-Tobago",
    "capital": "Port-d'Espagne",
    "continent": "Amérique du Nord",
    "flag": "🇹🇹",
    "coordinates": [
      -61.33,
      10.43
    ],
    "funFacts": []
  },
  {
    "id": "728",
    "code": "SS",
    "code3": "SSD",
    "name": "Soudan du Sud",
    "capital": "Djouba",
    "continent": "Afrique",
    "flag": "🇸🇸",
    "coordinates": [
      30.2,
      7.29
    ],
    "funFacts": []
  }
];

export const COUNTRIES_BY_ID: Record<string, Country> = COUNTRIES.reduce((acc, country) => {
  acc[country.id] = country;
  return acc;
}, {} as Record<string, Country>);

export const COUNTRIES_BY_CODE: Record<string, Country> = COUNTRIES.reduce((acc, country) => {
  acc[country.code] = country;
  return acc;
}, {} as Record<string, Country>);

export const CONTINENTS: Continent[] = [
  'Europe',
  'Asie',
  'Afrique',
  'Amérique du Nord',
  'Amérique du Sud',
  'Océanie',
];

export function getCountriesByContinent(continent: Continent): Country[] {
  return COUNTRIES.filter((c) => c.continent === continent);
}

export function getRandomCountries(count: number, excludeId?: string): Country[] {
  const pool = excludeId ? COUNTRIES.filter((c) => c.id !== excludeId) : [...COUNTRIES];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
