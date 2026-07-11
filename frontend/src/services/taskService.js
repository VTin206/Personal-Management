import { auth } from '@/config/firebase'
import { toDate } from '@/utils/date'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

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

async function request(path, options = {}) {
  const token = await requireCurrentUser().getIdToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
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

export async function getTasks() {
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
