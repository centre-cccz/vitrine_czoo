<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

const CONTACT_RECIPIENT = 'contact@ccclezoo.cd';
const CONTACT_CATEGORIES = ['artiste', 'partenariat', 'reservation', 'atelier', 'autre'];

function contact_redirect(string $query): void
{
    header('Location: contact.html?' . $query);
    exit;
}

/** Retire les caracteres de controle (dont CR/LF) d'une valeur monoligne. */
function contact_clean_line(string $value): string
{
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    contact_redirect('');
}

// Anti-spam : le champ cache 'website' doit rester vide (les robots le remplissent).
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    contact_redirect('success=1');
}

$name     = contact_clean_line((string) ($_POST['name'] ?? ''));
$email    = trim((string) ($_POST['email'] ?? ''));
$phone    = contact_clean_line((string) ($_POST['phone'] ?? ''));
$subject  = contact_clean_line((string) ($_POST['subject'] ?? ''));
$category = contact_clean_line((string) ($_POST['category'] ?? ''));
$message  = trim(str_replace("\0", '', (string) ($_POST['message'] ?? '')));

$validEmail = filter_var($email, FILTER_VALIDATE_EMAIL);
$invalid = $name === '' || $subject === '' || $message === ''
    || $validEmail === false
    || strlen($name) > 255 || strlen($email) > 255 || strlen($subject) > 255
    || strlen($phone) > 50 || strlen($message) > 5000
    || ($phone !== '' && !preg_match('/^[0-9+().\s-]{3,50}$/', $phone))
    || ($category !== '' && !in_array($category, CONTACT_CATEGORIES, true));

if ($invalid) {
    contact_redirect('error=1');
}

$data = [
    'name'     => $name,
    'email'    => $validEmail,
    'phone'    => $phone,
    'subject'  => $subject,
    'category' => $category,
    'message'  => $message,
];

// 1) Enregistrement en base
$stored = false;
try {
    Database::getInstance()->saveContactRequest($data);
    $stored = true;
} catch (Throwable $exception) {
    error_log('Contact form: database failure: ' . $exception->getMessage());
}

// 2) Notification par email (envoyee dans tous les cas, au mieux)
// From fixe sur le domaine du Centre ; l'adresse du visiteur reste en Reply-To (validee, sans CR/LF).
$headers = [
    'From'         => 'Site CCCZ <' . CONTACT_RECIPIENT . '>',
    'Reply-To'     => $validEmail,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];
$body = "Nom: {$name}\nEmail: {$validEmail}\nTelephone: {$phone}\nSujet: {$subject}\nCategorie: {$category}\n\nMessage:\n{$message}";
$mailed = @mail(CONTACT_RECIPIENT, '[CCCZOO] Nouvelle demande de contact', $body, $headers);

// 3) Si aucun des deux canaux n'a fonctionne, repli dans un fichier HORS racine web (optionnel)
if (!$stored && !$mailed) {
    $logPath = getenv('CONTACT_LOG_PATH');
    if ($logPath) {
        $entry = sprintf("[%s] %s | %s | %s | %s\n", date('c'), $name, $validEmail, $subject, str_replace(["\r", "\n"], ' ', $message));
        @file_put_contents($logPath, $entry, FILE_APPEND | LOCK_EX);
    }
    error_log('Contact form: both database and mail failed for a request.');
    contact_redirect('error=1');
}

contact_redirect('success=1');