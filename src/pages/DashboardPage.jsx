import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  Plus,
  Search,
  TimerReset,
  TrendingUp,
  X,
} from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { StatCard } from '@/components/StatCard'
import { TaskCard } from '@/components/TaskCard'
import { TaskForm } from '@/components/TaskForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettings } from '@/hooks/useSettings'
import { useTasks } from '@/hooks/useTasks'
import { formatDate } from '@/utils/date'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { getDashboardStats, getUpcomingTasks, isTaskOverdue } from '@/utils/taskStats'
import {
  getPriorityLabel,
  PRIORITY_BADGE_VARIANTS,
  TASK_STATUSES,
} from '@/utils/taskOptions'

export function DashboardPage() {
  const { settings } = useSettings()
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(settings.defaultTaskFilter)

  const stats = getDashboardStats(tasks)
  const upcomingTasks = getUpcomingTasks(tasks)

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

  function openNewTaskForm() {
    setEditingTask(null)
    setActionError('')
    setShowTaskForm((current) => !current)
  }

  function openEditTaskForm(task) {
    setEditingTask(task)
    setActionError('')
    setShowTaskForm(true)
  }

  function closeTaskForm() {
    setEditingTask(null)
    setShowTaskForm(false)
  }

  async function handleSubmit(payload) {
    setSubmitting(true)
    setActionError('')

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload)
      } else {
        await createTask(payload)
      }

      closeTaskForm()
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
      await updateTask(taskId, payload)
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
    }
  }

  async function handleDelete(taskId) {
    setActionError('')

    try {
      await deleteTask(taskId)
      if (editingTask?.id === taskId) closeTaskForm()
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
    }
  }

  if (loading) {
    return <EmptyState title="Đang tải dashboard" description="Dữ liệu task đang được đồng bộ." />
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tổng quan và quản lý công việc cá nhân</p>
        </div>
        <Button type="button" onClick={openNewTaskForm}>
          {showTaskForm && !editingTask ? <X /> : <Plus />}
          {showTaskForm && !editingTask ? 'Đóng form' : 'Thêm task'}
        </Button>
      </section>

      <AnimatePresence initial={false}>
        {showTaskForm ? (
          <motion.section
            key={editingTask?.id ?? 'new-task'}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <TaskForm
              key={editingTask?.id ?? 'new-task'}
              initialTask={editingTask}
              onSubmit={handleSubmit}
              onCancel={closeTaskForm}
              submitting={submitting}
            />
          </motion.section>
        ) : null}
      </AnimatePresence>

      {error || actionError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {actionError || error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tổng số task" value={stats.total} icon={ListTodo} tone="bg-sky text-sky-950" />
        <StatCard title="Task đã hoàn thành" value={stats.completed} icon={CheckCircle2} tone="bg-mint text-emerald-900" />
        <StatCard title="Task đang làm" value={stats.inProgress} icon={TimerReset} tone="bg-butter text-amber-950" />
        <StatCard title="Task trễ hạn" value={stats.overdue} icon={AlertTriangle} tone="bg-peach text-rose-950" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_390px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Tỷ lệ hoàn thành trong tuần
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-bold">{stats.weeklyCompletionRate}%</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stats.weeklyBasis} task đã đến hạn tới cuối tuần này
                </p>
              </div>
              <Badge variant={stats.weeklyCompletionRate >= 70 ? 'success' : 'warning'}>
                Tuần hiện tại
              </Badge>
            </div>
            <Progress value={stats.weeklyCompletionRate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task gần hạn</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có task đang chờ.</p>
            ) : (
              <motion.ul className="grid gap-3" layout>
                {upcomingTasks.map((task) => (
                  <motion.li
                    className="rounded-lg border bg-card-soft p-3"
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold">{task.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Hạn: {formatDate(task.dueDate)}</p>
                      </div>
                      <Badge variant={isTaskOverdue(task) ? 'danger' : PRIORITY_BADGE_VARIANTS[task.priority]}>
                        {isTaskOverdue(task) ? 'Trễ' : getPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold">Danh sách task</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tìm, lọc, sửa và cập nhật trạng thái task tại đây.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
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
        </div>

        <div className="grid gap-3">
          {filteredTasks.length === 0 ? (
            <EmptyState title="Chưa có task phù hợp" description="Thêm task mới hoặc đổi bộ lọc để xem thêm." />
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  onEdit={openEditTaskForm}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  )
}
