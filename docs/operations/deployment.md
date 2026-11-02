# Déploiement

## État actuellement observé

Aucune configuration de déploiement formelle n’a été identifiée dans le dépôt. Le site semble être hébergé selon un modèle PHP/MySQL simple, mais la configuration exacte n’est pas documentée.

## Points à confirmer

- domaine et DNS,
- environnement de production,
- certificat HTTPS,
- accès FTP/SSH ou gestionnaire d’hébergement,
- pipeline CI/CD,
- stratégie de backup,
- environnement de staging.

## Recommandation

Conserver une stratégie de déploiement simple, documentée et reproductible, sans sur-architecture :

- environnement unique de production,
- scripts simples de publication,
- validation des pages critiques,
- logs et rollback documentés.
