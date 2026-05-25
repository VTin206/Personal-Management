import * as React from 'react'

import { cn } from '@/utils/cn'

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0))

  return (
    <div
      ref={ref}
      className={cn('h-3 w-full overflow-hidden rounded-md bg-muted', className)}
      {...props}
    >
      <div
        className="h-full rounded-md bg-primary transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
})
Progress.displayName = 'Progress'

export { Progress }
