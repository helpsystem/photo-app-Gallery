import { getPhotoById } from '@/app/actions/photos';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function PhotoPage({
    params,
}: {
    params: Promise<{ id: string; locale: string }>;
}) {
    const { id, locale } = await params;
    const photo = await getPhotoById(id);

    if (!photo) {
        notFound();
    }

    // Format date
    const date = new Date(photo.created_at).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <Link
                    href={`/${locale}/archive`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Archive
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Image Section */}
                    <div className="lg:col-span-2 relative">
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl shadow-purple-900/10">
                            <img
                                src={photo.cloudinary_url}
                                alt={photo.title || 'Archive Photo'}
                                className="w-full h-auto object-contain max-h-[85vh]"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                {photo.title || 'Untitled Work'}
                            </h1>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {photo.description || 'No description available for this item.'}
                            </p>
                        </div>

                        <div className="border-t border-white/10 pt-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                <span>Created on {date}</span>
                            </div>
                            {photo.category && (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Tag className="w-5 h-5 text-cyan-400" />
                                    <span className="capitalize">{photo.category}</span>
                                </div>
                            )}
                        </div>

                        {photo.tags && photo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {photo.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4 pt-6">
                            <Button
                                className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold py-6 rounded-xl shadow-lg shadow-cyan-900/20"
                            >
                                <Download className="w-5 h-5 mr-2" /> Download
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 border-white/10 hover:bg-white/5 text-white py-6 rounded-xl"
                            >
                                <Share2 className="w-5 h-5 mr-2" /> Share
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
