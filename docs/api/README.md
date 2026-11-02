# API et interfaces

## État observé

Le projet ne dispose pas d’API publique documentée ni de service backend formel. L’interface observable est surtout le formulaire de contact et la base de données sous-jacente.

La première API interne implémentée est `api/internal/finances.php`. Elle exige une session active et la permission
`finances.read`, et renvoie uniquement des éléments internes via une réponse JSON standardisée.

## Interface présente

### Formulaire de contact

- fichier : `contact-submit.php`
- méthode : POST
- action : sauvegarde du message et envoi mail

## Interface cible recommandée

À la suite de l’audit, si un backend est ajouté, l’API devra être structurée par domaine métier :

- événements
- artistes
- espaces
- partenariats
- demandes internes
- authentification / sessions

## Convention de base

- format : REST JSON si API sérialisée
- authentification : selon rôle et contexte
- codes HTTP : 200, 201, 204, 400, 401, 403, 404, 409, 500
- réponse standardisée : succès, erreur, message

## Limite de cette phase

Aucune API réelle n’a été observée comme production. La documentation ci-dessous doit être lue comme une base de conception cible, pas comme une API existante.
