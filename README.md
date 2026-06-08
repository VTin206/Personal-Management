# Personal Management

Personal task management app split into a frontend workspace and a backend workspace.

## Structure

```text
frontend/   React, Vite, Firebase client, TailwindCSS
backend/    Java Spring Boot API
.github/    CI workflow
```

Firebase project files stay at the repository root:

```text
firebase.json
firestore.rules
firestore.indexes.json
```

## Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

From the repository root:

```powershell
npm run dev:frontend
```

## Run Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

From the repository root:

```powershell
npm run dev:backend
```

The backend defaults to `http://localhost:8080`.

## GitNexus

GitNexus is configured for project structure and impact analysis.

```powershell
npm run gitnexus:status
npm run gitnexus:analyze
```

Run `npm run gitnexus:analyze` after meaningful source changes so `AGENTS.md`, `CLAUDE.md`, and `.claude/skills/` stay current. The generated local index is stored in `.gitnexus/` and is not committed.
