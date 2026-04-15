# TaskManager

Application web de gestion de tâches construite avec Next.js (App Router) et Tailwind CSS.

## Demo

- Production : [https://fir-c2d67.web.app/](https://fir-c2d67.web.app/)

## Fonctionnalites

- Affichage des tâches du jour avec informations clés (titre, description, échéance, priorité)
- Marquage d'une tâche en complétée / active
- Suppression d'une tâche
- Recherche par titre
- Filtrage par statut : toutes, actives, complétées
- Tri par date et par priorité
- Tableau de bord avec statistiques globales :
  - nombre total de tâches
  - nombre de tâches complétées
  - nombre de tâches actives
  - barre de progression globale

## Stack technique

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- ESLint

## Structure du projet

```text
src/
  app/
    layout.js
    page.js
  components/
    Dashboard.js
    TaskList.js
    TaskItem.js
    TaskStats.js
    ProgressBar.js
    SearchBar.js
    FilterBar.js
    Header.js
  hooks/
    useTaskFilter.js
    useTaskStats.js
```

## Installation

Prerequis :

- Node.js 20+ recommande
- npm

Installation et lancement en local :

```bash
npm install
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` : lance le serveur de développement
- `npm run build` : build de production
- `npm run start` : lance l'application buildée
- `npm run lint` : exécute ESLint

## Accessibilite et UX

- Composants UI pensés pour la navigation clavier
- Utilisation d'attributs ARIA sur les éléments interactifs (filtres, recherche, progression)
- Gestion des cas limites principaux (liste vide, valeurs invalides sur progression)

## Prochaines ameliorations

- Persistance des tâches (localStorage ou backend)
- Ajout / édition de tâche via formulaire
- Pages dédiées pour la navigation (`/tasks`, `/about`)
- Tests unitaires et tests d'intégration
