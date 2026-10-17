'use client';
import { useState } from 'react';

export default function RemoveBg() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFile = async (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setError('');
    setImage(null);
    
    try {
      // استيراد ديناميكي لتجنب مشاكل الـ SSR
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file);
      setImage(URL.createObjectURL(blob));
    } catch (err: any) {
      setError('حدث خطأ أثناء المعالجة. تأكد من أن الصورة صالحة وأن المكتبة مثبتة.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // أضفنا pt-32 وتنسيقات flex لتوسيط المحتوى أسفل الهيدر مباشرة
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full p-8 bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl text-center shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-white">إزالة الخلفية بالذكاء الاصطناعي</h1>
        
        {/* زر مخصص يطابق تصميم موقعك */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            اختر صورة
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
          {fileName && <span className="text-sm text-gray-300">الملف المحدد: {fileName}</span>}
        </div>

        {loading && (
          <div className="text-purple-400 animate-pulse my-4 font-bold">
            جاري المعالجة محلياً في متصفحك... (قد يستغرق بضع ثواني)
          </div>
        )}
        
        {error && <div className="text-red-400 my-4 bg-red-400/10 p-3 rounded-lg">{error}</div>}

        {image && (
          <div className="mt-6 flex flex-col items-center">
            {/* خلفية شطرنجية لإظهار الشفافية */}
            <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-800 rounded-lg p-4 mb-4 w-full flex justify-center border border-white/10">
              <img src={image} alt="Result" className="max-h-80 object-contain drop-shadow-lg" />
            </div>
            <a
              href={image}
              download="no-bg-image.png"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition w-full md:w-auto"
            >
              تحميل الصورة (PNG)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}