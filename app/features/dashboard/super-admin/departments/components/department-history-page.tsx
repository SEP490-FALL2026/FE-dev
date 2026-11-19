import { useTranslation } from 'react-i18next'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model/departments'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass } from '../../shared/components/admin-form'

export function DepartmentHistoryPage({
  department,
  onClose
}: {
  department: NonNullable<DepartmentResponseDtoData>
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const { formatDate } = useDashboardFormat()
  return (
    <section className='space-y-5'>
      <button type='button' className={adminButtonClass} onClick={onClose}>
        {translate('viewDetails')}
      </button>
      <header>
        <h1 className='text-2xl font-semibold'>{translate('headHistory')}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>{department.name}</p>
      </header>
      <div className='divide-y divide-border rounded-lg border border-border bg-surface px-5'>
        {department.headHistory.map((head) => (
          <article
            key={`${head.employeeId}-${head.validFrom}`}
            className='flex flex-wrap items-center justify-between gap-4 py-4'
          >
            <p className='font-medium'>{head.fullName}</p>
            <p className='text-right font-mono text-sm tabular-nums'>
              {formatDate(head.validFrom)} — {head.validTo ? formatDate(head.validTo) : translate('ongoing')}
            </p>
          </article>
        ))}
      </div>
      {department.headHistoryHasMore && <p className='text-sm text-muted-foreground'>{translate('historyLimited')}</p>}
    </section>
  )
}
