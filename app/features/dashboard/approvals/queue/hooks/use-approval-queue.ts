import { useMemo, useState } from 'react'
import { approvalQueue, type QueueItem, type QueueItemKind } from '../../approvals-data'

export function useApprovalQueue() {
  const [selectedKind, setSelectedKind] = useState<'ALL' | QueueItemKind>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredQueue = useMemo(() => {
    return approvalQueue.filter((item: QueueItem) => {
      const matchKind = selectedKind === 'ALL' || item.kind === selectedKind
      const matchSearch =
        searchTerm === '' ||
        item.software.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase())
      return matchKind && matchSearch
    })
  }, [selectedKind, searchTerm])

  const highReminderCount = useMemo(() => {
    return approvalQueue.filter((item: QueueItem) => item.reminders > 0).length
  }, [])

  return {
    filteredQueue,
    highReminderCount,
    searchTerm,
    selectedKind,
    setSearchTerm,
    setSelectedKind,
    totalCount: approvalQueue.length
  }
}
