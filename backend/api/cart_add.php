<?php
// backend/api/cart_add.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['user_id']) || empty($data['product_id'])) {
    sendResponse('error', 'Missing required fields');
}

$user_id = $data['user_id'];
checkUser($user_id);
$product_id = $data['product_id'];
$quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;

if ($quantity <= 0) {
    sendResponse('error', 'Quantity must be greater than zero');
}

try {
    // Check if product already in cart
    $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$user_id, $product_id]);
    $existing = $stmt->fetch();

    if ($existing) {
        $newQuantity = $existing['quantity'] + $quantity;
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
        $stmt->execute([$newQuantity, $existing['id']]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $product_id, $quantity]);
    }

    sendResponse('success', 'Product added to cart');
} catch (PDOException $e) {
    sendResponse('error', 'Failed to add to cart: ' . $e->getMessage());
}
?>
