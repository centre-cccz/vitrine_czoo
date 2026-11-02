<?php

class Database
{
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        // DB credentials are read from environment variables per ADR-0002.
        // Fallback values are provided to ease local development but should NOT be used in production.
        $environment = getenv('APP_ENV') ?: 'development';
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $db   = getenv('DB_NAME') ?: 'ccczoo';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';
        $charset = getenv('DB_CHARSET') ?: 'utf8mb4';

        if ($environment === 'production' && ($host === '127.0.0.1' || $user === 'root' || $pass === '')) {
            throw new RuntimeException('Production database configuration is incomplete.');
        }

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $this->pdo = new PDO($dsn, $user, $pass, $options);
        $this->initSchema();
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }

        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->pdo;
    }

    private function initSchema(): void
    {
        $statements = [
            "CREATE TABLE IF NOT EXISTS contact_requests (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) DEFAULT NULL,
                subject VARCHAR(255) DEFAULT NULL,
                category VARCHAR(100) DEFAULT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS directions (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(120) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS roles (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(80) NOT NULL UNIQUE,
                description VARCHAR(255) DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS permissions (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description VARCHAR(255) DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                direction_id INT UNSIGNED NOT NULL,
                name VARCHAR(160) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                last_login_at TIMESTAMP NULL DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_users_direction FOREIGN KEY (direction_id) REFERENCES directions(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS user_roles (
                user_id INT UNSIGNED NOT NULL,
                role_id INT UNSIGNED NOT NULL,
                PRIMARY KEY (user_id, role_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS role_permissions (
                role_id INT UNSIGNED NOT NULL,
                permission_id INT UNSIGNED NOT NULL,
                PRIMARY KEY (role_id, permission_id),
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS audit_logs (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNSIGNED NULL,
                direction VARCHAR(120) DEFAULT NULL,
                action VARCHAR(40) NOT NULL,
                resource_type VARCHAR(120) DEFAULT NULL,
                resource_id VARCHAR(120) DEFAULT NULL,
                result VARCHAR(20) NOT NULL,
                ip_address VARCHAR(45) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_audit_created_at (created_at),
                INDEX idx_audit_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS internal_items (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                module VARCHAR(80) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                status VARCHAR(40) NOT NULL DEFAULT 'draft',
                created_by INT UNSIGNED NOT NULL,
                updated_by INT UNSIGNED NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id),
                FOREIGN KEY (updated_by) REFERENCES users(id),
                INDEX idx_internal_items_module (module),
                INDEX idx_internal_items_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS internal_documents (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                storage_path VARCHAR(500) NOT NULL,
                mime_type VARCHAR(120) NOT NULL,
                uploaded_by INT UNSIGNED NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (uploaded_by) REFERENCES users(id),
                INDEX idx_internal_documents_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
        ];

        foreach ($statements as $statement) {
            $this->pdo->exec($statement);
        }

        $this->pdo->exec("INSERT IGNORE INTO directions (name) VALUES
            ('Direction Générale'), ('Direction Administrative'), ('Direction Financière'),
            ('Direction de l''Intendance'), ('Direction de la Bibliothèque'),
            ('Direction de l''Animation et de la Préservation culturelle')");
        $this->pdo->exec("INSERT IGNORE INTO roles (name, description) VALUES
            ('directeur', 'Directeur autorisé du Centre'), ('administrateur', 'Administration technique autorisée')");

        $permissions = [
            'dashboard.read', 'profile.read', 'profile.update',
            'administration.read', 'personnel.read', 'finances.read', 'finances.create', 'finances.update',
            'intendance.read', 'bibliotheque.read', 'culture-arts.read', 'activites.read',
            'projets.read', 'espaces.read', 'patrimoine.read', 'partenaires.read',
            'documents.read', 'documents.download', 'rapports.read', 'admin.users', 'audit.read'
        ];
        $permissionStatement = $this->pdo->prepare('INSERT IGNORE INTO permissions (name) VALUES (:name)');
        foreach ($permissions as $permission) {
            $permissionStatement->execute([':name' => $permission]);
        }
        $this->pdo->exec("INSERT IGNORE INTO role_permissions (role_id, permission_id)
            SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'administrateur'");
        $this->pdo->exec("INSERT IGNORE INTO role_permissions (role_id, permission_id)
            SELECT r.id, p.id FROM roles r JOIN permissions p
            WHERE r.name = 'directeur' AND (p.name LIKE '%.read' OR p.name IN ('dashboard.read', 'profile.update'))");
    }

    public function saveContactRequest(array $data): bool
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO contact_requests (name, email, phone, subject, category, message)
             VALUES (:name, :email, :phone, :subject, :category, :message)'
        );

        return $stmt->execute([
            ':name'     => $data['name'],
            ':email'    => $data['email'],
            ':phone'    => $data['phone'] ?? null,
            ':subject'  => $data['subject'] ?? null,
            ':category' => $data['category'] ?? null,
            ':message'  => $data['message'],
        ]);
    }

    public function getContactRequests(int $limit = 50): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM contact_requests ORDER BY created_at DESC LIMIT :limit');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findUserByEmail(string $email): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT u.*, d.name AS direction_name
             FROM users u JOIN directions d ON d.id = u.direction_id
             WHERE u.email = :email LIMIT 1'
        );
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function getUserPermissions(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT DISTINCT p.name FROM permissions p
             JOIN role_permissions rp ON rp.permission_id = p.id
             JOIN user_roles ur ON ur.role_id = rp.role_id
             WHERE ur.user_id = :user_id'
        );
        $stmt->execute([':user_id' => $userId]);
        return array_column($stmt->fetchAll(), 'name');
    }

    public function getUserRoles(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = :user_id'
        );
        $stmt->execute([':user_id' => $userId]);
        return array_column($stmt->fetchAll(), 'name');
    }

    public function recordAudit(?int $userId, ?string $direction, string $action, ?string $resourceType, ?string $resourceId, string $result): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO audit_logs
             (user_id, direction, action, resource_type, resource_id, result, ip_address)
             VALUES (:user_id, :direction, :action, :resource_type, :resource_id, :result, :ip_address)'
        );
        $stmt->execute([
            ':user_id' => $userId,
            ':direction' => $direction,
            ':action' => $action,
            ':resource_type' => $resourceType,
            ':resource_id' => $resourceId,
            ':result' => $result,
            ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ]);
    }

    public function updateLastLogin(int $userId): void
    {
        $stmt = $this->pdo->prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id');
        $stmt->execute([':id' => $userId]);
    }

    public function listItems(string $module, int $limit = 100): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT i.*, u.name AS creator_name FROM internal_items i
             JOIN users u ON u.id = i.created_by
             WHERE i.module = :module ORDER BY i.updated_at DESC LIMIT :limit'
        );
        $stmt->bindValue(':module', $module);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function createItem(string $module, string $title, string $description, int $userId): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO internal_items (module, title, description, created_by, updated_by)
             VALUES (:module, :title, :description, :created_by, :updated_by)'
        );
        $stmt->execute([
            ':module' => $module,
            ':title' => $title,
            ':description' => $description ?: null,
            ':created_by' => $userId,
            ':updated_by' => $userId,
        ]);
        return (int) $this->pdo->lastInsertId();
    }
}
