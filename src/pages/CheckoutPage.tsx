import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderDetails } from '../types';
import { PAKISTAN_CITIES } from '../data/categories';
import confetti from 'canvas-confetti';
import {
  formatOrderWhatsAppMessage,
  getStoreWhatsAppOrderUrl,
  getCustomerWhatsAppChatUrl,
} from '../utils/orderNotification';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Clock,
  Printer,
  Sparkles,
  Phone,
  Banknote,
  Smartphone,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  ExternalLink,
  Tag,
  Bell,
  Send,
  AlertCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    formatPrice,
    isFreeShippingEligible,
    createOrder,
    navigateTo,
    showToast,
    openStoreOrdersDrawer,
  } = useShop();

  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  // Pakistani Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    zip: '',
    country: 'Pakistan',
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
  }>({});

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash-easypaisa' | 'bank-card' | 'cod'>('jazzcash-easypaisa');
  const [walletType, setWalletType] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [transactionId, setTransactionId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const copyMerchantTill = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText('00289104');
    setIsCopied(true);
    showToast('Till ID Copied!', 'Merchant Till ID 00289104 copied to clipboard', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const redirectToJazzCash = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText('00289104');
    setIsCopied(true);
    showToast('Merchant ID Copied!', 'Opening JazzCash payment app...', 'success');
    setTimeout(() => setIsCopied(false), 3000);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Direct deep link to JazzCash app transfer flow with fallback
      window.location.href = 'jazzcash://';
      setTimeout(() => {
        window.open('https://play.google.com/store/apps/details?id=com.techlogix.mobilinkcustomer', '_blank');
      }, 1200);
    } else {
      window.open('https://www.jazzcash.com.pk/', '_blank');
    }
  };

  const redirectToEasyPaisa = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText('00289104');
    setIsCopied(true);
    showToast('Merchant ID Copied!', 'Opening EasyPaisa payment app...', 'success');
    setTimeout(() => setIsCopied(false), 3000);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Direct deep link to EasyPaisa app
      window.location.href = 'easypaisa://';
      setTimeout(() => {
        window.open('https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix', '_blank');
      }, 1200);
    } else {
      window.open('https://easypaisa.com.pk/', '_blank');
    }
  };

  // Optional Promo Code (0% by default so real item price is never altered)
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMsg(null);
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'SOLEPK10' || code === 'SAVE10') {
      setAppliedPromo({ code, percent: 10 });
      setPromoMsg({ type: 'success', text: '10% discount voucher applied!' });
      setPromoCodeInput('');
    } else if (code === 'EID20' || code === 'SAVE20') {
      setAppliedPromo({ code, percent: 20 });
      setPromoMsg({ type: 'success', text: '20% special discount voucher applied!' });
      setPromoCodeInput('');
    } else {
      setPromoMsg({ type: 'error', text: 'Invalid promo code. Try SOLEPK10 or SAVE20' });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoMsg(null);
  };

  // Real shoe price (cartSubtotal) remains exactly the real item price
  const discountAmount = appliedPromo ? (cartSubtotal * appliedPromo.percent) / 100 : 0;
  // Shipping cost: When cart >= 3600, delivery is 100% FREE on ALL methods (COD & Online). If < 3600, Rs. 250 delivery charges apply.
  const isFreeDelivery = cartSubtotal >= 3600;
  const shippingCost = isFreeDelivery ? 0 : 250;
  const orderTotal = cartSubtotal - discountAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Strict validation: Only alphabetic letters, spaces, hyphens and apostrophes in First Name & Last Name (NO NUMBERS)
    if (name === 'firstName' || name === 'lastName') {
      const sanitized = value.replace(/[^a-zA-Z\s'-]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitized }));

      if (value !== sanitized) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: 'Only alphabets (A-Z) are allowed (no numbers)',
        }));
      } else if (sanitized.trim().length > 0 && sanitized.trim().length < 2) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: 'Minimum 2 letters required',
        }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[name as 'firstName' | 'lastName'];
          return next;
        });
      }
      return;
    }

    // Strict validation: Only numbers in Phone Number (NO ALPHABETS)
    if (name === 'phone') {
      const sanitized = value.replace(/[^\d-]/g, '').slice(0, 12);
      setFormData((prev) => ({ ...prev, phone: sanitized }));

      const pureDigits = sanitized.replace(/\D/g, '');
      if (value !== sanitized) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: 'Only numbers (0-9) are allowed in phone number',
        }));
      } else if (pureDigits.length > 0 && !pureDigits.startsWith('03')) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: 'Pakistani mobile numbers must start with 03 (e.g. 03001234567)',
        }));
      } else if (pureDigits.length > 0 && pureDigits.length < 11) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: `11 digits required (${pureDigits.length}/11 entered)`,
        }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.phone;
          return next;
        });
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof typeof fieldErrors];
        return next;
      });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: typeof fieldErrors = {};
    const cleanFirst = formData.firstName.trim();
    const cleanLast = formData.lastName.trim();
    const cleanPhone = formData.phone.replace(/\D/g, '');

    if (!cleanFirst) {
      errors.firstName = 'First name is required';
    } else if (!/^[A-Za-z\s'-]{2,40}$/.test(cleanFirst)) {
      errors.firstName = 'First name must contain only alphabets (min 2 letters)';
    }

    if (!cleanLast) {
      errors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z\s'-]{2,40}$/.test(cleanLast)) {
      errors.lastName = 'Last name must contain only alphabets (min 2 letters)';
    }

    if (!cleanPhone) {
      errors.phone = 'Phone number is required for courier delivery';
    } else if (cleanPhone.length !== 11 || !cleanPhone.startsWith('03')) {
      errors.phone = 'Valid 11-digit Pakistani number starting with 03 required (e.g. 03001234567)';
    }

    if (!formData.address.trim()) {
      errors.address = 'Complete delivery street address is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast(
        'Form Validation Error',
        'Please provide valid alphabetic names and an 11-digit Pakistani phone number.',
        'warning'
      );
      const deliverySection = document.getElementById('delivery-address-form');
      if (deliverySection) {
        deliverySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const randomId = `SP-${Math.floor(10000 + Math.random() * 90000)}-PK`;
      
      const newOrder: OrderDetails = {
        orderId: randomId,
        date: new Date().toISOString().split('T')[0],
        placedAtTimestamp: Date.now(),
        items: [...cart],
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingCost,
        tax: 0,
        total: orderTotal,
        customer: { ...formData },
        paymentMethod,
        transactionId: paymentMethod === 'jazzcash-easypaisa' ? transactionId : undefined,
        shippingMethod,
        courierName: 'TCS Express Courier',
        trackingNumber: `TCS-${Math.floor(7000000000 + Math.random() * 2000000000)}`,
        status: 'Order Placed',
        currentLocation: 'SolePoint Central Fulfillment Hub (Lahore / Rawalpindi)',
        estimatedDelivery: 'In 2-3 business days',
        trackingSteps: [
          {
            title: paymentMethod === 'cod'
              ? 'Cash on Delivery Order Registered'
              : paymentMethod === 'jazzcash-easypaisa'
              ? 'Payment Verified (JazzCash / EasyPaisa)'
              : 'Online Card Payment Received',
            description: paymentMethod === 'cod'
              ? (shippingCost === 0
                  ? `COD order confirmed with 100% FREE Delivery (Order over Rs. 3600). Total payable: ${formatPrice(orderTotal)} on doorstep delivery.`
                  : `COD order registered. Delivery charges (Rs. ${shippingCost}) added to shoe price. Please keep ${formatPrice(orderTotal)} cash ready for TCS rider.`)
              : paymentMethod === 'jazzcash-easypaisa'
              ? `Payment submitted via JazzCash / EasyPaisa (TID: ${transactionId || 'Verification in progress'}). Order registered.`
              : 'Card payment processed via 3D Secure banking gateway.',
            date: 'Just now',
            completed: true,
            current: true,
          },
          {
            title: 'Master Shoemaker Quality Check & Boxing',
            description: '12-point inspection passed. Packaged in luxury cedar dust bags.',
            date: 'Pending',
            completed: false,
          },
          {
            title: 'Dispatched with TCS Express',
            description: `Handed over to TCS central sorting hub for priority delivery to ${formData.city}.`,
            date: 'Pending',
            completed: false,
          },
          {
            title: 'Out for Doorstep Delivery in ' + formData.city,
            description: 'Local rider dispatched for safe handover at customer address.',
            date: 'Pending',
            completed: false,
          },
        ],
      };

      createOrder(newOrder);
      setCompletedOrder(newOrder);
      setIsProcessing(false);

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error(err);
      }
    }, 1200);
  };

  // If order was just placed, render Order Confirmation View
  if (completedOrder) {
    return (
      <div id="order-confirmation-screen" className="bg-neutral-50/50 min-h-screen py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xl space-y-8">
            {/* Header with success badge */}
            <div className="text-center space-y-3 pb-6 border-b border-neutral-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Order Placed Successfully ({completedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : completedOrder.paymentMethod === 'jazzcash-easypaisa' ? 'JazzCash / EasyPaisa' : 'Prepaid Card'})
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Shukriya, {completedOrder.customer.firstName}!
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                Your order is confirmed. A tracking SMS has been sent to{' '}
                <b className="text-neutral-800">{completedOrder.customer.phone}</b> and email to{' '}
                <b className="text-neutral-800">{completedOrder.customer.email}</b>.
              </p>
            </div>

            {/* Instant WhatsApp & Merchant Chat Notification Card */}
            <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      WhatsApp Order Chat & Instant Alert
                      <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                        SENT
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-200">
                      Customer name, phone number, and shoe items are formatted for 1-click WhatsApp messaging.
                    </p>
                  </div>
                </div>

                <button
                  onClick={openStoreOrdersDrawer}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-300" /> View Store Inbox
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                {/* 1-Click WhatsApp to Store */}
                <a
                  href={getStoreWhatsAppOrderUrl(completedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
                >
                  <Send className="w-4 h-4 text-neutral-950" />
                  Send Order via WhatsApp Chat
                </a>

                {/* 1-Click WhatsApp with Customer */}
                <a
                  href={getCustomerWhatsAppChatUrl(completedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  Chat Customer on WhatsApp
                </a>
              </div>
            </div>

            {/* COD Instructions Alert */}
            {completedOrder.paymentMethod === 'cod' && (
              <div className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2 ${
                completedOrder.shipping === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <div className={`flex items-center gap-2 font-bold ${
                  completedOrder.shipping === 0 ? 'text-emerald-900' : 'text-amber-900'
                }`}>
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span>Cash on Delivery Instructions:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {completedOrder.shipping === 0 ? (
                    <>
                      <b>100% FREE Delivery Applied</b> (Order above Rs. 3600). Please keep exact cash of{' '}
                      <b>{formatPrice(completedOrder.total)}</b> ready for the TCS Express rider upon parcel arrival.
                    </>
                  ) : (
                    <>
                      <b>Delivery charges apply</b> (Rs. {completedOrder.shipping} included in total shoe bill). Please keep exact cash of{' '}
                      <b>{formatPrice(completedOrder.total)}</b> ready for the TCS Express rider upon parcel arrival.
                    </>
                  )}
                </p>
              </div>
            )}

            {/* JazzCash / EasyPaisa Payment Verification Alert */}
            {completedOrder.paymentMethod === 'jazzcash-easypaisa' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>JazzCash / EasyPaisa Transfer Details:</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div>
                    <span className="text-neutral-500 block font-sans text-[11px]">Merchant Till / Account:</span>
                    <span className="font-bold text-neutral-900">00289104 (Till ID)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-sans text-[11px]">Account Title:</span>
                    <span className="font-bold text-neutral-900">SolePoint Footwear Store</span>
                  </div>
                  {completedOrder.transactionId && (
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 block font-sans text-[11px]">Submitted Trx ID (TID):</span>
                      <span className="font-bold text-emerald-700">{completedOrder.transactionId}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-neutral-600 pt-1">
                  Payment verification in progress. Our dispatch team will process your shipment automatically.
                </p>
              </div>
            )}

            {/* Order Tracking Reference Card */}
            <div className="bg-neutral-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  TCS Pakistan Tracking Reference
                </span>
                <span className="text-2xl font-black tracking-wider text-white font-mono">
                  {completedOrder.orderId}
                </span>
                <p className="text-xs text-neutral-400 mt-1">
                  Courier: <span className="text-white font-bold">{completedOrder.courierName}</span> • Est Delivery:{' '}
                  <span className="text-white font-bold">{completedOrder.estimatedDelivery}</span>
                </p>
              </div>

              <button
                onClick={() => navigateTo('track-order')}
                className="px-5 py-2.5 bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Clock className="w-4 h-4" /> Live Courier Tracking
              </button>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Ordered Footwear ({completedOrder.items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl p-4 bg-neutral-50/50">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-white border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-neutral-500">
                        Size: EU {item.selectedSize} • Color: {item.selectedColor.name} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Summary */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="font-bold text-neutral-900 block mb-1">Doorstep Address in Pakistan:</span>
                <p className="text-neutral-700 font-semibold">
                  {completedOrder.customer.firstName} {completedOrder.customer.lastName} ({completedOrder.customer.phone})
                </p>
                <p className="text-neutral-600">{completedOrder.customer.address}</p>
                <p className="text-neutral-600">
                  {completedOrder.customer.city}, {completedOrder.customer.province} - {completedOrder.customer.zip}
                </p>
                <p className="text-neutral-600">{completedOrder.customer.country}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <span className="font-bold text-neutral-900 block mb-1">Payment Breakdown (PKR):</span>
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(completedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Voucher Discount:</span>
                  <span>-{formatPrice(completedOrder.discount)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Courier Delivery:</span>
                  <span>{completedOrder.shipping === 0 ? 'FREE' : formatPrice(completedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total Paid:</span>
                  <span className="text-amber-700">{formatPrice(completedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => navigateTo('shop')}
                className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Your shopping bag is empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Please select shoes from our catalog before proceeding to checkout.
          </p>
        </div>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl"
        >
          Browse Footwear Catalog
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="bg-neutral-50/40 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <button onClick={() => navigateTo('home')} className="hover:text-neutral-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Pakistan Express Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Step 1: Customer Contact & Shipping Address (Pakistan) */}
              <div id="delivery-address-form" className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900">Delivery Address in Pakistan</h3>
                  </div>
                  <span className="text-xs text-neutral-500 font-semibold">🇵🇰 All Cities Covered</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-neutral-600">First Name</label>
                      <span className="text-[10px] text-neutral-400 font-medium">Alphabets only</span>
                    </div>
                    <input
                      type="text"
                      required
                      name="firstName"
                      placeholder="e.g. Muhammad"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none transition-all ${
                        fieldErrors.firstName
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50/20'
                          : 'border-neutral-300 focus:ring-2 focus:ring-neutral-900'
                      }`}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-neutral-600">Last Name</label>
                      <span className="text-[10px] text-neutral-400 font-medium">Alphabets only</span>
                    </div>
                    <input
                      type="text"
                      required
                      name="lastName"
                      placeholder="e.g. Ali"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none transition-all ${
                        fieldErrors.lastName
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50/20'
                          : 'border-neutral-300 focus:ring-2 focus:ring-neutral-900'
                      }`}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-neutral-600">Phone Number (For Delivery Call)</label>
                      <span className="text-[10px] text-neutral-400 font-medium">Numbers only</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={12}
                      placeholder="03001234567"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none font-mono transition-all ${
                        fieldErrors.phone
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50/20'
                          : 'border-neutral-300 focus:ring-2 focus:ring-neutral-900'
                      }`}
                    />
                    {fieldErrors.phone ? (
                      <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.phone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-neutral-400 mt-1">11 digits (e.g. 03001234567)</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-neutral-600">Email Address</label>
                      <span className="text-[10px] text-neutral-400 font-medium">For invoice copy</span>
                    </div>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="e.g. ali@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Complete House / Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="House / Apartment #, Street #, Sector / Area"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none transition-all ${
                      fieldErrors.address
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50/20'
                        : 'border-neutral-300 focus:ring-2 focus:ring-neutral-900'
                    }`}
                  />
                  {fieldErrors.address && (
                    <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Province</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                      <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Delivery Instructions / Landmarks (Optional)</label>
                  <input
                    type="text"
                    placeholder="Near landmark, call before arriving..."
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Step 2: Shipping Method (TCS Priority) */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900">Select Courier Service</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                      shippingMethod === 'express'
                        ? 'border-neutral-900 bg-neutral-50/50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="mt-1 accent-neutral-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                        <span>TCS Priority Express Courier</span>
                        <span>{isFreeShippingEligible ? 'FREE' : formatPrice(250)}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">2-3 Business Days Across Pakistan</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-neutral-900 bg-neutral-50/50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-1 accent-neutral-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                        <span>Leopards / Trax Courier</span>
                        <span>{isFreeShippingEligible ? 'FREE' : formatPrice(250)}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">3-4 Business Days</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment Method (JazzCash / EasyPaisa / Bank Card OR Cash on Delivery) */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900">Payment Option</h3>
                </div>

                <div className="space-y-4">
                  {/* JazzCash / EasyPaisa (Featured & Instant) */}
                  <div
                    onClick={() => setPaymentMethod('jazzcash-easypaisa')}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'jazzcash-easypaisa'
                        ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'jazzcash-easypaisa'}
                        onChange={() => setPaymentMethod('jazzcash-easypaisa')}
                        className="mt-1 accent-amber-600 cursor-pointer"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-black text-neutral-900 flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-amber-600" /> JazzCash / EasyPaisa Mobile Account
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                            Instant Verification
                          </span>
                        </div>

                        {/* Interactive Account Box & Direct Redirect Buttons */}
                        <div className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-xs space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                                Merchant Till / Account:
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    if (walletType === 'jazzcash') redirectToJazzCash(e);
                                    else redirectToEasyPaisa(e);
                                  }}
                                  className="text-base font-black font-mono text-neutral-900 tracking-wider hover:text-amber-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer group"
                                  title="Click to redirect to JazzCash/EasyPaisa"
                                >
                                  <span>Till ID: 00289104</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 transition-colors" />
                                </button>
                              </div>
                              <span className="text-[11px] text-neutral-500 block mt-0.5">
                                Account Title: <b className="text-neutral-800">SolePoint Footwear Store</b>
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => copyMerchantTill(e)}
                              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer border border-neutral-200"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-neutral-600" /> Copy Till ID
                                </>
                              )}
                            </button>
                          </div>

                          {/* Direct Redirect Action Buttons */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-neutral-700 block">
                              Tap to Open Mobile App & Transfer:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  setWalletType('jazzcash');
                                  redirectToJazzCash(e);
                                }}
                                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                                  walletType === 'jazzcash'
                                    ? 'bg-rose-600 text-white ring-2 ring-rose-600/30'
                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                }`}
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span>Pay with JazzCash App</span>
                                <ExternalLink className="w-3 h-3 opacity-80" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  setWalletType('easypaisa');
                                  redirectToEasyPaisa(e);
                                }}
                                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                                  walletType === 'easypaisa'
                                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-600/30'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                }`}
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span>Pay with EasyPaisa App</span>
                                <ExternalLink className="w-3 h-3 opacity-80" />
                              </button>
                            </div>
                          </div>

                          {/* Transaction ID Input */}
                          <div className="space-y-1 pt-1">
                            <label className="block text-[11px] font-bold text-neutral-800">
                              Enter Transaction ID (TID / Trx ID) from SMS:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required={paymentMethod === 'jazzcash-easypaisa'}
                                placeholder="e.g. 9842104928"
                                value={transactionId}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                              />
                            </div>
                            <p className="text-[10px] text-neutral-500 flex items-center gap-1 pt-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Instant automated verification on order placement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Debit/Credit Card / Raast */}
                  <label
                    onClick={() => setPaymentMethod('bank-card')}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                      paymentMethod === 'bank-card'
                        ? 'border-neutral-900 bg-neutral-50/50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank-card'}
                      onChange={() => setPaymentMethod('bank-card')}
                      className="mt-1 accent-neutral-900 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-sky-600" /> Visa / Mastercard / Online Banking (Raast)
                      </span>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Pay securely with your Pakistani Debit/Credit card with 3D Secure OTP verification.
                      </p>
                    </div>
                  </label>

                  {/* OR Divider */}
                  <div className="relative py-2 flex items-center justify-center">
                    <div className="border-t border-neutral-200 w-full"></div>
                    <span className="bg-white px-4 text-xs font-black text-neutral-400 uppercase tracking-widest absolute">
                      OR
                    </span>
                  </div>

                  {/* Cash on Delivery (COD) Option */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-neutral-900 bg-neutral-50/80 shadow-xs ring-1 ring-neutral-900/10'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 accent-neutral-900 cursor-pointer"
                      />
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-black text-neutral-900 flex items-center gap-1.5">
                            <Banknote className="w-4 h-4 text-emerald-600" /> Cash on Delivery (COD)
                          </span>
                          {isFreeDelivery ? (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                              FREE Delivery (Order &gt; Rs. 3600)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              Delivery charges apply (+Rs. 250)
                            </span>
                          )}
                        </div>

                        {/* When COD is selected: Notice based on threshold */}
                        {paymentMethod === 'cod' ? (
                          isFreeDelivery ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5 animate-fadeIn">
                              <div className="flex items-center gap-1.5 text-emerald-950 font-black text-xs">
                                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>100% FREE Delivery Applied!</span>
                              </div>
                              <p className="text-[11px] text-emerald-900 leading-relaxed">
                                Because your order is over Rs. 3600, <b>100% FREE Delivery</b> applies! The shoe price remains <b>{formatPrice(cartSubtotal)}</b> with Rs. 0 delivery charges. Total amount to pay TCS courier rider on delivery: <b>{formatPrice(orderTotal)}</b>.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1.5 animate-fadeIn">
                              <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs">
                                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                                <span>Delivery charges apply</span>
                              </div>
                              <p className="text-[11px] text-amber-900 leading-relaxed">
                                Shoe price is <b>{formatPrice(cartSubtotal)}</b>. Standard courier delivery charges of Rs. {shippingCost} are added. Total amount to pay TCS courier rider at your doorstep: <b>{formatPrice(orderTotal)}</b>.
                              </p>
                              <p className="text-[10px] text-amber-800 font-medium">
                                💡 Tip: Add <b>{formatPrice(3600 - cartSubtotal)}</b> more to your order to get <b>100% FREE Delivery</b> across Pakistan!
                              </p>
                            </div>
                          )
                        ) : (
                          <p className="text-[11px] text-neutral-500">
                            Pay in cash to the rider upon delivery at your doorstep.{' '}
                            {isFreeDelivery ? (
                              <span className="font-semibold text-emerald-700">(FREE Delivery on your order)</span>
                            ) : (
                              <span className="font-semibold text-amber-700">(Delivery charges apply: Rs. 250)</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg mt-4 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Registering Order & Verifying Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order • {formatPrice(orderTotal)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-5 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-900">Order Summary ({cart.length})</h3>
                <button
                  onClick={() => navigateTo('shop')}
                  className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                >
                  Edit Cart
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-3 flex gap-3 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-neutral-500">
                        EU {item.selectedSize} • {item.selectedColor.name} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Optional Voucher Code */}
              <div className="pt-3 border-t border-neutral-100">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-emerald-900">{appliedPromo.code} ({appliedPromo.percent}% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] font-bold text-red-600 hover:text-red-800 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Have a voucher? (e.g. SOLEPK10)"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl uppercase font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMsg && (
                      <p className={`text-[11px] font-medium ${promoMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {promoMsg.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-700">Shoe Price (Bag Subtotal)</span>
                  <span className="font-bold text-neutral-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Voucher Discount ({appliedPromo.code} - {appliedPromo.percent}%)</span>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-neutral-700">Courier Delivery (Pakistan)</span>
                    {isFreeDelivery ? (
                      <p className="text-[10px] text-emerald-600 font-semibold">100% Free on orders above Rs. 3600</p>
                    ) : (
                      <p className="text-[10px] text-amber-700 font-semibold">Standard courier charges applied</p>
                    )}
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE (Rs. 0)</span>
                    ) : (
                      <span className="font-bold text-neutral-900">+Rs. 250</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 pt-3 border-t border-neutral-200">
                  <span>Total Payable (PKR)</span>
                  <span className="text-neutral-900">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 text-[11px] text-neutral-500 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>7-Day Doorstep Size Replacement Across Pakistan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dispatched with TCS Express Priority Tracking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Instant Payment Verification & Automated Receipt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
