export type ModuleType =
  | 'agenda'
  | 'text-slide'
  | 'slideshow'
  | 'countdown'
  | 'codenames'
  | 'hot-seat'
  | string;

export interface PartyScheduleItem {
  id: string;
  title: string;
  time?: string; // e.g., "19:00" or "20:30"
  durationMinutes?: number;
  type: ModuleType;
  config: Record<string, unknown>;
  notes?: string;
}

export interface PartyProfile {
  id: string;
  name: string; // e.g. "30. Urodziny Michała"
  date: string;
  themeId: string;
  items: PartyScheduleItem[];
  activeItemId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartyState {
  version: 1;
  activeProfileId: string;
  profiles: PartyProfile[];
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  isLiveSyncEnabled: boolean;
}

export type SyncMessage =
  | { type: 'STATE_REPLACE'; payload: PartyState }
  | { type: 'SET_ACTIVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_ITEM_CONFIG'; payload: { itemId: string; config: Record<string, unknown> } }
  | { type: 'REORDER_ITEMS'; payload: { itemIds: string[] } }
  | { type: 'ADD_ITEM'; payload: { item: PartyScheduleItem; index?: number } }
  | { type: 'DELETE_ITEM'; payload: { itemId: string } }
  | { type: 'SET_THEME'; payload: { themeId: string } }
  | { type: 'SET_SOUND_CONFIG'; payload: { enabled: boolean; volume: number } }
  | { type: 'TRIGGER_CONFETTI'; payload?: { count?: number; spread?: number } }
  | { type: 'TRIGGER_SOUND'; payload: { sound: 'fanfare' | 'buzzer' | 'ding' | 'drumroll' | 'tick' | 'victory' | 'click' } }
  | { type: 'CODENAMES_ACTION'; payload: { itemId: string; action: 'reveal' | 'next_turn' | 'toggle_timer' | 'reset_timer' | 'new_game' | 'update_clue'; cardId?: number; clueWord?: string; clueCount?: number } }
  | { type: 'HOTSEAT_ACTION'; payload: { itemId: string; action: 'draw' | 'reveal' | 'mark_used' | 'reset_used' | 'select_category'; category?: string; questionId?: string } };
