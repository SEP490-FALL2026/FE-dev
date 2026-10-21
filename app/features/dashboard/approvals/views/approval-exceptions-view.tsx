import { ArrowRight, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterChips, Notice, PageHeader, Panel, Pill } from '../../dashboard-ui'
import { actionsNeedingApproval, type BudgetException } from '../../finance/annual-budget-data'
import { useAnnualBudgetState } from '../../finance/annual-budget-store'
import type { ApprovalTabKey } from '../approvals-nav'
import { ApprovalAdjustmentDetail } from './approval-adjustment-detail'
import { ApprovalExceptionDetail, approvalStatusOf, approvalStatusTones } from './approval-exception-detail'
import {
  ApprovalExceptionsFilters,
  defaultApprovalExceptionFilters,
  matchesApprovalExceptionFilters,
  type ApprovalExceptionFacts,
  type ApprovalExceptionFilters,
  type ExceptionItemType
} from './approval-exceptions-filters'

/** Exceptions Finance resolved with an option that only takes effect once the Spending Approver agrees. */
const needsApproval = (exception: BudgetException) =>
  exception.resolution !== undefined && actionsNeedingApproval.includes(exception.resolution.action)

interface Row extends ApprovalExceptionFacts {
  id: string
  kind: string
  option: string
  proposed: number | null
  reference: string
  subject: string
  subjectHint: string
}

/**
 * APV-07: budget exceptions Finance submitted (top-up or exception approval) and changes to an approved budget.
 * The list opens first; choosing an item opens its decision screen (`id` search param).
 */
export function ApprovalExceptionsView({
  formatCurrency,
  itemId,
  onSelectTab
}: {
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const state = useAnnualBudgetState()
  const [type, setType] = useState<ExceptionItemType>('exceptions')
  const [filters, setFilters] = useState<ApprovalExceptionFilters>(defaultApprovalExceptionFilters)
  const exceptions = state.exceptions.filter(needsApproval)
  const back = () => onSelectTab('exception-approval')

  const selectedException = exceptions.find((item) => item.id === itemId)
  if (selectedException) {
    return (
      <ApprovalExceptionDetail
        exception={selectedException}
        formatCurrency={formatCurrency}
        key={selectedException.id}
        onBack={back}
      />
    )
  }
  const selectedAdjustment = state.adjustments.find((item) => item.id === itemId)
  if (selectedAdjustment) {
    return (
      <ApprovalAdjustmentDetail
        adjustment={selectedAdjustment}
        formatCurrency={formatCurrency}
        key={selectedAdjustment.id}
        onBack={back}
      />
    )
  }

  const rows: Record<ExceptionItemType, Row[]> = {
    adjustments: state.adjustments.map((item) => ({
      costCenter: item.costCenter,
      direction: item.after >= item.before ? 'increase' : 'decrease',
      id: item.id,
      kind: t('budgetPlan.approverExceptions.adjustment.kind'),
      option: t(
        item.after >= item.before
          ? 'budgetPlan.approverExceptions.adjustment.optionIncrease'
          : 'budgetPlan.approverExceptions.adjustment.optionDecrease'
      ),
      proposed: item.after,
      reference: item.id.toUpperCase(),
      searchText: `${item.id} ${item.costCenter} ${item.reason}`,
      status: approvalStatusOf(item.approval),
      subject: item.costCenter,
      subjectHint: t('budgetPlan.fiscalYear', { year: item.year })
    })),
    exceptions: exceptions.map((item) => ({
      costCenter: item.costCenter,
      id: item.id,
      kind: t(`budgetPlan.check.result.${item.kind}`),
      exceptionKind: item.kind,
      option: item.resolution ? t(`budgetPlan.exceptions.action.${item.resolution.action}`) : '',
      action: item.resolution?.action,
      proposed: item.resolution?.topUp ?? null,
      reference: item.requestCode,
      searchText: [item.requestCode, item.software, item.costCenter, item.detail, item.resolution?.note ?? ''].join(
        ' '
      ),
      status: approvalStatusOf(item.approval),
      subject: item.software,
      subjectHint: item.costCenter
    }))
  }
  const visible = rows[type].filter((row) => matchesApprovalExceptionFilters(row, filters, type))
  const head = 'py-2.5 pr-3 font-semibold'

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('budgetPlan.approverExceptions.subtitle')}
        title={t('budgetPlan.approverExceptions.title')}
      />

      <Panel className='space-y-4'>
        <FilterChips<ExceptionItemType>
          label={t('budgetPlan.approverExceptions.typeLabel')}
          onChange={(value) => {
            // Each type has its own fields and cost centers, so switching starts from the defaults again.
            setType(value)
            setFilters(defaultApprovalExceptionFilters)
          }}
          options={(['exceptions', 'adjustments'] as const).map((value) => ({
            count: rows[value].filter((row) => row.status === 'pending').length,
            label: t(`budgetPlan.approverExceptions.type.${value}`),
            value
          }))}
          value={type}
        />
        {type === 'adjustments' && (
          <Notice icon={Info} tone='info'>
            {t('budgetPlan.approverExceptions.adjustment.demoNote')}
          </Notice>
        )}
      </Panel>

      <ApprovalExceptionsFilters
        applied={filters}
        costCenters={[...new Set(rows[type].map((row) => row.costCenter))].sort()}
        key={type}
        onApply={setFilters}
        type={type}
      />

      <Panel>
        {visible.length === 0 ? (
          <p className='text-xs text-muted-foreground'>{t('budgetPlan.approverExceptions.empty')}</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-200 text-left text-xs'>
              <thead>
                <tr className='border-b border-border text-muted-foreground'>
                  <th className={head}>{t('budgetPlan.approverExceptions.colReference')}</th>
                  <th className={head}>{t('budgetPlan.approverExceptions.colSubject')}</th>
                  <th className={head}>{t('budgetPlan.approverExceptions.colKind')}</th>
                  <th className={head}>{t('budgetPlan.approverExceptions.colOption')}</th>
                  <th className={`${head} text-right`}>{t('budgetPlan.approverExceptions.colProposed')}</th>
                  <th className={head}>{t('budgetPlan.approverExceptions.colStatus')}</th>
                  <th className='py-2.5'>
                    <span className='sr-only'>{t('budgetPlan.approverExceptions.openDetail')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {visible.map((row) => {
                  const open = () => onSelectTab('exception-approval', { id: row.id })

                  return (
                    <tr className='cursor-pointer transition hover:bg-surface-subtle/60' key={row.id} onClick={open}>
                      <td className='py-3 pr-3 font-mono font-semibold text-primary'>{row.reference}</td>
                      <td className='py-3 pr-3'>
                        <p className='font-semibold text-foreground'>{row.subject}</p>
                        <p className='mt-0.5 font-mono text-[0.7rem] text-muted-foreground'>{row.subjectHint}</p>
                      </td>
                      <td className='py-3 pr-3'>{row.kind}</td>
                      <td className='py-3 pr-3'>{row.option}</td>
                      <td className='py-3 pr-3 text-right font-bold text-foreground'>
                        {row.proposed !== null ? formatCurrency(row.proposed) : null}
                      </td>
                      <td className='py-3 pr-3'>
                        <Pill tone={approvalStatusTones[row.status]}>
                          {t(`budgetPlan.approverExceptions.status.${row.status}`)}
                        </Pill>
                      </td>
                      <td className='py-3 text-right'>
                        <button
                          aria-label={t('budgetPlan.approverExceptions.openDetailFor', { reference: row.reference })}
                          className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                          onClick={(event) => {
                            event.stopPropagation()
                            open()
                          }}
                          type='button'
                        >
                          {t('budgetPlan.approverExceptions.openDetail')}
                          <ArrowRight aria-hidden='true' className='size-3' />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
