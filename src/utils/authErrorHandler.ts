import { AuthError } from '@supabase/supabase-js';

export interface AuthErrorInfo {
  isRetryable: boolean;
  userMessage: string;
  technicalMessage: string;
  shouldClearLocalState: boolean;
}

/**
 * Handles authentication errors and provides user-friendly messages
 * @param error - The authentication error
 * @param operation - The operation that failed (signUp, signIn, signOut, etc.)
 * @returns AuthErrorInfo with handling instructions
 */
export function handleAuthError(error: AuthError | Error | null, operation: string): AuthErrorInfo {
  if (!error) {
    return {
      isRetryable: false,
      userMessage: 'Operation completed successfully',
      technicalMessage: 'No error',
      shouldClearLocalState: false,
    };
  }

  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = (error as AuthError).code || '';

  // Handle 403 Forbidden errors (CORS/configuration issues)
  if (errorMessage.includes('403') || errorCode.includes('403')) {
    return {
      isRetryable: true,
      userMessage: `${operation} is temporarily unavailable. Please try again in a few minutes.`,
      technicalMessage: `403 Forbidden error during ${operation}: ${error.message}`,
      shouldClearLocalState: operation === 'signOut',
    };
  }

  // Handle network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('timeout')) {
    return {
      isRetryable: true,
      userMessage: 'Network error. Please check your connection and try again.',
      technicalMessage: `Network error during ${operation}: ${error.message}`,
      shouldClearLocalState: operation === 'signOut',
    };
  }

  // Handle CORS errors
  if (errorMessage.includes('cors') || errorMessage.includes('cross-origin')) {
    return {
      isRetryable: true,
      userMessage: 'Service temporarily unavailable. Please try again later.',
      technicalMessage: `CORS error during ${operation}: ${error.message}`,
      shouldClearLocalState: operation === 'signOut',
    };
  }

  // Handle authentication errors
  if (errorCode === 'invalid_credentials' || errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
    return {
      isRetryable: false,
      userMessage: 'Invalid email or password. Please check your credentials.',
      technicalMessage: `Invalid credentials during ${operation}: ${error.message}`,
      shouldClearLocalState: false,
    };
  }

  // Handle rate limiting
  if (errorCode === 'too_many_requests' || errorMessage.includes('rate limit')) {
    return {
      isRetryable: true,
      userMessage: 'Too many attempts. Please wait a moment before trying again.',
      technicalMessage: `Rate limited during ${operation}: ${error.message}`,
      shouldClearLocalState: false,
    };
  }

  // Handle email already exists
  if (errorCode === 'user_already_registered' || errorMessage.includes('already registered')) {
    return {
      isRetryable: false,
      userMessage: 'An account with this email already exists. Please sign in instead.',
      technicalMessage: `User already registered during ${operation}: ${error.message}`,
      shouldClearLocalState: false,
    };
  }

  // Handle weak password
  if (errorCode === 'weak_password' || errorMessage.includes('weak password')) {
    return {
      isRetryable: false,
      userMessage: 'Password is too weak. Please choose a stronger password.',
      technicalMessage: `Weak password during ${operation}: ${error.message}`,
      shouldClearLocalState: false,
    };
  }

  // Handle offline errors
  if (errorCode === 'offline_error') {
    return {
      isRetryable: false,
      userMessage: 'You are currently offline. Please check your internet connection.',
      technicalMessage: `Offline error during ${operation}: ${error.message}`,
      shouldClearLocalState: false,
    };
  }

  // Default error handling
  return {
    isRetryable: true,
    userMessage: `${operation} failed. Please try again.`,
    technicalMessage: `Unknown error during ${operation}: ${error.message}`,
    shouldClearLocalState: operation === 'signOut',
  };
}

/**
 * Creates a user-friendly error message for display
 * @param error - The authentication error
 * @param operation - The operation that failed
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: AuthError | Error | null, operation: string): string {
  const errorInfo = handleAuthError(error, operation);
  return errorInfo.userMessage;
}

/**
 * Logs authentication errors with appropriate level
 * @param error - The authentication error
 * @param operation - The operation that failed
 * @param context - Additional context for logging
 */
export function logAuthError(error: AuthError | Error | null, operation: string, context?: string): void {
  if (!error) return;

  const errorInfo = handleAuthError(error, operation);
  const logMessage = `${errorInfo.technicalMessage}${context ? ` (${context})` : ''}`;

  if (errorInfo.isRetryable) {
    console.warn(logMessage);
  } else {
    console.error(logMessage);
  }
}
