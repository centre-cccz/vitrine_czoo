# Rapport de livraison — première version Gestion_Interne-CZOO

## Statut

Première version fonctionnelle du périmètre de fondation, prête pour revue technique et validation de l’environnement PHP/MySQL. Le déploiement de production n’est pas déclaré réalisé : l’infrastructure réelle reste à confirmer.

## A. Créé

- application PHP interne sous `Gestion_Interne-CZoo/`,
- login, authentification, déconnexion et expiration de session,
- RBAC avec directions, rôles, permissions et associations,
- dashboard et profil directeur,
- modules protégés pour administration, personnel, finances, intendance, bibliothèque, culture & arts, activités, projets, espaces, patrimoine, partenaires, documents et rapports,
- gestion des comptes directeurs réservée à `admin.users`,
- audit logs,
- API interne de lecture des finances,
- migration SQL et script CLI de création d’un directeur,
- interface interne responsive et distincte du site public.

## B. Modifié

- `db.php` : schéma idempotent de fondation, accès aux utilisateurs, permissions, items internes et audit,
- footer public : ajout discret de l’accès « Espace professionnel »,
- documentation d’architecture, sécurité, API, base de données et contexte IA,
- ADR-0002 marqué accepté.

## C. Supprimé

Aucun fichier fonctionnel n’a été supprimé.

## D. Structure interne

`Gestion_Interne-CZoo/` contient les routes d’authentification, le dashboard, le profil, les includes de sécurité et de présentation, les modules métier, les assets CSS et les routes d’administration des comptes.

## E. Base de données

Tables ajoutées ou initialisées : `directions`, `roles`, `permissions`, `users`, `user_roles`, `role_permissions`,
`audit_logs`, `internal_items`, `internal_documents`. `contact_requests` est conservée. La migration source est
`migrations/0001_internal_schema.sql`.

## F. API

`GET /api/internal/finances.php` exige une session et `finances.read`. Toute absence de session renvoie 401 et toute
permission insuffisante renvoie 403.

## G. Authentification

Les mots de passe sont hashés avec `password_hash()` et vérifiés avec `password_verify()`. La session est régénérée à
la connexion, protégée par cookie HttpOnly/SameSite et Secure sous HTTPS, puis expirée après 30 minutes d’inactivité.

## H. RBAC

Les permissions sont évaluées côté backend via `require_permission()`. Le menu interne masque également les modules non
autorisés, sans se substituer à la protection serveur.

## I. Sécurité

- CSRF sur les formulaires internes,
- requêtes PDO préparées,
- échappement HTML via `e()`,
- contrôle des routes et de l’API,
- journalisation des connexions, déconnexions, refus et créations,
- aucun compte ou mot de passe par défaut.

## J. Tests effectués

- inspection statique des routes, inclusions, permissions et chemins,
- vérification de la présence des migrations et du script de provisionnement,
- tentative de lint PHP : impossible dans l’environnement courant car la commande `php` n’est pas installée.

## K. Build

Pas de build frontend requis. Le lint PHP doit être exécuté sur une machine disposant de PHP CLI avant déploiement.

## L. Déploiement

Non réalisé. Le serveur PHP/MySQL, les variables d’environnement, HTTPS, sauvegardes et le mécanisme de publication doivent
être confirmés par le Centre.

## M. Limites restantes

- les workflows métiers détaillés restent génériques et doivent être validés par direction,
- aucun upload de document interne n’est encore exposé ; les fichiers confidentiels ne doivent pas être placés dans le webroot,
- un endpoint de téléchargement sécurisé existe, mais nécessite `INTERNAL_DOCUMENTS_PATH` et une procédure d’upload validée,
- aucun verrouillage/rate limiting avancé n’est encore implémenté sur le login,
- les tests automatisés nécessitent un environnement PHP/MySQL.

## N. Validations requises

- confirmer l’organigramme et la matrice de permissions,
- confirmer l’infrastructure de production,
- valider la politique documentaire et la conservation des données,
- effectuer un test d’intégration PHP/MySQL puis une revue de sécurité avant production.
