"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* تأثيرات لونية في الخلفية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
      
      <div className={`max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
        
        {/* قسم حول الموقع */}
        <div>
          <div className={`flex items-center justify-center ${language === 'ar' ? 'md:justify-start' : 'md:justify-start'} gap-2 mb-6`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"></div>
            <span className="font-extrabold text-2xl text-slate-900">{t('my_tools')}</span>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">
            {t('footer_desc')}
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3 className="font-bold text-xl text-slate-900 mb-6">{t('quick_links')}</h3>
          <ul className="space-y-4 text-slate-600 font-medium">
            <li><Link href="/tools" className="hover:text-pink-600 transition-colors">{t('all_tools')}</Link></li>
            <li><Link href="/pricing" className="hover:text-purple-600 transition-colors">{t('pricing_plans')}</Link></li>
            <li><Link href="/contact" className="hover:text-pink-600 transition-colors">{t('contact')}</Link></li>
          </ul>
        </div>

        {/* قانوني */}
        <div>
          <h3 className="font-bold text-xl text-slate-900 mb-6">{t('legal')}</h3>
          <ul className="space-y-4 text-slate-600 font-medium">
            {/* تم تحديث الرابط هنا */}
            <li>
              <Link href="/privacy-policy" className="hover:text-pink-600 transition-colors">
                {t('privacy_policy')}
              </Link>
            </li>
            {/* تم تحديث الرابط هنا */}
            <li>
              <Link href="/terms-of-use" className="hover:text-purple-600 transition-colors">
                {t('terms_of_use')}
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="mt-16 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-400 font-medium">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
}