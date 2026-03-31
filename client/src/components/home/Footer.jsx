import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Linkedin, 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Youtube,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard
} from 'lucide-react';
import logo from '../../../images/logo/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'New Arrivals', path: '/shop' },
      { name: 'Best Sellers', path: '/shop' },
      { name: 'Custom Lippan Art', path: '/shop' },
      { name: 'Wall Decor', path: '/shop' },
      { name: 'Traditional Collection', path: '/shop' },
    ],
    company: [
      { name: 'Our Story', path: '/about' },
      { name: 'Artisans', path: '/about' },
      { name: 'Blogs & News', path: '/blogs' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Careers', path: '/about' },
    ],
    support: [
      { name: 'Shipping Policy', path: '/shipping' },
      { name: 'Returns & Exchanges', path: '/cancellation' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'FAQs', path: '/faqs' },
    ]
  };

  return (
    <footer className="bg-[#fffcf0] text-slate-800 pt-16 md:pt-24 pb-8 md:pb-12 border-t border-primary-100 relative overflow-hidden">
      {/* Subtle decorative background element */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <Link to="/" className="inline-block group">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-2xl shadow-xl shadow-primary-900/5 group-hover:scale-105 transition-transform duration-500 border border-primary-50">
                  <img src={logo} alt="Varnika Logo" className="h-10 md:h-12 w-auto object-contain" />
                </div>
                {/* <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black text-primary-950 tracking-tighter uppercase italic leading-none">
                    Varnika<span className="text-primary-600">.</span>
                  </span>
                  <span className="text-[10px] font-bold text-primary-600/60 uppercase tracking-[0.3em] mt-1">Lippan Art</span>
                </div> */}
              </div>
            </Link>
            
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm font-medium italic">
              Preserving the ancient craft of Kutch through contemporary Lippan Art. Every piece is handcrafted with precision, soul, and centuries of tradition by BhumiArt.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white border border-primary-100 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-50 transition-all shadow-sm">
                  <MapPin size={18} className="text-primary-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Workshop</span>
                  <p className="text-xs font-bold text-slate-700 leading-tight">Indirapuram, Ghaziabad,  Nyay khand 2, Uttar Pradesh, India</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white border border-primary-100 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-50 transition-all shadow-sm">
                  <Mail size={18} className="text-primary-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Email Us</span>
                  <p className="text-xs font-bold text-slate-700">bhumilippanart@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white border border-primary-100 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-50 transition-all shadow-sm">
                  <Phone size={18} className="text-primary-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Call Us</span>
                  <p className="text-xs font-bold text-slate-700">+91 7065039968</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-950 mb-6 md:mb-8 border-l-2 border-primary-600 pl-4">Shop</h3>
            <ul className="grid grid-cols-1 gap-3 md:gap-4">
              {footerLinks.shop.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-all flex items-center group">
                    <ArrowRight size={12} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-950 mb-6 md:mb-8 border-l-2 border-primary-600 pl-4">Experience</h3>
            <ul className="grid grid-cols-1 gap-3 md:gap-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-all flex items-center group">
                    <ArrowRight size={12} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-950 mb-6 md:mb-8 border-l-2 border-primary-600 pl-4">Support</h3>
            <ul className="grid grid-cols-1 gap-3 md:gap-4">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-all flex items-center group">
                    <ArrowRight size={12} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-0 border-t border-primary-100 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary-900/40 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <span>© {currentYear} BhumiArt Lippan Art Masterpieces</span>
            <span className="hidden md:block w-1 h-1 bg-primary-200 rounded-full" />
            <span className="text-primary-400 italic">Crafted with Pride in India</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* <div className="flex items-center space-x-4 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <CreditCard size={18} />
              <div className="w-7 h-4 bg-primary-200/50 rounded-sm" />
              <div className="w-7 h-4 bg-primary-200/50 rounded-sm" />
              <div className="w-7 h-4 bg-primary-200/50 rounded-sm" />
            </div> */}
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

