export const TASK_STATUSES = [
  { value: 'todo', label: 'Chưa bắt đầu' },
  { value: 'in-progress', label: 'Đang làm' },
  { value: 'completed', label: 'Hoàn thành' },
]

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Nhẹ nhàng' },
  { value: 'medium', label: 'Vừa phải' },
  { value: 'high', label: 'Quan trọng' },
]

export const STATUS_BADGE_VARIANTS = {
  todo: 'info',
  'in-progress': 'warning',
  completed: 'success',
}

export const PRIORITY_BADGE_VARIANTS = {
  low: 'secondary',
  medium: 'warning',
  high: 'danger',
}

export function getStatusLabel(value) {
  return TASK_STATUSES.find((status) => status.value === value)?.label ?? value
}

export function getPriorityLabel(value) {
  return TASK_PRIORITIES.find((priority) => priority.value === value)?.label ?? value
}
