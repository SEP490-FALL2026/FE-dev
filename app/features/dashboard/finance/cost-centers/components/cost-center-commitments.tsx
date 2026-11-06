import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  FinanceEmpty,
  FinanceQueryState,
  FinanceSection,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import {
  getExtendedCommitmentList,
  getExtendedCommitmentListQueryKey,
  type ExtendedCommitmentItem
} from '../../shared/finance-api-extensions'

export function CostCenterCommitments({
  costCenterId,
  year
}: {
  costCenterId: string
  year?: number
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const query = useQuery({
    queryKey: [...getExtendedCommitmentListQueryKey({ costCenterId, year })],
    queryFn: async ({ signal }) => {
      const result = await getExtendedCommitmentList({ costCenterId, year, pageSize: 50 }, signal)
      return result.data
    }
  })

  const items = query.data?.items ?? []

  return (
    <FinanceSection title={translateFinance('costCenterPayments')}>
      <FinanceQueryState query={query}>
        {items.length > 0 ? (
          <FinanceTable<ExtendedCommitmentItem>
            items={items}
            rowKey={(item) => item.id}
            columns={[
              {
                key: 'software',
                label: translate('application'),
                render: (item) => (
                  <div className='min-w-0'>
                    <div className='font-medium text-foreground'>{item.request?.software.name ?? translate('application')}</div>
                    {item.request?.plan?.name && (
                      <div className='text-xs text-muted-foreground'>{item.request.plan.name}</div>
                    )}
                  </div>
                )
              },
              {
                key: 'requester',
                label: translateFinance('submittedBy'),
                render: (item) => (
                  item.request?.requester ? (
                    <div className='text-xs'>
                      <div className='font-medium text-foreground'>{item.request.requester.fullName}</div>
                      <div className='font-mono text-muted-foreground'>{item.request.requester.employeeCode}</div>
                    </div>
                  ) : (
                    '—'
                  )
                )
              },
              {
                key: 'amount',
                label: translate('kpis.total'),
                numeric: true,
                render: (item) => formatMoney(item.amount, i18n.language)
              },
              {
                key: 'held',
                label: translate('kpis.held'),
                numeric: true,
                render: (item) => formatMoney(item.held, i18n.language)
              },
              {
                key: 'invoiced',
                label: translateFinance('invoiced'),
                numeric: true,
                render: (item) => (item.invoiced ? formatMoney(item.invoiced, i18n.language) : '—')
              },
              {
                key: 'state',
                label: translate('status'),
                render: (item) => <FinanceStatus value={item.state} />
              },
              {
                key: 'approvedAt',
                label: translateFinance('submittedAt'),
                render: (item) =>
                  item.request?.spendApprovedAt
                    ? new Date(item.request.spendApprovedAt).toLocaleDateString(i18n.language)
                    : new Date(item.createdAt).toLocaleDateString(i18n.language)
              }
            ]}
          />
        ) : (
          <FinanceEmpty message={translate('empty', { defaultValue: 'Chưa có khoản cam kết nào trong năm này.' })} />
        )}
      </FinanceQueryState>
    </FinanceSection>
  )
}

