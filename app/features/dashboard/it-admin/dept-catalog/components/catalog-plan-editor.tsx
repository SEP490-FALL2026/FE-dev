import { useCatalogEditorSnapshot } from '../hooks/use-catalog-editor-snapshot'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlanGet } from '~/shared/api/generated/operations/plans/plan-get'
import { usePlanUpdate } from '~/shared/api/generated/operations/plans/plan-update'
import { getPlanListQueryKey } from '~/shared/api/generated/operations/plans/plan-list'
import { DeclarePlanBodyDtoPricingModel } from '~/shared/api/generated/model/plans/declarePlanBodyDtoPricingModel'
import { DeclarePlanBodyDtoControlLevel } from '~/shared/api/generated/model/plans/declarePlanBodyDtoControlLevel'
import type { PlanDetailResponseDtoData } from '~/shared/api/generated/model/plans'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
export function CatalogPlanEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const query = usePlanGet(id, { query: { staleTime: 0, refetchOnMount: 'always' } })
  const editor = useCatalogEditorSnapshot(query)
  return (
    <ItQueryState
      query={
        editor.snapshot
          ? { ...query, isPending: false, isError: false }
          : { ...query, isPending: query.isPending || query.isFetching }
      }
    >
      {editor.snapshot && (
        <PlanFields
          key={editor.version}
          plan={editor.snapshot}
          onClose={onClose}
          queryKey={query.queryKey}
          blocked={editor.blocked}
          onDirty={editor.markDirty}
          changed={editor.changed || query.isError}
          onReload={() => {
            if (query.isError) void query.refetch()
            else editor.reload()
          }}
        />
      )}
    </ItQueryState>
  )
}
function PlanFields({
  plan,
  onClose,
  queryKey,
  blocked,
  onDirty,
  changed,
  onReload
}: {
  plan: NonNullable<PlanDetailResponseDtoData>
  onClose: () => void
  queryKey: readonly unknown[]
  blocked: boolean
  onDirty: () => void
  changed: boolean
  onReload: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [dataLoss, setDataLoss] = useState(plan.dataLossOnRemoval)
  const feedback = useItMutationFeedback([getPlanListQueryKey(), queryKey], onClose)
  const update = usePlanUpdate({ mutation: feedback })
  return (
    <ItFormDialog
      wide
      title={translate('editPlan')}
      pending={update.isPending}
      submitDisabled={blocked}
      submitLabel={translate('save')}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (blocked || update.isPending) return
        const values = new FormData(event.currentTarget)
        const pricingModel = Object.values(DeclarePlanBodyDtoPricingModel).find(
          (value) => value === values.get('pricingModel')
        )
        const controlLevel = Object.values(DeclarePlanBodyDtoControlLevel).find(
          (value) => value === values.get('controlLevel')
        )
        const name = String(values.get('name') ?? '').trim()
        if (!name) return
        update.mutate({
          id: plan.id,
          data: {
            name,
            dataLossOnRemoval: dataLoss,
            revocationNote: String(values.get('note') ?? '').trim() || null,
            ...(plan.provisioningType !== 'K5' ? { pricingModel, controlLevel } : {})
          }
        })
      }}
    >
      {changed && (
        <div className='space-y-2'>
          <p role='status'>{translate('remoteChanged')}</p>
          <button type='button' className={itButtonClass} onClick={onReload}>
            {translate('reloadLatest')}
          </button>
        </div>
      )}
      <div className='contents' onChange={onDirty}>
        <ItField label={translate('planName')} hint={translate('help.planName')}>
          <input
            placeholder={translate('placeholders.plan')}
            name='name'
            required
            maxLength={1000}
            className={itInputClass}
            defaultValue={plan.name}
          />
        </ItField>
        <p className='text-sm text-muted-foreground'>
          {translate(`enums.${plan.provisioningType}`, { defaultValue: translate('unknown') })}
        </p>
        {plan.provisioningType !== 'K5' &&
          (
            [
              ['pricingModel', DeclarePlanBodyDtoPricingModel, plan.pricingModel],
              ['controlLevel', DeclarePlanBodyDtoControlLevel, plan.controlLevel]
            ] as const
          ).map(([key, options, initial]) => (
            <fieldset key={key}>
              <legend>{translate(key)}</legend>
              <p className='text-xs font-normal text-muted-foreground'>{translate(`help.${key}`)}</p>
              {Object.values(options).map((value) => (
                <label key={value} className='flex min-h-11 items-center gap-2'>
                  <input type='radio' required name={key} value={value} defaultChecked={value === initial} />
                  {translate(`enums.${value}`, { defaultValue: translate('unknown') })}
                </label>
              ))}
            </fieldset>
          ))}
        <label className='flex min-h-11 items-center gap-2'>
          <input type='checkbox' checked={dataLoss} onChange={(event) => setDataLoss(event.target.checked)} />
          {translate('dataLoss')}
        </label>
        <ItField label={translate('revocationNote')} hint={translate('help.revocationNote')}>
          <textarea
            placeholder={translate('placeholders.note')}
            name='note'
            required={dataLoss}
            maxLength={5000}
            defaultValue={plan.revocationNote ?? ''}
            className={itInputClass}
          />
        </ItField>
      </div>
    </ItFormDialog>
  )
}
