export interface HotSeatQuestion {
  id: string;
  category: string;
  question: string;
  author?: string;
  revealed: boolean;
  used: boolean;
  drawnAt?: string;
}

export interface HotSeatConfig {
  questions: HotSeatQuestion[];
  categories: string[];
  selectedCategory: string; // 'all' or specific category name
  activeQuestionId: string | null;
  blindImportMode: boolean;
  spinDurationMs: number;
}
