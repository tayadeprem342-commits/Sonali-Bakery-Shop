import { useState, useEffect } from 'react';
import { fetchMenu } from '../services/api.js';
import MenuCard from '../components/MenuCard.jsx';

const ALL_CATEGORIES = [
  'All',
  'Sizzler', 'Mastani', 'Mocktail', 'Lassi',
  'Shakes', 'Momos', 'Deshi Kullad',
  'Sandwich', 'French Fries', 'Shots & Snacks', 'Pasta',
  'Pizzas', 'Burgers', 'Garlic Bread',
  'Ice Creams', 'Cakes', 'Pastries', 'Cookies',
  'Cold Drinks', 'Other'
];

const CAT_EMOJI = {
  'All':'🍽️',
  'Sizzler':'🔥', 'Mastani':'🥛', 'Mocktail':'🍹', 'Lassi':'🥛',
  'Shakes':'🥤', 'Momos':'🥟', 'Deshi Kullad':'🏺',
  'Sandwich':'🥪', 'French Fries':'🍟', 'Shots & Snacks':'🍿', 'Pasta':'🍝',
  'Pizzas':'🍕', 'Burgers':'🍔', 'Garlic Bread':'🧄',
  'Ice Creams':'🍦', 'Cakes':'🎂', 'Pastries':'🥐', 'Cookies':'🍪',
  'Cold Drinks':'🧃', 'Other':'✨',
};

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMenu()
      .then((res) => setMenuItems(res.data))
      .catch(() => setError('Could not load menu. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const activeCategories = ALL_CATEGORIES.filter(
    (c) => c === 'All' || menuItems.some((i) => i.category === c)
  );

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main>
      {/* ── HERO ── */}
      <div className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-40" />
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-brand-yellow/10 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/30 text-brand-yellow px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest mb-5">
            <span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse" />
            Fresh &amp; Hot Every Day
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-none tracking-wide mb-3">
            Sonali <span className="text-brand-yellow">Coldrinks</span>
            <br />
            <span className="text-3xl md:text-5xl text-white/70">&amp; Bakery</span>
          </h1>
          <p className="text-white/60 text-base font-body max-w-md mx-auto mt-4">
            Pizzas, Burgers, Fries, Cakes, Ice Creams & Coldrinks — all under one roof
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search pizzas, burgers, cakes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3.5 rounded-2xl font-body text-sm focus:outline-none focus:bg-white/15 focus:border-brand-yellow/60 transition-all pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">🔍</span>
          </div>
        </div>
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-14 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-heading font-bold transition-all
                  ${activeCategory === cat
                    ? 'cat-active'
                    : 'bg-brand-gray text-gray-600 hover:bg-red-50 hover:text-brand-red border border-gray-200'
                  }`}
              >
                <span>{CAT_EMOJI[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="skeleton h-44 w-full" />
                <div className="p-3.5 space-y-2">
                  <div className="skeleton h-3 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">😟</p>
            <p className="text-red-500 font-heading font-bold text-lg">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-brand-red underline text-sm font-body">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🤷</p>
            <p className="font-heading font-bold text-gray-600 text-lg">No items found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different category or search term</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-brand-dark text-lg">
                {activeCategory === 'All' ? 'All Items' : activeCategory}
                <span className="text-gray-400 font-normal text-sm ml-2">({filtered.length} items)</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-brand-dark text-white/40 text-center py-6 text-xs font-body mt-8">
        <p className="font-display text-brand-yellow text-xl tracking-wide mb-1">Sonali Coldrinks · Bakery</p>
        <p>Made with ❤️ for great food lovers</p>
      </footer>
    </main>
  );
}
