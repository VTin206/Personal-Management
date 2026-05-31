import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Coffee,
  Eye,
  EyeOff,
  Gauge,
  Headphones,
  Home,
  Link2,
  Palette,
  Maximize2,
  Music,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Settings2,
  Sparkles,
  Square,
  Target,
  Timer,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

import animeCatsFocusBackground from '@/assets/focus-anime-cats.jpg'
import gojoFocusBackground from '@/assets/focus-gojo-satoru.jpg'
import mountainGrandeurFocusBackground from '@/assets/focus-mountain-grandeur.jpg'
import rainBooksFocusBackground from '@/assets/focus-rain-books.jpg'
import focusSkyBackground from '@/assets/focus-sky.jpg'
import starryValleyFocusBackground from '@/assets/focus-starry-valley.jpg'
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
import { formatTaskDueDateTime } from '@/utils/date'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import {
  buildSessionTimeUpdates,
  canCompleteTaskWithUpdates,
  formatFocusDuration,
  getTaskFocusLog,
  getTaskFocusSeconds,
  getTaskLongBreakLog,
  getTaskLongBreakSeconds,
  getTaskSessionSeconds,
  getTaskShortBreakLog,
  getTaskShortBreakSeconds,
  getTaskTotalSessionSeconds,
  isActiveWorkTask,
  isTaskOverdue,
} from '@/utils/taskStats'
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
const FOCUS_THEME_STORAGE_KEY = 'pastel-focus-theme'
const DEFAULT_FOCUS_THEME_KEY = 'pastel-sky'
const FOCUS_THEMES = [
  {
    key: DEFAULT_FOCUS_THEME_KEY,
    label: 'Pastel Sky',
    description: 'Sáng nhẹ, thư giãn',
    image: focusSkyBackground,
    imageClassName: 'object-center',
    previewClassName: 'object-center',
    pageClassName: 'bg-slate-950',
    overlayClassName: 'bg-[linear-gradient(180deg,rgba(7,9,20,0.12)_0%,rgba(7,13,25,0.34)_52%,rgba(7,9,20,0.72)_100%)]',
    glowClassName: 'bg-[radial-gradient(circle_at_50%_36%,rgba(255,241,168,0.14),transparent_34%)]',
    modeButtonClassName:
      'border-white/25 bg-black/24 text-white hover:border-white hover:bg-white hover:text-slate-950',
    activeModeButtonClassName: 'border-white bg-white text-slate-950 hover:bg-white',
    timerChipClassName: 'bg-black/30 text-white shadow-[0_8px_28px_rgba(0,0,0,0.22)]',
    timerTextClassName: 'text-white drop-shadow-[0_16px_42px_rgba(0,0,0,0.48)]',
    progressClassName: 'bg-black/35 [&_div]:bg-white',
    controlButtonClassName:
      'border-white/24 bg-black/24 text-white hover:border-white hover:bg-white hover:text-slate-950',
    startButtonClassName: {
      idle: 'from-blush via-butter to-sky text-slate-950 shadow-[0_18px_42px_rgba(255,154,118,0.28)]',
      running: 'from-sky via-lavender to-mint text-slate-950 shadow-[0_18px_42px_rgba(125,211,252,0.24)]',
    },
    taskPanelClassName: 'border-white/16 bg-slate-950/58 shadow-[0_18px_54px_rgba(0,0,0,0.38)]',
    taskAccentClassName: 'from-mint via-butter to-blush',
    taskStatusClassName: 'bg-white text-slate-950',
    metaClassName: 'border-white/18 bg-white/10 text-white/82',
    hiddenTaskButtonClassName:
      'border-white/16 bg-slate-950/58 text-white shadow-[0_14px_34px_rgba(0,0,0,0.28)] hover:bg-white hover:text-slate-950',
    completeButtonClassName: 'shadow-[0_14px_34px_rgba(53,196,154,0.28)]',
  },
  {
    key: 'gojo-blue',
    label: 'Gojo Blue',
    description: 'Xanh băng, tương phản cao',
    image: gojoFocusBackground,
    imageClassName: 'object-[50%_38%]',
    previewClassName: 'object-[50%_36%]',
    pageClassName: 'bg-[#020817]',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(1,8,22,0.12)_0%,rgba(2,15,35,0.44)_46%,rgba(1,6,18,0.86)_100%)]',
    glowClassName:
      'bg-[radial-gradient(circle_at_50%_28%,rgba(56,189,248,0.26),transparent_30%),radial-gradient(circle_at_66%_36%,rgba(14,165,233,0.18),transparent_28%)]',
    modeButtonClassName:
      'border-cyan-200/30 bg-slate-950/34 text-cyan-50 hover:border-cyan-100 hover:bg-cyan-100 hover:text-slate-950',
    activeModeButtonClassName: 'border-cyan-100 bg-cyan-100 text-slate-950 hover:bg-cyan-100',
    timerChipClassName:
      'border border-cyan-200/20 bg-slate-950/44 text-cyan-50 shadow-[0_12px_34px_rgba(8,47,73,0.34)]',
    timerTextClassName: 'text-cyan-50 drop-shadow-[0_0_24px_rgba(56,189,248,0.42)]',
    progressClassName: 'bg-slate-950/52 [&_div]:bg-cyan-200',
    controlButtonClassName:
      'border-cyan-200/28 bg-slate-950/38 text-cyan-50 hover:border-cyan-100 hover:bg-cyan-100 hover:text-slate-950',
    startButtonClassName: {
      idle: 'from-cyan-100 via-sky to-blue-300 text-slate-950 shadow-[0_18px_46px_rgba(56,189,248,0.36)]',
      running: 'from-blue-300 via-cyan-200 to-white text-slate-950 shadow-[0_18px_46px_rgba(125,211,252,0.34)]',
    },
    taskPanelClassName: 'border-cyan-100/22 bg-slate-950/66 shadow-[0_22px_62px_rgba(8,47,73,0.42)]',
    taskAccentClassName: 'from-cyan-200 via-sky to-blue-500',
    taskStatusClassName: 'bg-cyan-100 text-slate-950 shadow-[0_8px_28px_rgba(56,189,248,0.18)]',
    metaClassName: 'border-cyan-100/24 bg-cyan-100/12 text-cyan-50',
    hiddenTaskButtonClassName:
      'border-cyan-100/22 bg-slate-950/66 text-cyan-50 shadow-[0_14px_38px_rgba(8,47,73,0.34)] hover:bg-cyan-100 hover:text-slate-950',
    completeButtonClassName: 'bg-cyan-100 text-slate-950 shadow-[0_14px_38px_rgba(56,189,248,0.34)] hover:bg-white',
  },
  {
    key: 'rain-study',
    label: 'Rain Study',
    description: 'Warm desk, rainy night',
    image: rainBooksFocusBackground,
    imageClassName: 'object-[50%_48%]',
    previewClassName: 'object-[50%_48%]',
    pageClassName: 'bg-[#070a12]',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(3,7,18,0.18)_0%,rgba(15,23,42,0.48)_48%,rgba(7,10,18,0.88)_100%)]',
    glowClassName:
      'bg-[radial-gradient(circle_at_19%_16%,rgba(251,191,36,0.22),transparent_24%),radial-gradient(circle_at_72%_38%,rgba(56,189,248,0.14),transparent_34%)]',
    modeButtonClassName:
      'border-amber-100/28 bg-slate-950/42 text-amber-50 hover:border-amber-100 hover:bg-amber-100 hover:text-slate-950',
    activeModeButtonClassName: 'border-amber-100 bg-amber-100 text-slate-950 hover:bg-amber-100',
    timerChipClassName:
      'border border-amber-100/20 bg-slate-950/50 text-amber-50 shadow-[0_12px_34px_rgba(120,53,15,0.28)]',
    timerTextClassName: 'text-amber-50 drop-shadow-[0_0_26px_rgba(251,191,36,0.34)]',
    progressClassName: 'bg-slate-950/56 [&_div]:bg-amber-100',
    controlButtonClassName:
      'border-amber-100/26 bg-slate-950/44 text-amber-50 hover:border-amber-100 hover:bg-amber-100 hover:text-slate-950',
    startButtonClassName: {
      idle: 'from-amber-100 via-orange-200 to-sky-300 text-slate-950 shadow-[0_18px_46px_rgba(251,191,36,0.28)]',
      running: 'from-sky-300 via-amber-100 to-orange-200 text-slate-950 shadow-[0_18px_46px_rgba(56,189,248,0.26)]',
    },
    taskPanelClassName: 'border-amber-100/20 bg-slate-950/68 shadow-[0_22px_62px_rgba(15,23,42,0.48)]',
    taskAccentClassName: 'from-amber-100 via-orange-200 to-sky-300',
    taskStatusClassName: 'bg-amber-100 text-slate-950 shadow-[0_8px_28px_rgba(251,191,36,0.18)]',
    metaClassName: 'border-amber-100/24 bg-amber-100/12 text-amber-50',
    hiddenTaskButtonClassName:
      'border-amber-100/20 bg-slate-950/68 text-amber-50 shadow-[0_14px_38px_rgba(15,23,42,0.34)] hover:bg-amber-100 hover:text-slate-950',
    completeButtonClassName: 'bg-amber-100 text-slate-950 shadow-[0_14px_38px_rgba(251,191,36,0.30)] hover:bg-white',
  },
  {
    key: 'starry-valley',
    label: 'Starry Valley',
    description: 'Moonlit sky, deep focus',
    image: starryValleyFocusBackground,
    imageClassName: 'object-center',
    previewClassName: 'object-center',
    pageClassName: 'bg-[#030712]',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(3,7,18,0.10)_0%,rgba(15,23,42,0.38)_45%,rgba(3,7,18,0.88)_100%)]',
    glowClassName:
      'bg-[radial-gradient(circle_at_77%_18%,rgba(254,243,199,0.24),transparent_18%),radial-gradient(circle_at_52%_24%,rgba(129,140,248,0.20),transparent_34%)]',
    modeButtonClassName:
      'border-indigo-100/28 bg-slate-950/42 text-indigo-50 hover:border-indigo-100 hover:bg-indigo-100 hover:text-slate-950',
    activeModeButtonClassName: 'border-indigo-100 bg-indigo-100 text-slate-950 hover:bg-indigo-100',
    timerChipClassName:
      'border border-indigo-100/20 bg-slate-950/48 text-indigo-50 shadow-[0_12px_34px_rgba(49,46,129,0.34)]',
    timerTextClassName: 'text-indigo-50 drop-shadow-[0_0_28px_rgba(129,140,248,0.42)]',
    progressClassName: 'bg-slate-950/56 [&_div]:bg-indigo-100',
    controlButtonClassName:
      'border-indigo-100/26 bg-slate-950/44 text-indigo-50 hover:border-indigo-100 hover:bg-indigo-100 hover:text-slate-950',
    startButtonClassName: {
      idle: 'from-indigo-100 via-sky to-amber-100 text-slate-950 shadow-[0_18px_46px_rgba(129,140,248,0.34)]',
      running: 'from-sky-200 via-indigo-200 to-violet-200 text-slate-950 shadow-[0_18px_46px_rgba(56,189,248,0.28)]',
    },
    taskPanelClassName: 'border-indigo-100/20 bg-slate-950/68 shadow-[0_22px_62px_rgba(30,27,75,0.46)]',
    taskAccentClassName: 'from-indigo-100 via-sky to-amber-100',
    taskStatusClassName: 'bg-indigo-100 text-slate-950 shadow-[0_8px_28px_rgba(129,140,248,0.18)]',
    metaClassName: 'border-indigo-100/24 bg-indigo-100/12 text-indigo-50',
    hiddenTaskButtonClassName:
      'border-indigo-100/20 bg-slate-950/68 text-indigo-50 shadow-[0_14px_38px_rgba(30,27,75,0.34)] hover:bg-indigo-100 hover:text-slate-950',
    completeButtonClassName: 'bg-indigo-100 text-slate-950 shadow-[0_14px_38px_rgba(129,140,248,0.32)] hover:bg-white',
  },
  {
    key: 'mountain-dawn',
    label: 'Mountain Dawn',
    description: 'Fresh green, clear air',
    image: mountainGrandeurFocusBackground,
    imageClassName: 'object-[50%_44%]',
    previewClassName: 'object-[50%_44%]',
    pageClassName: 'bg-[#052e16]',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(5,46,22,0.16)_0%,rgba(6,78,59,0.38)_48%,rgba(2,44,34,0.84)_100%)]',
    glowClassName:
      'bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.20),transparent_24%),radial-gradient(circle_at_44%_62%,rgba(187,247,208,0.18),transparent_34%)]',
    modeButtonClassName:
      'border-emerald-100/30 bg-emerald-950/38 text-emerald-50 hover:border-emerald-100 hover:bg-emerald-100 hover:text-emerald-950',
    activeModeButtonClassName: 'border-emerald-100 bg-emerald-100 text-emerald-950 hover:bg-emerald-100',
    timerChipClassName:
      'border border-emerald-100/20 bg-emerald-950/44 text-emerald-50 shadow-[0_12px_34px_rgba(6,78,59,0.34)]',
    timerTextClassName: 'text-white drop-shadow-[0_12px_30px_rgba(2,44,34,0.74)]',
    progressClassName: 'bg-emerald-950/54 [&_div]:bg-emerald-100',
    controlButtonClassName:
      'border-emerald-100/28 bg-emerald-950/40 text-emerald-50 hover:border-emerald-100 hover:bg-emerald-100 hover:text-emerald-950',
    startButtonClassName: {
      idle: 'from-lime-100 via-emerald-200 to-sky-200 text-emerald-950 shadow-[0_18px_46px_rgba(74,222,128,0.30)]',
      running: 'from-sky-200 via-emerald-100 to-lime-200 text-emerald-950 shadow-[0_18px_46px_rgba(45,212,191,0.26)]',
    },
    taskPanelClassName: 'border-emerald-100/22 bg-emerald-950/66 shadow-[0_22px_62px_rgba(6,78,59,0.46)]',
    taskAccentClassName: 'from-lime-100 via-emerald-200 to-sky-200',
    taskStatusClassName: 'bg-emerald-100 text-emerald-950 shadow-[0_8px_28px_rgba(74,222,128,0.18)]',
    metaClassName: 'border-emerald-100/24 bg-emerald-100/12 text-emerald-50',
    hiddenTaskButtonClassName:
      'border-emerald-100/22 bg-emerald-950/66 text-emerald-50 shadow-[0_14px_38px_rgba(6,78,59,0.34)] hover:bg-emerald-100 hover:text-emerald-950',
    completeButtonClassName: 'bg-emerald-100 text-emerald-950 shadow-[0_14px_38px_rgba(74,222,128,0.32)] hover:bg-white',
  },
  {
    key: 'cat-desk',
    label: 'Cat Desk',
    description: 'Cozy desk, soft amber',
    image: animeCatsFocusBackground,
    imageClassName: 'object-[50%_50%]',
    previewClassName: 'object-[50%_50%]',
    pageClassName: 'bg-[#1c1917]',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(28,25,23,0.14)_0%,rgba(41,37,36,0.40)_48%,rgba(28,25,23,0.84)_100%)]',
    glowClassName:
      'bg-[radial-gradient(circle_at_42%_42%,rgba(251,191,36,0.20),transparent_30%),radial-gradient(circle_at_76%_38%,rgba(45,212,191,0.12),transparent_28%)]',
    modeButtonClassName:
      'border-orange-100/30 bg-stone-950/38 text-orange-50 hover:border-orange-100 hover:bg-orange-100 hover:text-stone-950',
    activeModeButtonClassName: 'border-orange-100 bg-orange-100 text-stone-950 hover:bg-orange-100',
    timerChipClassName:
      'border border-orange-100/20 bg-stone-950/48 text-orange-50 shadow-[0_12px_34px_rgba(120,53,15,0.28)]',
    timerTextClassName: 'text-orange-50 drop-shadow-[0_0_24px_rgba(251,146,60,0.34)]',
    progressClassName: 'bg-stone-950/56 [&_div]:bg-orange-100',
    controlButtonClassName:
      'border-orange-100/28 bg-stone-950/42 text-orange-50 hover:border-orange-100 hover:bg-orange-100 hover:text-stone-950',
    startButtonClassName: {
      idle: 'from-orange-100 via-amber-200 to-teal-200 text-stone-950 shadow-[0_18px_46px_rgba(251,146,60,0.28)]',
      running: 'from-teal-200 via-orange-100 to-amber-200 text-stone-950 shadow-[0_18px_46px_rgba(45,212,191,0.24)]',
    },
    taskPanelClassName: 'border-orange-100/22 bg-stone-950/66 shadow-[0_22px_62px_rgba(28,25,23,0.48)]',
    taskAccentClassName: 'from-orange-100 via-amber-200 to-teal-200',
    taskStatusClassName: 'bg-orange-100 text-stone-950 shadow-[0_8px_28px_rgba(251,146,60,0.18)]',
    metaClassName: 'border-orange-100/24 bg-orange-100/12 text-orange-50',
    hiddenTaskButtonClassName:
      'border-orange-100/22 bg-stone-950/66 text-orange-50 shadow-[0_14px_38px_rgba(28,25,23,0.34)] hover:bg-orange-100 hover:text-stone-950',
    completeButtonClassName: 'bg-orange-100 text-stone-950 shadow-[0_14px_38px_rgba(251,146,60,0.32)] hover:bg-white',
  },
]
const FOCUS_THEME_MAP = Object.fromEntries(FOCUS_THEMES.map((theme) => [theme.key, theme]))

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

function getTimerAnchorSecondsLeft(anchor, now = Date.now()) {
  const elapsedSeconds = Math.max(0, Math.floor((now - anchor.startedAt) / 1000))
  return Math.max(0, anchor.secondsAtStart - elapsedSeconds)
}

function createTimerAnchor(mode, secondsAtStart, startedAt = Date.now()) {
  return {
    mode,
    secondsAtStart,
    startedAt,
    lastSavedAt: startedAt,
  }
}

function createTaskSessionStats(task) {
  return {
    taskId: task.id,
    focusSeconds: getTaskFocusSeconds(task),
    focusLog: getTaskFocusLog(task),
    shortBreakSeconds: getTaskShortBreakSeconds(task),
    shortBreakLog: getTaskShortBreakLog(task),
    longBreakSeconds: getTaskLongBreakSeconds(task),
    longBreakLog: getTaskLongBreakLog(task),
  }
}

function getTaskSessionStatsTotal(stats) {
  return (stats.focusSeconds ?? 0) + (stats.shortBreakSeconds ?? 0) + (stats.longBreakSeconds ?? 0)
}

const MAX_TIMER_SYNC_SESSIONS = 1000

const FOCUS_MUSIC_STORAGE_KEY = 'pastel-focus-music-url'
const FOCUS_MUSIC_VOLUME_KEY = 'pastel-focus-music-volume'
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

function getYouTubeEmbedOrigin() {
  try {
    return window.location.origin
  } catch {
    return ''
  }
}

function getYouTubeSourceInfo(rawUrl) {
  const trimmedUrl = rawUrl.trim()
  if (!trimmedUrl) return null

  const urlWithProtocol = /^(https?:)?\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`
  let url

  try {
    url = new URL(urlWithProtocol)
  } catch {
    return null
  }

  if (!isYouTubeHost(url.hostname)) return null

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

  if (!videoId && !playlistId) return null

  return {
    playlistId,
    thumbnailUrl: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '',
    videoId,
  }
}

function createYouTubeEmbedUrl(rawUrl) {
  const sourceInfo = getYouTubeSourceInfo(rawUrl)
  if (!sourceInfo) return ''

  const { playlistId, videoId } = sourceInfo
  const origin = getYouTubeEmbedOrigin()

  if (videoId) {
    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`)
    embedUrl.searchParams.set('autoplay', '1')
    embedUrl.searchParams.set('enablejsapi', '1')
    embedUrl.searchParams.set('rel', '0')
    embedUrl.searchParams.set('playsinline', '1')
    if (origin) embedUrl.searchParams.set('origin', origin)
    if (playlistId) embedUrl.searchParams.set('list', playlistId)
    return embedUrl.toString()
  }

  if (playlistId) {
    const embedUrl = new URL('https://www.youtube.com/embed/videoseries')
    embedUrl.searchParams.set('list', playlistId)
    embedUrl.searchParams.set('autoplay', '1')
    embedUrl.searchParams.set('enablejsapi', '1')
    embedUrl.searchParams.set('rel', '0')
    embedUrl.searchParams.set('playsinline', '1')
    if (origin) embedUrl.searchParams.set('origin', origin)
    return embedUrl.toString()
  }

  return ''
}

function getStoredFocusMusicVolume() {
  try {
    const storedVolume = Number(window.localStorage.getItem(FOCUS_MUSIC_VOLUME_KEY))
    if (!Number.isFinite(storedVolume)) return 70
    return Math.min(100, Math.max(0, Math.round(storedVolume)))
  } catch {
    return 70
  }
}

function getStoredFocusMusicUrl() {
  try {
    return window.localStorage.getItem(FOCUS_MUSIC_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function getStoredFocusThemeKey() {
  try {
    const themeKey = window.localStorage.getItem(FOCUS_THEME_STORAGE_KEY)
    return FOCUS_THEME_MAP[themeKey] ? themeKey : DEFAULT_FOCUS_THEME_KEY
  } catch {
    return DEFAULT_FOCUS_THEME_KEY
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
    // Local storage có thể bị chặn ở một số trình duyệt.
  }
}

function storeFocusMusicVolume(volume) {
  try {
    window.localStorage.setItem(FOCUS_MUSIC_VOLUME_KEY, String(volume))
  } catch {
    // Local storage có thể bị chặn ở một số trình duyệt.
  }
}

function storeFocusThemeKey(themeKey) {
  try {
    window.localStorage.setItem(FOCUS_THEME_STORAGE_KEY, themeKey)
  } catch {
    // Local storage có thể bị chặn ở một số trình duyệt.
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
    // Trình duyệt có thể chặn âm thanh tự phát, bộ đếm vẫn tiếp tục chạy.
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

function FocusBackground({ theme }) {
  return (
    <>
      <img
        src={theme.image}
        alt=""
        aria-hidden="true"
        decoding="async"
        className={cn('pointer-events-none fixed inset-0 h-dvh w-dvw object-cover', theme.imageClassName)}
      />
      <div className={cn('fixed inset-0', theme.overlayClassName)} />
      <div className={cn('fixed inset-0', theme.glowClassName)} />
    </>
  )
}

function FocusModeButton({ modeKey, active, onClick, theme }) {
  const mode = FOCUS_MODES[modeKey]
  const Icon = mode.icon

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'h-9 rounded-full px-4 text-xs font-bold uppercase shadow-none',
        theme.modeButtonClassName,
        active && theme.activeModeButtonClassName,
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

function FocusThemeOption({ theme, selected, onClick }) {
  return (
    <button
      type="button"
      className={cn(
        'group grid overflow-hidden rounded-lg border bg-slate-50 text-left transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-soft',
        selected ? 'border-slate-950 ring-2 ring-slate-950/10' : 'border-slate-200',
      )}
      onClick={onClick}
    >
      <span className="relative block aspect-[16/9] overflow-hidden bg-slate-900">
        <img src={theme.image} alt="" className={cn('size-full object-cover transition group-hover:scale-105', theme.previewClassName)} />
        <span className={cn('absolute inset-0', theme.overlayClassName)} />
        {selected ? (
          <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white text-slate-950 shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
            <Check className="size-4" />
          </span>
        ) : null}
      </span>
      <span className="grid gap-1 p-3">
        <span className="text-sm font-black text-slate-950">{theme.label}</span>
        <span className="text-xs font-medium text-slate-500">{theme.description}</span>
      </span>
    </button>
  )
}

function FocusIconButton({ label, icon: Icon, onClick, asChild = false, children, className }) {
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
      className={cn(
        'border-white/24 bg-black/24 text-white shadow-none hover:border-white hover:bg-white hover:text-slate-950',
        className,
      )}
      onClick={onClick}
    >
      {asChild ? children : content}
    </Button>
  )
}

function createFocusMusicState(sourceUrl) {
  const sourceInfo = getYouTubeSourceInfo(sourceUrl)
  const embedUrl = sourceInfo ? createYouTubeEmbedUrl(sourceUrl) : ''

  return {
    embedUrl,
    error: '',
    playlistId: sourceInfo?.playlistId ?? '',
    sourceUrl,
    thumbnailUrl: sourceInfo?.thumbnailUrl ?? '',
    videoId: sourceInfo?.videoId ?? '',
  }
}

function sendYouTubeCommand(frameRef, command, args = []) {
  const frameWindow = frameRef.current?.contentWindow
  if (!frameWindow) return

  frameWindow.postMessage(JSON.stringify({ event: 'command', func: command, args }), '*')
}

function FocusMusicPlayer({ theme }) {
  const playerFrameRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(() => Boolean(createYouTubeEmbedUrl(getStoredFocusMusicUrl())))
  const [volume, setVolume] = useState(() => getStoredFocusMusicVolume())
  const [music, setMusic] = useState(() => createFocusMusicState(getStoredFocusMusicUrl()))
  const hasMusic = Boolean(music.embedUrl)
  const muted = volume <= 0
  const shouldRenderPanel = open || hasMusic
  const shouldRenderPlayer = hasMusic && playing

  useEffect(() => {
    if (!shouldRenderPlayer) return

    sendYouTubeCommand(playerFrameRef, 'setVolume', [volume])
    sendYouTubeCommand(playerFrameRef, 'playVideo')
  }, [shouldRenderPlayer, volume])

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
    setMusic(createFocusMusicState(music.sourceUrl))
    setPlaying(true)
    setOpen(true)
  }

  function clearMusic() {
    sendYouTubeCommand(playerFrameRef, 'stopVideo')
    storeFocusMusicUrl('')
    setMusic(createFocusMusicState(''))
    setPlaying(false)
    setOpen(false)
  }

  function togglePlaying() {
    if (!hasMusic) return

    if (playing) sendYouTubeCommand(playerFrameRef, 'stopVideo')
    setPlaying((current) => !current)
  }

  function changeVolume(nextVolume) {
    const normalizedVolume = Math.min(100, Math.max(0, Math.round(Number(nextVolume) || 0)))

    setVolume(normalizedVolume)
    storeFocusMusicVolume(normalizedVolume)
  }

  function toggleMute() {
    changeVolume(muted ? 70 : 0)
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
          'shadow-none',
          theme.controlButtonClassName,
          open && theme.activeModeButtonClassName,
          hasMusic && !open && theme.activeModeButtonClassName,
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <Music />
      </Button>

      <AnimatePresence>
        {shouldRenderPanel ? (
          <motion.div
            className={cn(
              'absolute right-0 top-12 z-30 w-[min(calc(100vw-2rem),28rem)] overflow-hidden rounded-lg border border-white/18 bg-slate-950/88 text-left text-white shadow-[0_20px_70px_rgba(0,0,0,0.46)] backdrop-blur-xl',
              !open && 'pointer-events-none fixed -bottom-6 right-4 top-auto h-px w-px border-0 opacity-0',
            )}
            initial={false}
            animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -6, scale: 0.98 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className="border-b border-white/12 bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/16 bg-white/12">
                    {music.thumbnailUrl ? (
                      <img src={music.thumbnailUrl} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Headphones className="size-5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-black">Nhạc nền</p>
                    <p className="mt-1 truncate text-xs font-semibold text-white/62">
                      {hasMusic ? (playing ? 'Đang phát nguồn YouTube đã lưu' : 'Đã tạm dừng nguồn YouTube') : 'Dán video hoặc playlist YouTube'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-black/24 px-3 py-1 text-xs font-bold text-white/70">
                  <span className={cn('size-2 rounded-full', playing ? 'bg-mint' : 'bg-white/30')} />
                  {hasMusic ? (playing ? 'Đang phát' : 'Tạm dừng') : 'Chờ'}
                </span>
              </div>
              {shouldRenderPlayer ? (
                <div className="mt-4 overflow-hidden rounded-lg border border-white/12 bg-black">
                  <iframe
                    ref={playerFrameRef}
                    key={music.embedUrl}
                    title="Nhạc nền YouTube"
                    src={music.embedUrl}
                    className={cn('h-48 w-full', !open && 'h-px opacity-0')}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    onLoad={() => {
                      sendYouTubeCommand(playerFrameRef, 'setVolume', [volume])
                      sendYouTubeCommand(playerFrameRef, playing ? 'playVideo' : 'pauseVideo')
                    }}
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : hasMusic ? (
                <div className="mt-4 grid gap-3 rounded-lg border border-white/12 bg-black/24 p-4 text-sm font-semibold text-white/72">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/16 bg-white/12">
                      {music.thumbnailUrl ? (
                        <img src={music.thumbnailUrl} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Headphones className="size-5" />
                      )}
                    </span>
                    <span>Nhạc đã tạm dừng. Bấm phát lại để mở trình phát.</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-white/12 bg-black/24 p-4 text-sm font-semibold text-white/62">
                  Dán link YouTube rồi bấm Phát để mở trình phát.
                </div>
              )}
            </div>

            <form className="grid gap-3 p-4" onSubmit={playMusic}>
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-white/68">
                  <Radio className="size-4" />
                  Nguồn phát
                </p>
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
                        <Square />
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    aria-label="Link YouTube"
                    placeholder="https://youtube.com/watch?v=..."
                    value={music.sourceUrl}
                    className="h-10 border-white/18 bg-white pl-9 text-slate-950 placeholder:text-slate-500"
                    onChange={(event) => updateSourceUrl(event.target.value)}
                  />
                </div>
                <Button type="submit" className="h-10 px-3">
                  <Play />
                  Phát
                </Button>
              </div>
              <div className="grid gap-3 rounded-lg border border-white/12 bg-white/8 p-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/10 text-white shadow-none hover:bg-white hover:text-slate-950"
                    disabled={!hasMusic}
                    onClick={togglePlaying}
                  >
                    {playing ? <Pause /> : <Play />}
                    {playing ? 'Tạm dừng' : 'Phát lại'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title={muted ? 'Bật tiếng' : 'Tắt tiếng'}
                    aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
                    className="size-9 border-white/20 bg-white/10 text-white shadow-none hover:bg-white hover:text-slate-950"
                    disabled={!hasMusic}
                    onClick={toggleMute}
                  >
                    {muted ? <VolumeX /> : <Volume2 />}
                  </Button>
                  <span className="ml-auto text-xs font-black text-white/62">{volume}%</span>
                </div>
                <input
                  aria-label="Âm lượng nhạc nền"
                  className="h-2 w-full cursor-pointer accent-sky disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!hasMusic}
                  max="100"
                  min="0"
                  type="range"
                  value={volume}
                  onChange={(event) => changeVolume(event.target.value)}
                />
              </div>
              {music.error ? <p className="text-xs font-semibold text-rose-100">{music.error}</p> : null}
            </form>

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
  const [selectedThemeKey, setSelectedThemeKey] = useState(() => getStoredFocusThemeKey())
  const [actionError, setActionError] = useState('')
  const hasPlayedTaskStartSound = useRef(false)
  const timerAnchorRef = useRef(null)
  const taskRef = useRef(null)
  const sessionStatsRef = useRef({
    taskId: '',
    focusSeconds: 0,
    focusLog: {},
    shortBreakSeconds: 0,
    shortBreakLog: {},
    longBreakSeconds: 0,
    longBreakLog: {},
  })
  const sessionSaveQueueRef = useRef(Promise.resolve())

  useEffect(() => {
    hasPlayedTaskStartSound.current = false
  }, [taskId])

  useEffect(() => {
    taskRef.current = task

    if (!task) return

    const nextSessionStats = createTaskSessionStats(task)

    if (sessionStatsRef.current.taskId !== task.id) {
      sessionStatsRef.current = nextSessionStats
      return
    }

    if (getTaskSessionStatsTotal(nextSessionStats) >= getTaskSessionStatsTotal(sessionStatsRef.current)) {
      sessionStatsRef.current = nextSessionStats
    }
  }, [task])

  const saveSessionSeconds = useCallback((sessionMode, elapsedSeconds) => {
    const activeTask = taskRef.current
    if (!activeTask || elapsedSeconds <= 0) return Promise.resolve()

    if (sessionStatsRef.current.taskId !== activeTask.id) {
      sessionStatsRef.current = createTaskSessionStats(activeTask)
    }

    const updates = buildSessionTimeUpdates(
      {
        ...activeTask,
        focusSeconds: sessionStatsRef.current.focusSeconds,
        focusLog: sessionStatsRef.current.focusLog,
        shortBreakSeconds: sessionStatsRef.current.shortBreakSeconds,
        shortBreakLog: sessionStatsRef.current.shortBreakLog,
        longBreakSeconds: sessionStatsRef.current.longBreakSeconds,
        longBreakLog: sessionStatsRef.current.longBreakLog,
      },
      sessionMode,
      elapsedSeconds,
    )
    if (!updates) return Promise.resolve()

    sessionStatsRef.current = { ...sessionStatsRef.current, taskId: activeTask.id, ...updates }

    sessionSaveQueueRef.current = sessionSaveQueueRef.current
      .catch(() => undefined)
      .then(() => updateTask(activeTask.id, updates))
      .catch((sessionError) => {
        setActionError(getFirebaseErrorMessage(sessionError))
      })

    return sessionSaveQueueRef.current
  }, [updateTask])

  const consumeElapsedSessionSeconds = useCallback((nowMs = Date.now()) => {
    const anchor = timerAnchorRef.current
    if (!anchor) return null

    const saveFrom = anchor.lastSavedAt ?? anchor.startedAt
    const sessionEnd = anchor.startedAt + anchor.secondsAtStart * 1000
    const clampedNow = Math.min(nowMs, sessionEnd)
    const elapsedSeconds = Math.max(0, Math.floor((clampedNow - saveFrom) / 1000))

    if (elapsedSeconds > 0) {
      anchor.lastSavedAt = saveFrom + elapsedSeconds * 1000
    }

    return {
      elapsedSeconds,
      mode: anchor.mode,
    }
  }, [])

  const flushSessionTime = useCallback((nowMs = Date.now()) => {
    const elapsed = consumeElapsedSessionSeconds(nowMs)
    if (!elapsed || elapsed.elapsedSeconds <= 0) return Promise.resolve()

    return saveSessionSeconds(elapsed.mode, elapsed.elapsedSeconds)
  }, [consumeElapsedSessionSeconds, saveSessionSeconds])

  useEffect(() => {
    if (!running) {
      timerAnchorRef.current = null
      return undefined
    }

    function syncTimerWithClock() {
      const nowMs = Date.now()
      const elapsedByMode = {}
      const completedModes = []
      let anchor = timerAnchorRef.current
      let syncedSessions = 0

      if (!anchor) {
        anchor = createTimerAnchor(mode, durations[mode] * 60, nowMs)
        timerAnchorRef.current = anchor
      }

      function collectElapsed(elapsed) {
        if (!elapsed || elapsed.elapsedSeconds <= 0) return
        elapsedByMode[elapsed.mode] = (elapsedByMode[elapsed.mode] ?? 0) + elapsed.elapsedSeconds
      }

      while (anchor && syncedSessions < MAX_TIMER_SYNC_SESSIONS) {
        const sessionEnd = anchor.startedAt + anchor.secondsAtStart * 1000

        if (nowMs < sessionEnd) {
          if (completedModes.length > 0) collectElapsed(consumeElapsedSessionSeconds(nowMs))
          break
        }

        collectElapsed(consumeElapsedSessionSeconds(sessionEnd))
        completedModes.push(anchor.mode)

        const nextMode = getNextMode(anchor.mode)
        anchor = createTimerAnchor(nextMode, durations[nextMode] * 60, sessionEnd)
        timerAnchorRef.current = anchor
        syncedSessions += 1
      }

      if (syncedSessions >= MAX_TIMER_SYNC_SESSIONS && anchor) {
        anchor = createTimerAnchor(anchor.mode, durations[anchor.mode] * 60, nowMs)
        timerAnchorRef.current = anchor
      }

      Object.entries(elapsedByMode).forEach(([sessionMode, elapsedSeconds]) => {
        saveSessionSeconds(sessionMode, elapsedSeconds)
      })

      const activeAnchor = timerAnchorRef.current
      if (!activeAnchor) return

      const secondsLeft = getTimerAnchorSecondsLeft(activeAnchor, nowMs)

      setSecondsByMode((current) => {
        const nextSecondsByMode = { ...current }

        completedModes.forEach((completedMode) => {
          nextSecondsByMode[completedMode] = durations[completedMode] * 60
        })
        nextSecondsByMode[activeAnchor.mode] = secondsLeft

        return Object.keys(nextSecondsByMode).every((key) => nextSecondsByMode[key] === current[key])
          ? current
          : nextSecondsByMode
      })
      setMode((currentModeKey) => (currentModeKey === activeAnchor.mode ? currentModeKey : activeAnchor.mode))

      if (completedModes.length > 0) {
        playSessionSwitchSound()
      }
    }

    syncTimerWithClock()

    const intervalId = window.setInterval(syncTimerWithClock, 500)
    const sessionSaveIntervalId = window.setInterval(() => flushSessionTime(), 60_000)
    window.addEventListener('focus', syncTimerWithClock)
    document.addEventListener('visibilitychange', syncTimerWithClock)

    return () => {
      window.clearInterval(intervalId)
      window.clearInterval(sessionSaveIntervalId)
      window.removeEventListener('focus', syncTimerWithClock)
      document.removeEventListener('visibilitychange', syncTimerWithClock)
      flushSessionTime()
    }
  }, [consumeElapsedSessionSeconds, durations, flushSessionTime, mode, running, saveSessionSeconds])

  const currentMode = FOCUS_MODES[mode]
  const selectedTheme = FOCUS_THEME_MAP[selectedThemeKey] ?? FOCUS_THEME_MAP[DEFAULT_FOCUS_THEME_KEY]
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
    if (nextMode === mode) return

    flushSessionTime()
    setMode(nextMode)

    if (running) {
      const secondsAtStart = secondsByMode[nextMode] <= 0 ? durations[nextMode] * 60 : secondsByMode[nextMode]
      timerAnchorRef.current = createTimerAnchor(nextMode, secondsAtStart)

      if (secondsByMode[nextMode] <= 0) {
        setSecondsByMode((current) => ({ ...current, [nextMode]: secondsAtStart }))
      }
      return
    }

    timerAnchorRef.current = null
  }

  function resetTimer() {
    flushSessionTime()
    timerAnchorRef.current = null
    setRunning(false)
    setSecondsByMode((current) => ({ ...current, [mode]: durations[mode] * 60 }))
  }

  function selectTheme(themeKey) {
    setSelectedThemeKey(themeKey)
    storeFocusThemeKey(themeKey)
  }

  function toggleRunning() {
    if (running) {
      const anchor = timerAnchorRef.current
      if (anchor) {
        const secondsLeft = getTimerAnchorSecondsLeft(anchor)
        flushSessionTime()
        setSecondsByMode((current) => ({ ...current, [anchor.mode]: secondsLeft }))
      }
      timerAnchorRef.current = null
      setRunning(false)
      return
    }

    const secondsAtStart = secondsByMode[mode] <= 0 ? durations[mode] * 60 : secondsByMode[mode]

    if (!hasPlayedTaskStartSound.current) {
      playSessionStartSound()
      hasPlayedTaskStartSound.current = true
    }

    if (secondsByMode[mode] <= 0) {
      setSecondsByMode((currentSecondsByMode) => ({ ...currentSecondsByMode, [mode]: secondsAtStart }))
    }

    timerAnchorRef.current = createTimerAnchor(mode, secondsAtStart)
    setRunning(true)
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
      await flushSessionTime()
      await updateTask(task.id, { status: 'completed' })
      playTaskCompleteSound()
      timerAnchorRef.current = null
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
    <section className={cn('relative min-h-screen min-h-dvh overflow-hidden text-white', selectedTheme.pageClassName)}>
      <FocusBackground theme={selectedTheme} />

      <div className="relative z-10 flex min-h-screen min-h-dvh flex-col px-4 py-4 sm:px-6 lg:px-8">
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
            <FocusIconButton
              label="Dashboard"
              icon={Home}
              className={selectedTheme.controlButtonClassName}
              onClick={() => navigate('/')}
            />
            <FocusMusicPlayer theme={selectedTheme} />
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
                theme={selectedTheme}
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
            <div className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold', selectedTheme.timerChipClassName)}>
              <Timer className="size-4" />
              {currentMode.title}
            </div>
            <p className={cn('text-[clamp(5rem,16vw,11rem)] font-black leading-none tracking-normal tabular-nums', selectedTheme.timerTextClassName)}>
              {formatTimer(secondsLeft)}
            </p>
            <div className="w-full max-w-md px-2">
              <Progress value={progress} className={cn('h-1.5', selectedTheme.progressClassName)} />
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
              className={cn('size-12 rounded-full p-0 shadow-none', selectedTheme.controlButtonClassName)}
              aria-label="Đặt lại"
              title="Đặt lại"
              onClick={resetTimer}
            >
              <RotateCcw />
            </Button>
            <Button
              type="button"
              className={cn(
                'h-14 min-w-44 rounded-full border-0 bg-gradient-to-r px-8 text-base font-black hover:scale-[1.02] hover:brightness-105',
                running ? selectedTheme.startButtonClassName.running : selectedTheme.startButtonClassName.idle,
              )}
              onClick={toggleRunning}
            >
              {running ? <Pause /> : <Play />}
              {running ? 'Tạm dừng' : 'Bắt đầu'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn('size-12 rounded-full p-0 shadow-none', selectedTheme.controlButtonClassName)}
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
              className={cn(
                'fixed inset-x-3 bottom-20 z-20 mx-auto max-w-md overflow-hidden rounded-lg border text-left backdrop-blur-xl lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[410px]',
                selectedTheme.taskPanelClassName,
              )}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className={cn('h-1 bg-gradient-to-r', selectedTheme.taskAccentClassName)} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-black', selectedTheme.taskStatusClassName)}>
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
                    className={cn('size-8 shadow-none', selectedTheme.controlButtonClassName)}
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
                    overdue ? 'border-peach/70 bg-peach/90 text-rose-950' : selectedTheme.metaClassName,
                  )}
                >
                  <CalendarDays className="size-4" />
                  Hạn {formatTaskDueDateTime(task)}
                </div>
                <div className={cn('ml-2 mt-3 inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-bold', selectedTheme.metaClassName)}>
                  <Timer className="size-4" />
                  Đã tập trung {formatFocusDuration(getTaskFocusSeconds(task))}
                </div>
                <div className={cn('ml-2 mt-3 inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-bold', selectedTheme.metaClassName)}>
                  <Coffee className="size-4" />
                  Nghỉ ngắn {formatFocusDuration(getTaskSessionSeconds(task, 'short'))}
                </div>
                <div className={cn('ml-2 mt-3 inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-bold', selectedTheme.metaClassName)}>
                  <Sparkles className="size-4" />
                  Nghỉ dài {formatFocusDuration(getTaskSessionSeconds(task, 'long'))}
                </div>
                <div className={cn('ml-2 mt-3 inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-bold', selectedTheme.metaClassName)}>
                  <Timer className="size-4" />
                  Tổng {formatFocusDuration(getTaskTotalSessionSeconds(task))}
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
                className={cn('h-11 rounded-full px-4 backdrop-blur-xl', selectedTheme.hiddenTaskButtonClassName)}
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
            className={cn('h-11 rounded-full px-5', selectedTheme.completeButtonClassName)}
            onClick={completeTask}
            disabled={completionBlocked || task.status === 'completed'}
          >
            <CheckCircle2 />
            Hoàn thành
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn('size-11 rounded-full p-0 shadow-none', selectedTheme.controlButtonClassName)}
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
                className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 text-slate-950 shadow-soft"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Cài đặt phiên</h2>
                    <p className="mt-1 text-sm text-slate-500">Tùy chỉnh thời lượng và chủ đề cho task này.</p>
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
                <div className="grid gap-5">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                      <Palette className="size-4" />
                      Chủ đề
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {FOCUS_THEMES.map((theme) => (
                        <FocusThemeOption
                          key={theme.key}
                          theme={theme}
                          selected={selectedThemeKey === theme.key}
                          onClick={() => selectTheme(theme.key)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
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
