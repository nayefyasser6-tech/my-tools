'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import FileUploader from '@/components/tools/FileUploader';

export default function ToolPage({ params }: { params: { id: string } }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // منطق تخيلي لتحديد اسم الأداة بناءً على الرابط
  const getToolName = (id: string) => {
    const tools: Record<string, string> = {
      'pdf-merge': 'دمج ملفات PDF',
      'bg-remove': 'إزالة خلفية الصور',
      'cv-builder': 'صانع السيرة الذاتية',
      'pdf-compress': 'ضغط حجم PDF'
    };
    return tools[id] || 'معالجة الملفات';
  };

  // تم حذف المعامل من هنا لتجنب خطأ المتغير غير المستخدم
  const handleUpload = async () => {
    setIsProcessing(true);
    
    // هنا سيتم لاحقاً كتابة كود الخصم من رصيد Supabase وإرسال الملف للـ API
    await new Promise(resolve => setTimeout(resolve, 3000)); // محاكاة وقت المعالجة
    
    setIsProcessing(false);
    setIsDone(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8 max-w-4xl">
      
      <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
        <Link 
          href="/tools" 
          className="p-2 hover:bg-ember rounded-full transition-colors text-gray-400 hover:text-parchment"
        >
          <ArrowRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-parchment">
            {getToolName(params.id)}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            ارفع ملفك الآن لبدء العملية بأمان وخصوصية تامة
          </p>
        </div>
      </div>

      {!isDone ? (
        <FileUploader 
          onUpload={handleUpload} 
          isProcessing={isProcessing} 
          maxSizeMB={10} // للمستخدم المجاني، يمكن جلبها من Supabase لاحقاً
        />
      ) : (
        <div className="bg-ember border border-green-900/50 rounded-xl p-12 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h3 className="font-grotesk text-2xl font-bold text-parchment mb-2">اكتملت المعالجة بنجاح!</h3>
            <p className="text-gray-400 text-sm">تم خصم رصيد عملية واحدة من حسابك.</p>
          </div>
          <div className="flex gap-4 justify-center pt-4">
            <button className="btn-primary">تحميل الملف</button>
            <button 
              onClick={() => setIsDone(false)}
              className="px-6 py-2 rounded-lg border border-gray-600 hover:bg-obsidian transition-colors text-sm font-semibold"
            >
              معالجة ملف آخر
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}