import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalPropose } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-propose'
import { useSubscriptionSeatUsage } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import { useLicenseAssignmentList } from '~/shared/api/generated/operations/license-assignments/license-assignment-list'
import { getSubscriptionRenewalListQueryKey } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { RenewalChoice } from '../enums/renewal-choice'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItQueryState } from '../../shared/components/it-query-state'

export function RenewalProposalDialog({
  subscription,
  onClose
}: {
  subscription: { id: string; applicationName: string; planName: string; purchasedQuantity: number | null }
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itRenewals')
  const [choice, setChoice] = useState<RenewalChoice>(RenewalChoice.RENEW)
  const [quantity, setQuantity] = useState('')
  const [page, setPage] = useState(1)
  const [releasedIds, setReleasedIds] = useState<string[]>([])
  const reducing = choice === RenewalChoice.REDUCE
  const usage = useSubscriptionSeatUsage(subscription.id, { query: { enabled: reducing, staleTime: 0 } })
  const occupied = usage.data?.data?.occupied
  const excess = reducing && occupied !== undefined ? Math.max(0, occupied - Number(quantity)) : 0
  const assignments = useLicenseAssignmentList(
    { subscriptionId: subscription.id, page, pageSize: 20 },
    { query: { enabled: reducing && excess > 0, staleTime: 0 } }
  )
  const validSelection =
    !reducing ||
    (occupied !== undefined &&
      !usage.isError &&
      !usage.isFetching &&
      (excess === 0 || (!assignments.isFetching && !assignments.isError && releasedIds.length === excess)))
  const feedback = useItMutationFeedback([getSubscriptionRenewalListQueryKey()], onClose)
  const mutation = useSubscriptionRenewalPropose({ mutation: feedback })
  const validQuantity =
    choice !== RenewalChoice.REDUCE ||
    (quantity !== '' &&
      Number.isInteger(Number(quantity)) &&
      Number(quantity) >= 0 &&
      subscription.purchasedQuantity !== null &&
      Number(quantity) < subscription.purchasedQuantity)
  return (
    <ItFormDialog
      wide
      title={translate('propose')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('submitProposal')}
      submitDisabled={!validQuantity || !validSelection}
      onSubmit={(event) => {
        event.preventDefault()
        if (!validQuantity || !validSelection || mutation.isPending) return
        const form = new FormData(event.currentTarget)
        const note = String(form.get('note') ?? '').trim()
        const opinion = String(form.get('businessOwnerOpinion') ?? '').trim()
        mutation.mutate({
          data: {
            subscriptionId: subscription.id,
            choice,
            ...(choice === RenewalChoice.REDUCE ? { proposedQuantity: Number(quantity) } : {}),
            ...(reducing && excess > 0 ? { releasedAssignmentIds: releasedIds } : {}),
            ...(note ? { note } : {}),
            ...(opinion ? { businessOwnerOpinion: opinion } : {})
          }
        })
      }}
    >
      <p className='font-medium'>
        {subscription.applicationName}
        <span aria-hidden> · </span>
        {subscription.planName}
      </p>
      <p className='text-sm text-muted-foreground'>{translate('proposalHint')}</p>
      <fieldset className='grid gap-2 sm:grid-cols-3'>
        <legend className='mb-2 text-sm font-medium'>{translate('choice')}</legend>
        {Object.values(RenewalChoice).map((value) => (
          <label
            key={value}
            className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors ${choice === value ? 'border-primary/50 bg-primary-soft text-primary-ink' : 'border-border hover:bg-surface-subtle'}`}
          >
            <input
              type='radio'
              name='choice'
              value={value}
              checked={choice === value}
              onChange={() => {
                setChoice(value)
                setReleasedIds([])
              }}
            />
            {translate(`values.${value}`)}
          </label>
        ))}
      </fieldset>
      {choice === RenewalChoice.REDUCE && (
        <ItField label={translate('quantity')}>
          <input
            type='number'
            required
            min={0}
            max={subscription.purchasedQuantity === null ? 0 : subscription.purchasedQuantity - 1}
            step={1}
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value)
              setReleasedIds([])
            }}
            placeholder={translate('quantityPlaceholder')}
            className={`${itInputClass} max-w-xs`}
          />
        </ItField>
      )}
      {reducing && <ItQueryState query={usage}>{null}</ItQueryState>}
      {reducing && excess > 0 && (
        <fieldset className='space-y-3'>
          <legend className='font-medium'>{translate('releaseSeats')}</legend>
          <p className='text-sm text-muted-foreground'>
            {translate('releaseSelection', { selected: releasedIds.length, count: excess })}
          </p>
          <ItQueryState query={assignments}>
            {assignments.data?.data?.items
              .filter((item) => !item.validUntil && !item.failedAt && !item.cancelledAt)
              .map((item) => (
                <label
                  key={item.id}
                  className='flex min-h-11 items-center gap-3 rounded-md border border-border p-3 text-sm'
                >
                  <input
                    type='checkbox'
                    checked={releasedIds.includes(item.id)}
                    disabled={!releasedIds.includes(item.id) && releasedIds.length >= excess}
                    onChange={(event) =>
                      setReleasedIds((previous) =>
                        event.target.checked ? [...previous, item.id] : previous.filter((id) => id !== item.id)
                      )
                    }
                  />
                  <span>
                    {item.employee.fullName} · {item.accountIdentifier}
                  </span>
                </label>
              ))}
          </ItQueryState>
          <ItPagination
            page={page}
            pageSize={20}
            total={assignments.data?.data?.pagination.totalItems ?? 0}
            onChange={setPage}
            disabled={mutation.isPending}
          />
        </fieldset>
      )}
      <ItField label={translate('note')}>
        <textarea name='note' maxLength={2000} placeholder={translate('notePlaceholder')} className={itInputClass} />
      </ItField>
      <ItField label={translate('opinion')}>
        <textarea
          name='businessOwnerOpinion'
          maxLength={2000}
          placeholder={translate('opinionPlaceholder')}
          className={itInputClass}
        />
      </ItField>
    </ItFormDialog>
  )
}
