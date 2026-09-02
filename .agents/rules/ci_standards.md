# CI Standards & Local Verification Rules

> [!IMPORTANT]
> **Trigger Paths**: `package.json`, `tsconfig*.json`, `vite.config.ts`, `.github/workflows/**`
> **When to Read**: MUST be read before pushing commits or finishing implementation tasks.

To ensure pristine code quality and eliminate runtime bugs during live party events, all code changes must pass strict local validation before commit and push.

## Mandatory Local Verification Checklist

Execute these commands from the repository root:

- **Typecheck & Build**:
  ```bash
  npm run build
  ```
  *Ensures zero TypeScript compilation errors and produces production bundles cleanly.*

- **Linting**:
  ```bash
  npm run lint
  ```
  *Validates ESLint rules, hooks dependencies, and formatting.*

---

## Anti-Pattern & Pitfall Traps

| Anti-Pattern Trap | Why It Fails | Golden Pattern |
| :--- | :--- | :--- |
| **Bypassing TS with `as any` or `@ts-ignore`** | Causes hidden runtime type mismatch crashes during live presentation. | Declare explicit interfaces in `src/types/` and handle undefined/null with fallbacks. |
| **Direct window/DOM queries without ref cleanup** | Causes memory leaks across component re-renders or audio context locks. | Encapsulate DOM interactions and listeners in `useEffect` with explicit cleanup returns. |
| **Unchecked `JSON.parse` on imported config** | Corrupted import files crash the entire application state. | Wrap in `try/catch` and validate required fields before updating storage. |
