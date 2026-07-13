import { collection, getDocs, query, where } from 'firebase/firestore'

import { auth, db } from '@/config/firebase'
import { toDate } from '@/utils/date'

const CONFIGURED_API_URL = import.meta.env.VITE_API_URL?.trim()
const API_BASE_URL = (CONFIGURED_API_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '')).replace(/\/$/, '')
const LEGACY_TASKS_COLLECTION = 'tasks'
const IMPORT_BATCH_SIZE = 100
const migrationPromises = new Map()

function requireApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('Thieu VITE_API_URL. Hay cau hinh URL backend truoc khi su dung task.')
  }

  return API_BASE_URL
}

function requireCurrentUser() {
  const currentUser = auth?.currentUser

  if (!currentUser) {
    throw new Error('Ban can dang nhap de quan ly task.')
  }

  return currentUser
}

function normalizeTask(task) {
  return {
    ...task,
    createdAt: toDate(task.createdAt),
    updatedAt: toDate(task.updatedAt),
    completedAt: toDate(task.completedAt),
    focusSeconds: Number.isFinite(task.focusSeconds) ? task.focusSeconds : 0,
    focusLog: task.focusLog && typeof task.focusLog === 'object' ? task.focusLog : {},
    shortBreakSeconds: Number.isFinite(task.shortBreakSeconds) ? task.shortBreakSeconds : 0,
    shortBreakLog: task.shortBreakLog && typeof task.shortBreakLog === 'object' ? task.shortBreakLog : {},
    longBreakSeconds: Number.isFinite(task.longBreakSeconds) ? task.longBreakSeconds : 0,
    longBreakLog: task.longBreakLog && typeof task.longBreakLog === 'object' ? task.longBreakLog : {},
  }
}

function toDateValue(value) {
  if (!value || typeof value === 'string') return value ?? null

  const date = toDate(value)
  if (!date) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toInstantValue(value) {
  return toDate(value)?.toISOString() ?? null
}

function toTaskPayload(task) {
  const payload = { ...task }
  delete payload.id
  delete payload.userId
  delete payload.createdAt
  delete payload.updatedAt
  delete payload.completedAt

  if (Object.hasOwn(payload, 'startDate')) payload.startDate = toDateValue(payload.startDate)
  if (Object.hasOwn(payload, 'dueDate')) payload.dueDate = toDateValue(payload.dueDate)

  return payload
}

function toImportPayload(documentSnapshot) {
  const task = documentSnapshot.data()
  return {
    legacyId: documentSnapshot.id,
    title: task.title,
    description: task.description ?? null,
    status: task.status ?? 'todo',
    priority: task.priority ?? 'medium',
    startDate: toDateValue(task.startDate ?? task.dueDate),
    startTime: task.startTime || null,
    dueDate: toDateValue(task.dueDate),
    dueTime: task.dueTime || null,
    focusSeconds: Number.isFinite(task.focusSeconds) ? task.focusSeconds : 0,
    focusLog: task.focusLog && typeof task.focusLog === 'object' ? task.focusLog : {},
    shortBreakSeconds: Number.isFinite(task.shortBreakSeconds) ? task.shortBreakSeconds : 0,
    shortBreakLog: task.shortBreakLog && typeof task.shortBreakLog === 'object' ? task.shortBreakLog : {},
    longBreakSeconds: Number.isFinite(task.longBreakSeconds) ? task.longBreakSeconds : 0,
    longBreakLog: task.longBreakLog && typeof task.longBreakLog === 'object' ? task.longBreakLog : {},
    createdAt: toInstantValue(task.createdAt),
    updatedAt: toInstantValue(task.updatedAt),
    completedAt: toInstantValue(task.completedAt),
  }
}

async function request(path, options = {}) {
  const token = await requireCurrentUser().getIdToken()
  const response = await fetch(`${requireApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const error = new Error(payload?.message ?? `Yeu cau that bai (${response.status}).`)
    error.status = response.status
    throw error
  }

  return payload
}

function migrationStorageKey(userId) {
  return `task-api-migration:${requireApiBaseUrl()}:${userId}`
}

function migrationCompleted(key) {
  try {
    return globalThis.localStorage?.getItem(key) === 'complete'
  } catch {
    return false
  }
}

function markMigrationCompleted(key) {
  try {
    globalThis.localStorage?.setItem(key, 'complete')
  } catch {
    // A successful server import remains idempotent when storage is unavailable.
  }
}

async function migrateLegacyTasks() {
  const currentUser = requireCurrentUser()
  const key = migrationStorageKey(currentUser.uid)
  if (!db || migrationCompleted(key)) return

  const snapshot = await getDocs(query(
    collection(db, LEGACY_TASKS_COLLECTION),
    where('userId', '==', currentUser.uid),
  ))
  const tasks = snapshot.docs.map(toImportPayload)

  for (let index = 0; index < tasks.length; index += IMPORT_BATCH_SIZE) {
    await request('/api/tasks/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks.slice(index, index + IMPORT_BATCH_SIZE)),
    })
  }

  markMigrationCompleted(key)
}

function ensureLegacyMigration() {
  const currentUser = requireCurrentUser()
  const key = migrationStorageKey(currentUser.uid)

  if (!migrationPromises.has(key)) {
    migrationPromises.set(key, migrateLegacyTasks().catch((error) => {
      migrationPromises.delete(key)
      throw error
    }))
  }

  return migrationPromises.get(key)
}

export async function getTasks() {
  await ensureLegacyMigration()
  const tasks = await request('/api/tasks')
  return tasks.map(normalizeTask)
}

export async function createTask(task) {
  const createdTask = await request('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toTaskPayload(task)),
  })

  return normalizeTask(createdTask)
}

export async function updateTask(taskId, updates) {
  const updatedTask = await request(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toTaskPayload(updates)),
  })

  return normalizeTask(updatedTask)
}

export function deleteTask(taskId) {
  return request(`/api/tasks/${taskId}`, { method: 'DELETE' })
}
