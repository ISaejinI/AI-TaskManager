# TaskManager

Application web de gestion de tâches construite avec Next.js (App Router) et Tailwind CSS.

## Demo

- Production : [https://fir-c2d67.web.app/](https://fir-c2d67.web.app/)

## Fonctionnalites Actuelles

- Authentification Firebase:
  - inscription par email/mot de passe
  - connexion par email/mot de passe
  - connexion Google (popup)
  - deconnexion
- Dashboard prive:
  - ajout de taches
  - taches avec titre, description, date de rendu et priorite
  - marquage completee/active
  - suppression de tache
  - recherche texte
  - filtres (toutes, actives, completees)
  - tri (date/priorite, asc/desc)
  - statistiques globales + barre de progression
- Listes partagees:
  - creation de listes collaboratives
  - ouverture/suppression d'une liste (owner)
  - ajout/retrait de membres par email (owner)
  - taches partagees en temps reel
  - affichage des stats par liste (total/completees)

## Stack Technique

- Next.js 16 (App Router)
- React 19
- Firebase:
  - Authentication
  - Cloud Firestore
  - Hosting
- Tailwind CSS 4
- ESLint 9 + eslint-config-next

## Routes

- `/` : page d'accueil
- `/login` : connexion
- `/signup` : inscription
- `/dashboard` : dashboard personnel (protege)
- `/shared` : listes partagees (protege)

## Structure Du Projet

```text
src/
  app/
    layout.js
    page.js
    dashboard/page.js
    login/page.js
    signup/page.js
    shared/page.js
  components/
    AddTaskForm.js
    AuthGuard.js
    CreateListForm.js
    Dashboard.js
    FilterBar.js
    Header.js
    LoginForm.js
    Navigation.js
    ProgressBar.js
    SearchBar.js
    SharedListCard.js
    SharedListView.js
    SignupForm.js
    TaskItem.js
    TaskList.js
    TaskStats.js
    UserMenu.js
  contexts/
    AuthContext.js
  hooks/
    useDashboardTasks.js
    useSharedLists.js
    useTaskFilter.js
    useTaskSearch.js
    useTaskStats.js
  lib/
    firebase.js
  services/
    taskService.js
    sharedListService.js
firestore.rules
firebase.json
```

## Prerequis

- Node.js 20+
- npm
- Projet Firebase configure (Auth + Firestore + Hosting)

## Variables D'Environnement

Creer un fichier `.env.local` a la racine avec:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Installation Et Lancement Local

```bash
npm install
npm run dev
```

Application disponible sur `http://localhost:3000`.

## Scripts

- `npm run dev` : lance le serveur de développement
- `npm run build` : build de production
- `npm run start` : lance l'application buildée
- `npm run lint` : exécute ESLint

## Deploiement Firebase Hosting

Le projet est configure pour hebergement statique via `firebase.json` (`public: out`).

```bash
npm run build
firebase deploy --only hosting
```

Pour deployer aussi les regles Firestore:

```bash
firebase deploy --only firestore:rules
```

## Securite Firestore

Les regles `firestore.rules` definissent:

- acces prive aux taches utilisateur: `/users/{userId}/tasks/{taskId}`
- profil utilisateur en lecture pour utilisateurs connectes
- listes partagees lisibles par les membres
- modifications/suppression de liste reservees au proprietaire
- taches de liste partagee accessibles aux membres

## Etat Du Projet

Le projet est fonctionnel avec auth + dashboard + collaboration. Une prochaine etape naturelle est l'ajout de tests automatises (unitaires/integration) pour fiabiliser les evolutions.
