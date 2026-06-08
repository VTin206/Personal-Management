---
name: contexts
description: "Skill for the Contexts area of Personal-Management. 7 symbols across 4 files."
---

# Contexts

7 symbols | 4 files | Cohesion: 86%

## When to Use

- Working with code in `frontend/`
- Understanding how AuthProvider, unsubscribe, updateUserProfile work
- Modifying contexts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/contexts/AuthProvider.jsx` | serializeUser, AuthProvider, unsubscribe, updateUserProfile |
| `frontend/src/services/authService.js` | updateUserProfile |
| `frontend/src/contexts/SettingsProvider.jsx` | SettingsProvider |
| `frontend/src/utils/settingsOptions.js` | getAccentOption |

## Entry Points

Start here when exploring this area:

- **`AuthProvider`** (Function) — `frontend/src/contexts/AuthProvider.jsx:25`
- **`unsubscribe`** (Function) — `frontend/src/contexts/AuthProvider.jsx:37`
- **`updateUserProfile`** (Function) — `frontend/src/contexts/AuthProvider.jsx:61`
- **`updateUserProfile`** (Function) — `frontend/src/services/authService.js:51`
- **`SettingsProvider`** (Function) — `frontend/src/contexts/SettingsProvider.jsx:25`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `AuthProvider` | Function | `frontend/src/contexts/AuthProvider.jsx` | 25 |
| `unsubscribe` | Function | `frontend/src/contexts/AuthProvider.jsx` | 37 |
| `updateUserProfile` | Function | `frontend/src/contexts/AuthProvider.jsx` | 61 |
| `updateUserProfile` | Function | `frontend/src/services/authService.js` | 51 |
| `SettingsProvider` | Function | `frontend/src/contexts/SettingsProvider.jsx` | 25 |
| `getAccentOption` | Function | `frontend/src/utils/settingsOptions.js` | 47 |
| `serializeUser` | Function | `frontend/src/contexts/AuthProvider.jsx` | 14 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Components | 1 calls |
| Services | 1 calls |

## How to Explore

1. `gitnexus_context({name: "AuthProvider"})` — see callers and callees
2. `gitnexus_query({query: "contexts"})` — find related execution flows
3. Read key files listed above for implementation details
