// src/utils/formatters.js

/**
 * Format tiền VND — ví dụ: 5000000 → "5.000.000 ₫"
 */
export function formatCurrency(amount, locale = 'vi-VN') {
  if (!amount && amount !== 0) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format ngày — ví dụ: "2025-12-25" → "25/12/2025"
 */
export function formatDate(dateStr, locale = 'vi-VN') {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateStr))
}

/**
 * Format ngày + giờ
 */
export function formatDateTime(dateStr, locale = 'vi-VN') {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

/**
 * Tính số ngày giữa 2 ngày
 */
export function daysBetween(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}

/**
 * Rút gọn chuỗi dài
 */
export function truncate(str, length = 100) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}
