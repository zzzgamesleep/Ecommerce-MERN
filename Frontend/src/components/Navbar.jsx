import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore.js';
import { useCartStore } from '../stores/useCartStore.js'; // Đảm bảo tên hook đúng
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [countItems, setCountItems] = useState(0);
  const { user, logout } = useUserStore();
  const isAdmin = user && user.role === "admin";
  const { cart } = useCartStore();


  useEffect(() => {
    setCountItems(cart.length); // Cập nhật số lượng sản phẩm
    console.log(cart); // Kiểm tra giá trị cart
  }, [cart]);
  return (
    <header className="fixed top-0 left-0 w-full
      bg-[radial-gradient(ellipse_at_top,rgba(250,250,250,0.95)_0%,rgba(230,240,255,0.9)_45%,rgba(200,220,240,0.8)_100%)]
      backdrop-blur-md shadow-md z-40 transition-all duration-300 border-b border-indigo-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center space-x-2">
            E-Commerce
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link to={"/"} className="text-indigo-500 hover:text-indigo-700 transition duration-300 ease-in-out">
              Home
            </Link>
            {user && (
              <Link to={"/cart"} className="relative group">
                <ShoppingCart
                  className="inline-block mr-1 text-indigo-600 group-hover:text-indigo-400 transition duration-300"
                  size={20}
                />
                <span className="hidden sm:inline text-indigo-500 group-hover:text-indigo-700 transition duration-300">
                  Cart
                </span>
                {(cart.length > 0) && <span
                  className="absolute -top-2 -left-2 bg-indigo-600 text-white rounded-full px-2 py-0.5 text-xs
                  font-semibold shadow-lg group-hover:bg-indigo-400 transition duration-300 ease-in-out">
                  {countItems}
                </span>}
              </Link>
            )}
            {isAdmin && (
              <Link className="bg-indigo-600 text-black rounded-full px-2 py-0.5 text-xs
                font-semibold shadow-lg hover:bg-white transition duration-300 flex items-center" to={"/secret-dashboard"}>
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button className="bg-indigo-600 text-black rounded-full px-2 py-0.5 text-xs
                font-semibold shadow-lg hover:bg-white transition duration-300 flex items-center"
                onClick={logout}>
                <LogOut className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline ml-2">LogOut</span>
              </button>
            ) : (
              <>
                <Link to={"/signup"} className="bg-indigo-600 text-white rounded-full px-3 py-1 text-xs
                  font-semibold shadow-lg hover:bg-indigo-500 transition duration-300 flex items-center">
                  <UserPlus className="mr-2" size={18} />
                  SignUp
                </Link>
                <Link to={"/login"} className="bg-indigo-600 text-white rounded-full px-3 py-1 text-xs
                  font-semibold shadow-lg hover:bg-indigo-500 transition duration-300 flex items-center">
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
