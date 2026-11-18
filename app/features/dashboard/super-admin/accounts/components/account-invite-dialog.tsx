import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccountCandidatesList } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { useAppUserCreate } from '~/shared/api/generated/operations/app-users/app-user-create'
import { AdminField, AdminFormDialog } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminSelect } from '../../shared/components/admin-select'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { directRoles, type DirectRole } from '../enums/direct-role'
import { accountWriteKeys } from '../hooks/use-super-admin-accounts'
import { useAccountWriteGuard } from '../hooks/use-account-write-guard'
import { useAdminSearch } from '../../shared/hooks/use-admin-search'

export function AccountInviteDialog({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('adminAccounts')
  const [search, setSearch] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [employeeLabel, setEmployeeLabel] = useState('')
  const [role, setRole] = useState<DirectRole>('EMPLOYEE')
  const [invalid, setInvalid] = useState(false)
  const debouncedSearch = useAdminSearch(search)
  const candidates = useAccountCandidatesList(
    { ...(debouncedSearch ? { search: debouncedSearch } : {}) },
    { query: { retry: false } }
  )
  const feedback = useAdminMutationFeedback(accountWriteKeys(undefined, employeeId), onClose)
  const guard = useAccountWriteGuard()
  const mutation = useAppUserCreate({
    mutation: {
      ...feedback,
      retry: false,
      onError: async (error) => {
        guard.onError(error)
        await feedback.onError(error)
      },
      onSettled: guard.release
    }
  })
  return (
    <AdminFormDialog
      title={translate('invite')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={guard.remaining ? translate('retryIn', { count: guard.remaining }) : translate('inviteSubmit')}
      submitDisabled={guard.remaining > 0}
      onSubmit={(event) => {
        event.preventDefault()
        if (mutation.isPending) return
        if (!employeeId) {
          setInvalid(true)
          return
        }
        if (guard.acquire()) mutation.mutate({ data: { employeeId, role } })
      }}
    >
      <AdminField
        label={translate('employee')}
        required
        description={translate('employeeHelp')}
        error={invalid ? translate('selectEmployee') : undefined}
      >
        <AdminSelect
          required
          value={employeeId}
          invalid={invalid}
          onChange={(next, option) => {
            setEmployeeId(next)
            setEmployeeLabel(option?.label ?? '')
            setInvalid(false)
          }}
          onSearchChange={setSearch}
          selectedLabel={employeeLabel}
          loading={candidates.isFetching}
          options={(candidates.data?.data?.items ?? []).map((candidate) => ({
            value: candidate.id,
            label: candidate.fullName,
            description: [candidate.employeeCode, candidate.department].filter(Boolean).join(' · ')
          }))}
          placeholder={translate('ui.pickCandidate')}
          emptyText={translate('ui.noCandidates')}
        />
      </AdminField>
      {candidates.isError && <AdminQueryState query={candidates}>{null}</AdminQueryState>}
      <p className='text-xs text-muted-foreground'>{translate('emailFromPersonnel')}</p>
      <fieldset className='grid gap-2'>
        <legend className='mb-1 text-sm font-medium'>{translate('role')}</legend>
        <p className='text-xs text-muted-foreground'>{translate('inviteRoleHelp')}</p>
        <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>{translate('spendingApproverInviteHelp')}</p>
        {directRoles
          .filter((value) => value !== 'SPENDING_APPROVER')
          .map((value) => (
            <label
              key={value}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors duration-150 ${role === value ? 'border-primary/40 bg-primary-soft text-primary-ink' : 'border-border hover:bg-surface-subtle'}`}
            >
              <input
                type='radio'
                name='role'
                className='size-4 accent-primary'
                checked={role === value}
                onChange={() => setRole(value)}
              />
              {translate(`roles.${value}`)}
            </label>
          ))}
      </fieldset>
    </AdminFormDialog>
  )
}
