import { Ban, Check, ClipboardCheck, Clock3, KeyRound, Send, Undo2, UsersRound, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import type { RequestEvent } from '../request-event-groups'

function eventAppearance(kind: RequestEvent['kind']) {
  switch (kind) {
    case 'NEED_APPROVED':
    case 'SPEND_APPROVED':
    case 'GRANT_COMPLETED':
    case 'RENEWAL_APPLIED':
    case 'RESERVE_CONFIRMED':
      return { Icon: Check, tone: 'border-success/20 bg-success/10 text-success-ink' }
    case 'NEED_REJECTED':
    case 'SPEND_REJECTED':
    case 'ASSESSMENT_REJECTED':
    case 'GRANT_FAILED':
      return { Icon: X, tone: 'border-danger/20 bg-danger/10 text-danger-ink' }
    case 'SUBMITTED':
    case 'RESUBMITTED':
      return { Icon: Send, tone: 'border-border/70 bg-surface-subtle text-muted-foreground' }
    case 'LINE_NEED_DECIDED':
    case 'LINE_SPEND_DECIDED':
      return { Icon: UsersRound, tone: 'border-border/70 bg-surface-subtle text-muted-foreground' }
    case 'RETURNED_TO_REQUESTER':
      return { Icon: Undo2, tone: 'border-border/70 bg-surface-subtle text-muted-foreground' }
    case 'GRANT_STARTED':
      return { Icon: KeyRound, tone: 'border-border/70 bg-surface-subtle text-muted-foreground' }
    case 'ASSESSMENT_COMPLETED':
      return { Icon: ClipboardCheck, tone: 'border-border/70 bg-surface-subtle text-muted-foreground' }
    case 'WITHDRAWAL_REQUESTED':
    case 'WITHDRAWN':
    case 'CANCELLED':
      return { Icon: Ban, tone: 'border-border/70 bg-surface-subtle text-muted-foreground' }
    default:
      return { Icon: Clock3, tone: 'border-border/70 bg-surface-subtle text-muted-foreground' }
  }
}

export function RequestEventEntry({ members }: { members: RequestEvent[] }) {
  const { t } = useTranslation('requestFlow')
  const { formatDateTime, formatNumber } = useWorkspaceFormat()
  const event = members[0]
  const grouped = members.length > 1
  const { Icon, tone } = eventAppearance(event.kind)
  return (
    <li className='group/event relative grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-x-3 pb-6 text-sm last:pb-0 sm:gap-x-4'>
      <span aria-hidden='true' className='absolute top-8 bottom-0 left-4 w-px bg-border/70 group-last/event:hidden' />
      <span aria-hidden='true' className={`relative z-10 grid size-8 place-items-center rounded-lg border ${tone}`}>
        <Icon strokeWidth={1.5} className='size-4' />
      </span>
      <div className='grid min-w-0 gap-x-6 gap-y-2 pt-1 sm:grid-cols-[minmax(0,1fr)_auto]'>
        <div className='min-w-0 space-y-1.5'>
          <div className='flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1.5'>
            <p className='font-medium text-foreground'>{t(`events.${event.kind}`, { defaultValue: t('unknown') })}</p>
            {grouped && (
              <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-medium text-muted-foreground'>
                {t('timelineMembers', { total: formatNumber(members.length) })}
              </span>
            )}
          </div>
          {event.actor && (
            <p className='truncate text-sm text-muted-foreground' title={event.actor.fullName}>
              {event.actor.fullName}
            </p>
          )}
        </div>
        <time
          className='flex items-center gap-1.5 self-start font-mono text-xs whitespace-nowrap tabular-nums text-muted-foreground sm:justify-end sm:pt-0.5 sm:text-right'
          dateTime={event.occurredAt}
        >
          <Clock3 aria-hidden='true' strokeWidth={1.5} className='size-3.5 shrink-0' />
          {formatDateTime(event.occurredAt)}
        </time>
        {grouped ? (
          <ul
            aria-label={t('timelineMemberList')}
            className='mt-1 flex min-w-0 flex-wrap gap-x-5 gap-y-3 rounded-md bg-surface-subtle/60 px-3 py-2.5 sm:col-span-2'
          >
            {members.map((member) => (
              <li key={member.id} className='min-w-0 max-w-full space-y-1 sm:max-w-72'>
                <p className='truncate text-sm text-foreground' title={member.line?.fullName}>
                  {member.line?.fullName}
                </p>
                {member.reason && (
                  <p className='text-xs text-muted-foreground whitespace-pre-wrap [overflow-wrap:anywhere]'>
                    {member.reason}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          (event.line || event.reason) && (
            <div className='min-w-0 space-y-1 sm:col-span-2'>
              {event.line && (
                <p className='truncate text-sm' title={event.line.fullName}>
                  {event.line.fullName}
                </p>
              )}
              {event.reason && (
                <p className='max-w-prose text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{event.reason}</p>
              )}
            </div>
          )
        )}
      </div>
    </li>
  )
}
