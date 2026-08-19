import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { getOrderTotals } from '../utils/pricing.js';

export default function Cart() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, closeCart } = useCart();
  const navigate = useNavigate();
  const { subtotal, gstAmount, deliveryFee, grandTotal } = getOrderTotals(totalPrice);

  const goToCheckout = () => { closeCart(); navigate('/checkout'); };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={closeCart}>
      <div className="absolute inset-0 cart-overlay" />
      <div
        className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-dark px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="font-display text-brand-yellow text-2xl tracking-wide leading-none">
              Your Order {totalItems > 0 && <span className="text-white/70 text-lg">({totalItems})</span>}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="font-heading font-bold text-gray-700 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add something delicious!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex items-center gap-3 bg-brand-gray rounded-xl p-3">
                <div className="w-14 h-14 rounded-lg bg-orange-50 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-brand-dark text-sm truncate">{item.name}</p>
                  <p className="font-display text-brand-red text-lg leading-none">₹{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { if (item.quantity === 1) removeItem(item._id); else updateQuantity(item._id, item.quantity - 1); }}
                    className="w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-700 hover:border-brand-red hover:text-brand-red transition-colors font-bold text-base"
                  >−</button>
                  <span className="w-5 text-center font-heading font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-redDark transition-colors font-bold text-base"
                  >+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t-2 border-dashed border-gray-100 bg-white">
            <div className="space-y-1.5 mb-3 text-sm font-body">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span className="font-semibold text-gray-800">₹{gstAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-800">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4 pt-3 border-t-2 border-dashed border-gray-100">
              <span className="font-heading font-bold text-gray-900">Total Amount</span>
              <span className="font-display text-3xl text-brand-red tracking-wide">₹{grandTotal}</span>
            </div>
            <button
              onClick={goToCheckout}
              className="w-full bg-brand-red hover:bg-brand-redDark active:scale-95 text-white py-4 rounded-xl font-heading font-bold text-base transition-all shadow-lg shadow-red-200"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
