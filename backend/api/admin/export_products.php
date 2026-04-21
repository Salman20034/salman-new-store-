<?php
// backend/api/admin/export_products.php
require_once '../../config/db.php';
checkAdmin();

try {
    $stmt = $pdo->query("SELECT name, description, category, price, stockQuantity, image FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($products)) {
        // If no products, we can return an empty CSV or an error
        // Let's return a header-only CSV
    }

    // Set headers for download
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=products_export_' . date('Y-m-d') . '.csv');

    // Create a file pointer connected to the output stream
    $output = fopen('php://output', 'w');

    // Output the column headings
    fputcsv($output, ['name', 'description', 'category', 'price', 'stock', 'image']);

    // Output the data
    foreach ($products as $row) {
        fputcsv($output, $row);
    }

    fclose($output);
    exit;

} catch (PDOException $e) {
    sendResponse('error', 'Export failed: ' . $e->getMessage());
}
?>
