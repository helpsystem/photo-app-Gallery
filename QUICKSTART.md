# Quick Start Guide

Get your Cyberpunk Photo Gallery up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 3. Set Up Supabase Database

1. Open Supabase SQL Editor
2. Copy and run `supabase-setup.sql`

## 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 5. Login to Admin Dashboard

1. Create a user in Supabase Auth dashboard
2. Go to `/auth/login`
3. Upload your first photos!

---

**Need detailed setup?** See [SETUP.md](./SETUP.md)

**Having issues?** Check the Troubleshooting section in SETUP.md