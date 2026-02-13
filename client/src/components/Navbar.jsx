import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100" dir="rtl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Shield className="w-6 h-6" />
            تقييم سلوك الطفل
        </Link>
        
        <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-500">
                المدرسة العليا لأساتذة التعليم التكنولوجي سكيكدة
            </span>
            {user && (
                <>
                   <span className="text-slate-600 hidden md:block">مرحباً، {user.name}</span>
                   {user.role === 'admin' && (
                       <Link to="/admin" className="flex items-center gap-1 text-slate-600 hover:text-primary transition">
                           <LayoutDashboard size={18} /> لوحة الإدارة
                       </Link>
                   )}
                   <Link to="/assessment" className="flex items-center gap-1 text-slate-600 hover:text-primary transition">
                       تقييم جديد
                   </Link>
                   <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition">
                       <LogOut size={18} /> خروج
                   </button>
                </>
            )}
            {/* Removed Login/Register link as requested */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
