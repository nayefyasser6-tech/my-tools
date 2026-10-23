"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { t } = useLanguage();
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;
    setIsSubmitting(true);
    
    await supabase.from('comments').insert([{ name: commentName, message: commentText }]);
    
    setCommentName("");
    setCommentText("");
    fetchComments();
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden text-white">
      
      {/* القسم 1: Hero */}
      <section className="relative h-screen w-full flex items-center justify-center text-center px-4 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-70"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/10 z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center mt-20">
          {/* تم إضافة pb-4 و leading-relaxed لحل مشكلة قص الحروف العربية */}
          <h1 className="text-6xl md:text-8xl font-black leading-relaxed pb-4 mb-6 drop-shadow-lg tracking-tight">
            {t('hero_t1')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 inline-block pb-4">
              {t('hero_t2')}
            </span>
          </h1>
        </div>
      </section>

      {/* القسم 2: التعريف والروابط */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="glass-dark p-8 md:p-14 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-10 pb-2 leading-relaxed text-white drop-shadow-md">
            {t('s2_title')}
          </h2>
          
          <div className="text-base md:text-xl text-gray-300 mb-12 max-w-5xl mx-auto leading-loose text-justify font-medium space-y-6">
            <p>{t('s2_p1')}</p>
            <p>{t('s2_p2')}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <Link href="/tools" className="btn-glowing px-12 py-4 rounded-xl text-lg font-bold">
              {t('btn_explore')}
            </Link>
            <Link href="/pricing" className="bg-white/10 text-pink-300 border border-pink-400/30 hover:border-pink-400 hover:bg-white/20 px-12 py-4 rounded-xl text-lg font-bold transition-all backdrop-blur-md">
              {t('btn_sub')}
            </Link>
          </div>
        </div>
      </section>

      {/* القسم 3: الأسئلة الشائعة */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 pb-2 leading-relaxed text-white drop-shadow-md">{t('faq_title')}</h2>
          <p className="text-lg text-pink-300 leading-relaxed pb-2">{t('faq_sub')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { q: t('faq1_q'), a: t('faq1_a') },
            { q: t('faq2_q'), a: t('faq2_a') },
            { q: t('faq3_q'), a: t('faq3_a') },
            { q: t('faq4_q'), a: t('faq4_a') }
          ].map((faq, idx) => (
            <div key={idx} className="glass-dark hover-glow-dark p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/30"></div>
              <h3 className="font-extrabold text-xl mb-4 pb-2 leading-relaxed text-white flex items-start gap-3">
                <span className="text-pink-400 mt-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </span>
                {faq.q}
              </h3>
              <p className="text-gray-300 font-medium leading-relaxed pr-9 border-t border-white/10 pt-4">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* القسم 4: آراء العملاء */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10" id="testimonials">
        <h2 className="text-4xl font-extrabold mb-12 pb-2 leading-relaxed text-center text-white drop-shadow-md">{t('test_title') || "آراء العملاء"}</h2>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* قائمة التعليقات الديناميكية */}
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {comments.length > 0 ? comments.map((review, idx) => (
              <div key={idx} className="glass-dark p-8 border-r-4 border-r-pink-500 rounded-2xl">
                <p className="text-gray-200 text-lg mb-6 font-medium leading-relaxed">{review.message}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                  </div>
                </div>
              </div>
            )) : (
              <div className="glass-dark p-8 text-center rounded-2xl border border-white/10">
                <p className="text-gray-400 font-medium">{t('no_comments') || "كن أول من يشاركنا رأيه!"}</p>
              </div>
            )}
          </div>

          {/* نموذج إضافة تعليق */}
          <div className="glass-dark p-10 bg-[#1a0b2e]/60 rounded-3xl">
            <h3 className="text-3xl font-bold mb-8 pb-2 leading-relaxed text-white">{t('leave_comment')}</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 font-bold mb-3">{t('name_label')}</label>
                <input 
                  type="text" 
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg placeholder-gray-500"
                  placeholder={t('name_ph')}
                />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-3">{t('text_label')}</label>
                <textarea 
                  required
                  rows={5}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg resize-none placeholder-gray-500"
                  placeholder={t('text_ph')}
                ></textarea>
              </div>
              <button disabled={isSubmitting} type="submit" className="btn-glowing w-full py-4 rounded-xl text-lg font-bold disabled:opacity-70">
                {isSubmitting ? (t('sending') || "جاري الإرسال...") : (t('send_btn') || "إرسال التعليق")}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* القسم 5: الشريط المتحرك */}
      <section className="py-20 w-full overflow-hidden border-y border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="w-full relative flex items-center">
          <div className="animate-marquee flex gap-16 whitespace-nowrap px-8 items-center">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-4xl font-black text-white/20 hover:text-pink-400 transition-colors cursor-default">Next.js 14</span>
                <span className="text-4xl font-black text-white/20 hover:text-purple-400 transition-colors cursor-default">TypeScript</span>
                <span className="text-4xl font-black text-white/20 hover:text-pink-400 transition-colors cursor-default">Tailwind CSS</span>
                <span className="text-4xl font-black text-white/20 hover:text-purple-400 transition-colors cursor-default">Prisma ORM</span>
                <span className="text-4xl font-black text-white/20 hover:text-pink-400 transition-colors cursor-default">Supabase</span>
                <span className="text-4xl font-black text-white/20 hover:text-purple-400 transition-colors cursor-default">React</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}