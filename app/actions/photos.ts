'use server';

// Mock Data implementation for local demo
// Replaces Supabase dependency

export interface Photo {
  id: string;
  title: string | null;
  description: string | null;
  cloudinary_public_id: string;
  cloudinary_url: string;
  width: number;
  height: number;
  tags: string[] | null;
  category: string | null;
  created_at: string;
}

const MOCK_PHOTOS: Photo[] = [
  {
    id: 'ram-1',
    title: 'Persian Calligraphy & Illumination',
    description: 'Traditional Tazhib art with intricate floral patterns and calligraphy.',
    cloudinary_public_id: 'ram1',
    cloudinary_url: '/assets/ram-arts/art1.jpg',
    width: 800,
    height: 1200,
    tags: ['calligraphy', 'tazhib', 'persian'],
    category: 'art',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ram-2',
    title: 'Abstract Crimson Texture',
    description: 'Mixed media abstract art exploring texture and emotion.',
    cloudinary_public_id: 'ram2',
    cloudinary_url: '/assets/ram-arts/art2.jpg',
    width: 1200,
    height: 800,
    tags: ['abstract', 'painting', 'texture'],
    category: 'painting',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ram-3',
    title: 'Still Life with Vase',
    description: 'Watercolor realism capturing light and shadow on traditional pottery.',
    cloudinary_public_id: 'ram3',
    cloudinary_url: '/assets/ram-arts/art3.jpg',
    width: 900,
    height: 1200,
    tags: ['watercolor', 'still-life', 'pottery'],
    category: 'painting',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ram-4',
    title: 'Dynamic Motion',
    description: 'Expressive figure painting capturing the energy of dance.',
    cloudinary_public_id: 'ram4',
    cloudinary_url: '/assets/ram-arts/art4.jpg',
    width: 1000,
    height: 1000,
    tags: ['figurative', 'dance', 'energy'],
    category: 'painting',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ram-5',
    title: 'Color Explosion',
    description: 'Vibrant abstract composition with bold strokes and movement.',
    cloudinary_public_id: 'ram5',
    cloudinary_url: '/assets/ram-arts/art5.jpg',
    width: 1200,
    height: 800,
    tags: ['abstract', 'colorful', 'modern'],
    category: 'art',
    created_at: new Date().toISOString(),
  },
  {
    id: '1',
    title: 'Persian Column Detail',
    description: 'Intricate limestone column base design inspired by Persepolis.',
    cloudinary_public_id: 'pinterest1',
    cloudinary_url: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=800&q=80',
    width: 800,
    height: 1200,
    tags: ['architecture', 'persian', 'stone'],
    category: 'architecture',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Geometric Wood Carving',
    description: 'Laser cut wooden geometric patterns for wall art.',
    cloudinary_public_id: 'pinterest2',
    cloudinary_url: 'https://images.unsplash.com/photo-1620231362095-8b3e34b97148?w=800&q=80',
    width: 1000,
    height: 1000,
    tags: ['wood', 'laser', 'geometric'],
    category: 'woodwork',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Architectural Sketch - Façade',
    description: 'Hand-drawn preliminary sketch for a residential project.',
    cloudinary_public_id: 'pinterest3',
    cloudinary_url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=1200&q=80',
    width: 1200,
    height: 800,
    tags: ['sketch', 'drawing', 'plan'],
    category: 'sketch',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    title: 'Custom Leather Keychain',
    description: 'Minimalist leather keychain with engraved initials.',
    cloudinary_public_id: 'pinterest4',
    cloudinary_url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80',
    width: 800,
    height: 800,
    tags: ['leather', 'accessory', 'craft'],
    category: 'crafts',
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    title: 'Traditional Archway',
    description: 'Study of traditional Iranian brick archways.',
    cloudinary_public_id: 'pinterest5',
    cloudinary_url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&q=80',
    width: 800,
    height: 1100,
    tags: ['architecture', 'brick', 'arch'],
    category: 'architecture',
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '6',
    title: 'Calligraphy Concept',
    description: 'Modern fusion of calligraphy and structural lines.',
    cloudinary_public_id: 'pinterest6',
    cloudinary_url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200&q=80',
    width: 1200,
    height: 800,
    tags: ['art', 'calligraphy', 'modern'],
    category: 'art',
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '7',
    title: 'Concrete Texture Study',
    description: 'Raw concrete finish sample for interior walls.',
    cloudinary_public_id: 'pinterest7',
    cloudinary_url: 'https://images.unsplash.com/photo-1517646331032-9e8563c523a1?w=800&q=80',
    width: 1000,
    height: 800,
    tags: ['texture', 'concrete', 'material'],
    category: 'architecture',
    created_at: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: '8',
    title: 'Laser Engraved Map',
    description: 'Detailed wooden map engraving of Tehran.',
    cloudinary_public_id: 'pinterest8',
    cloudinary_url: 'https://images.unsplash.com/photo-1616423640778-2cfd1e99db92?w=800&q=80',
    width: 800,
    height: 1000,
    tags: ['map', 'wood', 'laser'],
    category: 'woodwork',
    created_at: new Date(Date.now() - 604800000).toISOString(),
  }
];

export async function getPhotos(options: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<Photo[]> {
  console.log('Fetching mock photos...', options);

  let filtered = [...MOCK_PHOTOS];

  // Filter by category
  if (options.category && options.category !== 'all') {
    filtered = filtered.filter(p => p.category === options.category);
  }

  // Filter by search
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title?.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.tags?.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  // Pagination (Mocked)
  const offset = options.offset || 0;
  const limit = options.limit || 20;

  return filtered.slice(offset, offset + limit);
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const photo = MOCK_PHOTOS.find(p => p.id === id);
  return photo || null;
}