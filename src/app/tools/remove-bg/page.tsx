'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter } from 'next/navigation';
import { UploadCloud, Loader2, Download, History, AlertCircle, Eye, LogIn, Sliders } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function RemoveBgPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const translations = {
    ar: {
      title: "إزالة الخلفية وتعديل الصور",
      desc: "أداة ذكية لإزالة الخلفية عبر Remove.bg وتعديل الصورة.",
      dragDrop: "اختر صورة وسيبدأ عزل الخلفية بالكامل",
      historyTitle: "سجل العمليات السابقة",
      noHistory: "لا يوجد سجل عمليات حتى الآن.",
      limitReached: "استنفدت الرصيد المجاني (2/2)",
      proDesc: "لقد استهلكت الـ 2 عمليات المجانية المتاحة لك. التزم بالترقية للخطة الاحترافية لعمليات بلا حدود.",
      proBtn: "الترقية إلى Pro",
      usage: "الرصيد المجاني",
      downloadItem: "تنزيل",
      openItem: "معاينة",
      authTitle: "تتطلب هذه الميزة تسجيل الدخول",
      authDesc: "يرجى تسجيل الدخول بحسابك لتتمكن من استخدام الأداة وحفظ أعمالك في السجل.",
      loginBtn: "تسجيل الدخول",
      cancel: "إلغاء",
      tabEdit: "أدوات التعديل",
      scale: "الحجم (تكبير/تصغير)",
      moveX: "أفقي (يمين/يسار)",
      moveY: "عمودي (أعلى/أسفل)",
      unlockFirst: "أزل الخلفية أولاً لتفعيل التعديل",
      processNow: "إزالة الخلفية الآن",
      download: "تحميل الصورة",
      processing: "جاري إزالة الخلفية عبر Remove.bg...",
      workspace: "مساحة العمل",
      chooseImage: "اختر صورة",
    },
    en: {
      title: "Background Remover & Editor",
      desc: "Smart tool to remove background via Remove.bg API.",
      dragDrop: "Choose an image to start",
      historyTitle: "Operations History",
      noHistory: "No history available yet.",
      limitReached: "Free Limit Reached (2/2)",
      proDesc: "You have used your 2 free removals. Upgrade to Pro for unlimited usage.",
      proBtn: "Upgrade to Pro",
      usage: "Free Credits",
      downloadItem: "Download",
      openItem: "Preview",
      authTitle: "Login Required",
      authDesc: "Please log in to your account to use the tool and save history.",
      loginBtn: "Log In",
      cancel: "Cancel",
      tabEdit: "Adjustments",
      scale: "Scale",
      moveX: "Horizontal",
      moveY: "Vertical",
      unlockFirst: "Remove background first to enable editing",
      processNow: "Remove Background Now",
      download: "Download Image",
      processing: "Processing with API...",
      workspace: "Workspace",
      chooseImage: "Choose Image",
    },
    tr: {
      title: "Arka Plan Silici ve Editör",
      desc: "Remove.bg API ile arka planı kaldırma aracı.",
      dragDrop: "Görsel seçin",
      historyTitle: "İşlem Geçmişi",
      noHistory: "Henüz işlem geçmişi yok.",
      limitReached: "Ücretsiz Sınıra Ulaşıldı (2/2)",
      proDesc: "2 ücretsiz hakkınızı kullandınız. Sınırsız kullanım için Pro'ya yükseltin.",
      proBtn: "Pro'ya Yükselt",
      usage: "Ücretsiz Kredi",
      downloadItem: "İndir",
      openItem: "Önizle",
      authTitle: "Giriş Yapılması Gerekiyor",
      authDesc: "Aracı kullanmak ve geçmişi kaydetmek için giriş yapın.",
      loginBtn: "Giriş Yap",
      cancel: "İptal",
      tabEdit: "Düzenleme Araçları",
      scale: "Boyut",
      moveX: "Yatay",
      moveY: "Dikey",
      unlockFirst: "Düzenlemeyi etkinleştirmek için önce arka planı kaldırın",
      processNow: "Arka Planı Şimdi Sil",
      download: "Görseli İndir",
      processing: "İşleniyor...",
      workspace: "Çalışma Alanı",
      chooseImage: "Görsel Seç",
    }
  };

  // @ts-ignore
  const t = translations[language] || translations.ar;

  const [isPro, setIsPro] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // تم تبسيط أدوات التعديل وإزالة الخلفيات
  const [scale, setScale] = useState<number>(1);
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);

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
        .from('remove_bg_history')
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
      console.error('Error fetching history:', err);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeUser) {
      setShowAuthModal(true);
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setScale(1); setPosX(0); setPosY(0);
    }
  };

  const processBackgroundRemoval = async () => {
    if (!activeUser || !isValidUUID(activeUser.id)) {
      setShowAuthModal(true);
      return;
    }
    if (!selectedFile) return;
    
    // إيقاف المعالجة إذا تجاوز الحد المجاني ولم يكن الحساب Pro
    if (usageCount >= 2 && !isPro) return;

    setIsProcessing(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;
      if (!apiKey) {
        alert("تنبيه: مفتاح الـ API غير موجود في ملف .env.local!");
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append('image_file', selectedFile);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بخدمة إزالة الخلفية، تأكد من صحة مفتاح الـ API.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);

      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const currentDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US');
      const newFileName = `No_Bg_${Date.now().toString().slice(-5)}.png`;
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

      const newHistoryItem = {
        id: generatedId,
        fileName: newFileName,
        date: currentDate,
        fileData: base64Data
      };

      await supabase
        .from('remove_bg_history')
        .insert({
          id: generatedId,
          user_id: activeUser.id,
          file_name: newFileName,
          file_data: base64Data
        });

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      setUsageCount(updatedHistory.length);

    } catch (error: any) {
      console.error("API Error:", error);
      alert(error.message || "حدث خطأ أثناء معالجة الصورة عبر الـ API.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openHistoryImage = (item: any) => {
    if (!item.fileData) return alert("بيانات الصورة غير متوفرة.");
    const win = window.open();
    if (win) {
      win.document.write(
        `<img src="${item.fileData}" style="max-width:100%; height:auto; display:block; margin:auto; background:#111;" />`
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
        
        <div className="flex-1 flex flex-col lg:flex-row gap-6 glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden min-h-[620px]">
          
          {usageCount >= 2 && !isPro && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-sm p-6 text-center">
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

          <div className="w-full lg:w-[320px] flex flex-col border-b lg:border-b-0 lg:border-l border-white/10 pl-0 lg:pl-6 pb-6 lg:pb-0">
            
            <div className="flex border-b border-white/10 mb-6">
              <div className="flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-2 text-pink-400 border-b-2 border-pink-400">
                <Sliders className="w-4 h-4" /> {t.tabEdit}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 max-h-[400px] custom-scrollbar space-y-6">
              {!processedImage ? (
                <p className="text-xs text-pink-400 text-center py-6 font-bold">{t.unlockFirst}</p>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">{t.scale} ({scale.toFixed(1)}x)</label>
                    <input type="range" min="0.5" max="2.5" step="0.1" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-pink-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">{t.moveX}</label>
                    <input type="range" min="-150" max="150" value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full accent-pink-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">{t.moveY}</label>
                    <input type="range" min="-150" max="150" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-pink-500" />
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 mt-auto flex flex-col gap-3">
              {!processedImage ? (
                <button
                  onClick={processBackgroundRemoval}
                  disabled={!selectedImage || isProcessing || (usageCount >= 2 && !isPro)}
                  className="btn-glowing w-full py-3 rounded-xl font-extrabold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : t.processNow}
                </button>
              ) : (
                <a
                  href={processedImage}
                  download={`Edited_${Date.now()}.png`}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-extrabold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  {t.download}
                </a>
              )}
            </div>

          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative bg-black/40 rounded-2xl border border-white/5 p-6 overflow-hidden checkered-bg">
            {!selectedImage ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/20">
                  <UploadCloud className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{t.workspace}</h3>
                <p className="text-sm text-gray-400 mb-6">{t.dragDrop}</p>
                <label className="btn-glowing px-6 py-3 rounded-xl font-bold text-white cursor-pointer inline-block text-sm">
                  {t.chooseImage}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={usageCount >= 2 && !isPro} />
                </label>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                {isProcessing && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-3" />
                    <span className="text-sm font-bold text-white">{t.processing}</span>
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={processedImage || selectedImage}
                  alt="Workspace"
                  style={{
                    transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
                    transition: 'transform 0.05s ease-out'
                  }}
                  className="max-h-[450px] object-contain drop-shadow-2xl z-10"
                />
              </div>
            )}
          </div>

        </div>

        <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6">
          
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
                         onClick={() => openHistoryImage(item)}
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

      <style dangerouslySetInnerHTML={{__html: `
        .checkered-bg {
          background-image: linear-gradient(45deg, #1f1f1f 25%, transparent 25%), 
                            linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #1f1f1f 75%), 
                            linear-gradient(-45deg, transparent 75%, #1f1f1f 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}} />
    </div>
  );
}