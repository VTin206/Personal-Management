const ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.',
  'auth/invalid-credential': 'Email chưa có tài khoản hoặc mật khẩu chưa đúng.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/invalid-login-credentials': 'Email chưa có tài khoản hoặc mật khẩu chưa đúng.',
  'auth/missing-email': 'Vui lòng nhập email.',
  'auth/missing-password': 'Vui lòng nhập mật khẩu.',
  'auth/operation-not-allowed': 'Firebase chưa bật đăng nhập bằng Email/Password.',
  'auth/account-exists-with-different-credential': 'Email này đã đăng ký bằng phương thức đăng nhập khác.',
  'auth/popup-blocked': 'Trình duyệt đã chặn popup Google. Hãy cho phép popup rồi thử lại.',
  'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập Google.',
  'auth/cancelled-popup-request': 'Yêu cầu đăng nhập Google trước đó đã bị hủy.',
  'auth/unauthorized-domain': 'Domain này chưa được cấp quyền trong Firebase Authentication.',
  'auth/too-many-requests': 'Bạn thử quá nhiều lần. Hãy chờ một lát rồi đăng nhập lại.',
  'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hóa.',
  'auth/user-not-found': 'Email này chưa có tài khoản. Bạn hãy đăng ký trước nhé.',
  'auth/weak-password': 'Mật khẩu cần ít nhất 6 ký tự.',
  'auth/wrong-password': 'Mật khẩu chưa đúng.',
  'auth/network-request-failed': 'Kết nối mạng đang không ổn định.',
  'permission-denied': 'Bạn không có quyền thực hiện thao tác này.',
}

export function getFirebaseErrorMessage(error) {
  return ERROR_MESSAGES[error?.code] ?? error?.message ?? 'Có lỗi xảy ra, thử lại nhé.'
}
