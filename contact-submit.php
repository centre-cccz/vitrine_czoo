<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$category = trim($_POST['category'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    header('Location: contact.html?error=1');
    exit;
}

$data = [
    'name'     => $name,
    'email'    => $email,
    'phone'    => $phone,
    'subject'  => $subject,
    'category' => $category,
    'message'  => $message,
];

$stored = false;

try {
    $db = Database::getInstance();
    $db->saveContactRequest($data);
    $stored = true;
} catch (Throwable $e) {
    $logFile = __DIR__ . '/contact_requests.log';
    $entry = sprintf("[%s] %s | %s | %s | %s\n", date('c'), $name, $email, $subject, $message);
    @file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
}

$to = 'contact@ccclezoo.cd';
$headers = "From: {$email}\r\nReply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8";
$body = "Nom: {$name}\nEmail: {$email}\nTéléphone: {$phone}\nSujet: {$subject}\nCatégorie: {$category}\n\nMessage:\n{$message}";

if (!isset($_SERVER['HTTP_HOST']) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    $stored = true;
}

if (!$stored) {
    @mail($to, '[CCCZOO] Nouvelle demande de contact', $body, $headers);
}

header('Location: contact.html?success=1');
exit;
