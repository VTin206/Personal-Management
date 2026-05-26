import { addDays, startOfDay, toDate } from '@/utils/date'
import { isActiveWorkTask } from '@/utils/taskStats'

const PRIORITY_SCORE = {
  high: 3,
  medium: 2,
  low: 1,
}

export const EISENHOWER_QUADRANTS = [
  {
    key: 'do',
    title: 'Làm ngay',
    description: 'Quan trọng và khẩn cấp',
    tone: 'bg-peach text-rose-950',
  },
  {
    key: 'schedule',
    title: 'Lên lịch',
    description: 'Quan trọng nhưng chưa khẩn cấp',
    tone: 'bg-lavender text-violet-950',
  },
  {
    key: 'delegate',
    title: 'Xử lý nhanh',
    description: 'Khẩn cấp nhưng ít quan trọng',
    tone: 'bg-butter text-amber-950',
  },
  {
    key: 'reduce',
    title: 'Giảm bớt',
    description: 'Chưa khẩn cấp và ít quan trọng',
    tone: 'bg-sky text-sky-950',
  },
]

export function isImportantTask(task) {
  return task.priority === 'high'
}

export function isUrgentTask(task) {
  if (!isActiveWorkTask(task)) return false

  const dueDate = toDate(task.dueDate)
  if (!dueDate) return false

  return dueDate.getTime() <= addDays(startOfDay(new Date()), 2).getTime()
}

export function getEisenhowerQuadrantKey(task) {
  const important = isImportantTask(task)
  const urgent = isUrgentTask(task)

  if (important && urgent) return 'do'
  if (important) return 'schedule'
  if (urgent) return 'delegate'
  return 'reduce'
}

export function groupTasksByEisenhower(tasks) {
  return tasks.reduce(
    (groups, task) => {
      if (!isActiveWorkTask(task)) return groups

      groups[getEisenhowerQuadrantKey(task)].push(task)
      return groups
    },
    {
      do: [],
      schedule: [],
      delegate: [],
      reduce: [],
    },
  )
}

export function sortTasksByPriorityAndDeadline(tasks) {
  return [...tasks].sort((left, right) => {
    const leftCompleted = left.status === 'completed' ? 1 : 0
    const rightCompleted = right.status === 'completed' ? 1 : 0
    if (leftCompleted !== rightCompleted) return leftCompleted - rightCompleted

    const leftPriority = PRIORITY_SCORE[left.priority] ?? 0
    const rightPriority = PRIORITY_SCORE[right.priority] ?? 0
    if (leftPriority !== rightPriority) return rightPriority - leftPriority

    const leftDueTime = toDate(left.dueDate)?.getTime() ?? Number.POSITIVE_INFINITY
    const rightDueTime = toDate(right.dueDate)?.getTime() ?? Number.POSITIVE_INFINITY
    if (leftDueTime !== rightDueTime) return leftDueTime - rightDueTime

    return (right.createdAt?.getTime?.() ?? 0) - (left.createdAt?.getTime?.() ?? 0)
  })
}
