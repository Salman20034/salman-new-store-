
<?php
require_once '../backend/config/db.php';

// Fetch products for initial load
try {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
    $products = $stmt->fetchAll();
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MK Store Admin - Products</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <div class="logo-container">
                <img src="https://mkstore.in/logo.png" alt="Logo" width="32" height="32" onerror="this.src='https://via.placeholder.com/32'">
            </div>
            <div>
                <div style="font-weight: 700; font-size: 18px;">MK Store</div>
                <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px;">Admin Panel</div>
            </div>
        </div>
        <div class="sidebar-nav">
            <a href="/admin" class="nav-item">
                <i data-lucide="layout-dashboard"></i>
                <span>Dashboard</span>
            </a>
            <a href="products.php" class="nav-item active">
                <i data-lucide="package"></i>
                <span>Products</span>
            </a>
            <a href="#" class="nav-item">
                <i data-lucide="shopping-bag"></i>
                <span>Orders</span>
            </a>
            <a href="#" class="nav-item">
                <i data-lucide="users"></i>
                <span>Customers</span>
            </a>
            <a href="#" class="nav-item">
                <i data-lucide="settings"></i>
                <span>Settings</span>
            </a>
        </div>
        <div style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <a href="/logout.php" class="nav-item">
                <i data-lucide="log-out"></i>
                <span>Logout</span>
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <header class="topbar">
            <div style="font-weight: 600; font-size: 20px;">Manage Products</div>
            <div style="display: flex; align-items: center; gap: 20px;">
                <button class="btn btn-outline"><i data-lucide="bell"></i></button>
                <div style="display: flex; align-items: center; gap: 12px; border-left: 1px solid var(--border); padding-left: 20px;">
                    <div style="width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">A</div>
                    <div style="font-size: 14px; font-weight: 600;">Admin User</div>
                </div>
            </div>
        </header>

        <main class="content-area">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h1 style="margin: 0; font-size: 24px;">All Products</h1>
                <div style="display: flex; gap: 12px;">
                    <button id="bulkDeleteBtn" class="btn btn-danger" style="display: none;" onclick="bulkDelete()">
                        <i data-lucide="trash-2"></i> Delete Selected (<span id="selectedCount">0</span>)
                    </button>
                    <button class="btn btn-primary" onclick="openModal('add')">
                        <i data-lucide="plus"></i> Add Product
                    </button>
                </div>
            </div>

            <div class="card">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px;"><input type="checkbox" id="selectAll"></th>
                            <th>Image</th>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="product-table-body">
                        <?php foreach ($products as $p): ?>
                        <tr id="row-<?= $p['id'] ?>">
                            <td><input type="checkbox" class="product-checkbox" value="<?= $p['id'] ?>"></td>
                            <td><img src="<?= (strpos($p['image'], 'http') === 0 || strpos($p['image'], 'data:') === 0) ? $p['image'] : '../' . $p['image'] ?>" class="product-img" onerror="this.src='https://via.placeholder.com/48?text=No+Image'"></td>
                            <td style="font-weight: 600;">#<?= $p['id'] ?></td>
                            <td style="font-weight: 600;"><?= htmlspecialchars($p['name']) ?></td>
                            <td><?= htmlspecialchars($p['category']) ?></td>
                            <td style="font-weight: 700; color: var(--primary);">₹<?= number_format($p['price'], 2) ?></td>
                            <td>
                                <span class="badge <?= $p['stockQuantity'] > 10 ? 'badge-success' : ($p['stockQuantity'] > 0 ? 'badge-warning' : 'badge-danger') ?>">
                                    <?= $p['stockQuantity'] ?> in stock
                                </span>
                            </td>
                            <td style="text-align: right;">
                                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                                    <a href="http://localhost:3000/product/<?= $p['id'] ?>" target="_blank" class="btn btn-edit" style="background: #f0f0f0; color: #666;" title="View on Site">
                                        <i data-lucide="eye" style="width:16px;"></i>
                                    </a>
                                    <button class="btn btn-edit" onclick='openModal("edit", <?= json_encode($p) ?>)' title="Edit"><i data-lucide="edit-2" style="width:16px;"></i></button>
                                    <button class="btn btn-danger" onclick="deleteProduct('<?= $p['id'] ?>')" title="Delete"><i data-lucide="trash-2" style="width:16px;"></i></button>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Modal -->
    <div id="productModal" class="modal-overlay">
        <div class="modal">
            <h2 id="modalTitle" style="margin-top: 0; margin-bottom: 24px;">Add Product</h2>
            <form id="productForm">
                <input type="hidden" id="prodId" name="id">
                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" id="prodName" name="name" class="form-control" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label>Price (₹)</label>
                        <input type="number" id="prodPrice" name="price" step="0.01" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" id="prodStock" name="stockQuantity" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select id="prodCategory" name="category" class="form-control">
                        <option>Fruits & Vegetables</option>
                        <option>Dairy Products</option>
                        <option>Rice & Grains</option>
                        <option>Snacks</option>
                        <option>Beverages</option>
                        <option>Personal Care</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Product Image</label>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <img id="imagePreview" src="" style="width: 48px; height: 48px; border-radius: 8px; object-cover: cover; display: none; border: 1px solid var(--border);">
                        <input type="file" id="prodImageFile" name="image_file" class="form-control" accept="image/*" style="padding: 8px;">
                    </div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 4px;">OR Enter Image URL</div>
                    <input type="text" id="prodImage" name="image" class="form-control" placeholder="https://...">
                </div>
                <div style="display: flex; gap: 12px; margin-top: 32px;">
                    <button type="button" class="btn btn-outline" style="flex: 1;" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Save Product</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        lucide.createIcons();

        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        let currentMode = 'add';

        function openModal(mode, data = null) {
            currentMode = mode;
            document.getElementById('modalTitle').innerText = mode === 'add' ? 'Add New Product' : 'Edit Product';
            
            if (data) {
                document.getElementById('prodId').value = data.id;
                document.getElementById('prodName').value = data.name;
                document.getElementById('prodPrice').value = data.price;
                document.getElementById('prodStock').value = data.stockQuantity;
                document.getElementById('prodCategory').value = data.category;
                document.getElementById('prodImage').value = data.image;
                
                const preview = document.getElementById('imagePreview');
                if (data.image) {
                    preview.src = data.image.startsWith('http') ? data.image : '../' + data.image;
                    preview.style.display = 'block';
                } else {
                    preview.style.display = 'none';
                }
            } else {
                form.reset();
                document.getElementById('prodId').value = '';
                document.getElementById('imagePreview').style.display = 'none';
            }
            
            modal.style.display = 'flex';
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            const url = currentMode === 'add' ? 'api/add_product.php' : 'api/edit_product.php';
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData // Browser will set the correct Content-Type with boundary
                });
                const result = await response.json();
                
                if (result.status === 'success') {
                    location.reload();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (err) {
                alert('Request failed');
            }
        };

        // Preview image on file selection
        document.getElementById('prodImageFile').onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('imagePreview');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };

        async function deleteProduct(id) {
            if (!confirm('Are you sure you want to delete this product?')) return;
            
            try {
                const response = await fetch('api/delete_product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                const result = await response.json();
                
                if (result.status === 'success') {
                    document.getElementById('row-' + id).remove();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (err) {
                alert('Request failed');
            }
        }

        // Bulk Actions logic
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.getElementsByClassName('product-checkbox');
        const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        const selectedCountLabel = document.getElementById('selectedCount');

        selectAll.onchange = () => {
            Array.from(checkboxes).forEach(cb => cb.checked = selectAll.checked);
            updateBulkBtn();
        };

        Array.from(checkboxes).forEach(cb => {
            cb.onchange = updateBulkBtn;
        });

        function updateBulkBtn() {
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            bulkDeleteBtn.style.display = checkedCount > 0 ? 'flex' : 'none';
            selectedCountLabel.innerText = checkedCount;
        }

        async function bulkDelete() {
            const selectedIds = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            if (selectedIds.length === 0) return;
            if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;

            try {
                const response = await fetch('api/bulk_delete.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selectedIds })
                });
                const result = await response.json();
                
                if (result.status === 'success') {
                    selectedIds.forEach(id => {
                        const row = document.getElementById('row-' + id);
                        if (row) row.remove();
                    });
                    bulkDeleteBtn.style.display = 'none';
                    selectAll.checked = false;
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (err) {
                alert('Request failed');
            }
        }
    </script>
</body>
</html>
