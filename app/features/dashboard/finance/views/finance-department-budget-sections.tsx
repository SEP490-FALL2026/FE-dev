import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Panel, PanelTitle, Pill } from '../../dashboard-ui'
import { saasGroups, unpaidCommitments } from '../annual-budget-data'
import { useAnnualBudgetState } from '../annual-budget-store'
import { budgetQuestions, commitmentsToRecord } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'
import { DonutChartPanel } from './finance-chart-panels'

/* The four compact sections of FIN-09; each shows one department's slice and links to the full screen. */

interface SectionProps {
  costCenter: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

function SectionLink({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation('dashboard')
  return (
    <button
      className='inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline'
      onClick={onClick}
      type='button'
    >
      {t('budgetPlan.department.viewAll')}
      <ArrowRight aria-hidden='true' className='size-3.5' />
    </button>
  )
}

function Empty() {
  const { t } = useTranslation('dashboard')
  return <p className='mt-4 text-xs text-muted-foreground'>{t('budgetPlan.department.empty')}</p>
}

export function DepartmentAllocationSection({
  approved,
  costCenter,
  formatCurrency,
  onSelectTab
}: SectionProps & { approved: number }) {
  const { t } = useTranslation('dashboard')
  const { allocations } = useAnnualBudgetState()
  const groups = saasGroups.filter((group) => allocations[costCenter]?.[group] !== undefined)
  const allocated = groups.reduce((sum, group) => sum + (allocations[costCenter]?.[group] ?? 0), 0)

  const unallocated = Math.max(approved - allocated, 0)

  return (
    <DonutChartPanel
      action={<SectionLink onClick={() => onSelectTab('budget-allocation')} />}
      centerLabel={t('budgetPlan.department.approved')}
      data={[
        ...groups.map((group) => ({
          key: group,
          label: t(`budgetPlan.group.${group}`),
          value: allocations[costCenter]?.[group] ?? 0
        })),
        ...(unallocated > 0
          ? [
              {
                color: 'var(--theme-muted-foreground)',
                key: 'unallocated',
                label: t('budgetPlan.department.unallocated'),
                value: unallocated
              }
            ]
          : [])
      ]}
      formatCurrency={formatCurrency}
      hint={t('budgetPlan.department.allocationHint', { amount: formatCurrency(unallocated) })}
      title={t('budgetPlan.department.allocationTitle')}
    />
  )
}

/** How much of the approved annual budget is used, committed and still free. A negative remainder shows as 0. */
export function DepartmentUsageSection({
  approved,
  committed,
  formatCurrency,
  used
}: {
  approved: number
  committed: number
  formatCurrency: (value: number) => string
  used: number
}) {
  const { t } = useTranslation('dashboard')

  return (
    <DonutChartPanel
      centerLabel={t('budgetPlan.department.approved')}
      data={[
        { key: 'used', label: t('budgetPlan.department.used'), value: used },
        { key: 'committed', label: t('budgetPlan.department.committed'), value: committed },
        {
          color: 'var(--theme-muted-foreground)',
          key: 'remaining',
          label: t('budgetPlan.department.remaining'),
          value: Math.max(approved - used - committed, 0)
        }
      ]}
      formatCurrency={formatCurrency}
      hint={t('budgetPlan.department.usageHint')}
      title={t('budgetPlan.department.usageTitle')}
    />
  )
}

export function DepartmentCommitmentsSection({ costCenter, formatCurrency, onSelectTab }: SectionProps) {
  const { t } = useTranslation('dashboard')
  const unpaid = unpaidCommitments.filter((item) => item.costCenter === costCenter)
  const toRecord = commitmentsToRecord.filter((item) => item.costCenter === costCenter)

  return (
    <Panel>
      <PanelTitle
        action={<SectionLink onClick={() => onSelectTab('commitments')} />}
        hint={t('budgetPlan.department.commitmentsHint', { count: toRecord.length })}
        title={t('budgetPlan.department.commitmentsTitle')}
      />
      {unpaid.length === 0 ? (
        <Empty />
      ) : (
        <ul className='mt-4 divide-y divide-border text-xs'>
          {unpaid.map((item) => (
            <li className='flex flex-wrap items-center justify-between gap-2 py-2' key={item.code}>
              <span className='min-w-0'>
                <span className='font-mono font-bold text-primary'>{item.code}</span>
                <span className='ml-2 text-muted-foreground'>{item.software}</span>
              </span>
              <span className='flex items-center gap-2'>
                <Pill tone={item.stage === 'RECORDED' ? 'info' : 'warning'}>
                  {t(`budgetPlan.department.commitmentStage.${item.stage}`)}
                </Pill>
                <span className='font-bold'>{formatCurrency(item.amount)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

export function DepartmentRequestsSection({ costCenter, onSelectTab }: SectionProps) {
  const { t } = useTranslation('dashboard')
  const open = budgetQuestions.filter((item) => item.costCenter === costCenter && item.status === 'OPEN')

  return (
    <Panel>
      <PanelTitle
        action={<SectionLink onClick={() => onSelectTab('budget-questions')} />}
        title={t('budgetPlan.department.requestsTitle')}
      />
      {open.length === 0 ? (
        <Empty />
      ) : (
        <ul className='mt-4 divide-y divide-border text-xs'>
          {open.map((item) => (
            <li key={item.id}>
              <button
                className='w-full py-2 text-left hover:text-primary'
                onClick={() => onSelectTab('budget-questions', { id: item.id })}
                type='button'
              >
                <span className='font-mono font-bold text-primary'>{item.requestCode}</span>
                <span className='ml-2'>{item.software}</span>
                <span className='mt-0.5 block text-muted-foreground'>{item.question}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

export function DepartmentExceptionsSection({ costCenter, formatCurrency, onSelectTab }: SectionProps) {
  const { t } = useTranslation('dashboard')
  const { exceptions } = useAnnualBudgetState()
  const items = exceptions.filter((item) => item.costCenter === costCenter)

  return (
    <Panel>
      <PanelTitle
        action={<SectionLink onClick={() => onSelectTab('budget-exceptions')} />}
        title={t('budgetPlan.department.exceptionsTitle')}
      />
      {items.length === 0 ? (
        <Empty />
      ) : (
        <ul className='mt-4 divide-y divide-border text-xs'>
          {items.map((item) => (
            <li key={item.id}>
              <button
                className='flex w-full flex-wrap items-center justify-between gap-2 py-2 text-left hover:text-primary'
                onClick={() => onSelectTab('budget-exceptions', { id: item.id })}
                type='button'
              >
                <span className='min-w-0'>
                  <span className='font-mono font-bold text-primary'>{item.requestCode}</span>
                  <span className='ml-2'>{item.software}</span>
                </span>
                <span className='flex items-center gap-2'>
                  <Pill tone={item.resolution ? 'success' : 'warning'}>
                    {t(item.resolution ? 'budgetPlan.department.resolved' : 'budgetPlan.department.open')}
                  </Pill>
                  <span className='font-bold'>{formatCurrency(item.amount)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
