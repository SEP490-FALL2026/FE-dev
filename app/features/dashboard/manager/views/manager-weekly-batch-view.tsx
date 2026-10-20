import { ArrowRight, CheckCircle2, Files, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_MEMBERS, type TeamRequestItem } from '../manager-data'
import { ManagerIdentityMark } from '../manager-identity-mark'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerWeeklyBatchViewProps {
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
  onSendAll: () => void
  requests: readonly TeamRequestItem[]
  sentCount: number
}

export function ManagerWeeklyBatchView({ onSelectTab, onSendAll, requests, sentCount }: ManagerWeeklyBatchViewProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-ink'>
            <Files aria-hidden='true' className='size-4' />
            {t('manager.weeklyBatch.eyebrow')}
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.weeklyBatch.title')}
          </h1>
          <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>{t('manager.weeklyBatch.subtitle')}</p>
        </div>
        <button
          className='inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-surface-subtle'
          onClick={() => onSelectTab('team-requests')}
          type='button'
        >
          {t('manager.weeklyBatch.viewMore')}
          <ArrowRight aria-hidden='true' className='size-4' />
        </button>
      </div>

      {sentCount > 0 && (
        <div
          aria-live='polite'
          className='flex gap-3 rounded-2xl border border-success/25 bg-success/10 p-4 text-sm text-success'
        >
          <CheckCircle2 aria-hidden='true' className='mt-0.5 size-5 shrink-0' />
          <p>{t('manager.weeklyBatch.sentPreviewNotice', { count: sentCount })}</p>
        </div>
      )}

      <section className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5'>
          <div>
            <h2 className='text-base font-bold text-foreground'>{t('manager.weeklyBatch.listTitle')}</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              {t('manager.weeklyBatch.listCount', { count: requests.length })}
            </p>
          </div>
          {requests.length > 0 && (
            <span className='rounded-full border border-warning/25 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning-ink'>
              {t('manager.weeklyBatch.pendingStatus')}
            </span>
          )}
        </div>

        {requests.length === 0 ? (
          <div className='py-12 text-center'>
            <h3 className='font-semibold text-foreground'>{t('manager.weeklyBatch.emptyTitle')}</h3>
            <p className='mt-1 text-sm text-muted-foreground'>{t('manager.weeklyBatch.emptyDescription')}</p>
          </div>
        ) : (
          <ul className='divide-y divide-border'>
            {requests.map((request) => {
              const colleagues =
                request.form === 'shared'
                  ? MOCK_TEAM_MEMBERS.filter((member) => request.colleagueIds.includes(member.id)).map(
                      (member) => member.name
                    )
                  : []
              return (
                <li className='flex flex-wrap items-center justify-between gap-4 py-4' key={request.id}>
                  <div className='flex min-w-0 items-start gap-3'>
                    <ManagerIdentityMark name={request.saasName} />
                    <div className='min-w-0'>
                      <p className='font-semibold text-foreground'>{request.saasName}</p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {request.code} · {request.plan} ·{' '}
                        {t(`manager.requests.${request.form === 'shared' ? 'formShared' : 'formPersonal'}`)}
                      </p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {t('manager.weeklyBatch.requester')}: {request.requesterName}
                        {colleagues.length > 0 && ` · ${t('manager.weeklyBatch.colleagues')}: ${colleagues.join(', ')}`}
                      </p>
                    </div>
                  </div>
                  <button
                    className='min-h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                    onClick={() => onSelectTab('request-approval', { id: request.id })}
                    type='button'
                  >
                    {t('manager.weeklyBatch.viewRequest')}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary-soft/30 p-5'>
        <div>
          <h2 className='font-bold text-foreground'>{t('manager.weeklyBatch.sendTitle')}</h2>
          <p className='mt-1 max-w-xl text-sm text-muted-foreground'>{t('manager.weeklyBatch.sendDescription')}</p>
        </div>
        <button
          className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={requests.length === 0}
          onClick={onSendAll}
          type='button'
        >
          <Send aria-hidden='true' className='size-4' />
          {t('manager.weeklyBatch.sendAction')}
        </button>
      </div>
    </div>
  )
}
