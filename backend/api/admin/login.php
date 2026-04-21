<?php
// backend/api/admin/login.php
require_once '../../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['username']) || empty($data['password'])) {
    sendResponse('error', 'Missing username or password');
}

$username = trim($data['username']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password'])) {
        $_SESSION['admin_id'] = $admin['id'];
        unset($admin['password']);
        sendResponse('success', $admin);
    } else {
        sendResponse('error', 'Invalid admin credentials');
    }
} catch (PDOException $e) {
    sendResponse('error', 'Admin login failed: ' . $e->getMessage());
}
?>
