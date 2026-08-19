import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Toaster
        position="bottom-center"
        toastOptions={{
          success: {
            style: {
              background: '#166534',
              color: '#fff',
              fontFamily: 'Poppins, sans-serif',
              borderRadius: '12px',
              fontWeight: '600',
              padding: '12px 18px',
            },
            iconTheme: { primary: '#4ade80', secondary: '#166534' },
            duration: 1800,
          },
          error: {
            style: {
              background: '#991b1b',
              color: '#fff',
              fontFamily: 'Poppins, sans-serif',
              borderRadius: '12px',
              fontWeight: '600',
            },
            duration: 2500,
          },
        }}
      />
      <Routes>
        <Route path="/"              element={<><Navbar /><Home /></>} />
        <Route path="/checkout"      element={<><Navbar /><Checkout /></>} />
        <Route path="/order-success" element={<><Navbar /><OrderSuccess /></>} />
        <Route path="/admin/login"   element={<Login />} />
        <Route path="/admin"         element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
