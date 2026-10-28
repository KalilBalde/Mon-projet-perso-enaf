# Instructions du projet ENAFIM Guinée

## Contexte du projet

ENAFIM Guinée est un projet personnel de création d'un site web professionnel pour une entreprise africaine de l'immobilier et du multiservices à Conakry, en Guinée.

Le site doit être moderne, accessible, sécurisé, scalable, maintenable et capable d'évoluer pendant plusieurs décennies. Il devra pouvoir gérer de grandes bases de données et alimenter des applications mobiles dans le futur.

Le dépôt GitHub personnel est la source de référence du projet.

## Environnement de travail

- Tout le développement se fait directement dans GitHub Codespaces.
- Le VS Code local ne doit pas être utilisé pour modifier les fichiers du projet.
- Node.js et npm sont utilisés dans Codespaces.
- Le serveur Next.js est lancé dans Codespaces avec rechargement automatique.
- Les fichiers doivent être modifiés directement dans Codespaces.
- L'utilisateur ne veut pas faire de git add, git commit, git push ou git pull pour chaque modification.
- Les commits et le push sont réalisés uniquement lorsque l'utilisateur veut sauvegarder ou synchroniser une étape complète.
- Après chaque modification, l'utilisateur sauvegarde le fichier dans Codespaces et vérifie l'aperçu.
- Ne jamais modifier les fichiers du VS Code local.
- Ne jamais supposer qu'une modification locale est disponible dans Codespaces.

## Règles obligatoires de réponse

- Les explications sont en français.
- Le code, les symboles, les noms de fichiers et les commentaires sont en anglais, sauf pour les textes visibles destinés aux utilisateurs francophones.
- Avant chaque modification, indiquer :
  - le chemin exact du fichier dans Codespaces ;
  - s'il faut modifier ou créer le fichier ;
  - le rôle du fichier ;
  - l'action précise à effectuer.
- Toujours fournir le contenu complet du fichier dans un seul bloc copiable lorsque l'utilisateur doit remplacer un fichier.
- Pour plusieurs fichiers, fournir un seul bloc global en séparant clairement les fichiers avec leur chemin.
- Ne jamais demander à l'utilisateur de deviner où créer ou placer un fichier.
- Ne jamais modifier directement le workspace local.
- Après chaque changement, fournir la commande de validation à exécuter dans Codespaces.
- Ne jamais créer automatiquement de commit ou de branche sans demande explicite.
- Avant toute modification, lire et respecter l'état actuel du code.

## Priorité mobile-first

Environ 95 % des utilisateurs utiliseront le site depuis un smartphone. Le smartphone est donc la référence principale pour les décisions de design, d'ergonomie et de performance.

Toujours anticiper le besoin futur de faire deux applications mobiles natives pour Android et iOS, qui devront consommer les mêmes données que le site web.

Respecter les règles suivantes :

- Concevoir d'abord pour des écrans de 320 à 480 pixels.
- Vérifier ensuite les largeurs 375, 390 et 430 pixels.
- Adapter ensuite le rendu tablette et ordinateur.
- Éviter les grands espaces verticaux inutiles.
- Éviter les héros qui occupent presque tout l'écran mobile.
- Garder les titres courts, lisibles et sans débordement.
- Empêcher les titres et boutons de passer involontairement sur deux lignes.
- Utiliser des boutons suffisamment grands pour être touchés facilement.
- Prévoir des espacements réguliers, sans éléments serrés ni blocs disproportionnés.
- Utiliser des carrousels horizontaux lorsque plusieurs cartes doivent être consultées sur mobile.
- Afficher un aperçu de l'élément suivant lorsqu'un carrousel existe.
- Ajouter des flèches gauche et droite lorsque cela améliore la compréhension.
- Ne pas utiliser de défilement automatique pour les annonces ou services sans raison claire.
- Préserver le retour tactile naturel avec `scroll-snap-type`.
- Éviter les grilles trop larges sur smartphone.
- Vérifier que le footer, la navbar, les CTA et les galeries restent compacts.
- Vérifier les débordements horizontaux sur chaque page.
- Optimiser les images pour les connexions mobiles.
- Utiliser le chargement différé des images qui ne sont pas immédiatement visibles.
- Prévoir des miniatures pour les listes et des images plus grandes uniquement dans les galeries.
- Privilégier WebP ou AVIF pour les images finales.
- Éviter les animations lourdes et les effets qui ralentissent les smartphones.
- Tester les états tactile, focus, chargement, erreur et absence de résultat.

## État technique actuel

- Framework : Next.js 14.2.35 observé dans Codespaces.
- Architecture : App Router.
- UI : React 18.3.1.
- Langage : TypeScript 5.5.4.
- Icônes : lucide-react.
- Alias TypeScript : `@/*` vers `src/*`.
- Polices : Playfair Display et DM Sans.
- Gestionnaire de paquets : npm.
- Dépendances verrouillées dans `package-lock.json`.
- Le projet utilise des CSS Modules pour la page multiservices.
- Ne pas introduire Tailwind sans décision explicite et installation complète de ses dépendances.

## Commandes Codespaces

Depuis la racine du projet :

    npm ci
    npm run dev

Le serveur de développement est généralement accessible sur le port 3000.

Pour une compilation de production :

    npm run build

Pour démarrer la version compilée :

    npm run start

Après une modification, vérifier d'abord le rendu avec le serveur de développement, puis utiliser `npm run build` avant une étape importante.

## Structure actuelle

- `src/app/layout.tsx` : layout racine, métadonnées, styles globaux, navbar et footer.
- `src/app/page.tsx` : page d'accueil, recherche, filtrage et annonces.
- `src/app/annonces/page.tsx` : catalogue complet des annonces.
- `src/app/annonces/[id]/page.tsx` : page détaillée dynamique d'une annonce avec galerie photos.
- `src/app/multiservices/page.tsx` : page des services ENAFIM.
- `src/app/multiservices/page.module.css` : styles isolés de la page multiservices.
- `src/components/layout/Navbar.tsx` : navigation globale responsive.
- `src/components/layout/Footer.tsx` : footer global responsive.
- `src/components/home/` : hero, statistiques, avantages et CTA.
- `src/components/shared/SearchBar.tsx` : recherche par type, quartier et budget.
- `src/components/shared/ListingCard.tsx` : carte d'annonce cliquable avec favori.
- `src/components/shared/ListingsCarousel.tsx` : carrousel d'annonces avec flèches gauche et droite.
- `src/components/shared/ViewAllButton.tsx` : lien vers le catalogue complet.
- `src/data/constants.ts` : logo, navigation, types de biens et quartiers.
- `src/data/listings.ts` : annonces statiques de démonstration.
- `src/lib/listings/repository.ts` : couche d'accès aux annonces et génération des slugs.
- `src/types/index.ts` : contrats TypeScript des annonces et filtres.
- `src/utils/format.ts` : formatage des prix en GNF.
- `public/images/` : images locales et logo.

## Fonctionnalités actuelles

- Navbar responsive avec logo cliquable.
- Navigation mobile avec accès aux multiservices et à l'espace personnel.
- Hero avec slider automatique.
- Recherche par type, quartier et budget maximum.
- Bouton de réinitialisation des filtres.
- Cartes d'annonces cliquables.
- Favoris locaux.
- Carrousel d'annonces sur l'accueil.
- Catalogue complet accessible via `/annonces`.
- Catalogue en grille sur plusieurs lignes.
- Pages de détail accessibles par slug.
- Galerie photo avec agrandissement, flèches, compteur et fermeture.
- Statistiques ENAFIM.
- Section de services avec carrousel mobile.
- Page multiservices avec services, engagement et contact.
- Footer compact et responsive.
- Données statiques de démonstration comprenant actuellement 15 annonces.

## Routes actuelles

- `/` : accueil.
- `/annonces` : toutes les annonces.
- `/annonces/[slug]` : détail d'une annonce.
- `/multiservices` : services ENAFIM.

## Points importants à vérifier

- Ne jamais créer un second `layout.tsx` dans un sous-dossier de route sans nécessité.
- Les balises `<html>` et `<body>` doivent exister uniquement dans `src/app/layout.tsx`.
- Une page de route ne doit jamais contenir `<html>` ou `<body>`.
- Les fichiers JSX doivent rester dans des fichiers `.tsx`.
- Les données doivent rester dans les fichiers `.ts`.
- `ListingCard.tsx` est au singulier. Ne pas importer `ListingsCard`.
- Les imports relatifs doivent respecter le niveau réel du dossier.
- Les cartes d'annonce doivent utiliser `ListingCard`.
- Les composants ne doivent pas recopier directement toute la logique de données.
- Les annonces doivent passer par `listingRepository` lorsque cela est possible.
- Les erreurs d'hydratation doivent être corrigées à la source, pas masquées systématiquement avec `suppressHydrationWarning`.
- Éviter les balises `<style>` dans les pages lorsque le CSS Module est approprié.
- Ne pas mélanger le contenu de deux fichiers dans un seul bloc à copier.
- Toujours vérifier les noms et chemins avant de fournir une modification.

## Limites connues

- Les annonces sont encore statiques.
- Il n'y a pas encore de base de données.
- Il n'y a pas encore de backend ou d'API métier.
- Il n'y a pas encore d'espace d'administration.
- L'ajout et la suppression réelle des annonces ne sont pas encore persistants.
- Les images utilisent encore principalement des URLs Unsplash.
- Les images ne sont pas encore gérées par un stockage spécialisé ni un CDN.
- La recherche fonctionne actuellement sur les données statiques.
- Les boutons de navigation qui correspondent à des fonctionnalités futures peuvent encore utiliser des ancres temporaires.
- Certaines images de démonstration peuvent être indisponibles.
- Les textes et données métier devront être validés avant la mise en production.

## Architecture future recommandée

Évoluer progressivement vers :

- une base PostgreSQL ;
- une couche repository conservant les mêmes contrats ;
- des filtres et une pagination côté serveur ;
- une API sécurisée pour les applications web et mobiles ;
- un stockage d'images spécialisé ;
- des miniatures et variantes WebP/AVIF ;
- un CDN ;
- un espace d'administration ;
- des rôles et permissions ;
- une suppression logique avec archivage ;
- une validation serveur ;
- une journalisation ;
- une limitation de débit ;
- des sauvegardes ;
- des tests automatisés.

Ne pas connecter une base de données avant d'avoir expliqué le choix, les coûts, la sécurité, la migration et la stratégie de sauvegarde.

## Workflow de synchronisation

Le travail quotidien est effectué directement dans Codespaces :

    Modifier le fichier dans Codespaces
    Sauvegarder
    Vérifier l'aperçu
    Exécuter npm run build lorsque nécessaire

Pour sauvegarder une étape complète sur GitHub :

    git status
    git add .
    git commit -m "Describe the completed change"
    git push origin ikb_coding

Sur un autre environnement local, récupérer ensuite :

    git pull origin ikb_coding

Ne pas faire de commit ou de push pour chaque petite modification.

## Mise à jour obligatoire du contexte

Mettre à jour ce fichier lorsqu'une évolution importante concerne :

- l'architecture ;
- les routes ;
- les dépendances ;
- les scripts ;
- les bases de données ;
- les images ;
- les conventions de code ;
- le workflow Codespaces ;
- la stratégie mobile-first.

Le code réellement présent dans le dépôt est toujours la source de vérité.