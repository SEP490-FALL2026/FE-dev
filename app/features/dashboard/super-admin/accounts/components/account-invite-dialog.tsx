import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccountCandidatesList } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { useAppUserCreate } from '~/shared/api/generated/operations/app-users/app-user-create'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { directRoles, type DirectRole } from '../enums/direct-role'
import { accountWriteKeys } from '../hooks/use-super-admin-accounts'
import { useAccountWriteGuard } from '../hooks/use-account-write-guard'
import { useAdminSearch } from '../../shared/hooks/use-admin-search'

export function AccountInviteDialog({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('adminAccounts')
  const [search, setSearch] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [roles, setRoles] = useState<DirectRole[]>(['EMPLOYEE'])
  const [invalid, setInvalid] = useState(false)
  const debouncedSearch = useAdminSearch(search)
  const candidates = useAccountCandidatesList(
    { ...(debouncedSearch ? { search: debouncedSearch } : {}) },
    { query: { retry: false } }
  )
  const feedback = useAdminMutationFeedback(accountWriteKeys(), onClose)
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
      wide
      onSubmit={(event) => {
        event.preventDefault()
        if (mutation.isPending) return
        if (!employeeId) {
          setInvalid(true)
          return
        }
        if (guard.acquire())
          mutation.mutate({ data: { employeeId, ...(email.trim() ? { loginEmail: email.trim() } : {}), roles } })
      }}
    >
      <AdminField label={translate('employeeSearch')}>
        <input
          type='search'
          placeholder={translate('employeeSearchPlaceholder')}
          className={adminInputClass}
          value={search}
          maxLength={100}
          onChange={(event) => setSearch(event.target.value)}
        />
      </AdminField>
      <fieldset className='grid gap-2'>
        <legend className='mb-2 text-sm font-medium'>{translate('employee')}</legend>
        <AdminQueryState query={candidates}>
          {!candidates.data?.data?.items.length && <AdminEmpty />}
          {candidates.data?.data?.items.map((candidate) => (
            <label key={candidate.id} className='flex min-h-11 items-center gap-3 rounded-md border border-border p-3'>
              <input
                type='radio'
                name='candidate'
                checked={employeeId === candidate.id}
                onChange={() => {
                  setEmployeeId(candidate.id)
                  setEmail(candidate.workEmail ?? '')
                  setInvalid(false)
                }}
              />
              <span>
                {candidate.employeeCode} · {candidate.fullName}
                <span className='block text-xs text-muted-foreground'>{candidate.department ?? translate('none')}</span>
              </span>
            </label>
          ))}
        </AdminQueryState>
        <p className='text-xs text-muted-foreground'>{translate('candidateLimit')}</p>
        {invalid && (
          <p role='alert' className='text-sm text-danger'>
            {translate('selectEmployee')}
          </p>
        )}
      </fieldset>
      <AdminField label={translate('loginEmail')}>
        <input
          className={adminInputClass}
          type='email'
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </AdminField>
      <p className='text-xs text-muted-foreground'>{translate('emailHint')}</p>
      <fieldset>
        <legend className='mb-2 text-sm font-medium'>{translate('directRoles')}</legend>
        {directRoles.map((role) => (
          <label key={role} className='flex min-h-11 items-center gap-3'>
            <input
              type='checkbox'
              checked={roles.includes(role)}
              onChange={(event) =>
                setRoles((previous) =>
                  event.target.checked ? [...previous, role] : previous.filter((value) => value !== role)
                )
              }
            />
            {translate(`roles.${role}`)}
          </label>
        ))}
      </fieldset>
    </AdminFormDialog>
  )
}
