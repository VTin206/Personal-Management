const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email) {
  const value = email.trim()

  if (!value) {
    return 'Vui lòng nhập email.'
  }

  if (!EMAIL_REGEX.test(value)) {
    return 'Email không đúng định dạng. Ví dụ: ban@example.com.'
  }

  return ''
}

export function validatePassword(password, { minLength = 1 } = {}) {
  if (!password) {
    return 'Vui lòng nhập mật khẩu.'
  }

  if (password.length < minLength) {
    return `Mật khẩu cần ít nhất ${minLength} ký tự.`
  }

  return ''
}

export function validateLoginForm(form) {
  return {
    email: validateEmail(form.email),
    password: validatePassword(form.password),
  }
}

export function validateRegisterForm(form) {
  return {
    displayName:
      form.displayName.trim().length > 40 ? 'Tên hiển thị không nên quá 40 ký tự.' : '',
    email: validateEmail(form.email),
    password: validatePassword(form.password, { minLength: 6 }),
    confirmPassword:
      form.confirmPassword !== form.password ? 'Mật khẩu xác nhận chưa khớp.' : '',
  }
}

export function hasValidationErrors(errors) {
  return Object.values(errors).some(Boolean)
}
