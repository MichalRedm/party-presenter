# Git & PR Standards & Guidelines

> [!IMPORTANT]
> **Trigger Paths**: `AGENTS.md`, `.github/**`, repository root
> **When to Read**: MUST be read before committing code, creating branches, or pushing to remote.

## 1. Conventional Commits Schema

All commit messages MUST follow the Conventional Commits specification:
`<type>[optional scope]: <description>`

### Allowed Types:
- `feat`: A new feature is introduced.
- `fix`: A bug is patched.
- `refactor`: Code is rewritten without changing external behavior or fixing a bug.
- `style`: Formatting changes that do not affect code logic.
- `test`: Adding or correcting tests.
- `docs`: Documentation-only changes.
- `chore`: Updating build tasks, configurations, or non-user-facing dependencies.

### Linguistic Rule:
The `<description>` must be written in the imperative, present tense (e.g., `feat: add codenames card flip animation`, NOT `added` or `adding`).

## 2. Atomic Commits Checklist

Before staging files, verify:
1. **Single Purpose**: Does this diff solve exactly one problem or add exactly one feature?
2. **State Stability**: If this commit is checked out independently, does `npm run build` succeed?
3. **No Sensitive Data**: Check `.gitignore` before committing; ensure no secrets or cache files are staged.

---

## 3. Anti-Pattern & Pitfall Traps

| Anti-Pattern Trap | Why It Fails | Golden Pattern |
| :--- | :--- | :--- |
| **Vague commit messages like `update code` or `wip`** | Destroys git bisect and audit history clarity. | Use structured Conventional Commits (`feat(codenames): add turn timer alarm`). |
| **Committing broken build states** | Breaks CI and prevents clean rollbacks. | Run `npm run build` locally before any commit. |
