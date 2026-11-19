export function formatDateTime(value: string, language: string | undefined) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return undefined
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
