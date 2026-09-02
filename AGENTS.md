# AGENTS.md - Master Instructions & Context for AI Assistants

Welcome to the **Party Presenter (urodziny)** repository! This file serves as the primary entry point, high-level context map, and deterministic rule routing matrix for AI coding assistants.

---

## 🏛️ Project Architecture & Overview

Party Presenter is a client-side React 19 + TypeScript + Vite + Tailwind CSS application designed for hosting and projecting interactive party presentations on large screens and projectors. It runs entirely in the browser without requiring a backend server.

Multi-screen real-time synchronization between the Projector display (`/`), the Admin Control Remote (`/admin`), and the Spymasters View (`/spymaster`) is driven by the native `BroadcastChannel API` backed by `localStorage` persistence. The core architecture relies on an extensible **Module Registry** (`agenda`, `text-slide`, `slideshow`, `countdown`, `codenames`, `hot-seat`) and **Theme Registry**.

---

## 🚦 Mandatory Rule Routing Matrix

Before writing or modifying any code, identify your target area and **read the corresponding rule file FIRST**:

| When working on / modifying... | Target Paths / Globs | Mandatory File to Read FIRST | Key Invariants & Pitfalls to Check |
| :--- | :--- | :--- | :--- |
| **React Components & UI** | `src/components/**`, `src/pages/**` | [`.agents/rules/react_standards.md`](.agents/rules/react_standards.md) | • Big-screen legibility & projector contrast<br>• Controlled forms & keyboard shortcuts<br>• Tailwind CSS tokens & accessibility |
| **Party Modules & Registry** | `src/modules/**`, `src/types/modules.ts` | [`.agents/rules/module_standards.md`](.agents/rules/module_standards.md) | • Extensible `ModuleDefinition` interface<br>• Isolated config schemas & defaults<br>• Pure Projector & Admin components |
| **State, Sync & Audio** | `src/context/**`, `src/services/**`, `src/hooks/**` | [`.agents/rules/react_standards.md`](.agents/rules/react_standards.md)<br>[`.agents/context/state_and_sync.md`](.agents/context/state_and_sync.md) | • `BroadcastChannel` event serialization<br>• `localStorage` atomic updates & JSON schema<br>• Web Audio API non-blocking synth |
| **CI, Lint & TypeScript** | `package.json`, `tsconfig*.json`, `vite.config.ts` | [`.agents/rules/ci_standards.md`](.agents/rules/ci_standards.md) | • Strict type safety with zero `any`<br>• Clean build passing `tsc -b && vite build` |
| **Git & PR Workflows** | Repository root / source control | [`.agents/rules/git_and_pr_standards.md`](.agents/rules/git_and_pr_standards.md) | • Conventional Commits schema<br>• Atomic commits & pre-push local CI validation |

---

## 🔄 Operational Phase Gates

Every task must progress sequentially through these 5 lifecycle gates:

```
[ Gate 1: Rule & Contract Intake ] ➔ [ Gate 2: Implementation ] ➔ [ Gate 3: Local CI Verification ] ➔ [ Gate 4: Context Maintenance ] ➔ [ Gate 5: Git & PR Protocol ]
```

1. **Gate 1: Rule & Contract Intake (MANDATORY)**: Identify target files and read the required rule files from the *Rule Routing Matrix* using `view_file`. Inspect data contracts and types in `src/types/` before building components.
2. **Gate 2: Implementation**: Implement features adhering strictly to golden patterns in `.agents/rules/` avoiding anti-pattern traps.
3. **Gate 3: Local CI Verification**: Execute local verification (`npm run build`, `npm run lint`) to guarantee a pristine build.
4. **Gate 4: Context Self-Maintenance**: Follow [`.agents/skills/agent-maintenance/SKILL.md`](.agents/skills/agent-maintenance/SKILL.md) whenever modules, state schemas, or architecture evolve.
5. **Gate 5: Git & PR Protocol**: Stage and commit changes using atomic Conventional Commits matching the strict git protocol.

---

## ⚙️ Core CLI Tools & Build Commands

Always run these commands from the repository root:

| Purpose | Working Directory | Command |
| :--- | :--- | :--- |
| **Run Dev Server** | `.` | `npm run dev` |
| **Typecheck & Build** | `.` | `npm run build` |
| **Lint Codebase** | `.` | `npm run lint` |
| **Preview Production** | `.` | `npm run preview` |

---

## 🚨 Operational Boundaries & Escalation

- **Always**:
  - Verify multi-window synchronization logic across `/`, `/admin`, and `/spymaster`.
  - Provide fallback defaults and safe JSON parsing for all imported party configs.
  - Keep commit messages strictly compliant with Conventional Commits.
- **Ask First (Human Escalation Gateways)**:
  - Introducing external server backends or heavy runtime dependencies.
  - Modifying the core `PartyState` schema in a backwards-incompatible way.
- **Never (Safety & Workflow Anti-Patterns)**:
  - Never suppress TypeScript errors with `any` or `@ts-ignore`.
  - Never block the UI thread during file parsing or sound generation.

---

## 📁 Repository Layout & Navigation Map

- `AGENTS.md`: Master entry point & rule routing matrix (this file)
- `index.html`: Main HTML entry with responsive viewport and Google Fonts
- `src/`: Core application source code
  - `types/`: Strongly typed definitions (`party.ts`, `modules.ts`, `codenames.ts`, `hotseat.ts`, `theme.ts`)
  - `context/`: `PartyContext` state provider & `BroadcastChannel` live syncer
  - `modules/`: Plug-and-play module implementations and central `registry.ts`
  - `themes/`: Visual theme presets & theme registry
  - `services/`: `storage.ts`, `csvParser.ts`, `soundEngine.ts`, `codenamesGenerator.ts`
  - `hooks/`: Audio effects, sync hooks, keyboard navigation
  - `components/`: UI cards, modals, buttons, effect overlays (confetti, particles)
  - `pages/`: `ProjectorPage.tsx` (`/`), `AdminPage.tsx` (`/admin`), `SpymasterPage.tsx` (`/spymaster`)
- `.agents/`: Agent configuration, rules, context, and workspace skills
  - `acs.yaml`: Agent Configuration Schema with machine-readable path triggers
  - `project_context.md`: Detailed architecture, environment setup, and active roadmap status
  - `rules/`: Modular declarative rules and coding standards
  - `context/`: Deep domain architecture and data models specifications
  - `skills/`: Autonomous workspace maintenance skill
