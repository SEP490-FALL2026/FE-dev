import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { departmentSoftwareProposalCreate } from '~/shared/api/generated/operations/department-software-proposals/department-software-proposal-create'
import { getDepartmentSoftwareProposalListQueryKey } from '~/shared/api/generated/operations/department-software-proposals/department-software-proposal-list'
import { getDepartmentSoftwareListQueryKey } from '~/shared/api/generated/operations/department-software-list/department-software-list'
import { getMeDepartmentSoftwareListQueryKey } from '~/shared/api/generated/operations/department-software-list/me-department-software-list'
import type { DepartmentSoftwareProposalBodyDto } from '~/shared/api/generated/model/department-software-proposals/departmentSoftwareProposalBodyDto'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { Dialog } from '../../../dashboard-ui'
import { ManagerCatalogApplication } from '../../shared/components/manager-catalog-application'
import { ManagerCatalogPlans } from '../../shared/components/manager-catalog-plans'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'

export function ManagerSoftwareProposalForm({ departmentId, onClose }: { departmentId: string; onClose: () => void }) {
  const { t } = useTranslation('requestFlow')
  const { t: manager } = useTranslation('manager')
  const [application, setApplication] = useState<WorkspaceChoice | null>(null)
  const [plan, setPlan] = useState<RequestablePlanPageResponseDtoDataItemsItem | null>(null)
  const [reason, setReason] = useState('')
  const action = useManagerAction({
    mutationFn: async (body: DepartmentSoftwareProposalBodyDto) => {
      const response = await departmentSoftwareProposalCreate(body)
      if (!response.data?.proposal) throw new Error('Missing proposal result')
      return response
    },
    invalidate: [
      getDepartmentSoftwareProposalListQueryKey(),
      getDepartmentSoftwareListQueryKey(departmentId),
      getMeDepartmentSoftwareListQueryKey()
    ],
    onSuccess: onClose
  })
  return (
    <Dialog
      presentation='sheet'
      title={t('departmentSoftware.propose')}
      hint={t('departmentSoftware.proposalHint')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (!application || !reason.trim() || action.blocked) return
            action.mutate({
              applicationId: application.value,
              ...(plan ? { planId: plan.id } : {}),
              reason: reason.trim()
            })
          }}
        >
          <fieldset disabled={action.blocked} className='space-y-4'>
            <div className='grid items-start gap-4 sm:grid-cols-2'>
              <ManagerCatalogApplication
                value={application}
                disabled={action.blocked}
                onChange={(choice) => {
                  setApplication(choice)
                  setPlan(null)
                }}
              />
              <ManagerCatalogPlans
                key={application?.value ?? 'none'}
                applicationId={application?.value ?? ''}
                value={plan}
                onChange={setPlan}
                disabled={action.blocked || !application}
                guidanceOnly
              />
            </div>
            <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground'>
              <p className='max-w-prose'>{t('departmentSoftware.optionalPlan')}</p>
              {plan && <ManagerButton onClick={() => setPlan(null)}>{t('departmentSoftware.allPlans')}</ManagerButton>}
            </div>
            <ManagerField label={t('departmentSoftware.reason')}>
              <textarea
                required
                name='reason'
                maxLength={500}
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className={managerInputClass}
              />
            </ManagerField>
          </fieldset>
          <ManagerActionState action={action} />
          <div className='flex flex-wrap justify-end gap-3 border-t border-border/60 pt-4'>
            <ManagerButton disabled={action.isPending} onClick={onClose}>
              {manager('cancel')}
            </ManagerButton>
            <ManagerButton
              primary
              type='submit'
              busy={action.isPending}
              disabled={action.blocked || !application || !reason.trim()}
            >
              {action.retrySeconds
                ? manager('retryAfter', { seconds: action.retrySeconds })
                : t('departmentSoftware.send')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
