import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '@/config/firebase'
import { toDate } from '@/utils/date'

const TASKS_COLLECTION = 'tasks'

function requireDb() {
  if (!db) {
    throw new Error('Thiếu cấu hình Firebase. Hãy tạo file .env và điền Firebase config.')
  }

  return db
}

function normalizeTask(documentSnapshot) {
  const data = documentSnapshot.data()

  return {
    id: documentSnapshot.id,
    ...data,
    createdAt: toDate(data.createdAt),
    completedAt: toDate(data.completedAt),
  }
}

function sortByNewestCreatedAt(tasks) {
  return [...tasks].sort((a, b) => {
    const left = a.createdAt?.getTime?.() ?? 0
    const right = b.createdAt?.getTime?.() ?? 0
    return right - left
  })
}

export function listenToUserTasks(userId, onNext, onError) {
  const tasksQuery = query(
    collection(requireDb(), TASKS_COLLECTION),
    where('userId', '==', userId),
  )

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map(normalizeTask)
      onNext(sortByNewestCreatedAt(tasks))
    },
    onError,
  )
}

export function createTask(userId, task) {
  const completedAt = task.status === 'completed' ? serverTimestamp() : null

  return addDoc(collection(requireDb(), TASKS_COLLECTION), {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate ?? task.dueDate,
    dueDate: task.dueDate,
    createdAt: serverTimestamp(),
    completedAt,
    userId,
  })
}

export function updateTask(taskId, updates) {
  const payload = { ...updates }

  if (Object.hasOwn(payload, 'status')) {
    payload.completedAt = payload.status === 'completed' ? serverTimestamp() : null
  }

  return updateDoc(doc(requireDb(), TASKS_COLLECTION, taskId), payload)
}

export function deleteTask(taskId) {
  return deleteDoc(doc(requireDb(), TASKS_COLLECTION, taskId))
}
