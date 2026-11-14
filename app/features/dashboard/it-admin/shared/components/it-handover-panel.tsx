import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { QueryKey } from '@tanstack/react-query'
import { useItAdminList } from '~/shared/api/generated/operations/it-admins/it-admin-list'
import { useOffboardingCaseItAdminHandover } from '~/shared/api/generated/operations/it-admin-handover/offboarding-case-it-admin-handover'
import { useDepartmentTransferItAdminHandover } from '~/shared/api/generated/operations/it-admin-handover/department-transfer-it-admin-handover'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useItMutationFeedback } from '../hooks/use-it-mutation-feedback'
import { ItChoiceSelect } from './it-choice-select'
import { ItFormDialog, itButtonClass } from './it-form'
import { ItPagination } from './it-pagination'
import { ItQueryState } from './it-query-state'

export type ItHandoverSummary = {
  state: string
  subscriptions: number
  applications: number
  handedOver: { at: string; toItAdminEmployeeId: string; subscriptions: number; applications: number } | null
}

/** X-IT: the IT Admin who leaves or is transferred hands every subscription and application to one IT Admin. */
export function ItHandoverPanel({
  source,
  handover,
  leavingEmployeeId,
  canAct,
  invalidates
}: {
  source: { kind: 'offboarding' | 'transfer'; id: string }
  handover: ItHandoverSummary
  leavingEmployeeId: string
  canAct: boolean
  invalidates: readonly QueryKey[]
}) {
  const { t: translate } = useTranslation('itAdmin')
  const { formatDateTime } = useDashboardFormat()
  const [open, setOpen] = useState(false)
  const pending = handover.state === 'PENDING'
  return (
    <section className='space-y-2 rounded-lg border border-border bg-surface p-4 text-sm'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h3 className='font-semibold [text-wrap:balance]'>{translate('itHandover.title')}</h3>
        <span className={pending ? 'text-warning' : 'text-success-ink'}>
          {translate(`itHandover.states.${handover.state}`, { defaultValue: translate('itHandover.states.UNKNOWN') })}
        </span>
      </div>
      <p className='font-mono tabular-nums'>
        {translate('itHandover.remaining', {
          subscriptions: handover.subscriptions,
          applications: handover.applications
        })}
      </p>
      {handover.handedOver && (
        <p className='text-muted-foreground'>
          {translate('itHandover.done', {
            at: formatDateTime(handover.handedOver.at),
            subscriptions: handover.handedOver.subscriptions,
            applications: handover.handedOver.applications
          })}
        </p>
      )}
      <p className='text-muted-foreground [text-wrap:pretty]'>{translate('itHandover.hint')}</p>
      {pending && (
        <button type='button' className={itButtonClass} disabled={!canAct} onClick={() => setOpen(true)}>
          {translate('itHandover.action')}
        </button>
      )}
      {open && (
        <ItHandoverDialog
          source={source}
          leavingEmployeeId={leavingEmployeeId}
          invalidates={invalidates}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  )
}

function ItHandoverDialog({
  source,
  leavingEmployeeId,
  invalidates,
  onClose
}: {
  source: { kind: 'offboarding' | 'transfer'; id: string }
  leavingEmployeeId: string
  invalidates: readonly QueryKey[]
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itAdmin')
  const [page, setPage] = useState(1)
  const [target, setTarget] = useState('')
  const admins = useItAdminList({ page, pageSize: 20 })
  const feedback = useItMutationFeedback(invalidates, onClose)
  const offboarding = useOffboardingCaseItAdminHandover({ mutation: { ...feedback, retry: false } })
  const transfer = useDepartmentTransferItAdminHandover({ mutation: { ...feedback, retry: false } })
  const sending = offboarding.isPending || transfer.isPending
  const options = (admins.data?.data?.items ?? [])
    .filter((admin) => admin.employeeId !== leavingEmployeeId)
    .map((admin) => ({ value: admin.employeeId, label: `${admin.fullName} · ${admin.employeeCode}` }))
  return (
    <ItFormDialog
      title={translate('itHandover.action')}
      pending={sending}
      onClose={onClose}
      submitLabel={translate('itHandover.confirm')}
      submitDisabled={!target}
      onSubmit={(event) => {
        event.preventDefault()
        if (sending || !target) return
        const variables = { id: source.id, data: { toItAdminEmployeeId: target } }
        if (source.kind === 'offboarding') offboarding.mutate(variables)
        else transfer.mutate(variables)
      }}
    >
      <p className='text-sm text-muted-foreground [text-wrap:pretty]'>{translate('itHandover.dialogHint')}</p>
      <ItQueryState query={admins}>
        <ItChoiceSelect label={translate('itHandover.target')} value={target} options={options} onChange={setTarget} />
        <ItPagination
          page={page}
          pageSize={20}
          total={admins.data?.data?.pagination.totalItems ?? 0}
          onChange={setPage}
        />
      </ItQueryState>
    </ItFormDialog>
  )
}
