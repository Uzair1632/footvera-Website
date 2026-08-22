import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { MAIN_NAV_ITEMS } from '../data/categories';
import { CategoryType } from '../types';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  Phone,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Shield,
  Bell,
  MessageCircle,
  Flame,
  Sun,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    activePage,
    navigateTo,
    cartCount,
    cartSubtotal,
    openCart,
    wishlist,
    formatPrice,
    searchQuery,
    setSearchQuery,
    products,
    selectedCategory,
    orders,
    unreadNotificationsCount,
    openStoreOrdersDrawer,
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredSubcategoryIndex, setHoveredSubcategoryIndex] = useState<number>(0);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Live search filtered results
  const liveSearchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    if (activeDropdown !== label) {
      setHoveredSubcategoryIndex(0);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredSubcategoryIndex(0);
    }, 220);
  };

  const handleNavClick = (item: typeof MAIN_NAV_ITEMS[0]) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    if (item.page) {
      navigateTo(item.page, undefined, item.category || 'all');
    } else if (item.category) {
      navigateTo('shop', undefined, item.category);
    }
  };

  const handleSubcategoryClick = (category: CategoryType, subcategoryName?: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    navigateTo('shop', undefined, category, subcategoryName);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-neutral-200/80 shadow-xs transition-all">
      {/* 1. Top Announcement & Utility Bar (Visible across mobile, tablet, and desktop) */}
      <div className="bg-neutral-950 text-white text-[11px] font-medium py-1.5 px-3 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5">
          {/* Free delivery & threshold banner */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center md:justify-start text-center">
            <span className="inline-flex items-center gap-1 text-amber-400 font-black tracking-wider whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <Truck className="w-3.5 h-3.5" /> FREE DELIVERY
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-200 font-medium whitespace-nowrap">
              Orders above <b className="text-white">Rs. 4000</b>
            </span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="text-neutral-400 hidden sm:inline font-medium whitespace-nowrap">
              Priority Express Dispatch
            </span>
          </div>

          {/* Quick Utility Links (All visible on mobile & tablet via clean horizontal scrolling or wrap) */}
          <div className="flex items-center gap-2 sm:gap-3 text-neutral-300 text-[10px] sm:text-[11px] overflow-x-auto max-w-full no-scrollbar py-0.5 justify-center">
            <button
              onClick={openStoreOrdersDrawer}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-neutral-200 font-medium whitespace-nowrap"
            >
              <Bell className="w-3 h-3 text-amber-400" />
              <span>Store Inbox {unreadNotificationsCount > 0 ? `(${unreadNotificationsCount})` : ''}</span>
            </button>
            <span className="text-neutral-700">•</span>
            <button
              onClick={() => navigateTo('track-order')}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-3 h-3" />
              <span>Track Order</span>
            </button>
            <span className="text-neutral-700">•</span>
            <button
              onClick={() => navigateTo('contact')}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-3 h-3" />
              <span>24/7 Support</span>
            </button>
            <span className="text-neutral-700">•</span>
            <button
              onClick={() => navigateTo('size-guide')}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3 h-3" />
              <span>Size Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Middle Bar: Logo, Search Bar, Wishlist, Notifications & Cart Drawer */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1 text-neutral-900 hover:text-black focus:outline-none cursor-pointer rounded-lg hover:bg-neutral-100"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer flex items-center select-none group shrink-0"
            id="brand-logo-header"
          >
            <div className="bg-white/95 hover:bg-white p-1 sm:p-1.5 md:p-2 rounded-xl sm:rounded-2xl border border-neutral-200/80 shadow-xs transition-all duration-200 group-hover:shadow-md group-hover:border-neutral-300">
              <img
                src="https://lh3.googleusercontent.com/d/1vXn6kllELtByr874hu8s2A_qs1FnOFAj"
                alt="FootVera Logo"
                referrerPolicy="no-referrer"
                className="h-10 sm:h-13 md:h-16 w-auto max-w-[140px] sm:max-w-[220px] md:max-w-[300px] object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('thumbnail')) {
                    target.src = 'https://drive.google.com/thumbnail?id=1vXn6kllELtByr874hu8s2A_qs1FnOFAj&sz=w1000';
                  }
                }}
              />
            </div>
          </div>

          {/* Search Bar - Desktop & Tablet */}
          <div className="hidden sm:flex flex-1 max-w-xs md:max-w-md lg:max-w-lg relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search chappals, khussas, oxfords, sneakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-xs bg-neutral-100/90 hover:bg-neutral-100 border border-neutral-200/90 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:bg-white transition-all shadow-inner placeholder:text-neutral-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Floating Popup */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-neutral-200 shadow-2xl p-4 z-50 space-y-3"
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 border-b pb-2">
                  <span>Found {liveSearchResults.length} matching models</span>
                  <button
                    onClick={() => {
                      navigateTo('shop');
                      setIsSearchOpen(false);
                    }}
                    className="text-neutral-950 font-black hover:underline"
                  >
                    View entire catalog
                  </button>
                </div>

                <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                  {liveSearchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        navigateTo('product-detail', prod.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="py-2.5 flex items-center gap-3 cursor-pointer hover:bg-neutral-50/80 rounded-xl px-2 transition-colors group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-950 truncate group-hover:text-amber-700 transition-colors">
                          {prod.name}
                        </h4>
                        <span className="text-[11px] text-neutral-500 font-medium">{prod.subcategory}</span>
                      </div>
                      <span className="text-xs font-black text-neutral-950">{formatPrice(prod.price)}</span>
                    </div>
                  ))}
                  {liveSearchResults.length === 0 && (
                    <p className="text-xs text-neutral-500 py-3 text-center">
                      No footwear found for "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (Search Toggle for Mobile, Wishlist, Notifications, Cart Drawer) */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-neutral-800 hover:text-neutral-950 transition-colors rounded-full hover:bg-neutral-100 cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 sm:p-2.5 text-neutral-800 hover:text-rose-600 transition-colors rounded-full hover:bg-neutral-100/80 cursor-pointer"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </motion.button>

            {/* Store Orders & Chat Notifications Bell */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={openStoreOrdersDrawer}
              className="relative p-2 sm:p-2.5 text-neutral-800 hover:text-amber-600 transition-colors rounded-full hover:bg-neutral-100/80 cursor-pointer"
              title="Store Orders & Chat Inbox"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-amber-500 text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </motion.button>

            {/* Cart Bag Drawer Trigger */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={openCart}
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-97 cursor-pointer"
              title="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-amber-400 text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-black">
                {cartCount > 0 ? formatPrice(cartSubtotal) : 'Bag'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Live Search Row (Expands when active or can be typed directly) */}
        {isSearchOpen && (
          <div className="sm:hidden pt-2 pb-1 relative animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search chappals, khussas, oxfords, sneakers..."
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-100 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:bg-white transition-all placeholder:text-neutral-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500"
                >
                  Close
                </button>
              )}
            </div>

            {/* Mobile Search Results Dropdown */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-neutral-200 shadow-2xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 border-b pb-1.5">
                  <span>Found {liveSearchResults.length} matching footwear</span>
                  <button
                    onClick={() => {
                      navigateTo('shop');
                      setIsSearchOpen(false);
                    }}
                    className="text-neutral-950 font-black hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto">
                  {liveSearchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        navigateTo('product-detail', prod.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="py-2 flex items-center gap-2.5 cursor-pointer hover:bg-neutral-50 rounded-lg px-1.5"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-md object-cover bg-neutral-100 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-950 truncate">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-neutral-500">{prod.subcategory}</span>
                      </div>
                      <span className="text-xs font-black text-neutral-950">{formatPrice(prod.price)}</span>
                    </div>
                  ))}
                  {liveSearchResults.length === 0 && (
                    <p className="text-xs text-neutral-500 py-2.5 text-center">
                      No footwear found for "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Primary Navigation Bar with Fluid Motion & Dropdown Animations (Desktop Mega Menu) */}
      <nav className="hidden lg:block border-t border-neutral-100 bg-white/90 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-3 xl:gap-6 py-2 text-xs uppercase tracking-widest font-black text-neutral-800 relative">
            {MAIN_NAV_ITEMS.map((item, index) => {
              const isCurrentActive =
                (item.page && activePage === item.page) ||
                (activePage === 'shop' && item.category && selectedCategory === item.category);

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredNavIndex(index);
                    if (item.hasDropdown) handleMouseEnter(item.label);
                  }}
                  onMouseLeave={() => {
                    setHoveredNavIndex(null);
                    handleMouseLeave();
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl cursor-pointer relative z-10 transition-colors ${
                      isCurrentActive
                        ? 'text-neutral-950 font-black'
                        : item.isHot
                        ? 'text-rose-600 font-black hover:text-rose-700'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    {item.isHot && <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />}
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-250 ${
                          activeDropdown === item.label
                            ? 'rotate-180 text-amber-600 font-bold'
                            : 'text-neutral-400 group-hover:text-neutral-950'
                        }`}
                      />
                    )}

                    {/* Active Navigation Glow Underline */}
                    {isCurrentActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-neutral-950 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>

                  {/* Nav Item Hover Floating Pill */}
                  {hoveredNavIndex === index && !isCurrentActive && (
                    <motion.div
                      layoutId="hoveredNavPill"
                      className="absolute inset-0 bg-neutral-100/90 rounded-xl -z-0"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}

                  {/* MEGA MENU DROPDOWN WITH DYNAMIC HOVER SUBCATEGORY ANIMATIONS */}
                  <AnimatePresence>
                    {item.hasDropdown && item.megaMenu && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] bg-white rounded-3xl shadow-2xl border border-neutral-200/90 p-6 mt-1.5 z-50 overflow-hidden"
                      >
                        {/* Radiant Solar Background Glow */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-400/10 via-orange-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                        <div className="grid grid-cols-12 gap-6 relative z-10">
                          {/* LEFT: Subcategories links (7 cols) with dynamic item hover state */}
                          <div className="col-span-7 space-y-2">
                            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                {item.megaMenu.title}
                              </h4>
                              <span className="text-[10px] font-bold text-neutral-400">
                                {item.megaMenu.subcategories.length} Categories
                              </span>
                            </div>

                            <ul className="space-y-1 pt-1">
                              {item.megaMenu.subcategories.map((sub, idx) => {
                                const isSubHovered = hoveredSubcategoryIndex === idx;

                                return (
                                  <li key={idx} className="relative">
                                    <button
                                      onMouseEnter={() => setHoveredSubcategoryIndex(idx)}
                                      onClick={() => handleSubcategoryClick(sub.category, sub.filterSubcategory)}
                                      className={`w-full text-left py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors relative z-10 cursor-pointer ${
                                        isSubHovered
                                          ? 'text-neutral-950'
                                          : 'text-neutral-600 hover:text-neutral-950'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                                            isSubHovered ? 'bg-amber-500 scale-150' : 'bg-neutral-300'
                                          }`}
                                        />
                                        <span>{sub.name}</span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {sub.badge && (
                                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shadow-2xs">
                                            {sub.badge}
                                          </span>
                                        )}
                                        <ArrowRight
                                          className={`w-3.5 h-3.5 transition-all duration-200 ${
                                            isSubHovered
                                              ? 'opacity-100 translate-x-0 text-amber-600'
                                              : 'opacity-0 -translate-x-1'
                                          }`}
                                        />
                                      </div>
                                    </button>

                                    {/* Animated Pill that glides behind the hovered subcategory */}
                                    {isSubHovered && (
                                      <motion.div
                                        layoutId="subcat-hover-pill"
                                        className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-2xl -z-0"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                      />
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          {/* RIGHT: Dynamic Animated Visual Preview Card (5 cols) */}
                          <div className="col-span-5 flex flex-col">
                            {(() => {
                              const activeSub =
                                item.megaMenu.subcategories[hoveredSubcategoryIndex] ||
                                item.megaMenu.subcategories[0];
                              const previewImage = activeSub?.image || item.megaMenu.featuredImage;
                              const previewTitle = activeSub?.name || item.megaMenu.featuredTitle;
                              const previewDesc = activeSub?.description || item.megaMenu.featuredSubtitle;

                              return (
                                <motion.div
                                  key={previewTitle}
                                  initial={{ opacity: 0, scale: 0.96 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.96 }}
                                  transition={{ duration: 0.25, ease: 'easeOut' }}
                                  onClick={() => handleSubcategoryClick(activeSub.category, activeSub.filterSubcategory)}
                                  className="relative h-full rounded-2xl overflow-hidden cursor-pointer group/promo border border-neutral-200 bg-neutral-950 flex flex-col justify-end p-4 shadow-xl select-none"
                                >
                                  {/* Background Image with Zoom on Hover */}
                                  <img
                                    src={previewImage}
                                    alt={previewTitle}
                                    referrerPolicy="no-referrer"
                                    className="absolute inset-0 w-full h-full object-cover group-hover/promo:scale-108 transition-transform duration-700 opacity-75"
                                  />

                                  {/* Solar Light Ray Sheen in Preview Card */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent pointer-events-none" />

                                  {/* Floating Active Badge */}
                                  <div className="absolute top-3 right-3 z-10">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 border border-amber-400/30 flex items-center gap-1 shadow-md">
                                      <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                                      {activeSub.badge || 'Featured'}
                                    </span>
                                  </div>

                                  {/* Card Content with Motion Text */}
                                  <div className="relative z-10 text-white space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                                      {activeSub.category} Collection
                                    </span>
                                    <h5 className="text-sm font-black leading-tight text-white line-clamp-1">
                                      {previewTitle}
                                    </h5>
                                    <p className="text-[11px] text-neutral-300 line-clamp-2 font-medium">
                                      {previewDesc}
                                    </p>

                                    <div className="pt-2">
                                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-300 group-hover/promo:text-white transition-colors">
                                        Explore Collection <ArrowRight className="w-3.5 h-3.5 group-hover/promo:translate-x-1 transition-transform" />
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer (100% visible, fully scrollable with AnimatePresence) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-[85vw] max-w-[340px] bg-white h-[100dvh] shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Fixed Header */}
              <div className="p-3.5 sm:p-4 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
                <div
                  onClick={() => {
                    navigateTo('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="cursor-pointer bg-white p-1 rounded-xl border border-neutral-200 shadow-xs inline-flex items-center"
                >
                  <img
                    src="https://lh3.googleusercontent.com/d/1vXn6kllELtByr874hu8s2A_qs1FnOFAj"
                    alt="FootVera Logo"
                    referrerPolicy="no-referrer"
                    className="h-9 sm:h-11 w-auto max-w-[150px] object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('thumbnail')) {
                        target.src = 'https://drive.google.com/thumbnail?id=1vXn6kllELtByr874hu8s2A_qs1FnOFAj&sz=w1000';
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
                {/* Search Quick Bar in Menu */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search footwear..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsMobileMenuOpen(false);
                        navigateTo('shop');
                      }
                    }}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:bg-white transition-all placeholder:text-neutral-400"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Primary Category List */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1 mb-2">
                    Browse Catalog
                  </h4>
                  <ul className="space-y-1 text-sm font-bold text-neutral-800">
                    {MAIN_NAV_ITEMS.map((item) => {
                      const isCurrentActive =
                        (item.page && activePage === item.page) ||
                        (activePage === 'shop' && item.category && selectedCategory === item.category);

                      const isExpanded = mobileExpandedDropdown === item.label;

                      return (
                        <li key={item.label} className="border-b border-neutral-100 last:border-0 pb-1 pt-0.5">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleNavClick(item)}
                              className={`py-2 px-2 text-left flex-1 flex items-center gap-2 rounded-lg transition-colors cursor-pointer ${
                                isCurrentActive
                                  ? 'bg-neutral-950 text-white'
                                  : 'text-neutral-800 hover:bg-neutral-100 hover:text-neutral-950'
                              }`}
                            >
                              {item.isHot && <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
                              <span>{item.label}</span>
                            </button>
                            {item.hasDropdown && (
                              <button
                                onClick={() =>
                                  setMobileExpandedDropdown(isExpanded ? null : item.label)
                                }
                                className="p-2 text-neutral-500 hover:text-neutral-950 cursor-pointer rounded-lg hover:bg-neutral-100"
                                aria-label="Toggle subcategories"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-180 text-neutral-950' : ''
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Subcategories Accordion */}
                          {item.hasDropdown && item.megaMenu && isExpanded && (
                            <div className="mt-1 mb-2 ml-3 pl-3 space-y-1 border-l-2 border-amber-500 text-xs font-semibold text-neutral-600 animate-in fade-in slide-in-from-top-1 duration-150">
                              {item.megaMenu.subcategories.map((sub, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handleSubcategoryClick(sub.category, sub.filterSubcategory)}
                                  className="w-full text-left py-2 px-2 hover:bg-neutral-100 hover:text-neutral-950 rounded-md flex items-center justify-between transition-colors cursor-pointer"
                                >
                                  <span>{sub.name}</span>
                                  {sub.badge && (
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                      {sub.badge}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Quick Store Links */}
                <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs font-bold text-neutral-700">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1 mb-1">
                    Store Services
                  </h4>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('track-order');
                    }}
                    className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-neutral-100 text-left cursor-pointer text-neutral-800"
                  >
                    <Clock className="w-4 h-4 text-neutral-900" />
                    <span>Track Courier Order</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('size-guide');
                    }}
                    className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-neutral-100 text-left cursor-pointer text-neutral-800"
                  >
                    <Eye className="w-4 h-4 text-neutral-900" />
                    <span>Footwear Size Guide</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('contact');
                    }}
                    className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-neutral-100 text-left cursor-pointer text-neutral-800"
                  >
                    <Phone className="w-4 h-4 text-neutral-900" />
                    <span>24/7 Customer Support</span>
                  </button>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-3.5 border-t border-neutral-200 bg-neutral-50 shrink-0 text-xs text-neutral-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span className="truncate">Free Delivery over Rs. 4000 across Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span className="truncate">100% Genuine Leather & 7-Day Exchange</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
