'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadPhoto } from '@/app/actions/upload';
import { toast } from 'sonner';

export function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState<{ title: string; description: string; category: string }>({
    title: '',
    description: '',
    category: 'all',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('لطفاً حداقل یک فایل انتخاب کنید');
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title || file.name.replace(/\.[^/.]+$/, ''));
        formData.append('description', metadata.description);
        formData.append('category', metadata.category);

        const result = await uploadPhoto(formData);

        if (result.error) {
          toast.error(`آپلود ${file.name} ناموفق بود: ${result.error}`);
        } else {
          toast.success(`${file.name} با موفقیت آپلود شد!`);
        }
      }

      // Clear files and metadata after successful upload
      setFiles([]);
      setMetadata({ title: '', description: '', category: 'all' });
    } catch (error: any) {
      toast.error(`خطا در آپلود: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          'group relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-all',
          isDragActive
            ? 'border-purple-600 bg-purple-600/10'
            : 'border-purple-600/30 hover:border-purple-600 hover:bg-purple-600/5'
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ y: isDragActive ? [-5, 5, -5] : 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600"
        >
          <Upload className="h-8 w-8 text-white" />
        </motion.div>
        <p className="mb-2 text-lg font-semibold text-white">
          {isDragActive ? 'فایل‌ها را اینجا رها کنید' : 'فایل‌ها را اینجا بکشید و رها کنید'}
        </p>
        <p className="text-sm text-gray-400">
          یا کلیک کنید تا فایل انتخاب کنید (PNG, JPG, GIF, WEBP حداکثر 10MB)
        </p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">فایل‌های انتخاب شده ({files.length})</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative overflow-hidden rounded-lg bg-gray-900"
                >
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-32 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-600/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                    <p className="truncate text-xs text-white">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 rounded-lg border border-purple-600/30 bg-black/50 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  عنوان (اختیاری)
                </label>
                <Input
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                  placeholder="عنوان برای همه آثار"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  توضیحات (اختیاری)
                </label>
                <Input
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  placeholder="توضیحات برای همه آثار"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  دسته‌بندی
                </label>
                <select
                  value={metadata.category}
                  onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-purple-600/30 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">همه</option>
                  <option value="photography">عکاسی</option>
                  <option value="painting">نقاشی</option>
                  <option value="digital-art">هنر دیجیتال</option>
                  <option value="portrait">پرتره</option>
                  <option value="landscape">منظره</option>
                  <option value="abstract">انتزاعی</option>
                </select>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال آپلود...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    آپلود {files.length} {files.length === 1 ? 'اثر' : 'اثر'}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}