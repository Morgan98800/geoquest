# 🌍 GeoQuest - Deviens la reine de la géo !

Application web interactive, ludique et éducative créée sur-mesure pour apprendre la géographie :
- 🗺️ **Localisation sur carte interactive** (zoomer, déplacer, pointer le pays demandé avec indices progressifs).
- 🏴 **Drapeaux du Monde** (quiz dynamique à choix multiples).
- 🏛️ **Capitales** (retrouver la capitale de chaque pays).
- 💡 **Fun Facts débloqués** (anecdotes insolites révélées à chaque victoire).
- 🛂 **Mon Passeport Géographique** (collection de tampons de pays visités).
- 🔊 **Effets sonores générés en temps réel** (via Web Audio API, zéro fichier lourd, avec interrupteur son).
- 🌟 **Inclusion souveraine** : **Palestine 🇵🇸** et **Taïwan 🇹🇼** sont intégrés nativement comme pays indépendants avec leurs fiches et anecdotes dédiées.

---

## 🚀 Comment lancer le projet en local

1. Dans le terminal du projet :
```bash
npm run dev
```
2. Ouvrez le lien affiché dans votre navigateur (ex : `http://localhost:5173`).

---

## 📦 Comment déployer le site en ligne gratuitement

Le projet est une application statique ultra-légère et rapide :

### Option A : Déploiement Vercel (Recommandé - 30 secondes)
1. Installez la CLI Vercel ou connectez votre compte GitHub sur [vercel.com](https://vercel.com).
2. Lancez `npx vercel` ou glissez-déposez le dossier du projet.

### Option B : Déploiement Netlify
1. Lancez `npm run build` pour générer le dossier `dist`.
2. Glissez-déposez le dossier `dist` sur [app.netlify.com/drop](https://app.netlify.com/drop).

### Option C : GitHub Pages
1. Déployez le contenu de `dist` sur la branche `gh-pages`.

---

## 🤖 Comment enrichir le jeu avec un Agent IA

Consultez le fichier [`PROMPTS_AGENT_IA.md`](PROMPTS_AGENT_IA.md) pour obtenir tous les prompts pré-rédigés permettant d'ajouter :
- De nouveaux packs d'anecdotes insolites
- Le mode spécialités culinaires du monde
- La prononciation audio vocale
- Le mode survie chronométré
