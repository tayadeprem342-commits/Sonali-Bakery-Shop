import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Cart from './Cart.jsx';

export default function Navbar() {
  const { totalItems, toggleCart, isOpen } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <nav className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              🍰
            </div>
            <div className="leading-tight">
              <div className="font-display text-brand-yellow text-2xl tracking-wide leading-none">
                Sonali
              </div>
              <div className="text-white/60 text-[10px] font-body uppercase tracking-widest leading-none">
                Coldrinks · Bakery
              </div>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <Link to="/" className="text-white/70 hover:text-white text-sm font-body transition-colors">
                Menu
              </Link>
            )}

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 bg-brand-red hover:bg-brand-redDark active:scale-95 text-white px-4 py-2.5 rounded-full text-sm font-heading font-bold transition-all shadow-lg shadow-brand-red/30"
              aria-label="Open cart"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-dark text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-badge-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
      {isOpen && <Cart />}
    </>
  );
}
