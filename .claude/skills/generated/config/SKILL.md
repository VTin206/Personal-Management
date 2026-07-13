---
name: config
description: "Skill for the Config area of Personal-Management. 7 symbols across 2 files."
---

# Config

7 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how jwtDecoder, firebaseTokenValidator work
- Modifying config-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/test/java/com/personalmanagement/backend/Config/SecurityConfigTest.java` | firebaseTokenValidator_shouldAcceptMatchingIssuerAndAudience, firebaseTokenValidator_shouldRejectWrongAudience, firebaseTokenValidator_shouldRejectWrongIssuer, firebaseTokenValidator_shouldRejectExpiredToken, token |
| `backend/src/main/java/com/personalmanagement/backend/Config/SecurityConfig.java` | jwtDecoder, firebaseTokenValidator |

## Entry Points

Start here when exploring this area:

- **`jwtDecoder`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Config/SecurityConfig.java:51`
- **`firebaseTokenValidator`** (Method) — `backend/src/main/java/com/personalmanagement/backend/Config/SecurityConfig.java:60`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `jwtDecoder` | Method | `backend/src/main/java/com/personalmanagement/backend/Config/SecurityConfig.java` | 51 |
| `firebaseTokenValidator` | Method | `backend/src/main/java/com/personalmanagement/backend/Config/SecurityConfig.java` | 60 |
| `firebaseTokenValidator_shouldAcceptMatchingIssuerAndAudience` | Method | `backend/src/test/java/com/personalmanagement/backend/Config/SecurityConfigTest.java` | 18 |
| `firebaseTokenValidator_shouldRejectWrongAudience` | Method | `backend/src/test/java/com/personalmanagement/backend/Config/SecurityConfigTest.java` | 24 |
| `firebaseTokenValidator_shouldRejectWrongIssuer` | Method | `backend/src/test/java/com/personalmanagement/backend/Config/SecurityConfigTest.java` | 30 |
| `firebaseTokenValidator_shouldRejectExpiredToken` | Method | `backend/src/test/java/com/personalmanagement/backend/Config/SecurityConfigTest.java` | 36 |
| `token` | Method | `backend/src/test/java/com/personalmanagement/backend/Config/SecurityConfigTest.java` | 42 |

## How to Explore

1. `gitnexus_context({name: "jwtDecoder"})` — see callers and callees
2. `gitnexus_query({query: "config"})` — find related execution flows
3. Read key files listed above for implementation details
