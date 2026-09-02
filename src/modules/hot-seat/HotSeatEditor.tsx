import React, { useState, useRef } from 'react';
import { HotSeatConfig, HotSeatQuestion } from '../../types/hotseat';
import { parseGoogleFormQuestions } from '../../services/csvParser';
import { Button } from '../../components/ui/Button';
import { Textarea, Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { Badge } from '../../components/ui/Badge';
import { Upload, FileSpreadsheet, Plus, Trash2, Eye, EyeOff, Check, Info } from 'lucide-react';

export const HotSeatEditor: React.FC<{
  config: HotSeatConfig;
  onChange: (updatedConfig: HotSeatConfig) => void;
}> = ({ config, onChange }) => {
  const [pastedData, setPastedData] = useState('');
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [showSecretQuestions, setShowSecretQuestions] = useState(!config.blindImportMode);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const questions = config.questions || [];
  const categories = config.categories || [];

  const handleProcessImport = (text: string) => {
    const result = parseGoogleFormQuestions(text);
    if (result.questions.length === 0) {
      alert('Nie udało się wykryć żadnych pytań. Upewnij się, że wklejasz poprawny format z Formularzy Google / Google Sheets.');
      return;
    }

    const updatedCategories = Array.from(new Set([...categories, ...result.categories]));
    const updatedQuestions = [...questions, ...result.questions];

    onChange({
      ...config,
      questions: updatedQuestions,
      categories: updatedCategories,
    });

    setImportSummary(
      `Pomyślnie zaimportowano ${result.totalParsed} pytań w ${result.categories.length} kategoriach! (Pominięto ${result.duplicateCount} duplikatów)`
    );
    setPastedData('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleProcessImport(reader.result);
      }
    };
    reader.readAsText(file);
  };

  const handleAddManualQuestion = () => {
    if (!newQuestionText.trim()) return;

    const cat = newCategory.trim() || 'Ogólne';
    const newQ: HotSeatQuestion = {
      id: `q_manual_${Date.now()}`,
      category: cat,
      question: newQuestionText.trim(),
      author: newAuthor.trim() || undefined,
      revealed: false,
      used: false,
    };

    const updatedCats = categories.includes(cat) ? categories : [...categories, cat];
    onChange({
      ...config,
      questions: [newQ, ...questions],
      categories: updatedCats,
    });

    setNewQuestionText('');
    setNewAuthor('');
  };

  const handleRemoveQuestion = (id: string) => {
    onChange({
      ...config,
      questions: questions.filter(q => q.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Google Form Specification Guide */}
      <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-sm uppercase tracking-wider">
          <Info className="w-5 h-5" />
          <span>Format Formularza Google (Google Forms)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Aby pytania zostały automatycznie sparsowane, utwórz Formularz Google z następującymi polami:
        </p>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
          <li><strong>Kategoria</strong> (Wybór jednokrotny lub lista rozwijana: np. <em>Pytania o solenizanta</em>, <em>Wyzwania</em>, <em>Wspomnienia</em>, <em>Bez cenzury</em>)</li>
          <li><strong>Treść pytania / wyzwania</strong> (Długa odpowiedź tekstowa / Paragraf) - pole wymagane</li>
          <li><strong>Autor / Podpis</strong> (Krótka odpowiedź) - pole opcjonalne</li>
        </ul>
        <p className="text-[11px] text-purple-200/80 italic">
          Po zebraniu odpowiedzi, otwórz arkusz Google Sheets i kliknij <em>Plik ➔ Pobierz ➔ Wartości rozdzielane przecinkami (.csv)</em> lub po prostu zaznacz i skopiuj całą tabelę!
        </p>
      </div>

      {/* CSV / Google Sheets Import Box */}
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          Import odpowiedzi z Formularza Google
        </h4>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,.tsv,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-4 h-4" />}
          >
            Wgraj plik .CSV z Google Sheets
          </Button>

          <span className="text-xs text-slate-400">lub wklej zawartość poniżej:</span>
        </div>

        <Textarea
          rows={3}
          value={pastedData}
          placeholder="Wklej skopiowane wiersze z Google Sheets lub zawartość pliku CSV..."
          onChange={e => setPastedData(e.target.value)}
        />

        {pastedData && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleProcessImport(pastedData)}
            icon={<Check className="w-4 h-4" />}
          >
            Przetwórz i zaimportuj pytania
          </Button>
        )}

        {importSummary && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold">
            {importSummary}
          </div>
        )}
      </div>

      {/* Blind Import Mode & Privacy Setting */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Toggle
            checked={config.blindImportMode}
            onChange={checked => {
              onChange({ ...config, blindImportMode: checked });
              if (checked) setShowSecretQuestions(false);
            }}
            label="Tryb Ślepego Importu (Blind Import)"
            description="Chroni niespodziankę: ukrywa treść pytań przed solenizantem aż do momentu wylosowania na projektorze."
          />
        </div>

        {config.blindImportMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSecretQuestions(!showSecretQuestions)}
            icon={showSecretQuestions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          >
            {showSecretQuestions ? 'Ukryj pytania (Zalecane)' : 'Odkryj listę pytań (Psuje niespodziankę)'}
          </Button>
        )}
      </div>

      {/* Manual Add Question */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          Dodaj pytanie ręcznie
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Input
              label="Treść pytania / zadania"
              value={newQuestionText}
              placeholder="np. Opowiedz o swojej najśmieszniejszej wpadce..."
              onChange={e => setNewQuestionText(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Kategoria"
              value={newCategory}
              placeholder="np. Wyzwania"
              onChange={e => setNewCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            label="Autor / Kto pyta (opcjonalnie)"
            value={newAuthor}
            placeholder="np. Kasia lub Anonim"
            onChange={e => setNewAuthor(e.target.value)}
          />

          <div className="pt-6">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleAddManualQuestion}
              disabled={!newQuestionText.trim()}
            >
              Dodaj
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Summary & Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Zaimportowane pytania ({questions.length})
          </h4>
          <span className="text-xs text-slate-400">
            Kategorie: {categories.length}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const count = questions.filter(q => q.category === cat).length;
            const remaining = questions.filter(q => q.category === cat && !q.used).length;
            return (
              <Badge key={cat} variant="purple" size="md">
                {cat}: {remaining}/{count}
              </Badge>
            );
          })}
        </div>

        {/* Questions Table / List */}
        {!showSecretQuestions && config.blindImportMode ? (
          <div className="p-8 text-center bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
            <p className="text-base font-bold text-purple-300">
              🔒 Włączono Tryb Ślepego Importu
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Treść {questions.length} pytań jest bezpiecznie ukryta. Zostanie zaprezentowana dopiero po wylosowaniu na scenie/projektorze.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="flex items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-slate-500 font-bold">#{idx + 1}</span>
                  <Badge variant="amber" size="sm">
                    {q.category}
                  </Badge>
                  <p className="text-sm text-slate-200 truncate flex-1 font-medium">
                    {q.question}
                  </p>
                  {q.author && (
                    <span className="text-xs text-slate-400 shrink-0">
                      od: <strong>{q.author}</strong>
                    </span>
                  )}
                  {q.used && (
                    <Badge variant="slate" size="sm">
                      Wykorzystane
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="text-rose-400 hover:text-rose-300"
                  aria-label="Usuń pytanie"
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
