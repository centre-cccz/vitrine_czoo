# Déploiement et infrastructure

## État observé

Le dépôt ne contient pas de configuration explicite de déploiement, de CI/CD ni d’infrastructure as-code. Le projet semble être hébergé selon un modèle classique PHP/MySQL, mais la configuration réelle du serveur, du nom de domaine et du certificat HTTPS n’est pas documentée dans le code.

## Composants évidents

- site public : HTML/CSS/JS
- serveur web : PHP qui interprète le formulaire de contact
- base de données : MySQL locale / serveur MySQL
- ressources statiques : images, CSS, JS

## À confirmer

- domaine de production,
- espace d’hébergement,
- mécanisme de DNS,
- certificat SSL/TLS,
- pipeline CI/CD,
- procédures de backup et rollback,
- environnement dev / staging / prod,
- stratégie de logs et monitoring.

## Recommandation

Plutôt que d’introduire une architecture lourde, le projet doit rester simple et documenté :

- environnement unique ou standardisé,
- script de déploiement minimal,
- variables d’environnement,
- sauvegardes automatiques,
- tests de santé et validation des pages clés.
