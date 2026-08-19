import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { placeOrder } from '../services/api.js';
import { getOrderTotals } from '../utils/pricing.js';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod',    label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'online', label: 'Online Payment',   icon: '📲', desc: 'Pay now via UPI / PhonePe' },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName:'', phone:'', address:'', notes:'' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { subtotal, gstAmount, deliveryFee, grandTotal } = getOrderTotals(totalPrice);

  if (items.length === 0) { navigate('/'); return null; }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit number';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSubmitting(true);
    try {
      const res = await placeOrder({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
        items: items.map((i) => ({ menuItemId: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        paymentMethod,
        subtotal,
        gstAmount,
        deliveryFee,
        totalPrice: grandTotal,
      });
      clearCart();
      navigate('/order-success', { state: { order: res.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-heading font-bold text-brand-red uppercase tracking-widest mb-1">Almost there!</div>
        <h1 className="font-display text-4xl text-brand-dark tracking-wide">Checkout</h1>
        <p className="text-gray-500 font-body text-sm mt-1">Fill in your details to complete the order</p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <h2 className="font-heading font-bold text-brand-dark text-base border-b-2 border-brand-red pb-2">Your Details</h2>

          {[
            { name:'customerName', label:'Full Name', placeholder:'Priya Sharma', type:'text', icon:'👤' },
            { name:'phone',        label:'WhatsApp Number', placeholder:'9876543210', type:'tel', icon:'📱' },
            { name:'address',      label:'Delivery Address', placeholder:'12, Rose Lane, Near Temple', type:'text', icon:'📍' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-heading font-semibold text-gray-700 mb-1.5">
                {field.icon} {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-red transition-all
                  ${errors[field.name] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              />
              {errors[field.name] && <p className="text-red-500 text-xs mt-1 font-body">{errors[field.name]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-heading font-semibold text-gray-700 mb-1.5">
              💬 Special Instructions <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="E.g. Less spicy, extra sauce, ring bell..."
              rows={2}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-red resize-none hover:border-gray-300 transition-all"
            />
          </div>

          {/* Payment Method */}
          <h2 className="font-heading font-bold text-brand-dark text-base border-b-2 border-brand-red pb-2 pt-2">Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`text-left border-2 rounded-xl px-4 py-3 transition-all
                  ${paymentMethod === m.id
                    ? 'border-brand-red bg-red-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xl">{m.icon}</span>
                  <span className="font-heading font-bold text-sm text-brand-dark">{m.label}</span>
                  {paymentMethod === m.id && <span className="ml-auto text-brand-red text-sm">✓</span>}
                </div>
                <p className="text-xs text-gray-500 font-body">{m.desc}</p>
              </button>
            ))}
          </div>

          {paymentMethod === 'online' && (
            <div className="border-2 border-dashed border-brand-red/30 rounded-xl p-4 bg-red-50/50 text-center">
              <p className="font-heading font-bold text-sm text-brand-dark mb-3">Scan & Pay ₹{grandTotal} via PhonePe / UPI</p>
              <img
                src="/payment/phonepe-qr.jpg"
                alt="PhonePe payment QR code"
                className="w-44 h-44 mx-auto rounded-lg border-2 border-white shadow-md"
              />
              <p className="text-xs text-gray-500 font-body mt-3">
                After paying, tap <span className="font-semibold">Place Order Now</span> below — we'll confirm your payment on WhatsApp.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-red hover:bg-brand-redDark disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-heading font-bold text-base transition-all active:scale-95 shadow-lg shadow-red-200 mt-2"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Placing Order…
              </span>
            ) : paymentMethod === 'online' ? '✅ I\'ve Paid — Place Order' : '🛵 Place Order Now'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 sticky top-24">
            <h2 className="font-heading font-bold text-brand-dark text-base mb-3 flex items-center gap-2">
              🧾 Order Summary
            </h2>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-body flex-1 pr-2 truncate">
                    {item.name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-heading font-bold text-gray-800 flex-shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-dashed border-gray-100 mt-3 pt-3 space-y-1.5 text-sm font-body">
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
            <div className="border-t-2 border-dashed border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span className="font-heading font-bold text-gray-900">Total</span>
              <span className="font-display text-3xl text-brand-red tracking-wide">₹{grandTotal}</span>
            </div>
            <div className="mt-3 bg-brand-gray rounded-xl p-2.5 text-xs text-gray-700 font-body text-center font-semibold">
              {paymentMethod === 'online' ? '📲 Paying online via UPI' : '💵 Paying by Cash on Delivery'}
            </div>
            <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-2.5 text-xs text-green-800 font-body text-center">
              📱 WhatsApp confirmation will be sent!
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
