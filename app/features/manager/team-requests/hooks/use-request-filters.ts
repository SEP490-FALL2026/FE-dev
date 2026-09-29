import { useSearchParams } from 'react-router'

import { requestStatuses, requestTypes, teamRequests } from '~/entities/request/manager-requests-demo'

const softwareNames = [...new Set(teamRequests.map((request) => request.software))]
export { softwareNames }

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
}

function dateValue(value: string | null, fallback: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback
  const date = new Date(value)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value ? value : fallback
}

export function useRequestFilters() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const type = params.get('type') ?? ''
  const software = params.get('software') ?? ''
  const filters = {
    search: params.get('search') ?? '',
    status: status === 'open' || requestStatuses.some((item) => item === status) ? status : '',
    type: requestTypes.some((item) => item === type) ? type : '',
    software: softwareNames.includes(software) ? software : '',
    from: dateValue(params.get('from'), '2026-08-01'),
    to: dateValue(params.get('to'), '2026-08-31')
  }
  const invalidDates = filters.from > filters.to
  const descending = params.get('sort') === 'desc'
  const query = normalize(filters.search.trim())
  const filtered = teamRequests
    .filter((request) => {
      const date = request.submitted.slice(0, 10)
      return (
        !invalidDates &&
        (!query || normalize(`${request.id} ${request.name} ${request.software}`).includes(query)) &&
        (!filters.status ||
          (filters.status === 'open'
            ? ['pending', 'inProgress', 'overdue'].includes(request.status)
            : request.status === filters.status)) &&
        (!filters.type || request.type === filters.type) &&
        (!filters.software || request.software === filters.software) &&
        date >= filters.from &&
        date <= filters.to
      )
    })
    .sort((a, b) => (descending ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)))
  const size = Number(params.get('size'))
  const pageSize = [3, 10, 20].includes(size) ? size : 10
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const requestedPage = Number(params.get('page'))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1
  function update(key: keyof typeof filters | 'page' | 'size' | 'sort', value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: key === 'search' })
  }
  function reset() {
    const next = new URLSearchParams(params)
    for (const key of [...Object.keys(filters), 'sort', 'page', 'request']) next.delete(key)
    setParams(next)
  }
  return {
    filters,
    invalidDates,
    descending,
    pageSize,
    pageCount,
    page,
    filtered,
    visible: filtered.slice((page - 1) * pageSize, page * pageSize),
    update,
    reset
  }
}
export type RequestFilters = ReturnType<typeof useRequestFilters>
