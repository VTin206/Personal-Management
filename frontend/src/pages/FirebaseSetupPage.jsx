import { Copy, Flame } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { missingFirebaseConfigKeys } from '@/config/firebase'

export function FirebaseSetupPage() {
  async function copyEnvExample() {
    await navigator.clipboard.writeText('Copy-Item .env.example .env')
  }

  return (
    <main className="pastel-grid flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="size-5 text-primary" />
            Thiếu cấu hình Firebase
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            App không hiển thị vì Firebase đang thiếu API key/config. Hãy tạo file
            <span className="font-semibold text-foreground"> .env </span>
            từ file
            <span className="font-semibold text-foreground"> .env.example </span>
            rồi điền thông tin Firebase thật.
          </p>

          <div className="rounded-lg border bg-muted/60 p-4 font-mono text-xs text-foreground">
            Copy-Item .env.example .env
          </div>

          <div>
            <p className="font-semibold text-foreground">Đang thiếu:</p>
            <p className="mt-1 break-words">{missingFirebaseConfigKeys.join(', ')}</p>
          </div>

          <p>
            Sau khi lưu file <span className="font-semibold text-foreground">.env</span>, hãy tắt
            terminal Vite và chạy lại <span className="font-semibold text-foreground">npm run dev</span>.
          </p>

          <Button type="button" className="w-fit" onClick={copyEnvExample}>
            <Copy />
            Copy lệnh tạo .env
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
