---
name: services
description: "Skill for the Services area of Personal-Management. 8 symbols across 3 files."
---

# Services

8 symbols | 3 files | Cohesion: 87%

## When to Use

- Working with code in `frontend/`
- Understanding how handleGoogleLogin, handleGoogleLogin, registerWithEmail work
- Modifying services-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/services/authService.js` | requireAuth, saveSessionLocally, registerWithEmail, loginWithEmail, loginWithGoogle (+1) |
| `frontend/src/pages/LoginPage.jsx` | handleGoogleLogin |
| `frontend/src/pages/RegisterPage.jsx` | handleGoogleLogin |

## Entry Points

Start here when exploring this area:

- **`handleGoogleLogin`** (Function) — `frontend/src/pages/LoginPage.jsx:55`
- **`handleGoogleLogin`** (Function) — `frontend/src/pages/RegisterPage.jsx:60`
- **`registerWithEmail`** (Function) — `frontend/src/services/authService.js:28`
- **`loginWithEmail`** (Function) — `frontend/src/services/authService.js:39`
- **`loginWithGoogle`** (Function) — `frontend/src/services/authService.js:45`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `handleGoogleLogin` | Function | `frontend/src/pages/LoginPage.jsx` | 55 |
| `handleGoogleLogin` | Function | `frontend/src/pages/RegisterPage.jsx` | 60 |
| `registerWithEmail` | Function | `frontend/src/services/authService.js` | 28 |
| `loginWithEmail` | Function | `frontend/src/services/authService.js` | 39 |
| `loginWithGoogle` | Function | `frontend/src/services/authService.js` | 45 |
| `logout` | Function | `frontend/src/services/authService.js` | 66 |
| `requireAuth` | Function | `frontend/src/services/authService.js` | 16 |
| `saveSessionLocally` | Function | `frontend/src/services/authService.js` | 24 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `HandleGoogleLogin → RequireAuth` | intra_community | 4 |
| `HandleGoogleLogin → RequireAuth` | intra_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Pages | 2 calls |

## How to Explore

1. `gitnexus_context({name: "handleGoogleLogin"})` — see callers and callees
2. `gitnexus_query({query: "services"})` — find related execution flows
3. Read key files listed above for implementation details
