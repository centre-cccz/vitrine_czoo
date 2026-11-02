# ADR-0002 — Externalisation des identifiants et configuration de la base de données

## Statut
Accepté

## Contexte

Le fichier `db.php` actuel contient les identifiants de connexion à la base de données en clair :

    $host = '127.0.0.1';
    $db   = 'ccczoo';
    $user = 'root';
    $pass = '';

Conserver des identifiants en dur dans le code est un risque de sécurité et rend la configuration peu portable entre environnements (dev/staging/production).

## Problème

- Secrets (credentials) versionnés dans le dépôt risquent d'être exposés.
- Déploiement multi-environnements (dev/staging/prod) impossible sans modifier le code.
- Meilleures pratiques non respectées (variables d'environnement, secret manager).

## Décision

- Lire la configuration de connexion (host, database, user, password, charset) via des variables d'environnement standardisées : DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_CHARSET.
- Fournir un fichier d'exemple `.env.example` dans le dépôt documentant les variables attendues.
- Mettre en place une convention documentaire (docs/operations/deployment.md) et créer l'ADR afin de tracer la décision.
- Le code continuera de disposer de valeurs par défaut compatibles localement (fallback) pour faciliter le développement local immédiat, mais ces valeurs ne doivent pas être utilisées en production. L'utilisation en production doit être configurée via variables d'environnement ou un gestionnaire de secrets.

## Alternatives étudiées

1. Laisser les identifiants en dur (rejetée — risque sécurité élevé).
2. Introduire un gestionnaire de secrets externe (ex : Vault) (retenue comme option future — complexité non justifiée pour phase initiale).
3. Utiliser un fichier `.env` versionné (rejetée — secrets dans le dépôt). 

## Conséquences

- Le code lira désormais les variables d'environnement ; les environnements de déploiement devront définir ces variables.
- Il faudra s'assurer que les environnements (staging, prod) ne laissent pas d'identifiants en clair dans le repo.
- Les déploiements devront inclure la configuration des variables d'environnement (ou l'utilisation d'un secret manager).
- Documenter la procédure de déploiement et la configuration des secrets dans `docs/operations/deployment.md`.

## Plan d'action

1. Créer `docs/adr/ADR-0002-db-credentials.md` (ce document).
2. Mettre à jour `db.php` pour lire les variables d'environnement, avec fallback local.
3. Ajouter `.env.example` à la racine avec les clés nécessaires documentées.
4. Mettre à jour `docs/operations/deployment.md` pour inclure la gestion des variables d'environnement.
5. Suggérer à l'équipe d'introduire à terme un secret manager pour la production.

## Date
2026-08-19

## Auteur
Architecture technique — CCC Le Zoo

## Review notes (commentaires de relecture)

- Recommander d'ajouter également une vérification à l'initialisation : si l'application est en production et qu'aucune variable DB_PASS n'est fournie, refuser le démarrage (fail-fast). Cette règle peut être ajoutée au script de déploiement ou au code si APP_ENV === 'production'.
- Recommander d'ajouter `.env.example` et d'insister dans la documentation pour ne jamais committer un fichier `.env` réel.
- Recommander de documenter comment mettre en place ces variables dans l'environnement d'hébergement choisi (cPanel, systemd, Docker, PaaS, etc.).
