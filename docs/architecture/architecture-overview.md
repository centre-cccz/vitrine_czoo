# Vue d’ensemble de l’architecture

## Positionnement général

Le projet est actuellement centré sur un site public institutionnel, avec une logique de contenu multi-pages et des dépendances HTML/CSS/JS. La structure est simple, lisible et adaptée à un site d’information et de communication culturelle.

## Composants observés

### Frontend public

- pages HTML au niveau racine (accueil, actualités, programmes, galerie, etc.)
- feuilles de style globales et spécifiques (`css/style.css`, `css/accueil.css`, etc.)
- scripts globaux et spécifiques (`js/include-nav.js`, `js/programmes.js`, `js/accueil.js`, etc.)
- composants partagés comme le header et le footer via `includes/`

### Données et contenu

- images et visuels dans `images/`
- documents institutionnels dans `docs/`
- contenus culturels et événements via pages statiques et assets

### Backend léger

- `db.php` : wrapper PDO MySQL
- `contact-submit.php` : traitement du formulaire de contact
- `Gestion_Interne-CZoo/` : application interne PHP avec session, RBAC et modules métier

## Modèle architectural constaté

- Site public statique, multi-pages
- utilisation de fichiers HTML pour le contenu
- scripts front pour l’interactivité légère
- base de données MySQL uniquement pour des besoins très limités
- aucune couche API publique structurée observable
- API interne protégée pour les modules sensibles, notamment les finances

## Etat actuel vs cible

### Existant

- site public HTML/CSS/JS
- includes de navigation et de pied de page
- PHP limité à un formulaire de contact
- base MySQL locale avec table `contact_requests`

### Cible proposée

- séparation nette entre site public et gestion interne
- architecture de données plus explicite
- possibilité d’ajouter un backend métier cohérent si nécessaire
- authentification et permissions séparées pour la Gestion interne
- éventuelle API interne si la solution se complexifie
- application interne séparée, accessible uniquement aux directeurs provisionnés

## Risques principaux

- manque de formalisation du modèle de données,
- duplication de styles et de logique,
- manque de gouvernance de déploiement,
- absence de documentation de sécurité,
- absence de séparation claire entre contenu public et outils internes.

## Conclusion

L’architecture est fonctionnelle pour un site institutionnel, mais elle n’est pas encore assez formalisée pour supporter une Gestion interne robuste sans un travail de structuration et de gouvernance.
