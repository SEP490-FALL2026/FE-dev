import { useMemo, useState } from 'react'
import { MOCK_TEAM_REQUESTS, type TeamRequestItem } from '../../manager-data'

export function useManagerRequests() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | TeamRequestItem['status']>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRequests = useMemo(() => {
    return MOCK_TEAM_REQUESTS.filter((req: TeamRequestItem) => {
      const matchStatus = statusFilter === 'ALL' || req.status === statusFilter
      const matchSearch =
        searchTerm === '' ||
        req.saasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchTerm.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [statusFilter, searchTerm])

  const pendingCount = useMemo(() => {
    return MOCK_TEAM_REQUESTS.filter((r: TeamRequestItem) => r.status === 'PENDING').length
  }, [])

  return {
    filteredRequests,
    pendingCount,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    statusFilter,
    totalCount: MOCK_TEAM_REQUESTS.length
  }
}
