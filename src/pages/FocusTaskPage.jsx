import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Coffee,
  Gauge,
  Home,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  Timer,
  X,
} from 'lucide-react'

import focusSkyBackground from '@/assets/focus-sky.jpg'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/date'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { canCompleteTaskWithUpdates, isActiveWorkTask, isTaskOverdue } from '@/utils/taskStats'
import {
  getPriorityLabel,
  getStatusLabel,
  PRIORITY_BADGE_VARIANTS,
  STATUS_BADGE_VARIANTS,
} from '@/utils/taskOptions'

const FOCUS_MODES = {
  focus: {
    key: 'focus',
    label: 'Pomodoro',
    title: 'Phiên tập trung',
    icon: Target,
  },
  short: {
    key: 'short',
    label: 'Nghỉ ngắn',
    title: 'Nạp lại năng lượng',
    icon: Coffee,
  },
  long: {
    key: 'long',
    label: 'Nghỉ dài',
    title: 'Thả lỏng một chút',
    icon: Sparkles,
  },
}

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

function getNextMode(mode) {
  return mode === 'focus' ? 'short' : 'focus'
}

function FocusBackground() {
  return (
    <>
      <img
        src={focusSkyBackground}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,20,0.12)_0%,rgba(7,13,25,0.34)_52%,rgba(7,9,20,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,241,168,0.14),transparent_34%)]" />
    </>
  )
}

function FocusModeButton({ modeKey, active, onClick }) {
  const mode = FOCUS_MODES[modeKey]
  const Icon = mode.icon

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'h-9 rounded-full border-white/25 bg-black/24 px-4 text-xs font-bold uppercase text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950',
        active && 'border-white bg-white text-slate-950 hover:bg-white',
      )}
      onClick={onClick}
    >
      <Icon />
      {mode.label}
    </Button>
  )
}

function DurationField({ id, label, value, onChange }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-bold uppercase text-slate-500" htmlFor={id}>
        {label}
      </Label>
      <Input
        id={id}
        min="1"
        max="120"
        type="number"
        value={value}
        className="h-11 border-slate-200 bg-slate-50 text-slate-950"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function FocusIconButton({ label, icon: Icon, onClick, asChild = false, children }) {
  const content = (
    <>
      <Icon />
      <span className="sr-only">{label}</span>
    </>
  )

  return (
    <Button
      type={asChild ? undefined : 'button'}
      variant="outline"
      size="icon"
      asChild={asChild}
      title={label}
      aria-label={label}
      className="border-white/24 bg-black/24 text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950"
      onClick={onClick}
    >
      {asChild ? children : content}
    </Button>
  )
}

export function FocusTaskPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, loading, error, updateTask } = useTasks()
  const task = useMemo(() => tasks.find((item) => item.id === taskId), [taskId, tasks])
  const [mode, setMode] = useState('focus')
  const [durations, setDurations] = useState({ focus: 25, short: 5, long: 15 })
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (!running) return undefined

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1

        const nextMode = getNextMode(mode)
        setMode(nextMode)
        return durations[nextMode] * 60
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [durations, mode, running])

  const currentMode = FOCUS_MODES[mode]
  const currentDuration = durations[mode] * 60
  const progress = Math.min(100, Math.max(0, Math.round(((currentDuration - secondsLeft) / currentDuration) * 100)))
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

  async function toggleFullscreen() {
    setActionError('')

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.()
      } else {
        await document.documentElement.requestFullscreen?.()
      }
    } catch {
      setActionError('Trình duyệt không hỗ trợ toàn màn hình cho trang này.')
    }
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
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 p-4">
        <EmptyState title="Đang mở chế độ tập trung" description="Task đang được đồng bộ." />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="grid min-h-screen gap-4 bg-slate-950 p-4 text-white">
        <Button asChild variant="outline" className="w-fit border-white/25 bg-white/10 text-white hover:bg-white hover:text-slate-950">
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
      <div className="grid min-h-screen gap-4 bg-slate-950 p-4 text-white">
        <Button asChild variant="outline" className="w-fit border-white/25 bg-white/10 text-white hover:bg-white hover:text-slate-950">
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
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <FocusBackground />

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="border-white/24 bg-black/24 text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950"
              title="Về Công việc"
              aria-label="Về Công việc"
            >
              <Link to="/tasks">
                <ArrowLeft />
                <span className="sr-only">Về Công việc</span>
              </Link>
            </Button>
            <div className="hidden text-left text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.36)] sm:block">
              <p className="text-2xl font-black leading-none">pastel focus</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-white/68">task room</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FocusIconButton label="Dashboard" icon={Home} onClick={() => navigate('/')} />
          </div>
        </header>

        {error || actionError ? (
          <p className="mt-4 rounded-lg border border-white/25 bg-white/90 p-3 text-sm font-semibold text-destructive shadow-soft">
            {actionError || error}
          </p>
        ) : null}

        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-1 pb-56 pt-8 text-center lg:pb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(FOCUS_MODES).map((modeKey) => (
              <FocusModeButton
                key={modeKey}
                modeKey={modeKey}
                active={mode === modeKey}
                onClick={() => switchMode(modeKey)}
              />
            ))}
          </div>

          <motion.div
            className="grid w-full max-w-5xl justify-items-center gap-4"
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(0,0,0,0.22)]">
              <Timer className="size-4" />
              {currentMode.title}
            </div>
            <p className="text-[clamp(5rem,16vw,11rem)] font-black leading-none tracking-normal text-white drop-shadow-[0_16px_42px_rgba(0,0,0,0.48)] tabular-nums">
              {formatTimer(secondsLeft)}
            </p>
            <div className="w-full max-w-md px-2">
              <Progress value={progress} className="h-1.5 bg-black/35" />
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold uppercase text-white/74">
                <Gauge className="size-4" />
                {progress}% phiên hiện tại
              </div>
            </div>
          </motion.div>

          <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="size-12 rounded-full border-white/24 bg-black/24 p-0 text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950"
              aria-label="Đặt lại"
              title="Đặt lại"
              onClick={resetTimer}
            >
              <RotateCcw />
            </Button>
            <Button
              type="button"
              className={cn(
                'h-14 min-w-44 rounded-full border-0 bg-gradient-to-r px-8 text-base font-black text-slate-950 shadow-[0_18px_42px_rgba(255,154,118,0.28)] hover:scale-[1.02] hover:brightness-105',
                running ? 'from-sky via-lavender to-mint' : 'from-blush via-butter to-sky',
              )}
              onClick={() => setRunning((current) => !current)}
            >
              {running ? <Pause /> : <Play />}
              {running ? 'Tạm dừng' : 'Bắt đầu'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="size-12 rounded-full border-white/24 bg-black/24 p-0 text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950"
              aria-label="Cài đặt phiên"
              title="Cài đặt phiên"
              onClick={() => setShowSettings(true)}
            >
              <Settings2 />
            </Button>
          </div>
        </main>

        <section className="fixed inset-x-3 bottom-20 z-20 mx-auto max-w-md rounded-lg border border-white/14 bg-black/42 px-4 py-3 text-left shadow-[0_16px_48px_rgba(0,0,0,0.34)] lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[360px]">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="secondary">Task đang làm</Badge>
              <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]}>{getPriorityLabel(task.priority)}</Badge>
              <Badge variant={STATUS_BADGE_VARIANTS[task.status]}>{getStatusLabel(task.status)}</Badge>
              <Badge variant={overdue ? 'danger' : 'outline'} className={cn(!overdue && 'border-white/30 text-white')}>
                Hạn: {formatDate(task.dueDate)}
              </Badge>
            </div>
            <h1 className="truncate text-base font-bold leading-tight text-white sm:text-lg">{task.title}</h1>
            {task.description ? (
              <p className="mt-1 truncate text-sm text-white/68">{task.description}</p>
            ) : null}
          </div>
        </section>

        <section className="fixed inset-x-3 bottom-3 z-20 mx-auto flex max-w-md items-center justify-end gap-3 lg:inset-x-auto lg:bottom-6 lg:right-6">
          <Button
            type="button"
            className="h-11 rounded-full px-5 shadow-[0_14px_34px_rgba(53,196,154,0.28)]"
            onClick={completeTask}
            disabled={completionBlocked || task.status === 'completed'}
          >
            <CheckCircle2 />
            Hoàn thành
          </Button>
          <Button
            type="button"
            variant="outline"
            className="size-11 rounded-full border-white/24 bg-black/24 p-0 text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950"
            aria-label="Mở toàn màn hình"
            title="Mở toàn màn hình"
            onClick={toggleFullscreen}
          >
            <Maximize2 />
          </Button>
        </section>

        <AnimatePresence>
          {showSettings ? (
            <motion.div
              className="fixed inset-0 z-50 grid place-items-center bg-slate-950 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.section
                className="w-full max-w-md rounded-lg bg-white p-5 text-slate-950 shadow-soft"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Cài đặt phiên</h2>
                    <p className="mt-1 text-sm text-slate-500">Tùy chỉnh thời lượng Pomodoro cho task này.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Đóng cài đặt"
                    aria-label="Đóng cài đặt"
                    onClick={() => setShowSettings(false)}
                  >
                    <X />
                  </Button>
                </div>
                <div className="grid gap-4">
                  <DurationField
                    id="focusMinutes"
                    label="Pomodoro"
                    value={durations.focus}
                    onChange={(value) => updateDuration('focus', value)}
                  />
                  <DurationField
                    id="shortMinutes"
                    label="Nghỉ ngắn"
                    value={durations.short}
                    onChange={(value) => updateDuration('short', value)}
                  />
                  <DurationField
                    id="longMinutes"
                    label="Nghỉ dài"
                    value={durations.long}
                    onChange={(value) => updateDuration('long', value)}
                  />
                </div>
                <Button type="button" className="mt-5 w-full" onClick={() => setShowSettings(false)}>
                  Xong
                </Button>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
