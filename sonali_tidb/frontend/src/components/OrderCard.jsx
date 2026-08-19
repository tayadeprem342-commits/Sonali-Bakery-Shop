import { useState } from 'react';
import { acceptOrder, cancelOrder, updateOrderStatus } from '../services/api.js';
import toast from 'react-hot-toast';

const STATUS_LABELS = {
  pending:          '⏳ Pending',
  accepted:         '✅ Accepted',
  preparing:        '👨‍🍳 Preparing',
  out_for_delivery: '🛵 Out for Delivery',
  delivered:        '🎉 Delivered',
  cancelled:        '❌ Cancelled',
};

export default function OrderCard({ order, onOrderUpdate }) {
  const [loading, setLoading] = useState(false);

  const act = async (fn) => {
    try { setLoading(true); const res = await fn(); onOrderUpdate(res.data); }
    catch { toast.error('Action failed'); }
    finally { setLoading(false); }
  };

  const timeAgo = new Date(order.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  const isPending = order.status === 'pending';
  const isDone = ['delivered','cancelled'].includes(order.status);

  return (
    <div className={`bg-white rounded-2xl border-2 p-4 shadow-sm transition-all
      ${isPending ? 'border-brand-yellow ring-2 ring-brand-yellow/20' : 'border-gray-100'}`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-brand-dark tracking-wide">#{order.orderId}</span>
            {isPending && (
              <span className="text-[10px] bg-brand-yellow text-brand-dark font-heading font-black px-2 py-0.5 rounded-full animate-badge-pulse">
                NEW
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-body mt-0.5">Received at {timeAgo}</p>
        </div>
        <span className={`text-xs font-heading font-bold px-2.5 py-1.5 rounded-full status-${order.status}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Customer Info */}
      <div className="bg-brand-gray rounded-xl p-3 mb-3 space-y-0.5">
        <p className="font-heading font-bold text-gray-800 text-sm">👤 {order.customerName}</p>
        <p className="text-gray-600 text-xs font-body">📱 {order.phone}</p>
        <p className="text-gray-600 text-xs font-body">📍 {order.address}</p>
        {order.notes && <p className="text-gray-400 text-xs italic font-body">💬 {order.notes}</p>}
        <span className={`inline-block mt-1 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full
          ${order.paymentMethod === 'online' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
          {order.paymentMethod === 'online' ? '📲 Paid Online' : '💵 Cash on Delivery'}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs font-body">
            <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
            <span className="font-heading font-bold text-gray-800">₹{item.price * item.quantity}</span>
          </div>
        ))}
        {order.subtotal != null && order.subtotal > 0 && (
          <div className="pt-1 space-y-0.5 text-[11px] text-gray-500 font-body">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between"><span>GST</span><span>₹{order.gstAmount}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span></div>
          </div>
        )}
        <div className="border-t-2 border-dashed border-gray-100 pt-2 mt-2 flex justify-between items-center">
          <span className="font-heading font-bold text-gray-900 text-sm">Total</span>
          <span className="font-display text-2xl text-brand-red">₹{order.totalPrice}</span>
        </div>
      </div>

      {/* Actions */}
      {!isDone && (
        <div className="flex gap-2 flex-wrap">
          {isPending && (
            <>
              <button
                onClick={() => act(() => acceptOrder(order._id))}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-heading font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95"
              >✅ Accept</button>
              <button
                onClick={() => { if (window.confirm('Cancel this order?')) act(() => cancelOrder(order._id)); }}
                disabled={loading}
                className="flex-1 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 font-heading font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95"
              >❌ Cancel</button>
            </>
          )}
          {!isPending && (
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 font-heading font-semibold mb-1 block uppercase tracking-wide">Update Status</label>
              <select
                value={order.status}
                onChange={(e) => act(() => updateOrderStatus(order._id, e.target.value))}
                disabled={loading}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-xs font-heading font-bold text-gray-700 bg-white focus:outline-none focus:border-brand-red cursor-pointer"
              >
                <option value="accepted">✅ Accepted</option>
                <option value="preparing">👨‍🍳 Preparing</option>
                <option value="out_for_delivery">🛵 Out for Delivery</option>
                <option value="delivered">🎉 Delivered</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
