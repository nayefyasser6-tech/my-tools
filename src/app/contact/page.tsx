"use client";

import React, { useState } from "react";
import { useLanguage } from '../../components/LanguageProvider';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ContactPage() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const translations = {
    ar: {
      contact_title: "تواصل معنا",
      name_label: "الاسم الكريم",
      name_ph: "أدخل اسمك هنا",
      contact_email_label: "البريد الإلكتروني",
      contact_email_ph: "example@email.com",
      text_label: "رأيك يهمنا",
      contact_msg_ph: "اكتب رسالتك هنا...",
      contact_send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      alert_msg: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.",
      error_msg: "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً."
    },
    en: {
      contact_title: "Contact Us",
      name_label: "Your Name",
      name_ph: "Enter your name here",
      contact_email_label: "Email Address",
      contact_email_ph: "example@email.com",
      text_label: "Your Message",
      contact_msg_ph: "Write your message here...",
      contact_send: "Send Message",
      sending: "Sending...",
      alert_msg: "Your message has been sent successfully! We will contact you soon.",
      error_msg: "An error occurred while sending. Please try again later."
    },
    tr: {
      contact_title: "Bize Ulaşın",
      name_label: "Adınız",
      name_ph: "Adınızı buraya girin",
      contact_email_label: "E-posta Adresi",
      contact_email_ph: "example@email.com",
      text_label: "Mesajınız",
      contact_msg_ph: "Mesajınızı buraya yazın...",
      contact_send: "Mesaj Gönder",
      sending: "Gönderiliyor...",
      alert_msg: "Mesajınız başarıyla gönderildi! Yakında sizinle iletişime geçeceğiz.",
      error_msg: "Gönderim sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    }
  };

  // @ts-ignore
  const t = translations[language] || translations.ar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // 1. الحفظ الأساسي في Supabase أولاً وضمان نجاحه
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{ 
          name: name.trim(), 
          email: email.trim(), 
          message: message.trim() 
        }]);

      if (dbError) {
        console.error("Database Error:", dbError);
        throw new Error("حدث خطأ أثناء الحفظ في قاعدة البيانات");
      }

      // 2. إرسال الـ Webhook في الخلفية (إذا فشل أو كان localhost لا يوقف نجاح الرسالة)
      try {
        fetch('https://thin-trains-move.loca.lt/webhook/38432fb3-e760-4768-aab3-4f6916aa9a47', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
        }).catch(err => console.log("Webhook background error ignored:", err));
      } catch (webhookErr) {
        console.log("Webhook skipped");
      }
      
      // 3. نجاح العملية وتفريغ الحقول فوراً
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="min-h-screen py-32 px-6 relative z-10 flex items-center justify-center text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto w-full mt-4">
        <div className="glass-dark p-8 md:p-14 rounded-3xl bg-[#1a0b2e]/80 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          {status === "success" && (
            <div className="mb-8 w-full bg-pink-500/10 border border-pink-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all animate-pulse">
              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="font-bold text-lg text-pink-100">{t.alert_msg}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-8 w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all">
              <div className="w-10 h-10 shrink-0 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              <p className="font-bold text-lg text-red-100">{t.error_msg}</p>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-black mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 leading-relaxed pb-4">
            {t.contact_title}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-gray-300 font-bold mb-3">{t.name_label}</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                disabled={status === "loading"}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg placeholder-gray-500 disabled:opacity-50"
                placeholder={t.name_ph}
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-3">{t.contact_email_label}</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg placeholder-gray-500 disabled:opacity-50"
                placeholder={t.contact_email_ph}
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-3">{t.text_label}</label>
              <textarea 
                required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading"}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg resize-none placeholder-gray-500 disabled:opacity-50"
                placeholder={t.contact_msg_ph}
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="btn-glowing w-full py-4 rounded-xl text-lg font-bold mt-4 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-3"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.sending}
                </>
              ) : (
                t.contact_send
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}