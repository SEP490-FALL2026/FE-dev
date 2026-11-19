import { useTranslation } from 'react-i18next'
import type { OffboardingRightPageResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'

export function OffboardingRightContext({
  right
}: {
  right: OffboardingRightPageResponseDtoDataItemsItem
  caseId: string
  authorized: boolean
}) {
  const { t: translate } = useTranslation('itOffboarding')
  const { formatDate } = useDashboardFormat()
  return (
    <div className='space-y-1 text-sm'>
      {right.revocationNote && <p className='break-words'>{right.revocationNote}</p>}
      {right.accessRunsOnUntil && (
        <p>{translate('rightContext.accessRunsOnUntil', { date: formatDate(right.accessRunsOnUntil) })}</p>
      )}
    </div>
  )
}
