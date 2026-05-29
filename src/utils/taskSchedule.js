import {
  addDays,
  endOfCurrentWeek,
  endOfDay,
  getInputDateValue,
  getTaskDueDateTime,
  getTaskStartDateTime,
  startOfDay,
  toDate,
} from '@/utils/date'

const DAY_MS = 24 * 60 * 60 * 1000

export const QUICK_EXTEND_OPTIONS = [
  { key: 'one-day', label: '+1 ngày', days: 1 },
  { key: 'three-days', label: '+3 ngày', days: 3 },
  { key: 'weekend', label: 'Cuối tuần' },
]

export function getTaskRange(task) {
  const start = startOfDay(getTaskStartDateTime(task) ?? toDate(task.createdAt) ?? getTaskDueDateTime(task) ?? new Date())
  const end = startOfDay(getTaskDueDateTime(task) ?? start)

  if (start.getTime() <= end.getTime()) {
    return { start, end }
  }

  return { start: end, end: start }
}

export function taskCoversDay(task, day) {
  const range = getTaskRange(task)
  const selectedDay = startOfDay(day)

  return range.start.getTime() <= selectedDay.getTime() && range.end.getTime() >= selectedDay.getTime()
}

export function taskOverlapsRange(task, rangeStart, rangeEnd) {
  const range = getTaskRange(task)

  return range.start.getTime() <= rangeEnd.getTime() && range.end.getTime() >= rangeStart.getTime()
}

export function sortTasksByRange(tasks) {
  return [...tasks].sort((left, right) => {
    const leftRange = getTaskRange(left)
    const rightRange = getTaskRange(right)

    return leftRange.start.getTime() - rightRange.start.getTime()
      || leftRange.end.getTime() - rightRange.end.getTime()
  })
}

function getRangeDurationDays(task) {
  const range = getTaskRange(task)

  return Math.max(0, Math.round((range.end.getTime() - range.start.getTime()) / DAY_MS))
}

function getDateUpdateValue(date) {
  return getInputDateValue(startOfDay(date))
}

export function moveTaskRangeToDate(task, targetDate) {
  const nextStart = startOfDay(targetDate)
  const nextEnd = addDays(nextStart, getRangeDurationDays(task))

  return {
    startDate: getDateUpdateValue(nextStart),
    dueDate: getDateUpdateValue(nextEnd),
  }
}

export function resizeTaskStartToDate(task, targetDate) {
  const range = getTaskRange(task)
  const nextStart = startOfDay(targetDate)
  const nextEnd = nextStart.getTime() > range.end.getTime() ? nextStart : range.end

  return {
    startDate: getDateUpdateValue(nextStart),
    dueDate: getDateUpdateValue(nextEnd),
  }
}

export function resizeTaskEndToDate(task, targetDate) {
  const range = getTaskRange(task)
  const nextEnd = startOfDay(targetDate)
  const nextStart = nextEnd.getTime() < range.start.getTime() ? nextEnd : range.start

  return {
    startDate: getDateUpdateValue(nextStart),
    dueDate: getDateUpdateValue(nextEnd),
  }
}

export function getTaskDragDateUpdates(task, mode, targetDate) {
  if (mode === 'start') return resizeTaskStartToDate(task, targetDate)
  if (mode === 'end') return resizeTaskEndToDate(task, targetDate)

  return moveTaskRangeToDate(task, targetDate)
}

export function getQuickExtendTaskUpdates(task, optionKey, now = new Date()) {
  const option = QUICK_EXTEND_OPTIONS.find((item) => item.key === optionKey) ?? QUICK_EXTEND_OPTIONS[0]
  const nextDueDate = option.key === 'weekend'
    ? endOfCurrentWeek(now)
    : endOfDay(addDays(startOfDay(now), option.days))
  const range = getTaskRange(task)
  const updates = {
    dueDate: getInputDateValue(nextDueDate),
    dueTime: '23:59',
  }

  if (range.start.getTime() > startOfDay(nextDueDate).getTime()) {
    updates.startDate = updates.dueDate
  }

  return updates
}
