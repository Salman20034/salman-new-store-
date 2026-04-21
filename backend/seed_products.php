<?php
// backend/seed_products.php
require_once 'config/db.php';

// This script should be run from the command line or accessed via URL to seed the database
// Note: checkAdmin() is disabled here for easy execution, but should be enabled in production.
// checkAdmin(); 

set_time_limit(0); // Increase timeout for large inserts

$categories = [
    "Fruits & Vegetables",
    "Rice & Grains",
    "Dairy Products",
    "Snacks",
    "Beverages",
    "Stationery",
    "Spices & Masalas",
    "Meat & Fish",
    "Personal Care",
    "Household"
];

$items = [
    ['name' => 'Apple', 'nameMl' => 'ആപ്പിൾ', 'category' => 'Fruits & Vegetables', 'unit' => '1 kg', 'basePrice' => 120],
    ['name' => 'Banana', 'nameMl' => 'പഴം', 'category' => 'Fruits & Vegetables', 'unit' => '1 kg', 'basePrice' => 60],
    ['name' => 'Milk', 'nameMl' => 'പാൽ', 'category' => 'Dairy Products', 'unit' => '500 ml', 'basePrice' => 25],
    ['name' => 'Bread', 'nameMl' => 'ബ്രെഡ്', 'category' => 'Snacks', 'unit' => '1 pack', 'basePrice' => 40],
    ['name' => 'Matta Rice', 'nameMl' => 'മട്ട അരി', 'category' => 'Rice & Grains', 'unit' => '5 kg', 'basePrice' => 200],
    ['name' => 'Dal', 'nameMl' => 'പരിപ്പ്', 'category' => 'Rice & Grains', 'unit' => '1 kg', 'basePrice' => 150],
    ['name' => 'Chicken', 'nameMl' => 'ചിക്കൻ', 'category' => 'Meat & Fish', 'unit' => '1 kg', 'basePrice' => 250],
    ['name' => 'Soap', 'nameMl' => 'സോപ്പ്', 'category' => 'Personal Care', 'unit' => '1 pc', 'basePrice' => 35],
    ['name' => 'Detergent', 'nameMl' => 'ഡിറ്റർജന്റ്', 'category' => 'Household', 'unit' => '1 kg', 'basePrice' => 180],
    ['name' => 'Tea', 'nameMl' => 'ചായ', 'category' => 'Beverages', 'unit' => '250 g', 'basePrice' => 100],
    ['name' => 'Coffee', 'nameMl' => 'കാപ്പി', 'category' => 'Beverages', 'unit' => '100 g', 'basePrice' => 150],
    ['name' => 'Chips', 'nameMl' => 'ചിപ്സ്', 'category' => 'Snacks', 'unit' => '1 pack', 'basePrice' => 20],
    ['name' => 'Juice', 'nameMl' => 'ജ്യൂസ്', 'category' => 'Beverages', 'unit' => '1 L', 'basePrice' => 90],
    ['name' => 'Yogurt', 'nameMl' => 'തൈര്', 'category' => 'Dairy Products', 'unit' => '400 g', 'basePrice' => 60],
    ['name' => 'Eggs', 'nameMl' => 'മുട്ട', 'category' => 'Dairy Products', 'unit' => '12 pcs', 'basePrice' => 80],
    ['name' => 'Notebook', 'nameMl' => 'നോട്ടുബുക്ക്', 'category' => 'Stationery', 'unit' => '1 pc', 'basePrice' => 45],
    ['name' => 'Pen', 'nameMl' => 'പേന', 'category' => 'Stationery', 'unit' => '1 pc', 'basePrice' => 10],
    ['name' => 'Black Pepper', 'nameMl' => 'കുരുമുളക്', 'category' => 'Spices & Masalas', 'unit' => '100 g', 'basePrice' => 80],
    ['name' => 'Cardamom', 'nameMl' => 'ഏലക്ക', 'category' => 'Spices & Masalas', 'unit' => '50 g', 'basePrice' => 150],
    ['name' => 'Tomato', 'nameMl' => 'തക്കാളി', 'category' => 'Fruits & Vegetables', 'unit' => '1 kg', 'basePrice' => 40],
    ['name' => 'Onion', 'nameMl' => 'സവാള', 'category' => 'Fruits & Vegetables', 'unit' => '1 kg', 'basePrice' => 30],
    ['name' => 'Potato', 'nameMl' => 'ഉരുളക്കിഴങ്ങ്', 'category' => 'Fruits & Vegetables', 'unit' => '1 kg', 'basePrice' => 35],
    ['name' => 'Basmati Rice', 'nameMl' => 'ബാസ്മതി അരി', 'category' => 'Rice & Grains', 'unit' => '1 kg', 'basePrice' => 120],
    ['name' => 'Sunflower Oil', 'nameMl' => 'സൺഫ്ലവർ ഓയിൽ', 'category' => 'Household', 'unit' => '1 L', 'basePrice' => 160],
    ['name' => 'Sugar', 'nameMl' => 'പഞ്ചസാര', 'category' => 'Rice & Grains', 'unit' => '1 kg', 'basePrice' => 45],
    ['name' => 'Salt', 'nameMl' => 'ഉപ്പ്', 'category' => 'Rice & Grains', 'unit' => '1 kg', 'basePrice' => 20],
    ['name' => 'Fish', 'nameMl' => 'മീൻ', 'category' => 'Meat & Fish', 'unit' => '1 kg', 'basePrice' => 400],
    ['name' => 'Beef', 'nameMl' => 'ബീഫ്', 'category' => 'Meat & Fish', 'unit' => '1 kg', 'basePrice' => 350],
];

$adjectives = ['Fresh', 'Organic', 'Premium', 'Local', 'Imported', 'Natural', 'Farm', 'Quality', 'Pure', 'Healthy', 'Tasty', 'Choice', 'Fine', 'Superior'];

echo "Seeding products...\n";

try {
    $pdo->beginTransaction();
    
    // Clear existing products if desired (optional)
    // $pdo->exec("DELETE FROM products");

    $stmt = $pdo->prepare("REPLACE INTO products (id, name, nameMl, description, price, originalPrice, image, category, stockQuantity, unit, inStock, isLocal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    for ($i = 0; $i < 1000; $i++) {
        $item = $items[$i % count($items)];
        $adj = $adjectives[array_rand($adjectives)];
        
        $priceMultiplier = 0.8 + (mt_rand(0, 70) / 100); // 0.8x to 1.5x
        $price = round($item['basePrice'] * $priceMultiplier);
        $hasDiscount = (mt_rand(0, 100) > 70);
        $originalPrice = $hasDiscount ? round($price * 1.2) : null;
        $stock = mt_rand(5, 200);
        $productId = "p-" . str_pad($i + 1, 4, "0", STR_PAD_LEFT);
        
        // Use a high-quality image based on item name for better relevancy
        $keyword = urlencode($item['name']);
        // Using Unsplash source with keywords for more professional results
        $imageUrl = "https://source.unsplash.com/400x400/?grocery,{$keyword}";
        
        // Alternatively, use loremflickr which is more reliable for keyword-based placeholders
        $imageUrl = "https://loremflickr.com/400/400/{$keyword},grocery/all";
        
        $stmt->execute([
            $productId,
            "{$adj} {$item['name']} " . ($i + 1),
            $item['nameMl'],
            "High quality {$adj} " . strtolower($item['name']) . " sourced directly for MK Store. Guaranteed freshness and taste.",
            $price,
            $originalPrice,
            $imageUrl,
            $item['category'],
            $stock,
            $item['unit'],
            1,
            (mt_rand(0, 100) > 50 ? 1 : 0)
        ]);
        
        if (($i + 1) % 100 == 0) {
            echo "Inserted " . ($i + 1) . " products...\n";
        }
    }
    
    $pdo->commit();
    echo "Successfully seeded 1000 products!\n";
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Error seeding products: " . $e->getMessage() . "\n";
}
?>
