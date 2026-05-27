import { CheckCircle2, Pencil, RotateCcw, Timer, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatTaskDateTimeRange } from '@/utils/date'
import { canCompleteTask, isActiveWorkTask, isTaskOverdue } from '@/utils/taskStats'
import {
  getPriorityLabel,
  getStatusLabel,
  PRIORITY_BADGE_VARIANTS,
  STATUS_BADGE_VARIANTS,
  TASK_STATUSES,
} from '@/utils/taskOptions'
import { cn } from '@/utils/cn'

export function TaskCard({ task, onEdit, onUpdate, onDelete, onFocus }) {
  const overdue = isTaskOverdue(task)
  const completed = task.status === 'completed'
  const completionBlocked = !completed && !canCompleteTask(task)
  const focusable = onFocus && isActiveWorkTask(task)

  function handleToggleComplete() {
    if (completionBlocked) return

    onUpdate(task.id, { status: completed ? 'in-progress' : 'completed' })
  }

  function handleStatusChange(value) {
    if (value === 'completed' && completionBlocked) return

    onUpdate(task.id, { status: value })
  }

  function handleDelete() {
    const confirmed = window.confirm(`Xóa task "${task.title}"?`)
    if (confirmed) onDelete(task.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(completed && 'border-mint bg-mint/35')}>
        <CardContent className="grid gap-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={cn('break-words text-base font-bold', completed && 'text-muted-foreground line-through')}>
                  {task.title}
                </h3>
                {overdue ? <Badge variant="danger">Trễ hạn</Badge> : null}
              </div>
              {task.description ? (
                <p className="break-words text-sm leading-6 text-muted-foreground">{task.description}</p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {focusable ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  title="Mở chế độ tập trung"
                  aria-label="Mở chế độ tập trung"
                  onClick={() => onFocus(task)}
                >
                  <Timer />
                  Tập trung
                </Button>
              ) : null}
              <Button
                type="button"
                variant={completed ? 'secondary' : 'outline'}
                size="icon"
                title={completionBlocked ? 'Task trễ hạn không thể hoàn thành' : completed ? 'Đánh dấu đang làm' : 'Đánh dấu hoàn thành'}
                aria-label={completionBlocked ? 'Task trễ hạn không thể hoàn thành' : completed ? 'Đánh dấu đang làm' : 'Đánh dấu hoàn thành'}
                onClick={handleToggleComplete}
                disabled={completionBlocked}
              >
                {completed ? <RotateCcw /> : <CheckCircle2 />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Sửa task"
                aria-label="Sửa task"
                onClick={() => onEdit(task)}
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Xóa task"
                aria-label="Xóa task"
                onClick={handleDelete}
              >
                <Trash2 />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Badge variant={STATUS_BADGE_VARIANTS[task.status]}>{getStatusLabel(task.status)}</Badge>
              <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]}>{getPriorityLabel(task.priority)}</Badge>
              <Badge variant={overdue ? 'danger' : 'outline'}>
                Từ {formatTaskDateTimeRange(task)}
              </Badge>
            </div>

            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger aria-label="Đổi trạng thái task">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    disabled={status.value === 'completed' && completionBlocked}
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
