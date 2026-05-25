# Pastel Tasks

Website quản lý công việc cá nhân bằng React, Vite, Firebase Authentication, Cloud Firestore, TailwindCSS, shadcn-style UI, lucide-react, framer-motion và Recharts.

## Chạy project

```bash
npm install
npm run dev
```

## Firebase

Tạo file `.env` từ `.env.example`, rồi điền cấu hình Firebase web app:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Trong Firebase Console:

- Bật Authentication bằng Email/Password.
- Tạo Cloud Firestore database.
- Dùng nội dung `firestore.rules` để đảm bảo user chỉ đọc/ghi task của chính mình.

## Cấu trúc chính

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
