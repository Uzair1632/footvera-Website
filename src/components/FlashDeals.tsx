import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Flame, Clock, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const FlashDeals: React.FC = () => {
  const { products, navigateTo, setSelectedCategory } = useShop();

  // 14 hours 22 mins countdown simulator
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 22,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashDeal || (p.discountPercentage && p.discountPercentage >= 22)).slice(0, 4);

  return (
    <section id="flash-deals-section" className="py-14 sm:py-20 bg-neutral-950 text-white relative overflow-hidden">
      {/* Decorative subtle background accents with motion glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Countdown Timer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 border-b border-neutral-800 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <Flame className="w-4 h-4 fill-current text-red-500" />
              <span>Limited-Time Price Drop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Flash Deals of the Week
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Steep markdowns on handcrafted styles. Prices revert automatically when countdown expires.
            </p>
          </div>

          {/* Countdown Blocks with Motion Graphic Pulsing */}
          <div className="flex items-center gap-2 sm:gap-3 bg-neutral-900/90 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-neutral-800 self-start lg:self-auto shadow-2xl">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-black pr-2 border-r border-neutral-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>ENDS IN:</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <div className="text-center px-2.5 py-1.5 bg-neutral-950 rounded-xl min-w-[50px] border border-neutral-800 shadow-inner">
                <span className="text-lg font-black text-white block leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-neutral-500">HRS</span>
              </div>
              <span className="text-neutral-500 font-bold">:</span>
              <div className="text-center px-2.5 py-1.5 bg-neutral-950 rounded-xl min-w-[50px] border border-neutral-800 shadow-inner">
                <span className="text-lg font-black text-white block leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-neutral-500">MINS</span>
              </div>
              <span className="text-neutral-500 font-bold">:</span>
              <div className="text-center px-2.5 py-1.5 bg-neutral-950 rounded-xl min-w-[50px] border border-neutral-800 shadow-inner">
                <span className="text-lg font-black text-red-400 block leading-none">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-neutral-500">SECS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid in Flash Deals */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 pt-6 sm:pt-8 items-stretch">
          {flashProducts.map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative flex flex-col justify-between h-full group"
            >
              <ProductCard product={prod} />
              {/* Flash claim progress badge with animated fill */}
              <div className="mt-2.5 px-2">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium mb-1.5">
                  <span className="flex items-center gap-1 text-amber-400 font-black">
                    <Zap className="w-3 h-3 fill-current animate-bounce" /> Only {prod.stockCount} pairs remaining
                  </span>
                  <span className="text-neutral-300 font-black">82% Claimed</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '82%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="text-center pt-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSelectedCategory('sale');
              navigateTo('shop', undefined, 'sale');
            }}
            className="px-8 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-black rounded-xl transition-all inline-flex items-center gap-2 shadow-2xl cursor-pointer"
          >
            <span>View All Clearance Deals</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
