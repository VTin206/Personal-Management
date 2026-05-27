import { useMemo, useState } from 'react'
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
  CalendarCheck2,
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
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/utils/cn'
import {
  addDays,
  formatDate,
  isSameDay,
  startOfDay,
  toDate,
} from '@/utils/date'
import {
  getDashboardStats,
  getWeeklyChartData,
  isTaskOverdue,
} from '@/utils/taskStats'
import {
  getPriorityLabel,
  getStatusLabel,
  PRIORITY_BADGE_VARIANTS,
  STATUS_BADGE_VARIANTS,
} from '@/utils/taskOptions'

const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

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

function getTaskRange(task) {
  const start = startOfDay(toDate(task.startDate) ?? toDate(task.createdAt) ?? toDate(task.dueDate) ?? new Date())
  const end = startOfDay(toDate(task.dueDate) ?? start)

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

function CalendarTaskChip({ task }) {
  return (
    <span
      className={cn(
        'block truncate rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-4',
        task.status === 'completed' && 'bg-mint text-emerald-950',
        task.status === 'in-progress' && 'bg-butter text-amber-950',
        task.status === 'todo' && 'bg-sky text-sky-950',
        isTaskOverdue(task) && 'bg-peach text-rose-950',
      )}
    >
      {task.title}
    </span>
  )
}

function TaskTimelineItem({ task }) {
  const range = getTaskRange(task)

  return (
    <li className="rounded-lg border bg-card-soft p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-bold">{task.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Từ {formatDate(range.start)} đến {formatDate(range.end)}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Badge variant={STATUS_BADGE_VARIANTS[task.status]}>{getStatusLabel(task.status)}</Badge>
          <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]}>{getPriorityLabel(task.priority)}</Badge>
        </div>
      </div>
    </li>
  )
}

export function WeeklyReportPage() {
  const { tasks, loading, error } = useTasks()
  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))
  const weeklyData = getWeeklyChartData(tasks)
  const stats = getDashboardStats(tasks)
  const totalCompletedThisWeek = weeklyData.reduce((total, item) => total + item.completed, 0)
  const totalOverdueThisWeek = weeklyData.reduce((total, item) => total + item.overdue, 0)
  const calendarDays = useMemo(() => buildMonthCalendarDays(monthDate), [monthDate])
  const monthTasks = useMemo(
    () => sortByRange(tasks.filter((task) => taskOverlapsMonth(task, monthDate))),
    [monthDate, tasks],
  )
  const selectedDayTasks = useMemo(
    () => sortByRange(monthTasks.filter((task) => taskCoversDay(task, selectedDate))),
    [monthTasks, selectedDate],
  )
  const selectedDayRate = getCompletionRate(selectedDayTasks)
  const selectedDayCompleted = selectedDayTasks.filter((task) => task.status === 'completed').length
  const selectedDayOverdue = selectedDayTasks.filter(isTaskOverdue).length

  function changeMonth(monthOffset) {
    const nextMonth = addMonths(monthDate, monthOffset)
    setMonthDate(nextMonth)
    setSelectedDate(nextMonth)
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

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}

      {tasks.length === 0 ? (
        <EmptyState title="Chưa có dữ liệu báo cáo" description="Task mới sẽ xuất hiện trong lịch và biểu đồ." />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ReportMetric title="Task đã hoàn thành" value={stats.completed} icon={CheckCircle2} tone="bg-mint text-emerald-900" />
            <ReportMetric title="Task trễ hạn" value={stats.overdue} icon={Clock3} tone="bg-peach text-rose-950" />
            <ReportMetric title="Đã làm tuần này" value={totalCompletedThisWeek} icon={CalendarCheck2} tone="bg-sky text-sky-950" />
            <ReportMetric title="Trễ hạn tuần này" value={totalOverdueThisWeek} icon={BarChart3} tone="bg-butter text-amber-950" />
          </section>

          <section className="grid gap-4">
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
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <Card className="overflow-hidden">
              <CardHeader className="bg-card-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck2 className="size-5 text-primary" />
                    {formatMonthTitle(monthDate)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Tháng trước"
                      aria-label="Tháng trước"
                      onClick={() => changeMonth(-1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Tháng sau"
                      aria-label="Tháng sau"
                      onClick={() => changeMonth(1)}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground">
                  {WEEKDAY_LABELS.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => {
                    const dayTasks = monthTasks.filter((task) => taskCoversDay(task, day))
                    const dueCount = dayTasks.filter((task) => isSameDay(toDate(task.dueDate), day)).length
                    const isCurrentMonth = day.getMonth() === monthDate.getMonth()
                    const selected = isSameDay(day, selectedDate)

                    return (
                      <button
                        type="button"
                        key={day.toISOString()}
                        className={cn(
                          'min-h-[86px] rounded-lg border bg-card p-2 text-left transition-colors hover:border-primary sm:min-h-[112px]',
                          !isCurrentMonth && 'bg-muted/40 text-muted-foreground',
                          selected && 'border-primary ring-2 ring-primary/25',
                        )}
                        onClick={() => setSelectedDate(startOfDay(day))}
                      >
                        <span className="flex items-center justify-between gap-1">
                          <span className="text-sm font-bold">{day.getDate()}</span>
                          {dueCount > 0 ? (
                            <span className="rounded-md bg-butter px-1.5 py-0.5 text-[10px] font-black text-amber-950">
                              {dueCount}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-2 grid gap-1">
                          {dayTasks.slice(0, 2).map((task) => (
                            <CalendarTaskChip task={task} key={task.id} />
                          ))}
                          {dayTasks.length > 2 ? (
                            <span className="text-[10px] font-bold text-muted-foreground">+{dayTasks.length - 2}</span>
                          ) : null}
                        </span>
                      </button>
                    )
                  })}
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
                      <p className="mt-1 text-2xl font-bold">{selectedDayCompleted}</p>
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
                        <TaskTimelineItem task={task} key={task.id} />
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="bg-card-soft">
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="size-5 text-primary" />
                    Task trong tháng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {monthTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Không có task trong tháng này.</p>
                  ) : (
                    <ul className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
                      {monthTasks.map((task) => (
                        <TaskTimelineItem task={task} key={task.id} />
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
