import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Bell, ListChecks, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNow } from '@/hooks/useNow'
import { useTasks } from '@/hooks/useTasks'
import { formatTaskDueDateTime } from '@/utils/date'
import { getDeadlineReminderTasks, getTaskRemainingTimeLabel } from '@/utils/taskStats'

const DISMISSED_SIGNATURE_KEY = 'pastel-urgent-deadline-alert-dismissed'
const DELIVERED_REMINDERS_KEY = 'pastel-deadline-reminders-delivered'

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

function getDeliveredReminderKeys() {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(DELIVERED_REMINDERS_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function storeDeliveredReminderKeys(keys) {
  try {
    window.localStorage.setItem(DELIVERED_REMINDERS_KEY, JSON.stringify([...keys].slice(-500)))
  } catch {
    // Local storage can be blocked; visual reminders still work.
  }
}

function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return window.Notification.permission
}

function getReminderKey(reminder) {
  return `${reminder.task.id}:${reminder.task.dueDate}:${reminder.task.dueTime ?? ''}:${reminder.milestone.hours}`
}

function createAlertSignature(reminders) {
  return reminders.map(getReminderKey).join('|')
}

function notifyReminder(reminder, now) {
  const title = `Task còn dưới ${reminder.milestone.label}`
  const body = `${reminder.task.title} - Hạn ${formatTaskDueDateTime(reminder.task)} (${getTaskRemainingTimeLabel(reminder.task, now)})`

  try {
    new window.Notification(title, { body })
  } catch {
    // Some browsers reject notifications despite granted permission.
  }
}

export function UrgentDeadlineAlert() {
  const navigate = useNavigate()
  const { tasks, loading } = useTasks()
  const now = useNow()
  const [dismissedSignature, setDismissedSignature] = useState(() => getDismissedSignature())
  const [notificationPermission, setNotificationPermission] = useState(() => getNotificationPermission())
  const reminders = useMemo(() => getDeadlineReminderTasks(tasks, now), [now, tasks])
  const signature = useMemo(() => createAlertSignature(reminders), [reminders])
  const visible = !loading && reminders.length > 0 && dismissedSignature !== signature
  const canRequestNotifications = notificationPermission === 'default'

  useEffect(() => {
    if (loading || notificationPermission !== 'granted' || reminders.length === 0) return

    const deliveredKeys = getDeliveredReminderKeys()
    const nextKeys = new Set(deliveredKeys)

    reminders.forEach((reminder) => {
      const reminderKey = getReminderKey(reminder)
      if (deliveredKeys.has(reminderKey)) return

      notifyReminder(reminder, now)
      nextKeys.add(reminderKey)
    })

    if (nextKeys.size !== deliveredKeys.size) {
      storeDeliveredReminderKeys(nextKeys)
    }
  }, [loading, notificationPermission, now, reminders])

  function dismissAlert() {
    storeDismissedSignature(signature)
    setDismissedSignature(signature)
  }

  async function enableNotifications() {
    if (!('Notification' in window)) return

    const permission = await window.Notification.requestPermission()
    setNotificationPermission(permission)
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
              <h2 className="text-sm font-black uppercase text-destructive">Nhắc deadline</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {reminders.length} task đang chạm mốc 24h / 6h / 1h trước hạn.
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
            {reminders.slice(0, 3).map((reminder) => (
              <li className="rounded-lg border bg-card-soft px-3 py-2" key={getReminderKey(reminder)}>
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-bold">{reminder.task.title}</p>
                  <Badge variant="danger" className="shrink-0">{reminder.milestone.label}</Badge>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-destructive">
                  {getTaskRemainingTimeLabel(reminder.task, now)} · Hạn {formatTaskDueDateTime(reminder.task)}
                </p>
              </li>
            ))}
          </ul>

          {reminders.length > 3 ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">+{reminders.length - 3} task khác</p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={openTasksPage}>
              <ListChecks />
              Xem công việc
            </Button>
            {canRequestNotifications ? (
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={enableNotifications}>
                <Bell />
                Bật notification
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
