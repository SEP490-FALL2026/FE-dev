import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRightLeft } from 'lucide-react'
import { useDepartmentTransferList } from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import type { DepartmentTransferListParams } from '~/shared/api/generated/model/department-transfers'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { TransferStatus } from '../enums/transfer-status'
import { TransferDetail } from '../components/transfer-detail'

export function ItTransfersView({ initialId }: { initialId?: string }) {
  const { t: translate } = useTranslation('itTransfers')
  const { formatDate } = useDashboardFormat()
  const [selected, setSelected] = useState(initialId)
  const [status, setStatus] = useState('')
  const [params, setParams] = useState<DepartmentTransferListParams>({ page: 1, pageSize: 20 })
  const query = useDepartmentTransferList(params, { query: { enabled: !selected } })
  const data = query.data?.data
  if (selected) return <TransferDetail key={selected} id={selected} onBack={() => setSelected(undefined)} />
  return (
    <section className='space-y-5'>
      <header>
        <h1 className='flex items-center gap-3 text-2xl font-semibold tracking-tight'>
          <ArrowRightLeft aria-hidden strokeWidth={1.5} className='size-6 text-primary' />
          {translate('title')}
        </h1>
        <p className='mt-2 max-w-3xl text-sm text-muted-foreground'>{translate('hint')}</p>
      </header>
      <form
        className='grid items-end gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2 xl:grid-cols-5'
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          setParams({
            page: 1,
            pageSize: 20,
            status: Object.values(TransferStatus).find((value) => value === status),
            employeeId: String(form.get('employeeId') ?? '').trim() || undefined,
            effectiveFrom: String(form.get('effectiveFrom') ?? '') || undefined,
            effectiveTo: String(form.get('effectiveTo') ?? '') || undefined
          })
        }}
      >
        <ItChoiceSelect
          label={translate('status')}
          value={status}
          onChange={setStatus}
          options={[
            { value: '', label: translate('all') },
            ...Object.values(TransferStatus).map((value) => ({ value, label: translate(`values.${value}`) }))
          ]}
        />
        <ItField label={translate('employeeId')}>
          <input
            name='employeeId'
            defaultValue={params.employeeId ?? ''}
            pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
            placeholder={translate('employeePlaceholder')}
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('effectiveFrom')}>
          <input name='effectiveFrom' type='date' defaultValue={params.effectiveFrom ?? ''} className={itInputClass} />
        </ItField>
        <ItField label={translate('effectiveTo')}>
          <input name='effectiveTo' type='date' defaultValue={params.effectiveTo ?? ''} className={itInputClass} />
        </ItField>
        <button type='submit' className={itButtonClass}>
          {translate('applyFilters')}
        </button>
      </form>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article key={item.id} className='grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center'>
                <div className='min-w-0'>
                  <h2 className='truncate font-semibold' title={item.employee.fullName}>
                    {item.employee.fullName}
                  </h2>
                  <p className='text-xs text-muted-foreground'>{item.employee.employeeCode}</p>
                  <p className='mt-2 break-words text-sm text-muted-foreground'>
                    {item.from.department.name}
                    <span aria-hidden> → </span>
                    {item.to.department.name}
                  </p>
                </div>
                <div className='space-y-1 text-sm'>
                  <p>{translate(`values.${item.status}`, { defaultValue: translate('unknown') })}</p>
                  <p className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                    {formatDate(item.effectiveOn)}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => setSelected(item.id)}>
                  {translate('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={params.page ?? 1}
          pageSize={20}
          total={data.pagination.totalItems}
          disabled={query.isFetching}
          onChange={(page) => setParams((previous) => ({ ...previous, page }))}
        />
      )}
    </section>
  )
}
