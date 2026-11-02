-- Migration 0002: Content, Media, Events, Projects, Activities, Finances (DDL + reference data)
-- IMPORTANT: This file is a design artifact. Do NOT execute without review. It uses IF NOT EXISTS where possible.
-- MySQL / MariaDB compatible DDL. Uses InnoDB, utf8mb4.

SET FOREIGN_KEY_CHECKS=0;

-- 1) modules (optional)
CREATE TABLE IF NOT EXISTS modules (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_modules_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) user_permission_overrides (optional)
CREATE TABLE IF NOT EXISTS user_permission_overrides (
  user_id INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  allowed TINYINT(1) NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, permission_id),
  INDEX idx_upo_created_by (created_by),
  CONSTRAINT fk_upo_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_upo_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_upo_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) media
CREATE TABLE IF NOT EXISTS media (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  storage_path VARCHAR(1000) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NULL,
  width INT UNSIGNED NULL,
  height INT UNSIGNED NULL,
  title VARCHAR(255) DEFAULT NULL,
  alt_text VARCHAR(255) DEFAULT NULL,
  caption LONGTEXT DEFAULT NULL,
  uploaded_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME(6) DEFAULT NULL,
  focal_point JSON DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_media_created_at (created_at),
  INDEX idx_media_mime (mime_type),
  CONSTRAINT fk_media_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) albums
CREATE TABLE IF NOT EXISTS albums (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_albums_created_at (created_at),
  CONSTRAINT fk_albums_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) media_albums
CREATE TABLE IF NOT EXISTS media_albums (
  album_id INT UNSIGNED NOT NULL,
  media_id INT UNSIGNED NOT NULL,
  position INT UNSIGNED NOT NULL DEFAULT 0,
  caption VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (album_id, media_id),
  INDEX idx_media_albums_media (media_id),
  CONSTRAINT fk_media_albums_album FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_media_albums_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) content_statuses
CREATE TABLE IF NOT EXISTS content_statuses (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_content_statuses_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) contents
CREATE TABLE IF NOT EXISTS contents (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  summary VARCHAR(500) DEFAULT NULL,
  body LONGTEXT DEFAULT NULL,
  status_id SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  author_id INT UNSIGNED DEFAULT NULL,
  created_by INT UNSIGNED DEFAULT NULL,
  updated_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  published_at DATETIME(6) DEFAULT NULL,
  deleted_at DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_contents_slug (slug),
  INDEX idx_contents_status_published (status_id, published_at),
  CONSTRAINT fk_contents_status FOREIGN KEY (status_id) REFERENCES content_statuses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_contents_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_contents_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_contents_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8) tags
CREATE TABLE IF NOT EXISTS tags (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_tags_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9) content_tags
CREATE TABLE IF NOT EXISTS content_tags (
  content_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (content_id, tag_id),
  CONSTRAINT fk_content_tags_content FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_content_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10) content_media
CREATE TABLE IF NOT EXISTS content_media (
  content_id INT UNSIGNED NOT NULL,
  media_id INT UNSIGNED NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'inline',
  position INT UNSIGNED NOT NULL DEFAULT 0,
  caption VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (content_id, media_id, role),
  CONSTRAINT fk_content_media_content FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_content_media_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11) categories
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12) event_statuses
CREATE TABLE IF NOT EXISTS event_statuses (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_event_statuses_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13) events
CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  summary VARCHAR(500) DEFAULT NULL,
  description LONGTEXT DEFAULT NULL,
  category_id INT UNSIGNED DEFAULT NULL,
  organizer_user_id INT UNSIGNED DEFAULT NULL,
  organizer_partner_id INT UNSIGNED DEFAULT NULL,
  status_id SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  capacity INT UNSIGNED DEFAULT NULL,
  default_price DECIMAL(15,2) DEFAULT NULL,
  created_by INT UNSIGNED DEFAULT NULL,
  updated_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  published_at DATETIME(6) DEFAULT NULL,
  deleted_at DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_events_slug (slug),
  INDEX idx_events_status_published (status_id, published_at),
  INDEX idx_events_category (category_id),
  CONSTRAINT fk_events_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_events_organizer_user FOREIGN KEY (organizer_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_events_organizer_partner FOREIGN KEY (organizer_partner_id) REFERENCES partners(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_events_status FOREIGN KEY (status_id) REFERENCES event_statuses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_events_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14) spaces
CREATE TABLE IF NOT EXISTS spaces (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description TEXT DEFAULT NULL,
  capacity INT UNSIGNED DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_spaces_slug (slug),
  INDEX idx_spaces_capacity (capacity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15) event_occurrences
CREATE TABLE IF NOT EXISTS event_occurrences (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id INT UNSIGNED NOT NULL,
  start_at DATETIME(6) NOT NULL,
  end_at DATETIME(6) DEFAULT NULL,
  space_id INT UNSIGNED DEFAULT NULL,
  capacity INT UNSIGNED DEFAULT NULL,
  price DECIMAL(15,2) DEFAULT NULL,
  status_id SMALLINT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_event_occurrences_event_start (event_id, start_at),
  INDEX idx_event_occurrences_start (start_at),
  CONSTRAINT fk_event_occurrences_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_occurrences_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_event_occurrences_status FOREIGN KEY (status_id) REFERENCES event_statuses(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_event_occurrences_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16) artists
CREATE TABLE IF NOT EXISTS artists (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  bio TEXT DEFAULT NULL,
  website VARCHAR(255) DEFAULT NULL,
  contact_email VARCHAR(255) DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_artists_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17) event_artists
CREATE TABLE IF NOT EXISTS event_artists (
  event_id INT UNSIGNED NOT NULL,
  artist_id INT UNSIGNED NOT NULL,
  role VARCHAR(80) DEFAULT NULL,
  position INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, artist_id),
  CONSTRAINT fk_event_artists_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_artists_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18) partners
CREATE TABLE IF NOT EXISTS partners (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  website VARCHAR(255) DEFAULT NULL,
  contact_email VARCHAR(255) DEFAULT NULL,
  logo_media_id INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_partners_slug (slug),
  CONSTRAINT fk_partners_logo FOREIGN KEY (logo_media_id) REFERENCES media(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19) event_partners
CREATE TABLE IF NOT EXISTS event_partners (
  event_id INT UNSIGNED NOT NULL,
  partner_id INT UNSIGNED NOT NULL,
  role VARCHAR(80) DEFAULT NULL,
  PRIMARY KEY (event_id, partner_id),
  CONSTRAINT fk_event_partners_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_partners_partner FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20) event_media
CREATE TABLE IF NOT EXISTS event_media (
  event_id INT UNSIGNED NOT NULL,
  media_id INT UNSIGNED NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'poster',
  position INT UNSIGNED NOT NULL DEFAULT 0,
  caption VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (event_id, media_id, role),
  CONSTRAINT fk_event_media_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_media_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21) project_statuses
CREATE TABLE IF NOT EXISTS project_statuses (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_project_statuses_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22) projects
CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  owner_id INT UNSIGNED DEFAULT NULL,
  status_id SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_projects_slug (slug),
  INDEX idx_projects_status (status_id),
  CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_projects_status FOREIGN KEY (status_id) REFERENCES project_statuses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_projects_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 23) project_members
CREATE TABLE IF NOT EXISTS project_members (
  project_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  role VARCHAR(80) DEFAULT NULL,
  assigned_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id),
  CONSTRAINT fk_project_members_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_project_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 24) activity_statuses
CREATE TABLE IF NOT EXISTS activity_statuses (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_activity_statuses_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 25) activities
CREATE TABLE IF NOT EXISTS activities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id INT UNSIGNED DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  status_id SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  priority TINYINT UNSIGNED NOT NULL DEFAULT 3,
  assigned_to INT UNSIGNED DEFAULT NULL,
  due_date DATE DEFAULT NULL,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME(6) NULL,
  PRIMARY KEY (id),
  INDEX idx_activities_project_due (project_id, due_date),
  INDEX idx_activities_assigned_to (assigned_to),
  CONSTRAINT fk_activities_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_activities_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_activities_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_activities_status FOREIGN KEY (status_id) REFERENCES activity_statuses(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 26) activity_documents
CREATE TABLE IF NOT EXISTS activity_documents (
  activity_id INT UNSIGNED NOT NULL,
  document_id INT UNSIGNED NOT NULL,
  note VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (activity_id, document_id),
  CONSTRAINT fk_activity_documents_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_activity_documents_document FOREIGN KEY (document_id) REFERENCES internal_documents(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 27) finance_categories
CREATE TABLE IF NOT EXISTS finance_categories (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_finance_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 28) finance_entries
CREATE TABLE IF NOT EXISTS finance_entries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reference VARCHAR(64) DEFAULT NULL,
  project_id INT UNSIGNED DEFAULT NULL,
  category_id SMALLINT UNSIGNED DEFAULT NULL,
  date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'CDF',
  description TEXT DEFAULT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'posted',
  created_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  document_id INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_finance_project_date (project_id, date),
  INDEX idx_finance_status (status),
  CONSTRAINT fk_finance_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_finance_category FOREIGN KEY (category_id) REFERENCES finance_categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_finance_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_finance_document FOREIGN KEY (document_id) REFERENCES internal_documents(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 29) event_artists, event_partners, event_media already created above

-- 30) content seed and reference seeds
INSERT IGNORE INTO content_statuses (id, name, description) VALUES
  (1, 'draft', 'Draft content'),
  (2, 'published', 'Published content'),
  (3, 'archived', 'Archived content');

INSERT IGNORE INTO event_statuses (id, name, description) VALUES
  (1, 'draft', 'Draft event'),
  (2, 'scheduled', 'Scheduled'),
  (3, 'cancelled', 'Cancelled'),
  (4, 'completed', 'Completed'),
  (5, 'archived', 'Archived');

INSERT IGNORE INTO project_statuses (id, name, description) VALUES
  (1, 'planning', 'Planning'),
  (2, 'active', 'Active'),
  (3, 'completed', 'Completed'),
  (4, 'on_hold', 'On hold'),
  (5, 'cancelled', 'Cancelled');

INSERT IGNORE INTO activity_statuses (id, name, description) VALUES
  (1, 'todo', 'To do'),
  (2, 'in_progress', 'In progress'),
  (3, 'done', 'Done'),
  (4, 'blocked', 'Blocked');

INSERT IGNORE INTO finance_categories (id, name, description) VALUES
  (1, 'salary', 'Salaries and wages'),
  (2, 'operational', 'Operational expenses'),
  (3, 'event_cost', 'Event direct costs'),
  (4, 'grant', 'Grant income'),
  (5, 'donation', 'Donations');

SET FOREIGN_KEY_CHECKS=1;

-- End of migration 0002
