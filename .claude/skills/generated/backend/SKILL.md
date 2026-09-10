---
name: backend
description: "Skill for the Backend area of Personal-Management. 13 symbols across 2 files."
---

# Backend

13 symbols | 2 files | Cohesion: 70%

## When to Use

- Working with code in `backend/`
- Understanding how Task, setUserId, setId work
- Modifying backend-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getTaskById_shouldReturnOk, createTask_shouldReturnCreated, importTasks_shouldUseAuthenticatedUserAndReturnNoContent, updateTask_shouldReturnOk, patchTask_shouldReturnOk (+2) |
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | Task, setUserId, setId, setTitle, setStatus (+1) |

## Entry Points

Start here when exploring this area:

- **`Task`** (Class) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:24`
- **`setUserId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:85`
- **`setId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:105`
- **`setTitle`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:113`
- **`setStatus`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:129`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Task` | Class | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 24 |
| `setUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 85 |
| `setId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 105 |
| `setTitle` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 113 |
| `setStatus` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 129 |
| `setPriority` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 137 |
| `getTaskById_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 61 |
| `createTask_shouldReturnCreated` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 84 |
| `importTasks_shouldUseAuthenticatedUserAndReturnNoContent` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 117 |
| `updateTask_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 139 |
| `patchTask_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 172 |
| `deleteTask_shouldReturnNoContent` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 195 |
| `authenticatedUser` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 203 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `CreateTask → Task` | cross_community | 4 |
| `CreateTask → SetTitle` | cross_community | 4 |
| `PatchTask → SetTitle` | cross_community | 4 |
| `CreateTask → SetUserId` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Entity | 4 calls |
| Controller | 1 calls |
| Service | 1 calls |

## How to Explore

1. `gitnexus_context({name: "Task"})` — see callers and callees
2. `gitnexus_query({query: "backend"})` — find related execution flows
3. Read key files listed above for implementation details
