import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: File | Buffer,
  folder: string = 'gallery'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:best' },
          { fetch_format: 'auto' },
        ],
        eager: [
          { width: 1000, crop: 'limit', quality: 'auto:good' },
          { width: 500, crop: 'limit', quality: 'auto:good' },
        ],
        auto_tagging: 0.6, // AI auto-tagging
        categorization: 'google_tagging', // Use Google Vision for better tagging
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width || 0,
            height: result.height || 0,
            format: result.format || '',
            bytes: result.bytes || 0,
          });
        }
      }
    );

    if (file instanceof File) {
      file.arrayBuffer().then((buffer) => {
        uploadStream.end(Buffer.from(buffer));
      });
    } else {
      uploadStream.end(file);
    }
  });
}

export function getImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    transformation?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    transformation = '',
  } = options;

  let url = cloudinary.url(publicId, {
    secure: true,
    quality,
    fetch_format: format,
  });

  if (width || height) {
    url = cloudinary.url(publicId, {
      secure: true,
      width,
      height,
      crop: 'limit',
      quality,
      fetch_format: format,
    });
  }

  if (transformation) {
    url += `,${transformation}`;
  }

  return url;
}

export async function generateBlurPlaceholder(
  publicId: string
): Promise<string> {
  const url = cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width: 20, height: 20, crop: 'fill', quality: 'auto:low' },
      { effect: 'blur:1000' },
    ],
    format: 'jpg',
  });

  // Fetch the image and convert to base64
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

export async function getImageTags(publicId: string): Promise<string[]> {
  try {
    const result = await cloudinary.api.resource(publicId, {
      image_metadata: true,
    });
    return result.info?.detection?.google_tagging?.map((tag: any) => tag.tag) || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}