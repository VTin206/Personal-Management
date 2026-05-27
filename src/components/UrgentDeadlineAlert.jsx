import { useMemo, useState } from 'react'
import { AlertTriangle, ListChecks, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/useTasks'
import { formatTaskDueDateTime } from '@/utils/date'
import { getTaskRemainingTimeLabel, getUrgentDeadlineTasks } from '@/utils/taskStats'

const DISMISSED_SIGNATURE_KEY = 'pastel-urgent-deadline-alert-dismissed'

function getDismissedSignature() {
  try {
    return window.sessionStorage.getItem(DISMISSED_SIGNATURE_KEY) ?? ''
  } catch {
    return ''
  }
}

function storeDismissedSignature(signature) {
  try {
    window.sessionStorage.setItem(DISMISSED_SIGNATURE_KEY, signature)
  } catch {
    // Session storage can be unavailable in some private browsing contexts.
  }
}

function createAlertSignature(tasks) {
  return tasks.map((task) => `${task.id}:${task.dueDate}:${task.dueTime ?? ''}`).join('|')
}

export function UrgentDeadlineAlert() {
  const navigate = useNavigate()
  const { tasks, loading } = useTasks()
  const [dismissedSignature, setDismissedSignature] = useState(() => getDismissedSignature())
  const now = useMemo(() => new Date(), [])
  const urgentTasks = useMemo(() => getUrgentDeadlineTasks(tasks, now), [now, tasks])
  const signature = useMemo(() => createAlertSignature(urgentTasks), [urgentTasks])
  const visible = !loading && urgentTasks.length > 0 && dismissedSignature !== signature

  function dismissAlert() {
    storeDismissedSignature(signature)
    setDismissedSignature(signature)
  }

  function openTasksPage() {
    dismissAlert()
    navigate('/tasks')
  }

  if (!visible) return null

  return (
    <section
      aria-live="assertive"
      role="alert"
      className="fixed inset-x-3 top-20 z-50 mx-auto max-w-xl rounded-lg border border-destructive/35 bg-card p-4 text-card-foreground shadow-soft"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-peach text-rose-950">
          <AlertTriangle className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-black uppercase text-destructive">Task sắp đến hạn</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {urgentTasks.length} task còn dưới 24 giờ trước deadline.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Đóng cảnh báo"
              title="Đóng cảnh báo"
              onClick={dismissAlert}
            >
              <X />
            </Button>
          </div>

          <ul className="mt-3 grid gap-2">
            {urgentTasks.slice(0, 3).map((task) => (
              <li className="rounded-lg border bg-card-soft px-3 py-2" key={task.id}>
                <p className="truncate text-sm font-bold">{task.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-destructive">
                  {getTaskRemainingTimeLabel(task, now)} · Hạn {formatTaskDueDateTime(task)}
                </p>
              </li>
            ))}
          </ul>

          {urgentTasks.length > 3 ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">+{urgentTasks.length - 3} task khác</p>
          ) : null}

          <Button type="button" variant="destructive" className="mt-3 w-full sm:w-auto" onClick={openTasksPage}>
            <ListChecks />
            Xem công việc
          </Button>
        </div>
      </div>
    </section>
  )
}
