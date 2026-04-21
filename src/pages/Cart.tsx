import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, language, wishlist, toggleWishlist } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  const handleMoveToWishlist = (productId: string) => {
    if (!wishlist.includes(productId)) {
      toggleWishlist(productId);
    }
    removeFromCart(productId);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#013220]">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-[#1A1A1A] mb-4">Your cart is empty</h2>
        <p className="text-[#6B6B6B] mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products">
          <Button size="lg" className="w-full">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-4">
          {cart.map(item => {
            const displayName = language === 'ml' && item.nameMl ? item.nameMl : item.name;
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4 flex gap-4 items-center">
                <Link to={`/product/${item.id}`} className="w-24 h-24 bg-[#F5F5F5] rounded-xl flex-shrink-0 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-heading font-semibold text-[#1A1A1A] truncate">{displayName}</h3>
                  </Link>
                  <div className="text-sm text-[#6B6B6B] mb-2">{item.unit}</div>
                  <div className="font-bold text-[#1A1A1A]">{formatPrice(item.price)}</div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleMoveToWishlist(item.id)}
                      className="text-sm text-[#6B6B6B] hover:text-[#013220] transition-colors flex items-center gap-1 px-2"
                      title="Save for later"
                    >
                      <Heart size={18} />
                      <span className="hidden sm:inline">Save for later</span>
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-[#6B6B6B] hover:text-[#E53935] transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center bg-[#F5F5F5] rounded-lg p-1">
                    <button 
                      onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-[#1A1A1A] shadow-sm hover:bg-[#E0E0E0]"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-[#013220] text-white shadow-sm hover:bg-[#01422a]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sticky top-24">
            <h3 className="font-heading font-bold text-lg mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-[#1A1A1A] font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Delivery Charge</span>
                <span className="text-[#1A1A1A] font-medium">
                  {deliveryCharge === 0 ? <span className="text-[#43A047]">Free</span> : formatPrice(deliveryCharge)}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <div className="text-xs text-[#C9A227] bg-[#C9A227]/10 p-2 rounded-lg">
                  Add {formatPrice(500 - subtotal)} more for free delivery!
                </div>
              )}
            </div>
            
            <div className="border-t border-[#E0E0E0] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-lg">Total</span>
                <span className="font-heading font-bold text-2xl text-[#013220]">{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
