import { useCallback, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import { auth, isFirebaseConfigured } from '@/config/firebase'
import {
  loginWithEmail,
  loginWithGoogle,
  logout,
  registerWithEmail,
  updateUserProfile as updateUserProfileService,
} from '@/services/authService'
import { AuthContext } from './auth-context'

function serializeUser(user) {
  if (!user) return null

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(serializeUser(currentUser))
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const updateUserProfile = useCallback(async (payload) => {
    const updatedUser = await updateUserProfileService(payload)
    setUser(serializeUser(updatedUser))
    return updatedUser
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: loginWithEmail,
      loginWithGoogle,
      register: registerWithEmail,
      updateUserProfile,
      logout,
    }),
    [loading, updateUserProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
