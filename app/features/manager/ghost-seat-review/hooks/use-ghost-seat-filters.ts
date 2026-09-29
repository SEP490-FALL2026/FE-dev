import { useSearchParams } from 'react-router'
import { ghostSeats, filterGhostSeats } from '~/entities/license/ghost-seats-demo'

export function useGhostSeatFilters() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const tab = params.get('tab') === 'critical' ? 'critical' : 'all'
  const tier = ['critical', 'medium', 'low'].includes(params.get('tier') ?? '') ? params.get('tier')! : ''
  const recommendation = ['reclaim', 'keep', 'exempt'].includes(params.get('recommendation') ?? '')
    ? params.get('recommendation')!
    : ''
  const application = ghostSeats.some((seat) => seat.id === params.get('application')) ? params.get('application')! : ''
  const sort = ['activity', 'activityDesc', 'confidence', 'confidenceAsc'].includes(params.get('sort') ?? '')
    ? params.get('sort')!
    : ''
  const size = params.get('size') === '5' ? 5 : 10
  const filtered = filterGhostSeats(params)
  const pages = Math.max(1, Math.ceil(filtered.length / size))
  const rawPage = Number(params.get('page') ?? 1)
  const page = Math.min(pages, Math.max(1, Number.isSafeInteger(rawPage) ? rawPage : 1))
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: true })
  }
  return {
    search,
    tab,
    tier,
    recommendation,
    application,
    sort,
    size,
    page,
    pages,
    filtered,
    rows: filtered.slice((page - 1) * size, page * size),
    update,
    reset: () => setParams({}, { replace: true })
  }
}

export type GhostSeatFilters = ReturnType<typeof useGhostSeatFilters>
