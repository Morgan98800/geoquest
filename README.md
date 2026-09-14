# 🌍 Geo-PD — Guide Complet de l'Application

Application web et mobile de géographie interactive, ludique et tactique, inspirée de l'ergonomie de **StudyGe** et conçue sur-mesure pour apprendre la géographie mondiale sans friction.

---

## 📌 Sommaire

1. [Vue d'ensemble & Concept](#-vue-densemble--concept)
2. [Modes de Jeu](#-modes-de-jeu)
3. [Système de Progression & Récompenses](#-système-de-progression--récompenses)
4. [Gestion Multi-Comptes & Sauvegardes](#-gestion-multi-comptes--sauvegardes)
5. [Direction Artistique & Ergonomie Mobile](#-direction-artistique--ergonomie-mobile)
6. [Architecture Technique & Fichiers](#-architecture-technique--fichiers)
7. [Installation & Déploiement](#-installation--déploiement)

---

## 🧭 Vue d'ensemble & Concept

**Geo-PD** a pour objectif d'apprendre la localisation des pays, les drapeaux, les capitales et des anecdotes insolites à travers une interface épurée, rapide et valorisante.

### 🌟 Principes Clés
- **Inclusion Souveraine** : La **Palestine 🇵🇸** (Capitale : Jérusalem-Est) et **Taïwan 🇹🇼** (Capitale : Taipei) sont intégrés nativement comme des nations souveraines et indépendantes, avec leurs coordonnées, capitales, drapeaux et anecdotes propres.
- **Approche Zéro Clutter** : Suppression de tous les boutons superflus (pas de boutons de zoom disgracieux, pas de menus encombrants). La navigation se fait au doigt ou à la souris comme sur une vraie application native.
- **Expérience PWA Standalone** : Installable sur écran d'accueil iPhone / Android pour jouer en plein écran, sans la barre d'adresse ni les onglets de navigation.

---

## 🎮 Modes de Jeu

L'application propose 5 modes accessibles depuis le menu déroulant en haut de l'écran :

### 1. 🗺️ Trouve sur la carte (Mode Principal)
- Un pays est demandé avec son drapeau et sa capitale.
- L'utilisateur doit le pointer directement sur la mappemonde vectorielle interactive.
- **Bouton « Indice »** :
  - *Clic 1* : Révèle le continent d'appartenance.
  - *Clic 2 (« Cadrer »)* : Zoome et centre automatiquement la caméra sur la région géographique du pays.
- **Commandes tactiles naturelles** :
  - *Pinch-to-zoom* à 2 doigts pour zoomer/dézoomer.
  - *Glisser* à 1 doigt pour faire défiler la carte.
  - *Double-clic / Double-tap* pour réinitialiser la vue d'ensemble du globe.
- **Mode Plein Écran Horizontal** : En tournant le téléphone en paysage, le header s'efface pour laisser la carte occuper 100% de l'écran (`100vw × 100vh`), avec une pastille flottante discrète en haut.

### 2. 🏴 Drapeaux du Monde
- Un drapeau national s'affiche en grand.
- 4 choix de pays proposés.
- Feedback visuel instantané (vert / rouge) et sonore via synthétiseur audio.

### 3. 🏛️ Capitales
- Une capitale est présentée (ex: *Reykjavik*, *Tokyo*, *Ramallah*).
- Retrouver la nation correspondante parmi 4 propositions.

### 4. 📖 Atlas du Monde
- Exploration libre du globe sans contrainte de quiz.
- Moteur de recherche instantané par nom de pays ou par nom de capitale.
- Raccourcis d'accès rapide en 1 clic (Palestine, Taïwan, France, Japon, Maroc...).
- Fiche pays détaillée : Capitale, Continent, Code ISO, coordonnées et anecdote culturelle/géographique.

### 5. 🛂 Mon Passeport Géographique
- Carnet de voyage personnel officiel.
- Chaque pays trouvé lors d'un quiz reçoit un **tampon de visa officiel**.
- Jauge de complétion du monde : pourcentage de pays découverts sur les 174 nations cartographiées.
- Filtres par continent (Afrique, Asie, Europe, Amérique du Nord, Amérique du Sud, Océanie).
- Clic sur un tampon pour réexaminer la fiche et les anecdotes débloquées.

---

## 🏆 Système de Progression & Récompenses

- **Points d'Expérience (XP)** :
  - Bonne réponse en quiz à choix multiples : **+15 XP**.
  - Bonne réponse trouvée directement sur la carte : **+25 XP** (bonus précision cartographique).
- **10 Niveaux d'Explorateur** :
  1. *Curieux du Monde* (0 XP)
  2. *Apprenti Voyageur* (60 XP)
  3. *Baroudeur des Continents* (150 XP)
  4. *Navigateur Émérite* (300 XP)
  5. *Cartographe Assidu* (500 XP)
  6. *Éclaireur Terrestre* (800 XP)
  7. *Globe-Trotteur d'Or* (1200 XP)
  8. *Maître Géographe* (1800 XP)
  9. *Légende des Frontières* (2600 XP)
  10. *Souverain du Monde* (3500+ XP)
- **Modal Fun Fact** :
  - À chaque bonne réponse, une modal s'ouvre pour féliciter le joueur, afficher les XP gagnés, la série de victoires en cours, et révéler une **anecdote insolite** vérifiée sur le pays.
  - Exemples :
    - *Palestine* : Jéricho est considérée comme la plus ancienne ville habitée en continu au monde (plus de 11 000 ans).
    - *Taïwan* : L'île compte la plus forte densité mondiale de supérettes 24/7 (7-Eleven, FamilyMart).
    - *Islande* : Aucun moustique ne vit sur l'île.

---

## 👥 Gestion Multi-Comptes & Sauvegardes

L'application a été conçue pour deux joueurs principaux avec une séparation totale et étanche des données :
- **👑 MathildeLPB** (Profil prioritaire par défaut)
- **🧭 Morgan**

### Fonctionnalités de Gestion :
1. **Sélecteur de Profil en 1 Clic** : Bouton dans la barre du haut permettant de basculer instantanément entre Mathilde et Morgan (ou de saisir un autre prénom).
2. **Stockage Local Isolé** : Chaque profil dispose de sa propre clé dans le `localStorage` (`geoquest_account_mathildelpb_v1` et `geoquest_account_morgan_v1`). Aucun risque d'écraser la progression de l'autre.
3. **Sauvegarde & Restauration JSON** : Possibilité d'exporter sa progression sous forme de code texte ou de fichier JSON.
4. **Lien Magique de Transfert** : Lien URL contenant les données de progression (`#backup=...&user=...`) pour transférer sa partie sur un smartphone en un clic.

---

## 🎨 Direction Artistique & Ergonomie Mobile

Inspirée des jeux de stratégie et de géographie tactique (**StudyGe**, **Risk**) :

| Élément | Choix Graphique | Rendu Visuel |
| :--- | :--- | :--- |
| **Océan** | Bleu marine mat et profond (`#16202c`) | Fond uniforme sans reflets cybernétiques |
| **Continents** | Ardoise tactique sobre (`#273749`) | Contours nets et frontières visibles (`#3d5269`) |
| **Pays Découvert** | Vert émeraude franc (`#059669`) | Identifie clairement les zones maîtrisées |
| **Cible active** | Or miel (`#eab308`) avec balise pulsante | Repérage facile des petits territoires (Palestine, Taïwan) |
| **Interface** | Cartes anthracites solides (`#1c2938`) | Zéro dégradé néon, lisibilité optimale |

---

## 📂 Architecture Technique & Fichiers

Le projet est construit avec **Vite + React 18 + TypeScript + Tailwind CSS** :

```text
splendid-mendel/
├── public/
│   ├── manifest.json         # Manifest PWA (standalone, orientation any)
│   ├── icon.svg              # Icône vectorielle du globe
│   ├── icon-192.png          # Icône d'application 192x192
│   ├── icon-512.png          # Icône d'application 512x512
│   ├── apple-touch-icon.png  # Icône d'écran d'accueil iOS
│   └── _redirects            # Règles de redirection SPA Netlify
├── src/
│   ├── components/
│   │   ├── AccountModal.tsx  # Modal de changement de profil utilisateur
│   │   ├── AtlasView.tsx     # Mode exploration et recherche de pays
│   │   ├── BackupModal.tsx   # Modal d'export/import et lien magique
│   │   ├── FunFactModal.tsx  # Célébration victoire & anecdote insolite
│   │   ├── InteractiveMap.tsx# Mappemonde SVG interactive (d3-geo + TopoJSON)
│   │   ├── MapQuiz.tsx       # Jeu de localisation sur carte (mode portrait & paysage)
│   │   ├── Navbar.tsx        # Barre de navigation compacte & sélecteur de mode
│   │   ├── PassportView.tsx  # Passeport virtuel et collection de tampons
│   │   └── QuizCard.tsx      # Cartes quiz QCM (Drapeaux & Capitales)
│   ├── data/
│   │   ├── countries.ts      # Base de données des 174 pays (coordonnées, facts, capitales)
│   │   └── worldGeo.ts       # TopoJSON mondial & projections vectorielles d3-geo
│   ├── utils/
│   │   ├── audio.ts          # Synthétiseur d'effets sonores Web Audio API en temps réel
│   │   └── storage.ts        # Persistance multi-comptes, niveaux et calculs XP
│   ├── App.tsx               # Orchestrateur principal & détection d'orientation
│   ├── main.tsx              # Point d'entrée React
│   └── index.css             # Directives Tailwind et styles utilitaires
├── index.html                # Page d'accueil HTML, meta PWA & bloqueur de badge
├── netlify.toml              # Configuration de build et déploiement Netlify
└── package.json              # Dépendances et scripts du projet
```

---

## 🚀 Installation & Déploiement

### Exécution en local
```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm run dev

# 3. Compiler pour la production
npm run build
```

### Déploiement en Production
Le site est déployé automatiquement sur **Netlify** :
- **URL en direct** : [https://geoquest-monde.netlify.app](https://geoquest-monde.netlify.app)
- **Dépôt GitHub** : [https://github.com/Morgan98800/geoquest](https://github.com/Morgan98800/geoquest)
