import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Pencil,
  Search,
  Timer,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { TaskForm } from '@/components/TaskForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNow } from '@/hooks/useNow'
import { useTasks } from '@/hooks/useTasks'
import { formatTaskDueDateTime } from '@/utils/date'
import { sortTasksByPriorityAndDeadline } from '@/utils/eisenhower'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import {
  canCompleteTaskWithUpdates,
  formatFocusDuration,
  getTaskFocusSeconds,
  isActiveWorkTask,
} from '@/utils/taskStats'
import {
  getPriorityLabel,
  getStatusLabel,
  PRIORITY_BADGE_VARIANTS,
  STATUS_BADGE_VARIANTS,
  TASK_STATUSES,
} from '@/utils/taskOptions'

function TasksTable({ tasks, onEdit, onUpdate, onDelete, onFocus }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-card-soft text-xs font-black uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Công việc</th>
              <th className="px-4 py-3">Ưu tiên</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Hạn</th>
              <th className="px-4 py-3">Giờ học</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map((task) => (
              <motion.tr
                layout
                className="bg-card transition-colors hover:bg-card-soft/70"
                key={task.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <td className="max-w-[360px] px-4 py-3">
                  <button type="button" className="grid gap-1 text-left" onClick={() => onFocus(task)}>
                    <span className="break-words font-bold">{task.title}</span>
                    {task.description ? (
                      <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">{task.description}</span>
                    ) : null}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_BADGE_VARIANTS[task.status]}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatTaskDueDateTime(task)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold">
                  {formatFocusDuration(getTaskFocusSeconds(task))}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="icon" title="Focus" aria-label="Focus" onClick={() => onFocus(task)}>
                      <Timer />
                    </Button>
                    <Button type="button" variant="outline" size="icon" title="Sửa" aria-label="Sửa" onClick={() => onEdit(task)}>
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Hoàn thành"
                      aria-label="Hoàn thành"
                      disabled={!canCompleteTaskWithUpdates(task, { status: 'completed' })}
                      onClick={() => onUpdate(task.id, { status: 'completed' })}
                    >
                      <CheckCircle2 />
                    </Button>
                    <Button type="button" variant="destructive" size="icon" title="Xóa" aria-label="Xóa" onClick={() => onDelete(task.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TasksPage() {
  const navigate = useNavigate()
  const { tasks, loading, error, updateTask, deleteTask } = useTasks()
  const now = useNow()
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const activeTasks = useMemo(() => tasks.filter((task) => isActiveWorkTask(task, now)), [now, tasks])

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return activeTasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description?.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [activeTasks, search, statusFilter])

  const sortedTasks = useMemo(
    () => sortTasksByPriorityAndDeadline(filteredTasks),
    [filteredTasks],
  )

  async function handleSubmit(payload) {
    if (!editingTask) return false

    setSubmitting(true)
    setActionError('')

    try {
      if (payload.status === 'completed' && !canCompleteTaskWithUpdates(editingTask, payload)) {
        setActionError('Task trễ hạn không thể đánh dấu là đã hoàn thành.')
        return false
      }

      await updateTask(editingTask.id, payload)
      setEditingTask(null)
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
      return false
    } finally {
      setSubmitting(false)
    }

    return true
  }

  async function handleUpdate(taskId, payload) {
    setActionError('')

    try {
      const task = tasks.find((item) => item.id === taskId)

      if (payload.status === 'completed' && task && !canCompleteTaskWithUpdates(task, payload)) {
        setActionError('Task trễ hạn không thể đánh dấu là đã hoàn thành.')
        return
      }

      await updateTask(taskId, payload)
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
    }
  }

  async function handleDelete(taskId) {
    setActionError('')

    try {
      await deleteTask(taskId)
      if (editingTask?.id === taskId) setEditingTask(null)
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
    }
  }

  function openFocusMode(task) {
    navigate(`/focus/${task.id}`)
  }

  return (
    <div className="grid gap-6">
      <section>
        <h1 className="text-3xl font-bold sm:text-4xl">Công việc</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quản lý task bằng bảng ưu tiên, trạng thái, deadline và thời gian học đã tích lũy.
        </p>
      </section>

      {error || actionError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {actionError || error}
        </p>
      ) : null}

      <AnimatePresence initial={false}>
        {editingTask ? (
          <motion.section
            key={editingTask.id}
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            className="overflow-hidden"
          >
            <TaskForm
              key={editingTask.id}
              initialTask={editingTask}
              onSubmit={handleSubmit}
              onCancel={() => setEditingTask(null)}
              submitting={submitting}
            />
          </motion.section>
        ) : null}
      </AnimatePresence>

      <section className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tiêu đề hoặc mô tả"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger aria-label="Lọc theo trạng thái">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="grid gap-3">
        {loading ? (
          <EmptyState title="Đang tải task" description="Danh sách đang được đồng bộ." />
        ) : sortedTasks.length === 0 ? (
          <EmptyState title="Chưa có task phù hợp" description="Thay đổi bộ lọc hoặc thêm task mới ở Dashboard." />
        ) : (
          <AnimatePresence mode="popLayout">
            <TasksTable
              tasks={sortedTasks}
              onEdit={setEditingTask}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onFocus={openFocusMode}
            />
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
