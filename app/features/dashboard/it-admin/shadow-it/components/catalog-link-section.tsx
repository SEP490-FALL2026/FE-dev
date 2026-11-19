import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAccessRequestGet,
  getAccessRequestGetQueryKey
} from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getAccessRequestAssessmentGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { useAccessRequestCatalogLink } from '~/shared/api/generated/operations/access-requests/access-request-catalog-link'
import { usePlanGet } from '~/shared/api/generated/operations/plans/plan-get'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { canLinkCatalogPlan } from '../hooks/catalog-link-gates'
import { CatalogLinkPlanPicker } from './catalog-link-plan-picker'

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
                {translate('catalogLink.suggestion', {
                  application: item.equivalentTool.applicationName,
                  plan: item.equivalentTool.planName
                })}
              </p>
            )}
            <button className={itButtonClass} disabled={!eligible} onClick={() => setOpen(true)}>
              {translate('catalogLink.action')}
            </button>
          </>
        )}
      </ItQueryState>
      {open && <CatalogLinkDialog requestId={item.requestId} eligible={eligible} onClose={() => setOpen(false)} />}
    </section>
  )
}
export function CatalogLinkDialog({
  requestId,
  eligible,
  onClose
}: {
  requestId: string
  eligible: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const mutation = useAccessRequestCatalogLink()
  const [applicationId, setApplicationId] = useState('')
  const [planId, setPlanId] = useState('')
  const [checking, setChecking] = useState(false)
  const detail = usePlanGet(planId, { query: { enabled: Boolean(planId), staleTime: 0, refetchOnMount: 'always' } })
  const plan = detail.data?.data
  const selectedPlanMatches = Boolean(planId && plan?.id === planId && plan.applicationId === applicationId)
  const canSubmit = eligible && selectedPlanMatches && !detail.isFetching && !detail.isError
  const pending = checking || mutation.isPending
  const lock = useRef(false)
  const client = useQueryClient()
  const feedback = useItMutationFeedback(
    [getAccessRequestGetQueryKey(requestId), getAccessRequestAssessmentGetQueryKey(requestId)],
    onClose
  )
  async function submit() {
    if (!canSubmit || lock.current || pending) return
    lock.current = true
    setChecking(true)
    try {
      const fresh = await detail.refetch({ throwOnError: true })
      if (fresh.data?.data?.id !== planId || fresh.data.data.applicationId !== applicationId) return
      await mutation.mutateAsync({ id: requestId, data: { planId } })
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
      setChecking(false)
    }
  }
  return (
    <ItFormDialog
      title={translate('catalogLink.title')}
      pending={pending}
      onClose={onClose}
      submitLabel={translate('confirm')}
      submitDisabled={!canSubmit}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <CatalogLinkPlanPicker
        applicationId={applicationId}
        planId={planId}
        disabled={pending || !eligible}
        onApplicationChange={(id) => {
          setApplicationId(id)
          setPlanId('')
        }}
        onPlanChange={setPlanId}
      />
      {planId && (
        <ItQueryState query={detail}>
          <p className='text-sm'>
            {selectedPlanMatches && plan
              ? translate('catalogLink.confirm', { application: plan.applicationName, plan: plan.name })
              : translate('catalogLink.selectPlanHint')}
          </p>
        </ItQueryState>
      )}
      <p className='text-sm text-muted-foreground'>{translate('catalogLink.confirmHint')}</p>
    </ItFormDialog>
  )
}
