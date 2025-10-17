import { supabase } from '@/integrations/supabase/client';
import { VALIDATION } from '@/constants';

export const STORAGE_BUCKET = 'issue-images';

/**
 * Validate image file before upload
 * @param file - Image file to validate
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile(file: File): string | null {
  // Check file type
  if (!VALIDATION.allowedImageTypes.includes(file.type as any)) {
    return `Invalid file type. Allowed: JPEG, PNG, WebP`;
  }

  // Check file size
  if (file.size > VALIDATION.maxImageSize) {
    const maxSizeMB = VALIDATION.maxImageSize / (1024 * 1024);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return `File too large (${fileSizeMB}MB). Maximum size: ${maxSizeMB}MB`;
  }

  return null;
}

/**
 * Upload images to Supabase storage
 * @param files - Array of image files to upload
 * @param issueId - Optional issue ID for organizing uploads
 * @returns Array of public URLs for the uploaded images
 */
export async function uploadIssueImages(files: File[], issueId?: string): Promise<string[]> {
  if (!files || files.length === 0) {
    return [];
  }

  // Validate number of images
  if (files.length > VALIDATION.maxImagesPerReport) {
    throw new Error(`Maximum ${VALIDATION.maxImagesPerReport} images allowed per report`);
  }

  // Validate each file
  for (const file of files) {
    const validationError = validateImageFile(file);
    if (validationError) {
      throw new Error(validationError);
    }
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = issueId ? `${issueId}/${fileName}` : fileName;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error; // Throw error instead of continuing
    }
  }

  return uploadedUrls;
}

/**
 * Delete images from Supabase storage
 * @param urls - Array of image URLs to delete
 */
export async function deleteIssueImages(urls: string[]): Promise<void> {
  if (!urls || urls.length === 0) {
    return;
  }

  try {
    // Extract file paths from URLs
    const paths = urls.map(url => {
      const urlParts = url.split(`${STORAGE_BUCKET}/`);
      return urlParts[1];
    }).filter(Boolean);

    if (paths.length > 0) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove(paths);

      if (error) {
        console.error('Error deleting images:', error);
      }
    }
  } catch (error) {
    console.error('Failed to delete images:', error);
  }
}

/**
 * Convert base64 data URL to File object
 * @param dataUrl - Base64 data URL
 * @param filename - Name for the file
 * @returns File object
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

