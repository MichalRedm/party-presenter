import { HotSeatQuestion } from '../types/hotseat';

export interface ParseResult {
  questions: HotSeatQuestion[];
  categories: string[];
  totalParsed: number;
  duplicateCount: number;
  detectedDelimiter: string;
  columnMapping: {
    category: string;
    question: string;
    author: string;
  };
}

/**
 * Robust RFC 4180 compliant CSV / TSV string parser supporting multiline quotes
 */
export function parseCSVRows(rawText: string, delimiter?: string): string[][] {
  const text = rawText.trim();
  if (!text) return [];

  // Auto-detect delimiter if not specified
  let delim = delimiter;
  if (!delim) {
    const firstLine = text.split(/\r?\n/)[0] || '';
    const tabs = (firstLine.match(/\t/g) || []).length;
    const semicolons = (firstLine.match(/;/g) || []).length;
    const commas = (firstLine.match(/,/g) || []).length;

    if (tabs > semicolons && tabs > commas) delim = '\t';
    else if (semicolons > commas) delim = ';';
    else delim = ',';
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped double quote
          currentCell += '"';
          i++;
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delim) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Parses Google Forms responses table (CSV / TSV) into Hot Seat questions
 */
export function parseGoogleFormQuestions(rawContent: string): ParseResult {
  const rows = parseCSVRows(rawContent);
  if (rows.length < 2) {
    return {
      questions: [],
      categories: [],
      totalParsed: 0,
      duplicateCount: 0,
      detectedDelimiter: ',',
      columnMapping: { category: '', question: '', author: '' },
    };
  }

  const headerRow = rows[0].map(h => h.toLowerCase().trim());
  let categoryIdx = -1;
  let questionIdx = -1;
  let authorIdx = -1;

  // Header detection heuristics
  headerRow.forEach((col, idx) => {
    if (col.includes('kategori') || col.includes('category') || col.includes('rodzaj') || col.includes('typ')) {
      categoryIdx = idx;
    } else if (
      col.includes('pytani') ||
      col.includes('treść') ||
      col.includes('wyzwani') ||
      col.includes('zadanie') ||
      col.includes('question') ||
      col.includes('odpowiedź') ||
      col.includes('napisz')
    ) {
      questionIdx = idx;
    } else if (
      col.includes('autor') ||
      col.includes('podpis') ||
      col.includes('nick') ||
      col.includes('imię') ||
      col.includes('kto') ||
      col.includes('author') ||
      col.includes('name')
    ) {
      authorIdx = idx;
    }
  });

  // Fallback defaults if headers were generic / not matched
  if (questionIdx === -1 && rows[0].length >= 2) {
    // If column 0 is timestamp or category, question is usually col 1 or 2
    questionIdx = rows[0].length > 2 ? 2 : 1;
  }
  if (categoryIdx === -1) {
    categoryIdx = rows[0].length > 1 ? 1 : 0;
  }

  const categoryMap = new Set<string>();
  const seenQuestions = new Set<string>();
  const parsedQuestions: HotSeatQuestion[] = [];
  let duplicateCount = 0;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rawQuestion = questionIdx >= 0 && row[questionIdx] ? row[questionIdx] : '';
    const rawCategory = categoryIdx >= 0 && row[categoryIdx] ? row[categoryIdx] : 'Ogólne';
    const rawAuthor = authorIdx >= 0 && row[authorIdx] ? row[authorIdx] : undefined;

    const trimmedQuestion = rawQuestion.trim();
    const category = (rawCategory.trim() || 'Ogólne').replace(/^[0-9]+[.)]\s*/, ''); // Remove numbering like "1. "

    if (!trimmedQuestion) continue;

    const normalizedKey = trimmedQuestion.toLowerCase();
    if (seenQuestions.has(normalizedKey)) {
      duplicateCount++;
      continue;
    }
    seenQuestions.add(normalizedKey);
    categoryMap.add(category);

    parsedQuestions.push({
      id: `q_${Date.now()}_${r}_${Math.random().toString(36).substring(2, 7)}`,
      category,
      question: trimmedQuestion,
      author: rawAuthor?.trim() || undefined,
      revealed: false,
      used: false,
    });
  }

  return {
    questions: parsedQuestions,
    categories: Array.from(categoryMap).sort(),
    totalParsed: parsedQuestions.length,
    duplicateCount,
    detectedDelimiter: ',',
    columnMapping: {
      category: categoryIdx >= 0 ? rows[0][categoryIdx] : 'Domyślna',
      question: questionIdx >= 0 ? rows[0][questionIdx] : 'Domyślna',
      author: authorIdx >= 0 ? rows[0][authorIdx] : 'Brak',
    },
  };
}
