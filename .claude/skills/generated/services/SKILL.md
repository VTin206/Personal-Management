---
name: services
description: "Skill for the Services area of Personal-Management. 17 symbols across 5 files."
---

# Services

17 symbols | 5 files | Cohesion: 82%

## When to Use

- Working with code in `frontend/`
- Understanding how createTask, getTasks, createTask work
- Modifying services-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/services/taskService.js` | requireCurrentUser, normalizeTask, toDateValue, toTaskPayload, request (+3) |
| `frontend/src/services/authService.js` | requireAuth, saveSessionLocally, registerWithEmail, loginWithEmail, loginWithGoogle (+1) |
| `frontend/src/hooks/useTasks.js` | createTask |
| `frontend/src/pages/LoginPage.jsx` | handleGoogleLogin |
| `frontend/src/pages/RegisterPage.jsx` | handleGoogleLogin |

## Entry Points

Start here when exploring this area:

- **`createTask`** (Function) — `frontend/src/hooks/useTasks.js:43`
- **`getTasks`** (Function) — `frontend/src/services/taskService.js:81`
- **`createTask`** (Function) — `frontend/src/services/taskService.js:86`
- **`updateTask`** (Function) — `frontend/src/services/taskService.js:96`
- **`handleGoogleLogin`** (Function) — `frontend/src/pages/LoginPage.jsx:55`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createTask` | Function | `frontend/src/hooks/useTasks.js` | 43 |
| `getTasks` | Function | `frontend/src/services/taskService.js` | 81 |
| `createTask` | Function | `frontend/src/services/taskService.js` | 86 |
| `updateTask` | Function | `frontend/src/services/taskService.js` | 96 |
| `handleGoogleLogin` | Function | `frontend/src/pages/LoginPage.jsx` | 55 |
| `handleGoogleLogin` | Function | `frontend/src/pages/RegisterPage.jsx` | 60 |
| `registerWithEmail` | Function | `frontend/src/services/authService.js` | 28 |
| `loginWithEmail` | Function | `frontend/src/services/authService.js` | 39 |
| `loginWithGoogle` | Function | `frontend/src/services/authService.js` | 45 |
| `logout` | Function | `frontend/src/services/authService.js` | 66 |
| `requireCurrentUser` | Function | `frontend/src/services/taskService.js` | 5 |
| `normalizeTask` | Function | `frontend/src/services/taskService.js` | 15 |
| `toDateValue` | Function | `frontend/src/services/taskService.js` | 30 |
| `toTaskPayload` | Function | `frontend/src/services/taskService.js` | 42 |
| `request` | Function | `frontend/src/services/taskService.js` | 56 |
| `requireAuth` | Function | `frontend/src/services/authService.js` | 16 |
| `saveSessionLocally` | Function | `frontend/src/services/authService.js` | 24 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ToggleRunning → RequireCurrentUser` | cross_community | 7 |
| `FocusTaskPage → RequireCurrentUser` | cross_community | 5 |
| `WeeklyReportPage → RequireCurrentUser` | cross_community | 5 |
| `DashboardPage → RequireCurrentUser` | cross_community | 5 |
| `HandleSubmit → RequireCurrentUser` | cross_community | 5 |
| `UrgentDeadlineAlert → RequireCurrentUser` | cross_community | 5 |
| `DropTaskOnDay → RequireCurrentUser` | cross_community | 5 |
| `DropTaskOnDay → ToDate` | cross_community | 5 |
| `HandleUpdate → RequireCurrentUser` | cross_community | 5 |
| `HandleDelete → RequireCurrentUser` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 2 calls |
| Components | 2 calls |

## How to Explore

1. `gitnexus_context({name: "createTask"})` — see callers and callees
2. `gitnexus_query({query: "services"})` — find related execution flows
3. Read key files listed above for implementation details
