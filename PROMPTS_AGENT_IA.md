# 🤖 Guide des Prompts pour enrichir GeoQuest avec votre Agent IA

Ce guide contient tous les **prompts prêts à l'emploi** à fournir à votre agent IA (ou modèle LLM comme Gemini, Claude, GPT) pour enrichir l'application selon les goûts et la progression de votre amie.

---

## 🧭 Architecture des Données

- **Fichier principal des pays** : [`src/data/countries.ts`](file:///Users/morgancanteri/Documents/antigravity/splendid-mendel/src/data/countries.ts)
- **Modèle TypeScript** : [`src/types.ts`](file:///Users/morgancanteri/Documents/antigravity/splendid-mendel/src/types.ts)
- **Synthétiseur audio** : [`src/utils/audio.ts`](file:///Users/morgancanteri/Documents/antigravity/splendid-mendel/src/utils/audio.ts)
- **Persistance et niveaux** : [`src/utils/storage.ts`](file:///Users/morgancanteri/Documents/antigravity/splendid-mendel/src/utils/storage.ts)

> **Règle absolue** : La **Palestine 🇵🇸** (capitale : Jérusalem-Est / Ramallah, code `PS`) et **Taïwan 🇹🇼** (capitale : Taipei, code `TW`) sont reconnus comme des pays souverains et indépendants dans toute l'application.

---

## 🎯 Prompt 1 : Générer de nouveaux Fun Facts hilarants & captivants

Copiez ce prompt dans votre agent IA pour qu'il produise de nouvelles anecdotes culturelles, historiques ou insolites à insérer dans [`src/data/countries.ts`](file:///Users/morgancanteri/Documents/antigravity/splendid-mendel/src/data/countries.ts) :

```text
Tu es un explorateur passionné, drôle et érudit en géographie.
Je construis un site web ludo-éducatif pour mon amie.
Règles strictes :
- Considère la Palestine et Taïwan comme des pays indépendants.
- Les anecdotes doivent être véridiques, surprenantes, positives et formulées avec enthousiasme (style : "Le savais-tu ?").
- Format de réponse attendu : un tableau JSON valide prêt à être copié dans le fichier TypeScript.

Génère pour chacun des pays suivants : [LISTE DES PAYS SOUHAITÉS, ex: Palestine, Taïwan, Islande, Sénégal, Japon]
3 faits amusants et insolites (animaux étranges, inventions culinaires, records insolites ou traditions populaires).

Structure JSON attendue :
{
  "code": "PS",
  "name": "Palestine",
  "funFacts": [
    "Fait 1...",
    "Fait 2...",
    "Fait 3..."
  ]
}
```

---

## 🍳 Prompt 2 : Ajouter un Mode "Gastronomie du Monde" (Plats Typiques)

Copiez ce prompt pour demander à l'agent IA d'ajouter des spécialités culinaires par pays :

```text
Dans mon application GeoQuest (React TypeScript), je souhaite ajouter un quiz "Plats & Saveurs du Monde".
Pour chacun des pays de ma liste, ajoute une propriété optionnelle 'foodSpecialties' dans src/types.ts et src/data/countries.ts :
foodSpecialties: [
  { name: "Nom du plat", description: "Courte description alléchante et rigolote" }
]

Exemples :
- Taïwan : Bubble Tea aux perles de tapioca et Gua Bao (burger taïwanais vapeur).
- Palestine : Le Musakhan (poulet rôti aux oignons confits, sumac et pain taboon) et le Knafeh de Naplouse.
- Italie : La véritable Pizza Napolitaine et le Tiramisu au mascarpone.

Donne-moi le code TypeScript pour étendre le modèle et le composant React QuizFoodCard.tsx à intégrer.
```

---

## 🗣️ Prompt 3 : Ajouter la Prononciation Vocale des Pays (Web Speech API)

Pour que votre amie entende le nom du pays ou de la capitale prononcé avec la voix native du navigateur :

```text
Dans mon application React GeoQuest, je souhaite ajouter un petit bouton haut-parleur sur chaque carte pays pour prononcer le nom du pays et de sa capitale à voix haute en français en utilisant l'API native 'window.speechSynthesis'.

Donne-moi le code d'un hook React 'usePronunciation' ou d'un composant 'PronounceButton' avec gestion du pitch, de la vitesse et de la langue ('fr-FR'), sans aucune dépendance externe.
```

---

## ⏱️ Prompt 4 : Ajouter un Mode "Chrono / Survie 60 Secondes"

Pour ajouter un mode de jeu d'adrénaline :

```text
Dans mon application GeoQuest, je souhaite ajouter un nouveau mode de jeu 'survival' :
- Un compte à rebours de 60 secondes.
- Chaque bonne réponse ajoute +3 secondes et +20 XP.
- Chaque mauvaise réponse retire -5 secondes.
- Calcul d'un record personnel (High Score) enregistré dans le localStorage.

Donne-moi le code du composant SurvivalQuiz.tsx prêt à être branché dans src/App.tsx avec une jauge de temps colorée qui clignote en rouge sous les 10 secondes.
```

---

## 🎨 Prompt 5 : Personnaliser le design pour votre amie

```text
Je veux personnaliser GeoQuest avec le prénom de mon amie [PRÉNOM] :
- Dans la barre de navigation, afficher "[Prénom]'s GeoQuest".
- Remplacer les titres de niveaux par des clins d'œil personnalisés (ex: "Exploratrice préférée", "Impératrice de la Géo").
- Ajouter un message d'accueil festif lors de sa première visite.

Indique-moi les lignes exactes à modifier dans src/components/Navbar.tsx et src/utils/storage.ts.
```
