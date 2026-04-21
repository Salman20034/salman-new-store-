import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, Clock, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

export const Home = () => {
  const products = useStore(state => state.products);
  const featuredProducts = products.slice(0, 8); // More products for carousel
  const offers = products.filter(p => p.originalPrice).slice(0, 4);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Approximate width of a card + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-10">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-4 md:pt-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#013220] text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600" 
              alt="Fresh Groceries" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#013220] via-[#013220]/80 to-transparent" />
          </div>
          
          <div className="relative z-10 p-8 md:p-16 lg:p-24 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-[#C9A227]/20 text-[#C9A227] text-sm font-semibold mb-4 border border-[#C9A227]/30">
                100% Fresh & Local
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                Premium Groceries,<br />Delivered Fresh.
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                Experience the finest quality local produce and daily essentials, sourced directly from farms in and around Malappuram.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button variant="gold" size="lg" className="gap-2">
                    Shop Now <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link to="/offers">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-[#013220]">
                    View Offers
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Grid (6 items) */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A] mb-2">Shop by Category</h2>
            <p className="text-[#6B6B6B]">Find exactly what you need</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.slice(0, 6).map((category, i) => (
            <Link 
              key={i} 
              to={`/products?category=${encodeURIComponent(category)}`}
              className="group bg-white rounded-2xl border border-[#E0E0E0] p-6 text-center hover:shadow-md hover:border-[#013220]/30 transition-all"
            >
              <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full mb-4 group-hover:scale-110 transition-transform flex items-center justify-center text-2xl">
                {/* Simple emoji mapping for demo */}
                {category.includes('Fruits') ? '🍎' : 
                 category.includes('Rice') ? '🌾' : 
                 category.includes('Dairy') ? '🥛' : 
                 category.includes('Snacks') ? '🍪' : 
                 category.includes('Beverages') ? '🧃' : '🛒'}
              </div>
              <h3 className="font-medium text-[#1A1A1A] text-sm">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products (Carousel) */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A] mb-2">Local Freshness</h2>
            <p className="text-[#6B6B6B]">Handpicked items from our local suppliers</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={() => scrollCarousel('left')}
              className="w-10 h-10 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
            >
              <ChevronLeft size={20} className="text-[#1A1A1A]" />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="w-10 h-10 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
            >
              <ChevronRight size={20} className="text-[#1A1A1A]" />
            </button>
          </div>
        </div>
        
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredProducts.map(product => (
            <div key={product.id} className="min-w-[240px] md:min-w-[280px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Today's Offers */}
      {offers.length > 0 && (
        <section className="container mx-auto px-4 md:px-6">
          <div className="bg-[#F5F5F5] rounded-3xl p-6 md:p-10 border border-[#E0E0E0]">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A] mb-2 flex items-center gap-2">
                  Today's Offers <span className="text-2xl">🔥</span>
                </h2>
                <p className="text-[#6B6B6B]">Grab them before they're gone</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {offers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Leaf size={24} />, title: "Farm Fresh", desc: "Sourced daily from local farmers" },
            { icon: <Clock size={24} />, title: "Fast Delivery", desc: "Same day delivery in Cheerattamala" },
            { icon: <ShieldCheck size={24} />, title: "Premium Quality", desc: "Handpicked and carefully packed" }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#E0E0E0] flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#013220] flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#1A1A1A] mb-1">{feature.title}</h3>
                <p className="text-sm text-[#6B6B6B]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
