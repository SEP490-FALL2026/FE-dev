import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApprovalRoleList } from '~/shared/api/generated/operations/approval-roles/approval-role-list'
import { useApprovalRoleSet } from '~/shared/api/generated/operations/approval-roles/approval-role-set'
import { useSuperAdminTransfer } from '~/shared/api/generated/operations/super-admin-transfers/super-admin-transfer'
import type {
  AccountPageResponseDtoDataItemsItem,
  ApprovalRolesResponseDtoDataItemsItem
} from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminFormDialog, adminButtonClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { approvalRoles, type ApprovalRole } from '../enums/approval-role'
import { accountWriteKeys } from '../hooks/use-super-admin-accounts'
import { UsableAccountPicker } from './usable-account-picker'
import { useAccountWriteGuard } from '../hooks/use-account-write-guard'
import { useQueryClient } from '@tanstack/react-query'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'

function ResponsibilityDialog({ role, onClose }: { role: ApprovalRole | 'transfer'; onClose: () => void }) {
  const { t: translate } = useTranslation('adminAccounts')
  const [account, setAccount] = useState<AccountPageResponseDtoDataItemsItem | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const feedback = useAdminMutationFeedback(accountWriteKeys(), onClose)
  const guard = useAccountWriteGuard()
  const queryClient = useQueryClient()
  const options = {
    mutation: {
      ...feedback,
      retry: false as const,
      onError: async (error: unknown) => {
        guard.onError(error)
        await feedback.onError(error)
      },
      onSettled: guard.release
    }
  }
  const set = useApprovalRoleSet(options)
  const transfer = useSuperAdminTransfer({
    mutation: {
      ...options.mutation,
      onSuccess: async () => {
        await feedback.onSuccess()
        await queryClient
          .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
          .catch(() => undefined)
      }
    }
  })
  const pending = set.isPending || transfer.isPending
  return (
    <AdminFormDialog
      title={
        role === 'transfer'
          ? translate('transfer')
          : translate('setResponsibility', { role: translate(`duties.${role}`) })
      }
      onClose={onClose}
      pending={pending}
      submitLabel={guard.remaining ? translate('retryIn', { count: guard.remaining }) : translate('confirm')}
      submitDisabled={guard.remaining > 0}
      wide
      danger={role === 'transfer'}
      onSubmit={(event) => {
        event.preventDefault()
        if (pending) return
        if (!account?.employee || (role === 'transfer' && !confirmed)) {
          setInvalid(true)
          return
        }
        if (!guard.acquire()) return
        if (role === 'transfer') transfer.mutate({ data: { successorAppUserId: account.id } })
        else set.mutate({ role, data: { employeeId: account.employee.id } })
      }}
    >
      <UsableAccountPicker
        transfer={role === 'transfer'}
        selectedId={account?.id ?? ''}
        onSelect={(next) => {
          setAccount(next)
          setInvalid(false)
        }}
      />
      {account && (
        <p className='text-sm'>
          {translate('selectedAccount', { name: account.employee?.fullName ?? account.loginEmail })}
        </p>
      )}
      {role === 'transfer' && (
        <label className='flex min-h-11 items-start gap-3 rounded-md border border-danger/30 p-4 text-sm'>
          <input
            type='checkbox'
            required
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          {translate('transferConfirm')}
        </label>
      )}
      {invalid && (
        <p className='text-sm text-danger' role='alert'>
          {translate('selectEmployee')}
        </p>
      )}
    </AdminFormDialog>
  )
}

function ResponsibilityHistory({ item }: { item: ApprovalRolesResponseDtoDataItemsItem }) {
  const { t: translate } = useTranslation('adminAccounts')
  const { formatDate } = useDashboardFormat()
  return (
    <details>
      <summary className='min-h-11 cursor-pointer py-3 text-sm'>{translate('roleHistory')}</summary>
      {item.history.map((entry, index) => (
        <p key={`${entry.employeeId}-${entry.from}-${index}`} className='py-2 text-sm'>
          {entry.employeeCode} · {entry.fullName}
          <span className='block text-xs text-muted-foreground'>
            {formatDate(entry.from)} · {entry.until ? formatDate(entry.until) : translate('current')}
          </span>
        </p>
      ))}
      {!item.history.length && <p className='text-sm text-muted-foreground'>{translate('none')}</p>}
      {item.historyHasMore && <p className='text-xs text-muted-foreground'>{translate('historyLimited')}</p>}
    </details>
  )
}

export function RolesSubtabView() {
  const { t: translate } = useTranslation('adminAccounts')
  const { formatDate } = useDashboardFormat()
  const query = useApprovalRoleList({ query: { retry: false } })
  const [editing, setEditing] = useState<ApprovalRole | 'transfer' | null>(null)
  return (
    <div className='space-y-5'>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('derivedHint')}</p>
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length && <AdminEmpty />}
        <div className='grid gap-4 lg:grid-cols-3'>
          {query.data?.data?.items.map((item) => (
            <article className='rounded-lg border border-border bg-surface p-5' key={item.role}>
              <h2 className='font-semibold'>
                {approvalRoles.includes(item.role) ? translate(`duties.${item.role}`) : translate('unknown')}
              </h2>
              <p className='mt-3 text-sm'>
                {item.holder ? `${item.holder.employeeCode} · ${item.holder.fullName}` : translate('unassigned')}
              </p>
              {item.holder && (
                <p className='mt-1 text-xs text-muted-foreground'>
                  {translate('since', { date: formatDate(item.holder.since) })}
                </p>
              )}
              <button
                className={`${adminButtonClass} mt-4`}
                disabled={!approvalRoles.includes(item.role) || query.isFetching}
                onClick={() => setEditing(item.role)}
              >
                {translate('assign')}
              </button>
              <ResponsibilityHistory item={item} />
            </article>
          ))}
        </div>
      </AdminQueryState>
      <section className='flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-5'>
        <div>
          <h2 className='font-semibold'>{translate('transfer')}</h2>
          <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>{translate('transferHint')}</p>
        </div>
        <button className={adminButtonClass} onClick={() => setEditing('transfer')}>
          {translate('transfer')}
        </button>
      </section>
      {editing && <ResponsibilityDialog role={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
