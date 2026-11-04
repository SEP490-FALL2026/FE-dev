import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ServiceAccountSubmitBodyDto } from '~/shared/api/generated/model/access-requests/serviceAccountSubmitBodyDto'
import { accessRequestServiceAccountSubmit } from '~/shared/api/generated/operations/access-requests/access-request-service-account-submit'
import { getMeAccessRequestListQueryKey } from '~/shared/api/generated/operations/me/me-access-request-list'
import { getEmployeeDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/employee-dashboard-get'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import {
  EmployeeButton,
  EmployeeField,
  EmployeeFormErrors,
  EmployeeInput,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { useEmployeeCatalogSelection } from '../hooks/use-employee-catalog-selection'
import { supportsServiceAccount } from '../enums/service-provisioning'
import { EmployeeCatalogPicker } from './employee-catalog-picker'
import { EmployeeCatalogPlanDetails } from './employee-catalog-plan-details'

export function EmployeeServiceAccountForm({
  onCreated,
  onDismiss
}: {
  onCreated: (id: string) => void
  onDismiss: () => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate, formatNumber } = useDashboardFormat()
  const selection = useEmployeeCatalogSelection()
  const [confirmation, setConfirmation] = useState<ServiceAccountSubmitBodyDto | null>(null)
  const [invalid, setInvalid] = useState<string[]>([])
  const locked = useRef(false)
  const feedback = useEmployeeFeedback([getMeAccessRequestListQueryKey(), getEmployeeDashboardGetQueryKey()])
  const submit = useMutation({
    mutationFn: (body: ServiceAccountSubmitBodyDto) => accessRequestServiceAccountSubmit(body),
    retry: false,
    onSuccess: async (result) => {
      const id = result.data?.request.id
      if (!id) {
        feedback.markUnknownOutcome()
        return
      }
      await feedback.onSuccess()
      if (feedback.isActive()) {
        setConfirmation(null)
        onCreated(id)
      }
    },
    onError: feedback.onError
  })
  const supported = !!selection.details && supportsServiceAccount(selection.details.provisioningType)
  const canSend = selection.canSubmit && supported && !feedback.blocked && !submit.isPending
  return (
    <Dialog
      presentation='drawer'
      title={translate('requestExtras.serviceAccount.title')}
      hint={translate('requestExtras.serviceAccount.hint')}
      onClose={() => {
        if (!submit.isPending && !confirmation) onDismiss()
      }}
    >
      <EmployeeFormErrors fields={[...feedback.invalidFields, ...invalid]}>
        <form
          className='space-y-5'
          onChange={() => {
            setInvalid([])
            setConfirmation(null)
          }}
          onSubmit={(event) => {
            event.preventDefault()
            if (!canSend || !selection.plan || !event.currentTarget.reportValidity()) return
            const fields = new FormData(event.currentTarget)
            const read = (name: string) => String(fields.get(name) ?? '').trim()
            const missing = ['purpose', 'expectedIdentifier', 'businessReason'].filter((key) => !read(key))
            setInvalid(missing)
            if (missing.length) return
            setConfirmation({
              planId: selection.plan.id,
              purpose: read('purpose'),
              expectedIdentifier: read('expectedIdentifier'),
              businessReason: read('businessReason'),
              termMonths: Number(read('termMonths')),
              ...(read('expectedSpendOn') ? { expectedSpendOn: read('expectedSpendOn') } : {})
            })
          }}
        >
          <fieldset disabled={submit.isPending || feedback.blocked} className='space-y-5'>
            <EmployeeCatalogPicker
              value={selection.plan}
              onChange={(plan) => {
                selection.setPlan(plan)
                setConfirmation(null)
              }}
              disabled={submit.isPending || feedback.blocked}
              invalid={feedback.invalidFields.includes('planId')}
              allowDraft={false}
            />
            <EmployeeCatalogPlanDetails selection={selection} allowDraft={false} />
            {selection.ready && !supported && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('requestExtras.serviceAccount.unsupported')}
              </p>
            )}
            <div className='grid gap-5 sm:grid-cols-2'>
              <EmployeeField label={translate('requestExtras.serviceAccount.identifier')}>
                <EmployeeInput name='expectedIdentifier' required maxLength={254} autoComplete='off' />
              </EmployeeField>
              <EmployeeField label={translate('term')}>
                <EmployeeInput type='number' name='termMonths' required min={1} max={120} defaultValue={1} />
              </EmployeeField>
              {selection.details?.costsMoney && (
                <EmployeeField label={translate('spendOn')}>
                  <EmployeeInput type='date' name='expectedSpendOn' />
                </EmployeeField>
              )}
            </div>
            <EmployeeField label={translate('requestExtras.serviceAccount.purpose')}>
              <textarea className={employeeInputClass} name='purpose' required maxLength={1000} rows={3} />
            </EmployeeField>
            <EmployeeField label={translate('reason')}>
              <textarea className={employeeInputClass} name='businessReason' required maxLength={1000} rows={3} />
            </EmployeeField>
          </fieldset>
          {feedback.unknownOutcome && (
            <p role='status' className='text-sm text-warning-ink'>
              {translate('errors.unknownOutcome')}
            </p>
          )}
          <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-surface pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
            <EmployeeButton primary type='submit' disabled={!canSend}>
              {feedback.retrySeconds
                ? translate('retryAfter', { seconds: feedback.retrySeconds })
                : translate('requestExtras.serviceAccount.review')}
            </EmployeeButton>
          </div>
        </form>
      </EmployeeFormErrors>
      {confirmation && (
        <Dialog
          presentation='sheet'
          title={translate('requestExtras.serviceAccount.confirm')}
          hint={translate('requestExtras.serviceAccount.hint')}
          onClose={() => {
            if (!submit.isPending) setConfirmation(null)
          }}
        >
          <dl className='space-y-3 text-sm'>
            <div>
              <dt className='text-muted-foreground'>{translate('plan')}</dt>
              <dd>
                {selection.plan?.application.name} · {selection.plan?.name}
              </dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('requestExtras.serviceAccount.identifier')}</dt>
              <dd className='break-words'>{confirmation.expectedIdentifier}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('requestExtras.serviceAccount.purpose')}</dt>
              <dd className='whitespace-pre-wrap break-words'>{confirmation.purpose}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('reason')}</dt>
              <dd className='whitespace-pre-wrap break-words'>{confirmation.businessReason}</dd>
            </div>
            <div className='text-right'>
              <dt className='text-muted-foreground'>{translate('term')}</dt>
              <dd className='font-mono tabular-nums'>{formatNumber(confirmation.termMonths)}</dd>
            </div>
            {confirmation.expectedSpendOn && (
              <div className='text-right'>
                <dt className='text-muted-foreground'>{translate('spendOn')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(confirmation.expectedSpendOn)}</dd>
              </div>
            )}
          </dl>
          {feedback.unknownOutcome && (
            <p role='status' className='text-sm text-warning-ink'>
              {translate('errors.unknownOutcome')}
            </p>
          )}
          <div className='mt-5 flex justify-end gap-3'>
            <EmployeeButton disabled={submit.isPending} onClick={() => setConfirmation(null)}>
              {translate('cancel')}
            </EmployeeButton>
            <EmployeeButton
              primary
              busy={submit.isPending}
              disabled={!canSend || selection.plan?.id !== confirmation.planId}
              onClick={() => {
                if (!canSend || locked.current || selection.plan?.id !== confirmation.planId) return
                locked.current = true
                submit.mutate(confirmation, {
                  onSettled: () => {
                    locked.current = false
                  }
                })
              }}
            >
              {feedback.retrySeconds
                ? translate('retryAfter', { seconds: feedback.retrySeconds })
                : translate('submit')}
            </EmployeeButton>
          </div>
        </Dialog>
      )}
    </Dialog>
  )
}
