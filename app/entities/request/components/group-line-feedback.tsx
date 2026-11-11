import { useTranslation } from 'react-i18next'
import { groupLineReasonKey, type GroupLineFailure } from '../group-request-feedback'

export function GroupLineFeedback({
  failures,
  people
}: {
  failures: readonly GroupLineFailure[]
  people: readonly { employeeId: string; name: string; email?: string }[]
}) {
  const { t } = useTranslation('employee')
  if (!failures.length) return null
  return (
    <ul aria-label={t('requestUx.memberProblems')} aria-live='polite' className='space-y-2 text-sm'>
      {failures.map((failure) => {
        const person = people.find((item) => item.employeeId === failure.employeeId)
        return (
          <li key={failure.employeeId} className='grid min-w-0 gap-1 border-b border-border/40 py-2 sm:grid-cols-2'>
            <span className='min-w-0 break-words font-medium'>
              {person?.name ?? t('unknownMember')}
              {person?.email && (
                <span className='block break-all text-xs font-normal text-muted-foreground'>{person.email}</span>
              )}
            </span>
            <span className='text-danger-ink'>{t(groupLineReasonKey(failure.reason))}</span>
          </li>
        )
      })}
    </ul>
  )
}
