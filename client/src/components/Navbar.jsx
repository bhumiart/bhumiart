import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary-900">
            Lippan<span className="text-primary-600">Art</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-primary-800 hover:text-primary-600 font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-primary-800 hover:text-primary-600 font-medium transition-colors">Shop</Link>
            <Link to="/about" className="text-primary-800 hover:text-primary-600 font-medium transition-colors">Our Story</Link>
            <Link to="/custom" className="text-primary-800 hover:text-primary-600 font-medium transition-colors">Custom Work</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-primary-800 hover:text-primary-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-primary-800 hover:text-primary-600 transition-colors hidden sm:block">
              <Heart size={20} />
            </button>
            <Link to="/cart" className="p-2 text-primary-800 hover:text-primary-600 transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="p-2 text-primary-800 hover:text-primary-600 transition-colors hidden sm:block">
              <User size={20} />
            </button>
            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-primary-800 hover:text-primary-600 transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-primary-100 p-4 absolute top-full left-0 right-0 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-primary-800 hover:text-primary-600 font-medium py-2 border-b border-primary-50" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-primary-800 hover:text-primary-600 font-medium py-2 border-b border-primary-50" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="text-primary-800 hover:text-primary-600 font-medium py-2 border-b border-primary-50" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
            <Link to="/custom" className="text-primary-800 hover:text-primary-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Custom Work</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
