'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, Loader2, Download, History, AlertCircle, Eye, LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function WordToPdfPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const translations = {
    ar: {
      title: "تحويل Word إلى PDF",
      desc: "حول ملفات الوورد الخاصة بك إلى صيغة PDF أو العكس بسرعة فائقة مع الحفاظ على التنسيق.",
      dragDrop: "اضغط هنا أو اسحب ملف Word (.docx) لرفعه",
      support: "يدعم ملفات بصيغة DOCX فقط",
      selected: "الملف المختار",
      delete: "إزالة",
      convertNow: "تحويل إلى PDF الآن",
      download: "تحميل الملف المحول",
      processing: "جاري التحويل...",
      historyTitle: "سجل العمليات السابقة",
      noHistory: "لا يوجد سجل عمليات حتى الآن.",
      limitReached: "استنفدت الرصيد المجاني (2/2)",
      proDesc: "لقد استهلكت الـ 2 عمليات المجانية المتاحة لك. التزم بالترقية للخطة الاحترافية لعمليات بلا حدود.",
      proBtn: "الترقية إلى Pro",
      usage: "الاستخدام المجاني",
      downloadItem: "تنزيل الملف",
      openItem: "معاينة الملف",
      authTitle: "تتطلب هذه الميزة تسجيل الدخول",
      authDesc: "يرجى تسجيل الدخول بحسابك لتتمكن من استخدام أدوات تحويل المستندات وحفظها في سجلك.",
      loginBtn: "تسجيل الدخول",
      cancel: "إلغاء",
      minFilesAlert: "الرجاء اختيار ملف Word (.docx) صالح."
    },
    en: {
      title: "Word to PDF Converter",
      desc: "Convert your Word documents to PDF quickly while maintaining formatting.",
      dragDrop: "Click or drag a Word file (.docx) to upload",
      support: "Supports DOCX files only",
      selected: "Selected File",
      delete: "Remove",
      convertNow: "Convert to PDF Now",
      download: "Download Converted File",
      processing: "Converting...",
      historyTitle: "Operations History",
      noHistory: "No history available yet.",
      limitReached: "Free Limit Reached (2/2)",
      proDesc: "You have used your 2 free conversions. Upgrade to Pro for unlimited usage.",
      proBtn: "Upgrade to Pro",
      usage: "Free Usage",
      downloadItem: "Download PDF",
      openItem: "Preview PDF",
      authTitle: "Login Required",
      authDesc: "Please log in to your account to use document conversion tools and save history.",
      loginBtn: "Log In",
      cancel: "Cancel",
      minFilesAlert: "Please select a valid Word file (.docx)."
    },
    tr: {
      title: "Word - PDF Dönüştürücü",
      desc: "Word belgelerinizi biçimlendirmeyi koruyarak hızlıca PDF'e dönüştürün.",
      dragDrop: "Yüklemek için bir Word dosyası (.docx) seçin veya sürükleyin",
      support: "Sadece DOCX dosyalarını destekler",
      selected: "Seçilen Dosya",
      delete: "Kaldır",
      convertNow: "Şimdi PDF'e Dönüştür",
      download: "Dönüştürülen Dosyayı İndir",
      processing: "Dönüştürülüyor...",
      historyTitle: "İşlem Geçmişi",
      noHistory: "Henüz işlem geçmişi yok.",
      limitReached: "Ücretsiz Sınıra Ulaşıldı (2/2)",
      proDesc: "2 ücretsiz dönüştürme hakkınızı kullandınız. Sınırsız kullanım için Pro'ya yükseltin.",
      proBtn: "Pro'ya Yükselt",
      usage: "Ücretsiz Kullanım",
      downloadItem: "PDF İndir",
      openItem: "PDF Önizle",
      authTitle: "Giriş Yapılması Gerekiyor",
      authDesc: "Belge dönüştürme araçlarını kullanmak ve geçmişinizi kaydetmek için giriş yapın.",
      loginBtn: "Giriş Yap",
      cancel: "İptal",
      minFilesAlert: "Lütfen geçerli bir Word dosyası seçin."
    }
  };

  // @ts-ignore
  const t = translations[language] || translations.ar;

  const [isPro, setIsPro] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);

  const [activeUser, setActiveUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const isValidUUID = (id: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };

  const fetchFromSupabase = async (user: any) => {
    if (!user || !isValidUUID(user.id)) {
      setIsLoadingData(false);
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

      const { data: historyData, error: historyErr } = await supabase
        .from('word_to_pdf_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!historyErr && historyData) {
        const formatted = historyData.map((item: any) => ({
          id: item.id,
          fileName: item.file_name,
          date: new Date(item.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US'),
          fileData: item.file_data
        }));
        setHistory(formatted);
        setUsageCount(formatted.length);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    const initUser = async () => {
      setIsLoadingData(true);
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;

      if (user) {
        setActiveUser(user);
        await fetchFromSupabase(user);
      } else {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setActiveUser(authUser);
          await fetchFromSupabase(authUser);
        } else {
          setIsLoadingData(false);
        }
      }
    };

    initUser();
  }, [language]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeUser) {
      setShowAuthModal(true);
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConvertedPdfUrl(null);
    }
  };

  const convertToPdf = async () => {
    if (!activeUser || !isValidUUID(activeUser.id)) {
      setShowAuthModal(true);
      return;
    }
    if (!file) return alert(t.minFilesAlert);
    
    // إيقاف المعالجة فقط إذا كان الحساب مجانياً وتجاوز الحد
    if (usageCount >= 2 && !isPro) return; 

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setConvertedPdfUrl(url);

      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const currentDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US');
      const newFileName = file.name.replace(/\.[^/.]+$/, "") + '.pdf';
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

      const newHistoryItem = {
        id: generatedId,
        fileName: newFileName,
        date: currentDate,
        fileData: base64Data
      };

      const { error: insertErr } = await supabase
        .from('word_to_pdf_history')
        .insert({
          id: generatedId,
          user_id: activeUser.id,
          file_name: newFileName,
          file_data: base64Data
        });

      if (insertErr) {
        console.error("Supabase insert error:", insertErr.message);
        alert("حدث خطأ أثناء حفظ السجل في قاعدة البيانات: " + insertErr.message);
        setIsProcessing(false);
        return;
      }

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      setUsageCount(updatedHistory.length);

    } catch (error: any) {
      console.error("Conversion error:", error);
      alert("حدث خطأ أثناء تحويل الملف.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openHistoryPdf = (item: any) => {
    if (!item.fileData) return alert("بيانات الملف غير متوفرة.");
    const win = window.open();
    if (win) {
      win.document.write(
        `<iframe src="${item.fileData}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen py-32 px-6 flex items-center justify-center relative z-10">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 px-6 relative z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-dark p-8 rounded-3xl border border-white/10 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{t.authTitle}</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">{t.authDesc}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => router.push('/login')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all shadow-lg"
              >
                {t.loginBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {t.title}
            </h1>
            <p className="text-gray-400 text-lg">{t.desc}</p>
          </div>

          <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            
            {usageCount >= 2 && !isPro && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm p-6 text-center">
                 <div className="bg-gray-900 border border-pink-500/30 p-8 rounded-2xl max-w-md w-full shadow-2xl">
                    <AlertCircle className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-white mb-2">{t.limitReached}</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">{t.proDesc}</p>
                    <button
                      onClick={() => router.push('/pricing')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                    >
                      {t.proBtn}
                    </button>
                 </div>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-10 text-center hover:border-pink-500 transition-colors bg-white/5 relative">
              <input 
                type="file" 
                accept=".docx"
                onChange={handleFileChange}
                disabled={usageCount >= 2 && !isPro}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <UploadCloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-bold text-white mb-2">{t.dragDrop}</p>
              <p className="text-sm text-gray-400">{t.support}</p>
            </div>

            {file && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4">{t.selected}:</h3>
                <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-6 h-6 text-pink-400 shrink-0" />
                    <span className="text-gray-200 truncate font-medium" dir="ltr">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => { setFile(null); setConvertedPdfUrl(null); }}
                    className="text-red-400 hover:text-red-300 font-bold px-3 shrink-0"
                  >
                    {t.delete}
                  </button>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {!convertedPdfUrl ? (
                    <button 
                      onClick={convertToPdf}
                      disabled={isProcessing || (usageCount >= 2 && !isPro)}
                      className="btn-glowing w-full py-4 rounded-xl font-extrabold text-white text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : t.convertNow}
                    </button>
                  ) : (
                    <a 
                      href={convertedPdfUrl}
                      download={`Converted_${Date.now()}.pdf`}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-extrabold text-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                      <Download className="w-6 h-6" />
                      {t.download}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6 mt-16 lg:mt-0">
          
          <div className="glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-3">
               <h3 className="text-sm font-bold text-gray-400">{t.usage}</h3>
             </div>
             <div className="w-full bg-gray-800 rounded-full h-3 mb-2 overflow-hidden border border-gray-700">
               <div 
                 className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                 style={{ width: `${Math.min((usageCount / 2) * 100, 100)}%` }}
               ></div>
             </div>
             <p className="text-xs text-right text-gray-500 font-medium">{usageCount} / {isPro ? '∞' : '2'}</p>
          </div>

          <div className="glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl flex-1 max-h-[500px] overflow-hidden flex flex-col relative">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
               <History className="w-5 h-5 text-pink-400" />
               <h3 className="text-lg font-bold text-white">{t.historyTitle}</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
               {history.length === 0 ? (
                 <p className="text-sm text-gray-500 text-center py-10">{t.noHistory}</p>
               ) : (
                 history.map((item) => (
                   <div key={item.id} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5 hover:border-pink-500/40 transition-colors gap-3">
                     <div className="overflow-hidden flex-1">
                       <p className="text-sm font-bold text-gray-200 truncate mb-1" dir="ltr" title={item.fileName}>
                         {item.fileName}
                       </p>
                       <p className="text-xs text-gray-500">{item.date}</p>
                     </div>

                     <div className="flex items-center gap-2 shrink-0">
                       <button
                         onClick={() => openHistoryPdf(item)}
                         className="text-purple-400 hover:text-purple-300 transition-colors p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg"
                         title={t.openItem}
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       {item.fileData && (
                         <a
                           href={item.fileData}
                           download={item.fileName}
                           className="text-green-400 hover:text-green-300 transition-colors p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg"
                           title={t.downloadItem}
                         >
                           <Download className="w-4 h-4" />
                         </a>
                       )}
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}