---
name: exception
description: "Skill for the Exception area of Personal-Management. 7 symbols across 1 files."
---

# Exception

7 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how handleValidation, handleMissingHeader, handleResponseStatus work
- Modifying exception-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | handleValidation, handleMissingHeader, handleResponseStatus, handleUnexpected, buildResponse (+2) |

## Entry Points

Start here when exploring this area:

- **`handleValidation`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java:19`
- **`handleMissingHeader`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java:30`
- **`handleResponseStatus`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java:36`
- **`handleUnexpected`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java:41`
- **`buildResponse`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java:46`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `handleValidation` | Method | `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | 19 |
| `handleMissingHeader` | Method | `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | 30 |
| `handleResponseStatus` | Method | `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | 36 |
| `handleUnexpected` | Method | `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | 41 |
| `buildResponse` | Method | `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | 46 |
| `reasonPhrase` | Method | `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | 62 |
| `requestPath` | Method | `backend/src/main/java/com/personalmanagement/backend/Exception/GlobalExceptionHandler.java` | 70 |

## How to Explore

1. `gitnexus_context({name: "handleValidation"})` — see callers and callees
2. `gitnexus_query({query: "exception"})` — find related execution flows
3. Read key files listed above for implementation details
