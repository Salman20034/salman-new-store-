import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus, Share2, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, wishlist, toggleWishlist, language, products } = useStore();
  
  const product = products.find(p => p.id === id);
  const cartItem = cart.find(item => item.id === id);
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const displayName = language === 'ml' && product.nameMl ? product.nameMl : product.name;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-3xl border border-[#E0E0E0] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Image Gallery */}
          <div className="md:w-1/2 bg-[#F5F5F5] p-8 md:p-12 flex items-center justify-center relative">
            {discount > 0 && (
              <div className="absolute top-6 left-6 z-10 bg-[#E53935] text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                {discount}% OFF
              </div>
            )}
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <button className="p-3 bg-white rounded-full text-[#6B6B6B] hover:text-[#1A1A1A] shadow-sm transition-colors">
                <Share2 size={20} />
              </button>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="p-3 bg-white rounded-full text-[#6B6B6B] hover:text-[#E53935] shadow-sm transition-colors"
              >
                <Heart size={20} className={isWishlisted ? "fill-[#E53935] text-[#E53935]" : ""} />
              </button>
            </div>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full max-w-md object-contain mix-blend-multiply"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="mb-2 text-sm font-medium text-[#013220]">{product.category}</div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A] mb-2">
              {displayName}
            </h1>
            <div className="text-[#6B6B6B] mb-6">{product.unit}</div>
            
            <div className="flex items-end gap-4 mb-8">
              <div className="text-4xl font-bold text-[#1A1A1A]">{formatPrice(product.price)}</div>
              {product.originalPrice && (
                <div className="text-xl text-[#6B6B6B] line-through mb-1">{formatPrice(product.originalPrice)}</div>
              )}
            </div>

            <div className="prose prose-sm text-[#6B6B6B] mb-8">
              <p>{product.description}</p>
            </div>

            <div className="mt-auto space-y-6">
              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                {cartItem ? (
                  <div className="flex items-center justify-between bg-[#F5F5F5] rounded-xl p-2 sm:w-40">
                    <button 
                      onClick={() => cartItem.quantity > 1 ? updateQuantity(product.id, cartItem.quantity - 1) : removeFromCart(product.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-[#1A1A1A] shadow-sm hover:bg-[#E0E0E0]"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="font-medium text-lg">{cartItem.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#013220] text-white shadow-sm hover:bg-[#01422a]"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between bg-[#F5F5F5] rounded-xl p-2 sm:w-40">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-[#1A1A1A] shadow-sm hover:bg-[#E0E0E0]"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-medium text-lg">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-[#1A1A1A] shadow-sm hover:bg-[#E0E0E0]"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <Button 
                      size="lg" 
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#E0E0E0]">
                <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#013220]">
                    <Truck size={20} />
                  </div>
                  <span>Local Delivery<br/>in 2 Hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#013220]">
                    <ShieldCheck size={20} />
                  </div>
                  <span>Quality<br/>Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
