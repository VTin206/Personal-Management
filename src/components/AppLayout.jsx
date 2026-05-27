import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MoonStar,
  Settings,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/utils/cn'

const navigationItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Công việc', icon: ListChecks },
  { to: '/weekly-report', label: 'Báo cáo tiến độ', icon: BarChart3 },
  { to: '/settings', label: 'Cài đặt', icon: Settings },
]

function NavigationLink({ item, compact = false }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-card-soft hover:text-foreground',
          compact && 'min-w-0 flex-1 flex-col gap-1 px-2 py-2 text-xs',
          isActive && 'bg-card-soft text-foreground shadow-soft',
        )
      }
    >
      <Icon className="size-4 shrink-0" />
      <span className={cn('truncate', compact && 'text-[11px] leading-none')}>{item.label}</span>
    </NavLink>
  )
}

export function AppLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const focusMode = location.pathname.startsWith('/focus/')

  if (focusMode) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Outlet />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'min-h-screen transition-colors',
        settings.showGridBackground && 'pastel-grid',
        settings.reduceTransparency ? 'solid-ui' : 'airy-ui',
      )}
    >
      <header className="sticky top-0 z-40 border-b bg-card/95 shadow-sm backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blush text-rose-700 shadow-soft">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <MoonStar className="size-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold">Pastel Tasks</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.displayName || user?.email}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navigationItems.map((item) => (
              <NavigationLink item={item} key={item.to} />
            ))}
          </nav>

          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut />
            <span className="hidden sm:inline">Đăng xuất</span>
          </Button>
        </div>
      </header>

      <main className="container pb-24 pt-6 md:pb-10">
        <Outlet />
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 gap-2 rounded-lg border bg-card/95 p-2 shadow-soft backdrop-blur-sm md:hidden">
        {navigationItems.map((item) => (
          <NavigationLink item={item} compact key={item.to} />
        ))}
      </nav>

      <Sparkles className="pointer-events-none fixed bottom-24 right-5 size-8 text-primary/30 md:bottom-8" />
    </div>
  )
}
