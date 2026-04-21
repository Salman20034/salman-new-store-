<?php
// admin/api/add_product.php
require_once '../../backend/config/db.php';

// Handle both JSON and Multipart/Form-Data
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
} else {
    $data = $_POST;
}

if (!$data || empty($data['name']) || !isset($data['price'])) {
    sendResponse('error', 'Missing required fields: name and price');
}

// Generate ID if not provided
$id = $data['id'] ?? 'p-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
$name = trim($data['name']);
$price = (float)$data['price'];
$category = $data['category'] ?? 'General';
$stockQuantity = isset($data['stockQuantity']) ? (int)$data['stockQuantity'] : 0;
$image = $data['image'] ?? '';

// Handle File Upload
if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image_file']['tmp_name'];
    $fileName = $_FILES['image_file']['name'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
    $uploadFileDir = '../../backend/uploads/';
    
    // Create directory if not exists
    if (!is_dir($uploadFileDir)) mkdir($uploadFileDir, 0777, true);
    
    $dest_path = $uploadFileDir . $newFileName;

    if(move_uploaded_file($fileTmpPath, $dest_path)) {
        $image = 'backend/uploads/' . $newFileName;
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO products (id, name, price, category, stockQuantity, image) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $name, $price, $category, $stockQuantity, $image]);
    
    sendResponse('success', 'Product added successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Database error: ' . $e->getMessage());
}
?>
