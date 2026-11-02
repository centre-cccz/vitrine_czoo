# Périmètre du projet

## In-scope

- site public institutionnel,
- communication visuelle et éditoriale,
- pages de programmes, actualités, galerie, partenaires, contact,
- contenu historique et institutionnel,
- formulaires de contact,
- intégration d’éléments multimédias,
- documentation d’architecture et de gouvernance,
- préparation de la Gestion interne.

## Out-of-scope (phase actuelle)

- développement complet de la Gestion interne,
- mise en place d’une authentification robuste pour les agents,
- architecture backend complète,
- migration vers un framework applicatif,
- introduction de microservices ou d’outils complexes non justifiés par l’audit,
- refonte globale du système de données sans documentation préalable.

## Limites de périmètre actuelles

Le dépôt contient désormais une première application interne sous `Gestion_Interne-CZoo`. Elle couvre l’accès, les sessions, le RBAC et des modules génériques, mais les workflows métier détaillés restent à valider et à enrichir. Il est donc nécessaire de distinguer :

- le site public existant,
- la gestion interne cible proposée,
- l’infrastructure technique à confirmer.

## À confirmer par le Centre

- environnement de production exact,
- outils de déploiement et de CI/CD,
- accès de gestion au serveur,
- schéma de données métier réel,
- structure interne administrative et responsabilités exactes,
- utilisateurs autorisés à la Gestion interne.
