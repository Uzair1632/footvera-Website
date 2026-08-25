import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderDetails } from '../types';
import {
  formatOrderWhatsAppMessage,
  getCustomerWhatsAppChatUrl,
  getStoreWhatsAppOrderUrl,
  getStoreWhatsAppCancellationUrl,
  formatOrderCancellationWhatsAppMessage,
} from '../utils/orderNotification';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Download,
  Printer,
  Trash2,
  Edit3,
  Phone,
  MessageCircle,
  Send,
  User,
  MapPin,
  CreditCard,
  Banknote,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Unlock,
  PlusCircle,
  Eye,
  EyeOff,
  Key,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPortalPage: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    seedSampleOrders,
    clearOrders,
    navigateTo,
    formatPrice,
    showToast,
  } = useShop();

  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('footvera_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Interactive UI states
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<OrderDetails | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderDetails | null>(null);
  const [adminCancelReason, setAdminCancelReason] = useState('Out of stock / leather unavailable');
  const [adminCancelNote, setAdminCancelNote] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Status edit form fields
  const [editStatus, setEditStatus] = useState<OrderDetails['status']>('Order Placed');
  const [editCourier, setEditCourier] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDeliveryDate, setEditDeliveryDate] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isUserValid = adminUsername.trim().toLowerCase() === 'footvera';
    const isPassValid = adminPassword === 'Footvera12@#@#';

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('footvera_admin_auth', 'true');
      setAuthError('');
      showToast('Admin Access Granted', 'Welcome back, FootVera Store Admin.', 'success');
    } else {
      setAuthError('Invalid Username or Password. Please enter the correct credentials.');
    }
  };

  const handleQuickUnlock = () => {
    setAdminUsername('FootVera');
    setAdminPassword('Footvera12@#@#');
    setIsAuthenticated(true);
    sessionStorage.setItem('footvera_admin_auth', 'true');
    setAuthError('');
    showToast('Admin Access Granted', 'Logged in as FootVera Store Admin.', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('footvera_admin_auth');
    showToast('Logged Out', 'Admin session ended safely.', 'info');
  };

  // Distinct cities list from current orders
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.customer?.city) set.add(o.customer.city);
    });
    return Array.from(set).sort();
  }, [orders]);

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status Filter
      if (statusFilter === 'cancelled' && o.status !== 'Cancelled') return false;
      if (statusFilter === 'active' && (o.status === 'Cancelled' || o.status === 'Delivered')) return false;
      if (statusFilter === 'dispatched' && o.status !== 'Dispatched with Courier' && o.status !== 'Out for Delivery') return false;
      if (statusFilter === 'delivered' && o.status !== 'Delivered') return false;
      if (statusFilter === 'pending' && o.status !== 'Order Placed' && o.status !== 'Under Quality Check') return false;

      // City Filter
      if (cityFilter !== 'all' && o.customer?.city?.toLowerCase() !== cityFilter.toLowerCase()) return false;

      // Payment Filter
      if (paymentFilter !== 'all' && o.paymentMethod !== paymentFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = o.orderId.toLowerCase().includes(q);
        const matchName = `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(q);
        const matchPhone = o.customer?.phone?.toLowerCase().includes(q);
        const matchCity = o.customer?.city?.toLowerCase().includes(q);
        const matchTracking = o.trackingNumber?.toLowerCase().includes(q);
        const matchItems = o.items.some((i) => i.product.name.toLowerCase().includes(q));
        if (!matchId && !matchName && !matchPhone && !matchCity && !matchTracking && !matchItems) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.placedAtTimestamp || 0) - (a.placedAtTimestamp || 0);
      if (sortBy === 'oldest') return (a.placedAtTimestamp || 0) - (b.placedAtTimestamp || 0);
      if (sortBy === 'highest') return b.total - a.total;
      if (sortBy === 'lowest') return a.total - b.total;
      return 0;
    });
  }, [orders, statusFilter, cityFilter, paymentFilter, searchQuery, sortBy]);

  // Executive Metrics
  const metrics = useMemo(() => {
    const totalCount = orders.length;
    const activeOrders = orders.filter((o) => o.status !== 'Cancelled' && o.status !== 'Delivered');
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
    const dispatchedOrders = orders.filter((o) => o.status === 'Dispatched with Courier' || o.status === 'Out for Delivery');

    const totalGrossRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const cancelledValue = cancelledOrders.reduce((sum, o) => sum + o.total, 0);
    const codOrdersCount = orders.filter((o) => o.paymentMethod === 'cod').length;
    const prepaidOrdersCount = orders.filter((o) => o.paymentMethod !== 'cod').length;

    return {
      totalCount,
      activeCount: activeOrders.length,
      cancelledCount: cancelledOrders.length,
      deliveredCount: deliveredOrders.length,
      dispatchedCount: dispatchedOrders.length,
      totalGrossRevenue,
      cancelledValue,
      codOrdersCount,
      prepaidOrdersCount,
      avgOrderValue: totalCount > 0 ? Math.round(totalGrossRevenue / Math.max(1, totalCount - cancelledOrders.length)) : 0,
    };
  }, [orders]);

  const handleStartEdit = (order: OrderDetails) => {
    setEditingOrderId(order.orderId);
    setEditStatus(order.status);
    setEditCourier(order.courierName || 'TCS Express Pakistan');
    setEditTracking(order.trackingNumber || '');
    setEditLocation(order.currentLocation || '');
    setEditDeliveryDate(order.estimatedDelivery || '');
  };

  const handleSaveStatus = (orderId: string) => {
    updateOrderStatus(orderId, editStatus, {
      courierName: editCourier,
      trackingNumber: editTracking,
      currentLocation: editLocation,
      estimatedDelivery: editDeliveryDate,
    });
    setEditingOrderId(null);
  };

  const handleOpenCancelModal = (order: OrderDetails) => {
    setCancelModalOrder(order);
    setAdminCancelReason('Out of stock / leather size unavailable');
    setAdminCancelNote('');
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    const finalReason = adminCancelNote.trim()
      ? `${adminCancelReason} - ${adminCancelNote.trim()}`
      : adminCancelReason;

    updateOrderStatus(cancelModalOrder.orderId, 'Cancelled', {
      cancellationReason: `Cancelled by Admin: ${finalReason}`,
      currentLocation: 'Order Cancelled - Warehouse Dispatch Halted',
    });
    setCancelModalOrder(null);
  };

  const handleCopyCourierDetails = (order: OrderDetails) => {
    const text =
      `📦 TCS / LEOPARDS BOOKING DETAILS:\n` +
      `Consignee: ${order.customer.firstName} ${order.customer.lastName}\n` +
      `Phone: ${order.customer.phone}\n` +
      `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.province}\n` +
      `COD Amount: Rs. ${order.paymentMethod === 'cod' ? order.total.toLocaleString() : '0 (PREPAID)'}\n` +
      `Items: ${order.items.map((i) => `${i.product.name} (EU ${i.selectedSize}, ${i.selectedColor.name}) x ${i.quantity}`).join('; ')}\n` +
      `Special Note: ${order.customer.notes || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.orderId);
    showToast('Courier Details Copied', 'Address & COD info copied for courier portal booking.', 'success');
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No Orders to Export', 'Please load or create orders first.', 'warning');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'City',
      'Province',
      'Payment Method',
      'Status',
      'Cancellation Reason',
      'Subtotal (PKR)',
      'Discount (PKR)',
      'Shipping (PKR)',
      'Total (PKR)',
      'Courier',
      'Tracking Number',
      'Items Purchased',
    ];

    const rows = orders.map((o) => [
      `"${o.orderId}"`,
      `"${o.date}"`,
      `"${o.customer.firstName} ${o.customer.lastName}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.email}"`,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      `"${o.customer.city}"`,
      `"${o.customer.province}"`,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      `"${(o.cancellationReason || '').replace(/"/g, '""')}"`,
      o.subtotal,
      o.discount,
      o.shipping,
      o.total,
      `"${o.courierName || ''}"`,
      `"${o.trackingNumber || ''}"`,
      `"${o.items.map((i) => `${i.product.name} (Size ${i.selectedSize}, ${i.selectedColor.name}) x${i.quantity}`).join(' | ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FootVera_Pakistan_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Orders report downloaded successfully.', 'success');
  };

  // 1. Password Guard / Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-neutral-950 text-white flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">FootVera Admin Portal</h2>
            <p className="text-xs text-neutral-400">
              Store Owner & Logistics Management Console for Pakistan Footwear Operations
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>Admin Username</span>
                <span className="text-[10px] text-neutral-500 lowercase font-normal">e.g. FootVera</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Enter Username (FootVera)"
                  className="w-full px-4 py-3 pl-10 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  autoFocus
                  autoComplete="username"
                />
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>Admin Password</span>
                <span className="text-[10px] text-neutral-500 font-normal">Case-sensitive</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 pl-10 pr-10 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-xs font-bold text-red-400 pt-1">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Log In to Admin Portal
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 text-left text-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                Store Credentials Reference:
              </span>
              <div className="flex items-center justify-between text-neutral-300 text-[11px]">
                <span>Username: <strong className="text-white font-mono">FootVera</strong></span>
                <span>Password: <strong className="text-white font-mono">Footvera12@#@#</strong></span>
              </div>
            </div>

            <button
              onClick={handleQuickUnlock}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>⚡ 1-Click Auto-Fill & Log In</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
            >
              ← Return to FootVera Customer Store
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-20">
      {/* 1. Admin Top Bar */}
      <div className="bg-neutral-900 text-white border-b border-neutral-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 font-black flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">FootVera Admin Portal</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Pakistan Fulfillment • TCS / Leopards Courier Management • Customer Orders
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={seedSampleOrders}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Load full test dataset with active and cancelled orders"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Sample Orders</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Storefront
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 2. Executive Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Orders */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
              <span>Total Orders</span>
              <Package className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-black text-neutral-900">{metrics.totalCount}</div>
            <p className="text-[10px] text-neutral-500">All registered customer orders</p>
          </div>

          {/* Gross Revenue */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
              <span>Active Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-700">{formatPrice(metrics.totalGrossRevenue)}</div>
            <p className="text-[10px] text-emerald-800 font-semibold">Excludes cancelled orders</p>
          </div>

          {/* Active / In-Progress */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
              <span>In-Progress</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700">{metrics.activeCount}</div>
            <p className="text-[10px] text-amber-800 font-semibold">Quality check & packing</p>
          </div>

          {/* Dispatched */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
              <span>Dispatched</span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-700">{metrics.dispatchedCount}</div>
            <p className="text-[10px] text-blue-800 font-semibold">TCS / Leopards in transit</p>
          </div>

          {/* Delivered */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-purple-700 text-xs font-bold">
              <span>Delivered</span>
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700">{metrics.deliveredCount}</div>
            <p className="text-[10px] text-purple-800 font-semibold">COD collected</p>
          </div>

          {/* CANCELLED ORDERS (High Priority Focus) */}
          <div
            onClick={() => setStatusFilter('cancelled')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
              statusFilter === 'cancelled'
                ? 'bg-rose-50 border-rose-500 shadow-md'
                : 'bg-white border-rose-200 hover:border-rose-400 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
              </span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-700">{metrics.cancelledCount}</div>
            <p className="text-[10px] text-rose-800 font-bold">
              {metrics.cancelledCount > 0 ? `Rs. ${metrics.cancelledValue.toLocaleString()} Halted` : '0 Cancelled'}
            </p>
          </div>
        </div>

        {/* 3. Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200 shadow-xs space-y-4">
          {/* Status Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>All Orders</span>
              <span className="px-1.5 py-0.2 rounded-full bg-neutral-200/50 text-[10px]">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>Pending & Prep</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px]">
                {orders.filter((o) => o.status === 'Order Placed' || o.status === 'Under Quality Check').length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('dispatched')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'dispatched'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>Dispatched</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 text-[10px]">
                {metrics.dispatchedCount}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'delivered'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>Delivered</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 text-[10px]">
                {metrics.deliveredCount}
              </span>
            </button>

            {/* DEDICATED CANCELLED ORDERS TAB */}
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                statusFilter === 'cancelled'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cancelled Orders</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-900 text-[10px] font-black">
                {metrics.cancelledCount}
              </span>
            </button>
          </div>

          {/* Filter Dropdowns & Search Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-neutral-100">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Order ID, Name, Phone, City..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-neutral-500 shrink-0">City:</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="all">All Cities in Pakistan</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-neutral-500 shrink-0">Payment:</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="all">All Payment Methods</option>
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="jazzcash-easypaisa">JazzCash / EasyPaisa</option>
                <option value="bank-card">Online Bank Card</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-neutral-500 shrink-0">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="newest">Newest Orders First</option>
                <option value="oldest">Oldest Orders First</option>
                <option value="highest">Highest Amount (PKR)</option>
                <option value="lowest">Lowest Amount (PKR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Orders List Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-700">
              Orders Feed ({filteredOrders.length} {filteredOrders.length === 1 ? 'record' : 'records'})
            </h3>
            {statusFilter === 'cancelled' && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                Viewing Cancelled Orders & Reason Dossiers
              </span>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-neutral-900">No Orders Matched Your Filter</h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Try adjusting your search criteria or load sample demonstration data to see active & cancelled order records.
                </p>
              </div>
              <button
                onClick={seedSampleOrders}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Load Sample Orders
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isCancelled = order.status === 'Cancelled';
              const isExpanded = expandedOrderId === order.orderId;
              const isEditing = editingOrderId === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs ${
                    isCancelled
                      ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {/* Order Summary Header Bar */}
                  <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                        className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                        title="Toggle full details"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-black text-neutral-900">{order.orderId}</span>
                          <span className="text-[11px] text-neutral-500">• {order.date}</span>

                          {/* Status Pill */}
                          {isCancelled ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-black flex items-center gap-1 border border-rose-300">
                              <XCircle className="w-3.5 h-3.5" /> CANCELLED
                            </span>
                          ) : order.status === 'Delivered' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                            </span>
                          ) : order.status === 'Dispatched with Courier' || order.status === 'Out for Delivery' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5" /> {order.status}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {order.status}
                            </span>
                          )}

                          {/* Payment Method Badge */}
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-bold">
                            {order.paymentMethod === 'cod'
                              ? '💵 Cash on Delivery'
                              : order.paymentMethod === 'jazzcash-easypaisa'
                              ? '📱 JazzCash / EasyPaisa'
                              : '💳 Bank Card'}
                          </span>
                        </div>

                        {/* Customer Quick Line */}
                        <p className="text-xs text-neutral-600">
                          Customer: <b className="text-neutral-900">{order.customer.firstName} {order.customer.lastName}</b> ({order.customer.phone}) • {order.customer.city}
                        </p>
                      </div>
                    </div>

                    {/* Right side amount & top actions */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-base sm:text-lg font-black ${isCancelled ? 'text-neutral-400 line-through' : 'text-neutral-950'}`}>
                          {formatPrice(order.total)}
                        </div>
                        <span className="text-[10px] text-neutral-500 block">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                          title="Print Thermal Slip / Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleStartEdit(order)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                          title="Update Status / Tracking"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CANCELLATION DOSSIER BANNER (If Cancelled) */}
                  {isCancelled && (
                    <div className="bg-rose-50 border-b border-rose-200 p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Order Cancelled Dossier</span>
                            {order.cancelledAt && (
                              <span className="text-[11px] font-normal text-rose-700">
                                • Cancelled on {order.cancelledAt}
                              </span>
                            )}
                          </div>
                          <div className="bg-white/80 rounded-xl p-3 border border-rose-200 text-xs text-rose-900 space-y-1">
                            <p className="font-bold">
                              Cancellation Reason:
                            </p>
                            <p className="italic text-neutral-800">
                              "{order.cancellationReason || 'Order cancelled per customer request'}"
                            </p>
                          </div>
                        </div>

                        {/* Reinstate Button if Needed */}
                        <button
                          onClick={() => {
                            updateOrderStatus(order.orderId, 'Order Placed', {
                              cancellationReason: undefined,
                            });
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
                          title="Customer changed mind or error - reactivate order"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reinstate Order
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Status & Logistics Editor (When Admin clicks Edit) */}
                  {isEditing && (
                    <div className="p-4 sm:p-5 bg-amber-50/50 border-b border-amber-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4" /> Edit Order #{order.orderId} Status & Logistics
                        </h4>
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        {/* Status Select */}
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Order Status</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 focus:ring-2 focus:ring-neutral-900"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Under Quality Check">Under Quality Check</option>
                            <option value="Dispatched with Courier">Dispatched with Courier</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Courier Partner */}
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Courier Partner</label>
                          <select
                            value={editCourier}
                            onChange={(e) => setEditCourier(e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 focus:ring-2 focus:ring-neutral-900"
                          >
                            <option value="TCS Express Pakistan">TCS Express Pakistan</option>
                            <option value="Leopards Courier Express">Leopards Courier Express</option>
                            <option value="Trax Logistics">Trax Logistics</option>
                            <option value="M&P Express Logistics">M&P Express Logistics</option>
                            <option value="Call Courier Pakistan">Call Courier Pakistan</option>
                          </select>
                        </div>

                        {/* Tracking Number */}
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Tracking Number / AWB</label>
                          <input
                            type="text"
                            value={editTracking}
                            onChange={(e) => setEditTracking(e.target.value)}
                            placeholder="e.g. TCS-982401928"
                            className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-neutral-900"
                          />
                        </div>

                        {/* Estimated Delivery */}
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Estimated Delivery Date</label>
                          <input
                            type="text"
                            value={editDeliveryDate}
                            onChange={(e) => setEditDeliveryDate(e.target.value)}
                            placeholder="e.g. Aug 24, 2026"
                            className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleSaveStatus(order.orderId)}
                          className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          Save & Update Tracking
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Main Details Grid */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Column 1: Customer Dossier */}
                      <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-neutral-600" /> Customer Information
                          </span>

                          <div className="flex items-center gap-1">
                            <a
                              href={getCustomerWhatsAppChatUrl(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </a>
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <Phone className="w-3 h-3" /> Call
                            </a>
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          <p className="font-bold text-neutral-900 text-sm">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="font-mono text-neutral-700">📞 {order.customer.phone}</p>
                          <p className="text-neutral-600">✉️ {order.customer.email}</p>
                        </div>

                        <div className="pt-2 border-t border-neutral-200/70 space-y-1">
                          <div className="flex items-start gap-1.5 text-neutral-700">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-neutral-900">{order.customer.address}</p>
                              <p className="text-neutral-600">
                                {order.customer.city}, {order.customer.province} ({order.customer.zip})
                              </p>
                            </div>
                          </div>

                          {order.customer.notes && (
                            <div className="bg-amber-50 rounded-lg p-2 border border-amber-200 text-[11px] text-amber-900 italic mt-1">
                              <b>Customer Special Note:</b> "{order.customer.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 2: Purchased Shoes Line Items */}
                      <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 space-y-2.5 text-xs lg:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-neutral-600" /> Purchased Footwear Items ({order.items.length})
                          </span>

                          <span className="text-[11px] font-bold text-neutral-600">
                            Subtotal: {formatPrice(order.subtotal)}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-neutral-200 shadow-2xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <h5 className="font-bold text-neutral-900 text-xs truncate">
                                    {item.product.name}
                                  </h5>
                                  <div className="flex items-center gap-2 text-[11px] text-neutral-600 flex-wrap">
                                    <span>Size: <b className="text-neutral-900 font-mono">EU {item.selectedSize}</b></span>
                                    <span>•</span>
                                    <span>Color: <b className="text-neutral-900">{item.selectedColor.name}</b></span>
                                    <span>•</span>
                                    <span>Qty: <b className="text-neutral-900 font-mono">{item.quantity}</b></span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-black text-xs text-neutral-900">
                                  {formatPrice(item.product.price * item.quantity)}
                                </span>
                                <span className="block text-[10px] text-neutral-500">
                                  Rs. {item.product.price.toLocaleString()} ea
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Billing Breakdown Footer */}
                        <div className="pt-2 border-t border-neutral-200/70 flex flex-wrap items-center justify-between text-[11px] text-neutral-600 gap-2">
                          <div>
                            Payment: <b className="text-neutral-900 uppercase font-mono">{order.paymentMethod}</b>
                            {order.transactionId && ` (TID: ${order.transactionId})`}
                          </div>
                          <div className="flex items-center gap-3">
                            {order.discount > 0 && (
                              <span className="text-emerald-700 font-bold">Discount: -{formatPrice(order.discount)}</span>
                            )}
                            <span>Delivery: <b className="text-neutral-900">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</b></span>
                            <span className="text-xs font-black text-neutral-900">
                              Payable: {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logistics & Tracking Strip */}
                    <div className="bg-neutral-900 text-white rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <Truck className="w-4 h-4" />
                          <span>{order.courierName || 'TCS Express Pakistan'}</span>
                        </div>

                        <div className="text-neutral-300">
                          Tracking: <span className="font-mono font-bold text-white">{order.trackingNumber || 'Pending Assignment'}</span>
                        </div>

                        <div className="text-neutral-400">
                          ETA: <span className="text-neutral-200 font-semibold">{order.estimatedDelivery || '2-3 Business Days'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Copy for Courier Booking */}
                        <button
                          onClick={() => handleCopyCourierDetails(order)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedOrderId === order.orderId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Booking Info!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Courier Booking Slip
                            </>
                          )}
                        </button>

                        {/* Customer Tracking Live Link */}
                        <button
                          onClick={() => navigateTo('track-order')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Customer Tracking View
                        </button>
                      </div>
                    </div>

                    {/* Bottom Admin Control Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-neutral-100">
                      {/* Left: Quick Status Advance */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-neutral-500 text-[11px]">Quick Status:</span>

                        {!isCancelled && (
                          <>
                            {order.status === 'Order Placed' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'Under Quality Check')}
                                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors cursor-pointer"
                              >
                                → Quality Check
                              </button>
                            )}

                            {order.status === 'Under Quality Check' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'Dispatched with Courier', {
                                  courierName: 'TCS Express Pakistan',
                                  trackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
                                  estimatedDelivery: 'In 2 Days',
                                })}
                                className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold transition-colors cursor-pointer"
                              >
                                → Dispatch via TCS
                              </button>
                            )}

                            {order.status === 'Dispatched with Courier' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'Out for Delivery')}
                                className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold transition-colors cursor-pointer"
                              >
                                → Out for Delivery
                              </button>
                            )}

                            {order.status === 'Out for Delivery' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'Delivered')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold transition-colors cursor-pointer"
                              >
                                ✓ Mark Delivered & COD Collected
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Right: Cancellation and Deletion */}
                      <div className="flex items-center gap-2">
                        {!isCancelled ? (
                          <button
                            onClick={() => handleOpenCancelModal(order)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel Order
                          </button>
                        ) : (
                          <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Cancellation Dossier Preserved
                          </span>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete order #${order.orderId}?`)) {
                              deleteOrder(order.orderId);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Printable Invoice / Thermal Packing Slip Modal */}
      <AnimatePresence>
        {invoiceOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-neutral-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Modal Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-black text-neutral-900">Official Store Packing Invoice</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Invoice
                  </button>
                  <button
                    onClick={() => setInvoiceOrder(null)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Sheet Body */}
              <div className="space-y-6 text-xs" id="printable-invoice">
                {/* Header with Logo */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-neutral-950 uppercase">
                      FootVera Pakistan
                    </h2>
                    <p className="text-neutral-500">Pure Genuine Leather Footwear & Chappals</p>
                    <p className="text-neutral-500">Lahore • Karachi • Islamabad • Peshawar</p>
                    <p className="text-[10px] text-neutral-400">NTN / Tax Reg: PK-98410294</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-black text-neutral-900 block">{invoiceOrder.orderId}</span>
                    <span className="text-neutral-500 block">{invoiceOrder.date}</span>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-neutral-100 font-bold text-[10px] text-neutral-800 uppercase">
                      Payment: {invoiceOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Customer Address Details */}
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <h5 className="font-black text-neutral-900 uppercase text-[10px] tracking-wider mb-1">
                      Deliver To (Consignee)
                    </h5>
                    <p className="font-bold text-neutral-900">
                      {invoiceOrder.customer.firstName} {invoiceOrder.customer.lastName}
                    </p>
                    <p className="text-neutral-700">{invoiceOrder.customer.address}</p>
                    <p className="text-neutral-700 font-bold">
                      {invoiceOrder.customer.city}, {invoiceOrder.customer.province} ({invoiceOrder.customer.zip})
                    </p>
                    <p className="text-neutral-900 font-mono mt-1">📞 {invoiceOrder.customer.phone}</p>
                  </div>

                  <div>
                    <h5 className="font-black text-neutral-900 uppercase text-[10px] tracking-wider mb-1">
                      Courier Booking Info
                    </h5>
                    <p className="text-neutral-700"><b>Carrier:</b> {invoiceOrder.courierName || 'TCS Express Pakistan'}</p>
                    <p className="text-neutral-700"><b>Tracking ID:</b> <span className="font-mono">{invoiceOrder.trackingNumber || 'Assigned on Dispatch'}</span></p>
                    <p className="text-neutral-700"><b>Status:</b> {invoiceOrder.status}</p>
                    {invoiceOrder.customer.notes && (
                      <p className="text-amber-800 italic mt-1"><b>Special Note:</b> {invoiceOrder.customer.notes}</p>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-900 text-white text-[10px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5">Size / Color</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {invoiceOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="p-2.5 font-bold text-neutral-900">{item.product.name}</td>
                          <td className="p-2.5 text-neutral-600">EU {item.selectedSize} • {item.selectedColor.name}</td>
                          <td className="p-2.5 text-center font-mono font-bold">{item.quantity}</td>
                          <td className="p-2.5 text-right text-neutral-700">{formatPrice(item.product.price)}</td>
                          <td className="p-2.5 text-right font-black text-neutral-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-1.5 text-right bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal:</span>
                      <span>{formatPrice(invoiceOrder.subtotal)}</span>
                    </div>
                    {invoiceOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Discount:</span>
                        <span>-{formatPrice(invoiceOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600">
                      <span>Delivery Shipping:</span>
                      <span>{invoiceOrder.shipping === 0 ? 'FREE' : formatPrice(invoiceOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-200">
                      <span>Total Amount:</span>
                      <span>{formatPrice(invoiceOrder.total)}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase pt-1">
                      {invoiceOrder.paymentMethod === 'cod'
                        ? 'Collect Rs. ' + invoiceOrder.total.toLocaleString() + ' on Delivery'
                        : 'Prepaid in Full'}
                    </div>
                  </div>
                </div>

                {/* Signature & Return Policy Notice */}
                <div className="pt-4 border-t border-neutral-200 text-[10px] text-neutral-500 flex justify-between items-center">
                  <p>Thank you for choosing FootVera Pakistan • 7-Day Size Exchange Guarantee</p>
                  <div className="text-right">
                    <p className="border-t border-neutral-400 pt-1 font-bold">Authorized Merchant Signature</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Admin Cancellation Modal */}
      <AnimatePresence>
        {cancelModalOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-700">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-neutral-900">
                    Cancel Order #{cancelModalOrder.orderId}
                  </h4>
                  <p className="text-xs text-neutral-500">Record formal cancellation reason in store archive</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Primary Cancellation Reason</label>
                  <select
                    value={adminCancelReason}
                    onChange={(e) => setAdminCancelReason(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-semibold text-neutral-800 focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="Customer requested cancellation on WhatsApp/Call">
                      Customer requested cancellation on WhatsApp/Call
                    </option>
                    <option value="Requested shoe size/color out of stock">
                      Requested shoe size/color out of stock
                    </option>
                    <option value="Duplicate order entry / customer re-ordered">
                      Duplicate order entry / customer re-ordered
                    </option>
                    <option value="Customer unreachable on phone number verification">
                      Customer unreachable on phone number verification
                    </option>
                    <option value="Delivery address outside courier serviceable coverage">
                      Delivery address outside courier serviceable coverage
                    </option>
                    <option value="Payment verification failed / transaction cancelled">
                      Payment verification failed / transaction cancelled
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Additional Internal Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={adminCancelNote}
                    onChange={(e) => setAdminCancelNote(e.target.value)}
                    placeholder="e.g. Spoke to customer via phone call at 3:15 PM..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Halt Dispatch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
