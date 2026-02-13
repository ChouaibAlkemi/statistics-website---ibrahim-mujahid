import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, options } from '../data/questions';
import axios from '../api/axios';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const Questionnaire = () => {
  const [answers, setAnswers] = useState(Array(50).fill(null));
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleOptionChange = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
  const progress = (answers.filter(a => a !== null).length / 50) * 100;
  
  const isPageComplete = currentQuestions.every(q => answers[q.id - 1] !== null);

  const calculateResults = () => {
    const totalScore = answers.reduce((acc, curr) => acc + (curr || 0), 0);
    let level = 'Low';
    if (totalScore >= 121) level = 'Critical';
    else if (totalScore >= 81) level = 'High';
    else if (totalScore >= 41) level = 'Medium';
    
    return { totalScore, level };
  };

  const handleSubmit = async () => {
    if (!answers.every(a => a !== null)) {
      alert("الرجاء الإجابة على جميع الأسئلة");
      return;
    }

    setLoading(true);
    const { totalScore, level } = calculateResults();

    try {
      // Try to submit to backend if logged in or anonymous allowed
      // If fails (e.g. backend down), we can still show results locally
      await axios.post('/assessments', {
        answers,
        totalScore,
        aggressionLevel: level
      });
      
      navigate('/results', { state: { totalScore, aggressionLevel: level, answers } });
    } catch (error) {
      console.error("Submission error", error);
        // Fallback to local results if API fails or user not logged in (and API requires auth)
        // But for this requirement we want to show results regardless
        navigate('/results', { state: { totalScore, aggressionLevel: level, answers } });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">تقييم السلوك</h1>
            <p className="text-slate-600">أجب على الأسئلة التالية بصدق للحصول على أدق النتائج.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-200 rounded-full h-4 mb-8 overflow-hidden">
            <div 
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
            {currentQuestions.map((q) => (
                <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-lg font-medium text-slate-800 mb-4">{q.id}. {q.text}</p>
                    <div className="flex flex-wrap gap-2">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleOptionChange(q.id - 1, opt.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                                    ${answers[q.id - 1] === opt.value 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
            <button 
                onClick={() => {
                  setCurrentPage(prev => Math.max(0, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 0}
                className="flex items-center text-slate-600 disabled:opacity-50 hover:text-primary transition-colors font-medium px-4 py-2 hover:bg-slate-100 rounded-lg"
            >
                <ArrowRight className="ml-2" /> السابق
            </button>

            {currentPage < totalPages - 1 ? (
                <button 
                    onClick={() => {
                      setCurrentPage(prev => prev + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={!isPageComplete}
                    className="flex items-center px-6 py-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition-colors"
                >
                    التالي <ArrowLeft className="mr-2" />
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    disabled={!String(answers.every(a => a !== null)) || loading}
                    className="flex items-center px-8 py-3 bg-success text-white rounded-full font-bold shadow-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'جاري المعالجة...' : 'إنهاء وعرض النتائج'} <CheckCircle className="mr-2" />
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default Questionnaire;
