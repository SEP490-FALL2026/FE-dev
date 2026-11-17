/** A day for people: `YYYY-MM-DD` is read as that calendar day, a timestamp as its local day; never the time. */
export function formatDay(value: string | null | undefined, language: string | undefined): string {
  if (!value) return '—'
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = day ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])) : new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(language?.startsWith('vi') ? 'vi-VN' : 'en-GB')
}
