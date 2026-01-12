'use client';

import { useState, useEffect, useTransition } from 'react';
import { GalleryGrid } from './gallery-grid';
import { Filters } from './filters';
import { SearchBar } from './search-bar';
import type { Photo } from '@/app/actions/photos';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
      ))}
    </div>
  );
}

export function GalleryClient() {
  const t = useTranslations('gallery');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLoading(true);
    startTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await fetch(`/api/photos?${params.toString()}`);
        const data = await response.json();
        setPhotos(data.photos || []);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <SearchBar onSearch={setSearchQuery} />
      <Filters selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <AnimatePresence mode="wait">
        {loading || isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GallerySkeleton />
          </motion.div>
        ) : photos.length > 0 ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            <GalleryGrid photos={photos} />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 text-center"
          >
            <p className="text-xl text-gray-400">{t('noResults')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}