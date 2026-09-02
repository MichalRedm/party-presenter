import React, { useState } from 'react';
import { useParty } from '../../context/PartyContext';
import { AmbientParticles } from '../effects/AmbientParticles';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Palette,
} from 'lucide-react';
import { THEMES } from '../../themes/presets';

export const ProjectorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTheme,
    activeProfile,
    activeItem,
    nextItem,
    prevItem,
    triggerConfetti,
    setSoundConfig,
    state,
    setTheme,
  } = useParty();

  const { showHelp, setShowHelp } = useKeyboardNavigation(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleNextTheme = () => {
    const currIdx = THEMES.findIndex(t => t.id === activeProfile.themeId);
    const next = THEMES[(currIdx + 1) % THEMES.length];
    setTheme(next.id);
  };

  const currentIndex = activeProfile.items.findIndex(i => i.id === activeItem?.id);
  const totalItems = activeProfile.items.length;

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${activeTheme.colors.bgGradient} transition-colors duration-1000 flex flex-col justify-between select-none`}
      onMouseMove={() => {
        setControlsVisible(true);
      }}
      onMouseLeave={() => setControlsVisible(false)}
    >
      {/* Background Ambient Particles matching theme */}
      <AmbientParticles type={activeTheme.particleType} glowColor={activeTheme.colors.accentPrimary} />

      {/* Main Center Stage */}
      <main className="relative z-10 w-full h-full flex-1 flex items-center justify-center overflow-hidden">
        {children}
      </main>

      {/* Discreet Projector Navigation & Overlay Bar (auto-hides) */}
      <footer
        className={`fixed bottom-0 inset-x-0 z-30 p-4 transition-opacity duration-300 flex items-center justify-between ${
          controlsVisible ? 'opacity-100' : 'opacity-0 hover:opacity-100'
        }`}
      >
        {/* Left: Item Counter & Title */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-xs font-semibold text-slate-300 max-w-xs md:max-w-sm">
          <span className="font-mono text-purple-400 font-bold shrink-0">
            {currentIndex >= 0 ? currentIndex + 1 : 1} / {totalItems}
          </span>
          <span className="text-white font-bold truncate">
            {activeItem?.title}
          </span>
        </div>

        {/* Center: Slide Arrows & Quick Triggers - ALWAYS strictly centered */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevItem}
            disabled={currentIndex <= 0}
            aria-label="Poprzedni slajd"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => triggerConfetti()}
            className="text-amber-300 hover:text-amber-200"
            title="Wystrzel konfetti (Klawisz C)"
          >
            <Sparkles className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextItem}
            disabled={currentIndex >= totalItems - 1}
            aria-label="Następny slajd"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Right: Sound, Theme, Fullscreen, Admin Link, Help */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundConfig(!state.soundEnabled, state.soundVolume)}
            title="Włącz/Wyłącz dźwięki (Klawisz M)"
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextTheme}
            title={`Zmień motyw (${activeTheme.name}) - Klawisz T`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            title="Tryb pełnoekranowy (Klawisz F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(true)}
            title="Pomoc i skróty klawiszowe (Klawisz H)"
          >
            <HelpCircle className="w-4 h-4 text-slate-300" />
          </Button>

          <a
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Otwórz Panel Zarządzania (/admin)"
          >
            <Settings className="w-4 h-4" />
          </a>
        </div>
      </footer>

      {/* Keyboard Shortcuts Help Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Skróty klawiszowe prezentacji"
        maxWidth="md"
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-300 font-medium">Następny punkt programu</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-purple-300">
              Spacja / Strzałka w prawo
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-300 font-medium">Poprzedni punkt programu</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-purple-300">
              Strzałka w lewo
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-300 font-medium">Pełny ekran (Fullscreen)</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-purple-300">
              F / F11
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-300 font-medium">Wystrzał konfetti 🎉</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-purple-300">
              C
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-300 font-medium">Wycisz / Włącz dźwięki 🔊</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-purple-300">
              M
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-300 font-medium">Zmień motyw wizualny 🎨</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-purple-300">
              T
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-300 font-medium">Otwórz to okno pomocy</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-purple-300">
              H
            </kbd>
          </div>
        </div>
      </Modal>
    </div>
  );
};
