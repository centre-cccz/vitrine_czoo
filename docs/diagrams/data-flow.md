# Flux de données

```mermaid
flowchart LR
    User[Demandeur]
    Contact[Formulaire contact]
    Script[contact-submit.php]
    DB[(contact_requests)]
    Mail[Mail de notification]
    Admin[Direction / service]

    User --> Contact
    Contact --> Script
    Script --> DB
    Script --> Mail
    Mail --> Admin
```
