"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    tools: "الأدوات", pricing: "الخطط", contact: "تواصل معنا", login: "تسجيل الدخول", logout: "تسجيل الخروج", my_tools: "أدواتي",
    hero_t1: "بساطة مطلقة.", hero_t2: "إمكانيات بلا حدود.",
    s2_title: "منصة متكاملة لتسيير أعمالك اليومية",
    s2_p1: "في عصر السرعة الرقمية، صُممت هذه المنصة لتكون الذراع التقني الذي ينجز مهامك المعقدة في ثوانٍ معدودة. نحن نجمع لك أقوى أدوات الخدمات المصغرة (Micro-SaaS) في بيئة سحابية واحدة، بدءاً من المعالجة الذكية لملفات الـ PDF مثل الدمج والضغط والتوقيع الرقمي، مروراً بأدوات الذكاء الاصطناعي لإزالة خلفيات الصور بدقة متناهية، وصولاً إلى صانع السير الذاتية الاحترافي المصمم خصيصاً لدعم اللغة العربية وتلبية متطلبات الأسواق العالمية.",
    s2_p2: "سواء كنت مستقلاً يبحث عن تنظيم ملفاته، أو شركة تطمح لتقليل التكاليف التشغيلية، فإن منصتنا توفر لك بيئة آمنة لا تتطلب تحميل أو تثبيت أي برامج معقدة. المنطق بسيط جداً: ارفع ملفاتك، دع خوارزمياتنا المتطورة تعالجها، وحمل النتيجة النهائية فوراً. لقد بنينا هذا النظام ليكون أداة إنتاجية لا غنى عنها، تمنحك السيطرة الكاملة، وتوفر عليك مئات الساعات من العمل اليدوي المرهق ليصبح الإنجاز عادة يومية.",
    btn_explore: "استكشف جميع الأدوات", btn_sub: "اشترك في الخطط الاحترافية",
    faq_title: "الأسئلة الشائعة", faq_sub: "الإجابات المباشرة على أكثر استفساراتكم",
    faq1_q: "كيف يمكنني الاشتراك في الخطط المأجورة؟", faq1_a: "توجه إلى صفحة 'الخطط'، اختر الباقة التي تلبي احتياجاتك، وتابع خطوات الدفع الآمنة لحجز حسابك والبدء فوراً.",
    faq2_q: "هل أحتاج لبطاقة بنكية للأدوات المجانية؟", faq2_a: "مطلقاً! نؤمن بإتاحة الأدوات الأساسية للجميع بدون إدخال أي معلومات دفع.",
    faq3_q: "كيف تضمنون أمان ملفاتي؟", faq3_a: "جميع الملفات تمر عبر اتصال مشفر، ويتم حذفها من خوادمنا تلقائياً وبشكل نهائي بعد ساعة واحدة من المعالجة.",
    faq4_q: "هل المنصة تدعم الهواتف المحمولة؟", faq4_a: "نعم، قمنا ببناء المنصة لتكون متجاوبة بالكامل لتتصفحها بسلاسة تامة على هاتفك الذكي أو حاسوبك.",
    test_title: "ماذا يقول عملاؤنا؟",
    test1_name: "أحمد المعتصم", test1_role: "مطور واجهات", test1_text: "التجربة مذهلة! التصميم سلس والأدوات سريعة جداً. وفرت علي الكثير من الجهد.",
    test2_name: "سارة محمد", test2_role: "صانعة محتوى", test2_text: "استخدمت ميزة إزالة الخلفية وكانت دقيقة بشكل لا يصدق. شكراً لكم!",
    leave_comment: "اترك تعليقك", name_label: "الاسم الكريم", name_ph: "أدخل اسمك هنا",
    text_label: "رأيك يهمنا", text_ph: "اكتب تجربتك أو اقتراحك هنا...",
    send_btn: "إرسال التعليق", alert_msg: "تم إرسال تعليقك بنجاح!",
    tools_page_title: "ترسانة أدواتك الإبداعية",
    tool_word2pdf_title: "تحويل Word إلى PDF", tool_word2pdf_desc: "حول ملفات الوورد الخاصة بك إلى صيغة PDF أو العكس بسرعة فائقة مع الحفاظ على التنسيق الأصلي للخطوط والصور.",
    tool_pdf_title: "دمج وضغط وتوقيع PDF", tool_pdf_desc: "قم بدمج عدة ملفات في ملف واحد، أو تقليل حجمها لسهولة الإرسال، أو إضافة توقيعك الإلكتروني عليها بسهولة وأمان تام.",
    tool_bg_title: "إزالة الخلفية بالذكاء الاصطناعي", tool_bg_desc: "افصل العناصر والأشخاص عن الخلفية باحترافية عالية وبنقرة واحدة فقط باستخدام أحدث تقنيات الذكاء الاصطناعي.",
    tool_cv_title: "صانع السيرة الذاتية", tool_cv_desc: "أنشئ سيرة ذاتية عصرية واحترافية تلفت انتباه مسؤولي التوظيف وتزيد من فرص قبولك في الوظائف بأقل مجهود وفي دقائق معدودة.",
    start_using: "ابدأ الاستخدام",
    login_title_text: "تسجيل الدخول",
    signup_title_text: "إنشاء حساب جديد",
    login_subtitle: "مرحباً بعودتك إلى أدواتي",
    signup_subtitle: "ابدأ رحلتك مع أدواتنا الاحترافية",
    login_email: "البريد الإلكتروني",
    login_pass: "كلمة المرور",
    login_submit: "الدخول للحساب",
    signup_submit: "إنشاء الحساب",
    or: "أو",
    continue_google: "المتابعة باستخدام Google",
    no_account_msg: "ليس لديك حساب؟ أنشئ حساباً الآن",
    has_account_msg: "لديك حساب بالفعل؟ قم بتسجيل الدخول",
    back_home: "العودة للرئيسية",
    login_error_general: "حدث خطأ أثناء العملية",
    login_error_google: "حدث خطأ في الاتصال مع جوجل",
    
    // كلمات الفوتر المضافة
    footer_desc: "منصة عربية متكاملة تهدف لتسهيل مهامك اليومية. دمج، ضغط، وتوقيع PDF، إزالة خلفيات الصور، وصناعة سيرتك الذاتية بضغطة زر.",
    quick_links: "روابط سريعة",
    all_tools: "جميع الأدوات",
    pricing_plans: "خطط الأسعار",
    legal: "قانوني",
    privacy_policy: "سياسة الخصوصية",
    terms_of_use: "شروط الاستخدام",
    copyright: "© 2026 أدواتي. جميع الحقوق محفوظة. تم التطوير بشغف.",
    
    // كلمات صفحة الخطط المضافة
    pricing_main_title: "خطط تناسب طموحك",
    plan_basic: "الأساسية",
    plan_basic_desc: "باقة تجريبية لتقييم جودة أدواتنا.",
    free_limited: "مجانية بحدود",
    feat_pdf_free: "دمج وضغط ملفين PDF يومياً",
    feat_bg_free: "إزالة الخلفية لصورتين فقط",
    feat_cv_free: "سيرة ذاتية بعلامة مائية",
    checking: "جارِ التحقق...",
    register_free: "سجل وجرب الآن مجاناً",
    current_plan: "✓ خطتك الحالية",
    available_to_all: "متاحة للجميع",
    pro_badge: "باقة المحترفين",
    plan_pro: "الاحترافية",
    plan_pro_desc: "الوصول الكامل لجميع الأدوات بدون قيود.",
    monthly: "/ شهرياً",
    feat_word2pdf: "تحويل غير محدود لملفات Word إلى PDF والعكس",
    feat_pdf_pro: "استخدام غير محدود لأدوات دمج، ضغط، وتوقيع الـ PDF",
    feat_bg_pro: "إزالة خلفية لا محدودة للصور بدقة 4K العالية",
    feat_cv_pro: "إنشاء سير ذاتية بلا حدود وبدون أي علامات مائية",
    feat_cloud: "تخزين سحابي مؤقت وآمن لمعالجة ملفاتك",
    feat_support: "أولوية في الدعم الفني على مدار الساعة",
    login_to_subscribe: "سجل دخول للاشتراك",
    preparing: "جاري التجهيز...",
    subscribe_now: "اشترك الآن"
  },
  en: {
    tools: "Tools", pricing: "Pricing", contact: "Contact Us", login: "Login", logout: "Logout", my_tools: "My Tools",
    hero_t1: "Absolute Simplicity.", hero_t2: "Limitless Possibilities.",
    s2_title: "An integrated platform to manage your daily tasks",
    s2_p1: "In the era of digital speed, this platform was designed to be your technical arm that accomplishes complex tasks in seconds. We bring together the most powerful Micro-SaaS tools in one cloud environment, from smart PDF processing to AI background removal and a professional CV maker.",
    s2_p2: "Whether you are a freelancer or a company looking to reduce operational costs, our platform provides a secure environment without complex software installations. Upload, process, and download instantly. We built this system to save you hundreds of hours of manual work.",
    btn_explore: "Explore All Tools", btn_sub: "Subscribe to Pro Plans",
    faq_title: "Frequently Asked Questions", faq_sub: "Direct answers to your most common inquiries",
    faq1_q: "How can I subscribe to paid plans?", faq1_a: "Go to the 'Pricing' page, choose a package, and follow the secure payment steps.",
    faq2_q: "Do I need a credit card for free tools?", faq2_a: "Absolutely not! We believe in making essential tools available to everyone without payment info.",
    faq3_q: "How do you guarantee my files' security?", faq3_a: "All files pass through an encrypted connection and are permanently deleted from our servers 1 hour after processing.",
    faq4_q: "Does the platform support mobile phones?", faq4_a: "Yes, the platform is fully responsive for seamless browsing on your smartphone or computer.",
    test_title: "What our clients say?",
    test1_name: "Ahmed Al-Mutasim", test1_role: "Frontend Developer", test1_text: "Amazing experience! The design is smooth and tools are very fast. Saved me a lot of effort.",
    test2_name: "Sarah Mohammed", test2_role: "Content Creator", test2_text: "I used the background removal feature and it was incredibly accurate. Thank you!",
    leave_comment: "Leave a comment", name_label: "Your Name", name_ph: "Enter your name here",
    text_label: "Your Feedback", text_ph: "Write your experience or suggestion here...",
    send_btn: "Submit Comment", alert_msg: "Your comment has been submitted successfully!",
    tools_page_title: "Your Creative Tools Arsenal",
    tool_word2pdf_title: "Word to PDF", tool_word2pdf_desc: "Convert your Word documents to PDF and vice versa with ultra-speed while preserving original formatting.",
    tool_pdf_title: "Merge, Compress & Sign PDF", tool_pdf_desc: "Combine multiple files, reduce their size for easy sharing, or add your e-signature securely and easily.",
    tool_bg_title: "AI Background Remover", tool_bg_desc: "Isolate elements and people from backgrounds with high precision in just one click using the latest AI technology.",
    tool_cv_title: "CV Maker", tool_cv_desc: "Create a modern, professional resume that catches recruiters' eyes and boosts your chances in minutes.",
    start_using: "Start Using",
    login_title_text: "Login",
    signup_title_text: "Create Account",
    login_subtitle: "Welcome back to My Tools",
    signup_subtitle: "Start your journey with our pro tools",
    login_email: "Email Address",
    login_pass: "Password",
    login_submit: "Login",
    signup_submit: "Sign Up",
    or: "Or",
    continue_google: "Continue with Google",
    no_account_msg: "Don't have an account? Sign up now",
    has_account_msg: "Already have an account? Login",
    back_home: "Back to Home",
    login_error_general: "An error occurred during the process",
    login_error_google: "Error connecting to Google",
    
    // كلمات الفوتر المضافة
    footer_desc: "An integrated platform aiming to facilitate your daily tasks. Merge, compress, sign PDF, remove background, and create CV with one click.",
    quick_links: "Quick Links",
    all_tools: "All Tools",
    pricing_plans: "Pricing Plans",
    legal: "Legal",
    privacy_policy: "Privacy Policy",
    terms_of_use: "Terms of Use",
    copyright: "© 2026 My Tools. All rights reserved. Developed with passion.",
    
    // كلمات صفحة الخطط المضافة
    pricing_main_title: "Plans that fit your ambition",
    plan_basic: "Basic",
    plan_basic_desc: "A trial package to evaluate the quality of our tools.",
    free_limited: "Free (Limited)",
    feat_pdf_free: "Merge and compress 2 PDFs daily",
    feat_bg_free: "Background removal for 2 images only",
    feat_cv_free: "Watermarked Resume",
    checking: "Checking...",
    register_free: "Register & Try for Free",
    current_plan: "✓ Your Current Plan",
    available_to_all: "Available to everyone",
    pro_badge: "Pro Package",
    plan_pro: "Professional",
    plan_pro_desc: "Full access to all tools without limits.",
    monthly: "/ month",
    feat_word2pdf: "Unlimited Word to PDF conversion and vice versa",
    feat_pdf_pro: "Unlimited use of PDF merge, compress, and sign tools",
    feat_bg_pro: "Unlimited 4K background removal",
    feat_cv_pro: "Unlimited resumes without watermarks",
    feat_cloud: "Secure temporary cloud storage for processing",
    feat_support: "24/7 Priority technical support",
    login_to_subscribe: "Login to Subscribe",
    preparing: "Preparing...",
    subscribe_now: "Subscribe Now"
  },
  tr: {
    tools: "Araçlar", pricing: "Planlar", contact: "İletişim", login: "Giriş Yap", logout: "Çıkış Yap", my_tools: "Araçlarım",
    hero_t1: "Mutlak Basitlik.", hero_t2: "Sınırsız Olanaklar.",
    s2_title: "Günlük işlerinizi yönetmek için entegre bir platform",
    s2_p1: "Dijital hız çağında, bu platform karmaşık görevleri saniyeler içinde yerine getiren teknik kolunuz olacak şekilde tasarlandı. Akıllı PDF işlemeden, yapay zeka ile arka plan kaldırmaya ve profesyonel özgeçmiş oluşturucuya kadar en güçlü Micro-SaaS araçlarını tek bir bulut ortamında bir araya getiriyoruz.",
    s2_p2: "İster dosyalarını düzenlemek isteyen bir serbest çalışan olun, ister operasyonel maliyetleri düşürmeyi hedefleyen bir şirket olun, platformumuz kurulum gerektirmeyen güvenli bir ortam sağlar. Mantık basit: Yükleyin, işleyin ve indirin. Yüzlerce saatlik manuel işten tasarruf etmeniz için bu sistemi kurduk.",
    btn_explore: "Tüm Araçları Keşfet", btn_sub: "Pro Planlara Abone Ol",
    faq_title: "Sıkça Sorulan Sorular", faq_sub: "En yaygın sorularınıza doğrudan yanıtlar",
    faq1_q: "Ücretli planlara nasıl abone olabilirim?", faq1_a: "'Planlar' sayfasına gidin, ihtiyacınıza uygun paketi seçin ve güvenli ödeme adımlarını izleyin.",
    faq2_q: "Ücretsiz araçlar için kredi kartına ihtiyacım var mı?", faq2_a: "Kesinlikle hayır! Temel araçları herkesin kullanımına sunmaya inanıyoruz.",
    faq3_q: "Dosyalarımın güvenliğini nasıl sağlıyorsunuz?", faq3_a: "Tüm dosyalar şifreli bir bağlantı üzerinden geçer ve işlemden 1 saat sonra sunucularımızdan tamamen silinir.",
    faq4_q: "Platform cep telefonlarını destekliyor mu?", faq4_a: "Evet, platformumuz akıllı telefonunuzda sorunsuz gezinmeniz için tamamen duyarlı olarak oluşturulmuştur.",
    test_title: "Müşterilerimiz ne diyor?",
    test1_name: "Ahmed El-Mutasem", test1_role: "Arayüz Geliştirici", test1_text: "İnanılmaz bir deneyim! Tasarım pürüzsüz ve araçlar çok hızlı. Bana çok emek kazandırdı.",
    test2_name: "Sarah Mohammed", test2_role: "İçerik Üreticisi", test2_text: "Arka plan kaldırma özelliğini kullandım ve inanılmaz derecede doğruydu. Teşekkürler!",
    leave_comment: "Yorum Bırak", name_label: "Adınız", name_ph: "Adınızı buraya girin",
    text_label: "Görüşleriniz", text_ph: "Deneyiminizi veya önerinizi buraya yazın...",
    send_btn: "Yorumu Gönder", alert_msg: "Yorumunuz başarıyla gönderildi!",
    tools_page_title: "Yaratıcı Araç Cephaneliğiniz",
    tool_word2pdf_title: "Word'den PDF'e", tool_word2pdf_desc: "Orijinal biçimlendirmeyi koruyarak Word belgelerinizi süper hızda PDF'e dönüştürün.",
    tool_pdf_title: "PDF Birleştir, Sıkıştır ve İmzala", tool_pdf_desc: "Birden fazla dosyayı birleştirin, boyutlarını küçültün veya elektronik imzanızı güvenle ekleyin.",
    tool_bg_title: "Yapay Zeka Arka Plan Kaldırıcı", tool_bg_desc: "En son yapay zeka teknolojisini kullanarak öğeleri ve kişileri tek tıklamayla arka plandan ayırın.",
    tool_cv_title: "Özgeçmiş Oluşturucu", tool_cv_desc: "İşverenlerin dikkatini çeken modern ve profesyonel bir CV'yi dakikalar içinde oluşturun.",
    start_using: "Kullanmaya Başla",
    login_title_text: "Giriş Yap",
    signup_title_text: "Yeni Hesap Oluştur",
    login_subtitle: "Araçlarım'a tekrar hoş geldiniz",
    signup_subtitle: "Pro araçlarımızla yolculuğunuza başlayın",
    login_email: "E-posta",
    login_pass: "Şifre",
    login_submit: "Giriş Yap",
    signup_submit: "Kayıt Ol",
    or: "Veya",
    continue_google: "Google ile Devam Et",
    no_account_msg: "Hesabınız yok mu? Şimdi kaydolun",
    has_account_msg: "Zaten hesabınız var mı? Giriş yapın",
    back_home: "Ana Sayfaya Dön",
    login_error_general: "İşlem sırasında bir hata oluştu",
    login_error_google: "Google ile bağlantı hatası",
    
    // كلمات الفوتر المضافة
    footer_desc: "Günlük işlerinizi kolaylaştırmayı amaçlayan entegre bir platform. Tek tıkla PDF birleştirme, sıkıştırma, imzalama, arka plan kaldırma ve CV oluşturma.",
    quick_links: "Hızlı Bağlantılar",
    all_tools: "Tüm Araçlar",
    pricing_plans: "Fiyatlandırma",
    legal: "Yasal",
    privacy_policy: "Gizlilik Politikası",
    terms_of_use: "Kullanım Koşulları",
    copyright: "© 2026 Araçlarım. Tüm hakları saklıdır. Tutkuyla geliştirildi.",
    
    // كلمات صفحة الخطط المضافة
    pricing_main_title: "Hedefinize uygun planlar",
    plan_basic: "Temel",
    plan_basic_desc: "Araçlarımızın kalitesini değerlendirmek için deneme paketi.",
    free_limited: "Ücretsiz (Sınırlı)",
    feat_pdf_free: "Günde 2 PDF birleştirme ve sıkıştırma",
    feat_bg_free: "Sadece 2 görsel için arka plan kaldırma",
    feat_cv_free: "Filigranlı Özgeçmiş",
    checking: "Kontrol ediliyor...",
    register_free: "Ücretsiz Kaydol ve Dene",
    current_plan: "✓ Mevcut Planınız",
    available_to_all: "Herkese açık",
    pro_badge: "Pro Paketi",
    plan_pro: "Profesyonel",
    plan_pro_desc: "Tüm araçlara sınırsız tam erişim.",
    monthly: "/ ay",
    feat_word2pdf: "Sınırsız Word - PDF dönüşümü",
    feat_pdf_pro: "PDF birleştirme, sıkıştırma ve imzalama araçlarının sınırsız kullanımı",
    feat_bg_pro: "Sınırsız 4K arka plan kaldırma",
    feat_cv_pro: "Filigransız sınırsız özgeçmiş",
    feat_cloud: "İşlem için güvenli geçici bulut depolama",
    feat_support: "7/24 Öncelikli teknik destek",
    login_to_subscribe: "Abone olmak için giriş yapın",
    preparing: "Hazırlanıyor...",
    subscribe_now: "Şimdi Abone Ol"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('site_lang') as Language;
    if (savedLang && ['ar', 'en', 'tr'].includes(savedLang)) {
      handleSetLanguage(savedLang);
    } else {
      handleSetLanguage('ar');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('site_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};