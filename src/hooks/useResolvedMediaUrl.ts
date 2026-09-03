import { useState, useEffect } from 'react';
import { resolveMediaUrl, getCachedMediaUrl } from '../services/mediaStorage';

/**
 * Custom hook that safely resolves an image URL or media key ('media:...')
 * into a renderable browser URL (blob: URL, http:, https:, data:).
 *
 * Automatically handles asynchronous IndexedDB fetching, in-memory caching,
 * and component unmount safety.
 */
export function useResolvedMediaUrl(urlOrMediaKey?: string): string {
  const [resolvedUrl, setResolvedUrl] = useState<string>(() => getCachedMediaUrl(urlOrMediaKey));

  useEffect(() => {
    if (!urlOrMediaKey) {
      setResolvedUrl('');
      return;
    }

    if (!urlOrMediaKey.startsWith('media:')) {
      setResolvedUrl(urlOrMediaKey);
      return;
    }

    let isMounted = true;

    // Resolve asynchronously from IndexedDB
    resolveMediaUrl(urlOrMediaKey).then(url => {
      if (isMounted) {
        setResolvedUrl(url);
      }
    }).catch(err => {
      console.error(`Error resolving media url for ${urlOrMediaKey}:`, err);
      if (isMounted) {
        setResolvedUrl('');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [urlOrMediaKey]);

  return resolvedUrl;
}
