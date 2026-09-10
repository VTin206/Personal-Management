---
name: cluster-40
description: "Skill for the Cluster_40 area of Personal-Management. 6 symbols across 1 files."
---

# Cluster_40

6 symbols | 1 files | Cohesion: 80%

## When to Use

- Working with code in `frontend/`
- Understanding how isImportantTask, isUrgentTask, getEisenhowerQuadrantKey work
- Modifying cluster_40-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/utils/eisenhower.js` | normalizeNow, getRemainingDeadlineMs, isImportantTask, isUrgentTask, getEisenhowerQuadrantKey (+1) |

## Entry Points

Start here when exploring this area:

- **`isImportantTask`** (Function) — `frontend/src/utils/eisenhower.js:49`
- **`isUrgentTask`** (Function) — `frontend/src/utils/eisenhower.js:56`
- **`getEisenhowerQuadrantKey`** (Function) — `frontend/src/utils/eisenhower.js:67`
- **`groupTasksByEisenhower`** (Function) — `frontend/src/utils/eisenhower.js:78`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `isImportantTask` | Function | `frontend/src/utils/eisenhower.js` | 49 |
| `isUrgentTask` | Function | `frontend/src/utils/eisenhower.js` | 56 |
| `getEisenhowerQuadrantKey` | Function | `frontend/src/utils/eisenhower.js` | 67 |
| `groupTasksByEisenhower` | Function | `frontend/src/utils/eisenhower.js` | 78 |
| `normalizeNow` | Function | `frontend/src/utils/eisenhower.js` | 38 |
| `getRemainingDeadlineMs` | Function | `frontend/src/utils/eisenhower.js` | 42 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 4 calls |

## How to Explore

1. `gitnexus_context({name: "isImportantTask"})` — see callers and callees
2. `gitnexus_query({query: "cluster_40"})` — find related execution flows
3. Read key files listed above for implementation details
