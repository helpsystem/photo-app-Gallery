import { getPhotos } from '@/app/actions/photos';
import Link from 'next/link';

export default async function ArchivePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    // Get all photos for archive
    const photos = await getPhotos({ limit: 100 });

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            RAM ARCHIVE
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Explore our complete collection of architectural studies, sketches, and custom fabrications.
                    </p>
                </div>

                {/* Masonry-style Grid (Simulated with columns in Tailwind) */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {photos.map((photo, i) => (
                        <div key={photo.id} className="break-inside-avoid group relative block">
                            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gray-900 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                                {/* Image */}
                                <img
                                    src={photo.cloudinary_url}
                                    alt={photo.title || 'Archive Item'}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">{photo.category || 'Design'}</span>
                                    <h3 className="text-2xl font-bold text-white mb-1">{photo.title}</h3>
                                    <p className="text-gray-300 text-sm line-clamp-2">{photo.description}</p>

                                    <Link
                                        href={`/photo/${photo.id}`}
                                        className="mt-4 inline-flex items-center text-sm font-semibold text-white border-b border-cyan-500 pb-1 w-max"
                                    >
                                        View Project
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
