---
name: backend
description: "Skill for the Backend area of Personal-Management. 15 symbols across 4 files."
---

# Backend

15 symbols | 4 files | Cohesion: 69%

## When to Use

- Working with code in `backend/`
- Understanding how Task, createTask, setUserId work
- Modifying backend-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getTaskById_shouldReturnOk, createTask_shouldReturnCreated, importTasks_shouldUseAuthenticatedUserAndReturnNoContent, updateTask_shouldReturnOk, patchTask_shouldReturnOk (+2) |
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | Task, setUserId, setId, setTitle, setStatus (+1) |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | createTask |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | createTask |

## Entry Points

Start here when exploring this area:

- **`Task`** (Class) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:24`
- **`createTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:49`
- **`setUserId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:85`
- **`setId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:105`
- **`setTitle`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:113`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Task` | Class | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 24 |
| `createTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 49 |
| `setUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 85 |
| `setId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 105 |
| `setTitle` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 113 |
| `setStatus` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 129 |
| `setPriority` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 137 |
| `createTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 41 |
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
| `CreateTask → RequireTitle` | cross_community | 4 |
| `CreateTask → SetDescription` | cross_community | 4 |
| `PatchTask → SetTitle` | cross_community | 4 |
| `CreateTask → GetId` | cross_community | 3 |
| `CreateTask → GetUserId` | cross_community | 3 |
| `CreateTask → GetTitle` | cross_community | 3 |
| `CreateTask → GetDescription` | cross_community | 3 |
| `CreateTask → ValidateDueDateNotPast` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Entity | 8 calls |
| Service | 2 calls |

## How to Explore

1. `gitnexus_context({name: "Task"})` — see callers and callees
2. `gitnexus_query({query: "backend"})` — find related execution flows
3. Read key files listed above for implementation details
