export interface AgendaItem {
  id: string;
  title: string;
  time?: string;
  durationMinutes?: number;
  notes?: string;
  linkedItemId?: string; // Opcjonalne powiązanie ze slajdem programu imprezy
}

export interface AgendaConfig {
  title: string;
  items: AgendaItem[];
  showEstimatedTimes: boolean;
  showDescription: boolean;
  layout?: 'timeline' | 'horizontal' | 'grid';
  columns?: 'auto' | 1 | 2;
}

