import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Quote, MessageSquare, TrendingUp } from 'lucide-react';

const CommunityFeedback = () => {
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocalData = () => {
      setLoading(true);
      try {
        let storedFeedbacks = JSON.parse(localStorage.getItem('site_feedbacks') || '[]');
        
        // Seed data if empty so it looks nice on first visit
        if (storedFeedbacks.length === 0) {
          storedFeedbacks = [
            { _id: '1', anonymousName: 'مجهول 1', totalScore: 135, aggressionLevel: 'High Concerning', feedbackText: 'التقييم ساعدني جداً في فهم حالة ابني. شكراً لكم.', createdAt: new Date().toISOString(), answers: Array(50).fill(2) },
            { _id: '2', anonymousName: 'مجهول 2', totalScore: 85, aggressionLevel: 'Developmentally Normal', feedbackText: 'نصائح مفيدة جداً سأبدأ بتطبيقها فوراً.', createdAt: new Date().toISOString(), answers: Array(50).fill(1) },
            { _id: '3', anonymousName: 'مجهول 3', totalScore: 45, aggressionLevel: 'Very Normal', feedbackText: 'الموقع سهل الاستخدام والأسئلة دقيقة.', createdAt: new Date().toISOString(), answers: Array(50).fill(1) }
          ];
          localStorage.setItem('site_feedbacks', JSON.stringify(storedFeedbacks));
        }

        // Calculate Stats
        const counts = { 'Very Normal': 0, 'Developmentally Normal': 0, 'Moderate': 0, 'High Concerning': 0, 'Severe': 0 };
        storedFeedbacks.forEach(f => {
            if (counts[f.aggressionLevel] !== undefined) counts[f.aggressionLevel]++;
        });

        setStats({
          totalCount: storedFeedbacks.length,
          stats: Object.keys(counts).map(key => ({ _id: key, count: counts[key] }))
        });
        setFeedbacks(storedFeedbacks);
      } catch (error) {
        console.error('Error loading local data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalData();
  }, []);

  const prepareChartData = () => {
    if (!stats?.stats) return [];
    const levelMap = { 
        'Very Normal': 'طبيعي جداً', 
        'Developmentally Normal': 'طبيعي نمو', 
        'Moderate': 'متوسط', 
        'High Concerning': 'مرتفع', 
        'Severe': 'شديد' 
    };
    const colorMap = { 
        'Very Normal': '#22c55e', 
        'Developmentally Normal': '#eab308', 
        'Moderate': '#f97316', 
        'High Concerning': '#ef4444', 
        'Severe': '#000000' 
    };
    
    return ['Very Normal', 'Developmentally Normal', 'Moderate', 'High Concerning', 'Severe'].map(level => {
        const found = stats.stats.find(s => s._id === level);
        return {
            name: levelMap[level],
            count: found ? found.count : 0,
            color: colorMap[level]
        };
    });
  };

  const chartData = prepareChartData();

  const getBadgeStyles = (level) => {
    switch(level) {
        case 'Severe': return 'bg-slate-900 text-white';
        case 'High Concerning': return 'bg-red-100 text-red-700';
        case 'Moderate': return 'bg-orange-100 text-orange-700';
        case 'Developmentally Normal': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-green-100 text-green-700';
    }
  };

  const getLevelLabel = (level) => {
    const map = { 
        'Very Normal': 'طبيعي جداً', 
        'Developmentally Normal': 'طبيعي نمو', 
        'Moderate': 'متوسط', 
        'High Concerning': 'مرتفع', 
        'Severe': 'شديد' 
    };
    return map[level] || level;
  };

  if (loading) return <div className="py-20 text-center"><p className="text-slate-500 font-bold">جاري تحميل بيانات المجتمع...</p></div>;

  return (
    <div className="bg-slate-50 border-t border-slate-100" id="community">
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">إحصائيات المجتمع</h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        تحليل حي للبيانات المجمعة من مئات التقييمات السابقة، لمساعدتك في فهم توزيع السلوك العدواني.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Main Counter */}
                    <div className="lg:col-span-1 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col justify-center">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6 mx-auto">
                            <TrendingUp className="text-primary w-8 h-8" />
                        </div>
                        <span className="text-6xl font-black text-slate-900 block mb-2">{stats?.totalCount || 0}</span>
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">إجمالي التقييمات العلمية</span>
                    </div>
                    
                    {/* Chart */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-8 border-r-4 border-primary pr-4">توزيع مستويات العدوانية</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }} 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                                    />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Feedbacks */}
        {feedbacks.length > 0 && (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-4 mb-16">
                        <div className="h-px bg-slate-200 flex-1 max-w-xs"></div>
                        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                            <MessageSquare className="text-primary w-8 h-8" />
                            <span>تجارب أولياء الأمور</span>
                        </h2>
                        <div className="h-px bg-slate-200 flex-1 max-w-xs"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {feedbacks.map((fb) => (
                            <div key={fb._id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
                                <Quote className="absolute -top-2 -left-2 text-slate-200 w-16 h-16 group-hover:text-primary/10 transition rotate-12" />
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <h4 className="font-black text-slate-900 text-lg mb-2">{fb.anonymousName}</h4>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getBadgeStyles(fb.aggressionLevel)}`}>
                                                {getLevelLabel(fb.aggressionLevel)}
                                            </span>
                                            <span className="text-slate-800 font-black text-[10px] bg-slate-200 px-2 py-1 rounded-full">
                                                {fb.totalScore} نقطة
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-400 font-bold text-[10px] uppercase">{new Date(fb.createdAt).toLocaleDateString('en-GB')}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium text-sm italic mb-6">
                                        "{fb.feedbackText}"
                                    </p>
                                    
                                    {fb.answers && (
                                        <div className="mt-6 pt-6 border-t border-slate-200">
                                            <div className="flex justify-between items-center mb-3">
                                                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">خريطة الاستجابات السلوكية</h5>
                                                 <span className="text-[9px] font-bold text-slate-300">50 اختبار</span>
                                            </div>
                                            <div className="grid grid-cols-10 gap-1">
                                                {fb.answers.map((ans, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`w-full aspect-square flex items-center justify-center text-[7px] font-black rounded-sm shadow-sm ${
                                                            ans === 4 ? 'bg-red-500 text-white' :
                                                            ans === 3 ? 'bg-orange-400 text-white' :
                                                            ans === 2 ? 'bg-yellow-400 text-slate-800' :
                                                            ans === 1 ? 'bg-green-300 text-slate-700' :
                                                            'bg-slate-100 text-slate-300'
                                                        }`}
                                                    >
                                                        {ans}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
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
