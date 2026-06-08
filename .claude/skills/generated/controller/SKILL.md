---
name: controller
description: "Skill for the Controller area of Personal-Management. 3 symbols across 3 files."
---

# Controller

3 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how getAllTasks, getAllTasks work
- Modifying controller-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | getAllTasks |
| `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | getAllTasks |
| `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | getAllTasks_shouldReturnOk |

## Entry Points

Start here when exploring this area:

- **`getAllTasks`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java:30`
- **`getAllTasks`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java:19`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Controller/TaskController.java` | 30 |
| `getAllTasks` | Method | `backend/src/main/java/com/personalmanagement/backend/Service/TaskService.java` | 19 |
| `getAllTasks_shouldReturnOk` | Method | `backend/src/test/java/com/personalmanagement/backend/TaskControllerTest.java` | 29 |

## How to Explore

1. `gitnexus_context({name: "getAllTasks"})` — see callers and callees
2. `gitnexus_query({query: "controller"})` — find related execution flows
3. Read key files listed above for implementation details
