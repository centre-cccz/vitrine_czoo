# Authentification API

## État actuel

Aucune authentification API n’est documentée pour le site public. Le formulaire de contact ne s’appuie pas sur un token ou un mécanisme d’authentification.

## Cible recommandée

Pour la Gestion interne :

- authentification par compte individuel,
- mot de passe sécurisé,
- MFA si possible selon les capacités du Centre,
- JWT ou session server-side selon la stack finale,
- rôles simples : Utilisateur, Direction, Administration, etc.

## Recommandation de sécurité

- jamais stocker les secrets dans le dépôt,
- utiliser des variables d’environnement,
- garantir les lignes de protection côté serveur,
- utiliser le HTTPS en production,
- limiter les appels aux endpoints sensibles.
