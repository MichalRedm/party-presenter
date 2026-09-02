import React, { useState, useRef } from 'react';
import { useParty } from '../../context/PartyContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { THEMES } from '../../themes/presets';
import {
  Sliders,
  Tv,
  Sparkles,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RotateCcw,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeProfile,
    state,
    setTheme,
    setSoundConfig,
    triggerConfetti,
    exportState,
    importState,
    resetToDefault,
    loadProfile,
    createNewProfile,
  } = useParty();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        importState(parsed);
        alert('Pomyślnie wczytano konfigurację imprezy!');
        setIsExportModalOpen(false);
      } catch {
        alert('Błąd podczas odczytu pliku JSON. Upewnij się, że plik jest poprawny.');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    createNewProfile(newProfileName.trim());
    setNewProfileName('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Active Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white font-black text-xl">
            🎉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black tracking-tight text-white">
                Party Presenter
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold tracking-wider uppercase border border-purple-500/30">
                PANEL ADMINA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Impreza: <strong className="text-white">{activeProfile.name}</strong>
            </p>
          </div>
        </div>

        {/* Global Live Controls (Sound, Confetti, Theme, Projector Link, Spymaster) */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Confetti button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => triggerConfetti()}
            className="text-amber-300 hover:text-amber-200 border-amber-500/30 shadow-sm shadow-amber-500/10"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Konfetti 🎉
          </Button>

          {/* Sound toggle & volume */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSoundConfig(!state.soundEnabled, state.soundVolume)}
            icon={state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          >
            {state.soundEnabled ? 'Dźwięki: Wł.' : 'Wyciszony'}
          </Button>

          {/* Theme selector dropdown */}
          <div className="w-44">
            <Select
              value={activeProfile.themeId}
              options={THEMES.map(t => ({ value: t.id, label: t.name }))}
              onChange={e => setTheme(e.target.value)}
            />
          </div>

          {/* Backup / Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            icon={<Sliders className="w-4 h-4" />}
          >
            Kopia / Profile
          </Button>

          {/* Spymaster View Link */}
          <a
            href="/spymaster"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all"
            title="Otwórz widok kapitanów Tajniaków"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-400" />
            <span>/spymaster</span>
            <ExternalLink className="w-3 h-3 text-purple-400/70" />
          </a>

          {/* Open Projector View Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Tv className="w-4 h-4" />
            <span>Otwórz Projektor (/)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {children}
      </main>

      {/* Backup, Export & Profile Management Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Zarządzanie profilami imprez i kopie zapasowe"
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Profile Switcher */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Wybierz aktywny profil imprezy
            </h4>
            <div className="flex gap-2">
              <Select
                value={state.activeProfileId}
                options={state.profiles.map(p => ({ value: p.id, label: `${p.name} (${p.items.length} punktów)` }))}
                onChange={e => loadProfile(e.target.value)}
              />
            </div>

            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={newProfileName}
                placeholder="Nazwa nowego profilu (np. Sylwester 2026)"
                onChange={e => setNewProfileName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <Button size="sm" variant="secondary" onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
                Utwórz
              </Button>
            </div>
          </div>

          {/* Export & Import JSON */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Eksport / Import konfiguracji (Plik JSON)
            </h4>
            <p className="text-xs text-slate-400">
              Pobierz plik z całą zaplanowaną imprezą (harmonogram, hasła Tajniaków, pytania z Gorącego Krzesła) na dysk lub wczytaj go na innym komputerze.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={exportState}
                icon={<Download className="w-4 h-4" />}
              >
                Pobierz kopię JSON
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                icon={<Upload className="w-4 h-4" />}
              >
                Wczytaj plik JSON
              </Button>
            </div>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Przywróć domyślny przykładowy program imprezy:</span>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Czy na pewno chcesz zresetować całą aplikację do stanu fabrycznego? Wszystkie niezapisane dane zostaną zastąpione domyślnym szablonem.')) {
                  resetToDefault();
                  setIsExportModalOpen(false);
                }
              }}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset do stanu początkowego
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
