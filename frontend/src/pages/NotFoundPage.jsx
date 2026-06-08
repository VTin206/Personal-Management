import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <main className="pastel-grid flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="grid gap-4 p-6 text-center">
          <h1 className="text-3xl font-bold">404</h1>
          <p className="text-sm text-muted-foreground">Trang này không tồn tại.</p>
          <Button asChild>
            <Link to="/">
              <Home />
              Về Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
