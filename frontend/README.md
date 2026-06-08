# Personal Management Frontend

React frontend built with Vite, Firebase Authentication, Cloud Firestore, TailwindCSS, shadcn-style UI, lucide-react, framer-motion, and Recharts.

## Run

```powershell
npm install
npm run dev
```

The dev server defaults to `http://localhost:5173`.

## Firebase

Create `.env` from `.env.example`, then fill in your Firebase web app config:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Firebase rules are kept at the repository root:

```text
../firebase.json
../firestore.rules
../firestore.indexes.json
```

Deploy Firestore rules from the repository root:

```powershell
npx firebase-tools deploy --only firestore:rules --project <your-firebase-project-id>
```

## Main Structure

```text
src/
  components/
  pages/
  services/
  hooks/
  contexts/
  config/
  utils/
```

## Deploy

If you use Vercel, set the project root directory to `frontend`.
