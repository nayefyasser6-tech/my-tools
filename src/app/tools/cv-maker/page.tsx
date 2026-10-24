'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { Download, Sparkles, Loader2, Plus, FileText, Edit2, Clock, Link, AlertCircle, Trash2, LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function CvMakerPage() {
  const [isPro, setIsPro] = useState<boolean>(false);
const [usageCount, setUsageCount] = useState<number>(0);
  const { language } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const translations = {
    ar: {
      summary: 'الملخص', exp: 'الخبرة', edu: 'التعليم', skills: 'المهارات', langs: 'اللغات', photo: 'الصورة',
      dashboardTitle: 'مرحباً، لننشئ شيئاً جديداً',
      dashboardSubtitle: 'أنشئ سيرة ذاتية، ثم حوّلها إلى معرض أعمال أو رسالة تعريفية متى شئت.',
      noCvs: 'لا توجد سير ذاتية بعد',
      createFirstDesc: 'اختر تصميماً وسنبني سيرتك الذاتية الأولى من بياناتك.',
      createFirstBtn: 'أنشئ سيرتك الذاتية الأولى',
      newCvBtn: 'سيرة ذاتية جديدة',
      yourResumes: 'سيرك الذاتية',
      resumeCount: 'سيرة ذاتية {count}',
      edit: 'تعديل السيرة',
      share: 'مشاركة',
      downloadBtn: 'تحميل PDF',
      back: 'العودة للسجل',
      wizardTitle: 'توليد سيرة احترافية',
      fullName: 'الاسم الكامل',
      jobTitle: 'المسمى الوظيفي',
      contactOptional: 'معلومات الاتصال (اختياري)',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      location: 'العنوان / المدينة',
      notes: 'ملاحظات لتخصيص السيرة',
      cancel: 'إلغاء',
      generateSubmit: 'توليد السيرة',
      loading: 'جاري كتابة السيرة الذاتية...',
      limitTitle: 'هل تريد سيرة ذاتية أخرى لوظيفة مختلفة؟',
      limitDesc: 'تتضمن الخطة المجانية سيرة ذاتية واحدة. قم بالترقية لتكون لديك سيرة ذاتية مخصصة جاهزة لكل وظيفة تتقدم إليها.',
      upgradeBtn: 'الترقية إلى Pro',
      deleteConfirm: 'هل أنت متأكد من حذف هذه السيرة الذاتية؟ لا يمكن التراجع عن هذا الإجراء.',
      authTitle: 'تتطلب هذه الميزة تسجيل الدخول',
      authDesc: 'يرجى تسجيل الدخول أو إنشاء حساب مجاني للتمكن من توليد السيرة الذاتية وحفظها في سجلك الخاص.',
      loginBtn: 'تسجيل الدخول',
      jobTitleReq: 'يرجى إدخال المسمى الوظيفي أولاً.',
      genFail: 'لم يتمكن الذكاء الاصطناعي من توليد السيرة. حاول مجدداً.',
      errorTitle: 'تعذّر إتمام العملية',
      okBtn: 'حسناً',
      busyMsg: 'خوادم الذكاء الاصطناعي مشغولة حالياً، حاول مجدداً بعد لحظات.',
      quotaMsg: 'وصلت خدمة الذكاء الاصطناعي لحدها اليومي. حاول لاحقاً.',
      loadSteps: ['نحلل مسماك الوظيفي...', 'نكتب الملخص المهني...', 'نبني الخبرات والمهارات...', 'اللمسات الأخيرة...'],
      timeUsual: 'عادةً تستغرق أقل من 20 ثانية • {s} ث',
      timeAlmost: 'أوشكنا على الانتهاء، شكراً لصبرك • {s} ث',
      dontClose: 'الرجاء عدم إغلاق الصفحة'
    },
    en: {
      summary: 'Summary', exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', photo: 'Photo',
      dashboardTitle: `Hello, let's create something new`,
      dashboardSubtitle: 'Create a resume, then turn it into a portfolio or cover letter whenever you want.',
      noCvs: 'No resumes yet',
      createFirstDesc: 'We will build your first resume from your data.',
      createFirstBtn: 'Create your first resume',
      newCvBtn: 'New Resume',
      yourResumes: 'Your Resumes',
      resumeCount: '{count} Resumes',
      edit: 'Edit CV',
      share: 'Share',
      downloadBtn: 'Download PDF',
      back: 'Back to Dashboard',
      wizardTitle: 'Generate Professional CV',
      fullName: 'Full Name',
      jobTitle: 'Job Title',
      contactOptional: 'Contact Info (Optional)',
      email: 'Email Address',
      phone: 'Phone Number',
      location: 'Address / City',
      notes: 'Notes to customize CV',
      cancel: 'Cancel',
      generateSubmit: 'Generate CV',
      loading: 'Writing your resume...',
      limitTitle: 'Want another resume for a different job?',
      limitDesc: 'The free plan includes one resume. Upgrade to have a custom resume ready for every job you apply to.',
      upgradeBtn: 'Upgrade to Pro',
      deleteConfirm: 'Are you sure you want to delete this resume? This action cannot be undone.',
      authTitle: 'Login Required',
      authDesc: 'Please login or create a free account to generate and save your CV securely.',
      loginBtn: 'Log In',
      jobTitleReq: 'Job title is required.',
      genFail: 'AI failed to generate CV. Please try again.',
      errorTitle: 'Something went wrong',
      okBtn: 'OK',
      busyMsg: 'The AI servers are busy right now. Please try again in a moment.',
      quotaMsg: 'The AI service has reached its daily limit. Please try again later.',
      loadSteps: ['Analyzing your job title...', 'Writing your professional summary...', 'Building experience and skills...', 'Final touches...'],
      timeUsual: 'Usually takes under 20 seconds • {s}s',
      timeAlmost: 'Almost done, thanks for waiting • {s}s',
      dontClose: 'Please do not close this page'
    },
    tr: {
      summary: 'Özet', exp: 'Deneyim', edu: 'Eğitim', skills: 'Yetenekler', langs: 'Diller', photo: 'Fotoğraf',
      dashboardTitle: `Merhaba, yeni bir şey yaratalım`,
      dashboardSubtitle: 'Bir özgeçmiş oluşturun, ardından portföye dönüştürün.',
      noCvs: 'Henüz özgeçmiş yok',
      createFirstDesc: 'İlk özgeçmişinizi verilerinizden oluşturacağız.',
      createFirstBtn: 'İlk Özgeçmişini Oluştur',
      newCvBtn: 'Yeni Özgeçmiş',
      yourResumes: 'Özgeçmişleriniz',
      resumeCount: '{count} Özgeçmiş',
      edit: 'CV Düzenle',
      share: 'Paylaş',
      downloadBtn: 'PDF İndir',
      back: 'Kontrol Paneline Dön',
      wizardTitle: 'Profesyonel CV Oluştur',
      fullName: 'Ad Soyad',
      jobTitle: 'İş Unvanı',
      contactOptional: 'İletişim Bilgileri (İsteğe Bağlı)',
      email: 'E-posta',
      phone: 'Telefon Numarası',
      location: 'Adres / Şehir',
      notes: 'CV Özelleştirme Notları',
      cancel: 'İptal',
      generateSubmit: 'CV Oluştur',
      loading: 'Özgeçmişiniz yazılıyor...',
      limitTitle: 'Farklı bir iş için başka bir CV mi istiyorsunuz?',
      limitDesc: 'Ücretsiz plan bir özgeçmiş içerir. Her iş başvurusuna özel CV\'niz olması için yükseltin.',
      upgradeBtn: 'Pro\'ya Yükselt',
      deleteConfirm: 'Bu özgeçmişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      authTitle: 'Giriş Yapılması Gerekiyor',
      authDesc: 'CV oluşturmak ve güvenle kaydetmek için lütfen giriş yapın veya ücretsiz bir hesap oluşturun.',
      loginBtn: 'Giriş Yap',
      jobTitleReq: 'İş unvanı gereklidir.',
      genFail: 'Yapay zeka CV oluşturamadı. Lütfen tekrar deneyin.',
      errorTitle: 'İşlem tamamlanamadı',
      okBtn: 'Tamam',
      busyMsg: 'Yapay zeka sunucuları şu anda meşgul. Lütfen birazdan tekrar deneyin.',
      quotaMsg: 'Yapay zeka hizmeti günlük sınırına ulaştı. Lütfen daha sonra tekrar deneyin.',
      loadSteps: ['İş unvanınız analiz ediliyor...', 'Profesyonel özet yazılıyor...', 'Deneyim ve yetenekler hazırlanıyor...', 'Son dokunuşlar...'],
      timeUsual: 'Genellikle 20 saniyeden kısa sürer • {s} sn',
      timeAlmost: 'Neredeyse bitti, sabrınız için teşekkürler • {s} sn',
      dontClose: 'Lütfen bu sayfayı kapatmayın'
    }
  };
  // @ts-ignore
  // @ts-ignore
  const t = translations[language] || translations.ar;

  const [isPro, setIsPro] = useState<boolean>(false);
  const [usageCount, setUsageCount] = useState<number>(0);

  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [cvHistory, setCvHistory] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wizardError, setWizardError] = useState('');
  const [errorModal, setErrorModal] = useState('');

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!aiLoading) {
      setElapsed(0);
      return;
    }
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [aiLoading]);

  const defaultCvState = {
    name: '', title: '', email: '', phone: '', location: '', linkedin: '',
    summary: '', experience: [], education: [], skills: [], languages: []
  };

  const [cvData, setCvData] = useState<any>(defaultCvState);
  const [wizardData, setWizardData] = useState({ name: '', title: '', notes: '', email: '', phone: '', location: '' });

  const saveLocal = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage is full or unavailable');
    }
  };

  const loadUserData = async (user: any) => {
    if (!user) {
      setCvHistory([]);
      setUsageCount(0);
      setIsPro(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('id', user.id)
        .single();

      if (profile?.plan_type === 'pro') {
        setIsPro(true);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }

    const storageKey = `cvs_${user.id}`;
    try {
      const localData = localStorage.getItem(storageKey);
      if (localData) {
        const parsed = JSON.parse(localData);
        setCvHistory(parsed);
        setUsageCount(parsed.length);
      }
    } catch (e) {
      console.warn('Local history could not be read');
    }

    try {
      const res = await fetch(`/api/cv-history?userId=${user.id}`);
      if (res.ok) {
        const dbData = await res.json();
        if (dbData.history) {
          setCvHistory(dbData.history);
          setUsageCount(dbData.history.length);
          saveLocal(storageKey, dbData.history);
        }
      }
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setActiveUser(session?.user || null);
      if (session?.user) loadUserData(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setActiveUser(session?.user || null);
      loadUserData(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNewCvClick = () => {
    if (!activeUser) {
      setShowAuthModal(true);
      return;
    }

    if (usageCount >= 1 && !isPro) {
      setShowLimitModal(true);
    } else {
      setShowWizard(true);
      setWizardError('');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoUrl(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDeleteCv = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(t.deleteConfirm)) return;
    if (!activeUser) return;

    const newHistory = cvHistory.filter(cv => cv.id !== id);
    setCvHistory(newHistory);
    setUsageCount(newHistory.length);
    saveLocal(`cvs_${activeUser.id}`, newHistory);

    try {
      await fetch(`/api/cv-history?id=${id}&userId=${activeUser.id}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleGenerate = async () => {
    if (aiLoading) return;

    if (!wizardData.title) {
      setWizardError(t.jobTitleReq);
      return;
    }

    if (!activeUser) {
      setShowWizard(false);
      setShowAuthModal(true);
      return;
    }

    setShowWizard(false);
    setAiLoading(true);
    setWizardError('');

    try {
      const res = await fetch('/api/ai-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: wizardData, language })
      });
      const resData = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setShowAuthModal(true);
        return;
      }
      if (resData.limitReached) {
        setShowLimitModal(true);
        return;
      }
      if (res.status === 429) {
        setErrorModal(t.quotaMsg);
        return;
      }
      if (res.status === 503) {
        setErrorModal(t.busyMsg);
        return;
      }

      if (resData.result) {
        const finalData = {
          ...defaultCvState,
          ...resData.result,
          name: wizardData.name || resData.result.name,
          title: wizardData.title || resData.result.title,
          email: wizardData.email,
          phone: wizardData.phone,
          location: wizardData.location
        };

        setCvData(finalData);

        const newRecord = {
          id: crypto.randomUUID(),
          date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          data: finalData,
          photo: photoUrl,
          userId: activeUser.id
        };

        const updatedHistory = [newRecord, ...cvHistory];
        setCvHistory(updatedHistory);
        setUsageCount(updatedHistory.length);
        saveLocal(`cvs_${activeUser.id}`, updatedHistory);
        setView('editor');
        setWizardData({ name: '', title: '', notes: '', email: '', phone: '', location: '' });

        fetch('/api/cv-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord)
        })
          .then(async (r) => {
            if (!r.ok) console.error('CV save failed:', r.status, await r.text());
          })
          .catch(() => console.error('CV save failed: network'));

      } else {
        setErrorModal(t.genFail);
      }
    } catch (e) {
      setErrorModal(t.genFail);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownload = () => window.print();

  const openOldCv = (record: any) => {
    setCvData(record.data);
    setPhotoUrl(record.photo);
    setView('editor');
  };
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-gradient-to-br from-[#2e1065] via-[#4a044e] to-[#2e1065]" dir={language === 'en' ? 'ltr' : 'rtl'}>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden !important; }
          #cv-preview, #cv-preview * { visibility: visible !important; }
          #cv-preview { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; }
          @page { margin: 0; }
        }
      `}} />

      {/* نافذة التحميل أثناء توليد السيرة */}
      {aiLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
          <div className="bg-[#170c2b] border border-purple-500/30 p-10 rounded-3xl w-full max-w-md shadow-2xl">
            <Loader2 className="w-12 h-12 animate-spin text-fuchsia-500 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">{t.loading}</h2>
            <p className="text-purple-200/80 mb-6 min-h-[24px]">{loadingSteps[stepIndex]}</p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-purple-200/60 mb-1">{timeText}</p>
            <p className="text-xs text-purple-200/40">{t.dontClose}</p>
          </div>
        </div>
      )}

      {/* نافذة الأخطاء بدل alert المتصفح */}
      {errorModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
          <div className="bg-[#170c2b] border border-red-500/30 p-10 rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{t.errorTitle}</h2>
            <p className="text-purple-200/70 mb-8 leading-relaxed">{errorModal}</p>
            <button onClick={() => setErrorModal('')} className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-colors">
              {t.okBtn}
            </button>
          </div>
        </div>
      )}

      {/* نافذة تسجيل الدخول الاحترافية */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
          <div className="bg-[#170c2b] border border-purple-500/30 p-10 rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{t.authTitle}</h2>
            <p className="text-purple-200/70 mb-8 leading-relaxed">{t.authDesc}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowAuthModal(false)} className="w-1/3 bg-white/5 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                {t.cancel}
              </button>
              <button onClick={() => router.push('/login')} className="w-2/3 bg-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-colors">
                {t.loginBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تجاوز الحد المسموح */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
          <div className="bg-[#170c2b] border border-purple-500/30 p-10 rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-fuchsia-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-fuchsia-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{t.limitTitle}</h2>
            <p className="text-purple-200/70 mb-8 leading-relaxed">{t.limitDesc}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLimitModal(false)} className="w-1/3 bg-white/5 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                {t.cancel}
              </button>
              <button onClick={() => router.push('/pricing')} className="w-2/3 bg-fuchsia-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-fuchsia-600/30 hover:bg-fuchsia-500 transition-colors flex justify-center items-center gap-2">
                <Sparkles className="w-5 h-5" /> {t.upgradeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-right" dir={language === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-white border border-gray-200 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.wizardTitle}</h2>

            {wizardError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold text-center">
                {wizardError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t.fullName}</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-purple-500 outline-none" value={wizardData.name} onChange={e => setWizardData({...wizardData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t.jobTitle} <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-purple-500 outline-none font-bold" value={wizardData.title} onChange={e => {setWizardData({...wizardData, title: e.target.value}); setWizardError('');}} />
                </div>
              </div>

              <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 space-y-4">
                <h3 className="text-sm font-bold text-purple-700 mb-2">{t.contactOptional}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">{t.email}</label>
                    <input type="email" className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" value={wizardData.email} onChange={e => setWizardData({...wizardData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">{t.phone}</label>
                    <input type="text" dir="ltr" className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" value={wizardData.phone} onChange={e => setWizardData({...wizardData, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{t.location}</label>
                  <input type="text" className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" value={wizardData.location} onChange={e => setWizardData({...wizardData, location: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t.notes}</label>
                <textarea rows={2} className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-purple-500 outline-none resize-none" value={wizardData.notes} onChange={e => setWizardData({...wizardData, notes: e.target.value})} />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowWizard(false)} className="w-1/3 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors">{t.cancel}</button>
                <button onClick={handleGenerate} className="w-2/3 bg-purple-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors">{t.generateSubmit}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="max-w-6xl mx-auto w-full text-white">
          {cvHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t.dashboardTitle}</h1>
                <p className="text-purple-100/80 text-sm md:text-base max-w-lg mx-auto">{t.dashboardSubtitle}</p>
              </div>
              <div className="flex flex-col items-center p-10 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="w-16 h-16 bg-purple-500/30 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-white">{t.noCvs}</h2>
                <p className="text-purple-100/60 mb-8 text-sm">{t.createFirstDesc}</p>
                <button onClick={handleNewCvClick} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-fuchsia-600/30">
                  <Plus className="w-5 h-5" /> {t.createFirstBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t.yourResumes}</h1>
                  <p className="text-purple-100/80 text-sm">{t.resumeCount.replace('{count}', cvHistory.length.toString())}</p>
                </div>
                <button onClick={handleNewCvClick} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-fuchsia-600/30 hidden md:flex">
                  <Plus className="w-5 h-5" /> {t.newCvBtn}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={handleNewCvClick} className="border-2 border-dashed border-white/30 rounded-3xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-white/10 transition-colors min-h-[280px] bg-black/10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-bold">{t.newCvBtn}</span>
                </div>

                {cvHistory.map((record) => (
                  <div key={record.id} className="border border-white/10 bg-black/20 backdrop-blur-sm rounded-3xl p-6 flex flex-col justify-between min-h-[280px] shadow-xl relative overflow-hidden group hover:border-fuchsia-500/50 transition-colors cursor-pointer" onClick={() => openOldCv(record)}>
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Minimal
                        </span>
                        <button onClick={(e) => handleDeleteCv(record.id, e)} className="text-white/30 hover:text-red-400 transition-colors bg-white/5 p-2 rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 truncate">{record.data.name || 'سيرة ذاتية'}</h3>
                      <h4 className="text-sm font-medium text-purple-200 mb-4">{record.data.title}</h4>
                      <p className="text-xs text-purple-200/60 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {record.date}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                      <button className="text-white/70 text-sm font-bold flex items-center gap-2 hover:text-white transition-colors">
                        <Link className="w-4 h-4" /> {t.share}
                      </button>
                      <button className="text-fuchsia-400 text-sm font-bold flex items-center gap-2 hover:text-fuchsia-300 transition-colors">
                         {t.edit} <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'editor' && (
        <div className="max-w-[850px] mx-auto relative">
          <div id="cv-preview" className="bg-white w-full shadow-2xl text-gray-900 min-h-[1122px] p-[10mm_15mm] md:p-[20mm_25mm]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-black text-black mb-1">{cvData.name}</h1>
                <h2 className="text-lg font-bold text-gray-800 mb-3">{cvData.title}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 font-medium">
                  {cvData.email && <span>{cvData.email}</span>}
                  {cvData.phone && <span dir="ltr">{cvData.phone}</span>}
                  {cvData.location && <span>{cvData.location}</span>}
                </div>
              </div>

              <div className="relative w-24 h-24 rounded-lg overflow-hidden group">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-500">
                    <span className="text-sm font-bold">{t.photo}</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer print:hidden">
                  <Plus className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={usageCount >= 1 && !isPro} />
                </label>
              </div>
            </div>

            <hr className="border-gray-800 mb-6 border-2" />

            {cvData.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-black text-black mb-2 uppercase tracking-wide">{t.summary}</h3>
                <p className="text-sm text-gray-900 leading-relaxed text-justify font-medium">{cvData.summary}</p>
              </div>
            )}

            {cvData.experience && cvData.experience.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-black text-black border-b-2 border-gray-800 pb-1 mb-4 uppercase tracking-wide">{t.exp}</h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-black text-base">{exp.role}</h4>
                        <span className="text-sm font-bold text-gray-800 whitespace-nowrap">{exp.duration}</span>
                      </div>
                      <div className="text-sm text-gray-800 font-bold mb-3">{exp.company} {exp.location && ` • ${exp.location}`}</div>
                      {exp.description && (
                        <ul className="list-disc list-outside ml-5 mr-5 text-gray-900 text-sm leading-relaxed space-y-1.5 text-justify font-medium">
                          {exp.description.split('\n').filter((p: string) => p.trim() !== '').map((p: string, idx: number) => (
                            <li key={idx}>{p.replace(/^[-*]\s*/, '')}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.education && cvData.education.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-black text-black border-b-2 border-gray-800 pb-1 mb-4 uppercase tracking-wide">{t.edu}</h3>
                <div className="space-y-4">
                  {cvData.education.map((edu: any, i: number) => (
                    <div key={i} className="flex justify-between items-baseline">
                      <div>
                        <h4 className="font-bold text-black text-sm">{edu.degree}</h4>
                        <p className="text-sm font-medium text-gray-800 mt-1">{edu.university}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-800 whitespace-nowrap">{edu.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8">
              {cvData.skills && cvData.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-black text-black border-b-2 border-gray-800 pb-1 mb-3 uppercase tracking-wide">{t.skills}</h3>
                  <ul className="list-disc list-outside ml-5 mr-5 text-gray-900 text-sm leading-relaxed font-medium">
                    {cvData.skills.map((skill: string, i: number) => <li key={i}>{skill}</li>)}
                  </ul>
                </div>
              )}
              {cvData.languages && cvData.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-black text-black border-b-2 border-gray-800 pb-1 mb-3 uppercase tracking-wide">{t.langs}</h3>
                  <div className="space-y-2">
                    {cvData.languages.map((lang: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm font-bold text-gray-900">
                        <span>{lang.name}</span>
                        <span>{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-center gap-4 mt-8 print:hidden flex-wrap">
            <button onClick={() => setView('dashboard')} className="px-6 py-3 rounded-xl font-bold text-white bg-black/40 hover:bg-black/60 transition-colors flex items-center gap-2 backdrop-blur-md">
              {t.back}
            </button>
            <button onClick={handleNewCvClick} className="px-6 py-3 rounded-xl font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors flex items-center gap-2 shadow-lg">
              <Sparkles className="w-5 h-5" /> {t.newCvBtn}
            </button>
            <button onClick={handleDownload} className="px-6 py-3 rounded-xl font-bold text-gray-900 bg-white hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
              <Download className="w-5 h-5" /> {t.downloadBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
