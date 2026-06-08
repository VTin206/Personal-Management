---
name: pages
description: "Skill for the Pages area of Personal-Management. 178 symbols across 25 files."
---

# Pages

178 symbols | 25 files | Cohesion: 68%

## When to Use

- Working with code in `frontend/`
- Understanding how reminders, baseTasks, activeTasks work
- Modifying pages-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/pages/FocusTaskPage.jsx` | clampMinutes, createSecondsByMode, formatTimer, getTaskSessionStatsTotal, getStoredFocusThemeKey (+40) |
| `frontend/src/pages/WeeklyReportPage.jsx` | getVisibleCalendarRange, calendarRange, dropTaskOnDay, getCalendarStyle, CalendarHoverCard (+28) |
| `frontend/src/utils/taskStats.js` | normalizeNow, isTaskOverdue, isDueDateOverdue, canCompleteTask, isActiveWorkTask (+18) |
| `frontend/src/pages/DashboardPage.jsx` | baseTasks, handleSubmit, handleUpdate, closeTaskForm, handleDelete (+5) |
| `frontend/src/utils/taskSchedule.js` | getTaskRange, taskCoversDay, taskOverlapsRange, sortTasksByRange, getRangeDurationDays (+5) |
| `frontend/src/utils/date.js` | getTaskDueDateTime, startOfDay, formatDateTime, formatTaskDueDateTime, formatTaskDateTimeRange (+4) |
| `frontend/src/pages/TasksPage.jsx` | activeTasks, EisenhowerCard, eisenhowerGroups, handleSubmit, handleUpdate (+3) |
| `frontend/src/utils/eisenhower.js` | normalizeNow, getRemainingDeadlineMs, isImportantTask, isUrgentTask, getEisenhowerQuadrantKey (+2) |
| `frontend/src/utils/authValidation.js` | validateEmail, validatePassword, validateLoginForm, validateRegisterForm, hasValidationErrors |
| `frontend/src/pages/LoginPage.jsx` | LoginPage, updateField, handleSubmit, handleGoogleLogin |

## Entry Points

Start here when exploring this area:

- **`reminders`** (Function) — `frontend/src/components/UrgentDeadlineAlert.jsx:76`
- **`baseTasks`** (Function) — `frontend/src/pages/DashboardPage.jsx:210`
- **`activeTasks`** (Function) — `frontend/src/pages/TasksPage.jsx:84`
- **`getTaskDueDateTime`** (Function) — `frontend/src/utils/date.js:101`
- **`isTaskOverdue`** (Function) — `frontend/src/utils/taskStats.js:34`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `reminders` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 76 |
| `baseTasks` | Function | `frontend/src/pages/DashboardPage.jsx` | 210 |
| `activeTasks` | Function | `frontend/src/pages/TasksPage.jsx` | 84 |
| `getTaskDueDateTime` | Function | `frontend/src/utils/date.js` | 101 |
| `isTaskOverdue` | Function | `frontend/src/utils/taskStats.js` | 34 |
| `isDueDateOverdue` | Function | `frontend/src/utils/taskStats.js` | 40 |
| `canCompleteTask` | Function | `frontend/src/utils/taskStats.js` | 47 |
| `isActiveWorkTask` | Function | `frontend/src/utils/taskStats.js` | 61 |
| `isUpcomingTask` | Function | `frontend/src/utils/taskStats.js` | 65 |
| `isTaskDueWithin24Hours` | Function | `frontend/src/utils/taskStats.js` | 76 |
| `getUrgentDeadlineTasks` | Function | `frontend/src/utils/taskStats.js` | 101 |
| `getDeadlineReminderTasks` | Function | `frontend/src/utils/taskStats.js` | 107 |
| `getDashboardStats` | Function | `frontend/src/utils/taskStats.js` | 209 |
| `dueByEndOfWeek` | Function | `frontend/src/utils/taskStats.js` | 216 |
| `calendarRange` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 551 |
| `dropTaskOnDay` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 588 |
| `startOfDay` | Function | `frontend/src/utils/date.js` | 29 |
| `getTaskRange` | Function | `frontend/src/utils/taskSchedule.js` | 19 |
| `taskCoversDay` | Function | `frontend/src/utils/taskSchedule.js` | 30 |
| `taskOverlapsRange` | Function | `frontend/src/utils/taskSchedule.js` | 37 |

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
| Components | 19 calls |
| Ui | 9 calls |
| Services | 9 calls |
| GetTask | 7 calls |

## How to Explore

1. `gitnexus_context({name: "reminders"})` — see callers and callees
2. `gitnexus_query({query: "pages"})` — find related execution flows
3. Read key files listed above for implementation details
