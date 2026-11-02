# Audit de sécurité

| Risque | Gravité | Probabilité | Impact | Recommandation |
| --- | --- | --- | --- | --- |
| identifiants MySQL en clair | Critique | Élevée | Élevé | externaliser dans un secret manager / variables d’environnement |
| absence d’environnement de configuration | Haute | Élevée | Élevé | séparer dev / prod / secrets |
| formulaire contact sans anti-abus | Moyenne | Moyenne | Moyen | captcha, validation et rate limiting |
| absence d’authentification | Élevée | Élevée | Élevé | définir un système d’authentification pour la Gestion interne |
| manque de logs de sécurité | Moyenne | Élevée | Moyen | journaux d’accès et d’erreurs |
| permissions non définies | Haute | Moyenne | Élevé | établir un RBAC explicite |
| données sensibles non classées | Moyenne | Moyenne | Moyen | créer un dictionnaire, règles de conservation et accès |

## Conclusion

La sécurité actuelle est minimale et adaptée à un site public simple, mais elle ne répond pas aux exigences d’un système interne ou d’administration.
