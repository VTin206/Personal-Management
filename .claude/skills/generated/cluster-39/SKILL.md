---
name: cluster-39
description: "Skill for the Cluster_39 area of Personal-Management. 4 symbols across 2 files."
---

# Cluster_39

4 symbols | 2 files | Cohesion: 35%

## When to Use

- Working with code in `frontend/`
- Understanding how getTaskDueDateTime, isTaskDueWithin24Hours, getUrgentDeadlineTasks work
- Modifying cluster_39-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/utils/taskStats.js` | isTaskDueWithin24Hours, getUrgentDeadlineTasks, dueByEndOfWeek |
| `frontend/src/utils/date.js` | getTaskDueDateTime |

## Entry Points

Start here when exploring this area:

- **`getTaskDueDateTime`** (Function) — `frontend/src/utils/date.js:101`
- **`isTaskDueWithin24Hours`** (Function) — `frontend/src/utils/taskStats.js:76`
- **`getUrgentDeadlineTasks`** (Function) — `frontend/src/utils/taskStats.js:101`
- **`dueByEndOfWeek`** (Function) — `frontend/src/utils/taskStats.js:216`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getTaskDueDateTime` | Function | `frontend/src/utils/date.js` | 101 |
| `isTaskDueWithin24Hours` | Function | `frontend/src/utils/taskStats.js` | 76 |
| `getUrgentDeadlineTasks` | Function | `frontend/src/utils/taskStats.js` | 101 |
| `dueByEndOfWeek` | Function | `frontend/src/utils/taskStats.js` | 216 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `TaskTimelineItem → ToDate` | cross_community | 8 |
| `TaskTimelineItem → NormalizeTimeValue` | cross_community | 8 |
| `DashboardPage → ToDate` | cross_community | 7 |
| `DashboardPage → NormalizeTimeValue` | cross_community | 7 |
| `HandleSubmit → ToDate` | cross_community | 7 |
| `HandleSubmit → NormalizeTimeValue` | cross_community | 7 |
| `HandleUpdate → ToDate` | cross_community | 7 |
| `HandleUpdate → NormalizeTimeValue` | cross_community | 7 |
| `HandleSubmit → ToDate` | cross_community | 7 |
| `HandleSubmit → NormalizeTimeValue` | cross_community | 7 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 2 calls |
| Components | 1 calls |

## How to Explore

1. `gitnexus_context({name: "getTaskDueDateTime"})` — see callers and callees
2. `gitnexus_query({query: "cluster_39"})` — find related execution flows
3. Read key files listed above for implementation details
