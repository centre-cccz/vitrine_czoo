# Dictionnaire de données

## contact_requests

| Champ | Type | Description | Obligatoire |
| --- | --- | --- | --- |
| id | INT | Identifiant unique | Oui |
| name | VARCHAR(255) | Nom du demandeur | Oui |
| email | VARCHAR(255) | Email du demandeur | Oui |
| phone | VARCHAR(50) | Téléphone optionnel | Non |
| subject | VARCHAR(255) | Sujet de la demande | Non |
| category | VARCHAR(100) | Catégorie de demande | Non |
| message | TEXT | Contenu de la demande | Oui |
| created_at | TIMESTAMP | Date d’enregistrement | Oui |

## Données sensibles

- email,
- téléphone,
- message libre,
- contenu d’interaction avec le Centre.

## Recommandation

Les données sensibles doivent être conservées selon une vraie politique de confidentialité, avec limites, log et permissions.
