import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { accessRequestPreview } from '~/shared/api/generated/operations/access-requests/access-request-preview'
import { accessRequestSubmit } from '~/shared/api/generated/operations/access-requests/access-request-submit'
import { getMeAccessRequestListQueryKey } from '~/shared/api/generated/operations/me/me-access-request-list'
import { getMeDepartmentTransferGetQueryKey } from '~/shared/api/generated/operations/me/me-department-transfer-get'
import { getManagerDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { getMeSoftwareRightListQueryKey } from '~/shared/api/generated/operations/me/me-software-right-list'
import { ManagerCatalogPicker, type ManagerCatalogPlan } from '../../shared/components/manager-catalog-picker'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerMoney,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { REQUEST_LIMIT_EXEMPTION } from '~/entities/request/enums/request-limit-exemption'
import { REQUEST_WAITING_REASON } from '~/entities/request/enums/request-waiting-reason'

export function ManagerPersonalRequest({ onOpen }: { onOpen: (id: string) => void }) {
  const { t } = useTranslation('requestFlow')
  const { t: manager } = useTranslation('manager')
  const [plan, setPlan] = useState<ManagerCatalogPlan | null>(null)
  const [reason, setReason] = useState('')
  const [endDate, setEndDate] = useState('')
  const [manyReason, setManyReason] = useState('')
  const fingerprint = `${plan?.id ?? ''}:${endDate}`
  const preview = useMutation({
    mutationFn: async () => ({
      response: await accessRequestPreview({ planId: plan!.id, ...(endDate ? { expectedEndDate: endDate } : {}) }),
      fingerprint
    }),
    retry: false
  })
  const checked =
    !preview.isError && preview.data?.fingerprint === fingerprint ? preview.data.response.data?.preview : null
  const action = useManagerAction({
    mutationFn: async () => {
      if (!plan || !checked?.canSubmit) throw new Error('Preview required')
      const response = await accessRequestSubmit({
        planId: plan.id,
        businessReason: reason.trim(),
        ...(endDate ? { expectedEndDate: endDate } : {}),
        ...(manyReason.trim() ? { manyPaidSoftwareReason: manyReason.trim() } : {})
      })
      if (!response.data?.request.id) throw new Error('Missing request result')
      return response.data.request.id
    },
    invalidate: [
      getMeAccessRequestListQueryKey(),
      getMeDepartmentTransferGetQueryKey(),
      getMeSoftwareRightListQueryKey(),
      getManagerDashboardGetQueryKey()
    ],
    onSuccess: onOpen
  })
  const busy = action.blocked || preview.isPending
  return (
    <ManagerSection title={t('departmentSoftware.personalRequest')}>
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-5'
          onSubmit={(event) => {
            event.preventDefault()
            if (!busy && reason.trim() && plan?.canSubmit && checked?.canSubmit) action.mutate()
          }}
        >
          <fieldset disabled={busy} className='space-y-4'>
            <ManagerCatalogPicker
              value={plan}
              onChange={setPlan}
              disabled={busy}
              invalid={action.fields.includes('planId')}
            />
            <div className='grid items-start gap-4 sm:grid-cols-2'>
              <ManagerField label={t('endDate')}>
                <input
                  name='expectedEndDate'
                  type='date'
                  className={managerInputClass}
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  required={checked?.termRequired}
                  max={checked?.maxEndDate}
                />
              </ManagerField>
            </div>
            <ManagerField label={manager('reason')}>
              <textarea
                name='businessReason'
                required
                maxLength={1000}
                rows={3}
                className={managerInputClass}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </ManagerField>
            {checked?.limits.reasonRequired && (
              <ManagerField label={t('manyReason')}>
                <textarea
                  name='manyPaidSoftwareReason'
                  required
                  maxLength={1000}
                  rows={3}
                  className={managerInputClass}
                  value={manyReason}
                  onChange={(event) => setManyReason(event.target.value)}
                />
              </ManagerField>
            )}
          </fieldset>
          {preview.isError && (
            <ManagerQueryState query={{ ...preview, isFetching: preview.isPending, refetch: () => preview.mutate() }} />
          )}
          {checked && (
            <div className='space-y-3 border-t border-border/60 pt-4'>
              <div className='flex flex-wrap justify-between gap-3 text-sm'>
                <span>{t('departmentSoftware.estimate')}</span>
                <ManagerMoney money={checked.costEstimate?.estimatedCost ?? checked.pricing.amount} />
              </div>
              {checked.limitExemption === REQUEST_LIMIT_EXEMPTION.TRANSFER_GRACE && (
                <p className='text-sm text-primary-ink'>{t('personnel.exemption')}</p>
              )}
              {!checked.canSubmit && (
                <p role='status' className='text-sm text-warning-ink'>
                  {t(checked.limits.refusal ?? 'requestGuard', { defaultValue: t('requestGuard') })}
                </p>
              )}
              <ol className='space-y-2 text-sm'>
                {checked.chain.map((step) => (
                  <li key={step.sequence} className='flex flex-wrap justify-between gap-3'>
                    <span>{t(step.kind, { defaultValue: t('unknown') })}</span>
                    <span>
                      {step.assignee?.fullName ??
                        (step.waitingReason === REQUEST_WAITING_REASON.NO_DEPARTMENT_HEAD
                          ? t('personnel.waitingHead')
                          : manager('notReported'))}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <ManagerActionState action={action} />
          <div className='flex flex-wrap justify-end gap-3 border-t border-border/60 pt-4'>
            {checked?.canSubmit ? (
              <ManagerButton
                primary
                type='submit'
                busy={action.isPending}
                disabled={
                  busy || !plan?.canSubmit || !reason.trim() || (checked.limits.reasonRequired && !manyReason.trim())
                }
              >
                {manager('submit')}
              </ManagerButton>
            ) : (
              <ManagerButton
                primary
                busy={preview.isPending}
                disabled={busy || !plan || !reason.trim()}
                onClick={(event) => {
                  if (event.currentTarget.form?.reportValidity()) preview.mutate()
                }}
              >
                {t('departmentSoftware.preview')}
              </ManagerButton>
            )}
          </div>
        </form>
      </ManagerFormErrors>
    </ManagerSection>
  )
}
