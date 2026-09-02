# Agent Context Self-Maintenance Standards

> [!IMPORTANT]
> **Trigger Paths**: `.agents/**`, `AGENTS.md`
> **When to Read**: MUST be read upon completing features, changing dependencies, adding new party modules/themes, or altering data schemas.

To maintain `.agents/` as the single authoritative Source of Truth, all AI assistants must proactively maintain and refine documentation, schema context, and rules.

## Mandatory Maintenance Triggers

| Trigger Event | Action Required | Target File(s) |
| :--- | :--- | :--- |
| **New Module Added** | Document module schema, config defaults, and register in `modules_spec.md`. | `.agents/context/modules_spec.md` |
| **State Schema Modified** | Update `PartyState` and `SyncMessage` data contracts. | `.agents/context/state_and_sync.md` |
| **Milestone Completed** | Mark task as `[x]`, add upcoming roadmap items, update objective. | `.agents/project_context.md` |
| **Build/Tooling Updated** | Update verification commands and scripts checklist. | `.agents/rules/ci_standards.md`, `AGENTS.md` |

## Standard Maintenance Procedure
1. Review modified files (`git status`, `git diff --stat`).
2. Update corresponding `.agents/context/` or `.agents/rules/` files.
3. Update `Repository Status` in `.agents/project_context.md`.
4. Stage and commit `.agents/` updates alongside feature code.
