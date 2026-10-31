import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useAccessRequestDraftList,
  getAccessRequestDraftListQueryKey
} from '~/shared/api/generated/operations/access-requests/access-request-draft-list'
import { useAccessRequestDraftDelete } from '~/shared/api/generated/operations/access-requests/access-request-draft-delete'
import { useAccessRequestDraftSubmit } from '~/shared/api/generated/operations/access-requests/access-request-draft-submit'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import {
  EmployeeButton,
  EmployeeField,
  EmployeeInput,
  EmployeeSection,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import type { EmployeeTabKey } from '../../enums'
import { uuidPattern } from '../../shared/employee-identifiers'
import { canSubmitEmployeeDraft } from '../../shared/enums/draft-kind'

export function EmployeeLiveRequestsView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime, formatNumber } = useDashboardFormat()
  const { page, pageSize, onPage } = useEmployeePage()
  const query = useAccessRequestDraftList({ page, pageSize })
  const [lookup, setLookup] = useState('')
  const [action, setAction] = useState<{ id: string; kind: 'submit' | 'delete' } | null>(null)
  const feedback = useEmployeeFeedback([getAccessRequestDraftListQueryKey()])
  const deletion = useAccessRequestDraftDelete({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async () => {
        await feedback.onSuccess()
        setAction(null)
      }
    }
  })
  const submission = useAccessRequestDraftSubmit({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async (response) => {
        await feedback.onSuccess()
        setAction(null)
        if (feedback.isActive() && response.data?.request.id)
          onSelectTab('request-detail', { id: response.data.request.id })
      }
    }
  })
  const busy = deletion.isPending || submission.isPending
  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>{translate('myRequests')}</h1>
        <EmployeeButton primary onClick={() => onSelectTab('create-request')}>
          {translate('create')}
        </EmployeeButton>
      </header>
      <EmployeeSection title={translate('lookup')}>
        <p className='max-w-3xl text-sm text-muted-foreground'>{translate('lookupHint')}</p>
        <form
          className='flex flex-wrap items-end gap-3'
          onSubmit={(event) => {
            event.preventDefault()
            onSelectTab('request-detail', { id: lookup.trim() })
          }}
        >
          <div className='min-w-0 flex-1'>
            <EmployeeField label={translate('requestCode')}>
              <EmployeeInput
                required
                pattern={uuidPattern}
                value={lookup}
                onChange={(event) => setLookup(event.target.value)}
              />
            </EmployeeField>
          </div>
          <EmployeeButton type='submit'>{translate('open')}</EmployeeButton>
        </form>
      </EmployeeSection>
      <EmployeeSection title={translate('drafts')}>
        <EmployeeQueryState query={query} empty={!query.data?.data?.items.length} />
        {!query.isError && (
          <ul className='divide-y divide-border/50'>
            {query.data?.data?.items.map((draft) => (
              <li key={draft.id} className='flex flex-wrap items-center justify-between gap-4 py-4'>
                <div className='min-w-0 space-y-2'>
                  <p className='max-w-full truncate font-mono text-xs' title={draft.id}>
                    {draft.id}
                  </p>
                  <EmployeeStatus value={draft.kind} />
                  <p className='max-w-full truncate text-xs text-muted-foreground' title={draft.planId}>
                    {translate('planId')}: {draft.planId}
                  </p>
                </div>
                <div className='space-y-2 text-right'>
                  <p className='font-mono text-xs tabular-nums'>{formatDateTime(draft.createdAt)}</p>
                  <p className='font-mono text-xs tabular-nums'>
                    {translate('beneficiary')}: {formatNumber(draft.beneficiaryCount)}
                  </p>
                  <details className='relative'>
                    <summary
                      className='min-h-11 cursor-pointer rounded-md border border-border px-4 py-2 text-center'
                      aria-label={translate('open')}
                    >
                      ···
                    </summary>
                    <div className='absolute right-0 z-10 grid min-w-44 gap-2 rounded-md border border-border bg-surface p-2 shadow-md'>
                      <EmployeeButton
                        disabled={busy || feedback.blocked || !canSubmitEmployeeDraft(draft.kind)}
                        onClick={() => setAction({ id: draft.id, kind: 'submit' })}
                      >
                        {translate('submitDraft')}
                      </EmployeeButton>
                      <EmployeeButton
                        disabled={busy || feedback.blocked}
                        onClick={() => setAction({ id: draft.id, kind: 'delete' })}
                      >
                        {translate('deleteDraft')}
                      </EmployeeButton>
                    </div>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        )}
        <EmployeePagination pagination={query.data?.data?.pagination} onPage={onPage} busy={query.isFetching} />
      </EmployeeSection>
      {action && (
        <Dialog
          title={translate('draftConfirm')}
          hint={translate(action.kind === 'delete' ? 'deleteHint' : 'submitDraftHint')}
          onClose={() => {
            if (!busy) setAction(null)
          }}
        >
          <p className='truncate font-mono text-xs' title={action.id}>
            {action.id}
          </p>
          <div className='mt-5 flex justify-end gap-3'>
            <EmployeeButton disabled={busy} onClick={() => setAction(null)}>
              {translate('cancel')}
            </EmployeeButton>
            <EmployeeButton
              primary
              busy={busy}
              disabled={feedback.blocked}
              onClick={() => {
                if (!busy) {
                  if (action.kind === 'delete') deletion.mutate({ id: action.id })
                  else submission.mutate({ id: action.id, data: {} })
                }
              }}
            >
              {feedback.retrySeconds
                ? translate('retryAfter', { seconds: feedback.retrySeconds })
                : translate('confirm')}
            </EmployeeButton>
          </div>
        </Dialog>
      )}
    </div>
  )
}
