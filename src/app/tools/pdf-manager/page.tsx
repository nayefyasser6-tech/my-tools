'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useLanguage } from '@/components/LanguageProvider';
import { UploadCloud, FileText, Loader2, Download } from 'lucide-react';

export default function PdfManagerPage() {
  const { t, language } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setFiles(prev => [...prev, ...selectedFiles]);
      setMergedPdfUrl(null); // إعادة تعيين النتيجة عند إضافة ملفات جديدة
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) return alert("الرجاء اختيار ملفين على الأقل للدمج.");
    
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
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("حدث خطأ أثناء دمج الملفات. تأكد من أنها ملفات PDF صالحة.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-32 px-6 relative z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            دمج ملفات PDF
          </h1>
          <p className="text-gray-400 text-lg">
            قم برفع ملفاتك، رتبها، وادمجها في ملف واحد بسرعة وبأمان تام داخل متصفحك.
          </p>
        </div>

        <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* منطقة الرفع */}
          <div className="border-2 border-dashed border-gray-600 rounded-2xl p-10 text-center hover:border-pink-500 transition-colors bg-white/5 relative">
            <input 
              type="file" 
              multiple 
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <UploadCloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-bold text-white mb-2">اضغط هنا أو اسحب الملفات لرفعها</p>
            <p className="text-sm text-gray-400">يدعم ملفات بصيغة PDF فقط</p>
          </div>

          {/* قائمة الملفات المرفوعة */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-white mb-4">الملفات المحددة ({files.length}):</h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-6 h-6 text-pink-400 shrink-0" />
                      <span className="text-gray-200 truncate font-medium" dir="ltr">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 font-bold px-3 shrink-0"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              {/* أزرار الإجراءات */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {!mergedPdfUrl ? (
                  <button 
                    onClick={mergePdfs}
                    disabled={isProcessing || files.length < 2}
                    className="btn-glowing w-full py-4 rounded-xl font-extrabold text-white text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "دمج الملفات الآن"}
                  </button>
                ) : (
                  <a 
                    href={mergedPdfUrl}
                    download="merged-document.pdf"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-extrabold text-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    <Download className="w-6 h-6" />
                    تحميل الملف المدمج
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}