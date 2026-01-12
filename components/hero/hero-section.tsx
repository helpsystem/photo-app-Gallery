'use client';

import { motion } from 'framer-motion';
import { Vortex } from '@/components/aceternity/vortex';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import type { Photo } from '@/app/actions/photos';
import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HeroSectionProps {
  featuredPhotos: Photo[];
}

export function HeroSection({ featuredPhotos }: HeroSectionProps) {
  const t = useTranslations('hero');
  return (
    <Vortex particleCount={150} className="relative min-h-screen flex flex-col items-center justify-center">
      <div className="relative z-20 flex w-full flex-grow flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 mt-20"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4 text-5xl font-bold leading-tight md:text-7xl"
          >
            <span className="text-gradient neon-glow">{t('title')}</span>
            <br />
            <span className="text-white drop-shadow-lg text-3xl md:text-5xl mt-4 block">{t('subtitle')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl drop-shadow-md"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#gallery"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-4 text-white transition-transform hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            <span className="relative z-10 flex items-center gap-2 font-semibold font-sans">
              {t('explore')}
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </span>
          </a>
        </motion.div>
      </div>

      {featuredPhotos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full z-10 bg-black/50 backdrop-blur-sm py-8 border-t border-white/10"
        >
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-6 text-2xl font-bold text-white text-center">{t('featured')}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featuredPhotos.slice(0, 4).map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src={photo.cloudinary_url}
                    alt={photo.title || 'Featured Art'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {photo.title && (
                        <h3 className="text-white text-sm font-semibold truncate">{photo.title}</h3>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </Vortex>
  );
}