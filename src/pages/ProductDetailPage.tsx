import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Review } from '../types';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  Share2,
  ChevronRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  MessageSquarePlus,
  Send,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openSizeGuide,
    navigateTo,
    showToast,
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[1] || product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>('features');

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews);

  // Sync state if product changes
  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[1] || product.sizes[0]);
      setActiveImageIndex(0);
      setQuantity(1);
      setLocalReviews(product.reviews);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product.id]);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link Copied', 'Product link copied to clipboard.', 'info');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      title: newReviewTitle || 'Great shoes!',
      comment: newReviewComment,
      verified: true,
      fitRating: 'True to Size',
    };

    setLocalReviews((prev) => [newRev, ...prev]);
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Review Submitted', 'Thank you! Your verified review has been published.', 'success');
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  return (
    <div id="product-detail-view" className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigateTo('home')} className="hover:text-neutral-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigateTo('shop')} className="hover:text-neutral-900 transition-colors">
            Catalog
          </button>
          <span>/</span>
          <button
            onClick={() => navigateTo('shop', undefined, product.category)}
            className="hover:text-neutral-900 transition-colors capitalize"
          >
            {product.category.replace('-', ' ')}
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-bold truncate">{product.name}</span>
        </div>

        {/* Main Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Image Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {product.discountPercentage && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-xl shadow-md">
                  -{product.discountPercentage}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                  isWishlisted
                    ? 'bg-white text-rose-600 shadow-lg'
                    : 'bg-white/80 text-neutral-600 hover:text-rose-600 hover:bg-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-neutral-900 ring-2 ring-neutral-900/20 shadow-md'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Extra assurance banner under images */}
            <div className="hidden lg:grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>Free Express Delivery over $120</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <RefreshCw className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>30-Day Free Returns & Size Swaps</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>100% Verified Authentic Craft</span>
              </div>
            </div>
          </div>

          {/* Right Column: Buying Options (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <span>{product.brand} • {product.subcategory}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  In Stock ({product.stockCount} pairs available)
                </span>
              </div>

              <h1 className="text-3xl font-black text-neutral-900 tracking-tight mt-1">
                {product.name}
              </h1>
              <p className="text-sm font-medium text-neutral-500 mt-1">{product.tagline}</p>

              {/* Star Rating & Reviews anchor */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-black text-neutral-900">{product.rating} / 5.0</span>
                <span className="text-xs text-neutral-400 font-medium">({localReviews.length} reviews)</span>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-neutral-100">
                <span className="text-3xl font-black text-neutral-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-base font-medium text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Save {formatPrice(product.originalPrice! - product.price)} ({product.discountPercentage}% Off)
                  </span>
                )}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                <span>Color Shade: <span className="text-neutral-500 font-normal">{selectedColor.name}</span></span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      selectedColor.name === col.name
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                <span>Select Size (EU):</span>
                <button
                  onClick={() => openSizeGuide(product.gender === 'women' ? 'women' : 'men')}
                  className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Interactive Size Chart
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === sz
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-900'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:text-neutral-900"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:text-neutral-900"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag ({formatPrice(product.price * quantity)})
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Instant Express Checkout
              </button>
            </div>

            {/* Accordions for Specifications & Policies */}
            <div className="border-t border-neutral-200 divide-y divide-neutral-200 pt-4 space-y-2">
              {/* Features Accordion */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'features' ? '' : 'features')}
                  className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 py-2 text-left"
                >
                  <span>Key Engineering & Features</span>
                  <ChevronRight
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      activeAccordion === 'features' ? 'rotate-90 text-neutral-900' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'features' && (
                  <ul className="text-xs text-neutral-600 space-y-2 py-2 pl-4 list-disc">
                    {product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                    <li>Upper Material: <b>{product.material}</b></li>
                    <li>Sole Construction: <b>{product.soleMaterial}</b></li>
                  </ul>
                )}
              </div>

              {/* Delivery & Care Accordion */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'delivery' ? '' : 'delivery')}
                  className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 py-2 text-left"
                >
                  <span>Shipping, Returns & Shoe Care</span>
                  <ChevronRight
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      activeAccordion === 'delivery' ? 'rotate-90 text-neutral-900' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'delivery' && (
                  <div className="text-xs text-neutral-600 space-y-2 py-2 leading-relaxed">
                    <p>
                      • <b>Express Shipping:</b> 2-4 business days with DHL / FedEx live tracking.
                    </p>
                    <p>
                      • <b>Returns:</b> 30-day money-back guarantee or free size swap.
                    </p>
                    <p>
                      • <b>Care Instructions:</b> Wipe dust with a soft micro-cloth. Store in our included cotton dust bags with cedar shoe trees to maintain original silhouette and leather moisture balance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Verified Customer Reviews Section */}
        <div id="reviews-section" className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                Customer Reviews & Fit Feedback
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Real feedback from verified shoe wearers around the world.
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Write a Review
            </button>
          </div>

          {/* Write a Review Modal / Expand Form */}
          {showReviewForm && (
            <form
              onSubmit={handleAddReview}
              className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 mb-8 space-y-4 max-w-xl"
            >
              <h4 className="text-sm font-bold text-neutral-900">Share Your Experience</h4>
              
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Rating:</label>
                <div className="flex gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= newReviewRating ? 'fill-current' : 'text-neutral-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Miller"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Unbelievable comfort!"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Detailed Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="How did the shoes fit? How was the cushioning and leather quality?"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid md:grid-cols-2 gap-4">
            {localReviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">{rev.date}</span>
                </div>

                <h5 className="text-xs font-bold text-neutral-900">{rev.title}</h5>
                <p className="text-xs text-neutral-600 leading-relaxed italic">"{rev.comment}"</p>

                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-neutral-800 flex items-center gap-1">
                    {rev.author}
                    {rev.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Buyer" />}
                  </span>
                  {rev.fitRating && (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      Fit: {rev.fitRating}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                  You May Also Like
                </h3>
                <p className="text-xs text-neutral-500">Complementary styles from our curated footwear line.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
