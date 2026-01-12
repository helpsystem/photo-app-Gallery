'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function GalleryHeader() {
  const t = useTranslations('gallery');
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-12 text-center"
    >
      <h2 className="mb-4 text-4xl font-bold md:text-5xl">
        <span className="text-gradient">{t('title')}</span>
      </h2>
      <p className="text-gray-400">
        {t('description')}
      </p>
    </motion.div>
  );
}