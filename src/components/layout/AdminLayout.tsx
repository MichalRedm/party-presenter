import React, { useState, useRef, useEffect } from 'react';
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
  Archive,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { checkStoragePersistence, requestPersistentStorage } from '../../services/mediaStorage';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeProfile,
    state,
    setTheme,
    setSoundConfig,
    triggerConfetti,
    exportState,
    exportPackage,
    importPackage,
    resetToDefault,
    loadProfile,
    createNewProfile,
  } = useParty();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isExportingPackage, setIsExportingPackage] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{ persisted: boolean; usageMb?: number }>({ persisted: false });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    checkStoragePersistence().then(info => {
      setStorageInfo({
        persisted: info.persisted,
        usageMb: info.usageBytes ? Math.round(info.usageBytes / (1024 * 1024)) : undefined,
      });
    });
  }, [isExportModalOpen]);

  const handleRequestPersistence = async () => {
    const res = await requestPersistentStorage();
    setStorageInfo({
      persisted: res.persisted,
      usageMb: res.usageBytes ? Math.round(res.usageBytes / (1024 * 1024)) : undefined,
    });
    if (res.persisted) {
      alert('Pamięć trwała została przyznana przez przeglądarkę! Twoje zdjęcia nie zostaną usunięte.');
    } else {
      alert('Przeglądarka działa w standardowym trybie pamięci.');
    }
  };

  const handleExportPackage = async () => {
    setIsExportingPackage(true);
    try {
      await exportPackage();
    } catch (err) {
      console.error('Export package error:', err);
      alert('Wystąpił błąd podczas pakowania paczki imprezy.');
    } finally {
      setIsExportingPackage(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importPackage(file);
      alert('Pomyślnie wczytano konfigurację imprezy i zaimportowano zdjęcia!');
      setIsExportModalOpen(false);
    } catch (err) {
      console.error('Import error:', err);
      alert('Błąd podczas odczytu pliku: ' + (err instanceof Error ? err.message : 'Nieprawidłowy plik'));
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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

          {/* Storage Persistence Status Card */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Trwałość Pamięci Przeglądarki (IndexedDB)
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {storageInfo.persisted ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pamięć trwała aktywna — Twoje wgrane zdjęcia nie zostaną automatycznie usunięte przez przeglądarkę.
                  </span>
                ) : (
                  <span>Przeglądarka może zarządzać pamięcią tymczasowo. Kliknij, aby wymusić trwałe zachowanie zdjęć.</span>
                )}
                {typeof storageInfo.usageMb === 'number' && (
                  <span className="text-slate-500 ml-2">({storageInfo.usageMb} MB zużycia)</span>
                )}
              </p>
            </div>
            {!storageInfo.persisted && (
              <Button size="sm" variant="outline" onClick={handleRequestPersistence}>
                Wymuś pamięć trwałą
              </Button>
            )}
          </div>

          {/* Export & Import Complete Party Package (.party / .zip) */}
          <div className="p-4 bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 rounded-xl border border-purple-800/40 space-y-3">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                Kompletna Paczka Imprezy (.party / .zip) — Rekomendowana
              </h4>
            </div>
            <p className="text-xs text-slate-300">
              Tworzy archiwum ZIP zawierające czysty, czytelny dla AI plik <strong className="text-white">party.json</strong> oraz folder ze wszystkimi wgranymi zdjęciami (<strong className="text-white">media/</strong>). Idealne do rozwijania imprezy z agentem AI i przenoszenia na inny laptop.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportPackage}
                icon={<Archive className="w-4 h-4" />}
                disabled={isExportingPackage}
              >
                {isExportingPackage ? 'Pakowanie archiwum ZIP...' : 'Pobierz paczkę (.party)'}
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".party,.zip,.json"
                className="hidden"
                onChange={handleImportFile}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                icon={<Upload className="w-4 h-4" />}
                disabled={isImporting}
              >
                {isImporting ? 'Rozpakowywanie i importowanie...' : 'Wczytaj paczkę (.party, .zip lub .json)'}
              </Button>
            </div>
          </div>

          {/* Legacy Export JSON */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Szybka Kopia Tekstowa (Pojedynczy plik JSON)
            </h4>
            <p className="text-xs text-slate-400">
              Pobiera wyłącznie plik tekstowy JSON. Jeśli zdjęcia są wgrane w pamięci przeglądarki, pobierz paczkę powyżej, aby przenieść również pliki zdjęć.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportState}
                icon={<Download className="w-4 h-4" />}
                className="border border-slate-800"
              >
                Pobierz sam plik JSON
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
