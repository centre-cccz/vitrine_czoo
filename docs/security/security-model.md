# Modèle de sécurité

## Vue d’ensemble

Le site public est actuellement exposé de manière simple et peu centralisée. Il ne comporte pas encore de modèle défini de sécurité applicative.

## Éléments présents

- formulaire de contact public,
- envoi d’email,
- accès MySQL via PDO,
- fichiers statiques exposés,
- présence de documents institutionnels et d’images.

## Problèmes observés

- secrets dans le code,
- absence d’environnement séparé pour les credentials,
- validation insuffisante sur les entrées,
- pas de politique d’authentification du site public,
- pas de gestion des permissions ni de logs d’accès.

## Cadre cible

- site public sans accès administrateur,
- Gestion interne séparée avec authentification forte,
- permissions par service et par rôle,
- monitorage des accès,
- politiques d’audit et de sécurité documentaire.
