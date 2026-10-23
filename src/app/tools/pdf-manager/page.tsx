'use client';

import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, Loader2, Download, History, AlertCircle, Eye, LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function PdfManagerPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const translations = {
    ar: {
      title: "دمج ملفات PDF",
      desc: "قم برفع ملفاتك، رتبها، وادمجها في ملف واحد بسرعة وبأمان تام داخل متصفحك.",
      dragDrop: "اضغط هنا أو اسحب الملفات لرفعها",
      support: "يدعم ملفات بصيغة PDF فقط",
      selected: "الملفات المحددة",
      delete: "إزالة",
      mergeNow: "دمج الملفات الآن",
      download: "تحميل الملف المدمج",
      processing: "جاري الدمج...",
      historyTitle: "سجل العمليات السابقة",
      noHistory: "لا يوجد سجل عمليات حتى الآن.",
      limitReached: "استنفدت الرصيد المجاني (3/3)",
      proDesc: "لقد استهلكت الـ 3 عمليات المجانية المتاحة لك. لا يزال بإمكانك تنزيل ملفاتك السابقة من السجل الجانبي، أو الترقية للخطة الاحترافية لدمج ملفات بلا حدود.",
      proBtn: "الترقية إلى Pro",
      usage: "الاستخدام المجاني",
      downloadItem: "تنزيل الملف",
      openItem: "معاينة الملف",
      authTitle: "تتطلب هذه الميزة تسجيل الدخول",
      authDesc: "يرجى تسجيل الدخول بحسابك لتتمكن من دمج ملفات PDF وحفظها في سجلك الخاص.",
      loginBtn: "تسجيل الدخول",
      cancel: "إلغاء",
      minFilesAlert: "الرجاء اختيار ملفين على الأقل للدمج."
    },
    en: {
      title: "Merge PDF Files",
      desc: "Upload, rearrange, and merge your files securely in your browser.",
      dragDrop: "Click or drag files to upload",
      support: "Supports PDF files only",
      selected: "Selected Files",
      delete: "Remove",
      mergeNow: "Merge Files Now",
      download: "Download Merged File",
      processing: "Merging...",
      historyTitle: "Operations History",
      noHistory: "No history available yet.",
      limitReached: "Free Limit Reached (3/3)",
      proDesc: "You have used your 3 free merges. You can still download your previous files from the side history, or upgrade to Pro for unlimited merges.",
      proBtn: "Upgrade to Pro",
      usage: "Free Usage",
      downloadItem: "Download PDF",
      openItem: "Preview PDF",
      authTitle: "Login Required",
      authDesc: "Please log in to your account to merge PDF files and save them to your history.",
      loginBtn: "Log In",
      cancel: "Cancel",
      minFilesAlert: "Please select at least 2 files to merge."
    },
    tr: {
      title: "PDF Dosyalarını Birleştir",
      desc: "Tarayıcınızda dosyalarınızı yükleyin, düzenleyin ve güvenle birleştirin.",
      dragDrop: "Yüklemek için tıklayın veya sürükleyin",
      support: "Sadece PDF dosyalarını destekler",
      selected: "Seçilen Dosyalar",
      delete: "Kaldır",
      mergeNow: "Dosyaları Şimdi Birleştir",
      download: "Birleştirilmiş Dosyayı İndir",
      processing: "İşleniyor...",
      historyTitle: "İşlem Geçmişi",
      noHistory: "Henüz işlem geçmişi yok.",
      limitReached: "Ücretsiz Sınıra Ulaşıldı (3/3)",
      proDesc: "3 ücretsiz birleştirme hakkınızı kullandınız. Önceki dosyalarınızı yan geçmişten indirebilir veya sınırsız kullanım için Pro'ya geçebilirsiniz.",
      proBtn: "Pro'ya Yükselt",
      usage: "Ücretsiz Kullanım",
      downloadItem: "PDF İndir",
      openItem: "PDF Önizle",
      authTitle: "Giriş Yapılması Gerekiyor",
      authDesc: "PDF dosyalarını birleştirmek ve geçmişinize kaydetmek için lütfen giriş yapın.",
      loginBtn: "Giriş Yap",
      cancel: "İptal",
      minFilesAlert: "Birleştirmek için lütfen en az 2 dosya seçin."
    }
  };

  // @ts-ignore
  const t = translations[language] || translations.ar;

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const [activeUser, setActiveUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const isValidUUID = (id: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };

  const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
    }
    return `data:application/pdf;base64,${btoa(binary)}`;
  };

  const fetchFromSupabase = async (user: any) => {
    if (!user || !isValidUUID(user.id)) {
      setIsLoadingData(false);
      return;
    }

    try {
      const { data: historyData, error: historyErr } = await supabase
        .from('merge_history')
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
      console.error('Error fetching from Supabase:', err);
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
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setFiles(prev => [...prev, ...selectedFiles]);
      setMergedPdfUrl(null);
    }
  };

  const removeSelectedFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const mergePdfs = async () => {
    if (!activeUser || !isValidUUID(activeUser.id)) {
      setShowAuthModal(true);
      return;
    }
    if (files.length < 2) return alert(t.minFilesAlert);
    if (usageCount >= 3) return;

    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const base64Pdf = uint8ArrayToBase64(mergedPdfBytes);

      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);

      const currentDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US');
      const newFileName = `Merged_${Date.now().toString().slice(-5)}.pdf`;
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

      const newHistoryItem = {
        id: generatedId,
        fileName: newFileName,
        date: currentDate,
        fileData: base64Pdf
      };

      const { error: insertErr } = await supabase
        .from('merge_history')
        .insert({
          id: generatedId,
          user_id: activeUser.id,
          file_name: newFileName,
          file_data: base64Pdf
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
      console.error("Error merging PDFs:", error);
      alert("حدث خطأ أثناء دمج الملفات.");
    } finally {
      setIsProcessing(false);
    }
  };

  // معالجة معاينة الملف بشكل آمن ومضمون لمنع ظهور شاشة بيضاء
  const openHistoryPdf = (item: any) => {
    if (!item.fileData) {
      alert("عذراً، هذا الملف القديم تم إنشاؤه مسبقاً قبل تفعيل تخزين البيانات ولا يحتوي على نسخة معاينة. يرجى دمج ملف جديد لتعمل المعاينة بشكل فوري.");
      return;
    }
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
            
            {usageCount >= 3 && (
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
                multiple 
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={usageCount >= 3}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <UploadCloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-bold text-white mb-2">{t.dragDrop}</p>
              <p className="text-sm text-gray-400">{t.support}</p>
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4">{t.selected} ({files.length}):</h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-6 h-6 text-pink-400 shrink-0" />
                        <span className="text-gray-200 truncate font-medium" dir="ltr">{file.name}</span>
                      </div>
                      <button 
                        onClick={() => removeSelectedFile(index)}
                        className="text-red-400 hover:text-red-300 font-bold px-3 shrink-0"
                      >
                        {t.delete}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {!mergedPdfUrl ? (
                    <button 
                      onClick={mergePdfs}
                      disabled={isProcessing || files.length < 2 || usageCount >= 3}
                      className="btn-glowing w-full py-4 rounded-xl font-extrabold text-white text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : t.mergeNow}
                    </button>
                  ) : (
                    <a 
                      href={mergedPdfUrl}
                      download={`Merged_Document_${Date.now()}.pdf`}
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

        {/* القسم الجانبي (بدون زر التصفير نهائياً) */}
        <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6 mt-16 lg:mt-0">
          
          <div className="glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-3">
               <h3 className="text-sm font-bold text-gray-400">{t.usage}</h3>
             </div>
             <div className="w-full bg-gray-800 rounded-full h-3 mb-2 overflow-hidden border border-gray-700">
               <div 
                 className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                 style={{ width: `${Math.min((usageCount / 3) * 100, 100)}%` }}
               ></div>
             </div>
             <p className="text-xs text-right text-gray-500 font-medium">{usageCount} / 3</p>
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