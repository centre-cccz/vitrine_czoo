# Autorisation

## Principe

La Gestion interne doit appliquer le principe du moindre privilège.

## Structure recommandée

- Utilisateur
- Direction
- Administration
- Finances
- Intendance
- Bibliothèque
- Animation / Préservation culturelle

## Règles

- les utilisateurs ne doivent pas voir les données d’autres services sans autorisation,
- les actions critiques doivent être limitées à la direction ou aux services concernés,
- les permissions doivent être explicites plutôt que implicites,
- l’audit d’accès doit être journalisé.

## Première implémentation

Les permissions sont stockées dans `permissions`, reliées aux rôles par `role_permissions`, puis aux directeurs par
`user_roles`. Les pages internes et l’API vérifient côté serveur la permission correspondante. Le menu masque les
modules non autorisés, mais cette adaptation frontend ne remplace jamais le contrôle backend.

## À confirmer par le Centre

- l’organigramme exact,
- les services réellement concernés,
- les décisions de délégation de responsabilités,
- la logique de validation des décisions internes.
