import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ArrowRight, Sparkles, TrendingUp, Award, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabKey = 'trending' | 'bestsellers' | 'new' | 'formal';

export const ProductTabs: React.FC = () => {
  const { products, navigateTo, setSelectedCategory } = useShop();
  const [activeTab, setActiveTab] = useState<TabKey>('trending');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'trending':
        return products.slice(0, 8);
      case 'bestsellers':
        return products.filter((p) => p.isBestSeller).slice(0, 8);
      case 'new':
        return products.filter((p) => p.isNew).slice(0, 8);
      case 'formal':
        return products.filter((p) => p.category === 'formal' || p.category === 'peshawari').slice(0, 8);
      default:
        return products.slice(0, 8);
    }
  };

  const displayedProducts = getFilteredProducts();

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'trending', label: 'Trending Now', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'bestsellers', label: 'Best Sellers', icon: <Award className="w-3.5 h-3.5" /> },
    { key: 'new', label: 'New Season', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'formal', label: 'Wedding & Formal', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
  ];

  return (
    <section id="featured-tabs-section" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Handpicked Styles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">
              Featured Footwear Collection
            </h2>
          </div>

          {/* Tab buttons with layoutId motion animation */}
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-100/90 rounded-2xl overflow-x-auto max-w-full border border-neutral-200/80">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-neutral-950 rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 font-black">
                    {tab.icon}
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid with Animated Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
          >
            {displayedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Explore More CTA */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSelectedCategory('all');
              navigateTo('shop');
            }}
            className="px-8 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-950 text-xs font-black transition-all inline-flex items-center gap-2 border border-neutral-200 cursor-pointer shadow-xs"
          >
            <span>Explore Complete Catalog ({products.length} Models)</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
