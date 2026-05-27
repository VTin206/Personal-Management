import { useState } from 'react'
import { CalendarDays, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { addDays, getInputDateValue, toDate } from '@/utils/date'
import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/taskOptions'

function createDefaultTask() {
  const today = new Date()

  return {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    startDate: getInputDateValue(today),
    dueDate: getInputDateValue(addDays(today, 1)),
  }
}

function createFormState(initialTask) {
  if (!initialTask) return createDefaultTask()

  const fallbackStartDate = toDate(initialTask.createdAt) ?? toDate(initialTask.dueDate) ?? new Date()

  return {
    title: initialTask.title ?? '',
    description: initialTask.description ?? '',
    status: initialTask.status ?? 'todo',
    priority: initialTask.priority ?? 'medium',
    startDate: initialTask.startDate ?? getInputDateValue(fallbackStartDate),
    dueDate: initialTask.dueDate ?? getInputDateValue(addDays(new Date(), 1)),
  }
}

export function TaskForm({ initialTask, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(() => createFormState(initialTask))
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Tiêu đề không được bỏ trống.')
      return
    }

    const startDate = toDate(form.startDate)
    const dueDate = toDate(form.dueDate)

    if (!startDate || !dueDate) {
      setError('Ngày bắt đầu và ngày hạn không hợp lệ.')
      return
    }

    if (startDate.getTime() > dueDate.getTime()) {
      setError('Ngày bắt đầu không được sau ngày hạn.')
      return
    }

    const submitted = await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    })

    if (submitted === false) return

    if (!initialTask) {
      setForm(createDefaultTask())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialTask ? 'Cập nhật task' : 'Task mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="task-title">Tiêu đề</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Ví dụ: Hoàn thành báo cáo"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Mô tả</Label>
            <Textarea
              id="task-description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Ghi chú ngắn cho task"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="task-status">Trạng thái</Label>
              <Select value={form.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger id="task-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-priority">Ưu tiên</Label>
              <Select value={form.priority} onValueChange={(value) => updateField('priority', value)}>
                <SelectTrigger id="task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-start-date">Ngày bắt đầu</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="task-start-date"
                  type="date"
                  className="pl-9"
                  value={form.startDate}
                  onChange={(event) => updateField('startDate', event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-due-date">Ngày hạn</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="task-due-date"
                  type="date"
                  className="pl-9"
                  value={form.dueDate}
                  onChange={(event) => updateField('dueDate', event.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {initialTask ? (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X />
                Hủy
              </Button>
            ) : null}
            <Button type="submit" disabled={submitting}>
              <Save />
              {initialTask ? 'Lưu task' : 'Thêm task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
