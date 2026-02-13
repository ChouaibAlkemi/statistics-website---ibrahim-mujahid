import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Quote, MessageSquare } from 'lucide-react';

const CommunityFeedback = () => {
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, feedbackRes] = await Promise.all([
          axios.get('/feedback/stats'),
          axios.get('/feedback/public')
        ]);
        setStats(statsRes.data);
        setFeedbacks(feedbackRes.data);
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = () => {
    if (!stats?.stats) return [];
    // Convert backend Aggression Levels to Arabic Labels and standardize data structure
    const levelMap = { 'Low': 'منخفض', 'Medium': 'متوسط', 'High': 'مرتفع', 'Critical': 'خطير' };
    const colorMap = { 'Low': '#10b981', 'Medium': '#d97706', 'High': '#ea580c', 'Critical': '#dc2626' };
    
    // Ensure all levels exist even if count is 0
    return ['Low', 'Medium', 'High', 'Critical'].map(level => {
        const found = stats.stats.find(s => s._id === level);
        return {
            name: levelMap[level],
            count: found ? found.count : 0,
            color: colorMap[level]
        };
    });
  };

  const chartData = prepareChartData();

  if (loading) return <div className="py-20 text-center"><p className="text-slate-500">جاري تحميل بيانات المجتمع...</p></div>;

  return (
    <div className="bg-slate-50 border-t border-slate-100">
        
        {/* Stats Section */}
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">نتائج المجتمع</h2>
                <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                    إحصائيات عامة حول مستويات العدوانية لدى الأطفال بناءً على تقييمات المشاركين.
                </p>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <span className="text-5xl font-bold text-primary block mb-2">{stats?.totalCount || 0}</span>
                        <span className="text-slate-500 font-medium">مجموع التقييمات</span>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        {feedbacks.length > 0 && (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-2">
                        <MessageSquare className="text-primary" />
                        <span>تجارب وآراء أولياء الأمور</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feedbacks.map((fb) => (
                            <div key={fb._id} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition duration-300 relative group">
                                <Quote className="absolute top-4 left-4 text-slate-200 w-8 h-8 group-hover:text-primary/20 transition" />
                                <div className="mb-4">
                                    <h4 className="font-bold text-slate-800">{fb.anonymousName}</h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs">
                                        <span className={`px-2 py-0.5 rounded-full ${
                                            fb.aggressionLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                                            fb.aggressionLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                                            fb.aggressionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {fb.aggressionLevel === 'Critical' ? 'خطير' : fb.aggressionLevel === 'High' ? 'مرتفع' : fb.aggressionLevel === 'Medium' ? 'متوسط' : 'منخفض'}
                                        </span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-500 font-mono ltr">{new Date(fb.createdAt).toLocaleDateString('en-GB')}</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    "{fb.feedbackText}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}
    </div>
  );
};

export default CommunityFeedback;
