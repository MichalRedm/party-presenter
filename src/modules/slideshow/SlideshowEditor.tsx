import React, { useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { SlideshowConfig, SlideshowImage } from './SlideshowProjector';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

export const SlideshowEditor: React.FC<{
  config: SlideshowConfig;
  onChange: (updatedConfig: SlideshowConfig) => void;
}> = ({ config, onChange }) => {
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const images = config.images || [];

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;
    const newImage: SlideshowImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      url: newUrl.trim(),
      caption: newCaption.trim() || undefined,
    };
    onChange({ ...config, images: [...images, newImage] });
    setNewUrl('');
    setNewCaption('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newImage: SlideshowImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          url: reader.result,
          caption: newCaption.trim() || undefined,
        };
        onChange({ ...config, images: [...images, newImage] });
        setNewCaption('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (id: string) => {
    onChange({ ...config, images: images.filter(img => img.id !== id) });
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    onChange({
      ...config,
      images: images.map(img => (img.id === id ? { ...img, caption } : img)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Playback Settings */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          Ustawienia odtwarzania
        </h4>
        <Toggle
          checked={config.autoPlay !== false}
          onChange={checked => onChange({ ...config, autoPlay: checked })}
          label="Automatyczne przewijanie zdjęć"
          description="Samodzielnie zmienia slajd po określonym czasie"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Czas wyświetlania każdego zdjęcia: {config.intervalSeconds || 6} sekund
          </label>
          <input
            type="range"
            min="3"
            max="30"
            step="1"
            value={config.intervalSeconds || 6}
            onChange={e => onChange({ ...config, intervalSeconds: parseInt(e.target.value, 10) })}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Add New Image Form */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          Dodaj nowe zdjęcie
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Adres URL zdjęcia"
            value={newUrl}
            placeholder="https://..."
            onChange={e => setNewUrl(e.target.value)}
          />
          <Input
            label="Podpis pod zdjęciem (opcjonalny)"
            value={newCaption}
            placeholder="np. Wspólny wyjazd w góry 🏔️"
            onChange={e => setNewCaption(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddUrl}
            disabled={!newUrl.trim()}
          >
            Dodaj z linku URL
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-4 h-4" />}
          >
            Wgraj z dysku
          </Button>
        </div>
      </div>

      {/* Existing Images List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>Lista zdjęć ({images.length})</span>
        </h4>

        {images.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Brak dodanych zdjęć.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl"
              >
                <div className="w-16 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                  {img.url ? (
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1">
                  <span className="text-xs text-slate-500 font-bold">#{idx + 1}</span>
                  <input
                    type="text"
                    value={img.caption || ''}
                    placeholder="Wpisz podpis..."
                    onChange={e => handleUpdateCaption(img.id, e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-200 focus:outline-none border-b border-transparent focus:border-purple-500"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveImage(img.id)}
                  className="text-rose-400 hover:text-rose-300"
                  aria-label="Usuń zdjęcie"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
