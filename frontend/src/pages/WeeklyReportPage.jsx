import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BarChart3,
  CalendarDays,
  CalendarCheck2,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListChecks,
  Sparkles,
  Target,
} from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useNow } from '@/hooks/useNow'
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/utils/cn'
import {
  addDays,
  formatDate,
  formatTaskDateTimeRange,
  getTaskDueDateTime,
  getTaskStartDateTime,
  isSameDay,
  startOfCurrentWeek,
  startOfDay,
  toDate,
} from '@/utils/date'
import {
  formatFocusDuration,
  getDashboardStats,
  getWeeklyFocusChartData,
  getWeeklyChartData,
  isTaskOverdue,
} from '@/utils/taskStats'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { getTaskDragDateUpdates } from '@/utils/taskSchedule'
import {
  EISENHOWER_QUADRANTS,
  getEisenhowerQuadrantKey,
} from '@/utils/eisenhower'
import {
  getPriorityLabel,
  getStatusLabel,
  PRIORITY_BADGE_VARIANTS,
  STATUS_BADGE_VARIANTS,
} from '@/utils/taskOptions'

const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const CALENDAR_DRAG_TYPE = 'application/x-pastel-task-drag'
const CALENDAR_VIEWS = {
  month: {
    key: 'month',
    label: 'Tháng',
    icon: CalendarDays,
  },
  week: {
    key: 'week',
    label: 'Tuần',
    icon: CalendarRange,
  },
}
const QUADRANT_CALENDAR_STYLES = {
  do: {
    range: 'border-rose-200 bg-peach text-rose-950 hover:bg-peach/90',
    dot: 'bg-peach',
  },
  schedule: {
    range: 'border-violet-200 bg-lavender text-violet-950 hover:bg-lavender/90',
    dot: 'bg-lavender',
  },
  delegate: {
    range: 'border-amber-200 bg-butter text-amber-950 hover:bg-butter/90',
    dot: 'bg-butter',
  },
  reduce: {
    range: 'border-sky-200 bg-sky text-sky-950 hover:bg-sky/90',
    dot: 'bg-sky',
  },
}

function ReportMetric({ title, value, icon: Icon, tone }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className="mt-1 truncate text-3xl font-bold">{value}</p>
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function PrettyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-card p-3 text-sm shadow-soft">
      <p className="mb-2 font-bold">{label}</p>
      <div className="grid gap-1.5">
        {payload.map((item) => (
          <div className="flex items-center justify-between gap-5" key={item.dataKey}>
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color || item.fill }}
              />
              {item.name}
            </span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function startOfMonth(date) {
  const nextDate = startOfDay(date)
  nextDate.setDate(1)
  return nextDate
}

function endOfMonth(date) {
  const nextDate = startOfMonth(date)
  nextDate.setMonth(nextDate.getMonth() + 1, 0)
  return nextDate
}

function addMonths(date, months) {
  const nextDate = startOfMonth(date)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}

function formatMonthTitle(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function buildMonthCalendarDays(monthDate) {
  const firstDay = startOfMonth(monthDate)
  const mondayOffset = (firstDay.getDay() + 6) % 7
  const calendarStart = addDays(firstDay, -mondayOffset)

  return Array.from({ length: 42 }, (_, index) => addDays(calendarStart, index))
}

function buildWeekCalendarDays(date) {
  const weekStart = startOfCurrentWeek(date)

  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

function formatWeekTitle(date) {
  const weekStart = startOfCurrentWeek(date)
  const weekEnd = addDays(weekStart, 6)

  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
}

function getVisibleCalendarRange(days) {
  return {
    start: startOfDay(days[0]),
    end: startOfDay(days[days.length - 1]),
  }
}

function parseCalendarDragPayload(event) {
  try {
    return JSON.parse(event.dataTransfer.getData(CALENDAR_DRAG_TYPE) || event.dataTransfer.getData('text/plain'))
  } catch {
    return null
  }
}

function getTaskRange(task) {
  const start = startOfDay(getTaskStartDateTime(task) ?? toDate(task.createdAt) ?? getTaskDueDateTime(task) ?? new Date())
  const end = startOfDay(getTaskDueDateTime(task) ?? start)

  if (start.getTime() <= end.getTime()) {
    return { start, end }
  }

  return { start: end, end: start }
}

function taskOverlapsMonth(task, monthDate) {
  const range = getTaskRange(task)
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)

  return range.start.getTime() <= monthEnd.getTime() && range.end.getTime() >= monthStart.getTime()
}

function taskOverlapsCalendarRange(task, calendarRange) {
  const range = getTaskRange(task)

  return range.start.getTime() <= calendarRange.end.getTime() && range.end.getTime() >= calendarRange.start.getTime()
}

function taskCoversDay(task, day) {
  const range = getTaskRange(task)
  const selectedDay = startOfDay(day)

  return range.start.getTime() <= selectedDay.getTime() && range.end.getTime() >= selectedDay.getTime()
}

function getCompletionRate(tasks) {
  if (tasks.length === 0) return 0

  const completed = tasks.filter((task) => task.status === 'completed').length
  return Math.round((completed / tasks.length) * 100)
}

function sortByRange(tasks) {
  return [...tasks].sort((left, right) => {
    const leftRange = getTaskRange(left)
    const rightRange = getTaskRange(right)

    return leftRange.start.getTime() - rightRange.start.getTime()
      || leftRange.end.getTime() - rightRange.end.getTime()
  })
}

function getCalendarStyle(task, now) {
  const quadrantKey = getEisenhowerQuadrantKey(task, now)
  return QUADRANT_CALENDAR_STYLES[quadrantKey] ?? QUADRANT_CALENDAR_STYLES.reduce
}

function buildCalendarTaskLanes(tasks) {
  const laneEndTimes = []
  const lanesByTaskId = new Map()

  sortByRange(tasks).forEach((task) => {
    const range = getTaskRange(task)
    const laneIndex = laneEndTimes.findIndex((endTime) => endTime < range.start.getTime())
    const nextLaneIndex = laneIndex === -1 ? laneEndTimes.length : laneIndex

    laneEndTimes[nextLaneIndex] = range.end.getTime()
    lanesByTaskId.set(task.id, nextLaneIndex)
  })

  return lanesByTaskId
}

function isRangeStartInCell(task, day) {
  const range = getTaskRange(task)
  return isSameDay(range.start, day) || day.getDay() === 1
}

function isRangeEndInCell(task, day) {
  const range = getTaskRange(task)
  return isSameDay(range.end, day) || day.getDay() === 0
}

function shouldShowRangeLabel(task, day) {
  return isRangeStartInCell(task, day)
}

function QuadrantLegend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
      {EISENHOWER_QUADRANTS.map((quadrant) => (
        <span className="inline-flex items-center gap-1.5" key={quadrant.key}>
          <span className={cn('size-2.5 rounded-full', QUADRANT_CALENDAR_STYLES[quadrant.key].dot)} />
          {quadrant.title}
        </span>
      ))}
    </div>
  )
}

function CalendarViewSegment({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 rounded-lg border bg-card p-1">
      {Object.values(CALENDAR_VIEWS).map((view) => {
        const Icon = view.icon
        const active = value === view.key

        return (
          <button
            type="button"
            className={cn(
              'inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-black transition-colors',
              active ? 'bg-primary text-primary-foreground shadow-soft' : 'text-muted-foreground hover:bg-card-soft hover:text-foreground',
            )}
            key={view.key}
            onClick={() => onChange(view.key)}
          >
            <Icon className="size-4" />
            {view.label}
          </button>
        )
      })}
    </div>
  )
}

function CalendarRangeBar({ task, day, now, onOpen, onDragTask }) {
  const style = getCalendarStyle(task, now)
  const showLabel = shouldShowRangeLabel(task, day)
  const startsInCell = isRangeStartInCell(task, day)
  const endsInCell = isRangeEndInCell(task, day)

  function startDrag(event, mode) {
    const payload = JSON.stringify({ taskId: task.id, mode })

    event.stopPropagation()
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData(CALENDAR_DRAG_TYPE, payload)
    event.dataTransfer.setData('text/plain', payload)
    onDragTask(task.id)
  }

  return (
    <div className="relative z-10 h-5 min-w-0">
      <button
        type="button"
        draggable
        className={cn(
        'absolute inset-0 min-w-0 cursor-grab border-y px-2 text-left text-[10px] font-black leading-5 transition-colors active:cursor-grabbing',
        style.range,
        startsInCell ? 'ml-0 rounded-l-md border-l' : '-ml-2 rounded-l-none border-l-0 pl-2',
        endsInCell ? 'mr-0 rounded-r-md border-r' : '-mr-2 rounded-r-none border-r-0 pr-2',
      )}
      title={`${task.title} · ${formatTaskDateTimeRange(task)}`}
      onClick={(event) => {
        event.stopPropagation()
        onOpen(task)
      }}
      onDragEnd={() => onDragTask('')}
      onDragStart={(event) => startDrag(event, 'move')}
    >
      <span className={cn('block truncate', !showLabel && 'sr-only')}>{task.title}</span>
      </button>
      {startsInCell ? (
        <span
          aria-label="Kéo để đổi ngày bắt đầu"
          draggable
          role="button"
          tabIndex={-1}
          title="Kéo để đổi ngày bắt đầu"
          className="absolute left-0 top-0 z-20 h-5 w-2 cursor-ew-resize rounded-l-md bg-black/10 hover:bg-black/20"
          onClick={(event) => event.stopPropagation()}
          onDragEnd={() => onDragTask('')}
          onDragStart={(event) => startDrag(event, 'start')}
        />
      ) : null}
      {endsInCell ? (
        <span
          aria-label="Kéo để đổi ngày hạn"
          draggable
          role="button"
          tabIndex={-1}
          title="Kéo để đổi ngày hạn"
          className="absolute right-0 top-0 z-20 h-5 w-2 cursor-ew-resize rounded-r-md bg-black/10 hover:bg-black/20"
          onClick={(event) => event.stopPropagation()}
          onDragEnd={() => onDragTask('')}
          onDragStart={(event) => startDrag(event, 'end')}
        />
      ) : null}
    </div>
  )
}

function CalendarHoverCard({ tasks, alignRight, now, onOpen }) {
  if (tasks.length === 0) return null

  return (
    <div
      className={cn(
        'pointer-events-auto absolute top-full z-40 mt-2 hidden w-72 rounded-lg border bg-card p-3 text-left shadow-soft group-hover/calendar-day:block',
        alignRight ? 'right-0' : 'left-0',
      )}
    >
      <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Task trong ngày</p>
      <div className="grid gap-1.5">
        {tasks.map((task) => {
          const style = getCalendarStyle(task, now)

          return (
            <button
              type="button"
              className="rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-card-soft"
              key={task.id}
              onClick={(event) => {
                event.stopPropagation()
                onOpen(task)
              }}
            >
              <span className="flex items-center gap-2">
                <span className={cn('size-2.5 shrink-0 rounded-full', style.dot)} />
                <span className="min-w-0 truncate font-bold">{task.title}</span>
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {formatTaskDateTimeRange(task)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CalendarDayCell({
  cellIndex,
  day,
  dayTasks,
  dayRows,
  draggingTaskId,
  dueCount,
  overflowCount,
  isCurrentMonth,
  isLastRow,
  now,
  selected,
  view,
  alignTooltipRight,
  onSelect,
  onDropTask,
  onDragTask,
  onOpenTask,
}) {
  const dragCoversDay = draggingTaskId && dayTasks.some((task) => task.id === draggingTaskId)

  return (
    <div
      className={cn(
        'group/calendar-day relative border-b border-r bg-card p-2 text-left transition-colors hover:bg-card-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        view === 'week' ? 'min-h-[240px] sm:min-h-[340px]' : 'min-h-[92px] sm:min-h-[124px]',
        cellIndex % 7 === 6 && 'border-r-0',
        isLastRow && 'border-b-0',
        !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
        selected && 'z-20 bg-primary/5 ring-2 ring-inset ring-primary/35',
        dragCoversDay && 'bg-primary/10',
      )}
      onClick={() => onSelect(startOfDay(day))}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onDropTask(parseCalendarDragPayload(event), day)
      }}
      onKeyDown={(event) => {
        if (!['Enter', ' '].includes(event.key)) return
        event.preventDefault()
        onSelect(startOfDay(day))
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-sm font-bold">{day.getDate()}</span>
        {dueCount > 0 ? (
          <span className="rounded-md bg-card-soft px-1.5 py-0.5 text-[10px] font-black text-foreground">
            {dueCount}
          </span>
        ) : null}
      </div>
      <div className="mt-2 grid gap-1">
        {dayRows.map((task, rowIndex) => (
          task ? (
            <CalendarRangeBar task={task} day={day} key={task.id} now={now} onDragTask={onDragTask} onOpen={onOpenTask} />
          ) : (
            <span aria-hidden="true" className="h-5" key={`empty-${rowIndex}`} />
          )
        ))}
        {overflowCount > 0 ? (
          <span className="text-[10px] font-bold text-muted-foreground">+{overflowCount}</span>
        ) : null}
      </div>
      <CalendarHoverCard tasks={dayTasks} alignRight={alignTooltipRight} now={now} onOpen={onOpenTask} />
    </div>
  )
}

function TaskTimelineItem({ task, now, onOpen }) {
  const style = getCalendarStyle(task, now)

  return (
    <li className="rounded-lg border bg-card-soft p-3">
      <button
        type="button"
        className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-start sm:justify-between"
        onClick={() => onOpen(task)}
      >
        <div className="min-w-0">
          <p className="flex min-w-0 items-center gap-2 break-words text-sm font-bold">
            <span className={cn('size-2.5 shrink-0 rounded-full', style.dot)} />
            {task.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Từ {formatTaskDateTimeRange(task)}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Badge variant={STATUS_BADGE_VARIANTS[task.status]}>{getStatusLabel(task.status)}</Badge>
          <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]}>{getPriorityLabel(task.priority)}</Badge>
        </div>
      </button>
    </li>
  )
}

export function WeeklyReportPage() {
  const navigate = useNavigate()
  const { tasks, loading, error, updateTask } = useTasks()
  const now = useNow()
  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))
  const [calendarView, setCalendarView] = useState('week')
  const [draggingTaskId, setDraggingTaskId] = useState('')
  const [actionError, setActionError] = useState('')
  const weeklyData = getWeeklyChartData(tasks)
  const weeklyFocusData = getWeeklyFocusChartData(tasks)
  const stats = getDashboardStats(tasks)
  const totalCompletedThisWeek = weeklyData.reduce((total, item) => total + item.completed, 0)
  const totalOverdueThisWeek = weeklyData.reduce((total, item) => total + item.overdue, 0)
  const totalSessionSecondsThisWeek = weeklyFocusData.reduce((total, item) => total + item.totalSeconds, 0)
  const calendarDays = useMemo(
    () => (calendarView === 'week' ? buildWeekCalendarDays(selectedDate) : buildMonthCalendarDays(monthDate)),
    [calendarView, monthDate, selectedDate],
  )
  const calendarRange = useMemo(() => getVisibleCalendarRange(calendarDays), [calendarDays])
  const visibleTasks = useMemo(
    () => sortByRange(tasks.filter((task) => (
      task.status !== 'completed'
      && (calendarView === 'month'
        ? taskOverlapsMonth(task, monthDate)
        : taskOverlapsCalendarRange(task, calendarRange))
    ))),
    [calendarRange, calendarView, monthDate, tasks],
  )
  const calendarTaskLanes = useMemo(() => buildCalendarTaskLanes(visibleTasks), [visibleTasks])
  const selectedDayTasks = useMemo(
    () => sortByRange(visibleTasks.filter((task) => taskCoversDay(task, selectedDate))),
    [visibleTasks, selectedDate],
  )
  const selectedDayRate = getCompletionRate(selectedDayTasks)
  const completedOnSelectedDay = tasks.filter((task) => task.status === 'completed' && taskCoversDay(task, selectedDate)).length
  const selectedDayOverdue = selectedDayTasks.filter(isTaskOverdue).length

  function changeCalendarPage(pageOffset) {
    if (calendarView === 'week') {
      const nextWeekDate = addDays(selectedDate, pageOffset * 7)
      setSelectedDate(startOfDay(nextWeekDate))
      setMonthDate(startOfMonth(nextWeekDate))
      return
    }

    const nextMonth = addMonths(monthDate, pageOffset)
    setMonthDate(nextMonth)
    setSelectedDate(nextMonth)
  }

  function changeCalendarView(nextView) {
    setCalendarView(nextView)
    setMonthDate(startOfMonth(selectedDate))
  }

  async function dropTaskOnDay(payload, day) {
    if (!payload?.taskId) return

    setDraggingTaskId('')
    setActionError('')

    const task = tasks.find((item) => item.id === payload.taskId)
    if (!task) return

    try {
      await updateTask(task.id, getTaskDragDateUpdates(task, payload.mode, day))
      setSelectedDate(startOfDay(day))
      setMonthDate(startOfMonth(day))
    } catch (taskError) {
      setActionError(getFirebaseErrorMessage(taskError))
    }
  }

  function openTask(task) {
    navigate(`/focus/${task.id}`)
  }

  if (loading) {
    return <EmptyState title="Đang tải báo cáo" description="Biểu đồ đang được chuẩn bị." />
  }

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-lg border bg-card shadow-soft">
        <div className="grid gap-4 bg-card-soft p-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blush text-rose-800">
                <Sparkles className="size-5" />
              </div>
              <Badge variant="secondary">Tiến độ</Badge>
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Báo cáo tiến độ</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Theo dõi task đã hoàn thành, task trễ hạn và lịch làm việc theo tháng.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-muted-foreground">Tỷ lệ hoàn thành</p>
              <Target className="size-5 text-primary" />
            </div>
            <p className="mt-2 text-4xl font-bold">{stats.weeklyCompletionRate}%</p>
            <Progress className="mt-3" value={stats.weeklyCompletionRate} />
          </div>
        </div>
      </section>

      {error || actionError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {actionError || error}
        </p>
      ) : null}

      {tasks.length === 0 ? (
        <EmptyState title="Chưa có dữ liệu báo cáo" description="Task mới sẽ xuất hiện trong lịch và biểu đồ." />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <ReportMetric title="Task đã hoàn thành" value={stats.completed} icon={CheckCircle2} tone="bg-mint text-emerald-900" />
            <ReportMetric title="Task trễ hạn" value={stats.overdue} icon={Clock3} tone="bg-peach text-rose-950" />
            <ReportMetric title="Đã làm tuần này" value={totalCompletedThisWeek} icon={CalendarCheck2} tone="bg-sky text-sky-950" />
            <ReportMetric title="Trễ hạn tuần này" value={totalOverdueThisWeek} icon={BarChart3} tone="bg-butter text-amber-950" />
            <ReportMetric title="Tổng thời gian tuần này" value={formatFocusDuration(totalSessionSecondsThisWeek)} icon={Target} tone="bg-lavender text-violet-950" />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-card-soft">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-primary" />
                  Hoạt động trong tuần
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ left: -18, right: 12, top: 8, bottom: 0 }} barGap={8}>
                      <CartesianGrid stroke="#efe7f3" strokeDasharray="4 6" vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip content={<PrettyTooltip />} cursor={{ fill: 'rgba(255, 214, 231, 0.26)' }} />
                      <Legend iconType="circle" />
                      <Bar
                        dataKey="completed"
                        name="Đã làm"
                        fill="#c6f6dd"
                        radius={[8, 8, 0, 0]}
                        barSize={28}
                      />
                      <Bar
                        dataKey="overdue"
                        name="Trễ hạn"
                        fill="#ffd2b8"
                        radius={[8, 8, 0, 0]}
                        barSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="bg-card-soft">
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5 text-primary" />
                  Tổng thời gian trong tuần
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyFocusData} margin={{ left: -18, right: 12, top: 8, bottom: 0 }}>
                      <CartesianGrid stroke="#efe7f3" strokeDasharray="4 6" vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip content={<PrettyTooltip />} cursor={{ fill: 'rgba(215, 203, 255, 0.26)' }} />
                      <Legend iconType="circle" />
                      <Bar
                        dataKey="focusHours"
                        name="Tập trung"
                        fill="#d8ccff"
                        stackId="sessionTime"
                        barSize={32}
                      />
                      <Bar
                        dataKey="shortBreakHours"
                        name="Nghỉ ngắn"
                        fill="#c6f6dd"
                        stackId="sessionTime"
                        barSize={32}
                      />
                      <Bar
                        dataKey="longBreakHours"
                        name="Nghỉ dài"
                        fill="#ffd2b8"
                        radius={[8, 8, 0, 0]}
                        stackId="sessionTime"
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <Card className="relative">
              <CardHeader className="bg-card-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="grid gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarCheck2 className="size-5 text-primary" />
                      {calendarView === 'week' ? formatWeekTitle(selectedDate) : formatMonthTitle(monthDate)}
                    </CardTitle>
                    <QuadrantLegend />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CalendarViewSegment value={calendarView} onChange={changeCalendarView} />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Tháng trước"
                      aria-label="Tháng trước"
                      onClick={() => changeCalendarPage(-1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Tháng sau"
                      aria-label="Tháng sau"
                      onClick={() => changeCalendarPage(1)}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="mt-2 rounded-lg border bg-card">
                  <div className="grid grid-cols-7 rounded-t-lg border-b bg-card-soft/70 text-center text-xs font-bold text-muted-foreground">
                    {WEEKDAY_LABELS.map((label, index) => (
                      <span className={cn('border-r px-1 py-2', index === 6 && 'border-r-0')} key={label}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, index) => {
                      const dayTasks = visibleTasks.filter((task) => taskCoversDay(task, day))
                      const rowCount = calendarView === 'week' ? 10 : 4
                      const dayRows = Array.from({ length: rowCount }, (_, laneIndex) => (
                        dayTasks.find((task) => calendarTaskLanes.get(task.id) === laneIndex) ?? null
                      ))
                      const overflowCount = dayTasks.filter((task) => (calendarTaskLanes.get(task.id) ?? 0) >= rowCount).length
                      const dueCount = dayTasks.filter((task) => isSameDay(getTaskDueDateTime(task), day)).length
                      const isCurrentMonth = calendarView === 'week' || day.getMonth() === monthDate.getMonth()
                      const isLastRow = index >= calendarDays.length - 7
                      const selected = isSameDay(day, selectedDate)

                      return (
                        <CalendarDayCell
                          cellIndex={index}
                          day={day}
                          dayTasks={dayTasks}
                          dayRows={dayRows}
                          draggingTaskId={draggingTaskId}
                          dueCount={dueCount}
                          overflowCount={overflowCount}
                          isCurrentMonth={isCurrentMonth}
                          isLastRow={isLastRow}
                          now={now}
                          key={day.toISOString()}
                          selected={selected}
                          view={calendarView}
                          alignTooltipRight={index % 7 >= 4}
                          onDragTask={setDraggingTaskId}
                          onDropTask={dropTaskOnDay}
                          onSelect={setSelectedDate}
                          onOpenTask={openTask}
                        />
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-card-soft">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="size-5 text-primary" />
                    {formatDate(selectedDate)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 pt-5">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border bg-card-soft p-3">
                      <p className="text-xs font-semibold text-muted-foreground">Task</p>
                      <p className="mt-1 text-2xl font-bold">{selectedDayTasks.length}</p>
                    </div>
                    <div className="rounded-lg border bg-card-soft p-3">
                      <p className="text-xs font-semibold text-muted-foreground">Đã làm</p>
                      <p className="mt-1 text-2xl font-bold">{completedOnSelectedDay}</p>
                    </div>
                    <div className="rounded-lg border bg-card-soft p-3">
                      <p className="text-xs font-semibold text-muted-foreground">Trễ</p>
                      <p className="mt-1 text-2xl font-bold">{selectedDayOverdue}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
                      <span>Tiến độ ngày</span>
                      <span>{selectedDayRate}%</span>
                    </div>
                    <Progress value={selectedDayRate} />
                  </div>
                  {selectedDayTasks.length === 0 ? (
                    <p className="rounded-lg border bg-card-soft p-3 text-sm text-muted-foreground">
                      Không có task trong ngày này.
                    </p>
                  ) : (
                    <ul className="grid gap-2">
                      {selectedDayTasks.map((task) => (
                        <TaskTimelineItem task={task} key={task.id} now={now} onOpen={openTask} />
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="bg-card-soft">
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="size-5 text-primary" />
                    {calendarView === 'week' ? 'Task trong tuần' : 'Task trong tháng'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {visibleTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {calendarView === 'week' ? 'Không có task trong tuần này.' : 'Không có task trong tháng này.'}
                    </p>
                  ) : (
                    <ul className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
                      {visibleTasks.map((task) => (
                        <TaskTimelineItem task={task} key={task.id} now={now} onOpen={openTask} />
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
