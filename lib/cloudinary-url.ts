export function getImageUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        quality?: string;
        format?: string;
    } = {}
): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return publicId; // Fallback or error

    const {
        width,
        height,
        quality = 'auto',
        format = 'auto'
    } = options;

    const params: string[] = [];
    if (width) params.push(`w_${width}`);
    if (height) params.push(`h_${height}`);
    if (quality) params.push(`q_${quality}`);
    if (format) params.push(`f_${format}`);

    // Add other default params for optimization if needed
    params.push('c_limit'); // crop limit to respect aspect ratio

    const paramsString = params.join(',');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${paramsString}/${publicId}`;
}
