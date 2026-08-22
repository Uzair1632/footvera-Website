import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductColor, CartItem, CategoryType, ToastMessage, OrderDetails } from '../types';
import { PRODUCTS } from '../data/products';
import { SAMPLE_ORDERS } from '../data/sampleOrders';
import { playOrderNotificationSound } from '../utils/orderNotification';

export type ActivePage = 
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'wishlist'
  | 'checkout'
  | 'track-order'
  | 'about'
  | 'contact'
  | 'size-guide'
  | 'admin';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  activePage: ActivePage;
  selectedProductId: string | null;
  selectedCategory: CategoryType;
  selectedSubcategoryFilter: string | null;
  quickViewProduct: Product | null;
  isCartOpen: boolean;
  isSizeGuideOpen: boolean;
  activeSizeGuideTab: 'men' | 'women';
  toasts: ToastMessage[];
  orders: OrderDetails[];
  orderNotifications: OrderDetails[];
  unreadNotificationsCount: number;
  searchQuery: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: CategoryType) => void;
  setSelectedSubcategoryFilter: (sub: string | null) => void;
  addToCart: (product: Product, color: ProductColor, size: number, quantity?: number) => void;
  removeFromCart: (productId: string, colorName: string, size: number) => void;
  updateCartQuantity: (productId: string, colorName: string, size: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  formatPrice: (amountInPKR: number) => string;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning', image?: string) => void;
  removeToast: (id: string) => void;
  navigateTo: (page: ActivePage, productId?: string, category?: CategoryType, subcategory?: string) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openCart: () => void;
  closeCart: () => void;
  openSizeGuide: (tab?: 'men' | 'women') => void;
  closeSizeGuide: () => void;
  createOrder: (order: OrderDetails) => void;
  cancelOrder: (orderId: string, reason?: string) => OrderDetails | null;
  updateOrderStatus: (
    orderId: string,
    status: OrderDetails['status'],
    extra?: {
      courierName?: string;
      trackingNumber?: string;
      currentLocation?: string;
      estimatedDelivery?: string;
      cancellationReason?: string;
    }
  ) => void;
  deleteOrder: (orderId: string) => void;
  seedSampleOrders: () => void;
  clearOrders: () => void;
  clearOrderNotifications: () => void;
  dismissOrderNotification: (orderId: string) => void;
  restoreAllNotifications: () => void;
  getOrderById: (orderId: string) => OrderDetails | undefined;
  isStoreOrdersDrawerOpen: boolean;
  openStoreOrdersDrawer: () => void;
  closeStoreOrdersDrawer: () => void;
  
  // Calculations
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
  isFreeShippingEligible: boolean;
  freeShippingRemaining: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('solepoint_pk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('solepoint_pk_wishlist');
      return saved ? JSON.parse(saved) : ['sp-pesh-01', 'sp-khussa-01'];
    } catch {
      return ['sp-pesh-01', 'sp-khussa-01'];
    }
  });

  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('solepoint_pk_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('solepoint_pk_dismissed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isStoreOrdersDrawerOpen, setIsStoreOrdersDrawerOpen] = useState<boolean>(false);
  const [activeSizeGuideTab, setActiveSizeGuideTab] = useState<'men' | 'women'>('men');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('solepoint_pk_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('solepoint_pk_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('solepoint_pk_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('solepoint_pk_dismissed_notifications', JSON.stringify(dismissedNotificationIds));
    } catch (e) {
      console.error(e);
    }
  }, [dismissedNotificationIds]);

  // Sync with URL hash for discreet direct link support (e.g. #admin)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin' || hash === 'admin-portal' || hash === 'portal') {
        setActivePage('admin');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success', image?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, image }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatPrice = (amountInPKR: number): string => {
    return `Rs. ${Math.round(amountInPKR).toLocaleString('en-PK')}`;
  };

  const addToCart = (product: Product, color: ProductColor, size: number, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.name === color.name && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
      }
    });

    showToast(
      'Added to Cart',
      `${product.name} (Size EU ${size}, ${color.name}) added to bag.`,
      'success',
      product.images[0]
    );
  };

  const removeFromCart = (productId: string, colorName: string, size: number) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor.name === colorName && item.selectedSize === size)
      )
    );
    showToast('Removed', 'Item removed from your shopping bag.', 'info');
  };

  const updateCartQuantity = (productId: string, colorName: string, size: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorName, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedColor.name === colorName && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const product = products.find((p) => p.id === productId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Wishlist', `${product?.name || 'Item'} removed from favorites.`, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Saved to Wishlist', `${product?.name || 'Item'} added to your wishlist.`, 'success', product?.images[0]);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const navigateTo = (page: ActivePage, productId?: string, category?: CategoryType, subcategory?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    if (category) {
      setSelectedCategory(category);
    }
    if (subcategory !== undefined) {
      setSelectedSubcategoryFilter(subcategory);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openSizeGuide = (tab: 'men' | 'women' = 'men') => {
    setActiveSizeGuideTab(tab);
    setIsSizeGuideOpen(true);
  };
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  const openStoreOrdersDrawer = () => setIsStoreOrdersDrawerOpen(true);
  const closeStoreOrdersDrawer = () => setIsStoreOrdersDrawerOpen(false);

  const createOrder = (order: OrderDetails) => {
    // Ensure timestamp is attached for 3-hour cancellation countdown
    const orderWithTimestamp: OrderDetails = {
      ...order,
      placedAtTimestamp: order.placedAtTimestamp || Date.now(),
    };

    // Ensure it's not dismissed so notification pops up
    setDismissedNotificationIds((prev) => prev.filter((id) => id !== order.orderId));
    setOrders((prev) => [orderWithTimestamp, ...prev]);
    clearCart();

    // Play pleasant new order chime
    playOrderNotificationSound();

    // Trigger instant toast notification
    showToast(
      '🔔 Order Placed & Broadcasted!',
      `${order.customer.firstName} (${order.customer.phone}) ordered ${order.items[0]?.product.name} (Total: Rs. ${order.total.toLocaleString()})`,
      'success',
      order.items[0]?.product.images[0]
    );
  };

  const cancelOrder = (orderId: string, reason?: string): OrderDetails | null => {
    let updatedOrder: OrderDetails | null = null;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId.toLowerCase() === orderId.trim().toLowerCase()) {
          updatedOrder = {
            ...o,
            status: 'Cancelled',
            cancellationReason: reason || 'Customer requested order cancellation within 3-hour window',
            cancelledAt: new Date().toLocaleTimeString('en-PK', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            }),
            trackingSteps: [
              ...o.trackingSteps.map((s) => ({ ...s, current: false })),
              {
                title: 'Order Cancelled by Customer',
                description: `Cancellation confirmed on ${new Date().toLocaleTimeString('en-PK', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}. Reason: ${reason || 'Customer cancellation within 3-hour window'}. Dispatch halted.`,
                date: 'Just now',
                completed: true,
                current: true,
              },
            ],
          };
          return updatedOrder;
        }
        return o;
      })
    );

    showToast('Order Cancelled', `Order #${orderId} was cancelled successfully.`, 'warning');
    return updatedOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderDetails['status'],
    extra?: {
      courierName?: string;
      trackingNumber?: string;
      currentLocation?: string;
      estimatedDelivery?: string;
      cancellationReason?: string;
    }
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId.toLowerCase() === orderId.trim().toLowerCase()) {
          const nowStr = new Date().toLocaleTimeString('en-PK', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
          });

          const updated: OrderDetails = {
            ...o,
            status,
            courierName: extra?.courierName !== undefined ? extra.courierName : o.courierName,
            trackingNumber: extra?.trackingNumber !== undefined ? extra.trackingNumber : o.trackingNumber,
            currentLocation: extra?.currentLocation !== undefined ? extra.currentLocation : o.currentLocation,
            estimatedDelivery: extra?.estimatedDelivery !== undefined ? extra.estimatedDelivery : o.estimatedDelivery,
            cancellationReason:
              status === 'Cancelled'
                ? extra?.cancellationReason || o.cancellationReason || 'Cancelled by store administration'
                : o.cancellationReason,
            cancelledAt: status === 'Cancelled' ? o.cancelledAt || nowStr : o.cancelledAt,
          };

          // Generate or update tracking steps to match status
          const steps = [...(o.trackingSteps || [])];
          if (status === 'Order Placed') {
            updated.trackingSteps = [
              {
                title: 'Order Confirmed',
                description: 'Order placed by customer.',
                date: o.date,
                completed: true,
                current: true,
              },
              { title: 'Quality Inspection', description: 'Inspecting leather & sizing.', date: 'Pending', completed: false },
              { title: 'Courier Handover', description: 'Assigning to courier partner.', date: 'Pending', completed: false },
              { title: 'Delivered', description: 'Final doorstep delivery.', date: 'Pending', completed: false },
            ];
          } else if (status === 'Under Quality Check') {
            updated.trackingSteps = [
              { title: 'Order Confirmed', description: 'Order confirmed and registered.', date: o.date, completed: true },
              { title: 'Quality Check & Polishing', description: 'Passed master shoemaker 12-point quality check.', date: nowStr, completed: true, current: true },
              { title: 'Courier Handover', description: 'Packaging for courier dispatch.', date: 'In Progress', completed: false },
              { title: 'Delivered', description: 'Final doorstep delivery.', date: 'Pending', completed: false },
            ];
          } else if (status === 'Dispatched with Courier') {
            updated.trackingSteps = [
              { title: 'Order Confirmed', description: 'Order registered.', date: o.date, completed: true },
              { title: 'Quality Check Cleared', description: 'Inspected and packed in box.', date: o.date, completed: true },
              { title: `Dispatched via ${updated.courierName || 'Courier'}`, description: `Tracking #${updated.trackingNumber || 'Assigned'}. In transit.`, date: nowStr, completed: true, current: true },
              { title: 'Delivered', description: 'Final doorstep delivery.', date: `Expected ${updated.estimatedDelivery}`, completed: false },
            ];
          } else if (status === 'Out for Delivery') {
            updated.trackingSteps = [
              { title: 'Order Confirmed', description: 'Order registered.', date: o.date, completed: true },
              { title: 'Quality Check Cleared', description: 'Inspected & packed.', date: o.date, completed: true },
              { title: `Dispatched via ${updated.courierName || 'Courier'}`, description: `Tracking #${updated.trackingNumber || 'Assigned'}.`, date: o.date, completed: true },
              { title: 'Out for Doorstep Delivery', description: 'Courier delivery rider is out for delivery today.', date: nowStr, completed: true, current: true },
            ];
          } else if (status === 'Delivered') {
            updated.trackingSteps = [
              { title: 'Order Confirmed', description: 'Order registered.', date: o.date, completed: true },
              { title: 'Quality Check Cleared', description: 'Passed inspection.', date: o.date, completed: true },
              { title: `Dispatched via ${updated.courierName || 'Courier'}`, description: `Tracking #${updated.trackingNumber || 'Delivered'}.`, date: o.date, completed: true },
              { title: 'Delivered Successfully', description: `Delivered to ${o.customer.firstName} ${o.customer.lastName}. Payment completed.`, date: nowStr, completed: true, current: true },
            ];
          } else if (status === 'Cancelled') {
            updated.trackingSteps = [
              ...steps.map((s) => ({ ...s, current: false })),
              {
                title: 'Order Cancelled',
                description: `Cancellation recorded on ${nowStr}. Reason: ${updated.cancellationReason}. Dispatch halted.`,
                date: nowStr,
                completed: true,
                current: true,
              },
            ];
          }

          return updated;
        }
        return o;
      })
    );

    showToast('Order Status Updated', `Order #${orderId} status changed to ${status}.`, 'info');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId.toLowerCase() !== orderId.trim().toLowerCase()));
    setDismissedNotificationIds((prev) => prev.filter((id) => id.toLowerCase() !== orderId.trim().toLowerCase()));
    showToast('Order Deleted', `Order #${orderId} has been removed from records.`, 'info');
  };

  const seedSampleOrders = () => {
    setOrders(SAMPLE_ORDERS);
    setDismissedNotificationIds([]);
    try {
      localStorage.setItem('solepoint_pk_orders', JSON.stringify(SAMPLE_ORDERS));
      localStorage.removeItem('solepoint_pk_dismissed_notifications');
    } catch (e) {
      console.error(e);
    }
    showToast('Sample Orders Loaded', 'Active & Cancelled demonstration orders loaded into database.', 'success');
  };

  // Clears ONLY the live notification inbox without touching the customer's actual placed orders
  const clearOrderNotifications = () => {
    const allIds = orders.map((o) => o.orderId);
    setDismissedNotificationIds(allIds);
    showToast('Notifications Cleared', 'Live notifications cleared. Customer orders remain active in Track TCS Order.', 'info');
  };

  // Dismiss a single notification from inbox
  const dismissOrderNotification = (orderId: string) => {
    setDismissedNotificationIds((prev) => Array.from(new Set([...prev, orderId])));
  };

  // Restore all notifications back to inbox if needed
  const restoreAllNotifications = () => {
    setDismissedNotificationIds([]);
    showToast('Notifications Restored', 'All order notifications are now visible in inbox.', 'info');
  };

  // Completely resets order database (admin only)
  const clearOrders = () => {
    setOrders([]);
    setDismissedNotificationIds([]);
    try {
      localStorage.removeItem('solepoint_pk_orders');
      localStorage.removeItem('solepoint_pk_dismissed_notifications');
    } catch (e) {
      console.error(e);
    }
    showToast('Orders Reset', 'All order history and tracking records reset.', 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.orderId.toLowerCase() === orderId.trim().toLowerCase());
  };

  // Active notifications for the Store Orders Inbox drawer
  const orderNotifications = orders.filter((o) => !dismissedNotificationIds.includes(o.orderId));
  const unreadNotificationsCount = orderNotifications.length;

  // Calculations in PKR
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 4000; // Rs. 4000
  const isFreeShippingEligible = cartSubtotal >= freeShippingThreshold;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        activePage,
        selectedProductId,
        selectedCategory,
        selectedSubcategoryFilter,
        quickViewProduct,
        isCartOpen,
        isSizeGuideOpen,
        activeSizeGuideTab,
        toasts,
        orders,
        orderNotifications,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery,
        setSelectedCategory,
        setSelectedSubcategoryFilter,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        formatPrice,
        showToast,
        removeToast,
        navigateTo,
        openQuickView,
        closeQuickView,
        openCart,
        closeCart,
        openSizeGuide,
        closeSizeGuide,
        isStoreOrdersDrawerOpen,
        openStoreOrdersDrawer,
        closeStoreOrdersDrawer,
        createOrder,
        cancelOrder,
        updateOrderStatus,
        deleteOrder,
        seedSampleOrders,
        clearOrders,
        clearOrderNotifications,
        dismissOrderNotification,
        restoreAllNotifications,
        getOrderById,
        cartCount,
        cartSubtotal,
        freeShippingThreshold,
        isFreeShippingEligible,
        freeShippingRemaining,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
