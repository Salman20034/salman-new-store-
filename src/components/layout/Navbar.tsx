import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, MapPin, Globe } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatPrice } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { Logo } from '../ui/Logo';

const SearchBar = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const products = useStore(state => state.products);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = query.trim() === '' ? [] : products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    (p.nameMl && p.nameMl.includes(query))
  ).slice(0, 5);

  const handleSuggestionClick = (id: string) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false);
      navigate(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${isMobile ? 'mt-3 md:hidden' : 'hidden md:flex flex-1 max-w-xl mx-8'}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={18} className="text-[#6B6B6B]" />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleSearchSubmit}
        placeholder="Search for groceries, vegetables..." 
        className={`w-full bg-[#F5F5F5] border-none py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#013220]/20 transition-all ${isMobile ? 'rounded-xl' : 'rounded-full'}`}
      />
      
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[#E0E0E0] overflow-hidden z-50"
          >
            {suggestions.map(product => (
              <button
                key={product.id}
                onClick={() => handleSuggestionClick(product.id)}
                className="w-full text-left px-4 py-3 hover:bg-[#F5F5F5] flex items-center gap-3 transition-colors border-b border-[#E0E0E0] last:border-0"
              >
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-[#F5F5F5]" />
                <div>
                  <div className="font-medium text-[#1A1A1A] text-sm">{product.name}</div>
                  <div className="text-xs text-[#6B6B6B]">{product.category}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const { cart, language, setLanguage, user, adminSettings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-4 border-b border-[#E0E0E0]'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 -ml-2 text-[#1A1A1A]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo className="w-12 h-12" src={adminSettings.storeLogo} alt={adminSettings.storeName} />
            </Link>

            {/* Desktop Search */}
            <SearchBar />

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Language Toggle */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] text-sm font-medium text-[#1A1A1A] transition-colors"
              >
                <Globe size={16} />
                <span>{language === 'en' ? 'EN' : 'മല'}</span>
              </button>

              {/* User */}
              <Link 
                to={user ? "/profile" : "/auth"} 
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] text-sm font-medium text-[#1A1A1A] transition-colors"
              >
                <User size={20} />
                <span>{user ? 'Profile' : 'Login'}</span>
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="flex items-center gap-3 bg-[#013220] text-white px-4 py-2.5 rounded-xl hover:bg-[#01422a] transition-colors shadow-sm"
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#C9A227] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[10px] text-white/70 leading-none mb-0.5">My Cart</div>
                  <div className="text-sm font-bold leading-none">{formatPrice(cartTotal)}</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search - Visible only on mobile */}
          <SearchBar isMobile={true} />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white z-[70] shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo className="w-10 h-10" src={adminSettings.storeLogo} alt={adminSettings.storeName} />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#6B6B6B]">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-1 mb-6">
                  <Link to="/" className="block px-4 py-3 rounded-xl hover:bg-[#F5F5F5] font-medium text-[#1A1A1A]">Home</Link>
                  <Link to="/products" className="block px-4 py-3 rounded-xl hover:bg-[#F5F5F5] font-medium text-[#1A1A1A]">All Products</Link>
                  <Link to="/categories" className="block px-4 py-3 rounded-xl hover:bg-[#F5F5F5] font-medium text-[#1A1A1A]">Categories</Link>
                  <Link to="/offers" className="block px-4 py-3 rounded-xl hover:bg-[#F5F5F5] font-medium text-[#1A1A1A] text-[#E53935]">Today's Offers</Link>
                </div>
                
                <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
                  <Link to={user ? "/profile" : "/auth"} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F5F5F5] font-medium text-[#1A1A1A]">
                    <User size={20} />
                    {user ? 'My Profile' : 'Login / Sign Up'}
                  </Link>
                  <button 
                    onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E0E0E0] font-medium text-[#1A1A1A]"
                  >
                    <Globe size={20} />
                    Change Language ({language === 'en' ? 'English' : 'മലയാളം'})
                  </button>
                </div>
              </div>
              
              <div className="p-4 border-t border-[#E0E0E0] bg-[#F5F5F5]">
                <div className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5 text-[#013220]" />
                  <p>Delivering to <strong className="text-[#1A1A1A]">Cheerattamala, Malappuram</strong></p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
