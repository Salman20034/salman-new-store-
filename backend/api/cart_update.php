<?php
// backend/api/cart_update.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['user_id']) || empty($data['product_id']) || !isset($data['quantity'])) {
    sendResponse('error', 'Missing required fields');
}

$user_id = $data['user_id'];
checkUser($user_id);
$product_id = $data['product_id'];
$quantity = $data['quantity'];

try {
    if ($quantity <= 0) {
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$user_id, $product_id]);
        sendResponse('success', 'Product removed from cart');
    } else {
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$quantity, $user_id, $product_id]);
        sendResponse('success', 'Cart updated');
    }
} catch (PDOException $e) {
    sendResponse('error', 'Failed to update cart: ' . $e->getMessage());
}
?>
