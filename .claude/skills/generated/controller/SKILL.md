---
name: controller
description: "Skill for the Controller area of Personal-Management. 5 symbols across 3 files."
---

# Controller

5 symbols | 3 files | Cohesion: 62%

## When to Use

- Working with code in `backend/`
- Understanding how getTaskById, deleteTask, findByIdAndUserId work
- Modifying controller-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getTaskById, deleteTask |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | getTaskById, deleteTask |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | findByIdAndUserId |

## Entry Points

Start here when exploring this area:

- **`getTaskById`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:42`
- **`deleteTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:81`
- **`findByIdAndUserId`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java:12`
- **`getTaskById`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:36`
- **`deleteTask`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:91`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 42 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 81 |
| `findByIdAndUserId` | Method | `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | 12 |
| `getTaskById` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 36 |
| `deleteTask` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 91 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `PatchTask → FindByIdAndUserId` | cross_community | 5 |
| `PatchTask → RequireUserId` | cross_community | 5 |
| `DeleteTask → FindByIdAndUserId` | intra_community | 4 |
| `DeleteTask → RequireUserId` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Entity | 1 calls |
| Service | 1 calls |

## How to Explore

1. `gitnexus_context({name: "getTaskById"})` — see callers and callees
2. `gitnexus_query({query: "controller"})` — find related execution flows
3. Read key files listed above for implementation details
