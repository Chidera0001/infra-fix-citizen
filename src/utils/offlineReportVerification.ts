import { fileToBase64, verifyReport } from './aiVerification';

/**
 * Verification result for offline reports with specific error messages
 */
export interface OfflineVerificationResult {
  success: boolean;
  errorMessage?: string;
  imageVerified: boolean;
  descriptionVerified: boolean;
}

/**
 * Verify an offline report before syncing
 * @param photo - Photo file from offline storage
 * @param category - Issue category
 * @param description - User description
 * @returns Verification result with specific error messages
 */
export async function verifyOfflineReport(
  photo: File,
  category: string,
  description: string
): Promise<OfflineVerificationResult> {
  try {
    // Convert photo to base64
    const base64DataUrl = await fileToBase64(photo);
    const mimeType = photo.type || 'image/jpeg';
    const base64Data = base64DataUrl.split(',')[1];

    // Verify using AI
    const verificationResult = await verifyReport(
      base64Data,
      mimeType,
      category,
      description
    );

    if (!verificationResult.success) {
      // Parse the verification message to extract specific errors
      const message = verificationResult.message;

      // Extract image and description error messages
      const imageErrorMatch = message.match(/Image Error:\s*(.+?)(?:\n|$)/i);
      const descriptionErrorMatch = message.match(
        /Description Error:\s*(.+?)(?:\n|$)/i
      );

      const hasImageError = !!imageErrorMatch;
      const hasDescriptionError = !!descriptionErrorMatch;

      // Build specific error message
      let errorMessage = 'Sync failed: ';
      let imageVerified = true;
      let descriptionVerified = true;

      if (hasImageError && hasDescriptionError) {
        imageVerified = false;
        descriptionVerified = false;
        errorMessage +=
          'The image and description do not match the selected category. ';
        errorMessage += `Image: ${imageErrorMatch[1].trim()}. `;
        errorMessage += `Description: ${descriptionErrorMatch[1].trim()}`;
      } else if (hasImageError) {
        imageVerified = false;
        errorMessage += `The image does not match the selected category. ${imageErrorMatch[1].trim()}`;
      } else if (hasDescriptionError) {
        descriptionVerified = false;
        errorMessage += `The description does not match the selected category. ${descriptionErrorMatch[1].trim()}`;
      } else {
        // Fallback if message format is unexpected
        errorMessage +=
          'The report does not match the selected category. Please update your image or description.';
      }

      return {
        success: false,
        errorMessage: errorMessage.trim(),
        imageVerified,
        descriptionVerified,
      };
    }

    return {
      success: true,
      imageVerified: true,
      descriptionVerified: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: 'AI verification failed. Please try syncing again later.',
      imageVerified: false,
      descriptionVerified: false,
    };
  }
}
