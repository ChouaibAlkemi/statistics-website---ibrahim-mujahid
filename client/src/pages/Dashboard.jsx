import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data } = await axios.get('/assessments/my-assessments');
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching assessments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const getLevelColor = (level) => {
    switch(level) {
        case 'Critical': return 'text-red-600 bg-red-50';
        case 'High': return 'text-orange-600 bg-orange-50';
        case 'Medium': return 'text-yellow-600 bg-yellow-50';
        default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">سجل التقييمات السابقة</h1>

        {loading ? (
            <div className="text-center py-10 text-slate-500">جاري التحميل...</div>
        ) : assessments.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow-sm text-center">
                <p className="text-slate-500 mb-4">لا توجد تقييمات سابقة.</p>
                <a href="/assessment" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-sky-600 transition">ابدأ تقييم جديد</a>
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assessments.map((assessment) => (
                    <div key={assessment._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(assessment.aggressionLevel)}`}>
                                {assessment.aggressionLevel === 'Critical' ? 'خطير' : 
                                 assessment.aggressionLevel === 'High' ? 'مرتفع' : 
                                 assessment.aggressionLevel === 'Medium' ? 'متوسط' : 'منخفض'}
                            </span>
                            <span className="text-slate-400 text-sm flex items-center">
                                <Clock size={14} className="ml-1" />
                                {new Date(assessment.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                        </div>
                        <div className="flex items-baseline mb-2">
                            <span className="text-3xl font-bold text-slate-800">{assessment.totalScore}</span>
                            <span className="text-slate-400 text-sm mr-1">/ 200</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-4">
                            النتيجة الإجمالية للتقييم
                        </p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
