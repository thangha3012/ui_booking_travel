const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api'
// Lấy server root (bỏ đoạn /api ở cuối nếu có)
const SERVER_ROOT = API_BASE_URL.replace(/\/api$/, '')

export const getFullImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('/uploads/')) return `${SERVER_ROOT}${path}`
  return path
}
