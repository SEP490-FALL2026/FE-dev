import { useState } from 'react'
import { SpendBatchDetail } from '../components/spend-batch-detail'
import { SpendBatchDepartmentList, type SpendBatchDepartment } from '../components/spend-batch-department-list'
import { SpendBatchList } from '../components/spend-batch-list'

export function FinanceSpendBatchesView() {
  const [selectedDepartment, setSelectedDepartment] = useState<SpendBatchDepartment | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)

  if (!selectedDepartment) {
    return <SpendBatchDepartmentList onOpen={setSelectedDepartment} />
  }

  if (selectedBatchId) {
    return (
      <SpendBatchDetail
        batchId={selectedBatchId}
        departmentName={selectedDepartment.name}
        onClose={() => setSelectedBatchId(null)}
      />
    )
  }

  return (
    <SpendBatchList
      department={selectedDepartment}
      onBack={() => setSelectedDepartment(null)}
      onOpen={setSelectedBatchId}
    />
  )
}
