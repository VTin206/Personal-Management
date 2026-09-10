---
name: cluster-42
description: "Skill for the Cluster_42 area of Personal-Management. 5 symbols across 1 files."
---

# Cluster_42

5 symbols | 1 files | Cohesion: 62%

## When to Use

- Working with code in `frontend/`
- Understanding how getTaskShortBreakLog, getTaskLongBreakLog, getTaskSessionLog work
- Modifying cluster_42-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/utils/taskStats.js` | getTaskShortBreakLog, getTaskLongBreakLog, getTaskSessionLog, buildFocusTimeUpdates, buildSessionTimeUpdates |

## Entry Points

Start here when exploring this area:

- **`getTaskShortBreakLog`** (Function) — `frontend/src/utils/taskStats.js:162`
- **`getTaskLongBreakLog`** (Function) — `frontend/src/utils/taskStats.js:166`
- **`getTaskSessionLog`** (Function) — `frontend/src/utils/taskStats.js:170`
- **`buildFocusTimeUpdates`** (Function) — `frontend/src/utils/taskStats.js:187`
- **`buildSessionTimeUpdates`** (Function) — `frontend/src/utils/taskStats.js:191`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getTaskShortBreakLog` | Function | `frontend/src/utils/taskStats.js` | 162 |
| `getTaskLongBreakLog` | Function | `frontend/src/utils/taskStats.js` | 166 |
| `getTaskSessionLog` | Function | `frontend/src/utils/taskStats.js` | 170 |
| `buildFocusTimeUpdates` | Function | `frontend/src/utils/taskStats.js` | 187 |
| `buildSessionTimeUpdates` | Function | `frontend/src/utils/taskStats.js` | 191 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ToggleRunning → GetInputDateValue` | cross_community | 7 |
| `ToggleRunning → NormalizeNow` | cross_community | 7 |
| `ToggleRunning → GetTaskSessionLog` | cross_community | 7 |
| `ToggleRunning → GetTaskSessionSeconds` | cross_community | 7 |
| `FocusTaskPage → GetInputDateValue` | cross_community | 6 |
| `FocusTaskPage → NormalizeNow` | cross_community | 6 |
| `FocusTaskPage → GetTaskSessionLog` | cross_community | 6 |
| `FocusTaskPage → GetTaskSessionSeconds` | cross_community | 6 |
| `CompleteTask → GetInputDateValue` | cross_community | 6 |
| `CompleteTask → NormalizeNow` | cross_community | 6 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 2 calls |
| GetT | 1 calls |

## How to Explore

1. `gitnexus_context({name: "getTaskShortBreakLog"})` — see callers and callees
2. `gitnexus_query({query: "cluster_42"})` — find related execution flows
3. Read key files listed above for implementation details
