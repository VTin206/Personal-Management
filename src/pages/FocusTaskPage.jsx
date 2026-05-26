import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Eye,
  EyeOff,
  Gauge,
  Home,
  Maximize2,
  Music,
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
import sessionSwitchSound from '@/assets/sounds/session-switch-taco-bell.mp3'
import taskCompleteSound from '@/assets/sounds/task-complete-ding.mp3'
import taskStartSound from '@/assets/sounds/task-start-boxing-bell.mp3'
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

const DEFAULT_DURATIONS = { focus: 25, short: 5, long: 15 }

function clampMinutes(value) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return 1
  return Math.min(120, Math.max(1, Math.round(numberValue)))
}

function createSecondsByMode(durations) {
  return {
    focus: durations.focus * 60,
    short: durations.short * 60,
    long: durations.long * 60,
  }
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60)
  const restSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`
}

function getNextMode(mode) {
  return mode === 'focus' ? 'short' : 'focus'
}

const FOCUS_MUSIC_STORAGE_KEY = 'pastel-focus-music-url'
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]+$/
const activeSounds = new Set()

function sanitizeYouTubeId(value) {
  if (!value || !YOUTUBE_ID_PATTERN.test(value)) return ''
  return value
}

function isYouTubeHost(hostname) {
  const normalizedHostname = hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '')

  return (
    normalizedHostname === 'youtu.be' ||
    normalizedHostname === 'youtube.com' ||
    normalizedHostname.endsWith('.youtube.com') ||
    normalizedHostname === 'youtube-nocookie.com' ||
    normalizedHostname.endsWith('.youtube-nocookie.com')
  )
}

function createYouTubeEmbedUrl(rawUrl) {
  const trimmedUrl = rawUrl.trim()
  if (!trimmedUrl) return ''

  const urlWithProtocol = /^(https?:)?\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`
  let url

  try {
    url = new URL(urlWithProtocol)
  } catch {
    return ''
  }

  if (!isYouTubeHost(url.hostname)) return ''

  const normalizedHostname = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '')
  const pathSegments = url.pathname.split('/').filter(Boolean)
  const playlistId = sanitizeYouTubeId(url.searchParams.get('list'))
  let videoId = ''

  if (normalizedHostname === 'youtu.be') {
    videoId = sanitizeYouTubeId(pathSegments[0])
  } else if (pathSegments[0] === 'watch') {
    videoId = sanitizeYouTubeId(url.searchParams.get('v'))
  } else if (['embed', 'shorts', 'live', 'v'].includes(pathSegments[0])) {
    videoId = sanitizeYouTubeId(pathSegments[1])
  }

  if (videoId) {
    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`)
    embedUrl.searchParams.set('autoplay', '1')
    embedUrl.searchParams.set('rel', '0')
    embedUrl.searchParams.set('playsinline', '1')
    if (playlistId) embedUrl.searchParams.set('list', playlistId)
    return embedUrl.toString()
  }

  if (playlistId) {
    const embedUrl = new URL('https://www.youtube.com/embed/videoseries')
    embedUrl.searchParams.set('list', playlistId)
    embedUrl.searchParams.set('autoplay', '1')
    embedUrl.searchParams.set('rel', '0')
    embedUrl.searchParams.set('playsinline', '1')
    return embedUrl.toString()
  }

  return ''
}

function getStoredFocusMusicUrl() {
  try {
    return window.localStorage.getItem(FOCUS_MUSIC_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function storeFocusMusicUrl(url) {
  try {
    if (url) {
      window.localStorage.setItem(FOCUS_MUSIC_STORAGE_KEY, url)
    } else {
      window.localStorage.removeItem(FOCUS_MUSIC_STORAGE_KEY)
    }
  } catch {
    // Local storage can be blocked in private browsing contexts.
  }
}

function playSound(src, volume = 0.5) {
  try {
    const audio = new Audio(src)
    const cleanUp = () => activeSounds.delete(audio)

    audio.volume = Math.min(1, Math.max(0, volume))
    audio.addEventListener('ended', cleanUp, { once: true })
    audio.addEventListener('error', cleanUp, { once: true })
    activeSounds.add(audio)

    const playPromise = audio.play()
    if (playPromise?.catch) playPromise.catch(cleanUp)
  } catch {
    // Browser autoplay rules can reject sound; timer behavior should continue.
  }
}

function playSessionSwitchSound() {
  playSound(sessionSwitchSound, 0.5)
}

function playSessionStartSound() {
  playSound(taskStartSound, 0.48)
}

function playTaskCompleteSound() {
  playSound(taskCompleteSound, 0.58)
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

function FocusMusicPlayer() {
  const [open, setOpen] = useState(false)
  const [music, setMusic] = useState(() => {
    const sourceUrl = getStoredFocusMusicUrl()

    return {
      embedUrl: createYouTubeEmbedUrl(sourceUrl),
      error: '',
      sourceUrl,
    }
  })
  const hasMusic = Boolean(music.embedUrl)
  const shouldRenderPanel = open || hasMusic

  function updateSourceUrl(sourceUrl) {
    setMusic((current) => ({ ...current, error: '', sourceUrl }))
  }

  function playMusic(event) {
    event.preventDefault()

    const embedUrl = createYouTubeEmbedUrl(music.sourceUrl)
    if (!embedUrl) {
      setMusic((current) => ({
        ...current,
        embedUrl: '',
        error: 'Dán link YouTube video hoặc playlist hợp lệ.',
      }))
      return
    }

    storeFocusMusicUrl(music.sourceUrl)
    setMusic((current) => ({ ...current, embedUrl, error: '' }))
    setOpen(true)
  }

  function clearMusic() {
    storeFocusMusicUrl('')
    setMusic({ embedUrl: '', error: '', sourceUrl: '' })
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Nhạc nền"
        aria-label="Nhạc nền"
        className={cn(
          'border-white/24 bg-black/24 text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950',
          open && 'border-white bg-white text-slate-950 hover:bg-white',
          hasMusic && !open && 'border-mint/80 text-mint hover:text-slate-950',
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <Music />
      </Button>

      <AnimatePresence>
        {shouldRenderPanel ? (
          <motion.div
            className={cn(
              'absolute right-0 top-12 z-30 w-[min(calc(100vw-2rem),24rem)] rounded-lg border border-white/18 bg-black/78 p-3 text-left shadow-[0_16px_48px_rgba(0,0,0,0.38)] backdrop-blur',
              !open && 'pointer-events-none fixed -bottom-6 right-4 top-auto h-px w-px overflow-hidden border-0 p-0 opacity-0',
            )}
            initial={false}
            animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -6, scale: 0.98 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <form className="grid gap-3" onSubmit={playMusic}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-white">Nhạc nền</p>
                <div className="flex items-center gap-2">
                  {hasMusic ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Ẩn tab nhạc"
                        aria-label="Ẩn tab nhạc"
                        className="size-8 border-white/20 bg-white/10 text-white shadow-none hover:bg-white hover:text-slate-950"
                        onClick={() => setOpen(false)}
                      >
                        <EyeOff />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Tắt nhạc nền"
                        aria-label="Tắt nhạc nền"
                        className="size-8 border-white/20 bg-white/10 text-white shadow-none hover:bg-white hover:text-slate-950"
                        onClick={clearMusic}
                      >
                        <X />
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  aria-label="Link YouTube"
                  placeholder="https://youtube.com/watch?v=..."
                  value={music.sourceUrl}
                  className="h-10 border-white/18 bg-white text-slate-950 placeholder:text-slate-500"
                  onChange={(event) => updateSourceUrl(event.target.value)}
                />
                <Button type="submit" className="h-10 px-3">
                  <Play />
                  Phát
                </Button>
              </div>
              {music.error ? <p className="text-xs font-semibold text-rose-100">{music.error}</p> : null}
            </form>

            {hasMusic ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-white/12 bg-black">
                <iframe
                  key={music.embedUrl}
                  title="Nhạc nền YouTube"
                  src={music.embedUrl}
                  className="h-24 w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function FocusTaskPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, loading, error, updateTask } = useTasks()
  const task = useMemo(() => tasks.find((item) => item.id === taskId), [taskId, tasks])
  const [mode, setMode] = useState('focus')
  const [durations, setDurations] = useState(DEFAULT_DURATIONS)
  const [secondsByMode, setSecondsByMode] = useState(() => createSecondsByMode(DEFAULT_DURATIONS))
  const [running, setRunning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTaskInfo, setShowTaskInfo] = useState(true)
  const [actionError, setActionError] = useState('')
  const hasPlayedTaskStartSound = useRef(false)

  useEffect(() => {
    hasPlayedTaskStartSound.current = false
  }, [taskId])

  useEffect(() => {
    if (!running) return undefined

    const intervalId = window.setInterval(() => {
      setSecondsByMode((current) => {
        const currentSeconds = current[mode]
        if (currentSeconds > 1) return { ...current, [mode]: currentSeconds - 1 }

        const nextMode = getNextMode(mode)
        setMode(nextMode)
        setRunning(false)
        playSessionSwitchSound()
        return { ...current, [mode]: 0 }
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [mode, running])

  const currentMode = FOCUS_MODES[mode]
  const currentDuration = durations[mode] * 60
  const secondsLeft = secondsByMode[mode]
  const progress = Math.min(100, Math.max(0, Math.round(((currentDuration - secondsLeft) / currentDuration) * 100)))
  const completionBlocked = task ? !canCompleteTaskWithUpdates(task, { status: 'completed' }) : false
  const overdue = task ? isTaskOverdue(task) : false

  function updateDuration(key, value) {
    const minutes = clampMinutes(value)
    setDurations((current) => ({ ...current, [key]: minutes }))

    if (running && mode === key) return

    setSecondsByMode((current) => ({ ...current, [key]: minutes * 60 }))
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setRunning(false)
  }

  function resetTimer() {
    setRunning(false)
    setSecondsByMode((current) => ({ ...current, [mode]: durations[mode] * 60 }))
  }

  function toggleRunning() {
    setRunning((current) => {
      if (!current && !hasPlayedTaskStartSound.current) {
        playSessionStartSound()
        hasPlayedTaskStartSound.current = true
      }
      if (!current && secondsByMode[mode] <= 0) {
        setSecondsByMode((currentSecondsByMode) => ({ ...currentSecondsByMode, [mode]: durations[mode] * 60 }))
      }
      return !current
    })
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
      playTaskCompleteSound()
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
            <FocusMusicPlayer />
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
              onClick={toggleRunning}
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

        <AnimatePresence initial={false}>
          {showTaskInfo ? (
            <motion.section
              className="fixed inset-x-3 bottom-20 z-20 mx-auto max-w-md overflow-hidden rounded-lg border border-white/16 bg-slate-950/58 text-left shadow-[0_18px_54px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[410px]"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className="h-1 bg-gradient-to-r from-mint via-butter to-blush" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-black text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.12)]">
                      <Target className="size-3.5" />
                      Task đang làm
                    </span>
                    <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]} className="h-7 rounded-full px-3 text-xs font-black">
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    <Badge variant={STATUS_BADGE_VARIANTS[task.status]} className="h-7 rounded-full px-3 text-xs font-black">
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Ẩn thông tin task"
                    aria-label="Ẩn thông tin task"
                    className="size-8 border-white/20 bg-white/10 text-white shadow-none hover:bg-white hover:text-slate-950"
                    onClick={() => setShowTaskInfo(false)}
                  >
                    <EyeOff />
                  </Button>
                </div>

                <h1 className="mt-3 break-words text-xl font-black leading-snug text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                  {task.title}
                </h1>
                {task.description ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/72">{task.description}</p> : null}

                <div
                  className={cn(
                    'mt-3 inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-bold',
                    overdue ? 'border-peach/70 bg-peach/90 text-rose-950' : 'border-white/18 bg-white/10 text-white/82',
                  )}
                >
                  <CalendarDays className="size-4" />
                  Hạn {formatDate(task.dueDate)}
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.div
              className="fixed inset-x-3 bottom-20 z-20 mx-auto flex max-w-md justify-start lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[410px]"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full border-white/16 bg-slate-950/58 px-4 text-white shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl hover:bg-white hover:text-slate-950"
                onClick={() => setShowTaskInfo(true)}
              >
                <Eye />
                Hiện task
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

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
