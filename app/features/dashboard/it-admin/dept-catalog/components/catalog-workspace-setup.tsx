import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useItAdminList } from '~/shared/api/generated/operations/it-admins/it-admin-list'
import { planGet, usePlanGet, getPlanGetQueryKey } from '~/shared/api/generated/operations/plans/plan-get'
import { planWorkspaceProfileSet } from '~/shared/api/generated/operations/plans/plan-workspace-profile-set'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'

export function CatalogWorkspaceSetup({ planId, onClose }: { planId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const [owner, setOwner] = useState('')
  const [admin, setAdmin] = useState('')
  const [page, setPage] = useState(1)
  const plan = usePlanGet(planId, { query: { staleTime: 0, refetchOnMount: 'always' } })
  const admins = useItAdminList({ page, pageSize: 100 })
  const feedback = useItMutationFeedback([getPlanGetQueryKey(planId)], onClose)
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const latest = await planGet(planId)
      if (!latest.data || latest.data.workspaceProfile !== null)
        throw new Error('Workspace already exists or is unavailable')
      return planWorkspaceProfileSet(planId, {
        primaryOwnerEmployeeId: owner,
        members: [
          { employeeId: owner, role: 'OWNER' },
          { employeeId: admin, role: 'ADMIN' }
        ],
        ...(email ? { ownerAccountEmail: email } : {})
      })
    },
    retry: false,
    ...feedback
  })
  const options =
    admins.data?.data?.items.map((item) => ({
      value: item.employeeId,
      label: `${item.fullName} · ${item.employeeCode}`
    })) ?? []
  const ready =
    plan.isSuccess &&
    !plan.isFetching &&
    !!plan.data?.data &&
    plan.data.data.workspaceProfile === null &&
    owner &&
    admin &&
    owner !== admin &&
    !admins.isFetching &&
    !admins.isError
  return (
    <ItQueryState query={plan}>
      {plan.data?.data?.workspaceProfile ? (
        <section className='space-y-4'>
          <p>{translate('setup.workspaceExists')}</p>
          <button type='button' className='underline' onClick={onClose}>
            {translate('back')}
          </button>
        </section>
      ) : (
        <ItFormDialog
          wide
          title={translate('setup.workspace')}
          onClose={onClose}
          pending={mutation.isPending}
          submitDisabled={!ready}
          onSubmit={(event) => {
            event.preventDefault()
            if (ready && !mutation.isPending)
              mutation.mutate(String(new FormData(event.currentTarget).get('email') ?? '').trim())
          }}
        >
          <p className='text-sm text-muted-foreground'>{translate('setup.workspaceHint')}</p>
          <ItQueryState query={admins}>
            <ItChoiceSelect
              label={translate('setup.primaryOwner')}
              required
              value={owner}
              options={options}
              onChange={setOwner}
            />
            <ItChoiceSelect
              label={translate('setup.secondAdmin')}
              required
              value={admin}
              options={options}
              onChange={setAdmin}
            />
            {admins.data?.data && admins.data.data.pagination.totalItems > 100 && (
              <div className='flex items-center gap-3'>
                <button type='button' className='underline' disabled={page === 1} onClick={() => setPage(page - 1)}>
                  {translate('setup.previous')}
                </button>
                <span>{page}</span>
                <button
                  type='button'
                  className='underline'
                  disabled={page * 100 >= admins.data.data.pagination.totalItems}
                  onClick={() => setPage(page + 1)}
                >
                  {translate('setup.next')}
                </button>
              </div>
            )}
          </ItQueryState>
          {owner && admin && owner === admin && (
            <p className='text-sm text-danger'>{translate('setup.distinctAdmins')}</p>
          )}
          <ItField label={translate('setup.ownerEmail')}>
            <input
              placeholder={translatePlaceholder('workspaceEmail')}
              name='email'
              type='email'
              maxLength={320}
              className={itInputClass}
            />
          </ItField>
        </ItFormDialog>
      )}
    </ItQueryState>
  )
}
