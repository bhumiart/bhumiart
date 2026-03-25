import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin/dashboard' 
    },
    { 
      title: 'Products', 
      icon: <ShoppingBag size={20} />, 
      path: '/admin/products' 
    },
    { 
      title: 'Categories', 
      icon: <Palette size={20} />, 
      path: '/admin/categories' 
    },
    { 
      title: 'Collections', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin/collections' 
    },
    { 
      title: 'Orders', 
      icon: <Users size={20} />, 
      path: '/admin/orders' 
    },
    { 
      title: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/admin/settings' 
    }
  ];

  return (
    <div className="w-64 h-screen bg-neutral-900 text-white fixed left-0 top-0 flex flex-col border-r border-white/10">
      {/* Sidebar Header */}
      <div className="p-8 border-b border-white/5">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black text-accent-400 tracking-tighter uppercase italic">
            Lippan<span className="text-white">Art</span>
          </span>
          <span className="px-2 py-0.5 bg-accent-600 text-[10px] font-black uppercase rounded tracking-widest text-white">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 group ${
                isActive 
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/20' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-accent-400 group-hover:text-white'} transition-colors`}>
                {item.icon}
              </span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-white/5 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300"
        >
          <Home size={20} className="text-accent-400" />
          <span>Storefront</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
