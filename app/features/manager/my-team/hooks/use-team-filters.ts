import { useSearchParams } from 'react-router'

import { teamMembers } from '~/entities/user/team-members-demo'
import type { TeamFilter } from '../my-team.types'

function normalized(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[đĐ]/g, 'd')
    .toLocaleLowerCase()
}

export function useTeamFilters() {
  const [params, setParams] = useSearchParams()
  const filters = {
    search: params.get('search') ?? '',
    status: params.get('status') ?? '',
    department: params.get('department') ?? '',
    team: params.get('team') ?? '',
    costCenter: params.get('costCenter') ?? ''
  }
  const filtered = teamMembers.filter((member) => {
    const query = normalized(filters.search.trim())
    return (
      (!query || normalized(`${member.name} ${member.email} ${member.department}`).includes(query)) &&
      (!filters.status || member.status === filters.status) &&
      (!filters.department || member.department === filters.department) &&
      (!filters.team || member.team === filters.team) &&
      (!filters.costCenter || member.costCenter === filters.costCenter)
    )
  })
  const size = Number(params.get('size'))
  const pageSize = [5, 10, 20, 50].includes(size) ? size : 10
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const requestedPage = Number(params.get('page'))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1
  const update = (key: TeamFilter | 'page' | 'size', value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: key === 'search' })
  }
  const clear = () => {
    const next = new URLSearchParams(params)
    for (const key of [...Object.keys(filters), 'page']) next.delete(key)
    setParams(next)
  }
  return {
    filters,
    filtered,
    page,
    pageSize,
    pageCount,
    visible: filtered.slice((page - 1) * pageSize, page * pageSize),
    update,
    clear
  }
}
