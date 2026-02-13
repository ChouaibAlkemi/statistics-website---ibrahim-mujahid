import React, { useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Printer, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  PieChart as PieChartIcon,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const printRef = useRef();
  
  // Destructure with fallbacks
  const { 
    totalScore = 0, 
    age = 0,
    dimensions = { physical: 0, verbal: 0, emotional: 0, indirect: 0, environmental: 0 },
    classification = { label: 'Unknown', color: '#000', desc: '', recs: [], bg: 'bg-slate-50' },
    dimensionAnalysis = [],
    ageInterpretation = '',
    reportGeneratedAt = new Date().toISOString(),
    answers = []
  } = state || {};

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4">لا توجد نتائج لعرضها</h2>
            <Link to="/assessment" className="text-primary font-bold">بدء التقييم</Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setLoading(true);
    try {
      const existingFeedbacks = JSON.parse(localStorage.getItem('site_feedbacks') || '[]');
      const newFeedback = {
        _id: Date.now().toString(),
        anonymousName: `مجهول ${existingFeedbacks.length + 1}`,
        totalScore,
        aggressionLevel: classification.level,
        feedbackText: feedbackText.trim(),
        answers,
        createdAt: new Date().toISOString(),
        approved: true
      };
      localStorage.setItem('site_feedbacks', JSON.stringify([newFeedback, ...existingFeedbacks]));
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const radarData = [
    { subject: 'جسدي', A: dimensions.physical, fullMark: 40 },
    { subject: 'لفظي', A: dimensions.verbal, fullMark: 40 },
    { subject: 'انفعالي', A: dimensions.emotional, fullMark: 40 },
    { subject: 'غير مباشر', A: dimensions.indirect, fullMark: 40 },
    { subject: 'بيئي/إعلامي', A: dimensions.environmental, fullMark: 40 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans print:bg-white print:py-0" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Navigation / Actions (Hidden on print) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
            <Link to="/" className="flex items-center text-slate-500 hover:text-primary font-bold transition">
                <ArrowRight className="ml-2 w-5 h-5" /> العودة للرئيسية
            </Link>
            <div className="flex gap-3">
                <button 
                    onClick={handlePrint}
                    className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm"
                >
                    <Printer className="ml-2 w-5 h-5" /> طباعة التقرير
                </button>
            </div>
        </div>

        {/* MAIN REPORT CONTAINER */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-none" ref={printRef}>
            
            {/* Report Header */}
            <div className="bg-slate-900 text-white p-8 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-2xl mb-4">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">تقرير تحليل السلوك العدواني</h1>
                    <p className="text-slate-400 font-medium">تقرير أكاديمي متخصص | {new Date(reportGeneratedAt).toLocaleDateString('ar-EG')}</p>
                </div>
            </div>

            <div className="p-8 sm:p-12">
                
                {/* Score Overview */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-1 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                        <span className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">إجمالي النقاط</span>
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle 
                                    cx="64" cy="64" r="58" 
                                    className="stroke-slate-200 fill-none" 
                                    strokeWidth="10" 
                                />
                                <circle 
                                    cx="64" cy="64" r="58" 
                                    className="fill-none transition-all duration-1000" 
                                    strokeWidth="10"
                                    strokeDasharray={364}
                                    strokeDashoffset={364 - (364 * totalScore) / 200}
                                    stroke={classification.color}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="text-4xl font-black text-slate-800">{totalScore}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">من أصل 200 نقطة</span>
                    </div>

                    <div className="md:col-span-2 p-8 rounded-3xl flex flex-col justify-center" style={{ backgroundColor: `${classification.color}10` }}>
                        <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-black uppercase mb-4" style={{ backgroundColor: `${classification.color}20`, color: classification.color }}>
                           التصنيف العام
                        </div>
                        <h2 className="text-3xl font-black mb-4" style={{ color: classification.color }}>{classification.label}</h2>
                        <p className="text-slate-700 leading-relaxed font-medium">
                            {classification.desc}
                        </p>
                    </div>
                </div>

                {/* Dimension Analysis */}
                <div className="grid lg:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                            <PieChartIcon className="ml-2 text-primary" /> تحليل الأبعاد السلوكية
                        </h3>
                        <div className="h-80 w-full bg-slate-50 rounded-3xl p-4 border border-slate-100">
                             <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Score"
                                        dataKey="A"
                                        stroke={classification.color}
                                        fill={classification.color}
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                            <AlertCircle className="ml-2 text-primary" /> تنبيهات الأبعاد المرتفعة
                        </h3>
                        <div className="space-y-4">
                            {dimensionAnalysis.length > 0 ? (
                                dimensionAnalysis.map((item, i) => (
                                    <div key={i} className="p-5 bg-white border-l-4 rounded-2xl shadow-sm flex gap-4" style={{ borderLeftColor: classification.color }}>
                                        <div className="p-2 bg-slate-50 rounded-xl h-fit">
                                            <AlertCircle className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-sm mb-1">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center bg-green-50 rounded-3xl border border-green-100">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <p className="text-green-700 font-bold">جميع أبعاد السلوك تقع ضمن النطاق الآمن.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Age & Academics */}
                <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 mb-12 text-white">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-lg font-black mb-4 flex items-center text-primary">
                                <Brain className="ml-2" /> التفسير حسب العمر ({age} سنة)
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm font-medium">
                                {ageInterpretation}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-black mb-4 flex items-center text-primary">
                                <FileText className="ml-2" /> التحليل الأكاديمي
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm font-medium">
                                بناءً على مقياس "ليكرت" الخماسي، تُظهر النتائج توزيعاً سلوكياً يتطلب خطة تربوية متكاملة تركز على {dimensionAnalysis.length > 0 ? dimensionAnalysis[0].name : 'تعزيز التوافق النفسي'}. يوصى بإعادة التقييم بعد 3 أشهر من بدء التدخل.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="mb-12">
                    <h3 className="text-xl font-black text-slate-800 mb-6">قائمة التوصيات التربوية المقترحة</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {classification.recs.map((rec, i) => (
                            <div key={i} className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="ml-3 mt-1 text-primary">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="text-slate-700 font-bold text-sm">{rec}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-slate-100">
                    <p className="text-slate-400 text-xs font-bold italic">
                        هذا التقرير تم إنشاؤه آلياً وهو مخصص لأغراض تربوية استرشادية فقط. لا يغني عن التشخيص السريري المتكامل.
                    </p>
                </div>
            </div>
        </div>

        {/* FEEDBACK & RE-TRY (Hidden on print) */}
        <div className="mt-12 space-y-8 print:hidden">
            
            {/* Share Feedback Card */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">كيف كانت تجربة التقييم؟</h3>
                <p className="text-slate-500 mb-6 text-sm">مشاركتك لرأيك تساعدنا في تحسين التقييم للآخرين.</p>
                
                {!feedbackSubmitted ? (
                    <form onSubmit={handleFeedbackSubmit} className="max-w-xl mx-auto space-y-4">
                        <textarea
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm transition font-medium"
                            rows="3"
                            placeholder="اكتب تعليقك هنا..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            maxLength={300}
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !feedbackText.trim()}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-sky-600 disabled:opacity-50 transition"
                        >
                            إرسال الرأي <FileText className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <div className="p-6 bg-green-50 text-green-700 rounded-2xl inline-flex items-center font-bold">
                        <CheckCircle className="ml-2 w-5 h-5" /> شكراً جزيلاً! تم حفظ رأيك بنجاح.
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => navigate('/assessment')}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition shadow-sm text-center"
                >
                    إعادة التقييم
                </button>
                <Link to="/" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg text-center">
                    العودة للرئيسية
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Results;
