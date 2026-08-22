import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, navigateTo, addToCart, showToast } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToBag = () => {
    wishlistedProducts.forEach((prod) => {
      addToCart(prod, prod.colors[0], prod.sizes[1] || prod.sizes[0], 1);
    });
    showToast('All Items Added', 'All wishlisted footwear moved to your shopping bag.', 'success');
  };

  return (
    <div id="wishlist-page" className="bg-neutral-50/40 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <button onClick={() => navigateTo('home')} className="hover:text-neutral-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">My Saved Footwear</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-neutral-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                My Wishlist Favorites
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'shoe saved' : 'shoes saved'} for your next purchase
              </p>
            </div>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              onClick={handleMoveAllToBag}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              Add All to Shopping Bag
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Your wishlist is empty</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Browse our collections and tap the heart icon on shoes you'd like to save for later.
              </p>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
            >
              Explore Shoes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {wishlistedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
