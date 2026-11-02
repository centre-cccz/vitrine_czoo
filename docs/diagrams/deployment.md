# Diagramme de déploiement

```mermaid
flowchart LR
    DNS[DNS / domaine]
    CDN[CDN / ressources statiques]
    Web[Serveur web]
    PHP[Runtime PHP]
    DB[(MySQL)]
    Users[Utilisateurs]

    Users --> DNS
    DNS --> Web
    Web --> PHP
    PHP --> DB
    Web --> CDN
```

## Remarque

Le diagramme représente une architecture cible usuelle et de simplicité raisonnable. Il ne doit pas être interprété comme une preuve d’existence dans le dépôt.
