import { CatalogSubscriptionStatus } from '../enums/subscription-status'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSeatBaselineGet } from '~/shared/api/generated/operations/seat-baseline/seat-baseline-get'
import { useSeatBaselineClose } from '~/shared/api/generated/operations/seat-baseline/seat-baseline-close'
import { useSeatBaselineImportUpload } from '~/shared/api/generated/operations/seat-baseline-imports/seat-baseline-import-upload'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { CatalogSeatPreview } from './catalog-seat-preview'
import { useDashboardFormat } from '../../../dashboard-ui'
export function CatalogSeatBaseline({
  applicationId,
  applicationKind,
  planId
}: {
  applicationId: string
  applicationKind?: string
  planId?: string
}) {
  const { t: translate } = useTranslation('itCatalog')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [subscriptionId, setSubscriptionId] = useState('')
  const [file, setFile] = useState<File>()
  const [importId, setImportId] = useState<string>()
  const [closing, setClosing] = useState(false)
  const [fileError, setFileError] = useState(false)
  const baseline = useSeatBaselineGet()
  const internal = applicationKind === 'INTERNAL'
  const subscriptions = useSubscriptionList(
    { applicationId, planId, status: CatalogSubscriptionStatus.ACTIVE, page, pageSize: 20 },
    { query: { enabled: !internal } }
  )
  const plans = usePlanList(
    { applicationId, provisioningType: 'K5', page, pageSize: 20 },
    { query: { enabled: internal } }
  )
  const targets = internal ? plans : subscriptions
  const options = internal
    ? plans.data?.data?.items.map((plan) => ({ id: plan.id, label: plan.name, period: '', disabled: false }))
    : subscriptions.data?.data?.items.map((subscription) => ({
        id: subscription.id,
        label: subscription.planName,
        period: [subscription.startDate, subscription.endDate]
          .filter((date): date is string => Boolean(date))
          .map(formatDate)
          .join(' – '),
        disabled: subscription.purchasedQuantity === null
      }))
  const feedback = useItMutationFeedback([baseline.queryKey])
  const upload = useSeatBaselineImportUpload({ mutation: feedback })
  const closeFeedback = useItMutationFeedback([baseline.queryKey], () => setClosing(false))
  const close = useSeatBaselineClose({ mutation: closeFeedback })
  const closed = baseline.data?.data?.closed !== false
  return (
    <section className='space-y-4 rounded-lg border border-border p-4'>
      <h2 className='font-semibold [text-wrap:balance]'>{translate('baseline')}</h2>
      <ItQueryState query={baseline}>
        <p>
          {translate(!baseline.data?.data ? 'unknown' : baseline.data.data.closed ? 'baselineClosed' : 'baselineOpen')}
        </p>
      </ItQueryState>
      {!closed && (
        <>
          {!importId && (
            <form
              className='space-y-4'
              onSubmit={(event) => {
                event.preventDefault()
                if (upload.isPending || !file || !subscriptionId || fileError) return
                upload.mutate(
                  { data: { file, ...(internal ? { planId: subscriptionId } : { subscriptionId }) } },
                  {
                    onSuccess: (response) => {
                      if (response.data) setImportId(response.data.id)
                    }
                  }
                )
              }}
            >
              <fieldset disabled={upload.isPending} className='space-y-3'>
                <legend className='mb-2 text-sm font-medium'>
                  {translate(internal ? 'import.internalPlan' : 'import.subscription')}
                  <span aria-hidden='true' className='ml-1 text-danger'>
                    *
                  </span>
                </legend>
                <ItQueryState query={targets}>
                  {options?.map((subscription) => (
                    <label key={subscription.id} className='flex min-h-11 items-center gap-3'>
                      <input
                        type='radio'
                        name='baseline-subscription'
                        required
                        value={subscription.id}
                        checked={subscriptionId === subscription.id}
                        disabled={subscription.disabled}
                        onChange={() => setSubscriptionId(subscription.id)}
                      />
                      <span>{subscription.label}</span>
                      {subscription.period && (
                        <span className='text-xs text-muted-foreground'>{subscription.period}</span>
                      )}
                    </label>
                  ))}
                  {options?.length === 0 && <ItEmpty />}
                </ItQueryState>
                <ItPagination
                  page={page}
                  total={targets.data?.data?.pagination.totalItems ?? 0}
                  pageSize={20}
                  onChange={(value) => {
                    setPage(value)
                    setSubscriptionId('')
                  }}
                  disabled={upload.isPending}
                />
                <ItField
                  label={translate('import.file')}
                  hint={translate('import.fileHint')}
                  error={fileError ? translate('import.fileInvalid') : undefined}
                >
                  <input
                    type='file'
                    required
                    accept='.csv,text/csv,text/plain'
                    aria-invalid={fileError}
                    className={itInputClass}
                    onChange={(event) => {
                      const next = event.target.files?.[0]
                      setFile(next)
                      setFileError(
                        !!next &&
                          (next.size === 0 || next.size > 2 * 1024 * 1024 || !next.name.toLowerCase().endsWith('.csv'))
                      )
                    }}
                  />
                </ItField>
                <button
                  type='submit'
                  className={itButtonClass}
                  disabled={upload.isPending || !subscriptionId || !file || fileError || targets.isError}
                  aria-busy={upload.isPending}
                >
                  {translate(upload.isPending ? 'import.uploading' : 'import.upload')}
                </button>
              </fieldset>
            </form>
          )}
          {importId && (
            <CatalogSeatPreview
              key={importId}
              id={importId}
              subscriptionId={internal ? undefined : subscriptionId}
              closed={closed}
              onReset={() => {
                setImportId(undefined)
                setFile(undefined)
              }}
            />
          )}
          <button className={itButtonClass} onClick={() => setClosing(true)} disabled={upload.isPending || !!importId}>
            {translate('import.close')}
          </button>
        </>
      )}
      {closed && importId && (
        <CatalogSeatPreview id={importId} subscriptionId={internal ? undefined : subscriptionId} closed />
      )}
      {closing && (
        <ItFormDialog
          title={translate('import.close')}
          pending={close.isPending}
          danger
          onClose={() => setClosing(false)}
          submitLabel={translate('import.close')}
          onSubmit={(event) => {
            event.preventDefault()
            close.mutate()
          }}
        >
          <p>{translate('import.closeHint')}</p>
        </ItFormDialog>
      )}
    </section>
  )
}
