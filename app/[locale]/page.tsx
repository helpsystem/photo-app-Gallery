import { getContent } from '@/app/actions/content';
import { ImmersiveHero } from '@/components/home/immersive-hero';
import { FeaturedGrid } from '@/components/home/featured-grid';
import { getPhotos } from '@/app/actions/photos';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Fetch dynamic content
  const content = await getContent();
  const latestPhotos = await getPhotos({ limit: 4 });

  return (
    <main className="min-h-screen bg-black antialiased selection:bg-cyan-500/30">
      {/* Dynamic Hero Section - Now Immersive */}
      <ImmersiveHero content={content.home.hero} />

      {/* Featured Collections */}
      <FeaturedGrid content={content.home.grid} />

      {/* Narrative Teaser (About) */}
      <section className="py-24 bg-neutral-900 border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <span className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-4 block">Our Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400 mb-8 max-w-3xl mx-auto">
            "Bridging the gap between ancient Persian artistry and contemporary design."
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed text-lg">
            {content.about.story.substring(0, 150)}...
          </p>
        </div>
      </section>

      {/* Latest Additions (Marquee effect ideally, but simple grid for now) */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-white">Latest Additions</h2>
        </div>

        {/* Horizontal Scroll / Carousel */}
        <div className="flex overflow-x-auto gap-4 px-4 pb-8 scrollbar-hide container mx-auto">
          {latestPhotos.map((photo) => (
            <div key={photo.id} className="min-w-[300px] aspect-[4/5] relative rounded-xl overflow-hidden border border-white/10 group">
              <img src={photo.cloudinary_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={photo.title || 'Art'} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <h4 className="text-white font-bold">{photo.title}</h4>
                <p className="text-gray-300 text-xs truncate">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}