import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';

export interface UploadedFile {
  originalname?: string;
  mimetype: string;
  buffer: Buffer;
}

const sanitizeSegment = (value: string) =>
  value
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const buildStoragePathFromSegments = (
  segments: Array<string | number | null | undefined>,
  file: UploadedFile,
): string => {
  const originalName = file.originalname || 'file';
  const extension = path.extname(originalName);
  const baseName = sanitizeSegment(path.basename(originalName, extension));
  const safeSegments = segments
    .map((segment) => sanitizeSegment(String(segment ?? '')))
    .filter(Boolean);
  const filename = `${Date.now()}-${baseName || 'file'}${extension}`;

  return [...safeSegments, filename].join('/');
};

export const buildStoragePath = (
  folder: string,
  ownerId: string,
  file: UploadedFile,
): string => {
  return buildStoragePathFromSegments([folder, ownerId || 'unknown'], file);
};

export const uploadFileToStorageAndGetSignedUrl = async (
  file: UploadedFile,
  objectPath: string,
): Promise<string> => {
  const bucket = getStorage().bucket();
  const storageFile = bucket.file(objectPath);

  await storageFile.save(file.buffer, {
    metadata: { contentType: file.mimetype },
    resumable: false,
  });

  const [signedUrl] = await storageFile.getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  });

  return signedUrl;
};

export const deleteFileFromStorage = async (fileUrl: string): Promise<void> => {
  if (!fileUrl) return;

  try {
    const bucket = getStorage().bucket();
    // Extract the file path from the signed URL
    const urlParts = fileUrl.split('/o/')[1];
    if (!urlParts) return;

    const filePath = decodeURIComponent(urlParts.split('?')[0]);
    const storageFile = bucket.file(filePath);

    const [exists] = await storageFile.exists();
    if (exists) {
      await storageFile.delete();
    }
  } catch (error) {
    // Log error but don't throw to prevent update from failing due to file deletion
    console.warn(`Failed to delete file from storage: ${error}`);
  }
};
