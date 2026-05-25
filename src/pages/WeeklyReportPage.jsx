import {
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
import { BarChart3 } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTasks } from '@/hooks/useTasks'
import { getStatusChartData, getWeeklyChartData } from '@/utils/taskStats'

export function WeeklyReportPage() {
  const { tasks, loading, error } = useTasks()
  const weeklyData = getWeeklyChartData(tasks)
  const statusData = getStatusChartData(tasks)

  if (loading) {
    return <EmptyState title="Đang tải báo cáo" description="Biểu đồ đang được chuẩn bị." />
  }

  return (
    <div className="grid gap-6">
      <section>
        <h1 className="text-3xl font-bold sm:text-4xl">Weekly Report</h1>
        <p className="mt-2 text-sm text-muted-foreground">Biểu đồ công việc trong tuần</p>
      </section>

      {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p> : null}

      {tasks.length === 0 ? (
        <EmptyState title="Chưa có dữ liệu báo cáo" description="Task mới sẽ xuất hiện trong biểu đồ." />
      ) : (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                Hoạt động trong tuần
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9e1f1" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255, 214, 231, 0.22)' }} />
                    <Legend />
                    <Bar dataKey="created" name="Tạo mới" fill="#bfe8ff" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="completed" name="Hoàn thành" fill="#c6f6dd" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="due" name="Đến hạn" fill="#fff1a8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái hiện tại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} layout="vertical" margin={{ left: 18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9e1f1" />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                    <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} width={92} />
                    <Tooltip cursor={{ fill: 'rgba(198, 246, 221, 0.24)' }} />
                    <Bar dataKey="value" name="Số task" radius={[0, 6, 6, 0]}>
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
      )}
    </div>
  )
}
