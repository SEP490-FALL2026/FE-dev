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

/** Read-only result of offboardingCasePreview / departmentTransferPreview: nothing is written until confirmed. */
export function EventImpactPreview({ impact }: { impact: EventImpact }) {
  const { t: translate, i18n } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  return (
    <section
      aria-live='polite'
      className='space-y-3 rounded-lg border border-border bg-surface-subtle p-4 text-sm sm:col-span-2'
    >
      <h3 className='font-semibold [text-wrap:balance]'>{translate('impact.title')}</h3>
      <dl className='grid gap-3 sm:grid-cols-2'>
        {impact.revocationDueOn && (
          <div>
            <dt className='text-muted-foreground'>{translate('impact.revocationDueOn')}</dt>
            <dd className='text-right font-mono tabular-nums'>{formatDate(impact.revocationDueOn)}</dd>
          </div>
        )}
        {impact.graceEndsOn && (
          <div>
            <dt className='text-muted-foreground'>{translate('impact.graceEndsOn')}</dt>
            <dd className='text-right font-mono tabular-nums'>{formatDate(impact.graceEndsOn)}</dd>
          </div>
        )}
        {impact.graceReminderOn && (
          <div>
            <dt className='text-muted-foreground'>{translate('impact.graceReminderOn')}</dt>
            <dd className='text-right font-mono tabular-nums'>{formatDate(impact.graceReminderOn)}</dd>
          </div>
        )}
        <div>
          <dt className='text-muted-foreground'>{translate('impact.requestsCancelled')}</dt>
          <dd className='text-right font-mono tabular-nums'>{impact.openRequestsToCancel.length}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>{translate('impact.provisioningInFlight')}</dt>
          <dd className='text-right font-mono tabular-nums'>{impact.provisioningInFlight.length}</dd>
        </div>
        {impact.commitmentToRelease.length > 0 && (
          <div>
            <dt className='text-muted-foreground'>{translate('impact.commitmentReleased')}</dt>
            {impact.commitmentToRelease.map((money) => (
              <dd key={money.currency} className='text-right font-mono tabular-nums'>
                {formatMoney(moneyFromMinor(money.amountMinor, money.currency), i18n.language)}
              </dd>
            ))}
          </div>
        )}
        {(impact.responsibilities.subscriptions > 0 || impact.responsibilities.applications > 0) && (
          <div>
            <dt className='text-muted-foreground'>{translate('impact.responsibilities')}</dt>
            <dd className='text-right font-mono tabular-nums'>
              {translate('impact.responsibilityCounts', impact.responsibilities)}
            </dd>
          </div>
        )}
      </dl>
      {impact.headSuccessorRequired && <p className='text-warning'>{translate('impact.successorRequired')}</p>}
      <div className='space-y-1'>
        <p className='font-medium'>{translate('impact.rightsToRevoke', { count: impact.rightsToRevoke.length })}</p>
        <ul className='space-y-1'>
          {impact.rightsToRevoke.map((right) => (
            <li key={right.assignmentId} className='truncate' title={`${right.application.name} · ${right.plan.name}`}>
              {right.application.name} · {right.plan.name}
              {!right.revocable && <span className='text-muted-foreground'> · {translate('impact.notRevocable')}</span>}
            </li>
          ))}
        </ul>
      </div>
      {impact.vendorAdminRoles.length > 0 && (
        <div className='space-y-1'>
          <p className='font-medium'>{translate('impact.vendorAdminRoles')}</p>
          <ul className='list-inside list-disc'>
            {impact.vendorAdminRoles.map((role) => (
              <li key={role} className='break-words'>
                {role}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className='text-muted-foreground [text-wrap:pretty]'>{translate('impact.confirmHint')}</p>
    </section>
  )
}
