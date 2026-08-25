import { OrderDetails } from '../types';

/**
 * Plays a clean, pleasant multi-tone chime for incoming orders using Web Audio API.
 * Does not require external audio files or permissions.
 */
export const playOrderNotificationSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Two-tone celebratory chime: E5 (659Hz) -> G#5 (830Hz) -> B5 (987Hz) -> E6 (1318Hz)
    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  } catch (e) {
    console.error('Audio chime error:', e);
  }
};

/**
 * Formats a comprehensive WhatsApp message containing all customer and shoe order details.
 */
export const formatOrderWhatsAppMessage = (order: OrderDetails): string => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `   ${idx + 1}. *${item.product.name}*\n` +
        `      • Size: EU ${item.selectedSize} | Color: ${item.selectedColor.name}\n` +
        `      • Qty: ${item.quantity} x Rs. ${item.product.price.toLocaleString()} = Rs. ${(
          item.product.price * item.quantity
        ).toLocaleString()}`
    )
    .join('\n\n');

  const paymentLabel =
    order.paymentMethod === 'cod'
      ? 'Cash on Delivery (COD)'
      : order.paymentMethod === 'jazzcash-easypaisa'
      ? `JazzCash / EasyPaisa (TID: ${order.transactionId || 'Pending'})`
      : 'Online Bank Card';

  const deliveryLabel =
    order.shipping === 0 ? 'FREE Delivery (Order > Rs. 3600)' : `Rs. ${order.shipping} (Standard Courier)`;

  return (
    `🛍️ *NEW ORDER NOTIFICATION - SOLEPOINT PAKISTAN*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Order ID:* ${order.orderId}\n` +
    `📅 *Date:* ${order.date}\n\n` +
    `👤 *CUSTOMER DETAILS:*\n` +
    `• *Name:* ${order.customer.firstName} ${order.customer.lastName}\n` +
    `• *Phone / WhatsApp:* ${order.customer.phone}\n` +
    `• *Email:* ${order.customer.email}\n` +
    `• *Address:* ${order.customer.address}\n` +
    `• *City / Province:* ${order.customer.city}, ${order.customer.province} (${order.customer.zip})\n` +
    (order.customer.notes ? `• *Customer Note:* ${order.customer.notes}\n` : '') +
    `\n👟 *PURCHASED SHOES (${order.items.reduce((s, i) => s + i.quantity, 0)} items):*\n` +
    `${itemsText}\n\n` +
    `💰 *PAYMENT & BILLING SUMMARY:*\n` +
    `• *Shoe Subtotal:* Rs. ${order.subtotal.toLocaleString()}\n` +
    (order.discount > 0 ? `• *Discount Applied:* -Rs. ${order.discount.toLocaleString()}\n` : '') +
    `• *Courier Delivery:* ${deliveryLabel}\n` +
    `• *FINAL TOTAL PAYABLE:* *Rs. ${order.total.toLocaleString()} PKR*\n` +
    `• *Payment Mode:* *${paymentLabel}*\n` +
    `• *Courier Assigned:* ${order.courierName || 'TCS Express Pakistan'}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `✨ _Automated Store Notification from SolePoint Website_`
  );
};

/**
 * Creates a direct WhatsApp link for sending order notification to the store owner or support.
 */
export const getStoreWhatsAppOrderUrl = (order: OrderDetails, storeNumber?: string): string => {
  const message = formatOrderWhatsAppMessage(order);
  if (storeNumber) {
    const cleanNumber = storeNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
};

/**
 * Formats a friendly confirmation message for the merchant to send directly to the customer.
 */
export const getCustomerWhatsAppChatUrl = (order: OrderDetails): string => {
  const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
  // Format to international 92 if starts with 03
  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith('03')) {
    formattedPhone = '92' + formattedPhone.slice(1);
  } else if (formattedPhone.startsWith('3')) {
    formattedPhone = '92' + formattedPhone;
  }

  const itemsList = order.items
    .map((i) => `• ${i.product.name} (Size EU ${i.selectedSize}, ${i.selectedColor.name}) x ${i.quantity}`)
    .join('\n');

  const text =
    `Salam *${order.customer.firstName}*! 👋\n\n` +
    `Thank you for ordering with *SolePoint Pakistan*! 👟\n` +
    `We have received your order *${order.orderId}*.\n\n` +
    `*Your Order Details:*\n` +
    `${itemsList}\n\n` +
    `*Total Payable:* Rs. ${order.total.toLocaleString()} PKR (${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'})\n` +
    `*Delivery Address:* ${order.customer.address}, ${order.customer.city}\n\n` +
    `Your parcel is being inspected by our master shoemakers and will be dispatched via TCS Express shortly. 📦✨`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Formats a WhatsApp message specifically for order cancellation notifications.
 */
export const formatOrderCancellationWhatsAppMessage = (order: OrderDetails, reason?: string): string => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `   ${idx + 1}. *${item.product.name}*\n` +
        `      • Size: EU ${item.selectedSize} | Color: ${item.selectedColor.name}\n` +
        `      • Qty: ${item.quantity} x Rs. ${item.product.price.toLocaleString()} = Rs. ${(
          item.product.price * item.quantity
        ).toLocaleString()}`
    )
    .join('\n\n');

  const nowStr = new Date().toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  });

  return (
    `⚠️ *ORDER CANCELLED - SOLEPOINT PAKISTAN*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `❌ *STATUS:* CANCELLED BY CUSTOMER (Within 3-Hour Window)\n` +
    `📋 *Order ID:* ${order.orderId}\n` +
    `⏰ *Cancellation Time:* ${nowStr}\n` +
    `❓ *Reason:* ${reason || 'Customer requested immediate cancellation'}\n\n` +
    `👤 *CUSTOMER WHO CANCELLED:*\n` +
    `• *Name:* ${order.customer.firstName} ${order.customer.lastName}\n` +
    `• *Phone / WhatsApp:* ${order.customer.phone}\n` +
    `• *Email:* ${order.customer.email}\n` +
    `• *Address:* ${order.customer.address}, ${order.customer.city} (${order.customer.province})\n\n` +
    `👟 *CANCELLED ITEMS (${order.items.reduce((s, i) => s + i.quantity, 0)} pairs):*\n` +
    `${itemsText}\n\n` +
    `💰 *CANCELLED ORDER TOTAL:* *Rs. ${order.total.toLocaleString()} PKR*\n` +
    `• *Payment Method:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / JazzCash'}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `⚠️ _Please do not process or dispatch this parcel with TCS Courier._`
  );
};

/**
 * Creates a direct WhatsApp link to inform the store owner that an order was cancelled.
 */
export const getStoreWhatsAppCancellationUrl = (
  order: OrderDetails,
  reason?: string,
  storeNumber?: string
): string => {
  const message = formatOrderCancellationWhatsAppMessage(order, reason);
  if (storeNumber) {
    const cleanNumber = storeNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
};

/**
 * Calculates whether an order can be cancelled (within 3 hours of placement).
 * Returns { canCancel: boolean, remainingMinutes: number, remainingHours: number, remainingSeconds: number }
 */
export const getOrderCancellationStatus = (order: OrderDetails) => {
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
  // If placedAtTimestamp is not present, use order.date or default to 3 hours from now minus 10 mins
  const placedTime = order.placedAtTimestamp || new Date().getTime() - 10 * 60 * 1000;
  const elapsed = Date.now() - placedTime;
  const remainingMs = Math.max(0, THREE_HOURS_MS - elapsed);

  const canCancel = order.status !== 'Cancelled' && order.status !== 'Delivered' && remainingMs > 0;
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    canCancel,
    isCancelled: order.status === 'Cancelled',
    remainingMs,
    hours,
    minutes,
    seconds,
    formattedRemaining: `${hours}h ${minutes}m ${seconds}s`,
  };
};

