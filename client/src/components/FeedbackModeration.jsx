import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Check, X, Trash2 } from 'lucide-react';

const FeedbackModeration = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get('/feedback/admin/all', config);
      setFeedbacks(res.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.put(`/feedback/admin/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update UI
      setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, approved: true } : f));
    } catch (error) {
      alert('Error approving feedback');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.delete(`/feedback/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI
      setFeedbacks(feedbacks.filter(f => f._id !== id));
    } catch (error) {
      alert('Error deleting feedback');
    }
  };

  if (loading) return <div className="text-center p-4">جاري تحميل الآراء...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">إدارة آراء المجتمع</h3>
        <button onClick={fetchFeedbacks} className="text-sm text-primary hover:underline">تحديث</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">الاسم (مجهول)</th>
              <th className="px-6 py-3 w-1/2">التعليق</th>
              <th className="px-6 py-3">النتيجة</th>
              <th className="px-6 py-3">الحالة</th>
              <th className="px-6 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800 text-sm">
                  {fb.anonymousName}
                  <div className="text-xs text-slate-400 mt-1">{new Date(fb.createdAt).toLocaleDateString('ar-EG')}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{fb.feedbackText}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      fb.aggressionLevel === 'Critical' ? 'bg-red-100 text-red-600' :
                      fb.aggressionLevel === 'High' ? 'bg-orange-100 text-orange-600' :
                      fb.aggressionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                  }`}>
                      {fb.aggressionLevel} ({fb.totalScore})
                  </span>
                </td>
                <td className="px-6 py-4">
                  {fb.approved ? (
                    <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">منشور</span>
                  ) : (
                    <span className="text-slate-500 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full">معلق</span>
                  )}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {!fb.approved && (
                    <button 
                      onClick={() => handleApprove(fb._id)}
                      className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200 transition"
                      title="نشر"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(fb._id)}
                    className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
                    title="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">لا توجد تعليقات حتى الآن.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackModeration;
