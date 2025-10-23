import { supabase } from '@/integrations/supabase/client';

/**
 * Test function to verify Supabase storage bucket is accessible
 * This can be called from the browser console to debug storage issues
 */
export async function testStorageBucket(): Promise<{
  success: boolean;
  error?: string;
  bucketExists?: boolean;
  canUpload?: boolean;
}> {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketError } =
      await supabase.storage.listBuckets();

    if (bucketError) {
      console.error('Error listing buckets:', bucketError);
      return {
        success: false,
        error: `Failed to list buckets: ${bucketError.message}`,
      };
    }

    const issueImagesBucket = buckets?.find(
      bucket => bucket.id === 'issue-images'
    );
    const bucketExists = !!issueImagesBucket;

    if (!bucketExists) {
      return {
        success: false,
        error:
          'issue-images bucket does not exist. Please run the storage setup script.',
        bucketExists: false,
      };
    }

    // Test upload with a small dummy file
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const testPath = `test-${Date.now()}.txt`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('issue-images')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('Error uploading test file:', uploadError);
      return {
        success: false,
        error: `Failed to upload test file: ${uploadError.message}`,
        bucketExists: true,
        canUpload: false,
      };
    }

    // Clean up test file
    await supabase.storage.from('issue-images').remove([testPath]);

    return {
      success: true,
      bucketExists: true,
      canUpload: true,
    };
  } catch (error) {
    console.error('Storage test failed:', error);
    return {
      success: false,
      error: `Storage test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testStorageBucket = testStorageBucket;
}
