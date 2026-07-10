# Project Context

- Read this file first when working in this repository.
- Current layout: `frontend/` contains the React/Vite app; `backend/` contains the Java Spring Boot API.
- GitNexus is installed for this project. Use it to understand structure and impact before code changes.
- Refresh the GitNexus index after meaningful source changes with `npm run gitnexus:analyze`.
- Check index health with `npm run gitnexus:status`.
- The local GitNexus database lives in `.gitnexus/` and is intentionally ignored by Git.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Personal-Management** (1135 symbols, 2755 relationships, 95 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/Personal-Management/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Personal-Management/clusters` | All functional areas |
| `gitnexus://repo/Personal-Management/processes` | All execution flows |
| `gitnexus://repo/Personal-Management/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Pages area (172 symbols) | `.claude/skills/generated/pages/SKILL.md` |
| Work in the Entity area (68 symbols) | `.claude/skills/generated/entity/SKILL.md` |
| Work in the Components area (32 symbols) | `.claude/skills/generated/components/SKILL.md` |
| Work in the Ui area (28 symbols) | `.claude/skills/generated/ui/SKILL.md` |
| Work in the Service area (12 symbols) | `.claude/skills/generated/service/SKILL.md` |
| Work in the Exception area (8 symbols) | `.claude/skills/generated/exception/SKILL.md` |
| Work in the Services area (8 symbols) | `.claude/skills/generated/services/SKILL.md` |
| Work in the Hooks area (7 symbols) | `.claude/skills/generated/hooks/SKILL.md` |
| Work in the Contexts area (7 symbols) | `.claude/skills/generated/contexts/SKILL.md` |
| Work in the GetTask area (6 symbols) | `.claude/skills/generated/gettask/SKILL.md` |
| Work in the Cluster_39 area (4 symbols) | `.claude/skills/generated/cluster-39/SKILL.md` |

<!-- gitnexus:end -->
