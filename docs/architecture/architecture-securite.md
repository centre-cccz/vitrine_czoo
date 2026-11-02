# Sécurité technique de l’architecture

## État réel

Le projet ne montre pas de modèle de sécurité formalisé. Les éléments réellement observés sont très limités :

- formulaire de contact avec validation minimale côté serveur,
- envoi de mail via `mail()`,
- connexion MySQL via PDO avec identifiants en clair dans le code,
- aucune gestion des secrets via variables d’environnement,
- pas de sécurité globale de session ou d’API.

## Risques identifiés

- identifiants de base de données codés dans `db.php`,
- logique d’envoi d’email sans protections supplémentaires,
- absence de mécanisme anti-abus pour les formulaires,
- absence de système de logs de sécurité,
- exposition de données métier potentielles dans les fichiers statiques,
- absence d’authentification au niveau du site public.

## Recommandations

- externaliser les credentials dans un fichier d’environnement ou un secret manager,
- mettre en place un système de validation plus stricte,
- utiliser des tokens CSRF sur les formulaires,
- réduire les messages d’erreur détaillés,
- sécuriser les en-têtes HTTP et la politique de dépôt,
- ne pas conserver de secrets dans le code ou la documentation.

## Conclusion

Le niveau de sécurité actuel est celui d’un site statique minimal, ce qui est acceptable pour un site public simple, mais insuffisant pour la Gestion interne et pour toute vraie logique d’administration.
