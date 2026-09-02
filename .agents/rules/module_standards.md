# Party Module Standards & Authoring Guidelines

> [!IMPORTANT]
> **Trigger Paths**: `src/modules/**`, `src/types/modules.ts`
> **When to Read**: MUST be read before creating, editing, or extending party presentation modules.

## 1. Core Principles & Architecture

Party Presenter is built upon a pluggable **Module Registry**. Every party item (e.g. Codenames game, Hot Seat, Agenda, Text Slide, Countdown) is an encapsulated module that registers:
1. `id`: Unique string identifier (e.g., `'codenames'`, `'hot-seat'`).
2. `name`: Human-readable Polish label for the admin interface.
3. `icon`: Lucide icon component.
4. `description`: Brief summary of module purpose.
5. `defaultConfig`: Type-safe default configuration data.
6. `projectorComponent`: Rendered on the fullscreen projector (`/`).
7. `adminEditorComponent`: Rendered in the admin panel (`/admin`) for editing configuration.
8. `adminRemoteComponent` *(optional)*: Quick controls rendered in the live admin remote panel.
9. `spymasterComponent` *(optional)*: Secret view rendered on `/spymaster` (e.g. Codenames secret key).

## 2. Declarative Code Standards (Golden Pattern)

```tsx
// src/modules/types.ts
export interface ModuleDefinition<TConfig = unknown> {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultConfig: TConfig;
  ProjectorComponent: React.FC<{ config: TConfig; isActive: boolean }>;
  AdminEditorComponent: React.FC<{
    config: TConfig;
    onChange: (updatedConfig: TConfig) => void;
  }>;
  AdminRemoteComponent?: React.FC<{
    config: TConfig;
    onChange: (updatedConfig: TConfig) => void;
  }>;
  SpymasterComponent?: React.FC<{ config: TConfig }>;
}
```

---

## 3. Anti-Pattern & Pitfall Traps

| Anti-Pattern Trap | Why It Fails | Golden Pattern |
| :--- | :--- | :--- |
| **Hardcoding module switches inside ProjectorPage** | Violates open-closed principle; adding new modules requires modifying core routing logic. | Query `moduleRegistry[item.type].ProjectorComponent` dynamically. |
| **Storing non-serializable objects in module config** | `localStorage` and `BroadcastChannel` serialize via JSON; functions and DOM nodes cause data corruption. | Keep module configs strictly JSON-serializable (strings, numbers, booleans, arrays, plain objects). |
| **Exposing secret data on Projector component** | Spoils game answers (e.g., Codenames spymaster cards, hot seat unrevealed questions). | Keep projector component strictly sanitized, showing only public game state. |
