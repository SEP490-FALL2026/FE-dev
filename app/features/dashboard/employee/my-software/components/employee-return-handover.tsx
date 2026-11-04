import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { returnRequestHandoverConfirm } from '~/shared/api/generated/operations/return-requests/return-request-handover-confirm'
import { getReturnRequestGetQueryKey } from '~/shared/api/generated/operations/return-requests/return-request-get'
import { getReturnRequestListQueryKey } from '~/shared/api/generated/operations/return-requests/return-request-list'
import { Dialog } from '../../../dashboard-ui'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { EmployeeButton } from '../../shared/components/employee-api-ui'

export function EmployeeReturnHandover({ id }: { id: string }) {
  const { t: translate } = useTranslation('employee')
  const [open, setOpen] = useState(false)
  const locked = useRef(false)
  const feedback = useEmployeeFeedback([getReturnRequestGetQueryKey(id), getReturnRequestListQueryKey()])
  const mutation = useMutation({
    mutationFn: () => returnRequestHandoverConfirm(id),
    retry: false,
    onSuccess: async () => {
      await feedback.onSuccess()
      if (feedback.isActive()) setOpen(false)
    },
    onError: feedback.onError
  })
  return (
    <>
      <EmployeeButton primary disabled={mutation.isPending || feedback.blocked} onClick={() => setOpen(true)}>
        {feedback.retrySeconds
          ? translate('retryAfter', { seconds: feedback.retrySeconds })
          : translate('requestExtras.returnHandover.confirm')}
      </EmployeeButton>
      {!open && feedback.unknownOutcome && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('errors.unknownOutcome')}
        </p>
      )}
      {open && (
        <Dialog
          presentation='sheet'
          title={translate('requestExtras.returnHandover.confirm')}
          hint={translate('requestExtras.returnHandover.hint')}
          onClose={() => {
            if (!mutation.isPending) setOpen(false)
          }}
        >
          {feedback.unknownOutcome && (
            <p role='status' className='text-sm text-warning-ink'>
              {translate('errors.unknownOutcome')}
            </p>
          )}
          <div className='flex justify-end gap-3'>
            <EmployeeButton disabled={mutation.isPending} onClick={() => setOpen(false)}>
              {translate('cancel')}
            </EmployeeButton>
            <EmployeeButton
              primary
              busy={mutation.isPending}
              disabled={feedback.blocked}
              onClick={() => {
                if (locked.current || mutation.isPending || feedback.blocked) return
                locked.current = true
                mutation.mutate(undefined, {
                  onSettled: () => {
                    locked.current = false
                  }
                })
              }}
            >
              {feedback.retrySeconds
                ? translate('retryAfter', { seconds: feedback.retrySeconds })
                : translate('confirm')}
            </EmployeeButton>
          </div>
        </Dialog>
      )}
    </>
  )
}
