import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
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
  EmployeeSection,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import type { EmployeeTabKey } from '../../enums'
import { canSubmitEmployeeDraft } from '../../shared/enums/draft-kind'

import { getMeAccessRequestListQueryKey } from '~/shared/api/generated/operations/me/me-access-request-list'
export function EmployeeDraftRequests({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime, formatNumber } = useDashboardFormat()
  const { page, pageSize, onPage } = useEmployeePage('draftsPage')
  const query = useAccessRequestDraftList({ page, pageSize })
  const [action, setAction] = useState<{ id: string; kind: 'submit' | 'delete' } | null>(null)
  const feedback = useEmployeeFeedback([getAccessRequestDraftListQueryKey(), getMeAccessRequestListQueryKey()])
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
    <>
      <EmployeeSection title={translate('drafts')}>
        <EmployeeQueryState
          query={query}
          empty={!query.data?.data?.items.length}
          emptyTitle={translate('redesign.noDrafts')}
          emptyDescription={translate('redesign.noDraftsHint')}
        />
        {!query.isError && (
          <EmployeeDataTable
            label={translate('drafts')}
            actionLabel={translate('redesign.actions')}
            items={query.data?.data?.items ?? []}
            rowKey={(draft) => draft.id}
            columns={[
              {
                key: 'draft',
                label: translate('redesign.draftId'),
                render: (draft) => (
                  <div>
                    <p className='truncate font-mono text-xs' title={draft.id}>
                      {draft.id}
                    </p>
                    <div className='mt-2'>
                      <EmployeeStatus value={draft.kind} />
                    </div>
                    <p className='mt-2 truncate text-xs text-muted-foreground' title={draft.planId}>
                      {translate('planId')}: {draft.planId}
                    </p>
                  </div>
                )
              },
              {
                key: 'beneficiaries',
                label: translate('redesign.peopleCount'),
                align: 'right',
                render: (draft) => formatNumber(draft.beneficiaryCount)
              },
              {
                key: 'date',
                label: translate('redesign.createdAt'),
                align: 'right',
                render: (draft) => formatDateTime(draft.createdAt)
              }
            ]}
            renderAction={(draft) => (
              <details className='relative inline-block'>
                <summary
                  className='grid size-11 cursor-pointer list-none place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden'
                  aria-label={translate('redesign.actions')}
                >
                  <MoreHorizontal aria-hidden strokeWidth={1.5} className='mx-auto size-5' />
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
            )}
          />
        )}
        <EmployeePagination pagination={query.data?.data?.pagination} onPage={onPage} busy={query.isFetching} />
      </EmployeeSection>
      {action && (
        <Dialog
          presentation='sheet'
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
    </>
  )
}
