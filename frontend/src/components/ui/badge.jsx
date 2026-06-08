import * as React from 'react'

import { cn } from '@/utils/cn'

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'text-foreground',
    success: 'border-transparent bg-mint text-emerald-900',
    warning: 'border-transparent bg-butter text-amber-950',
    danger: 'border-transparent bg-peach text-rose-950',
    info: 'border-transparent bg-sky text-sky-950',
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
