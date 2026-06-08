import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

export function StatCard({
  title,
  value,
  icon: Icon,
  tone = 'bg-blush text-rose-800',
  selected = false,
  onClick,
}) {
  function handleKeyDown(event) {
    if (!onClick || !['Enter', ' '].includes(event.key)) return

    event.preventDefault()
    onClick()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        aria-pressed={onClick ? selected : undefined}
        className={cn(
          'h-full transition-all',
          onClick && 'cursor-pointer hover:-translate-y-0.5 hover:border-primary hover:shadow-lg',
          selected && 'border-primary ring-2 ring-primary/25',
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
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
