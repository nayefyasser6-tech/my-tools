"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../components/LanguageProvider';
import { ArrowRight, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

const translations = {
  ar: {
    back: "العودة للرئيسية",
    title: "شروط الاستخدام",
    updated: "آخر تحديث: أكتوبر 2026",
    intro: "مرحباً بك في 'أدواتي'. من خلال الوصول إلى موقعنا واستخدام أدواته، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.",
    plansTitle: "1. خطط الخدمة والاستخدام العادل",
    freePlanTitle: "الخطة المجانية:",
    freePlanDesc: "تتيح لك الخطة المجانية استخدام الأدوات ضمن حدود يومية لضمان استقرار الخوادم لجميع المستخدمين:",
    freeFeatures: [
      "دمج وضغط ملفين PDF: 3 ملفات يومياً.",
      "إزالة خلفية الصور: صورتين فقط يومياً.",
      "إنشاء سيرة ذاتية: سيرة واحدة مجانية.",
      "تحويل Word إلى PDF أو العكس: ملفين يومياً."
    ],
    proPlanTitle: "الخطة المدفوعة (Pro - 25$):",
    proPlanDesc: "تمنحك الخطة المدفوعة وصولاً غير محدود لجميع الميزات المتقدمة:",
    proFeatures: [
      "تحويل غير محدود لملفات Word إلى PDF والعكس.",
      "استخدام غير محدود لأدوات دمج، ضغط، وتوقيع PDF.",
      "إزالة خلفية الصور لا محدودة بدقة تصل إلى 4K.",
      "إنشاء سيرة ذاتية بلا حدود وبدون أي علامات مائية.",
      "تخزين سحابي مؤقت وآمن لمعالجة ملفاتك.",
      "أولوية في الدعم الفني على مدار الساعة (24/7)."
    ],
    obligationsTitle: "2. التزامات المستخدم",
    obligationsDesc: "أنت توافق على عدم استخدام الموقع لمعالجة ملفات تحتوي على فيروسات، برامج ضارة، أو محتوى غير قانوني. يمنع منعاً باتاً محاولة اختراق الموقع أو إساءة استخدام الخوادم. أنت المسؤول الوحيد عن المحتوى الذي ترفعه.",
    ipTitle: "3. الملكية الفكرية",
    ipDesc: "جميع حقوق التصميم، الأكواد البرمجية، والشعارات تعود لمالك منصة 'أدواتي'. يُمنع نسخ أو إعادة استخدام أي جزء من الموقع دون إذن كتابي مسبق.",
    liabilityTitle: "4. حدود المسؤولية",
    liabilityDesc: "يتم تقديم الخدمات 'كما هي'. نحن نبذل قصارى جهدنا لضمان دقة النتائج، ولكننا لا نتحمل المسؤولية عن أي انقطاع مؤقت للخدمة أو فقدان للبيانات الناتج عن ظروف خارجة عن إرادتنا.",
    changesTitle: "5. تعديل الشروط",
    changesDesc: "نحتفظ بالحق في تحديث هذه الشروط في أي وقت. استمرارك في استخدام الموقع بعد نشر التعديلات يعني موافقتك على الشروط الجديدة."
  },
  en: {
    back: "Back to Home",
    title: "Terms of Use",
    updated: "Last Updated: October 2026",
    intro: "Welcome to 'My Tools'. By accessing our site and using its tools, you agree to be bound by the following terms and conditions. Please read them carefully.",
    plansTitle: "1. Service Plans & Fair Use",
    freePlanTitle: "Free Plan:",
    freePlanDesc: "The Free Plan allows you to use the tools within daily limits to ensure server stability for all users:",
    freeFeatures: [
      "Merge & compress PDFs: 3 files per day.",
      "Background removal: 2 images only per day.",
      "CV Builder: 1 free CV.",
      "Word to PDF or PDF to Word: 2 files per day."
    ],
    proPlanTitle: "Pro Plan ($25):",
    proPlanDesc: "The Pro Plan grants you unlimited access to all advanced features:",
    proFeatures: [
      "Unlimited Word to PDF and PDF to Word conversions.",
      "Unlimited use of PDF merge, compress, and sign tools.",
      "Unlimited background removal with up to 4K resolution.",
      "Unlimited CV creation with no watermarks.",
      "Secure temporary cloud storage for processing your files.",
      "Priority 24/7 technical support."
    ],
    obligationsTitle: "2. User Obligations",
    obligationsDesc: "You agree not to use the site to process files containing viruses, malware, or illegal content. Hacking attempts or server abuse are strictly prohibited. You are solely responsible for the content you upload.",
    ipTitle: "3. Intellectual Property",
    ipDesc: "All rights to the design, code, and logos belong to the owner of 'My Tools'. Copying or reusing any part of the site without prior written permission is prohibited.",
    liabilityTitle: "4. Limitation of Liability",
    liabilityDesc: "Services are provided 'as is'. We strive to ensure accuracy, but we are not liable for any temporary service interruptions or data loss resulting from circumstances beyond our control.",
    changesTitle: "5. Modifications to Terms",
    changesDesc: "We reserve the right to update these terms at any time. Your continued use of the site after modifications are posted signifies your acceptance of the new terms."
  },
  tr: {
    back: "Ana Sayfaya Dön",
    title: "Kullanım Şartları",
    updated: "Son Güncelleme: Ekim 2026",
    intro: "'Araçlarım'a hoş geldiniz. Sitemize erişerek ve araçlarını kullanarak aşağıdaki şart ve koşullara bağlı kalmayı kabul etmiş olursunuz. Lütfen dikkatlice okuyun.",
    plansTitle: "1. Hizmet Planları ve Adil Kullanım",
    freePlanTitle: "Ücretsiz Plan:",
    freePlanDesc: "Ücretsiz Plan, tüm kullanıcılar için sunucu istikrarını sağlamak amacıyla araçları günlük sınırlar dahilinde kullanmanıza olanak tanır:",
    freeFeatures: [
      "PDF birleştirme ve sıkıştırma: Günde 3 dosya.",
      "Arka plan kaldırma: Günde sadece 2 resim.",
      "CV Oluşturucu: 1 ücretsiz CV.",
      "Word'den PDF'ye veya PDF'den Word'e: Günde 2 dosya."
    ],
    proPlanTitle: "Pro Plan (25$):",
    proPlanDesc: "Pro Plan, tüm gelişmiş özelliklere sınırsız erişim sağlar:",
    proFeatures: [
      "Sınırsız Word'den PDF'ye ve PDF'den Word'e dönüştürme.",
      "PDF birleştirme, sıkıştırma ve imzalama araçlarının sınırsız kullanımı.",
      "4K çözünürlüğe kadar sınırsız arka plan kaldırma.",
      "Filigransız sınırsız CV oluşturma.",
      "Dosyalarınızı işlemek için güvenli geçici bulut depolama.",
      "7/24 öncelikli teknik destek."
    ],
    obligationsTitle: "2. Kullanıcı Yükümlülükleri",
    obligationsDesc: "Siteyi virüs, kötü amaçlı yazılım veya yasa dışı içerik barındıran dosyaları işlemek için kullanmamayı kabul edersiniz. Hackleme girişimleri veya sunucu suistimali kesinlikle yasaktır. Yüklediğiniz içerikten yalnızca siz sorumlusunuz.",
    ipTitle: "3. Fikri Mülkiyet",
    ipDesc: "Tasarım, kod ve logolarla ilgili tüm haklar 'Araçlarım'ın sahibine aittir. Önceden yazılı izin alınmadan sitenin herhangi bir bölümünün kopyalanması veya yeniden kullanılması yasaktır.",
    liabilityTitle: "4. Sorumluluğun Sınırlandırılması",
    liabilityDesc: "Hizmetler 'olduğu gibi' sunulmaktadır. Doğruluğu sağlamak için çaba gösteriyoruz, ancak kontrolümüz dışındaki koşullardan kaynaklanan geçici hizmet kesintilerinden veya veri kaybından sorumlu değiliz.",
    changesTitle: "5. Şartlarda Değişiklik",
    changesDesc: "Bu şartları her zaman güncelleme hakkımızı saklı tutarız. Değişiklikler yayınlandıktan sonra siteyi kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir."
  }
};

export default function TermsOfUse() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ar;
  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e0538] via-[#31135e] to-[#1e0538] text-white py-16 px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-purple-300 hover:text-pink-400 transition-colors mb-8 group">
          {isRtl ? <ArrowRight className="w-5 h-5 ml-2 transform group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />}
          {t.back}
        </Link>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <FileText className="w-12 h-12 text-pink-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
            {t.title}
          </h1>
          <p className="text-purple-200">{t.updated}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 text-purple-100 leading-relaxed text-lg">
          <p className="text-xl text-white font-medium mb-6">{t.intro}</p>

          {/* قسم الخطط */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">{t.plansTitle}</h2>
            
            <div className="space-y-6">
              {/* الخطة المجانية */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-pink-300 mb-2">{t.freePlanTitle}</h3>
                <p className="mb-4 text-purple-200">{t.freePlanDesc}</p>
                <ul className="space-y-2">
                  {t.freeFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* الخطة المدفوعة */}
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-6 border border-pink-500/30">
                <h3 className="text-xl font-bold text-pink-400 mb-2">{t.proPlanTitle}</h3>
                <p className="mb-4 text-purple-100">{t.proPlanDesc}</p>
                <ul className="space-y-2">
                  {t.proFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t.obligationsTitle}</h2>
            <p>{t.obligationsDesc}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t.ipTitle}</h2>
            <p>{t.ipDesc}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t.liabilityTitle}</h2>
            <p>{t.liabilityDesc}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t.changesTitle}</h2>
            <p>{t.changesDesc}</p>
          </section>
        </div>
      </div>
    </div>
  );
}