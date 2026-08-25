import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    formatPrice,
    freeShippingThreshold,
    isFreeShippingEligible,
    freeShippingRemaining,
    navigateTo,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'SOLEPK10' || code === 'SAVE10') {
      setAppliedPromo({ code: code, discountPercent: 10 });
      setPromoCode('');
    } else if (code === 'EID20' || code === 'SAVE20') {
      setAppliedPromo({ code: code, discountPercent: 20 });
      setPromoCode('');
    } else {
      setPromoError('Invalid voucher code. Try SOLEPK10 or EID20');
    }
  };

  const discountAmount = appliedPromo ? (cartSubtotal * appliedPromo.discountPercent) / 100 : 0;
  const shippingFee = isFreeShippingEligible ? 0 : 250; // Rs. 250 flat standard shipping in Pakistan
  const finalTotal = cartSubtotal - discountAmount + shippingFee;

  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleGoToCheckout = () => {
    closeCart();
    navigateTo('checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Cart Header */}
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-900 text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Your Shopping Bag</h3>
                  <span className="text-xs text-neutral-500 font-medium">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar (Pakistan Rs. 3600) */}
            <div className="px-6 py-3.5 bg-neutral-900 text-white text-xs border-b border-neutral-800">
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  {isFreeShippingEligible ? (
                    <span className="text-emerald-300 font-bold">You unlocked FREE Delivery across Pakistan!</span>
                  ) : (
                    <span>
                      Add <span className="font-bold text-amber-300">{formatPrice(freeShippingRemaining)}</span> for FREE shipping
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-neutral-400 font-semibold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isFreeShippingEligible ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-900">Your bag is empty</h4>
                    <p className="text-xs text-neutral-500 max-w-xs mt-1">
                      Explore our handcrafted Peshawari chappals, khussas, and modern footwear.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeCart();
                      navigateTo('shop');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Explore Footwear Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}`}
                    className="py-4 flex gap-4 items-center"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-neutral-900 truncate">{item.product.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                        <span>Size: EU {item.selectedSize}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                      <div className="text-xs font-black text-neutral-900 mt-1.5">
                        {formatPrice(item.product.price)}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedColor.name,
                                item.selectedSize,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-0.5 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-neutral-900">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedColor.name,
                                item.selectedSize,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-0.5 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor.name, item.selectedSize)
                          }
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-neutral-200 bg-neutral-50/60 space-y-4">
                {/* Promo Code Form */}
                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Voucher code (e.g. SOLEPK10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Voucher {appliedPromo.code} ({appliedPromo.discountPercent}% OFF) Applied!
                    </span>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-xs text-emerald-900 font-semibold underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}

                {/* Subtotals & Breakdowns */}
                <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">{formatPrice(cartSubtotal)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Voucher Discount ({appliedPromo.discountPercent}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Delivery (Pakistan)</span>
                    <span className="font-semibold text-neutral-900">
                      {isFreeShippingEligible ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        formatPrice(250)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total Amount (PKR)</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Instant JazzCash, EasyPaisa & 7-Day Size Exchange
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
