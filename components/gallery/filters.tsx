'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const categoryKeys = [
  'all',
  'photography',
  'painting',
  'digitalArt',
  'portrait',
  'landscape',
  'abstract',
] as const;

interface FiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Filters({ selectedCategory, onCategoryChange }: FiltersProps) {
  const t = useTranslations('gallery.categories');
  return (
    <div className="sticky top-24 z-40 mb-8 flex flex-wrap items-center justify-center gap-4">
      {categoryKeys.map((key) => {
        const categoryId = key === 'digitalArt' ? 'digital-art' : key;
        const isActive = selectedCategory === categoryId;
        return (
          <motion.button
            key={key}
            onClick={() => onCategoryChange(categoryId)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative rounded-full px-6 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                : 'glass text-gray-300 hover:text-white'
            )}
          >
            {t(key)}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t(key)}</span>
          </motion.button>
        );
      })}
    </div>
  );
}