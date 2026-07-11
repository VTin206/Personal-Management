---
name: pages
description: "Skill for the Pages area of Personal-Management. 167 symbols across 23 files."
---

# Pages

167 symbols | 23 files | Cohesion: 69%

## When to Use

- Working with code in `frontend/`
- Understanding how calendarRange, startOfDay, getTaskRange work
- Modifying pages-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/pages/FocusTaskPage.jsx` | getNextMode, getTimerAnchorSecondsLeft, createTimerAnchor, playSound, playSessionSwitchSound (+40) |
| `frontend/src/pages/WeeklyReportPage.jsx` | getVisibleCalendarRange, parseCalendarDragPayload, CalendarDayCell, calendarRange, formatMonthTitle (+30) |
| `frontend/src/utils/taskStats.js` | isTaskOverdue, getWeeklyChartData, getWeeklyFocusChartData, sumLogSeconds, canCompleteTaskWithUpdates (+11) |
| `frontend/src/utils/date.js` | startOfDay, startOfCurrentWeek, formatDate, getCurrentWeekDays, formatDateTime (+5) |
| `frontend/src/utils/taskSchedule.js` | getTaskRange, taskCoversDay, taskOverlapsRange, sortTasksByRange, getRangeDurationDays (+5) |
| `frontend/src/pages/DashboardPage.jsx` | baseTasks, handleSubmit, handleUpdate, closeTaskForm, handleDelete (+5) |
| `frontend/src/utils/eisenhower.js` | normalizeNow, getRemainingDeadlineMs, isImportantTask, isUrgentTask, getEisenhowerQuadrantKey (+2) |
| `frontend/src/pages/TasksPage.jsx` | EisenhowerCard, handleSubmit, handleUpdate, eisenhowerGroups, sortedTasks (+1) |
| `frontend/src/utils/authValidation.js` | validateEmail, validatePassword, validateLoginForm, validateRegisterForm, hasValidationErrors |
| `frontend/src/pages/LoginPage.jsx` | LoginPage, updateField, handleSubmit |

## Entry Points

Start here when exploring this area:

- **`calendarRange`** (Function) — `frontend/src/pages/WeeklyReportPage.jsx:551`
- **`startOfDay`** (Function) — `frontend/src/utils/date.js:29`
- **`getTaskRange`** (Function) — `frontend/src/utils/taskSchedule.js:19`
- **`taskCoversDay`** (Function) — `frontend/src/utils/taskSchedule.js:30`
- **`taskOverlapsRange`** (Function) — `frontend/src/utils/taskSchedule.js:37`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `calendarRange` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 551 |
| `startOfDay` | Function | `frontend/src/utils/date.js` | 29 |
| `getTaskRange` | Function | `frontend/src/utils/taskSchedule.js` | 19 |
| `taskCoversDay` | Function | `frontend/src/utils/taskSchedule.js` | 30 |
| `taskOverlapsRange` | Function | `frontend/src/utils/taskSchedule.js` | 37 |
| `sortTasksByRange` | Function | `frontend/src/utils/taskSchedule.js` | 43 |
| `moveTaskRangeToDate` | Function | `frontend/src/utils/taskSchedule.js` | 63 |
| `resizeTaskStartToDate` | Function | `frontend/src/utils/taskSchedule.js` | 73 |
| `resizeTaskEndToDate` | Function | `frontend/src/utils/taskSchedule.js` | 84 |
| `getTaskDragDateUpdates` | Function | `frontend/src/utils/taskSchedule.js` | 95 |
| `baseTasks` | Function | `frontend/src/pages/DashboardPage.jsx` | 210 |
| `WeeklyReportPage` | Function | `frontend/src/pages/WeeklyReportPage.jsx` | 532 |
| `startOfCurrentWeek` | Function | `frontend/src/utils/date.js` | 41 |
| `formatDate` | Function | `frontend/src/utils/date.js` | 72 |
| `getCurrentWeekDays` | Function | `frontend/src/utils/date.js` | 144 |
| `isTaskOverdue` | Function | `frontend/src/utils/taskStats.js` | 34 |
| `getWeeklyChartData` | Function | `frontend/src/utils/taskStats.js` | 234 |
| `getWeeklyFocusChartData` | Function | `frontend/src/utils/taskStats.js` | 242 |
| `sumLogSeconds` | Function | `frontend/src/utils/taskStats.js` | 245 |
| `AppLayout` | Function | `frontend/src/components/AppLayout.jsx` | 46 |

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
| Components | 33 calls |
| Ui | 10 calls |
| GetTask | 7 calls |
| Services | 3 calls |

## How to Explore

1. `gitnexus_context({name: "calendarRange"})` — see callers and callees
2. `gitnexus_query({query: "pages"})` — find related execution flows
3. Read key files listed above for implementation details
