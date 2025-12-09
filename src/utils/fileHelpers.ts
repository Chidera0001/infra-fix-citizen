/**
 * Helper functions for File/Blob conversion
 * These don't require Dexie/IndexedDB, so they're safe for SSR
 */

/**
 * Helper to convert File[] to Blob[] for storage
 */
export async function filesToBlobs(files: File[]): Promise<Blob[]> {
  return Promise.all(
    files.map(file =>
      file.arrayBuffer().then(buffer => new Blob([buffer], { type: file.type }))
    )
  );
}

/**
 * Helper to convert Blob[] back to File[]
 */
export function blobsToFiles(
  blobs: Blob[],
  originalNames: string[] = []
): File[] {
  return blobs.map((blob, index) => {
    const name = originalNames[index] || `photo_${index}.jpg`;
    return new File([blob], name, { type: blob.type || 'image/jpeg' });
  });
}

