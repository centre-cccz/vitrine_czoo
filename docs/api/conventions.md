# Conventions API

## Conventions générales

- nommage des endpoints en français ou en anglais cohérent selon l’usage final
- réponse JSON standardisée
- codes HTTP explicites
- messages lisibles pour les développeurs et pour les clients
- validation des entrées obligatoire
- logs d’erreurs et d’accès

## Exemple de payload

```json
{
  "success": true,
  "data": {
    "id": 12,
    "name": "KOSKIN 2026"
  },
  "message": "Événement trouvé"
}
```

## Exemple d’erreur

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Les champs requis sont manquants"
  }
}
```

## Sécurité

- toujours sécuriser les requêtes POST
- utiliser des validations strictes
- prévenir les injections SQL/
- appliquer les permissions selon le rôle

## Remarque

Ces conventions sont indiquées comme cible architecturelle. Elles ne remplacent pas une implémentation réelle de backend.
