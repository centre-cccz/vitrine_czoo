Migrations — Mode d'emploi (CCCZ)

But: Ce document décrit l'ordre recommandé pour appliquer les migrations et les précautions à prendre avant d'exécuter les scripts fournis dans le dépôt.

Fichiers de migration ajoutés :
- migrations/0002_content_media_events.sql  — création des tables content/media/events/projects/...
- migrations/0003_seed_roles_permissions.sql — seed idempotent des rôles et permissions

Pré-requis
1. Faire une sauvegarde complète de la base de données existante (dump SQL) avant toute modification.
2. Exécuter les migrations sur un environnement de staging ou local identique à la production (mêmes versions MySQL/MariaDB, mêmes paramètres de charset/collation).
3. Vérifier la version de MySQL/MariaDB : DATETIME(6) et JSON sont utilisés ; MySQL >= 5.7 / MariaDB >= 10.2 recommandés.
4. Vérifier que les tables existantes (users, roles, permissions, role_permissions, user_roles, internal_documents, directions, audit_logs, contact_requests) existent et que leurs colonnes sont compatibles (INT UNSIGNED pour PK/FK).

Ordre recommandé d'exécution
1. Vérifier l'état de la base (scripts/check_seeds.php) — confirme la présence des rôles/permissions (optionnel mais recommandé).
2. Appliquer migrations/0002_content_media_events.sql (CREATE TABLE IF NOT EXISTS ... ; crée les nouvelles tables et références). Ne pas exécuter sur production sans test.
3. Appliquer migrations/0003_seed_roles_permissions.sql (INSERT IGNORE pour rôles/permissions et liaisons). Ce script suppose que roles et permissions existent (ou les insère si elles n'existent pas).

Procédure simple (exemple)
1. mysqldump --single-transaction --routines --triggers --events -u root -p cczzoo > backup-pre-0002.sql
2. Sur staging : mysql -u user -p cczzoo < migrations/0002_content_media_events.sql
3. Vérifier erreurs SQL et structure (SHOW TABLES; DESCRIBE ...)
4. Sur staging : mysql -u user -p cczzoo < migrations/0003_seed_roles_permissions.sql
5. Lancer scripts/check_seeds.php pour confirmer les seeds (ou exécuter manuellement les requêtes SELECT décrites ci‑dessous)

Vérifications post-migration (non exhaustif)
- Vérifier la présence et les colonnes des tables nouvelles : media, contents, events, projects, activities, finance_entries
- Vérifier FK sans erreurs : SELECT CONSTRAINT_NAME, TABLE_NAME, REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL;
- Vérifier indexation : SHOW INDEX FROM contents; SHOW INDEX FROM events;
- Tester import sample (ex: importer les events statiques via script d'import — prévu en PHASE 3)

Rollback
- Si erreur : restaurer le dump effectué en préambule.

Remarques
- Les scripts utilisent CREATE TABLE IF NOT EXISTS et INSERT IGNORE pour limiter les effets indésirables, mais toute exécution sur une base en production doit être précédée d'une révision et d'un dump.
- Le dépôt contient encore du code (db.php) qui initialisait des tables et seeds ; après migration, il est recommandé de retirer la logique de seed de db.php et d'utiliser exclusivement les migrations pour la création/init des données de référence.

Support
- Pour assistance, fournir : SQL dump, version MySQL/MariaDB, et logs d'erreur SQL si la migration échoue.
