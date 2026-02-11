import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Brain,
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onAnalyze?: (file: File) => Promise<void>;
  isAnalyzing?: boolean;
  analysisResult?: {
    success: boolean;
    message?: string;
  };
  accept?: Record<string, string[]>;
  maxSize?: number;
  formatLabel?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onAnalyze,
  isAnalyzing = false,
  analysisResult,
  accept = { 'application/pdf': ['.pdf'] },
  maxSize = 50 * 1024 * 1024, // 50MB
  formatLabel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`檔案大小超過限制 (最大 ${Math.round(maxSize / 1024 / 1024)}MB)`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError(`不支援此檔案格式，請上傳${formatLabel || '支援格式的'}檔案`);
        } else {
          setError('檔案無法上傳，請重試');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);

        // Create preview URL for PDF
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onFileSelect, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  };

  const handleAnalyze = async () => {
    if (selectedFile && onAnalyze) {
      await onAnalyze(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${!isDragActive && !selectedFile ? 'border-slate-300 hover:border-primary-400 hover:bg-primary-50/50' : ''}
          ${selectedFile ? 'border-emerald-500 bg-emerald-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary-600' : 'text-primary-500'}`} />
              </div>

              <div>
                <p className="text-lg font-semibold text-slate-700">
                  {isDragActive ? '放開以上傳檔案' : '拖曳檔案到此處'}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  或 <span className="text-primary-600 font-medium">點擊瀏覽</span> 選擇檔案
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                <span>{formatLabel || '支援 PDF 格式'}</span>
                <span>•</span>
                <span>最大 {Math.round(maxSize / 1024 / 1024)}MB</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* File Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center flex-shrink-0 ${
                selectedFile?.name.match(/\.xlsx?$/i)
                  ? 'from-emerald-100 to-emerald-200'
                  : 'from-red-100 to-red-200'
              }`}>
                <FileText className={`w-7 h-7 ${
                  selectedFile?.name.match(/\.xlsx?$/i) ? 'text-emerald-600' : 'text-red-600'
                }`} />
              </div>

              {/* File Info */}
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Analysis Button */}
      {selectedFile && onAnalyze && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI 分析中...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                AI 自動分析論文
              </>
            )}
          </button>

          {/* Analysis Result */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center gap-2 p-3 rounded-xl ${
                  analysisResult.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {analysisResult.success ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">
                  {analysisResult.message || (analysisResult.success ? '分析完成' : '分析失敗')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
