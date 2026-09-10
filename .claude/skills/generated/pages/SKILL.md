---
name: pages
description: "Skill for the Pages area of Personal-Management. 163 symbols across 25 files."
---

# Pages

163 symbols | 25 files | Cohesion: 71%

## When to Use

- Working with code in `frontend/`
- Understanding how TaskForm, updateField, WeeklyReportPage work
- Modifying pages-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/pages/WeeklyReportPage.jsx` | formatMonthTitle, buildMonthCalendarDays, buildWeekCalendarDays, formatWeekTitle, getCompletionRate (+29) |
| `frontend/src/pages/FocusTaskPage.jsx` | formatTimer, FocusTaskPage, sanitizeYouTubeId, isYouTubeHost, getYouTubeEmbedOrigin (+26) |
| `frontend/src/utils/taskStats.js` | getTaskFocusLog, sumFocusLogSeconds, getStudyTimeSummary, getDashboardStats, getWeeklyFocusChartData (+15) |
| `frontend/src/utils/date.js` | endOfDay, startOfCurrentWeek, endOfCurrentWeek, addDays, formatDate (+10) |
| `frontend/src/utils/taskSchedule.js` | getQuickExtendTaskUpdates, getTaskRange, taskCoversDay, taskOverlapsRange, sortTasksByRange (+6) |
| `frontend/src/pages/DashboardPage.jsx` | baseTasks, closeTaskForm, handleSubmit, handleUpdate, handleDelete (+3) |
| `frontend/src/pages/TasksPage.jsx` | activeTasks, sortedTasks, TasksTable, handleSubmit, handleUpdate (+1) |
| `frontend/src/utils/authValidation.js` | validateEmail, validatePassword, validateLoginForm, validateRegisterForm, hasValidationErrors |
| `frontend/src/components/TaskForm.jsx` | createDefaultTask, createFormState, TaskForm, updateField |
| `frontend/src/services/streakService.js` | requireDb, getNumericStreak, recordLoginStreak |

## Entry Points

Start here when exploring this area:

- **`TaskForm`** (Function) — `frontend/src/components/TaskForm.jsx:50`
- **`updateField`** (Function) — `frontend/src/components/TaskForm.jsx:54`
- **`WeeklyReportPage`** (Function) — `frontend/src/pages/WeeklyReportPage.jsx:530`
- **`calendarDays`** (Function) — `frontend/src/pages/WeeklyReportPage.jsx:546`
- **`recordLoginStreak`** (Function) — `frontend/src/services/streakService.js:24`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `TaskForm` | Function | `frontend/src/components/TaskForm.jsx` | 50 |
| `updateField` | Function | `frontend/src/components/TaskForm.jsx` | 54 |
| `WeeklyReportPage` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 530 |
| `calendarDays` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 546 |
| `recordLoginStreak` | Function | `frontend/src/services/streakService.js` | 24 |
| `endOfDay` | Function | `frontend/src/utils/date.js` | 35 |
| `startOfCurrentWeek` | Function | `frontend/src/utils/date.js` | 41 |
| `endOfCurrentWeek` | Function | `frontend/src/utils/date.js` | 49 |
| `addDays` | Function | `frontend/src/utils/date.js` | 55 |
| `formatDate` | Function | `frontend/src/utils/date.js` | 72 |
| `getInputDateValue` | Function | `frontend/src/utils/date.js` | 131 |
| `getInputTimeValue` | Function | `frontend/src/utils/date.js` | 138 |
| `getCurrentWeekDays` | Function | `frontend/src/utils/date.js` | 144 |
| `getQuickExtendTaskUpdates` | Function | `frontend/src/utils/taskSchedule.js` | 102 |
| `getTaskFocusLog` | Function | `frontend/src/utils/taskStats.js` | 158 |
| `sumFocusLogSeconds` | Function | `frontend/src/utils/taskStats.js` | 209 |
| `getStudyTimeSummary` | Function | `frontend/src/utils/taskStats.js` | 228 |
| `getDashboardStats` | Function | `frontend/src/utils/taskStats.js` | 244 |
| `getWeeklyFocusChartData` | Function | `frontend/src/utils/taskStats.js` | 277 |
| `focusSeconds` | Function | `frontend/src/utils/taskStats.js` | 280 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `DashboardPage → ToDate` | cross_community | 7 |
| `DashboardPage → NormalizeTimeValue` | cross_community | 7 |
| `HandleSubmit → ToDate` | cross_community | 7 |
| `HandleSubmit → NormalizeTimeValue` | cross_community | 7 |
| `HandleUpdate → ToDate` | cross_community | 7 |
| `HandleUpdate → NormalizeTimeValue` | cross_community | 7 |
| `HandleSubmit → ToDate` | cross_community | 7 |
| `HandleSubmit → NormalizeTimeValue` | cross_community | 7 |
| `HandleUpdate → ToDate` | cross_community | 7 |
| `HandleUpdate → NormalizeTimeValue` | cross_community | 7 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Components | 14 calls |
| Ui | 10 calls |
| GetT | 3 calls |
| Cluster_42 | 2 calls |
| Services | 1 calls |
| Entity | 1 calls |

## How to Explore

1. `gitnexus_context({name: "TaskForm"})` — see callers and callees
2. `gitnexus_query({query: "pages"})` — find related execution flows
3. Read key files listed above for implementation details
