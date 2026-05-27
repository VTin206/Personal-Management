import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db } from '@/config/firebase'
import { addDays, getInputDateValue } from '@/utils/date'

const USER_STATS_COLLECTION = 'userStats'

function requireDb() {
  if (!db) {
    throw new Error('Thiếu cấu hình Firebase. Hãy tạo file .env và điền Firebase config.')
  }

  return db
}

function getNumericStreak(value) {
  return Number.isInteger(value) && value > 0 ? value : 0
}

export async function recordLoginStreak(userId) {
  const today = new Date()
  const todayKey = getInputDateValue(today)
  const yesterdayKey = getInputDateValue(addDays(today, -1))
  const statsRef = doc(requireDb(), USER_STATS_COLLECTION, userId)
  const snapshot = await getDoc(statsRef)
  const stats = snapshot.exists() ? snapshot.data() : {}
  const currentStreak = getNumericStreak(stats.currentStreak)
  const longestStreak = getNumericStreak(stats.longestStreak)
  let nextCurrentStreak = 1

  if (stats.lastLoginDate === todayKey) {
    nextCurrentStreak = Math.max(currentStreak, 1)
  } else if (stats.lastLoginDate === yesterdayKey) {
    nextCurrentStreak = currentStreak + 1
  }

  const nextStats = {
    userId,
    currentStreak: nextCurrentStreak,
    longestStreak: Math.max(longestStreak, nextCurrentStreak),
    lastLoginDate: todayKey,
    updatedAt: serverTimestamp(),
  }

  await setDoc(statsRef, nextStats, { merge: true })

  return {
    currentStreak: nextStats.currentStreak,
    longestStreak: nextStats.longestStreak,
    lastLoginDate: nextStats.lastLoginDate,
  }
}
