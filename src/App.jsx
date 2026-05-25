import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/AppLayout'
import { AuthRoute } from '@/components/AuthRoute'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { isFirebaseConfigured } from '@/config/firebase'
import { AuthProvider } from '@/contexts/AuthProvider'
import { SettingsProvider } from '@/contexts/SettingsProvider'
import { DashboardPage } from '@/pages/DashboardPage'
import { FirebaseSetupPage } from '@/pages/FirebaseSetupPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { WeeklyReportPage } from '@/pages/WeeklyReportPage'

function App() {
  if (!isFirebaseConfigured) {
    return <FirebaseSetupPage />
  }

  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="/tasks" element={<Navigate to="/" replace />} />
                <Route path="/weekly-report" element={<WeeklyReportPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}

export default App
