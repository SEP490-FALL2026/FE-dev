const dayPattern = /^(\d{4})-(\d{2})-(\d{2})$/

const pad = (value: number) => String(value).padStart(2, '0')

function localMidnight(day: string, addDays = 0): Date | null {
  const match = dayPattern.exec(day)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + addDays)
  return Number.isNaN(date.getTime()) ? null : date
}

/** ISO instant with the browser's UTC offset at that moment, e.g. `2026-11-01T00:00:00+07:00`. */
function toOffsetIso(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absolute = Math.abs(offsetMinutes)
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return `${day}T00:00:00${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`
}

export interface SubmittedWindow {
  invalid: boolean
  submittedFrom?: string
  submittedTo?: string
}

/**
 * Turns two inclusive calendar days from date inputs into the half-open window the API filters by:
 * `submittedFrom` is the start of the first day, `submittedTo` the start of the day after the last one.
 */
export function submittedWindow(fromDay: string, toDay: string): SubmittedWindow {
  const start = fromDay ? localMidnight(fromDay) : null
  const end = toDay ? localMidnight(toDay, 1) : null
  if ((fromDay && !start) || (toDay && !end)) return { invalid: true }
  if (fromDay && toDay && fromDay > toDay) return { invalid: true }
  return {
    invalid: false,
    submittedFrom: start ? toOffsetIso(start) : undefined,
    submittedTo: end ? toOffsetIso(end) : undefined
  }
}
