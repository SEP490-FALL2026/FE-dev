import { useState } from 'react'
import type { FinanceTabKey } from '../../enums'
import { SpendBatchDetail } from '../components/spend-batch-detail'
import { SpendBatchList } from '../components/spend-batch-list'

interface Props {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

/** Read-only list of every batch the heads submitted, newest first; a batch opens to the Requests it holds. */
export function FinanceSpendBatchesView({ onSelectTab }: Props) {
  const [selected, setSelected] = useState<{ id: string; departmentName: string } | null>(null)
  if (selected)
    return (
      <SpendBatchDetail
        batchId={selected.id}
        departmentName={selected.departmentName}
        onClose={() => setSelected(null)}
        onOpenRequest={(requestId) => onSelectTab?.('request-monitor', { id: requestId })}
      />
    )
  return <SpendBatchList onOpen={(id, departmentName) => setSelected({ id, departmentName })} />
}
