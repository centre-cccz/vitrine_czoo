# Schéma de données

## État actuel

Le dépôt décrit deux environnements à distinguer :

- **Développement local** : `db.php` utilise `ccczoo` par défaut si aucune variable d'environnement n'est définie.
- **Hébergement cPanel** : la base déclarée par le Centre est `ccclezoo_CZoo`, consultable via phpMyAdmin.

En production, `db.php` charge les variables du fichier `.env` placé dans le dossier parent de `DOCUMENT_ROOT`, sans remplacer les variables déjà fournies par le serveur. Le contenu réel de la base hébergée n'a pas encore été inspecté. Le code `db.php` déclare la table `contact_requests` et initialise également des tables pour les directions, les rôles, les permissions, les utilisateurs, les journaux d'audit et des éléments/documents internes. Les migrations proposent d'autres tables métier. La présence et la compatibilité de ces tables sur cPanel restent à vérifier.

`CREATE TABLE IF NOT EXISTS` ne met pas à niveau une table existante dont les colonnes ou index seraient différents.

## Table observée : contact_requests

```sql
CREATE TABLE IF NOT EXISTS contact_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Schéma déclaré dans le code : `contact_requests`

```sql
CREATE TABLE IF NOT EXISTS contact_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Schéma cible proposé

Les migrations versionnées dans `migrations/` proposent des tables supplémentaires pour la Gestion interne et la gestion du contenu (notamment événements, médias, projets, activités et finances). Elles ne prouvent pas que ces tables sont déjà installées sur cPanel.

- utilisateurs
- directions / services
- événements
- artistes
- espaces
- partenaires
- demandes / contacts
- permissions
- logs d’activité

## Éléments à confirmer

- Structure réelle de `ccclezoo_CZoo` (tables, colonnes, index et clés étrangères), à exporter depuis phpMyAdmin sans données
- Valeurs de connexion utilisées par PHP dans cPanel ; le nom de la base seul ne détermine pas l'hôte ni l'utilisateur
- volumes de données
- logique de sauvegarde
- règles de conservation des données

## Conclusion

La base locale et la base hébergée ont des noms différents. La cohérence du schéma de production ne peut être confirmée qu'après comparaison d'un export de structure de `ccclezoo_CZoo` avec `db.php` et les migrations.

## Première migration interne

La première migration est versionnée dans `migrations/0001_internal_schema.sql`. Elle ajoute les directions, rôles,
permissions, utilisateurs, associations RBAC, journaux d’audit et éléments métier internes génériques. Le code PHP
initialise également des tables de manière idempotente pour préserver la compatibilité avec l’installation locale
actuelle. Aucun utilisateur directeur n’est créé automatiquement. Vérifier la structure existante et effectuer une
sauvegarde avant toute migration sur la base cPanel.
