import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseWakeLockReturn {
  isSupported: boolean;
  isActive: boolean;
  requestWakeLock: () => Promise<void>;
  releaseWakeLock: () => Promise<void>;
}

/**
 * Custom hook to request and manage Screen Wake Lock API.
 * Prevents screen from sleeping or dimming when presentation is active.
 * Automatically re-acquires the lock when the tab/window regains visibility.
 */
export function useWakeLock(enabled: boolean = true): UseWakeLockReturn {
  const isSupported = typeof window !== 'undefined' && 'wakeLock' in navigator;
  const [isActive, setIsActive] = useState(false);
  const wakeLockSentinelRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return;

    try {
      // Release any existing lock before requesting a new one
      if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) {
        await wakeLockSentinelRef.current.release().catch(() => {});
      }

      const sentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinelRef.current = sentinel;
      setIsActive(true);

      sentinel.addEventListener('release', () => {
        setIsActive(false);
      });
    } catch {
      // Wake lock can fail if low battery or system policies forbid it
      setIsActive(false);
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockSentinelRef.current) {
      try {
        await wakeLockSentinelRef.current.release();
      } catch {
        // Ignore release errors
      } finally {
        wakeLockSentinelRef.current = null;
        setIsActive(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled || !isSupported) return;

    // Acquire lock on mount
    requestWakeLock();

    // Browsers automatically release wake locks when visibility changes (e.g. user tabs out).
    // Re-acquire automatically when page becomes visible again.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockSentinelRef.current) {
        wakeLockSentinelRef.current.release().catch(() => {});
        wakeLockSentinelRef.current = null;
      }
    };
  }, [enabled, isSupported, requestWakeLock]);

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  };
}
