import { useTranslation } from 'react-i18next'
import type { BatchDecisionResponseDtoDataResultsItem } from '~/shared/api/generated/model/spend-approvals/batchDecisionResponseDtoDataResultsItem'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsStatus } from '../../shared/components/approvals-ui'

export function SpendBatchResults({
  results,
  onOpen
}: {
  results: BatchDecisionResponseDtoDataResultsItem[]
  onOpen: (requestId: string) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { t: translateCommon } = useTranslation('approvals')
  return (
    <section aria-label={translate('batchResults')} className='space-y-3'>
      <h2 className='text-lg font-semibold tracking-tight'>{translate('batchResults')}</h2>
      <ApprovalsTable
        items={results}
        rowKey={(result) => result.requestId}
        onOpen={(result) => onOpen(result.requestId)}
        columns={[
          { key: 'id', label: translate('batchRequestId'), numeric: true, render: (result) => result.requestId },
          {
            key: 'outcome',
            label: translate('outcome'),
            render: (result) => <ApprovalsStatus value={result.outcome} />
          },
          {
            key: 'reason',
            label: translate('skippedReason'),
            render: (result) =>
              result.reason
                ? translate(`reasons.${result.reason}`, { defaultValue: translateCommon('unknown') })
                : translate('unavailable')
          }
        ]}
      />
    </section>
  )
}
