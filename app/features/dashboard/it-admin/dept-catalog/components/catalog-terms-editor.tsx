import { useTranslation } from 'react-i18next'
import { usePlanTermsGet, getPlanTermsGetQueryKey } from '~/shared/api/generated/operations/plan-terms/plan-terms-get'
import { usePlanTermsSet } from '~/shared/api/generated/operations/plan-terms/plan-terms-set'
import { getPlanWarningListQueryKey } from '~/shared/api/generated/operations/plan-terms/plan-warning-list'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { useCatalogEditorSnapshot } from '../hooks/use-catalog-editor-snapshot'
import type { PlanTermsResponseDtoData } from '~/shared/api/generated/model/plan-terms'

export function CatalogTermsEditor({ planId, onClose }: { planId: string; onClose: () => void }) {
  const query = usePlanTermsGet(planId, { query: { staleTime: 0, refetchOnMount: 'always' } })
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
        <TermsFields
          key={editor.version}
          data={editor.snapshot}
          onClose={onClose}
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
function TermsFields({
  data,
  onClose,
  blocked,
  onDirty,
  changed,
  onReload
}: {
  data: NonNullable<PlanTermsResponseDtoData>
  onClose: () => void
  blocked: boolean
  onDirty: () => void
  changed: boolean
  onReload: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const feedback = useItMutationFeedback([getPlanTermsGetQueryKey(data.planId), getPlanWarningListQueryKey()], onClose)
  const mutation = usePlanTermsSet({ mutation: feedback })
  return (
    <ItFormDialog
      wide
      title={translate('terms.edit')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={blocked || !data.applicable}
      onSubmit={(event) => {
        event.preventDefault()
        if (blocked || !data.applicable || mutation.isPending) return
        const form = new FormData(event.currentTarget)
        const text = (key: string) => String(form.get(key) ?? '').trim() || null
        mutation.mutate({
          id: data.planId,
          data: {
            termsUrl: text('termsUrl'),
            lastReviewedOn: text('lastReviewedOn'),
            aiTraining: text('aiTraining'),
            dataLocation: text('dataLocation'),
            commercialUse: text('commercialUse'),
            cancellationRefund: text('cancellationRefund'),
            installLimit: {
              maxDevicesPerKey: text('maxDevicesPerKey') ? Number(text('maxDevicesPerKey')) : null,
              note: text('installNote')
            }
          }
        })
      }}
    >
      {changed && (
        <div className='space-y-2'>
          <p role='status' className='text-sm'>
            {translate('remoteChanged')}
          </p>
          <button type='button' className={itButtonClass} onClick={onReload}>
            {translate('reloadLatest')}
          </button>
        </div>
      )}
      <div className='grid gap-4 sm:grid-cols-2' onChange={onDirty}>
        <ItField label={translate('terms.termsUrl')} hint={translate('terms.help.termsUrl')}>
          <input
            name='termsUrl'
            type='url'
            maxLength={10000}
            defaultValue={data.terms?.termsUrl ?? ''}
            placeholder={translate('terms.urlPlaceholder')}
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('terms.lastReviewedOn')} hint={translate('terms.help.lastReviewedOn')}>
          <input
            name='lastReviewedOn'
            type='date'
            defaultValue={data.terms?.lastReviewedOn ?? ''}
            className={itInputClass}
          />
        </ItField>
        {(['aiTraining', 'dataLocation', 'commercialUse', 'cancellationRefund'] as const).map((key) => (
          <ItField key={key} label={translate(`terms.${key}`)} hint={translate(`terms.placeholders.${key}`)}>
            <textarea
              name={key}
              maxLength={10000}
              defaultValue={data.terms?.[key] ?? ''}
              placeholder={translate(`terms.placeholders.${key}`)}
              className={itInputClass}
            />
          </ItField>
        ))}
        <ItField label={translate('terms.maxDevicesPerKey')} hint={translate('terms.help.maxDevicesPerKey')}>
          <input
            name='maxDevicesPerKey'
            type='number'
            min={1}
            max={1000000}
            step={1}
            defaultValue={data.terms?.installLimit?.maxDevicesPerKey ?? ''}
            placeholder={translate('terms.devicesPlaceholder')}
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('terms.installNote')} hint={translate('terms.help.installNote')}>
          <textarea
            name='installNote'
            maxLength={10000}
            defaultValue={data.terms?.installLimit?.note ?? ''}
            placeholder={translate('terms.installPlaceholder')}
            className={itInputClass}
          />
        </ItField>
      </div>
    </ItFormDialog>
  )
}
