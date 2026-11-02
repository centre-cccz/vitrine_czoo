<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

start_internal_session();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_internal('login.php');
}
verify_csrf();

$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$password = (string) ($_POST['password'] ?? '');
if (!$email || $password === '' || strlen($password) < 8) {
    flash('error', 'Identifiants invalides.');
    redirect_internal('login.php');
}

try {
    $db = Database::getInstance();
    $user = $db->findUserByEmail($email);
    if (!$user || !(bool) $user['is_active'] || !password_verify($password, $user['password_hash'])) {
        if ($user) {
            $db->recordAudit((int) $user['id'], $user['direction_name'], 'LOGIN', 'session', null, 'denied');
        }
        flash('error', 'Identifiants invalides.');
        redirect_internal('login.php');
    }

    session_regenerate_id(true);
    $_SESSION['authenticated_at'] = time();
    $_SESSION['last_activity'] = time();
    $_SESSION['internal_user'] = [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'direction_name' => $user['direction_name'],
        'last_login_at' => $user['last_login_at'],
    ];
    $_SESSION['internal_permissions'] = $db->getUserPermissions((int) $user['id']);
    $_SESSION['internal_roles'] = $db->getUserRoles((int) $user['id']);
    $db->updateLastLogin((int) $user['id']);
    $db->recordAudit((int) $user['id'], $user['direction_name'], 'LOGIN', 'session', null, 'success');
    redirect_internal('dashboard.php');
} catch (Throwable $exception) {
    error_log('Internal authentication failure: ' . $exception->getMessage());
    flash('error', 'Le service est momentanément indisponible.');
    redirect_internal('login.php');
}
