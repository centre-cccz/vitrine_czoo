<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';

start_internal_session();
if ($user = current_user()) {
    try {
        Database::getInstance()->recordAudit((int) $user['id'], $user['direction_name'] ?? null, 'LOGOUT', 'session', null, 'success');
    } catch (Throwable $exception) {
        error_log('Logout audit failure: ' . $exception->getMessage());
    }
}
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], '', (bool) $params['secure'], (bool) $params['httponly']);
}
session_destroy();
header('Location: /Gestion_Interne-CZoo/login.php');
exit;
