import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/api.js';
import socket from '../services/socket.js';

const STATUS_LABELS = {
  pending:          '⏳ Pending',
  accepted:         '✅ Accepted',
  preparing:        '👨‍🍳 Preparing',
  out_for_delivery: '🛵 Out for Delivery',
  delivered:        '🎉 Delivered',
  cancelled:        '❌ Cancelled',
};

export default function OrderSuccess() {
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order || null);

  // Keep status in sync with the admin dashboard: refresh once on load
  // (in case it changed before this page connected) and then listen live.
  useEffect(() => {
    if (!order?.orderId) return;

    fetchOrderById(order.orderId)
      .then((res) => setOrder((prev) => ({ ...prev, ...res.data })))
      .catch(() => {});

    socket.connect();
    const handleUpdate = (updated) => {
      if (updated.orderId === order.orderId) {
        setOrder((prev) => ({ ...prev, ...updated }));
      }
    };
    socket.on('orderAccepted', handleUpdate);
    socket.on('orderCancelled', handleUpdate);
    socket.on('orderUpdated', handleUpdate);

    return () => {
      socket.off('orderAccepted', handleUpdate);
      socket.off('orderCancelled', handleUpdate);
      socket.off('orderUpdated', handleUpdate);
      socket.disconnect();
    };
  }, [order?.orderId]);

  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-7xl mb-6 animate-pop">🎉</div>
      <h1 className="font-display text-4xl text-brand-dark tracking-wide mb-2">Order Placed!</h1>
      <p className="text-gray-500 font-body mb-8">
        We've received your order and will get it ready ASAP!
      </p>

      {order && (
        <div className="bg-white rounded-2xl border-2 border-brand-red/20 p-6 text-left mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-2xl text-brand-dark">#{order.orderId}</span>
            <span className={`status-${order.status} text-xs font-heading font-bold px-3 py-1.5 rounded-full`}>
              {STATUS_LABELS[order.status] || STATUS_LABELS.pending}
            </span>
          </div>
          <div className="space-y-1.5 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm font-body">
                <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                <span className="font-heading font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-dashed border-gray-100 pt-3 space-y-1.5 text-sm font-body">
            {order.subtotal != null && (
              <>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-gray-800">₹{order.gstAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-800">
                    {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="border-t-2 border-dashed border-gray-100 mt-2 pt-3 flex justify-between items-center">
            <span className="font-heading font-bold text-gray-900">
              {order.paymentMethod === 'online' ? 'Total Paid' : 'Total (Cash on Delivery)'}
            </span>
            <span className="font-display text-3xl text-brand-red">₹{order.totalPrice}</span>
          </div>
          <div className="mt-3 bg-brand-gray rounded-xl p-2.5 text-xs text-gray-700 font-body text-center font-semibold">
            {order.paymentMethod === 'online' ? '📲 Paid Online via UPI' : '💵 Cash on Delivery'}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm text-gray-500 font-body">
            <p>👤 {order.customerName}</p>
            <p>📍 {order.address}</p>
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-sm text-green-800 font-body">
        📱 A confirmation has been sent to your WhatsApp. We'll keep you updated!
      </div>

      <Link
        to="/"
        className="inline-block bg-brand-red hover:bg-brand-redDark text-white px-8 py-4 rounded-full font-heading font-bold text-base transition-all active:scale-95 shadow-lg shadow-red-200"
      >
        Order More 🍕
      </Link>
    </main>
  );
}
