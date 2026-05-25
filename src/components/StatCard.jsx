import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

export function StatCard({ title, value, icon: Icon, tone = 'bg-blush text-rose-800' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="h-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
          <div className={cn('flex size-10 items-center justify-center rounded-lg', tone)}>
            <Icon className="size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
