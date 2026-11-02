# Architecture backend

## État réel

Le dépôt ne contient pas de backend moderne, de framework MVC, ni de service API centralisé. Les éléments observés se limitent à :

- `db.php` : connection PDO à MySQL
- `contact-submit.php` : envoi de formulaire et enregistrement en base

## Comportement constaté

- `Database::getInstance()` crée une connexion MySQL avec PDO
- le constructeur initialise automatiquement la table `contact_requests`
- le formulaire de contact enregistre le message et tente aussi un envoi mail en PHP

## Limites observées

- pas d’API REST documentée
- pas de couche de validation métier distincte
- pas de gestion d’erreurs centralisée
- pas d’environnement de configuration séparé
- pas de mécanisme d’authentification et d’autorisation
- pas d’outil de migration explicite

## Cible proposée

Si le projet évolue, la couche backend doit être explicitement structurée autour de :

- configuration d’environnement,
- services de données,
- validation des entrées,
- façade métier,
- API interne ou publique selon les besoins,
- journalisation et sécurité.

## Conclusion

Le backend actuel est minimaliste et compatible avec un site statique, mais insuffisant pour une Gestion interne sérieuse sans consolidation structurelle.
