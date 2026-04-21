import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, MOCK_PRODUCTS } from '../data/mockData';
import { apiService } from '../services/apiService';

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  customerName: string;
  customerPhone: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  ordersCount: number;
  totalSpent: number;
}

export interface AdminSettings {
  storeName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  storeLogo?: string;
}

interface StoreState {
  isAdminAuthenticated: boolean;
  setAdminAuthenticated: (status: boolean) => void;
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // User state
  user: any | null;
  setUser: (user: any | null) => void;
  fetchCart: (userId: number) => Promise<void>;
  fetchProducts: (category?: string) => Promise<void>;
  fetchOrders: (userId: number) => Promise<void>;
  
  // App state
  language: 'en' | 'ml';
  setLanguage: (lang: 'en' | 'ml') => void;

  // Admin state
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  bulkDeleteProducts: (productIds: string[]) => Promise<void>;

  customers: Customer[];
  addCustomer: (customer: Customer) => void;

  adminSettings: AdminSettings;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  fetchSettings: () => Promise<void>;
  saveSettings: (formData: FormData) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      setAdminAuthenticated: (status) => set({ isAdminAuthenticated: status }),
      cart: [],
      wishlist: [],
      orders: [],
      user: null,
      language: 'en',
      
      products: MOCK_PRODUCTS,
      customers: [
        { id: 'c1', name: 'John Doe', phone: '+919876543210', email: 'john.doe@example.com', ordersCount: 5, totalSpent: 2500 },
        { id: 'c2', name: 'Jane Smith', phone: '+919876543211', email: 'jane.smith@example.com', ordersCount: 2, totalSpent: 850 },
      ],
      adminSettings: {
        storeName: 'MK Store',
        contactPhone: '+91 98765 43210',
        contactEmail: 'support@mkstore.in',
        deliveryCharge: 40,
        freeDeliveryThreshold: 500,
      },
      
      addToCart: async (product, quantity = 1) => {
        const state = get();
        const productId = String(product.id);
        
        if (state.user) {
          try {
            await apiService.addToCart({ 
              user_id: state.user.id, 
              product_id: productId, 
              quantity 
            });
            const updatedCart = await apiService.getCart(state.user.id);
            set({ cart: updatedCart });
          } catch (error) {
            console.error('Failed to sync with database cart:', error);
          }
        } else {
          // Guest mode: local state only
          const existingItem = state.cart.find(item => String(item.id) === productId);
          if (existingItem) {
            set({
              cart: state.cart.map(item => 
                String(item.id) === productId 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            });
          } else {
            set({ cart: [...state.cart, { ...product, quantity }] });
          }
        }
      },
      
      removeFromCart: async (productId) => {
        const state = get();
        const id = String(productId);
        if (state.user) {
          try {
            await apiService.removeFromCart({ user_id: state.user.id, product_id: id });
            const updatedCart = await apiService.getCart(state.user.id);
            set({ cart: updatedCart });
          } catch (error) {
            console.error('Failed to remove from cart:', error);
          }
        } else {
          set({ cart: state.cart.filter(item => String(item.id) !== id) });
        }
      },
      
      updateQuantity: async (productId, quantity) => {
        const state = get();
        const id = String(productId);
        if (state.user) {
          try {
            await apiService.updateCart({ user_id: state.user.id, product_id: id, quantity });
            const updatedCart = await apiService.getCart(state.user.id);
            set({ cart: updatedCart });
          } catch (error) {
            console.error('Failed to update quantity:', error);
          }
        } else {
          set({
            cart: state.cart.map(item => 
              String(item.id) === id ? { ...item, quantity } : item
            )
          });
        }
      },
      
      clearCart: () => set({ cart: [] }),
      
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId]
      })),
      
      addOrder: async (order) => {
        const state = get();
        if (state.user) {
          try {
            await apiService.placeOrder({
              user_id: state.user.id,
              items: order.items,
              total: order.total,
              customerName: order.customerName,
              customerPhone: order.customerPhone
            });
            const updatedOrders = await apiService.getOrders(state.user.id);
            const updatedProducts = await apiService.getProducts();
            set({ 
              orders: updatedOrders,
              products: updatedProducts,
              cart: [] 
            });
          } catch (error) {
            console.error('Failed to place order:', error);
          }
        }
      },

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      })),
      
      setUser: (user) => {
        set({ user });
        if (user) {
          get().fetchCart(user.id);
          get().fetchOrders(user.id);
        } else {
          apiService.logout().catch(console.error);
        }
      },
      setLanguage: (language) => set({ language }),

      fetchCart: async (userId) => {
        try {
          const cart = await apiService.getCart(userId);
          set({ cart });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      },

      fetchProducts: async (category) => {
        try {
          const products = await apiService.getProducts(category);
          set({ products });
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      },

      fetchOrders: async (userId) => {
        try {
          const orders = await apiService.getOrders(userId);
          set({ orders });
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      },

      addProduct: async (product) => {
        try {
          await apiService.addProduct(product);
          const products = await apiService.getProducts();
          set({ products });
        } catch (error) {
          console.error('Failed to add product:', error);
        }
      },
      updateProduct: async (product) => {
        try {
          await apiService.updateProduct(product);
          const products = await apiService.getProducts();
          set({ products });
        } catch (error) {
          console.error('Failed to update product:', error);
        }
      },
      deleteProduct: async (productId) => {
        try {
          await apiService.deleteProduct({ id: productId });
          const products = await apiService.getProducts();
          set({ products });
        } catch (error) {
          console.error('Failed to delete product:', error);
        }
      },
      bulkDeleteProducts: async (productIds) => {
        try {
          await apiService.bulkDeleteProducts({ ids: productIds });
          const products = await apiService.getProducts();
          set({ products });
        } catch (error) {
          console.error('Failed to bulk delete products:', error);
        }
      },

      addCustomer: (customer) => set((state) => ({
        customers: [customer, ...state.customers]
      })),

      updateAdminSettings: (settings) => set((state) => ({
        adminSettings: { ...state.adminSettings, ...settings }
      })),
      fetchSettings: async () => {
        try {
          const data = await apiService.getSettings();
          set({
            adminSettings: {
              storeName: data.store_name,
              contactPhone: data.contact_phone,
              contactEmail: data.contact_email,
              deliveryCharge: data.delivery_charge,
              freeDeliveryThreshold: data.min_order_amount,
              storeLogo: data.store_logo
            }
          });
        } catch (error) {
          console.error('Failed to fetch settings:', error);
        }
      },
      saveSettings: async (formData) => {
        try {
          await apiService.updateSettings(formData);
          await get().fetchSettings();
        } catch (error) {
          console.error('Failed to save settings:', error);
          throw error;
        }
      },
    }),
    {
      name: 'mk-store-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Force update products to the new 1000+ list
          return {
            ...persistedState,
            products: MOCK_PRODUCTS
          };
        }
        return persistedState;
      }
    }
  )
);
