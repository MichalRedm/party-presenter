import React, { useRef } from 'react';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { TextSlideConfig } from './TextSlideProjector';
import { Image, Upload, Trash2 } from 'lucide-react';

export const TextSlideEditor: React.FC<{
  config: TextSlideConfig;
  onChange: (updatedConfig: TextSlideConfig) => void;
}> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...config, backgroundImage: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Input
        label="Tytuł slajdu (główny nagłówek)"
        value={config.title || ''}
        placeholder="np. Witajcie na Imprezie!"
        onChange={e => onChange({ ...config, title: e.target.value })}
      />

      <Input
        label="Podtytuł (opcjonalny)"
        value={config.subtitle || ''}
        placeholder="np. Czas na wspólne toasty i wspomnienia"
        onChange={e => onChange({ ...config, subtitle: e.target.value })}
      />

      <Textarea
        label="Treść główna / Wiadomość"
        rows={4}
        value={config.body || ''}
        placeholder="Wpisz treść, życzenia, instrukcję lub plan zabawy..."
        onChange={e => onChange({ ...config, body: e.target.value })}
      />

      <Input
        label="Etykieta / Tag (np. START, TOAST, OGŁOSZENIE)"
        value={config.tag || ''}
        placeholder="np. TOAST 🥂"
        onChange={e => onChange({ ...config, tag: e.target.value })}
      />

      <Select
        label="Wyrównanie tekstu"
        value={config.textAlign || 'center'}
        options={[
          { value: 'center', label: 'Wyśrodkowany (Zalecany na projektor)' },
          { value: 'left', label: 'Do lewej' },
          { value: 'right', label: 'Do prawej' },
        ]}
        onChange={e => onChange({ ...config, textAlign: e.target.value as 'center' | 'left' | 'right' })}
      />

      {/* Background Image Configuration */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Zdjęcie w tle
            </h4>
          </div>
          {config.backgroundImage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ ...config, backgroundImage: '' })}
              className="text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Usuń tło
            </Button>
          )}
        </div>

        <Input
          label="Adres URL zdjęcia"
          value={config.backgroundImage || ''}
          placeholder="https://images.unsplash.com/photo-..."
          onChange={e => onChange({ ...config, backgroundImage: e.target.value })}
        />

        <div className="flex items-center gap-3">
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
            Wgraj zdjęcie z komputera
          </Button>
          <span className="text-xs text-slate-400">JPG, PNG, WebP do 10MB</span>
        </div>

        {config.backgroundImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Widoczność tła (Przezroczystość): {Math.round((config.bgOpacity ?? 0.4) * 100)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={config.bgOpacity ?? 0.4}
                onChange={e => onChange({ ...config, bgOpacity: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rozmycie tła (Blur): {config.bgBlur ?? 0}px
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={config.bgBlur ?? 0}
                onChange={e => onChange({ ...config, bgBlur: parseInt(e.target.value, 10) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
