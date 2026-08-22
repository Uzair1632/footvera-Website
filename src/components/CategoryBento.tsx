import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES_LIST } from '../data/categories';
import { CategoryType } from '../types';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoryBento: React.FC = () => {
  const { setSelectedCategory, navigateTo } = useShop();

  const handleCategoryClick = (catId: CategoryType) => {
    setSelectedCategory(catId);
    navigateTo('shop', undefined, catId);
  };

  return (
    <section id="category-bento" className="py-14 sm:py-20 bg-neutral-50/70 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Curated Footwear</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">
              Explore Collections by Silhouette
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              navigateTo('shop');
            }}
            className="text-xs font-black text-neutral-950 hover:text-neutral-600 flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-colors group"
          >
            <span>Browse All Categories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Categories Grid with Staggered Motion */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES_LIST.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 border border-neutral-200/80 bg-neutral-900"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Top Tag */}
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-neutral-950 transition-colors shadow-sm">
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                  {cat.itemCount}+ Styles
                </span>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5 group-hover:text-amber-100 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-1 opacity-90">
                  {cat.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
