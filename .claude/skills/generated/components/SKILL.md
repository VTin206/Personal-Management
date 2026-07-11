---
name: components
description: "Skill for the Components area of Personal-Management. 42 symbols across 9 files."
---

# Components

42 symbols | 9 files | Cohesion: 66%

## When to Use

- Working with code in `frontend/`
- Understanding how TaskForm, updateField, recordLoginStreak work
- Modifying components-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/components/UrgentDeadlineAlert.jsx` | getDismissedSignature, getDeliveredReminderKeys, storeDeliveredReminderKeys, getNotificationPermission, getReminderKey (+8) |
| `frontend/src/utils/date.js` | endOfDay, endOfCurrentWeek, addDays, getInputDateValue, getInputTimeValue (+3) |
| `frontend/src/utils/taskStats.js` | getTaskRemainingTimeLabel, normalizeNow, isDueDateOverdue, canCompleteTask, isActiveWorkTask (+3) |
| `frontend/src/components/TaskForm.jsx` | createDefaultTask, createFormState, TaskForm, updateField, handleSubmit |
| `frontend/src/services/streakService.js` | requireDb, getNumericStreak, recordLoginStreak |
| `frontend/src/pages/TasksPage.jsx` | TasksPage, activeTasks |
| `frontend/src/utils/taskSchedule.js` | getQuickExtendTaskUpdates |
| `frontend/src/hooks/useNow.js` | useNow |
| `frontend/src/hooks/useTasks.js` | useTasks |

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
| `UrgentDeadlineAlert` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 70 |
| `useNow` | Function | `frontend/src/hooks/useNow.js` | 2 |
| `useTasks` | Function | `frontend/src/hooks/useTasks.js` | 11 |
| `TasksPage` | Function | `frontend/src/pages/TasksPage.jsx` | 75 |
| `getTaskRemainingTimeLabel` | Function | `frontend/src/utils/taskStats.js` | 88 |
| `reminders` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 76 |
| `activeTasks` | Function | `frontend/src/pages/TasksPage.jsx` | 84 |
| `isDueDateOverdue` | Function | `frontend/src/utils/taskStats.js` | 40 |
| `canCompleteTask` | Function | `frontend/src/utils/taskStats.js` | 47 |
| `isActiveWorkTask` | Function | `frontend/src/utils/taskStats.js` | 61 |
| `isUpcomingTask` | Function | `frontend/src/utils/taskStats.js` | 65 |

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
| Pages | 12 calls |
| Services | 1 calls |

## How to Explore

1. `gitnexus_context({name: "TaskForm"})` — see callers and callees
2. `gitnexus_query({query: "components"})` — find related execution flows
3. Read key files listed above for implementation details
