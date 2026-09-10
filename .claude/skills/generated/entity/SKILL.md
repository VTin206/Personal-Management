---
name: entity
description: "Skill for the Entity area of Personal-Management. 58 symbols across 7 files."
---

# Entity

58 symbols | 7 files | Cohesion: 76%

## When to Use

- Working with code in `backend/`
- Understanding how setDescription, setStartDate, setStartTime work
- Modifying entity-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | setDescription, setStartDate, setStartTime, setDueDate, setDueTime (+31) |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | updateTask, toTaskEntity, toImportedTask, requireTitle, validateDescription (+4) |
| `backend/src/main/java/com/personalmanagement/backend/DTO/response/TaskResponse.java` | from, statusValue, priorityValue, formatTime |
| `backend/src/test/java/com/personalmanagement/backend/TaskServiceTest.java` | importTasks_shouldPreserveLegacyDataAndAllowPastDueDate, createTask_shouldMapFrontendTaskContract, updateTask_shouldApplyFrontendPartialSessionUpdates |
| `backend/src/main/java/com/personalmanagement/backend/Entity/TaskPriority.java` | fromValue, getValue |
| `backend/src/main/java/com/personalmanagement/backend/Entity/TaskStatus.java` | fromValue, getValue |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | updateTask, patchTask |

## Entry Points

Start here when exploring this area:

- **`setDescription`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:121`
- **`setStartDate`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:145`
- **`setStartTime`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:153`
- **`setDueDate`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:161`
- **`setDueTime`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:169`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `setDescription` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 121 |
| `setStartDate` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 145 |
| `setStartTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 153 |
| `setDueDate` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 161 |
| `setDueTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 169 |
| `setFocusSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 177 |
| `setFocusLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 185 |
| `setShortBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 193 |
| `setShortBreakLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 201 |
| `setLongBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 209 |
| `setLongBreakLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 217 |
| `setCreatedAt` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 225 |
| `setUpdatedAt` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 233 |
| `setCompletedAt` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 241 |
| `normalizeLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 310 |
| `fromValue` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/TaskPriority.java` | 17 |
| `fromValue` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/TaskStatus.java` | 17 |
| `updateTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 50 |
| `toTaskEntity` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 115 |
| `toImportedTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 135 |

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
| Backend | 17 calls |
| Service | 7 calls |
| Controller | 2 calls |

## How to Explore

1. `gitnexus_context({name: "setDescription"})` — see callers and callees
2. `gitnexus_query({query: "entity"})` — find related execution flows
3. Read key files listed above for implementation details
