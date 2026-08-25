import React from 'react';
import { SHOE_GRAM_GALLERY } from '../data/categories';
import { useShop } from '../context/ShopContext';
import { Instagram, Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const ShoeGramSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section id="shoegram-community" className="py-14 sm:py-20 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100/90 text-neutral-900 text-xs font-black uppercase tracking-wider border border-neutral-200 shadow-xs">
            <Instagram className="w-3.5 h-3.5 text-rose-500" />
            #SolePointStyle
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">
            As Worn by Our Global Community
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Tag @SolePointFootwear on Instagram to be featured in our seasonal curated lookbook.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SHOE_GRAM_GALLERY.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => navigateTo('shop')}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 border border-neutral-200 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={post.image}
                alt={post.tag}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-neutral-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-neutral-300 font-medium">{post.user}</span>
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <Heart className="w-3 h-3 fill-current" /> {post.likes}
                  </span>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/20 backdrop-blur-md text-[10px] font-black text-white mb-1">
                    <ShoppingBag className="w-2.5 h-2.5" /> {post.tag}
                  </div>
                  <span className="text-[10px] text-neutral-300 block flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition-transform">
                    Shop this look <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
