const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/mk_storee/backend/api';
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost/mk_storee';

async function request(endpoint: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const url = `${API_URL}${endpoint}`;
  console.log(`[API Request] ${options.method || 'GET'} ${url}`, options.body ? options.body : '');

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(`[API Error] HTTP ${response.status} ${response.statusText} on ${url}`);
    }

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('[API Error] Non-JSON response received:', text);
      throw new Error(`Server returned invalid response. (HTTP ${response.status})`);
    }

    if (result.status === 'error') {
      console.error(`[API Backend Error] ${result.message}`);
      throw new Error(result.message);
    }
    
    console.log(`[API Success] ${url}`, result.data);
    return result.data;
  } catch (error: any) {
    console.error(`[API Fetch Failed] ${url}:`, error.message);
    throw error;
  }
}

export const apiService = {
  // Auth
  login: (data: any) => request('/login.php', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request('/register.php', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/logout.php', { method: 'POST' }),
  verifyUser: (data: any) => request('/verify_user.php', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data: any) => request('/reset_password.php', { method: 'POST', body: JSON.stringify(data) }),

  // Products
  getProducts: (category?: string) => request(`/products.php${category ? `?category=${category}` : ''}`),
  getProduct: (id: string) => request(`/product.php?id=${id}`),

  // Cart
  getCart: (userId: number) => request(`/cart.php?user_id=${userId}`),
  addToCart: (data: any) => request('/cart_add.php', { method: 'POST', body: JSON.stringify(data) }),
  updateCart: (data: any) => request('/cart_update.php', { method: 'POST', body: JSON.stringify(data) }),
  removeFromCart: (data: any) => request('/cart_remove.php', { method: 'POST', body: JSON.stringify(data) }),

  // Orders
  placeOrder: (data: any) => request('/place_order.php', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: (userId: number) => request(`/orders.php?user_id=${userId}`),

  // Admin
  adminLogin: (data: any) => request('/admin/login.php', { method: 'POST', body: JSON.stringify(data) }),
  addProduct: (data: any) => request('/admin/add_product.php', { 
    method: 'POST', 
    body: data instanceof FormData ? data : JSON.stringify(data) 
  }),
  updateProduct: (data: any) => request('/admin/update_product.php', { 
    method: 'POST', 
    body: data instanceof FormData ? data : JSON.stringify(data) 
  }),
  deleteProduct: (data: any) => request('/admin/delete_product.php', { method: 'POST', body: JSON.stringify(data) }),
  bulkDeleteProducts: (data: { ids: string[] }) => request('/admin/bulk_delete_products.php', { method: 'POST', body: JSON.stringify(data) }),
  
  // Settings
  getSettings: () => request('/settings.php'),
  updateSettings: (formData: FormData) => request('/admin/update_settings.php', { method: 'POST', body: formData }),

  // Bulk Operations
  importProducts: (formData: FormData) => request('/admin/import_products.php', { method: 'POST', body: formData }),
  exportProductsUrl: `${API_URL}/admin/export_products.php`,
};
