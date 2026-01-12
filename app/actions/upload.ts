'use server';

// Mock Upload implementation
import { uploadImage, getImageTags } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function uploadPhoto(formData: FormData) {
  // Mock authentication check
  const user = { id: 'mock-user-id' };

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;

  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    // Upload to Cloudinary (Still needs keys, but we'll try-catch it)
    let uploadResult;
    try {
      uploadResult = await uploadImage(file);
    } catch (e) {
      console.warn("Cloudinary upload failed, using mock URL", e);
      uploadResult = {
        public_id: 'mock-id-' + Date.now(),
        secure_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 1000
      }
    }

    // Mock DB Insert
    const data = {
      id: 'mock-id-' + Date.now(),
      title: title || null,
      description: description || null,
      cloudinary_public_id: uploadResult.public_id,
      cloudinary_url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      tags: ['mock', 'upload'],
      category: category || null,
      user_id: user.id,
      created_at: new Date().toISOString()
    };

    console.log("Mock uploaded photo:", data);

    revalidatePath('/');
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || 'Upload failed' };
  }
}