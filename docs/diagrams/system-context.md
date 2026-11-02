# Diagramme de contexte

```mermaid
flowchart LR
    Visitor[Visiteur]
    Public[Site public du Centre Le Zoo]
    Internal[Gestion interne future]
    DB[(Base de données)]
    Mail[Email / service de communication]
    External[Services externes]

    Visitor --> Public
    Public --> DB
    Public --> Mail
    Internal --> DB
    Internal --> External
```