<?php
// backend/api/login.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['phone']) || !isset($data['password'])) {
    sendResponse('error', 'Missing phone or password');
}

$phone = $data['phone'];
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        unset($user['password']); // Remove password hash from response
        sendResponse('success', $user);
    } else {
        sendResponse('error', 'Invalid phone or password');
    }
} catch (PDOException $e) {
    sendResponse('error', 'Login failed: ' . $e->getMessage());
}
?>
