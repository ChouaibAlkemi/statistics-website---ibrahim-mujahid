import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, AlertTriangle } from 'lucide-react';
import FeedbackModeration from '../components/FeedbackModeration';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, assessmentsRes] = await Promise.all([
            axios.get('/admin/stats'),
            axios.get('/admin/assessments')
        ]);
        setStats(statsRes.data);
        setAssessments(assessmentsRes.data);
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">تحميل البيانات...</div>;

  const data = stats ? [
    { name: 'منخفض', value: stats.breakdown.Low, color: '#22c55e' },
    { name: 'متوسط', value: stats.breakdown.Medium, color: '#eab308' },
    { name: 'مرتفع', value: stats.breakdown.High, color: '#f97316' },
    { name: 'خطير', value: stats.breakdown.Critical, color: '#ef4444' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">لوحة تحكم المسؤول</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-primary mr-4">
                    <Users size={24} />
                </div>
                <div>
                    <h3 className="text-slate-500 text-sm">إجمالي التقييمات</h3>
                    <p className="text-2xl font-bold text-slate-800">{stats?.total || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-slate-500 text-sm">حالات خطيرة</h3>
                    <p className="text-2xl font-bold text-slate-800">{stats?.breakdown.Critical || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                 <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-slate-500 text-sm">حالات مرتفعة</h3>
                    <p className="text-2xl font-bold text-slate-800">{stats?.breakdown.High || 0}</p>
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h3 className="text-lg font-bold text-slate-800 mb-4">توزيع مستويات العدوانية</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h3 className="text-lg font-bold text-slate-800 mb-4">نظرة عامة (أعمدة)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Assessments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">آخر التقييمات المسجلة</h3>
            </div>
            {/* ... (Existing Assessments Table) ... */}
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-3">المستخدم</th>
                            <th className="px-6 py-3">النتيجة</th>
                            <th className="px-6 py-3">المستوى</th>
                            <th className="px-6 py-3">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {assessments.map((assessment) => (
                            <tr key={assessment._id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    {assessment.userId ? assessment.userId.name : 'زائر'}
                                    <div className="text-xs text-slate-400">{assessment.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4">{assessment.totalScore}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        assessment.aggressionLevel === 'Critical' ? 'bg-red-100 text-red-600' :
                                        assessment.aggressionLevel === 'High' ? 'bg-orange-100 text-orange-600' :
                                        assessment.aggressionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                        {assessment.aggressionLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(assessment.createdAt).toLocaleDateString('ar-EG')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Feedback Moderation Section */}
        <FeedbackModeration />

      </div>
    </div>
  );
};

export default AdminDashboard;
