-- Supabase Database Setup for Art Gallery (عکاسی و نقاشی)
-- Run this SQL in your Supabase SQL Editor

-- Create artworks table (photos)
CREATE TABLE IF NOT EXISTS photos (
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

-- Drop existing policies if they exist (for re-running)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Photos are viewable by everyone" ON photos;
  DROP POLICY IF EXISTS "Users can insert their own photos" ON photos;
  DROP POLICY IF EXISTS "Users can update their own photos" ON photos;
  DROP POLICY IF EXISTS "Users can delete their own photos" ON photos;
END $$;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_tags ON photos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);

-- Optional: Create a function to search photos by tags
CREATE OR REPLACE FUNCTION search_photos_by_tags(search_tags TEXT[])
RETURNS SETOF photos AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM photos
  WHERE tags && search_tags
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;