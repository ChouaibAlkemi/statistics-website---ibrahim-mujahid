import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, options } from '../data/questions';
import axios from '../api/axios';
import { ArrowLeft, ArrowRight, CheckCircle, User, Calendar } from 'lucide-react';
import { scoringService } from '../services/scoringService';

const Questionnaire = () => {
  const [age, setAge] = useState('');
  const [answers, setAnswers] = useState(Array(50).fill(null));
  const [currentPage, setCurrentPage] = useState(-1); // -1 for age input page
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleOptionChange = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const currentQuestions = currentPage >= 0 ? questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage) : [];
  const progress = (answers.filter(a => a !== null).length / 50) * 100;
  
  const isPageComplete = currentPage >= 0 ? currentQuestions.every(q => answers[q.id - 1] !== null) : age >= 2 && age <= 18;

  const handleSubmit = async () => {
    if (!answers.every(a => a !== null)) {
      const missing = answers.map((a, i) => a === null ? i + 1 : null).filter(n => n !== null);
      alert(`الرجاء الإجابة على جميع الأسئلة. الأسئلة الناقصة هي: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    const results = scoringService.calculate(answers, parseInt(age));

    try {
      // Background save to PG if supported
      await axios.post('/assessments', {
        age: parseInt(age),
        answers,
        totalScore: results.totalScore,
        aggressionLevel: results.classification.level,
        dimensionScores: results.dimensions,
        reportGeneratedAt: results.reportGeneratedAt
      });
    } catch (error) {
      console.error("Submission error", error);
    } finally {
        setLoading(false);
        navigate('/results', { state: { ...results, answers } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">مقياس عدوانية الأطفال</h1>
            <p className="text-slate-600">تقييم علمي مبني على 5 أبعاد سلوكية</p>
        </div>

        {/* Age Invitation Page */}
        {currentPage === -1 ? (
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="text-primary w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">أهلاً بك في التقييم</h2>
                <p className="text-slate-600 mb-8">خطوتك الأولى لفهم سلوك طفلك بشكل علمي ودقيق. يرجى إدخال عمر الطفل للمتابعة.</p>
                
                <div className="max-w-xs mx-auto mb-10">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 text-right">عمر الطفل (سنوات)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="2" 
                            max="18"
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-center font-bold text-xl"
                            placeholder="مثال: 7"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                    {age && (age < 2 || age > 18) && <p className="text-red-500 text-xs mt-2">عمر الطفل يجب أن يكون بين 2 و 18 سنة</p>}
                </div>

                <button 
                    onClick={() => setCurrentPage(0)}
                    disabled={!isPageComplete}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-sky-600 transition-all disabled:opacity-50"
                >
                    ابدأ التقييم الآن
                </button>
            </div>
        ) : (
            <>
                {/* Progress Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-xs font-bold text-slate-400">تقدم التقييم: {Math.round(progress)}%</span>
                        <span className="text-xs font-bold text-primary">المرحلة {currentPage + 1} من {totalPages}</span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                            className="bg-primary h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {currentQuestions.map((q) => (
                        <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/20 transition-colors">
                            <div className="flex items-start gap-4 mb-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">
                                    {q.id}
                                </span>
                                <p className="text-lg font-bold text-slate-800 leading-tight pt-1">{q.text}</p>
                            </div>
                            <div className="grid grid-cols-5 gap-2 pr-12">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleOptionChange(q.id - 1, opt.value)}
                                        className={`px-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 
                                            ${answers[q.id - 1] === opt.value 
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2' 
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="mt-10 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => {
                          if (currentPage === 0) setCurrentPage(-1);
                          else {
                              setCurrentPage(prev => prev - 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="flex items-center text-slate-500 hover:text-primary transition-all font-bold px-4 py-2 hover:bg-slate-50 rounded-xl"
                    >
                        <ArrowRight className="ml-2 w-5 h-5" /> السابق
                    </button>

                    {currentPage < totalPages - 1 ? (
                        <button 
                            onClick={() => {
                              setCurrentPage(prev => prev + 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={!isPageComplete}
                            className="flex items-center px-8 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition-all shadow-md"
                        >
                            التالي <ArrowLeft className="mr-2 w-5 h-5" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={!answers.every(a => a !== null) || loading}
                            className="flex items-center px-10 py-4 bg-success text-white rounded-xl font-bold shadow-xl hover:bg-green-600 disabled:opacity-50 transition-all transform hover:scale-105"
                        >
                            {loading ? 'جاري التحليل العلمي...' : 'إنهاء وإصدار التقرير'} <CheckCircle className="mr-2 w-6 h-6" />
                        </button>
                    )}
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default Questionnaire;
