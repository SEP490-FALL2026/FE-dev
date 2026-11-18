import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { usePolicyAcknowledgementReport } from '~/shared/api/generated/operations/policies/policy-acknowledgement-report'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useDashboardFormat } from '../../../dashboard-ui'
import { usePolicyPresentation } from '../hooks/use-policy-presentation'

export function PolicyReportDialog({ code, onClose }: { code: string; onClose: () => void }) {
  const { t } = useTranslation('admin')
  const { formatDate } = useDashboardFormat()
  const { policyName } = usePolicyPresentation()
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('policyReportPage')) || 1)
  const query = usePolicyAcknowledgementReport(code, { page, pageSize: 20 })
  const report = query.data?.data
  return (
    <section className='space-y-6'>
      <button type='button' className={adminButtonClass} onClick={onClose}>
        {t('policies.back')}
      </button>
      <header className='page-banner space-y-2'>
        <h1 className='text-2xl leading-tight font-semibold tracking-tight [text-wrap:balance]'>
          {t('policies.report')}
        </h1>
        <h2 className='font-medium'>{policyName(code)}</h2>
        <p className='text-sm text-muted-foreground'>{t('policies.reportHelp')}</p>
      </header>
      <AdminQueryState query={query}>
        {report && <p className='text-sm'>{t('policies.versionNumber', { version: report.currentVersionNumber })}</p>}
        {!report?.items.length ? (
          <p className='text-sm text-muted-foreground'>{t('empty')}</p>
        ) : (
          <div className='overflow-x-auto rounded-lg border border-border bg-surface'>
            <table className='w-full text-left text-sm'>
              <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                <tr>
                  <th className='p-3'>{t('policies.employeeCode')}</th>
                  <th className='p-3'>{t('policies.fullName')}</th>
                  <th className='p-3'>{t('policies.status')}</th>
                  <th className='p-3 text-right'>{t('policies.ackVersion')}</th>
                  <th className='p-3 text-right'>{t('policies.acknowledgedAt')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {report.items.map((item) => (
                  <tr key={item.employeeId}>
                    <td className='p-3 font-mono'>{item.employeeCode}</td>
                    <td className='p-3 font-medium'>{item.fullName}</td>
                    <td className='p-3'>
                      {t(
                        item.state === 'DONE'
                          ? 'policies.stateDone'
                          : item.state === 'PENDING'
                            ? 'policies.statePending'
                            : 'unknown'
                      )}
                    </td>
                    <td className='p-3 text-right'>
                      {item.versionNumber ? t('policies.versionNumber', { version: item.versionNumber }) : t('none')}
                    </td>
                    <td className='p-3 text-right'>
                      {item.acknowledgedAt ? formatDate(item.acknowledgedAt) : t('policies.noAcknowledgement')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AdminPagination
          pagination={report?.pagination}
          onPageChange={(nextPage) =>
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('policyReportPage', String(nextPage))
              return next
            })
          }
        />
      </AdminQueryState>
    </section>
  )
}
