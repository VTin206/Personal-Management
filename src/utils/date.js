export function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value?.toDate === 'function') return value.toDate()

  if (typeof value === 'string') {
    const normalizedValue = value.includes('T') ? value : `${value}T00:00:00`
    const date = new Date(normalizedValue)
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

export function startOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

export function endOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(23, 59, 59, 999)
  return nextDate
}

export function startOfCurrentWeek(date = new Date()) {
  const weekStart = startOfDay(date)
  const day = weekStart.getDay()
  const diff = day === 0 ? -6 : 1 - day
  weekStart.setDate(weekStart.getDate() + diff)
  return weekStart
}

export function endOfCurrentWeek(date = new Date()) {
  const weekEnd = startOfCurrentWeek(date)
  weekEnd.setDate(weekEnd.getDate() + 6)
  return endOfDay(weekEnd)
}

export function addDays(date, days) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

export function isSameDay(left, right) {
  if (!left || !right) return false
  return startOfDay(left).getTime() === startOfDay(right).getTime()
}

export function isWithinRange(date, start, end) {
  if (!date) return false
  const time = date.getTime()
  return time >= start.getTime() && time <= end.getTime()
}

export function formatDate(value, options = {}) {
  const date = toDate(value)
  if (!date) return 'Chưa có'

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: options.short ? undefined : 'numeric',
  }).format(date)
}

export function getInputDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getCurrentWeekDays() {
  const start = startOfCurrentWeek()

  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}
