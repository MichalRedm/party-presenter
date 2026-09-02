import { useEffect, useState } from 'react';
import { useParty } from '../context/PartyContext';
import { THEMES } from '../themes/presets';

export function useKeyboardNavigation(enabled: boolean = true) {
  const {
    nextItem,
    prevItem,
    triggerConfetti,
    setSoundConfig,
    state,
    activeProfile,
    setTheme,
  } = useParty();

  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes in input or textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        return;
      }

      switch (e.code) {
        case 'ArrowRight':
        case 'PageDown':
        case 'Space':
          e.preventDefault();
          nextItem();
          break;

        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevItem();
          break;

        case 'KeyF':
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;

        case 'KeyH':
          e.preventDefault();
          setShowHelp(prev => !prev);
          break;

        case 'KeyC':
          e.preventDefault();
          triggerConfetti();
          break;

        case 'KeyM':
          e.preventDefault();
          setSoundConfig(!state.soundEnabled, state.soundVolume);
          break;

        case 'KeyT': {
          e.preventDefault();
          const currThemeIdx = THEMES.findIndex(t => t.id === activeProfile.themeId);
          const nextTheme = THEMES[(currThemeIdx + 1) % THEMES.length];
          setTheme(nextTheme.id);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, nextItem, prevItem, triggerConfetti, setSoundConfig, state.soundEnabled, state.soundVolume, activeProfile.themeId, setTheme]);

  return {
    showHelp,
    setShowHelp,
  };
}
