"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../components/LanguageProvider'; // تأكد من مسار الـ Provider
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

const translations = {
  ar: {
    back: "العودة للرئيسية",
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: أكتوبر 2026",
    sections: [
      {
        title: "1. مقدمة",
        content: "مرحباً بك في منصة 'أدواتي'. نحن نأخذ خصوصيتك وأمان بياناتك على محمل الجد. توضح سياسة الخصوصية هذه كيفية تعاملنا مع المعلومات والملفات التي تقدمها عند استخدامك لأدواتنا (دمج وتوقيع PDF، تحويل Word إلى PDF، إزالة الخلفية، وإنشاء السيرة الذاتية). باستخدامك للموقع، فإنك توافق على الممارسات الموضحة في هذه السياسة."
      },
      {
        title: "2. معالجة الملفات والتخزين السحابي",
        content: "نحن نستخدم خوادم مشفرة وآمنة لمعالجة ملفاتك. بالنسبة للمستخدمين في الخطة المجانية، تتم معالجة الملفات وحذفها تلقائياً من خوادمنا فور انتهاء العملية. بالنسبة لمستخدمي الخطة المدفوعة (Pro)، نوفر تخزيناً سحابياً مؤقتاً وآمناً لتسهيل الوصول لملفاتك. نحن لا نطلع على محتوى ملفاتك، ولا نقوم ببيعها أو مشاركتها مع أي طرف ثالث."
      },
      {
        title: "3. المعلومات التي نجمعها",
        content: "نجمع نوعين من المعلومات: (أ) بيانات الحساب: مثل البريد الإلكتروني عند التسجيل لإنشاء سيرة ذاتية أو الاشتراك في الخطة المدفوعة. (ب) بيانات الاستخدام: معلومات مجهولة الهوية حول كيفية تفاعلك مع الموقع (نوع المتصفح، الصفحات المزارة) لتحسين جودة أدواتنا. لا نجمع أي بيانات حساسة غير ضرورية."
      },
      {
        title: "4. أمن البيانات والتشفير",
        content: "نستخدم بروتوكولات تشفير عالية (SSL/TLS) لحماية بياناتك أثناء النقل. جميع الملفات المرفوعة تمر عبر قنوات آمنة. نظامنا مصمم بحيث لا يمكن لأي موظف بشري الوصول إلى ملفاتك أو الاطلاع عليها. نحن نطبق أعلى معايير الأمان لضمان حماية حقوقك ك مستخدم."
      },
      {
        title: "5. حقوق المستخدم",
        content: "يحق لك دائماً طلب حذف حسابك أو بياناتك من نظامنا. نظراً لأننا لا نحتفظ بالملفات المعالجة (في الخطة المجانية)، فإن ملفاتك تُمحى تلقائياً. يمكنك التواصل مع فريق الدعم على مدار الساعة (لمستخدمي الخطة المدفوعة) أو عبر البريد الإلكتروني لأي استفسار يتعلق ببياناتك."
      }
    ]
  },
  en: {
    back: "Back to Home",
    title: "Privacy Policy",
    updated: "Last Updated: October 2026",
    sections: [
      {
        title: "1. Introduction",
        content: "Welcome to 'My Tools' platform. We take your privacy and data security very seriously. This Privacy Policy explains how we handle the information and files you provide when using our tools (PDF merge & sign, Word to PDF, background removal, and CV builder). By using the site, you agree to the practices described here."
      },
      {
        title: "2. File Processing & Cloud Storage",
        content: "We use encrypted and secure servers to process your files. For free plan users, files are processed and automatically deleted from our servers immediately after the operation. For Pro plan users, we provide secure temporary cloud storage for easy access. We do not inspect the content of your files, nor do we sell or share them with any third party."
      },
      {
        title: "3. Information We Collect",
        content: "We collect two types of information: (a) Account Data: such as email when registering to create a CV or subscribing to the Pro plan. (b) Usage Data: anonymous information about how you interact with the site (browser type, pages visited) to improve our tools. We do not collect any unnecessary sensitive data."
      },
      {
        title: "4. Data Security & Encryption",
        content: "We use high encryption protocols (SSL/TLS) to protect your data in transit. All uploaded files pass through secure channels. Our system is designed so that no human employee can access or view your files. We apply the highest security standards to ensure your rights as a user are protected."
      },
      {
        title: "5. User Rights",
        content: "You always have the right to request deletion of your account or data from our system. Since we do not retain processed files (in the free plan), your files are automatically erased. You can contact our support team 24/7 (for Pro users) or via email for any inquiry regarding your data."
      }
    ]
  },
  tr: {
    back: "Ana Sayfaya Dön",
    title: "Gizlilik Politikası",
    updated: "Son Güncelleme: Ekim 2026",
    sections: [
      {
        title: "1. Giriş",
        content: "'Araçlarım' platformuna hoş geldiniz. Gizliliğinize ve veri güvenliğinize büyük önem veriyoruz. Bu Gizlilik Politikası, araçlarımızı (PDF birleştirme ve imzalama, Word'den PDF'ye, arka plan kaldırma ve CV oluşturucu) kullanırken sağladığınız bilgi ve dosyaları nasıl işlediğimizi açıklar. Siteyi kullanarak burada açıklanan uygulamaları kabul etmiş olursunuz."
      },
      {
        title: "2. Dosya İşleme ve Bulut Depolama",
        content: "Dosyalarınızı işlemek için şifrelenmiş ve güvenli sunucular kullanıyoruz. Ücretsiz plan kullanıcıları için dosyalar işlendikten hemen sonra sunucularımızdan otomatik olarak silinir. Pro plan kullanıcıları için kolay erişim amacıyla güvenli geçici bulut depolama sağlıyoruz. Dosyalarınızın içeriğini incelemiyor, satmıyor veya üçüncü taraflarla paylaşmıyoruz."
      },
      {
        title: "3. Topladığımız Bilgiler",
        content: "İki tür bilgi topluyoruz: (a) Hesap Verileri: CV oluşturmak veya Pro plana abone olmak için kayıt sırasında e-posta gibi. (b) Kullanım Verileri: araçlarımızı geliştirmek için siteyle nasıl etkileşimde bulunduğunuza dair anonim bilgiler (tarayıcı türü, ziyaret edilen sayfalar). Gereksiz hassas veri toplamıyoruz."
      },
      {
        title: "4. Veri Güvenliği ve Şifreleme",
        content: "Verilerinizi aktarım sırasında korumak için yüksek şifreleme protokolleri (SSL/TLS) kullanıyoruz. Yüklenen tüm dosyalar güvenli kanallardan geçer. Sistemimiz, hiçbir insan çalışanın dosyalarınıza erişemeyeceği veya görüntüleyemeyeceği şekilde tasarlanmıştır. Bir kullanıcı olarak haklarınızın korunmasını sağlamak için en yüksek güvenlik standartlarını uyguluyoruz."
      },
      {
        title: "5. Kullanıcı Hakları",
        content: "Her zaman hesabınızın veya verilerinizin sistemimizden silinmesini talep etme hakkına sahipsiniz. İşlenen dosyaları saklamadığımız için (ücretsiz planda) dosyalarınız otomatik olarak silinir. Verilerinizle ilgili her türlü soru için 7/24 destek ekibimizle (Pro kullanıcıları için) veya e-posta yoluyla iletişime geçebilirsiniz."
      }
    ]
  }
};

export default function PrivacyPolicy() {
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
              <ShieldCheck className="w-12 h-12 text-pink-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
            {t.title}
          </h1>
          <p className="text-purple-200">{t.updated}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 text-purple-100 leading-relaxed text-lg">
          {t.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold text-white mb-4">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}