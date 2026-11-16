/** The read DTO currently omits this documented field. Validate it at the API boundary. */
export function readEmployeeContractDate(employee: unknown): string | null {
  if (!employee || typeof employee !== 'object' || !('contractEndDate' in employee)) return null
  const date = employee.contractEndDate
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const parsed = new Date(`${date}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : null
}
