<?php
// backend/api/admin/import_products.php
require_once '../../config/db.php';
checkAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Invalid request method');
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    sendResponse('error', 'Please upload a valid CSV file');
}

$file = $_FILES['file']['tmp_name'];
$handle = fopen($file, "r");

if ($handle === false) {
    sendResponse('error', 'Could not open the file');
}

// Skip the header row
$header = fgetcsv($handle);

$totalRows = 0;
$inserted = 0;
$skipped = 0;
$errors = [];

try {
    $pdo->beginTransaction();
    
    // Prepare statement once for performance
    $stmt = $pdo->prepare("INSERT INTO products (name, description, category, price, stockQuantity, image) VALUES (?, ?, ?, ?, ?, ?)");

    while (($data = fgetcsv($handle, 1000, ",")) !== false) {
        $totalRows++;
        
        // CSV Format: name, description, category, price, stock, image
        // Validate basic requirements
        if (count($data) < 6) {
            $skipped++;
            $errors[] = "Row $totalRows: Missing columns";
            continue;
        }

        $name = trim($data[0]);
        $description = trim($data[1]);
        $category = trim($data[2]);
        $price = (float)$data[3];
        $stock = (int)$data[4];
        $image = trim($data[5]);

        if (empty($name)) {
            $skipped++;
            $errors[] = "Row $totalRows: Name is required";
            continue;
        }

        try {
            $stmt->execute([$name, $description, $category, $price, $stock, $image]);
            $inserted++;
        } catch (PDOException $e) {
            $skipped++;
            $errors[] = "Row $totalRows: " . $e->getMessage();
        }
    }

    $pdo->commit();
    fclose($handle);

    sendResponse('success', [
        'total' => $totalRows,
        'inserted' => $inserted,
        'skipped' => $skipped,
        'errors' => $errors
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    fclose($handle);
    sendResponse('error', 'Import failed: ' . $e->getMessage());
}
?>
