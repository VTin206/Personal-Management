---
name: service
description: "Skill for the Service area of Personal-Management. 19 symbols across 6 files."
---

# Service

19 symbols | 6 files | Cohesion: 61%

## When to Use

- Working with code in `backend/`
- Understanding how createTask, getStartDate, getStartTime work
- Modifying service-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | createTask, validateUpdateRequest, validateDueDateNotPast, validateSchedule, importTasks (+3) |
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | getStartDate, getStartTime, getDueTime, setLegacyId |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | createTask, importTasks, getAllTasks |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | existsByUserIdAndLegacyId, findByUserIdOrderByCreatedAtDesc |
| `backend/src/test/java/com/personalmanagement/backend/TaskServiceTest.java` | importTasks_shouldSkipExistingLegacyTask |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getAllTasks_shouldReturnOk |

## Entry Points

Start here when exploring this area:

- **`createTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:49`
- **`getStartDate`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:141`
- **`getStartTime`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:149`
- **`getDueTime`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:165`
- **`createTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:41`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 49 |
| `getStartDate` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 141 |
| `getStartTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 149 |
| `getDueTime` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 165 |
| `createTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 41 |
| `validateUpdateRequest` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 201 |
| `validateDueDateNotPast` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 221 |
| `validateSchedule` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 227 |
| `importTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 56 |
| `setLegacyId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 97 |
| `existsByUserIdAndLegacyId` | Method | `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | 14 |
| `importTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 96 |
| `requireLegacyId` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 165 |
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 35 |
| `findByUserIdOrderByCreatedAtDesc` | Method | `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | 10 |
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 32 |
| `requireUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 157 |
| `importTasks_shouldSkipExistingLegacyTask` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskServiceTest.java` | 156 |
| `getAllTasks_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 47 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `PatchTask → RequireUserId` | cross_community | 5 |
| `PatchTask → ValidateDueDateNotPast` | cross_community | 5 |
| `PatchTask → GetStartDate` | cross_community | 5 |
| `PatchTask → GetStartTime` | cross_community | 5 |
| `PatchTask → GetDueDate` | cross_community | 5 |
| `CreateTask → Task` | cross_community | 4 |
| `CreateTask → SetTitle` | cross_community | 4 |
| `CreateTask → RequireTitle` | cross_community | 4 |
| `CreateTask → SetDescription` | cross_community | 4 |
| `DeleteTask → RequireUserId` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Entity | 5 calls |
| Backend | 3 calls |

## How to Explore

1. `gitnexus_context({name: "createTask"})` — see callers and callees
2. `gitnexus_query({query: "service"})` — find related execution flows
3. Read key files listed above for implementation details
