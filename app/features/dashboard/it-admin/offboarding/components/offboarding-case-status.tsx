import { useTranslation } from 'react-i18next'
import type { OffboardingCaseGet200 } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { itButtonClass } from '../../shared/components/it-form'
import { OffboardingState } from '../enums/offboarding-state'

type OffboardingCase = NonNullable<OffboardingCaseGet200['data']>

/** Revocation deadline, closure blockers, items 1a/1b and the system closure of a departure case (MF2-D/E/G). */
export function OffboardingCaseStatus({
  item,
  active,
  onLock,
  onMailboxLock
}: {
  item: OffboardingCase
  active: boolean
  onLock: () => void
  onMailboxLock: () => void
}) {
  const { t: translate } = useTranslation('itOffboarding')
  const { formatDate, formatDateTime } = useDashboardFormat()
  // `dataHandover` stays in the payload for old clients only; there is no data handover any more (QĐ-110g).
  const steps = Object.entries(item.checklist ?? {}).filter(([key]) => key !== 'dataHandover')
  const blockers = Object.entries(item.blockers).filter(([, count]) => count > 0)
  return (
    <>
      <dl className='grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-4'>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('lastDay')}</dt>
          <dd className='text-right font-mono tabular-nums'>{formatDate(item.lastWorkingDay)}</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('heldRights')}</dt>
          <dd className='text-right font-mono tabular-nums'>{item.heldRights}</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('revocationDue')}</dt>
          <dd className={`text-right font-mono tabular-nums ${item.revocation.overdue ? 'text-danger' : ''}`}>
            {item.revocation.dueOn ? formatDate(item.revocation.dueOn) : translate('unknown')}
          </dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('rightsWithoutCompletedTask')}</dt>
          <dd className='text-right font-mono tabular-nums'>{item.revocation.rightsWithoutCompletedTask}</dd>
        </div>
      </dl>
      {item.revocation.overdue && (
        <p role='status' className='text-sm text-danger'>
          {translate('revocationOverdue')}
        </p>
      )}
      <section className='space-y-3 rounded-lg border border-border bg-surface p-4'>
        <h3 className='font-semibold [text-wrap:balance]'>{translate('checklist')}</h3>
        {steps.map(([key, step]) => (
          <div key={key} className='flex justify-between gap-3 text-sm'>
            <span>{translate(`steps.${key}`, { defaultValue: translate('states.UNKNOWN') })}</span>
            <span>{translate(`states.${step.state}`, { defaultValue: translate('states.UNKNOWN') })}</span>
          </div>
        ))}
        {!item.checklist && <p className='text-sm text-muted-foreground'>{translate('noChecklist')}</p>}
        <div className='space-y-2 border-t border-border/60 pt-3 text-sm'>
          <p className='font-medium'>{translate('lock1a')}</p>
          {item.accountLock ? (
            <p className='break-words'>
              {formatDateTime(item.accountLock.recordedAt)} · {item.accountLock.note}
            </p>
          ) : (
            <p className='text-muted-foreground'>{translate('hints.lock')}</p>
          )}
          {!item.closed && !item.accountLock && (
            <button disabled={!active} className={itButtonClass} onClick={onLock}>
              {translate('actions.lock')}
            </button>
          )}
        </div>
        <div className='space-y-2 border-t border-border/60 pt-3 text-sm'>
          <p className='font-medium'>{translate('lock1b')}</p>
          {item.mailboxLock ? (
            <p className='break-words'>
              {formatDateTime(item.mailboxLock.recordedAt)} ·{' '}
              {item.mailboxLock.recordedBySystem ? translate('bySystem') : (item.mailboxLock.note ?? '')}
            </p>
          ) : (
            <p className='text-muted-foreground [text-wrap:pretty]'>{translate('hints.mailbox')}</p>
          )}
          {!item.closed && !item.mailboxLock && (
            <button disabled={!active || !item.accountLock} className={itButtonClass} onClick={onMailboxLock}>
              {translate('actions.mailbox')}
            </button>
          )}
        </div>
        {item.closure ? (
          <p className='border-t border-border/60 pt-3 text-sm text-success-ink'>
            {translate(item.closure.closedBySystem ? 'closedBySystem' : 'closedAt', {
              at: formatDateTime(item.closure.closedAt)
            })}
          </p>
        ) : (
          item.state === OffboardingState.LEFT && (
            <div className='space-y-1 border-t border-border/60 pt-3 text-sm'>
              <p className='font-medium'>{translate('closureWaiting')}</p>
              {blockers.length ? (
                <ul className='list-inside list-disc text-danger'>
                  {blockers.map(([code, count]) => (
                    <li key={code}>
                      {translate(`blockers.${code}`, { count, defaultValue: translate('blocker', { code, count }) })}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-muted-foreground'>{translate('closureSweep')}</p>
              )}
            </div>
          )
        )}
      </section>
    </>
  )
}
