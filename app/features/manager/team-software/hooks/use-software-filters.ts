import { useSearchParams } from 'react-router'

import { samplePeriod, teamSoftware } from '../team-software-demo'

function validDate(value: string | null, fallback: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback
  const date = new Date(value)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value ? value : fallback
}
export function useSoftwareFilters() {
  const [params, setParams] = useSearchParams()
  const filters = {
    search: params.get('search') ?? '',
    status: ['active', 'expired'].includes(params.get('status') ?? '') ? params.get('status')! : '',
    usage: ['high', 'medium', 'low'].includes(params.get('usage') ?? '') ? params.get('usage')! : '',
    ghost: params.get('ghost') === '1',
    expiring: params.get('expiring') === '1',
    from: validDate(params.get('from'), samplePeriod.from),
    to: validDate(params.get('to'), samplePeriod.to)
  }
  const invalidDates = filters.from > filters.to
  const hasSnapshot = !invalidDates && filters.from === samplePeriod.from && filters.to === samplePeriod.to
  const query = filters.search.trim().toLowerCase()
  const filtered = hasSnapshot
    ? teamSoftware.filter(
        (item) =>
          (!query || `${item.name} ${item.plan}`.toLowerCase().includes(query)) &&
          (!filters.status || item.status === filters.status) &&
          (!filters.ghost || item.ghost > 0) &&
          (!filters.expiring || item.expiring > 0) &&
          (!filters.usage ||
            (filters.usage === 'high'
              ? item.usage >= 0.8
              : filters.usage === 'medium'
                ? item.usage >= 0.5 && item.usage < 0.8
                : item.usage < 0.5))
      )
    : []
  const size = Number(params.get('size'))
  const pageSize = [4, 10, 20].includes(size) ? size : 10
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const requestedPage = Number(params.get('page'))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1
  function update(key: keyof typeof filters | 'page' | 'size', value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: key === 'search' })
  }
  function reset() {
    setParams(new URLSearchParams())
  }
  return {
    filters,
    invalidDates,
    hasSnapshot,
    filtered,
    visible: filtered.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    pageCount,
    update,
    reset
  }
}
export type SoftwareFilters = ReturnType<typeof useSoftwareFilters>
