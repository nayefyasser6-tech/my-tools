"use client";
import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabase'; // تأكد من مسار الاستيراد

export default function TestimonialsSection() {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // جلب التعليقات عند تحميل الصفحة
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setLoading(true);
    
    await supabase.from('comments').insert([{ name, message }]);
    
    setName("");
    setMessage("");
    fetchComments(); // تحديث القائمة بعد الإضافة
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-20" dir="rtl">
      {/* نموذج إضافة تعليق */}
      <div className="glass-dark p-8 rounded-3xl bg-[#1a0b2e]/80 border border-white/10">
        <h3 className="text-2xl font-bold mb-6 text-white">اترك تعليقك</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">الاسم الكريم</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm">رأيك يهمنا</label>
            <textarea 
              value={message} onChange={(e) => setMessage(e.target.value)} required rows={4}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none resize-none"
            ></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90">
            {loading ? "جاري الإرسال..." : "إرسال التعليق"}
          </button>
        </form>
      </div>

      {/* قائمة التعليقات مع Scroll */}
      <div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
          <div key={comment.id} className="glass-dark p-6 rounded-2xl bg-white/5 border border-white/10 relative">
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">{comment.message}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500"></div>
              <span className="font-bold text-white">{comment.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}