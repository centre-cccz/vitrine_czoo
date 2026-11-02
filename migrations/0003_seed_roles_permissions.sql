-- Migration 0003: Seed roles et permissions
-- Objectif: centraliser l'initialisation des rôles et permissions dans les migrations
-- Idempotent: utilise INSERT IGNORE pour ne pas dupliquer les enregistrements
-- Ne pas exécuter avant revue et sauvegarde

SET FOREIGN_KEY_CHECKS=0;

-- 1) Roles de base
INSERT IGNORE INTO roles (name, description) VALUES
  ('directeur', 'Directeur autorisé du Centre'),
  ('administrateur', 'Administration technique autorisée'),
  ('editeur', 'Editeur de contenu (publication, modification)'),
  ('finance', 'Accès et gestion des éléments financiers'),
  ('intendance', 'Gestion de l\'intendance et logistique'),
  ('bibliotheque', 'Accès aux fonctions de la bibliothèque'),
  ('gestionnaire_projets', 'Responsable et gestionnaire de projets');

-- 2) Permissions (liste initiale — adapter si vous ajoutez des modules)
INSERT IGNORE INTO permissions (name, description) VALUES
  ('dashboard.read', 'Accès au tableau de bord'),
  ('profile.read', 'Lire les profils utilisateurs'),
  ('profile.update', 'Modifier les profils utilisateurs'),
  ('administration.read', 'Accès aux pages d\'administration'),
  ('personnel.read', 'Lire les informations du personnel'),
  ('finances.read', 'Lire les éléments financiers'),
  ('finances.create', 'Créer des écritures financières'),
  ('finances.update', 'Mettre à jour des écritures financières'),
  ('intendance.read', 'Voir les éléments d\'intendance'),
  ('bibliotheque.read', 'Accès lecture bibliothèque'),
  ('culture-arts.read', 'Accéder aux ressources culturelles et artistiques'),
  ('activites.read', 'Lire les activités'),
  ('projets.read', 'Lire les projets'),
  ('espaces.read', 'Lire les espaces'),
  ('patrimoine.read', 'Accès patrimoine'),
  ('partenaires.read', 'Lire les partenaires'),
  ('documents.read', 'Lire la liste des documents internes'),
  ('documents.download', 'Télécharger les documents internes'),
  ('rapports.read', 'Consulter les rapports'),
  ('admin.users', 'Permission de gestion des comptes utilisateurs'),
  ('audit.read', 'Lire les journaux d\'audit');

-- 3) Assigner des permissions aux rôles (idempotent)
-- 3a) Administrateur : toutes les permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'administrateur';

-- 3b) Directeur : ensemble restreint — lecture et quelques droits de profil
INSERT IGNORE INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id FROM roles r JOIN permissions p
  WHERE r.name = 'directeur' AND (p.name LIKE '%.read' OR p.name IN ('dashboard.read', 'profile.update'));

-- 3c) Editeur : droits de lecture/édition de contenu et documents (si présents)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id FROM roles r JOIN permissions p
  WHERE r.name = 'editeur' AND (p.name LIKE '%.read' OR p.name IN ('documents.read', 'documents.download', 'profile.update'));

-- 3d) Finance : droits financiers
INSERT IGNORE INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id FROM roles r JOIN permissions p
  WHERE r.name = 'finance' AND p.name LIKE 'finances.%';

-- 3e) Bibliothèque, intendance, gestionnaire_projets : lecture de leurs modules
INSERT IGNORE INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id FROM roles r JOIN permissions p
  WHERE (r.name = 'bibliotheque' AND p.name = 'bibliotheque.read')
     OR (r.name = 'intendance' AND p.name = 'intendance.read')
     OR (r.name = 'gestionnaire_projets' AND p.name = 'projets.read');

SET FOREIGN_KEY_CHECKS=1;

-- Fin de migration 0003
-- Remarques:
-- * Cette migration centralise le seed des rôles et permissions et est idempotente.
-- * Après exécution, vérifier en base que les rôles et permissions existants ont bien été liés.
-- * Si vous préférez un script de seed plus fin (ex: assigner permissions supplémentaires), modifiez les SELECT ci-dessus.
