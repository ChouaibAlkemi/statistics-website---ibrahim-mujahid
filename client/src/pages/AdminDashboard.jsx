import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, AlertTriangle } from 'lucide-react';
import FeedbackModeration from '../components/FeedbackModeration';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, assessmentsRes] = await Promise.all([
            axios.get('/admin/stats'),
            axios.get('/admin/assessments')
        ]);
        setStats(statsRes.data);
        setAssessments(assessmentsRes.data);
        setFilteredAssessments(assessmentsRes.data);
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
      if (ageFilter === 'all') {
          setFilteredAssessments(assessments);
      } else {
          const [min, max] = ageFilter.split('-').map(Number);
          setFilteredAssessments(assessments.filter(a => a.age >= min && a.age <= max));
      }
  }, [ageFilter, assessments]);

  const exportCSV = () => {
    const headers = ['ID', 'User', 'Age', 'Total Score', 'Level', 'Date'].join(',');
    const rows = filteredAssessments.map(a => 
      [a.id, a.userId?.name || 'Guest', a.age || 'N/A', a.totalScore, a.aggressionLevel, new Date(a.createdAt).toLocaleDateString()].join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'assessments_data.csv';
    link.click();
  };

  if (loading) return <div className="text-center py-10">تحميل البيانات...</div>;

  const data = stats ? [
    { name: 'طبيعي جداً', value: stats.breakdown?.['Very Normal'] || 0, color: '#22c55e' },
    { name: 'طبيعي نمو', value: stats.breakdown?.['Developmentally Normal'] || 0, color: '#eab308' },
    { name: 'متوسط', value: stats.breakdown?.['Moderate'] || 0, color: '#f97316' },
    { name: 'مرتفع', value: stats.breakdown?.['High Concerning'] || 0, color: '#ef4444' },
    { name: 'شديد', value: stats.breakdown?.['Severe'] || 0, color: '#000000' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">لوحة تحكم المسؤول</h1>
            <div className="flex gap-3">
                <select 
                    className="bg-white border rounded-lg px-3 py-2 text-sm"
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(e.target.value)}
                >
                    <option value="all">كل الأعمار</option>
                    <option value="2-4">2 - 4 سنوات</option>
                    <option value="5-7">5 - 7 سنوات</option>
                    <option value="8-18">8+ سنوات</option>
                </select>
                <button 
                  onClick={exportCSV}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                >
                    تصدير CSV
                </button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center tracking-tight">
                <div className="p-3 rounded-full bg-blue-100 text-primary mr-4">
                    <Users size={24} />
                </div>
                <div>
                    <h3 className="text-slate-500 text-sm">إجمالي التقييمات العلمية</h3>
                    <p className="text-2xl font-black text-slate-800">{stats?.total || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-slate-500 text-sm">حالات مرتفعة/قلقة</h3>
                    <p className="text-2xl font-black text-slate-800">{stats?.breakdown?.['High Concerning'] || 0}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                 <div className="p-3 rounded-full bg-slate-100 text-black mr-4">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-slate-500 text-sm">حالات شديدة (حرجة)</h3>
                    <p className="text-2xl font-black text-slate-800">{stats?.breakdown?.['Severe'] || 0}</p>
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h3 className="text-lg font-bold text-slate-800 mb-4">توزيع درجات العدوانية</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.filter(d => d.value > 0)}
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
                <h3 className="text-lg font-bold text-slate-800 mb-4">نظرة عامة على البيانات</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Assessments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">سجل التقييمات العلمية</h3>
                <span className="text-xs font-bold text-slate-400">لعرض التقرير الكامل اضغط على الصف</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase">
                        <tr>
                            <th className="px-6 py-3">المستخدم</th>
                            <th className="px-6 py-3">العمر</th>
                            <th className="px-6 py-3">النتيجة</th>
                            <th className="px-6 py-3">المستوى</th>
                            <th className="px-6 py-3">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAssessments.length > 0 ? filteredAssessments.map((assessment) => (
                            <tr key={assessment._id} className="hover:bg-slate-50 cursor-pointer transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{assessment.userId ? (assessment.userId.name || assessment.userId) : 'زائر مجهول'}</div>
                                    <div className="text-[10px] text-slate-400">{assessment.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-600">{assessment.age || '--'} سنة</td>
                                <td className="px-6 py-4 text-primary font-black">{assessment.totalScore}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-[10px] font-black border" style={{ borderColor: `${getColorForLevel(assessment.aggressionLevel)}40`, color: getColorForLevel(assessment.aggressionLevel), backgroundColor: `${getColorForLevel(assessment.aggressionLevel)}10` }}>
                                        {assessment.aggressionLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                                    {new Date(assessment.createdAt).toLocaleDateString('ar-EG')}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold">لا توجد بيانات تطابق الفلتر</td></tr>
                        )}
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

const getColorForLevel = (level) => {
    switch(level) {
        case 'Severe': return '#000000';
        case 'High Concerning': return '#ef4444';
        case 'Moderate': return '#f97316';
        case 'Developmentally Normal': return '#eab308';
        default: return '#22c55e';
    }
};

export default AdminDashboard;
