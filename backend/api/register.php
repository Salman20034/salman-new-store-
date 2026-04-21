<?php
// backend/api/register.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name']) || !isset($data['phone']) || !isset($data['password'])) {
    sendResponse('error', 'Missing required fields');
}

$name = trim($data['name']);
$phone = trim($data['phone']);
$email = isset($data['email']) ? trim($data['email']) : null;

if (strlen($name) < 2) {
    sendResponse('error', 'Name must be at least 2 characters long');
}

if (!preg_match('/^[0-9]{10,}$/', $phone)) {
    sendResponse('error', 'Invalid phone number format. Minimum 10 digits required.');
}
$password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $phone, $email, $password]);
    
    $userId = $pdo->lastInsertId();
    $user = [
        'id' => $userId,
        'name' => $name,
        'phone' => $phone,
        'email' => $email
    ];
    
    sendResponse('success', $user);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        sendResponse('error', 'Phone or Email already exists');
    }
    sendResponse('error', 'Registration failed: ' . $e->getMessage());
}
?>
