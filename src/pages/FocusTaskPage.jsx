import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useTasks } from '@/hooks/useTasks'
import { formatDate } from '@/utils/date'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { canCompleteTaskWithUpdates, isActiveWorkTask, isTaskOverdue } from '@/utils/taskStats'
import {
  getPriorityLabel,
  getStatusLabel,
  PRIORITY_BADGE_VARIANTS,
  STATUS_BADGE_VARIANTS,
} from '@/utils/taskOptions'

function clampMinutes(value) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return 1
  return Math.min(120, Math.max(1, Math.round(numberValue)))
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60)
  const restSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`
}

export function FocusTaskPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, loading, error, updateTask } = useTasks()
  const task = useMemo(() => tasks.find((item) => item.id === taskId), [taskId, tasks])
  const [mode, setMode] = useState('focus')
  const [durations, setDurations] = useState({ focus: 25, break: 5 })
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (!running) return undefined

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1

        const nextMode = mode === 'focus' ? 'break' : 'focus'
        setMode(nextMode)
        return durations[nextMode] * 60
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [durations, mode, running])

  const currentDuration = durations[mode] * 60
  const progress = Math.round(((currentDuration - secondsLeft) / currentDuration) * 100)
  const completionBlocked = task ? !canCompleteTaskWithUpdates(task, { status: 'completed' }) : false
  const overdue = task ? isTaskOverdue(task) : false

  function updateDuration(key, value) {
    const minutes = clampMinutes(value)
    setDurations((current) => ({ ...current, [key]: minutes }))

    if (!running && mode === key) {
      setSecondsLeft(minutes * 60)
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setRunning(false)
    setSecondsLeft(durations[nextMode] * 60)
  }

  function resetTimer() {
    setRunning(false)
    setSecondsLeft(durations[mode] * 60)
  }

  async function completeTask() {
    if (!task || completionBlocked) return

    setActionError('')

    try {
      await updateTask(task.id, { status: 'completed' })
      setRunning(false)
      navigate('/tasks', { replace: true })
    } catch (completeError) {
      setActionError(getFirebaseErrorMessage(completeError))
    }
  }

  if (loading) {
    return <EmptyState title="Đang mở chế độ tập trung" description="Task đang được đồng bộ." />
  }

  if (!task) {
    return (
      <div className="grid gap-4">
        <Button asChild variant="outline" className="w-fit">
          <Link to="/tasks">
            <ArrowLeft />
            Về Công việc
          </Link>
        </Button>
        <EmptyState title="Không tìm thấy task" description="Task này có thể đã bị xóa hoặc không thuộc tài khoản của bạn." />
      </div>
    )
  }

  if (!isActiveWorkTask(task)) {
    return (
      <div className="grid gap-4">
        <Button asChild variant="outline" className="w-fit">
          <Link to="/tasks">
            <ArrowLeft />
            Về Công việc
          </Link>
        </Button>
        <EmptyState
          title="Task không còn trong danh sách làm việc"
          description="Task đã hoàn thành hoặc quá hạn nên chỉ còn được tính trong thống kê và báo cáo."
        />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link to="/tasks">
              <ArrowLeft />
              Về Công việc
            </Link>
          </Button>
          <h1 className="break-words text-3xl font-bold sm:text-4xl">Tập trung làm task</h1>
          <p className="mt-2 text-sm text-muted-foreground">Một tab ẩn để bạn tập trung hoàn thành công việc đã chọn.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>
          Dashboard
        </Button>
      </section>

      {error || actionError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {actionError || error}
        </p>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="overflow-hidden">
          <CardHeader className="bg-card-soft">
            <CardTitle className="flex items-center gap-2">
              <Timer className="size-5 text-primary" />
              Pomodoro
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 p-5">
            <div className="flex justify-center">
              <div
                className="flex size-64 items-center justify-center rounded-full p-4 shadow-soft"
                style={{
                  background: `conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}% 100%)`,
                }}
              >
                <div className="flex size-full flex-col items-center justify-center rounded-full bg-card text-center">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {mode === 'focus' ? 'Phiên tập trung' : 'Nghỉ ngắn'}
                  </p>
                  <p className="mt-2 text-5xl font-bold tabular-nums">{formatTimer(secondsLeft)}</p>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{progress}%</p>
                </div>
              </div>
            </div>

            <Progress value={progress} />

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={mode === 'focus' ? 'default' : 'outline'}
                onClick={() => switchMode('focus')}
              >
                Tập trung
              </Button>
              <Button
                type="button"
                variant={mode === 'break' ? 'default' : 'outline'}
                onClick={() => switchMode('break')}
              >
                Nghỉ ngắn
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="focusMinutes">Phút tập trung</Label>
                <Input
                  id="focusMinutes"
                  min="1"
                  max="120"
                  type="number"
                  value={durations.focus}
                  onChange={(event) => updateDuration('focus', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="breakMinutes">Phút nghỉ</Label>
                <Input
                  id="breakMinutes"
                  min="1"
                  max="120"
                  type="number"
                  value={durations.break}
                  onChange={(event) => updateDuration('break', event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <Button type="button" onClick={() => setRunning((current) => !current)}>
                {running ? <Pause /> : <Play />}
                {running ? 'Tạm dừng' : 'Bắt đầu'}
              </Button>
              <Button type="button" variant="outline" onClick={resetTimer}>
                <RotateCcw />
                Đặt lại
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={completeTask}
                disabled={completionBlocked || task.status === 'completed'}
              >
                <CheckCircle2 />
                Hoàn thành
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-card-soft">
            <CardTitle>Task đang làm</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-5">
            <div>
              <h2 className="break-words text-2xl font-bold">{task.title}</h2>
              {task.description ? (
                <p className="mt-3 break-words text-sm leading-6 text-muted-foreground">{task.description}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={STATUS_BADGE_VARIANTS[task.status]}>{getStatusLabel(task.status)}</Badge>
              <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]}>{getPriorityLabel(task.priority)}</Badge>
              <Badge variant={overdue ? 'danger' : 'outline'}>Hạn: {formatDate(task.dueDate)}</Badge>
            </div>

            {completionBlocked ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                Task đã trễ hạn nên không thể đánh dấu là hoàn thành.
              </div>
            ) : (
              <div className="rounded-lg border bg-card-soft p-4 text-sm text-muted-foreground">
                Khi hoàn tất phiên tập trung, bạn có thể đánh dấu task là hoàn thành ngay tại đây.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
