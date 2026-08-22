import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Star, Eye, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    navigateTo,
    openSizeGuide,
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  const handleQuickAddSize = (size: number) => {
    addToCart(product, selectedColor, size, 1);
    setShowSizePicker(false);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  if (layout === 'list') {
    return (
      <motion.div
        id={`product-card-${product.id}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="group bg-white text-neutral-900 rounded-2xl p-4 border border-neutral-200 hover:border-neutral-400 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-5 relative"
      >
        {/* Left image */}
        <div
          className="relative w-full sm:w-56 h-56 rounded-xl overflow-hidden bg-neutral-100 shrink-0 cursor-pointer"
          onClick={() => navigateTo('product-detail', product.id)}
        >
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.discountPercentage && (
            <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {product.brand} • {product.subcategory}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-neutral-200 text-neutral-400 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h3
              onClick={() => navigateTo('product-detail', product.id)}
              className="text-lg font-bold text-neutral-900 mt-1 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              {product.name}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold text-neutral-900 ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-neutral-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-xs text-neutral-400 mr-1">Colors:</span>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    selectedColor.name === c.name
                      ? 'ring-2 ring-neutral-950 scale-110 shadow-sm'
                      : 'border-neutral-300 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-neutral-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm font-medium text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openQuickView(product)}
                className="px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick View
              </button>
              <button
                onClick={() => setShowSizePicker(!showSizePicker)}
                className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                {addedAnimation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                {addedAnimation ? 'Added' : 'Add to Bag'}
              </button>
            </div>
          </div>

          {/* Size picker dropdown for list view */}
          {showSizePicker && (
            <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-800">Select EU Size:</span>
                <button
                  onClick={() => openSizeGuide(product.gender === 'women' ? 'women' : 'men')}
                  className="text-[11px] text-neutral-500 hover:underline cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleQuickAddSize(sz)}
                    className="px-2.5 py-1 text-xs font-black rounded-lg bg-white text-neutral-900 border-2 border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    EU {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Grid Layout
  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white text-neutral-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-neutral-200/90 hover:border-neutral-900 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Card Image Container */}
        <div
          className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100 cursor-pointer"
          onClick={() => navigateTo('product-detail', product.id)}
        >
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />

          {/* Floating Badges */}
          <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.isNew && (
              <span className="bg-neutral-950 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-sm sm:rounded-md shadow-xs">
                NEW DROP
              </span>
            )}
            {product.discountPercentage && (
              <span className="bg-red-600 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-sm sm:rounded-md shadow-xs">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-amber-400 text-neutral-950 text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-sm sm:rounded-md shadow-xs">
                BEST SELLER
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
              isWishlisted
                ? 'bg-white text-rose-600 shadow-md'
                : 'bg-white/80 text-neutral-600 hover:text-rose-600 hover:bg-white'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button overlay on hover */}
          <div className="absolute inset-x-3 bottom-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickView(product);
              }}
              className="w-full py-2.5 bg-white/95 backdrop-blur-md hover:bg-neutral-950 hover:text-white text-neutral-950 text-xs font-black rounded-xl shadow-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-2 sm:mt-3">
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-black text-neutral-400 uppercase tracking-widest">
            <span className="truncate max-w-[65%]">{product.brand}</span>
            <div className="flex items-center text-amber-500 gap-0.5 sm:gap-1 font-bold">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span className="text-neutral-900">{product.rating}</span>
            </div>
          </div>

          <h3
            onClick={() => navigateTo('product-detail', product.id)}
            className="text-xs sm:text-sm font-bold text-neutral-950 mt-0.5 sm:mt-1 line-clamp-1 group-hover:text-amber-700 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 line-clamp-1">{product.tagline}</p>

          {/* Color swatches */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c);
                }}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all cursor-pointer ${
                  selectedColor.name === c.name ? 'ring-2 ring-neutral-950 scale-110 shadow-xs' : 'border-neutral-300 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[9px] sm:text-[11px] text-neutral-400 font-semibold ml-0.5">({product.colors.length})</span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Add to Bag */}
      <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-neutral-100">
        <div className="flex items-baseline justify-between mb-1.5 sm:mb-2">
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xs sm:text-base font-black text-neutral-950">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[9px] sm:text-xs font-medium text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[11px] font-bold text-emerald-600">In Stock</span>
        </div>

        {/* Quick Add Size Button or Selector */}
        {!showSizePicker ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowSizePicker(true)}
            className={`w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-xs cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-950 hover:bg-neutral-800 text-white'
            }`}
          >
            {addedAnimation ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            {addedAnimation ? 'Added' : 'Add to Bag'}
          </motion.button>
        ) : (
          <div className="p-1.5 sm:p-2.5 bg-neutral-100 rounded-lg sm:rounded-xl border border-neutral-300 text-neutral-900 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-black text-neutral-900 mb-1 sm:mb-1.5">
              <span>Size (EU):</span>
              <button
                onClick={() => setShowSizePicker(false)}
                className="text-[9px] sm:text-[11px] font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => handleQuickAddSize(sz)}
                  className="py-1 sm:py-1.5 text-[10px] sm:text-xs font-black rounded-md sm:rounded-lg bg-white text-neutral-950 border border-neutral-300 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
