# Contexte IA – Centre culturel congolais Le Zoo

## Contexte général

Le projet est un site public institutionnel du Centre Culturel Congolais « Le Zoo ». Il est conçu comme une plateforme de communication culturelle, de programmation, d’information, de contact et de valorisation des activités du Centre.

## Architecture constatée

- HTML / CSS / JavaScript statique
- includes partagés pour le header et footer
- PHP limité à la gestion de formulaire de contact
- MySQL local avec table `contact_requests`
- dossier `Gestion_Interne-CZoo` : application interne PHP première version, avec login, sessions, RBAC et modules

## Règles importantes

- ne pas confondre l’état réel et l’état cible,
- ne pas inventer des technologies ou des systèmes non observés,
- prioriser la simplicité, la sécurité et la maintenance,
- documenter les décisions importantes dans `docs/adr/` et les changements structurants via `docs/rfcs/`,
- ne pas partir d’un backend complexe sans nécessité démontrée.

## Ce qui est autorisé

- documentation technique,
- audit de l’architecture et de la sécurité,
- refonte de la page d’accueil si nécessaire,
- amélioration des composants publics déjà existants,
- préparation de la Gestion interne dans une logique structurée.

## Ce qui n’est pas autorisé sans validation explicite

- développement complet de la Gestion interne,
- changement de technologies de production sans validation du Centre,
- refonte majeure du système de données sans plan,
- introduction d’authentification ou d’API interne non documentées,
- ajout de dépendances lourdes ou de services complexes non justifiés.

## Sources de vérité

- `docs/README.md` : point d’entrée
- `docs/architecture/` : architecture
- `docs/adr/` : décisions architecturales
- `docs/api/` : contrats et conventions
- `docs/database/` : données et schéma
- `docs/security/` : sécurité
- `docs/roadmap/` : évolution
- `docs/operations/` : déploiement et maintenance
- `docs/governance/` : bonnes pratiques
- `docs/audit/` : état actuel et cible

## Test et validation

- vérifier les pages les plus importantes : accueil, programmes, actualités, contact, galerie
- vérifier la navigation et la cohérence visuelle
- valider les formulaires de contact en tenant compte de la configuration réelle
- ne pas introduire de dépendances sans documentation

## À confirmer par le Centre

- production, hébergement, environnement de déploiement,
- CI/CD réel,
- variables d’environnement,
- schéma de données métier complet,
- organe directeur et responsabilités internes,
- utilisateurs et permissions de la Gestion interne.
