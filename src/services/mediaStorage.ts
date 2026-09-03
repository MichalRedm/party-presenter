import { get, set, del, keys, createStore } from 'idb-keyval';

// Dedicated IndexedDB store for Party Presenter media assets
const mediaStore = createStore('party_presenter_media_db', 'media_assets');

// In-memory cache of Object URLs (blob URLs) so components can access synchronous strings quickly
const objectUrlCache = new Map<string, string>();

/**
 * Requests persistent storage from the browser so IndexedDB data
 * is never automatically evicted under storage pressure.
 */
export async function requestPersistentStorage(): Promise<{ persisted: boolean; quotaBytes?: number; usageBytes?: number }> {
  let persisted = false;
  let quotaBytes: number | undefined;
  let usageBytes: number | undefined;

  if (typeof navigator !== 'undefined' && navigator.storage) {
    try {
      if (navigator.storage.persist) {
        persisted = await navigator.storage.persist();
      } else if (navigator.storage.persisted) {
        persisted = await navigator.storage.persisted();
      }

      if (navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        quotaBytes = estimate.quota;
        usageBytes = estimate.usage;
      }
    } catch (err) {
      console.warn('Storage persistence request error:', err);
    }
  }

  return { persisted, quotaBytes, usageBytes };
}

/**
 * Checks if persistent storage is already granted.
 */
export async function checkStoragePersistence(): Promise<{ persisted: boolean; quotaBytes?: number; usageBytes?: number }> {
  let persisted = false;
  let quotaBytes: number | undefined;
  let usageBytes: number | undefined;

  if (typeof navigator !== 'undefined' && navigator.storage) {
    try {
      if (navigator.storage.persisted) {
        persisted = await navigator.storage.persisted();
      }
      if (navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        quotaBytes = estimate.quota;
        usageBytes = estimate.usage;
      }
    } catch {
      // Ignore errors in environments that don't support storage API
    }
  }

  return { persisted, quotaBytes, usageBytes };
}

/**
 * Stores a binary Blob or File in IndexedDB under a media key.
 * @param mediaKey e.g. "media:img_1720000000_abc"
 * @param blob Binary blob or file
 */
export async function saveMediaBlob(mediaKey: string, blob: Blob): Promise<string> {
  await set(mediaKey, blob, mediaStore);

  // Invalidate any previous cached Object URL for this key
  if (objectUrlCache.has(mediaKey)) {
    const oldUrl = objectUrlCache.get(mediaKey);
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    objectUrlCache.delete(mediaKey);
  }

  return mediaKey;
}

/**
 * Retrieves a binary Blob by its media key.
 */
export async function getMediaBlob(mediaKey: string): Promise<Blob | null> {
  try {
    const blob = await get<Blob>(mediaKey, mediaStore);
    return blob || null;
  } catch (err) {
    console.error(`Failed to load media blob for ${mediaKey}:`, err);
    return null;
  }
}

/**
 * Obtains an in-memory Object URL for a given mediaKey.
 * Reuses existing active Object URLs to avoid leaking memory.
 */
export async function resolveMediaUrl(urlOrMediaKey?: string): Promise<string> {
  if (!urlOrMediaKey) return '';

  // If it is an external URL, base64 data URL, or static public path, return directly
  if (!urlOrMediaKey.startsWith('media:')) {
    return urlOrMediaKey;
  }

  // Check cache
  if (objectUrlCache.has(urlOrMediaKey)) {
    return objectUrlCache.get(urlOrMediaKey)!;
  }

  // Load from IndexedDB
  const blob = await getMediaBlob(urlOrMediaKey);
  if (!blob) {
    console.warn(`Media asset not found in storage: ${urlOrMediaKey}`);
    return '';
  }

  const objectUrl = URL.createObjectURL(blob);
  objectUrlCache.set(urlOrMediaKey, objectUrl);
  return objectUrl;
}

/**
 * Synchronous check for cached Object URL.
 */
export function getCachedMediaUrl(urlOrMediaKey?: string): string {
  if (!urlOrMediaKey) return '';
  if (!urlOrMediaKey.startsWith('media:')) return urlOrMediaKey;
  return objectUrlCache.get(urlOrMediaKey) || '';
}

/**
 * Deletes a media blob from IndexedDB and revokes its Object URL.
 */
export async function deleteMediaBlob(mediaKey: string): Promise<void> {
  if (objectUrlCache.has(mediaKey)) {
    const url = objectUrlCache.get(mediaKey);
    if (url) URL.revokeObjectURL(url);
    objectUrlCache.delete(mediaKey);
  }
  await del(mediaKey, mediaStore);
}

/**
 * Returns all media entries currently stored in IndexedDB.
 */
export async function getAllMediaEntries(): Promise<Array<{ key: string; blob: Blob }>> {
  const allKeys = await keys(mediaStore);
  const entries: Array<{ key: string; blob: Blob }> = [];

  for (const key of allKeys) {
    const stringKey = String(key);
    const blob = await get<Blob>(stringKey, mediaStore);
    if (blob) {
      entries.push({ key: stringKey, blob });
    }
  }

  return entries;
}

/**
 * Clears all media from IndexedDB and revokes cached Object URLs.
 */
export async function clearAllMedia(): Promise<void> {
  for (const url of objectUrlCache.values()) {
    URL.revokeObjectURL(url);
  }
  objectUrlCache.clear();

  const allKeys = await keys(mediaStore);
  for (const key of allKeys) {
    await del(key, mediaStore);
  }
}

/**
 * Helper to convert Base64 Data URL to a Blob.
 */
export function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string } {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const binaryStr = atob(parts[1]);
  const len = binaryStr.length;
  const u8arr = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    u8arr[i] = binaryStr.charCodeAt(i);
  }

  return { blob: new Blob([u8arr], { type: mimeType }), mimeType };
}

/**
 * Generate a unique media key.
 */
export function createMediaKey(prefix: string = 'img'): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `media:${prefix}_${Date.now()}_${rand}`;
}
