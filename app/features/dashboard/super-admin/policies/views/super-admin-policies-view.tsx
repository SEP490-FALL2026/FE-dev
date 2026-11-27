import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { BookOpen, CalendarDays, ScrollText, UsersRound } from 'lucide-react'
import { getPolicyListQueryKey, usePolicyList } from '~/shared/api/generated/operations/policies/policy-list'
import { usePolicyDraftPut } from '~/shared/api/generated/operations/policies/policy-draft-put'
import { getPolicyDraftGetQueryKey } from '~/shared/api/generated/operations/policies/policy-draft-get'
import type { PolicyPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/policies'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminPageHeader, AdminSectionTitle } from '../../shared/components/admin-page-header'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { adminButtonClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { PolicyDetailDialog } from '../components/policy-detail-dialog'
import { PolicyDraftDialog } from '../components/policy-draft-dialog'
import { PolicyReportDialog } from '../components/policy-report-dialog'
import { usePolicyPresentation } from '../hooks/use-policy-presentation'

export function SuperAdminPoliciesView() {
  const { t } = useTranslation('admin')
  const { formatDate } = useDashboardFormat()
  const { policyName, roleName } = usePolicyPresentation()
  const queryClient = useQueryClient()
  const [params, setParams] = useSearchParams()
  const code = params.get('policy')
  const view = params.get('policyView')
  const page = Math.max(1, Number(params.get('policyPage')) || 1)
  const query = usePolicyList({ page, pageSize: 20 }, { query: { enabled: !code } })
  const navigate = (policy?: string, section?: string) =>
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      for (const key of ['policy', 'policyView', 'policyVersion', 'policyHistoryPage', 'policyReportPage'])
        next.delete(key)
      if (policy && section) {
        next.set('policy', policy)
        next.set('policyView', section)
      }
      return next
    })
  const feedback = useAdminMutationFeedback([getPolicyListQueryKey()])
  const create = usePolicyDraftPut({
    mutation: {
      ...feedback,
      onSuccess: async (_, variables) => {
        // A discarded draft may still be cached after its final GET returned
        // not-found. Open the newly created copy from a fresh generated GET.
        queryClient.removeQueries({ queryKey: getPolicyDraftGetQueryKey(variables.code), exact: true })
        await feedback.onSuccess()
        navigate(variables.code, 'draft')
      }
    }
  })
  const openDraft = (policy: PolicyPageResponseDtoDataItemsItem) =>
    policy.hasDraft ? navigate(policy.code, 'draft') : create.mutate({ code: policy.code, data: {} })

  if (code && view === 'detail') return <PolicyDetailDialog key={code} code={code} onClose={() => navigate()} />
  if (code && view === 'draft') return <PolicyDraftDialog key={code} code={code} onClose={() => navigate()} />
  if (code && view === 'report') return <PolicyReportDialog key={code} code={code} onClose={() => navigate()} />

  return (
    <section className='space-y-6'>
      <AdminPageHeader icon={BookOpen} title={t('policies.title')} subtitle={t('policies.description')} />
      {query.data?.data && (
        <AdminSectionTitle
          title={t('ui.policyLibrary')}
          hint={t('ui.policyCount', { count: query.data.data.pagination.totalItems })}
        />
      )}
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length ? (
          <WorkspaceEmptyState icon={ScrollText} title={t('ui.noPoliciesTitle')} />
        ) : (
          <div className='kpi-tone-grid grid gap-4 md:grid-cols-2'>
            {query.data.data.items.map((policy) => (
              <article
                key={policy.code}
                className='flex flex-col gap-4 rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)] transition-colors duration-150 hover:border-primary/30'
              >
                <div className='flex items-start gap-3'>
                  <span className='kpi-chip grid size-10 shrink-0 place-items-center rounded-lg'>
                    <ScrollText aria-hidden strokeWidth={1.5} className='size-5' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <h2 className='font-semibold text-foreground [text-wrap:balance]'>
                      {policyName(policy.code, policy.title)}
                    </h2>
                    <div className='mt-1.5 flex flex-wrap items-center gap-2 text-xs'>
                      <span className='rounded-md bg-primary-soft px-2 py-0.5 font-medium text-primary-ink'>
                        {t('policies.versionNumber', { version: policy.versionNumber })}
                      </span>
                      {policy.hasDraft && (
                        <span className='rounded-md bg-warning/15 px-2 py-0.5 font-medium text-warning-ink'>
                          {t('policies.draftBadge')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <dl className='grid flex-1 gap-3 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6'>
                  <div>
                    <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <CalendarDays aria-hidden strokeWidth={1.5} className='size-3.5 shrink-0' />
                      {t('policies.publishedAt')}
                    </dt>
                    <dd className='mt-0.5 font-mono tabular-nums'>{formatDate(policy.publishedAt)}</dd>
                  </div>
                  <div className='min-w-0'>
                    <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <UsersRound aria-hidden strokeWidth={1.5} className='size-3.5 shrink-0' />
                      {t('policies.applicableRoles')}
                    </dt>
                    <dd className='mt-0.5 leading-relaxed'>
                      {policy.applicableRoles.map(roleName).join(', ') || t('none')}
                    </dd>
                  </div>
                </dl>
                <div className='flex flex-wrap items-center gap-2 border-t border-border/60 pt-4'>
                  <button
                    type='button'
                    className='mr-auto inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-primary-ink transition-colors duration-150 hover:bg-primary-soft'
                    onClick={() => navigate(policy.code, 'detail')}
                  >
                    <BookOpen aria-hidden strokeWidth={1.5} className='size-4' />
                    {t('policies.viewDetails')}
                  </button>
                  <button
                    type='button'
                    className={adminButtonClass}
                    disabled={create.isPending}
                    onClick={() => openDraft(policy)}
                  >
                    {t(policy.hasDraft ? 'policies.editDraft' : 'policies.createDraft')}
                  </button>
                  <button type='button' className={adminButtonClass} onClick={() => navigate(policy.code, 'report')}>
                    {t('policies.report')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <AdminPagination
          pagination={query.data?.data?.pagination}
          onPageChange={(nextPage) =>
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('policyPage', String(nextPage))
              return next
            })
          }
        />
      </AdminQueryState>
    </section>
  )
}
