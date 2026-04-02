import api from './index'

export const userApi = {
  /** GET /api/users/me — 내 정보 조회 */
  getMe: () => api.get('/api/users/me'),

  /** PUT /api/users/me — 내 정보 수정 */
  updateMe: (data) => api.put('/api/users/me', data),

  /** PUT /api/users/me/password — 비밀번호 변경 */
  changePassword: (data) => api.put('/api/users/me/password', data),

  /** POST /api/users/me/upgrade — 미용사로 전환 */
  upgradeToStylist: (data) => api.post('/api/users/me/upgrade', data),

  /** DELETE /api/users/me — 회원 탈퇴 */
  deleteMe: () => api.delete('/api/users/me'),
}
