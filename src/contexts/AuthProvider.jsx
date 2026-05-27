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
import { recordLoginStreak } from '@/services/streakService'
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
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined
    }

    let active = true

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(serializeUser(currentUser))
      setLoading(false)

      if (!currentUser) {
        setStreak(null)
        return
      }

      recordLoginStreak(currentUser.uid)
        .then((nextStreak) => {
          if (active) setStreak(nextStreak)
        })
        .catch(() => {
          if (active) setStreak(null)
        })
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const updateUserProfile = useCallback(async (payload) => {
    const updatedUser = await updateUserProfileService(payload)
    setUser(serializeUser(updatedUser))
    return updatedUser
  }, [])

  const value = useMemo(
    () => ({
      user,
      streak,
      loading,
      isAuthenticated: Boolean(user),
      login: loginWithEmail,
      loginWithGoogle,
      register: registerWithEmail,
      updateUserProfile,
      logout,
    }),
    [loading, streak, updateUserProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
