---
name: pages
description: "Skill for the Pages area of Personal-Management. 172 symbols across 24 files."
---

# Pages

172 symbols | 24 files | Cohesion: 71%

## When to Use

- Working with code in `frontend/`
- Understanding how unsubscribe, createTask, updateTask work
- Modifying pages-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/pages/FocusTaskPage.jsx` | playTaskCompleteSound, completeTask, clampMinutes, createSecondsByMode, formatTimer (+40) |
| `frontend/src/pages/WeeklyReportPage.jsx` | getVisibleCalendarRange, calendarRange, dropTaskOnDay, getCalendarStyle, CalendarHoverCard (+28) |
| `frontend/src/utils/taskStats.js` | canCompleteTaskWithUpdates, normalizeNow, isTaskOverdue, isDueDateOverdue, canCompleteTask (+15) |
| `frontend/src/pages/DashboardPage.jsx` | closeTaskForm, handleSubmit, handleUpdate, handleDelete, baseTasks (+5) |
| `frontend/src/utils/taskSchedule.js` | getTaskRange, taskCoversDay, taskOverlapsRange, sortTasksByRange, getRangeDurationDays (+5) |
| `frontend/src/utils/date.js` | startOfDay, formatDateTime, formatTaskDueDateTime, formatTaskDateTimeRange, startOfCurrentWeek (+3) |
| `frontend/src/pages/TasksPage.jsx` | handleSubmit, handleUpdate, handleDelete, EisenhowerCard, activeTasks (+1) |
| `frontend/src/utils/eisenhower.js` | normalizeNow, getRemainingDeadlineMs, isImportantTask, isUrgentTask, getEisenhowerQuadrantKey (+1) |
| `frontend/src/utils/authValidation.js` | validateEmail, validatePassword, validateLoginForm, validateRegisterForm, hasValidationErrors |
| `frontend/src/hooks/useTasks.js` | unsubscribe, createTask, updateTask, deleteTask |

## Entry Points

Start here when exploring this area:

- **`unsubscribe`** (Function) — `frontend/src/hooks/useTasks.js:21`
- **`createTask`** (Function) — `frontend/src/hooks/useTasks.js:37`
- **`updateTask`** (Function) — `frontend/src/hooks/useTasks.js:48`
- **`deleteTask`** (Function) — `frontend/src/hooks/useTasks.js:49`
- **`closeTaskForm`** (Function) — `frontend/src/pages/DashboardPage.jsx:246`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `unsubscribe` | Function | `frontend/src/hooks/useTasks.js` | 21 |
| `createTask` | Function | `frontend/src/hooks/useTasks.js` | 37 |
| `updateTask` | Function | `frontend/src/hooks/useTasks.js` | 48 |
| `deleteTask` | Function | `frontend/src/hooks/useTasks.js` | 49 |
| `closeTaskForm` | Function | `frontend/src/pages/DashboardPage.jsx` | 246 |
| `handleSubmit` | Function | `frontend/src/pages/DashboardPage.jsx` | 251 |
| `handleUpdate` | Function | `frontend/src/pages/DashboardPage.jsx` | 278 |
| `handleDelete` | Function | `frontend/src/pages/DashboardPage.jsx` | 295 |
| `completeTask` | Function | `frontend/src/pages/FocusTaskPage.jsx` | 1209 |
| `handleProfileSubmit` | Function | `frontend/src/pages/SettingsPage.jsx` | 38 |
| `handleSubmit` | Function | `frontend/src/pages/TasksPage.jsx` | 110 |
| `handleUpdate` | Function | `frontend/src/pages/TasksPage.jsx` | 134 |
| `handleDelete` | Function | `frontend/src/pages/TasksPage.jsx` | 151 |
| `createTask` | Function | `frontend/src/services/taskService.js` | 66 |
| `updateTask` | Function | `frontend/src/services/taskService.js` | 90 |
| `deleteTask` | Function | `frontend/src/services/taskService.js` | 100 |
| `getFirebaseErrorMessage` | Function | `frontend/src/utils/firebaseErrors.js` | 22 |
| `canCompleteTaskWithUpdates` | Function | `frontend/src/utils/taskStats.js` | 51 |
| `calendarRange` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 551 |
| `dropTaskOnDay` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 588 |

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
| Components | 18 calls |
| Cluster_39 | 10 calls |
| Ui | 9 calls |
| GetTask | 7 calls |
| Hooks | 4 calls |

## How to Explore

1. `gitnexus_context({name: "unsubscribe"})` — see callers and callees
2. `gitnexus_query({query: "pages"})` — find related execution flows
3. Read key files listed above for implementation details
