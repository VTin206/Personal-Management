import {
  endOfCurrentWeek,
  formatDate,
  getCurrentWeekDays,
  getTaskDueDateTime,
  isSameDay,
} from '@/utils/date'

const URGENT_DEADLINE_WINDOW_MS = 24 * 60 * 60 * 1000

export function isTaskOverdue(task) {
  if (task.status === 'completed') return false

  return isDueDateOverdue(task.dueDate, task.dueTime)
}

export function isDueDateOverdue(dueDateValue, dueTimeValue) {
  const dueDateTime = getTaskDueDateTime({ dueDate: dueDateValue, dueTime: dueTimeValue })
  if (!dueDateTime) return false

  return dueDateTime.getTime() < Date.now()
}

export function canCompleteTask(task) {
  return !isDueDateOverdue(task.dueDate, task.dueTime)
}

export function canCompleteTaskWithUpdates(task, updates) {
  const updatedTask = { ...task, ...updates }

  if (task.status === 'completed' && updatedTask.status === 'completed') {
    return true
  }

  return canCompleteTask(updatedTask)
}

export function isActiveWorkTask(task) {
  return task.status !== 'completed' && !isDueDateOverdue(task.dueDate, task.dueTime)
}

export function isUpcomingTask(task) {
  if (!isActiveWorkTask(task)) return false

  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return false

  return dueDateTime.getTime() >= Date.now()
}

export function isTaskDueWithin24Hours(task, now = new Date()) {
  if (!isActiveWorkTask(task)) return false

  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return false

  const remainingMs = dueDateTime.getTime() - now.getTime()
  return remainingMs >= 0 && remainingMs <= URGENT_DEADLINE_WINDOW_MS
}

export function getTaskRemainingTimeLabel(task, now = new Date()) {
  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return 'Chưa có hạn'

  const remainingMinutes = Math.max(0, Math.ceil((dueDateTime.getTime() - now.getTime()) / 60000))
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
