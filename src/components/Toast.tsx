import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-neutral-900 text-white rounded-xl p-3.5 shadow-2xl border border-neutral-800 flex items-start gap-3 relative overflow-hidden"
          >
            {toast.image ? (
              <img
                src={toast.image}
                alt="Product"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover bg-neutral-800 shrink-0 border border-neutral-700"
              />
            ) : (
              <div className="p-1.5 rounded-lg bg-neutral-800 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
                {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400" />}
              </div>
            )}

            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">{toast.title}</h4>
              <p className="text-sm font-medium text-neutral-100 line-clamp-2 mt-0.5">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white p-1 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
