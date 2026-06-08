import { useState } from 'react'
import { Image, Palette, RotateCcw, Save, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/utils/cn'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { ACCENT_OPTIONS, DEFAULT_SETTINGS } from '@/utils/settingsOptions'
import { TASK_STATUSES } from '@/utils/taskOptions'

export function SettingsPage() {
  const { user, updateUserProfile, logout } = useAuth()
  const { settings, setSetting, resetSettings } = useSettings()
  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName ?? '',
    photoURL: user?.photoURL ?? '',
  })
  const [profileError, setProfileError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateProfileField(field, value) {
    setProfileForm((current) => ({ ...current, [field]: value }))
    setProfileError('')
    setProfileMessage('')
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfileError('')
    setProfileMessage('')

    if (profileForm.displayName.trim().length > 40) {
      setProfileError('Tên hiển thị không nên quá 40 ký tự.')
      return
    }

    setSubmitting(true)

    try {
      await updateUserProfile(profileForm)
      setProfileMessage('Đã cập nhật hồ sơ.')
    } catch (error) {
      setProfileError(getFirebaseErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section>
        <h1 className="text-3xl font-bold sm:text-4xl">Cài đặt</h1>
        <p className="mt-2 text-sm text-muted-foreground">Quản lý hồ sơ và cách Pastel Tasks hiển thị.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5 text-primary" />
              Hồ sơ
            </CardTitle>
            <CardDescription>Email chỉ dùng để đăng nhập và đang được hiển thị ở chế độ chỉ đọc.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleProfileSubmit}>
              <div className="flex items-center gap-4 rounded-lg border bg-card-soft p-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blush text-rose-800">
                  {profileForm.photoURL ? (
                    <img
                      src={profileForm.photoURL}
                      alt=""
                      className="size-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserRound className="size-7" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold">{profileForm.displayName || user?.email}</p>
                  <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="displayName">Tên hiển thị</Label>
                <Input
                  id="displayName"
                  value={profileForm.displayName}
                  onChange={(event) => updateProfileField('displayName', event.target.value)}
                  placeholder="Tên của bạn"
                  autoComplete="name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="photoURL">Ảnh đại diện URL</Label>
                <div className="relative">
                  <Image className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="photoURL"
                    className="pl-9"
                    value={profileForm.photoURL}
                    onChange={(event) => updateProfileField('photoURL', event.target.value)}
                    placeholder="https://..."
                    autoComplete="url"
                  />
                </div>
              </div>

              {profileError ? <p className="text-sm font-semibold text-destructive">{profileError}</p> : null}
              {profileMessage ? <p className="text-sm font-semibold text-emerald-700">{profileMessage}</p> : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={logout}>
                  Đăng xuất
                </Button>
                <Button type="submit" disabled={submitting}>
                  <Save />
                  Lưu hồ sơ
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-5 text-primary" />
              Giao diện
            </CardTitle>
            <CardDescription>Tùy chỉnh được lưu trên trình duyệt hiện tại.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3">
              <Label>Màu nhấn</Label>
              <div className="grid grid-cols-2 gap-2">
                {ACCENT_OPTIONS.map((accent) => (
                  <button
                    type="button"
                    key={accent.value}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border bg-card-soft px-3 py-2 text-left text-sm font-semibold transition-colors hover:border-primary',
                      settings.accent === accent.value && 'border-primary ring-2 ring-primary/20',
                    )}
                    onClick={() => setSetting('accent', accent.value)}
                    aria-pressed={settings.accent === accent.value}
                  >
                    <span
                      className="size-4 rounded-md border"
                      style={{ backgroundColor: accent.swatch }}
                    />
                    {accent.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border bg-card-soft p-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-primary"
                checked={settings.showGridBackground}
                onChange={(event) => setSetting('showGridBackground', event.target.checked)}
              />
              <span>
                <span className="block font-semibold">Hiển thị nền caro pastel</span>
                <span className="text-muted-foreground">Giữ cảm giác dễ thương nhưng nền sẽ có họa tiết nhẹ.</span>
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-lg border bg-card-soft p-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-primary"
                checked={settings.reduceTransparency}
                onChange={(event) => setSetting('reduceTransparency', event.target.checked)}
              />
              <span>
                <span className="block font-semibold">Giảm trong suốt</span>
                <span className="text-muted-foreground">Card và thanh điều hướng rõ hơn, dễ đọc hơn.</span>
              </span>
            </label>

            <div className="grid gap-2">
              <Label htmlFor="defaultTaskFilter">Bộ lọc task mặc định</Label>
              <Select
                value={settings.defaultTaskFilter}
                onValueChange={(value) => setSetting('defaultTaskFilter', value)}
              >
                <SelectTrigger id="defaultTaskFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={resetSettings}
              disabled={JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS)}
            >
              <RotateCcw />
              Đưa giao diện về mặc định
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
