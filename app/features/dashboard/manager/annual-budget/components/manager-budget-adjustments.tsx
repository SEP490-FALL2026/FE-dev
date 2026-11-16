import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useBudgetAdjustmentList } from '~/shared/api/generated/operations/budget-adjustments/budget-adjustment-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { Dialog } from '../../../dashboard-ui'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerField,
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ADJUSTMENT_STATE } from '../enums/adjustment-state'
import { ManagerBudgetLabel } from './manager-budget-label'

export function ManagerBudgetAdjustments({ year, costCenterId }: { year: number; costCenterId: string }) {
  const { t } = useTranslation('manager')
  const { formatDateTime } = useWorkspaceFormat()
  const [params, setParams] = useSearchParams()
  const state = Object.values(ADJUSTMENT_STATE).find((value) => value === params.get('adjustmentState'))
  const paging = useManagerPage('adjustmentPage')
  const query = useBudgetAdjustmentList({
    year,
    costCenterId,
    ...(state ? { state } : {}),
    page: paging.page,
    pageSize: paging.pageSize
  })
  const items = !query.isError
    ? (query.data?.data?.items ?? []).filter(
        (item) => item.year === year && (item.from?.id === costCenterId || item.to?.id === costCenterId)
      )
    : []
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = items.find((item) => item.id === selectedId)
  return (
    <ManagerSection title={t('budgetWorkspace.views.adjustments')} description={t('budgetWorkspace.adjustmentHint')}>
      <div className='max-w-56'>
        <ManagerField label={t('status')}>
          <select
            className={managerInputClass}
            value={state ?? ''}
            onChange={(event) => {
              setSelectedId(null)
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                if (event.target.value) next.set('adjustmentState', event.target.value)
                else next.delete('adjustmentState')
                next.delete('adjustmentPage')
                return next
              })
            }}
          >
            <option value=''>{t('budgetWorkspace.allStates')}</option>
            {Object.values(ADJUSTMENT_STATE).map((value) => (
              <option key={value} value={value}>
                {t(`budgetWorkspace.adjustmentStates.${value}`)}
              </option>
            ))}
          </select>
        </ManagerField>
      </div>
      <ManagerQueryState query={query} empty={!items.length} />
      {!query.isError && (
        <ManagerDataTable
          label={t('budgetWorkspace.views.adjustments')}
          items={items}
          rowKey={(item) => item.id}
          columns={[
            {
              key: 'kind',
              label: t('budgetWorkspace.kind'),
              render: (item) => <ManagerBudgetLabel group='adjustmentKinds' value={item.kind} />
            },
            {
              key: 'from',
              label: t('budgetWorkspace.from'),
              render: (item) => (
                <p className='max-w-40 truncate' title={item.from?.name}>
                  {item.from?.name ?? t('notReported')}
                </p>
              )
            },
            {
              key: 'to',
              label: t('budgetWorkspace.to'),
              render: (item) => (
                <p className='max-w-40 truncate' title={item.to?.name}>
                  {item.to?.name ?? t('notReported')}
                </p>
              )
            },
            {
              key: 'amount',
              label: t('amount'),
              align: 'right',
              render: (item) => <ManagerMoney money={item.amount} />
            },
            {
              key: 'state',
              label: t('status'),
              render: (item) => <ManagerBudgetLabel group='adjustmentStates' value={item.state} />
            }
          ]}
          onOpen={(item) => setSelectedId(item.id)}
        />
      )}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      {selected && (
        <Dialog presentation='drawer' title={t('budgetWorkspace.adjustmentDetail')} onClose={() => setSelectedId(null)}>
          <div className='flex flex-wrap gap-2'>
            <ManagerBudgetLabel group='adjustmentKinds' value={selected.kind} />
            <ManagerBudgetLabel group='adjustmentStates' value={selected.state} />
          </div>
          <dl className='grid gap-4 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{t('budgetWorkspace.from')}</dt>
              <dd className='mt-1 break-words'>{selected.from?.name ?? t('notReported')}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('budgetWorkspace.to')}</dt>
              <dd className='mt-1 break-words'>{selected.to?.name ?? t('notReported')}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('amount')}</dt>
              <dd className='mt-1 text-right font-mono tabular-nums'>
                <ManagerMoney money={selected.amount} />
              </dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('budgetWorkspace.createdAt')}</dt>
              <dd className='mt-1 text-right font-mono tabular-nums'>{formatDateTime(selected.createdAt)}</dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-muted-foreground'>{t('reason')}</dt>
              <dd className='mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]'>{selected.reason}</dd>
            </div>
            {selected.decisionReason && (
              <div className='sm:col-span-2'>
                <dt className='text-muted-foreground'>{t('budgetWorkspace.decisionReason')}</dt>
                <dd className='mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]'>{selected.decisionReason}</dd>
              </div>
            )}
            {selected.decidedAt && (
              <div>
                <dt className='text-muted-foreground'>{t('budgetWorkspace.decidedAt')}</dt>
                <dd className='mt-1 text-right font-mono tabular-nums'>{formatDateTime(selected.decidedAt)}</dd>
              </div>
            )}
          </dl>
        </Dialog>
      )}
    </ManagerSection>
  )
}
