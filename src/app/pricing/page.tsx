"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createCheckoutSession } from "@/app/actions/checkout";
import { createBrowserClient } from '@supabase/ssr';
import { useLanguage } from '@/components/LanguageProvider';

export default function PricingPage() {
  const { t, language } = useLanguage();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [planType, setPlanType] = useState<string>("free");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan_type')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setPlanType(profile.plan_type);
        }
      }
      setLoadingAuth(false);
    };

    fetchUserData();
  }, [supabase]);

  const handleSubscribe = async () => {
    setCheckoutLoading(true);
    try {
      const response = await createCheckoutSession(user.id);
      if (response?.url) {
        window.location.href = response.url;
      } else if (response?.error) {
        alert(response.error); 
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الاتصال بالسيرفر.");
    }
    setCheckoutLoading(false);
  };

  return (
    <section className="min-h-screen py-32 px-6 relative z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500">
            {t('pricing_main_title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          
          {/* الخطة المحدودة */}
          <div className="glass-dark rounded-3xl p-8 lg:p-10 flex flex-col relative overflow-hidden border-t-4 border-t-gray-500/30">
            <h3 className="text-3xl font-extrabold text-white mb-2">{t('plan_basic')}</h3>
            <p className="text-gray-300 font-medium mb-6">{t('plan_basic_desc')}</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">{t('free_limited')}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-purple-400 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_pdf_free')}
              </li>
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-purple-400 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_bg_free')}
              </li>
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-purple-400 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_cv_free')}
              </li>
            </ul>
            
            {loadingAuth ? (
              <div className="w-full bg-gray-800/20 border border-gray-700/30 text-gray-500 font-bold py-3 px-4 rounded-xl flex justify-center items-center animate-pulse">
                {t('checking')}
              </div>
            ) : !user ? (
              <Link href="/login" className="w-full bg-transparent border border-gray-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-white/5 transition-colors flex justify-center items-center">
                {t('register_free')}
              </Link>
            ) : planType === 'free' ? (
              <button disabled className="w-full bg-green-500/10 border border-green-500/50 text-green-400 font-bold py-3 px-4 rounded-xl flex justify-center items-center cursor-default">
                {t('current_plan')}
              </button>
            ) : (
              <button disabled className="w-full bg-gray-800/50 border border-gray-700 text-gray-500 font-bold py-3 px-4 rounded-xl flex justify-center items-center cursor-default">
                {t('available_to_all')}
              </button>
            )}
          </div>

          {/* الخطة الاحترافية */}
          <div className="glass-dark hover-glow-dark rounded-3xl p-8 lg:p-10 flex flex-col relative overflow-hidden border-t-4 border-t-pink-500">
            <div className={`absolute top-5 ${language === 'ar' ? 'left-5' : 'right-5'} bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 rounded-full text-xs font-bold text-white`}>
              {t('pro_badge')}
            </div>
            <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">{t('plan_pro')}</h3>
            <p className="text-gray-300 font-medium mb-6">{t('plan_pro_desc')}</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">$25</span>
              <span className={`text-gray-400 ${language === 'ar' ? 'ml-2' : 'mr-2'}`}>{t('monthly')}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-pink-500 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_word2pdf')}
              </li>
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-pink-500 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_pdf_pro')}
              </li>
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-pink-500 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_bg_pro')}
              </li>
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-pink-500 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_cv_pro')}
              </li>
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-pink-500 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_cloud')}
              </li>
              <li className="flex items-center text-gray-200 font-medium">
                <svg className={`w-5 h-5 text-pink-500 ${language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('feat_support')}
              </li>
            </ul>
            
            {loadingAuth ? (
              <div className="w-full bg-gray-800/20 border border-gray-700/30 text-gray-500 font-bold py-4 rounded-xl flex justify-center items-center animate-pulse">
                {t('checking')}
              </div>
            ) : !user ? (
              <Link href="/login" className="btn-glowing w-full py-4 rounded-xl font-extrabold text-white text-lg transition-transform text-center block">
                {t('login_to_subscribe')}
              </Link>
            ) : planType === 'pro' ? (
              <button disabled className="w-full bg-green-500/10 border border-green-500/50 text-green-400 text-lg font-bold py-4 rounded-xl flex justify-center items-center cursor-default">
                {t('current_plan')}
              </button>
            ) : (
              <button 
                onClick={handleSubscribe} 
                disabled={checkoutLoading}
                className="btn-glowing w-full py-4 rounded-xl font-extrabold text-white text-lg transition-transform text-center block disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? t('preparing') : t('subscribe_now')}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}