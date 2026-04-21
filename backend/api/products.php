<?php
// backend/api/products.php
require_once '../config/db.php';

$category = $_GET['category'] ?? null;
$search = $_GET['q'] ?? null;
$sort = $_GET['sort'] ?? 'newest';

try {
    $sql = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if ($category && $category !== 'all') {
        $sql .= " AND category = ?";
        $params[] = $category;
    }

    if ($search) {
        $sql .= " AND (name LIKE ? OR description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    switch ($sort) {
        case 'price_asc': 
            $sql .= " ORDER BY price ASC"; 
            break;
        case 'price_desc': 
            $sql .= " ORDER BY price DESC"; 
            break;
        case 'newest':
        default: 
            $sql .= " ORDER BY created_at DESC"; 
            break;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $products = $stmt->fetchAll();
    
    // Map database fields to frontend structure if necessary
    foreach ($products as &$product) {
        $product['inStock'] = (bool)$product['inStock'];
        $product['isLocal'] = (bool)$product['isLocal'];
        $product['price'] = (float)$product['price'];
        if (!empty($product['originalPrice'])) {
            $product['originalPrice'] = (float)$product['originalPrice'];
        }
        $product['stockQuantity'] = (int)$product['stockQuantity'];
    }
    unset($product); // break the reference with the last element
    
    sendResponse('success', $products);
} catch (PDOException $e) {
    sendResponse('error', 'Failed to fetch products: ' . $e->getMessage());
}
?>
