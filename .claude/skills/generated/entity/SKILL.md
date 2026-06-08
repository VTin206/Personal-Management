---
name: entity
description: "Skill for the Entity area of Personal-Management. 20 symbols across 4 files."
---

# Entity

20 symbols | 4 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how Task, getTaskById, createTask work
- Modifying entity-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | Task, setId, setTitle, setDescription, setStatus (+5) |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | getTaskById, createTask, updateTask, deleteTask, toTaskEntity |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getTaskById, createTask, updateTask, deleteTask |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getTaskById_shouldReturnOk |

## Entry Points

Start here when exploring this area:

- **`Task`** (Class) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:15`
- **`getTaskById`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:35`
- **`createTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:40`
- **`updateTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:45`
- **`deleteTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:50`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Task` | Class | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 15 |
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 35 |
| `createTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 40 |
| `updateTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 45 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 50 |
| `setId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 52 |
| `setTitle` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 60 |
| `setDescription` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 68 |
| `setStatus` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 76 |
| `setPriority` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 84 |
| `setStartDate` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 92 |
| `setStartTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 100 |
| `setDueDate` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 108 |
| `setDueTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 116 |
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 23 |
| `createTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 27 |
| `updateTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 31 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 68 |
| `toTaskEntity` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 73 |
| `getTaskById_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 37 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `CreateTask → Task` | intra_community | 4 |
| `CreateTask → SetTitle` | intra_community | 4 |
| `CreateTask → SetDescription` | intra_community | 4 |
| `CreateTask → SetStatus` | intra_community | 4 |

## How to Explore

1. `gitnexus_context({name: "Task"})` — see callers and callees
2. `gitnexus_query({query: "entity"})` — find related execution flows
3. Read key files listed above for implementation details
