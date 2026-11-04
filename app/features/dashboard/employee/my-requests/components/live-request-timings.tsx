import { useTranslation } from 'react-i18next'
import { useAccessRequestTimingsGet } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState, EmployeeSection, EmployeeStatus } from '../../shared/components/employee-api-ui'

export function LiveRequestTimings({ id }: { id: string }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const query = useAccessRequestTimingsGet(id)
  const timings = !query.isError ? query.data?.data?.timings : undefined
  return (
    <EmployeeSection title={translate('timeline')}>
      <EmployeeQueryState query={query} empty={!timings} />
      {timings && (
        <ol className='space-y-3'>
          {Object.entries(timings.segments)
            .filter(([, segment]) => !!segment)
            .map(
              ([kind, segment]) =>
                segment && (
                  <li
                    key={kind}
                    className='relative space-y-3 border-l border-border/60 pb-3 pl-4 before:absolute before:top-2 before:-left-1 before:size-2 before:rounded-full before:bg-primary'
                  >
                    <EmployeeStatus value={kind} />
                    <p className='text-right font-mono text-xs tabular-nums'>
                      {formatDateTime(segment.startedAt)}
                      {segment.endedAt && <span className='ml-2'>{formatDateTime(segment.endedAt)}</span>}
                    </p>
                  </li>
                )
            )}
        </ol>
      )}
    </EmployeeSection>
  )
}
