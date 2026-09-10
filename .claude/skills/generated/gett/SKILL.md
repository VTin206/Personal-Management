---
name: gett
description: "Skill for the GetT area of Personal-Management. 7 symbols across 1 files."
---

# GetT

7 symbols | 1 files | Cohesion: 80%

## When to Use

- Working with code in `frontend/`
- Understanding how getTaskFocusSeconds, getTaskShortBreakSeconds, getTaskLongBreakSeconds work
- Modifying gett-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/utils/taskStats.js` | getTaskFocusSeconds, getTaskShortBreakSeconds, getTaskLongBreakSeconds, getTaskBreakSeconds, getTaskTotalSessionSeconds (+2) |

## Entry Points

Start here when exploring this area:

- **`getTaskFocusSeconds`** (Function) — `frontend/src/utils/taskStats.js:131`
- **`getTaskShortBreakSeconds`** (Function) — `frontend/src/utils/taskStats.js:135`
- **`getTaskLongBreakSeconds`** (Function) — `frontend/src/utils/taskStats.js:139`
- **`getTaskBreakSeconds`** (Function) — `frontend/src/utils/taskStats.js:143`
- **`getTaskTotalSessionSeconds`** (Function) — `frontend/src/utils/taskStats.js:147`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getTaskFocusSeconds` | Function | `frontend/src/utils/taskStats.js` | 131 |
| `getTaskShortBreakSeconds` | Function | `frontend/src/utils/taskStats.js` | 135 |
| `getTaskLongBreakSeconds` | Function | `frontend/src/utils/taskStats.js` | 139 |
| `getTaskBreakSeconds` | Function | `frontend/src/utils/taskStats.js` | 143 |
| `getTaskTotalSessionSeconds` | Function | `frontend/src/utils/taskStats.js` | 147 |
| `getTaskSessionSeconds` | Function | `frontend/src/utils/taskStats.js` | 151 |
| `getTotalFocusSeconds` | Function | `frontend/src/utils/taskStats.js` | 224 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ToggleRunning → GetTaskSessionSeconds` | cross_community | 7 |
| `FocusTaskPage → GetTaskSessionSeconds` | cross_community | 6 |
| `CompleteTask → GetTaskSessionSeconds` | cross_community | 6 |

## How to Explore

1. `gitnexus_context({name: "getTaskFocusSeconds"})` — see callers and callees
2. `gitnexus_query({query: "gett"})` — find related execution flows
3. Read key files listed above for implementation details
