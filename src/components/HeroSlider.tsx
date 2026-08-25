import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { HERO_SLIDES } from '../data/categories';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Interactive3DShoe } from './Interactive3DShoe';

export const HeroSlider: React.FC = () => {
  const { navigateTo } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      id="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-neutral-950 min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center select-none"
    >
      {/* Background Animated Layer with Gradient Mesh */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 filter contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/40 to-neutral-950/95" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Kinetic Background Text */}
      <div className="absolute inset-0 flex items-center justify-start sm:justify-center overflow-hidden pointer-events-none z-0">
        <motion.span
          key={`bg-text-${slide.id}`}
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 0.04, x: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-[120px] sm:text-[180px] lg:text-[240px] font-black text-white tracking-tighter uppercase whitespace-nowrap select-none"
        >
          {slide.ctaCategory.toUpperCase()}
        </motion.span>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Kinetic Typography & CTAs */}
          <div className="lg:col-span-7 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${slide.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Animated Floating Pill Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-black uppercase tracking-wider shadow-2xl"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>{slide.badge}</span>
                </motion.div>

                {/* Main Hero Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] drop-shadow-md">
                  {slide.title}
                </h1>

                {/* Subtitle / Description */}
                <p className="text-sm sm:text-base lg:text-lg font-medium text-neutral-300 leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Interactive Action Buttons with Micro-interactions */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigateTo('shop', undefined, slide.ctaCategory)}
                    className="group px-7 py-4 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-100 font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-2xl cursor-pointer"
                  >
                    <span>Shop the Drop</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigateTo('shop', undefined, slide.secondaryCategory)}
                    className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer shadow-lg"
                  >
                    {slide.secondaryCta}
                  </motion.button>
                </div>

                {/* Trust Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-white/80 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pure Veg-Tan Leather</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Free Shipping PK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>7-Day Easy Swap</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Interactive 3D Card Preview on Desktop */}
          <div className="hidden lg:block lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`preview-${slide.id}`}
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
              >
                <Interactive3DShoe
                  imageSrc={slide.image}
                  altText={slide.title}
                  brandTag="DROP 2026"
                  badge="FEATURING SILHOUETTE"
                  tagline="Interactive 3D Perspective Preview"
                  onCtaClick={() => navigateTo('shop', undefined, slide.ctaCategory)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/10 hover:scale-110 active:scale-95 cursor-pointer shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/10 hover:scale-110 active:scale-95 cursor-pointer shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators & Auto Timer Progress Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="flex gap-2.5 items-center bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-amber-400 shadow-md' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
