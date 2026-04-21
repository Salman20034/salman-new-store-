<?php
// backend/api/reset_password.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'] ?? null;
$new_password = $data['password'] ?? '';

if (!$user_id || strlen($new_password) < 6) {
    sendResponse('error', 'Invalid request or password must be at least 6 characters long');
}

$passwordHash = password_hash($new_password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute([$passwordHash, $user_id]);
    sendResponse('success', 'Password reset successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Database error: ' . $e->getMessage());
}
?>
