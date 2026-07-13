---
name: services
description: "Skill for the Services area of Personal-Management. 31 symbols across 6 files."
---

# Services

31 symbols | 6 files | Cohesion: 80%

## When to Use

- Working with code in `frontend/`
- Understanding how TaskProvider, deleteTask, getTasks work
- Modifying services-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/services/taskService.js` | requireApiBaseUrl, requireCurrentUser, request, migrationStorageKey, migrationCompleted (+12) |
| `frontend/src/services/authService.js` | requireAuth, saveSessionLocally, registerWithEmail, loginWithEmail, loginWithGoogle (+1) |
| `frontend/src/contexts/TaskProvider.jsx` | TaskProvider, deleteTask, createTask, updateTask |
| `frontend/src/services/taskService.test.js` | json, data |
| `frontend/src/pages/LoginPage.jsx` | handleGoogleLogin |
| `frontend/src/pages/RegisterPage.jsx` | handleGoogleLogin |

## Entry Points

Start here when exploring this area:

- **`TaskProvider`** (Function) — `frontend/src/contexts/TaskProvider.jsx:12`
- **`deleteTask`** (Function) — `frontend/src/contexts/TaskProvider.jsx:73`
- **`getTasks`** (Function) — `frontend/src/services/taskService.js:179`
- **`deleteTask`** (Function) — `frontend/src/services/taskService.js:205`
- **`handleGoogleLogin`** (Function) — `frontend/src/pages/LoginPage.jsx:55`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `TaskProvider` | Function | `frontend/src/contexts/TaskProvider.jsx` | 12 |
| `deleteTask` | Function | `frontend/src/contexts/TaskProvider.jsx` | 73 |
| `getTasks` | Function | `frontend/src/services/taskService.js` | 179 |
| `deleteTask` | Function | `frontend/src/services/taskService.js` | 205 |
| `handleGoogleLogin` | Function | `frontend/src/pages/LoginPage.jsx` | 55 |
| `handleGoogleLogin` | Function | `frontend/src/pages/RegisterPage.jsx` | 60 |
| `registerWithEmail` | Function | `frontend/src/services/authService.js` | 28 |
| `loginWithEmail` | Function | `frontend/src/services/authService.js` | 39 |
| `loginWithGoogle` | Function | `frontend/src/services/authService.js` | 45 |
| `logout` | Function | `frontend/src/services/authService.js` | 66 |
| `createTask` | Function | `frontend/src/contexts/TaskProvider.jsx` | 49 |
| `updateTask` | Function | `frontend/src/contexts/TaskProvider.jsx` | 63 |
| `createTask` | Function | `frontend/src/services/taskService.js` | 185 |
| `updateTask` | Function | `frontend/src/services/taskService.js` | 195 |
| `requireApiBaseUrl` | Function | `frontend/src/services/taskService.js` | 11 |
| `requireCurrentUser` | Function | `frontend/src/services/taskService.js` | 19 |
| `request` | Function | `frontend/src/services/taskService.js` | 98 |
| `migrationStorageKey` | Function | `frontend/src/services/taskService.js` | 123 |
| `migrationCompleted` | Function | `frontend/src/services/taskService.js` | 127 |
| `markMigrationCompleted` | Function | `frontend/src/services/taskService.js` | 135 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `HandleGoogleLogin → RequireAuth` | intra_community | 4 |
| `HandleGoogleLogin → RequireAuth` | intra_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 5 calls |
| Components | 4 calls |

## How to Explore

1. `gitnexus_context({name: "TaskProvider"})` — see callers and callees
2. `gitnexus_query({query: "services"})` — find related execution flows
3. Read key files listed above for implementation details
