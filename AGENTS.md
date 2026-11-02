# AGENTS.md

## Mission

Ce dépôt appartient au Centre Culturel Congolais « Le Zoo ». Le but est de maintenir un site public institutionnel clair, crédible et orienté vers l’action, tout en préparant une Gestion interne structurée et sécurisée.

## Règles

- lire d’abord la documentation du dossier `docs/`
- distinguer l’état actuel de l’état cible
- ne pas inventer de technologies non documentées
- ne pas traiter la Gestion interne comme une implémentation déjà existante
- préférer la simplicité, la fiabilité et la maintenabilité
- documenter les changements significatifs

## Zones importantes

- `accueil.html` : point d’entrée public
- `programmes.html` : catalogue des activités
- `actualites.html` : actualités et agenda
- `contact-submit.php` : zone de traitement du contact
- `db.php` : layer de données MySQL
- `docs/` : source de vérité structurelle
- `Gestion_Interne_CZoo/` : future architecture interne à traiter avec précaution

## Points de vigilance

- identifiants MySQL et secrets de configuration doivent rester hors du dépôt
- la page d’accueil doit éviter les doublons de contenus et les sections redondantes
- la Gestion interne doit rester séparée du site public
- la documentation doit être la source de vérité pour toute évolution majeure

## Procédure recommandée

1. lire `docs/README.md`
2. vérifier l’état réel avant toute modification
3. documenter les impacts si le changement est majeur
4. utiliser ADR / RFC pour les décisions structurées
5. valider le comportement et la sécurité avant mise en production
