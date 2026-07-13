---
name: entity
description: "Skill for the Entity area of Personal-Management. 68 symbols across 8 files."
---

# Entity

68 symbols | 8 files | Cohesion: 78%

## When to Use

- Working with code in `backend/`
- Understanding how getTaskById, updateTask, patchTask work
- Modifying entity-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | getUserId, getId, getTitle, getDescription, getStatus (+34) |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | getTaskById, deleteTask, updateTask, toTaskEntity, toImportedTask (+8) |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getTaskById, updateTask, patchTask, deleteTask |
| `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | from, statusValue, priorityValue, formatTime |
| `backend/src/test/java/com/personalmanagement/backend/TaskServiceTest.java` | createTask_shouldMapFrontendTaskContract, updateTask_shouldApplyFrontendPartialSessionUpdates, importTasks_shouldPreserveLegacyDataAndAllowPastDueDate |
| `backend/src/main/java/com/personalmanagement/backend/Entity/TaskPriority.java` | getValue, fromValue |
| `backend/src/main/java/com/personalmanagement/backend/Entity/TaskStatus.java` | getValue, fromValue |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | findByIdAndUserId |

## Entry Points

Start here when exploring this area:

- **`getTaskById`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:42`
- **`updateTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:65`
- **`patchTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:73`
- **`deleteTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:81`
- **`from`** (Method) — `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java:35`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 42 |
| `updateTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 65 |
| `patchTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 73 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 81 |
| `from` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 35 |
| `statusValue` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 58 |
| `priorityValue` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 62 |
| `formatTime` | Method | `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | 66 |
| `getUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 89 |
| `getId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 101 |
| `getTitle` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 109 |
| `getDescription` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 117 |
| `getStatus` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 125 |
| `getPriority` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 133 |
| `getFocusSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 173 |
| `getFocusLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 181 |
| `getShortBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 189 |
| `getShortBreakLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 197 |
| `getLongBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 205 |
| `getLongBreakLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 213 |

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
| Backend | 18 calls |
| Service | 4 calls |

## How to Explore

1. `gitnexus_context({name: "getTaskById"})` — see callers and callees
2. `gitnexus_query({query: "entity"})` — find related execution flows
3. Read key files listed above for implementation details
