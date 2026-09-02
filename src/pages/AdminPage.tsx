import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { getAllAvailableModules, getModuleDefinition } from '../modules/registry';
import { PartyScheduleItem } from '../types/party';
import { HarmonogramEditor } from '../components/admin/HarmonogramEditor';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Tv,
  Music,
  Bell,
  AlarmCheck,
  Zap,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    activeProfile,
    activeItem,
    setActiveItem,
    nextItem,
    prevItem,
    addItem,
    deleteItem,
    reorderItems,
    updateItemMetadata,
    updateItemConfig,
    triggerConfetti,
    triggerSound,
  } = useParty();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNewType, setSelectedNewType] = useState<string>('text-slide');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [newItemDuration, setNewItemDuration] = useState<number>(30);
  const [newItemNotes, setNewItemNotes] = useState('');

  const [editingMetaItemId, setEditingMetaItemId] = useState<string | null>(null);

  const availableModules = getAllAvailableModules();
  const currentIndex = activeProfile.items.findIndex(i => i.id === activeItem?.id);

  // Handle Add Item
  const handleCreateItem = () => {
    if (!newItemTitle.trim()) return;

    const moduleDef = getModuleDefinition(selectedNewType);
    const newItem: PartyScheduleItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newItemTitle.trim(),
      type: selectedNewType,
      time: newItemTime.trim() || undefined,
      durationMinutes: newItemDuration || undefined,
      notes: newItemNotes.trim() || undefined,
      config: JSON.parse(JSON.stringify(moduleDef.defaultConfig)),
    };

    addItem(newItem);
    setActiveItem(newItem.id);
    setIsAddModalOpen(false);
    setNewItemTitle('');
    setNewItemTime('');
    setNewItemNotes('');
  };

  // Active module definition
  const activeModuleDef = activeItem ? getModuleDefinition(activeItem.type) : null;
  const ActiveEditorComponent = activeModuleDef?.AdminEditorComponent;
  const ActiveRemoteComponent = activeModuleDef?.AdminRemoteComponent;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* TOP SECTION: LIVE PRESENTER CONTROLLER */}
        <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border border-purple-500/30 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-400/40 shadow-lg shadow-purple-600/20 animate-pulse">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                  AKTUALNIE NA PROJEKTORZE (LIVE)
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {activeItem ? activeItem.title : 'Brak wybranego punktu'}
                </h2>
              </div>
            </div>

            {/* Slide Navigation Arrows */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={prevItem}
                disabled={currentIndex <= 0}
                icon={<ChevronLeft className="w-5 h-5" />}
              >
                Poprzedni slajd
              </Button>

              <span className="px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-sm font-bold text-slate-200">
                {currentIndex >= 0 ? currentIndex + 1 : 0} / {activeProfile.items.length}
              </span>

              <Button
                variant="primary"
                size="lg"
                onClick={nextItem}
                disabled={currentIndex >= activeProfile.items.length - 1}
              >
                Następny slajd
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Quick Audio & Celebration Soundboard */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Szybkie efekty:
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerSound('fanfare')}
              icon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Fanfary 🎺
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerSound('victory')}
              icon={<Music className="w-4 h-4 text-purple-300" />}
            >
              Zwycięstwo 🏆
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerSound('ding')}
              icon={<Bell className="w-4 h-4 text-emerald-300" />}
            >
              Dzwonek 🔔
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerSound('drumroll')}
              icon={<Volume2 className="w-4 h-4 text-blue-300" />}
            >
              Werbel 🥁
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerSound('buzzer')}
              icon={<AlarmCheck className="w-4 h-4 text-rose-400" />}
            >
              Buzzer / Błąd ❌
            </Button>

            <Button
              variant="glow"
              size="sm"
              onClick={() => triggerConfetti({ count: 180, spread: 90 })}
              className="ml-auto"
            >
              Wystrzel Konfetti! 🎉
            </Button>
          </div>

          {/* Module-Specific Live Remote Controller if present */}
          {ActiveRemoteComponent && activeItem && (
            <div className="pt-4 border-t border-white/10 animate-in fade-in">
              <ActiveRemoteComponent
                config={activeItem.config}
                onChange={newCfg => updateItemConfig(activeItem.id, newCfg)}
              />
            </div>
          )}
        </section>

        {/* TWO COLUMN WORKSPACE: SCHEDULE TIMELINE (LEFT) & MODULE CONFIG (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: TIMELINE & SCHEDULE (5 Cols) */}
          <div className="lg:col-span-5">
            <HarmonogramEditor
              items={activeProfile.items}
              activeItemId={activeItem?.id}
              onSelectItem={setActiveItem}
              onReorderItems={reorderItems}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onEditItemMeta={id => setEditingMetaItemId(id)}
              onDeleteItem={item => {
                if (window.confirm(`Czy na pewno chcesz usunąć punkt "${item.title}"?`)) {
                  deleteItem(item.id);
                }
              }}
            />
          </div>

          {/* RIGHT COLUMN: ACTIVE MODULE CONFIGURATION (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
              {activeItem && activeModuleDef ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                        {React.createElement(activeModuleDef.icon, { className: 'w-6 h-6' })}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">
                          Edycja: {activeItem.title}
                        </h3>
                        <p className="text-xs text-slate-400">{activeModuleDef.description}</p>
                      </div>
                    </div>

                    <Badge variant="purple" size="md">
                      Moduł: {activeModuleDef.id}
                    </Badge>
                  </div>

                  {/* Render the Active Module's Admin Editor Component */}
                  {ActiveEditorComponent && (
                    <ActiveEditorComponent
                      config={activeItem.config}
                      onChange={newConfig => updateItemConfig(activeItem.id, newConfig)}
                    />
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <p className="text-lg font-bold">Wybierz punkt programu z listy po lewej stronie</p>
                  <p className="text-xs">Możesz edytować jego zawartość, słowa, zdjęcia lub pytania.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD ITEM MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Dodaj nowy punkt programu"
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Module Type Selector Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Wybierz rodzaj modułu
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableModules.map(mod => {
                const isSelected = selectedNewType === mod.id;
                const Icon = mod.icon;

                return (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedNewType(mod.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-400/50 text-white'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-300' : 'text-slate-400'}`} />
                      <span className="text-sm font-bold truncate">{mod.name.split(' ')[0]}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                      {mod.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Item Basic Information */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <Input
              label="Tytuł punktu programu"
              value={newItemTitle}
              placeholder="np. Wielka gra w Tajniaków / Pokaz zdjęć / Tort"
              onChange={e => setNewItemTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Planowana godzina (np. 20:00)"
                value={newItemTime}
                placeholder="20:00"
                onChange={e => setNewItemTime(e.target.value)}
              />

              <Input
                label="Szacowany czas trwania (minuty)"
                type="number"
                min="5"
                max="240"
                value={newItemDuration}
                onChange={e => setNewItemDuration(parseInt(e.target.value, 10) || 30)}
              />
            </div>

            <Textarea
              label="Notatki / Krótki opis (widoczny w harmonogramie)"
              rows={2}
              value={newItemNotes}
              placeholder="np. Przygotuj rekwizyty i zaproś gości na parkiet..."
              onChange={e => setNewItemNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Anuluj
            </Button>
            <Button variant="glow" onClick={handleCreateItem} disabled={!newItemTitle.trim()}>
              Dodaj do harmonogramu
            </Button>
          </div>
        </div>
      </Modal>

      {/* EDIT ITEM METADATA MODAL */}
      {editingMetaItemId && (
        <Modal
          isOpen={true}
          onClose={() => setEditingMetaItemId(null)}
          title="Edytuj szczegóły punktu programu"
          maxWidth="md"
        >
          {(() => {
            const item = activeProfile.items.find(i => i.id === editingMetaItemId);
            if (!item) return null;

            return (
              <div className="space-y-4">
                <Input
                  label="Tytuł"
                  value={item.title}
                  onChange={e => updateItemMetadata(item.id, { title: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Godzina"
                    value={item.time || ''}
                    placeholder="np. 21:00"
                    onChange={e => updateItemMetadata(item.id, { time: e.target.value })}
                  />

                  <Input
                    label="Czas trwania (min)"
                    type="number"
                    value={item.durationMinutes || 30}
                    onChange={e => updateItemMetadata(item.id, { durationMinutes: parseInt(e.target.value, 10) || 30 })}
                  />
                </div>

                <Textarea
                  label="Notatki / Opis"
                  value={item.notes || ''}
                  onChange={e => updateItemMetadata(item.id, { notes: e.target.value })}
                />

                <div className="flex justify-end pt-3">
                  <Button variant="primary" onClick={() => setEditingMetaItemId(null)}>
                    Gotowe
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </AdminLayout>
  );
};
