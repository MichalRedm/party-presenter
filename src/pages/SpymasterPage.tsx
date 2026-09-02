import React from 'react';
import { useParty } from '../context/PartyContext';
import { CodenamesSpymaster } from '../modules/codenames/CodenamesSpymaster';
import { CodenamesConfig } from '../types/codenames';
import { Shield, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SpymasterPage: React.FC = () => {
  const { activeProfile, triggerConfetti } = useParty();

  // Find all codenames items in the profile
  const codenamesItems = activeProfile.items.filter(i => i.type === 'codenames');
  const [selectedItemId, setSelectedItemId] = React.useState<string>(
    codenamesItems[0]?.id || ''
  );

  const selectedItem = codenamesItems.find(i => i.id === selectedItemId) || codenamesItems[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-8 font-sans select-none">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              Klucz Kapitanów Tajniaków
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase border border-rose-500/30">
                ŚCIŚLE TAJNE
              </span>
            </h1>
            <p className="text-xs text-slate-400">{activeProfile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => triggerConfetti()}
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
          >
            Konfetti
          </Button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            title="Projektor (/)"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto">
        {codenamesItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
            <p className="text-xl font-bold text-slate-200">
              Brak aktywnej gry w Tajniaków w bieżącym programie.
            </p>
            <p className="text-sm text-slate-400">
              Dodaj moduł „Wielka Gra w Tajniaków” w panelu administracyjnym <a href="/admin" className="text-purple-400 underline font-bold">/admin</a>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {codenamesItems.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {codenamesItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      item.id === selectedItem?.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            )}

            {selectedItem && (
              <CodenamesSpymaster config={selectedItem.config as unknown as CodenamesConfig} />
            )}
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-slate-500">
        Party Presenter • Synchronizacja w czasie rzeczywistym z projektorem
      </footer>
    </div>
  );
};
