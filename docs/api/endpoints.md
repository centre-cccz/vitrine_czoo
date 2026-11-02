# Endpoints de référence

## Endpoints existants

### Formulaire de contact

| Endpoint | Méthode | Auth | Description |
| --- | --- | --- | --- |
| `contact-submit.php` | POST | Public | Enregistre une demande de contact et tente l’envoi email |

### Observations

- le script accepte des données diverses : nom, email, téléphone, sujet, catégorie et message
- il redirige vers `contact.html?success=1` ou `contact.html?error=1`

## Endpoints cibles proposés

| Endpoint | Méthode | Niveau | Objet |
| --- | --- | --- | --- |
| `/api/events` | GET | Public | Liste des événements |
| `/api/events/{id}` | GET | Public | Détails d’un événement |
| `/api/news` | GET | Public | Actualités |
| `/api/partners` | GET | Public | Partenaires |
| `/api/contact` | POST | Public | Demande de contact |
| `/api/internal/events` | GET/POST | Protégé | Gestion des événements internes |
| `/api/internal/users` | GET/POST | Protégé | Gestion des utilisateurs |

## Implémenté

| `/api/internal/finances.php` | GET | Session + `finances.read` | Liste les éléments financiers internes sans exposer les données aux visiteurs |

## Note

Ces endpoints sont une proposition cible. Ils ne doivent pas être présentés comme existants tant qu’ils ne sont pas effectivement implémentés.
