import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedCategory, openSizeGuide, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('Voucher Activated!', `Use promo code SOLEPK10 for 10% discount on your next order.`, 'success');
      setEmail('');
    }
  };

  const handleCategoryNav = (cat: CategoryType) => {
    setSelectedCategory(cat);
    navigateTo('shop', undefined, cat);
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-neutral-900 text-amber-400 border border-neutral-800 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Delivery across Pakistan</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Complimentary shipping on orders over Rs. 3500.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-neutral-900 text-emerald-400 border border-neutral-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Pure Leather</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Full-grain cowhide leather & artisan stitching.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-neutral-900 text-sky-400 border border-neutral-800 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Doorstep Size Swap</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Hassle-free size replacement at your home.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-neutral-900 text-rose-400 border border-neutral-800 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Support Desk</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Live customer assistance & tracking updates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigateTo('home')}
              className="inline-flex items-center cursor-pointer group select-none"
            >
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-neutral-200 transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl">
                <img
                  src="https://lh3.googleusercontent.com/d/1vXn6kllELtByr874hu8s2A_qs1FnOFAj"
                  alt="FootVera Logo"
                  referrerPolicy="no-referrer"
                  className="h-12 sm:h-15 md:h-16 w-auto max-w-[210px] sm:max-w-[260px] object-contain transition-transform"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('thumbnail')) {
                      target.src = 'https://drive.google.com/thumbnail?id=1vXn6kllELtByr874hu8s2A_qs1FnOFAj&sz=w1000';
                    }
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Pakistan's premier footwear destination for authentic Peshawari chappals, bridal khussas, executive Italian leather oxfords, and urban nitro sneakers. Handcrafted with pride in Lahore and Peshawar.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Get Exclusive Pakistani Festive Deals (10% Off)
              </h5>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email for discount voucher"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Voucher Activated! Use coupon <b>SOLEPK10</b> on checkout for 10% discount.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Footwear Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button onClick={() => handleCategoryNav('peshawari')} className="hover:text-white transition-colors">
                  Peshawari Chappal (Noruzi & Kaptaan)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('khussa')} className="hover:text-white transition-colors">
                  Handmade Tilla & Velvet Khussa
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('formal')} className="hover:text-white transition-colors">
                  Executive Formal Leather Shoes
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('heels')} className="hover:text-white transition-colors">
                  Women's Block Heels & Pumps
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('sneakers')} className="hover:text-white transition-colors">
                  Nitro Athletic & Street Sneakers
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('sale')} className="hover:text-white transition-colors">
                  Flash Deals & Clearance Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Customer Support (Pakistan)
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigateTo('track-order')} className="hover:text-white transition-colors">
                  Track TCS / Leopard Courier Order
                </button>
              </li>
              <li>
                <button onClick={() => openSizeGuide('men')} className="hover:text-white transition-colors">
                  Pakistan / EU Shoe Size Chart
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  JazzCash, EasyPaisa & Card Payments
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  7-Day Doorstep Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Our Artisanal Leather Heritage
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Corporate Bulk & Wedding Orders
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-neutral-500 hover:text-amber-400 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🔐 Store Admin Portal Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Experience Stores in Pakistan */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Pakistan Store Locations
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-200 block">Lahore Flagship</span>
                  <span>MM Alam Road, Gulberg III, Lahore</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-200 block">Karachi Boutique</span>
                  <span>Dolmen Mall Clifton, Level 1, Karachi</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-200 block">Islamabad Outlet</span>
                  <span>The Centaurus Mall, F-8/4, Islamabad</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-neutral-500">
                <span className="font-semibold text-neutral-300">Support Hours:</span> Mon - Sun (10:00 AM - 11:00 PM PKT)
                <br />
                <span className="font-semibold text-neutral-300">Coverage:</span> Express TCS Shipping Across All Pakistan Cities
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Payment Options for Pakistan */}
      <div className="border-t border-neutral-900 bg-black/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] text-neutral-500 text-center md:text-left">
            <span>© 2026 FootVera Pakistan. All rights reserved.</span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-neutral-600 hover:text-amber-400 transition-colors cursor-pointer"
              title="Store Owner Portal"
            >
              Admin Access
            </button>
          </div>

          {/* Pakistan Payment Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-neutral-400">
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold">
              JazzCash
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold">
              EasyPaisa
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800">Direct Bank Transfer / Raast</span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800">Visa / Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
