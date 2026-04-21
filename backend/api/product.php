<?php
// backend/api/product.php
require_once '../config/db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    sendResponse('error', 'Product ID is required');
}

try {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if ($product) {
        $product['inStock'] = (bool)$product['inStock'];
        $product['isLocal'] = (bool)$product['isLocal'];
        $product['price'] = (float)$product['price'];
        if (!empty($product['originalPrice'])) {
            $product['originalPrice'] = (float)$product['originalPrice'];
        }
        $product['stockQuantity'] = (int)$product['stockQuantity'];
        
        sendResponse('success', $product);
    } else {
        sendResponse('error', 'Product not found');
    }
} catch (PDOException $e) {
    sendResponse('error', 'Failed to fetch product: ' . $e->getMessage());
}
?>
