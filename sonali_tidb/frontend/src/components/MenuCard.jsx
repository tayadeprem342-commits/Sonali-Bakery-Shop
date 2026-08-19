import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

// emoji map per category
const CAT_EMOJI = {
  'Pizzas':         '🍕',
  'Burgers':        '🍔',
  'French Fries':   '🍟',
  'Cold Drinks':    '🥤',
  'Ice Creams':     '🍦',
  'Cakes':          '🎂',
  'Pastries':       '🥐',
  'Cookies':        '🍪',
  'Sizzler':        '🔥',
  'Mastani':        '🥛',
  'Mocktail':       '🍹',
  'Lassi':          '🥛',
  'Shakes':         '🥤',
  'Momos':          '🥟',
  'Deshi Kullad':   '🏺',
  'Sandwich':       '🥪',
  'Shots & Snacks': '🍿',
  'Pasta':          '🍝',
  'Garlic Bread':   '🧄',
  'Other':          '🍽️',
};

// badge color per category
const CAT_COLOR = {
  'Pizzas':         'bg-orange-500',
  'Burgers':        'bg-yellow-600',
  'French Fries':   'bg-amber-400 text-gray-800',
  'Cold Drinks':    'bg-cyan-500',
  'Ice Creams':     'bg-pink-400',
  'Cakes':          'bg-rose-600',
  'Pastries':       'bg-rose-400',
  'Cookies':        'bg-amber-600',
  'Sizzler':        'bg-red-700',
  'Mastani':        'bg-purple-500',
  'Mocktail':       'bg-teal-500',
  'Lassi':          'bg-yellow-500 text-gray-800',
  'Shakes':         'bg-blue-500',
  'Momos':          'bg-green-600',
  'Deshi Kullad':   'bg-orange-700',
  'Sandwich':       'bg-lime-600',
  'Shots & Snacks': 'bg-red-500',
  'Pasta':          'bg-amber-700',
  'Garlic Bread':   'bg-yellow-700',
  'Other':          'bg-gray-500',
};

export default function MenuCard({ item }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!item.available) return;
    setAdding(true);
    addItem(item);
    toast.success(`${item.name} added! 🛒`, {
      style: { background: '#166534', color: '#fff', fontFamily: 'Poppins', borderRadius: '12px', fontWeight: '600' },
      iconTheme: { primary: '#4ade80', secondary: '#166534' },
      duration: 1800,
    });
    setTimeout(() => setAdding(false), 500);
  };

  const emoji = CAT_EMOJI[item.category] || '🍽️';
  const catColor = CAT_COLOR[item.category] || 'bg-gray-500';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm card-lift border border-black/5 flex flex-col animate-fade-up">
      {/* Image */}
      <div className="relative h-44 bg-brand-gray overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30 bg-gradient-to-br from-orange-50 to-red-50">
            {emoji}
          </div>
        )}

        {/* Unavailable overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-heading font-bold px-3 py-1.5 rounded-full shadow">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Category badge */}
        <span className={`absolute top-2.5 left-2.5 ${catColor} text-white text-[10px] font-heading font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide`}>
          {item.category}
        </span>

        {/* Veg/non-veg indicator — based on category */}
        <span className="absolute top-2.5 right-2.5 bg-white/90 rounded-sm p-0.5 shadow-sm">
          {['Cakes','Pastries','Cookies','Cold Drinks','Ice Creams','Mastani','Lassi','Shakes','Mocktail','Sizzler','French Fries','Shots & Snacks','Pasta','Sandwich','Garlic Bread','Momos','Deshi Kullad'].includes(item.category) ? (
            <div className="w-3.5 h-3.5 border-2 border-green-600 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 border-2 border-red-600 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            </div>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-brand-dark text-sm leading-snug mb-1 line-clamp-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-dashed border-gray-100">
          <div>
            <span className="font-display text-2xl text-brand-red tracking-wide">₹{item.price}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={!item.available || adding}
            className={`flex items-center gap-1 text-xs font-heading font-bold px-3.5 py-2 rounded-xl transition-all active:scale-90
              ${item.available
                ? 'bg-brand-red text-white hover:bg-brand-redDark shadow-md shadow-red-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
              ${adding ? 'scale-90 opacity-80' : ''}`}
          >
            {adding ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Adding
              </>
            ) : (
              <><span className="text-base leading-none">+</span> ADD</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
