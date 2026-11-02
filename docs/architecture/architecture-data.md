# Architecture des données

## Données observées

Les données du site public sont essentiellement :

- contenus statiques HTML,
- images et visuels,
- fichiers institutionnels,
- données issues des formulaires de contact,
- listes de programmes et d’actualités dans les pages statiques.

## Base de données observée

La base de données est activée via `db.php` et contient, au moins, la table :

- `contact_requests`

### Table observée : contact_requests

| Colonne | Type | Description |
| --- | --- | --- |
| id | INT UNSIGNED AUTO_INCREMENT | Identifiant principal |
| name | VARCHAR(255) | Nom complet |
| email | VARCHAR(255) | Adresse électronique |
| phone | VARCHAR(50) | Téléphone optionnel |
| subject | VARCHAR(255) | Sujet |
| category | VARCHAR(100) | Catégorie de demande |
| message | TEXT | Corps du message |
| created_at | TIMESTAMP | Date d’enregistrement |

## Risques de données

- aucun chiffrement des données sensibles dans le code observé,
- pas de politique de conservation des données,
- pas de validation centralisée,
- pas d’audit ou de backup documentés,
- pas de seuil ou de classification des données pour la Gestion interne.

## Cible recommandée

- séparer les données du site public des données internes,
- définir un schéma métier clair pour les événements, artistes, espaces, partenariats et demandes,
- prévoir des permissions et des rôles,
- documenter les règles de conformité et de conservation.

## Conclusion

La donnée existante est limitée et majoritairement statique. La prochaine étape doit être une modélisation explicite avant la mise en place de la Gestion interne.
