import { Inbox } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

export function EmptyState({ title = 'Chưa có dữ liệu', description = 'Danh sách đang trống.' }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-sky text-sky-950">
          <Inbox className="size-6" />
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
