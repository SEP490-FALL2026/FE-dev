import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAccessRequestGet,
  getAccessRequestGetQueryKey
} from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getAccessRequestAssessmentGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { useAccessRequestCatalogLink } from '~/shared/api/generated/operations/access-requests/access-request-catalog-link'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { canLinkCatalogPlan } from '../hooks/catalog-link-gates'

export function CatalogLinkSection({
  item,
  authorized
}: {
  item: AssessmentResponseDtoDataAssessment
  authorized: boolean
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const query = useAccessRequestGet(item.requestId)
  const [open, setOpen] = useState(false)
  const data = query.data?.data
  const request = data && 'request' in data ? data.request : undefined
  const eligible = !query.isFetching && !query.isError && canLinkCatalogPlan(item, request, authorized)
  return (
    <section className='space-y-3 rounded-lg border border-border bg-surface p-4'>
      <h3 className='font-semibold [text-wrap:balance]'>{translate('catalogLink.title')}</h3>
      <ItQueryState query={query}>
        {request?.plan ? (
          <p className='text-sm'>{translate('catalogLink.linked', { plan: request.plan.planName })}</p>
        ) : (
          <>
            <p className='text-sm text-muted-foreground'>{translate('catalogLink.hint')}</p>
            {item.equivalentTool && (
              <p className='text-sm'>
                {item.equivalentTool.applicationName} · {item.equivalentTool.planName}
              </p>
            )}
            <button className={itButtonClass} disabled={!eligible} onClick={() => setOpen(true)}>
              {translate('catalogLink.action')}
            </button>
          </>
        )}
      </ItQueryState>
      {open && item.equivalentTool && (
        <CatalogLinkDialog
          requestId={item.requestId}
          plan={item.equivalentTool}
          eligible={eligible}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  )
}
export function CatalogLinkDialog({
  requestId,
  plan,
  eligible,
  onClose
}: {
  requestId: string
  plan: { planId: string; planName: string; applicationName: string }
  eligible: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const mutation = useAccessRequestCatalogLink()
  const lock = useRef(false)
  const client = useQueryClient()
  const feedback = useItMutationFeedback(
    [getAccessRequestGetQueryKey(requestId), getAccessRequestAssessmentGetQueryKey(requestId)],
    onClose
  )
  async function submit() {
    if (!eligible || !plan.planId || lock.current || mutation.isPending) return
    lock.current = true
    try {
      await mutation.mutateAsync({ id: requestId, data: { planId: plan.planId } })
      await client.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === 'string' && /access-requests|provisioning-tasks|grant-queue/.test(key)
          )
      })
      await feedback.onSuccess()
    } catch (error) {
      await feedback.onError(error)
    } finally {
      lock.current = false
    }
  }
  return (
    <ItFormDialog
      title={translate('catalogLink.title')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('confirm')}
      submitDisabled={!eligible || !plan.planId}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <p className='text-sm'>
        {translate('catalogLink.confirm', { application: plan.applicationName, plan: plan.planName })}
      </p>
      <p className='text-sm text-muted-foreground'>{translate('catalogLink.confirmHint')}</p>
    </ItFormDialog>
  )
}
