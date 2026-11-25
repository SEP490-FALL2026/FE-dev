import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useSeatMonthChargeList } from '~/shared/api/generated/operations/seat-month-charges/seat-month-charge-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { Dialog } from '../../../dashboard-ui'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerField,
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection
} from '../../shared/components/manager-api-ui'
import { ManagerSelect } from '../../shared/components/manager-select'
import { useManagerPage } from '../../shared/hooks/use-manager-page'

export function ManagerSeatMonthCharges({ year, costCenterId }: { year: number; costCenterId: string }) {
  const { t } = useTranslation('manager')
  const { formatNumber } = useWorkspaceFormat()
  const [params, setParams] = useSearchParams()
  const candidate = Number(params.get('month'))
  const month = Number.isInteger(candidate) && candidate >= 1 && candidate <= 12 ? candidate : new Date().getMonth() + 1
  const paging = useManagerPage('chargePage')
  const query = useSeatMonthChargeList({ year, month, costCenterId, page: paging.page, pageSize: paging.pageSize })
  const items = !query.isError
    ? (query.data?.data?.items ?? []).filter((item) => item.costCenter?.id === costCenterId)
    : []
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = items.find((item) => item.id === selectedId)
  return (
    <ManagerSection title={t('budgetWorkspace.views.charges')} description={t('budgetWorkspace.chargeHint')}>
      <div className='soft-panel max-w-sm px-4 pt-3'>
        <ManagerField label={t('budgetWorkspace.month')}>
          <ManagerSelect
            value={String(month)}
            placeholder={t('ui.placeholders.month')}
            options={Array.from({ length: 12 }, (_, index) => index + 1).map((value) => ({
              value: String(value),
              label: t('budgetWorkspace.monthYear', { month: formatNumber(value), year })
            }))}
            onChange={(value) => {
              if (!value) return
              setSelectedId(null)
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                next.set('month', value)
                next.delete('chargePage')
                return next
              })
            }}
          />
        </ManagerField>
      </div>
      <ManagerQueryState query={query} empty={!items.length} />
      {!query.isError && (
        <ManagerDataTable
          label={t('budgetWorkspace.views.charges')}
          items={items}
          rowKey={(item) => item.id}
          columns={[
            {
              key: 'employee',
              label: t('budgetWorkspace.employee'),
              render: (item) => (
                <div>
                  <p className='max-w-56 truncate' title={item.employee?.fullName}>
                    {item.employee?.fullName ?? t('notReported')}
                  </p>
                  <p className='mt-1 font-mono text-xs text-muted-foreground'>{item.employee?.employeeCode}</p>
                </div>
              )
            },
            {
              key: 'days',
              label: t('budgetWorkspace.days'),
              align: 'right',
              render: (item) => `${formatNumber(item.days)} / ${formatNumber(item.daysInMonth)}`
            },
            {
              key: 'price',
              label: t('budgetWorkspace.monthlyPrice'),
              align: 'right',
              render: (item) => <ManagerMoney money={item.monthlyPrice} />
            },
            {
              key: 'amount',
              label: t('amount'),
              align: 'right',
              render: (item) => <ManagerMoney money={item.amount} />
            }
          ]}
          onOpen={(item) => setSelectedId(item.id)}
        />
      )}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      {selected && (
        <Dialog presentation='drawer' title={t('budgetWorkspace.chargeDetail')} onClose={() => setSelectedId(null)}>
          <dl className='grid gap-4 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{t('budgetWorkspace.employee')}</dt>
              <dd className='mt-1 break-words'>{selected.employee?.fullName ?? t('notReported')}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('costCenter')}</dt>
              <dd className='mt-1 break-words'>{selected.costCenter?.name}</dd>
            </div>
            <div>
              <dt className='text-right text-muted-foreground'>{t('budgetWorkspace.month')}</dt>
              <dd className='mt-1 text-right font-mono tabular-nums'>
                {t('budgetWorkspace.monthYear', { month: formatNumber(month), year })}
              </dd>
            </div>
            <div>
              <dt className='text-right text-muted-foreground'>{t('amount')}</dt>
              <dd className='mt-1 text-right font-mono tabular-nums'>
                <ManagerMoney money={selected.amount} />
              </dd>
            </div>
            <div>
              <dt className='text-right text-muted-foreground'>{t('budgetWorkspace.appliedToCommitment')}</dt>
              <dd className='mt-1 text-right font-mono tabular-nums'>
                <ManagerMoney money={selected.appliedToCommitment} />
              </dd>
            </div>
          </dl>
        </Dialog>
      )}
    </ManagerSection>
  )
}
