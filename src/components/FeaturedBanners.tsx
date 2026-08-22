import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedBanners: React.FC = () => {
  const { navigateTo, setSelectedCategory } = useShop();

  return (
    <section id="promo-split-banners" className="py-12 sm:py-16 bg-neutral-100/80 border-b border-neutral-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Banner 1: Tuscan Leather */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative h-84 sm:h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200"
          >
            <img
              src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80"
              alt="Artisanal Tuscan Leather"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase self-start shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Artisanal Craft
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Goodyear-Welted Perfection
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  The Tuscan Leather Heritage
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-sm">
                  Vegetable-tanned full grain calfskin that patinas with beauty. Made for lifetime durability.
                </p>
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedCategory('formal');
                      navigateTo('shop', undefined, 'formal');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-black inline-flex items-center gap-2 transition-all shadow-xl cursor-pointer"
                  >
                    <span>Shop Formal Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Banner 2: Gen-Z Streetwear & Running */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative h-84 sm:h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200"
          >
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
              alt="Urban Velocity Nitrogen Foam"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-300 text-[11px] font-black uppercase self-start shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                Performance Tech
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  NitroFoam Propulsion
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Urban Velocity & Chunky Silhouettes
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-sm">
                  Responsive spring-back foam paired with statement architectural street soles.
                </p>
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedCategory('sneakers');
                      navigateTo('shop', undefined, 'sneakers');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-black inline-flex items-center gap-2 transition-all shadow-xl cursor-pointer"
                  >
                    <span>Explore Streetwear Runners</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
