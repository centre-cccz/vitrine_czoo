<?php
// scripts/check_seeds.php
// Vérifie la présence des rôles et permissions essentiels avant d'exécuter les migrations de seed.
// Usage: php scripts/check_seeds.php
// Exit codes: 0 OK, 1 missing items or error

declare(strict_types=1);

// Charger .env si présent (simple parser)
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (!strpos($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v);
        if (!getenv($k)) putenv($k . '=' . $v);
    }
}

$host = getenv('DB_HOST') ?: '127.0.0.1';
$db = getenv('DB_NAME') ?: 'ccczoo';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$charset = getenv('DB_CHARSET') ?: 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

$required_roles = [
    'directeur', 'administrateur', 'editeur', 'finance', 'intendance', 'bibliotheque', 'gestionnaire_projets'
];
$required_permissions = [
    'dashboard.read','profile.read','profile.update','administration.read','personnel.read',
    'finances.read','finances.create','finances.update','intendance.read','bibliotheque.read',
    'culture-arts.read','activites.read','projets.read','espaces.read','patrimoine.read','partenaires.read',
    'documents.read','documents.download','rapports.read','admin.users','audit.read'
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (Throwable $e) {
    fwrite(STDERR, "Erreur connexion DB: " . $e->getMessage() . PHP_EOL);
    exit(1);
}

$missing = [];

// Check roles
$stmt = $pdo->prepare('SELECT name FROM roles WHERE name IN ('.str_repeat('?,', count($required_roles)-1).'?)');
$stmt->execute($required_roles);
$found_roles = array_column($stmt->fetchAll(), 'name');
$missing_roles = array_diff($required_roles, $found_roles);
if ($missing_roles) {
    $missing['roles'] = array_values($missing_roles);
}

// Check permissions
$stmt = $pdo->prepare('SELECT name FROM permissions WHERE name IN ('.str_repeat('?,', count($required_permissions)-1).'?)');
$stmt->execute($required_permissions);
$found_perms = array_column($stmt->fetchAll(), 'name');
$missing_perms = array_diff($required_permissions, $found_perms);
if ($missing_perms) {
    $missing['permissions'] = array_values($missing_perms);
}

// Check that 'administrateur' role has at least one permission
$stmt = $pdo->prepare('SELECT COUNT(*) as c FROM role_permissions rp JOIN roles r ON r.id = rp.role_id WHERE r.name = ?');
$stmt->execute(['administrateur']);
$admin_perm_count = (int)$stmt->fetchColumn();
if ($admin_perm_count === 0) {
    if (!isset($missing['role_permissions'])) $missing['role_permissions'] = [];
    $missing['role_permissions'][] = 'administrateur has 0 permissions';
}

// Summary
if (empty($missing)) {
    echo "All required roles and permissions are present.\n";
    exit(0);
}

fwrite(STDERR, "Missing required items detected:\n");
foreach ($missing as $k => $vals) {
    fwrite(STDERR, " - $k:\n");
    foreach ($vals as $v) fwrite(STDERR, "    * $v\n");
}

fwrite(STDERR, "\nPlease run migrations/0003_seed_roles_permissions.sql on staging or review migration scripts.\n");
exit(1);
