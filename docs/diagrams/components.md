# Diagramme des composants

```mermaid
flowchart LR
    Nav[Navigation partagée]
    Pages[Pages public]
    Scripts[Scripts JS]
    Contact[Formulaire de contact]
    DB[(contact_requests)]
    Mail[SMTP / mail]

    Pages --> Nav
    Pages --> Scripts
    Contact --> DB
    Contact --> Mail
```