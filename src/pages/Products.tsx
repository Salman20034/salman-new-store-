import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;
  
  const allProducts = useStore(state => state.products);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setCurrentPage(1); // Reset page on category change
  }, [categoryParam]);

  useEffect(() => {
    setCurrentPage(1); // Reset page on search query change
  }, [queryParam]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];
    
    if (queryParam) {
      const q = queryParam.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.nameMl && p.nameMl.includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    } else if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory);
    }
    
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    return products;
  }, [selectedCategory, sortBy, queryParam]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-2">
            {queryParam ? `Search results for "${queryParam}"` : (selectedCategory || 'All Products')}
          </h1>
          <p className="text-[#6B6B6B]">Showing {filteredProducts.length} products</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] rounded-xl bg-white text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} /> Filters
          </button>
          
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-[#E0E0E0] rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#013220]/20"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sticky top-24">
            <h3 className="font-heading font-semibold text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === null 
                    ? 'bg-[#013220]/10 text-[#013220] font-medium' 
                    : 'text-[#6B6B6B] hover:bg-[#F5F5F5]'
                }`}
                onClick={() => handleCategoryChange(null)}
              >
                All Categories
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category 
                      ? 'bg-[#013220]/10 text-[#013220] font-medium' 
                      : 'text-[#6B6B6B] hover:bg-[#F5F5F5]'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-[#E0E0E0] disabled:opacity-50 hover:bg-[#F5F5F5] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-[#6B6B6B]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-[#E0E0E0] disabled:opacity-50 hover:bg-[#F5F5F5] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E0E0E0] p-12 text-center">
              <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔍
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">No products found</h3>
              <p className="text-[#6B6B6B]">Try changing your filters or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
