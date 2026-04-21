import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useStore } from '../../store/useStore';

export const Footer = () => {
  const { adminSettings } = useStore();

  if (!adminSettings) return null;

  return (
    <footer className="bg-[#013220] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white rounded-xl p-2 inline-block">
                <Logo className="w-12 h-12" src={adminSettings.storeLogo} alt={adminSettings.storeName} />
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Your trusted local grocery partner in Cheerattamala. We deliver fresh, premium quality products right to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A227] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A227] transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-[#C9A227]">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="text-white/80 hover:text-white transition-colors text-sm">Shop All</Link></li>
              <li><Link to="/offers" className="text-white/80 hover:text-white transition-colors text-sm">Today's Offers</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-[#C9A227]">Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/products?category=Fruits & Vegetables" className="text-white/80 hover:text-white transition-colors text-sm">Fruits & Vegetables</Link></li>
              <li><Link to="/products?category=Rice & Grains" className="text-white/80 hover:text-white transition-colors text-sm">Rice & Grains</Link></li>
              <li><Link to="/products?category=Dairy Products" className="text-white/80 hover:text-white transition-colors text-sm">Dairy Products</Link></li>
              <li><Link to="/products?category=Snacks" className="text-white/80 hover:text-white transition-colors text-sm">Snacks & Beverages</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-[#C9A227]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#C9A227] flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">
                  {adminSettings.storeName}, Main Road,<br />
                  Cheerattamala, Malappuram,<br />
                  Kerala, India - 676505
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#C9A227] flex-shrink-0" />
                <span className="text-white/80 text-sm">{adminSettings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#C9A227] flex-shrink-0" />
                <span className="text-white/80 text-sm">{adminSettings.contactEmail}</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} {adminSettings.storeName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-white/60">
            <Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
