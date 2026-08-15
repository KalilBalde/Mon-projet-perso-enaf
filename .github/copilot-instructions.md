# Instructions du projet ENAFIM Guinée

## Contexte du projet

ENAFIM Guinée est un projet personnel visant à construire un site web professionnel pour une entreprise africaine de l'immobilier et du multiservices à Conakry, en Guinée.

Le produit doit pouvoir évoluer pendant plusieurs décennies. Toute décision technique doit donc privilégier une architecture claire, maintenable, sécurisée, testable et extensible. Le site pourra ensuite gérer plusieurs grandes bases de données et alimenter des applications mobiles.

Le dépôt GitHub personnel du projet est la source de référence. Le développement et la compilation doivent être réalisés principalement dans GitHub Codespaces, car le poste local est un ordinateur professionnel sur lequel Node.js et les outils de développement ne peuvent pas être installés.

## Contraintes de collaboration avec l'utilisateur

- L'utilisateur travaille dans GitHub Codespaces.
- Ne pas supposer que Node.js, npm ou des outils supplémentaires sont disponibles sur le poste local.
- Quand une commande est nécessaire, fournir la commande exacte à exécuter dans le terminal Codespaces.
- Quand un fichier doit être créé ou modifié, indiquer clairement son chemin relatif depuis la racine du projet et expliquer brièvement son rôle.
- L'utilisateur souhaite pouvoir copier-coller facilement le résultat dans Codespaces.
- Quand du code est demandé, regrouper autant que possible tout le code d'un même fichier dans un seul bloc de code.
- Ne jamais demander à l'utilisateur de deviner où placer un fichier.
- Les explications sont en français. Le code, les noms de fichiers, les symboles et les commentaires de code sont en anglais, sauf nécessité de conserver une interface métier en français.
- Avant toute modification, lire le code concerné et vérifier l'état actuel du dépôt. Ne pas remplacer des modifications existantes sans les comprendre.
- Après une modification, effectuer une validation ciblée dès qu'elle est possible.
- Ne pas créer de commit ou de branche automatiquement, sauf demande explicite de l'utilisateur.

## État technique actuel

- Framework : Next.js 14.2.5 avec App Router.
- Runtime prévu : Node.js, exécuté dans Codespaces.
- UI : React 18.3.1 et TypeScript 5.5.4.
- Icônes : lucide-react.
- Alias TypeScript : `@/*` vers `src/*`.
- Polices actuelles : Playfair Display et DM Sans chargées depuis Google Fonts.
- Dépendances verrouillées par `package-lock.json`.
- Commandes disponibles dans `package.json` :
  - `npm run dev` : serveur de développement avec rechargement à chaud.
  - `npm run build` : compilation de production.
  - `npm run start` : démarrage de la version compilée.
- Installation reproductible dans Codespaces : `npm ci`.

## Structure actuelle

- `src/app/layout.tsx` : layout racine, métadonnées, navbar, footer et styles globaux actuels.
- `src/app/page.tsx` : page d'accueil.
- `src/app/multiservices/page.tsx` : page multiservices.
- `src/components/layout/` : `Navbar` et `Footer`.
- `src/components/home/` : hero, statistiques, avantages et appel à l'action.
- `src/components/shared/` : barre de recherche, carte d'annonce et bouton "Voir tout".
- `src/data/constants.ts` : logo, slides du hero, navigation, types de biens et quartiers.
- `src/data/listings.ts` : annonces immobilières de démonstration locales.
- `src/types/index.ts` : types `Listing` et `SearchFilters`.
- `src/utils/format.ts` : formatage des prix en GNF.
- `public/images/` : ressources locales, dont le logo.
- `index_backupFirebaseStudio.tsx`, `siteWeb_OK_1.txt` et `Mes premieres notes.txt` : anciennes versions ou notes de conception, à consulter comme historique et non comme source principale du code actif.

## Fonctionnalités présentes aujourd'hui

- Navbar fixe responsive avec menu mobile.
- Hero avec slider automatique, flèches et indicateurs.
- Recherche UI avec sélection du type, quartier et budget maximum.
- Cartes d'annonces avec prix en GNF, surface, pièces, salles de bain et favori local.
- Section de statistiques et présentation des avantages ENAFIM.
- Page multiservices : plomberie, électricité, peinture/rénovation, nettoyage/entretien et sécurité.
- Données immobilières actuellement statiques et destinées à la démonstration.

## Limites connues à traiter progressivement

- La barre de recherche ne filtre pas encore réellement la liste des annonces.
- Les boutons et ancres de navigation ne correspondent pas tous à des pages ou sections existantes.
- Les annonces n'ont pas encore de pages de détail.
- Il n'y a pas encore de backend, d'API, de base de données, d'authentification, de formulaire métier ni d'espace personnel.
- Les images métier proviennent encore d'URLs Unsplash et devront être remplacées ou gérées par une solution durable.
- La page multiservices utilise des classes Tailwind alors que Tailwind n'est pas déclaré dans les dépendances actuelles. Vérifier ce point avant de modifier son apparence.
- Les styles sont actuellement majoritairement inline et devront être progressivement rationalisés sans réécriture massive non nécessaire.
- Certaines annonces de démonstration sont dupliquées.
- Le contenu français existant ne doit pas être corrigé ou réécrit globalement dans une modification fonctionnelle, sauf demande explicite.

## Principes d'architecture à respecter

- Conserver l'App Router et TypeScript strict.
- Séparer clairement présentation, logique métier, accès aux données, validation et intégrations externes.
- Préférer des composants petits et réutilisables, avec des responsabilités explicites.
- Ne pas introduire une base de données ou un fournisseur cloud sans expliquer le choix, les coûts, la sécurité, la migration et le plan de test.
- Préparer les contrats de données pour une future API et plusieurs clients, notamment les applications mobiles.
- Centraliser les types et éviter les chaînes métier dupliquées lorsque cela devient nécessaire.
- Valider côté serveur toutes les données venant du client avant leur utilisation ou leur stockage.
- Ne jamais exposer de secrets dans le code, les commits, les logs ou les réponses.
- Prévoir authentification robuste, autorisation par rôle, journalisation, limitation de débit, protection des données personnelles et sauvegardes avant l'ajout de fonctionnalités sensibles.
- Favoriser les changements incrémentaux, faciles à revoir et à annuler.
- Ne pas ajouter de dépendance lorsque les outils existants suffisent.
- Éviter les refactorisations générales pendant une correction ciblée.

## Qualité frontend

- Construire une expérience professionnelle, moderne, accessible et responsive.
- Préserver la cohérence visuelle ENAFIM existante avant d'introduire une nouvelle direction graphique.
- Utiliser les icônes Lucide déjà présentes plutôt que dessiner des SVG manuellement.
- Ajouter des textes alternatifs pertinents aux images informatives.
- Utiliser des boutons pour les actions et des liens pour la navigation.
- Vérifier les états clavier, focus, hover, chargement, erreur et absence de résultat.
- Éviter les éléments purement décoratifs qui nuisent à la lisibilité ou aux performances.
- Tester les affichages mobile et desktop après toute modification visible.

## Workflow Codespaces

Depuis la racine du dépôt :

```bash
npm ci
npm run dev
```

Ouvrir ensuite le port `3000` dans l'onglet Ports de Codespaces. Le serveur Next.js fournit le rechargement automatique pendant les modifications.

Avant une sauvegarde importante :

```bash
npm run build
git status
git diff
```

Les commits et `git push` servent à sauvegarder le travail sur GitHub, pas à déclencher le rechargement local du serveur de développement.

## Règle de mise à jour du contexte

À chaque évolution significative de l'architecture, des scripts, des dépendances, des routes, des bases de données ou des conventions, mettre à jour ce fichier dans la même modification ou le signaler explicitement à l'utilisateur. Toujours considérer le code réellement présent dans le dépôt comme la vérité finale et relire les fichiers concernés avant de proposer la suite.
