# Diagramme des conteneurs

```mermaid
flowchart TB
    Browser[Navigateur du visiteur]
    Web[Serveur Web / Pages statiques]
    PHP[PHP / Formulaire de contact]
    DB[(MySQL)]
    Mail[Serveur mail]

    Browser --> Web
    Browser --> PHP
    PHP --> DB
    PHP --> Mail
```