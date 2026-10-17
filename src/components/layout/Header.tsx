"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '../LanguageProvider';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false); // حالة قائمة اللغات
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage, t } = useLanguage(); // استدعاء اللغات

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg z-50 transition-all duration-300 ${isMobileMenuOpen ? 'rounded-2xl' : 'rounded-2xl md:rounded-full'}`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg className="w-10 h-10 drop-shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#brandGradient)" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#brandGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-extrabold text-2xl tracking-wide text-white">{t('my_tools')}</span>
        </Link>

        {/* روابط التنقل الرئيسية */}
        <nav className="hidden md:flex gap-8 text-base font-bold text-gray-200">
          <Link href="/tools" className="hover:text-pink-400 transition-colors">{t('tools')}</Link>
          <Link href="/pricing" className="hover:text-purple-400 transition-colors">{t('pricing')}</Link>
          <Link href="/contact" className="hover:text-pink-400 transition-colors">{t('contact')}</Link>
        </nav>

        {/* الأزرار والإعدادات */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* زر اللغات المنسدل */}
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 text-gray-300 hover:text-pink-400 font-bold transition-colors uppercase"
            >
              {language}
              <svg className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* القائمة المنسدلة للغات */}
            {isLangMenuOpen && (
              <div className="absolute top-full mt-4 right-0 w-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden flex flex-col shadow-xl z-50">
                <button onClick={() => { setLanguage('ar'); setIsLangMenuOpen(false); }} className={`px-4 py-3 text-sm font-bold text-center hover:bg-white/10 transition-colors ${language === 'ar' ? 'text-pink-400 bg-white/5' : 'text-white'}`}>عربي</button>
                <button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className={`px-4 py-3 text-sm font-bold text-center hover:bg-white/10 transition-colors border-y border-white/5 ${language === 'en' ? 'text-pink-400 bg-white/5' : 'text-white'}`}>English</button>
                <button onClick={() => { setLanguage('tr'); setIsLangMenuOpen(false); }} className={`px-4 py-3 text-sm font-bold text-center hover:bg-white/10 transition-colors ${language === 'tr' ? 'text-pink-400 bg-white/5' : 'text-white'}`}>Türkçe</button>
              </div>
            )}
          </div>

          {user ? (
            <button onClick={handleLogout} className="btn-glowing px-8 py-2.5 rounded-full text-sm font-bold block text-center">
              {t('logout')}
            </button>
          ) : (
            <Link href="/login" className="btn-glowing px-8 py-2.5 rounded-full text-sm font-bold block text-center">
              {t('login')}
            </Link>
          )}
        </div>

        {/* زر القائمة للموبايل */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 bg-white/10 rounded-lg text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* --- القائمة المنسدلة للموبايل --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 border-t border-white/10 flex flex-col gap-4">
          <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-pink-400 font-bold block">{t('tools')}</Link>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-pink-400 font-bold block">{t('pricing')}</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-pink-400 font-bold block">{t('contact')}</Link>
          
          <div className="flex items-center justify-center gap-4 mt-2 pt-4 border-t border-white/5">
            <button onClick={() => setLanguage('ar')} className={`font-bold px-3 py-1 rounded-lg ${language === 'ar' ? 'bg-pink-500/20 text-pink-400' : 'text-gray-300'}`}>AR</button>
            <button onClick={() => setLanguage('en')} className={`font-bold px-3 py-1 rounded-lg ${language === 'en' ? 'bg-pink-500/20 text-pink-400' : 'text-gray-300'}`}>EN</button>
            <button onClick={() => setLanguage('tr')} className={`font-bold px-3 py-1 rounded-lg ${language === 'tr' ? 'bg-pink-500/20 text-pink-400' : 'text-gray-300'}`}>TR</button>
          </div>
          
          {user ? (
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all text-center mt-2">
              {t('logout')}
            </button>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all text-center mt-2">
              {t('login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}