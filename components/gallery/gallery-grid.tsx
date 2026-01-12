'use client';

import { useState, useCallback } from 'react';
import PhotoAlbum from 'react-photo-album';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Download, Share2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/lib/cloudinary-url';
import type { Photo } from '@/app/actions/photos';

interface GalleryGridProps {
  photos: Photo[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [index, setIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const slides = photos.map((photo) => {
    const url = photo.cloudinary_public_id
      ? getImageUrl(photo.cloudinary_public_id, { quality: 'auto:best' })
      : photo.cloudinary_url;
    return {
      src: url,
      width: photo.width,
      height: photo.height,
      title: photo.title || undefined,
      description: photo.description || undefined,
      alt: photo.title || 'Photo',
    };
  });

  const photosForAlbum = photos.map((photo) => {
    const url = photo.cloudinary_public_id
      ? getImageUrl(photo.cloudinary_public_id, { width: 800, quality: 'auto:good' })
      : photo.cloudinary_url;
    return {
      src: url,
      width: photo.width,
      height: photo.height,
      key: photo.id,
      alt: photo.title || 'Photo',
    };
  });

  const handleDownload = async (photo: Photo) => {
    const url = photo.cloudinary_public_id
      ? getImageUrl(photo.cloudinary_public_id, { quality: 'auto:best' })
      : photo.cloudinary_url;
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${photo.title || 'photo'}-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleShare = async (photo: Photo) => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title || 'Photo',
          text: photo.description || '',
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <PhotoAlbum
          photos={photosForAlbum}
          layout="masonry"
          spacing={20}
          columns={(containerWidth) => {
            if (containerWidth < 640) return 1;
            if (containerWidth < 1024) return 2;
            if (containerWidth < 1536) return 3;
            return 4;
          }}
          render={{
            photo: (renderProps: any) => {
              const { photo, imageProps, wrapperStyle } = renderProps;
              if (!photo) return <div />;

              const { alt, style, ...restImageProps } = imageProps || {};
              const photoIndex = photosForAlbum.findIndex((p) => p.key === photo.key);
              const isHovered = hoveredIndex === photoIndex;

              return (
                <motion.div
                  variants={itemVariants as any}
                  style={{ ...wrapperStyle, position: 'relative' }}
                  onMouseEnter={() => setHoveredIndex(photoIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setIndex(photoIndex)}
                >
                  <img
                    {...restImageProps}
                    alt={alt || photo.title || 'Photo'}
                    style={style}
                    className={cn(
                      'h-full w-full object-cover transition-all duration-500',
                      isHovered && 'scale-110 brightness-110'
                    )}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {photos[photoIndex]?.title && (
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {photos[photoIndex].title}
                        </h3>
                      )}
                      {photos[photoIndex]?.tags && photos[photoIndex].tags!.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {photos[photoIndex].tags!.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-purple-600/50 text-purple-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  {isHovered && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-4 right-4 flex gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photos[photoIndex]);
                        }}
                        className="glass rounded-full p-2 text-white hover:text-cyan-400 transition-colors"
                      >
                        <Download className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photos[photoIndex]);
                        }}
                        className="glass rounded-full p-2 text-white hover:text-purple-400 transition-colors"
                      >
                        <Share2 className="h-5 w-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              );
            }
          }}
        />
      </motion.div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
      />
    </>
  );
}