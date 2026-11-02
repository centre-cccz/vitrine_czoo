# Schéma de données

## État actuel

Le schéma réellement observé est minimal. Il existe un wrapper de base de données et une table de contact.

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

## Schéma cible proposé

Le schéma cible pour la Gestion interne devra inclure au minimum :

- utilisateurs
- directions / services
- événements
- artistes
- espaces
- partenaires
- demandes / contacts
- permissions
- logs d’activité

## Eléments à confirmer

- SGBD réel utilisé en production
- conventions de nommage exactes
- volumes de données
- logique de sauvegarde
- règles de conservation des données

## Conclusion

Le schéma actuel est fonctionnel pour un site public réduit. Le schéma cible doit être formalisé avant la mise en place de la Gestion interne.

## Première migration interne

La première migration est versionnée dans `migrations/0001_internal_schema.sql`. Elle ajoute les directions, rôles,
permissions, utilisateurs, associations RBAC, journaux d’audit et éléments métier internes génériques. Le code PHP
initialise également ces tables de manière idempotente pour préserver la compatibilité avec l’installation locale
actuelle. Aucun utilisateur directeur n’est créé automatiquement.
