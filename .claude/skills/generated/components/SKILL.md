---
name: components
description: "Skill for the Components area of Personal-Management. 49 symbols across 10 files."
---

# Components

49 symbols | 10 files | Cohesion: 65%

## When to Use

- Working with code in `frontend/`
- Understanding how TaskForm, updateField, recordLoginStreak work
- Modifying components-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/components/UrgentDeadlineAlert.jsx` | getDismissedSignature, getDeliveredReminderKeys, storeDeliveredReminderKeys, getNotificationPermission, getReminderKey (+8) |
| `frontend/src/utils/taskStats.js` | isTaskOverdue, isDueDateOverdue, canCompleteTask, isActiveWorkTask, getDashboardStats (+7) |
| `frontend/src/utils/date.js` | endOfDay, endOfCurrentWeek, addDays, getInputDateValue, getInputTimeValue (+5) |
| `frontend/src/components/TaskForm.jsx` | createDefaultTask, createFormState, TaskForm, updateField, handleSubmit |
| `frontend/src/services/streakService.js` | requireDb, getNumericStreak, recordLoginStreak |
| `frontend/src/components/TaskCard.jsx` | TaskCard, quickExtend |
| `frontend/src/utils/taskSchedule.js` | getQuickExtendTaskUpdates |
| `frontend/src/pages/DashboardPage.jsx` | baseTasks |
| `frontend/src/pages/TasksPage.jsx` | activeTasks |
| `frontend/src/services/taskService.js` | normalizeTask |

## Entry Points

Start here when exploring this area:

- **`TaskForm`** (Function) — `frontend/src/components/TaskForm.jsx:50`
- **`updateField`** (Function) — `frontend/src/components/TaskForm.jsx:54`
- **`recordLoginStreak`** (Function) — `frontend/src/services/streakService.js:24`
- **`endOfDay`** (Function) — `frontend/src/utils/date.js:35`
- **`endOfCurrentWeek`** (Function) — `frontend/src/utils/date.js:49`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `TaskForm` | Function | `frontend/src/components/TaskForm.jsx` | 50 |
| `updateField` | Function | `frontend/src/components/TaskForm.jsx` | 54 |
| `recordLoginStreak` | Function | `frontend/src/services/streakService.js` | 24 |
| `endOfDay` | Function | `frontend/src/utils/date.js` | 35 |
| `endOfCurrentWeek` | Function | `frontend/src/utils/date.js` | 49 |
| `addDays` | Function | `frontend/src/utils/date.js` | 55 |
| `getInputDateValue` | Function | `frontend/src/utils/date.js` | 131 |
| `getInputTimeValue` | Function | `frontend/src/utils/date.js` | 138 |
| `getQuickExtendTaskUpdates` | Function | `frontend/src/utils/taskSchedule.js` | 102 |
| `TaskCard` | Function | `frontend/src/components/TaskCard.jsx` | 25 |
| `quickExtend` | Function | `frontend/src/components/TaskCard.jsx` | 48 |
| `baseTasks` | Function | `frontend/src/pages/DashboardPage.jsx` | 210 |
| `activeTasks` | Function | `frontend/src/pages/TasksPage.jsx` | 84 |
| `isTaskOverdue` | Function | `frontend/src/utils/taskStats.js` | 34 |
| `isDueDateOverdue` | Function | `frontend/src/utils/taskStats.js` | 40 |
| `canCompleteTask` | Function | `frontend/src/utils/taskStats.js` | 47 |
| `isActiveWorkTask` | Function | `frontend/src/utils/taskStats.js` | 61 |
| `getDashboardStats` | Function | `frontend/src/utils/taskStats.js` | 209 |
| `UrgentDeadlineAlert` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 70 |
| `getTaskRemainingTimeLabel` | Function | `frontend/src/utils/taskStats.js` | 88 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `TaskTimelineItem → ToDate` | cross_community | 8 |
| `TaskTimelineItem → NormalizeTimeValue` | cross_community | 8 |
| `DashboardPage → ToDate` | cross_community | 7 |
| `DashboardPage → NormalizeTimeValue` | cross_community | 7 |
| `HandleSubmit → ToDate` | cross_community | 7 |
| `HandleSubmit → NormalizeTimeValue` | cross_community | 7 |
| `HandleUpdate → ToDate` | cross_community | 7 |
| `HandleUpdate → NormalizeTimeValue` | cross_community | 7 |
| `HandleSubmit → ToDate` | cross_community | 7 |
| `HandleSubmit → NormalizeTimeValue` | cross_community | 7 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 8 calls |
| Hooks | 2 calls |
| Ui | 1 calls |

## How to Explore

1. `gitnexus_context({name: "TaskForm"})` — see callers and callees
2. `gitnexus_query({query: "components"})` — find related execution flows
3. Read key files listed above for implementation details
