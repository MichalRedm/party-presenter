import React, { useState } from 'react';
import { useParty } from '../../context/PartyContext';
import { Input, Textarea } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { Button } from '../../components/ui/Button';
import { AgendaConfig, AgendaItem } from './types';
import {
  Download,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  Link,
  Edit2,
  Check,
  Layout,
  Columns,
} from 'lucide-react';

export const AgendaEditor: React.FC<{
  config: AgendaConfig;
  onChange: (updatedConfig: AgendaConfig) => void;
}> = ({ config, onChange }) => {
  const { activeProfile } = useParty();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // New item draft inputs
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [newItemDuration, setNewItemDuration] = useState<number>(30);
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemLinkedId, setNewItemLinkedId] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const items = config.items || [];

  // Generate / import items from current activeProfile slides
  const handleImportFromSchedule = () => {
    if (
      items.length > 0 &&
      !window.confirm(
        'Czy na pewno chcesz zastąpić obecną listę punktów agendy punktami z programu imprezy?'
      )
    ) {
      return;
    }

    // Map profile items to agenda items (excluding the current agenda slide if desirable, or keeping all)
    const importedItems: AgendaItem[] = activeProfile.items.map(pItem => ({
      id: `agenda_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: pItem.title,
      time: pItem.time,
      durationMinutes: pItem.durationMinutes,
      notes: pItem.notes,
      linkedItemId: pItem.id,
    }));

    onChange({
      ...config,
      items: importedItems,
    });
  };

  // Add custom item
  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: AgendaItem = {
      id: `agenda_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newItemTitle.trim(),
      time: newItemTime.trim() || undefined,
      durationMinutes: newItemDuration || undefined,
      notes: newItemNotes.trim() || undefined,
      linkedItemId: newItemLinkedId || undefined,
    };

    onChange({
      ...config,
      items: [...items, newItem],
    });

    // Reset draft
    setNewItemTitle('');
    setNewItemTime('');
    setNewItemDuration(30);
    setNewItemNotes('');
    setNewItemLinkedId('');
    setIsAddingNew(false);
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    onChange({
      ...config,
      items: items.filter(item => item.id !== id),
    });
    if (editingItemId === id) {
      setEditingItemId(null);
    }
  };

  // Move item up/down
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChange({
      ...config,
      items: updated,
    });
  };

  // Update item field in-place
  const handleUpdateItem = (id: string, updates: Partial<AgendaItem>) => {
    onChange({
      ...config,
      items: items.map(item => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <Input
        label="Tytuł slajdu harmonogramu"
        value={config.title || ''}
        placeholder="np. Harmonogram Imprezy"
        onChange={e => onChange({ ...config, title: e.target.value })}
      />

      {/* Presentation Style & Layout */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
            <Layout className="w-4 h-4 text-purple-400" />
            Styl prezentacji harmonogramu na rzutniku
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => onChange({ ...config, layout: 'timeline' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                (config.layout || 'timeline') === 'timeline'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-sm text-purple-200">Oś Czasu (Stage Timeline)</div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">
                Pionowy przepływ, Apple Keynote look, zero scrolla.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, layout: 'horizontal' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                config.layout === 'horizontal'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-sm text-purple-200">Poziomy Stepper</div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">
                Horyzontalna oś krok po kroku (dla 3-5 punktów).
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, layout: 'grid' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                config.layout === 'grid'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-sm text-purple-200">Kompaktowa Siatka</div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">
                Lekkie chipsy w siatce 1-ekranowej bez zbędnych boksów.
              </div>
            </button>
          </div>
        </div>

        {/* Columns choice for timeline */}
        {(config.layout || 'timeline') === 'timeline' && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Columns className="w-3.5 h-3.5 text-purple-400" />
                Liczba kolumn osi czasu
              </span>
              <p className="text-[11px] text-slate-400">
                Automatycznie dzieli na 2 kolumny od 6 punktów, by uniknąć przewijania.
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              {(['auto', 1, 2] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange({ ...config, columns: option })}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    (config.columns ?? 'auto') === option
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {option === 'auto' ? 'Auto' : `${option} kol.`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sync on demand banner */}
      <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-purple-200">
            Punkt wyjścia z programu imprezy
          </h4>
          <p className="text-xs text-purple-300/80">
            Pobierz aktualne punkty ze slajdów jako bazę do edycji harmonogramu.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleImportFromSchedule}
          icon={<Download className="w-4 h-4 text-purple-400" />}
        >
          Pobierz z programu imprezy
        </Button>
      </div>

      {/* Items Section Header */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Pozycje harmonogramu ({items.length})
          </h4>

          {!isAddingNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingNew(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Dodaj punkt
            </Button>
          )}
        </div>

        {/* Add new item form */}
        {isAddingNew && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Nowy punkt harmonogramu
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Anuluj
              </button>
            </div>

            <Input
              label="Tytuł punktu"
              value={newItemTitle}
              placeholder="np. Przerwa na drinka / Tort / Swobodna zabawa"
              onChange={e => setNewItemTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Godzina"
                value={newItemTime}
                placeholder="np. 20:30"
                onChange={e => setNewItemTime(e.target.value)}
              />

              <Input
                label="Czas trwania (min)"
                type="number"
                value={newItemDuration}
                onChange={e => setNewItemDuration(parseInt(e.target.value, 10) || 30)}
              />
            </div>

            {/* Optional Slide Link */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Powiąż ze slajdem imprezy (opcjonalnie)
              </label>
              <select
                value={newItemLinkedId}
                onChange={e => setNewItemLinkedId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              >
                <option value="">Brak powiązania (samodzielny wpis)</option>
                {activeProfile.items.map(pItem => (
                  <option key={pItem.id} value={pItem.id}>
                    {pItem.title} ({pItem.type})
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Notatki prelegenta / Opis punktu"
              value={newItemNotes}
              placeholder="Wskazówki dla Ciebie do opowiedzenia przy tym punkcie..."
              rows={2}
              onChange={e => setNewItemNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingNew(false)}
              >
                Anuluj
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAddItem}
                disabled={!newItemTitle.trim()}
              >
                Dodaj do listy
              </Button>
            </div>
          </div>
        )}

        {/* List of items */}
        {items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-400 space-y-3">
            <p className="text-sm">Harmonogram nie zawiera jeszcze żadnych punktów.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImportFromSchedule}
              icon={<Download className="w-4 h-4 text-purple-400" />}
            >
              Wypełnij punktami z programu imprezy
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const isEditing = editingItemId === item.id;
              const linkedSlide = activeProfile.items.find(
                pItem => pItem.id === item.linkedItemId
              );

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold shrink-0">
                        {idx + 1}
                      </span>
                      {item.time && (
                        <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                          {item.time}
                        </span>
                      )}
                      <span className="font-bold text-slate-200 truncate">
                        {item.title}
                      </span>
                    </div>

                    {/* Actions: Move Up / Down, Edit, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                        title="Przesuń w górę"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'down')}
                        disabled={idx === items.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                        title="Przesuń w dół"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingItemId(isEditing ? null : item.id)}
                        className={`p-1 rounded transition-colors ${
                          isEditing
                            ? 'text-purple-400 bg-purple-500/20'
                            : 'text-slate-400 hover:text-purple-300'
                        }`}
                        title="Edytuj szczegóły"
                      >
                        {isEditing ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Edit2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Usuń"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary / Notes when collapsed */}
                  {!isEditing && (
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pl-8">
                      {item.notes ? (
                        <span className="line-clamp-1 italic">{item.notes}</span>
                      ) : (
                        <span className="text-slate-600">Brak opisu</span>
                      )}
                      <div className="flex items-center gap-3 shrink-0 ml-auto">
                        {item.durationMinutes && (
                          <span>~{item.durationMinutes} min</span>
                        )}
                        {linkedSlide && (
                          <span className="flex items-center gap-1 text-[11px] text-purple-400/90 font-medium">
                            <Link className="w-3 h-3" />
                            {linkedSlide.title}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Inline Edit Form when expanded */}
                  {isEditing && (
                    <div className="pt-3 border-t border-slate-850 space-y-3 pl-8 animate-in fade-in">
                      <Input
                        label="Tytuł"
                        value={item.title}
                        onChange={e =>
                          handleUpdateItem(item.id, { title: e.target.value })
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Godzina"
                          value={item.time || ''}
                          placeholder="np. 20:00"
                          onChange={e =>
                            handleUpdateItem(item.id, {
                              time: e.target.value || undefined,
                            })
                          }
                        />

                        <Input
                          label="Czas trwania (min)"
                          type="number"
                          value={item.durationMinutes || ''}
                          onChange={e =>
                            handleUpdateItem(item.id, {
                              durationMinutes: parseInt(e.target.value, 10) || undefined,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                          Powiązany slajd programu
                        </label>
                        <select
                          value={item.linkedItemId || ''}
                          onChange={e =>
                            handleUpdateItem(item.id, {
                              linkedItemId: e.target.value || undefined,
                            })
                          }
                          className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs"
                        >
                          <option value="">Brak powiązania</option>
                          {activeProfile.items.map(pItem => (
                            <option key={pItem.id} value={pItem.id}>
                              {pItem.title} ({pItem.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <Textarea
                        label="Notatki prelegenta / Opis punktu"
                        value={item.notes || ''}
                        placeholder="Wskazówki dla Ciebie do opowiedzenia przy tym punkcie..."
                        rows={2}
                        onChange={e =>
                          handleUpdateItem(item.id, {
                            notes: e.target.value || undefined,
                          })
                        }
                      />

                      <div className="flex justify-end pt-1">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setEditingItemId(null)}
                        >
                          Zatwierdź
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Toggles */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <Toggle
          checked={config.showEstimatedTimes !== false}
          onChange={checked => onChange({ ...config, showEstimatedTimes: checked })}
          label="Pokazuj zaplanowane godziny"
          description="Wyświetla zaplanowaną godzinę przy każdym punkcie na rzutniku"
        />

        <Toggle
          checked={config.showDescription === true}
          onChange={checked => onChange({ ...config, showDescription: checked })}
          label="Pokazuj notatki / opisy na rzutniku (Opcjonalnie)"
          description="Domyślnie wyłączone, by zachować czysty minimalistyczny slajd — notatki pozostają widoczne w Twoim panelu administratora"
        />
      </div>
    </div>
  );
};
