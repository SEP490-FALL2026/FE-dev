import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDepartmentSoftwareList } from '~/shared/api/generated/operations/department-software-list/department-software-list'
import { useDepartmentSoftwareProposalList } from '~/shared/api/generated/operations/department-software-proposals/department-software-proposal-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import {
  ManagerButton,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { ManagerSoftwareProposalForm } from '../components/manager-software-proposal-form'
import { PROPOSAL_STATE, proposalStateLabels } from '../enums/proposal-status'

export function ManagerDepartmentSoftware({
  departmentId,
  proposals = false
}: {
  departmentId: string
  proposals?: boolean
}) {
  const { t } = useTranslation('requestFlow')
  const { formatDate } = useWorkspaceFormat()
  const [params, setParams] = useSearchParams()
  const [creating, setCreating] = useState(false)
  const pageKey = proposals ? 'proposalPage' : 'softwarePage'
  const pageValue = Number(params.get(pageKey))
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1
  const state = Object.values(PROPOSAL_STATE).find((value) => value === params.get('softwareProposalState'))
  const list = useDepartmentSoftwareList(departmentId, { page, pageSize: 20 }, { query: { enabled: !proposals } })
  const proposalList = useDepartmentSoftwareProposalList(
    { departmentId, page, pageSize: 20, ...(state ? { state } : {}) },
    { query: { enabled: proposals } }
  )
  const data = !list.isError ? list.data?.data : null
  const proposed = !proposalList.isError ? proposalList.data?.data : null
  const changePage = (value: number) => {
    const next = new URLSearchParams(params)
    next.set(pageKey, String(value))
    setParams(next)
  }
  return (
    <>
      <ManagerSection
        title={t(proposals ? 'departmentSoftware.proposals' : 'departmentSoftware.department')}
        description={t('departmentSoftware.hint')}
        action={
          <ManagerButton primary onClick={() => setCreating(true)}>
            <Plus aria-hidden strokeWidth={1.5} className='size-4' />
            {t('departmentSoftware.propose')}
          </ManagerButton>
        }
      >
        {proposals ? (
          <>
            <label className='grid max-w-xs gap-2 text-sm font-medium'>
              {t('departmentSoftware.state')}
              <select
                className={managerInputClass}
                value={state ?? ''}
                onChange={(event) => {
                  const next = new URLSearchParams(params)
                  next.set('softwareProposalState', event.target.value)
                  next.delete('proposalPage')
                  setParams(next)
                }}
              >
                <option value=''>{t('departmentSoftware.allStates')}</option>
                {Object.values(PROPOSAL_STATE).map((value) => (
                  <option key={value} value={value}>
                    {t(`departmentSoftware.${proposalStateLabels[value]}`)}
                  </option>
                ))}
              </select>
            </label>
            <ManagerQueryState
              query={proposalList}
              empty={!proposed?.items.length}
              emptyTitle={t('departmentSoftware.noProposals')}
            />
            {proposed && (
              <>
                <ManagerDataTable
                  label={t('departmentSoftware.proposals')}
                  items={proposed.items}
                  rowKey={(item) => item.proposalId}
                  columns={[
                    {
                      key: 'application',
                      label: t('departmentSoftware.department'),
                      render: (item) => (
                        <div className='max-w-sm'>
                          <p className='truncate font-medium' title={item.applicationName}>
                            {item.applicationName}
                          </p>
                          <p className='mt-1 truncate text-xs text-muted-foreground' title={item.planName ?? undefined}>
                            {item.planName ?? t('departmentSoftware.allPlans')}
                          </p>
                          <p className='mt-2 whitespace-pre-wrap text-sm [overflow-wrap:anywhere]'>{item.reason}</p>
                        </div>
                      )
                    },
                    {
                      key: 'state',
                      label: t('departmentSoftware.state'),
                      render: (item) => (
                        <span
                          className={`text-sm font-medium ${item.state === PROPOSAL_STATE.REJECTED ? 'text-danger-ink' : item.state === PROPOSAL_STATE.ACCEPTED ? 'text-success-ink' : 'text-muted-foreground'}`}
                        >
                          {t(`departmentSoftware.${proposalStateLabels[item.state]}`, { defaultValue: t('unknown') })}
                        </span>
                      )
                    },
                    {
                      key: 'feedback',
                      label: t('departmentSoftware.decisionReason'),
                      render: (item) => (
                        <div className='max-w-sm text-sm'>
                          <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{item.decisionReason ?? '—'}</p>
                          {item.decidedAt && (
                            <p className='mt-2 text-right font-mono text-xs tabular-nums'>
                              {formatDate(item.decidedAt)}
                            </p>
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'date',
                      label: t('departmentSoftware.proposedAt'),
                      align: 'right',
                      render: (item) => formatDate(item.proposedAt)
                    }
                  ]}
                />
                <ManagerPagination
                  pagination={proposed.pagination}
                  onPage={changePage}
                  busy={proposalList.isFetching}
                />
              </>
            )}
          </>
        ) : (
          <>
            <ManagerQueryState query={list} empty={!data?.items.length} emptyTitle={t('departmentSoftware.empty')} />
            {data && (
              <>
                <ManagerDataTable
                  label={t('departmentSoftware.department')}
                  items={data.items}
                  rowKey={(item) => item.entryId}
                  columns={[
                    {
                      key: 'application',
                      label: t('departmentSoftware.department'),
                      render: (item) => (
                        <div className='max-w-sm'>
                          <p className='truncate font-medium' title={item.applicationName}>
                            {item.applicationName}
                          </p>
                          <p className='mt-1 truncate text-xs text-muted-foreground' title={item.planName ?? undefined}>
                            {item.planName ?? t('departmentSoftware.allPlans')}
                          </p>
                        </div>
                      )
                    },
                    {
                      key: 'note',
                      label: t('departmentSoftware.note'),
                      render: (item) => (
                        <p className='max-w-prose whitespace-pre-wrap text-sm [overflow-wrap:anywhere]'>
                          {item.note ?? '—'}
                        </p>
                      )
                    },
                    {
                      key: 'date',
                      label: t('departmentSoftware.addedAt'),
                      align: 'right',
                      render: (item) => formatDate(item.addedAt)
                    }
                  ]}
                />
                <ManagerPagination pagination={data.pagination} onPage={changePage} busy={list.isFetching} />
              </>
            )}
          </>
        )}
      </ManagerSection>
      {creating && <ManagerSoftwareProposalForm departmentId={departmentId} onClose={() => setCreating(false)} />}
    </>
  )
}
