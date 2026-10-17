"use client";

import React, { useState } from "react";
import { useLanguage } from '../../components/LanguageProvider';

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('alert_msg'));
  };

  return (
    <section className="min-h-screen py-32 px-6 relative z-10 flex items-center justify-center text-white">
      <div className="max-w-3xl mx-auto w-full">
        <div className="glass-dark p-10 md:p-14 rounded-3xl bg-[#1a0b2e]/60 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500">
            {t('contact_title')}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-gray-300 font-bold mb-3">{t('name_label')}</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg placeholder-gray-500"
                placeholder={t('name_ph')}
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-3">{t('contact_email_label')}</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg placeholder-gray-500"
                placeholder={t('contact_email_ph')}
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-3">{t('text_label')}</label>
              <textarea 
                required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all text-lg resize-none placeholder-gray-500"
                placeholder={t('contact_msg_ph')}
              ></textarea>
            </div>
            <button type="submit" className="btn-glowing w-full py-4 rounded-xl text-lg font-bold mt-4">
              {t('contact_send')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}