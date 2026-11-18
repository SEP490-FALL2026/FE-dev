import { CalendarClock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BudgetAdjustmentListState } from '~/shared/api/generated/model/budget-adjustments'
import { useBudgetAdjustmentList } from '~/shared/api/generated/operations/budget-adjustments'
import { useBudgetCycleGet } from '~/shared/api/generated/operations/budget-cycles'
import {
  FinanceButton,
  FinanceEmpty,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import { AdjustmentCreateDialog } from '../components/adjustment-create-dialog'
import { CostCenterPicker } from '../components/cost-center-picker'

const validYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 2000 && Number(value) <= 2100

export function FinanceAdjustmentsView() {
  const { t: translate, i18n } = useTranslation('financeReview')
  const { page, pageSize, setPage, year, setYear } = useFinanceList()
  const [state, setState] = useState<BudgetAdjustmentListState | ''>('')
  const [costCenterId, setCostCenterId] = useState('')
  const [creating, setCreating] = useState(false)
  const query = useBudgetAdjustmentList({
    page,
    pageSize,
    ...(validYear(year) ? { year: Number(year) } : {}),
    ...(state ? { state } : {}),
    ...(costCenterId ? { costCenterId } : {})
  })
  const result = query.data?.data
  // An adjustment is only taken once the cycle of the year is locked (after the submission deadline).
  const cycleYear = validYear(year) ? Number(year) : new Date().getFullYear()
  const cycle = useBudgetCycleGet(cycleYear, { query: { retry: false } }).data?.data
  const cycleOpen = cycle?.status === 'DRAFT' || cycle?.status === 'OPEN'
  const costCenterLabel = (costCenter: { code: string; name: string } | null) =>
    costCenter ? `${costCenter.code} · ${costCenter.name}` : '—'

  return (
    <FinancePage
      title={translate('adjustments.title')}
      description={translate('adjustments.description')}
      actions={
        <FinanceButton
          variant='primary'
          disabled={cycleOpen}
          title={cycleOpen ? translate('adjustments.cycleNotLocked') : undefined}
          onClick={() => setCreating(true)}
        >
          {translate('adjustments.create')}
        </FinanceButton>
      }
    >
      {cycleOpen && cycle && (
        <p
          role='status'
          className='flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-ink'
        >
          <CalendarClock aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          {translate('adjustments.cycleNotLockedOn', { date: cycle.submissionDeadline })}
        </p>
      )}
      <FinanceToolbar>
        <div className='sm:w-32'>
          <FinanceField
            label={translate('year')}
            floatingError
            error={year !== '' && !validYear(year) ? translate('yearInvalid') : null}
          >
            <input
              type='number'
              inputMode='numeric'
              min={2000}
              max={2100}
              placeholder={translate('ui.yearPlaceholder', { year: new Date().getFullYear() })}
              aria-invalid={(year !== '' && !validYear(year)) || undefined}
              className={`${financeInputClass} font-mono tabular-nums`}
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </FinanceField>
        </div>
        <div className='sm:w-48'>
          <FinanceField label={translate('state')}>
            <FinanceSelect
              value={state}
              placeholder={translate('ui.statePlaceholder')}
              onChange={(event) => {
                setState(event.target.value as BudgetAdjustmentListState | '')
                setPage(1)
              }}
            >
              <option value=''>{translate('allStates')}</option>
              {Object.values(BudgetAdjustmentListState).map((value) => (
                <option key={value} value={value}>
                  {translate(`adjustments.states.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-72 sm:flex-1'>
          <FinanceField label={translate('costCenter')}>
            <CostCenterPicker
              value={costCenterId}
              allLabel={translate('allCostCenters')}
              placeholder={translate('ui.costCenterFilterPlaceholder')}
              onChange={(next) => {
                setCostCenterId(next)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceSection
        title={translate('ui.adjustmentList')}
        actions={
          result?.pagination ? (
            <span className='text-sm text-muted-foreground tabular-nums'>
              {translate('ui.resultCount', { count: result.pagination.totalItems })}
            </span>
          ) : undefined
        }
      >
        <FinanceQueryState query={query}>
          {result && result.items.length === 0 ? (
            <FinanceEmpty message={translate('ui.noAdjustments')} />
          ) : (
            <FinanceTable
              items={result?.items ?? []}
              rowKey={(adjustment) => adjustment.id}
              columns={[
                {
                  key: 'year',
                  label: translate('year'),
                  numeric: true,
                  align: 'center',
                  render: (adjustment) => adjustment.year
                },
                {
                  key: 'kind',
                  label: translate('adjustments.kind'),
                  render: (adjustment) => (
                    <div>
                      <div>{translate(`adjustments.kinds.${adjustment.kind}`)}</div>
                      {adjustment.transferReason && (
                        <div className='text-xs text-muted-foreground'>
                          {translate(`adjustments.transferReasons.${adjustment.transferReason}`)}
                        </div>
                      )}
                    </div>
                  )
                },
                {
                  key: 'from',
                  label: translate('adjustments.from'),
                  render: (adjustment) => costCenterLabel(adjustment.from)
                },
                {
                  key: 'to',
                  label: translate('adjustments.to'),
                  render: (adjustment) => costCenterLabel(adjustment.to)
                },
                {
                  key: 'amount',
                  label: translate('amount'),
                  numeric: true,
                  render: (adjustment) => formatMoney(adjustment.amount, i18n.language)
                },
                {
                  key: 'reason',
                  label: translate('reason'),
                  render: (adjustment) => <span title={adjustment.reason}>{adjustment.reason}</span>
                },
                {
                  key: 'createdBy',
                  label: translate('adjustments.createdAt'),
                  render: (adjustment) =>
                    adjustment.createdBy
                      ? translate('adjustments.createdBy', {
                          name: adjustment.createdBy.fullName,
                          date: adjustment.createdAt.slice(0, 10)
                        })
                      : adjustment.createdAt.slice(0, 10)
                },
                {
                  key: 'state',
                  label: translate('state'),
                  render: (adjustment) => (
                    <FinanceStatus
                      value={adjustment.state}
                      label={translate(`adjustments.states.${adjustment.state}`)}
                    />
                  )
                },
                {
                  key: 'decision',
                  label: translate('adjustments.decision'),
                  render: (adjustment) =>
                    adjustment.decidedBy ? (
                      <div className='space-y-0.5'>
                        <div>
                          {translate('adjustments.decidedBy', {
                            name: adjustment.decidedBy.fullName,
                            date: (adjustment.decidedAt ?? '').slice(0, 10)
                          })}
                        </div>
                        {adjustment.decisionReason && (
                          <div className='text-xs text-muted-foreground'>{adjustment.decisionReason}</div>
                        )}
                        {adjustment.createdVersionId && (
                          <div className='text-xs text-muted-foreground'>{translate('adjustments.createdVersion')}</div>
                        )}
                      </div>
                    ) : (
                      translate('adjustments.pending')
                    )
                }
              ]}
            />
          )}
          <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
        </FinanceQueryState>
      </FinanceSection>
      {creating && <AdjustmentCreateDialog onClose={() => setCreating(false)} />}
    </FinancePage>
  )
}
