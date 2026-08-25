import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingBag,
  Heart,
  ArrowRight,
  Sun,
  Sparkles,
  Check,
  Flame,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openSizeGuide,
    navigateTo,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(quickViewProduct?.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number | null>(quickViewProduct?.sizes[2] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Mouse tracking for interactive solar spotlight glint
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  const sunGlintX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const sunGlintY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Sync state if product changes
  React.useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]);
      setSelectedSize(quickViewProduct.sizes[2] || quickViewProduct.sizes[0]);
      setActiveImageIndex(0);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(quickViewProduct, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
    }, 1200);
  };

  const handleGoToFullPage = () => {
    closeQuickView();
    navigateTo('product-detail', quickViewProduct.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        {/* Dynamic Warm Sun Ambient Aura behind Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/15 to-yellow-300/20 blur-3xl pointer-events-none -z-10 animate-pulse"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative overflow-hidden text-neutral-900"
        >
          {/* Top Subtle Solar Gold Flare Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 animate-pulse" />

          {/* Close button with hover spin */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeQuickView}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-100/90 hover:bg-neutral-900 hover:text-white text-neutral-700 transition-colors z-30 shadow-md cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="grid md:grid-cols-2 gap-6 p-5 sm:p-8 items-center">
            {/* LEFT: Interactive Sun Motion Gallery Section */}
            <div className="space-y-4">
              <div
                ref={imageContainerRef}
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
                className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-black border border-neutral-800 relative group select-none shadow-xl flex items-center justify-center cursor-crosshair"
              >
                {/* 1. SOLAR SUNBURST ROTATING BEAMS (Continuous Celestial Motion) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-40%] pointer-events-none opacity-40 group-hover:opacity-65 transition-opacity"
                >
                  {/* Solar Ray Corona Spikes */}
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/30 via-orange-500/15 to-transparent blur-md" />
                  {/* 12-Ray Golden Sunburst */}
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      background:
                        'conic-gradient(from 0deg at 50% 50%, rgba(245,158,11,0.5) 0deg, transparent 15deg, rgba(245,158,11,0.5) 30deg, transparent 45deg, rgba(245,158,11,0.5) 60deg, transparent 75deg, rgba(245,158,11,0.5) 90deg, transparent 105deg, rgba(245,158,11,0.5) 120deg, transparent 135deg, rgba(245,158,11,0.5) 150deg, transparent 165deg, rgba(245,158,11,0.5) 180deg, transparent 195deg, rgba(245,158,11,0.5) 210deg, transparent 225deg, rgba(245,158,11,0.5) 240deg, transparent 255deg, rgba(245,158,11,0.5) 270deg, transparent 285deg, rgba(245,158,11,0.5) 300deg, transparent 315deg, rgba(245,158,11,0.5) 330deg, transparent 345deg, rgba(245,158,11,0.5) 360deg)',
                    }}
                  />
                </motion.div>

                {/* 2. SOLAR DISC GLOW (Pulsing Sun Core) */}
                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.35, 0.6, 0.35],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-56 h-56 rounded-full bg-radial from-amber-300/40 via-orange-500/20 to-transparent blur-2xl pointer-events-none"
                />

                {/* 3. DYNAMIC SUNLIGHT SHEEN SWEEP (Shimmer on reveal / hover) */}
                <motion.div
                  initial={{ x: '-150%', y: '-150%' }}
                  animate={{ x: '150%', y: '150%' }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 5,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-transparent via-amber-200/25 to-transparent -rotate-45 pointer-events-none z-10"
                />

                {/* 4. INTERACTIVE MOUSE SOLAR SPOTLIGHT (Follows user cursor) */}
                <motion.div
                  style={{
                    left: sunGlintX,
                    top: sunGlintY,
                  }}
                  className="absolute w-44 h-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-amber-300/35 via-yellow-500/15 to-transparent blur-xl pointer-events-none z-10"
                />

                {/* 5. MAIN PRODUCT SHOE IMAGE */}
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out relative z-10"
                />

                {/* Sun Motion Live Badge */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-lg">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                  </motion.div>
                  <span>Solar Craft ✦ Ray View</span>
                </div>

                {/* Discount Tag */}
                {quickViewProduct.discountPercentage && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-lg shadow-lg z-20">
                    -{quickViewProduct.discountPercentage}% OFF
                  </span>
                )}

                {/* Bottom Photo Hint */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-bold text-neutral-400 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    Move cursor for Sun Glint
                  </span>
                </div>
              </div>

              {/* Thumbnails with Solar Glow on Selection */}
              {quickViewProduct.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {quickViewProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative ${
                        activeImageIndex === idx
                          ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105 shadow-md shadow-amber-500/20'
                          : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {activeImageIndex === idx && (
                        <div className="absolute inset-0 bg-amber-400/10 pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Detailed Info Section */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Brand & Stock Status */}
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                  <span className="text-neutral-500 font-bold">
                    {quickViewProduct.brand} • {quickViewProduct.subcategory}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-black">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    IN STOCK ({quickViewProduct.stockCount} LEFT)
                  </span>
                </div>

                {/* Main Product Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1 tracking-tight">
                  {quickViewProduct.name}
                </h2>

                {/* Subtitle / Specs */}
                <p className="text-xs sm:text-sm font-medium text-neutral-500 mt-1">
                  {quickViewProduct.tagline || 'Signature Double Tyre Sole • Full Grain Cowhide Leather'}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(quickViewProduct.rating)
                            ? 'fill-current text-amber-500'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-neutral-900">{quickViewProduct.rating}</span>
                  <span className="text-xs text-neutral-400 font-medium">
                    ({quickViewProduct.reviewCount} customer reviews)
                  </span>
                </div>

                {/* Price in PKR */}
                <div className="flex items-baseline gap-3 mt-4 pt-3.5 border-t border-neutral-100">
                  <span className="text-3xl font-black text-neutral-950">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-base font-medium text-neutral-400 line-through">
                      {formatPrice(quickViewProduct.originalPrice)}
                    </span>
                  )}
                  {quickViewProduct.discountPercentage && (
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      Save {formatPrice(quickViewProduct.originalPrice! - quickViewProduct.price)}
                    </span>
                  )}
                </div>

                {/* Color Chooser */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-neutral-700">
                      Color:{' '}
                      <span className="font-black text-neutral-950">{selectedColor?.name}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          selectedColor?.name === c.name
                            ? 'border-neutral-950 bg-neutral-950 text-white shadow-md ring-2 ring-amber-400/40'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Chooser */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-neutral-700">Select EU Size:</span>
                    <button
                      onClick={() => openSizeGuide(quickViewProduct.gender === 'women' ? 'women' : 'men')}
                      className="text-xs font-black text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Size Chart Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-950'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Add to Bag Actions */}
                <div className="flex items-center gap-3 mt-6">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-neutral-300 rounded-2xl bg-neutral-50 px-2 py-1 shadow-inner">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center font-black text-neutral-700 hover:text-neutral-950 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black text-neutral-950">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-black text-neutral-700 hover:text-neutral-950 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button with Motion Animation */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Shopping Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add {quantity > 1 ? `(${quantity})` : ''} to Bag</span>
                      </>
                    )}
                  </motion.button>

                  {/* Wishlist Heart */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`p-3.5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-neutral-200 text-neutral-500 hover:text-rose-600 hover:border-rose-200'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </div>

              {/* Bottom Assurance & Full Details Link */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-3 font-medium">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" /> Free Shipping &gt; Rs. 3600
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> 7-Day Easy Swap
                  </span>
                </div>
                <button
                  onClick={handleGoToFullPage}
                  className="font-black text-neutral-950 hover:text-amber-700 flex items-center gap-1 transition-colors cursor-pointer group"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

