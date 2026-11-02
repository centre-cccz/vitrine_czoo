# État cible recommandé

## Objectif

Créer une architecture qui sépare clairement :

- le site public,
- la gestion interne,
- les données métier,
- les outils d’administration,
- l’infrastructure de déploiement.

## Architecture cible proposée

### Site public

- pages statiques ou quasi-statiques
- contenu institutionnel, agenda et communication
- parcours orientés vers la conversion et la découverte
- navigation optimisée et cohérente

### Gestion interne

- accès réservé à la direction et aux services concernés
- utilisateur unique, rôle, permissions
- modes d’administration des événements, partenaires, demandes et contenus
- logique métier séparée du site public

### Données

- schéma structuré,
- entités clairement identifiées,
- stockage de données par sujet métier
- règles de confidentialité et d’accès

### Sécurité

- secrets externes,
- authentification explicite,
- permissions basées sur les rôles,
- logs et gestion d’accès

## Priorité

1. stabiliser le site public,
2. documenter les flux de données,
3. formaliser les permissions,
4. concevoir la Gestion interne comme système séparé,
5. mettre en place les protections et le déploiement propre.
