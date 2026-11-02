# Revue d’audit — Gestion_Interne-CZOO

Date de l’audit : 2026-08-20  
Périmètre : code réellement présent, dépendances locales, documentation du projet et configuration observée.  
Règle appliquée pendant l'audit initial : aucune nouvelle fonctionnalité et aucune modification corrective. La
correction P0 est documentée ci-dessous après la phase d'audit.

## 1. État général

`Gestion_Interne-CZOO` est une première tranche PHP structurée autour d’un login, de sessions, d’un RBAC, d’un dashboard, de modules génériques et d’une API interne. Elle n’est **pas prête pour la production**.

Elle contient une fondation technique réelle, mais la plupart des modules annoncés sont des écrans CRUD génériques sur la table `internal_items`, et non des modules métier institutionnels complets. Plusieurs garanties annoncées dans la documentation restent partielles ou non testées.

### Erreur bloquante identifiée

`dashboard.php` appelle `module_permission()` aux lignes 13-15 avant d’inclure `permissions.php`. Or cette fonction est définie uniquement dans `includes/permissions.php`, qui n’est inclus qu’ensuite par `includes/header.php`.

**Effet probable :** erreur fatale `Call to undefined function module_permission()` après une authentification réussie.  
**Statut :** P0 corrigé dans la phase suivante : `dashboard.php` charge désormais `includes/permissions.php` avant
l’appel à `module_permission()`. Le runtime PHP reste à vérifier sur un environnement PHP/MySQL réel.

## 2. Arborescence réelle

```text
Gestion_Interne-CZoo/
├── index.html                         (vide, héritage/placeholder)
├── login.html                         (vide, héritage/placeholder)
├── login.php                          (connexion)
├── authenticate.php                   (traitement de connexion)
├── logout.php                         (déconnexion)
├── dashboard.php                      (tableau de bord)
├── profil.php                         (profil en lecture)
├── module.php                         (contrôleur générique des modules)
├── includes/
│   ├── auth.php                       (session, authentification de route, permissions)
│   ├── functions.php                  (échappement, CSRF, flash, redirections)
│   ├── permissions.php                (labels et permission de module)
│   ├── header.php                     (shell interne et sidebar)
│   └── footer.php                     (footer et JS interne)
├── administration/
│   ├── index.php                      (wrapper CRUD générique)
│   └── users.php                      (création/liste de directeurs)
├── personnel/index.php
├── finances/index.php
├── intendance/index.php
├── bibliotheque/index.php
├── culture-arts/index.php
├── activites/index.php
├── projets/index.php
├── espaces/index.php
├── patrimoine/index.php
├── partenaires/index.php
├── documents/
│   ├── index.php                      (wrapper CRUD générique)
│   └── download.php                   (téléchargement protégé, sans upload)
├── rapports/index.php
└── assets/
    ├── css/app.css
    └── js/app.js
```

Dépendances principales :

```text
Gestion_Interne-CZoo
        ├── ../db.php
        ├── ../images/logos/CZoo_Profil.svg
        ├── ../api/internal/finances.php
        ├── ../migrations/0001_internal_schema.sql
        └── ../scripts/create-director.php
```

## 3. Inventaire fonctionnel réel

| Élément | Fonction prévue | État réel | Réellement fonctionnel ? | Dépendances |
| --- | --- | --- | --- | --- |
| `login.php` | Formulaire de connexion | Formulaire PHP avec CSRF et session | Oui sous PHP/MySQL, non testé en runtime | `auth.php`, `functions.php`, `app.css` |
| `authenticate.php` | Vérifier les identifiants et créer la session | `password_verify()`, compte actif, régénération, permissions | Oui conceptuellement | `db.php`, session PHP |
| `logout.php` | Détruire la session | Session vidée, cookie supprimé, audit tenté | Oui conceptuellement | `auth.php`, `db.php` |
| `dashboard.php` | Pilotage directeur | Indicateurs simples et activités génériques | Partiellement fonctionnel ; ordre d'inclusion P0 corrigé statiquement, runtime non testé | `permissions.php`, `db.php` |
| `profil.php` | Afficher le profil | Lecture seule | Partiellement | session |
| `administration/users.php` | Gérer les comptes directeurs | Création et listing uniquement | Partiellement | `admin.users`, `users`, `directions` |
| `module.php` | Liste/création générique | Liste et création d’`internal_items` | Partiellement | `internal_items`, permission `.read` et `.create` |
| `documents/download.php` | Télécharger un document protégé | Vérification session, permission, chemin hors webroot | Partiellement | `internal_documents`, `INTERNAL_DOCUMENTS_PATH` |
| `api/internal/finances.php` | API finances | Liste générique `internal_items` | Partiellement | session, `finances.read`, MySQL |
| `assets/css/app.css` | Interface interne | Shell responsive sobre | Oui visuellement, non validé navigateur | HTML/PHP |
| `assets/js/app.js` | Désactiver le bouton après submit | JS minimal | Oui si JS chargé | footer interne |

## 4. Comparaison documentation / code

| Documentation | Ce qui était prévu | Ce qui a été codé | Écart |
| --- | --- | --- | --- |
| Architecture | Site public séparé d’une gestion interne PHP | Séparation de dossiers et shell interne | Conforme sur la structure |
| Authentification | Compte individuel, mot de passe hashé, session sécurisée | Implémenté dans `authenticate.php` et `auth.php` | Partiel : brute force et tests runtime absents |
| RBAC | Utilisateur → direction → rôle → permissions | Tables et contrôle par permission | Partiel : la direction n’est pas utilisée dans les autorisations |
| Dashboard | Pilotage avec alertes, échéances, indicateurs et rapports | Trois cartes simples, activités génériques, section vide | Partiel |
| Modules métier | Gestion métier propre par domaine | Wrappers presque identiques sur `internal_items` | Non conforme au cahier métier détaillé |
| Finances | Budgets, recettes, dépenses, engagements, pièces, rapports | Liste/création générique sans modèle financier | Non conforme, architecture seulement |
| Documents | Documents internes sécurisés | Table + téléchargement protégé | Partiel, upload absent |
| API | Endpoints documentés, auth + permission + validation | Un seul endpoint GET finances | Partiel |
| Audit | LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VALIDATE, DOWNLOAD, EXPORT, permission changes | Seulement LOGIN, LOGOUT, CREATE, DOWNLOAD, ACCESS_DENIED | Non conforme |
| Database | Migrations contrôlées et schéma explicite | Migration ajoutée, mais bootstrap DDL encore exécuté à chaque connexion | Partiel |
| Déploiement | CI/CD, HTTPS, backups, monitoring | Aucun de ces éléments dans le dépôt | Non implémenté |
| UX directeurs | Bonjour, direction, tâches, échéances, notifications | Bonjour, direction, compteur de permissions, session active | Partiel |

## 5. ADR et décisions

### ADR-0001

`ADR-0001-template.md` est uniquement un modèle. Ce n’est pas une décision.

### ADR-0002 — Identifiants DB

- Statut textuel actuel : **Accepté**
- Accepté techniquement dans le code : **Oui**
- Validé par l’utilisateur dans cette revue : **Non explicitement**
- Validé institutionnellement par le Centre : **Non**
- Validation nécessaire : configuration réelle de production, méthode de gestion des secrets, rotation des credentials.

Le statut `Accepté` du fichier signifie une adoption documentaire/technique locale, pas une approbation institutionnelle.

### Décisions non couvertes par un ADR adopté

- modèle exact de la Gestion interne,
- matrice institutionnelle des directions et permissions,
- choix de déploiement,
- politique documentaire,
- workflow de validation/publication,
- rétention des logs et données.

**État : À VALIDER PAR LE CENTRE.**

## 6. Base de données réellement définie

### Relations RBAC

```text
users
  ├── direction_id → directions.id
  └── user_roles.user_id

user_roles
  └── role_id → roles.id

roles
  └── role_permissions.role_id

role_permissions
  └── permission_id → permissions.id

permissions
```

Relations complémentaires :

```text
directions 1 ─── N users
users 1 ─── N audit_logs
users 1 ─── N internal_items (created_by)
users 1 ─── N internal_items (updated_by)
users 1 ─── N internal_documents (uploaded_by)
```

### Contraintes et index observés

- clés primaires présentes sur toutes les tables principales ;
- unicité sur `directions.name`, `roles.name`, `permissions.name`, `users.email` ;
- clé composite sur `user_roles` et `role_permissions` ;
- foreign keys présentes ;
- `ON DELETE CASCADE` sur associations RBAC ;
- `ON DELETE SET NULL` pour `audit_logs.user_id` ;
- index sur les dates et références d’audit ;
- index sur module/statut de `internal_items` ;
- timestamps présents sur les tables principales.

### Incohérences

1. `migrations/0001_internal_schema.sql` ne crée pas `contact_requests`, alors que `db.php` le fait.
2. La migration ne contient pas les seeds de directions, rôles et permissions présents dans `db.php`.
3. Il n’existe pas de table de suivi des migrations.
4. `db.php` exécute du DDL et des seeds à chaque initialisation de connexion, ce qui contredit une stratégie de migrations contrôlées.
5. `internal_items` est un modèle générique sans relations métier.
6. La table `internal_documents` stocke un MIME fourni par la base, sans pipeline de validation d’upload.
7. Aucune politique de rétention, anonymisation ou archivage n’est codée.

## 7. RBAC réel

### Directeurs présents

**Aucun directeur n’est créé automatiquement.** Le dépôt ne contient donc aucun directeur identifiable dans la base sans exécution de `scripts/create-director.php`.

### Directions seedées par le code

Ces valeurs sont techniques et doivent être confirmées institutionnellement :

- Direction Générale
- Direction Administrative
- Direction Financière
- Direction de l’Intendance
- Direction de la Bibliothèque
- Direction de l’Animation et de la Préservation culturelle

### Rôles seedés

- `directeur`
- `administrateur`

### Permissions seedées

- `dashboard.read`
- `profile.read`
- `profile.update`
- `administration.read`
- `personnel.read`
- `finances.read`
- `finances.create`
- `finances.update`
- `intendance.read`
- `bibliotheque.read`
- `culture-arts.read`
- `activites.read`
- `projets.read`
- `espaces.read`
- `patrimoine.read`
- `partenaires.read`
- `documents.read`
- `documents.download`
- `rapports.read`
- `admin.users`
- `audit.read`

### Attribution réelle

- `administrateur` reçoit toutes les permissions seedées.
- `directeur` reçoit les permissions dont le nom se termine par `.read`, ainsi que `profile.update`.
- aucun directeur n’est lié automatiquement ;
- le script CLI lie tout nouveau directeur au rôle `directeur`.

### Matrice actuelle

| Direction | Rôle | Module | Lire | Créer | Modifier | Valider | Supprimer | Exporter |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Toute direction seedée | `directeur` | Tous les modules génériques | Oui selon `.read` | Non | Non | Non | Non | Non |
| Toute direction seedée | `administrateur` | Tous les modules seedés | Oui | Oui seulement si permission explicite | Non | Non | Non | Non |

Cette matrice n’est pas une matrice institutionnelle validée. La direction est enregistrée dans la session et les données, mais ne restreint pas actuellement l’accès aux modules.

**Matrice définitive : À VALIDER PAR LE CENTRE.**

## 8. Vérification des 13 modules

| Module | Page | Base | Backend | API | Permissions | Audit | CRUD réel | État |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Administration | `administration/index.php`, `users.php` | `internal_items`, `users` | Liste/création générique + création compte | Non | `administration.read`, `admin.users` | CREATE compte | Create/list seulement | 🟡 |
| Personnel | `personnel/index.php` | `internal_items` | Générique | Non | `personnel.read` | CREATE si autorisé | Create/list générique | 🟡 |
| Finances | `finances/index.php` | `internal_items` | Générique | `api/internal/finances.php` | `finances.read/create/update` | CREATE seulement | Create/list générique | 🟡 |
| Intendance | `intendance/index.php` | `internal_items` | Générique | Non | `intendance.read` | CREATE si permission future | List, création seulement si permission | 🟡 |
| Bibliothèque | `bibliotheque/index.php` | `internal_items` | Générique | Non | `bibliotheque.read` | CREATE si permission future | Générique | 🟡 |
| Culture & Arts | `culture-arts/index.php` | `internal_items` | Générique | Non | `culture-arts.read` | CREATE si permission future | Générique | 🟡 |
| Activités | `activites/index.php` | `internal_items` | Générique | Non | `activites.read` | CREATE si permission future | Générique | 🟡 |
| Projets | `projets/index.php` | `internal_items` | Générique | Non | `projets.read` | CREATE si permission future | Générique | 🟡 |
| Espaces | `espaces/index.php` | `internal_items` | Générique | Non | `espaces.read` | CREATE si permission future | Générique | 🟡 |
| Patrimoine | `patrimoine/index.php` | `internal_items` | Générique | Non | `patrimoine.read` | CREATE si permission future | Générique | 🟡 |
| Partenaires | `partenaires/index.php` | `internal_items` | Générique | Non | `partenaires.read` | CREATE si permission future | Générique | 🟡 |
| Documents | `documents/index.php`, `download.php` | `internal_items`, `internal_documents` | Liste générique + téléchargement | Non | `documents.read/download` | DOWNLOAD | Upload absent | 🟡 |
| Rapports | `rapports/index.php` | `internal_items` | Générique | Non | `rapports.read` | CREATE si permission future | Générique | 🟡 |

**Conclusion :** aucun des 13 modules n’est un workflow métier complet. Ce sont des fondations d’interface et de stockage générique.

## 9. Authentification — scénarios

| Scénario | Garantie du code |
| --- | --- |
| Mauvais mot de passe | Refus générique ; audit seulement si l’utilisateur existe |
| Compte inexistant | Refus générique ; aucune tentative anonyme journalisée |
| Compte désactivé | Refus via `is_active` |
| Session expirée | Contrôle de `last_activity` après 1800 secondes d’inactivité |
| Dashboard sans session | Redirection via `require_permission` ; l'ordre d'inclusion de `permissions.php` a été corrigé avant l'appel à `module_permission()` |
| Module non autorisé | 403 via `require_permission`, audit `ACCESS_DENIED` |
| API sans session | 401 dans `api/internal/finances.php` |
| Logout puis retour navigateur | Session détruite ; absence de headers anti-cache, donc une page peut rester visible depuis le cache navigateur |

Points manquants :

- rate limiting / verrouillage après tentatives répétées ;
- MFA ;
- rotation périodique de session ;
- headers de cache explicites pour les pages internes ;
- tests d’intégration.

## 10. Audit sécurité

| Domaine | Niveau | Constat |
| --- | --- | --- |
| SQL injection | OK sur les chemins inspectés | PDO préparé pour les entrées ; quelques requêtes statiques directes |
| XSS | Moyen | `e()` utilisé dans les vues inspectées ; le contrôle ne couvre pas d’éventuelles futures vues |
| CSRF | Moyen | token sur login et formulaires internes ; pas de preuve de rotation ni de tests |
| Session fixation | Moyen/OK | `session_regenerate_id(true)` après connexion |
| Session hijacking | Élevé | `Secure` seulement si HTTPS détecté ; HTTPS production non garanti |
| Brute force | Élevé | aucun rate limiting ni verrouillage |
| Path traversal | Moyen/OK | contrôle `realpath` et confinement dans `INTERNAL_DOCUMENTS_PATH` |
| Upload malveillant | Non applicable actuellement | aucun upload implémenté ; risque futur élevé |
| File inclusion | Moyen/OK | includes statiques, module contrôlé par wrappers ; pas d’include basé directement sur l’URL |
| IDOR | Élevé | téléchargement par ID vérifie permission globale mais pas une autorisation documentaire fine |
| Privilege escalation | Élevé | `direction_id` n’est pas utilisé dans l’autorisation ; le rôle `directeur` reçoit tous les `.read` |
| Information disclosure | Moyen | messages internes génériques ; erreurs PDO peuvent remonter sur `users.php` |
| Secrets | Moyen/OK | `.env` ignoré, `.env.example` sans secret réel ; fallback local root vide dangereux si mal déployé |

## 11. Documents internes

### Statut

**À CONSTRUIRE.**

### Présent

- table `internal_documents`,
- endpoint `documents/download.php`,
- contrôle de session,
- permission `documents.download`,
- chemin configuré hors webroot,
- vérification de confinement du chemin.

### Absent

- upload,
- validation extension,
- validation MIME réel,
- antivirus,
- renommage sécurisé,
- quotas,
- versioning,
- workflow de validation,
- permissions par document,
- suppression et archivage,
- test de restauration.

### Risque

Le système peut télécharger un document si une ligne de base est insérée, mais aucune chaîne d’acquisition sûre n’existe encore. Le MIME est lu depuis la base et n’est pas recalculé au téléchargement.

## 12. Audit logs

| Événement | État |
| --- | --- |
| LOGIN succès | Implémenté |
| LOGIN refusé compte connu | Implémenté |
| LOGIN refusé compte inexistant | Absent |
| LOGOUT | Implémenté, audit entouré d’un catch |
| ACCESS_DENIED | Partiel : pages protégées, pas l’API |
| CREATE | Implémenté pour items et comptes |
| UPDATE | Absent |
| DELETE | Absent |
| VALIDATE | Absent |
| DOWNLOAD | Implémenté pour documents |
| EXPORT | Absent |
| PERMISSION_CHANGE | Absent |

## 13. Interface et UX

### Application interne

- header séparé du site public ;
- logo et palette vert/or ;
- sidebar responsive ;
- cartes, tableaux et formulaires cohérents ;
- footer interne séparé ;
- message flash accessible avec `role="status"` ;
- adaptation mobile basique ;
- pas de notifications métier réelles ;
- pas de recherche/filtrage réel ;
- pas d’échéances ni d’alertes réelles ;
- pas d’états de validation métier.

### Distinction public/interne

La distinction visuelle et technique est claire : le site public conserve ses includes et l’application interne a son propre shell. L’accès public ajouté est discret dans le footer.

## 14. Site public

- `accueil.html` charge le footer via `include-nav.js`.
- `contact.html` charge également le footer.
- le footer contient `Gestion_Interne-CZoo/login.php`.
- le clic mène au login, pas au dashboard.
- les routes protégées utilisent `require_permission`.

La fonction du logo dans `contact.html` n’a pas été transformée en accès interne : il reste un logo public dans le footer, ce qui ne casse pas la navigation.

## 15. `db.php`, environnement et secrets

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_CHARSET` sont lus via `getenv()`.
- `APP_ENV=production` déclenche un refus si host local, utilisateur root ou mot de passe vide.
- `.env` et `.env.*` sont ignorés, `.env.example` est conservé.
- `.env.example` ne contient pas de secret de production.
- PDO utilise les exceptions, le mode associatif et les prepares natives.

Limites :

- les fallbacks `127.0.0.1`, `root`, mot de passe vide peuvent permettre un démarrage local non sécurisé si l’environnement est mal configuré ;
- aucun chargement de fichier `.env` n’existe, ce qui est acceptable si l’hébergement injecte réellement les variables ;
- aucune rotation de credentials ni procédure d’hébergement concrète n’est présente ;
- le fail-fast ne vérifie pas explicitement `DB_NAME` vide ;
- l’exception de connexion n’est pas présentée via une page d’erreur contrôlée partout.

## 16. Performance et allègement

### À conserver

- `db.php` et PDO préparé ;
- includes internes ;
- CSS interne unique ;
- `internal_items` uniquement comme fondation temporaire ;
- lazy/chargement différé déjà présent côté public lorsque prévu.

### À fusionner

- logique de permissions et conventions d’erreur dans une couche backend cohérente ;
- documentation des migrations et bootstrap DDL ;
- éventuelles variantes de styles publics, hors périmètre de cet audit.

### À optimiser

- requêtes dashboard : plusieurs requêtes par module ;
- pagination des listes ;
- images et CDN du site public ;
- headers cache pour les assets internes ;
- vérification des performances MySQL.

### À supprimer après vérification

- `index.html` et `login.html` vides dans le module interne, s’ils ne sont référencés nulle part.

### À surveiller

- `array_merge(...array_values(...))` du dashboard si beaucoup de données ;
- DDL/seed à chaque construction de `Database` ;
- dépendance aux chemins absolus `/Gestion_Interne-CZoo/` et `/images/`.

## 17. Tests et niveau de confiance

### Tests réellement exécutés

- inventaire statique des fichiers ;
- vérification de présence des 13 modules ;
- recherche statique des protections et appels ;
- inspection manuelle des routes, SQL et dépendances ;
- vérification de l’existence du lien public.

### Tests non exécutés

- lint PHP : PHP CLI absent ;
- lint JavaScript : Node.js absent ;
- exécution login ;
- session et expiration réelles ;
- accès 401/403 par navigateur ;
- connexion MySQL ;
- migrations sur une base réelle ;
- téléchargement documentaire ;
- test de logout avec cache navigateur ;
- test d’injection, XSS, CSRF et brute force automatisé.

### Niveau de confiance

**Confiance statique : moyenne.**  
**Confiance runtime : faible.**  
**Confiance production : insuffisante.**

## 18. CI/CD et déploiement

| Élément | État |
| --- | --- |
| Git | Dépôt non exploitable comme Git dans l’environnement d’audit |
| GitHub | À confirmer |
| Hosting | À confirmer |
| PHP runtime | À configurer/valider |
| MySQL | À configurer/valider |
| HTTPS | À confirmer, obligatoire |
| CI/CD | Absent |
| Backups | Procédure documentaire seulement |
| Monitoring | Recommandé, non implémenté |
| Health check | Absent |
| Rollback | Non automatisé |

## 19. Rapport principal des écarts

| Domaine | Prévu | Réalisé | Écart | Priorité |
| --- | --- | --- | --- | --- |
| Authentification | Parcours sécurisé complet | Parcours codé, non testé | Runtime non validé et protections incomplètes | P0 |
| RBAC | Direction + rôle + permissions | Rôle + permissions, direction non appliquée | Autorisation institutionnelle incomplète | P0 |
| Dashboard | Pilotage directeur réel | Vue générique minimale ; ordre d'inclusion corrigé | Fonctionnalité métier non réalisée, runtime non validé | P0 |
| Finances | Gestion financière métier | CRUD générique | Aucun modèle financier | P0 |
| Documents | Upload et accès sécurisé | Téléchargement sans upload | Cycle documentaire incomplet | P1 |
| Audit | Toutes actions sensibles | 4 familles seulement | Couverture incomplète | P1 |
| API | API interne structurée | Une API GET | Couverture très limitée | P1 |
| Sécurité | Brute force, HTTPS, anti-IDOR | Protections partielles | Production non sûre | P0 |
| UX/UI | Dashboard directeur complet | Shell propre, contenu minimal | Notifications/alertes/échéances absentes | P1 |
| Base de données | Migrations contrôlées | Bootstrap DDL + migration divergente | Gouvernance DB incohérente | P0 |
| CI/CD | Pipeline tests/build/deploy | Absent | Aucun contrôle automatisé | P1 |
| Déploiement | Production documentée | Non configuré | Infrastructure inconnue | P0 |

## 20. Risques et priorisation

### P0 — Bloquants

1. Installer/valider PHP CLI et MySQL, puis exécuter lint, migrations et tests runtime.
2. Définir la matrice institutionnelle direction/rôle/permission.
3. Remplacer le CRUD générique par un modèle métier avant d’utiliser les finances.
4. Garantir HTTPS et cookies Secure en production.
5. Ajouter rate limiting/verrouillage du login.
6. Définir une stratégie de migration unique et supprimer le DDL automatique des requêtes applicatives.
7. Confirmer l’hébergement, les secrets, les backups et le rollback.

### P1 — Importants

1. Compléter l’audit log : UPDATE, DELETE, VALIDATE, EXPORT, PERMISSION_CHANGE et refus anonymes.
2. Construire le workflow documentaire sécurisé.
3. Ajouter headers anti-cache pour l’application interne.
4. Ajouter pagination, recherche et validation métier.
5. Gérer proprement les erreurs DB et les conflits d’email.
6. Mettre en place CI/CD et tests d’intégration.
7. Ajouter permissions fines par ressource/direction.

### P2 — Améliorations

1. MFA.
2. Notifications et échéances réelles.
3. Health check et monitoring.
4. Historique/versioning métier.
5. Optimisation des assets et harmonisation complète du site public.

## 21. Questions nécessitant validation humaine/institutionnelle

1. Quelles directions existent officiellement et quels directeurs doivent être provisionnés ?
2. La Direction Générale doit-elle lire tous les modules ou seulement les indicateurs validés ?
3. Quelles permissions précises correspondent à chaque direction ?
4. Qui peut créer, valider, publier, supprimer et exporter ?
5. Quel est le modèle réel des finances et des pièces justificatives ?
6. Quelle est la politique de conservation des documents et des logs ?
7. Quel serveur PHP/MySQL, domaine, HTTPS et fournisseur seront utilisés ?
8. Les chemins absolus `/Gestion_Interne-CZoo/` et `/images/` sont-ils compatibles avec le déploiement réel ?
9. Les modules génériques doivent-ils être conservés comme brouillon ou remplacés par des modules métier séparés ?
10. L’ADR-0002 est-il approuvé par le Centre, ou seulement accepté techniquement par l’équipe ?

## Conclusion

La structure de `Gestion_Interne-CZOO` existe et contient des mécanismes de fondation crédibles, mais elle ne doit pas être qualifiée de système métier complet ni de version production. Le blocage d'ordre d'inclusion du dashboard a été corrigé statiquement ; la validation runtime, institutionnelle du RBAC et la conception des modèles métiers doivent précéder toute mise en production.
