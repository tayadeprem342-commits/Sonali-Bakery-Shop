import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api.js';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', password:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin(form);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-red rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl shadow-red-900/30">
            🔐
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide">Admin Login</h1>
          <p className="text-white/50 font-body text-sm mt-2">Sonali Coldrinks · Bakery</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl space-y-4">
          {[
            { name:'username', label:'Username', type:'text', placeholder:'admin' },
            { name:'password', label:'Password', type:'password', placeholder:'••••••••' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-heading font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                placeholder={f.placeholder}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-red transition-all"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-brand-redDark disabled:opacity-60 text-white py-3.5 rounded-xl font-heading font-bold transition-all active:scale-95 mt-2"
          >
            {loading ? 'Logging in…' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  );
}
