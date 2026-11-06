import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ReleaseListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-commitments'
import { useBudgetCommitmentReleases } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-releases'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { FinanceEmpty, FinancePagination, FinanceQueryState, FinanceSection } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { ReleaseReason } from '../enums/release-reason'

const pageSize = 20

const isReleaseReason = (value: string): value is ReleaseReason =>
  (Object.values(ReleaseReason) as string[]).includes(value)

export function CommitmentReleases({ commitmentId }: { commitmentId: string }) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const { formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const releases = useBudgetCommitmentReleases(commitmentId, { page, pageSize })
  const reasonOf = (release: ReleaseListResponseDtoDataItemsItem) => {
    const reason = isReleaseReason(release.reason) ? translate(`releaseReason.${release.reason}`) : translate('unknown')
    return release.reasonText ? `${reason}: ${release.reasonText}` : reason
  }
  return (
    <FinanceSection title={translate('commitments.releases.title')}>
      <FinanceQueryState query={releases}>
        {releases.data?.data?.items.length ? (
          <FinanceTable
            items={releases.data.data.items}
            rowKey={(release) => release.id}
            columns={[
              {
                key: 'releasedAt',
                label: translate('commitments.releases.releasedAt'),
                numeric: true,
                render: (release) => <span className='text-xs'>{formatDateTime(release.releasedAt)}</span>
              },
              {
                key: 'amount',
                label: translate('commitments.releases.amount'),
                numeric: true,
                render: (release) => formatMoney(release.amount, i18n.language)
              },
              {
                key: 'reason',
                label: translate('commitments.releases.reason'),
                render: (release) => <span title={reasonOf(release)}>{reasonOf(release)}</span>
              },
              {
                key: 'releasedBy',
                label: translate('commitments.releases.releasedBy'),
                render: (release) => release.releasedBy?.fullName ?? translate('commitments.releases.system')
              }
            ]}
          />
        ) : (
          <FinanceEmpty message={translate('commitments.releases.empty')} />
        )}
        <FinancePagination pagination={releases.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinanceSection>
  )
}
