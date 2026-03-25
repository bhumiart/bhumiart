import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Menu, X, Settings, Loader2, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import logo from '../../../images/logo/logo.jpeg';
import { useAuth } from '../../context/AuthContext';

const Header = ({ cartCount, wishlistCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const { userInfo } = useAuth();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || '$(import.meta.env.VITE_API_BASE_URL)';

  // Fetch categories and collections for navigation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/collections`)
        ]);
        setCategories(catRes.data);
        setCollections(colRes.data);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle click outside to close dropdown and search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
        if (!searchQuery) setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // Search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const { data } = await axios.get(`$(import.meta.env.VITE_API_BASE_URL)/api/products?search=${searchQuery}`);
          setSearchResults(data.slice(0, 5)); // Show top 5 results
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `$(import.meta.env.VITE_API_BASE_URL)${url}`;
    return url;
  };

  const handleResultClick = (productId) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Banner */}
      <div className="bg-neutral-dark text-white text-[10px] sm:text-xs text-center py-2 font-medium tracking-wide">
        FREE SHIPPING ON ORDERS ABOVE ₹2000 | MADE WITH PRIDE IN INDIA
      </div>

      <div className="container mx-auto px-0">
        {/* Main Header */}
        <div className="flex items-center justify-between py-4 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center z-[60]">
            <img 
              src={logo} 
              alt="Lippan Art Logo" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-grow max-w-xl mx-8" ref={searchRef}>
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search for masterpieces..." 
                className="w-full bg-primary-50 border-2 border-primary-200 rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:border-primary-500 text-sm transition-all placeholder:text-neutral-dark/30 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 3 && setShowDropdown(true)}
              />
              <button className="absolute right-5 top-1/2 -translate-y-1/2 text-primary-600">
                {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={22} strokeWidth={2.5} />}
              </button>

              {/* Search Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <div 
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-primary-50 last:border-0"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-primary-100 flex-shrink-0">
                            <img 
                              src={getImageUrl(product.image)} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-bold text-neutral-dark truncate">{product.name}</h4>
                            <p className="text-xs text-accent-700 font-bold tracking-tight">₹{product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      <Link 
                        to={`/shop?search=${searchQuery}`}
                        onClick={() => setShowDropdown(false)}
                        className="block text-center py-3 text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 bg-primary-50/50"
                      >
                        See all results for "{searchQuery}"
                      </Link>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      {!isSearching && (
                        <>
                          <Search size={32} className="mx-auto text-primary-100 mb-3" />
                          <p className="text-sm font-medium text-neutral-dark/40 italic">No masterpieces found matching "{searchQuery}"</p>
                        </>
                      )}
                      {isSearching && (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 size={32} className="animate-spin text-primary-200" />
                          <p className="text-sm font-medium text-neutral-dark/40 italic">Searching the gallery...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Icons & Mobile Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 z-[60]">
            {/* Mobile Search Toggle */}
            <button 
              className="lg:hidden p-2 text-neutral-dark hover:text-primary-600 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={22} strokeWidth={2.5} />
            </button>

            <Link to={userInfo ? "/profile" : "/login"} className="text-neutral-dark hover:text-accent-600 transition-colors hidden md:block">
              <User size={22} />
            </Link>
            <Link to="/wishlist" className="text-neutral-dark hover:text-accent-600 transition-colors relative">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[8px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="text-neutral-dark hover:text-accent-600 transition-colors relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-600 text-white text-[8px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              className="lg:hidden p-2 text-neutral-dark hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input (Visible when toggled) */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-4 animate-in slide-in-from-top-2 duration-300" ref={searchRef}>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search masterpieces..." 
                className="w-full bg-primary-50 border-2 border-primary-200 rounded-2xl py-3 pl-5 pr-12 focus:outline-none focus:border-primary-500 text-sm shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isSearching ? <Loader2 size={18} className="animate-spin text-primary-600" /> : <Search size={20} className="text-primary-600" />}
              </div>

              {/* Mobile Search Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-2xl shadow-2xl overflow-hidden z-[70]">
                  {searchResults.length > 0 ? (
                    <div className="py-2 max-h-[60vh] overflow-y-auto">
                      {searchResults.map((product) => (
                        <div 
                          key={product._id}
                          onClick={() => {
                            handleResultClick(product._id);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-primary-50 border-b border-primary-50 last:border-0"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-primary-100 flex-shrink-0">
                            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-bold text-neutral-dark truncate">{product.name}</h4>
                            <p className="text-xs text-accent-700 font-bold tracking-tight">₹{product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm font-medium text-neutral-dark/40 italic">No masterpieces found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav 
          className="bg-primary-50 hidden lg:flex items-center justify-center space-x-10 py-3 border-t border-primary-50 relative"
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <Link to="/" className="text-xs font-bold text-neutral-dark hover:text-accent-600 uppercase tracking-widest transition-colors">Home</Link>
          
          <div 
            onMouseEnter={() => setActiveMegaMenu('shop')}
            className="h-full flex items-center"
          >
            <Link to="/shop" className="text-xs font-bold text-neutral-dark hover:text-accent-600 uppercase tracking-widest transition-colors flex items-center gap-1">
              Shop All <ChevronRight size={12} className={`rotate-90 transition-transform ${activeMegaMenu === 'shop' ? 'rotate-[-90deg]' : ''}`} />
            </Link>
          </div>
          
          {categories.slice(0, 4).map((cat) => (
            <Link 
              key={cat._id} 
              to={`/shop?category=${cat.name}`} 
              className="text-xs font-bold text-neutral-dark hover:text-accent-600 uppercase tracking-widest transition-colors"
            >
              {cat.name}
            </Link>
          ))}

          <Link to="/custom-work" className="text-xs font-bold text-neutral-dark hover:text-accent-600 uppercase tracking-widest transition-colors">Custom Work</Link>
          <Link to="/our-story" className="text-xs font-bold text-neutral-dark hover:text-accent-600 uppercase tracking-widest transition-colors">Our Story</Link>

          {/* Mega Menu Content */}
          {activeMegaMenu === 'shop' && (
            <div 
              className="absolute top-full left-0 right-0 bg-white border-t border-primary-100 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-300"
              onMouseEnter={() => setActiveMegaMenu('shop')}
            >
              <div className="container mx-auto py-12 px-8">
                <div className="grid grid-cols-4 gap-12">
                  {/* Categories Column */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-600 border-b border-accent-100 pb-2">By Category</h3>
                    <div className="grid gap-3">
                      {categories.map((cat) => (
                        <Link 
                          key={cat._id} 
                          to={`/shop?category=${cat.name}`}
                          className="text-sm font-bold text-neutral-dark hover:text-accent-600 transition-colors flex items-center justify-between group"
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          {cat.name}
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Featured Collections Column */}
                  <div className="col-span-3 space-y-6">
                    <div className="flex items-center justify-between border-b border-primary-100 pb-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40">Featured Collections</h3>
                      <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest text-accent-600 hover:text-accent-700">View All</Link>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {collections.slice(0, 3).map((col) => (
                        <Link 
                          key={col._id} 
                          to={`/shop?search=${col.title}`}
                          className="group relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm"
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          <img src={col.image} alt={col.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                            <h4 className="text-white font-black uppercase italic tracking-tighter text-xl leading-tight">
                              {col.title}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Promo Strip */}
              <div className="bg-primary-50 py-4 px-8 border-t border-primary-100">
                <div className="container mx-auto flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 italic">
                    Discover the traditional mud-work art of Kutch
                  </p>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={14} className="text-accent-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-dark">100% Handmade</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings size={14} className="text-accent-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-dark">Custom Sizes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-neutral-dark/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary-50">
              <span className="text-xl font-black text-primary-950 uppercase italic tracking-tighter">Varnika<span className="text-primary-600">.</span></span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-neutral-dark hover:bg-primary-50 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-grow py-8 px-6 space-y-6 overflow-y-auto">
              {[
                { name: 'Home', path: '/' },
                 { name: 'Best Sellers', path: '/shop' },
                 ...categories.map(cat => ({ 
                   name: cat.name, 
                   path: `/shop?category=${cat.name}` 
                 })),
                 { name: 'Custom Work', path: '/custom-work' },
                  { name: 'Our Story', path: '/our-story' },
                  { name: 'My Wishlist', path: '/wishlist', count: wishlistCount },
                  { name: userInfo ? 'My Profile' : 'Login / Register', path: userInfo ? '/profile' : '/login' }
                ].map((link, i) => (
                <Link 
                  key={i} 
                  to={link.path} 
                  className="flex items-center justify-between text-base font-black uppercase tracking-[0.2em] text-slate-800 hover:text-primary-600 transition-colors group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.name}</span>
                  <div className="flex items-center">
                    {link.count > 0 && <span className="mr-3 bg-primary-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{link.count}</span>}
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-8 border-t border-primary-50 bg-[#fffcf0]/50 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Masterpieces of Gujarat</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 rounded-lg bg-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm"><Heart size={16} /></div>
                <div className="w-8 h-8 rounded-lg bg-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm"><User size={16} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
  );
};

export default Header;
