import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGhostSeatDecisionList } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-decision-list'
import { useGhostSeatKpi5Get } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-kpi5-get'
import type { GhostSeatDecisionListSelfDecided } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminField, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'

function initialPeriod() {
  const today = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date()
  )
  return { from: `${today.slice(0, 7)}-01`, to: today }
}
export function Decisions() {
  const { t: translate } = useTranslation('admin')
  const { formatDate, formatDateTime, formatNumber, formatPercent } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [scope, setScope] = useState<GhostSeatDecisionListSelfDecided | ''>('')
  const [period, setPeriod] = useState(initialPeriod)
  const [draftPeriod, setDraftPeriod] = useState(period)
  const [invalidPeriod, setInvalidPeriod] = useState(false)
  const decisions = useGhostSeatDecisionList({ page, pageSize: 20, ...(scope ? { selfDecided: scope } : {}) })
  const acceptance = useGhostSeatKpi5Get(period)
  const data = acceptance.data?.data
  const items = decisions.data?.data?.items ?? []
  return (
    <div className='space-y-6'>
      <section className='space-y-4'>
        <h2 className='font-semibold'>{translate('ghostSeats.acceptance.title')}</h2>
        <form
          className='grid items-end gap-3 md:grid-cols-[1fr_1fr_auto]'
          onSubmit={(event) => {
            event.preventDefault()
            if (!draftPeriod.from || !draftPeriod.to || draftPeriod.to < draftPeriod.from) {
              setInvalidPeriod(true)
              return
            }
            setInvalidPeriod(false)
            setPeriod(draftPeriod)
          }}
        >
          <AdminField
            label={translate('ghostSeats.acceptance.from')}
            description={translate('ghostSeats.acceptance.dateHelp')}
          >
            <input
              required
              type='date'
              value={draftPeriod.from}
              className={adminInputClass}
              onChange={(event) => setDraftPeriod({ ...draftPeriod, from: event.target.value })}
            />
          </AdminField>
          <AdminField
            label={translate('ghostSeats.acceptance.to')}
            description={translate('ghostSeats.acceptance.dateHelp')}
            error={invalidPeriod ? translate('ghostSeats.acceptance.dateInvalid') : undefined}
          >
            <input
              required
              type='date'
              value={draftPeriod.to}
              min={draftPeriod.from || undefined}
              aria-invalid={invalidPeriod || undefined}
              className={adminInputClass}
              onChange={(event) => setDraftPeriod({ ...draftPeriod, to: event.target.value })}
            />
          </AdminField>
          <button type='submit' className={adminButtonClass} disabled={acceptance.isFetching}>
            {translate('ghostSeats.acceptance.apply')}
          </button>
        </form>
        <AdminQueryState query={acceptance}>
          {data && (
            <div className='divide-y divide-border/40'>
              <div className='flex flex-wrap justify-between gap-3 py-4'>
                <div>
                  <h3 className='font-medium'>{translate('ghostSeats.acceptance.total')}</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {translate('ghostSeats.acceptance.fraction', {
                      accepted: formatNumber(data.numerator),
                      total: formatNumber(data.denominator)
                    })}
                  </p>
                </div>
                <p className='text-right font-mono tabular-nums'>
                  {data.ratePercent === null
                    ? translate('ghostSeats.acceptance.unavailable')
                    : formatPercent(data.ratePercent / 100)}
                </p>
              </div>
              {(['G1', 'G2', 'G3', 'G4'] as const).map((group) => (
                <div key={group} className='flex flex-wrap justify-between gap-3 py-3 text-sm'>
                  <div>
                    <h3>{translate(`ghostSeats.acceptance.groups.${group}`)}</h3>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {translate('ghostSeats.acceptance.fraction', {
                        accepted: formatNumber(data.byGroup[group].numerator),
                        total: formatNumber(data.byGroup[group].denominator)
                      })}
                    </p>
                  </div>
                  <p className='text-right font-mono tabular-nums'>
                    {data.byGroup[group].ratePercent === null
                      ? translate('none')
                      : formatPercent(data.byGroup[group].ratePercent / 100)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </AdminQueryState>
      </section>
      <section className='space-y-4 border-t border-border pt-5'>
        <AdminField
          label={translate('ghostSeats.decisions.scope')}
          description={translate('ghostSeats.decisions.scopeHelp')}
        >
          <select
            value={scope}
            className={`${adminInputClass} max-w-xl`}
            onChange={(event) => {
              setScope(event.target.value as GhostSeatDecisionListSelfDecided | '')
              setPage(1)
            }}
          >
            <option value=''>{translate('ghostSeats.decisions.all')}</option>
            <option value='true'>{translate('ghostSeats.decisions.self')}</option>
            <option value='false'>{translate('ghostSeats.decisions.other')}</option>
          </select>
        </AdminField>
        <AdminQueryState query={decisions}>
          {!items.length && <AdminEmpty />}
          <div className='divide-y divide-border/40'>
            {items.map((item) => (
              <article key={item.id} className='space-y-2 py-4 text-sm'>
                <div className='flex flex-wrap justify-between gap-3'>
                  <h3 className='font-medium'>
                    {translate(`ghostSeats.decisions.choice.${item.choice}`, { defaultValue: translate('unknown') })}
                  </h3>
                  <time className='text-right font-mono text-xs tabular-nums' dateTime={item.decidedAt}>
                    {formatDateTime(item.decidedAt)}
                  </time>
                </div>
                <p className='max-w-xl truncate' title={item.decidedBy.fullName}>
                  {item.decidedBy.fullName}
                </p>
                <p className='whitespace-pre-wrap break-words text-muted-foreground'>{item.reason}</p>
                {item.selfDecided && <p className='text-xs text-warning'>{translate('ghostSeats.decisions.own')}</p>}
                {item.exemptUntil && (
                  <p>{translate('ghostSeats.decisions.exemption', { date: formatDate(item.exemptUntil) })}</p>
                )}
              </article>
            ))}
          </div>
          <AdminPagination
            pagination={decisions.data?.data?.pagination}
            onPageChange={setPage}
            disabled={decisions.isFetching}
          />
        </AdminQueryState>
      </section>
    </div>
  )
}
