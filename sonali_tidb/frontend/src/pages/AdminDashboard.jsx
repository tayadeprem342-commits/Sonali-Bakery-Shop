import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchOrders, fetchMenu, addMenuItem, deleteMenuItem, toggleItemAvailability, clearAllOrders } from '../services/api.js';
import socket from '../services/socket.js';
import OrderCard from '../components/OrderCard.jsx';

const ALL_CATEGORIES = ['Pizzas','Burgers','Fries','Cold Drinks','Ice Creams','Cakes','Pastries','Breads','Cookies','Drinks','Other'];
const STATUS_FILTERS = ['all','pending','accepted','preparing','out_for_delivery','delivered','cancelled'];

const STATUS_LABELS = {
  all:'All', pending:'⏳ Pending', accepted:'✅ Accepted', preparing:'👨‍🍳 Preparing',
  out_for_delivery:'🛵 Delivery', delivered:'🎉 Delivered', cancelled:'❌ Cancelled',
};

const CAT_EMOJI = {
  'Pizzas':'🍕','Burgers':'🍔','Fries':'🍟','Cold Drinks':'🥤','Ice Creams':'🍦',
  'Cakes':'🎂','Pastries':'🥐','Breads':'🍞','Cookies':'🍪','Drinks':'☕','Other':'🍽️',
};

// Pizza varieties
const VARIETIES = {
  'Pizzas':['Paneer Tikka','Margherita','Capsicum','Corn & Cheese','Mushroom','BBQ Chicken','Double Cheese','Mexican','Farmhouse','Classic Veg'],
  'Burgers':['Veg Burger','Paneer Burger','Aloo Tikki','Crispy Veggie','Classic Burger','Double Patty','Spicy Jalapeno'],
  'Fries':['Salted Fries','Masala Fries','Peri Peri Fries','Cheesy Fries','Loaded Fries'],
  'Cold Drinks':['Coca Cola','Pepsi','Sprite','Limca','Fanta','Maaza','Frooti','Thums Up','Appy Fizz','7UP'],
  'Ice Creams':['Vanilla','Chocolate','Strawberry','Butterscotch','Mango','Oreo Blizzard','Kit Kat Crunch','Mixed Fruit'],
  'Cakes':['Chocolate Truffle','Red Velvet','Black Forest','Pineapple','Butterscotch','Strawberry','Dutch Truffle','Vanilla Cream'],
  'Pastries':['Black Forest Pastry','Mango Mousse','Chocolate Pastry','Strawberry Pastry','Butterscotch Pastry'],
  'Breads':['Butter Croissant','Sourdough Loaf','Garlic Bread','Multigrain','Pav'],
  'Cookies':['Chocolate Chip','Oatmeal Raisin','Butter Cookies','Choco Crunch','Coconut Cookies'],
  'Drinks':['Cold Coffee','Hot Coffee','Lemonade','Milkshake','Lassi','Chai','Hot Chocolate'],
  'Other':['Combo Meal','Party Pack','Special Offer'],
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState('All');

  const [newItem, setNewItem] = useState({ name:'', description:'', price:'', category:'Pizzas', image:'', variety:'' });
  const [addingItem, setAddingItem] = useState(false);

  // Stats
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalPrice, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;

  useEffect(() => {
    fetchOrders().then(r => setOrders(r.data)).catch(() => toast.error('Failed to load orders')).finally(() => setLoadingOrders(false));
    fetchMenu().then(r => setMenuItems(r.data)).catch(() => toast.error('Failed to load menu')).finally(() => setLoadingMenu(false));
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on('newOrder', (order) => {
      setOrders(p => [order, ...p]);
      toast('🔔 New Order!', { icon:'🍽️', duration:5000, style:{ background:'#1a0a00', color:'#fff' } });
      try { new Audio('/notification.mp3').play(); } catch {}
    });
    socket.on('orderAccepted', updateInList);
    socket.on('orderCancelled', updateInList);
    socket.on('orderUpdated', updateInList);
    socket.on('ordersCleared', () => setOrders([]));
    return () => {
      socket.off('newOrder'); socket.off('orderAccepted');
      socket.off('orderCancelled'); socket.off('orderUpdated');
      socket.off('ordersCleared');
      socket.disconnect();
    };
  }, []);

  const updateInList = useCallback((u) => setOrders(p => p.map(o => o._id === u._id ? u : o)), []);

  const [clearing, setClearing] = useState(false);
  const handleClearAllOrders = async () => {
    if (!window.confirm('This will permanently delete ALL order history. Continue?')) return;
    if (!window.confirm('Are you absolutely sure? This cannot be undone.')) return;
    setClearing(true);
    try {
      await clearAllOrders();
      setOrders([]);
      toast.success('Order history cleared');
    } catch {
      toast.error('Failed to clear order history');
    } finally {
      setClearing(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) { toast.error('Name and price are required'); return; }
    setAddingItem(true);
    try {
      const itemName = newItem.variety ? `${newItem.variety} ${newItem.name}` : newItem.name;
      const res = await addMenuItem({ ...newItem, name: itemName, price: Number(newItem.price) });
      setMenuItems(p => [res.data, ...p]);
      setNewItem({ name:'', description:'', price:'', category:'Pizzas', image:'', variety:'' });
      toast.success('Item added to menu! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    } finally { setAddingItem(false); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleItemAvailability(id);
      setMenuItems(p => p.map(i => i._id === id ? res.data : i));
    } catch { toast.error('Failed to update availability'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item from the menu?')) return;
    try {
      await deleteMenuItem(id);
      setMenuItems(p => p.filter(i => i._id !== id));
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);
  const filteredMenu = menuItems.filter(i => {
    const matchCat = menuCatFilter === 'All' || i.category === menuCatFilter;
    const matchSearch = !menuSearch || i.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const varieties = VARIETIES[newItem.category] || [];

  const TABS = [
    { label:'Orders', icon:'📋', badge: pendingCount > 0 ? pendingCount : null },
    { label:'Menu', icon:'🍽️', badge: menuItems.length },
    { label:'Stats', icon:'📊', badge: null },
  ];

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-xl">🍰</div>
            <div>
              <div className="font-display text-brand-yellow text-2xl tracking-wide leading-none">Sonali Admin</div>
              <div className="text-white/40 text-[10px] font-body uppercase tracking-widest">Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-400 bg-green-900/30 border border-green-700/30 px-3 py-1.5 rounded-full font-heading font-bold">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
            </div>
            <button
              onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }}
              className="text-sm text-white/50 hover:text-white font-heading font-semibold transition-colors"
            >Logout</button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 border-t border-white/10">
          {TABS.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-heading font-bold border-b-2 transition-colors relative
                ${activeTab === idx ? 'border-brand-yellow text-brand-yellow' : 'border-transparent text-white/50 hover:text-white/80'}`}
            >
              {tab.icon} {tab.label}
              {tab.badge != null && (
                <span className={`text-xs font-black px-1.5 py-0.5 rounded-full ${idx === 0 ? 'bg-brand-yellow text-brand-dark animate-badge-pulse' : 'bg-white/20 text-white'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── ORDERS TAB ── */}
        {activeTab === 0 && (
          <div>
            {/* Status Filter */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-heading font-bold capitalize transition-all
                      ${statusFilter === s ? 'bg-brand-red text-white shadow-md shadow-red-200' : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'}`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              {orders.length > 0 && (
                <button
                  onClick={handleClearAllOrders}
                  disabled={clearing}
                  className="flex-shrink-0 text-xs font-heading font-bold px-3.5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-all"
                >
                  {clearing ? 'Clearing…' : '🗑 Clear All History'}
                </button>
              )}
            </div>

            {loadingOrders && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton bg-white rounded-2xl h-52" />)}
              </div>
            )}

            {!loadingOrders && filteredOrders.length === 0 && (
              <div className="text-center py-20">
                <p className="text-5xl mb-3">📭</p>
                <p className="font-heading font-bold text-gray-500 text-lg">No {statusFilter !== 'all' ? STATUS_LABELS[statusFilter] : ''} orders yet</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} onOrderUpdate={updateInList} />
              ))}
            </div>
          </div>
        )}

        {/* ── MENU TAB ── */}
        {activeTab === 1 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Add Item Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 shadow-sm">
                <h2 className="font-heading font-bold text-brand-dark text-base mb-4 flex items-center gap-2">
                  ➕ Add New Item
                </h2>
                <form onSubmit={handleAddItem} className="space-y-3">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-heading font-bold text-gray-600 mb-1 block uppercase tracking-wide">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value, variety:'', name:'' })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-red"
                    >
                      {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Variety picker */}
                  {varieties.length > 0 && (
                    <div>
                      <label className="text-xs font-heading font-bold text-gray-600 mb-1 block uppercase tracking-wide">
                        Quick Variety <span className="text-gray-400 font-normal normal-case">(optional)</span>
                      </label>
                      <select
                        value={newItem.variety}
                        onChange={(e) => setNewItem({ ...newItem, variety: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-red"
                      >
                        <option value="">— Pick a variety —</option>
                        {varieties.map(v => <option key={v}>{v}</option>)}
                      </select>
                      {newItem.variety && (
                        <p className="text-xs text-brand-red mt-1 font-body">
                          Will be named: "<strong>{newItem.variety} {newItem.name || '...'}</strong>"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Name */}
                  {[
                    { key:'name', label:'Item Name / Base Name', placeholder:'Pizza, Burger, Cake...', type:'text' },
                    { key:'price', label:'Price (₹)', placeholder:'120', type:'number' },
                    { key:'image', label:'Image URL', placeholder:'https://...', type:'url' },
                    { key:'description', label:'Description', placeholder:'Tasty and fresh...', type:'text' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-xs font-heading font-bold text-gray-600 mb-1 block uppercase tracking-wide">{f.label}</label>
                      <input
                        type={f.type}
                        value={newItem[f.key]}
                        onChange={(e) => setNewItem({ ...newItem, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={addingItem}
                    className="w-full bg-brand-red hover:bg-brand-redDark disabled:opacity-60 text-white py-3 rounded-xl font-heading font-bold text-sm transition-all active:scale-95"
                  >
                    {addingItem ? 'Adding…' : '+ Add to Menu'}
                  </button>
                </form>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="lg:col-span-2">
              {/* Search & filter */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-red"
                />
                <select
                  value={menuCatFilter}
                  onChange={(e) => setMenuCatFilter(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-red"
                >
                  <option>All</option>
                  {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <h2 className="font-heading font-bold text-brand-dark text-base mb-4">
                Current Menu <span className="text-gray-400 font-normal text-sm">({filteredMenu.length} items)</span>
              </h2>

              {loadingMenu && <p className="text-gray-400 text-sm font-body">Loading menu…</p>}

              <div className="space-y-2">
                {filteredMenu.map((item) => (
                  <div
                    key={item._id}
                    className={`bg-white rounded-xl border-2 p-3.5 flex items-center gap-3 transition-all
                      ${item.available ? 'border-gray-100' : 'border-red-100 opacity-60'}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex-shrink-0 overflow-hidden flex items-center justify-center text-xl">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : CAT_EMOJI[item.category] || '🍽️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-brand-dark text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 font-body">{item.category} · <span className="font-display text-brand-red text-base">₹{item.price}</span></p>
                    </div>
                    <button
                      onClick={() => handleToggle(item._id)}
                      className={`text-xs font-heading font-bold px-3 py-1.5 rounded-full transition-all flex-shrink-0
                        ${item.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                    >
                      {item.available ? '✅ Active' : '❌ Off'}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm flex-shrink-0"
                    >🗑</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STATS TAB ── */}
        {activeTab === 2 && (
          <div>
            <h2 className="font-heading font-bold text-brand-dark text-lg mb-6">Business Overview</h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label:'Today\'s Orders', value: todayOrders, icon:'📋', color:'bg-blue-50 border-blue-200', textColor:'text-blue-700' },
                { label:'Pending Now', value: pendingCount, icon:'⏳', color:'bg-yellow-50 border-yellow-200', textColor:'text-yellow-700' },
                { label:'Total Revenue', value:`₹${totalRevenue}`, icon:'💰', color:'bg-green-50 border-green-200', textColor:'text-green-700' },
                { label:'Menu Items', value: menuItems.length, icon:'🍽️', color:'bg-red-50 border-red-200', textColor:'text-brand-red' },
              ].map((stat) => (
                <div key={stat.label} className={`bg-white rounded-2xl border-2 p-5 ${stat.color}`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className={`font-display text-3xl tracking-wide ${stat.textColor}`}>{stat.value}</div>
                  <div className="text-xs font-heading font-semibold text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-heading font-bold text-brand-dark text-base mb-4">Orders by Status</h3>
              <div className="space-y-3">
                {['pending','accepted','preparing','out_for_delivery','delivered','cancelled'].map((s) => {
                  const count = orders.filter(o => o.status === s).length;
                  const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-sm font-heading font-semibold text-gray-700 mb-1">
                        <span>{STATUS_LABELS[s]}</span>
                        <span>{count} orders ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-brand-red h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4">
              <h3 className="font-heading font-bold text-brand-dark text-base mb-4">Menu by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_CATEGORIES.map(cat => {
                  const count = menuItems.filter(i => i.category === cat).length;
                  if (!count) return null;
                  return (
                    <div key={cat} className="flex items-center gap-2 bg-brand-gray rounded-xl px-3 py-2">
                      <span>{CAT_EMOJI[cat]}</span>
                      <div>
                        <div className="font-heading font-bold text-xs text-gray-800">{cat}</div>
                        <div className="text-[10px] text-gray-500">{count} items</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
