import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ItChoiceSelect } from '../shared/components/it-choice-select'
import { OptimizationEscalation } from './components/optimization-escalation'
import { GhostSeatRecommendationListState, GhostSeatRecommendationListTier } from '~/shared/api/generated/model'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import {
  useGhostSeatRecommendationList,
  getGhostSeatRecommendationListQueryKey
} from '~/shared/api/generated/operations/ghost-seats/ghost-seat-recommendation-list'
import {
  useGhostSeatRecommendationGet,
  getGhostSeatRecommendationGetQueryKey
} from '~/shared/api/generated/operations/ghost-seats/ghost-seat-recommendation-get'
import { ghostSeatRecommendationReclaim } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-recommendation-reclaim'
import { ghostSeatRecommendationReturn } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-recommendation-return'
import { ItQueryState, ItEmpty } from '../shared/components/it-query-state'
import { ItPagination } from '../shared/components/it-pagination'
import { ItField, ItFormDialog, itButtonClass, itInputClass } from '../shared/components/it-form'
import { useItMutationFeedback } from '../shared/hooks/use-it-mutation-feedback'

export function ItOptimizationView() {
  const { t } = useTranslation('itOptimization')
  const [params, setParams] = useSearchParams()
  const update = (key: string, value: string) =>
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  const page = Math.max(1, Number(params.get('optimizationPage')) || 1)
  const setPage = (value: number) => update('optimizationPage', String(value))
  const selectedId = params.get('recommendation') ?? ''
  const setSelectedId = (value: string) => update('recommendation', value)
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({})
  const [escalating, setEscalating] = useState(false)
  const state = Object.values(GhostSeatRecommendationListState).find(
    (value) => value === params.get('recommendationState')
  )
  const tier = Object.values(GhostSeatRecommendationListTier).find(
    (value) => value === params.get('recommendationTier')
  )
  const [confirmReclaim, setConfirmReclaim] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [reason, setReason] = useState('')
  const query = useGhostSeatRecommendationList({ page, pageSize: 20, state, tier })
  const detail = useGhostSeatRecommendationGet(selectedId, { query: { enabled: !!selectedId } })
  const selected = detail.data?.data?.recommendation
  const feedback = useItMutationFeedback(
    [getGhostSeatRecommendationListQueryKey(), getGhostSeatRecommendationGetQueryKey(selectedId)],
    () => setConfirmReclaim(false)
  )
  const reclaim = useMutation({ mutationFn: () => ghostSeatRecommendationReclaim(selectedId), ...feedback })
  const returnFeedback = useItMutationFeedback(
    [getGhostSeatRecommendationListQueryKey(), getGhostSeatRecommendationGetQueryKey(selectedId)],
    () => {
      setReturnOpen(false)
      setReason('')
    }
  )
  const returnDecision = useMutation({
    mutationFn: () => ghostSeatRecommendationReturn(selectedId, { reason: reason.trim() }),
    ...returnFeedback
  })
  if (escalating)
    return (
      <OptimizationEscalation
        ids={Object.keys(selectedIds)}
        labels={selectedIds}
        onBack={() => {
          setEscalating(false)
          setSelectedIds({})
        }}
      />
    )
  if (selectedId)
    return (
      <section className='space-y-5'>
        <button type='button' className={itButtonClass} onClick={() => setSelectedId('')}>
          {t('optimization.back')}
        </button>
        <ItQueryState query={detail}>
          {selected && (
            <>
              <h1 className='text-2xl font-semibold'>
                {selected.application.applicationName} · {selected.plan.planName}
              </h1>
              <dl className='grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2'>
                <div>
                  <dt className='text-sm text-muted-foreground'>{t('optimization.holder')}</dt>
                  <dd>{selected.holder?.employeeCode ?? t('unavailable')}</dd>
                </div>
                <div>
                  <dt className='text-sm text-muted-foreground'>{t('optimization.group')}</dt>
                  <dd>{t(`optimization.groups.${selected.group}`, { defaultValue: t('unavailable') })}</dd>
                </div>
                <div>
                  <dt className='text-sm text-muted-foreground'>{t('status')}</dt>
                  <dd>{t(`optimization.states.${selected.state}`, { defaultValue: t('unavailable') })}</dd>
                </div>
                {selected.inactiveDays != null && (
                  <div>
                    <dt className='text-sm text-muted-foreground'>{t('optimization.inactiveDays')}</dt>
                    <dd>{t('optimization.days', { count: selected.inactiveDays })}</dd>
                  </div>
                )}
              </dl>
              {selected.canReclaim && (
                <button type='button' className={itButtonClass} onClick={() => setConfirmReclaim(true)}>
                  {t('optimization.reclaim')}
                </button>
              )}
              {(selected.group === 'G3' || selected.group === 'G4') && selected.state === 'RECLAIM_DECIDED' && (
                <button type='button' className={itButtonClass} onClick={() => setReturnOpen(true)}>
                  {t('optimization.return')}
                </button>
              )}
            </>
          )}
        </ItQueryState>
        {confirmReclaim && (
          <ItFormDialog
            title={t('optimization.reclaim')}
            onClose={() => setConfirmReclaim(false)}
            pending={reclaim.isPending}
            submitLabel={t('confirm')}
            onSubmit={(event) => {
              event.preventDefault()
              if (!reclaim.isPending) reclaim.mutate()
            }}
          >
            <p>{t('optimization.reclaimHint')}</p>
          </ItFormDialog>
        )}
        {returnOpen && (
          <ItFormDialog
            title={t('optimization.return')}
            onClose={() => setReturnOpen(false)}
            pending={returnDecision.isPending}
            submitDisabled={reason.trim().length < 3}
            submitLabel={t('confirm')}
            onSubmit={(event) => {
              event.preventDefault()
              if (reason.trim().length >= 3 && !returnDecision.isPending) returnDecision.mutate()
            }}
          >
            <p className='text-sm text-muted-foreground'>{t('optimization.returnHint')}</p>
            <ItField label={t('reason')} hint={t('optimization.reasonHint')}>
              <textarea
                className={itInputClass}
                value={reason}
                minLength={3}
                maxLength={1000}
                required
                onChange={(event) => setReason(event.target.value)}
              />
            </ItField>
          </ItFormDialog>
        )}
      </section>
    )
  return (
    <section className='space-y-5'>
      <header>
        <h1 className='text-2xl font-semibold'>{t('optimization.title')}</h1>
        <p className='text-sm text-muted-foreground'>{t('optimization.description')}</p>
      </header>
      <div className='flex flex-wrap gap-3'>
        <ItChoiceSelect
          label={t('status')}
          value={state ?? ''}
          onChange={(value) => {
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('recommendationState', value)
              next.delete('optimizationPage')
              return next
            })
            setSelectedIds({})
          }}
          options={[
            { value: '', label: t('all') },
            ...Object.values(GhostSeatRecommendationListState).map((value) => ({
              value,
              label: t(`optimization.states.${value}`, { defaultValue: t('unavailable') })
            }))
          ]}
        />
        <ItChoiceSelect
          label={t('tier')}
          value={tier ?? ''}
          onChange={(value) => {
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('recommendationTier', value)
              next.delete('optimizationPage')
              return next
            })
            setSelectedIds({})
          }}
          options={[
            { value: '', label: t('all') },
            ...Object.values(GhostSeatRecommendationListTier).map((value) => ({ value, label: t(value) }))
          ]}
        />
        <button
          type='button'
          className={itButtonClass}
          disabled={!Object.keys(selectedIds).length}
          onClick={() => setEscalating(true)}
        >
          {t('escalate')}
        </button>
      </div>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((item) => (
              <article key={item.id} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                {(item.group === 'G3' || item.group === 'G4') && item.tier === 'MONITOR' && item.state === 'OPEN' && (
                  <input
                    type='checkbox'
                    aria-label={t('select', {
                      employee: item.holder?.employeeCode ?? t('unavailable'),
                      application: item.application.applicationName
                    })}
                    checked={!!selectedIds[item.id]}
                    disabled={!selectedIds[item.id] && Object.keys(selectedIds).length >= 100}
                    onChange={(event) =>
                      setSelectedIds((previous) => {
                        const next = { ...previous }
                        if (event.target.checked)
                          next[item.id] = [item.holder?.employeeCode, item.application.applicationName]
                            .filter(Boolean)
                            .join(' · ')
                        else delete next[item.id]
                        return next
                      })
                    }
                  />
                )}
                <div>
                  <h2 className='font-medium'>
                    {item.application.applicationName} · {item.plan.planName}
                  </h2>
                  <p className='text-sm text-muted-foreground'>{item.holder?.employeeCode ?? t('unavailable')}</p>
                  <p className='text-sm'>
                    {t(`optimization.states.${item.state}`, { defaultValue: t('unavailable') })}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => setSelectedId(item.id)}>
                  {t('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
    </section>
  )
}
