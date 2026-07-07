---
name: hooks
description: "Skill for the Hooks area of Personal-Management. 7 symbols across 5 files."
---

# Hooks

7 symbols | 5 files | Cohesion: 57%

## When to Use

- Working with code in `frontend/`
- Understanding how useNow, useTasks, TasksPage work
- Modifying hooks-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/pages/TasksPage.jsx` | TasksPage, sortedTasks |
| `frontend/src/services/taskService.js` | sortByNewestCreatedAt, listenToUserTasks |
| `frontend/src/hooks/useNow.js` | useNow |
| `frontend/src/hooks/useTasks.js` | useTasks |
| `frontend/src/utils/eisenhower.js` | sortTasksByPriorityAndDeadline |

## Entry Points

Start here when exploring this area:

- **`useNow`** (Function) — `frontend/src/hooks/useNow.js:2`
- **`useTasks`** (Function) — `frontend/src/hooks/useTasks.js:11`
- **`TasksPage`** (Function) — `frontend/src/pages/TasksPage.jsx:75`
- **`sortedTasks`** (Function) — `frontend/src/pages/TasksPage.jsx:100`
- **`listenToUserTasks`** (Function) — `frontend/src/services/taskService.js:50`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useNow` | Function | `frontend/src/hooks/useNow.js` | 2 |
| `useTasks` | Function | `frontend/src/hooks/useTasks.js` | 11 |
| `TasksPage` | Function | `frontend/src/pages/TasksPage.jsx` | 75 |
| `sortedTasks` | Function | `frontend/src/pages/TasksPage.jsx` | 100 |
| `listenToUserTasks` | Function | `frontend/src/services/taskService.js` | 50 |
| `sortTasksByPriorityAndDeadline` | Function | `frontend/src/utils/eisenhower.js` | 97 |
| `sortByNewestCreatedAt` | Function | `frontend/src/services/taskService.js` | 42 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `TasksPage → ToDate` | cross_community | 5 |
| `TasksPage → NormalizeTimeValue` | cross_community | 5 |
| `FocusTaskPage → RequireDb` | cross_community | 4 |
| `FocusTaskPage → SortByNewestCreatedAt` | cross_community | 4 |
| `WeeklyReportPage → RequireDb` | cross_community | 4 |
| `WeeklyReportPage → SortByNewestCreatedAt` | cross_community | 4 |
| `DashboardPage → RequireDb` | cross_community | 4 |
| `DashboardPage → SortByNewestCreatedAt` | cross_community | 4 |
| `UrgentDeadlineAlert → RequireDb` | cross_community | 4 |
| `UrgentDeadlineAlert → SortByNewestCreatedAt` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 2 calls |
| Components | 1 calls |

## How to Explore

1. `gitnexus_context({name: "useNow"})` — see callers and callees
2. `gitnexus_query({query: "hooks"})` — find related execution flows
3. Read key files listed above for implementation details
