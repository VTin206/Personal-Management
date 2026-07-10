---
name: entity
description: "Skill for the Entity area of Personal-Management. 68 symbols across 9 files."
---

# Entity

68 symbols | 9 files | Cohesion: 74%

## When to Use

- Working with code in `backend/`
- Understanding how Task, getTaskById, deleteTask work
- Modifying entity-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | getUserId, getId, getTitle, getDescription, getStatus (+33) |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | getTaskById, deleteTask, updateTask, toTaskEntity, requireTitle (+5) |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getTaskById, deleteTask, updateTask, patchTask, createTask |
| `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | from, statusValue, priorityValue, formatTime |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getTaskById_shouldReturnOk, createTask_shouldReturnCreated, updateTask_shouldReturnOk, patchTask_shouldReturnOk |
| `backend/src/main/java/com/personalmanagement/backend/Entity/TaskPriority.java` | getValue, fromValue |
| `backend/src/main/java/com/personalmanagement/backend/Entity/TaskStatus.java` | getValue, fromValue |
| `backend/src/test/java/com/personalmanagement/backend/TaskServiceTest.java` | createTask_shouldMapFrontendTaskContract, updateTask_shouldApplyFrontendPartialSessionUpdates |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | findByIdAndUserId |

## Entry Points

Start here when exploring this area:

- **`Task`** (Class) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:23`
- **`getTaskById`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:41`
- **`deleteTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:71`
- **`from`** (Method) — `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java:35`
- **`statusValue`** (Method) — `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java:58`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Task` | Class | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 23 |
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 41 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 71 |
| `from` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 35 |
| `statusValue` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 58 |
| `priorityValue` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 62 |
| `formatTime` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 66 |
| `getUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 81 |
| `getId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 85 |
| `getTitle` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 93 |
| `getDescription` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 101 |
| `getStatus` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 109 |
| `getPriority` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 117 |
| `getFocusSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 157 |
| `getFocusLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 165 |
| `getShortBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 173 |
| `getShortBreakLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 181 |
| `getLongBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 189 |
| `getLongBreakLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 197 |
| `getCreatedAt` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 205 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `PatchTask → FindByIdAndUserId` | cross_community | 5 |
| `PatchTask → RequireUserId` | cross_community | 5 |
| `PatchTask → ValidateDueDateNotPast` | cross_community | 5 |
| `PatchTask → GetStartDate` | cross_community | 5 |
| `PatchTask → GetStartTime` | cross_community | 5 |
| `PatchTask → GetDueDate` | cross_community | 5 |
| `CreateTask → Task` | cross_community | 4 |
| `CreateTask → SetTitle` | cross_community | 4 |
| `CreateTask → RequireTitle` | cross_community | 4 |
| `CreateTask → SetDescription` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Service | 9 calls |

## How to Explore

1. `gitnexus_context({name: "Task"})` — see callers and callees
2. `gitnexus_query({query: "entity"})` — find related execution flows
3. Read key files listed above for implementation details
