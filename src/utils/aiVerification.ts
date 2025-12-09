import { supabase } from '@/integrations/supabase/client';

/**
 * Convert a File to base64 data URL
 * @param file - File object to convert
 * @returns Promise that resolves to base64 data URL string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Verify report using AI (Gemini API via Supabase Edge Function)
 * @param base64Data - Base64 encoded image data (without data URL prefix)
 * @param mimeType - MIME type of the image (e.g., 'image/jpeg')
 * @param issueCategory - Selected issue category
 * @param userDescription - User's description of the issue
 * @param accessToken - Optional access token from current session (recommended to avoid race conditions)
 * @returns Promise with verification result
 */
export async function verifyReport(
  base64Data: string,
  mimeType: string,
  issueCategory: string,
  userDescription: string,
  accessToken?: string
): Promise<{ success: boolean; message: string }> {
  // Prepare the payload with all required data
  const verificationPayload = {
    base64Data,
    mimeType,
    issueCategory,
    userDescription,
  };

  try {
    // Get the Supabase anon key from environment
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Use the direct function URL provided by user
    const FUNCTION_URL =
      'https://vnnuxlxqbucchlaotbnv.supabase.co/functions/v1/verify-image';

    // If access token was provided, use it directly (preferred method)
    // Otherwise, try to get it from the session (fallback for backward compatibility)
    let authToken = accessToken;

    if (!authToken) {
      // Fallback: Try to get session with a single attempt and shorter timeout
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout')), 3000)
        );

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as {
          data: { session: any };
        };

        authToken = session?.access_token;
      } catch (error) {
        console.warn('Failed to get session for verification:', error);
        // Don't throw here - let the edge function call fail with proper error
      }
    }

    // Verify we have an auth token
    if (!authToken) {
      throw new Error(
        'Unable to verify authentication. Please ensure you are signed in and try again.'
      );
    }

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add Supabase anon key (required for edge functions)
    if (SUPABASE_ANON_KEY) {
      headers['apikey'] = SUPABASE_ANON_KEY;
    }

    // Add authorization header
    headers['Authorization'] = `Bearer ${authToken}`;

    // Make direct fetch call to the edge function with timeout
    const fetchPromise = fetch(FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(verificationPayload),
    });

    // Add 30 second timeout for fetch
    const fetchTimeoutPromise = new Promise<Response>((_, reject) =>
      setTimeout(
        () => reject(new Error('Fetch request timeout after 30 seconds')),
        30000
      )
    );

    const response = await Promise.race([fetchPromise, fetchTimeoutPromise]);

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails = 'Unknown error';
      let userFriendlyMessage = '';

      try {
        const errorJson = JSON.parse(errorText);
        // Try multiple possible error message fields (Supabase may use 'message', 'details', or 'error')
        const errorMessage = errorJson.message || '';
        errorDetails =
          errorJson.message ||
          errorJson.details ||
          errorJson.error ||
          errorText;
        const errorDetailsStr = String(errorDetails).toLowerCase();
        const errorMessageStr = String(errorMessage).toLowerCase();

        // Handle specific error status codes with user-friendly messages
        if (response.status === 401) {
          // Unauthorized - Invalid or expired JWT token
          userFriendlyMessage =
            'Your session has expired. Please sign in again and try submitting your report.';
        } else if (response.status === 502) {
          // Bad Gateway - Usually means Gemini API is overloaded
          if (
            errorDetailsStr.includes('overloaded') ||
            errorDetailsStr.includes('too many requests') ||
            errorDetailsStr.includes('model is overloaded') ||
            errorMessageStr.includes('overloaded') ||
            errorMessageStr.includes('model is overloaded')
          ) {
            userFriendlyMessage =
              'The AI service is currently overloaded with too many requests. Please try again in a few minutes.';
          } else if (errorMessage && errorMessage.trim()) {
            // If there's a specific error message, use it (it might already be user-friendly)
            userFriendlyMessage = errorMessage;
          } else {
            userFriendlyMessage =
              'The AI verification service is temporarily unavailable. Please try again in a few minutes.';
          }
        } else if (response.status === 500) {
          // Internal server error
          userFriendlyMessage =
            'The verification service encountered an error. Please try again in a moment.';
        } else if (response.status === 503) {
          // Service unavailable
          userFriendlyMessage =
            'The verification service is temporarily unavailable. Please try again later.';
        } else if (response.status === 429) {
          // Too many requests
          userFriendlyMessage =
            'Too many requests. Please wait a few minutes before trying again.';
        } else {
          // For other errors, use the message if available, otherwise use details
          userFriendlyMessage =
            errorMessage ||
            errorDetails ||
            `Verification failed. Please try again. (Error ${response.status})`;
        }
      } catch {
        // If JSON parsing fails, use the raw text
        errorDetails = errorText.substring(0, 200);
        const errorTextLower = errorText.toLowerCase();

        if (response.status === 401) {
          userFriendlyMessage =
            'Your session has expired. Please sign in again and try submitting your report.';
        } else if (response.status === 502) {
          if (
            errorTextLower.includes('overloaded') ||
            errorTextLower.includes('too many requests') ||
            errorTextLower.includes('model is overloaded')
          ) {
            userFriendlyMessage =
              'The AI service is currently overloaded with too many requests. Please try again in a few minutes.';
          } else {
            userFriendlyMessage =
              'The AI verification service is temporarily unavailable. Please try again in a few minutes.';
          }
        } else if (response.status === 429) {
          userFriendlyMessage =
            'Too many requests. Please wait a few minutes before trying again.';
        } else {
          userFriendlyMessage =
            errorDetails ||
            `Verification failed. Please try again. (Error ${response.status})`;
        }
      }

      // Throw error with user-friendly message
      const error = new Error(userFriendlyMessage);
      // Attach original details for debugging
      (error as any).originalDetails = errorDetails;
      (error as any).statusCode = response.status;
      throw error;
    }

    // Parse the response
    const verificationResult = await response.json();

    if (!verificationResult) {
      throw new Error('No response from verification service.');
    }

    // Check the verification flags
    if (!verificationResult?.is_verified) {
      // Verification failed, compile all error messages
      let errorMessage =
        'Report failed verification. Please review the following issues:\n';
      if (!verificationResult?.image_content_verified) {
        errorMessage += `\n- Image Error: ${verificationResult?.image_verification_message || 'Image does not match the selected category'}`;
      }
      if (!verificationResult?.description_keyword_verified) {
        errorMessage += `\n- Description Error: ${verificationResult?.description_verification_message || 'Description does not match the selected category'}`;
      }

      return { success: false, message: errorMessage.trim() };
    }

    // Verification successful!
    return {
      success: true,
      message: 'Report verified and ready for submission.',
    };
  } catch (error) {
    console.error('AI Verification error:', error);

    // Preserve the actual error message if it's an Error instance
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('Fetch request timeout')) {
        return {
          success: false,
          message:
            'The verification request timed out. Please check your connection and try again.',
        };
      }

      if (error.message.includes('Session timeout')) {
        return {
          success: false,
          message:
            'Unable to verify your session. Please sign in again and try submitting your report.',
        };
      }

      // If the error already has a user-friendly message, use it
      if (error.message && !error.message.includes('An unexpected error')) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    // Fallback for truly unexpected errors
    return {
      success: false,
      message:
        'An unexpected error occurred during AI verification. Please try again.',
    };
  }
}
