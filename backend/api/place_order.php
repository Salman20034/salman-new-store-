<?php
// backend/api/place_order.php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['user_id']) || !isset($data['items']) || !isset($data['total'])) {
    sendResponse('error', 'Missing required fields');
}

$user_id = $data['user_id'];
checkUser($user_id);
$items = $data['items'];
$customerName = htmlspecialchars(isset($data['customerName']) ? $data['customerName'] : '');
$customerPhone = htmlspecialchars(isset($data['customerPhone']) ? $data['customerPhone'] : '');

try {
    $pdo->beginTransaction();

    // 1. Recalculate Total and Verify Stock server-side
    $serverTotal = 0;
    $productData = [];

    foreach ($items as $item) {
        $stmtProduct = $pdo->prepare("SELECT price, stockQuantity FROM products WHERE id = ?");
        $stmtProduct->execute([$item['id']]);
        $prod = $stmtProduct->fetch();

        if (!$prod) {
            throw new Exception("Product ID " . $item['id'] . " not found");
        }
        if ($prod['stockQuantity'] < $item['quantity']) {
            throw new Exception("Insufficient stock for product: " . $item['id']);
        }

        $serverTotal += $prod['price'] * $item['quantity'];
        $productData[$item['id']] = $prod['price'];
    }

    // 2. Create Order with Server-Side Total
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total, status, customerName, customerPhone) VALUES (?, ?, 'Pending', ?, ?)");
    $stmt->execute([$user_id, $serverTotal, $customerName, $customerPhone]);
    $orderId = $pdo->lastInsertId();

    // 3. Add Order Items and Reduce Stock
    $stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    $stmtStock = $pdo->prepare("UPDATE products SET stockQuantity = stockQuantity - ?, inStock = IF(stockQuantity - ? > 0, 1, 0) WHERE id = ?");

    foreach ($items as $item) {
        $realPrice = $productData[$item['id']];
        $stmtItem->execute([$orderId, $item['id'], $item['quantity'], $realPrice]);
        $stmtStock->execute([$item['quantity'], $item['quantity'], $item['id']]);
    }

    // 4. Clear Cart
    $stmtClear = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmtClear->execute([$user_id]);

    $pdo->commit();
    sendResponse('success', ['order_id' => $orderId, 'total_paid' => $serverTotal]);
} catch (Exception $e) {
    $pdo->rollBack();
    sendResponse('error', 'Failed to place order: ' . $e->getMessage());
}
?>
