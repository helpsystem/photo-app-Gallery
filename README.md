# Cyberpunk Photo Gallery

A stunning, production-ready photo gallery web application built with Next.js 15, featuring AI-powered search, modern animations, and a cyberpunk aesthetic.

## Features

- 🎨 **Visual Masterpiece**: Dark cyberpunk theme with neon accents and glassmorphism effects
- 🖼️ **Masonry Gallery**: Beautiful animated photo grid with react-photo-album
- 🤖 **AI-Powered Search**: Cloudinary auto-tagging for intelligent photo discovery
- 📸 **Image Lightbox**: Full-featured image viewer with zoom, captions, and share
- 🔐 **Admin Dashboard**: Secure upload interface with drag-and-drop
- ⚡ **Performance**: Optimized images with Cloudinary transformations
- 🎭 **Animations**: Smooth transitions powered by Framer Motion
- 📱 **Responsive**: Fully responsive design for all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion + Aceternity UI effects
- **Backend**: Supabase (PostgreSQL + Auth)
- **Storage**: Cloudinary (with AI features)
- **UI Components**: Shadcn/ui + Custom Aceternity components

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier)
- Cloudinary account (free tier)

### Installation

1. **Clone the repository**

```bash
cd photo-gallery-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Set up Supabase Database**

Run this SQL in your Supabase SQL editor:

```sql
-- Create photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT,
  description TEXT,
  cloudinary_public_id TEXT NOT NULL,
  cloudinary_url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  tags TEXT[],
  category TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Photos are viewable by everyone"
  ON photos FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own photos"
  ON photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON photos FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better search performance
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_tags ON photos USING GIN(tags);
CREATE INDEX idx_photos_user_id ON photos(user_id);
```

5. **Configure Cloudinary**

In your Cloudinary dashboard:
- Enable "Auto Tagging" with Google Vision API
- Set up upload presets if needed
- Configure allowed formats and sizes

6. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
photo-gallery-app/
├── app/
│   ├── actions/          # Server actions
│   │   ├── photos.ts     # Photo fetching
│   │   └── upload.ts     # Upload handling
│   ├── admin/            # Admin dashboard
│   ├── auth/             # Authentication pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── template.tsx      # Page transitions
├── components/
│   ├── aceternity/       # Aceternity UI effects
│   │   ├── vortex.tsx
│   │   ├── background-beams.tsx
│   │   └── floating-nav.tsx
│   ├── admin/            # Admin components
│   │   └── upload-zone.tsx
│   ├── gallery/          # Gallery components
│   │   ├── gallery-grid.tsx
│   │   ├── gallery-client.tsx
│   │   ├── filters.tsx
│   │   ├── search-bar.tsx
│   │   └── gallery-header.tsx
│   ├── hero/             # Hero section
│   │   └── hero-section.tsx
│   └── ui/               # Shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── skeleton.tsx
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── cloudinary.ts     # Cloudinary utilities
│   └── utils.ts          # Helper functions
└── middleware.ts         # Auth middleware
```

## Features Overview

### Gallery Grid
- Masonry layout that adapts to screen size
- Smooth fade-in animations on scroll
- Hover effects with glow and 3D tilt
- Quick download and share buttons

### Search & Filter
- Real-time AI-powered search using Cloudinary tags
- Category filtering with animated transitions
- Debounced search for performance

### Admin Dashboard
- Drag-and-drop upload zone
- Batch upload support
- Metadata input (title, description, category)
- Progress indicators and toast notifications

### Image Lightbox
- Full-screen image viewing
- Zoom and pan capabilities
- Image metadata display
- Download and share options

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## Performance Optimization

- Images are automatically optimized by Cloudinary
- Blur placeholders for instant loading
- Lazy loading with intersection observer
- Server-side rendering for SEO
- React Server Components for better performance

## License

MIT License - feel free to use this project for your own purposes!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 15, TypeScript, and modern web technologies.