import { CalendarDays, Info, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatMoney, moneyFromMinor } from '~/shared/lib/money'
import { useDashboardFormat } from '../../../dashboard-ui'

export type EventImpact = {
  rightsToRevoke: { assignmentId: string; application: { name: string }; plan: { name: string }; revocable: boolean }[]
  openRequestsToCancel: { requestId: string }[]
  provisioningInFlight: { requestId: string }[]
  commitmentToRelease: { currency: string; amountMinor: string }[]
  responsibilities: { subscriptions: number; applications: number }
  vendorAdminRoles: string[]
  headSuccessorRequired: boolean
  revocationDueOn?: string
  graceEndsOn?: string
  graceReminderOn?: string
}

/** A read-only preview; the record mutation remains owned by EmployeeEventForm. */
export function EventImpactPreview({ impact }: { impact: EventImpact }) {
  const { t: translate, i18n } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  const dates = [
    { label: translate('impact.revocationDueOn'), value: impact.revocationDueOn },
    { label: translate('impact.graceEndsOn'), value: impact.graceEndsOn },
    { label: translate('impact.graceReminderOn'), value: impact.graceReminderOn }
  ].filter((date): date is { label: string; value: string } => Boolean(date.value))

  return (
    <section aria-live='polite' className='min-w-0 space-y-5 border-t border-border pt-6 text-sm sm:col-span-2'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h3 className='text-lg font-semibold tracking-tight text-foreground [text-wrap:balance]'>
          {translate('impact.title')}
        </h3>
        <span className='rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground'>
          {translate('impact.notRecorded')}
        </span>
      </div>

      {dates.length > 0 && (
        <dl className='flex flex-wrap gap-x-10 gap-y-4 rounded-lg bg-primary-soft px-5 py-4'>
          {dates.map((date) => (
            <div key={date.label} className='flex min-w-0 flex-1 basis-48 items-start gap-3'>
              <CalendarDays aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-primary-ink' strokeWidth={1.5} />
              <div className='min-w-0 flex-1'>
                <dt className='text-primary-ink'>{date.label}</dt>
                <dd className='mt-1 text-right font-mono text-lg font-semibold tabular-nums text-primary-ink'>
                  {formatDate(date.value)}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      )}

      <div>
        <h4 className='mb-3 font-semibold text-foreground'>{translate('impact.requests')}</h4>
        <dl className='grid divide-y divide-border/60 rounded-lg border border-border bg-surface sm:grid-cols-2 sm:divide-x sm:divide-y-0'>
          <div className='flex items-start justify-between gap-4 p-4 sm:p-5'>
            <dt className='max-w-64 leading-relaxed text-muted-foreground'>{translate('impact.requestsCancelled')}</dt>
            <dd
              className={`shrink-0 text-right font-mono text-2xl font-semibold leading-none tabular-nums ${impact.openRequestsToCancel.length ? 'text-primary-ink' : 'text-muted-foreground'}`}
            >
              {impact.openRequestsToCancel.length}
            </dd>
          </div>
          <div className='flex items-start justify-between gap-4 p-4 sm:p-5'>
            <dt className='max-w-64 leading-relaxed text-muted-foreground'>
              {translate('impact.provisioningInFlight')}
            </dt>
            <dd
              className={`shrink-0 text-right font-mono text-2xl font-semibold leading-none tabular-nums ${impact.provisioningInFlight.length ? 'text-primary-ink' : 'text-muted-foreground'}`}
            >
              {impact.provisioningInFlight.length}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h4 className='mb-3 font-semibold text-foreground'>
          {translate('impact.rightsToRevoke', { count: impact.rightsToRevoke.length })}
        </h4>
        {impact.rightsToRevoke.length === 0 ? (
          <p className='flex items-center gap-3 rounded-lg border border-border bg-surface px-5 py-4 leading-relaxed text-muted-foreground'>
            <ShieldCheck aria-hidden='true' className='size-5 shrink-0 text-muted-foreground' strokeWidth={1.5} />
            {translate('impact.noRights')}
          </p>
        ) : (
          <ul className='divide-y divide-border/60 rounded-lg border border-border bg-surface'>
            {impact.rightsToRevoke.map((right) => (
              <li key={right.assignmentId} className='grid min-w-0 gap-1 px-5 py-3 sm:grid-cols-2 sm:gap-4'>
                <span className='min-w-0 break-words font-medium text-foreground'>{right.application.name}</span>
                <span className='min-w-0 break-words text-muted-foreground sm:text-right'>
                  {right.plan.name}
                  {!right.revocable && <> · {translate('impact.notRevocable')}</>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(impact.commitmentToRelease.length > 0 ||
        impact.responsibilities.subscriptions > 0 ||
        impact.responsibilities.applications > 0 ||
        impact.vendorAdminRoles.length > 0) && (
        <div className='space-y-4 border-t border-border/60 pt-5'>
          <dl className='grid gap-4 sm:grid-cols-2'>
            {impact.commitmentToRelease.length > 0 && (
              <div className='space-y-2'>
                <dt className='font-semibold text-foreground'>{translate('impact.commitmentReleased')}</dt>
                <dd className='space-y-1 break-words text-right font-mono font-medium tabular-nums text-foreground'>
                  {impact.commitmentToRelease.map((money) => (
                    <div key={money.currency}>
                      {formatMoney(moneyFromMinor(money.amountMinor, money.currency), i18n.language)}
                    </div>
                  ))}
                </dd>
              </div>
            )}
            {(impact.responsibilities.subscriptions > 0 || impact.responsibilities.applications > 0) && (
              <div className='space-y-2'>
                <dt className='font-semibold text-foreground'>{translate('impact.responsibilities')}</dt>
                <dd className='text-muted-foreground'>
                  {translate('impact.responsibilityCounts', impact.responsibilities)}
                </dd>
              </div>
            )}
          </dl>
          {impact.vendorAdminRoles.length > 0 && (
            <div className='space-y-2'>
              <p className='font-semibold text-foreground'>{translate('impact.vendorAdminRoles')}</p>
              <ul className='list-inside list-disc space-y-1 text-muted-foreground'>
                {impact.vendorAdminRoles.map((role) => (
                  <li key={role} className='break-words'>
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {impact.headSuccessorRequired && (
        <p className='flex items-start gap-2 rounded-md bg-warning/10 px-4 py-3 leading-relaxed text-warning'>
          <Info aria-hidden='true' className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          {translate('impact.successorRequired')}
        </p>
      )}
      <p className='flex items-start gap-2 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground'>
        <Info aria-hidden='true' className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
        <span>{translate('impact.confirmHint')}</span>
      </p>
    </section>
  )
}
