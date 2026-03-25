import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/home/Header';
import Footer from './components/home/Footer';
import HomeScreen from './screens/HomeScreen';
import CollectionScreen from './screens/CollectionScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import WishlistScreen from './screens/WishlistScreen';
import CustomWorkScreen from './screens/CustomWorkScreen';
import OurStoryScreen from './screens/OurStoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import AdminLoginScreen from './admin/AdminLoginScreen';
import { AuthProvider } from './context/AuthContext';
import ProductList from './admin/products/ProductList';
import ProductEdit from './admin/products/ProductEdit';
import AdminLayout from './admin/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './admin/Dashboard';
import CategoryList from './admin/categories/CategoryList';
import CollectionList from './admin/collections/CollectionList';
import OrderList from './admin/orders/OrderList';
import AdminSettings from './admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item => 
          item._id === product._id ? { ...item, qty: item.qty + (product.qty || 1) } : item
        );
      }
      return [...prevCart, { ...product, qty: product.qty || 1 }];
    });
  };

  const handleAddToWishlist = (product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(item => item._id === product._id);
      if (exists) return prevWishlist;
      return [...prevWishlist, product];
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item._id !== id));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  const handleUpdateQty = (id, qty) => {
    setCart(prevCart => 
      prevCart.map(item => item._id === id ? { ...item, qty } : item)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlist.length;

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Store Layout */}
          <Route element={<MainLayout cartCount={cartCount} wishlistCount={wishlistCount} />}>
            <Route path="/" element={<HomeScreen 
              onAddToCart={handleAddToCart} 
              onAddToWishlist={handleAddToWishlist} 
            />} />
            <Route path="/shop" element={<CollectionScreen onAddToWishlist={handleAddToWishlist} />} />
            <Route path="/product/:id" element={<ProductDetailScreen 
              onAddToCart={handleAddToCart} 
              onAddToWishlist={handleAddToWishlist} 
            />} />
            <Route path="/cart" element={<CartScreen 
              cart={cart} 
              onRemoveFromCart={handleRemoveFromCart} 
              onUpdateQty={handleUpdateQty} 
            />} />
            <Route path="/wishlist" element={<WishlistScreen 
              wishlist={wishlist} 
              onRemoveFromWishlist={handleRemoveFromWishlist}
              onAddToCart={handleAddToCart}
            />} />
            <Route path="/custom-work" element={<CustomWorkScreen />} />
            <Route path="/our-story" element={<OurStoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/checkout" element={<CheckoutScreen cart={cart} onClearCart={handleClearCart} />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginScreen />} />
          
          {/* Admin Layout */}
          <Route path="/admin" element={<ProtectedRoute isAdmin={true} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="collections" element={<CollectionList />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="product/create" element={<ProductEdit />} />
              <Route path="product/:id/edit" element={<ProductEdit />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
