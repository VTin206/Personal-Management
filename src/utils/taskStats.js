import {
  endOfCurrentWeek,
  formatDate,
  getCurrentWeekDays,
  isSameDay,
  startOfDay,
  toDate,
} from '@/utils/date'

export function isTaskOverdue(task) {
  if (task.status === 'completed') return false

  return isDueDateOverdue(task.dueDate)
}

export function isDueDateOverdue(dueDateValue) {
  const dueDate = toDate(dueDateValue)
  if (!dueDate) return false

  return dueDate.getTime() < startOfDay(new Date()).getTime()
}

export function canCompleteTask(task) {
  return !isDueDateOverdue(task.dueDate)
}

export function canCompleteTaskWithUpdates(task, updates) {
  const updatedTask = { ...task, ...updates }

  if (task.status === 'completed' && updatedTask.status === 'completed') {
    return true
  }

  return canCompleteTask(updatedTask)
}

export function isActiveWorkTask(task) {
  return task.status !== 'completed' && !isDueDateOverdue(task.dueDate)
}

export function isUpcomingTask(task) {
  if (!isActiveWorkTask(task)) return false

  const dueDate = toDate(task.dueDate)
  if (!dueDate) return false

  return dueDate.getTime() >= startOfDay(new Date()).getTime()
}

export function getDashboardStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'completed').length
  const inProgress = tasks.filter((task) => task.status === 'in-progress' && isActiveWorkTask(task)).length
  const overdue = tasks.filter(isTaskOverdue).length

  const weekEnd = endOfCurrentWeek()
  const dueByEndOfWeek = tasks.filter((task) => {
    const dueDate = toDate(task.dueDate)
    return dueDate && dueDate.getTime() <= weekEnd.getTime()
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
    created: tasks.filter((task) => isSameDay(task.createdAt, day)).length,
    completed: tasks.filter((task) => isSameDay(task.completedAt, day)).length,
    due: tasks.filter((task) => isSameDay(toDate(task.dueDate), day)).length,
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
    .sort((a, b) => toDate(a.dueDate).getTime() - toDate(b.dueDate).getTime())
    .slice(0, 5)
}
