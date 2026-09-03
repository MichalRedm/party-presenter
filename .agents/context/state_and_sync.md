# State & Sync Data Contracts

## 1. Storage & Schema

The party configuration metadata is stored in `localStorage` under key `party_presenter_state_v1`.
Binary image assets uploaded by users are kept separately in browser `IndexedDB` (`party_presenter_media_db`) under media keys formatted as `media:img_<timestamp>_<rand>` or `media:bg_<timestamp>_<rand>`. This prevents `localStorage` quota exhaustion (capped at 5MB) and allows exporting clean, AI-friendly JSON states.

For single-file portability, the application supports `.party` / `.zip` bundle packages comprising a clean `party.json` and a `media/` directory.

### Top-Level State Schema (`PartyState`):
```ts
interface PartyScheduleItem {
  id: string;
  title: string;
  time?: string; // e.g. "19:00"
  durationMinutes?: number;
  type: 'agenda' | 'text-slide' | 'slideshow' | 'countdown' | 'codenames' | 'hot-seat' | string;
  config: Record<string, unknown>;
}

interface PartyProfile {
  id: string;
  name: string; // e.g. "30. Urodziny Michała"
  date: string;
  themeId: string;
  items: PartyScheduleItem[];
  activeItemId: string;
}

interface PartyState {
  version: 1;
  activeProfileId: string;
  profiles: PartyProfile[];
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
}
```

---

## 2. BroadcastChannel Message Formats

Messages broadcast over `party_presenter_channel`:

```ts
type SyncMessage =
  | { type: 'STATE_REPLACE'; payload: PartyState }
  | { type: 'SET_ACTIVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_ITEM_CONFIG'; payload: { itemId: string; config: Record<string, unknown> } }
  | { type: 'SET_THEME'; payload: { themeId: string } }
  | { type: 'TRIGGER_CONFETTI'; payload?: { count?: number; spread?: number } }
  | { type: 'TRIGGER_SOUND'; payload: { sound: 'fanfare' | 'buzzer' | 'ding' | 'drumroll' | 'tick' | 'victory' } }
  | { type: 'CODENAMES_ACTION'; payload: { action: 'reveal' | 'next_turn' | 'reset_timer' | 'new_game'; cardId?: number } }
  | { type: 'HOTSEAT_ACTION'; payload: { action: 'draw' | 'reveal' | 'mark_used' | 'reset'; category?: string; questionId?: string } };
```
