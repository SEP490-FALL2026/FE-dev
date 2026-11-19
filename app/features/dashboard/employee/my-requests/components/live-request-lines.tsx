import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useAccessRequestLineList,
  getAccessRequestLineListQueryKey
} from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { useAccessRequestLineWithdraw } from '~/shared/api/generated/operations/group-requests/access-request-line-withdraw'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { Dialog } from '../../../dashboard-ui'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import {
  EmployeeButton,
  EmployeeField,
  EmployeeInput,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { canOfferLineWithdrawal } from '../enums/request-actions'

export function LiveRequestLines({ id, isRequester }: { id: string; isRequester: boolean }) {
  const { t: translate } = useTranslation('employee')
  const { page, pageSize, onPage } = useEmployeePage('linesPage')
  const query = useAccessRequestLineList(id, { page, pageSize })
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null)
  const [reason, setReason] = useState('')
  const feedback = useEmployeeFeedback([
    getAccessRequestLineListQueryKey(id),
    getAccessRequestGetQueryKey(id),
    getAccessRequestTimingsGetQueryKey(id)
  ])
  const mutation = useAccessRequestLineWithdraw({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async () => {
        await feedback.onSuccess()
        setSelected(null)
      }
    }
  })
  return (
    <section className='space-y-3 border-t border-border/60 pt-4'>
      <h2 className='font-semibold'>{translate('members')}</h2>
      <EmployeeQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError &&
        query.data?.data?.items.map((line) => (
          <div key={line.employee.employeeId} className='flex flex-wrap items-center justify-between gap-2 py-2'>
            <span className='truncate text-sm' title={line.employee.fullName}>
              {line.employee.fullName}
            </span>
            <EmployeeStatus value={line.state} />
            {isRequester && canOfferLineWithdrawal(line.state) && (
              <EmployeeButton
                disabled={mutation.isPending || feedback.blocked}
                onClick={() => {
                  setReason('')
                  setSelected({ id: line.employee.employeeId, name: line.employee.fullName })
                }}
              >
                {translate('withdraw')}
              </EmployeeButton>
            )}
          </div>
        ))}
      <EmployeePagination pagination={query.data?.data?.pagination} onPage={onPage} busy={query.isFetching} />
      {selected && (
        <Dialog
          presentation='sheet'
          title={translate('withdrawConfirm')}
          hint={selected.name}
          onClose={() => {
            if (!mutation.isPending) setSelected(null)
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!mutation.isPending && !feedback.blocked)
                mutation.mutate({ id, employeeId: selected.id, data: reason.trim() ? { reason: reason.trim() } : {} })
            }}
          >
            <EmployeeField label={translate('reason')}>
              <EmployeeInput
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={1000}
                disabled={mutation.isPending}
              />
            </EmployeeField>
            <div className='mt-5 flex justify-end gap-3'>
              <EmployeeButton disabled={mutation.isPending} onClick={() => setSelected(null)}>
                {translate('cancel')}
              </EmployeeButton>
              <EmployeeButton primary type='submit' busy={mutation.isPending} disabled={feedback.blocked}>
                {feedback.retrySeconds
                  ? translate('retryAfter', { seconds: feedback.retrySeconds })
                  : translate('withdraw')}
              </EmployeeButton>
            </div>
          </form>
        </Dialog>
      )}
    </section>
  )
}
