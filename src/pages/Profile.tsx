import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Package, Heart, MapPin, LogOut, RotateCcw } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export const Profile = () => {
  const { user, setUser, addToCart, orders } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleRepeatOrder = (orderItems: any[]) => {
    orderItems.forEach(item => {
      addToCart(item, item.quantity);
    });
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 mb-6">
            <div className="w-16 h-16 bg-[#013220] rounded-full flex items-center justify-center text-white font-heading font-bold text-xl mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">{user.name}</h2>
            <p className="text-[#6B6B6B] text-sm">{user.phone}</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden">
            <button className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#F5F5F5] transition-colors border-b border-[#E0E0E0]">
              <Package size={20} className="text-[#6B6B6B]" />
              <span className="font-medium text-[#1A1A1A]">My Orders</span>
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#F5F5F5] transition-colors border-b border-[#E0E0E0]">
              <Heart size={20} className="text-[#6B6B6B]" />
              <span className="font-medium text-[#1A1A1A]">Wishlist</span>
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#F5F5F5] transition-colors border-b border-[#E0E0E0]">
              <MapPin size={20} className="text-[#6B6B6B]" />
              <span className="font-medium text-[#1A1A1A]">Saved Addresses</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#F5F5F5] transition-colors text-[#E53935]"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg">Recent Orders</h3>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 text-[#6B6B6B]">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p>You haven't placed any orders yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-[#E0E0E0] rounded-xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="text-sm text-[#6B6B6B]">Order #{order.id}</div>
                        <div className="font-medium text-[#1A1A1A]">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#6B6B6B]">Total Amount</div>
                        <div className="font-bold text-[#013220]">{formatPrice(order.total)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-10 h-10 bg-[#F5F5F5] rounded-lg p-1" title={item.name}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-sm text-[#6B6B6B] ml-2">+{order.items.length - 3} more items</div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleRepeatOrder(order.items)}>
                        <RotateCcw size={16} /> Repeat Order
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
