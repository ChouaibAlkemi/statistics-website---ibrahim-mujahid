import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans" dir="rtl">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">تسجيل الدخول</h2>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-slate-600 mb-1">البريد الإلكتروني</label>
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-slate-600 mb-1">كلمة المرور</label>
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-sky-600 transition font-medium">
                    دخول
                </button>
            </form>
            
            <p className="mt-4 text-center text-slate-600 text-sm">
                ليس لديك حساب؟ <Link to="/register" className="text-primary hover:underline">سجل الآن</Link>
            </p>
        </div>
    </div>
  );
};

export default Login;
