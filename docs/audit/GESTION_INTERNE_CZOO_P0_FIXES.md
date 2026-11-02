# Correction des P0 — Gestion_Interne-CZOO

Date : 2026-08-20

## 1. P0 corrigés

| Problème | Cause | Correction | Test | Résultat |
| --- | --- | --- | --- | --- |
| Dashboard bloqué après connexion | `module_permission()` était appelée avant le chargement de `permissions.php` | Ajout de `require_once __DIR__ . '/includes/permissions.php';` avant `require_permission()` dans `dashboard.php` | Inspection statique de l’ordre des inclusions | Corrigé statiquement |

### Vérification des autres pages PHP

La convention observée est maintenant cohérente :

```text
functions.php
  ↓
db.php
  ↓
auth.php
  ↓
permissions.php
  ↓
header.php / page
```

- `auth.php` charge `functions.php` puis `db.php`.
- `header.php` charge `auth.php` puis `permissions.php`.
- `module.php` charge `auth.php` puis `permissions.php` avant d’utiliser leurs fonctions.
- `dashboard.php` charge explicitement `permissions.php` avant `module_permission()`.
- `profil.php` dépend uniquement de `auth.php` et de ses fonctions déjà chargées.
- `administration/users.php` dépend d’`auth.php`, qui fournit `Database`, CSRF et session.
- `documents/download.php` dépend d’`auth.php` avant `require_permission()`.
- `api/internal/finances.php` charge `auth.php` avant les contrôles d’authentification et permissions.
- `scripts/create-director.php` est CLI et charge `db.php` avant l’accès à la base.

Aucune autre fonction appelée avant son inclusion n’a été identifiée par l’audit statique.

## 2. P0 restant

Les P0 suivants restent ouverts et ne sont pas corrigés dans cette phase :

1. absence de validation runtime PHP/MySQL ;
2. matrice direction/rôle/permission non validée par le Centre ;
3. modèles métiers réels absents, notamment finances ;
4. HTTPS, secrets de production, sauvegardes et infrastructure non confirmés ;
5. absence de rate limiting sur l’authentification ;
6. stratégie de migrations encore incohérente : DDL/seeds dans `db.php` et migration versionnée séparée.

La correction du dashboard ne signifie pas que le système est prêt pour la production.

## 3. Tests exécutés

- [OK] vérification de la structure de `Gestion_Interne-CZoo/`
- [OK] vérification de la présence des 13 wrappers de modules
- [OK] vérification statique des inclusions dans les pages PHP
- [OK] vérification de l’ordre `permissions.php` → `module_permission()` dans `dashboard.php`
- [OK] vérification des routes protégées par `require_permission()`
- [OK] vérification statique de la protection de l’API finances
- [OK] vérification statique du lien public vers `Gestion_Interne-CZoo/login.php`
- [NON EXÉCUTÉ] lint PHP : PHP CLI absent
- [NON EXÉCUTÉ] exécution login/session/RBAC : serveur PHP et base requis
- [NON EXÉCUTÉ] migrations MySQL : serveur MySQL/MariaDB requis
- [NON EXÉCUTÉ] tests d’accès HTTP 401/403

## 4. Tests impossibles dans l’environnement actuel

Environnement recommandé pour validation :

- PHP 8.1 ou supérieur ;
- MySQL 8.0+ ou MariaDB 10.6+ ;
- extensions PHP : `pdo`, `pdo_mysql`, `mbstring` si utilisée par les évolutions futures, `json`, `openssl`, `filter` ;
- serveur Apache ou Nginx avec PHP-FPM/mod_php ;
- variables `.env` injectées par l’hébergement, sans fichier secret versionné ;
- base créée avant exécution des migrations ;
- `INTERNAL_DOCUMENTS_PATH` pointant vers un stockage hors webroot.

Commandes de validation recommandées sur un environnement PHP :

```text
php -l db.php
php -l Gestion_Interne-CZoo/dashboard.php
php -l Gestion_Interne-CZoo/includes/auth.php
php -l Gestion_Interne-CZoo/includes/permissions.php
php -l api/internal/finances.php
php migrations/runner.php
```

`migrations/runner.php` n’existe pas actuellement : la dernière commande est donc une exigence de procédure à
implémenter ultérieurement, pas une commande disponible aujourd’hui.

## 5. Risques encore présents

- expiration de session et accès HTTP non testés ;
- absence de rate limiting / verrouillage brute force ;
- `Secure` dépend de la détection HTTPS ;
- retour navigateur après logout non neutralisé par des headers anti-cache ;
- contrôles de permission non liés à la direction institutionnelle ;
- documents sans upload ni validation de fichier ;
- audit incomplet pour UPDATE, DELETE, VALIDATE, EXPORT et changements de permissions ;
- bootstrap DDL exécuté dans `db.php`, hors stratégie de migration stricte ;
- modules métier encore génériques ;
- erreurs de contraintes DB potentiellement non présentées proprement dans l’administration des comptes.

## 6. Décisions nécessitant validation du Centre

- organigramme et liste réelle des directions ;
- directeurs autorisés à provisionner ;
- matrice RBAC définitive ;
- workflows de validation et de publication ;
- modèle de données des finances et documents ;
- hébergement, HTTPS, PHP/MySQL, sauvegardes et logs ;
- statut institutionnel de l’ADR-0002, actuellement adopté techniquement mais non validé explicitement par le Centre.

## Conclusion

Le P0 d’ordre d’inclusion du dashboard est corrigé statiquement. La fondation reste à valider en runtime et plusieurs P0 d’architecture, sécurité et production restent ouverts. Cette phase s’arrête ici.
