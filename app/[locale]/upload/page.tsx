'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UploadPage() {
    const t = useTranslations('Upload');
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setFile(file);
        setPreview(URL.createObjectURL(file));
    }

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setUploading(true);
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        setUploading(false);
        setSuccess(true);
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center bg-black/95 text-white overflow-hidden py-24 px-4">
            {/* Artistic Background Overlay */}
            <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600&q=80')] bg-cover bg-center opacity-20 blur-sm"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-black/90 to-cyan-900/20"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="glass-panel border border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-black/40 shadow-2xl">
                    <div className="mb-8 text-center">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-bold mb-2">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                    {t('title')}
                                </span>
                            </h1>
                            <p className="text-gray-400 text-lg">{t('description')}</p>
                        </motion.div>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer
                            ${dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-600 hover:border-gray-400 hover:bg-white/5'}
                            ${preview ? 'border-transparent p-0 overflow-hidden' : ''}
                            `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {!preview ? (
                                    <>
                                        <Input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            onChange={handleChange}
                                            accept="image/*"
                                        />
                                        <div className="pointer-events-none z-10 flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                                                <Upload className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-xl font-medium text-white mb-2">{t('drop_zone')}</p>
                                            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="relative w-full aspect-video group">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="bg-red-500/80 p-3 rounded-full hover:bg-red-500 transition-colors"
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {file && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {t('uploading')}
                                            </>
                                        ) : (
                                            'Upload Artwork'
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">{t('success')}</h2>
                            <p className="text-gray-400 mb-8">Your artwork has been submitted for review.</p>
                            <button
                                onClick={() => { setSuccess(false); setFile(null); setPreview(null); }}
                                className="text-cyan-400 hover:text-cyan-300 font-medium"
                            >
                                Upload another
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </main>
    );
}

// Simple Input component to avoid dependency issues if UI lib is missing
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
);
