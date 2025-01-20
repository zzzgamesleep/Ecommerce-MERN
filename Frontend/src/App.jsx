import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/useUserStore';
import { useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import AdminPage from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import { useCartStore } from './stores/useCartStore.js';
import CartPage from './pages/CartPage.jsx';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage.jsx';
import PurchaseCancelPage from './pages/PurchaseCancelPage.jsx';

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    const fetchCartItemsSafely = async () => {
      try {
        if (!user) return; // Nếu không có user, không làm gì cả
        await getCartItems(); // Gọi phương thức lấy giỏ hàng nếu user đã đăng nhập
      } catch (error) {
        console.error("Error while fetching cart items:", error);
      }
    };

    fetchCartItemsSafely(); // Gọi hàm fetchCartItemsSafely khi useEffect chạy
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      {/* Background Gradient */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.8)_0%,rgba(144,224,239,0.6)_45%,rgba(105,191,220,0.4)_100%)]"></div>
        </div>
      </div>
      <div className='relative z-50 pt-20'>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} />
          <Route path="/category/:category" element={<CategoryPage></CategoryPage>} />
          <Route path="/cart" element={user ? <CartPage></CartPage> : <Navigate to="/login" />} />
          <Route path="/purchase-success" element={user ? <PurchaseSuccessPage></PurchaseSuccessPage> : <Navigate to="/login" />} />
          <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage></PurchaseCancelPage> : <Navigate to="/login" />} />

        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
