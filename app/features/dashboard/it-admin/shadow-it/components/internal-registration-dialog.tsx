import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAccessRequestInternalRegister } from '~/shared/api/generated/operations/access-requests/access-request-internal-register'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import type { AssessmentPatchDto } from '~/shared/api/generated/model/access-requests/assessmentPatchDto'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getAccessRequestAssessmentGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { AssessmentQuote } from './assessment-quote'
export function InternalRegistrationDialog({
  item,
  onClose
}: {
  item: AssessmentResponseDtoDataAssessment
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const [owner, setOwner] = useState(item.proposedBusinessOwner?.employeeId ?? '')
  const [name, setName] = useState(item.proposal.softwareName)
  const [sensitivity, setSensitivity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(item.dataSensitivity ?? 'LOW')
  const [quote, setQuote] = useState<AssessmentPatchDto['quote']>()
  const lock = useRef(false)
  const client = useQueryClient()
  const feedback = useItMutationFeedback([getAccessRequestAssessmentGetQueryKey(item.requestId)], onClose)
  const mutation = useAccessRequestInternalRegister()
  async function submit() {
    if (lock.current || mutation.isPending || !owner.trim() || !name.trim()) return
    lock.current = true
    try {
      await mutation.mutateAsync({
        id: item.requestId,
        data: {
          businessOwnerEmployeeId: owner.trim(),
          softwareName: name.trim(),
          dataSensitivity: sensitivity,
          ...(quote ? { spend: { quote } } : {})
        }
      })
      await client.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => typeof key === 'string' && /applications|plans|access-requests/.test(key))
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
      page
      title={translate('registerInternal')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('confirm')}
      submitDisabled={!owner.trim() || !name.trim()}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('internalRegistrationHint')}</p>
      <ItField label={translate('owner')}>
        <input
          required
          pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
          className={itInputClass}
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
        />
      </ItField>
      <ItField label={translate('softwareName')}>
        <input
          required
          maxLength={200}
          className={itInputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </ItField>
      <fieldset>
        <legend>{translate('fields.dataSensitivity')}</legend>
        <div className='flex flex-wrap gap-3'>
          {(['LOW', 'MEDIUM', 'HIGH'] as const).map((value) => (
            <label key={value} className='flex min-h-11 items-center gap-2'>
              <input
                type='radio'
                name='sensitivity'
                checked={sensitivity === value}
                onChange={() => setSensitivity(value)}
              />
              {translate(`values.${value}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <AssessmentQuote quote={quote} onChange={setQuote} />
    </ItFormDialog>
  )
}
