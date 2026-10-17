'use client';
import { useState } from 'react';

export default function WordToPdf() {
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState<string>('');

  const handleFile = async (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setError('');
    setHtmlContent('');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const mammoth = (await import('mammoth')).default;
      const html2pdf = (await import('html2pdf.js')).default;

      // تحويل الوورد إلى HTML
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);

      // تحويل الـ HTML إلى PDF وتحميله
      const element = document.getElementById('pdf-content');
      if (element) {
        const opt = {
          margin: 1,
          filename: file.name.replace('.docx', '.pdf'),
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
        };
        await html2pdf().set(opt).from(element).save();
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء تحويل الملف. تأكد من أنه ملف .docx صالح.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // أضفنا pt-32 لدفع المحتوى للأسفل وتجنب الهيدر
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full p-8 bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl text-center shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-white">تحويل Word إلى PDF</h1>
        
        {/* تصميم مخصص لزر رفع الملف ليدعم العربية ويطابق التصميم */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            اختر ملف Word (.docx)
            <input
              type="file"
              accept=".docx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
          
          {fileName && <span className="text-sm text-gray-300">الملف المحدد: {fileName}</span>}
        </div>

        {loading && (
          <div className="text-blue-400 animate-pulse my-4 font-bold">
            جاري التحويل والتحميل...
          </div>
        )}
        
        {error && <div className="text-red-400 my-4 bg-red-400/10 p-3 rounded-lg">{error}</div>}

        {/* حاوية مخفية تحتوي على النص المحول ليقوم html2pdf بقراءته */}
        <div className="hidden">
          <div id="pdf-content" className="p-10 bg-white text-black" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </div>
  );
}