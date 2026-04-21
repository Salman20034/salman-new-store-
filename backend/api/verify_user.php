<?php
// backend/api/verify_user.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$identifier = isset($data['identifier']) ? trim($data['identifier']) : '';

if (empty($identifier)) {
    sendResponse('error', 'Please enter your email or phone number');
}

$stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ? OR phone = ?");
$stmt->execute([$identifier, $identifier]);
$user = $stmt->fetch();

if ($user) {
    sendResponse('success', ['id' => $user['id'], 'name' => $user['name']]);
} else {
    sendResponse('error', 'No account found with that information');
}
?>
