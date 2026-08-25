import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Interactive3DShoe } from './Interactive3DShoe';
import { Sparkles, ArrowRight, ShieldCheck, Flame, ShoppingBag, Check, Layers, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const DropShowcase: React.FC = () => {
  const { products, addToCart, navigateTo, formatPrice } = useShop();

  // Highlight marquee drop product
  const marqueeProduct = products.find((p) => p.id === 'pesh-01') || products[0];
  const [selectedColor, setSelectedColor] = useState(marqueeProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number>(marqueeProduct.sizes[2] || 42);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickBuy = () => {
    addToCart(marqueeProduct, selectedColor, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <section id="the-drop-showcase" className="py-16 sm:py-24 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-900">
      {/* Background Ambient Gradients */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>THE DROP // EXCLUSIVE RELEASE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Kaptaan Noruzi Special Edition
            </h2>
          </div>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-md">
            Engineered with hand-selected double vegetable-tanned cowhide, Goodyear reinforced welt, and high-traction signature tyre tread.
          </p>
        </div>

        {/* 2-Column High-Impact Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: 3D Interactive Shoe Tilt Card */}
          <div className="lg:col-span-7">
            <Interactive3DShoe
              imageSrc={marqueeProduct.images[0]}
              altText={marqueeProduct.name}
              brandTag="LIMITED 50 PAIRS"
              badge="HAND-NUMBERED"
              tagline="Vegetable-Tanned Cowhide • High-Grip Tyre Sole"
              floatingPills={[
                {
                  label: 'Sole Tech',
                  value: 'Durable Tyre Tread',
                  icon: <Layers className="w-4 h-4 text-amber-400" />,
                },
                {
                  label: 'Leather Grade',
                  value: 'Full Grain Veg-Tan',
                  icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
                },
              ]}
              onCtaClick={() => navigateTo('product-detail', marqueeProduct.id)}
            />
          </div>

          {/* Right: Technical Specs & One-Click Purchase Panel */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            {/* Price & Rating */}
            <div className="flex items-baseline justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
                  Retail Release
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-white">
                    {formatPrice(marqueeProduct.price)}
                  </span>
                  {marqueeProduct.originalPrice && (
                    <span className="text-base font-medium text-neutral-500 line-through">
                      {formatPrice(marqueeProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  In Stock ({marqueeProduct.stockCount} left)
                </span>
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-400">Selected Color:</span>
                <span className="text-white font-black">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {marqueeProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor.name === c.name
                        ? 'border-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                        : 'border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-400">Select European Size:</span>
                <button
                  onClick={() => navigateTo('size-guide')}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  Size Chart (EU/PK)
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {marqueeProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      selectedSize === sz
                        ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-md font-black'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    EU {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuickBuy}
                className={`w-full py-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Your Shopping Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Shop the Drop • Instant Bag</span>
                  </>
                )}
              </motion.button>

              <button
                onClick={() => navigateTo('product-detail', marqueeProduct.id)}
                className="w-full py-3 rounded-2xl bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Full Technical Breakdown</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
