import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { TaskCard } from '@/components/TaskCard'
import { TaskForm } from '@/components/TaskForm'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTasks } from '@/hooks/useTasks'
import { useNow } from '@/hooks/useNow'
import { formatTaskDueDateTime } from '@/utils/date'
import {
  EISENHOWER_QUADRANTS,
  groupTasksByEisenhower,
  sortTasksByPriorityAndDeadline,
} from '@/utils/eisenhower'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { canCompleteTaskWithUpdates, isActiveWorkTask } from '@/utils/taskStats'
import {
  getPriorityLabel,
  PRIORITY_BADGE_VARIANTS,
  TASK_STATUSES,
} from '@/utils/taskOptions'

function EisenhowerCard({ quadrant, tasks, onFocus }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className={quadrant.tone}>
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          <span>{quadrant.title}</span>
          <span className="rounded-md bg-white/55 px-2 py-0.5 text-sm">{tasks.length}</span>
        </CardTitle>
        <p className="text-sm font-semibold opacity-80">{quadrant.description}</p>
      </CardHeader>
      <CardContent className="grid gap-2 pt-4">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Không có task trong nhóm này.</p>
        ) : (
          tasks.slice(0, 4).map((task) => (
            <button
              className="rounded-lg border bg-card-soft p-3 text-left transition-colors hover:border-primary"
              key={task.id}
              type="button"
              onClick={() => onFocus(task)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-bold">{task.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Hạn: {formatTaskDueDateTime(task)}</p>
                </div>
                <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]}>
                  {getPriorityLabel(task.priority)}
                </Badge>
              </div>
            </button>
          ))
        )}
        {tasks.length > 4 ? (
          <p className="text-xs font-semibold text-muted-foreground">+{tasks.length - 4} task khác</p>
        ) : null}
      </CardContent>
    </Card>
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

  const eisenhowerGroups = useMemo(
    () => groupTasksByEisenhower(filteredTasks, now),
    [filteredTasks, now],
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
          Sắp xếp theo mức ưu tiên và deadline, kết hợp Ma trận Eisenhower.
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

      <section className="grid gap-4 lg:grid-cols-2">
        {EISENHOWER_QUADRANTS.map((quadrant) => (
          <EisenhowerCard
            key={quadrant.key}
            quadrant={quadrant}
            tasks={sortTasksByPriorityAndDeadline(eisenhowerGroups[quadrant.key])}
            onFocus={openFocusMode}
          />
        ))}
      </section>

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
            {sortedTasks.map((task) => (
              <TaskCard
                task={task}
                key={task.id}
                onEdit={setEditingTask}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onFocus={openFocusMode}
              />
            ))}
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
