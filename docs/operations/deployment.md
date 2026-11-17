# Déploiement

## État actuellement observé

Le site est hébergé sur cPanel et la base de production déclarée est `ccclezoo_CZoo`. `db.php` lit les variables d'environnement et, si elles ne sont pas déjà définies par le serveur, charge le fichier `.env` situé un niveau au-dessus de `DOCUMENT_ROOT`. Sur un hébergement cPanel classique dont la racine publique est `public_html`, placer le fichier dans le dossier parent de `public_html`.

## Points à confirmer

- nom d'hôte MySQL indiqué dans cPanel,
- accès FTP/SSH ou gestionnaire d'hébergement,
- pipeline CI/CD,
- stratégie de backup,
- environnement de staging.

## Configuration des secrets sur cPanel

1. Dans le gestionnaire de fichiers cPanel, repérer `DOCUMENT_ROOT` du domaine et placer `.env` dans son dossier parent, jamais dans le dossier public.
2. Renseigner `APP_ENV=production`, `APP_URL`, `DB_HOST`, `DB_NAME=ccclezoo_CZoo`, `DB_USER`, `DB_PASS` et `DB_CHARSET=utf8mb4`. Utiliser l'hôte MySQL fourni par cPanel ; ne pas supposer qu'il est `localhost`.
3. Accorder à l'utilisateur MySQL les privilèges requis sur `ccclezoo_CZoo`.
4. Vérifier les permissions du fichier afin qu'il soit lisible par PHP, sans l'exposer aux autres utilisateurs de l'hébergement.
5. Ne pas copier le vrai fichier `.env` dans le dépôt et ne pas envoyer son contenu dans un ticket ou une conversation.
6. Après configuration, tester le site avec une requête qui utilise la base et consulter les journaux d'erreur cPanel en cas d'échec. Ne pas lancer de migration sur la production sans sauvegarde et vérification du schéma.

## Recommandation

Conserver une stratégie de déploiement simple, documentée et reproductible, sans sur-architecture :

- environnement unique de production,
- scripts simples de publication,
- validation des pages critiques,
- logs et rollback documentés.
