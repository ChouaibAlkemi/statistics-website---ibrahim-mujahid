import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import axios from '../api/axios';

const Results = () => {
  const { state } = useLocation();
  const { totalScore, aggressionLevel, answers } = state || { totalScore: 0, aggressionLevel: 'Unknown', answers: [] };
  
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setLoading(true);
    try {
      // Get existing feedbacks from localStorage
      const existingFeedbacks = JSON.parse(localStorage.getItem('site_feedbacks') || '[]');
      
      const newFeedback = {
        _id: Date.now().toString(),
        anonymousName: `مجهول ${existingFeedbacks.length + 1}`,
        totalScore,
        aggressionLevel,
        feedbackText: feedbackText.trim(),
        answers,
        createdAt: new Date().toISOString(),
        approved: true // Auto-approve for local storage
      };

      // Save back to localStorage
      localStorage.setItem('site_feedbacks', JSON.stringify([newFeedback, ...existingFeedbacks]));
      
      setFeedbackSubmitted(true);
      setFeedbackText('');
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('حدث خطأ أثناء حفظ التعليق.');
    } finally {
      setLoading(false);
    }
  };

  let color = 'text-green-600';
  let bgColor = 'bg-green-50';
  let message = '';
  
  if (aggressionLevel === 'Critical') {
    color = 'text-red-600';
    bgColor = 'bg-red-50';
    message = 'مستوى خطير - يوصى بشدة باستشارة مختص نفسي فوراً.';
  } else if (aggressionLevel === 'High') {
    color = 'text-orange-600';
    bgColor = 'bg-orange-50';
    message = 'مستوى مرتفع - يحتاج الطفل إلى برامج تعديل سلوك ومتابعة دقيقة.';
  } else if (aggressionLevel === 'Medium') {
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-50';
    message = 'مستوى متوسط - يمكن تعديل السلوك من خلال التوجيه المنزلي والمدرسي.';
  } else {
    color = 'text-green-600';
    bgColor = 'bg-green-50';
    message = 'مستوى منخفض - سلوك طبيعي ولا يوجد مؤشرات للقلق.';
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans" dir="rtl">
      <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-xl text-center">
        
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${bgColor}`}>
            <span className={`text-4xl font-bold ${color}`}>{totalScore}</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">نتيجة التقييم</h1>
        <h2 className={`text-2xl font-semibold mb-6 ${color}`}>{aggressionLevel === 'Critical' ? 'خطير' : aggressionLevel === 'High' ? 'مرتفع' : aggressionLevel === 'Medium' ? 'متوسط' : 'منخفض'}</h2>
        
        <div className={`p-6 rounded-lg mb-8 ${bgColor} border border-opacity-20 ${color === 'text-red-600' ? 'border-red-600' : 'border-green-600'}`}>
            <p className="text-lg leading-relaxed font-medium">
                {message}
            </p>
        </div>

        {/* Feedback Section */}
        <div className="mt-12 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">هل تود مشاركة رأيك؟</h3>
            <p className="text-slate-600 mb-4 text-sm">سيتم نشر رأيك كمجهول لمساعدة الآخرين.</p>
            
            {!feedbackSubmitted ? (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <textarea
                        className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                        rows="4"
                        placeholder="اكتب تعليقك هنا..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        maxLength={300}
                        required
                    ></textarea>
                    <div className="flex justify-between items-center text-sm text-slate-500">
                        <span>{300 - feedbackText.length} حرف متبقي</span>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-sky-600 disabled:opacity-50 transition"
                        >
                            {loading ? 'جاري الإرسال...' : 'إرسال الرأي'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center justify-center">
                    <CheckCircle className="ml-2 w-5 h-5" />
                    <span>شكراً لك! سيتم مراجعة تعليقك ونشره قريباً.</span>
                </div>
            )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8 mb-8">
            <Link to="/assessment" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium">
                إعادة التقييم
            </Link>
            {/* Show save button only if user is logged in (e.g. Admin) */}
            {JSON.parse(localStorage.getItem('user')) && (
                <Link to="/dashboard" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-sky-600 transition font-medium shadow-md">
                    حفظ النتيجة في ملفي
                </Link>
            )}
        </div>

        <p className="text-slate-500 text-sm">
            ملاحظة: هذه النتيجة مؤشر أولي ولا تغني عن التشخيص الطبي المتخصص.
        </p>

      </div>
    </div>
  );
};

export default Results;
