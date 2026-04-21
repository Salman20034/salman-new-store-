<?php
// backend/api/cart.php
require_once '../config/db.php';

$user_id = $_GET['user_id'] ?? null;
checkUser($user_id);

if (!$user_id) {
    sendResponse('error', 'User ID is required');
}

try {
    $stmt = $pdo->prepare("
        SELECT c.id as cart_id, c.quantity, p.* 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    ");
    $stmt->execute([$user_id]);
    $cartItems = $stmt->fetchAll();

    foreach ($cartItems as &$item) {
        $item['inStock'] = (bool)$item['inStock'];
        $item['isLocal'] = (bool)$item['isLocal'];
        $item['price'] = (float)$item['price'];
        if (!empty($item['originalPrice'])) {
            $item['originalPrice'] = (float)$item['originalPrice'];
        }
        $item['stockQuantity'] = (int)$item['stockQuantity'];
        $item['quantity'] = (int)$item['quantity'];
    }
    unset($item);

    sendResponse('success', $cartItems);
} catch (PDOException $e) {
    sendResponse('error', 'Failed to fetch cart: ' . $e->getMessage());
}
?>
