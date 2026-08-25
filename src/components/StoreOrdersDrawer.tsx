import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderDetails } from '../types';
import {
  formatOrderWhatsAppMessage,
  getStoreWhatsAppOrderUrl,
  getCustomerWhatsAppChatUrl,
  getStoreWhatsAppCancellationUrl,
  playOrderNotificationSound,
} from '../utils/orderNotification';
import {
  X,
  Bell,
  MessageCircle,
  Phone,
  Truck,
  Copy,
  Check,
  Package,
  ExternalLink,
  Volume2,
  VolumeX,
  Trash2,
  Clock,
  User,
  MapPin,
  Banknote,
  Smartphone,
  CreditCard,
  Send,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StoreOrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreOrdersDrawer: React.FC<StoreOrdersDrawerProps> = ({ isOpen, onClose }) => {
  const {
    orders,
    orderNotifications,
    clearOrderNotifications,
    dismissOrderNotification,
    restoreAllNotifications,
    formatPrice,
    showToast,
    navigateTo,
  } = useShop();
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyOrder = (order: OrderDetails) => {
    const text = formatOrderWhatsAppMessage(order);
    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.orderId);
    showToast('Copied to Clipboard', `Full order details for ${order.orderId} copied.`, 'success');
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const handleTestChime = () => {
    playOrderNotificationSound();
    showToast('Order Chime Tested', 'Sound played successfully.', 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-xl bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold relative">
                  <Bell className="w-5 h-5" />
                  {orderNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                      {orderNotifications.length}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Live Orders & Chat Notifications</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Real-time customer details, shoes purchased, and WhatsApp dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div className="px-6 py-3 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-neutral-800">
                  {orderNotifications.length} {orderNotifications.length === 1 ? 'New Notification' : 'New Notifications'}
                </span>
                <button
                  onClick={handleTestChime}
                  className="flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Test Sound
                </button>
              </div>

              <div className="flex items-center gap-2">
                {orderNotifications.length > 0 && (
                  <button
                    onClick={clearOrderNotifications}
                    className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-800 font-bold transition-colors cursor-pointer"
                    title="Dismiss all notifications without removing customer tracking records"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Notifications
                  </button>
                )}

                {orderNotifications.length < orders.length && orders.length > 0 && (
                  <button
                    onClick={restoreAllNotifications}
                    className="text-[11px] text-neutral-600 hover:text-neutral-900 font-semibold underline cursor-pointer"
                  >
                    Show All ({orders.length})
                  </button>
                )}
              </div>
            </div>

            {/* Admin Portal Direct Link Banner */}
            <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Store Management, Cancelled Orders & CSV Export</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigateTo('admin');
                }}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-lg text-[11px] transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Open Admin Portal →
              </button>
            </div>

            {/* Orders Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {orderNotifications.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                    <Bell className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-neutral-900">
                      {orders.length > 0 ? 'All Notifications Cleared' : 'No Orders in Inbox'}
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      {orders.length > 0
                        ? `You have cleared your notification feed. All ${orders.length} placed order(s) remain safely preserved in Track TCS Order.`
                        : 'Whenever a customer completes checkout on the website, their full order information and instant WhatsApp chat notifications will appear here in real time.'}
                    </p>
                  </div>

                  {orders.length > 0 && (
                    <button
                      onClick={restoreAllNotifications}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore {orders.length} Order Notification{orders.length > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              ) : (
                orderNotifications.map((order, idx) => (
                  <div
                    key={order.orderId || idx}
                    className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xs hover:border-neutral-900 transition-all overflow-hidden space-y-4 p-5 relative"
                  >
                    {/* Dismiss Single Notification */}
                    <button
                      onClick={() => dismissOrderNotification(order.orderId)}
                      title="Dismiss notification"
                      className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100 pr-8">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-neutral-900">{order.orderId}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-bold">
                            {order.date}
                          </span>
                          {order.status === 'Cancelled' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-black flex items-center gap-1 border border-red-200">
                              <XCircle className="w-3 h-3" /> CANCELLED
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              ● {order.status}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          Payment:{' '}
                          <b className="text-neutral-900">
                            {order.paymentMethod === 'cod'
                              ? 'Cash on Delivery (COD)'
                              : order.paymentMethod === 'jazzcash-easypaisa'
                              ? 'JazzCash / EasyPaisa'
                              : 'Prepaid Card'}
                          </b>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className={`text-base font-black ${order.status === 'Cancelled' ? 'text-neutral-400 line-through' : 'text-amber-700'}`}>
                          {formatPrice(order.total)}
                        </span>
                        <span className="text-[10px] block text-emerald-600 font-bold">
                          {order.shipping === 0 ? 'FREE Delivery' : `+Rs. ${order.shipping} Delivery`}
                        </span>
                      </div>
                    </div>

                    {/* Cancellation Alert in Drawer if Cancelled */}
                    {order.status === 'Cancelled' && (
                      <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-xs text-red-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-red-700">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Order Cancelled by Buyer ({order.cancelledAt || 'Within 3h window'})</span>
                        </div>
                        <p className="text-[11px] text-red-800">
                          <b>Reason:</b> "{order.cancellationReason || 'Customer requested immediate cancellation'}"
                        </p>
                      </div>
                    )}

                    {/* Customer Contact & Address Box */}
                    <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-neutral-500" />
                            {order.customer.firstName} {order.customer.lastName}
                          </span>
                          <span className="text-neutral-600 block font-mono text-[11px]">
                            📞 {order.customer.phone}
                          </span>
                          <span className="text-neutral-500 block text-[11px]">
                            ✉️ {order.customer.email}
                          </span>
                        </div>

                        {/* Customer 1-Click Action Buttons */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <a
                            href={getCustomerWhatsAppChatUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </a>
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="pt-2 border-t border-neutral-200/80 flex items-start gap-1.5 text-[11px] text-neutral-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <b>Delivery Address:</b> {order.customer.address}, {order.customer.city}, {order.customer.province} ({order.customer.zip})
                          {order.customer.notes && (
                            <p className="text-amber-800 italic mt-0.5">Note: "{order.customer.notes}"</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shoe Items Purchased */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                        Shoe Items Purchased ({order.items.reduce((s, i) => s + i.quantity, 0)})
                      </span>
                      <div className="space-y-2">
                        {order.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover bg-white border border-neutral-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-neutral-900 truncate">{item.product.name}</h5>
                              <p className="text-[11px] text-neutral-500">
                                Size: <b>EU {item.selectedSize}</b> • Color: <b>{item.selectedColor.name}</b> • Qty: <b>{item.quantity}</b>
                              </p>
                            </div>
                            <span className="text-xs font-black text-neutral-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instant Dispatch & WhatsApp Actions */}
                    <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-xs">
                      {/* Send to Store WhatsApp */}
                      <a
                        href={getStoreWhatsAppOrderUrl(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-700" />
                        Send Order to WhatsApp
                      </a>

                      {/* Copy All Details */}
                      <button
                        onClick={() => handleCopyOrder(order)}
                        className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedOrderId === order.orderId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-[11px] text-neutral-500 text-center">
              💡 Store orders are updated instantly on checkout completion. All customer and footwear data is available for instant WhatsApp dispatch.
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
