import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'

import { auth } from '@/config/firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

function requireAuth() {
  if (!auth) {
    throw new Error('Thiếu cấu hình Firebase. Hãy tạo file .env và điền Firebase config.')
  }

  return auth
}

export async function registerWithEmail({ email, password, displayName }) {
  const credential = await createUserWithEmailAndPassword(requireAuth(), email, password)

  if (displayName) {
    await updateProfile(credential.user, { displayName })
  }

  return credential.user
}

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(requireAuth(), email, password)
  return credential.user
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(requireAuth(), googleProvider)
  return credential.user
}

export async function updateUserProfile({ displayName, photoURL }) {
  const currentUser = requireAuth().currentUser

  if (!currentUser) {
    throw new Error('Bạn cần đăng nhập để cập nhật hồ sơ.')
  }

  await updateProfile(currentUser, {
    displayName: displayName?.trim() || null,
    photoURL: photoURL?.trim() || null,
  })

  return currentUser
}

export function logout() {
  return signOut(requireAuth())
}
