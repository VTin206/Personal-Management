---
name: service
description: "Skill for the Service area of Personal-Management. 12 symbols across 5 files."
---

# Service

12 symbols | 5 files | Cohesion: 60%

## When to Use

- Working with code in `backend/`
- Understanding how setFocusSeconds, setShortBreakSeconds, setLongBreakSeconds work
- Modifying service-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | applySessionUpdates, defaultSeconds, validateSeconds, validateLog, getAllTasks (+1) |
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | setFocusSeconds, setShortBreakSeconds, setLongBreakSeconds |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getAllTasks |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | findByUserIdOrderByCreatedAtDesc |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getAllTasks_shouldReturnOk |

## Entry Points

Start here when exploring this area:

- **`setFocusSeconds`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:161`
- **`setShortBreakSeconds`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:177`
- **`setLongBreakSeconds`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:193`
- **`applySessionUpdates`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:184`
- **`defaultSeconds`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:210`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `setFocusSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 161 |
| `setShortBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 177 |
| `setLongBreakSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 193 |
| `applySessionUpdates` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 184 |
| `defaultSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 210 |
| `validateSeconds` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 218 |
| `validateLog` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 226 |
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 33 |
| `findByUserIdOrderByCreatedAtDesc` | Method | `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | 10 |
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 30 |
| `requireUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 114 |
| `getAllTasks_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 47 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `PatchTask → RequireUserId` | cross_community | 5 |
| `DeleteTask → RequireUserId` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Entity | 5 calls |

## How to Explore

1. `gitnexus_context({name: "setFocusSeconds"})` — see callers and callees
2. `gitnexus_query({query: "service"})` — find related execution flows
3. Read key files listed above for implementation details
