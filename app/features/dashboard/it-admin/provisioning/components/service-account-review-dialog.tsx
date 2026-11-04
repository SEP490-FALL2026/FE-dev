import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import {
  accessRequestGet,
  getAccessRequestGetQueryKey
} from '~/shared/api/generated/operations/access-requests/access-request-get'
import { accessRequestServiceAccountReview } from '~/shared/api/generated/operations/access-requests/access-request-service-account-review'
import { getGrantQueueListQueryKey } from '~/shared/api/generated/operations/delegated-requests/grant-queue-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItQueryState } from '../../shared/components/it-query-state'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { BoundaryState, BoundaryDecision, RequestState } from '../enums/boundary-state'

export function ServiceAccountReviewDialog({ requestId, onClose }: { requestId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itProvisioning')
  const me = useMeGet({ query: { staleTime: 60000 } })
  const authorized = me.data?.data?.roles.includes('IT_ADMIN') === true
  const [decision, setDecision] = useState<BoundaryDecision>(BoundaryDecision.ACCEPT)
  const [reason, setReason] = useState('')
  const query = useQuery({
    queryKey: getAccessRequestGetQueryKey(requestId),
    queryFn: () => accessRequestGet(requestId),
    enabled: authorized
  })
  const data = query.data?.data
  const request = data && 'request' in data ? data.request : null
  const account = request?.serviceAccount
  const reviewable =
    authorized &&
    !query.isError &&
    !query.isPending &&
    request?.type === 'SERVICE_ACCOUNT' &&
    request.state === RequestState.AWAITING_EXECUTION &&
    account?.boundary.state === BoundaryState.PENDING
  const feedback = useItMutationFeedback([getGrantQueueListQueryKey(), getAccessRequestGetQueryKey(requestId)], onClose)
  const mutation = useMutation({
    mutationFn: () =>
      accessRequestServiceAccountReview(requestId, {
        decision,
        ...(decision === BoundaryDecision.REJECT ? { reason: reason.trim() } : {})
      }),
    ...feedback
  })
  const valid = reviewable && (decision !== BoundaryDecision.REJECT || reason.trim().length > 0)
  return (
    <ItFormDialog
      title={translate('reviewBoundary')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={!valid}
      submitLabel={translate('confirm')}
      onSubmit={(event) => {
        event.preventDefault()
        if (valid && !mutation.isPending) mutation.mutate()
      }}
    >
      <ItQueryState query={me}>
        {authorized ? (
          <ItQueryState query={query}>
            {reviewable && account ? (
              <>
                <p className='text-sm text-muted-foreground'>{translate('boundaryReviewHint')}</p>
                <dl className='space-y-3 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>{translate('servicePurpose')}</dt>
                    <dd className='whitespace-pre-wrap break-words'>{account.purpose}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('account')}</dt>
                    <dd className='break-all'>{account.expectedIdentifier}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('accountOwner')}</dt>
                    <dd>{account.responsible.fullName}</dd>
                  </div>
                </dl>
                <ItChoiceSelect
                  label={translate('boundaryDecision')}
                  value={decision}
                  options={Object.values(BoundaryDecision).map((value) => ({
                    value,
                    label: translate(`boundaryDecisions.${value}`)
                  }))}
                  onChange={(value) => {
                    const next = Object.values(BoundaryDecision).find((item) => item === value)
                    if (next) setDecision(next)
                  }}
                />
                {decision === BoundaryDecision.REJECT && (
                  <ItField label={translate('reason')}>
                    <textarea
                      className={itInputClass}
                      required
                      maxLength={1000}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                    />
                  </ItField>
                )}
              </>
            ) : (
              <p className='text-sm'>{translate('boundaryNotReviewable')}</p>
            )}
          </ItQueryState>
        ) : (
          <p className='text-sm'>{translate('accessRequired')}</p>
        )}
      </ItQueryState>
    </ItFormDialog>
  )
}
