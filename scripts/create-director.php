<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("CLI only.\n");
}
require_once dirname(__DIR__) . '/db.php';

[$script, $name, $email, $password, $direction] = array_pad($argv, 5, null);
if (!$name || !$email || !$password || !$direction || strlen($password) < 12 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit("Usage: php scripts/create-director.php \"Nom\" email@example.com \"mot-de-passe-12-caracteres\" \"Direction Générale\"\n");
}

$db = Database::getInstance()->getConnection();
$db->beginTransaction();
try {
    $directionStmt = $db->prepare('SELECT id FROM directions WHERE name = :name');
    $directionStmt->execute([':name' => $direction]);
    $directionId = $directionStmt->fetchColumn();
    if (!$directionId) {
        throw new RuntimeException('Direction inconnue.');
    }
    $stmt = $db->prepare('INSERT INTO users (direction_id, name, email, password_hash) VALUES (:direction_id, :name, :email, :password_hash)');
    $stmt->execute([':direction_id' => $directionId, ':name' => $name, ':email' => $email, ':password_hash' => password_hash($password, PASSWORD_DEFAULT)]);
    $userId = (int) $db->lastInsertId();
    $roleId = $db->query("SELECT id FROM roles WHERE name = 'directeur'")->fetchColumn();
    $roleStmt = $db->prepare('INSERT INTO user_roles (user_id, role_id) VALUES (:user_id, :role_id)');
    $roleStmt->execute([':user_id' => $userId, ':role_id' => $roleId]);
    $db->commit();
    echo "Director created: {$email}\n";
} catch (Throwable $exception) {
    $db->rollBack();
    fwrite(STDERR, "Creation failed: {$exception->getMessage()}\n");
    exit(1);
}
