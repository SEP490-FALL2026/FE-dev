import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentTransferGet } from '~/shared/api/generated/operations/department-transfers/department-transfer-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { TransferStatus } from '../enums/transfer-status'
import { TransferCloseDialog } from './transfer-close-dialog'
import { TransferServiceDuties } from './transfer-service-duties'
import { TransferHandovers } from './transfer-handovers'

export function TransferDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('itTransfers')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const query = useDepartmentTransferGet(id)
  const me = useMeGet()
  const [closing, setClosing] = useState(false)
  const transfer = query.data?.data
  const authorized = !me.isError && !!me.data?.data?.roles.includes('IT_ADMIN')
  const allowed =
    authorized &&
    !query.isFetching &&
    !query.isError &&
    transfer?.status === TransferStatus.EFFECTIVE &&
    !transfer.closure
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
                <dt className='text-xs text-muted-foreground'>{translate('status')}</dt>
                <dd className='mt-1 text-sm'>
                  {translate(`values.${transfer.status}`, { defaultValue: translate('unknown') })}
                </dd>
              </div>
            </dl>
            {authorized && (
              <>
                <TransferServiceDuties
                  transferId={id}
                  employeeId={transfer.employee.id}
                  authorized={authorized}
                  active={transfer.status !== TransferStatus.CANCELLED && !transfer.closure}
                />
                <TransferHandovers transferId={id} employeeId={transfer.employee.id} />
              </>
            )}
            <section className='space-y-3 rounded-lg border border-border/70 bg-surface p-5'>
              <p className='max-w-3xl text-sm text-muted-foreground'>{translate('close.hint')}</p>
              {transfer.closure ? (
                <p className='text-sm text-success-ink'>
                  {translate('closed')}
                  <span className='ml-2 font-mono text-xs tabular-nums'>
                    {formatDateTime(transfer.closure.closedAt)}
                  </span>
                </p>
              ) : (
                <>
                  <button type='button' className={itButtonClass} disabled={!allowed} onClick={() => setClosing(true)}>
                    {translate('close.action')}
                  </button>
                  {transfer.status === TransferStatus.PENDING && (
                    <p className='text-sm text-muted-foreground'>{translate('close.pending')}</p>
                  )}
                </>
              )}
            </section>
            {closing && <TransferCloseDialog id={id} allowed={allowed} onClose={() => setClosing(false)} />}
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </section>
  )
}
