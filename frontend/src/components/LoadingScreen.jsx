import { Loader2 } from 'lucide-react'

export function LoadingScreen({ label = 'Đang tải' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-6">
      <div className="flex items-center gap-3 rounded-lg border bg-card px-5 py-4 shadow-soft">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
