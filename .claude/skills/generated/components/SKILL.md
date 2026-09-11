---
name: components
description: "Skill for the Components area of Personal-Management. 25 symbols across 12 files."
---

# Components

25 symbols | 12 files | Cohesion: 70%

## When to Use

- Working with code in `frontend/`
- Understanding how dismissAlert, openTasksPage, SettingsProvider work
- Modifying components-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/components/UrgentDeadlineAlert.jsx` | storeDismissedSignature, storeDeliveredReminderKeys, dismissAlert, openTasksPage, getNotificationPermission (+5) |
| `frontend/src/utils/date.js` | toDate, normalizeTimeValue, getDateTimeValue |
| `frontend/src/pages/DashboardPage.jsx` | storeUpdateNotesVersion, closeUpdateNotes |
| `frontend/src/pages/FocusTaskPage.jsx` | storeFocusThemeKey, selectTheme |
| `frontend/src/contexts/SettingsProvider.jsx` | SettingsProvider |
| `frontend/src/services/taskService.test.js` | setItem |
| `frontend/src/utils/settingsOptions.js` | getAccentOption |
| `frontend/src/hooks/useNow.js` | useNow |
| `frontend/src/hooks/useTasks.js` | useTasks |
| `frontend/src/pages/TasksPage.jsx` | TasksPage |

## Entry Points

Start here when exploring this area:

- **`dismissAlert`** (Function) — `frontend/src/components/UrgentDeadlineAlert.jsx:100`
- **`openTasksPage`** (Function) — `frontend/src/components/UrgentDeadlineAlert.jsx:112`
- **`SettingsProvider`** (Function) — `frontend/src/contexts/SettingsProvider.jsx:25`
- **`closeUpdateNotes`** (Function) — `frontend/src/pages/DashboardPage.jsx:310`
- **`selectTheme`** (Function) — `frontend/src/pages/FocusTaskPage.jsx:900`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `dismissAlert` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 100 |
| `openTasksPage` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 112 |
| `SettingsProvider` | Function | `frontend/src/contexts/SettingsProvider.jsx` | 25 |
| `closeUpdateNotes` | Function | `frontend/src/pages/DashboardPage.jsx` | 310 |
| `selectTheme` | Function | `frontend/src/pages/FocusTaskPage.jsx` | 900 |
| `getAccentOption` | Function | `frontend/src/utils/settingsOptions.js` | 47 |
| `UrgentDeadlineAlert` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 70 |
| `useNow` | Function | `frontend/src/hooks/useNow.js` | 2 |
| `useTasks` | Function | `frontend/src/hooks/useTasks.js` | 4 |
| `TasksPage` | Function | `frontend/src/pages/TasksPage.jsx` | 122 |
| `getTaskRemainingTimeLabel` | Function | `frontend/src/utils/taskStats.js` | 88 |
| `handleSubmit` | Function | `frontend/src/components/TaskForm.jsx` | 58 |
| `toDate` | Function | `frontend/src/utils/date.js` | 0 |
| `normalizeTimeValue` | Function | `frontend/src/utils/date.js` | 14 |
| `getDateTimeValue` | Function | `frontend/src/utils/date.js` | 83 |
| `signature` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 77 |
| `storeDismissedSignature` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 22 |
| `storeDeliveredReminderKeys` | Function | `frontend/src/components/UrgentDeadlineAlert.jsx` | 38 |
| `storeUpdateNotesVersion` | Function | `frontend/src/pages/DashboardPage.jsx` | 121 |
| `storeFocusThemeKey` | Function | `frontend/src/pages/FocusTaskPage.jsx` | 413 |

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
| Pages | 7 calls |

## How to Explore

1. `gitnexus_context({name: "dismissAlert"})` — see callers and callees
2. `gitnexus_query({query: "components"})` — find related execution flows
3. Read key files listed above for implementation details
