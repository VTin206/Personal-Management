import { addDays, getTaskDueDateTime } from '@/utils/date'
import { isActiveWorkTask } from '@/utils/taskStats'

const PRIORITY_SCORE = {
  high: 3,
  medium: 2,
  low: 1,
}

const IMPORTANT_DEADLINE_WINDOW_MS = 24 * 60 * 60 * 1000

export const EISENHOWER_QUADRANTS = [
  {
    key: 'do',
    title: 'Quan trọng và khẩn cấp',
    description: 'Cần xử lý ngay',
    tone: 'bg-peach text-rose-950',
  },
  {
    key: 'schedule',
    title: 'Quan trọng nhưng không khẩn cấp',
    description: 'Cần lên lịch làm đúng hạn',
    tone: 'bg-lavender text-violet-950',
  },
  {
    key: 'delegate',
    title: 'Khẩn cấp nhưng không quan trọng',
    description: 'Cần xử lý nhanh hoặc ủy quyền',
    tone: 'bg-butter text-amber-950',
  },
  {
    key: 'reduce',
    title: 'Không quan trọng và không khẩn cấp',
    description: 'Nên giảm bớt hoặc làm sau',
    tone: 'bg-sky text-sky-950',
  },
]

function normalizeNow(value) {
  return value instanceof Date ? value : new Date()
}

function getRemainingDeadlineMs(task, now = new Date()) {
  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return Number.POSITIVE_INFINITY

  return dueDateTime.getTime() - normalizeNow(now).getTime()
}

export function isImportantTask(task, now = new Date()) {
  if (task.priority === 'high') return true
  if (task.status === 'completed') return false

  return getRemainingDeadlineMs(task, now) <= IMPORTANT_DEADLINE_WINDOW_MS
}

export function isUrgentTask(task, now = new Date()) {
  if (task.status === 'completed') return false

  const currentTime = normalizeNow(now)

  const dueDateTime = getTaskDueDateTime(task)
  if (!dueDateTime) return false

  return dueDateTime.getTime() <= addDays(currentTime, 2).getTime()
}

export function getEisenhowerQuadrantKey(task, now = new Date()) {
  const currentTime = normalizeNow(now)
  const important = isImportantTask(task, currentTime)
  const urgent = isUrgentTask(task, currentTime)

  if (important && urgent) return 'do'
  if (important) return 'schedule'
  if (urgent) return 'delegate'
  return 'reduce'
}

export function groupTasksByEisenhower(tasks, now = new Date()) {
  const currentTime = normalizeNow(now)

  return tasks.reduce(
    (groups, task) => {
      if (!isActiveWorkTask(task, currentTime)) return groups

      groups[getEisenhowerQuadrantKey(task, currentTime)].push(task)
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

    const leftDueTime = getTaskDueDateTime(left)?.getTime() ?? Number.POSITIVE_INFINITY
    const rightDueTime = getTaskDueDateTime(right)?.getTime() ?? Number.POSITIVE_INFINITY
    if (leftDueTime !== rightDueTime) return leftDueTime - rightDueTime

    return (right.createdAt?.getTime?.() ?? 0) - (left.createdAt?.getTime?.() ?? 0)
  })
}
