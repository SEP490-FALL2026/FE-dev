import { useTranslation } from 'react-i18next'
import {
  getDepartmentTransferGetQueryKey,
  useDepartmentTransferGet
} from '~/shared/api/generated/operations/department-transfers/department-transfer-get'
import { getDepartmentTransferListQueryKey } from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { formatMoney, moneyFromMinor } from '~/shared/lib/money'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { ItHandoverPanel } from '../../shared/components/it-handover-panel'
import { TransferPhase } from '../enums/transfer-phase'
import { TransferOldRights } from './transfer-old-rights'

export function TransferDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate, i18n } = useTranslation('itTransfers')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const query = useDepartmentTransferGet(id)
  const me = useMeGet()
  const transfer = query.data?.data
  const isItAdmin = !me.isError && (me.data?.data?.roles.includes('IT_ADMIN') ?? false)
  return (
    <section className='space-y-5'>
      <div className='flex flex-wrap justify-between gap-3'>
        <button type='button' className={itButtonClass} onClick={onBack}>
          {translate('back')}
        </button>
        <button
          type='button'
          className={itButtonClass}
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          {translate('refresh')}
        </button>
      </div>
      <ItQueryState query={query}>
        {transfer ? (
          <>
            <header>
              <h1 className='truncate text-2xl font-semibold tracking-tight' title={transfer.employee.fullName}>
                {transfer.employee.fullName}
              </h1>
              <p className='mt-1 text-sm text-muted-foreground'>{transfer.employee.employeeCode}</p>
            </header>
            <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-5 sm:grid-cols-2 xl:grid-cols-4'>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('from')}</dt>
                <dd className='mt-1 break-words text-sm'>{transfer.from.department.name}</dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('to')}</dt>
                <dd className='mt-1 break-words text-sm'>{transfer.to.department.name}</dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('effectiveOn')}</dt>
                <dd className='mt-1 text-right font-mono text-sm tabular-nums'>{formatDate(transfer.effectiveOn)}</dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('phase')}</dt>
                <dd className='mt-1 text-sm'>
                  {translate(`phases.${transfer.phase}`, { defaultValue: translate('unknown') })}
                </dd>
              </div>
              {transfer.grace && (
                <>
                  <div>
                    <dt className='text-xs text-muted-foreground'>{translate('graceEndsOn')}</dt>
                    <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                      {formatDate(transfer.grace.endsOn)}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-xs text-muted-foreground'>{translate('graceReminderOn')}</dt>
                    <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                      {formatDate(transfer.grace.reminderOn)}
                    </dd>
                  </div>
                </>
              )}
              {transfer.commitmentsReleased.length > 0 && (
                <div className='sm:col-span-2'>
                  <dt className='text-xs text-muted-foreground'>{translate('commitmentsReleased')}</dt>
                  {transfer.commitmentsReleased.map((released) => (
                    <dd key={released.currency} className='mt-1 text-right font-mono text-sm tabular-nums'>
                      {formatMoney(moneyFromMinor(released.amountMinor, released.currency), i18n.language)}
                    </dd>
                  ))}
                </div>
              )}
            </dl>
            <p className='text-sm text-muted-foreground [text-wrap:pretty]'>
              {translate(`phaseHints.${transfer.phase}`, { defaultValue: '' })}
            </p>
            {transfer.closure && (
              <p className='text-sm text-success-ink'>
                {translate(
                  transfer.phase === TransferPhase.SUPERSEDED
                    ? 'supersededAt'
                    : transfer.closure.closedBySystem
                      ? 'closedBySystem'
                      : 'closedAt',
                  { at: formatDateTime(transfer.closure.closedAt) }
                )}
              </p>
            )}
            <TransferOldRights
              oldRights={transfer.oldRights}
              outcomes={transfer.snapshot?.after?.rights ?? []}
              snapshotOn={transfer.snapshot?.before?.takenOn ?? null}
            />
            {transfer.itHandover && (
              <ItHandoverPanel
                source={{ kind: 'transfer', id }}
                handover={transfer.itHandover}
                leavingEmployeeId={transfer.employee.id}
                canAct={isItAdmin && !query.isFetching}
                invalidates={[getDepartmentTransferGetQueryKey(id), getDepartmentTransferListQueryKey()]}
              />
            )}
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </section>
  )
}
