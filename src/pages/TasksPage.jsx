import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { TaskCard } from '@/components/TaskCard'
import { TaskForm } from '@/components/TaskForm'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTasks } from '@/hooks/useTasks'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { TASK_STATUSES } from '@/utils/taskOptions'

export function TasksPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks()
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description?.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [search, statusFilter, tasks])

  async function handleSubmit(payload) {
    setSubmitting(true)
    setActionError('')

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload)
        setEditingTask(null)
      } else {
        await createTask(payload)
      }
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(taskId, payload) {
    setActionError('')

    try {
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

  return (
    <div className="grid gap-6">
      <section>
        <h1 className="text-3xl font-bold sm:text-4xl">Công việc</h1>
        <p className="mt-2 text-sm text-muted-foreground">Danh sách task của bạn</p>
      </section>

      <TaskForm
        key={editingTask?.id ?? 'new-task'}
        initialTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
        submitting={submitting}
      />

      {error || actionError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {actionError || error}
        </p>
      ) : null}

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
        ) : filteredTasks.length === 0 ? (
          <EmptyState title="Chưa có task phù hợp" description="Thay đổi bộ lọc hoặc thêm task mới." />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard
                task={task}
                key={task.id}
                onEdit={setEditingTask}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
