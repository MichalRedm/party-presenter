# Architecture Overview - Party Presenter

## 1. Multi-Screen Zero-Backend Architecture

Party Presenter operates completely client-side without requiring a backend server or internet connection during the event. It coordinates 3 core views:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              BROWSER                                   │
│                                                                        │
│  ┌───────────────────────┐              ┌───────────────────────────┐  │
│  │   PROJECTOR SCREEN    │              │   ADMIN REMOTE / LAPTOP   │  │
│  │   Route: /            │              │   Route: /admin           │  │
│  │   - Fullscreen View   │◄────────────►│   - Timeline / Controls   │  │
│  │   - Big Typography    │  Broadcast   │   - Module Config Editors │  │
│  │   - Animations & Audio│   Channel    │   - Quick Event Triggers  │  │
│  └───────────────────────┘     API      └───────────────────────────┘  │
│             ▲                                         ▲                │
│             │                                         │                │
│             └──────────────────┬──────────────────────┘                │
│                                │                                       │
│                                ▼                                       │
│                  ┌───────────────────────────┐                         │
│                  │   SPYMASTERS SECRET VIEW  │                         │
│                  │   Route: /spymaster       │                         │
│                  │   - Codenames Card Key    │                         │
│                  │   - Real-time Revelations │                         │
│                  └───────────────────────────┘                         │
│                                │                                       │
│                                ▼                                       │
│                  ┌───────────────────────────┐                         │
│                  │       LOCAL STORAGE       │                         │
│                  │   Key: party_presenter_v1 │                         │
│                  └───────────────────────────┘                         │
└────────────────────────────────────────────────────────────────────────┘
```

## 2. Synchronization Pipeline

- **Primary Channel**: `new BroadcastChannel('party_presenter_channel')` transmits discrete JSON events (`ACTION_SET_ACTIVE_ITEM`, `ACTION_UPDATE_MODULE_DATA`, `TRIGGER_CONFETTI`, `TRIGGER_SOUND`, `STATE_SYNC`).
- **Secondary Fallback**: `window.addEventListener('storage', ...)` ensures cross-tab persistence across page reloads.
- **Latency**: < 1ms between tabs on the same device.

## 3. Extensibility Design

- **Module Registry (`src/modules/registry.ts`)**: Pure plug-and-play pattern where each module encapsulates its own state type, default configuration, Projector renderer, Admin editor, and optional remote/spymaster controllers.
- **Theme Registry (`src/themes/presets.ts`)**: Visual tokens, CSS gradients, background animations, and font settings grouped into switchable themes.
