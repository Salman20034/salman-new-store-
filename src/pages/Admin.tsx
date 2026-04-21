import React, { useState, useMemo } from 'react';
import { 
  Package, ShoppingBag, Users, TrendingUp, Plus, Edit, Trash2, 
  LogOut, Bell, Search, Settings as SettingsIcon, Menu, X, Check, AlertTriangle,
  BarChart2, Box, ChevronRight, Eye, Save, Upload, Download
} from 'lucide-react';
import { useStore, Order, Customer, AdminSettings } from '../store/useStore';
import { Product, CATEGORIES } from '../data/mockData';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';
import { apiService, BASE_URL } from '../services/apiService';
import { Checkbox } from '../components/ui/Checkbox';

type Tab = 'dashboard' | 'products' | 'orders' | 'customers' | 'inventory' | 'analytics' | 'settings';

export const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { 
    isAdminAuthenticated, setAdminAuthenticated,
    products, addProduct, updateProduct, deleteProduct, bulkDeleteProducts,
    orders, updateOrderStatus,
    customers,
    adminSettings, updateAdminSettings, fetchSettings, saveSettings
  } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
      const admin = await apiService.adminLogin({ username, password });
      setAdminAuthenticated(true);
    } catch (error: any) {
      setLoginError(error.message || 'Invalid credentials. Try salman / salman123');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full border border-[#E0E0E0]">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16" src={adminSettings.storeLogo} alt={adminSettings.storeName} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-center text-[#0B3D2E] mb-2">Admin Access</h1>
          <p className="text-center text-[#6B6B6B] mb-8">Enter your credentials to access the dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Username" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (salman)"
              required
            />
            <Input 
              label="Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (salman123)"
              required
            />
            {loginError && <p className="text-[#E53935] text-sm">{loginError}</p>}
            <Button type="submit" className="w-full bg-[#0B3D2E] hover:bg-[#0B3D2E]/90 text-white" isLoading={isLoading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F7F5F2] overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0B3D2E] text-white transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg">
              <Logo className="w-8 h-8" src={adminSettings.storeLogo} alt={adminSettings.storeName} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg leading-tight">{adminSettings.storeName}</h2>
              <p className="text-[10px] text-white/70 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <SidebarItem icon={<TrendingUp size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
          <SidebarItem icon={<Package size={20} />} label="Products" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }} />
          <SidebarItem icon={<ShoppingBag size={20} />} label="Orders" active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }} />
          <SidebarItem icon={<Users size={20} />} label="Customers" active={activeTab === 'customers'} onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }} />
          <SidebarItem icon={<Box size={20} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }} />
          <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }} />
          <SidebarItem icon={<SettingsIcon size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} />
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setAdminAuthenticated(false)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="bg-white border-b border-[#E0E0E0] h-20 px-4 md:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#1A1A1A]" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-[#F7F5F2] rounded-full px-4 py-2 w-64 border border-[#E0E0E0]">
              <Search size={18} className="text-[#6B6B6B] mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative text-[#6B6B6B] hover:text-[#0B3D2E] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C8A951] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-[#E0E0E0]">
              <div className="w-10 h-10 rounded-full bg-[#0B3D2E] text-white flex items-center justify-center font-bold">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#1A1A1A]">Admin User</p>
                <button 
                  onClick={() => setAdminAuthenticated(false)}
                  className="text-[10px] text-[#E53935] hover:underline font-bold uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <DashboardView products={products} orders={orders} customers={customers} />}
          {activeTab === 'products' && <ProductsView products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} bulkDeleteProducts={bulkDeleteProducts} />}
          {activeTab === 'orders' && <OrdersView orders={orders} updateOrderStatus={updateOrderStatus} />}
          {activeTab === 'customers' && <CustomersView customers={customers} />}
          {activeTab === 'inventory' && <InventoryView products={products} updateProduct={updateProduct} />}
          {activeTab === 'analytics' && <AnalyticsView orders={orders} />}
          {activeTab === 'settings' && <SettingsView settings={adminSettings} onSave={saveSettings} />}
        </main>

      </div>
    </div>
  );
};

// --- Subcomponents ---

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all
      ${active ? 'bg-[#C8A951] text-[#0B3D2E]' : 'text-white/70 hover:bg-white/10 hover:text-white'}
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// --- Views ---

const DashboardView = ({ products, orders, customers }: { products: Product[], orders: Order[], customers: Customer[] }) => {
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const lowStockCount = products.filter(p => p.stockQuantity < 10).length;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading font-bold text-[#1A1A1A]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatPrice(totalRevenue || 45231)} icon={<TrendingUp size={24} />} color="text-[#0B3D2E]" bg="bg-[#0B3D2E]/10" />
        <StatCard title="Total Orders" value={(orders.length || 156).toString()} icon={<ShoppingBag size={24} />} color="text-[#C8A951]" bg="bg-[#C8A951]/20" />
        <StatCard title="Total Customers" value={(customers.length || 89).toString()} icon={<Users size={24} />} color="text-[#1A1A1A]" bg="bg-[#1A1A1A]/10" />
        <StatCard title="Low Stock Items" value={lowStockCount.toString()} icon={<AlertTriangle size={24} />} color="text-[#E53935]" bg="bg-[#E53935]/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 shadow-sm">
            <h2 className="font-heading font-bold text-lg mb-6">Sales Overview</h2>
            <div className="h-64 flex items-end gap-2 sm:gap-4">
              {/* Basic CSS Bar Chart */}
              {[40, 70, 45, 90, 65, 85, 120].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-[#F7F5F2] rounded-t-lg relative flex-1 flex items-end">
                    <div 
                      className="w-full bg-[#0B3D2E] rounded-t-lg transition-all duration-500 group-hover:bg-[#C8A951]" 
                      style={{ height: `${(height / 120) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#6B6B6B]">Day {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {lowStockCount > 0 && (
            <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2 text-[#E53935]">
                  <AlertTriangle size={20} /> Critical Low Stock
                </h2>
              </div>
              <div className="space-y-4">
                {products.filter(p => p.stockQuantity < 10).slice(0, 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-[#E53935]/5 rounded-xl border border-[#E53935]/20">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{product.name}</p>
                        <p className="text-xs text-[#6B6B6B]">Category: {product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 bg-[#E53935] text-white text-xs font-bold px-2 py-1 rounded-md">
                        {product.stockQuantity} Left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-lg">Recent Orders</h2>
            <button className="text-sm text-[#C8A951] font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order, i) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-[#F7F5F2] rounded-xl transition-colors">
                <div>
                  <p className="font-medium text-[#1A1A1A]">#{order.id.slice(0,6)}</p>
                  <p className="text-xs text-[#6B6B6B]">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#0B3D2E]">{formatPrice(order.total)}</p>
                  <p className={`text-[10px] font-bold uppercase ${
                    order.status === 'Delivered' ? 'text-[#43A047]' : 
                    order.status === 'Cancelled' ? 'text-[#E53935]' : 'text-[#C8A951]'
                  }`}>{order.status}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-8 text-[#6B6B6B]">No recent orders</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-[#E0E0E0] shadow-sm flex items-center gap-4">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-sm text-[#6B6B6B] font-medium mb-1">{title}</div>
      <div className="text-2xl font-bold text-[#1A1A1A]">{value}</div>
    </div>
  </div>
);

const ProductsView = ({ products, addProduct, updateProduct, deleteProduct, bulkDeleteProducts }: any) => {
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const res = await apiService.importProducts(formData);
      showSuccess(`Imported ${res.inserted} products! (${res.skipped} skipped)`);
      setImportFile(null);
      // Refresh products if possible - useStore might need a refresh method
      window.location.reload(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    window.location.href = apiService.exportProductsUrl;
  };

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStock = stockFilter === 'all' || (stockFilter === 'low' && p.stockQuantity > 0 && p.stockQuantity <= 10) || (stockFilter === 'out' && p.stockQuantity === 0);
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesStock && matchesCategory;
  });

  if (sortBy === 'price-asc') filteredProducts.sort((a: Product, b: Product) => a.price - b.price);
  else if (sortBy === 'price-desc') filteredProducts.sort((a: Product, b: Product) => b.price - a.price);
  else if (sortBy === 'stock-asc') filteredProducts.sort((a: Product, b: Product) => a.stockQuantity - b.stockQuantity);
  else if (sortBy === 'stock-desc') filteredProducts.sort((a: Product, b: Product) => b.stockQuantity - a.stockQuantity);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteProduct(deleteConfirmId);
      showSuccess('Product deleted successfully!');
      setDeleteConfirmId(null);
      setSelectedIds(prev => prev.filter(id => id !== deleteConfirmId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      await bulkDeleteProducts(selectedIds);
      showSuccess(`${selectedIds.length} products deleted successfully!`);
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  if (isAdding || editingId) {
    const productToEdit = editingId ? products.find((p: Product) => p.id === editingId) : null;
    return (
      <ProductForm 
        initialData={productToEdit} 
        onSave={async (data: any) => {
          const isFormData = data instanceof FormData;
          const id = isFormData ? data.get('id') : data.id;

          if (editingId) {
            await updateProduct(data);
            showSuccess('Product updated successfully!');
          } else {
            const finalData = isFormData ? data : { ...data, id: `prod-${Date.now()}` };
            await addProduct(finalData);
            showSuccess('Product added successfully!');
          }
          setIsAdding(false);
          setEditingId(null);
        }}
        onCancel={() => { setIsAdding(false); setEditingId(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold text-[#1A1A1A]">Manage Products</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowBulkActions(!showBulkActions)} 
            className="border-[#0B3D2E] text-[#0B3D2E] gap-2"
          >
            <Box size={18} /> Bulk Actions
          </Button>
          <Button onClick={() => setIsAdding(true)} className="bg-[#0B3D2E] hover:bg-[#0B3D2E]/90 gap-2">
            <Plus size={18} /> Add Product
          </Button>
        </div>
      </div>

      {showBulkActions && (
        <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 shadow-sm flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex-1 space-y-4">
            <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2">
              <Upload size={18} className="text-[#C8A951]" /> Bulk Import (CSV)
            </h3>
            <form onSubmit={handleImport} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="flex-1 text-sm text-[#6B6B6B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0B3D2E]/10 file:text-[#0B3D2E] hover:file:bg-[#0B3D2E]/20"
              />
              <Button 
                type="submit" 
                disabled={!importFile || isImporting} 
                isLoading={isImporting}
                className="bg-[#0B3D2E]"
              >
                Upload CSV
              </Button>
            </form>
            <p className="text-[10px] text-[#6B6B6B]">Format: name, description, category, price, stock, image</p>
          </div>
          
          <div className="border-l border-[#E0E0E0] hidden md:block"></div>
          
          <div className="flex-1 space-y-4">
            <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2">
              <Download size={18} className="text-[#C8A951]" /> Bulk Export
            </h3>
            <p className="text-sm text-[#6B6B6B]">Download all products as a CSV file for backup or editing.</p>
            <Button 
              onClick={handleExport} 
              variant="outline"
              className="w-full sm:w-auto border-[#0B3D2E] text-[#0B3D2E] hover:bg-[#0B3D2E]/5"
            >
              Download products.csv
            </Button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="bg-[#43A047]/10 text-[#43A047] px-4 py-3 rounded-xl border border-[#43A047]/20 flex items-center gap-2 font-medium">
          <Check size={18} /> {successMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[#E0E0E0] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E0E0E0] flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F5F2] border border-[#E0E0E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A951]/50"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F7F5F2] border border-[#E0E0E0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C8A951]/50 text-sm"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F7F5F2] border border-[#E0E0E0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C8A951]/50 text-sm"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock (≤ 10)</option>
              <option value="out">Out of Stock (0)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F7F5F2] border border-[#E0E0E0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C8A951]/50 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
            </select>
          </div>
          {selectedIds.length > 0 && (
            <Button 
              variant="outline" 
              className="border-[#E53935] text-[#E53935] hover:bg-[#E53935]/5 ml-auto"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#6B6B6B] border-b border-[#E0E0E0] bg-[#F7F5F2]">
              <tr>
                <th className="p-4 w-10">
                  <Checkbox 
                    checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {paginatedProducts.map((product: Product) => (
                <tr key={product.id} className={cn("hover:bg-[#F7F5F2]/50 transition-colors", selectedIds.includes(product.id) && "bg-[#013220]/5")}>
                  <td className="p-4">
                    <Checkbox 
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-[#F7F5F2] border border-[#E0E0E0]" />
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">{product.name}</span>
                      <span className="text-xs text-[#6B6B6B]">{product.unit}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#6B6B6B]">{product.category}</td>
                  <td className="p-4 font-bold text-[#0B3D2E]">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stockQuantity > 10 ? 'bg-[#43A047]/10 text-[#43A047]' : product.stockQuantity > 0 ? 'bg-[#C8A951]/20 text-[#C8A951]' : 'bg-[#E53935]/10 text-[#E53935]'}`}>
                      {product.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditingId(product.id)} className="p-2 text-[#6B6B6B] hover:text-[#C8A951] bg-[#F7F5F2] rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => setDeleteConfirmId(product.id)} className="p-2 text-[#6B6B6B] hover:text-[#E53935] bg-[#F7F5F2] rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-[#6B6B6B]">No products found.</div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E0E0E0] flex items-center justify-between bg-[#F7F5F2]/50">
            <div className="text-sm text-[#6B6B6B]">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm font-medium px-2">
                {currentPage} / {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-4 mb-4 text-[#E53935]">
              <div className="w-12 h-12 rounded-full bg-[#E53935]/10 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-heading font-bold text-[#1A1A1A]">Delete Product</h2>
            </div>
            <p className="text-[#6B6B6B] mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1">Cancel</Button>
              <Button onClick={confirmDelete} className="flex-1 bg-[#E53935] hover:bg-[#E53935]/90 text-white border-none">Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ initialData, onSave, onCancel }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
  const [formData, setFormData] = useState(initialData || {
    name: '', nameMl: '', description: '', price: '', originalPrice: '',
    image: '', category: CATEGORIES[0], stockQuantity: '', unit: '', inStock: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      if (initialData?.id) data.append('id', initialData.id);
      else data.append('id', `prod-${Date.now()}`);
      
      data.append('name', formData.name);
      data.append('nameMl', formData.nameMl || '');
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      data.append('originalPrice', String(formData.originalPrice || ''));
      data.append('category', formData.category);
      data.append('stockQuantity', String(formData.stockQuantity));
      data.append('unit', formData.unit);
      data.append('inStock', Number(formData.stockQuantity) > 0 ? '1' : '0');
      
      if (imageFile) {
        data.append('image_file', imageFile);
      } else {
        data.append('image', formData.image);
      }

      await onSave(data);
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-heading font-bold text-[#1A1A1A]">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
        <button onClick={onCancel} className="p-2 text-[#6B6B6B] hover:bg-[#F7F5F2] rounded-full"><X size={20} /></button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Product Name (English)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input label="Product Name (Malayalam)" value={formData.nameMl} onChange={e => setFormData({...formData, nameMl: e.target.value})} />
          <Input label="Price (₹)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
          <Input label="Original Price (₹) - Optional" type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1A1A1A]">Category</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A951]/50"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <Input label="Unit (e.g., 1 kg, 500 ml)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} required />
          <Input label="Stock Quantity" type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} required />
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1A1A1A]">Product Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img 
                  src={imagePreview.startsWith('http') || imagePreview.startsWith('data') ? imagePreview : `${BASE_URL}/${imagePreview}`} 
                  alt="Preview" 
                  className="w-12 h-12 rounded-lg object-cover border border-[#E0E0E0]" 
                />
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-[#6B6B6B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0B3D2E]/10 file:text-[#0B3D2E] hover:file:bg-[#0B3D2E]/20"
              />
            </div>
            {!imagePreview && <p className="text-xs text-[#E53935]">Image is required</p>}
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#1A1A1A]">Description</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A951]/50 min-h-[100px]"
            required
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-[#E0E0E0]">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" className="flex-1 bg-[#0B3D2E] hover:bg-[#0B3D2E]/90" isLoading={isSubmitting}>Save Product</Button>
        </div>
      </form>
    </div>
  );
};

const OrdersView = ({ orders, updateOrderStatus }: any) => {
  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o: Order) => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-[#1A1A1A]">Manage Orders</h1>
      
      <div className="bg-white rounded-3xl border border-[#E0E0E0] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E0E0E0]">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F5F2] border border-[#E0E0E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A951]/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#6B6B6B] border-b border-[#E0E0E0] bg-[#F7F5F2]">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {filteredOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-[#F7F5F2]/50 transition-colors">
                  <td className="p-4 font-bold text-[#1A1A1A]">#{order.id.slice(0,8)}</td>
                  <td className="p-4">
                    <div className="font-medium text-[#1A1A1A]">{order.customerName}</div>
                    <div className="text-xs text-[#6B6B6B]">{order.customerPhone}</div>
                  </td>
                  <td className="p-4 text-[#6B6B6B]">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-[#0B3D2E]">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-bold uppercase px-2 py-1 rounded-md border-none outline-none cursor-pointer
                        ${order.status === 'Delivered' ? 'bg-[#43A047]/10 text-[#43A047]' : 
                          order.status === 'Cancelled' ? 'bg-[#E53935]/10 text-[#E53935]' : 
                          'bg-[#C8A951]/20 text-[#C8A951]'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setViewOrder(order)} className="p-2 text-[#6B6B6B] hover:text-[#0B3D2E] bg-[#F7F5F2] rounded-lg transition-colors"><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-[#6B6B6B]">No orders found matching your search.</div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#E0E0E0] pb-4">
              <div>
                <h2 className="text-xl font-heading font-bold text-[#1A1A1A]">Order Details</h2>
                <p className="text-sm text-[#6B6B6B]">Order #{viewOrder.id}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-2 text-[#6B6B6B] hover:bg-[#F7F5F2] rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#F7F5F2] p-4 rounded-2xl">
                <h3 className="font-bold text-[#1A1A1A] mb-2">Customer Info</h3>
                <p className="text-sm text-[#6B6B6B]"><span className="font-medium text-[#1A1A1A]">Name:</span> {viewOrder.customerName}</p>
                <p className="text-sm text-[#6B6B6B]"><span className="font-medium text-[#1A1A1A]">Phone:</span> {viewOrder.customerPhone}</p>
                <p className="text-sm text-[#6B6B6B]"><span className="font-medium text-[#1A1A1A]">Date:</span> {new Date(viewOrder.date).toLocaleString()}</p>
              </div>
              <div className="bg-[#F7F5F2] p-4 rounded-2xl">
                <h3 className="font-bold text-[#1A1A1A] mb-2">Order Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase
                  ${viewOrder.status === 'Delivered' ? 'bg-[#43A047]/10 text-[#43A047]' : 
                    viewOrder.status === 'Cancelled' ? 'bg-[#E53935]/10 text-[#E53935]' : 
                    'bg-[#C8A951]/20 text-[#C8A951]'}`}
                >
                  {viewOrder.status}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-[#1A1A1A] mb-4">Order Items</h3>
            <div className="space-y-4 mb-6">
              {viewOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#E0E0E0] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-[#E0E0E0]" />
                    <div>
                      <p className="font-medium text-[#1A1A1A]">{item.name}</p>
                      <p className="text-xs text-[#6B6B6B]">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-[#0B3D2E]">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0E0E0] pt-4 flex justify-between items-center">
              <span className="font-bold text-lg text-[#1A1A1A]">Total Amount</span>
              <span className="font-bold text-2xl text-[#0B3D2E]">{formatPrice(viewOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomersView = ({ customers }: any) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-[#1A1A1A]">Customers</h1>
      
      <div className="bg-white rounded-3xl border border-[#E0E0E0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#6B6B6B] border-b border-[#E0E0E0] bg-[#F7F5F2]">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {customers.map((customer: Customer) => (
                <tr key={customer.id} className="hover:bg-[#F7F5F2]/50 transition-colors">
                  <td className="p-4 font-bold text-[#1A1A1A]">{customer.name}</td>
                  <td className="p-4 text-[#6B6B6B]">{customer.phone}</td>
                  <td className="p-4 text-[#6B6B6B]">{customer.email || 'N/A'}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-[#F7F5F2] rounded-full text-xs font-bold text-[#0B3D2E]">{customer.ordersCount}</span>
                  </td>
                  <td className="p-4 font-bold text-[#0B3D2E]">{formatPrice(customer.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InventoryView = ({ products, updateProduct }: any) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-[#1A1A1A]">Inventory Management</h1>
      
      <div className="bg-white rounded-3xl border border-[#E0E0E0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#6B6B6B] border-b border-[#E0E0E0] bg-[#F7F5F2]">
              <tr>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Current Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {products.map((product: Product) => (
                <tr key={product.id} className="hover:bg-[#F7F5F2]/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-[#1A1A1A]">{product.name}</span>
                  </td>
                  <td className="p-4 font-bold text-[#1A1A1A]">{product.stockQuantity}</td>
                  <td className="p-4">
                    {product.stockQuantity <= 10 ? (
                      <span className="flex items-center gap-1 text-[#E53935] text-xs font-bold bg-[#E53935]/10 px-2 py-1 rounded-md w-fit">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="text-[#43A047] text-xs font-bold bg-[#43A047]/10 px-2 py-1 rounded-md">Healthy</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        defaultValue={product.stockQuantity}
                        className="w-20 px-2 py-1 border border-[#E0E0E0] rounded-lg text-sm text-center focus:outline-none focus:border-[#C8A951]"
                        onBlur={(e) => {
                          const newStock = Number(e.target.value);
                          if (newStock !== product.stockQuantity) {
                            updateProduct({ ...product, stockQuantity: newStock, inStock: newStock > 0 });
                          }
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AnalyticsView = ({ orders }: any) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-[#1A1A1A]">Analytics</h1>
      <div className="bg-white rounded-3xl border border-[#E0E0E0] p-8 shadow-sm text-center">
        <BarChart2 size={48} className="mx-auto text-[#C8A951] mb-4" />
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Detailed Analytics Coming Soon</h2>
        <p className="text-[#6B6B6B]">We are building comprehensive charts and reports for your store.</p>
      </div>
    </div>
  );
};

const SettingsView = ({ settings, onSave }: { settings: AdminSettings, onSave: (formData: FormData) => Promise<void> }) => {
  const [formData, setFormData] = useState(settings);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.storeLogo || null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('store_name', formData.storeName);
      data.append('contact_phone', formData.contactPhone);
      data.append('contact_email', formData.contactEmail);
      data.append('delivery_charge', String(formData.deliveryCharge));
      data.append('min_order_amount', String(formData.freeDeliveryThreshold));
      
      if (logoFile) {
        data.append('logo', logoFile);
      }

      await onSave(data);
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-[#1A1A1A]">Store Settings</h1>
      
      {successMsg && (
        <div className="bg-[#43A047]/10 text-[#43A047] px-4 py-3 rounded-xl border border-[#43A047]/20 flex items-center gap-2 font-medium">
          <Check size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-[#E53935]/10 text-[#E53935] px-4 py-3 rounded-xl border border-[#E53935]/20 flex items-center gap-2 font-medium">
          <AlertTriangle size={18} /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E0E0E0] p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-lg border-b border-[#E0E0E0] pb-2">General Information</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1A1A]">Store Logo</label>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#F7F5F2] rounded-2xl border-2 border-dashed border-[#E0E0E0] flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview.startsWith('http') || logoPreview.startsWith('data') ? logoPreview : `${BASE_URL}/${logoPreview}`} alt="Logo Preview" className="w-full h-full object-contain" />
                ) : (
                  <Plus className="text-[#6B6B6B]" />
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  className="hidden" 
                  id="logo-upload" 
                />
                <label 
                  htmlFor="logo-upload" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7F5F2] hover:bg-[#E0E0E0] text-[#1A1A1A] text-sm font-medium rounded-xl cursor-pointer transition-colors"
                >
                  <Plus size={16} /> Choose Logo
                </label>
                <p className="text-[10px] text-[#6B6B6B] mt-2">Recommended: PNG or SVG with transparent background (Square or Rectangle)</p>
              </div>
            </div>
          </div>

          <Input label="Store Name" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} />
          <Input label="Contact Phone" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
          <Input label="Contact Email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="font-heading font-bold text-lg border-b border-[#E0E0E0] pb-2">Delivery Settings</h3>
          <Input label="Standard Delivery Charge (₹)" type="number" value={formData.deliveryCharge} onChange={e => setFormData({...formData, deliveryCharge: Number(e.target.value)})} />
          <Input label="Free Delivery Threshold (₹)" type="number" value={formData.freeDeliveryThreshold} onChange={e => setFormData({...formData, freeDeliveryThreshold: Number(e.target.value)})} />
        </div>

        <Button type="submit" className="w-full bg-[#0B3D2E] hover:bg-[#0B3D2E]/90 gap-2" isLoading={isSaving}>
          <Save size={18} /> Save Settings
        </Button>
      </form>
    </div>
  );
};
