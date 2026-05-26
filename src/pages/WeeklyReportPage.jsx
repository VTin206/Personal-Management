import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  Clock3,
  Sparkles,
  Target,
} from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useTasks } from '@/hooks/useTasks'
import {
  getDashboardStats,
  getStatusChartData,
  getWeeklyChartData,
} from '@/utils/taskStats'

function ReportMetric({ title, value, icon: Icon, tone }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
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

export function WeeklyReportPage() {
  const { tasks, loading, error } = useTasks()
  const weeklyData = getWeeklyChartData(tasks)
  const statusData = getStatusChartData(tasks)
  const stats = getDashboardStats(tasks)
  const totalCreatedThisWeek = weeklyData.reduce((total, item) => total + item.created, 0)
  const totalCompletedThisWeek = weeklyData.reduce((total, item) => total + item.completed, 0)
  const totalDueThisWeek = weeklyData.reduce((total, item) => total + item.due, 0)

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
              <Badge variant="secondary">Tuần hiện tại</Badge>
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Weekly Report</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Nhìn nhanh nhịp làm việc trong tuần, số task đã hoàn thành và các mốc đến hạn.
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
        <EmptyState title="Chưa có dữ liệu báo cáo" description="Task mới sẽ xuất hiện trong biểu đồ." />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ReportMetric title="Tạo trong tuần" value={totalCreatedThisWeek} icon={BarChart3} tone="bg-sky text-sky-950" />
            <ReportMetric title="Hoàn thành tuần" value={totalCompletedThisWeek} icon={CheckCircle2} tone="bg-mint text-emerald-900" />
            <ReportMetric title="Đến hạn tuần" value={totalDueThisWeek} icon={CalendarCheck2} tone="bg-butter text-amber-950" />
            <ReportMetric title="Task trễ hạn" value={stats.overdue} icon={Clock3} tone="bg-peach text-rose-950" />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <Card className="overflow-hidden">
              <CardHeader className="bg-card-soft">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-primary" />
                  Hoạt động trong tuần
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ left: -18, right: 12, top: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="createdGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#bfe8ff" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#bfe8ff" stopOpacity={0.12} />
                        </linearGradient>
                        <linearGradient id="completedGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#c6f6dd" stopOpacity={0.95} />
                          <stop offset="95%" stopColor="#c6f6dd" stopOpacity={0.16} />
                        </linearGradient>
                        <linearGradient id="dueGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#fff1a8" stopOpacity={0.95} />
                          <stop offset="95%" stopColor="#fff1a8" stopOpacity={0.12} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#efe7f3" strokeDasharray="4 6" vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip content={<PrettyTooltip />} cursor={{ stroke: '#f178a8', strokeWidth: 1 }} />
                      <Legend iconType="circle" />
                      <Area
                        type="monotone"
                        dataKey="created"
                        name="Tạo mới"
                        stroke="#6ec9f5"
                        fill="url(#createdGradient)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        name="Hoàn thành"
                        stroke="#62c994"
                        fill="url(#completedGradient)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="due"
                        name="Đến hạn"
                        stroke="#e7c94e"
                        fill="url(#dueGradient)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-card-soft">
                <CardTitle>Trạng thái hiện tại</CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} layout="vertical" margin={{ left: 18, right: 16 }}>
                      <CartesianGrid stroke="#efe7f3" strokeDasharray="4 6" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                      <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} width={92} />
                      <Tooltip content={<PrettyTooltip />} cursor={{ fill: 'rgba(255, 214, 231, 0.28)' }} />
                      <Bar dataKey="value" name="Số task" radius={[0, 8, 8, 0]} barSize={34}>
                        {statusData.map((entry) => (
                          <Cell key={entry.status} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
