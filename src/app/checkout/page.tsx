'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("يرجى الموافقة على شروط الاستخدام أولاً.");
      return;
    }
    setIsSubmitting(true);
    // سيتم استبدال هذا لاحقاً بـ Stripe أو بوابة الدفع
    setTimeout(() => {
      alert("تمت محاكاة عملية الدفع بنجاح!");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <section className="min-h-screen py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* زر العودة */}
        <div className="mb-8">
          <Link href="/pricing" className="text-gray-400 hover:text-white flex items-center gap-2 w-fit transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            العودة للخطط
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* العمود الأيمن: نموذج بيانات الدفع (8 أعمدة) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* قسم بيانات الفوترة */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">بيانات الفوترة (Billing information)</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">الاسم الكامل (Full name)</label>
                  <input type="text" required className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner" />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">الدولة / المنطقة (Country or region)</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner appearance-none [&>option]:bg-[#1a0b2e]">
                    <option value="SA">المملكة العربية السعودية</option>
                    <option value="AE">الإمارات العربية المتحدة</option>
                    <option value="TR">تركيا (Türkiye)</option>
                    <option value="EG">مصر</option>
                    <option value="JO">الأردن</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">العنوان (Address)</label>
                  <input type="text" required className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner" />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">اسم الشركة (Business name) - اختياري</label>
                  <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner" placeholder="Company (optional)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">نوع المعرّف الضريبي</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner [&>option]:bg-[#1a0b2e]">
                      <option>TIN (الرقم الضريبي)</option>
                      <option>VAT (القيمة المضافة)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">الرقم الضريبي (Tax ID)</label>
                    <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner" placeholder="0123456789 (اختياري)" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* قسم بيانات البطاقة */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">طريقة الدفع (Payment method)</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">رقم البطاقة (Card number)</label>
                  <div className="relative">
                    <input type="text" required maxLength={19} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner dir-ltr text-right" placeholder="1234 1234 1234 1234" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-80">
                      <div className="w-8 h-5 bg-blue-600 rounded text-[8px] font-bold flex items-center justify-center text-white">VISA</div>
                      <div className="w-8 h-5 bg-orange-500 rounded text-[8px] font-bold flex items-center justify-center text-white">MC</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">تاريخ الانتهاء</label>
                    <input type="text" required maxLength={5} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner dir-ltr text-right" placeholder="MM / YY" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">رمز الأمان (CVC)</label>
                    <input type="text" required maxLength={4} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-pink-500 transition-all shadow-inner dir-ltr text-right" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* العمود الأيسر: ملخص الطلب (4 أعمدة) */}
          <div className="lg:col-span-4">
            <div className="glass-dark rounded-3xl p-8 border border-white/10 sticky top-32 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
              <h2 className="text-3xl font-extrabold text-white mb-8">خطة المحترفين</h2>
              
              <div className="space-y-4 mb-6 text-gray-300 font-medium border-b border-white/10 pb-6">
                <div className="flex justify-between">
                  <span>الاشتراك الشهري</span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة (Tax)</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-white">الإجمالي المستحق اليوم</span>
                <span className="text-2xl font-black text-pink-400">$25.00</span>
              </div>

              {/* تنبيه التجديد التلقائي */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex gap-3 text-sm text-gray-300 leading-relaxed">
                <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>سيتم تجديد اشتراكك تلقائياً كل شهر. سيتم خصم مبلغ $25.00 شهرياً.</p>
              </div>

              {/* الموافقة على الشروط */}
              <label className="flex gap-3 items-start mb-8 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input type="checkbox" className="peer sr-only" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <div className="w-5 h-5 rounded border-2 border-gray-500 peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-colors"></div>
                  <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  أنت توافق على أن نقوم بخصم المبلغ المذكور أعلاه الآن وبشكل متكرر شهرياً حتى تقوم بالإلغاء وفقاً لـ <Link href="#" className="text-pink-400 hover:underline">الشروط والأحكام</Link>. يمكنك الإلغاء في أي وقت من إعدادات حسابك.
                </span>
              </label>

              <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-extrabold text-white text-lg transition-all ${isSubmitting || !agreed ? 'bg-gray-600 cursor-not-allowed' : 'btn-glowing hover:-translate-y-1'}`}>
                {isSubmitting ? 'جاري المعالجة...' : 'تأكيد الاشتراك (Subscribe)'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </section>
  );
}