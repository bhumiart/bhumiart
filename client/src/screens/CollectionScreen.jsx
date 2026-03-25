import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, LayoutGrid, List, X, SlidersHorizontal } from 'lucide-react';

const CollectionScreen = ({ onAddToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/categories`);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = category 
          ? `${API_URL}/api/products?category=${category}`
          : `${API_URL}/api/products`;
        const { data } = await axios.get(url);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured/default
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Loading Collection...
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-10 pb-20">
      {/* Mobile Filter Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
        <div className={`absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-neutral-dark uppercase italic tracking-tighter">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-primary-50 rounded-full transition-colors">
                <X size={24} className="text-neutral-dark" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <Link 
                      key={cat._id}
                      to={`/shop?category=${cat.name}`}
                      onClick={() => setIsFilterOpen(false)}
                      className={`block text-sm font-medium transition-colors ${category === cat.name ? 'text-accent-700 font-bold' : 'text-neutral-dark/60 hover:text-neutral-dark'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link 
                    to="/shop"
                    onClick={() => setIsFilterOpen(false)}
                    className={`block text-sm font-medium transition-colors ${!category ? 'text-accent-700 font-bold' : 'text-neutral-dark/60 hover:text-neutral-dark'}`}
                  >
                    All Collections
                  </Link>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest mb-4">Price Range</h3>
                <div className="space-y-3">
                  {['Under ₹2,000', '₹2,000 - ₹5,000', '₹5,000 - ₹10,000', 'Over ₹10,000'].map((range) => (
                    <label key={range} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="w-5 h-5 border-2 border-primary-200 rounded group-hover:border-accent-400 transition-colors flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-accent-600 rounded-sm opacity-0 group-hover:opacity-20"></div>
                      </div>
                      <span className="text-sm font-medium text-neutral-dark/60 group-hover:text-neutral-dark">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-primary-100">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-4 bg-neutral-dark text-white font-bold rounded-xl hover:bg-accent-900 transition-all uppercase tracking-widest text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header / Breadcrumbs */}
      <div className="bg-primary-50 py-12 md:py-20 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-black text-neutral-dark mb-4 tracking-tighter italic uppercase">
              {category ? category : 'Our Masterpieces'}
            </h1>
            <div className="flex items-center space-x-2 text-sm font-medium text-neutral-dark/40 uppercase tracking-widest">
              <Link to="/" className="hover:text-accent-700 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-neutral-dark">Collection</span>
              {category && (
                <>
                  <span>/</span>
                  <span className="text-accent-700 font-bold">{category}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-primary-100 pb-6 mb-10 gap-6">
          <div className="flex items-center space-x-6 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 text-sm font-bold text-neutral-dark uppercase tracking-widest hover:text-accent-700 transition-colors group"
            >
              <SlidersHorizontal size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>Filters</span>
            </button>
            <div className="h-4 w-[1px] bg-primary-200 hidden md:block"></div>
            <p className="text-sm font-medium text-neutral-dark/40 uppercase tracking-widest ml-auto md:ml-0">
              {sortedProducts.length} Results
            </p>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-4 hidden sm:flex">
              <button className="p-2.5 text-accent-700 bg-accent-50 rounded-xl">
                <LayoutGrid size={20} />
              </button>
              <button className="p-2.5 text-neutral-dark/40 hover:text-neutral-dark transition-colors">
                <List size={20} />
              </button>
            </div>
            
            <div className="relative group w-full md:w-auto min-w-[220px]">
              <select 
                value={sortBy}
                onChange={(e) => setSortSortBy(e.target.value)}
                className="w-full bg-white border border-primary-100 rounded-xl py-3.5 px-5 text-sm font-bold text-neutral-dark focus:outline-none focus:border-accent-400 appearance-none cursor-pointer pr-10 hover:border-primary-200 transition-colors"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-dark pointer-events-none group-hover:translate-y-[-40%] transition-transform" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {sortedProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-primary-50 rounded-[3rem] border-2 border-dashed border-primary-200">
            <h3 className="text-2xl font-black text-neutral-dark mb-4 italic uppercase tracking-tight">No pieces found</h3>
            <p className="text-neutral-dark/60 mb-8 max-w-xs mx-auto">We couldn't find any artwork in this category matching your criteria.</p>
            <Link to="/shop" className="inline-block px-10 py-4 bg-neutral-dark text-white font-bold rounded-xl hover:bg-accent-900 transition-all uppercase tracking-widest text-xs">
              View All Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionScreen;
