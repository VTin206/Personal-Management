---
name: services
description: "Skill for the Services area of Personal-Management. 13 symbols across 3 files."
---

# Services

13 symbols | 3 files | Cohesion: 70%

## When to Use

- Working with code in `frontend/`
- Understanding how useTasks, createTask, listenToUserTasks work
- Modifying services-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/services/authService.js` | requireAuth, saveSessionLocally, registerWithEmail, loginWithEmail, loginWithGoogle (+1) |
| `frontend/src/services/taskService.js` | requireDb, sortByNewestCreatedAt, listenToUserTasks, createTask, updateTask |
| `frontend/src/hooks/useTasks.js` | useTasks, createTask |

## Entry Points

Start here when exploring this area:

- **`useTasks`** (Function) — `frontend/src/hooks/useTasks.js:11`
- **`createTask`** (Function) — `frontend/src/hooks/useTasks.js:37`
- **`listenToUserTasks`** (Function) — `frontend/src/services/taskService.js:50`
- **`createTask`** (Function) — `frontend/src/services/taskService.js:66`
- **`updateTask`** (Function) — `frontend/src/services/taskService.js:90`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useTasks` | Function | `frontend/src/hooks/useTasks.js` | 11 |
| `createTask` | Function | `frontend/src/hooks/useTasks.js` | 37 |
| `listenToUserTasks` | Function | `frontend/src/services/taskService.js` | 50 |
| `createTask` | Function | `frontend/src/services/taskService.js` | 66 |
| `updateTask` | Function | `frontend/src/services/taskService.js` | 90 |
| `registerWithEmail` | Function | `frontend/src/services/authService.js` | 28 |
| `loginWithEmail` | Function | `frontend/src/services/authService.js` | 39 |
| `loginWithGoogle` | Function | `frontend/src/services/authService.js` | 45 |
| `logout` | Function | `frontend/src/services/authService.js` | 66 |
| `requireDb` | Function | `frontend/src/services/taskService.js` | 17 |
| `sortByNewestCreatedAt` | Function | `frontend/src/services/taskService.js` | 42 |
| `requireAuth` | Function | `frontend/src/services/authService.js` | 16 |
| `saveSessionLocally` | Function | `frontend/src/services/authService.js` | 24 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ToggleRunning → RequireDb` | cross_community | 6 |
| `FocusTaskPage → RequireDb` | cross_community | 4 |
| `FocusTaskPage → SortByNewestCreatedAt` | cross_community | 4 |
| `WeeklyReportPage → RequireDb` | cross_community | 4 |
| `WeeklyReportPage → SortByNewestCreatedAt` | cross_community | 4 |
| `DashboardPage → RequireDb` | cross_community | 4 |
| `DashboardPage → SortByNewestCreatedAt` | cross_community | 4 |
| `HandleSubmit → RequireDb` | cross_community | 4 |
| `UrgentDeadlineAlert → RequireDb` | cross_community | 4 |
| `UrgentDeadlineAlert → SortByNewestCreatedAt` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 1 calls |

## How to Explore

1. `gitnexus_context({name: "useTasks"})` — see callers and callees
2. `gitnexus_query({query: "services"})` — find related execution flows
3. Read key files listed above for implementation details
