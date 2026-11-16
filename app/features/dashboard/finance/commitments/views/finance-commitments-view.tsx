import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceCommitments, type CommitmentItem } from '../hooks/use-finance-commitments'
import type { FinanceTabKey } from '../../enums'
import { CommitmentRowActions } from '../components/commitment-row-actions'

const validYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 2000 && Number(value) <= 2200

export function FinanceCommitmentsView({
  onSelectTab
}: {
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const [page, setPage] = useState(1)
  const [costCenterId, setCostCenterId] = useState<string>('')
  const [state, setState] = useState<'HELD' | 'RELEASED' | 'EXPENSED' | ''>('HELD')
  const [year, setYear] = useState<string>(String(new Date().getFullYear()))
  const [attached, setAttached] = useState<'' | 'true' | 'false'>('')

  const costCenters = useCostCenterList({ pageSize: 100 })

  const parsedYear = validYear(year) ? Number(year) : undefined

  const query = useFinanceCommitments({
    page,
    pageSize: 20,
    costCenterId: costCenterId || undefined,
    state: state || undefined,
    attached: attached === '' ? undefined : attached,
    year: parsedYear
  })

  const commitments = query.data?.items ?? []
  const pagination = query.data?.pagination

  return (
    <FinancePage title={translateFinance('commitments')} description={translateFinance('commitmentsDescription')}>
      <FinanceToolbar>
        <div className='sm:w-64'>
          <FinanceField label={translate('costCenters')}>
            <FinanceSelect
              value={costCenterId}
              onChange={(e) => {
                setCostCenterId(e.target.value)
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {costCenters.data?.data?.items.map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.code} · {cc.name}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>

        <div className='sm:w-56'>
          <FinanceField label={translate('status')}>
            <FinanceSelect
              value={state}
              onChange={(e) => {
                const next = ['HELD', 'RELEASED', 'EXPENSED'].find((value) => value === e.target.value)
                setState(next === 'HELD' || next === 'RELEASED' || next === 'EXPENSED' ? next : '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {(['HELD', 'EXPENSED', 'RELEASED'] as const).map((value) => (
                <option key={value} value={value}>
                  {translateFinance(`status.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>

        <div className='sm:w-56'>
          <FinanceField label={translate('commitmentsList.attachedFilter')}>
            <FinanceSelect
              value={attached}
              onChange={(e) => {
                setAttached(e.target.value === 'true' ? 'true' : e.target.value === 'false' ? 'false' : '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              <option value='true'>{translate('commitmentsList.attachedYes')}</option>
              <option value='false'>{translate('commitmentsList.attachedNo')}</option>
            </FinanceSelect>
          </FinanceField>
        </div>

        <div className='sm:w-40'>
          <FinanceField label={translate('budgetYear')} error={validYear(year) ? null : translate('invalidYear')}>
            <input
              type='number'
              inputMode='numeric'
              min={2000}
              max={2200}
              className={`${financeInputClass} font-mono tabular-nums`}
              placeholder={translate('budgetYearPlaceholder')}
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>

      <FinanceQueryState query={query}>
        <FinanceTable<CommitmentItem>
          items={commitments}
          rowKey={(item) => item.id}
          onOpen={(item) =>
            onSelectTab?.('commitment-detail', {
              id: item.id,
              request: item.requestId,
              cc: item.costCenter.id,
              year: String(item.year)
            })
          }
          columns={[
            {
              key: 'costCenter',
              label: translate('department'),
              render: (item) => <span className='font-semibold text-foreground'>{item.costCenter.name}</span>
            },
            {
              key: 'software',
              label: translate('application'),
              render: (item) => (
                <span className='font-medium text-foreground'>
                  {item.request?.software.name ?? translate('application')}
                </span>
              )
            },
            {
              key: 'requester',
              label: translateFinance('submittedBy'),
              render: (item) =>
                item.request?.requester ? (
                  <span className='font-medium text-foreground'>{item.request.requester.fullName}</span>
                ) : (
                  '—'
                )
            },
            {
              key: 'state',
              label: translate('status'),
              render: (item) => (
                <div className='space-y-1'>
                  <FinanceStatus value={item.state} />
                  {item.hasDiscrepancy && (
                    <div className='text-xs font-medium text-danger'>{translate('commitmentsList.discrepancy')}</div>
                  )}
                  {!item.attached && (
                    <div className='text-xs text-warning-ink'>
                      {translate(`commitmentsList.unattached.${item.unattachedReason ?? 'NO_BUDGET'}`)}
                    </div>
                  )}
                </div>
              )
            },
            {
              key: 'actions',
              label: translateFinance('actions'),
              actions: true,
              render: (item) => (
                <CommitmentRowActions
                  commitment={item}
                  onRelease={() => onSelectTab?.('commitment-release', { id: item.id, request: item.requestId })}
                />
              )
            }
          ]}
        />
        <FinancePagination pagination={pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
