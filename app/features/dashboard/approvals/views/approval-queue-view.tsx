import { BellRing, ChevronRight, Info, Timer } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterChips, Notice, PageHeader, Panel, Pill, type Tone } from '../../dashboard-ui'
import { useAnnualBudgetState } from '../../finance/annual-budget-store'
import { budgetCheckTones, queueBudgetCheck } from '../approval-budget-check'
import { approvalQueue, type QueueItem, type QueueItemKind } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import {
  ApprovalQueueFiltersPanel,
  defaultApprovalQueueFilters,
  getSlaHoursLeft,
  matchesApprovalQueueFilters
} from './approval-queue-filters'
import { ApprovalQueueAnnual } from './approval-queue-annual'

export { getSlaHoursLeft }

/** Annual budget files and in-year SaaS spend are listed apart so the two never mix. */
type QueueType = 'annual' | 'spend'

const kindTones: Record<QueueItemKind, Tone> = {
  CHARGE: 'danger',
  FINDING: 'warning',
  NEED_STEP: 'info',
  RENEWAL: 'primary',
  SPEND_STEP: 'success'
}

export function tabForKind(kind: QueueItemKind): ApprovalTabKey {
  if (kind === 'RENEWAL') return 'renewal'
  if (kind === 'CHARGE' || kind === 'FINDING') return 'charge'
  return 'request'
}

export function SlaBadge({ item }: { item: Pick<QueueItem, 'reminders' | 'slaDueAt'> }) {
  const { t } = useTranslation('dashboard')
  const hoursLeft = getSlaHoursLeft(item)

  return (
    <span className='flex flex-col items-start gap-1'>
      {hoursLeft < 0 ? (
        <Pill tone='danger'>
          <Timer aria-hidden='true' className='size-3' />
          {t('approvals.sla.overdue', { hours: Math.abs(hoursLeft) })}
        </Pill>
      ) : (
        <Pill tone={hoursLeft <= 8 ? 'warning' : 'neutral'}>
          <Timer aria-hidden='true' className='size-3' />
          {t('approvals.sla.left', { hours: hoursLeft })}
        </Pill>
      )}
      {item.reminders > 0 && (
        <span className='flex items-center gap-1 text-[0.65rem] text-muted-foreground'>
          <BellRing aria-hidden='true' className='size-3' />
          {t('approvals.sla.reminders', { count: item.reminders })}
        </span>
      )}
    </span>
  )
}

interface ApprovalQueueViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalQueueView({ formatCurrency, onSelectTab }: ApprovalQueueViewProps) {
  const { t } = useTranslation('dashboard')
  const [queueType, setQueueType] = useState<QueueType>('spend')
  const [filters, setFilters] = useState(defaultApprovalQueueFilters)
  const sentProposals = useAnnualBudgetState().proposals.filter((proposal) => proposal.stage === 'SENT')

  const sorted = [...approvalQueue].sort((a, b) => a.slaDueAt.localeCompare(b.slaDueAt))
  const visible = sorted.filter((item) => matchesApprovalQueueFilters(item, filters))

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('approvals.queue.subtitle')} title={t('approvals.queue.title')} />

      <FilterChips<QueueType>
        label={t('budgetPlan.approverSpend.queue.typeLabel')}
        onChange={setQueueType}
        options={[
          { count: approvalQueue.length, label: t('budgetPlan.approverSpend.queue.typeSpend'), value: 'spend' },
          { count: sentProposals.length, label: t('budgetPlan.approverSpend.queue.typeAnnual'), value: 'annual' }
        ]}
        value={queueType}
      />

      {queueType === 'annual' ? (
        <ApprovalQueueAnnual formatCurrency={formatCurrency} onSelectTab={onSelectTab} proposals={sentProposals} />
      ) : (
        <>
          <Notice icon={Info} tone='info'>
            {t('approvals.queue.slaRule')}
          </Notice>

          <ApprovalQueueFiltersPanel applied={filters} items={approvalQueue} onApply={setFilters} />

          <Panel>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-200 text-left text-xs'>
                <thead>
                  <tr className='border-b border-border text-muted-foreground'>
                    <th className='py-2.5 font-semibold'>{t('approvals.queue.colType')}</th>
                    <th className='py-2.5 font-semibold'>{t('approvals.queue.colItem')}</th>
                    <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                    <th className='py-2.5 text-right font-semibold'>{t('approvals.queue.colAmount')}</th>
                    <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.approverSpend.queue.colCheck')}</th>
                    <th className='py-2.5 pl-8 font-semibold'>{t('approvals.queue.colSla')}</th>
                    <th className='py-2.5' />
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {visible.map((item) => (
                    <tr className='transition hover:bg-surface-subtle/50' key={item.id}>
                      <td className='py-3'>
                        <Pill tone={kindTones[item.kind]}>{t(`approvals.kind.${item.kind}`)}</Pill>
                      </td>
                      <td className='py-3'>
                        <p className='font-mono text-[0.7rem] font-bold text-primary'>{item.reference}</p>
                        <p className='font-bold text-foreground'>{item.software}</p>
                        <p className='text-[0.7rem] text-muted-foreground'>{item.subtitle}</p>
                      </td>
                      <td className='py-3 font-mono'>{item.costCenter}</td>
                      <td className='py-3 text-right font-bold'>{formatCurrency(item.amount)}</td>
                      <td className='py-3 pl-6'>
                        <Pill tone={budgetCheckTones[queueBudgetCheck(item)]}>
                          {t(`budgetPlan.approverSpend.result.${queueBudgetCheck(item)}`)}
                        </Pill>
                      </td>
                      <td className='py-3 pl-8'>
                        <SlaBadge item={item} />
                      </td>
                      <td className='py-3 text-right'>
                        <button
                          aria-label={t('approvals.queue.openItem', { reference: item.reference })}
                          className='inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 font-bold text-primary transition hover:border-primary'
                          onClick={() => onSelectTab(tabForKind(item.kind), { id: item.id })}
                          type='button'
                        >
                          {t('approvals.queue.open')}
                          <ChevronRight aria-hidden='true' className='size-3.5' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visible.length === 0 && (
                <p className='py-4 text-xs text-muted-foreground'>{t('budgetPlan.approverSpend.queue.empty')}</p>
              )}
            </div>
          </Panel>
        </>
      )}
    </div>
  )
}
