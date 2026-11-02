# Rapport final d’audit

## 1. État général

Le projet est fonctionnel comme site institutionnel public, avec une identité culturelle forte et une structure de contenu utile. Le cœur du système est statique et lisible, mais il manque de formalisation technique, de documentation et de séparation des responsabilités.

## 2. Architecture actuelle

L’architecture actuelle est majoritairement :

- HTML/CSS/JS statique
- pages dédiées au contenu public
- composants partagés via includes
- PHP de contact et accès MySQL limité
- site public distinct de la Gestion interne prévue

## 3. Forces

- contenu institutionnel crédible et riche
- identité visuelle forte
- site orienté informationnelement et culturellement
- hiérarchie de navigation raisonnable
- présence d’une logique de formulaire de contact et d’accès à la base

## 4. Faiblesses

- structures de styles et contenus dispersés
- absence de documentation centralisée
- faible formalisation de la donnée
- pas de système d’authentification ou de permissions
- absence de politique de sécurité explicite
- peu de visibilité sur CI/CD et environnement de production

## 5. Risques

- duplication des contenus et logiques
- dépendances externes non maîtrisées
- credentials codés dans le code
- difficultés de maintenance sans documentation
- risque de complexification future si la Gestion interne est créée sans plan

## 6. Dette technique

- CSS et JS hérités ou redondants
- site public qui n’a pas encore un design system clair
- données métier non modélisées
- architecture frontend sans séparation claire des responsabilités
- backend minimaliste mais non standardisé

## 7. Problèmes de sécurité

- identifiants MySQL en clair dans le code
- absence de secrets externes
- validation du formulaire limitée
- absence de logs de sécurité et de monitoring
- pas de gestion des permissions

## 8. Problèmes UX

- page d’accueil trop dense dans son état historique
- duplication d’informations sur les événements
- parcours d’orientation parfois insuffisamment guidés
- nécessité d’une hiérarchie éditoriale plus claire

## 9. Problèmes de performance

- plusieurs ressources chargées sans optimisation centralisée
- images volumineuses et non compressées selon certains cas
- scripts et CSS multiples à gérer

## 10. Architecture recommandée

- stabiliser le site public comme socle
- formaliser la donnée et le flux de contact
- séparer le site public et la Gestion interne
- utiliser des permissions et profils dès la conception de l’outil interne
- garder une architecture simple, fiable, documentée

## 11. Priorités

1. Documentation technique et architecture cible
2. Stabilisation du site public
3. Modélisation des données
4. Sécurisation des accès et variables d’environnement
5. Conception de la Gestion interne
6. Déploiement et gouvernance

## 12. Roadmap

- Phase 0 : audit et documentation
- Phase 1 : stabilisation du site public
- Phase 2 : architecture backend
- Phase 3 : base de données
- Phase 4 : authentification
- Phase 5 : Gestion interne
- Phase 6 : connexion site public / gestion interne
- Phase 7 : tests et sécurité
- Phase 8 : déploiement production
- Phase 9 : monitoring et maintenance

## 13. Décisions nécessitant validation humaine

- architecture exacte du système de production,
- accès réel à la base et aux serveurs,
- périmètre de la Gestion interne,
- rôles et utilisateurs autorisés,
- décision de technologie backend si demande métier claire,
- politiques de sauvegarde et de confidentialité,
- stratégie de déploiement et d’hébergement.
