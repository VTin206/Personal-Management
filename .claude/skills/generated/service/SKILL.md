---
name: service
description: "Skill for the Service area of Personal-Management. 12 symbols across 6 files."
---

# Service

12 symbols | 6 files | Cohesion: 65%

## When to Use

- Working with code in `backend/`
- Understanding how importTasks, setLegacyId, existsByUserIdAndLegacyId work
- Modifying service-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | importTasks, requireLegacyId, validateSchedule, getAllTasks, requireUserId |
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | importTasks, getAllTasks |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | existsByUserIdAndLegacyId, findByUserIdOrderByCreatedAtDesc |
| `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | setLegacyId |
| `backend/src/test/java/com/personalmanagement/backend/TaskServiceTest.java` | importTasks_shouldSkipExistingLegacyTask |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getAllTasks_shouldReturnOk |

## Entry Points

Start here when exploring this area:

- **`importTasks`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:56`
- **`setLegacyId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java:97`
- **`existsByUserIdAndLegacyId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java:14`
- **`importTasks`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:96`
- **`requireLegacyId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:165`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `importTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 56 |
| `setLegacyId` | Method | `backend/src/main/java/com/personalmanagement/backend/Entity/Task.java` | 97 |
| `existsByUserIdAndLegacyId` | Method | `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | 14 |
| `importTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 96 |
| `requireLegacyId` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 165 |
| `validateSchedule` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 227 |
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
| `DeleteTask → RequireUserId` | cross_community | 4 |
| `CreateTask → ValidateSchedule` | cross_community | 3 |
| `ImportTasks → RequireUserId` | cross_community | 3 |
| `ImportTasks → RequireLegacyId` | intra_community | 3 |
| `ImportTasks → ExistsByUserIdAndLegacyId` | intra_community | 3 |
| `ImportTasks → ValidateSchedule` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Entity | 2 calls |
| Backend | 2 calls |

## How to Explore

1. `gitnexus_context({name: "importTasks"})` — see callers and callees
2. `gitnexus_query({query: "service"})` — find related execution flows
3. Read key files listed above for implementation details
