---
name: entity
description: "Skill for the Entity area of Personal-Management. 51 symbols across 6 files."
---

# Entity

51 symbols | 6 files | Cohesion: 85%

## When to Use

- Working with code in `backend/`
- Understanding how Task, getTaskById, deleteTask work
- Modifying entity-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | Task, setUserId, setId, setTitle, setDescription (+26) |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | getTaskById, createTask, updateTask, deleteTask, toTaskEntity (+6) |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getTaskById, deleteTask, createTask, updateTask |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getTaskById_shouldReturnOk, createTask_shouldReturnCreated, updateTask_shouldReturnOk |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | findByIdAndUserId |
| `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | from |

## Entry Points

Start here when exploring this area:

- **`Task`** (Class) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:17`
- **`getTaskById`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:40`
- **`deleteTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:62`
- **`setUserId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:53`
- **`setId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:65`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Task` | Class | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 17 |
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 40 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 62 |
| `setUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 53 |
| `setId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 65 |
| `setTitle` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 73 |
| `setDescription` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 81 |
| `setStatus` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 89 |
| `setPriority` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 97 |
| `setStartDate` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 105 |
| `setStartTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 113 |
| `setDueDate` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 121 |
| `setDueTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 129 |
| `findByIdAndUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | 12 |
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 33 |
| `createTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 38 |
| `updateTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 47 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 86 |
| `toTaskEntity` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 91 |
| `requireUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 105 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `CreateTask → Task` | cross_community | 4 |
| `CreateTask → SetTitle` | cross_community | 4 |
| `CreateTask → RequireTitle` | cross_community | 4 |
| `CreateTask → SetDescription` | cross_community | 4 |
| `UpdateTask → FindByIdAndUserId` | cross_community | 4 |
| `UpdateTask → RequireUserId` | cross_community | 4 |
| `UpdateTask → ValidateDueDateNotPast` | cross_community | 4 |
| `UpdateTask → GetStartDate` | cross_community | 4 |
| `UpdateTask → GetStartTime` | cross_community | 4 |
| `UpdateTask → GetDueDate` | cross_community | 4 |

## How to Explore

1. `gitnexus_context({name: "Task"})` — see callers and callees
2. `gitnexus_query({query: "entity"})` — find related execution flows
3. Read key files listed above for implementation details
