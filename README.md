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

## Connect Frontend To Backend

The task UI uses the Spring API and sends the Firebase ID token for each request. Configure `frontend/.env` with:

```text
VITE_API_URL=http://localhost:8080
```

For Vercel, set `VITE_API_URL` to the deployed backend URL, set the backend `FIREBASE_PROJECT_ID`, and allow the Vercel domain through `CORS_ALLOWED_ORIGIN_PATTERNS`.

On the first authenticated API load, existing Firestore task documents are imported to PostgreSQL in idempotent batches. Each legacy document ID is stored with the user so retries cannot create duplicate tasks.

## GitNexus

GitNexus is configured for project structure and impact analysis.

```powershell
npm run gitnexus:status
npm run gitnexus:analyze
```

Run `npm run gitnexus:analyze` after meaningful source changes so `AGENTS.md`, `CLAUDE.md`, and `.claude/skills/` stay current. The generated local index is stored in `.gitnexus/` and is not committed.

## CI/CD

GitHub Actions runs two independent CI jobs for this monorepo:

```text
Developer
   |
   v
Pull Request / push main
   |
   v
CI
|-- Frontend CI: npm ci, lint, tests, Vite build, dist artifact
`-- Backend CI: Maven Wrapper compile, tests, package, jar artifact
   |
   v
Deploy Production on successful push to main
```

The production workflow builds Docker images, tags them with the exact commit SHA, pushes them to GitHub Container Registry, copies `docker-compose.prod.yml` to the VPS, starts the services, and fails if the health endpoint is not reachable.

## Production Architecture

```text
Internet
   |
   v
Host reverse proxy with HTTPS
   |
   v
Frontend Nginx container
   |-- /          -> React/Vite static files
   |-- /api/      -> backend:8080/api/
   `-- /actuator/health -> backend:8080/actuator/health
          |
          v
   Spring Boot backend
          |
          v
   Supabase PostgreSQL
```

The frontend never connects to PostgreSQL. It sends a Firebase ID token to the backend, and the backend validates that JWT using Firebase public JWKs for the configured Firebase project.

## Required GitHub Secrets

Configure these under the GitHub Environment named `production`:

```text
VPS_HOST
VPS_PORT
VPS_USER
VPS_SSH_KEY
SUPABASE_DB_URL
SUPABASE_DB_USERNAME
SUPABASE_DB_PASSWORD
```

If GHCR packages are private, log in to GHCR once on the VPS with a token that has `read:packages`.

## Required GitHub Variables

Configure these under the `production` environment:

```text
VITE_API_URL
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
FIREBASE_PROJECT_ID
CORS_ALLOWED_ORIGIN_PATTERNS
```

Optional variables:

```text
VPS_APP_DIR=/opt/personal-management
HEALTHCHECK_URL=https://app.example.com/actuator/health
```

Firebase Web config values are client-side configuration, not Firebase Admin private credentials. Do not put Firebase Admin service account JSON or private keys in the frontend.

## Initial VPS Setup

Ubuntu example:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo nano /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh

sudo apt-get update
sudo apt-get install -y ca-certificates curl ufw
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker deploy

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

sudo mkdir -p /opt/personal-management
sudo chown -R deploy:deploy /opt/personal-management
```

If GHCR images are private:

```bash
echo "YOUR_GHCR_PAT_WITH_READ_PACKAGES" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

## Domain / HTTPS Configuration

Use a host-level reverse proxy with HTTPS. Caddy is the simplest option:

```bash
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update
sudo apt-get install -y caddy
```

Example `/etc/caddy/Caddyfile`:

```text
your-domain.example {
  reverse_proxy 127.0.0.1:3000
}
```

Then reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Add the production domain to Firebase Authentication authorized domains.

## Deploy

Production deploy runs automatically after CI succeeds on a push to `main`. You can also run `Deploy Production` manually and provide a commit SHA.

The workflow writes `/opt/personal-management/.env.production` from GitHub Secrets/Variables and uploads `docker-compose.prod.yml`, so the VPS does not need a source-code clone.

## Rollback

Images are tagged by commit SHA. To roll back manually on the VPS:

```bash
cd /opt/personal-management
cp .env.production .env.production.backup
sed -i 's|^FRONTEND_IMAGE=.*|FRONTEND_IMAGE=ghcr.io/OWNER/personal-management-frontend:PREVIOUS_SHA|' .env.production
sed -i 's|^BACKEND_IMAGE=.*|BACKEND_IMAGE=ghcr.io/OWNER/personal-management-backend:PREVIOUS_SHA|' .env.production
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
curl -fsS http://127.0.0.1:3000/actuator/health
```

Do not prune old production images until you are comfortable losing quick rollback targets.

## Health Check

The deployment checks Spring Boot Actuator:

```text
/actuator/health
```

Through the frontend Nginx container this is available at:

```text
http://127.0.0.1:3000/actuator/health
```

Set `HEALTHCHECK_URL` to the public HTTPS URL after reverse proxy setup, for example:

```text
https://app.example.com/actuator/health
```

## Database Migration Strategy

The backend currently has no Flyway or Liquibase migration system. Local/default config uses:

```text
spring.jpa.hibernate.ddl-auto=${JPA_DDL_AUTO:update}
```

For production, `application-prod.properties` defaults to:

```text
JPA_DDL_AUTO=validate
```

This avoids Hibernate silently mutating production schema, but it means the production schema must already match the JPA entities. Before production launch, add Flyway or Liquibase and convert the current `Task` schema into versioned SQL migrations.

## Firestore Legacy Migration

Legacy Firestore import is initiated by the frontend in `frontend/src/services/taskService.js` when an authenticated user first loads tasks. It calls `POST /api/tasks/import` in batches of 100. The backend import is idempotent per `user_id` and `legacy_id`.

CI/CD does not run Firestore import during deployment. If you need a one-time bulk migration, create a separate manual workflow or script with explicit approval and dry-run behavior.

## Test Procedure

Run local checks in this order:

```bash
cd frontend
npm ci
npm run lint -- --max-warnings=0
npm run test
npm run build
test -s dist/index.html
```

```bash
cd backend
chmod +x mvnw
SPRING_PROFILES_ACTIVE=ci ./mvnw -B -ntp compile
SPRING_PROFILES_ACTIVE=ci ./mvnw -B -ntp test
SPRING_PROFILES_ACTIVE=ci ./mvnw -B -ntp package -DskipTests
test -n "$(find target -maxdepth 1 -name '*.jar' -print -quit)"
```

Build containers:

```bash
docker build -t personal-management-backend:test backend
docker build -t personal-management-frontend:test \
  --build-arg VITE_API_URL=https://your-domain.example \
  --build-arg VITE_FIREBASE_API_KEY=your_api_key \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com \
  --build-arg VITE_FIREBASE_PROJECT_ID=personal-management-50914 \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  --build-arg VITE_FIREBASE_APP_ID=your_app_id \
  frontend
```

Simulate compose locally with non-production credentials in `.env.production`:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl -fsS http://127.0.0.1:3000/actuator/health
curl -fsS http://127.0.0.1:3000/
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

Then test in GitHub:

1. Open a pull request to `main` and confirm frontend/backend CI jobs pass.
2. Push to `main` and confirm GHCR images are created with the commit SHA tag.
3. Deploy to a staging VPS or disposable VPS first.
4. Promote the same configuration pattern to production.

Do not production-deploy before local container tests pass.

## Troubleshooting

On the VPS:

```bash
cd /opt/personal-management
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200
curl -fsS http://127.0.0.1:3000/actuator/health
```

If authentication fails, verify `FIREBASE_PROJECT_ID` matches the Firebase project that issued the frontend ID token. Also add the production domain to Firebase Authentication authorized domains.

If database health fails, verify the Supabase JDBC URL includes SSL when required, that the VPS can reach the Supabase host/port over IPv4, and that the database schema already exists. Production uses `JPA_DDL_AUTO=validate` by default, so it will not create or mutate schema automatically.
