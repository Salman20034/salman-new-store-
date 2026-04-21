<?php
// backend/api/cart_remove.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['user_id']) || empty($data['product_id'])) {
    sendResponse('error', 'Missing required fields');
}

$user_id = $data['user_id'];
checkUser($user_id);
$product_id = $data['product_id'];

try {
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$user_id, $product_id]);
    sendResponse('success', 'Product removed from cart');
} catch (PDOException $e) {
    sendResponse('error', 'Failed to remove from cart: ' . $e->getMessage());
}
?>
