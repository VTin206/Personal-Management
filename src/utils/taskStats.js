import {
  endOfCurrentWeek,
  formatDate,
  getCurrentWeekDays,
  getInputDateValue,
  getTaskDueDateTime,
  isSameDay,
} from '@/utils/date'

const URGENT_DEADLINE_WINDOW_MS = 24 * 60 * 60 * 1000
const DEADLINE_REMINDER_MILESTONES = [
  { hours: 1, label: '1 giờ', thresholdMs: 60 * 60 * 1000 },
  { hours: 6, label: '6 giờ', thresholdMs: 6 * 60 * 60 * 1000 },
  { hours: 24, label: '24 giờ', thresholdMs: 24 * 60 * 60 * 1000 },
]

function normalizeNow(value) {
  return value instanceof Date ? value : new Date()
}

export function isTaskOverdue(task, now = new Date()) {
  if (task.status === 'completed') return false

  return isDueDateOverdue(task.dueDate, task.dueTime, now)
}

export function isDueDateOverdue(dueDateValue, dueTimeValue, now = new Date()) {
  const dueDateTime = getTaskDueDateTime({ dueDate: dueDateValue, dueTime: dueTimeValue })
  if (!dueDateTime) return false

  return dueDateTime.getTime() < normalizeNow(now).getTime()
}

export function canCompleteTask(task, now = new Date()) {
  return !isDueDateOverdue(task.dueDate, task.dueTime, now)
}

export function canCompleteTaskWithUpdates(task, updates) {
  const updatedTask = { ...task, ...updates }

  if (task.status === 'completed' && updatedTask.status === 'completed') {
    return true
  }

  return canCompleteTask(updatedTask)
}

export function isActiveWorkTask(task, now = new Date()) {
  return task.status !== 'completed' && !isDueDateOverdue(task.dueDate, task.dueTime, now)
}

export function isUpcomingTask(task, now = new Date()) {
  const currentTime = normalizeNow(now)

  if (!isActiveWorkTask(task, currentTime)) return false

  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return false

  return dueDateTime.getTime() >= currentTime.getTime()
}

export function isTaskDueWithin24Hours(task, now = new Date()) {
  const currentTime = normalizeNow(now)

  if (!isActiveWorkTask(task, currentTime)) return false

  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return false

  const remainingMs = dueDateTime.getTime() - currentTime.getTime()
  return remainingMs >= 0 && remainingMs <= URGENT_DEADLINE_WINDOW_MS
}

export function getTaskRemainingTimeLabel(task, now = new Date()) {
  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return 'Chưa có hạn'

  const remainingMinutes = Math.max(0, Math.ceil((dueDateTime.getTime() - normalizeNow(now).getTime()) / 60000))
  const hours = Math.floor(remainingMinutes / 60)
  const minutes = remainingMinutes % 60

  if (hours <= 0) return `${minutes} phút nữa`
  if (minutes === 0) return `${hours} giờ nữa`
  return `${hours} giờ ${minutes} phút nữa`
}

export function getUrgentDeadlineTasks(tasks, now = new Date()) {
  return tasks
    .filter((task) => isTaskDueWithin24Hours(task, now))
    .sort((a, b) => getTaskDueDateTime(a).getTime() - getTaskDueDateTime(b).getTime())
}

export function getDeadlineReminderTasks(tasks, now = new Date()) {
  const currentTime = normalizeNow(now)

  return tasks
    .map((task) => {
      if (!isActiveWorkTask(task, currentTime)) return null

      const dueDateTime = getTaskDueDateTime(task)
      if (!dueDateTime) return null

      const remainingMs = dueDateTime.getTime() - currentTime.getTime()
      const milestone = DEADLINE_REMINDER_MILESTONES.find((item) => remainingMs >= 0 && remainingMs <= item.thresholdMs)
      if (!milestone) return null

      return {
        task,
        milestone,
        remainingMs,
      }
    })
    .filter(Boolean)
    .sort((left, right) => left.remainingMs - right.remainingMs)
}

export function getTaskFocusSeconds(task) {
  const focusSeconds = Number(task?.focusSeconds)

  return Number.isFinite(focusSeconds) && focusSeconds > 0 ? Math.floor(focusSeconds) : 0
}

export function getTaskFocusLog(task) {
  return task?.focusLog && typeof task.focusLog === 'object' ? task.focusLog : {}
}

export function formatFocusDuration(totalSeconds) {
  const normalizedSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const hours = Math.floor(normalizedSeconds / 3600)
  const minutes = Math.floor((normalizedSeconds % 3600) / 60)

  if (hours <= 0) return `${minutes} phút`
  if (minutes === 0) return `${hours} giờ`
  return `${hours} giờ ${minutes} phút`
}

export function buildFocusTimeUpdates(task, elapsedSeconds, now = new Date()) {
  const normalizedElapsedSeconds = Math.max(0, Math.floor(Number(elapsedSeconds) || 0))
  if (normalizedElapsedSeconds <= 0) return null

  const dateKey = getInputDateValue(normalizeNow(now))
  const currentLog = getTaskFocusLog(task)
  const nextLog = {
    ...currentLog,
    [dateKey]: Math.max(0, Math.floor(Number(currentLog[dateKey]) || 0)) + normalizedElapsedSeconds,
  }

  return {
    focusSeconds: getTaskFocusSeconds(task) + normalizedElapsedSeconds,
    focusLog: nextLog,
  }
}

export function getDashboardStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'completed').length
  const inProgress = tasks.filter((task) => task.status === 'in-progress' && isActiveWorkTask(task)).length
  const overdue = tasks.filter(isTaskOverdue).length

  const weekEnd = endOfCurrentWeek()
  const dueByEndOfWeek = tasks.filter((task) => {
    const dueDateTime = getTaskDueDateTime(task)
    return dueDateTime && dueDateTime.getTime() <= weekEnd.getTime()
  })
  const completedDueByEndOfWeek = dueByEndOfWeek.filter((task) => task.status === 'completed').length
  const weeklyCompletionRate =
    dueByEndOfWeek.length === 0 ? 0 : Math.round((completedDueByEndOfWeek / dueByEndOfWeek.length) * 100)

  return {
    total,
    completed,
    inProgress,
    overdue,
    weeklyCompletionRate,
    weeklyBasis: dueByEndOfWeek.length,
  }
}

export function getWeeklyChartData(tasks) {
  return getCurrentWeekDays().map((day) => ({
    day: formatDate(day, { short: true }),
    completed: tasks.filter((task) => isSameDay(task.completedAt, day)).length,
    overdue: tasks.filter((task) => isTaskOverdue(task) && isSameDay(getTaskDueDateTime(task), day)).length,
  }))
}

export function getWeeklyFocusChartData(tasks) {
  return getCurrentWeekDays().map((day) => {
    const dateKey = getInputDateValue(day)
    const focusSeconds = tasks.reduce((total, task) => {
      const logValue = Number(getTaskFocusLog(task)[dateKey])
      return total + (Number.isFinite(logValue) && logValue > 0 ? logValue : 0)
    }, 0)

    return {
      day: formatDate(day, { short: true }),
      hours: Number((focusSeconds / 3600).toFixed(2)),
      focusSeconds,
    }
  })
}

export function getStatusChartData(tasks) {
  const statuses = [
    { status: 'Chưa bắt đầu', value: 0, fill: '#bfe8ff' },
    { status: 'Đang làm', value: 0, fill: '#fff1a8' },
    { status: 'Hoàn thành', value: 0, fill: '#c6f6dd' },
  ]

  tasks.forEach((task) => {
    if (task.status === 'todo') statuses[0].value += 1
    if (task.status === 'in-progress') statuses[1].value += 1
    if (task.status === 'completed') statuses[2].value += 1
  })

  return statuses
}

export function getUpcomingTasks(tasks) {
  return tasks
    .filter(isUpcomingTask)
    .sort((a, b) => getTaskDueDateTime(a).getTime() - getTaskDueDateTime(b).getTime())
    .slice(0, 5)
}
