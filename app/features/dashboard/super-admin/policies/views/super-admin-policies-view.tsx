import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { getPolicyListQueryKey, usePolicyList } from '~/shared/api/generated/operations/policies/policy-list'
import { usePolicyDraftPut } from '~/shared/api/generated/operations/policies/policy-draft-put'
import { getPolicyDraftGetQueryKey } from '~/shared/api/generated/operations/policies/policy-draft-get'
import type { PolicyPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/policies'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
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
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold text-foreground'>{t('policies.title')}</h1>
        <p className='text-sm text-muted-foreground'>{t('policies.description')}</p>
      </header>
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length ? (
          <p className='text-sm text-muted-foreground'>{t('empty')}</p>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {query.data.data.items.map((policy) => (
              <article key={policy.code} className='space-y-4 rounded-lg border border-border bg-surface p-5'>
                <div className='flex items-start justify-between gap-3'>
                  <h2 className='font-semibold text-foreground'>{policyName(policy.code, policy.title)}</h2>
                  {policy.hasDraft && (
                    <span className='shrink-0 text-xs text-muted-foreground'>{t('policies.draftBadge')}</span>
                  )}
                </div>
                <dl className='space-y-2 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>{t('policies.version')}</dt>
                    <dd>{t('policies.versionNumber', { version: policy.versionNumber })}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('policies.applicableRoles')}</dt>
                    <dd>{policy.applicableRoles.map(roleName).join(', ') || t('none')}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('policies.publishedAt')}</dt>
                    <dd>{formatDate(policy.publishedAt)}</dd>
                  </div>
                </dl>
                <div className='flex flex-wrap gap-2 border-t border-border pt-4'>
                  <button type='button' className={adminButtonClass} onClick={() => navigate(policy.code, 'detail')}>
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
