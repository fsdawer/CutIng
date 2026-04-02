import api from './index'

export const authApi = {
  /** POST /api/auth/register — 회원가입 */
  register: (data) => api.post('/api/auth/register', data),

  /** POST /api/auth/login — 로그인 */
  login: (data) => api.post('/api/auth/login', data),

  /** POST /api/auth/email/send — 이메일 인증 코드 발송 */
  sendVerifyEmail: (email) => api.post('/api/auth/email/send', { email }),

  /** GET /api/auth/email/verify?token=... — 이메일 인증 확인 */
  verifyEmail: (token) => api.get('/api/auth/email/verify', { params: { token } }),

  /** POST /api/auth/refresh — 토큰 갱신 */
  refresh: (refreshToken) =>
    api.post('/api/auth/refresh', null, {
      headers: { 'Refresh-Token': refreshToken },
    }),

  /** POST /api/auth/logout — 로그아웃 */
  logout: () => api.post('/api/auth/logout'),
}
