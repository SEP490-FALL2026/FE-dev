import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { usePolicyGet } from '~/shared/api/generated/operations/policies/policy-get'
import { usePolicyVersionList } from '~/shared/api/generated/operations/policies/policy-version-list'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useDashboardFormat } from '../../../dashboard-ui'
import { usePolicyPresentation } from '../hooks/use-policy-presentation'

export function PolicyDetailDialog({ code, onClose }: { code: string; onClose: () => void }) {
  const { t } = useTranslation('admin')
  const { formatDate } = useDashboardFormat()
  const { policyName, stepName, roleName } = usePolicyPresentation()
  const [params, setParams] = useSearchParams()
  const selectedVersion = Number(params.get('policyVersion')) || undefined
  const historyPage = Math.max(1, Number(params.get('policyHistoryPage')) || 1)
  const query = usePolicyGet(code, selectedVersion ? { version: selectedVersion } : undefined)
  const versionsQuery = usePolicyVersionList(code, { page: historyPage, pageSize: 20 })
  const policy = query.data?.data
  const update = (key: string, value: number) =>
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set(key, String(value))
      return next
    })
  return (
    <section className='mx-auto max-w-5xl space-y-6'>
      <button type='button' className={adminButtonClass} onClick={onClose}>
        {t('policies.back')}
      </button>
      <header className='space-y-2'>
        <h1 className='text-2xl font-semibold'>{policyName(code, policy?.title)}</h1>
      </header>
      <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
        <h2 className='font-semibold'>{t('policies.versionHistory')}</h2>
        <p className='text-sm text-muted-foreground'>{t('policies.versionHelp')}</p>
        <AdminQueryState query={versionsQuery}>
          <div className='flex flex-wrap gap-2'>
            {versionsQuery.data?.data?.items.map((version) => (
              <button
                key={version.versionNumber}
                type='button'
                className={adminButtonClass}
                aria-pressed={(selectedVersion ?? policy?.versionNumber) === version.versionNumber}
                onClick={() => update('policyVersion', version.versionNumber)}
              >
                {t('policies.versionNumber', { version: version.versionNumber })}
              </button>
            ))}
          </div>
          {!versionsQuery.data?.data?.items.length && (
            <p className='text-sm text-muted-foreground'>{t('policies.noVersions')}</p>
          )}
          <AdminPagination
            pagination={versionsQuery.data?.data?.pagination}
            onPageChange={(page) => update('policyHistoryPage', page)}
          />
        </AdminQueryState>
      </section>
      <AdminQueryState query={query}>
        {policy && (
          <article className='space-y-6 rounded-lg border border-border bg-surface p-5'>
            <section>
              <h2 className='font-semibold'>{t('policies.titleLabel')}</h2>
              <p className='mt-2 text-sm'>{policy.title}</p>
            </section>
            <dl className='grid gap-3 text-sm sm:grid-cols-3'>
              <div>
                <dt className='text-muted-foreground'>{t('policies.version')}</dt>
                <dd>{t('policies.versionNumber', { version: policy.versionNumber })}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{t('policies.publishedAt')}</dt>
                <dd>{formatDate(policy.publishedAt)}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{t('policies.applicableRoles')}</dt>
                <dd>{policy.applicableRoles.map(roleName).join(', ') || t('none')}</dd>
              </div>
            </dl>
            <section>
              <h2 className='font-semibold'>{t('policies.changeNote')}</h2>
              <p className='mt-2 whitespace-pre-wrap text-sm'>{policy.changeNote}</p>
            </section>
            <section className='space-y-4'>
              <h2 className='font-semibold'>{t('policies.sections')}</h2>
              {policy.content.sections.map((section, index) => (
                <section key={index} className='space-y-2'>
                  <h3 className='font-medium'>{section.heading}</h3>
                  <p className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>{section.body}</p>
                </section>
              ))}
            </section>
            {!!policy.content.steps.length && (
              <section className='space-y-4'>
                <h2 className='font-semibold'>{t('policies.steps')}</h2>
                {policy.content.steps.map((step) => (
                  <section key={step.code} className='space-y-3 rounded-md bg-surface-subtle p-4'>
                    <h3 className='font-medium'>{stepName(step.code)}</h3>
                    <p className='text-sm text-muted-foreground'>{step.title}</p>
                    <ul className='space-y-3'>
                      {step.checklist.map((item) => (
                        <li key={item.code} className='space-y-1 text-sm'>
                          <p>{item.text}</p>
                          <p className='text-xs text-muted-foreground'>
                            {t(item.check === 'SYSTEM' ? 'policies.systemCheck' : 'policies.personCheck')}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </section>
            )}
          </article>
        )}
      </AdminQueryState>
    </section>
  )
}
