# Project Context - Party Presenter (urodziny)

## Master Entry Point
See [AGENTS.md](../AGENTS.md) at the repository root for immediate orientation and the Rule Routing Matrix.

## Current Goal
Deliver and maintain the full Party Presenter presentation application running on React 19 + Vite + TypeScript + Tailwind CSS with dual-view live synchronization via `BroadcastChannel`, extensible Module Registry, Theme system, Codenames game engine, Hot Seat (Google Form import) and Agenda overview.

## Implementation Details
- **Architecture**: Static Single Page Application with multi-route views (`/` projector, `/admin` controller, `/spymaster` secret spymaster view). Zero-backend, offline-capable, real-time tab synchronization using `BroadcastChannel` and `localStorage`.
- **Key Technologies**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti, Web Audio API synthesizers.
- **Data Persistence**: JSON-serializable `PartyState` saved in `localStorage` under `party_presenter_state_v1`, with export/import support for entire party profiles.

## Repository Status
- [x] Initial repository setup and agent context initialization.
- [x] Core types definition (`party.ts`, `modules.ts`, `codenames.ts`, `hotseat.ts`, `theme.ts`).
- [x] State management & `BroadcastChannel` real-time sync engine.
- [x] Web Audio sound engine (bells, buzzer, fanfare, ticks, celebratory cues).
- [x] Theme system & dynamic visual presets (`midnight-velvet`, `cyberpunk-neon`, `golden-glamour`, `retro-sunset`, `emerald-luxury`, `minimal-dark`).
- [x] Built-in module implementations:
  - [x] `agenda` (Harmonogram with timeline, countdown, and active item spotlight)
  - [x] `text-slide` (Rich text announcements with background image, opacity, and blur support)
  - [x] `slideshow` (Photo memories carousel with auto-play & captions)
  - [x] `countdown` (Big screen countdown timer with audio ticks and zero celebration)
  - [x] `codenames` (Wielka gra w tajniaków: 5x5 grid, word bank, spymaster sync, turn timers, 3D card flips)
  - [x] `hot-seat` (Gorące krzesło: Google Form CSV/TSV parser, blind import mode, roulette drawing)
- [x] High-contrast fullscreen Projector view with keyboard shortcuts (`Space`, `Arrows`, `F`, `H`, `M`, `C`, `T`), inactivity auto-hiding controls (2.5s) and cursor hiding in fullscreen mode.
- [x] Comprehensive Admin panel & live remote controller (`/admin`).
- [x] Dedicated Spymasters view for Codenames (`/spymaster`).
- [x] IndexedDB binary media storage with `navigator.storage.persist()` to eliminate `localStorage` 5MB quota crashes.
- [x] Clean, AI-friendly ZIP export/import (`.party` / `.zip`) bundling `party.json` + `media/` folder alongside backward-compatible JSON imports.
- [x] Clean build and zero-warning lint verification (`npm run build`, `npm run lint`).
- [x] Automated GitHub Actions CI workflow for linting, typechecking, and production builds (`.github/workflows/ci.yml`).

## Critical Requirements & Developer Guidelines
1. **Local Setup**: Run `npm install` followed by `npm run dev`.
2. **Offline First**: All game rules, dictionaries, audio cues, and state work 100% offline without external server dependencies.
3. **Module Extensibility**: Adding a new module only requires creating a module folder and registering it in `src/modules/registry.ts`.
4. **Theme Extensibility**: Adding a new theme only requires registering a theme definition in `src/themes/presets.ts`.
5. **Quality & Verification**: Always verify builds with `npm run build` and `npm run lint`.
