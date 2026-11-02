# Authentification

## État actuel

Aucune authentification utilisateur n’est observée pour le site public. Le système est essentially public.

## Cible proposée

Pour la Gestion interne :

- compte individuel,
- mot de passe sécurisé,
- gestion des utilisateurs par la direction,
- rôle par service ou fonction,
- actions limitées selon autorisations.

## Recommandation

- utiliser un système de session ou de token standard,
- autoriser l’accès uniquement via HTTPS,
- stocker les mots de passe hachés,
- mettre en place un mécanisme de verrouillage après plusieurs échecs,
- documenter les niveaux de permissions.

## Première implémentation

`Gestion_Interne-CZoo/` utilise des sessions PHP avec cookies `HttpOnly`, `SameSite=Lax`, `Secure` lorsque HTTPS est
actif, régénération de l’identifiant de session après connexion, expiration après 30 minutes, déconnexion et
redirection des routes protégées vers `login.php`. Les mots de passe sont provisionnés uniquement via
`scripts/create-director.php` et stockés avec `password_hash()`.
