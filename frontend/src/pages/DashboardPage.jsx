import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ListTodo,
  Plus,
  Rocket,
  Search,
  Sparkles,
  TimerReset,
  TrendingUp,
  Wrench,
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
import { formatTaskDueDateTime } from '@/utils/date'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import {
  canCompleteTaskWithUpdates,
  getDashboardStats,
  getUpcomingTasks,
  isActiveWorkTask,
  isTaskOverdue,
} from '@/utils/taskStats'
import {
  getPriorityLabel,
  PRIORITY_BADGE_VARIANTS,
  TASK_STATUSES,
} from '@/utils/taskOptions'

const TASK_LIST_VIEWS = {
  active: {
    title: 'Danh sách task',
    description: 'Task chưa hoàn thành và chưa quá hạn.',
  },
  all: {
    title: 'Tất cả task',
    description: 'Toàn bộ task trong lịch sử, gồm cả task đã hoàn thành và trễ hạn.',
  },
  completed: {
    title: 'Task đã hoàn thành',
    description: 'Những task đã được đánh dấu hoàn thành để phục vụ thống kê và báo cáo.',
  },
  'in-progress': {
    title: 'Task đang làm',
    description: 'Những task đang làm và vẫn còn trong hạn.',
  },
  overdue: {
    title: 'Task trễ hạn',
    description: 'Những task đã quá hạn và không còn nằm trong luồng làm việc.',
  },
}

const UPDATE_NOTES_VERSION = '2026-05-29'
const UPDATE_NOTES_STORAGE_KEY = 'pastel-update-notes-version'
const UPDATE_NOTES = [
  {
    title: 'Tính năng mới',
    icon: Sparkles,
    items: [
      'Lịch báo cáo ưu tiên chế độ tuần và hỗ trợ kéo thả task.',
      'Nhắc deadline theo mốc 24h, 6h và 1h trước hạn.',
      'Giờ tập trung được tích lũy vào báo cáo tuần.',
    ],
  },
  {
    title: 'Đã sửa lỗi',
    icon: Wrench,
    items: [
      'Task hết hạn không còn làm lệch màu các thanh trong lịch.',
      'Ma trận Eisenhower hiển thị đúng bốn nhóm ưu tiên.',
      'Task hoàn thành được ẩn khỏi lịch làm việc.',
    ],
  },
  {
    title: 'Cải tiến',
    icon: Rocket,
    items: [
      'Thanh nhạc nền trong Focus gọn hơn và chuyên nghiệp hơn.',
      'Thời gian nghỉ ngắn và nghỉ dài cũng được tính khi bấm Bắt đầu.',
      'Gợi ý áp dụng AI được đặt ngay trong Dashboard.',
    ],
  },
]

const AI_SUGGESTIONS = [
  'Tự phân loại task vào ma trận Eisenhower từ tiêu đề, mô tả và deadline.',
  'Tạo lịch tuần tự động dựa trên deadline, mức ưu tiên và giờ tập trung còn trống.',
  'Dự báo nguy cơ trễ hạn rồi gợi ý chia nhỏ task hoặc gia hạn hợp lý.',
  'Tóm tắt báo cáo tuần bằng ngôn ngữ tự nhiên và đề xuất tuần sau nên tập trung vào đâu.',
]

function getStoredUpdateNotesVersion() {
  try {
    return window.localStorage.getItem(UPDATE_NOTES_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function storeUpdateNotesVersion() {
  try {
    window.localStorage.setItem(UPDATE_NOTES_STORAGE_KEY, UPDATE_NOTES_VERSION)
  } catch {
    // Local storage có thể bị tắt ở một số trình duyệt.
  }
}

function UpdateNotesModal({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="w-full max-w-3xl overflow-hidden rounded-lg border bg-card text-card-foreground shadow-soft"
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.18 }}
      >
        <div className="flex items-start justify-between gap-4 border-b bg-card-soft p-5">
          <div className="min-w-0">
            <Badge variant="secondary">Cập nhật {UPDATE_NOTES_VERSION}</Badge>
            <h2 className="mt-3 text-2xl font-bold">Thông tin cập nhật web</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Những thay đổi mới nhất cho lịch, focus mode, báo cáo và trải nghiệm làm việc.
            </p>
          </div>
          <Button type="button" variant="outline" size="icon" title="Đóng" aria-label="Đóng" onClick={onClose}>
            <X />
          </Button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-3">
          {UPDATE_NOTES.map((group) => {
            const Icon = group.icon

            return (
              <section className="rounded-lg border bg-card-soft p-4" key={group.title}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-card">
                    <Icon className="size-4 text-primary" />
                  </span>
                  <h3 className="text-sm font-black">{group.title}</h3>
                </div>
                <ul className="grid gap-2 text-sm leading-5 text-muted-foreground">
                  {group.items.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
        <div className="border-t bg-card-soft p-5">
          <Button type="button" className="w-full sm:w-auto" onClick={onClose}>
            Đã hiểu
          </Button>
        </div>
      </motion.section>
    </motion.div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(settings.defaultTaskFilter)
  const [taskListView, setTaskListView] = useState('active')
  const [showUpdateNotes, setShowUpdateNotes] = useState(() => getStoredUpdateNotesVersion() !== UPDATE_NOTES_VERSION)

  const stats = getDashboardStats(tasks)
  const upcomingTasks = getUpcomingTasks(tasks)
  const selectedTaskListView = TASK_LIST_VIEWS[taskListView]

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const isFixedView = ['completed', 'in-progress', 'overdue'].includes(taskListView)
    const baseTasks = tasks.filter((task) => {
      if (taskListView === 'active') return isActiveWorkTask(task)
      if (taskListView === 'completed') return task.status === 'completed'
      if (taskListView === 'in-progress') return task.status === 'in-progress' && isActiveWorkTask(task)
      if (taskListView === 'overdue') return isTaskOverdue(task)
      return true
    })

    return baseTasks.filter((task) => {
      const matchesStatus = isFixedView || statusFilter === 'all' || task.status === statusFilter
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description?.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [search, statusFilter, taskListView, tasks])

  function showTaskListView(nextView) {
    setTaskListView(nextView)
    setStatusFilter('all')
  }

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
        if (payload.status === 'completed' && !canCompleteTaskWithUpdates(editingTask, payload)) {
          setActionError('Task trễ hạn không thể đánh dấu là đã hoàn thành.')
          return false
        }

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
      if (editingTask?.id === taskId) closeTaskForm()
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
    }
  }

  function openFocusMode(task) {
    navigate(`/focus/${task.id}`)
  }

  function closeUpdateNotes() {
    storeUpdateNotesVersion()
    setShowUpdateNotes(false)
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
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setShowUpdateNotes(true)}>
            <Sparkles />
            Cập nhật
          </Button>
          <Button type="button" onClick={openNewTaskForm}>
            {showTaskForm && !editingTask ? <X /> : <Plus />}
            {showTaskForm && !editingTask ? 'Đóng form' : 'Thêm task'}
          </Button>
        </div>
      </section>

      <AnimatePresence>
        {showUpdateNotes ? <UpdateNotesModal onClose={closeUpdateNotes} /> : null}
      </AnimatePresence>

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
        <StatCard
          title="Tổng số task"
          value={stats.total}
          icon={ListTodo}
          tone="bg-sky text-sky-950"
          selected={taskListView === 'all'}
          onClick={() => showTaskListView('all')}
        />
        <StatCard
          title="Task đã hoàn thành"
          value={stats.completed}
          icon={CheckCircle2}
          tone="bg-mint text-emerald-900"
          selected={taskListView === 'completed'}
          onClick={() => showTaskListView('completed')}
        />
        <StatCard
          title="Task đang làm"
          value={stats.inProgress}
          icon={TimerReset}
          tone="bg-butter text-amber-950"
          selected={taskListView === 'in-progress'}
          onClick={() => showTaskListView('in-progress')}
        />
        <StatCard
          title="Task trễ hạn"
          value={stats.overdue}
          icon={AlertTriangle}
          tone="bg-peach text-rose-950"
          selected={taskListView === 'overdue'}
          onClick={() => showTaskListView('overdue')}
        />
      </section>

      <section className="overflow-hidden rounded-lg border bg-card shadow-soft">
        <div className="grid gap-4 bg-card-soft p-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
          <div>
            <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-lavender text-violet-950">
              <Bot className="size-5" />
            </div>
            <h2 className="text-xl font-bold">Gợi ý áp dụng AI</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Các hướng có thể đưa vào app để giảm thao tác thủ công và lập kế hoạch thông minh hơn.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {AI_SUGGESTIONS.map((suggestion) => (
              <div className="rounded-lg border bg-card p-3 text-sm font-semibold leading-6 text-muted-foreground" key={suggestion}>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
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
                        <p className="mt-1 text-xs text-muted-foreground">Hạn: {formatTaskDueDateTime(task)}</p>
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
            <h2 className="text-2xl font-bold">{selectedTaskListView.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{selectedTaskListView.description}</p>
          </div>
          {taskListView !== 'active' ? (
            <Button type="button" variant="outline" onClick={() => showTaskListView('active')}>
              Xem task đang xử lý
            </Button>
          ) : null}
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

          {['active', 'all'].includes(taskListView) ? (
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
          ) : null}
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
                  onFocus={openFocusMode}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  )
}
