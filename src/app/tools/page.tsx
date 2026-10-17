"use client";

import Link from 'next/link';
 import { useLanguage } from '@/components/LanguageProvider';

export default function ToolsPage() {
  const { t, language } = useLanguage();

  // المصفوفة أصبحت داخل الدالة لتقرأ دالة الترجمة t
  const tools = [
    {
      id: 'word-to-pdf',
      title: t('tool_word2pdf_title'),
      description: t('tool_word2pdf_desc'),
      icon: (
        <svg className="w-10 h-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
      ),
      href: '/tools/word-to-pdf'
    },
    {
      id: 'pdf-tools',
      title: t('tool_pdf_title'),
      description: t('tool_pdf_desc'),
      icon: (
        <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" /></svg>
      ),
      href: '/tools/pdf-manager'
    },
    {
      id: 'remove-bg',
      title: t('tool_bg_title'),
      description: t('tool_bg_desc'),
      icon: (
        <svg className="w-10 h-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
      ),
      href: '/tools/remove-bg'
    },
    {
      id: 'cv-maker',
      title: t('tool_cv_title'),
      description: t('tool_cv_desc'),
      icon: (
        <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
      ),
      href: '/tools/cv-maker'
    }
  ];

  return (
    <section className="min-h-screen py-32 px-6 relative z-10 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500">
            {t('tools_page_title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.href} className="group flex">
              <div className="glass-dark hover-glow-dark rounded-2xl p-8 h-full w-full flex flex-col transition-all duration-300 cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-pink-500/20 transition-all"></div>
                
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 w-fit group-hover:border-pink-500/30 transition-colors">
                  {tool.icon}
                </div>
                
                <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:text-pink-300 transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-gray-300 font-medium leading-relaxed flex-1 whitespace-normal">
                  {tool.description}
                </p>

                <div className="mt-6 flex items-center text-pink-400 font-bold group-hover:text-pink-300">
                  <span>{t('start_using')}</span>
                  {/* تغيير اتجاه السهم عند التمرير حسب اللغة */}
                  <svg className={`w-5 h-5 ${language === 'ar' ? 'mr-2 group-hover:-translate-x-2' : 'ml-2 group-hover:translate-x-2'} transform transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={language === 'ar' ? "M10 19l-7-7m0 0l7-7m-7 7h18" : "M14 5l7 7m0 0l-7 7m7-7H3"} />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}