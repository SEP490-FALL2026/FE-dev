import { ArrowLeft, Boxes, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentToolsInUse } from '~/shared/api/generated/operations/departments/department-tools-in-use'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerButton, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { ManagerReturnForm } from '../components/manager-return-form'
import { useDepartmentToolSearch } from '../hooks/use-department-search'
import type { ManagerTabKey } from '../../enums'

interface Props {
  departmentId?: string
  id: string
  onBack: () => void
  onReturnCreated?: (id: string) => void
  onSelectTab?: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerLiveToolDetail({ departmentId, id, onBack, onReturnCreated }: Props) {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const [isReturning, setIsReturning] = useState(false)

  const pagedQuery = useDepartmentToolsInUse(
    departmentId ?? '',
    { pageSize: 100 },
    { query: { enabled: !!departmentId } }
  )
  const searchQuery = useDepartmentToolSearch(departmentId ?? '', !!departmentId)

  const assignment =
    pagedQuery.data?.data?.items?.find((item) => item.assignmentId === id) ??
    searchQuery.data?.find((item) => item.assignmentId === id)

  const isPending = (pagedQuery.isPending || !pagedQuery.data) && (searchQuery.isPending || !searchQuery.data)

  return (
    <div className='space-y-6'>
      {/* Top Header with Back button and Primary Action */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={onBack}
            aria-label={translate('toolDetail.backToTools')}
            className='grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition hover:border-primary hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary'
          >
            <ArrowLeft strokeWidth={1.5} className='size-5' />
          </button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground'>
              {assignment ? assignment.application.name : translate('toolDetail.title')}
            </h1>
            <p className='text-xs text-muted-foreground'>
              {assignment ? assignment.plan.name : translate('toolDetail.subtitle')}
            </p>
          </div>
        </div>

        {assignment && !assignment.terminating && (
          <ManagerButton onClick={() => setIsReturning(true)}>
            <Undo2 aria-hidden='true' strokeWidth={1.5} className='size-4' />
            {translate('initiateReturn')}
          </ManagerButton>
        )}
      </div>

      {isPending && (
        <ManagerSection>
          <p role='status' className='py-8 text-center text-sm text-muted-foreground'>
            {translate('loading')}
          </p>
        </ManagerSection>
      )}

      {!isPending && !assignment && (
        <ManagerSection>
          <WorkspaceEmptyState
            icon={Boxes}
            title={translate('toolDetail.notFound')}
            description={translate('toolDetail.notFoundHint')}
          />
          <div className='mt-6 flex justify-center'>
            <ManagerButton onClick={onBack}>{translate('toolDetail.backToTools')}</ManagerButton>
          </div>
        </ManagerSection>
      )}

      {assignment && (
        <div className='space-y-5'>
          {/* Overview summary card */}
          <ManagerSection>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='flex min-w-0 items-center gap-4'>
                <span
                  aria-hidden='true'
                  className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
                >
                  <Boxes strokeWidth={1.5} className='size-6' />
                </span>
                <div className='min-w-0'>
                  <h2 className='truncate text-lg font-bold text-foreground' title={assignment.application.name}>
                    {assignment.application.name}
                  </h2>
                  <p className='mt-0.5 truncate text-xs text-muted-foreground' title={assignment.plan.name}>
                    {assignment.plan.name}
                  </p>
                </div>
              </div>

              <div>
                {assignment.terminating ? (
                  <span className='inline-flex items-center gap-1.5 rounded-md border border-warning/25 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning-ink'>
                    <span aria-hidden='true' className='size-1.5 rounded-full bg-current' />
                    {translate('terminatingUsage', {
                      date: assignment.terminatingUntil ? formatDate(assignment.terminatingUntil) : ''
                    })}
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-1.5 rounded-md border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-medium text-success-ink'>
                    <span aria-hidden='true' className='size-1.5 rounded-full bg-current' />
                    {translate('activeUsage')}
                  </span>
                )}
              </div>
            </div>
          </ManagerSection>

          {/* Detailed Info Grid */}
          <div className='grid gap-6 lg:grid-cols-2'>
            {/* License & Assignment Details */}
            <ManagerSection>
              <h3 className='border-b border-border/50 pb-3 text-sm font-bold text-foreground'>
                {translate('toolDetail.licenseInfo')}
              </h3>
              <dl className='mt-4 space-y-3.5 text-sm'>
                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('application')}</dt>
                  <dd className='mt-1 font-medium text-foreground'>{assignment.application.name}</dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('plan')}</dt>
                  <dd className='mt-1 text-foreground'>{assignment.plan.name}</dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('toolDetail.assignmentKind')}</dt>
                  <dd className='mt-1'>
                    <ManagerStatus value={assignment.kind} />
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('toolDetail.assignmentSource')}</dt>
                  <dd className='mt-1'>
                    <ManagerStatus value={assignment.source} />
                  </dd>
                </div>

                <div className='pb-1'>
                  <dt className='text-xs text-muted-foreground'>{translate('toolDetail.effectiveFrom')}</dt>
                  <dd className='mt-1 font-mono text-xs tabular-nums text-foreground'>
                    {assignment.effectiveFromLabel ?? formatDate(assignment.effectiveFrom)}
                  </dd>
                </div>
              </dl>
            </ManagerSection>

            {/* Holder & Revocation Actions */}
            <div className='space-y-5'>
              {/* Holder Info */}
              <ManagerSection>
                <h3 className='border-b border-border/50 pb-3 text-sm font-bold text-foreground'>
                  {translate('toolDetail.holderInfo')}
                </h3>
                <dl className='mt-4 space-y-3.5 text-sm'>
                  <div className='border-b border-border/40 pb-3'>
                    <dt className='text-xs text-muted-foreground'>{translate('employee')}</dt>
                    <dd className='mt-1 font-medium text-foreground'>{assignment.fullName}</dd>
                  </div>

                  <div className='border-b border-border/40 pb-3'>
                    <dt className='text-xs text-muted-foreground'>{translate('employeeDetail.employeeCode')}</dt>
                    <dd className='mt-1 font-mono text-xs text-foreground'>{assignment.employeeCode}</dd>
                  </div>

                  <div className='pb-1'>
                    <dt className='text-xs text-muted-foreground'>{translate('status')}</dt>
                    <dd className='mt-1'>
                      <ManagerStatus value={assignment.holderStatus} />
                    </dd>
                  </div>
                </dl>
              </ManagerSection>

              {/* Revocation & Return Section */}
              <ManagerSection>
                <h3 className='border-b border-border/50 pb-3 text-sm font-bold text-foreground'>
                  {translate('toolDetail.revocationInfo')}
                </h3>
                <div className='mt-4 space-y-4 text-sm'>
                  {assignment.terminating ? (
                    <div className='rounded-lg border border-warning/25 bg-warning/5 p-4 text-xs text-warning-ink space-y-1.5'>
                      <p className='font-semibold'>{translate('integration.alreadyRevoking')}</p>
                      {assignment.terminatingUntil && (
                        <p className='font-mono tabular-nums'>
                          {translate('terminatingUsage', { date: formatDate(assignment.terminatingUntil) })}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        {translate('toolDetail.revocationHint')}
                      </p>
                      <ManagerButton onClick={() => setIsReturning(true)}>
                        <Undo2 aria-hidden='true' strokeWidth={1.5} className='size-4' />
                        {translate('initiateReturn')}
                      </ManagerButton>
                    </>
                  )}
                </div>
              </ManagerSection>
            </div>
          </div>

          {/* Return Form Modal */}
          {isReturning && (
            <ManagerReturnForm
              assignment={assignment}
              departmentId={departmentId ?? ''}
              onClose={() => setIsReturning(false)}
              onCreated={(createdReturnId) => {
                setIsReturning(false)
                onReturnCreated?.(createdReturnId)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
