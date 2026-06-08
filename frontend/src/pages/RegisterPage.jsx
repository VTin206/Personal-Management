import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Mail, MoonStar, Sparkles, UserPlus } from 'lucide-react'

import { GoogleLogo } from '@/components/GoogleLogo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { hasValidationErrors, validateRegisterForm } from '@/utils/authValidation'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'

export function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: '' }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const validationErrors = validateRegisterForm(form)
    setFieldErrors(validationErrors)

    if (hasValidationErrors(validationErrors)) {
      return
    }

    setSubmitting(true)

    try {
      await register({
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/', { replace: true })
    } catch (registerError) {
      setError(getFirebaseErrorMessage(registerError))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleLogin() {
    setSubmitting(true)
    setFieldErrors({})
    setError('')

    try {
      await loginWithGoogle()
      navigate('/', { replace: true })
    } catch (googleError) {
      setError(getFirebaseErrorMessage(googleError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="pastel-grid flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-5 flex items-center justify-center gap-3 text-center">
          <div className="flex size-11 items-center justify-center rounded-lg bg-mint text-emerald-900 shadow-soft">
            <MoonStar className="size-6" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold">Pastel Tasks</h1>
            <p className="text-sm text-muted-foreground">Tạo tài khoản</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Bắt đầu hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-2">
                <Label htmlFor="displayName">Tên hiển thị</Label>
                <Input
                  id="displayName"
                  className={fieldErrors.displayName ? 'border-destructive' : ''}
                  value={form.displayName}
                  onChange={(event) => updateField('displayName', event.target.value)}
                  placeholder="Tên của bạn"
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.displayName)}
                  aria-describedby={fieldErrors.displayName ? 'display-name-error' : undefined}
                />
                {fieldErrors.displayName ? (
                  <p id="display-name-error" className="text-sm font-semibold text-destructive">
                    {fieldErrors.displayName}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className={fieldErrors.email ? 'border-destructive pl-9' : 'pl-9'}
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="ban@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    required
                  />
                </div>
                {fieldErrors.email ? (
                  <p id="email-error" className="text-sm font-semibold text-destructive">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  className={fieldErrors.password ? 'border-destructive' : ''}
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  required
                />
                {fieldErrors.password ? (
                  <p id="password-error" className="text-sm font-semibold text-destructive">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className={fieldErrors.confirmPassword ? 'border-destructive' : ''}
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                  required
                />
                {fieldErrors.confirmPassword ? (
                  <p id="confirm-password-error" className="text-sm font-semibold text-destructive">
                    {fieldErrors.confirmPassword}
                  </p>
                ) : null}
              </div>

              {error ? (
                <div
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{error}</p>
                </div>
              ) : null}

              <Button type="submit" disabled={submitting}>
                <UserPlus />
                Đăng ký
              </Button>
            </form>

            <div className="mt-5 grid gap-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                hoặc
                <span className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={submitting}
              >
                <GoogleLogo />
                Tiếp tục với Google
              </Button>
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link className="font-semibold text-primary hover:underline" to="/login">
                Đăng nhập
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
