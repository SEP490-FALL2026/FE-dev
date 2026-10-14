import { BellRing, ChevronRight, Info, Timer } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterChips, Notice, PageHeader, Panel, Pill, type Tone } from '../../dashboard-ui'
import { approvalQueue, approverNow, type QueueItem, type QueueItemKind } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'

type QueueFilter = 'all' | 'charges' | 'renewals' | 'requests'

const filterKinds: Record<Exclude<QueueFilter, 'all'>, readonly QueueItemKind[]> = {
  charges: ['CHARGE', 'FINDING'],
  renewals: ['RENEWAL'],
  requests: ['SPEND_STEP', 'NEED_STEP']
}

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

export function getSlaHoursLeft(item: Pick<QueueItem, 'slaDueAt'>) {
  return Math.round((new Date(item.slaDueAt).getTime() - new Date(approverNow).getTime()) / 3_600_000)
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
  const [filter, setFilter] = useState<QueueFilter>('all')

  const sorted = [...approvalQueue].sort((a, b) => a.slaDueAt.localeCompare(b.slaDueAt))
  const visible = filter === 'all' ? sorted : sorted.filter((item) => filterKinds[filter].includes(item.kind))
  const count = (key: Exclude<QueueFilter, 'all'>) =>
    approvalQueue.filter((item) => filterKinds[key].includes(item.kind)).length

  return (
    <div className='space-y-6'>
      <PageHeader code='UF-15 · APV-01' subtitle={t('approvals.queue.subtitle')} title={t('approvals.queue.title')} />

      <Notice icon={Info} tone='info'>
        {t('approvals.queue.slaRule')}
      </Notice>

      <Panel>
        <FilterChips<QueueFilter>
          label={t('approvals.queue.filterLabel')}
          onChange={setFilter}
          options={[
            { count: approvalQueue.length, label: t('ui.all'), value: 'all' },
            { count: count('requests'), label: t('approvals.queue.filter.requests'), value: 'requests' },
            { count: count('renewals'), label: t('approvals.queue.filter.renewals'), value: 'renewals' },
            { count: count('charges'), label: t('approvals.queue.filter.charges'), value: 'charges' }
          ]}
          value={filter}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-200 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('approvals.queue.colType')}</th>
                <th className='py-2.5 font-semibold'>{t('approvals.queue.colItem')}</th>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('approvals.queue.colAmount')}</th>
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
        </div>
      </Panel>
    </div>
  )
}
