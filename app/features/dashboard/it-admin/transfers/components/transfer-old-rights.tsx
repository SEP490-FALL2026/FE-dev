import { useTranslation } from 'react-i18next'
import type { DepartmentTransferGet200 } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'

type Transfer = NonNullable<DepartmentTransferGet200['data']>

/** Old rights from the snapshot taken on the effective day, with what became of each (MF3-B/C). */
export function TransferOldRights({
  oldRights,
  outcomes,
  snapshotOn
}: {
  oldRights: Transfer['oldRights']
  outcomes: { assignmentId: string; outcome: string }[]
  snapshotOn: string | null
}) {
  const { t: translate } = useTranslation('itTransfers')
  const { formatDate } = useDashboardFormat()
  const outcomeOf = new Map(outcomes.map((right) => [right.assignmentId, right.outcome]))
  return (
    <section className='space-y-3 rounded-lg border border-border/70 bg-surface p-5'>
      <div className='flex flex-wrap items-baseline justify-between gap-2'>
        <h2 className='font-semibold [text-wrap:balance]'>{translate('oldRights')}</h2>
        {snapshotOn && (
          <p className='font-mono text-xs tabular-nums text-muted-foreground'>
            {translate('snapshotOn', { date: formatDate(snapshotOn) })}
          </p>
        )}
      </div>
      {oldRights.length ? (
        <ul className='divide-y divide-border/50'>
          {oldRights.map((right) => {
            const outcome = outcomeOf.get(right.assignmentId)
            return (
              <li key={right.assignmentId} className='grid gap-1 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto]'>
                <div className='min-w-0'>
                  <p className='truncate font-medium' title={right.application.name}>
                    {right.application.name}
                  </p>
                  <p className='truncate text-muted-foreground' title={right.plan.name}>
                    {right.plan.name} · {right.provisioningType}
                  </p>
                </div>
                <div className='space-y-0.5 sm:text-right'>
                  <p>
                    {outcome
                      ? translate(`outcomes.${outcome}`, { defaultValue: translate('unknown') })
                      : translate(`rightStates.${right.state}`, { defaultValue: translate('unknown') })}
                  </p>
                  {right.regranted && <p className='text-success-ink'>{translate('regranted')}</p>}
                  {right.revocation && (
                    <p className='text-muted-foreground'>
                      {translate('revocationTask', {
                        status: translate(`taskStates.${right.revocation.status}`, {
                          defaultValue: right.revocation.status
                        })
                      })}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className='text-sm text-muted-foreground'>{translate('noOldRights')}</p>
      )}
    </section>
  )
}
