'use client';

import { useState, useRef } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  accept?: string;
  maxSizeMB?: number;
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUploader({ accept, maxSizeMB = 10, onUpload, isProcessing }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`حجم الملف يتجاوز الحد المسموح (${maxSizeMB}MB)`);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {!selectedFile ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            dragActive 
              ? 'border-parchment bg-ember' 
              : 'border-gray-700 hover:border-gray-500 bg-obsidian hover:bg-ember/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-parchment' : 'text-gray-500'}`} />
          <h3 className="text-lg font-grotesk font-semibold text-parchment mb-2">
            اضغط لاختيار ملف أو اسحبه إلى هنا
          </h3>
          <p className="text-sm text-gray-500">
            الحد الأقصى للملف: {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="bg-ember border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-4 bg-obsidian border border-gray-700 px-6 py-4 rounded-lg w-full">
            <File className="w-8 h-8 text-parchment flex-shrink-0" />
            <div className="flex-1 overflow-hidden text-right">
              <p className="text-sm font-medium text-parchment truncate" dir="ltr">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {!isProcessing && (
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button 
            onClick={() => onUpload(selectedFile)}
            disabled={isProcessing}
            className="btn-primary w-full py-3 flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              'بدء المعالجة'
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}