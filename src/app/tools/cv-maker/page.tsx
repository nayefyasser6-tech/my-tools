'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Download, Plus, Trash2, User, Briefcase, GraduationCap, Code, Sparkles, Loader2 } from 'lucide-react';

const localDict = {
  ar: {
    page_title: "صانع السيرة الذاتية", page_desc: "أدخل بياناتك الأساسية وحمل سيرتك فوراً.",
    personal_info: "المعلومات الأساسية", name: "الاسم الكامل", name_ph: "مثال: المعتصم بالله",
    job_title: "المسمى الوظيفي", job_title_ph: "مثال: مطور واجهات أمامية",
    email: "البريد الإلكتروني", phone: "رقم الهاتف",
    summary: "نبذة احترافية (بالذكاء الاصطناعي)", summary_ph: "اكتب مسمى وظيفي أو اختصار، واضغط تحسين بالذكاء الاصطناعي...",
    ai_btn: "توليد بالذكاء الاصطناعي", ai_loading: "جاري التوليد...",
    experience: "الخبرات العملية", company: "اسم الشركة", role: "المسمى الوظيفي", duration: "الفترة (مثال: 2020 - 2023)",
    education: "التعليم الأكاديمي", university: "الجامعة / المعهد", degree: "التخصص / الدرجة",
    skills: "المهارات (افصل بفاصلة)", skills_ph: "React, Next.js, Tailwind",
    add_exp: "إضافة خبرة", add_edu: "إضافة تعليم", download: "تحميل (PDF)"
  },
  en: {
    page_title: "CV Maker", page_desc: "Enter your core details and download instantly.",
    personal_info: "Basic Info", name: "Full Name", name_ph: "e.g., Al-Mutasim Billah",
    job_title: "Job Title", job_title_ph: "e.g., Frontend Developer",
    email: "Email", phone: "Phone",
    summary: "Professional Summary (AI)", summary_ph: "Type a title or brief idea, then click AI enhance...",
    ai_btn: "Generate with AI", ai_loading: "Generating...",
    experience: "Experience", company: "Company", role: "Role", duration: "Duration (e.g., 2020 - 2023)",
    education: "Education", university: "University", degree: "Degree",
    skills: "Skills (comma separated)", skills_ph: "React, Next.js, Tailwind",
    add_exp: "Add Experience", add_edu: "Add Education", download: "Download (PDF)"
  },
  tr: {
    page_title: "CV Oluşturucu", page_desc: "Temel bilgilerinizi girin ve hemen indirin.",
    personal_info: "Temel Bilgiler", name: "Ad Soyad", name_ph: "Örn: El-Mutasem",
    job_title: "Meslek", job_title_ph: "Örn: Frontend Geliştirici",
    email: "E-posta", phone: "Telefon",
    summary: "Profesyonel Özet (Yapay Zeka)", summary_ph: "Bir unvan yazın ve yapay zeka ile geliştirin...",
    ai_btn: "Yapay Zeka ile Üret", ai_loading: "Üretiliyor...",
    experience: "Deneyim", company: "Şirket", role: "Pozisyon", duration: "Süre (Örn: 2020 - 2023)",
    education: "Eğitim", university: "Üniversite", degree: "Derece",
    skills: "Yetenekler (Virgülle)", skills_ph: "React, Next.js, Tailwind",
    add_exp: "Deneyim Ekle", add_edu: "Deneyim Ekle", download: "İndir (PDF)"
  }
};

export default function CvMakerPage() {
  const { language } = useLanguage();
  const t = localDict[language] || localDict['ar'];

  const [data, setData] = useState({
    name: '', title: '', email: '', phone: '', summary: '',
    experience: [{ id: 1, company: '', role: '', duration: '' }],
    education: [{ id: 1, university: '', degree: '', duration: '' }],
    skills: ''
  });

  const [aiLoading, setAiLoading] = useState(false);

  const enhanceWithAI = async () => {
    if (!data.title && !data.summary) {
      alert("الرجاء كتابة المسمى الوظيفي أو فكرة أولاً ليقوم الذكاء الاصطناعي بصياغتها.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.summary || data.title, language: language })
      });
      const resData = await res.json();
      if (resData.result) {
        setData(prev => ({ ...prev, summary: resData.result }));
      } else {
        alert("فشل توليد النص من الذكاء الاصطناعي.");
      }
    } catch (e) {
      alert("حدث خطأ في الاتصال بالخادم.");
    }
    setAiLoading(false);
  };

  const handleDownload = () => window.print();

  return (
    <div className="min-h-screen pt-28 pb-10 px-4 md:px-8 relative z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #cv-preview, #cv-preview * { visibility: visible; }
          #cv-preview { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; background: white; }
          header, footer, .no-print { display: none !important; }
        }
      `}} />

      <div className="max-w-7xl mx-auto no-print text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">{t.page_title}</h1>
        <p className="text-gray-400 text-lg">{t.page_desc}</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 glass-dark p-6 rounded-3xl border border-white/10 shadow-xl space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar no-print">
          
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-2"><User className="w-5 h-5 text-pink-400" /> {t.personal_info}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder={t.name_ph} className="col-span-2 w-full bg-black/30 border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-pink-500 font-bold" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
              <input type="text" placeholder={t.job_title_ph} className="col-span-2 w-full bg-black/30 border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-pink-500" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
              <input type="email" placeholder={t.email} className="w-full bg-black/30 border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-pink-500" value={data.email} onChange={e => setData({...data, email: e.target.value})} dir="ltr"/>
              <input type="tel" placeholder={t.phone} className="w-full bg-black/30 border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-pink-500" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} dir="ltr"/>
            </div>

            {/* حقل النبذة المساعدة بالذكاء الاصطناعي */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-300">{t.summary}</label>
                <button 
                  onClick={enhanceWithAI} 
                  disabled={aiLoading}
                  className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
                  {aiLoading ? t.ai_loading : t.ai_btn}
                </button>
              </div>
              <textarea 
                placeholder={t.summary_ph} 
                rows={3} 
                className="w-full bg-black/30 border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-pink-500 resize-none" 
                value={data.summary} 
                onChange={e => setData({...data, summary: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <h3 className="text-xl font-black text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-400" /> {t.experience}</h3>
              <button onClick={() => setData({...data, experience: [...data.experience, { id: Date.now(), company: '', role: '', duration: '' }]})} className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"><Plus className="w-4 h-4"/> {t.add_exp}</button>
            </div>
            {data.experience.map((exp, i) => (
              <div key={exp.id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3 relative">
                <button onClick={() => setData({...data, experience: data.experience.filter(e => e.id !== exp.id)})} className="absolute top-3 left-3 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                <input type="text" placeholder={t.company} className="w-full bg-transparent border-b border-gray-700 text-white px-2 py-1 focus:border-pink-500 outline-none font-bold" value={exp.company} onChange={e => { const newExp = [...data.experience]; newExp[i].company = e.target.value; setData({...data, experience: newExp}); }} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder={t.role} className="w-full bg-transparent border-b border-gray-700 text-white px-2 py-1 focus:border-pink-500 outline-none" value={exp.role} onChange={e => { const newExp = [...data.experience]; newExp[i].role = e.target.value; setData({...data, experience: newExp}); }} />
                  <input type="text" placeholder={t.duration} className="w-full bg-transparent border-b border-gray-700 text-white px-2 py-1 focus:border-pink-500 outline-none text-sm" value={exp.duration} onChange={e => { const newExp = [...data.experience]; newExp[i].duration = e.target.value; setData({...data, experience: newExp}); }} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <h3 className="text-xl font-black text-white flex items-center gap-2"><GraduationCap className="w-5 h-5 text-pink-400" /> {t.education}</h3>
              <button onClick={() => setData({...data, education: [...data.education, { id: Date.now(), university: '', degree: '', duration: '' }]})} className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"><Plus className="w-4 h-4"/> {t.add_edu}</button>
            </div>
            {data.education.map((edu, i) => (
              <div key={edu.id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3 relative">
                <button onClick={() => setData({...data, education: data.education.filter(e => e.id !== edu.id)})} className="absolute top-3 left-3 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                <input type="text" placeholder={t.university} className="w-full bg-transparent border-b border-gray-700 text-white px-2 py-1 focus:border-pink-500 outline-none font-bold" value={edu.university} onChange={e => { const newEdu = [...data.education]; newEdu[i].university = e.target.value; setData({...data, education: newEdu}); }} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder={t.degree} className="w-full bg-transparent border-b border-gray-700 text-white px-2 py-1 focus:border-pink-500 outline-none" value={edu.degree} onChange={e => { const newEdu = [...data.education]; newEdu[i].degree = e.target.value; setData({...data, education: newEdu}); }} />
                  <input type="text" placeholder={t.duration} className="w-full bg-transparent border-b border-gray-700 text-white px-2 py-1 focus:border-pink-500 outline-none text-sm" value={edu.duration} onChange={e => { const newEdu = [...data.education]; newEdu[i].duration = e.target.value; setData({...data, education: newEdu}); }} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-2"><Code className="w-5 h-5 text-purple-400" /> {t.skills}</h3>
            <textarea placeholder={t.skills_ph} rows={2} className="w-full bg-black/30 border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-pink-500 resize-none" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center">
          <button onClick={handleDownload} className="btn-glowing w-full max-w-2xl py-4 rounded-xl font-extrabold text-white text-lg flex justify-center gap-2 mb-6 no-print shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Download className="w-6 h-6" /> {t.download}
          </button>

          <div id="cv-preview" className="bg-white w-full max-w-2xl aspect-[1/1.414] shadow-2xl p-10 md:p-14 text-gray-900 overflow-hidden relative">
            <div className="border-b-4 border-gray-900 pb-6 mb-8 text-center">
              <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 mb-2">{data.name || t.name}</h1>
              <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-4">{data.title || t.job_title}</h2>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-gray-600">
                {data.email && <span dir="ltr">{data.email}</span>}
                {data.email && data.phone && <span>•</span>}
                {data.phone && <span dir="ltr">{data.phone}</span>}
              </div>
            </div>

            {/* معاينة النبذة إذا كتبها المستخدم أو أولدها الذكاء الاصطناعي */}
            {data.summary && (
              <div className="mb-8">
                <p className="text-gray-700 font-medium leading-relaxed text-justify text-sm">
                  {data.summary}
                </p>
              </div>
            )}

            {data.experience[0].company && (
              <div className="mb-8">
                <h3 className="text-lg font-black uppercase tracking-wider border-b border-gray-300 pb-2 mb-4 text-gray-900">{t.experience}</h3>
                <div className="space-y-5">
                  {data.experience.map((exp, i) => exp.company && (
                    <div key={i} className="flex justify-between items-start">
                      <div><h4 className="font-bold text-gray-900">{exp.role}</h4><p className="text-gray-600 font-semibold">{exp.company}</p></div>
                      <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{exp.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.education[0].university && (
              <div className="mb-8">
                <h3 className="text-lg font-black uppercase tracking-wider border-b border-gray-300 pb-2 mb-4 text-gray-900">{t.education}</h3>
                <div className="space-y-4">
                  {data.education.map((edu, i) => edu.university && (
                    <div key={i} className="flex justify-between items-start">
                      <div><h4 className="font-bold text-gray-900">{edu.degree}</h4><p className="text-gray-600 font-semibold">{edu.university}</p></div>
                      <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{edu.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.skills && (
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider border-b border-gray-300 pb-2 mb-4 text-gray-900">{t.skills}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.split(',').map((skill, i) => (
                    <span key={i} className="bg-gray-900 text-white font-bold text-sm px-3 py-1 rounded">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}