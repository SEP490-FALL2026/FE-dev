import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlanLineBodyDto } from '~/shared/api/generated/model/spend-submission/planLineBodyDto'
import type { SupplementBodyDto } from '~/shared/api/generated/model/spend-submission/supplementBodyDto'
import { accessRequestPlanLineSet } from '~/shared/api/generated/operations/spend-submission/access-request-plan-line-set'
import { accessRequestSupplementAdd } from '~/shared/api/generated/operations/spend-submission/access-request-supplement-add'
import {
  useAccessRequestSupplementList,
  getAccessRequestSupplementListQueryKey
} from '~/shared/api/generated/operations/spend-submission/access-request-supplement-list'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { parseEmployeeIds, resourceIdPattern } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { allocationFromForm, ManagerPlanAllocation } from './manager-plan-allocation'

export function ManagerSpendCorrections({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const [mode, setMode] = useState<'plan' | 'supplement' | null>(null)
  const paging = useManagerPage('supplementPage')
  const query = useAccessRequestSupplementList(id, { page: paging.page, pageSize: paging.pageSize })
  return (
    <ManagerSection title={translate('supplements')}>
      <div className='flex flex-wrap gap-3'>
        <ManagerButton onClick={() => setMode('plan')}>{translate('selectPlan')}</ManagerButton>
        <ManagerButton onClick={() => setMode('supplement')}>{translate('supplement')}</ManagerButton>
      </div>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError &&
        query.data?.data?.items.map((item) => (
          <p
            key={item.number}
            className='border-b border-border/40 py-3 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'
          >
            {item.reason}
          </p>
        ))}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      {mode && <CorrectionDialog id={id} mode={mode} onClose={() => setMode(null)} />}
    </ManagerSection>
  )
}
function CorrectionDialog({ id, mode, onClose }: { id: string; mode: 'plan' | 'supplement'; onClose: () => void }) {
  const { t: translate } = useTranslation('manager')
  const keys = [
    getAccessRequestGetQueryKey(id),
    getSpendQueueListQueryKey(),
    getAccessRequestSupplementListQueryKey(id)
  ]
  const plan = useManagerAction({
    mutationFn: (body: PlanLineBodyDto) => accessRequestPlanLineSet(id, body),
    invalidate: keys,
    onSuccess: onClose
  })
  const supplement = useManagerAction({
    mutationFn: (body: SupplementBodyDto) => accessRequestSupplementAdd(id, body),
    invalidate: keys,
    onSuccess: onClose
  })
  const action = mode === 'plan' ? plan : supplement
  return (
    <Dialog
      presentation={mode === 'plan' ? 'drawer' : 'sheet'}
      title={translate(mode === 'plan' ? 'selectPlan' : 'supplement')}
      hint={translate('confirmAction')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (action.blocked) return
            const form = new FormData(event.currentTarget)
            if (mode === 'plan') {
              const allocation = allocationFromForm(form)
              plan.mutate(allocation.offPlan ? { offPlan: true } : { planLine: allocation.planLine })
              return
            }
            const expectedSpendOn = String(form.get('expectedSpendOn') ?? '')
            const dropEmployeeIds = parseEmployeeIds(String(form.get('dropEmployeeIds') ?? ''))
            supplement.mutate({
              reason: String(form.get('reason')).trim(),
              ...(expectedSpendOn ? { expectedSpendOn } : {}),
              ...(dropEmployeeIds.length ? { dropEmployeeIds } : {})
            })
          }}
        >
          <fieldset disabled={action.blocked} className='space-y-4'>
            {mode === 'plan' ? (
              <ManagerPlanAllocation id={id} includeExpectedSpend={false} />
            ) : (
              <>
                <ManagerField label={translate('expectedSpend')}>
                  <input name='expectedSpendOn' type='date' className={managerInputClass} />
                </ManagerField>
                <ManagerField label={translate('dropEmployees')}>
                  <textarea
                    name='dropEmployeeIds'
                    className={managerInputClass}
                    onChange={(event) =>
                      event.target.setCustomValidity(
                        parseEmployeeIds(event.target.value).every((value) =>
                          new RegExp(`^${resourceIdPattern}$`).test(value)
                        )
                          ? ''
                          : translate('validation')
                      )
                    }
                  />
                </ManagerField>
                <ManagerField label={translate('reason')}>
                  <textarea name='reason' required maxLength={1000} className={managerInputClass} />
                </ManagerField>
              </>
            )}
          </fieldset>
          <ManagerActionState action={action} />
          <div className='flex justify-end'>
            <ManagerButton primary type='submit' busy={action.isPending} disabled={action.blocked}>
              {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
