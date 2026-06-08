---
name: gettask
description: "Skill for the GetTask area of Personal-Management. 6 symbols across 1 files."
---

# GetTask

6 symbols | 1 files | Cohesion: 67%

## When to Use

- Working with code in `frontend/`
- Understanding how getTaskFocusSeconds, getTaskShortBreakSeconds, getTaskLongBreakSeconds work
- Modifying gettask-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/utils/taskStats.js` | getTaskFocusSeconds, getTaskShortBreakSeconds, getTaskLongBreakSeconds, getTaskBreakSeconds, getTaskTotalSessionSeconds (+1) |

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

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ToggleRunning → GetTaskSessionSeconds` | cross_community | 6 |
| `CompleteTask → GetTaskSessionSeconds` | cross_community | 6 |
| `FocusTaskPage → GetTaskSessionSeconds` | cross_community | 4 |

## How to Explore

1. `gitnexus_context({name: "getTaskFocusSeconds"})` — see callers and callees
2. `gitnexus_query({query: "gettask"})` — find related execution flows
3. Read key files listed above for implementation details
