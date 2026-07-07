---
name: controller
description: "Skill for the Controller area of Personal-Management. 4 symbols across 4 files."
---

# Controller

4 symbols | 4 files | Cohesion: 75%

## When to Use

- Working with code in `backend/`
- Understanding how getAllTasks, findByUserIdOrderByCreatedAtDesc, getAllTasks work
- Modifying controller-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getAllTasks |
| `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | findByUserIdOrderByCreatedAtDesc |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | getAllTasks |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getAllTasks_shouldReturnOk |

## Entry Points

Start here when exploring this area:

- **`getAllTasks`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:33`
- **`findByUserIdOrderByCreatedAtDesc`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java:10`
- **`getAllTasks`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:29`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 33 |
| `findByUserIdOrderByCreatedAtDesc` | Method | `backend/src/main/java/com/personalmanagement/backend/Repository/TaskRepository.java` | 10 |
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 29 |
| `getAllTasks_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 40 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Entity | 2 calls |

## How to Explore

1. `gitnexus_context({name: "getAllTasks"})` — see callers and callees
2. `gitnexus_query({query: "controller"})` — find related execution flows
3. Read key files listed above for implementation details
