<?php

declare(strict_types=1);

require_once __DIR__ . '/functions.php';
require_once dirname(__DIR__, 2) . '/db.php';

function start_internal_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/Gestion_Interne-CZoo/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();

    if (!empty($_SESSION['last_activity']) && time() - (int) $_SESSION['last_activity'] > 1800) {
        $_SESSION = [];
        session_destroy();
        redirect_internal('login.php?expired=1');
    }
    if (!empty($_SESSION['authenticated_at'])) {
        $_SESSION['last_activity'] = time();
    }
}

function current_user(): ?array
{
    return $_SESSION['internal_user'] ?? null;
}

function require_auth(): void
{
    start_internal_session();
    if (current_user() === null) {
        redirect_internal('login.php');
    }
}

function has_permission(string $permission): bool
{
    return in_array($permission, $_SESSION['internal_permissions'] ?? [], true);
}

function require_permission(string $permission): void
{
    require_auth();
    if (!has_permission($permission)) {
        $db = Database::getInstance();
        $user = current_user();
        $db->recordAudit((int) $user['id'], $user['direction_name'] ?? null, 'ACCESS_DENIED', 'permission', $permission, 'denied');
        http_response_code(403);
        exit('Accès refusé.');
    }
}
