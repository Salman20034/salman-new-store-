<?php
// backend/migrate_products.php
require_once 'config/db.php';

try {
    echo "Starting migration for products table...\n";
    
    // Check if nameMl exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'nameMl'");
    if (!$stmt->fetch()) {
        echo "Adding nameMl column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN nameMl VARCHAR(255) AFTER name");
    }
    
    // Check if description exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'description'");
    if (!$stmt->fetch()) {
        echo "Adding description column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN description TEXT AFTER nameMl");
    }
    
    // Check if originalPrice exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'originalPrice'");
    if (!$stmt->fetch()) {
        echo "Adding originalPrice column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN originalPrice DECIMAL(10, 2) AFTER price");
    }
    
    // Check if unit exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'unit'");
    if (!$stmt->fetch()) {
        echo "Adding unit column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN unit VARCHAR(50) AFTER category");
    }
    
    // Check if stockQuantity exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'stockQuantity'");
    if (!$stmt->fetch()) {
        echo "Adding stockQuantity column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN stockQuantity INT DEFAULT 0 AFTER unit");
        
        // Copy data from old 'stock' column if it exists
        $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'stock'");
        if ($stmt->fetch()) {
            echo "Copying data from stock to stockQuantity...\n";
            $pdo->exec("UPDATE products SET stockQuantity = stock");
            echo "Dropping old stock column...\n";
            $pdo->exec("ALTER TABLE products DROP COLUMN stock");
        }
    }
    
    // Check if inStock exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'inStock'");
    if (!$stmt->fetch()) {
        echo "Adding inStock column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN inStock BOOLEAN DEFAULT TRUE AFTER stockQuantity");
    }
    
    // Check if isLocal exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'isLocal'");
    if (!$stmt->fetch()) {
        echo "Adding isLocal column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN isLocal BOOLEAN DEFAULT FALSE AFTER inStock");
    }

    // Change id from INT to VARCHAR(50) if necessary
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'id'");
    $col = $stmt->fetch();
    if (strpos($col['Type'], 'int') !== false) {
        echo "Converting id column to VARCHAR(50)...\n";
        
        // Drop foreign keys first
        echo "Dropping foreign keys...\n";
        try { $pdo->exec("ALTER TABLE cart DROP FOREIGN KEY cart_ibfk_2"); } catch(Exception $e) {}
        try { $pdo->exec("ALTER TABLE order_items DROP FOREIGN KEY order_items_ibfk_2"); } catch(Exception $e) {}
        
        // Convert columns in referencing tables too
        echo "Converting referencing columns...\n";
        $pdo->exec("ALTER TABLE cart MODIFY product_id VARCHAR(50) NOT NULL");
        $pdo->exec("ALTER TABLE order_items MODIFY product_id VARCHAR(50) NOT NULL");

        // Now convert product ID
        echo "Converting product ID type...\n";
        $pdo->exec("ALTER TABLE products MODIFY id INT NOT NULL"); // Remove auto_increment
        $pdo->exec("ALTER TABLE products MODIFY id VARCHAR(50) NOT NULL");
        
        // Restore foreign keys
        echo "Restoring foreign keys...\n";
        $pdo->exec("ALTER TABLE cart ADD CONSTRAINT cart_ibfk_2 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE");
        $pdo->exec("ALTER TABLE order_items ADD CONSTRAINT order_items_ibfk_2 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE");
    }

    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
