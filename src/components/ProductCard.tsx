import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../data/mockData';
import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';
import { Button } from './ui/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, removeFromCart, updateQuantity, wishlist, toggleWishlist, language } = useStore();
  
  const cartItem = cart.find(item => item.id === product.id);
  const isWishlisted = wishlist.includes(product.id);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const displayName = language === 'ml' && product.nameMl ? product.nameMl : product.name;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-[#E53935] text-white text-xs font-bold px-2 py-1 rounded-md">
          {discount}% OFF
        </div>
      )}
      
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#6B6B6B] hover:text-[#E53935] transition-colors"
      >
        <Heart size={18} className={isWishlisted ? "fill-[#E53935] text-[#E53935]" : ""} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#F5F5F5]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-[#1A1A1A] text-white px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-[#6B6B6B] mb-1">{product.unit}</div>
        <Link to={`/product/${product.id}`} className="block flex-grow">
          <h3 className="font-heading font-medium text-[#1A1A1A] line-clamp-2 mb-2 group-hover:text-[#013220] transition-colors">
            {displayName}
          </h3>
        </Link>
        
        <div className="flex items-end justify-between mt-auto pt-4">
          <div>
            <div className="font-bold text-lg text-[#1A1A1A]">{formatPrice(product.price)}</div>
            {product.originalPrice && (
              <div className="text-sm text-[#6B6B6B] line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>
          
          {cartItem ? (
            <div className="flex items-center bg-[#F5F5F5] rounded-lg p-1">
              <button 
                onClick={() => cartItem.quantity > 1 ? updateQuantity(product.id, cartItem.quantity - 1) : removeFromCart(product.id)}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-[#1A1A1A] shadow-sm hover:bg-[#E0E0E0]"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium text-sm">{cartItem.quantity}</span>
              <button 
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-[#013220] text-white shadow-sm hover:bg-[#01422a]"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              className="px-3 rounded-lg border-[#013220] text-[#013220] hover:bg-[#013220] hover:text-white"
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
