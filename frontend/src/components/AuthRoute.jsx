import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components/LoadingScreen'
import { useAuth } from '@/hooks/useAuth'

export function AuthRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
