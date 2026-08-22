/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { StoreOrdersDrawer } from './components/StoreOrdersDrawer';
import { ToastContainer } from './components/Toast';
import { RecentPurchasePopup } from './components/RecentPurchasePopup';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactFaqPage } from './pages/ContactFaqPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const MainLayout: React.FC = () => {
  const { activePage, isStoreOrdersDrawerOpen, closeStoreOrdersDrawer } = useShop();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactFaqPage />;
      case 'size-guide':
        return <SizeGuidePage />;
      case 'admin':
        return <AdminPortalPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Main Active Page Content with Smooth Motion Page Transition */}
      <main className="flex-1 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Global Modals & Drawers */}
      <CartDrawer />
      <StoreOrdersDrawer isOpen={isStoreOrdersDrawerOpen} onClose={closeStoreOrdersDrawer} />
      <ProductQuickViewModal />
      <SizeGuideModal />
      <ToastContainer />
      <RecentPurchasePopup />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
