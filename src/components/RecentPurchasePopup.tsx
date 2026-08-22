import React, { useState, useEffect, useCallback } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingBag, X, Sparkles, MapPin } from 'lucide-react';

interface PurchaseEvent {
  customerName: string;
  gender: 'male' | 'female';
  city: string;
  product: Product;
  size: number;
  color: string;
  timeAgo: string;
}

// Diverse Muslim names (men and women mix)
const MALE_NAMES = [
  'Muhammad Hamza',
  'Ali Raza',
  'Bilal Ahmed',
  'Usman Farooq',
  'Tariq Mehmood',
  'Saadullah Khan',
  'Kamran Siddiqui',
  'Haris Malik',
  'Faisal Qureshi',
  'Zohaib Hassan',
  'Omer Farooq',
  'Danish Nawaz',
  'Asad Ullah',
  'Shahrukh Khan',
  'Junaid Jamshed',
  'Ahsan Tariq',
  'Waqas Ali',
  'Zubair Butt',
  'Mustafa Kamal',
  'Ibrahim Khalil',
];

const FEMALE_NAMES = [
  'Fatima Zahra',
  'Ayesha Noor',
  'Zainab Bibi',
  'Maryam Tariq',
  'Sana Mir',
  'Khadija Batool',
  'Mahnoor Khan',
  'Hira Salman',
  'Anum Riaz',
  'Rabia Basri',
  'Iqra Aziz',
  'Sadia Imam',
  'Zoya Malik',
  'Nimra Ahmed',
  'Bushra Rehman',
  'Laiba Javed',
  'Mehwish Hayat',
  'Samina Peerzada',
  'Kinza Hashmi',
  'Sumbul Iqbal',
];

const CITIES = [
  'Lahore, Punjab',
  'Karachi, Sindh',
  'Islamabad, ICT',
  'Rawalpindi, Punjab',
  'Peshawar, KPK',
  'Faisalabad, Punjab',
  'Multan, Punjab',
  'Sialkot, Punjab',
  'Gujranwala, Punjab',
  'Quetta, Balochistan',
  'Abbottabad, KPK',
  'Hyderabad, Sindh',
  'Bahawalpur, Punjab',
  'Sargodha, Punjab',
];

const TIME_AGO_OPTIONS = [
  'Just now',
  '1 minute ago',
  '2 minutes ago',
  '4 minutes ago',
  '6 minutes ago',
  '9 minutes ago',
  '14 minutes ago',
  '21 minutes ago',
];

export const RecentPurchasePopup: React.FC = () => {
  const { products, formatPrice, navigateTo, activePage } = useShop();
  const [currentEvent, setCurrentEvent] = useState<PurchaseEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastIndex, setLastIndex] = useState(-1);

  // Generate next authentic purchase event
  const generatePurchaseEvent = useCallback((): PurchaseEvent | null => {
    if (!products || products.length === 0) return null;

    // Pick a random product different from previous if possible
    let nextProductIndex = Math.floor(Math.random() * products.length);
    if (products.length > 1 && nextProductIndex === lastIndex) {
      nextProductIndex = (nextProductIndex + 1) % products.length;
    }
    setLastIndex(nextProductIndex);

    const product = products[nextProductIndex];

    // Determine gender based on product or alternating mix
    const isWomenProduct = product.gender === 'women' || product.category === 'khussa';
    const isMenProduct = product.gender === 'men' || product.category === 'peshawari';

    let gender: 'male' | 'female';
    if (isWomenProduct) {
      gender = 'female';
    } else if (isMenProduct) {
      gender = 'male';
    } else {
      gender = Math.random() > 0.5 ? 'male' : 'female';
    }

    const nameList = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;
    const customerName = nameList[Math.floor(Math.random() * nameList.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const timeAgo = TIME_AGO_OPTIONS[Math.floor(Math.random() * TIME_AGO_OPTIONS.length)];

    // Pick a real available size and color for the chosen product
    const size = product.sizes && product.sizes.length > 0 
      ? product.sizes[Math.floor(Math.random() * product.sizes.length)] 
      : 42;

    const color = product.colors && product.colors.length > 0 
      ? product.colors[Math.floor(Math.random() * product.colors.length)].name 
      : 'Standard';

    return {
      customerName,
      gender,
      city,
      product,
      size,
      color,
      timeAgo,
    };
  }, [products, lastIndex]);

  useEffect(() => {
    if (isDismissed) return;

    let displayTimeout: NodeJS.Timeout;
    let nextIntervalTimeout: NodeJS.Timeout;

    // Initial appearance after 20 seconds as requested
    const initialTimer = setTimeout(() => {
      const event = generatePurchaseEvent();
      if (event) {
        setCurrentEvent(event);
        setIsVisible(true);

        // Keep visible for 6.5 seconds
        displayTimeout = setTimeout(() => {
          setIsVisible(false);
          scheduleNext();
        }, 6500);
      }
    }, 20000); // 20 seconds

    const scheduleNext = () => {
      // Random gap between 14 to 22 seconds for next pop up
      const nextDelay = Math.floor(Math.random() * 8000) + 14000;
      nextIntervalTimeout = setTimeout(() => {
        const event = generatePurchaseEvent();
        if (event) {
          setCurrentEvent(event);
          setIsVisible(true);

          displayTimeout = setTimeout(() => {
            setIsVisible(false);
            scheduleNext();
          }, 6500);
        }
      }, nextDelay);
    };

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(displayTimeout);
      clearTimeout(nextIntervalTimeout);
    };
  }, [generatePurchaseEvent, isDismissed]);

  if (!currentEvent || isDismissed) return null;

  const handleProductClick = () => {
    if (currentEvent.product) {
      navigateTo('product-detail', currentEvent.product.id);
      setIsVisible(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 max-w-[340px] sm:max-w-[390px] w-full pointer-events-none px-2 sm:px-0">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id="recent-purchase-popup"
            initial={{ opacity: 0, x: -70, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -70, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md text-neutral-900 rounded-2xl p-3.5 shadow-2xl border border-neutral-200/80 hover:border-neutral-300 transition-all group overflow-hidden relative"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="absolute top-2.5 right-2.5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Dismiss notification"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3">
              {/* Product Thumbnail (Clickable) */}
              <div
                onClick={handleProductClick}
                className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shrink-0 cursor-pointer shadow-xs group-hover:opacity-90 transition-opacity"
              >
                <img
                  src={currentEvent.product.images[0]}
                  alt={currentEvent.product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-0 inset-x-0 bg-neutral-900/70 text-white text-[9px] font-black uppercase text-center py-0.5 backdrop-blur-xs">
                  COD
                </span>
              </div>

              {/* Order & Customer Details */}
              <div className="flex-1 min-w-0 pr-4">
                {/* Live verified banner with pulsing dot */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="uppercase tracking-wider flex items-center gap-1 font-extrabold">
                    Verified Order • {currentEvent.timeAgo}
                  </span>
                </div>

                {/* Customer Name & City */}
                <p className="text-xs text-neutral-700 font-semibold truncate leading-tight">
                  <span className="text-neutral-950 font-bold">{currentEvent.customerName}</span> from{' '}
                  <span className="text-neutral-800 font-medium inline-flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-neutral-400 inline" />
                    {currentEvent.city}
                  </span>
                </p>

                {/* Purchased Product Name (Exact from website) */}
                <h4
                  onClick={handleProductClick}
                  className="text-xs font-bold text-neutral-950 hover:text-amber-600 transition-colors line-clamp-1 mt-1 cursor-pointer"
                  title={currentEvent.product.name}
                >
                  {currentEvent.product.name}
                </h4>

                {/* Exact Price and Option Details */}
                <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-neutral-950">
                      {formatPrice(currentEvent.product.price)}
                    </span>
                    {currentEvent.product.originalPrice && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        {formatPrice(currentEvent.product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                    Size: EU {currentEvent.size}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-100">
              <span className="flex items-center gap-1 text-neutral-500">
                <ShoppingBag className="w-3 h-3 text-amber-500" />
                <span>Dispatched via TCS Express</span>
              </span>
              <button
                onClick={handleProductClick}
                className="font-bold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-0.5"
              >
                <span>View Shoe</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
