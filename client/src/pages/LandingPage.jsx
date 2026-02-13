import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Heart, Users, BookOpen, GraduationCap } from 'lucide-react';
import CommunityFeedback from '../components/CommunityFeedback';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      
      {/* Hero Section */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">تقييم سلوك الطفل</h1>
            <span className="text-sm font-semibold text-slate-500">
                المدرسة العليا لأساتذة التعليم التكنولوجي سكيكدة
            </span>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6 leading-tight">
              فهم سلوك طفلك <br /> <span className="text-primary">خطوة نحو المستقبل</span>
            </h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              أداة تقييم شاملة تساعدك على فهم مستويات العدوانية لدى طفلك وتقديم التوجيه المناسب لبناء شخصية متوازنة.
            </p>
            <Link to="/assessment" className="inline-flex items-center bg-primary text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform">
              ابدأ التقييم الآن <ArrowRight className="mr-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Research & Contributors Section */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                  <BookOpen className="text-primary w-8 h-8" />
                  <span>فريق البحث والإعداد</span>
                </h2>
                <p className="text-slate-600 text-lg">
                  تم تطوير هذا التقييم بواسطة باحثين أكاديميين وتحت إشراف مختص لضمان الجودة العلمية.
                </p>
                <p className="text-slate-400 text-sm mt-1 font-mono ltr">
                  (Research & Contributors)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Authors Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-slate-100 flex flex-col items-center group">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                    <Users className="text-blue-600 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">الباحثون</h3>
                  <div className="space-y-2 text-lg text-slate-700 font-medium">
                    <p>ابراهيم الخليل مجاهد</p>
                    <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full my-2"></div>
                    <p>قروي عبدالرؤوف</p>
                  </div>
                </div>

                {/* Supervisor Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-slate-100 flex flex-col items-center group">
                  <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-100 transition">
                    <GraduationCap className="text-amber-600 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">إشراف</h3>
                  <div className="space-y-2 text-lg text-slate-700 font-medium flex-grow flex items-center">
                    <p className="mt-2">البروفيسور بلبكاي جمال</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 rounded-2xl text-center hover:shadow-md transition">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Activity size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">تحليل دقيق</h3>
                <p className="text-slate-600">50 سؤالاً تغطي 5 جوانب رئيسية من سلوك الطفل لتقديم تحليل شامل.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl text-center hover:shadow-md transition">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-success">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">سرية تامة</h3>
                <p className="text-slate-600">بياناتك ونتائج التقييم محمية بالكامل ولا يتم مشاركتها مع أي طرف ثالث.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl text-center hover:shadow-md transition">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-warning">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">توصيات مخصصة</h3>
                <p className="text-slate-600">احصل على نصائح وتوجيهات بناءً على مستوى العدوانية الذي يظهره التقييم.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Results & Feedback */}
        <div id="community-section">
            <CommunityFeedback />
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <p>&copy; 2026 نظام تقييم سلوك الطفل. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
