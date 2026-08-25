import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderDetails } from '../types';
import {
  getOrderCancellationStatus,
  getStoreWhatsAppCancellationUrl,
  getStoreWhatsAppOrderUrl,
  getCustomerWhatsAppChatUrl,
} from '../utils/orderNotification';
import {
  Clock,
  Search,
  CheckCircle2,
  Package,
  MapPin,
  HelpCircle,
  ArrowRight,
  Trash2,
  ShoppingBag,
  AlertTriangle,
  XCircle,
  MessageCircle,
  Send,
  Phone,
  Truck,
  ShieldAlert,
  Info,
  Calendar,
  User,
  CreditCard,
  Banknote,
  RotateCcw,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TrackOrderPage: React.FC = () => {
  const { getOrderById, orders, cancelOrder, clearOrders, navigateTo, formatPrice, showToast } = useShop();

  const [searchId, setSearchId] = useState(() => (orders.length > 0 ? orders[0].orderId : ''));
  const [searchedOrder, setSearchedOrder] = useState<OrderDetails | null>(() => (orders.length > 0 ? orders[0] : null));

  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered wrong shoe size / EU fit');
  const [cancelCustomNote, setCustomNote] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationSuccessOrder, setCancellationSuccessOrder] = useState<OrderDetails | null>(null);

  // Live countdown timer state (ticks every second)
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync searched order when orders state changes
  useEffect(() => {
    if (orders.length > 0) {
      if (searchedOrder) {
        const updated = orders.find((o) => o.orderId === searchedOrder.orderId);
        if (updated) setSearchedOrder(updated);
      } else {
        setSearchedOrder(orders[0]);
        setSearchId(orders[0].orderId);
      }
    } else {
      setSearchedOrder(null);
      setSearchId('');
    }
  }, [orders]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = getOrderById(searchId.trim());
    setSearchedOrder(found || null);
  };

  const handleClearOrders = () => {
    clearOrders();
    setSearchedOrder(null);
    setSearchId('');
    showToast('Orders Cleared', 'All placed orders have been cleared successfully.', 'info');
  };

  const handleConfirmCancel = () => {
    if (!searchedOrder) return;
    setIsCancelling(true);

    const fullReason = cancelCustomNote.trim()
      ? `${cancelReason} - Note: ${cancelCustomNote.trim()}`
      : cancelReason;

    setTimeout(() => {
      const updated = cancelOrder(searchedOrder.orderId, fullReason);
      setIsCancelling(false);
      setIsCancelModalOpen(false);
      if (updated) {
        setSearchedOrder(updated);
        setCancellationSuccessOrder(updated);
      }
    }, 400);
  };

  // Cancellation timing calculations for current order
  const cancellationStatus = searchedOrder ? getOrderCancellationStatus(searchedOrder) : null;

  return (
    <div id="track-order-view" className="bg-neutral-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo('home')} className="hover:text-neutral-900 transition-colors cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">TCS Pakistan Order & Tracking Status</span>
          </div>
          {searchedOrder && (
            <button
              onClick={() => {
                setSearchedOrder(null);
                setSearchId('');
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Search View
            </button>
          )}
        </div>

        {/* Search Bar Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Pakistan Real-Time Courier Tracking & Cancellation
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Check Footwear Order & Delivery Location
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Track where your shoes have reached across Pakistan, view full purchase details, or cancel your order within the 3-hour window.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Order Reference (e.g. SP-78219-PK)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              Track Package <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Placed Orders Quick Switcher */}
          {orders.length > 0 && (
            <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500 font-medium">Your Placed Orders:</span>
              {orders.map((o) => (
                <button
                  key={o.orderId}
                  onClick={() => {
                    setSearchId(o.orderId);
                    setSearchedOrder(o);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    searchedOrder?.orderId === o.orderId
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span>{o.orderId}</span>
                  <span>•</span>
                  <span>{formatPrice(o.total)}</span>
                  {o.status === 'Cancelled' && (
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-red-500 text-white text-[9px] font-bold">
                      CANCELLED
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tracking Details Display */}
        {searchedOrder ? (
          <div className="mt-8 space-y-6">
            {/* Cancellation Success Alert Banner with Instant WhatsApp Broadcast */}
            {searchedOrder.status === 'Cancelled' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950 text-white rounded-3xl p-6 sm:p-8 border border-red-800 shadow-xl space-y-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">Order Cancelled Successfully</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-800 text-red-200 text-[10px] font-bold uppercase tracking-wider">
                        Cancelled in 3h Window
                      </span>
                    </div>
                    <p className="text-xs text-red-200 leading-relaxed">
                      Order <b>{searchedOrder.orderId}</b> was cancelled. Courier dispatch for this footwear parcel has been halted.
                    </p>
                    {searchedOrder.cancellationReason && (
                      <p className="text-xs text-red-300 pt-1">
                        <b>Reason:</b> "{searchedOrder.cancellationReason}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Instant WhatsApp Cancellation Notification Box */}
                <div className="bg-red-900/60 rounded-2xl p-4 sm:p-5 border border-red-700/60 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      WhatsApp Cancellation Notification Sent to Store
                    </span>
                    <span className="text-[11px] text-red-300 font-bold uppercase tracking-wider">CANCELLED</span>
                  </div>

                  <p className="text-[11px] text-red-200">
                    Click below to review the WhatsApp cancellation chat message containing all cancelled shoe details, customer phone, and address:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <a
                      href={getStoreWhatsAppCancellationUrl(searchedOrder, searchedOrder.cancellationReason)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                      Send Cancellation Details via WhatsApp
                    </a>
                    <button
                      onClick={() => navigateTo('contact')}
                      className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-300" />
                      Contact Support Desk
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3-Hour Cancellation Status & Action Bar (if not cancelled) */}
            {searchedOrder.status !== 'Cancelled' && cancellationStatus && (
              <div
                className={`rounded-3xl p-5 sm:p-6 border shadow-xs transition-all ${
                  cancellationStatus.canCancel
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${cancellationStatus.canCancel ? 'text-amber-700' : 'text-neutral-500'}`} />
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        {cancellationStatus.canCancel
                          ? '3-Hour Order Cancellation Window Active'
                          : '3-Hour Cancellation Window Elapsed'}
                      </h4>
                    </div>

                    {cancellationStatus.canCancel ? (
                      <p className="text-xs text-amber-900">
                        You can cancel this order within 3 hours of placing it. Time remaining:{' '}
                        <b className="font-mono text-amber-950 text-sm bg-amber-200/60 px-2 py-0.5 rounded-md">
                          {cancellationStatus.hours}h {cancellationStatus.minutes}m {cancellationStatus.seconds}s
                        </b>
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-600">
                        The 3-hour free cancellation window has passed. Your footwear parcel is packed and scheduled for courier transit. For emergency adjustments, message WhatsApp support.
                      </p>
                    )}
                  </div>

                  {cancellationStatus.canCancel ? (
                    <button
                      onClick={() => setIsCancelModalOpen(true)}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Order
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateTo('contact')}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Support Desk
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Status Summary & Current Courier Location Card */}
            <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Order Reference
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-mono text-white">
                    {searchedOrder.orderId}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Courier: <b className="text-neutral-200">{searchedOrder.courierName || 'TCS Express Pakistan'}</b> • Tracking #{' '}
                    <b className="text-amber-300 font-mono">{searchedOrder.trackingNumber || 'TCS-7890123456'}</b>
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Shipment Status
                  </span>
                  <span
                    className={`text-lg font-black ${
                      searchedOrder.status === 'Cancelled' ? 'text-red-400' : 'text-amber-300'
                    }`}
                  >
                    {searchedOrder.status}
                  </span>
                  <div>
                    {searchedOrder.status === 'Cancelled' ? (
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-400/30">
                        ● Cancelled
                      </span>
                    ) : (
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                        ● {searchedOrder.estimatedDelivery}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Exact Location & Reach Checkpoint Box */}
              <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Current Parcel Location / Hub:</span>
                </div>
                <div className="pl-6 text-xs text-neutral-200">
                  {searchedOrder.status === 'Cancelled' ? (
                    <p className="text-red-300">
                      <b>Shipment Halted at:</b> {searchedOrder.currentLocation || 'SolePoint Central Fulfillment Hub (Lahore / Rawalpindi)'}. Item returned to inventory.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-semibold text-white">
                        📍 {searchedOrder.currentLocation || `TCS Regional Logistics Center (En route to ${searchedOrder.customer.city})`}
                      </p>
                      <p className="text-neutral-400 text-[11px]">
                        Destined for: <b>{searchedOrder.customer.address}, {searchedOrder.customer.city}, {searchedOrder.customer.province}</b>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Shipment Progress & Transit Milestones
                </h4>
                <div className="space-y-6">
                  {searchedOrder.trackingSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start relative">
                      {/* Line connector */}
                      {idx < searchedOrder.trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-6 ${
                            step.completed
                              ? searchedOrder.status === 'Cancelled'
                                ? 'bg-red-500'
                                : 'bg-emerald-500'
                              : 'bg-neutral-800'
                          }`}
                        />
                      )}

                      {/* Dot icon */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          step.title.includes('Cancelled')
                            ? 'bg-red-600 text-white ring-4 ring-red-600/20'
                            : step.completed
                            ? 'bg-emerald-500 text-white'
                            : step.current
                            ? 'bg-amber-400 text-neutral-950 ring-4 ring-amber-400/20'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {step.title.includes('Cancelled') ? (
                          <XCircle className="w-4 h-4" />
                        ) : step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs">
                          <h5
                            className={`font-bold ${
                              step.title.includes('Cancelled')
                                ? 'text-red-400'
                                : step.completed || step.current
                                ? 'text-white'
                                : 'text-neutral-500'
                            }`}
                          >
                            {step.title}
                          </h5>
                          <span className="text-[11px] text-neutral-400">{step.date}</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Package Contents & Shoe Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-neutral-700" />
                  Ordered Footwear Items ({searchedOrder.items.reduce((s, i) => s + i.quantity, 0)})
                </h4>
                <span className="text-xs text-neutral-500">
                  Payment: <b>{searchedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : searchedOrder.paymentMethod === 'jazzcash-easypaisa' ? 'JazzCash / EasyPaisa' : 'Card'}</b>
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {searchedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-neutral-900 truncate">{item.product.name}</h5>
                      <p className="text-[11px] text-neutral-500">
                        Size: <b>EU {item.selectedSize}</b> • Color: <b>{item.selectedColor.name}</b> • Qty: <b>{item.quantity}</b>
                      </p>
                      <p className="text-[11px] text-neutral-400">Unit Price: {formatPrice(item.product.price)}</p>
                    </div>
                    <span className="text-sm font-black text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Customer Doorstep Address & Total Breakdown */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    Customer & Destination Details:
                  </span>
                  <p className="text-neutral-800 font-semibold">
                    {searchedOrder.customer.firstName} {searchedOrder.customer.lastName}
                  </p>
                  <p className="text-neutral-600 font-mono text-[11px]">
                    📞 {searchedOrder.customer.phone}
                  </p>
                  <p className="text-neutral-600">
                    {searchedOrder.customer.address}, {searchedOrder.customer.city}, {searchedOrder.customer.province} ({searchedOrder.customer.zip})
                  </p>
                  {searchedOrder.customer.notes && (
                    <p className="text-amber-800 italic pt-0.5">Note: "{searchedOrder.customer.notes}"</p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                  <span className="font-bold text-neutral-900 block">Payment & Shipping Summary:</span>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shoe Subtotal:</span>
                    <span>{formatPrice(searchedOrder.subtotal)}</span>
                  </div>
                  {searchedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Voucher Discount:</span>
                      <span>-{formatPrice(searchedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Courier Shipping:</span>
                    <span>{searchedOrder.shipping === 0 ? 'FREE (Order > Rs. 3600)' : formatPrice(searchedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-900 pt-1.5 border-t border-neutral-200">
                    <span>Total Amount:</span>
                    <span className={searchedOrder.status === 'Cancelled' ? 'text-neutral-500 line-through' : 'text-amber-700'}>
                      {formatPrice(searchedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={getStoreWhatsAppOrderUrl(searchedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" /> WhatsApp Order Summary
                </a>
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Print Order Bill
                </button>
              </div>
            </div>
          </div>
        ) : searchId ? (
          <div className="mt-8 bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">Order Reference Not Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              We couldn't locate an active order matching "{searchId}". Please verify your order number or check your SMS/WhatsApp confirmation.
            </p>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900">No Active Orders in Tracking</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                When you place a new order on SolePoint Pakistan, you can track courier milestones and cancel within 3 hours directly from here.
              </p>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Start Shopping <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3-Hour Order Cancellation Modal */}
      <AnimatePresence>
        {isCancelModalOpen && searchedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCancelModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <div className="min-h-screen px-4 text-center flex items-center justify-center py-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="inline-block w-full max-w-lg p-6 sm:p-8 bg-white text-left align-middle shadow-2xl rounded-3xl relative z-10 space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Cancel Order #{searchedOrder.orderId}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Within 3-Hour Cancellation Window • No penalty charges
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-neutral-900 block">
                    Please select the reason for cancellation:
                  </label>
                  <div className="space-y-2">
                    {[
                      'Ordered wrong shoe size / EU fit',
                      'Want to change footwear model or color',
                      'Need to update doorstep delivery address',
                      'Change payment method (COD / JazzCash)',
                      'Ordered by mistake / Change of mind',
                      'Other reason',
                    ].map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          cancelReason === reason
                            ? 'bg-red-50 border-red-300 text-red-950 font-bold'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cancelReason"
                          value={reason}
                          checked={cancelReason === reason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 block">
                    Additional notes (optional):
                  </label>
                  <textarea
                    rows={2}
                    value={cancelCustomNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Please cancel this order, I will place a new order for Size EU 43"
                    className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>

                <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-700" /> What happens after cancellation:
                  </span>
                  <p>
                    Your order status will immediately update to <b>Cancelled</b>, courier packaging will halt, and an automated WhatsApp cancellation message with full details will be generated for store dispatch.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(false)}
                    className="flex-1 py-3 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Keep Order
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Order Cancellation'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
